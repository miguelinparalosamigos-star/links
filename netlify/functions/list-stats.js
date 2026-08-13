import { getStore } from '@netlify/blobs';

// GET /.netlify/functions/list-stats
// Header requerido: X-Admin-Passphrase (la misma que ya usas)
// Devuelve: { vistasHome, totalSuscriptores, posts: [{id, titulo, vistas}], dias: [{fecha, vistas}] }
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Método no permitido', { status: 405 });
  }

  const clave = process.env.ADMIN_PASSPHRASE;
  const recibida = req.headers.get('X-Admin-Passphrase');

  if (!clave) {
    console.error('list-stats: falta configurar ADMIN_PASSPHRASE en Netlify');
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
    const stats = getStore('estadisticas');
    const posts = getStore('posts');

    const { blobs: statsBlobs } = await stats.list();
    let vistasHome = 0;
    const vistasPorPost = {};
    const vistasPorDia = {};
    const clics = {};

    for (const b of statsBlobs) {
      const item = await stats.get(b.key, { type: 'json' });
      if (!item) continue;
      if (b.key === 'contador:home') {
        vistasHome = item.total || 0;
      } else if (b.key.startsWith('contador:post:')) {
        vistasPorPost[b.key.slice('contador:post:'.length)] = item.total || 0;
      } else if (b.key.startsWith('dia:')) {
        vistasPorDia[b.key.slice('dia:'.length)] = item.total || 0;
      } else if (b.key.startsWith('clic:')) {
        clics[b.key.slice('clic:'.length)] = item.total || 0;
      }
    }

    const { blobs: postBlobs } = await posts.list();
    const postsConVistas = [];
    for (const b of postBlobs) {
      const post = await posts.get(b.key, { type: 'json' });
      if (post) {
        postsConVistas.push({
          id: post.id,
          titulo: post.titulo,
          vistas: vistasPorPost[post.id] || 0,
        });
      }
    }
    postsConVistas.sort((a, b) => b.vistas - a.vistas);
    const totalPosts = postsConVistas.length;
    const postsTop = postsConVistas.slice(0, 30);

    const dias = Object.keys(vistasPorDia)
      .sort()
      .reverse()
      .slice(0, 14)
      .map((fecha) => ({ fecha, vistas: vistasPorDia[fecha] }));

    const ETIQUETAS_CLIC = {
      'libro-superregla': 'Libro: La superregla',
      'libro-esqueyosoyasi': 'Libro: Es que yo soy así',
      'libro-habitos-sueno': 'Libro: Los hábitos del sueño',
      'libro-ciencia-memoria': 'Libro: La ciencia de la memoria',
      'libro-amar-o-depender': 'Libro: ¿Amar o depender?',
      'libro-pensar-rapido-despacio': 'Libro: Pensar rápido, pensar despacio',
      'libro-solucion-procrastinacion': 'Libro: La solución a la procrastinación',
      'libro-aprender-de-la-perdida': 'Libro: Aprender de la pérdida',
      'libro-cerebro-y-ejercicio': 'Libro: Cerebro y ejercicio',
      'libro-habitos-atomicos': 'Libro: Hábitos atómicos',
      'libro-sentirse-bien': 'Libro: Sentirse bien',
      'libro-cuerpo-lleva-cuenta': 'Libro: El cuerpo lleva la cuenta',
      'libro-cosas-buenas': 'Libro: Cómo hacer que te pasen cosas buenas',
      'libro-no-amargarse': 'Libro: El arte de no amargarse la vida',
      'libro-se-amable': 'Libro: Sé amable contigo mismo',
      'libro-por-que-dormimos': 'Libro: Por qué dormimos',
      'libro-cinco-lenguajes-amor': 'Libro: Los cinco lenguajes del amor',
      'libro-centrate-deep-work': 'Libro: Céntrate (Deep Work)',
      'libro-inteligencia-emocional': 'Libro: Inteligencia emocional',
      'libro-hombre-busca-sentido': 'Libro: El hombre en busca de sentido',
      'libro-ganar-amigos': 'Libro: Cómo ganar amigos…',
      'libro-poder-habitos': 'Libro: El poder de los hábitos',
      'libro-tus-zonas-erroneas': 'Libro: Tus zonas erróneas',
      consulta: 'Enlace a consulta (concienciaconductual.com)',
      'guia-rel': 'Guía de compra (en artículo)',
      'compartir-whatsapp': 'Compartir por WhatsApp',
      'compartir-facebook': 'Compartir por Facebook',
      'compartir-x': 'Compartir por X',
      'compartir-email': 'Compartir por email',
    };
    const tipoDeClic = (raw) =>
      raw.startsWith('compartir') ? 'compartir'
      : raw.startsWith('libro') ? 'libro'
      : raw === 'consulta' ? 'consulta'
      : 'otro';
    const clicsLista = Object.keys(clics)
      .map((nombre) => ({ nombre: ETIQUETAS_CLIC[nombre] || nombre, tipo: tipoDeClic(nombre), total: clics[nombre] }))
      .sort((a, b) => b.total - a.total);

    return new Response(
      JSON.stringify({
        vistasHome,
        totalPosts,
        posts: postsTop,
        dias,
        clics: clicsLista,
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  } catch (err) {
    console.error('list-stats: error interno:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
