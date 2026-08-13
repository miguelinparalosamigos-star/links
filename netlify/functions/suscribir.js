import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/suscribir  (pública, sin clave)
// Body JSON: { email, consentimiento, origen?, website? }
//  - "email": obligatorio, se guarda en minúsculas.
//  - "consentimiento": debe ser true (acepta recibir la newsletter; RGPD).
//  - "origen": opcional, de qué página/guía viene (para saber qué capta más).
//  - "website": honeypot anti-spam; si viene relleno, fingimos éxito y no guardamos.
// Los correos caen en el almacén "suscriptores". Cada email se guarda una sola vez
// (deduplicado por hash), con su fecha y origen. Miguel los consulta desde el admin.
async function hashEmail(email) {
  const data = new TextEncoder().encode(email);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

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

  // Honeypot: los bots rellenan campos ocultos. Fingimos éxito y no guardamos nada.
  if (body && typeof body.website === 'string' && body.website.trim() !== '') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const email = String(body?.email || '').trim().toLowerCase().slice(0, 160);
  const origen = String(body?.origen || '').trim().slice(0, 120);
  const consentimiento = body?.consentimiento === true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'El correo no es válido.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!consentimiento) {
    return new Response(JSON.stringify({ error: 'Necesito que aceptes recibir la newsletter.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const store = getStore('suscriptores');
    const key = await hashEmail(email);
    const existe = await store.get(key);
    if (!existe) {
      await store.setJSON(key, {
        email,
        origen,
        fecha: new Date().toISOString(),
      });
    }
    // Respondemos igual tanto si es nuevo como si ya estaba (idempotente y sin filtrar datos).
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('suscribir: error interno:', err);
    return new Response(JSON.stringify({ error: 'No se ha podido guardar. Inténtalo más tarde.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
