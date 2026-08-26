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

## Paquete nuevo: «Tus resultados», dos guías de compra y cinco guías

### Esta vez no hay test nuevo, y te explico por qué

He llegado al final de los cuestionarios que se pueden reproducir legalmente sin
pedir permiso. Este paquete iba a llevar uno más y he descartado los tres
candidatos, cada uno con su motivo:

- **PSC-17** (síntomas en niños) — el formulario lleva «© 1998, M. Jellinek &
  J.M. Murphy, Massachusetts General Hospital» y ninguna cesión escrita.
- **Escala de Insomnio de Atenas** — habría sido perfecta para tu tema más
  fuerte, pero se distribuye a través de Mapi Research Trust, el mismo
  organismo que gatea el PSS-10 que ya descartamos.
- **ASRS de TDAH** y **EPDS de posparto**, descartados en el paquete anterior
  por lo mismo.

Los nueve que tienes cubren las cuatro familias que sí son libres: la de Pfizer
(PHQ-9, GAD-7, PHQ-15, PHQ-4 y el módulo de pánico), la de la OMS (AUDIT y
AUDIT-C), la del gobierno de EE. UU. (PC-PTSD-5) y el Fagerström, que el NIDA
autoriza expresamente. **Prefiero decirte esto a colarte un décimo test con la
licencia en duda después de haber rechazado cinco por ese mismo motivo.**

### Lo que he hecho en su lugar, que rinde más

**`mis-resultados.html`** — una página que junta **todos los tests que la
persona haya hecho**, con su evolución. Porque un test suelto dice poco y la
comparación contigo mismo dice bastante, y hasta ahora esa comparación había que
buscarla test por test.

Muestra, por cada uno: la última puntuación con su nivel, cuántas veces lo ha
hecho, un gráfico de las últimas diez mediciones y una frase que dice si ha
subido o bajado respecto a la anterior y qué significa eso *en ese test*
concreto (en el de alcohol subir es «más consumo»; en el de ansiedad, «más
ansiedad»). Debajo, los tests que todavía no ha hecho, para que sepa cuáles le
faltan sin tener que ir a buscarlos.

Y hace algo por ti que ningún test hace: **es una razón para volver**. Quien se
mide cada dos semanas vuelve cada dos semanas.

Todo se lee de `localStorage`, igual que ya hacían los tests: **no hay servidor,
no hay cuenta y no sale nada del dispositivo**. La página lo dice con todas las
letras, porque es justo lo que hace que alguien se atreva a hacer un test de
depresión en una web.

Probado con historiales simulados, incluido **un dato corrupto a propósito**
(texto que no es JSON en una de las claves): la página lo ignora y sigue
funcionando. Y el botón de borrar pide confirmación en dos pasos y respeta el
registro A-B-C, que se borra desde su propia página.

### Dos guías de compra

| Guía | De qué va |
|---|---|
| `cosas-para-el-tdah-en-adultos.html` | La regla que ordena todo: lo que se guarda en un cajón deja de existir. Y por qué la aplicación de tareas número catorce no es la respuesta —cualquier sistema que haya que *abrir* compite con el olvido—. |
| `cosas-para-el-dolor-cronico.html` | El calor y el cojín lumbar sí. El colchón de mil euros, las pulseras magnéticas y el colágeno, no. Y una advertencia sobre los TENS comprados sin preguntar, que tienen contraindicaciones reales. |

En la de TDAH hay un apartado que no verás en ninguna guía de compras: el aviso
sobre la **compra impulsiva de madrugada**, que es de las consecuencias más caras
del TDAH y que casi nadie conecta con él. Recomendar quitar las tarjetas
guardadas del navegador, en una página con enlaces de afiliado, es lo correcto
aunque juegue en contra.

### Cinco guías más

| Guía | De qué va |
|---|---|
| `dejar-el-movil-por-la-noche.html` | No es fuerza de voluntad: es que está a treinta centímetros. Y por qué el modo noche no arregla lo importante, que es el contenido y no la luz azul. |
| `cuando-tu-hijo-se-va-de-casa.html` | No echas de menos solo a tu hijo: también a quien eras cuando estaba. |
| `cuando-te-comparan-con-otros.html` | La comparación dice más de quien la hace. Qué contestar sin bronca, y cuándo la voz que compara ya es la tuya. |
| `volver-a-salir-despues-de-mucho-tiempo.html` | La confianza llega después de salir, no antes. Y la amistad de adulto llega por repetición, no por química. |
| `no-me-toman-en-serio.html` | Los preámbulos que le quitan peso a lo que dices antes de decirlo, por qué las pausas dan más autoridad que las razones, y cuándo el problema no es tuyo. |

### Perfilando

- Un **salto de encabezado** (h1 → h3) en la página nueva, que detectó la
  auditoría y está corregido.
- Las tres páginas nuevas, incorporadas al mapa de temas de `guias.html`, así que
  los doce filtros siguen cuadrando exactamente: 21 y 21, 35 y 35, 29 y 29.
- Las cifras del sitio, resincronizadas: **200 guías y 9 tests**.

### Comprobado antes de entregar

245 páginas sin un solo problema de validación ni de auditoría. **233 enlaces
internos distintos comprobados pidiéndolos de verdad: cero rotos.** Los doce
filtros pulsados uno a uno. Y ni un enlace de Amazon sin tu etiqueta, de 135.

## Paquete nuevo: los filtros de las guías arreglados, dos tests, dos guías de compra y cinco guías

### Perfilando: tres desajustes que se habían ido acumulando

**1. Las cifras que la web dice de sí misma estaban desfasadas.** `terapia-online.html`
—la página que vende tu consulta— decía «las 142 guías» cuando ya eran casi
doscientas, y la plantilla de artículo decía «ciento cuarenta y ocho». Una cifra
que no cuadra en la página donde pides cita es de lo primero que un lector
comprueba. Además, `temas.html` decía «213 guías» cuando 213 era el número de
enlaces (una guía puede estar en dos temas).

Arreglado, y con un guión nuevo (`sincronizar_cifras.py`) que cuenta lo que hay
y reescribe esas frases después de cada tanda. **Y usa exactamente la misma
regla de conteo que el índice A-Z**, para que los dos números no puedan volver a
discrepar.

*Nota honesta: la primera versión de ese guión era demasiado bruta y me cambió
«mira también los otros dos tests» por «los otros siete tests» en una página.
Lo vi al revisar el diff, lo restauré y acoté el patrón. Está comentado en el
propio guión.*

**2. Los filtros de `guias.html` no cuadraban con nada.** Las tarjetas se habían
ido etiquetando a mano tanda tras tanda y había **quince etiquetas distintas
para trece temas**, con duplicados reales —«miedo» y «miedos», «familia» e
«hijo»— que partían en dos las guías de esos temas. Arriba solo había **ocho
botones**, así que temas enteros del sitio no tenían filtro. Y **56 tarjetas no
tenían etiqueta ninguna**: no respondían a ningún filtro.

Ahora la categoría de cada tarjeta sale del mismo mapa que usa el barrido y el
reparto de enlaces internos, hay **doce filtros** con icono, y cada uno lleva su
número.

**3. Y el filtro contaba mal.** Los botones metían su palabra en el buscador, que
busca en el texto entero de la tarjeta. Resultado: «Tests y herramientas» decía
9 y encontraba **48** —cualquier guía cuya descripción llevara la palabra
«herramientas»—. Ahora el filtro por tema es una coincidencia exacta, y el número
del botón **se cuenta al cargar la página** en vez de venir escrito, así que el
botón y el resultado no pueden discrepar nunca. Los doce comprobados uno a uno:
21 y 21, 33 y 33, 28 y 28, y así.

### Dos tests más, los dos limpios

| Test | Por qué es libre |
|---|---|
| **Módulo de pánico del PHQ** · `test-de-ataques-de-panico.html` | Mismo pie que el resto de la familia: «No permission required to reproduce, translate, display or distribute». |
| **AUDIT-C** · `test-rapido-alcohol.html` | Son los tres primeros ítems del AUDIT de la OMS, que ya está en la web y es de dominio público. |

El de pánico hace una distinción que no hacía ninguna página del sitio: **tener
un ataque de pánico y tener un trastorno de pánico no son lo mismo**. Empieza con
una pregunta previa —si no has tenido ataques, no se te hacen las demás— y dice
antes que nada que un ataque es horrible y no es peligroso.

*Una nota sobre los ítems: de este módulo circulan dos versiones, una con once
síntomas y otra con cuatro preguntas y una de síntomas. He reproducido
exactamente la que pude verificar palabra por palabra en dos formularios
publicados. Inventar los once ítems de memoria en un instrumento clínico no era
una opción.*

### Dos guías de compra

| Guía | De qué va |
|---|---|
| `cosas-primeras-semanas-con-un-bebe.html` | Los turnos de noche por escrito protegen más que cualquier compra. Y por qué los monitores de respiración **no** están recomendados por las sociedades pediátricas. |
| `cosas-para-tus-padres-mayores.html` | Las caídas se previenen con cuarenta euros de luz y asideros. Y una llamada al ayuntamiento que ahorra más dinero que toda la página: mucha gente paga por su cuenta la teleasistencia a la que tiene derecho. |

### Cinco guías más

| Guía | De qué va |
|---|---|
| `miedo-al-miedo.html` | Después de dos o tres ataques, el problema pasa a ser esperarlos. Cómo se desmonta esa espera. |
| `volver-a-confiar-en-tu-cuerpo.html` | Tras un infarto, un cáncer o una operación. Por qué más pruebas no cierran la duda y qué acordar con tu médico. |
| `decir-que-no-en-el-trabajo.html` | La frase para ganar veinte minutos, y por qué enseñar la lista funciona mejor que decir que vas agobiado. |
| `mudarse-a-otro-pais.html` | La cuesta no llega el primer mes: llega al tercero. Y qué hace que un sitio deje de ser ajeno. |
| `no-me-gusta-mi-trabajo-y-no-puedo-dejarlo.html` | Lo que hunde no es el trabajo malo: es creer que es para siempre. |

Y **seis desambiguaciones nuevas** para las parejas de guías que empezaban a
solaparse: buscar síntomas ↔ volver a confiar en tu cuerpo, no soporto mi trabajo
↔ no puedo dejarlo, y el ataque de pánico ↔ el miedo al miedo.

### Comprobado antes de entregar

237 páginas sin un solo problema de validación ni de auditoría. Los dos tests
nuevos probados con todos los tramos, incluida la pregunta previa del de pánico
contestada que sí y que no, y el umbral exacto del AUDIT-C. Los doce filtros de
guias.html pulsados uno a uno comprobando que el número del botón coincide con el
resultado. **225 enlaces internos distintos comprobados pidiéndolos de verdad:
cero rotos.** Y ni un enlace de Amazon sin tu etiqueta.

## Paquete nuevo: la newsletter arreglada (había dos fallos gordos), dos tests, dos guías de compra y cuatro de ayuda

### Me pediste que comprobara la newsletter, y menos mal

Encontré **dos fallos que la dejaban inservible**. No eran cosméticos: significaban
que **cualquiera que se hubiera apuntado en la portada no habría recibido nunca
nada, y encima no habría podido darse de baja**.

**Fallo 1: el alta se guardaba con una clave que la baja no sabía buscar.**
`suscribir.js` guardaba cada registro bajo el hash SHA-256 del correo.
`unsubscribe.js` busca por el correo tal cual. Nunca se habrían encontrado: el
enlace de «darme de baja» habría fallado siempre. Eso, además de un fallo, es un
problema de RGPD.

**Fallo 2: no se guardaba el token de baja, y el envío salta a quien no lo tiene.**
La rutina de envío tiene esta línea: `if (!suscriptor?.email || !suscriptor?.token) continue;`.
Como `suscribir.js` no generaba token, **todos los suscriptores de la portada se
habrían saltado, uno por uno, en silencio**. Habrías tenido correos guardados y
cero envíos, sin ningún error en ningún sitio.

Los dos están corregidos: la clave es ahora el correo y se genera token en el alta.
Y los registros antiguos que se guardaron mal **se reparan solos**: el boletín
semanal los detecta, les pone token, los reescribe con la clave buena y borra el
registro viejo.

### El boletín de los domingos, que no existía

No había ningún envío semanal. El boletín salía desde `fetch-studies` **de lunes
a viernes**, un correo por cada día de publicación. Tú lo querías semanal y en
domingo, así que:

- Nueva función **`netlify/functions/boletin-semanal.js`**, con horario
  `0 8 * * 0`: **domingos a las 08:00 UTC** (las 10 en España en verano, las 9 en
  invierno). Recoge los artículos de los últimos siete días y manda **un solo
  correo** con todos.
- El envío diario de `fetch-studies` **desactivado**, para que no lleguen
  correos duplicados. El código se queda ahí, comentado, por si algún día
  quisieras volver al aviso diario.
- Cada correo lleva **solo el enlace de baja de esa persona**: nadie puede darse
  de baja en nombre de otro ni ve el correo de los demás.
- Los enlaces del boletín iban a `post.html`, que lleva `noindex` y se pinta con
  JavaScript. Ahora van a la URL limpia del artículo.
- Las plantillas de correo no declaraban la codificación, así que los acentos
  podían llegar rotos («cÃ³mo» en vez de «cómo»). Arreglado en las tres.

**Para probarlo sin esperar al domingo**, con tu clave de administración:

    /.netlify/functions/boletin-semanal?clave=TU_ADMIN_PASSPHRASE&prueba=1

Con `prueba=1` calcula todo y **no envía**: te dice a cuántos habría escrito y con
qué asunto. Quitando `prueba=1`, envía de verdad.

### El regalo al registrarse: ahora por partida doble

Ya funcionaba en la página (los cinco PDF aparecen al instante, sin depender de
ningún correo). Ahora, **además**, se manda un correo de bienvenida con esos
mismos cinco enlaces, para que los tenga guardados. Si el envío falla o no está
configurado, **el alta funciona igual y el pack se entrega igual**: el correo es
un extra, nunca un requisito.

### Lo único que falta, y depende de ti

Para que salga un solo correo hacen falta dos cosas en Netlify, y ninguna la
puedo hacer yo:

1. **`RESEND_API_KEY`** en Site configuration → Environment variables, con una
   clave de resend.com.
2. **El dominio psicolinks.com verificado dentro de Resend**, para poder enviar
   desde `novedades@psicolinks.com`.

Sin la primera, todo se ejecuta, deja escrito en el log lo que habría hecho y no
manda nada. No falla ni rompe nada.

### Comprobado con una simulación completa: 42 verificaciones, todas en verde

Monté un almacén de Netlify y una API de Resend falsos y pasé el circuito entero:
alta correcta, correo inválido, sin consentimiento, honeypot con un bot, alta
duplicada, generación y conservación del token, correo de bienvenida con los
cinco PDF (comprobando que los cinco ficheros existen de verdad), Resend
devolviendo error, registros antiguos rotos reparándose, el boletín del domingo
dejando fuera un artículo de hace un mes, tokens distintos por suscriptor, sin
`RESEND_API_KEY`, semana sin artículos, baja con token inventado, baja correcta,
y comprobar que quien se ha dado de baja ya no recibe el siguiente.

### Dos tests más, los dos limpios

| Test | Por qué es libre |
|---|---|
| **Fagerström** · `test-de-dependencia-del-tabaco.html` | El repositorio oficial del NIDA (EE. UU.) dice: «copyrighted by Taylor and Francis Ltd., **but may be reproduced without permission**». |
| **PHQ-4** · `test-rapido-ansiedad-depresion.html` | Los cuatro ítems son del GAD-7 y el PHQ-9, con el mismo pie de Pfizer: «No permission required». |

El PHQ-4 son treinta segundos y hace algo que no hacía ningún otro: **te dice por
cuál de los tests largos empezar**, calculando por separado el bloque de ansiedad
y el de ánimo.

**Descartados**, y esta vez dolió: el **ASRS v1.1** de TDAH en adultos habría sido
el de más tráfico de todos, pero pone «COPYRIGHT © 2003 World Health
Organization. All rights reserved» y hace falta permiso. Y la **EPDS** de
depresión posparto, porque las copias que circulan dicen «Reproduced with
permission», que es permiso para esa copia, no una licencia abierta.

### Dos guías de compra y cuatro de ayuda

| Página | De qué va |
|---|---|
| `cosas-para-dejar-de-fumar.html` | Los sustitutivos van en la farmacia y **no los enlazo a propósito**: la dosis la ajusta el farmacéutico. Qué sí comprar para las manos, la boca y los tres primeros días. |
| `cosas-para-que-estudie-mejor.html` | La lámpara, el reposapiés y un despertador de diez euros para sacar el móvil de la mesa. Y por qué el escritorio regulable caro es lo que menos cambia. |
| `acompanar-a-alguien-en-terapia.html` | Por qué no preguntar qué ha contado, por qué al principio se está peor y en qué ayudar para que no la abandone. |
| `hablar-con-alguien-que-bebe-demasiado.html` | Hechos con fecha en vez de etiquetas, y por qué dejar de tapar las consecuencias es lo más difícil y lo más importante. |
| `que-decir-a-alguien-en-duelo.html` | Nombra al que ha muerto. Las frases que consuelan solo a quien las dice, y volver al mes y a los seis. |
| `ayudar-a-alguien-que-no-quiere-ayuda.html` | Insistir crea resistencia. Preguntar en vez de convencer, y la diferencia entre un límite y un ultimátum. |

### Comprobado antes de entregar

228 páginas sin un solo problema de validación ni de auditoría. Los dos tests
nuevos probados en navegador con todos los tramos de puntuación, incluidas las
subescalas del PHQ-4 en sus cuatro combinaciones. **Los 198 enlaces del índice
comprobados uno a uno pidiéndolos de verdad: cero rotos.** Los ocho botones de la
página de Tests, los ocho a 200. Y ningún enlace de Amazon sin tu etiqueta.

## Paquete nuevo: dos tests más, dos guías de compra y cuatro guías

### Dos tests nuevos, los dos limpios de derechos

| Test | Qué mide | Por qué es libre |
|---|---|---|
| **PHQ-15** · `test-de-sintomas-fisicos.html` | Dolores, mareos, palpitaciones, digestiones y cansancio: cuánto te están molestando. | El formulario original lleva impreso «Copyright Pfizer Inc. **No permission required** to reproduce, translate, display, or distribute». Misma familia y misma licencia que el PHQ-9 y el GAD-7 que ya tienes. |
| **PC-PTSD-5** · `test-de-estres-postraumatico.html` | Cribado de estrés postraumático: cinco preguntas de sí o no, corte en 3. | Lo desarrolló el National Center for PTSD, del Departamento de Veteranos de EE. UU. Las obras de agencias federales estadounidenses son de dominio público por ley y el organismo lo distribuye libremente. |

**Y lo que he descartado, que también importa:**

- **PSS-10** (estrés percibido, de Cohen) — habría sido el más goloso, porque «test de estrés» se busca muchísimo. Pero lleva «All rights reserved» y los permisos se piden a Mapi Research Trust. No es libre.
- **WHO-5** (bienestar, de la OMS) — licencia Creative Commons **BY-NC-SA**: prohíbe el uso comercial y obliga a licenciar igual lo derivado. Con una web que lleva enlaces de afiliado eso es zona gris, y aquí no queremos zona gris.
- **CBI** (burnout, de Copenhague) — «test de burnout» es otro término con mucho tráfico, y muchas fuentes secundarias dicen que es de dominio público, pero no he encontrado la declaración original de los autores. Mismo criterio con el que se descartó la escala de Rosenberg en su día. Si quieres este, la vía es comprobar tú la licencia y me lo dices.

**Detalles del PC-PTSD-5, que es delicado.** Empieza con una **pregunta previa**: si la persona dice que no ha vivido ningún suceso de ese tipo, las cinco preguntas ni se le enseñan. Lleva el aviso del **024** y el **112** antes de empezar, no al final. Y el texto del resultado positivo dice lo que hay que decir: que un cribado no es un diagnóstico y que el estrés postraumático es de los problemas que mejor responden al tratamiento.

**Detalles del PHQ-15.** Lo primero que se lee es que un resultado alto **no** significa que los síntomas sean imaginarios, y que el orden correcto es médico primero. Las dos preguntas que no aplican a todo el mundo —la de la regla y la de las relaciones sexuales— llevan opción «no me aplica» que puntúa cero, con la nota de que en la versión original el máximo para hombres es 28.

La página de Tests gana un apartado nuevo, **«Cuerpo y sucesos duros»**, así que siguen estando todos en un solo sitio.

### Dos guías de compra más

| Guía | De qué va |
|---|---|
| `que-regalar-a-alguien-que-lo-pasa-mal.html` | Comida hecha, algo para las noches, algo que ocupe las manos. Y los cuatro regalos con buena intención que sientan mal, empezando por cualquier cosa con una frase motivadora impresa. |
| `trabajar-en-casa-sin-reventar.html` | La pantalla a la altura de los ojos por quince euros, el apoyo lumbar, el temporizador para levantarte. Y por qué la mesa regulable de cientos de euros no es lo primero. |

Mismo criterio que las anteriores: enlaces de búsqueda con tu etiqueta `conciencia07-21`, `rel="sponsored"`, aviso de afiliación, y un apartado largo de lo que **no** comprar. En la de regalos, ese apartado empieza diciendo que lo que más se agradece es gratis.

### Cuatro guías más (ya van 169)

| Guía | De qué va |
|---|---|
| `no-puedo-llorar.html` | No llorar no mide cuánto te importa algo. De dónde viene el bloqueo, por qué perseguirlo lo impide y cómo distinguirlo de un apagón general. |
| `compararte-en-redes-sociales.html` | Comparas tu detrás con el escaparate de otro. El problema no es el tiempo de pantalla: son cinco cuentas concretas. |
| `problemas-con-mis-hermanos.html` | Por qué seguís en los papeles de hace treinta años, qué hay debajo de las discusiones y la distancia media entre aguantar y cortar. |
| `no-tengo-tiempo-para-nada.html` | Casi nunca es organizarse mal: es haber dicho que sí a más de lo que cabe. Y cuándo no es falta de tiempo sino falta de energía. |

### Comprobado antes de entregar

220 páginas sin un solo problema de validación ni de auditoría. Ortografía repasada: las 71 palabras fuera del diccionario son todas legítimas (los términos ingleses de las citas de copyright, y palabras como «teletrabajas», «tragaperras» o «táper»).

Los dos tests, probados en un navegador de verdad con todos los casos: puntuación mínima, máxima, el corte exacto en 3 del PC-PTSD-5, la pregunta previa contestada que sí y que no, el historial guardándose y el aviso saliendo solo cuando toca. Comprobado también que en toda la web no queda **ni un enlace de Amazon sin tu etiqueta ni ninguno roto** — son 133 en total.

## Paquete nuevo: dos guías de compra, la captación de correos y cuatro guías más

### Lo del Schema: te lo habían vendido más caro de lo que es

Me preguntaste si marcar el contenido como `ScholarlyArticle` o
`MedicalWebPage` ayuda a ganar autoridad de dominio más rápido. La respuesta
honesta es que **no**, y conviene que quede escrito:

- Google dice en su propia documentación que los datos estructurados sirven
  para **cómo apareces** en los resultados, no para **dónde** apareces. No son
  un factor de posicionamiento.
- «Autoridad de dominio» no es una métrica de Google: es de Moz.
- Y en la lista oficial de tipos que Google admite para resultados
  enriquecidos, `ScholarlyArticle`, `MedicalWebPage` y `MedicalEntity` **no
  están**. No van a producir ningún adorno visible en los resultados.

Aun así lo he puesto, porque es barato y porque **es verdad**: describe lo que
son esas páginas. `MedicalWebPage` va en las **128 páginas que de verdad son
contenido de salud** —ansiedad, miedos, ánimo, sueño, estrés, hábitos, duelo,
los tests y las dos guías de compra— con la condición de la que tratan, el
público (pacientes), la fecha de revisión y tu firma como revisor colegiado.
No lo he puesto en las guías de pareja ni de familia: una guía sobre discutir
mejor no es una página médica, y llenar la web de etiquetas que no describen
nada es justo lo que hace que las etiquetas dejen de valer.

En los artículos diarios **no** he puesto `ScholarlyArticle`: un resumen de un
estudio no es un artículo científico, y decir que lo es sería falso. Lo que sí
he añadido es `citation` con el enlace y el PMID del estudio original, que es
lo que describe de verdad esa página.

### Dos guías de compra nuevas

| Guía | De qué va |
|---|---|
| `cosas-que-ayudan-con-la-ansiedad.html` | La libreta para el rato de preocupación, el despertador que saca el móvil de la habitación, el temporizador y lo que hace falta para moverse. |
| `cosas-que-ayudan-cuando-estas-bajo.html` | La lámpara de 10.000 lux, el despertador de luz, la agenda de papel para la activación conductual y el pastillero. |

Las dos empiezan diciendo con todas las letras que **ningún objeto trata la
ansiedad ni la depresión**, y las dos tienen un apartado de **«lo que no te
recomiendo comprar»** que es la mitad de la página. Ahí van, entre otros:

- **Pulsioxímetros y relojes que miden pulsaciones**, en la de ansiedad: cada
  medición es una comprobación, y comprobar es exactamente lo que la mantiene.
- **La hierba de San Juan (hipérico)**, en la de ánimo, con el aviso de que
  interacciona con antidepresivos, anticonceptivos y anticoagulantes. Eso es
  información de seguridad real y casi ninguna guía de compras la da.

Ese apartado es lo que hace que una guía de compras se lea como un consejo y
no como un anuncio — y es, en la práctica, lo que hace que la gente se fíe lo
bastante como para pinchar en lo que sí recomiendas.

**Sobre los enlaces:** todos son de búsqueda (`amazon.es/s?k=...`), no de
producto concreto. No me he inventado ni un código de artículo: un enlace
directo que lleva a otra cosa o a nada hace más daño que bien en una web que
se sostiene sobre la credibilidad. Si un día quieres fijar un modelo que hayas
comprobado tú, se cambia el enlace y ya está. Todos llevan tu etiqueta
`conciencia07-21`, `rel="sponsored"` y el aviso obligatorio.

### La captación de correos, solo en la portada y funcionando de verdad

**Dónde está.** El cajetín se ha quitado de las 168 páginas donde estaba y se
ha puesto **solo en la portada**, debajo de los artículos. Esas 168 páginas,
además, dejan de pedir un fichero JavaScript que ya no iban a usar. Y por si
acaso, el propio script se borra solo si aparece fuera de la portada.

**Qué se regala.** El *pack de inicio*: cinco guías en PDF (calmar la ansiedad,
dormir mejor en 7 pasos, cuando no tienes ganas de nada, deja de darle vueltas
y crear hábitos que duren).

**Y esto es lo importante: el pack se entrega EN EL ACTO.** En cuanto la
persona deja el correo, los cinco enlaces aparecen ahí mismo, en la misma
página. No depende de que salga ningún correo. Por eso esto **sí funciona
desde el primer día**, que era justo lo que te fallaba antes.

Probado de punta a punta contra una función simulada: correo inválido, casilla
sin marcar, alta correcta, los cinco PDF descargándose de verdad (200 y su
tamaño), y el cajetín ausente en las guías.

**Lo único que sigue sin funcionar, y te lo digo claro:** el correo periódico.
Para que salga hace falta la variable `RESEND_API_KEY` en Netlify
(Site configuration → Environment variables). Sin ella, `fetch-studies.js` te
deja un aviso en el log y no manda nada. Los correos se guardan igual y los ves
en `admin-suscriptores.html`. Por eso el texto del cajetín promete el pack —que
sí se cumple— y solo dice «te aviso cuando publique algo», sin prometer
periodicidad.

**Un detalle honesto:** las cinco guías del pack están también en abierto en el
sitio, y el propio cajetín lo dice. El pack es comodidad, no exclusividad.
Prefiero eso a que alguien se sienta engañado.

### Cuatro guías más (ya van 165)

| Guía | De qué va |
|---|---|
| `cafeina-y-ansiedad.html` | La cafeína produce los mismos síntomas que la ansiedad. El total real del día, la hora de corte y el círculo café-mal sueño-más café. |
| `duermo-demasiado.html` | Dormir de más es señal, no causa. Qué descartar con el médico y por qué se recorta el tiempo en la cama, no se alarga. |
| `me-cuesta-pedir-ayuda.html` | Damos por hecho que nos dirán que no, y está medido que nos equivocamos. Pedir concreto, pequeño y sin disculparse. |
| `si-alguien-te-dice-que-quiere-morir.html` | Preguntar directamente no da la idea. Qué decir, por qué no prometer secreto y a quién llamar hoy. |

La última es delicada y está escrita con cuidado: el **024** y el **112**
aparecen en el primer 8% de la página, antes que ninguna otra cosa.

### Comprobado antes de entregar

212 páginas sin un solo problema de validación ni de auditoría. Ortografía
repasada: 54 palabras fuera del diccionario, todas legítimas (hipérico,
inmunosupresores, neuroestimulación, parafarmacia y demás). Comprobado además,
en todo el sitio, que **no queda ni un enlace de Amazon sin tu etiqueta ni
ninguno roto** — de hecho el corrector pilló tres enlaces de búsqueda vacíos
que se habían colado en los bloques de «no compres esto», y están arreglados.

## Paquete nuevo: «Explora por temas» con cara, y siete guías más

### La rejilla de temas

Al entrar en «Explora por temas» lo primero que se ve ahora es una rejilla de
tarjetas: un icono grande, el nombre del tema y cuántas guías tiene cada uno.
De un vistazo se ve qué hay y cuánto hay. Antes había una fila de enlaces de
texto que no decía nada.

| | Tema | |
|---|---|---|
| 🧠 | Ansiedad | 🧩 Autoestima |
| 😔 | Depresión y ánimo | 😴 Sueño |
| ❤️ | Pareja | 🔥 Estrés y burnout |
| 👨‍👩‍👧 | Familia | 😰 Miedos |
| 🎯 | Concentración | 🧘 Calma |
| 🕊️ | Duelo | 📚 Memoria y estudio |
| 🏃 | Cuerpo | 🧪 Tests |

Cada sección lleva además su icono junto al título. Y dos secciones se han
renombrado para que digan las palabras que la gente busca de verdad:
«Ánimo y emociones» pasa a **«Ánimo, depresión y emociones»**, y «Trabajo» pasa
a **«Trabajo, estrés y burnout»**.

Los recuentos de cada tarjeta se calculan solos al generar la página, así que no
se van a quedar desfasados como estaba el «124 enlaces» de la entradilla —que
ahora dice el número correcto, 191.

### Siete guías nuevas (ya van 161)

| Guía | De qué va |
|---|---|
| `no-puedo-parar-de-pensar-por-la-noche.html` | No piensas más de noche: es que por primera vez no hay nada que tape el ruido. El rato de preocupación a otra hora, y qué hacer a las tres de la mañana. |
| `no-se-que-hacer-con-mi-vida.html` | La pregunta está mal hecha. La vocación no se encuentra pensando: se construye probando. Y cuándo esto es en realidad un bajón. |
| `no-me-gusta-mi-cuerpo.html` | Comprobar y comparar son los dos hábitos que empeoran la imagen corporal. Cómo cortarlos y qué objetivo poner en su lugar. |
| `buscar-sintomas-en-internet.html` | Cada búsqueda calma unos minutos y deja dos miedos nuevos. Por qué pedir tranquilidad a otros es la misma conducta. |
| `mi-hijo-me-contesta-mal.html` | No entrar al trapo, volver después en frío, tener pocas normas, y cómo distinguir la edad de que algo va mal de verdad. |
| `volver-al-trabajo-en-septiembre.html` | El bajón de la vuelta no es un síndrome: es un contraste. Qué hacer los días de antes y por qué no decidir nada la primera semana. |
| `perdonarse-a-uno-mismo.html` | Perdonarse no es quitarle importancia. Culpa frente a vergüenza, qué reparar, y por qué repasar no repara. |

Todas registradas en `guias.html`, `temas.html`, el índice A-Z y `sitemap.js`.

### Cinco parejas más desambiguadas

La auditoría encontró tres parejas nuevas que se solapaban por encima del 30%:
`no-siento-nada` ↔ `me-siento-vacio`, `dejar-de-complacer-a-todos` ↔
`poner-limites` y `porno-y-habito-compulsivo` ↔ `compras-compulsivas`. Cada una
lleva ya su línea de «si lo tuyo es esto otro, la guía que buscas es…».

### Una falta de ortografía, encontrada y corregida

`comprobes` en lugar de `compruebes`, en la guía de buscar síntomas. Es
exactamente el tipo de cosa que te preocupaba: el corrector la pilló antes de
que llegara a la web.

### Comprobado antes de entregar

206 páginas sin un solo problema de validación ni de auditoría: ningún título
largo, ninguna descripción larga, ningún `h1` duplicado, ningún enlace interno
roto, ningún JSON-LD inválido. 0 guías fuera de los listados. Las siete guías
nuevas probadas en Chromium a 390 px: un `h1`, seis herramientas, cuatro enlaces
relacionados, tu autoría con el colegiado, el pie nuevo y la llamada a tu
consulta, sin desbordes y sin errores de JavaScript. La rejilla de temas, con
las catorce anclas comprobadas una a una.

## Paquete nuevo: una página de Tests con apartados

### El problema, tal y como lo dijiste

Los tests iban sueltos: uno al lado de otro en el pie de las 192 páginas, tres
seguidos en el menú de la portada, y otra vez en el índice y en «temas». Con
tres ya iba justo. Con seis no cabe en ninguno de esos sitios.

### La solución: un solo enlace fuera, apartados dentro

Nueva página **`tests.html`**. Fuera hay un solo enlace —**Tests**— y por dentro
los tests se organizan en apartados:

| Apartado | Qué hay |
|---|---|
| Ánimo y ansiedad | Test de ansiedad (GAD-7) · Test de depresión (PHQ-9) |
| Alcohol y consumo | Test de consumo de alcohol (AUDIT) |
| Para llevar el seguimiento | Registro de siete días (A-B-C) |

Cada test tiene su ficha: qué mide, cuántas preguntas, cuánto tarda, en qué
escala puntúa, para quién es, y de dónde sale (autores, año y por qué se puede
usar libremente). Arriba hay atajos a cada apartado.

**Cuando quieras añadir un test nuevo**, se toca esta página y ya está. No hay
que volver a pasar por los 192 pies, ni por el menú, ni por el índice.

### Qué ha cambiado en el resto de la web

- **El pie de las 192 páginas** pasa de cuatro enlaces a dos:
  `🧪 Tests · 🗒️ Tu registro · Consulta de psicología: Conciencia Conductual`.
- **El menú de la portada** pierde tres líneas y gana una: `🧪 Tests`.
- **El bloque «Sigue por aquí»** de las 164 guías ya no nombra dos tests: manda
  a la página de tests, que los lleva todos.
- **La plantilla de artículo** (`articulo.js`) y `post.html`, lo mismo.
- **Desde cada test** hay ahora un enlace de vuelta: «¿Buscas otro? Todos los
  tests y herramientas →».
- Registrada en `guias.html`, `temas.html`, el índice A-Z y `sitemap.js`.

También he actualizado los guiones de mantenimiento (`sweep_guias.py`,
`reequilibrar_enlaces.py`, `build_indice.py`) para que los próximos paquetes
sigan poniendo el enlace nuevo y no vuelvan a escribir la lista antigua.

### De paso, para posicionar

La página lleva seis preguntas frecuentes con datos estructurados `FAQPage`
(«¿dan un diagnóstico?», «¿se guardan mis respuestas?», «¿cada cuánto puedo
repetirlos?»...), datos estructurados `CollectionPage` + `ItemList` con los
cuatro tests, migas de pan, tu autoría con el número de colegiado, y el aviso
del 024 y el 112 arriba del todo por si alguien llega ahí estando mal.

### Comprobado antes de entregar

199 páginas sin un solo problema de validación ni de auditoría. La página nueva
probada en Chromium a 390 px: un `h1`, tres apartados, cuatro fichas, los cuatro
botones apuntando a donde deben, los atajos de apartado funcionando, los tres
bloques de datos estructurados válidos y sin desbordes laterales. Verificado
también que no queda ni un resto de la lista antigua de tests en ninguna página
ni en las funciones.

## Paquete nuevo: el archivo, que Google no veía; seis guías más; y guías que competían entre sí

### El hallazgo de esta revisión: cientos de artículos sin un solo enlace rastreable

`archivo.html` pintaba la lista de artículos con JavaScript. Eso significa que en
el HTML que se sirve —el que ve un rastreador antes de ejecutar nada— **no había
ni un solo enlace a ningún artículo**. Los cientos de artículos diarios dependían
únicamente del sitemap para ser descubiertos, y no recibían ningún enlace interno.
Aparecer en un sitemap y recibir enlaces internos no es lo mismo: lo primero dice
«existo», lo segundo dice «esto importa».

Ahora hay una función nueva, `netlify/functions/archivo.js`, que genera esa misma
página **en el servidor**: los enlaces van dentro del HTML, de 30 en 30, con
«← Más recientes» y «Más antiguos →» que también son enlaces reales, numeración
de páginas, `rel="prev"` / `rel="next"`, canonical propio en cada página y datos
estructurados `CollectionPage` + `ItemList`.

Se sirve en la misma dirección de siempre (`/archivo.html`) mediante una
redirección con `force` en `netlify.toml`. El fichero estático se queda en el
repositorio como respaldo: si algún día se quita esa regla, vuelve a servirse él
y la página sigue funcionando.

**No sube el gasto de Netlify.** La respuesta se guarda en la caché del CDN
(`durable`, 12 horas, con `stale-while-revalidate` de una semana), así que la
función apenas llega a ejecutarse aunque la página reciba visitas.

### El índice y el archivo, ahora en el pie de las 198 páginas

El índice A-Z (154 guías) lo enlazaban dos páginas. El archivo, dos. Estaban
haciendo de embudo hacia todo el sitio y casi nadie —ni lector ni buscador—
pasaba por ellos.

Ahora el pie de **todas** las páginas lleva: Portada · Guías · Índice · Estudios ·
Consultorio. Y eso incluye la plantilla de artículo (`articulo.js`) y `post.html`,
que además ganan una segunda línea con los dos tests y «Pedir cita». Es decir: los
cientos de artículos diarios pasan a enlazar a las guías, al índice y a tu
consulta, cosa que antes no hacían.

Quedan fuera a propósito los paneles de administración, las páginas legales,
`cortar-pdf.html` (es de maspdf.com) y las dos páginas internas de imágenes.

### Doce guías que competían entre sí en Google

La segunda auditoría encontró seis parejas de guías con más de un 30% de
vocabulario en común. Cuando dos páginas tuyas hablan de lo mismo, Google no sabe
cuál enseñar y muchas veces no enseña ninguna.

No he borrado ninguna, porque cada una responde a una búsqueda distinta. Lo que
he hecho es decirlo en la propia página: una línea debajo de la entradilla que
aclara para quién es esta y manda a la otra a quien busque lo otro.

| Pareja | Qué las separa ahora |
|---|---|
| dependencia emocional ↔ los celos | necesitar a la otra persona / sospechar de ella |
| miedo a salir de casa ↔ sitios cerrados | la calle en general / un sitio concreto |
| insomnio ↔ no puedo dormir esta noche | semanas / esta noche |
| la culpa ↔ menos perfeccionismo | haber hecho algo / no llegar al nivel |
| revisar el móvil ↔ miedo al abandono | desconfianza / pánico a que te dejen |
| sentirse estancado ↔ me siento vacío | llevar años igual / que nada te importe |

### Seis guías nuevas (ya van 154)

| Guía | De qué va |
|---|---|
| `me-siento-vacio.html` | El vacío no es tristeza: en la tristeza duele algo, en el vacío no duele nada. Vivir en automático, actuar antes de sentir, y cómo distinguirlo de una depresión. |
| `miedo-a-salir-de-casa.html` | Agorafobia: cada día que no sales, mañana cuesta más. La escalera de salidas, quitar las muletas y sostener la sensación. |
| `celos-y-revisar-el-movil.html` | Mirar el móvil calma diez minutos y deja la duda intacta. Por qué comprobar alimenta lo que quiere apagar. |
| `primera-sesion-psicologo.html` | Qué se pregunta, qué no hay que preparar, y qué hacer si no encajas con quien te atiende. |
| `no-me-acuesto-aunque-tengo-sueno.html` | Cuando la noche es lo único tuyo del día, irte a la cama es renunciar a ella. Dónde está el rato propio de verdad. |
| `volver-a-empezar.html` | Qué se reconstruye primero cuando se te ha caído todo, y por qué el orden importa. |

Registradas en `guias.html`, en `temas.html`, en el índice A-Z y en
`PAGINAS_FIJAS` de `sitemap.js`. Con el reparto rotatorio de enlaces internos,
las seis reciben enlaces desde otras guías desde el primer día.

### La plantilla de artículo, firmada y con guía para cada tema

Dos huecos reales en `articulo.js`, que es la plantilla de la mayor parte del
sitio:

1. Los datos estructurados de los artículos **no tenían autor**. Las guías sí lo
   llevaban desde el paquete anterior, pero los artículos —que son cientos— iban
   sin firmar. En contenido de salud, quién firma pesa. Ahora llevan tu nombre,
   «Psicólogo», el número de colegiado, el enlace a «sobre mí» y a
   concienciaconductual.com, más `dateModified`.
2. El bloque de «guía relacionada» solo cubría **6 de los 16 temas** posibles, y
   las tres que había eran las guías de compras con enlaces de afiliado, no las
   psicoeducativas. Ahora hay una guía para cada tema y una por defecto, así que
   ningún artículo se queda sin enlazar a una guía.

### Comprobado antes de entregar

198 páginas: ningún título largo, ninguna descripción larga, ningún `h1`
duplicado, ningún enlace interno roto, ningún JSON-LD inválido, ningún aviso en
la auditoría de accesibilidad y estructura. 0 guías fuera de `guias.html`,
`temas.html` o el índice. La ortografía repasada con hunspell: 48 palabras fuera
del diccionario, todas legítimas (superlativos, tecnicismos y dominios).

La función del archivo, ejecutada en local contra una base de artículos simulada
de 67 entradas: las tres páginas devuelven 200, los enlaces salen en el HTML, la
paginación se recorta sola si pides una página que no existe, el texto de los
artículos va escapado y los dos bloques de datos estructurados son JSON válido.
La plantilla de artículo, renderizada en local: autor correcto, organigrama,
cadena de cinco pasos, ficha del estudio, guía relacionada por tema y el pie
nuevo. Las seis guías nuevas y las doce desambiguadas, probadas en Chromium a
390 px: un solo `h1`, sin desbordes laterales, sin errores de JavaScript, y el
buscador de `guias.html` las encuentra.

### Lo que sigue faltando y no se arregla con código

El enlace desde **concienciaconductual.com hacia psicolinks.com**. Es gratis, se
hace en dos minutos y sigue siendo lo que más te falta.

## Paquete nuevo: 91 guías estaban aisladas por dentro, y seis guías más

### El hallazgo de esta revisión: la mitad de la web no recibía enlaces

Hice una auditoría distinta a las anteriores —contar los enlaces internos que
recibe cada página— y salió esto: **91 de las 142 guías no recibían ni un solo
enlace desde otra guía**. A la vez, un puñado acumulaba veinte o treinta cada
una.

La causa era el bloque «Sigue por aquí»: cogía siempre **las tres primeras guías
de su categoría**. Así que dentro de cada tema, las tres primeras por orden
alfabético se llevaban todos los enlaces y el resto no aparecía nunca.

Importa por dos motivos. Para Google, una página a la que nadie enlaza dentro de
la propia web se lee como poco importante y se rastrea menos. Y para el lector,
que veía las mismas tres sugerencias en todas las guías del mismo tema.

**Arreglado:** dentro de cada categoría, la guía número i enlaza ahora a las i+1,
i+2 e i+3, dando la vuelta al final de la lista. Cada guía enlaza a tres y recibe
exactamente tres.

| | Antes | Ahora |
|---|---|---|
| Guías sin ningún enlace desde otra guía | **91** | **0** |
| Enlaces internos entrantes (mediana) | 3 | **6** |

Y no hay que mantenerlo: el script se vuelve a pasar cada vez que se añaden
guías, y reparte solo.

### Guías que se pisaban entre sí

La misma auditoría midió el solapamiento de vocabulario entre guías, para
detectar pares que compitan por las mismas búsquedas. Salieron tres por encima
del 30%, y ninguno es grave, pero se han enlazado entre sí con una nota que
explica cuál es cuál: dependencia emocional ↔ celos, culpa ↔ perfeccionismo, y
porno ↔ compras compulsivas. Después se añadió una cuarta pareja con la guía
nueva: insomnio ↔ «no puedo dormir esta noche», con una nota en cada una
diciendo cuál toca según el caso.

### Seis guías nuevas (148 en total)

| Guía | Por qué esta |
|---|---|
| `no-puedo-dormir-esta-noche.html` | Se busca de madrugada y con urgencia. Complementa a «Insomnio», que es para lo crónico. |
| `sintomas-de-estres.html` | «Síntomas de estrés» es de las búsquedas más frecuentes del tema. |
| `ataques-de-ira.html` | Con la línea bien marcada: si hay golpes o miedo en casa, eso ya no es manejo del enfado. |
| `hablar-con-tu-medico-salud-mental.html` | Muy práctica: el médico de cabecera es la puerta a la salud mental pública. |
| `volver-a-confiar-en-alguien.html` | Con la distinción clave: transparencia no es vigilancia. |
| `redes-sociales-y-animo.html` | Por qué no es falta de voluntad y qué hacer sin dejar de seguir a nadie. |

### Comprobado

192 páginas, ningún problema y ningún aviso. Reequilibrio verificado: cero guías
aisladas, y comprobado en el navegador que las guías antiguas siguen enteras con
sus nuevos vecinos. Los 161 enlaces de `guias.html`, los 176 de `temas.html` y
los 162 del índice, uno a uno: ninguno roto. Corrector sobre las 192 páginas:
ningún error real. Sin errores de JavaScript.

## Paquete nuevo: índice A-Z, seis guías más y una corrección de mis números

### Corrección: la web tiene 142 guías, no 98

Al generar el índice alfabético conté los ficheros de verdad y salieron **142
guías**, no las 98 que yo venía diciendo. Mi cuenta era mala: llevaba la suma de
las guías que iba escribiendo yo, sobre una base de partida equivocada, sin
volver a contar nunca los ficheros reales.

Corregido en `terapia-online.html`, que decía «92 guías» en dos sitios, y el
índice se genera solo contando el repositorio, así que a partir de ahora la
cifra no puede volver a desviarse.

### Página nueva: `indice.html`, la A a la Z

Faltaba lo más simple y lo que más se usa cuando ya sabes qué buscas: **todo en
una sola página, por orden alfabético**. `guias.html` tiene buscador y
paginación, `temas.html` agrupa por tema; esto es la lista completa.

152 entradas —las 142 guías más los tres tests, el registro, los guiones, las
preguntas, «dónde pedir ayuda», los libros y la página de terapia online—, con
navegación por letras arriba. Ordena ignorando tildes y saltándose los arranques
tipo «Cuando…» o «Cómo…», que si no se amontonarían todas en la C.

**Se genera sola leyendo el repositorio.** No hay que mantenerla a mano: cada vez
que se añade una guía, se vuelve a ejecutar y ya está. Enlazada desde la portada,
`guias.html` y `temas.html`.

### Seis guías nuevas (148 páginas de contenido en total)

Otra vez elegidas por búsqueda, no por hueco temático:

| Guía | Por qué esta |
|---|---|
| `dejar-de-pensar-en-alguien.html` | «Cómo dejar de pensar en alguien» es de las búsquedas más frecuentes que existen. |
| `por-que-lloro-por-todo.html` | Se teclea tal cual, y la respuesta útil (cansancio, tiroides, hormonas) casi nadie la da. |
| `miedo-al-fracaso.html` | Con los disfraces de la evitación, que es lo que nadie ve. |
| `estres-postraumatico.html` | Término muy buscado; aquí con el mensaje central: tiene tratamiento y funciona. |
| `miedo-al-abandono.html` | La mecánica de que lo que haces para evitarlo es lo que lo provoca. |
| `aceptar-las-criticas.html` | La distancia entre lo que te dicen y lo que oyes. |

### Comprobado

186 páginas, ningún problema y ningún aviso. Los 156 enlaces del índice
comprobados uno a uno por código de respuesta: ninguno roto, y las anclas de
letra funcionan. Corrector ortográfico sobre las 186 páginas: ningún error real
(las dos palabras nuevas que no reconoce son «perimenopausia» y «Wegner», el
autor de los experimentos del oso blanco). Probado en escritorio y a 390 px, sin
errores de JavaScript.

## Paquete nuevo: seis guías más y el trabajo de autoría para posicionar

### Lo más importante de este paquete: quién firma

Google trata la psicología como contenido «YMYL» —de los que pueden afectar a la
salud o al dinero de alguien— y para esos temas pesa mucho **quién firma y si se
puede comprobar**. En Psicolinks el autor era solo una cadena de texto suelta.
Ahora, en las **140 páginas**:

- El autor de los datos estructurados es una ficha completa de persona: nombre,
  profesión, **número de colegiado**, enlace a «sobre mí», temas sobre los que
  escribes y enlace a Conciencia Conductual como `sameAs`.
- Cada artículo lleva **fecha de publicación y de modificación**. Sin ellas,
  Google no distingue si esto es de este mes o de hace cinco años.
- La firma de cada guía —«Por Miguel Martínez, psicólogo · Colegiado nº
  CV17649»— **ahora enlaza a `sobre-mi.html`**, que es donde se comprueba quién
  eres. Además son 140 enlaces internos nuevos hacia esa página.
- La portada lleva una ficha `Person` + `WebSite` enlazada a tu consulta.

Esto no da visitas mañana. Es de las cosas que pesan a medio plazo en temas de
salud, y estaba sin hacer.

### Seis títulos que no coincidían con lo que se busca

Encontré guías cuyo título está bien escrito pero no contiene las palabras que la
gente teclea. Con el tráfico actual no hay nada que perder al cambiarlos:

| Antes | Ahora |
|---|---|
| Cuando no puedes parar de trabajar | **Adicción al trabajo**: cuando no puedes parar |
| Posparto: cuando no te sientes bien | **Depresión posparto**: qué hacer |
| Cuidar a alguien sin agotarte | **Sobrecarga del cuidador**: cuidar sin agotarte |
| El bajón de los domingos por la tarde | **Ansiedad los domingos** por la tarde |
| Después de perder un embarazo | **Aborto espontáneo**: el duelo después |
| Llevarte con la familia de tu pareja | **Problemas con la familia de tu pareja** |

Aviso honesto: esto sale de mi criterio sobre cómo busca la gente, no de una
herramienta de palabras clave. No tengo acceso a datos reales de búsqueda.

### Seis guías nuevas (ya van 98), elegidas por búsqueda

No por hueco temático, sino porque son cosas que se teclean tal cual en Google:

| Guía | Por qué esta |
|---|---|
| `como-saber-si-tengo-ansiedad.html` | «cómo saber si tengo ansiedad» es de las búsquedas más frecuentes del tema. |
| `ataque-de-ansiedad-por-la-noche.html` | Muy buscado y casi no cubierto en español con criterio. |
| `no-siento-nada.html` | El embotamiento emocional: mucha gente lo busca y casi nadie lo nombra. |
| `mi-pareja-no-me-habla.html` | El círculo de perseguir y alejarse, que es el patrón de pareja más común. |
| `autoestima-en-los-ninos.html` | Con el matiz que casi nadie da: los elogios no la construyen. |
| `ayudar-a-alguien-con-ansiedad.html` | Con la acomodación familiar explicada, que es lo que casi nadie sabe. |

### Comprobado

179 páginas, ningún problema y ningún aviso. Todos los datos estructurados
válidos después de tocarlos en 140 ficheros. Los 148 enlaces de `guias.html`, los
163 de `temas.html` y los de portada y «sobre mí», uno a uno: ninguno roto.
Corrector sobre las 179 páginas: ningún error real. Sin errores de JavaScript.

## Paquete nuevo: girar hacia la consulta, y hacia el online

### Página nueva: `terapia-online.html`

Es la pieza que faltaba entre Psicolinks y la consulta. Hasta ahora, quien
quería dar el paso se encontraba con un botón que le sacaba de golpe a otra web.
Ahora hay una parada en medio que resuelve las dudas que frenan a alguien antes
de escribir.

Contiene: quién eres, con el número de colegiado a la vista; con qué motivos se
suele venir; **cómo funciona en cinco pasos** (escribir, primera sesión,
objetivos comprobables, trabajo entre sesiones, revisar con datos); y **ocho
preguntas** de las que de verdad frenan —si el online funciona igual, qué hace
falta para conectarse, si es confidencial, cuántas sesiones, desde qué enfoque,
qué pasa si no conectáis, desde dónde se puede uno conectar, y si se puede
presencial—. Con datos estructurados `FAQPage`.

Y dos cosas que la hacen honesta en vez de un anuncio: avisa de que **no es el
recurso para una urgencia** (112 y 024, y la vía pública en «dónde pedir ayuda»),
y cierra diciendo que **si todavía no es el momento, no pasa nada**, con las
guías y los tests gratis.

El clic al botón se cuenta como `consulta-terapia-online` con la función
`track-view` que ya existía, así que podrás ver en el panel cuántos llegan.

### La consulta, por delante de los afiliados

- En los artículos, el bloque de libros de Amazon estaba **antes** que el de la
  consulta. Ahora va después, y con un tono más discreto («y si quieres leer más
  por tu cuenta») en lugar de la llamada anterior. No se ha quitado nada: los
  enlaces de afiliado siguen intactos, solo cambia el orden y el peso.
- El botón de consulta de las **156 páginas** ya no sale disparado a
  concienciaconductual.com: pasa por la página puente, que explica y luego manda.
  Y su texto cambia de «Ver mi consulta» a «Cómo trabajo y cómo pedir cita», que
  es lo que la gente quiere saber antes de escribir a un psicólogo.
- El menú de la portada hace lo mismo, y ahora pone «🩺 Mi consulta».
- En todos los bloques: «online para **toda España** y presencial en Valencia»,
  en lugar del «online y presencial» de antes.
- Tarjeta propia en `guias.html`, justo después del registro, y enlace en
  `temas.html`.

### Una nota sobre la evidencia

En la página se dice que, para los motivos de consulta más habituales, las
revisiones que comparan psicoterapia por videollamada con presencial no
encuentran diferencias relevantes. Se ha dejado en ese nivel de generalidad **a
propósito**: intenté verificar un metaanálisis concreto para citarlo con su
número y no pude —PubMed y las editoriales bloquearon las consultas—, y no voy a
poner una cifra que no he comprobado en tu web. Si quieres añadir la cita
concreta, hazlo tú, que además la conoces.

### Comprobado

173 páginas, ningún problema y ningún aviso. Los 142 enlaces de `guias.html`, los
11 de la página nueva y los de portada, uno a uno: ninguno roto. Artículo
renderizado en local: la consulta va antes que los libros y el botón apunta a la
página puente. Corrector ortográfico sobre las 173 páginas: ningún error real.
Probado en escritorio y a 390 px, sin errores de JavaScript.

## Paquete nuevo: el registro, ya visible; seis guías más; y un fallo en mi propio corrector

### El registro, en primera fila

Estaba en la web pero solo se llegaba por el menú. Ahora:

- **Bloque destacado en la portada**, justo debajo del de los tests, con borde
  granate para diferenciarlo: «Descubre qué está manteniendo lo que te pasa».
  Explica en dos párrafos qué es, que se guarda solo en el navegador y que hay
  un botón para copiarlo y llevárselo al psicólogo.
- **Primera tarjeta de `guias.html`**, por delante de las 144 restantes.
- El bloque de los tests de la portada menciona ahora también el de alcohol.

### Seis guías nuevas (ya van 92)

| Guía | De qué va |
|---|---|
| `decir-lo-que-piensas.html` | Callarse aplaza el conflicto. Hecho, efecto y petición, en tres frases. |
| `mudarse-de-casa.html` | Un rincón terminado el primer día y las rutinas antes que los muebles. |
| `mi-hijo-no-estudia.html` | Descartar lo que no se ve y pelear por el hábito, no por la nota. |
| `ansiedad-en-sitios-cerrados.html` | El súper, el metro, el cine: las muletas son lo que mantiene el miedo. |
| `acompanar-en-una-enfermedad-grave.html` | Qué decir y qué no; por qué «dime si necesitas algo» no se usa nunca. |
| `rabietas-y-enfados-de-los-ninos.html` | No es manipulación: primero calmar, después hablar, y el límite intacto. |

Tres de ellas enlazan al registro A-B-C como paso siguiente, que es donde
encaja de forma natural.

### Un fallo en el corrector ortográfico, y por qué importa

Al revisar esta tanda aparecieron dos «errores» rarísimos en `guias.html`:
*parej* y *réis*. Ninguna de las dos está en el fichero. Investigándolo resultó
que **hunspell trunca las líneas muy largas**, y como el texto de una página se
le pasaba en una sola línea gigante, partía palabras por la mitad e inventaba
errores.

Lo malo no son los falsos positivos: es que **por el mismo motivo podía dejar
palabras reales sin comprobar**. Es decir, las revisiones ortográficas de los
paquetes anteriores no eran del todo de fiar.

Arreglado: el corrector ahora trocea el texto a 200 caracteres antes de
pasarlo, y además distingue solo las formas verbales con pronombre (*trátalo*,
*léete*, *nómbrala*), que son correctas y llenaban la lista de ruido.

**Repasada la web entera con el corrector arreglado**: de 163 palabras fuera del
diccionario, 120 son formas verbales o palabras con prefijo, y las 43 restantes
—revisadas una a una— son todas correctas: superlativos (*clarísimo*,
*normalísimo*, *frecuentísimo*), tecnicismos, anglicismos puestos a propósito y
nombres de dominio. **Ningún error real en las 172 páginas.**

### Comprobado

172 páginas, ningún problema y ningún aviso en las dos revisiones automáticas.
Los 141 enlaces de `guias.html` comprobados uno a uno por código de respuesta:
ninguno roto. Bloque de la portada revisado en escritorio y a 390 px, sin
desbordar. Sin errores de JavaScript.

## Paquete nuevo: el registro A-B-C y siete guías más

### Lo nuevo de verdad: `registro-abc.html`

Es la herramienta con la que empieza casi cualquier terapia conductual, y no
existe gratis y bien hecha en español en ningún sitio. El visitante apunta,
durante una semana:

- **A · Antecedente** — qué había justo antes: hora, sitio, con quién, cómo estaba.
- **B · Conducta** — qué hizo exactamente, contado como lo grabaría una cámara.
- **C · Consecuencia** — qué consiguió o de qué se libró justo después, y qué costó luego.
- Y el **malestar de 0 a 10** en ese momento.

Con eso la página le devuelve: número de anotaciones, días distintos, malestar
medio, un gráfico de barras con la evolución de las últimas catorce, y la lista
completa. Más dos botones: **copiar todo** —para llevárselo al psicólogo, en
texto plano listo para pegar o imprimir— y **borrar**, entero o anotación a
anotación.

Por qué esto y no un diario al uso: un diario cuenta cómo te sentiste; un
registro A-B-C cuenta qué lo enciende y qué lo mantiene. La casilla C es la que
explica por qué una conducta se repite aunque esté costando la vida, y es
exactamente el ángulo conductual que distingue a Psicolinks.

Y para la web tiene un efecto que ninguna guía consigue: **obliga a volver cada
día**. Es lo que le faltaba.

Todo se guarda en `localStorage` y **nada sale del navegador**. Es la
información más personal que puede haber en la web —lo que alguien escribe sobre
su vida— así que no hay ninguna copia en ningún servidor. `privacidad.html` lo
explica en un apartado propio.

Probado a fondo en el navegador: guardar, contar, calcular la media, dibujar las
barras, copiar al portapapeles con alternativa si el navegador lo bloquea,
borrar una anotación, borrar todo, persistir al recargar, no desbordar en móvil
y **escapar el HTML** de lo que se escribe (probado con una etiqueta maliciosa:
se muestra como texto, no se ejecuta).

### Siete guías nuevas (ya van 86)

| Guía | De qué va |
|---|---|
| `miedo-al-dentista.html` | El miedo no es al dolor, es a no poder parar. Pactar una señal. |
| `perdida-gestacional.html` | Un duelo que casi nadie reconoce, y la culpa que casi siempre sobra. |
| `ansiedad-por-la-salud-de-los-hijos.html` | Cuándo la preocupación se vuelve vigilancia, y qué aprende el niño mirándote. |
| `cuando-desaparecen-sin-explicacion.html` | Cerrar sin respuesta, y no rellenar el hueco con conclusiones sobre ti. |
| `vivir-solo-por-primera-vez.html` | Anclas en el día, y distinguir estar solo de sentirse solo. |
| `miedo-a-envejecer.html` | Separar el miedo abstracto de lo concreto; qué parte sí depende de ti. |
| `cuando-se-acaba-una-amistad.html` | Un duelo sin permiso social: roto o apagado, y por qué no siempre hay culpable. |

### Registrado en toda la web

`guias.html` (139 tarjetas), `temas.html`, el menú de la portada, el sitemap y el
pie de las **146 páginas**, que ahora lleva enlace al registro además de a los
tres tests.

### Comprobado

166 páginas, ningún problema y ningún aviso en las dos revisiones. Los 143
enlaces de `guias.html`, los 151 de `temas.html` y los de portada y privacidad,
comprobados uno a uno por código de respuesta: ninguno roto. Corrector
ortográfico pasado sobre las nueve páginas nuevas: 19 palabras que el diccionario
no conoce y **las 19 correctas** (tecnicismos como endodoncia, sedación,
perinatal, gestacional, e imperativos con pronombre). Ningún error real esta vez.
Sin errores de JavaScript.

## Paquete nuevo: siete guías más (ya van 79)

| Guía | De qué va |
|---|---|
| `no-soporto-mi-trabajo.html` | Concretar qué parte es la que no aguantas y ponerle fecha al plan de salida. |
| `hermanos-y-cuidar-a-los-padres.html` | El reparto siempre es desigual: pedir encargos con nombre y fecha, no implicación. |
| `diagnostico-de-un-hijo.html` | Los primeros días tras un diagnóstico, dónde informarse y cómo pedir apoyos al colegio. |
| `hablar-de-la-muerte-con-ninos.html` | Por qué los eufemismos hacen daño y qué señales sí conviene consultar. |
| `dormir-en-pareja.html` | Ronquidos, horarios distintos y guerras de manta. Cuándo es cosa del médico. |
| `sentirse-estancado.html` | En qué se diferencia de la depresión y por qué la claridad llega probando. |
| `volver-a-estudiar-de-adulto.html` | El problema es el tiempo, no la capacidad. Franjas fijas y práctica de recuerdo. |

Todas con el bloque «Sigue por aquí», el bloque de consulta, migas de pan y el
pie completo. Registradas en `guias.html` (131 tarjetas), `temas.html` y el
sitemap.

Dos de ellas apuntan al test cuando toca: «Sentirse estancado» enlaza al test de
depresión para distinguir el estancamiento del apagón real, y «No soporto mi
trabajo» remite a la guía del burnout con el criterio de las vacaciones.

### Ortografía

Corrector pasado también sobre las catorce páginas nuevas de hoy. De 38 palabras
que el diccionario no reconoce, 37 son correctas (imperativos con pronombre,
tecnicismos, siglas). **Un error real corregido:** «inganable», que no existe,
en `familia-politica.html`.

### Comprobado

158 páginas, ningún problema y ningún aviso. Los 127 enlaces de `guias.html` y
los 142 de `temas.html` comprobados uno a uno por código de respuesta: ninguno
roto. Las siete guías nuevas revisadas en el navegador, sin errores de
JavaScript y sin rastro del cajetín de correo.

## Paquete nuevo: tercer test (AUDIT) y seis guías más

### Test nuevo: `test-de-alcohol.html` — el AUDIT de la OMS

Elegido justamente por lo que pediste: es el más limpio que hay en cuanto a
derechos. La web oficial del cuestionario dice literalmente que **no hace falta
permiso para usarlo con fines no comerciales** y que «como instrumento aprobado
por la OMS, el AUDIT es de dominio público». Nada que ver con el STAI, el BAI o
la escala de Epworth, que sí tienen licencia y no se pueden poner.

Diez preguntas, puntuación de 0 a 40, cuatro niveles con los cortes de la OMS:
0-7 bajo riesgo · 8-15 consumo de riesgo · 16-19 consumo perjudicial · 20-40
posible dependencia. Mismo diseño y mismas garantías que los otros dos: resultado
al momento, historial guardado **solo en tu navegador**, comparación con la
medición anterior, plan de tres semanas y botón de borrar.

Tres cosas que se han cuidado especialmente:

- **Explicación de qué es una consumición.** Sin eso la pregunta 2 no se puede
  contestar bien. Se explica la unidad de bebida estándar española: una caña o un
  vino cuentan como una; una copa o un combinado, como dos.
- **Aviso de retirada.** Si alguien marca que bebe a diario, aparece
  inmediatamente —antes incluso de ver el resultado— un aviso de que **no debe
  dejarlo de golpe por su cuenta**, porque la retirada brusca de alcohol puede ser
  peligrosa, y de que eso se hace con supervisión médica. Es la advertencia más
  importante de toda la página.
- **El punto de corte matizado.** Se explica que el umbral clásico son 8 puntos
  pero que en mujeres y en mayores de 65 suele bajarse a 6.

Probado en el navegador con tres casos: todo al mínimo da 0 (bajo riesgo), todo
al máximo da 40 (posible dependencia) y una combinación de 8 puntos cae
exactamente en «consumo de riesgo».

### Seis guías nuevas (ya van 72)

| Guía | De qué va |
|---|---|
| `beber-menos-sin-dejarlo.html` | Días secos fijos, tope decidido antes de salir, registro. Enlaza con el test nuevo. |
| `mi-pareja-bebe-demasiado.html` | Hablar de hechos y no de etiquetas, y dejar de tapar las consecuencias. |
| `la-envidia.html` | Por qué es información y no un defecto; envidia frente a resentimiento. |
| `ansiedad-al-telefono.html` | Por qué aplazar la llamada la hace más difícil; entrenarlo por escalones. |
| `familia-politica.html` | El conflicto real está entre vosotros dos. Cada uno habla con los suyos. |
| `dinero-en-pareja.html` | El dinero casi nunca es el tema: seguridad, libertad, justicia o control. |

Las tres relacionadas con el alcohol se enlazan entre sí y con el test, de modo
que quien llega por cualquiera de ellas encuentra el resto.

### Registrado en toda la web

`guias.html` (124 tarjetas), `temas.html`, el menú de la portada, el sitemap y el
pie de las **144 páginas**, que ahora lleva también el enlace al test de alcohol.
`privacidad.html` menciona el tercer test en el punto de almacenamiento local.

### Comprobado

151 páginas, ningún problema y ningún aviso en las dos revisiones. Los 120
enlaces de `guias.html` y los 135 de `temas.html` comprobados uno a uno por
código de respuesta: ninguno roto. Sin errores de JavaScript.

## Cajetín de newsletter, quitado

A petición de Miguel, el cuadro de «Apuntarme a la newsletter» ya no aparece en
ninguna página. Se ha hecho de la forma menos destructiva posible: un bloque de
apagado al principio de `newsletter-psicolinks.js` que borra los cajetines al
cargar la página y no ejecuta nada más.

**No se ha borrado nada más.** El resto del fichero sigue intacto, igual que la
función `suscribir`, la función `unsubscribe`, la página `admin-suscriptores.html`
y los suscriptores que ya estuvieran guardados en Netlify Blobs.

**Para volver a activarlo** basta con borrar ese bloque del principio del fichero
(está marcado con un comentario que dice dónde empieza y dónde acaba). Nada más.

Comprobado en el navegador: ni el cajetín ni la palabra «newsletter» ni el botón
«Apuntarme» aparecen ya en las guías, en las páginas nuevas ni en la portada, y
no queda hueco en blanco donde estaban. Sin errores de JavaScript.

## Paquete nuevo: tu consulta en todas las páginas, revisión de ortografía y organigrama

### Tu consulta al final de TODAS las páginas

Antes solo salía en los artículos. Ahora el bloque «¿Y si esto te está pasando a
ti?» —con tu nombre, tu número de colegiado y el botón a Conciencia Conductual—
está al final de **128 páginas**: todas las guías, los dos tests, temas, las
preguntas, los guiones. Va justo antes del formulario de correo.

Se ha dejado fuera de lo que no toca: avisos legales, privacidad, cookies, las
páginas internas de administración, `cortar-pdf.html` (que es de maspdf.com) y
«dónde pedir ayuda», donde ya tienes tu bloque propio y donde meter publicidad
de la propia consulta encima de los teléfonos de crisis quedaría feo.

### «Otras webs» pasa a llamarse «Consulta de psicología»

En el pie de la portada y de los artículos. Antes decía «Otras webs», que no
dice nada; ahora el lector sabe adónde le lleva ese enlace.

### Revisión ortográfica de todo el sitio

Se ha pasado un corrector de verdad (hunspell con diccionario español) sobre el
texto visible de las 144 páginas. De 378 palabras que el diccionario no reconoce,
casi todas son correctas: imperativos con pronombre (`trátalo`, `escríbelo`,
`sepáralas`), apellidos (Öst, Marlatt, Azrin, Kahneman), términos técnicos y
nombres de dominio.

**Errores reales encontrados y corregidos: seis.**

| Estaba | Ahora | Dónde |
|---|---|---|
| cognitivoconductual | cognitivo-conductual | `dormir-mejor-en-7-pasos.html` |
| la tardenoche | la tarde-noche | `dormir-mejor-en-7-pasos.html` |
| repónla | reponla | `juego-y-apuestas.html` |
| preregistrada | prerregistrada | `leer-un-metaanalisis.html` |
| menos querible | menos digno de cariño | `cuando-te-sientes-solo.html` |
| las tranquilizaciones | las búsquedas de tranquilidad | `miedo-a-la-muerte.html` |

Un aviso honesto: un corrector detecta palabras mal escritas, **no** frases mal
construidas ni concordancias. Para eso hace falta leer, y eso no lo cubre esta
revisión.

Sobre «no demuestra que la cause»: esa construcción **es correcta** —el
subjuntivo es obligatorio detrás de un verbo de prueba en negativo—, pero si
hace tropezar al lector, molesta igual. Se ha reescrito como «no significa que
sea su causa», que es igual de correcto y se entiende a la primera.

### El correo de la newsletter decía algo que no se cumplía

El formulario prometía «cada domingo te mando un correo corto con los mejores
estudios de la semana». El código no hace eso: `fetch-studies.js` manda un aviso
**cada día laborable en que publica**, de lunes a viernes, y solo si
`RESEND_API_KEY` está configurada en Netlify. No hay ningún envío semanal de
domingo en ninguna parte.

Como eso es una promesa a quien deja su correo, se ha corregido el texto para
que diga la verdad: «te aviso por correo cuando publico estudios nuevos y guías
nuevas». También el mensaje de confirmación, que decía «nos leemos el domingo».

Si prefieres el resumen semanal de verdad, hay que programarlo aparte: dilo y se
hace.

### Organigrama de un vistazo en cada artículo

Encima de la ficha del estudio hay ahora un **dibujo** —un SVG, no texto—: cuatro
nodos redondos unidos por flechas, PREGUNTA → MÉTODO → HALLAZGO → POR QUÉ, con
el hallazgo en morado relleno. Se lee entero de una ojeada, escala solo con el
ancho de la pantalla y no desborda en móvil.

### Comprobado

144 páginas, ningún problema y ningún aviso en las dos revisiones automáticas.
El bloque de consulta comprobado en guías, tests, temas y páginas nuevas, sin
errores de JavaScript. Artículo renderizado en local con datos simulados: mapa,
ficha, cadena, consulta y pie nuevo, en escritorio y a 390 px.

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


---

# Tanda del 24 de agosto — el scroll y el muro de botones

Dos cosas que señalaste con capturas: que en «Guías y recomendaciones» el
scroll era interminable, y que en «Explora por temas» los botones azules ya no
se podían mirar, y que con cien guías sería peor.

## 1. El scroll de guias.html: era un fallo, no solo diseño

La paginación solo metía en la cuenta las tarjetas etiquetadas «Guía
gratuita». Las otras 34 —las guías de compra, los tests y las herramientas— no
entraban en el paginado, así que se mostraban **en todas las páginas a la
vez**. Por eso se veían 42 tarjetas en lugar de 8 y la página medía 15.365
píxeles: dieciocho pantallas de móvil.

Arreglado: se paginan todas las tarjetas y caben 12 por página. Además el
buscador y los filtros suben por encima del bloque del test (antes había 1.356
píxeles de entradilla y avisos antes de la primera tarjeta) y el bloque del
test baja al final convertido en una línea.

**18,2 pantallas → 6,9.** 42 tarjetas visibles → 12. Hasta la primera tarjeta:
1.356 px → 852.

## 2. temas.html: de un muro a un menú

Dos cambios encadenados.

**Subgrupos dentro de cada tema.** Los 230 enlaces estaban en una lista plana
por tema: dentro de «Ansiedad» había 24 botones seguidos sin ningún orden
visible. Ahora cada tema se parte en apartados con su encabezado —en Ansiedad:
«Por dónde empezar», «Cuando aprieta ahora mismo», «La cabeza que no para»,
«Cuando el miedo va sobre tu salud», «En situaciones concretas», «Cosas que
ayudan»—. 209 enlaces repartidos en subgrupos; los tres que no encajaban en
ninguno van a «Y también», así que no desaparece ninguno.

**Los temas se pliegan.** Cada tema es ahora un desplegable: al llegar ves
catorce cabeceras con su icono y cuántas guías tiene, abres la que te interesa
y solo esa se despliega. Está hecho con `<details>`, que es HTML nativo:
funciona con teclado, con lector de pantalla y sin JavaScript. Se comporta como
acordeón —solo uno abierto a la vez—, así que **la página no vuelve a crecer
por muchas guías que añadamos**. Que era justo lo que preocupaba.

Se quitó la rejilla de tarjetas de arriba, que desde el plegado era el mismo
menú repetido dos veces, y los temas se recolocaron por lo que más se busca:
ansiedad, ánimo, pareja, autoestima, sueño, trabajo, familia...

El único JavaScript que hay abre el tema si llegas con `#ansiedad` en la URL
—desde otra página, desde el buscador de Google o desde un enlace tuyo—. Sin
él, el enlace te deja en la cabecera cerrada y la abres tú.

**25,1 pantallas de móvil → 2,7.** En escritorio, 2,0. Los catorce anclajes
(`temas.html#ansiedad` y compañía) siguen funcionando igual que antes.

## Comprobado antes de entregar

245 páginas HTML, ningún problema en el validador. Auditoría: ningún aviso —se
corrigió un salto de encabezado h1→h3 que apareció en temas.html al convertir
los `<h2>` de cada tema en cabecera del desplegable—. 233 enlaces internos
distintos comprobados en un navegador de verdad, **ninguno roto**, ningún error
de JavaScript. Los trece filtros de guias.html cuentan exactamente lo que
muestran. Ortografía: 269 palabras fuera del diccionario, todas legítimas
(tecnicismos, dominios y anglicismos como *burnout* o *mindfulness*).

Una cosa que corregí de mí mismo: al recortar la entradilla de temas.html
escribí «230 guías gratuitas», y 230 es el número de *enlaces* de esa página,
de los cuales 12 son tests y 11 guías de compra. Cambiado por una frase sin
cifra, que es lo que hay.

## Sigue pendiente, y no lo arregla el código

1. **El enlace desde concienciaconductual.com a psicolinks.com.** Gratis, cinco
   minutos, y es lo que más mueve la aguja de todo lo que queda.
2. Para que la newsletter envíe de verdad: `RESEND_API_KEY` en Netlify y
   psicolinks.com verificado en Resend.


---

# Reorganización: menos puertas

Miguel lo dijo así: «una cosa lleva a otra y otra lleva a otra, es demasiado
lío... no se puede agobiar tanto a la persona que entre, si no dará más
ansiedad». Tenía razón, y el dato que lo resume es este:

**Tres páginas eran la misma lista.** Guías (214 enlaces), Temas (229) e Índice
A-Z (221) listaban las mismas doscientas guías, solo que ordenadas distinto. Y
las tres se enlazaban entre sí. Más `empieza-aqui` con 53 enlaces. Cuatro
puertas a la misma habitación, y cada una ofrecía las otras tres.

**El pie de página tenía nueve enlaces y salía en 245 páginas.** Y había
DIECIOCHO pies distintos, copiados y retocados tanda a tanda hasta no coincidir
entre sí: cuatro enlazaban `guias.html` sin la barra inicial, tres no llevaban
ni la portada.

No es que la web estuviera mal hecha. Es que se le fueron añadiendo puertas cada
semana y no se quitó ninguna.

## Lo que se ha hecho

**1. Una sola lista.** Se queda `temas.html`, que es la que se pliega y no crece
al añadir guías, y se le ha metido dentro el buscador que tenía `guias.html`.
Busca en el título y en la dirección del enlace, sin acentos, y abre los temas
que tengan resultados. `guias.html` e `indice.html` redirigen ahí con un **301**
—definitivo, así Google le pasa a `temas.html` las posiciones que tuvieran— y
los ficheros se quedan en el repositorio por si hay que dar marcha atrás.

**2. Un solo pie, con tres enlaces.** Portada · Guías · Consulta de psicología.
Lo legal (aviso, privacidad, cookies) en letra pequeña, que no es una elección.
Salen del pie Estudios, Índice, Tests, Consultorio y Tu registro: Estudios no se
pierde porque la portada **es** la página de los estudios diarios, y los tests
están dentro de Guías, en su apartado.

**3. El final de cada guía: una sola cosa.** Antes había tres guías
relacionadas, un enlace a los tests, el botón de la consulta, otros tres enlaces
«por si prefieres otras opciones» y un «ver todas las guías». Ahora hay **un
siguiente paso** —la guía más relacionada, que era ya la primera de las tres— y
el bloque de la consulta, que se queda porque es otra cosa: «seguir leyendo» y
«pedir ayuda» son las dos únicas respuestas posibles a «he terminado esto».

De los tres enlaces de «otras opciones» se queda **dónde pedir ayuda**. Ese no
es relleno: es el que sostiene la frase de que aquí no soy neutral porque
recomiendo mi propia consulta. Quitarlo sería quedarse la parte comercial y
tirar la honesta.

**4. La portada.** El menú tenía nueve enlaces y tres llevaban al mismo sitio
con nombres distintos. Ahora son tres: Empieza aquí · Las guías · Mi consulta. Y
los dos bloques grandes seguidos (el del test y el del registro, con sus dos
títulos y sus seis párrafos) se han juntado en uno corto con los dos botones.

**5. «Empieza aquí» era la página menos fácil del sitio.** Treinta y nueve
apartados y cincuenta y tres enlaces, en una página que se llama «Empieza aquí».
Ahora son ocho, uno por cada motivo real por el que la gente entra a una web de
psicología, con un solo enlace cada uno, y una única salida para quien no se vea
en ninguno. Las treinta y una guías que salen de ahí siguen en su tema y en el
buscador.

## Los números

| | antes | ahora |
|---|---|---|
| Enlaces en una página, mediana | 22 | 14 |
| Enlaces del sitio, total | 6.249 | 4.322 |
| Enlaces en el pie | 9 (y 18 pies distintos) | 3 + legal (uno solo) |
| Portada: hasta el primer estudio | 1.416 px | 756 px |
| Portada: menú | 9 enlaces | 3 |
| «Empieza aquí» | 39 apartados | 8 |
| Listas de todas las guías | 3 | 1 |

## Comprobado antes de entregar

245 páginas, validador sin problemas, auditoría sin avisos. 250 enlaces internos
distintos comprobados en navegador real: los 13 rotos que aparecen son de
`cortar-pdf.html` y **ya estaban rotos antes** (ver más abajo). Los 22 ficheros
de funciones y los 3 de JavaScript, sin errores de sintaxis. El buscador, el
acordeón y las anclas de `temas.html`, probados en Chromium: sin un solo error
de JavaScript. Ninguna guía se ha quedado fuera de `temas.html`.

Se han actualizado los tres scripts de comprobación (`validar.py`,
`auditoria.py`, `auditoria2.py`) para que cuenten las estructuras nuevas. Si no,
seguirían buscando el bloque «Sigue por aquí» y el pie viejo, darían cero y
parecería normal. `validar.py` además avisa ahora si alguien vuelve a enlazar a
`guias.html` o `indice.html`.

## Dos cosas que encontré de paso y no he tocado

1. **`cortar-pdf.html`** es una página de otro proyecto (MásPDF) que está en tu
   sitio, tiene su propio pie, **enlaza a 13 páginas que no existen** y está en
   el sitemap. No la enlaza nadie desde Psicolinks. No la borro porque es tuya y
   igual la tienes pensada para algo, pero ahora mismo son 13 enlaces rotos que
   Google ve.
2. **`tests.html` mide 10 pantallas de móvil**, y ya es la página más larga.
   Para once tests con su ficha completa es razonable, así que la he dejado;
   pero si añades tres o cuatro más, toca plegarla como los temas.

## Sigue pendiente, y no lo arregla el código

1. **El enlace desde concienciaconductual.com a psicolinks.com.**
2. Para que la newsletter envíe: `RESEND_API_KEY` en Netlify y psicolinks.com
   verificado en Resend.


---

# Tanda del 24 de agosto (tarde): septiembre, personalidad y una regresión mía

## Lo primero: por qué baja Analytics

No puedo ver tu Analytics, así que lo que sigue es lo que sí he podido
comprobar en el código y en la web publicada.

**Google Analytics solo cuenta a quien pulsa «Aceptar todo».** El script está
puesto como `type="text/plain"` hasta que hay consentimiento, que es lo correcto
legalmente y lo que exige la AEPD. Pero significa que **quien entra, lee y se va
sin tocar el banner no aparece en Analytics**. Y esa proporción cambia de una
semana a otra sin que cambie nada de tu tráfico real.

Conclusión práctica: **Analytics no es el sitio donde mirar si Google te manda
gente.** El sitio es **Search Console**, que cuenta desde el lado de Google,
no necesita consentimiento y no le afecta el banner. Si en Search Console las
impresiones y los clics están estables, no ha pasado nada.

Lo demás que he mirado:

- **La web está bien.** `robots.txt` correcto, sitemap servido con 217 URLs,
  ningún `noindex` donde no toca, ningún canonical mal puesto.
- **Hubo movimiento en Google del 1 al 3 de agosto**, no confirmado como
  actualización. Cae dos semanas antes de lo que dices, así que probablemente
  no es eso.
- **Es la última semana de agosto en España.** Es el suelo del año para
  cualquier web en español. Que baje esta semana concreta es lo esperable.

## Un fallo de SEO que causé yo ayer, y ya está arreglado

Al dejar el pie en tres enlaces, `archivo.html` pasó de **209 enlaces entrantes
a 2**. Es el archivo de los estudios diarios, y es la página por la que Google
llega a los cientos de artículos. Además, cada artículo diario era un callejón
sin salida: no enlazaba de vuelta al archivo.

Arreglado sin romper el pie de tres: **cada artículo diario enlaza ahora al
archivo** («← Todos los estudios»), que es donde ese enlace tiene sentido. Son
cientos de enlaces entrantes, y contextuales en vez de decorativos.

Y otro que venía de antes: los tres artículos de relleno de la portada —los que
el JavaScript sustituye por los de verdad— enlazaban a `post.html?id=ejemplo-1`,
una página marcada `noindex` con un id que no existe. Quien no ejecute
JavaScript veía en la página más importante del sitio tres enlaces a ninguna
parte. Ahora van al archivo.

## Y una regresión que me pillé a mitad de faena

Ejecuté `sweep_guias.py` sin haberlo actualizado, y **volvió a poner las dos
estructuras que quitamos ayer**: la línea de tres enlaces al final del pie (en
246 páginas) y el bloque «Sigue por aquí» con tres guías (en 207). Durante un
rato el sitio tuvo seis enlaces en el pie y cuatro guías ofrecidas al final.

Está limpio y, más importante, **los dos scripts que lo causaron están
corregidos**: `sweep_guias.py` ya no toca el pie y mantiene el siguiente paso de
uno; `reequilibrar_enlaces.py` reparte ahora un solo enlace en anillo —cada guía
enlaza a la siguiente de su categoría y recibe exactamente uno—, que es lo que
evita que reducir a uno deje guías sin ningún enlace entrante. Los dos son
idempotentes: ejecutarlos dos veces seguidas ya no cambia nada.

La lección queda escrita dentro del propio script: cuando se cambia una
estructura del sitio hay que cambiar a la vez lo que la mantiene, o el siguiente
barrido la resucita.

## Tres guías de compra, y son de temporada a propósito

Google tarda semanas en posicionar una página nueva, así que una guía de vuelta
al cole publicada en octubre no sirve de nada.

- **Volver a la rutina en septiembre** — el horario se descoloca en tres días y
  se recoloca en dos semanas.
- **Vuelta al cole cuando al niño le cuesta** — lloros en la puerta y dolor de
  tripa los domingos.
- **Ruido y concentración** — la confusión de siempre: la cancelación de ruido
  va bien con el ruido grave y mal con las voces, que es lo que desconcentra.

## Tres guías gratuitas que faltaban

Al escribir la de la vuelta al cole enlacé tres guías que daba por hechas y
**ninguna existía**. En vez de repuntar los enlaces a otra cosa, se han escrito:
**ansiedad de separación**, **miedos nocturnos en niños** y **premios y
castigos**. Las tres se buscan mucho en septiembre.

## Test de personalidad (Big Five)

El instrumento número trece que miro esta semana, y el primero con una licencia
verdaderamente limpia. El **International Personality Item Pool** dice en su
propia web que sus ítems son de dominio público y que se pueden «copiar, editar,
traducir y usar para cualquier fin sin pedir permiso y sin pagar». Sin cláusula
de «no comercial» —que es justo lo que me hizo descartar el WHO-5 en una web con
enlaces de afiliado— y con la traducción permitida expresamente.

Son 20 ítems (Mini-IPIP, Donnellan y cols., 2006). Tres decisiones que conviene
que sepas:

1. **El cuarto factor se presenta como «estabilidad emocional», no como
   neuroticismo.** Es como lo llama el propio IPIP, y devolverle «neuroticismo:
   alto» a alguien que llega preocupado es una etiqueta que se pega.
2. **No hay percentiles.** No existen baremos españoles de esta versión corta,
   así que dar un percentil sería inventarse una precisión que no se tiene. Se
   dan los puntos directos y tres tramos, dichos como orientativos.
3. **Se avisa arriba de que no es un test clínico.** Mide rasgos, no síntomas, y
   quien busque saber si necesita ayuda va al chequeo rápido, no a este.

Comprobado en navegador con dos perfiles opuestos: la puntuación inversa de los
ítems funciona en las dos direcciones. Sale también en «Tus resultados», en un
bloque propio y **sin gráfico de evolución a propósito**: los rasgos no se mueven
de un mes a otro y un gráfico invitaría a leer como mejoría lo que es el día que
tenías al contestar.

## Sobre MásPDF: me equivoqué ayer

Ayer te dije que `cortar-pdf.html` estaba en el sitemap y que eran «13 enlaces
rotos que Google ve». **Las dos cosas eran falsas** y lo siento: lo que había en
el sitemap era un comentario diciendo que se excluye a propósito, y yo conté el
comentario.

Lo que hay de verdad: la página está marcada `noindex`, su canonical apunta a
`maspdf.com` y no está en el sitemap ni la enlaza nadie. **Para el SEO de
Psicolinks no supone ningún problema.** Lo único cierto es que sus 14 enlaces de
menú van a páginas que no existen en este dominio, cosa que solo ve quien
aterrice ahí con un enlace directo. Como no sé si `maspdf.com` es un proyecto
tuyo en marcha, no he tocado la página: dime qué quieres hacer con ella.

## Comprobado antes de entregar

252 páginas, validador sin problemas, auditoría sin avisos. Los 25 ficheros de
JavaScript, sin errores de sintaxis. Las siete páginas nuevas, una a una en
Chromium: un solo `h1`, título y descripción dentro de longitud, canonical
correcto, ningún enlace de Amazon sin `sponsored` ni con la búsqueda vacía, pie
de seis y sin desbordes horizontales. Cero errores de JavaScript. Enlaces por
página: mediana 14, pie máximo 6 en todas — es decir, la simplificación de ayer
sigue en pie después de la regresión.

Ortografía: 298 palabras fuera del diccionario, todas legítimas; las nuevas son
el inglés de la cita del Mini-IPIP y «SNR», que es lo que pone en los paquetes
de tapones.

## Lo de siempre, que sigue pendiente

1. **El enlace desde concienciaconductual.com a psicolinks.com.**
2. `RESEND_API_KEY` en Netlify para que la newsletter envíe.
3. **Mira Search Console, no Analytics**, para saber si Google te manda gente.


---

# Tanda del 24 de agosto (noche): estrés, y dos fallos míos más

Esta es la que subes ahora. Seis páginas nuevas y tres correcciones que
encontré al revisarlo todo antes de entregar.

## Tres guías de gestión del estrés

- **Respirar para bajar la activación.** Se recomienda en todas partes y casi
  nunca se explica bien: lo que baja el pulso es que **soltar el aire dure más
  que cogerlo**, no «respirar hondo». Mucha gente hiperventila creyendo que se
  relaja. Lleva dentro un aviso que casi ninguna guía da: en quien tiene ataques
  de pánico, centrarse mucho en la respiración puede volverse en contra.
- **Relajación muscular progresiva.** La técnica de Jacobson de 1938. Se explica
  mal en casi todos lados y por eso mucha gente cree que no le funciona: **no es
  relajar los músculos, es tensarlos y soltarlos de golpe**, y el efecto viene
  del contraste.
- **Desconectar del trabajo al llegar a casa.** Lo que mejor predice acabar
  agotado no son las horas trabajadas, sino cuántas sigues con el trabajo en la
  cabeza. Ritual de cierre, qué hacer con lo pendiente y por qué el sofá con el
  móvil no descansa.

## Dos guías de compra

- **Cosas para el estrés del día a día.** Con el «no» más importante que he
  escrito en estas guías: las pulseras y anillos que dicen medir el estrés. No
  lo miden —miden variabilidad del pulso y le ponen etiqueta— y en alguien que
  ya va tenso, tener un número que mirar acaba en comprobar, comprobar y
  comprobar, que es el mecanismo por el que la ansiedad crece.
- **Moverte para subir el ánimo.** Corta en la parte de comprar y larga en la de
  no comprar, porque el ejercicio es de lo poco no clínico con respaldo serio
  para el ánimo y el sector vive de venderle máquinas a gente que necesita salir
  a andar.

## Un test más: procrastinación

Los diez ítems de la escala de **autodisciplina del IPIP** (alfa .85), la misma
fuente de dominio público que el Big Five. Sin percentiles, por lo de siempre.

**Y algo que descarté por el camino, que es la parte que importa.** Mi primera
idea era un test de asertividad, que encajaba con tus guías de poner límites.
Fui a mirar los ítems de la escala de asertividad del IPIP y son «tomo el
mando», «intento dirigir a otros», «convenzo a la gente»: eso mide **dominancia
social**, no la asertividad de la que hablan esas guías. Alguien a quien le
cuesta decir que no puede sacar una puntuación normal ahí. Publicarlo como
«test de asertividad» habría sido ponerle a un instrumento una etiqueta que no
le corresponde, así que no lo hice.

También volví a mirar el **Copenhagen Burnout Inventory**, que habría encajado
perfecto con las guías de estrés. Sigo sin encontrar la declaración original de
dominio público, solo fuentes secundarias que lo dan por hecho. Mismo criterio
que las otras doce veces: fuera.

## Tres fallos míos, encontrados y arreglados

1. **El barrido no ponía el siguiente paso en las guías nuevas.** Comprobaba si
   la cadena `siguiente-paso` estaba en la página, y esa cadena también aparece
   en las reglas CSS que trae la plantilla. Así que siempre creía que el bloque
   ya estaba. Ahora comprueba el marcado (`class="siguiente-paso"`), no la
   cadena suelta.
2. **El barrido generaba migas de pan apuntando a `guias.html`**, que desde ayer
   redirige. Había metido tres así. Corregido en el script y en las 6 páginas.
3. **En «Tus resultados», subir la puntuación se leía siempre como malo.** En
   los cuestionarios de síntomas lo es, pero en el de constancia subir es bueno,
   y a quien mejorara le habría salido «puede ser una mala racha puntual;
   coméntalo con un profesional». Ahora cada test declara en qué dirección está
   la mejora.

## Comprobado antes de entregar

258 páginas, validador sin problemas, auditoría sin avisos. Los 25 ficheros de
JavaScript sin errores de sintaxis. Las seis páginas nuevas verificadas una a
una en Chromium: h1 único, título y descripción dentro de longitud, canonical
correcto, ningún enlace de Amazon sin `sponsored`, pie de seis y sin desbordes.
El test de procrastinación probado con cuatro perfiles: 50, 10, 40 y 20 puntos,
exacto en las dos direcciones. `sweep_guias.py` y `reequilibrar_enlaces.py`
ejecutados dos veces seguidas: la segunda no cambia nada.

**Y la comprobación que importa para lo del rastreo: de las 244 páginas del
sitemap, 244 tienen al menos un enlace interno. Cero huérfanas.** Eso es lo que
debería mover las 84 «Descubierta: actualmente sin indexar».

## Después de subir

1. Search Console → Inspección de URLs → **Solicitar indexación** de
   `temas.html` y de `archivo.html`. Solo esas dos.
2. **El enlace en concienciaconductual.com.** Te mandé el bloque hecho.
3. Vuelve a mirar la indexación en dos semanas.


---

# Nueve herramientas para tus pacientes

Tu idea, y es buena: mandar a tus pacientes a la web a llevar sus
autorregistros. Ellos lo tienen a mano en el móvil, tú recibes visitas, y
cuando vuelven a consulta te lo enseñan en vez de reconstruirlo de memoria.

## Las nueve, en tres grupos de tres

**Para ver qué mantiene lo que te pasa** — Registro A-B-C (ya lo tenías),
Registro de pensamientos, Termómetro del día.

**Para trabajar en algo concreto** — Registro de exposición, Registro de
actividades y ánimo (activación conductual), Diario de sueño.

**Para cuidarte** — Diario de gratitud, Registro de meditación, La carta que no
vas a enviar.

Tres grupos de tres, no una lista de nueve: nueve cosas seguidas no se leen.
Es el mismo motivo por el que temas.html se plegó.

## Cómo funcionan, y por qué así

- **Nada sale del navegador.** Son datos de salud de personas identificables.
  Guardarlos en un servidor obligaría a base legal, cifrado, encargado de
  tratamiento y todo el aparato del RGPD; con `localStorage` no hay nada de eso
  porque no hay tratamiento por tu parte.
- **Todas llevan «copiar» e «imprimir».** Es el punto entero del invento. Copiar
  saca un texto plano ordenado por fechas; imprimir sale limpio, sin cabecera,
  sin pie y sin el formulario: solo las anotaciones.
- **Las que tienen un número llevan gráfico** de las últimas treinta entradas.
  En el registro de exposición eso es lo que más sostiene: ver la columna de
  «ansiedad al terminar» bajar semana a semana.
- **Ninguna lleva el bloque de tu consulta.** A quien llega ahí lo mandas tú.
- Se generan **desde un solo script**. Nueve páginas escritas a mano se
  desincronizan en dos semanas.

`herramientas.html` es la página a la que mandar a la gente. Sin buscador, sin
filtros y sin guías relacionadas: nueve tarjetas y una línea cada una.

## Lo de repetir «ven a mi consulta»

Tenías razón en el diagnóstico: el bloque salía en 242 páginas y repetido así
deja de leerse. Pero dejarlo **solo en la portada** te haría daño, y prefiero
decírtelo: la gente no entra por la portada, entra desde Google a una guía
concreta. De tus 66 páginas indexadas, la portada es una. Si el único sitio
donde dice que pasas consulta fuera esa, casi nadie lo vería.

Así que:

- **Herramientas y registros:** fuera del todo, como pediste.
- **Guías y tests (233 páginas):** el bloque de seis líneas pasa a **una sola
  frase**. Sigue el enlace a tu consulta y sigue «dónde pedir ayuda», que es lo
  que evita que sea un anuncio. Ocupa una quinta parte.
- **Portada:** ahí sí va el bloque entero, y de hecho era la única página que
  no lo tenía. Ya está puesto, después de los estudios del día.

Si aun así lo quieres solo en la portada, es cambiar una lista en un script.

## La redundancia que viste en la captura

`registro-abc.html` tenía «Preguntas antes de ir al psicólogo» en una línea
suelta y otra vez dos centímetros más abajo. No era un caso aislado:

- **10 líneas de enlaces sueltas** quitadas, de cuando no existía el bloque de
  «si quieres seguir» y ahora lo duplicaban.
- **El «siguiente paso» ya no repite un enlace que esté en el texto.** Ahora
  avanza por el anillo de su categoría hasta encontrar una guía que no estés
  leyendo ya enlazada arriba.
- **Mi propia firma repetía tu nombre y el enlace a «sobre mí»**, que ya está en
  la línea de autoría de arriba. Acortada.

Enlaces repetidos a menos de media pantalla: de más de 200 a 9, y los que
quedan son legítimos (una ficha de test con enlace en el título y en el botón).

## Comprobado antes de entregar

267 páginas, validador sin problemas, auditoría sin avisos. Las ocho
herramientas nuevas probadas una a una en Chromium: guardan, listan, no dejan
guardar en vacío, pintan el gráfico, y ninguna lleva bloque de consulta. Copiar
al portapapeles y la vista de impresión, comprobados de verdad. Cero errores de
JavaScript. **De las 253 páginas del sitemap, 253 tienen enlace interno.**

Dos fallos míos corregidos por el camino: `reequilibrar_enlaces.py` se pisaba a
sí mismo —contaba su propio enlace como «ya está en el texto» y elegía otro en
cada ejecución— y `validar.py` contaba reglas CSS como si fueran bloques. Los
dos scripts vuelven a ser idempotentes.


---

# Tanda del 25 de agosto (tarde): dos herramientas, cinco guías y dos de compra

## Las dos herramientas, que es lo que me preguntabas

**Jerarquía de exposición.** Es la mitad que faltaba. Tenías el *registro* de
exposición, que sirve para apuntar cada práctica ya hecha, pero no la escalera,
que va antes: la lista de situaciones puntuadas de 0 a 100 y ordenadas de la más
fácil a la más difícil. Sin escalera no hay exposición ordenada, y montarla es
justo lo que un psicólogo manda hacer entre la primera y la segunda sesión.

Tres detalles que importan: se ordena sola de menor a mayor (la escalera se sube
por abajo), cada peldaño se marca «en marcha» o «superado», y **la página avisa
cuando entre dos peldaños hay más de veinte puntos**, que es el error que más
abandonos provoca. Escala 0-100 y no 0-10 a propósito: con diez puntos la gente
amontona media lista en el 8 y luego no hay forma de ordenarla.

**Plan de prevención de recaídas.** Esta la eché en falta yo mismo: en la guía
del familiar con un trastorno mental grave escribí «haced juntos una lista de
señales, escrita», y luego no había dónde escribirla. Seis apartados —señales de
aviso, qué suele venir antes, lo que me funciona, lo que me hunde, a quién aviso
y qué le pido, y lo acordado de antemano— y arriba del todo lo único que
importa: **esto se rellena en un día bueno**, porque en mitad de una mala racha
nadie está en condiciones de decidir a quién llamar.

No es un registro diario: es un documento que se guarda, se vuelve a abrir con
lo que había y se edita. Al imprimir sale una hoja limpia, sin formulario, para
la nevera. **El 024 y el 112 salen siempre**, se escriba lo que se escriba
arriba: quien rellena esa hoja puede estar en un mal momento y esos dos números
no pueden depender de que se acuerde de ponerlos.

El hub pasa a **once herramientas** en los mismos tres grupos, con la escalera
justo antes del registro de exposición: primero se monta, luego se sube.

## Cinco guías

- **Duelo anticipado.** Estaba «acompañar en una enfermedad grave» y estaba
  «cuando pierdes a alguien», pero no el tiempo de en medio, que es larguísimo.
  Incluye el alivio y la culpa que trae detrás, que casi nadie se atreve a decir.
- **Hablar de drogas y alcohol con tu hijo.** Con los dos errores que hunden esa
  conversación: la charla solemne y exagerar, que te quita credibilidad también
  para lo que sí es grave.
- **Cuando el paro se hace largo.** Lo que más deteriora no es el dinero: es que
  se cae la estructura del día. Y cambiar el marcador de «me han llamado» a
  conductas, que es lo único que depende de ti.
- **Miedo a los perros.** Faltaba, siendo de las fobias más frecuentes. Enlaza
  directamente con la jerarquía nueva.
- **Un divorcio o un juicio.** Estaba «separación con hijos» pero no el proceso,
  que dura meses. Con la confusión que sale más cara: esperar que la sentencia
  dé la razón moral.

## Dos guías de compra

**Cosas para preparar una oposición** y **viajar con ansiedad**. La segunda
lleva un apartado que desactiva media guía y tenía que ir: casi todo lo que se
vende para el miedo a volar sirve para **no enterarte** de que estás volando, y
no enterarse es evitación, que es exactamente lo que mantiene el miedo.

## Comprobado antes de entregar

283 páginas, validador sin problemas, auditoría sin avisos. Las nueve páginas
nuevas verificadas una a una en Chromium. Las dos herramientas, probadas de
verdad: la jerarquía ordena sola (metí 85, 15, 45 y 30 y salieron 15→30→45→85),
detecta el salto grande, marca superados y copia bien; el plan guarda, recupera
lo escrito al recargar, mete el 024 y el 112 en lo que se copia, y al imprimir
oculta el formulario y saca la hoja limpia. Cero errores de JavaScript.

Un fallo mío corregido: la hoja de impresión del plan llevaba su propio `h1`, o
sea que la página tenía dos. Lo pilló el validador.

**De las 269 páginas del sitemap, 269 tienen enlace interno.**


---

# Arreglo: las herramientas no se podían encontrar

Miguel abrió su registro A-B-C, pulsó la flecha de volver y acabó en las guías.
Y luego no encontraba el diario de gratitud. Al mirarlo, el problema era bastante
peor que la flecha:

**A `herramientas.html` solo enlazaban las diez herramientas nuevas y
`temas.html`.** La portada no. `tests.html` tampoco. Y `registro-abc.html` —que
es la que mandas a tus pacientes y la que lleva más tiempo en la web— tampoco:
su flecha iba a las guías. O sea que **quien entraba por el A-B-C no tenía
ninguna forma de descubrir que existían otras diez.**

El A-B-C es más antiguo que el resto y se quedó con la navegación de cuando era
una herramienta suelta. Ahora es una de once y no se le había actualizado.

Arreglado:

- La flecha del A-B-C va a las herramientas, y su pie iguala al de las otras diez.
- **La portada gana «🗒️ Herramientas» en el menú.** Es la cuarta entrada y hace
  falta: es el único sitio de la web donde alguien se orienta. El menú queda en
  Empieza aquí · Las guías · Herramientas · Mi consulta.
- `tests.html` y `herramientas.html` se enlazan entre sí. Son hermanas —medirse
  y registrarse— y no se conocían.

Lo que **no** se ha tocado: el pie de las 277 páginas sigue con tres enlaces.
Añadir un cuarto a todo el sitio es justo lo que se quitó hace dos días.

Comprobado en navegador: desde el A-B-C la flecha lleva al hub, el hub lista las
once, desde la portada se llega en un clic y las once páginas responden 200.

**Un recordatorio importante:** nada de esto está en psicolinks.com todavía. En
la web publicada solo existe el registro A-B-C; las otras diez herramientas, las
guías nuevas y todo lo demás están únicamente en el ZIP. Si has mirado el sitio
en vivo, por eso no encontrabas el diario de gratitud.


---

# Contacto, cuatro guías y una herramienta más

## El correo de contacto

Está en `contacto.html`, enlazado desde la línea legal del pie de las 283
páginas: **© 2026 Psicolinks · Contacto · Aviso legal · Privacidad · Cookies**.
No he tocado la línea de navegación, que sigue con tres.

Tres decisiones que conviene que sepas:

- **La dirección no está escrita entera en el código.** Va partida y la junta el
  JavaScript al cargar. Un correo escrito tal cual en 283 pies es un imán para
  los robots que rastrean direcciones. Quien tenga el JavaScript desactivado ve
  «concienciaconductual arroba gmail.com» y una nota diciendo que junte las dos
  partes: probado con el JavaScript apagado y se lee bien.
- **No hay formulario, a propósito.** Un formulario necesita un servicio de
  envío por detrás, y ese sería Resend, cuya clave sigue sin configurarse en
  Netlify —lo mismo que tiene parada la newsletter—. Un formulario que no envía
  es peor que no tenerlo: la persona escribe, pulsa enviar y cree que ha
  llegado. Cuando pongas la clave, montarlo es media hora.
- **Arriba del todo van el 024, el 112 y el 016**, antes que la dirección. Quien
  llega a una web de psicología buscando ayuda no puede encontrarse primero un
  correo que a lo mejor se lee en tres días.

**Y una cosa que tienes que decidir tú:** tu `aviso-legal.html` ya lleva un
correo de contacto, y **es otro distinto: `miqvalsagi@gmail.com`**. No lo he
tocado porque es un documento legal y cambiar ahí la dirección es decisión tuya.
Pero conviene que sean el mismo, o alguien que escriba a la del aviso legal
puede no ser leído. Dime cuál quieres y lo unifico.

## Cuatro guías

- **Cuando tu pareja te controla.** Era el hueco más serio que quedaba: había
  acoso laboral y no había nada sobre violencia psicológica en pareja. Lleva el
  **016** dentro —gratuito, 24 horas, no deja rastro en la factura— y, lo
  primero de todo, el aviso de cerrar la página y borrar el historial si alguien
  puede mirar ese móvil.
- **Tu hijo y la comida: cuándo preocuparse.** Tampoco había nada de conducta
  alimentaria. Escrita **solo para el padre o la madre** y sin un solo dato que
  pueda usarse mal: ni pesos, ni cifras, ni métodos. Lo que describe son cambios
  de conducta observables desde fuera, y el mensaje central es que no se ve en
  la báscula y que entrar por la comida es el error más repetido.
- **Miedo a las alturas.** Había ocho fobias concretas y esta no. Empieza
  deshaciendo la confusión con el vértigo, que manda a mucha gente al médico
  equivocado durante años.
- **Sentirte solo estando en pareja.** Distinto de «cuando te sientes solo» y de
  «mi pareja no me habla», y no estaba.

## Una herramienta más: antes y después de la sesión

Ya son doce. Esta es la que un paciente usaría **cada semana**, que es la
frecuencia más alta de todas: lo que quiere contar hoy, cómo ha ido la semana,
lo que se lleva al salir y —la casilla que de verdad importa— **lo que va a
probar hasta la próxima**, que es lo que más se olvida y donde ocurre el cambio.
Lleva también «¿hiciste lo de la vez anterior?», con la nota de que un «no» es
información buena y normalmente significa que el paso era demasiado grande.

## Un fallo mío, pillado por mi propia comprobación

Puse el enlace de contacto en el pie **antes** de generar las guías nuevas, así
que las seis páginas creadas después nacieron sin él, y otras ocho tampoco lo
tenían. La prueba de navegador contaba enlaces del pie y saltó. Arreglado en las
catorce páginas **y en las ocho plantillas**, que era lo importante: si solo
arreglas los ficheros, la próxima tanda vuelve a nacer sin el enlace.

## Comprobado antes de entregar

289 páginas, validador sin problemas, auditoría sin avisos. Las seis páginas
nuevas verificadas una a una en Chromium. La página de contacto probada con y
sin JavaScript. La herramienta de sesión, guardando. La guía de control,
comprobado que lleva el 016 y el aviso del historial. Cero errores de
JavaScript. **De las 275 páginas del sitemap, 275 tienen enlace interno.**


---

# El bloque de la consulta que se me coló en dos herramientas

Miguel señaló, con captura, un bloque al final del registro A-B-C: «Y si quieres
que lo miremos juntos… paso consulta en Conciencia Conductual». En una página a
la que él manda a sus pacientes, eso sobra, y era justo lo que se había quedado
en quitar.

**Por qué mi propia comprobación no lo pilló**, que es lo importante: el script
que reparte el bloque de la consulta busca `<div class="consulta-cta">` y
`<div class="firma-consulta">`. Estas dos menciones no eran bloques: eran una
frase dentro de un párrafo de cierre normal, escrita hace semanas. Así que el
control decía «ninguna herramienta lleva nada de la consulta ✓» y era mentira.

Arreglado en las dos páginas —`registro-abc.html` y `mis-resultados.html`, que
tenía otra igual que nadie había visto— y, sobre todo, **en la comprobación**:
ahora mira también el texto del cuerpo, no solo los dos `<div>` conocidos. Los
datos estructurados sí conservan el enlace, que ahí es legítimo y no lo lee
ningún visitante.

Lo que queda en su lugar dice lo útil sin vender nada: «Llévatelo cuando vayas.
Una semana de registro es la mejor primera sesión que existe… llévaselo a quien
te atienda, sea quien sea».

## Sobre la flecha y las herramientas que no aparecían

Las dos cosas **ya estaban arregladas** en el ZIP anterior: la flecha del A-B-C
lleva a las herramientas desde entonces y el hub lista las doce. Comprobado otra
vez en navegador: la flecha va a `/herramientas.html`, y ahí están las doce,
incluido el diario de gratitud. Si sigues viendo «← Todas las guías», estás
mirando una copia anterior o la web publicada, donde nada de esto existe todavía.
