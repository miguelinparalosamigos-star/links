# Cambios sobre el repositorio `links` — 14 de agosto de 2026

55 ficheros: 34 modificados y 22 nuevos. Ninguno toca el diseño ni el
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

Las dieciséis están dadas de alta en `guias.html` y en el sitemap.

## Dos páginas internas nuevas (no son contenido, son herramientas)

- **`redes.html`** — coge los últimos artículos publicados y los convierte en
  texto listo para pegar, en dos versiones: una larga para LinkedIn y una corta
  para Threads, X o Bluesky. Con botón de copiar.
- **`imagen-redes.html`** — genera la imagen de 1200×630 con el titular y el
  estilo de Psicolinks, y la descarga en PNG. Es la medida de la imagen de
  enlace en Facebook y LinkedIn.

Las dos llevan `noindex, nofollow` y no están enlazadas desde ninguna parte de
la web: solo existen si escribes la dirección. Tampoco están en el sitemap.

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
