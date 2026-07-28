import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/get-post?id=XXXX  (pública, sin passphrase)
// Devuelve: { post: { id, pmid, fuente, titulo, teaser, resumen, fechaPublicacion } }
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el parámetro id' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const store = getStore('posts');
    const post = await store.get(id, { type: 'json' });

    if (!post) {
      return new Response(JSON.stringify({ error: 'No se ha encontrado esta publicación' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('get-post: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
