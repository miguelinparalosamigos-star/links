import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-consultas
// Header requerido: X-Admin-Passphrase
// Devuelve la cola privada de consultas pendientes (las que aún no has respondido).
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('list-consultas: falta configurar ADMIN_PASSPHRASE en Netlify');
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
    const store = getStore('consultas');
    const { blobs } = await store.list();

    const consultas = [];
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item) consultas.push(item);
    }

    // Más antiguas primero (para responder por orden de llegada).
    consultas.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));

    return new Response(JSON.stringify({ consultas }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('list-consultas: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
