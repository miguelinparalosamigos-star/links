import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-posts            → todos los posts
// GET /.netlify/functions/list-posts?limit=12    → solo los N más recientes
// (pública, sin passphrase)
// Devuelve: { posts: [{ id, pmid, fuente, titulo, teaser, resumen, fechaPublicacion }, ...], total }
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const url = new URL(req.url);
  const limiteParam = url.searchParams.get('limit');
  const limite = limiteParam ? parseInt(limiteParam, 10) : null;

  try {
    const store = getStore('posts');
    const { blobs } = await store.list();

    const posts = [];
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item) posts.push(item);
    }

    // Más recientes primero
    posts.sort((a, b) =>
      (b.fechaPublicacion || b.fecha || '').localeCompare(a.fechaPublicacion || a.fecha || '')
    );

    const resultado = limite && limite > 0 ? posts.slice(0, limite) : posts;

    return new Response(JSON.stringify({ posts: resultado, total: posts.length }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('list-posts: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
