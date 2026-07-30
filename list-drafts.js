import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-drafts
// Header requerido: X-Admin-Passphrase
// Devuelve: { borradores: [{ id, pmid, fuente, titulo, teaser, resumen, fecha }, ...] }
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('list-drafts: falta configurar ADMIN_PASSPHRASE en Netlify');
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

  try {
    const store = getStore('borradores');
    const { blobs } = await store.list();

    const borradores = [];
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item) borradores.push(item);
    }

    // Más recientes primero
    borradores.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));

    return new Response(JSON.stringify({ borradores }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('list-drafts: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
