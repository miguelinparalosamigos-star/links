# Psicolinks — blog de psicología con estudios reales (lunes a viernes)

## Cómo funciona

1. Cada día laborable (lunes a viernes), `fetch-studies.js` busca automáticamente estudios recientes de psicología en **PubMed** (base de datos científica pública y gratuita — nada de copiar otras webs).
2. Redacta un titular y un resumen breve en español con la API de Claude.
3. **Lo publica directamente** en la portada (`index.html`), sin pasar por ningún paso de revisión. No tienes que hacer nada ningún día.
4. El boletín de novedades por email está construido pero **en pausa a propósito** (ver "Boletín de novedades por email" más abajo): el formulario de suscripción no aparece en la web todavía. Cuando se retome, en cuanto haya suscriptores, esta misma ejecución les mandará un correo avisando de los artículos nuevos.

Nota: `/admin.html` ya no revisa borradores (ahora todo se publica solo) — se ha reconvertido en un **panel de estadísticas** protegido con la misma clave. `list-drafts.js`/`review-draft.js` se quedaron sin usar por si algún día quieres volver al modo de revisión manual.

## Monetización activa

- **Cada artículo** enlaza a uno o dos libros relacionados (con enlace de afiliado, elegidos automáticamente según el tema del artículo) y a concienciaconductual.com, con un aviso breve de que el enlace es de afiliado.
- **Portada y cada artículo** tienen botones para compartir por WhatsApp, Facebook, X y email.
- El formulario para apuntarse por email existe en el código (guarda en Netlify Blobs, en el almacén `suscriptores`) pero está **desactivado en la web a propósito, de momento**. Ver "Boletín de novedades por email" abajo.
- **`/admin.html`** muestra: visitas a portada, número de suscriptores, artículos más vistos, clics en libros/compartir, y visitas por día (últimos 14 días).
- **La portada muestra como máximo 12 artículos** (los más recientes). Cuando hay más, aparece un enlace a **`/archivo.html`**, que lista todos los artículos publicados, del más nuevo al más viejo.

## Boletín de novedades por email (en pausa, pendiente de retomar)

Todo el mecanismo ya está construido y probado: cuando `fetch-studies.js` publica artículos nuevos, manda automáticamente un correo a cada suscriptor guardado, con el título, un resumen corto y el enlace a cada artículo — usando **Resend** para el envío. Cada correo lleva su propio enlace de baja (`/.netlify/functions/unsubscribe`), único por suscriptor, que borra su email de la lista al pulsarlo.

Está en pausa solo porque falta tiempo para configurar Resend, así que el formulario de suscripción se ha quitado de `index.html` (no aparece en la web) y las funciones `subscribe.js`/`unsubscribe.js` se han dejado tal cual, listas para reactivarse en cuanto se retome.

Para retomarlo hacen falta dos pasos, **una sola vez**:

1. Crea una cuenta gratuita en [resend.com](https://resend.com) (gratis hasta 3.000 correos al mes, de sobra para empezar).
2. Dentro de Resend, ve a **Domains → Add domain**, añade `psicolinks.com`, y copia los 2-3 registros DNS (tipo TXT/CNAME) que te da a donde tengas gestionado el DNS de ese dominio (el mismo sitio donde apuntaste psicolinks.com hacia Netlify). Resend verifica el dominio solo en cuanto detecta esos registros — puede tardar desde minutos hasta un par de horas.
3. Con el dominio verificado, ve a **API Keys → Create API Key** en Resend, y pega esa clave en Netlify → **Site settings → Environment variables** como `RESEND_API_KEY`.

Mientras el dominio no esté verificado (o falte la clave), los artículos se siguen publicando exactamente igual — el envío del boletín simplemente se omite y queda anotado en los logs de la función, sin romper nada.

## Qué necesitas configurar antes de que funcione de verdad

En Netlify → **Site settings → Environment variables**, añade:

- `ANTHROPIC_API_KEY` — tu clave de la API de Claude, se saca en console.anthropic.com (tiene un coste pequeño por uso, no es gratis).
- `ADMIN_PASSPHRASE` — una clave que te inventes tú, para proteger `/admin.html`. No se la des a nadie ni la escribas en el código.
- `RESEND_API_KEY` — para el boletín de novedades (ver arriba). Opcional: si no la añades, todo lo demás sigue funcionando igual, simplemente no se manda correo.
- `NCBI_API_KEY` — opcional. PubMed funciona gratis sin ella; con ella, simplemente permite más búsquedas por segundo.

## Mientras tanto

La portada ya muestra 3 publicaciones de ejemplo para que veas el diseño. En cuanto se publique el primer estudio real (automáticamente, un día laborable a las 07:00 UTC), esos ejemplos desaparecen solos y se sustituyen por contenido real.
