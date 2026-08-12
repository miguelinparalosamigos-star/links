import { getStore } from '@netlify/blobs';

// POST /.netlify/functions/responder-consulta
// Header requerido: X-Admin-Passphrase
// Body JSON: { id, accion: 'publicar' | 'descartar', respuesta?, preguntaPublica?, nombrePublico? }
//  - 'publicar': mueve la consulta a "consultas-publicadas" con tu respuesta y la
//    pregunta ya editada/anonimizada (puedes recortar datos personales antes de publicar).
//  - 'descartar': la borra sin publicar.
// En ambos casos la consulta sale de la cola privada.
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('responder-consulta: falta configurar ADMIN_PASSPHRASE en Netlify');
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
    const cola = getStore('consultas');
    const consulta = await cola.get(id, { type: 'json' });

    if (!consulta) {
      return new Response(JSON.stringify({ error: 'Consulta no encontrada (puede que ya la hayas revisado)' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (accion === 'publicar') {
      const respuesta = String(body.respuesta || '').trim();
      if (respuesta.length < 5) {
        return new Response(JSON.stringify({ error: 'Escribe una respuesta antes de publicar.' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }
      const preguntaPublica = String(body.preguntaPublica || consulta.pregunta || '').trim();
      const nombrePublico = String(body.nombrePublico || consulta.nombre || '').trim() || 'Anónimo';

      const publicadas = getStore('consultas-publicadas');
      await publicadas.setJSON(id, {
        id,
        nombre: nombrePublico.slice(0, 60),
        contexto: String(consulta.contexto || '').slice(0, 120),
        pregunta: preguntaPublica.slice(0, 2000),
        respuesta,
        fecha: consulta.fecha,
        fechaRespuesta: new Date().toISOString(),
      });
    }

    await cola.delete(id);

    return new Response(JSON.stringify({ ok: true, accion }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('responder-consulta: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
