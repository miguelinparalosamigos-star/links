import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-suscriptores
// Header requerido: X-Admin-Passphrase
// Devuelve la lista de correos suscritos a la newsletter, para que Miguel pueda
// consultarlos o exportarlos (por ejemplo, para importarlos a un proveedor de email).
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('list-suscriptores: falta configurar ADMIN_PASSPHRASE en Netlify');
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
    const store = getStore('suscriptores');
    const { blobs } = await store.list();
    const suscriptores = [];
    for (const b of blobs) {
      const s = await store.get(b.key, { type: 'json' });
      if (s?.email) suscriptores.push(s);
    }
    suscriptores.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
    return new Response(JSON.stringify({ total: suscriptores.length, suscriptores }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('list-suscriptores: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error al leer los suscriptores' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
