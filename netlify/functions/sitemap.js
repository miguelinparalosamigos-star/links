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
export default async (req) => {
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const urls = [
    { loc: `${base}/` },
    { loc: `${base}/empieza-aqui.html` },
    { loc: `${base}/consultorio.html` },
    { loc: `${base}/guias.html` },
    // Páginas de guía (versión web, indexable; el PDF es la descarga)
    { loc: `${base}/aceptar-lo-que-no-puedes-cambiar.html` },
    { loc: `${base}/ansiedad-ante-los-examenes.html` },
    { loc: `${base}/ansiedad-por-la-salud.html` },
    { loc: `${base}/ayudar-a-alguien-que-sufre.html` },
    { loc: `${base}/calma-en-5-minutos.html` },
    { loc: `${base}/calmar-la-ansiedad.html` },
    { loc: `${base}/concentrarte-y-dejar-de-procrastinar.html` },
    { loc: `${base}/controlar-el-enfado.html` },
    { loc: `${base}/crear-habitos-que-duren.html` },
    { loc: `${base}/cuando-no-tienes-ganas-de-nada.html` },
    { loc: `${base}/cuando-pierdes-a-alguien.html` },
    { loc: `${base}/cuando-te-da-un-ataque-de-panico.html` },
    { loc: `${base}/cuando-te-preocupas-por-todo.html` },
    { loc: `${base}/cuando-te-sientes-solo.html` },
    { loc: `${base}/deja-de-compararte.html` },
    { loc: `${base}/deja-de-darle-vueltas.html` },
    { loc: `${base}/dejar-de-complacer-a-todos.html` },
    { loc: `${base}/discutir-mejor-en-pareja.html` },
    { loc: `${base}/dormir-mejor-en-7-pasos.html` },
    { loc: `${base}/el-burnout.html` },
    { loc: `${base}/el-estres-que-no-para.html` },
    { loc: `${base}/el-miedo-al-que-diran.html` },
    { loc: `${base}/gestionar-tus-emociones.html` },
    { loc: `${base}/hablar-en-publico.html` },
    { loc: `${base}/hablarte-mejor.html` },
    { loc: `${base}/la-culpa.html` },
    { loc: `${base}/la-dependencia-emocional.html` },
    { loc: `${base}/los-celos.html` },
    { loc: `${base}/mejorar-tu-autoestima.html` },
    { loc: `${base}/menos-movil-mas-cabeza.html` },
    { loc: `${base}/menos-perfeccionismo.html` },
    { loc: `${base}/pensamientos-que-no-quieres-tener.html` },
    { loc: `${base}/poner-limites.html` },
    { loc: `${base}/reconstruir-la-confianza-en-pareja.html` },
    { loc: `${base}/superar-una-ruptura.html` },
    { loc: `${base}/tomar-decisiones-dificiles.html` },
    { loc: `${base}/vencer-la-timidez.html` },
    { loc: `${base}/volver-a-la-rutina.html` },
    { loc: `${base}/guia-mantas-de-peso.html` },
    { loc: `${base}/cosas-para-dormir-mejor.html` },
    { loc: `${base}/rincon-para-concentrarte.html` },
    { loc: `${base}/un-rincon-de-calma.html` },
    { loc: `${base}/moverte-en-casa.html` },
    { loc: `${base}/menos-movil-cosas.html` },
    { loc: `${base}/escribir-para-aclararte.html` },
    { loc: `${base}/archivo.html` },
    { loc: `${base}/como-leemos-los-estudios.html` },
    { loc: `${base}/sobre-mi.html` },
    { loc: `${base}/para-estudiantes.html` },
    { loc: `${base}/recursos-gratuitos-psicologia.html` },
    { loc: `${base}/buscar-bibliografia-cientifica.html` },
    { loc: `${base}/leer-un-paper.html` },
    { loc: `${base}/leer-un-metaanalisis.html` },
    { loc: `${base}/gestores-de-referencias.html` },
    { loc: `${base}/citar-en-apa.html` },
  ];

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
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
      'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
