import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/review-draft
// Header requerido: X-Admin-Passphrase
// Body JSON: { id: string, accion: 'publicar' | 'descartar' }
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('review-draft: falta configurar ADMIN_PASSPHRASE en Netlify');
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

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { id, accion } = body || {};
  if (!id || !['publicar', 'descartar'].includes(accion)) {
    return new Response(JSON.stringify({ error: 'Parámetros inválidos: se requiere id y accion (publicar|descartar)' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const drafts = getStore('borradores');
    const draft = await drafts.get(id, { type: 'json' });

    if (!draft) {
      return new Response(JSON.stringify({ error: 'Borrador no encontrado (puede que ya se haya revisado)' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (accion === 'publicar') {
      const posts = getStore('posts');
      await posts.setJSON(id, {
        ...draft,
        fechaPublicacion: new Date().toISOString(),
      });
    }

    await drafts.delete(id);

    return new Response(JSON.stringify({ ok: true, accion }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('review-draft: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
