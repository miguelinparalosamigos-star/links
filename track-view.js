import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/track-view (pública, sin passphrase)
// Body: { pagina: 'home' } / { pagina: 'post', id: '...' } → cuenta una vista
// Body: { clic: 'nombre-del-enlace' } → cuenta un clic (libros, consulta, whatsapp...)
// Suma 1 a un contador total, y (para vistas) 1 a un contador del día para ver tendencia.
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }

  const { pagina, id, clic } = body || {};

  try {
    const stats = getStore('estadisticas');

    if (clic) {
      const claveClic = `clic:${clic}`;
      const actualClic = await stats.get(claveClic, { type: 'json' }).catch(() => null);
      await stats.setJSON(claveClic, { total: (actualClic?.total || 0) + 1 });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (pagina !== 'home' && pagina !== 'post') {
      return new Response('Parámetro inválido', { status: 400 });
    }
    if (pagina === 'post' && !id) {
      return new Response('Falta "id" para pagina=post', { status: 400 });
    }

    const clavePagina = pagina === 'home' ? 'contador:home' : `contador:post:${id}`;
    const actual = await stats.get(clavePagina, { type: 'json' }).catch(() => null);
    await stats.setJSON(clavePagina, { total: (actual?.total || 0) + 1 });

    const hoy = new Date().toISOString().slice(0, 10);
    const claveDia = `dia:${hoy}`;
    const actualDia = await stats.get(claveDia, { type: 'json' }).catch(() => null);
    await stats.setJSON(claveDia, { total: (actualDia?.total || 0) + 1 });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('track-view: error interno:', err);
    // No pasa nada si falla el conteo: nunca debe romper la visita del usuario.
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
};
