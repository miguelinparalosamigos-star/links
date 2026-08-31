import { getStore } from '@netlify/blobs';

// ---------------------------------------------------------------------------
// COPIA DE SEGURIDAD DE LOS DATOS
//
// El repositorio de GitHub guarda las páginas: guías, herramientas, tests,
// laboratorio. Pero los ARTÍCULOS que publica fetch-studies cada día no son
// ficheros: viven en Netlify Blobs, igual que los suscriptores, las consultas
// y las estadísticas. Si ese almacén se pierde, no hay de dónde sacarlos.
//
// Esta función los saca todos en un solo JSON para poder guardarlo donde sea.
//
// CÓMO SE USA
//   Desde /admin.html, botón "Descargar copia de seguridad". Pide la misma
//   clave que las estadísticas.
//
//   O a mano, con la cabecera de siempre:
//     curl -H "X-Admin-Passphrase: TU_CLAVE" \
//          https://psicolinks.com/.netlify/functions/copia-seguridad -o copia.json
//
// QUÉ INCLUYE
//   posts, suscriptores, consultas, consultas-publicadas, estadisticas y
//   borradores. Con "?solo=posts" se baja solo uno, por si el conjunto pesa.
//
// OJO: el fichero lleva correos de suscriptores y el texto de las consultas.
// Son datos personales: guárdalo donde guardarías una copia de tu agenda, no
// en una carpeta compartida.
// ---------------------------------------------------------------------------

const ALMACENES = ['posts', 'suscriptores', 'consultas', 'consultas-publicadas',
                   'estadisticas', 'borradores'];

async function volcar(nombre) {
  const store = getStore(nombre);
  const { blobs } = await store.list();
  const datos = {};
  for (const b of blobs) {
    try {
      datos[b.key] = await store.get(b.key, { type: 'json' });
    } catch (err) {
      // Un blob ilegible no puede tumbar la copia entera: se anota y se sigue.
      datos[b.key] = { _error: String(err && err.message || err) };
    }
  }
  return datos;
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');
  if (!clave) {
    console.error('copia-seguridad: falta ADMIN_PASSPHRASE en Netlify');
    return new Response(JSON.stringify({ error: 'Servidor mal configurado' }), {
      status: 500, headers: { 'content-type': 'application/json' },
    });
  }
  if (!recibida || recibida !== clave) {
    return new Response(JSON.stringify({ error: 'Clave incorrecta' }), {
      status: 401, headers: { 'content-type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const solo = url.searchParams.get('solo');
  const pedidos = solo ? ALMACENES.filter((a) => a === solo) : ALMACENES;
  if (!pedidos.length) {
    return new Response(JSON.stringify({ error: 'Ese almacén no existe', almacenes: ALMACENES }), {
      status: 400, headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const copia = { generada: new Date().toISOString(), sitio: 'psicolinks.com', almacenes: {} };
    const resumen = {};
    for (const nombre of pedidos) {
      const datos = await volcar(nombre);
      copia.almacenes[nombre] = datos;
      resumen[nombre] = Object.keys(datos).length;
    }
    copia.resumen = resumen;
    console.log('copia-seguridad:', JSON.stringify(resumen));

    const fecha = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify(copia), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'content-disposition': `attachment; filename="psicolinks-copia-${fecha}.json"`,
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    console.error('copia-seguridad: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno', detalle: String(err && err.message) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    });
  }
};
