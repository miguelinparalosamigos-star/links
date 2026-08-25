import { getStore } from '@netlify/blobs';

// =====================================================================
// ARCHIVO DE ARTÍCULOS RENDERIZADO EN EL SERVIDOR
// =====================================================================
// Se sirve en /archivo.html gracias a la redirección (con force) de
// netlify.toml. El fichero estático archivo.html sigue en el repositorio
// como respaldo: si algún día se quita esa redirección, vuelve a servirse
// él y la página sigue funcionando (aunque pintada con JavaScript).
//
// Por qué se ha hecho así: la versión con JavaScript pintaba la lista en
// el navegador, de modo que en el HTML que ve Google no había ni un solo
// enlace a los artículos. Cientos de artículos dependían únicamente del
// sitemap. Aquí los enlaces van dentro del HTML, paginados de 30 en 30,
// con enlaces reales de "anterior" y "siguiente" que se pueden rastrear.
//
// Coste: la respuesta se cachea en el CDN de Netlify (durable, 1 día), así
// que la función apenas se ejecuta aunque la página reciba visitas.

const POR_PAGINA = 30;

function escapeHtml(t) {
  return String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

function fechaLarga(iso) {
  const s = String(iso || '').slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return '';
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}`;
}

const ESTILO = `
  :root { --paper:#EEEDE6; --surface:#FFFFFF; --ink:#211F2E; --ink-soft:#625C70; --border:#DDD7CB; --accent:#4A3B78; --stamp:#B5541D; --font-display:'Lora',Georgia,serif; --font-body:'Work Sans',system-ui,sans-serif; --font-mono:'Space Mono','Courier New',monospace; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:var(--font-body); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
  a { color:inherit; }
  :focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
  .site-header { border-bottom:1px solid var(--border); padding:2rem 1.5rem 1.5rem; text-align:center; }
  .logo { font-family:var(--font-display); font-weight:700; font-size:1.7rem; color:var(--ink); text-decoration:none; }
  .logo em { color:var(--accent); font-style:normal; }
  main { max-width:680px; margin:0 auto; padding:2.5rem 1.5rem 1.5rem; }
  .back-link { font-size:0.9rem; color:var(--ink-soft); text-decoration:none; display:inline-block; margin-bottom:1.5rem; }
  .back-link:hover { text-decoration:underline; }
  h1 { font-family:var(--font-display); font-size:1.9rem; font-weight:700; line-height:1.25; margin:0 0 0.6rem; }
  .lede { color:var(--ink-soft); font-size:1rem; line-height:1.65; margin:0 0 1.4rem; }
  .contador { font-family:var(--font-mono); font-size:0.72rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-soft); margin:0 0 1.4rem; }
  .lista { list-style:none; margin:0; padding:0; }
  .item { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:1.05rem 1.2rem; margin:0 0 0.7rem; }
  .item a { display:block; text-decoration:none; font-family:var(--font-display); font-weight:600; font-size:1.08rem; line-height:1.4; color:var(--ink); }
  .item a:hover { color:var(--accent); text-decoration:underline; }
  .item .fecha { display:block; font-family:var(--font-mono); font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-soft); margin:0 0 0.35rem; }
  .item .teaser { margin:0.45rem 0 0; font-size:0.92rem; line-height:1.6; color:var(--ink-soft); }
  .paginacion { display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; justify-content:space-between; margin:1.8rem 0 0; }
  .paginacion a { text-decoration:none; font-weight:600; font-size:0.92rem; padding:0.6rem 1.1rem; border-radius:9px; border:1.5px solid var(--border); background:var(--surface); color:var(--ink); }
  .paginacion a:hover { border-color:var(--accent); color:var(--accent); }
  .paginacion .donde { font-family:var(--font-mono); font-size:0.75rem; color:var(--ink-soft); }
  .paginas-num { display:flex; flex-wrap:wrap; gap:0.35rem; margin:1rem 0 0; }
  .paginas-num a, .paginas-num span { font-family:var(--font-mono); font-size:0.8rem; text-decoration:none; padding:0.32rem 0.6rem; border-radius:7px; border:1px solid var(--border); background:var(--surface); color:var(--ink-soft); }
  .paginas-num span { background:var(--accent); border-color:var(--accent); color:#fff; font-weight:700; }
  .guia-cta { margin-top:1.6rem; padding:1.3rem 1.4rem; background:#ECE8F5; border:1px solid #d8d0ec; border-radius:12px; text-align:center; }
  .guia-cta .guia-cta-titulo { font-family:var(--font-display); font-weight:600; font-size:1.15rem; margin:0 0 0.4rem; }
  .guia-cta p { color:#3d3357; font-size:0.9rem; margin:0 0 0.9rem; line-height:1.6; }
  .guia-cta-btn { display:inline-block; text-decoration:none; font-weight:600; font-size:0.95rem; padding:0.7rem 1.3rem; border-radius:9px; background:var(--accent); color:#fff; }
  .guia-cta-btn:hover { background:#3a2e63; }
  .consulta-cta { margin-top:1.1rem; padding:1.3rem 1.4rem; background:#FBF4F5; border:1px solid #E7D3D6; border-radius:12px; text-align:center; }
  .consulta-cta .consulta-tit { font-family:var(--font-display); font-weight:600; font-size:1.1rem; margin:0 0 0.4rem; }
  .consulta-cta p { color:var(--ink-soft); font-size:0.9rem; line-height:1.6; margin:0 0 0.9rem; }
  .consulta-cta .consulta-btn { display:inline-block; text-decoration:none; font-weight:600; font-size:0.93rem; padding:0.65rem 1.15rem; border-radius:9px; background:#8C3B4A; color:#fff; }
  .consulta-cta .consulta-btn:hover { background:#75303d; }
  .site-footer { border-top:1px solid var(--border); padding:1.75rem 1.5rem 2.5rem; text-align:center; color:var(--ink-soft); font-size:0.82rem; margin-top:2.5rem; }
  .site-footer p { margin:0 0 0.5rem; }
  .status-msg { text-align:center; color:var(--ink-soft); }
  @media (max-width:520px) { h1 { font-size:1.55rem; } }
`;

function cabeza({ titulo, descripcion, canonica, robots, prev, next }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(titulo)}</title>
<meta name="description" content="${escapeHtml(descripcion)}">
${robots ? `<meta name="robots" content="${robots}">\n` : ''}<link rel="canonical" href="${canonica}">
${prev ? `<link rel="prev" href="${prev}">\n` : ''}${next ? `<link rel="next" href="${next}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(titulo)}">
<meta property="og:description" content="${escapeHtml(descripcion)}">
<meta property="og:url" content="${canonica}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700&family=Work+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${ESTILO}</style>
</head>
<body>
<header class="site-header"><a href="/" class="logo">psico<em>links</em></a></header>`;
}

const PIE = `<footer class="site-footer">
  <p>Psicolinks es divulgación y psicoeducación; no sustituye una consulta profesional.</p>
  <p>© 2026 Psicolinks · <a href="/">Portada</a> · <a href="/temas.html">Guías</a> · <a href="https://concienciaconductual.com" target="_blank" rel="noopener">Consulta de psicología</a></p>
  <p><a href="/test-de-ansiedad.html">🧪 Test de ansiedad</a> · <a href="/test-de-depresion.html">Test de depresión</a> · Consulta de psicología: <a href="https://concienciaconductual.com" target="_blank" rel="noopener">Conciencia Conductual</a></p>
</footer>
<script src="/cookies-psicolinks.js" defer></script>
</body>
</html>`;

function paginaHtml({ base, posts, pagina, paginas, total }) {
  const canonica = pagina === 1 ? `${base}/archivo.html` : `${base}/archivo.html?p=${pagina}`;
  const prev = pagina > 1 ? (pagina === 2 ? `${base}/archivo.html` : `${base}/archivo.html?p=${pagina - 1}`) : null;
  const next = pagina < paginas ? `${base}/archivo.html?p=${pagina + 1}` : null;

  const titulo = pagina === 1
    ? 'Todos los estudios publicados · Psicolinks'
    : `Estudios publicados · página ${pagina} · Psicolinks`;
  const descripcion = pagina === 1
    ? 'Archivo completo de Psicolinks: cada estudio de psicología que hemos resumido, del más reciente al más antiguo, con su fecha y su resumen.'
    : `Página ${pagina} del archivo de estudios de psicología resumidos en Psicolinks, del más reciente al más antiguo.`;

  const items = posts.map((p) => {
    const ruta = `/articulo/${slugify(p.titulo)}/${encodeURIComponent(p.id)}`;
    const f = fechaLarga(p.fechaPublicacion || p.fecha);
    const teaser = (p.teaser || '').trim();
    return `  <li class="item">
    <a href="${ruta}">${f ? `<span class="fecha">${escapeHtml(f)}</span>` : ''}${escapeHtml(p.titulo)}</a>
    ${teaser ? `<p class="teaser">${escapeHtml(teaser)}</p>` : ''}
  </li>`;
  }).join('\n');

  // Números de página: siempre la 1, la última y una ventana alrededor de la actual.
  const nums = [];
  for (let i = 1; i <= paginas; i++) {
    if (i === 1 || i === paginas || Math.abs(i - pagina) <= 2) nums.push(i);
  }
  let numHtml = '', anterior = 0;
  for (const i of nums) {
    if (anterior && i - anterior > 1) numHtml += '<span style="background:none;border:none;color:var(--ink-soft);">…</span>';
    numHtml += i === pagina
      ? `<span aria-current="page">${i}</span>`
      : `<a href="${i === 1 ? '/archivo.html' : `/archivo.html?p=${i}`}">${i}</a>`;
    anterior = i;
  }

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Archivo de estudios de Psicolinks',
    description: descripcion,
    url: canonica,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', name: 'Psicolinks', url: `${base}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: (pagina - 1) * POR_PAGINA + i + 1,
        url: `${base}/articulo/${slugify(p.titulo)}/${encodeURIComponent(p.id)}`,
        name: p.titulo,
      })),
    },
  };
  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Psicolinks', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Archivo de estudios', item: `${base}/archivo.html` },
    ],
  };

  return `${cabeza({ titulo, descripcion, canonica, robots: null, prev, next })}
<main>
  <a class="back-link" href="/">← Volver a la portada</a>
  <h1>Todos los estudios publicados</h1>
  <p class="lede">Cada día laborable resumimos tres estudios de psicología recientes. Aquí están todos, del más nuevo al más antiguo.</p>
  <p class="contador">${total} artículo${total === 1 ? '' : 's'} · página ${pagina} de ${paginas}</p>

  <ul class="lista">
${items}
  </ul>

  <nav class="paginacion" aria-label="Paginación del archivo">
    ${prev ? `<a href="${pagina === 2 ? '/archivo.html' : `/archivo.html?p=${pagina - 1}`}" rel="prev">← Más recientes</a>` : '<span></span>'}
    <span class="donde">página ${pagina} de ${paginas}</span>
    ${next ? `<a href="/archivo.html?p=${pagina + 1}" rel="next">Más antiguos →</a>` : '<span></span>'}
  </nav>
  <nav class="paginas-num" aria-label="Ir a una página">${numHtml}</nav>

  <div class="guia-cta">
    <p class="guia-cta-titulo">¿Buscas algo práctico, no un estudio?</p>
    <p>Las guías de Psicolinks son gratuitas y van al grano: sueño, ansiedad, ánimo, pareja, trabajo, hábitos y familia.</p>
    <a class="guia-cta-btn" href="/temas.html">Ver las guías →</a>
  </div>

  <div class="consulta-cta">
    <p class="consulta-tit">¿Y si esto que lees te está pasando a ti?</p>
    <p>Soy Miguel Martínez, psicólogo colegiado nº CV17649. Trabajo online para toda España y presencial en Valencia.</p>
    <a class="consulta-btn" href="/terapia-online.html">Cómo trabajo y cómo pedir cita →</a>
  </div>
</main>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(migas)}</script>
${PIE}`;
}

function paginaError(mensaje) {
  return `${cabeza({
    titulo: 'Archivo · Psicolinks',
    descripcion: 'Archivo de estudios de Psicolinks.',
    canonica: 'https://psicolinks.com/archivo.html',
    robots: 'noindex',
    prev: null, next: null,
  })}
<main>
  <p class="status-msg">${escapeHtml(mensaje)}</p>
  <p style="text-align:center;"><a class="guia-cta-btn" href="/">← Volver a la portada</a></p>
</main>
${PIE}`;
}

export default async (req) => {
  const url = new URL(req.url);
  const host = req.headers.get('host') || 'psicolinks.com';
  const base = `https://${host}`;

  const htmlHeaders = { 'content-type': 'text/html; charset=utf-8' };
  const htmlHeadersOk = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'public, max-age=600',
    // El archivo solo cambia cuando se publica (días laborables por la mañana).
    // Con esto la función casi no se ejecuta: el CDN sirve la copia guardada.
    'netlify-cdn-cache-control': 'public, durable, s-maxage=43200, stale-while-revalidate=604800',
  };

  try {
    const store = getStore('posts');
    const { blobs } = await store.list();

    const posts = [];
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item && item.id) posts.push(item);
    }
    posts.sort((a, b) =>
      (b.fechaPublicacion || b.fecha || '').localeCompare(a.fechaPublicacion || a.fecha || '')
    );

    const total = posts.length;
    if (!total) {
      return new Response(paginaError('Todavía no hay artículos publicados.'), { status: 200, headers: htmlHeaders });
    }

    const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    let pagina = parseInt(url.searchParams.get('p') || '1', 10);
    if (!Number.isFinite(pagina) || pagina < 1) pagina = 1;
    if (pagina > paginas) pagina = paginas;

    const trozo = posts.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
    return new Response(paginaHtml({ base, posts: trozo, pagina, paginas, total }), {
      status: 200, headers: htmlHeadersOk,
    });
  } catch (err) {
    console.error('archivo: error interno:', err);
    return new Response(paginaError('No se ha podido cargar el archivo ahora mismo.'), { status: 500, headers: htmlHeaders });
  }
};
