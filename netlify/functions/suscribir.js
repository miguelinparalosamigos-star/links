import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/suscribir  (pública, sin clave)
// Body JSON: { email, consentimiento, origen?, website? }
//  - "email": obligatorio, se guarda en minúsculas y ES LA CLAVE del registro.
//  - "consentimiento": debe ser true (acepta recibir el boletín; RGPD).
//  - "origen": opcional, de qué página viene (para saber qué capta más).
//  - "website": honeypot anti-spam; si viene relleno, fingimos éxito y no guardamos.
//
// ---------------------------------------------------------------------------
// CORREGIDO EL 24 DE AGOSTO DE 2026. Había dos fallos que hacían que quien se
// diera de alta aquí NO recibiera nunca el boletín y NO pudiera darse de baja:
//
//   1. El registro se guardaba bajo el hash SHA-256 del correo, mientras que
//      `unsubscribe.js` busca por el correo tal cual. La baja nunca encontraba
//      el registro.
//   2. No se guardaba `token`, y el envío del boletín salta a cualquier
//      suscriptor que no lo tenga. Es decir: se guardaban los correos y luego
//      no se les mandaba nada.
//
// Ahora la clave es el propio correo (igual que en `subscribe.js`, la otra
// función que ya lo hacía bien) y se genera un token de baja. Los registros
// antiguos guardados con hash los repesca el boletín semanal, que les pone
// token y los reescribe con la clave correcta.
// ---------------------------------------------------------------------------

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
    return new Response(JSON.stringify({ error: 'Necesito que aceptes recibir el boletín.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const store = getStore('suscriptores');

    // La clave es el correo. Si ya estaba, se conserva su token y su fecha de
    // alta original (no se genera un token nuevo por reenviar el formulario).
    const existente = await store.get(email, { type: 'json' }).catch(() => null);
    const token = existente?.token || crypto.randomUUID();

    await store.setJSON(email, {
      email,
      token,
      origen: existente?.origen || origen,
      consentimiento: true,
      fecha: existente?.fecha || new Date().toISOString(),
    });

    // Correo de bienvenida con el pack. Es "por si acaso": el pack ya se le ha
    // entregado en la propia página, así que si esto falla no pasa nada y no
    // se le hace esperar. Por eso no se espera al resultado ni se propaga el
    // error a la respuesta.
    enviarBienvenida(email, token).catch((err) => {
      console.error('suscribir: fallo al enviar la bienvenida (el alta sí se guardó):', err?.message || err);
    });

    // Respondemos igual tanto si es nuevo como si ya estaba (idempotente).
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

// ---------------------------------------------------------------------------
// Correo de bienvenida con el pack de cinco guías.
// Si no hay RESEND_API_KEY configurada, no hace nada y lo deja escrito en el
// log. El pack se entrega igualmente en la página, así que nadie se queda sin él.
// ---------------------------------------------------------------------------
const REMITENTE = 'Psicolinks <novedades@psicolinks.com>';
const SITIO = 'https://psicolinks.com';

const PACK = [
  ['Calmar la ansiedad', '/descargas/calmar-la-ansiedad.pdf'],
  ['Dormir mejor en 7 pasos', '/descargas/dormir-mejor-en-7-pasos.pdf'],
  ['Cuando no tienes ganas de nada', '/descargas/cuando-no-tienes-ganas-de-nada.pdf'],
  ['Deja de darle vueltas', '/descargas/deja-de-darle-vueltas.pdf'],
  ['Crear hábitos que duren', '/descargas/crear-habitos-que-duren.pdf'],
];

function escapeHtml(t) {
  return String(t || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function htmlBienvenida(email, token) {
  const baja = `${SITIO}/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const filas = PACK.map(([nombre, ruta]) => `
        <tr><td style="padding:0 0 10px;">
          <a href="${SITIO}${ruta}" style="display:block; padding:12px 14px; background:#EEEDE6; border:1px solid #DDD7CB; border-radius:9px; font-size:15px; font-weight:600; color:#211F2E; text-decoration:none;">📄 ${escapeHtml(nombre)} (PDF)</a>
        </td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; background:#EEEDE6; font-family:'Work Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:520px; background:#FFFFFF; border:1px solid #DDD7CB; border-radius:12px; padding:28px 24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:0 0 18px;">
        <p style="margin:0; font-family:Georgia,serif; font-size:22px; font-weight:700; color:#211F2E;">psico<em style="color:#4A3B78; font-style:normal;">links</em></p>
      </td></tr>
      <tr><td style="padding:0 0 14px;">
        <p style="margin:0 0 10px; font-family:Georgia,serif; font-size:20px; font-weight:700; color:#211F2E;">Aquí tienes el pack de inicio</p>
        <p style="margin:0; font-size:15px; line-height:1.6; color:#625C70;">Gracias por apuntarte. Te dejo aquí otra vez las cinco guías en PDF, para que las tengas en el correo y no dependas de haber guardado la página.</p>
      </td></tr>
      ${filas}
      <tr><td style="padding:14px 0 0;">
        <p style="margin:0; font-size:15px; line-height:1.6; color:#625C70;">A partir de ahora te escribo <strong>los domingos</strong>, con lo que haya publicado esa semana. Un correo, y si no te aporta, te borras en un clic desde abajo.</p>
        <p style="margin:14px 0 0; font-size:15px; line-height:1.6; color:#625C70;">Miguel Martínez, psicólogo · Colegiado nº CV17649</p>
      </td></tr>
      <tr><td style="padding:18px 0 0; border-top:1px solid #DDD7CB;">
        <p style="margin:14px 0 0; font-size:12px; color:#625C70; line-height:1.6;">
          Recibes este correo porque te apuntaste en psicolinks.com.
          <a href="${baja}" style="color:#625C70;">Darme de baja</a>.
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

async function enviarBienvenida(email, token) {
  if (!process.env.RESEND_API_KEY) {
    console.log('suscribir: RESEND_API_KEY no configurada, no se manda la bienvenida (el pack ya se ha entregado en la página).');
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: REMITENTE,
      to: email,
      subject: 'Tu pack de inicio de Psicolinks',
      html: htmlBienvenida(email, token),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend respondió ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  console.log(`suscribir: bienvenida enviada a ${email}`);
}
