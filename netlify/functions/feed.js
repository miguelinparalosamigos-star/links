import { getStore } from '@netlify/blobs';

// Mismo slug que usan la portada, el sitemap y la función "articulo".
function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

function escapar(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Convierte "2026-08-17" en la fecha con el formato que pide RSS.
function fechaRfc822(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

// Servida en /feed.xml gracias a la redirección de netlify.toml.
// Publica los últimos artículos en RSS para lectores tipo Feedly, para
// agregadores y para quien quiera seguir Psicolinks sin dar su correo.
export default async (req) => {
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const LIMITE = 30;

  let posts = [];
  try {
    const store = getStore('posts');
    const { blobs } = await store.list();
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item?.id) posts.push(item);
    }
    posts.sort((a, b) =>
      (b.fechaPublicacion || b.fecha || '').localeCompare(a.fechaPublicacion || a.fecha || '')
    );
    posts = posts.slice(0, LIMITE);
  } catch (err) {
    console.error('feed: error interno:', err);
  }

  const items = posts.map((p) => {
    const enlace = `${base}/articulo/${slugify(p.titulo)}/${encodeURIComponent(p.id)}`;
    const fecha = (p.fechaPublicacion || p.fecha || '').slice(0, 10);
    return `    <item>
      <title>${escapar(p.titulo)}</title>
      <link>${enlace}</link>
      <guid isPermaLink="true">${enlace}</guid>
      <pubDate>${fechaRfc822(fecha)}</pubDate>
      <description>${escapar(p.teaser || p.resumen || '')}</description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Psicolinks</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Cada día laborable, tres estudios de psicología recientes traducidos a un lenguaje claro, con la fuente original siempre a la vista.</description>
    <language>es-ES</language>
    <lastBuildDate>${fechaRfc822(posts[0] && (posts[0].fechaPublicacion || posts[0].fecha))}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'netlify-cdn-cache-control': 'public, durable, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
};
