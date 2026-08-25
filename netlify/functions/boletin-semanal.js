import { getStore } from '@netlify/blobs';

// ===========================================================================
// BOLETÍN SEMANAL · SE ENVÍA SOLO LOS DOMINGOS
// ===========================================================================
// Se dispara solo, sin tocar nada, gracias a `config.schedule` del final del
// fichero: los domingos a las 08:00 UTC (las 10 en España en verano, las 9 en
// invierno). Recoge los artículos publicados en los últimos siete días y manda
// un único correo con todos.
//
// Antes esto no existía: el boletín salía desde `fetch-studies` de lunes a
// viernes, un correo por cada día de publicación. Miguel lo quería semanal y
// en domingo, así que aquello se ha desactivado y todo el envío vive aquí.
//
// PARA QUE ESTO MANDE CORREOS DE VERDAD HACEN FALTA DOS COSAS EN NETLIFY:
//   1. La variable de entorno RESEND_API_KEY (Site configuration →
//      Environment variables), con una clave de resend.com.
//   2. El dominio psicolinks.com verificado dentro de Resend, para poder
//      enviar desde novedades@psicolinks.com.
// Sin la primera, esta función se ejecuta, deja escrito en el log lo que
// habría hecho y no manda nada. No falla ni rompe nada.
//
// PARA PROBARLO A MANO sin esperar al domingo:
//   /.netlify/functions/boletin-semanal?clave=TU_ADMIN_PASSPHRASE&prueba=1
// Con `prueba=1` calcula todo y NO envía: te dice a cuántos habría escrito y
// con qué asunto. Quitando `prueba=1` envía de verdad.
// ===========================================================================

const REMITENTE = 'Psicolinks <novedades@psicolinks.com>';
const SITIO = 'https://psicolinks.com';
const DIAS = 7;

function escapeHtml(t) {
  return String(t || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

function urlArticulo(p) {
  // La URL limpia servida en el servidor, no post.html (que lleva noindex y
  // se pinta con JavaScript). Antes el boletín enlazaba a la mala.
  return `${SITIO}/articulo/${slugify(p.titulo)}/${encodeURIComponent(p.id)}`;
}

// ---------------------------------------------------------------- plantilla
export function htmlBoletin(posts, email, token, rotulo) {
  const baja = `${SITIO}/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const bloques = posts.map((p) => `
        <tr><td style="padding:0 0 20px;">
          <p style="margin:0 0 6px; font-family:Georgia,serif; font-size:18px; font-weight:700; color:#211F2E;">${escapeHtml(p.titulo)}</p>
          <p style="margin:0 0 8px; font-size:14px; color:#625C70; line-height:1.5;">${escapeHtml(p.teaser || '')}</p>
          <a href="${urlArticulo(p)}" style="font-size:14px; font-weight:600; color:#4A3B78; text-decoration:none;">Leer el artículo completo →</a>
        </td></tr>`)
    .join('<tr><td style="padding:0 0 20px; border-bottom:1px solid #DDD7CB;"></td></tr>');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; background:#EEEDE6; font-family:'Work Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:520px; background:#FFFFFF; border:1px solid #DDD7CB; border-radius:12px; padding:28px 24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:0 0 6px;">
        <p style="margin:0; font-family:Georgia,serif; font-size:22px; font-weight:700; color:#211F2E;">psico<em style="color:#4A3B78; font-style:normal;">links</em></p>
      </td></tr>
      <tr><td style="padding:0 0 20px;">
        <p style="margin:0; font-size:13px; color:#625C70;">${escapeHtml(rotulo)}</p>
      </td></tr>
      ${bloques}
      <tr><td style="padding:6px 0 0;">
        <p style="margin:0; font-size:14px; line-height:1.6; color:#625C70;">¿Buscas algo práctico? Tienes las <a href="${SITIO}/temas.html" style="color:#4A3B78;">guías gratuitas</a> y los <a href="${SITIO}/tests.html" style="color:#4A3B78;">tests</a>.</p>
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

// ------------------------------------------------- artículos de la semana
export async function postsDeLaSemana(store, ahora) {
  const { blobs } = await store.list();
  const corte = new Date(ahora.getTime() - DIAS * 24 * 60 * 60 * 1000);
  const posts = [];
  for (const b of blobs) {
    const p = await store.get(b.key, { type: 'json' }).catch(() => null);
    if (!p?.id) continue;
    const f = new Date(String(p.fechaPublicacion || p.fecha || '').slice(0, 10));
    if (!isNaN(f) && f >= corte) posts.push(p);
  }
  posts.sort((a, b) =>
    (b.fechaPublicacion || b.fecha || '').localeCompare(a.fechaPublicacion || a.fecha || ''));
  return posts;
}

// --------------------------------------------- suscriptores, con reparación
// Los registros antiguos guardados bajo el hash del correo no tenían token, y
// el envío los saltaba. Aquí se les pone token y se reescriben con el correo
// como clave, que es lo que espera `unsubscribe`. El registro viejo se borra.
export async function suscriptoresSanos(store) {
  const { blobs } = await store.list();
  const lista = [];
  const reparados = [];
  const vistos = new Set();

  for (const b of blobs) {
    const s = await store.get(b.key, { type: 'json' }).catch(() => null);
    if (!s?.email) continue;
    const email = String(s.email).toLowerCase();
    if (vistos.has(email)) {
      if (b.key !== email) await store.delete(b.key).catch(() => {});
      continue;
    }
    vistos.add(email);

    const necesitaArreglo = !s.token || b.key !== email;
    const token = s.token || crypto.randomUUID();
    if (necesitaArreglo) {
      await store.setJSON(email, { ...s, email, token });
      if (b.key !== email) await store.delete(b.key).catch(() => {});
      reparados.push(email);
    }
    lista.push({ email, token });
  }
  return { lista, reparados };
}

// ------------------------------------------------------------------ envío
async function enviarUno(email, html, asunto) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ from: REMITENTE, to: email, subject: asunto, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend respondió ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

export default async (req) => {
  const url = new URL(req.url);
  const clave = url.searchParams.get('clave');
  const manual = clave !== null;
  const prueba = url.searchParams.get('prueba') === '1';

  // Si se llama a mano, hay que dar la clave de administración.
  if (manual) {
    if (!process.env.ADMIN_PASSPHRASE) {
      return new Response('Falta configurar ADMIN_PASSPHRASE en Netlify', { status: 500 });
    }
    if (clave !== process.env.ADMIN_PASSPHRASE) {
      return new Response('No autorizado', { status: 401 });
    }
  }

  const resumen = { momento: new Date().toISOString(), prueba, manual };

  try {
    const posts = await postsDeLaSemana(getStore('posts'), new Date());
    resumen.articulos = posts.length;

    if (!posts.length) {
      console.log('boletin-semanal: no hay artículos de los últimos 7 días, no se manda nada.');
      resumen.resultado = 'sin artículos esta semana; no se envía';
      return responder(resumen, manual);
    }

    const tienda = getStore('suscriptores');
    const { lista, reparados } = await suscriptoresSanos(tienda);
    resumen.suscriptores = lista.length;
    if (reparados.length) {
      resumen.reparados = reparados.length;
      console.log(`boletin-semanal: reparados ${reparados.length} registros sin token o con la clave antigua.`);
    }

    const asunto = posts.length === 1
      ? `Psicolinks · ${posts[0].titulo}`
      : `Psicolinks · ${posts.length} estudios de esta semana`;
    const rotulo = `Lo que he publicado esta semana · ${posts.length} ${posts.length === 1 ? 'artículo' : 'artículos'}`;
    resumen.asunto = asunto;

    if (!process.env.RESEND_API_KEY) {
      console.log(`boletin-semanal: RESEND_API_KEY no configurada. Habría escrito a ${lista.length} suscriptor(es) con el asunto «${asunto}».`);
      resumen.resultado = 'RESEND_API_KEY no configurada: no se ha enviado nada';
      return responder(resumen, manual);
    }

    if (prueba) {
      resumen.resultado = `prueba: habría escrito a ${lista.length} suscriptor(es). No se ha enviado nada.`;
      return responder(resumen, manual);
    }

    let enviados = 0;
    const fallidos = [];
    for (const s of lista) {
      try {
        await enviarUno(s.email, htmlBoletin(posts, s.email, s.token, rotulo), asunto);
        enviados++;
      } catch (err) {
        fallidos.push(s.email);
        console.error(`boletin-semanal: fallo al enviar a ${s.email}:`, err?.message || err);
      }
    }
    resumen.enviados = enviados;
    resumen.fallidos = fallidos.length;
    resumen.resultado = `enviado a ${enviados} de ${lista.length}`;
    console.log(`boletin-semanal: enviado a ${enviados}/${lista.length}. Fallidos: ${fallidos.length}.`);
    return responder(resumen, manual);
  } catch (err) {
    console.error('boletin-semanal: error interno:', err);
    resumen.error = String(err?.message || err);
    return responder(resumen, manual, 500);
  }
};

function responder(resumen, manual, status = 200) {
  // Cuando lo dispara el horario, a nadie le importa el cuerpo de la respuesta.
  // Cuando lo lanza Miguel a mano, le devolvemos el resumen para que vea qué pasó.
  if (!manual) return new Response('ok', { status });
  return new Response(JSON.stringify(resumen, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const config = {
  schedule: '0 8 * * 0', // domingos, 08:00 UTC (10:00 en España en verano, 9:00 en invierno)
};
