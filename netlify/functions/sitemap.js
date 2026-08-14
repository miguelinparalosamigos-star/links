import { getStore } from '@netlify/blobs';

// Mismo slug que usa la función "articulo" y la portada, para que la URL del
// sitemap coincida con la real del artículo.
function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

// Servida en /sitemap.xml gracias a la redirección en netlify.toml.
// Genera la lista de páginas (portada + cada post publicado) para que
// los buscadores las encuentren, sin tener que mantener el fichero a mano.
// Páginas fijas del sitio (las que no salen de la base de datos de artículos).
// Cuando publiques una guía nueva, añade aquí su fichero — una línea — y entrará
// en el sitemap en el siguiente despliegue.
const PAGINAS_FIJAS = [
  '/',
  '/archivo.html',
  '/como-leemos-los-estudios.html',
  '/guias.html',
  '/guia-mantas-de-peso.html',
];

export default async (req) => {
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const urls = PAGINAS_FIJAS.map((ruta) => ({ loc: `${base}${ruta}` }));

  try {
    const posts = getStore('posts');
    const { blobs } = await posts.list();
    for (const b of blobs) {
      const post = await posts.get(b.key, { type: 'json' });
      if (post?.id) {
        urls.push({
          loc: `${base}/articulo/${slugify(post.titulo)}/${encodeURIComponent(post.id)}`,
          lastmod: (post.fechaPublicacion || post.fecha || '').slice(0, 10) || undefined,
        });
      }
    }
  } catch (err) {
    console.error('sitemap: error interno:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
