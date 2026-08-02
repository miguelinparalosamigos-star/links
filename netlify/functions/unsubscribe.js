import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/unsubscribe?email=...&token=...
// Enlace que se manda dentro de cada correo del boletín. Comprueba que el
// token coincide con el guardado para ese email (para que nadie pueda dar
// de baja a otra persona solo adivinando su email) y borra al suscriptor.
// Devuelve una página HTML sencilla, no JSON, porque se abre directamente
// desde el correo en el navegador.

function pagina(mensaje) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Psicolinks</title>
<style>
  body { margin:0; background:#EEEDE6; color:#211F2E; font-family: system-ui, -apple-system, sans-serif; }
  main { max-width:440px; margin:15vh auto; padding:2rem; text-align:center; }
  a { color:#4A3B78; font-weight:600; }
</style>
</head>
<body>
<main>
  <p>${mensaje}</p>
  <p><a href="/">← Volver a Psicolinks</a></p>
</main>
</body>
</html>`;
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const url = new URL(req.url);
  const email = String(url.searchParams.get('email') || '').trim().toLowerCase();
  const token = String(url.searchParams.get('token') || '');

  if (!email || !token) {
    return new Response(pagina('Enlace incompleto: falta el email o el código de baja.'), {
      status: 400,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  try {
    const suscriptores = getStore('suscriptores');
    const registro = await suscriptores.get(email, { type: 'json' });

    if (!registro) {
      // Ya estaba de baja (o nunca estuvo suscrito): no es un error para quien
      // hace clic, así que se lo decimos con normalidad.
      return new Response(pagina('Este email ya no está suscrito al boletín de Psicolinks.'), {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    if (registro.token !== token) {
      return new Response(pagina('El enlace de baja no es válido.'), {
        status: 403,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    await suscriptores.delete(email);

    return new Response(pagina('Listo, te hemos dado de baja del boletín de Psicolinks. Puedes volver a suscribirte cuando quieras.'), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    console.error('unsubscribe: error interno:', err);
    return new Response(pagina('No se ha podido procesar la baja. Escríbenos a miqvalsagi@gmail.com y lo hacemos a mano.'), {
      status: 500,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }
};
