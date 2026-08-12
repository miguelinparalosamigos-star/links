import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/enviar-consulta  (pública, sin clave)
// Body JSON: { pregunta, nombre?, contexto?, email?, consentimiento, website? }
//  - "pregunta": obligatoria.
//  - "nombre"/"contexto": opcionales (p. ej. "María" / "29 años, Valencia").
//  - "email": opcional y PRIVADO (nunca se publica); solo por si Miguel quiere avisar.
//  - "consentimiento": debe ser true (acepta que es divulgación y puede publicarse anónima).
//  - "website": honeypot anti-spam; si viene relleno, se ignora en silencio.
// La consulta cae en el almacén "consultas" (cola privada) hasta que Miguel la revisa.
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

  const pregunta = String(body?.pregunta || '').trim();
  const nombre = String(body?.nombre || '').trim().slice(0, 60);
  const contexto = String(body?.contexto || '').trim().slice(0, 120);
  const email = String(body?.email || '').trim().toLowerCase().slice(0, 120);
  const consentimiento = body?.consentimiento === true;

  if (pregunta.length < 10 || pregunta.length > 2000) {
    return new Response(JSON.stringify({ error: 'La pregunta debe tener entre 10 y 2000 caracteres.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!consentimiento) {
    return new Response(JSON.stringify({ error: 'Necesito que marques la casilla de consentimiento.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'El correo no es válido (o déjalo en blanco).' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const store = getStore('consultas');
    const id = crypto.randomUUID();
    await store.setJSON(id, {
      id,
      nombre,
      contexto,
      pregunta,
      email,
      fecha: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('enviar-consulta: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
