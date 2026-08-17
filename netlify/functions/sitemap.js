import { getStore } from '@netlify/blobs';

// Mismo slug que usa la función "articulo" y la portada, para que la URL del
// sitemap coincida con la real del artículo.
function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

// Servida en /sitemap.xml gracias a la redirección en netlify.toml.
// Genera la lista de páginas (portada + cada post publicado) para que
// los buscadores las encuentren, sin tener que mantener el fichero a mano.
// Páginas fijas del sitio (todo lo que no sale de la base de datos de artículos).
// Cuando publiques una guía nueva, añade aquí su fichero — una línea — y entrará
// en el sitemap en el siguiente despliegue. No metas aquí páginas con noindex
// (legales y panel de administración) ni cortar-pdf.html, que es de otro dominio.
const PAGINAS_FIJAS = [
  '/',
  '/aceptar-lo-que-no-puedes-cambiar.html',
  '/ansiedad-ante-los-examenes.html',
  '/ansiedad-por-la-salud.html',
  '/archivo.html',
  '/ayudar-a-alguien-que-sufre.html',
  '/buscar-bibliografia-cientifica.html',
  '/calma-en-5-minutos.html',
  '/calmar-la-ansiedad.html',
  '/citar-en-apa.html',
  '/como-leemos-los-estudios.html',
  '/concentrarte-y-dejar-de-procrastinar.html',
  '/consultorio.html',
  '/controlar-el-enfado.html',
  '/cosas-para-dormir-mejor.html',
  '/crear-habitos-que-duren.html',
  '/cuando-no-tienes-ganas-de-nada.html',
  '/cuando-pierdes-a-alguien.html',
  '/cuando-te-da-un-ataque-de-panico.html',
  '/cuando-te-preocupas-por-todo.html',
  '/cuando-te-sientes-solo.html',
  '/deja-de-compararte.html',
  '/deja-de-darle-vueltas.html',
  '/dejar-de-complacer-a-todos.html',
  '/discutir-mejor-en-pareja.html',
  '/dormir-mejor-en-7-pasos.html',
  '/el-burnout.html',
  '/el-estres-que-no-para.html',
  '/el-miedo-al-que-diran.html',
  '/empieza-aqui.html',
  '/escribir-para-aclararte.html',
  '/gestionar-tus-emociones.html',
  '/gestores-de-referencias.html',
  '/guia-mantas-de-peso.html',
  '/guias.html',
  '/donde-pedir-ayuda.html',
  '/tdah-en-adultos.html',
  '/dolor-cronico.html',
  '/ansiedad-por-dinero.html',
  '/acoso-laboral.html',
  '/duelo-por-una-mascota.html',
  '/oposiciones-sin-quemarte.html',
  '/depresion-posparto.html',
  '/sueno-de-los-ninos.html',
  '/superar-una-fobia.html',
  '/comer-por-ansiedad.html',
  '/sobrecarga-del-cuidador.html',
  '/dejar-de-fumar.html',
  '/insomnio.html',
  '/sindrome-del-impostor.html',
  '/elegir-psicologo.html',
  '/ayudar-a-un-hijo-adolescente.html',
  '/hablar-en-publico.html',
  '/hablarte-mejor.html',
  '/la-culpa.html',
  '/la-dependencia-emocional.html',
  '/leer-un-metaanalisis.html',
  '/leer-un-paper.html',
  '/los-celos.html',
  '/mejorar-tu-autoestima.html',
  '/menos-movil-cosas.html',
  '/menos-movil-mas-cabeza.html',
  '/menos-perfeccionismo.html',
  '/moverte-en-casa.html',
  '/para-estudiantes.html',
  '/pensamientos-que-no-quieres-tener.html',
  '/poner-limites.html',
  '/reconstruir-la-confianza-en-pareja.html',
  '/recursos-gratuitos-psicologia.html',
  '/rincon-para-concentrarte.html',
  '/sobre-mi.html',
  '/superar-una-ruptura.html',
  '/temas.html',
  '/tomar-decisiones-dificiles.html',
  '/un-rincon-de-calma.html',
  '/vencer-la-timidez.html',
  '/volver-a-la-rutina.html',
];

export default async (req) => {
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const urls = PAGINAS_FIJAS.map((ruta) => ({ loc: `${base}${ruta}` }));

  try {
    const posts = getStore('posts');
    const { blobs } = await posts.list();
    for (const b of blobs) {
      const post = await posts.get(b.key, { type: 'json' });
      if (post?.id) {
        urls.push({
          loc: `${base}/articulo/${slugify(post.titulo)}/${encodeURIComponent(post.id)}`,
          lastmod: (post.fechaPublicacion || post.fecha || '').slice(0, 10) || undefined,
        });
      }
    }
  } catch (err) {
    console.error('sitemap: error interno:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
