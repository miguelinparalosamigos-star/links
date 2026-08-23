# Cambios sobre el repositorio `links` — 14 de agosto de 2026

estos ficheros: 108 modificados o nuevos. Ninguno toca el diseño ni el
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
| `obsesiones-y-toc.html` | TOC | Gran hueco: tenías los pensamientos intrusivos pero no las compulsiones ni la exposición con prevención de respuesta. |
| `lo-dejo-o-sigo.html` | Decidir sobre la pareja | Tenías ruptura y confianza, pero no la decisión previa, que es donde la gente pasa años. Con la excepción de violencia y el 016. |
| `ansiedad-en-el-embarazo.html` | Ansiedad prenatal | Se consulta poquísimo porque «no toca» estar mal, y predice el ánimo del posparto. |
| `no-poder-tener-hijos.html` | Infertilidad y pérdidas | Duelo repetido y sin reconocimiento social, con mucho desgaste de pareja. |
| `carga-mental.html` | Carga mental | Muy buscado y muy poco tratado con criterio. La clave: repartir responsabilidades enteras, no tareas. |
| `jubilacion.html` | Jubilación | Público con capacidad de pagar terapia y casi nadie escribe para él. |
| `autolesiones-adolescentes.html` | Autolesión (para padres) | Búsqueda desesperada y con muy mala información alrededor. Sin detalles de método y con derivación clara al 024 y al 112. |
| `diagnostico-enfermedad-grave.html` | Diagnóstico serio | Incluye el matiz sobre la presión por «ser fuerte», que hace más daño que bien. |
| `ansiedad-social.html` | Ansiedad social | Faltaba el paraguas: tenías timidez y hablar en público, pero no las conductas de seguridad ni el repaso posterior. |
| `celos-entre-hermanos.html` | Hermanos | Búsqueda constante de madres y padres, y la solución que funciona es poco intuitiva. |
| `acompanar-demencia.html` | Demencia | Público enorme y muy desatendido. El cambio de chip de no corregir a la persona. |
| `cuando-niega-el-problema.html` | Negación | Complementa juego, alcohol y depresión: qué hacer cuando el que tiene el problema no quiere ayuda. |
| `porno-y-habito-compulsivo.html` | Consumo de porno | Muy buscado, mal tratado y lleno de sermones. Aquí, sin cifras mágicas y bajando la vergüenza, que es lo que lo sostiene. |
| `adiccion-al-trabajo.html` | Adicción al trabajo | La única adicción socialmente premiada, y por eso no se ve hasta que revienta. |
| `nido-vacio.html` | Nido vacío | Duelo sin permiso social, con público de 50 y pico que sí paga terapia. |
| `hijos-adultos-que-se-alejan.html` | Distanciamiento familiar | De lo que más duele y menos se cuenta. Con el aviso de que si hubo maltrato, las reglas son otras. |

Las cuarenta y ocho están dadas de alta en `guias.html` y en el sitemap.

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

## Lo que hace que quien entre vuelva

**Bloque «Sigue por aquí» al final de las 89 guías.** Era el agujero grande de
la web: alguien llegaba desde Google a una guía, la leía y se iba, porque lo
único que había al final era un enlace genérico a la lista de guías. Ahora cada
guía termina con **tres guías relacionadas de su mismo tema**, elegidas
automáticamente por categoría, más los dos tests.

No es un detalle estético: es la diferencia entre una visita de una página y una
de tres o cuatro. Y una visita larga es la que se acuerda del sitio y vuelve.

Ejemplos reales de cómo quedan las sugerencias:

- En *Insomnio* → Dormir mejor en 7 pasos, El sueño de los niños, Menopausia.
- En *Oposiciones sin quemarte* → Poner límites, El estrés que no para, El burnout.
- En *Nido vacío* → Tu hijo adolescente lo pasa mal, Separación y cómo contárselo,
  Cuando tu hijo no quiere ir al colegio.

## Segundo test: `test-de-depresion.html` (PHQ-9)

Mismo criterio que con el de ansiedad: **PHQ-9**, el cuestionario de cribado de
depresión más usado del mundo en atención primaria, **baremado** y de uso libre
—misma liberación de Pfizer que el GAD-7, sin permiso necesario para
reproducirlo—. El ISI de insomnio o el STAI de ansiedad, que serían los otros
candidatos, son de pago y con licencia: publicarlos sería una infracción.

Nueve preguntas, cinco franjas de resultado, comparación con la medición
anterior, historial en el navegador y botón de borrado, igual que el otro.

**Con una salvaguarda importante.** La novena pregunta del PHQ-9 es la que
pregunta por pensamientos de muerte o de hacerse daño. En una web, sin un
profesional delante, eso hay que tratarlo con cuidado: la página muestra un
aviso con el **024** y el **112** **en el mismo momento** en que alguien marca
cualquier respuesta distinta de «ningún día» en esa pregunta, sin esperar al
resultado final, y lo repite en el resultado **aunque la puntuación total sea
baja**. Probado: con 1 punto total y esa pregunta marcada, el aviso aparece
igual.

## Retoques de este paquete

- **Migas de pan (BreadcrumbList) en las 94 páginas indexables.** Solo las tenían
  los artículos diarios. Es lo que hace que en Google aparezca
  «psicolinks.com › Guías › Insomnio» en vez de la URL pelada, y mejora el clic.
- **Filtros por tema en `guias.html`.** Con 87 tarjetas, el buscador se queda
  corto si no sabes qué escribir. Ahora hay botones de Ansiedad, Sueño, Hijos y
  familia, Pareja, Trabajo, Estudio, Duelo, Hábitos y Miedos que filtran al
  instante. Probado: «Pareja» devuelve 4, «Duelo» 5, y «Todas» restaura la
  paginación.
- **`cortar-pdf.html` con `noindex`.** Sigue siendo una página de maspdf.com que
  vive por error en este repositorio. Mientras decides si la borras, al menos ya
  no puede indexarse bajo tu dominio.

## Tu consulta y el test, visibles en toda la web (paquete anterior)

- **Pie de página en las 106 páginas indexables**: una línea con
  «🧪 Test de ansiedad · Consulta de psicología: Conciencia Conductual».
  Ahora no hay una sola página de Psicolinks desde la que no se llegue a tu
  consulta en un clic. Comprobado: cero páginas sin ese enlace.
- **Menú de la portada** con cuatro entradas: Guías, Test de ansiedad,
  Dónde pedir ayuda y Mi consulta.
- **Bloque destacado del test** en la portada y arriba de la página de guías:
  ya no es un enlace escondido entre tarjetas, es un recuadro con su botón
  «Hacer el test →». Era lo que faltaba: el test es lo más llamativo que tienes
  y estaba enterrado.

## Test y consulta en su sitio (paquete anterior)

- **La portada tiene menú.** Antes solo enlazaba a Guías. Ahora hay tres
  enlaces bajo el titular: Guías, Test de ansiedad y Dónde pedir ayuda.
- **El test se enlaza desde donde importa:** portada, «empieza aquí», la guía
  de ansiedad, la de dónde pedir ayuda y el pie de cada artículo diario.
- **`donde-pedir-ayuda.html` incluye tu consulta.** Un bloque de Conciencia
  Conductual con tu número de colegiado y el enlace, y —esto es a propósito— una
  línea que dice abiertamente que ahí no eres neutral porque es tu consulta, y
  que remite a la guía de cómo elegir psicólogo para quien prefiera buscar por su
  cuenta. En una página de recursos de ayuda, colar la propia consulta sin
  avisar resta credibilidad; avisando, suma.

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

## Paquete nuevo: la cadena visual del estudio, dos páginas y tu consulta en cada artículo

### Los artículos científicos ahora se ven, no solo se leen

El bloque de «cómo fue el estudio» era una lista de cuatro cajas con flechas.
Ahora cada artículo abre con **dos piezas visuales** generadas automáticamente a
partir del propio contenido, sin tocar nada a mano:

**1. La ficha del estudio.** Una fila de etiquetas con el tipo de diseño, el
número de participantes (se extrae del texto), dónde se publicó y el tiempo de
lectura. Debajo, un **medidor de cinco segmentos** con la fuerza del diseño y una
frase que explica qué se puede concluir con ese diseño y qué no.

La clasificación se deduce del texto: metaanálisis o revisión (5/5), ensayo con
grupo de control (4/5), seguimiento en el tiempo y experimento (3/5), encuesta o
correlación (2/5). No es una clasificación experta y no pretende serlo: es una
orientación honesta para que el lector sepa cuánto peso darle. El nivel más alto
nunca dice «esto es verdad», dice «esto pesa más que un estudio suelto».

**2. La cadena, paso a paso.** Los cuatro pasos de siempre —la pregunta, el
método, el hallazgo, por qué pasa— pero encadenados: círculos numerados unidos
por una línea vertical, con el hallazgo destacado. Y un **quinto eslabón nuevo**,
en naranja y con borde discontinuo: **«Cómo leerlo»**, con la advertencia
específica de ese tipo de diseño. Una correlación avisa de que ir juntas no es
causar; un ensayo avisa de que funcionó con esas personas y en esas condiciones.

Es probablemente lo que más te distingue de cualquier web que copia titulares de
estudios: aquí se dice de qué está hecho el resultado.

Probado en un navegador real con un artículo simulado, también a 390 px de ancho:
la cadena se estrecha y no desborda.

### Tu consulta al final de cada artículo

Nuevo bloque `consulta-cta` después de las guías relacionadas: quién eres, el
número de colegiado, y un botón a Conciencia Conductual. Debajo, enlaces a
«dónde pedir ayuda», «cómo elegir psicólogo» y las preguntas frecuentes, y una
línea diciendo abiertamente que ahí no eres neutral porque estás recomendando tu
propia consulta. Eso, además de ser honesto, es lo que hace que se lea como un
consejo y no como un anuncio. Los libros de afiliado siguen donde estaban.

### Página nueva: `terapia-conductual-preguntas.html`

**Ocho preguntas para hacerte tú antes de la primera cita y seis para hacerle al
psicólogo**, todas desde el análisis de la conducta: qué haces exactamente (una
etiqueta no es una conducta), qué pasa justo antes, de qué te libras justo
después, qué has dejado de hacer, cómo sabremos que mejora. En medio, el esquema
A-B-C explicado en tres cajas.

Las seis del final son las incómodas y las útiles: desde qué enfoque trabajas,
qué voy a tener que hacer entre sesiones, cuánto puede durar, cómo lo mediremos,
qué hacemos si a las X sesiones no mejora. Lleva datos estructurados `FAQPage`.

### Página nueva: `guiones-conversaciones-dificiles.html`

**Diez conversaciones con las palabras ya puestas**: pedir cita a un psicólogo por
primera vez, decirle a tu jefe que no puedes con todo, decir que no sin dar diez
explicaciones, contarle a tu pareja que estás mal, pedir que te acompañen,
responder a quien dice que ir al psicólogo es de débiles, preguntarle a tu hijo
adolescente si está mal, poner un límite a tu madre, retomar el contacto con
alguien, y pedir hora a tu médico por salud mental.

Cada guion trae la frase de entrada, qué decir si el otro insiste, y por qué está
formulado así. Es de las páginas más compartibles que puede tener la web: es algo
que la gente guarda.

Las dos quedan enlazadas desde `guias.html` (117 tarjetas), `temas.html`, el menú
de la portada y el sitemap.

### Comprobado en este paquete

144 páginas, **ningún problema y ningún aviso** en las dos revisiones: sin títulos
largos, sin descripciones pasadas, sin duplicados, sin enlaces internos rotos, sin
JSON-LD inválido, sin imágenes sin `alt`, sin páginas huérfanas y con el sitemap
cuadrando en los dos sentidos. `articulo.js` y `sitemap.js` ejecutados en local con
datos simulados; el sitemap devuelve 134 URLs. Todo revisado en Chromium, en
escritorio y en móvil, sin un solo error de JavaScript.

## Paquete nuevo: seis guías más, `temas.html` rescatada y dos fallos corregidos

### Seis guías nuevas (ya van 66)

| Guía | De qué va |
|---|---|
| `morderse-las-unas.html` | Uñas, pellejos, pelo o piel: reversión de hábitos, la técnica con más respaldo. |
| `miedo-a-vomitar.html` | Emetofobia: por qué las precauciones la mantienen y cómo recuperar por pasos. |
| `cuando-el-cuerpo-avisa.html` | Dolores o mareos con las pruebas normales: el síntoma es real y tiene abordaje. |
| `pantallas-y-adolescentes.html` | Por qué discutir por las horas no funciona; el sueño primero y normas para toda la casa. |
| `empezar-un-trabajo-nuevo.html` | Los primeros meses: preguntar pronto y no fijar expectativas imposibles. |
| `soltar-el-rencor.html` | Perdonar no es justificar ni reconciliarse: tres decisiones distintas. |

### `temas.html` estaba huérfana y desactualizada

La página «Explora por temas» existía, salía en el sitemap y estaba bien hecha,
pero **no la enlazaba ninguna página del sitio**: solo se podía llegar a ella
desde Google. Y por dentro tenía 10 temas con **3 enlaces reales a guías**; el
resto apuntaban en genérico a `/guias.html`.

Ahora tiene **14 secciones y 128 enlaces**, con todas las guías repartidas por
tema —incluidos tres temas que no existían: Miedos y fobias, Hijos y familia, y
Trabajo—, más una sección final con los dos tests, las preguntas frecuentes y
dónde pedir ayuda. Se han conservado intactos los bloques de libros con tus
enlaces de afiliado, y los temas nuevos enlazan a `libros-recomendados.html`.

Queda enlazada desde el menú de la portada y desde `guias.html`, encima de los
botones de tema.

### Dos fallos encontrados y corregidos

**1. Las guías del paquete anterior no contaban para el progreso de lectura.**
Las seis guías nuevas de ayer (entrevista, despido, misofonía, domingo, amigos,
memoria) se crearon después de repartir `progreso-psicolinks.js`, así que no lo
cargaban: leerlas no marcaba nada. Lo detectó la prueba en navegador, no la
validación de HTML. Arreglado en las 13 páginas afectadas, y **el barrido de
consistencia ahora comprueba también esto** para que no vuelva a pasar.

**2. `cortar-pdf.html` pedía dos ficheros que no existen.** Esa página es de
maspdf.com (su canonical apunta allí y está en `noindex`), pero cargaba
`cookies.js` y `mp-pro.js`, que no están en este repositorio: dos errores 404 en
cada visita. Se han quitado las dos etiquetas. Si no la necesitas en Psicolinks,
puedes borrar el fichero directamente: no afecta a nada más.

### Comprobado en este paquete

Dos revisiones distintas, las dos sin nada pendiente.

*Validación de SEO y enlaces* — 142 páginas: ningún título de más de 62
caracteres, ninguna descripción de más de 160, ningún título duplicado, ningún
enlace interno roto, ningún JSON-LD inválido, ninguna página indexable sin `h1`
ni canonical.

*Auditoría nueva, más a fondo* — ninguna imagen sin `alt`, ningún `target="_blank"`
sin `rel="noopener"`, ningún fichero enlazado que no exista, ningún `src` roto,
ningún salto de nivel de encabezado, ningún `og:image` ausente, **ninguna página
huérfana**, ninguna ruta del sitemap que no corresponda a una página real y
ninguna página indexable fuera del sitemap.

*En navegador (Chromium)* — las seis guías nuevas, `temas.html` con sus 128
enlaces comprobados uno a uno por código de respuesta, y el progreso de lectura
funcionando. Cero errores de JavaScript propios. `sitemap.js` devuelve 131 URLs y
`netlify.toml` valida como TOML.

## Paquete nuevo: seis guías más, preguntas frecuentes y menos gasto de Netlify

### Seis guías nuevas (ya van 60)

| Guía | De qué va |
|---|---|
| `la-entrevista-de-trabajo.html` | Preparar historias en vez de respuestas, ensayar en voz alta, la pregunta del sueldo. |
| `cuando-te-despiden.html` | Las semanas después de un despido: estructura del día, horario de búsqueda, números reales. |
| `misofonia-y-ruidos.html` | Masticar, sorber, respirar: por qué disparan rabia y por qué los tapones a diario empeoran. |
| `el-domingo-por-la-tarde.html` | El bajón del domingo, cerrar el viernes por escrito, y cuándo el domingo no es el problema. |
| `hacer-amigos-de-adulto.html` | Repetición antes que química: por qué de adulto hay que poner uno la logística. |
| `se-me-olvida-todo.html` | Casi todos los despistes son de atención; qué descartar con el médico y qué señales sí importan. |

### Página nueva: `preguntas-frecuentes.html`

Diez preguntas que se repiten antes de pedir la primera cita, contestadas sin
marketing: psicólogo o psiquiatra, cuánto dura una terapia, cuánto cuesta en
España, si la online funciona, la medicación, la confidencialidad, qué hacer si
no conectas con el profesional, y para qué sirven (y para qué no) los tests de
la web. Lleva datos estructurados de tipo `FAQPage`, va enlazada desde el menú
de la portada y desde la página de guías, y cierra remitiendo al consultorio y a
Conciencia Conductual.

Es una página pensada para búsquedas: son términos que la gente teclea tal cual
en Google y que ahora mismo no cubría ninguna guía.

### Filtro por temas de `guias.html`, arreglado

Los botones de tema funcionaban buscando la palabra dentro del texto de la
tarjeta, así que había guías que no salían en su propio tema: «apretar los
dientes» no aparecía en Hábitos y «misofonía» no aparecía en Miedos, porque esas
palabras no estaban escritas en la tarjeta. Ahora cada tarjeta lleva su tema
marcado (`data-temas`) y el filtro lo tiene en cuenta. Se han etiquetado 105
tarjetas y se ha añadido un botón más: **Ánimo y autoestima**.

### El enlace a la consulta, en todas las guías

En el cierre de cada guía, «Conciencia Conductual» aparecía en negrita pero sin
enlazar: había que copiar la dirección a mano. Ahora es un enlace en las **90**
guías donde aparece, además del que ya había en el pie.

### Gasto de Netlify: caché de lo que nunca cambia

`netlify.toml` ahora manda cachear un año los PDF de `/descargas` y las
imágenes, y un día los `.js`. Antes, cada visitante que volvía se descargaba
otra vez los PDF enteros y eso era ancho de banda gastado para nada. El HTML se
deja **sin cachear a propósito**, para que la portada se actualice al instante
tras cada despliegue.

Lo que **no** se ha tocado y conviene revisar juntos con la página de uso
delante: el plugin `@netlify/plugin-functions-install-core` del `netlify.toml`
es redundante, porque la única dependencia (`@netlify/blobs`) ya está en el
`package.json` de la raíz y Netlify la instala sola. Quitarlo debería recortar
el tiempo de cada compilación. No se ha quitado a ciegas porque, si me equivoco,
las funciones dejan de desplegarse y eso cuesta otro despliegue arreglarlo.

### Comprobado en este paquete

136 páginas HTML, **ningún problema**: ningún título de más de 62 caracteres,
ninguna descripción de más de 160, ningún título duplicado, ningún enlace
interno roto, ningún JSON-LD inválido, ninguna página indexable sin `h1` ni
canonical. 102 guías con el bloque «Sigue por aquí», 130 páginas con el pie de
test y consulta, 129 con migas de pan. Los once botones de tema probados uno a
uno en Chromium, sin errores de JavaScript. `netlify.toml` validado como TOML.

## Paquete nuevo: seis guías más y el progreso de lectura

### Seis guías nuevas (ya van 54)

| Guía | De qué va |
|---|---|
| `miedo-a-las-agujas.html` | La única fobia que provoca desmayos, y por qué aquí hay que tensar en vez de relajarse. Tensión aplicada paso a paso. |
| `apretar-los-dientes.html` | Bruxismo: revisión dental, posición de descanso de la mandíbula y el estrés de debajo. |
| `limites-con-tus-padres.html` | Poner límites a un padre o una madre sin romper: en primera persona, en frío, y qué hacer con la culpa. |
| `miedo-a-la-muerte.html` | Por qué buscar tranquilidad lo empeora, y el rato fijo de preocupación. |
| `cuando-recaes.html` | La frase que convierte un resbalón en abandono, y cómo acortar la vuelta. |
| `llevarte-mejor-con-tu-cuerpo.html` | Imagen corporal: cortar comprobaciones y comparaciones y dejar de evitar. |

Todas con la misma plantilla: título de 62 caracteres o menos, descripción de
160 o menos, un solo `h1`, canonical, JSON-LD de artículo y de migas de pan,
bloque «Sigue por aquí» con tres guías del mismo tema y los dos tests, y pie con
el enlace a Conciencia Conductual. Registradas en `guias.html` (102 tarjetas) y
añadidas a `PAGINAS_FIJAS` de `sitemap.js` (118 URLs).

### Nuevo: progreso de lectura — `progreso-psicolinks.js`

Lo que más hace volver a alguien a un sitio de guías es saber por dónde iba.
Este fichero, de unas 5 KB y sin ninguna dependencia, hace tres cosas:

1. **Marca las guías leídas.** Al abrir una guía, guarda su dirección y su
   título en el navegador del visitante.
2. **En `guias.html`**, pone arriba una barra con «Llevas N de 92 guías leídas»,
   marca con un ✓ las tarjetas ya vistas y sugiere una concreta que le falte.
3. **En la portada**, si hay historial, aparece al final un bloque «Sigue donde
   lo dejaste» con las tres últimas.

Dos cosas importantes: **no hay servidor de por medio** —es `localStorage`, no
gasta funciones de Netlify ni ancho de banda— y hay un botón **«Borrar mi
progreso»** a la vista. Si el navegador va en modo privado o bloquea el
almacenamiento, el script no falla: simplemente no muestra nada.

Los estilos los inyecta el propio script, así que no hubo que tocar el CSS de
las 129 páginas.

### Política de privacidad actualizada

`privacidad.html` explica ahora, en el punto 6, las dos cosas que se guardan en
el navegador y que nunca salen de él: los resultados de los tests (que son datos
de salud y por eso se decidió expresamente no guardarlos en ningún servidor) y
la lista de guías leídas, cada una con su botón de borrado.

### Comprobado en este paquete

129 páginas HTML, **ningún problema**: ningún título de más de 62 caracteres,
ninguna descripción de más de 160, ningún título duplicado, ningún enlace
interno roto, ningún JSON-LD inválido y ninguna página indexable sin `h1` ni
canonical. 95 guías con el bloque «Sigue por aquí», 123 páginas con el pie de
test y consulta, 122 con migas de pan. Las seis guías nuevas y el progreso de
lectura, probados en un navegador de verdad (Chromium): el contador, el ✓ de
leída, la sugerencia, el bloque de la portada y el botón de borrar funcionan, y
no hay ni un error de JavaScript propio. `sitemap.js` ejecutado en local
devuelve 118 URLs con las seis nuevas dentro.


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
