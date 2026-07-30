import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/subscribe (pública, sin passphrase)
// Body: { email: '...' }
// Guarda el email como suscriptor. Si ya existía, simplemente actualiza la fecha
// (no se duplica: la propia dirección de email es la clave).
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!formatoValido) {
    return new Response(JSON.stringify({ error: 'Email no válido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const suscriptores = getStore('suscriptores');
    await suscriptores.setJSON(email, { email, fecha: new Date().toISOString() });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('subscribe: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
