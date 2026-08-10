import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/export-suscriptores
// Header requerido: X-Admin-Passphrase (la misma clave de admin)
// Devuelve un CSV con los suscriptores (email y fecha de alta) para
// importarlo en cualquier herramienta de email (Brevo, MailerLite, etc.).
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('export-suscriptores: falta configurar ADMIN_PASSPHRASE en Netlify');
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
    const suscriptores = getStore('suscriptores');
    const { blobs } = await suscriptores.list();

    const filas = [];
    for (const b of blobs) {
      const s = await suscriptores.get(b.key, { type: 'json' }).catch(() => null);
      if (!s || !s.email) continue;
      filas.push({ email: s.email, fecha: s.fecha || '' });
    }

    // Orden por fecha de alta (más antiguos primero).
    filas.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));

    // Escapado CSV según RFC 4180 (comillas dobles si hay coma, comilla o salto).
    const esc = (v) => {
      const s = String(v == null ? '' : v);
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    const cabecera = 'email,fecha_alta';
    const cuerpo = filas.map((f) => esc(f.email) + ',' + esc(f.fecha)).join('\r\n');
    // BOM para que Excel abra bien los acentos.
    const csv = '\uFEFF' + cabecera + '\r\n' + cuerpo + (cuerpo ? '\r\n' : '');

    return new Response(csv, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="suscriptores-psicolinks.csv"',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    console.error('export-suscriptores: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
