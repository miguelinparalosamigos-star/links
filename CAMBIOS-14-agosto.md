# Cambios sobre el repositorio `links` — 14 de agosto de 2026

75 ficheros: 35 modificados y 40 nuevos. Ninguno toca el diseño ni el
contenido visible de las guías existentes, salvo la portada (ver punto 2).

## 1. El sitemap solo publicaba 5 páginas de 68

`netlify/functions/sitemap.js` tenía esta lista fija:

    '/', '/archivo.html', '/como-leemos-los-estudios.html',
    '/guias.html', '/guia-mantas-de-peso.html'

Es decir: **las 45 guías, el consultorio, «empieza aquí», «sobre mí», «temas»,
«para estudiantes» y todas las páginas de recursos científicos estaban fuera
del sitemap.** Google podía llegar a ellas por enlaces internos, pero no las
tenía declaradas. Es, con diferencia, el fallo más caro de los que había.

Ahora la lista incluye las 60 páginas indexables (+ los artículos diarios, que
ya se añadían solos). Quedan fuera a propósito las páginas con `noindex`
—legales y paneles de administración— y `cortar-pdf.html`, que es de maspdf.com.

## 2. La portada no tenía `<h1>`

`index.html` no tenía ningún `<h1>`: solo el logotipo dentro de un enlace.
Ahora la frase «Cada día laborable, tres estudios de psicología recientes,
traducidos a un lenguaje claro» es el `<h1>`, con las mismas clases CSS y el
mismo aspecto visual. El resto de la frase queda en un `<p>` debajo.

## 3. `post.html` era indexable y estaba vacía sin JavaScript

La portada enlaza a `post.html?id=ejemplo-1`, `-2` y `-3`. Esa plantilla no
tiene canonical ni descripción y su contenido lo pinta JavaScript, así que
Google podía indexar tres páginas de ejemplo casi vacías. Le he puesto
`noindex, follow`: deja de indexarse pero sigue pasando autoridad por sus
enlaces.

## 4. Títulos y descripciones fuera de medida

Google corta los títulos por encima de unos 60 caracteres y las descripciones
por encima de unos 160.

- **23 títulos** pasaban del límite (hasta 85 caracteres). Casi todos por el
  mismo motivo: el sufijo « · Guía de un psicólogo» antes de « · Psicolinks».
  Se lo he quitado a los que se pasaban; los que ya cabían no se han tocado.
- **14 descripciones** pasaban de 160 (hasta 192). Reescritas.

Además, la de `cuando-te-preocupas-por-todo.html` estaba **cortada a media
frase** y con comillas escapadas (`&quot;`) que se veían literales en Google:
terminaba en «Sencillas, con respaldo, ». Corregida.

## 5. Cuatro guías nuevas

Escritas con tu misma plantilla, tu estructura de seis herramientas, tu bloque
de newsletter y el cierre con enlace a Conciencia Conductual. Sin PDF asociado
todavía —si los generas, el bloque de descarga se añade en una línea.

| Fichero | Tema | Por qué esta |
|---|---|---|
| `insomnio.html` | Insomnio crónico | Tienes higiene del sueño, pero no lo que se hace cuando eso ya no basta: restricción de sueño, control de estímulos. Es el tratamiento de primera elección y no lo cubría ninguna guía. |
| `elegir-psicologo.html` | Cómo elegir psicólogo | Búsqueda con mucha intención y terreno donde tú tienes ventaja: colegiación, habilitación sanitaria, señales de alarma y pseudoterapias. |
| `sindrome-del-impostor.html` | Síndrome del impostor | Muy buscado y no solapa con autoestima ni con perfeccionismo: el patrón es distinto (los éxitos se apuntan a la suerte). |
| `ayudar-a-un-hijo-adolescente.html` | Padres de adolescentes | Público nuevo. Tienes «ayudar a alguien que sufre», pero no la versión para madres y padres, que es la que se busca en septiembre. |
| `superar-una-fobia.html` | Fobias específicas | Volar, conducir, agujas, ascensores. Es el problema psicológico que mejor responde al tratamiento y no lo cubría ninguna guía. |
| `comer-por-ansiedad.html` | Comer emocional | Muy buscado. Sin dietas ni consejos sobre el peso: relación con la comida, y derivación clara si hay atracones o conductas compensatorias. |
| `sobrecarga-del-cuidador.html` | Cuidadores familiares | Público que no tenías y que casi nadie atiende. Incluye la vía real de ayuda en España: la trabajadora social del centro de salud. |
| `dejar-de-fumar.html` | Tabaco | Solo la parte conductual, dejando la medicación explícitamente en manos del médico. |
| `duelo-por-una-mascota.html` | Duelo por un animal | Duelo desautorizado: mucha gente lo busca y casi nadie lo trata en serio. |
| `oposiciones-sin-quemarte.html` | Opositores | Público enorme en España y con un problema muy concreto: el desgaste de larga distancia. |
| `depresion-posparto.html` | Posparto | Frecuente, se consulta tarde y con derivación clara a matrona y médico. Incluye los pensamientos intrusivos, que casi nadie nombra. |
| `sueno-de-los-ninos.html` | Sueño infantil | Muy buscado, con mucho ruido alrededor. Enfocado en qué es esperable y qué sí depende de los hábitos. |
| `tdah-en-adultos.html` | TDAH adulto | De lo más buscado ahora mismo y lleno de desinformación. Insiste en no autodiagnosticarse. |
| `dolor-cronico.html` | Dolor persistente | Fibromialgia, lumbalgia, migrañas. Deja claro que el dolor es real y que lo psicológico suma al tratamiento médico, no lo sustituye. |
| `ansiedad-por-dinero.html` | Presión económica | Problema real, no distorsión: separa reducir el desgaste de resolver la situación. |
| `acoso-laboral.html` | Mobbing | Con las vías reales en España: protocolo, sindicato, Inspección de Trabajo. |
| `miedo-a-conducir.html` | Amaxofobia | Búsqueda concreta y frecuente; la guía general de fobias no la cubría con detalle. |
| `juego-y-apuestas.html` | Juego online | Problema creciente. Incluye la autoprohibición del RGIAJ, que casi nadie sabe que existe y es gratis. |
| `duelo-por-suicidio.html` | Supervivientes | Muy desatendido. Sin detalles de método, centrado en la culpa, el estigma y dónde hay grupos específicos. |
| `menopausia-y-animo.html` | Menopausia | La parte psicológica, que casi no se trata, con derivación clara a la médica para lo suyo. |
| `miedo-a-volar.html` | Aerofobia | Separa el miedo al accidente del miedo a las propias sensaciones, que es lo que hace que leer estadísticas no sirva de nada. |
| `despues-de-un-accidente.html` | Tras un suceso grave | Qué es esperable las primeras semanas y cuándo deja de serlo. Sin dramatizar y con derivación clara. |
| `volver-al-trabajo-tras-una-baja.html` | Reincorporación | Nadie prepara esto y es donde se producen las segundas bajas. |
| `alcohol-y-ansiedad.html` | Alcohol como ansiolítico | Con el aviso médico sobre dejarlo de golpe en consumo diario alto. |
| `separacion-con-hijos.html` | Separación | Lo que daña a los hijos no es la separación, es el conflicto. Muy buscado en el momento exacto en que se busca. |
| `agotamiento-de-padres.html` | Burnout parental | Está descrito y estudiado, y casi nadie lo nombra. Público amplio y con mucha culpa encima. |
| `alta-sensibilidad.html` | Alta sensibilidad | Etiqueta popularísima y llena de humo. Aquí se explica qué se sabe y, sobre todo, qué puede estar tapando. |
| `pareja-con-depresion.html` | Acompañar una depresión | Para quien convive con ella. Incluye qué frases hacen daño y qué señales son urgencia. |
| `no-quiere-ir-al-colegio.html` | Rechazo escolar | Muy buscado y muy estacional: septiembre. Con el criterio incómodo pero claro de volver cuanto antes. |
| `gritar-menos-a-los-hijos.html` | Gritos en casa | Enorme volumen de búsqueda y mucha culpa detrás. Ataca las horas punta, no la fuerza de voluntad. |
| `compras-compulsivas.html` | Compra impulsiva | Mismo mecanismo que el juego pero socialmente aceptado, así que casi nadie lo trata. |
| `vivir-lejos-de-casa.html` | Emigración y mudanzas | Duelo sin permiso social. Público que busca terapia online, que es lo que tú puedes ofrecer. |

Las treinta y dos están dadas de alta en `guias.html` y en el sitemap.

## Dos páginas internas nuevas (no son contenido, son herramientas)

- **`redes.html`** — coge los últimos artículos publicados y los convierte en
  texto listo para pegar, en dos versiones: una larga para LinkedIn y una corta
  para Threads, X o Bluesky. Con botón de copiar.
- **`imagen-redes.html`** — genera la imagen de 1200×630 con el titular y el
  estilo de Psicolinks, y la descarga en PNG. Es la medida de la imagen de
  enlace en Facebook y LinkedIn.

Las dos llevan `noindex, nofollow` y no están enlazadas desde ninguna parte de
la web: solo existen si escribes la dirección. Tampoco están en el sitemap.

## Test de ansiedad: `test-de-ansiedad.html`

Cuestionario **GAD-7** interactivo: siete preguntas, barra de progreso, cálculo
al momento, interpretación por franjas (mínima, leve, moderada, grave), enlaces
a las guías que correspondan según el resultado y aviso con el 024 y el 112 en
las franjas altas.

**Por qué el GAD-7 y no otro.** Es el cuestionario de cribado de ansiedad más
usado en atención primaria y su uso es libre: sus autores y Pfizer lo liberaron
expresamente, «no se requiere permiso para reproducir, traducir, presentar o
distribuir». El STAI o el BAI, en cambio, son de pago y con licencia, así que
publicarlos en una web sería una infracción. La atribución completa va al pie
de la página.

**Dónde se guardan los resultados, y por qué así.** En el navegador del propio
usuario (`localStorage`), no en tu servidor. La página muestra un historial con
sus últimas doce mediciones para que pueda ver si mejora, y un botón para
borrarlo.

Esto es deliberado y te conviene: **una puntuación de ansiedad asociada a una
persona es un dato de salud**, categoría especial en el RGPD. Guardarla en tu
servidor te obligaría a base legal, consentimiento explícito, información
específica, plazos de conservación y a responder de una brecha si la hubiera —
para un dato que, sin identificar a nadie, no te sirve de nada. Tal como está,
el usuario conserva su historial, tú no asumes ningún riesgo legal y la página
lo dice claro. Si en algún momento quieres estadísticas, se puede añadir un
contador anónimo y agregado, sin respuestas individuales.

**Ampliado tras la primera versión.** Ahora la página explica por qué este
cuestionario y no uno de revista: que está construido con criterios clínicos,
validado con miles de pacientes y **baremado** —se sabe qué puntuación
corresponde a cada nivel porque se comparó con valoraciones diagnósticas
reales—, frente a los tests de internet que no miden nada.

Y se apoya en lo que de verdad le saca partido: **medirse dos veces**. El
resultado incluye un plan de tres semanas (elegir una sola guía, sostenerla,
volver a medirse) y, al repetir el test, la página compara automáticamente con
la medición anterior y dice si has bajado, subido o te mantienes, con qué
significa cada caso. Si no baja después de semanas intentándolo, el propio
texto recomienda dejar la autoayuda y consultar.

Probado en navegador: cálculo correcto en los extremos (0 y 21), aviso de
crisis solo en las franjas moderada y grave, comparación entre mediciones
correcta, historial que guarda, se pinta y se borra, y ningún error de
JavaScript.

## Página nueva: `libros-recomendados.html`

Ocho libros con una reseña honesta de cada uno, incluyendo lo discutible: el de
Van der Kolk y el de Kahneman llevan su matiz, porque recomendarlos sin más
sería vender humo. Todos los enlaces llevan tu tag de afiliado
(`conciencia07-21`) y apuntan a búsquedas por título y autor, no a fichas
concretas, para que no se rompan cuando cambie la edición.

Es además una página con intención de compra clara: quien busca «libros de
psicología recomendados» está a un paso de comprar.

## Página nueva: `donde-pedir-ayuda.html`

Recopilación de teléfonos y servicios de ayuda en España: 112, 024, Teléfono
de la Esperanza, ANAR, 016, y a dónde acudir según el caso (médico de familia,
psicología privada, servicios sociales, sindicatos, asociaciones). Todos los
teléfonos verificados con fuentes oficiales antes de publicarlos.

Es además el tipo de página que otros enlazan de forma natural, que es
justo lo que le falta al dominio.

## Buscador en `guias.html`

Con más de cincuenta guías, la paginación de ocho en ocho ya no basta: había
que pasar siete páginas para encontrar algo. Ahora hay un buscador que filtra
por título y descripción según escribes, respetando la paginación cuando el
campo está vacío. Probado en navegador: buscar «sueño» devuelve 4 guías, una
búsqueda sin resultados avisa, y al borrar vuelve la paginación normal.

## Feed RSS: `netlify/functions/feed.js` + `/feed.xml`

La web no tenía feed. Ahora publica los últimos 30 artículos en RSS 2.0 en
`psicolinks.com/feed.xml`, con la redirección puesta en `netlify.toml` y el
feed declarado en el `<head>` de la portada, el archivo y las guías.

Para qué sirve: quien te quiera seguir sin dejar su correo puede hacerlo desde
Feedly o cualquier lector; los agregadores de divulgación pueden recoger tus
artículos; y algunos boletines automáticos leen RSS. Es un canal de
distribución que hasta ahora no existía y que no cuesta mantenimiento.

Probado en local con datos simulados: XML bien formado y escapado correcto de
comillas, `&` y etiquetas dentro de los títulos.

## Página 404 propia: `404.html`

No había ninguna, así que un enlace roto mostraba la pantalla gris por defecto
de Netlify y el visitante se iba. Netlify usa automáticamente el fichero
`404.html` de la raíz, sin configurar nada.

La nueva lleva el diseño del sitio, `noindex, follow`, y en lugar de disculparse
ofrece salidas: las guías con su buscador, «empieza aquí», la portada, el
archivo y el consultorio. Y arriba del todo, un aviso con el 112 y el 024 por
si quien ha llegado ahí estaba buscando ayuda.

## Comprobado antes de entregar

72 páginas HTML con el HTML bien cerrado, `lang="es"`, datos estructurados
válidos, ningún título duplicado, ningún enlace interno roto, ningún enlace a
un PDF que no exista y ninguna página indexable sin `h1`, sin `canonical` o sin
descripción. La función `sitemap.js` ejecutada en local devuelve 65 URLs.

## Después de desplegar

1. Abre `psicolinks.com/sitemap.xml` y comprueba que ahora salen decenas de
   URLs, no cinco.
2. En Search Console **no hace falta reenviar el sitemap**: Google vuelve a
   leerlo solo. Sí merece la pena pedir indexación a mano de las cuatro guías
   nuevas.
3. Lo que de verdad falta y no se arregla con código: **enlaces desde fuera**.
   El primero, el más fácil y el más natural: uno desde concienciaconductual.com.
