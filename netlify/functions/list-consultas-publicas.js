import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-consultas-publicas  (pública, sin clave)
// Devuelve las consultas ya respondidas y publicadas, de más reciente a más antigua.
// Nunca expone el email de quien preguntó (ese campo no se guarda aquí).
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  try {
    const store = getStore('consultas-publicadas');
    const { blobs } = await store.list();

    const consultas = [];
    for (const b of blobs) {
      const item = await store.get(b.key, { type: 'json' });
      if (item) {
        consultas.push({
          id: item.id,
          nombre: item.nombre,
          contexto: item.contexto,
          pregunta: item.pregunta,
          respuesta: item.respuesta,
          fechaRespuesta: item.fechaRespuesta,
        });
      }
    }

    consultas.sort((a, b) => (b.fechaRespuesta || '').localeCompare(a.fechaRespuesta || ''));

    return new Response(JSON.stringify({ consultas }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300' },
    });
  } catch (err) {
    console.error('list-consultas-publicas: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
