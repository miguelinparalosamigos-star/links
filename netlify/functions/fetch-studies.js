import { getStore } from '@netlify/blobs';

// Se ejecuta sola cada día laborable (lunes a viernes) a las 07:00 UTC (ver
// "config.schedule" al final del fichero). También se puede lanzar a mano desde
// el panel de Netlify ("Run now") para probarla sin esperar: Project > Functions
// > fetch-studies > Run now.
//
// MODO: publicación automática. Esta función escribe directamente en la portada
// pública (store "posts"), sin pasar por /admin.html ni esperar aprobación manual.
// admin.html y sus funciones (list-drafts/review-draft) se han dejado tal cual por
// si algún día se quiere volver al modo "revisar antes de publicar" — hoy no se usan.

const NCBI_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'; // rápido y barato, de sobra para resumir
const MAX_PUBLICACIONES_POR_EJECUCION = 3;

// Texto libre en título/abstract (no MeSH): los términos MeSH los asigna un indexador
// humano de PubMed días o semanas después de publicarse, así que exigirlos aquí dejaría
// fuera casi todo lo verdaderamente reciente. hasabstract/lang sí están disponibles desde
// el primer día. Como esto se publica sin revisión humana, este término de búsqueda es
// el único filtro de calidad real que hay — si algún día trae temas raros o escasos,
// este es el sitio para ajustarlo.
const TERMINO_BUSQUEDA =
  '(psychology[Title/Abstract] OR psychological[Title/Abstract]) AND hasabstract[text] AND english[lang]';

function limpiarXml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function buscarPMIDsRecientes() {
  const params = new URLSearchParams({
    db: 'pubmed',
    term: TERMINO_BUSQUEDA,
    retmode: 'json',
    sort: 'date',
    datetype: 'pdat',
    reldate: '14', // últimos 14 días: da margen de sobra sobre la semana (el control de duplicados evita repetir)
    retmax: '20',
  });
  if (process.env.NCBI_API_KEY) params.set('api_key', process.env.NCBI_API_KEY);

  const res = await fetch(`${NCBI_BASE}/esearch.fcgi?${params.toString()}`);
  if (!res.ok) throw new Error(`PubMed esearch falló: ${res.status}`);
  const data = await res.json();
  return data.esearchresult?.idlist || [];
}

async function obtenerArticulos(pmids) {
  if (pmids.length === 0) return [];
  const params = new URLSearchParams({
    db: 'pubmed',
    id: pmids.join(','),
    rettype: 'abstract',
    retmode: 'xml',
  });
  if (process.env.NCBI_API_KEY) params.set('api_key', process.env.NCBI_API_KEY);

  const res = await fetch(`${NCBI_BASE}/efetch.fcgi?${params.toString()}`);
  if (!res.ok) throw new Error(`PubMed efetch falló: ${res.status}`);
  const xml = await res.text();

  const articulos = [];
  const bloques = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const bloque of bloques) {
    const pmid = (bloque.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const titulo = limpiarXml((bloque.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/) || [])[1]);
    const partesAbstract = [...bloque.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map((m) =>
      limpiarXml(m[1])
    );
    const revista = limpiarXml((bloque.match(/<Title>([\s\S]*?)<\/Title>/) || [])[1]);
    // Se acota al PubDate de JournalIssue (fecha de publicación real) para no
    // "colarse" hasta un <Year> del historial de PubMed más abajo en el XML.
    const bloqueFechaPublicacion = (bloque.match(/<JournalIssue[^>]*>[\s\S]*?<PubDate>([\s\S]*?)<\/PubDate>/) || [])[1] || '';
    const anio = (bloqueFechaPublicacion.match(/<Year>(\d{4})<\/Year>/) || [])[1];

    if (pmid && titulo && partesAbstract.length > 0) {
      articulos.push({
        pmid,
        tituloOriginal: titulo,
        abstract: partesAbstract.join(' '),
        revista: revista || 'Revista científica',
        anio: anio || '',
      });
    }
  }
  return articulos;
}

async function redactarConClaude(articulo) {
  const prompt = `Eres el redactor de "Psicolinks", un blog de divulgación de psicología en español (de España). Te paso el título y el abstract (en inglés) de un estudio científico real y reciente.

Tu tarea, en español, con tono claro y cercano pero riguroso (nunca sensacionalista, nunca afirmando algo que el estudio no respalde):

1. "titulo": un titular tipo "dato curioso" que enganche sin exagerar (máx. 110 caracteres).
2. "teaser": 1-2 frases para la portada (máx. 200 caracteres).
3. "resumen": 3 párrafos cortos explicando qué se hizo, qué se encontró y qué significa en la práctica. Fiel al abstract: no inventes datos, tamaños de muestra ni cifras que no estén en el texto original.
4. Un desglose muy breve del mismo estudio, en cuatro frases cortas (máx. 60 caracteres cada una, sin punto final), fieles al abstract:
   - "pregunta": la pregunta de investigación, formulada como pregunta (ej. "¿Ayudaría la gente si se lo pedimos?").
   - "metodo": cómo se hizo el estudio, lo más resumido posible (ej. "Seis estudios, peticiones de ayuda reales").
   - "hallazgo": el resultado principal, con la cifra si el abstract la da (ej. "Subestiman la ayuda real hasta un 50%").
   - "porQue": la explicación o interpretación de por qué ocurre, si el abstract la ofrece (ej. "Sobrestiman lo incómodo que resulta pedir").

Estudio (fuente: ${articulo.revista}${articulo.anio ? ', ' + articulo.anio : ''}):
Título original: ${articulo.tituloOriginal}
Abstract: ${articulo.abstract}

Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después ni backticks de markdown, con exactamente estas claves:
{"titulo": "...", "teaser": "...", "resumen": "...", "pregunta": "...", "metodo": "...", "hallazgo": "...", "porQue": "..."}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
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
  const redaccion = JSON.parse(limpio);

  if (!redaccion.titulo || !redaccion.teaser || !redaccion.resumen) {
    throw new Error('Respuesta de Claude incompleta (faltan campos)');
  }
  if (!redaccion.pregunta || !redaccion.metodo || !redaccion.hallazgo || !redaccion.porQue) {
    throw new Error('Respuesta de Claude incompleta (falta el desglose)');
  }
  return redaccion;
}

export default async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('fetch-studies: falta configurar ANTHROPIC_API_KEY en Netlify');
    return new Response('Falta configurar ANTHROPIC_API_KEY', { status: 500 });
  }

  try {
    const posts = getStore('posts');
    const drafts = getStore('borradores'); // ya no se escribe aquí; solo se consulta por si hay restos de pruebas antiguas

    // No repetir un estudio ya publicado (ni uno que quedara de alguna prueba antigua)
    const pmidsExistentes = new Set();
    for (const store of [posts, drafts]) {
      const { blobs } = await store.list();
      for (const b of blobs) {
        const item = await store.get(b.key, { type: 'json' });
        if (item?.pmid) pmidsExistentes.add(item.pmid);
      }
    }

    const idsRecientes = await buscarPMIDsRecientes();
    const idsNuevos = idsRecientes.filter((id) => !pmidsExistentes.has(id)).slice(0, MAX_PUBLICACIONES_POR_EJECUCION);
    const articulos = await obtenerArticulos(idsNuevos);

    // Se redactan en paralelo (no en cadena) para no acercarse al límite de 30s
    // que Netlify impone a las funciones programadas.
    const resultados = await Promise.allSettled(
      articulos.map(async (articulo) => {
        const redaccion = await redactarConClaude(articulo);
        const id = `${Date.now()}-${articulo.pmid}`;
        const ahora = new Date().toISOString();
        // Se escribe directo en "posts": publicación automática, sin paso de revisión.
        await posts.setJSON(id, {
          id,
          pmid: articulo.pmid,
          fuente: `${articulo.revista}${articulo.anio ? ' · ' + articulo.anio : ''}`,
          titulo: redaccion.titulo,
          teaser: redaccion.teaser,
          resumen: redaccion.resumen,
          desglose: {
            pregunta: redaccion.pregunta,
            metodo: redaccion.metodo,
            hallazgo: redaccion.hallazgo,
            porQue: redaccion.porQue,
          },
          fecha: ahora,
          fechaPublicacion: ahora,
        });
        return articulo.pmid;
      })
    );

    const publicados = resultados.filter((r) => r.status === 'fulfilled').length;
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`fetch-studies: fallo con PMID ${articulos[i]?.pmid}:`, r.reason?.message || r.reason);
      }
    });

    console.log(
      `fetch-studies: ${publicados} publicación(es) nueva(s) de ${articulos.length} candidato(s) evaluados (${idsRecientes.length} encontrados en PubMed).`
    );

    return new Response(JSON.stringify({ ok: true, publicados, evaluados: articulos.length }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('fetch-studies: error general:', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const config = {
  schedule: '0 7 * * 1-5', // lunes a viernes, 07:00 UTC (9h en España en horario de verano)
};
