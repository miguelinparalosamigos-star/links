import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/backfill-desglose
// Header requerido: X-Admin-Passphrase (la misma que usas en /admin.html)
//
// Función de un solo uso: recorre todos los artículos ya publicados en el
// store "posts" y, a los que les falte el campo "desglose" (los publicados
// antes de que fetch-studies.js empezara a generarlo), les genera uno nuevo
// con Claude a partir de su resumen ya guardado — sin tocar título, teaser
// ni el resto de campos. Los artículos que ya tengan desglose se dejan tal
// cual (no se vuelven a gastar tokens en ellos).
//
// Se puede lanzar a mano tantas veces como haga falta desde el panel de
// Netlify (Project > Functions > backfill-desglose > Run now) — es seguro
// repetirla, cada vez completa solo lo que aún falte.

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

function tieneDesgloseCompleto(desglose) {
  return !!(desglose && desglose.pregunta && desglose.metodo && desglose.hallazgo && desglose.porQue);
}

async function generarDesglose(post) {
  const prompt = `Eres el redactor de "Psicolinks", un blog de divulgación de psicología en español (de España). Te paso el título y el resumen ya publicado de un artículo sobre un estudio científico real.

Tu tarea: genera SOLO un desglose muy breve del estudio, en cuatro frases cortas (máx. 60 caracteres cada una, sin punto final), fieles al resumen (no inventes datos ni cifras que no estén en el texto):
- "pregunta": la pregunta de investigación, formulada como pregunta (ej. "¿Ayudaría la gente si se lo pedimos?").
- "metodo": cómo se hizo el estudio, lo más resumido posible (ej. "Seis estudios, peticiones de ayuda reales").
- "hallazgo": el resultado principal, con la cifra si el resumen la da (ej. "Subestiman la ayuda real hasta un 50%").
- "porQue": la explicación o interpretación de por qué ocurre, si el resumen la ofrece (ej. "Sobrestiman lo incómodo que resulta pedir").

Título: ${post.titulo}
Fuente: ${post.fuente || ''}
Resumen ya publicado: ${post.resumen}

Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después ni backticks de markdown, con exactamente estas claves:
{"pregunta": "...", "metodo": "...", "hallazgo": "...", "porQue": "..."}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`Anthropic API falló (${res.status}): ${detalle.slice(0, 300)}`);
  }

  const data = await res.json();
  const bloqueTexto = (data.content || []).find((b) => b.type === 'text');
  if (!bloqueTexto) throw new Error('Respuesta de Claude sin bloque de texto');

  const limpio = bloqueTexto.text.replace(/```json|```/g, '').trim();
  const desglose = JSON.parse(limpio);

  if (!desglose.pregunta || !desglose.metodo || !desglose.hallazgo || !desglose.porQue) {
    throw new Error('Respuesta de Claude incompleta (falta algún campo del desglose)');
  }
  return desglose;
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('backfill-desglose: falta configurar ADMIN_PASSPHRASE en Netlify');
    return new Response(JSON.stringify({ error: 'Servidor mal configurado' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!recibida || recibida !== clave) {
    return new Response(JSON.stringify({ error: 'Clave incorrecta' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Falta configurar ANTHROPIC_API_KEY en Netlify' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const posts = getStore('posts');
    const { blobs } = await posts.list();

    let actualizados = 0;
    let yaCompletos = 0;
    const fallidos = [];

    // En serie (no en paralelo): son pocos artículos y así evitamos saturar
    // la API de Anthropic; si hubiera muchísimos, se puede volver a lanzar
    // esta misma función varias veces, ya que no repite trabajo ya hecho.
    for (const b of blobs) {
      const post = await posts.get(b.key, { type: 'json' });
      if (!post) continue;

      if (tieneDesgloseCompleto(post.desglose)) {
        yaCompletos++;
        continue;
      }

      try {
        const desglose = await generarDesglose(post);
        await posts.setJSON(b.key, { ...post, desglose });
        actualizados++;
      } catch (err) {
        console.error(`backfill-desglose: fallo con "${post.id}":`, err.message || err);
        fallidos.push({ id: post.id, titulo: post.titulo, error: err.message || String(err) });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        total: blobs.length,
        actualizados,
        yaCompletos,
        fallidos,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (err) {
    console.error('backfill-desglose: error general:', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
