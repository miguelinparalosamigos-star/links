# Revisión completa de psicolinks.com — 14 de agosto de 2026

Repaso de las 26 páginas HTML del proyecto, las funciones de Netlify, el sitemap,
el robots.txt y la configuración de despliegue.

---

## Arreglado (ya está hecho en estos ficheros)

**1. La portada no tenía `<h1>`.**
Era el fallo más gordo. El `<h1>` le dice a Google de qué va una página, y la
portada no tenía ninguno: solo el logotipo dentro de un enlace. Ahora la frase
«Cada día laborable, tres estudios de psicología recientes…» es el `<h1>`, con
exactamente el mismo aspecto visual que antes — se ve igual, pero ahora significa
algo para un buscador.

**2. `post.html` era indexable y estaba vacía sin JavaScript.**
La portada enlaza a `post.html?id=ejemplo-1`, `-2` y `-3`. Esa plantilla antigua
no tiene canonical ni descripción y su contenido lo carga JavaScript, así que
Google podía acabar indexando tres páginas de ejemplo, prácticamente vacías, con
tu dominio. Le he puesto `noindex, follow`: deja de ser indexable pero sigue
pasando autoridad por sus enlaces.

**3. Dieciséis títulos y descripciones fuera de medida.**
Google corta los títulos por encima de unos 60 caracteres y las descripciones
por encima de unos 160. Los tuyos llegaban a 89 y 211. Reescritos todos: ahora
ningún título pasa de 62 y ninguna descripción de 160, sin perder las palabras
por las que quieres aparecer.

**4. El sitemap no incluía las guías.**
Solo llevaba portada, archivo, metodología y los artículos. Ahora tiene 20 rutas
fijas más todos los artículos, y añadir una guía nueva es una línea.

**5. Enlace roto en la guía de mantas de peso.**
El enlace a «Calma en 5 minutos» apuntaba a la portada.

**6. Los artículos no enlazaban a las guías.**
Cincuenta páginas de artículo sin una sola salida hacia tu contenido propio.
He añadido un enlace a `/guias.html` al final de cada artículo, en la plantilla
`articulo.js`. Eso reparte autoridad y ayuda a que Google descubra las guías.

**7. `guias.html` seguía anunciando solo «relajación, sueño, calma».**
Actualizadas la descripción y la introducción al catálogo real.

---

## Pendiente: decisiones tuyas

**A. `cortar-pdf.html` no pinta nada en este repositorio.**
Es una página de tu otro proyecto: su canonical apunta a
`https://maspdf.com/cortar-pdf.html`, pero se está publicando en
`psicolinks.com/cortar-pdf.html`. El canonical evita que compita, así que no
hace daño grave, pero ensucia el sitio y confunde. Bórrala de este repositorio
en GitHub (no la he tocado yo porque es tu decisión y porque puede que la
tengas ahí a propósito).

**B. La portada muestra tres artículos de ejemplo en el HTML.**
Sin JavaScript, lo primero que ve un rastreador son tres tarjetas de ejemplo.
Con JavaScript se sustituyen por los artículos reales. No es grave —Google
ejecuta JavaScript— pero sí es mejorable: lo ideal sería que el HTML de la
portada trajera ya los tres últimos artículos reales, renderizados en el
servidor, como ya haces con las páginas `/articulo/`. Es un cambio de más
calado; dime si quieres que lo montemos.

**C. `archivo.html` también se pinta con JavaScript.**
Mismo caso. Menos importante, porque las URLs de los artículos ya llegan a
Google por el sitemap.

**D. No tienes página de autor.**
En temas de salud, Google mira con lupa quién firma. Tienes tu número de
colegiado en las guías, pero no una página «Sobre mí» con tu formación,
tu colegiación y un enlace a tu consulta. Es de lo que más te puede ayudar a
competir en un terreno donde la mayoría de webs son anónimas o corporativas.
Te la puedo escribir cuando quieras.

**E. El formulario de suscripción está activo y el envío no.**
En `guias.html` la gente puede dejar su correo y se guarda en Netlify Blobs,
pero como Resend no está configurado, nadie recibe nada. O configuras Resend
(lo tienes explicado en tu README) o conviene avisar en el formulario de que
los avisos empezarán más adelante.

---

## Comprobado y correcto

- Las páginas `/articulo/...` se renderizan en el servidor con su título,
  descripción, canonical y datos estructurados. Es la parte mejor resuelta del
  sitio.
- `robots.txt` no bloquea nada y declara el sitemap.
- Las páginas legales (aviso legal, privacidad, cookies) y `admin.html` llevan
  `noindex`, que es lo correcto.
- El panel de administración valida la clave en el servidor contra
  `ADMIN_PASSPHRASE`, no en el navegador. Bien hecho.
- Analytics está bajo consentimiento y el banner reinyecta los scripts al
  aceptar. Legalmente correcto; recuerda que por eso GA solo cuenta a quien
  acepta las cookies analíticas.
- Las 26 páginas tienen el HTML bien cerrado, `lang="es"`, datos estructurados
  válidos, ningún título duplicado y ninguna imagen sin `alt`.
- Los 30 enlaces de Amazon llevan tu tag de afiliado y cada guía de compra
  incluye el aviso de publicidad.

---

## Qué hacer después de subirlo

1. Comprueba `psicolinks.com/sitemap.xml`: deben aparecer las 16 guías.
2. En Search Console, pide indexación de las URLs nuevas. Hay cupo diario,
   ve de tres en tres. Prioriza por potencial de búsqueda:
   `/guia-ansiedad-que-funciona.html`, `/guia-rumiacion.html`,
   `/guia-elegir-psicologo.html`, `/guia-dormir-mejor-en-7-pasos.html`,
   `/guia-procrastinacion.html`, `/guia-duelo.html`.
3. Dentro de una semana, mira el informe **Páginas**: te dirá cuántas ha
   indexado y cuántas ha descartado y por qué.
4. Y lo que de verdad falta: **enlaces desde fuera**. Un dominio sin ningún
   enlace entrante tarda mucho en arrancar por bien que esté hecho. Un enlace
   desde concienciaconductual.com hacia psicolinks.com sería el primero y el
   más fácil.
