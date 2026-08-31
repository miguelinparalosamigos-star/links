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
const MAX_PUBLICACIONES_POR_EJECUCION = 5;

// Remitente del boletín. La dirección tiene que ser de un dominio verificado
// en Resend (ver README: "Boletín de novedades por email") — si el dominio
// aún no está verificado, Resend rechaza el envío y solo se ve en los logs,
// sin romper nada más de esta función.
const REMITENTE_BOLETIN = 'Psicolinks <novedades@psicolinks.com>';

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
    retmax: '40', // con cinco publicaciones al día hacen falta más de veinte: si no, en pocos días todos los recientes ya están publicados y hay que tirar de OpenAlex
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

// ───────────────────────────── SEGUNDA FUENTE: OpenAlex ─────────────────────
// PubMed es una base biomédica: cubre muy bien la psicología clínica y del
// sueño, y deja fuera la social, la del trabajo, la educativa y casi todo lo
// publicado en castellano. OpenAlex sí lo cubre, es abierta y no pide clave.
//
// REGLA DE ORO DE ESTE BLOQUE: si algo falla aquí, no puede romper la
// publicación. Todo va dentro de un try/catch que devuelve [] y la función
// sigue con lo de PubMed, exactamente igual que antes de existir esto.
const OPENALEX_BASE = 'https://api.openalex.org/works';
// El correo en el parámetro `mailto` es lo que OpenAlex pide para darte la cola
// rápida. No es una clave y no es obligatorio.
const OPENALEX_MAILTO = process.env.OPENALEX_MAILTO || 'contacto@psicolinks.com';

function reconstruirAbstract(indice) {
  // OpenAlex no da el abstract en texto plano, sino un índice invertido:
  // { "palabra": [posiciones...] }. Se rehace poniendo cada palabra en su
  // sitio. Con guardas: si viene algo raro se devuelve cadena vacía y el
  // artículo se descarta, que es mejor que publicar un abstract sin sentido.
  if (!indice || typeof indice !== 'object') return '';
  const huecos = [];
  for (const [palabra, posiciones] of Object.entries(indice)) {
    if (!Array.isArray(posiciones)) continue;
    for (const p of posiciones) {
      if (typeof p === 'number' && p >= 0 && p < 5000) huecos[p] = palabra;
    }
  }
  const texto = huecos.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  // Un abstract de verdad no baja de unas cuantas palabras.
  return texto.split(' ').length >= 40 ? texto : '';
}

async function buscarEnOpenAlex(dias, cuantos) {
  try {
    const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const filtros = [
      'concepts.id:C15744967',          // Psychology
      `from_publication_date:${desde}`,
      'type:article',                   // solo artículos de revista: nada de preprints
      'has_abstract:true',
      'has_doi:true',
      'language:en|es',
    ].join(',');
    const url = `${OPENALEX_BASE}?filter=${encodeURIComponent(filtros)}` +
      `&sort=publication_date:desc&per-page=${Math.max(1, Math.min(50, cuantos * 4))}` +
      `&mailto=${encodeURIComponent(OPENALEX_MAILTO)}`;

    const res = await fetch(url, { headers: { 'User-Agent': `Psicolinks (${OPENALEX_MAILTO})` } });
    if (!res.ok) {
      console.warn(`fetch-studies: OpenAlex respondió ${res.status}; se sigue solo con PubMed`);
      return [];
    }
    const data = await res.json();
    const obras = Array.isArray(data?.results) ? data.results : [];

    const salida = [];
    for (const o of obras) {
      const abstract = reconstruirAbstract(o?.abstract_inverted_index);
      const titulo = (o?.title || o?.display_name || '').trim();
      const doi = (o?.doi || '').replace(/^https?:\/\/doi\.org\//i, '');
      const revista = o?.primary_location?.source?.display_name || '';
      if (!abstract || !titulo || !doi) continue;
      // Los artículos que además están en PubMed ya los trae la fuente
      // principal: si vienen por aquí se duplicarían con otro identificador.
      if (o?.ids?.pmid) continue;
      salida.push({
        pmid: null,
        doi,
        urlFuente: `https://doi.org/${doi}`,
        tituloOriginal: titulo,
        abstract,
        revista: revista || 'Revista científica',
        anio: (o?.publication_year || '').toString(),
      });
      if (salida.length >= cuantos) break;
    }
    return salida;
  } catch (e) {
    console.warn('fetch-studies: OpenAlex falló, se sigue solo con PubMed:', e?.message || e);
    return [];
  }
}

async function redactarConClaude(articulo) {
  const prompt = `Eres el redactor de "Psicolinks", un blog de divulgación de psicología en español (de España). Te paso el título y el abstract (en inglés o en castellano) de un estudio científico real y reciente.

Tu tarea, en español, con tono claro y cercano pero riguroso (nunca sensacionalista, nunca afirmando algo que el estudio no respalde):

1. "titulo": un titular tipo "dato curioso" que enganche sin exagerar (máx. 110 caracteres).
2. "teaser": 1-2 frases para la portada (máx. 200 caracteres).
3. "resumen": 3 párrafos cortos explicando qué se hizo, qué se encontró y qué significa en la práctica. Fiel al abstract: no inventes datos, tamaños de muestra ni cifras que no estén en el texto original.
4. Un desglose muy breve del mismo estudio, en cuatro frases cortas (máx. 60 caracteres cada una, sin punto final), fieles al abstract:
   - "pregunta": la pregunta de investigación, formulada como pregunta (ej. "¿Ayudaría la gente si se lo pedimos?").
   - "metodo": cómo se hizo el estudio, lo más resumido posible (ej. "Seis estudios, peticiones de ayuda reales").
   - "hallazgo": el resultado principal, con la cifra si el abstract la da (ej. "Subestiman la ayuda real hasta un 50%").
   - "porQue": la explicación o interpretación de por qué ocurre, si el abstract la ofrece (ej. "Sobrestiman lo incómodo que resulta pedir").
5. "tema": clasifica el estudio en UNA sola de estas categorías exactas (en minúscula, tal cual). Elige la más central; si dudas o ninguna encaja, pon "general".
   ansiedad, estado-animo, sueno, memoria, pareja, decisiones, habitos, duelo, ejercicio, personalidad, estres-trauma, atencion, adicciones, bienestar, social, crianza, alimentacion, trabajo, general

Estudio (fuente: ${articulo.revista}${articulo.anio ? ', ' + articulo.anio : ''}):
Título original: ${articulo.tituloOriginal}
Abstract: ${articulo.abstract}

Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después ni backticks de markdown, con exactamente estas claves:
{"titulo": "...", "teaser": "...", "resumen": "...", "pregunta": "...", "metodo": "...", "hallazgo": "...", "porQue": "...", "tema": "..."}`;

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

function escapeHtml(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Compone el HTML del correo con los artículos recién publicados en esta
// ejecución, y el enlace de baja personalizado para ESE suscriptor concreto.
function componerHtmlBoletin(postsNuevos, email, token) {
  const enlaceBaja = `https://psicolinks.com/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const bloquesArticulos = postsNuevos
    .map((p) => {
      const enlace = `https://psicolinks.com/post.html?id=${encodeURIComponent(p.id)}`;
      return `
        <tr><td style="padding:0 0 20px;">
          <p style="margin:0 0 6px; font-family:Georgia,serif; font-size:18px; font-weight:700; color:#211F2E;">${escapeHtml(p.titulo)}</p>
          <p style="margin:0 0 8px; font-size:14px; color:#625C70; line-height:1.5;">${escapeHtml(p.teaser)}</p>
          <a href="${enlace}" style="font-size:14px; font-weight:600; color:#4A3B78; text-decoration:none;">Leer el artículo completo →</a>
        </td></tr>`;
    })
    .join('<tr><td style="padding:0 0 20px; border-bottom:1px solid #DDD7CB;"></td></tr>');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; background:#EEEDE6; font-family:'Work Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:520px; background:#FFFFFF; border:1px solid #DDD7CB; border-radius:12px; padding:28px 24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:0 0 20px;">
        <p style="margin:0; font-family:Georgia,serif; font-size:22px; font-weight:700; color:#211F2E;">psico<em style="color:#4A3B78; font-style:normal;">links</em></p>
      </td></tr>
      ${bloquesArticulos}
      <tr><td style="padding:16px 0 0; border-top:1px solid #DDD7CB;">
        <p style="margin:0; font-size:12px; color:#625C70; line-height:1.6;">
          Recibes este correo porque te suscribiste en psicolinks.com.
          <a href="${enlaceBaja}" style="color:#625C70;">Darme de baja</a>.
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

// Manda el correo del boletín a cada suscriptor guardado en Netlify Blobs,
// avisando de los artículos recién publicados en esta misma ejecución.
// No usa el "broadcast" de Resend a propósito: cada envío es individual y
// lleva SOLO el enlace de baja de ESE suscriptor, así nadie ve el email de
// los demás ni puede darse de baja en su nombre.
async function enviarBoletin(postsNuevos) {
  if (!process.env.RESEND_API_KEY) {
    console.log('fetch-studies: RESEND_API_KEY no configurada, se omite el boletín (los artículos ya están publicados).');
    return { ok: false, motivo: 'RESEND_API_KEY no configurada' };
  }

  const suscriptoresStore = getStore('suscriptores');
  const { blobs } = await suscriptoresStore.list();

  const asunto = postsNuevos.length === 1
    ? `Nuevo en Psicolinks: ${postsNuevos[0].titulo}`
    : `${postsNuevos.length} artículos nuevos en Psicolinks`;

  let enviados = 0;
  const fallidos = [];

  for (const b of blobs) {
    const suscriptor = await suscriptoresStore.get(b.key, { type: 'json' }).catch(() => null);
    if (!suscriptor?.email || !suscriptor?.token) continue;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: REMITENTE_BOLETIN,
          to: suscriptor.email,
          subject: asunto,
          html: componerHtmlBoletin(postsNuevos, suscriptor.email, suscriptor.token),
        }),
      });
      if (!res.ok) {
        const detalle = await res.text();
        throw new Error(`Resend respondió ${res.status}: ${detalle.slice(0, 200)}`);
      }
      enviados++;
    } catch (err) {
      fallidos.push(suscriptor.email);
      console.error(`fetch-studies: fallo al enviar boletín a ${suscriptor.email}:`, err.message || err);
    }
  }

  console.log(`fetch-studies: boletín enviado a ${enviados}/${blobs.length} suscriptor(es).`);
  return { ok: true, enviados, total: blobs.length, fallidos };
}

// De entre varios candidatos recientes, elige los MÁS interesantes para
// público general (no los primeros que lleguen), puntuándolos con Claude.
// Red de seguridad total: si algo falla, devuelve los primeros — es decir,
// el comportamiento de siempre, para que nunca deje de publicar.
async function elegirMasInteresantes(articulos, cuantos) {
  if (!Array.isArray(articulos) || articulos.length <= cuantos) return articulos;
  try {
    const lista = articulos
      .map((a, i) => `${i}. ${a.tituloOriginal}\n${(a.abstract || '').slice(0, 500)}`)
      .join('\n\n');
    const prompt = `Eres el editor de un blog de divulgación de psicología en español para público general (no especialistas). Te paso ${articulos.length} estudios recientes (título y un trozo del abstract), numerados desde 0. Puntúa CADA uno del 0 al 10 según lo interesante y comprensible que sería para una persona normal curiosa por la psicología: 10 = curiosidad sorprendente y cercana a la vida diaria; 0 = muy técnico, de nicho clínico o puramente metodológico, sin gancho para el público general.

Responde ÚNICAMENTE con un JSON válido, sin texto ni backticks: {"puntuaciones":[{"i":0,"p":8},{"i":1,"p":3}, ...]} con una entrada por estudio.

${lista}`;

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
    if (!res.ok) throw new Error(`puntuación falló: ${res.status}`);
    const data = await res.json();
    const texto = ((data.content || []).find((b) => b.type === 'text') || {}).text || '';
    const parsed = JSON.parse(texto.replace(/```json|```/g, '').trim());
    const puntuaciones = Array.isArray(parsed.puntuaciones) ? parsed.puntuaciones : [];

    const ordenados = puntuaciones
      .filter((x) => typeof x.i === 'number' && articulos[x.i])
      .sort((a, b) => (b.p || 0) - (a.p || 0))
      .map((x) => articulos[x.i]);

    // Por si la IA se dejó alguno sin puntuar, se añaden al final.
    const incluidos = new Set(ordenados);
    const resto = articulos.filter((a) => !incluidos.has(a));
    const finales = [...ordenados, ...resto];

    console.log(`fetch-studies: ${articulos.length} candidatos evaluados por interés, elegidos ${cuantos}.`);
    return finales.slice(0, cuantos);
  } catch (err) {
    console.error('fetch-studies: fallo al puntuar interés, se usan los primeros:', err.message || err);
    return articulos.slice(0, cuantos);
  }
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
    const doisPublicados = new Set();   // para lo que venga de OpenAlex, que no tiene PMID
    for (const store of [posts, drafts]) {
      const { blobs } = await store.list();
      for (const b of blobs) {
        const item = await store.get(b.key, { type: 'json' });
        if (item?.pmid) pmidsExistentes.add(item.pmid);
        if (item?.doi) doisPublicados.add(item.doi);
      }
    }

    const idsRecientes = await buscarPMIDsRecientes();
    // Cogemos más candidatos de los que vamos a publicar para poder quedarnos
    // con los MÁS interesantes (no los primeros que salgan).
    // Doce candidatos para publicar cinco: se sigue descartando más de la
    // mitad. Si se bajara este número, el filtro se quedaría en nada y saldría
    // publicado casi todo lo que devuelva PubMed, incluido lo muy técnico.
    const CANDIDATOS_A_EVALUAR = 12;
    const idsNuevos = idsRecientes.filter((id) => !pmidsExistentes.has(id)).slice(0, CANDIDATOS_A_EVALUAR);
    const candidatos = await obtenerArticulos(idsNuevos);

    // OpenAlex SOLO rellena. Si PubMed ya trae candidatos de sobra, ni se le
    // pregunta; y si falla, buscarEnOpenAlex devuelve [] y esto sigue igual.
    if (candidatos.length < CANDIDATOS_A_EVALUAR) {
      const faltan = CANDIDATOS_A_EVALUAR - candidatos.length;
      const extra = await buscarEnOpenAlex(14, faltan);
      const doisExistentes = new Set([...doisPublicados]);
      const titulosVistos = new Set(candidatos.map((c) => (c.tituloOriginal || '').toLowerCase()));
      for (const a of extra) {
        if (doisExistentes.has(a.doi)) continue;
        if (titulosVistos.has((a.tituloOriginal || '').toLowerCase())) continue;
        candidatos.push(a);
      }
    }

    const articulos = await elegirMasInteresantes(candidatos, MAX_PUBLICACIONES_POR_EJECUCION);

    // Se redactan en paralelo (no en cadena) para no acercarse al límite de 30s
    // que Netlify impone a las funciones programadas.
    const resultados = await Promise.allSettled(
      articulos.map(async (articulo) => {
        const redaccion = await redactarConClaude(articulo);
        const id = `${Date.now()}-${articulo.pmid || articulo.doi.replace(/[^a-z0-9]+/gi, '-')}`;
        const ahora = new Date().toISOString();
        const post = {
          id,
          pmid: articulo.pmid || null,
          ...(articulo.doi ? { doi: articulo.doi, urlFuente: articulo.urlFuente } : {}),
          fuente: `${articulo.revista}${articulo.anio ? ' · ' + articulo.anio : ''}`,
          titulo: redaccion.titulo,
          teaser: redaccion.teaser,
          resumen: redaccion.resumen,
          tema: (redaccion.tema || 'general').toLowerCase().trim(),
          desglose: {
            pregunta: redaccion.pregunta,
            metodo: redaccion.metodo,
            hallazgo: redaccion.hallazgo,
            porQue: redaccion.porQue,
          },
          fecha: ahora,
          fechaPublicacion: ahora,
        };
        // Se escribe directo en "posts": publicación automática, sin paso de revisión.
        await posts.setJSON(id, post);
        return post;
      })
    );

    const postsPublicados = resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    const publicados = postsPublicados.length;
    resultados.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`fetch-studies: fallo con ${articulos[i]?.pmid || articulos[i]?.doi}:`, r.reason?.message || r.reason);
      }
    });

    console.log(
      `fetch-studies: ${publicados} publicación(es) nueva(s) de ${articulos.length} candidato(s) evaluados (${idsRecientes.length} encontrados en PubMed).`
    );

    // ------------------------------------------------------------------
    // EL BOLETÍN YA NO SE MANDA DESDE AQUÍ (24 de agosto de 2026).
    // Antes salía un correo cada día de publicación, de lunes a viernes.
    // Miguel lo quiere semanal y en domingo, así que el envío se ha movido
    // a `boletin-semanal.js`, que se dispara solo los domingos y reúne los
    // artículos de los últimos siete días en un único correo.
    // La función `enviarBoletin` y su plantilla se quedan aquí sin usar por
    // si algún día quisieras volver al aviso diario: bastaría con volver a
    // llamarla y desactivar el horario del boletín semanal.
    // ------------------------------------------------------------------
    const boletin = { ok: false, motivo: 'el boletín se envía los domingos desde boletin-semanal.js' };

    return new Response(JSON.stringify({ ok: true, publicados, evaluados: articulos.length, boletin }), {
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
