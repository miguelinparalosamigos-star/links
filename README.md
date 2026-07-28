# Psicolinks — blog de psicología con estudios reales (lunes a viernes)

## Cómo funciona

1. Cada día laborable (lunes a viernes), `fetch-studies.js` busca automáticamente estudios recientes de psicología en **PubMed** (base de datos científica pública y gratuita — nada de copiar otras webs).
2. Redacta un titular y un resumen breve en español con la API de Claude.
3. **Lo publica directamente** en la portada (`index.html`), sin pasar por ningún paso de revisión. No tienes que hacer nada ningún día.

Nota: `/admin.html` ya no revisa borradores (ahora todo se publica solo) — se ha reconvertido en un **panel de estadísticas** protegido con la misma clave. `list-drafts.js`/`review-draft.js` se quedaron sin usar por si algún día quieres volver al modo de revisión manual.

## Monetización activa

- **Cada artículo** enlaza a un libro relacionado (con enlace de afiliado) y a concienciaconductual.com, con un aviso breve de que el enlace es de afiliado.
- **Portada y cada artículo** tienen un formulario para apuntarse por email (se guardan en Netlify Blobs, en el almacén `suscriptores`). De momento solo se guardan — enviar un correo real de verdad (una newsletter que se dispare sola) es un paso aparte, todavía sin construir.
- **`/admin.html`** ahora muestra: visitas a portada, número de suscriptores, artículos más vistos, y visitas por día (últimos 14 días).
- **La portada muestra como máximo 12 artículos** (los más recientes). Cuando hay más, aparece un enlace a **`/archivo.html`**, que lista todos los artículos publicados, del más nuevo al más viejo.

## Qué necesitas configurar antes de que funcione de verdad

En Netlify → **Site settings → Environment variables**, añade:

- `ANTHROPIC_API_KEY` — tu clave de la API de Claude, se saca en console.anthropic.com (tiene un coste pequeño por uso, no es gratis).
- `ADMIN_PASSPHRASE` — una clave que te inventes tú, para proteger `/admin.html`. No se la des a nadie ni la escribas en el código.
- `NCBI_API_KEY` — opcional. PubMed funciona gratis sin ella; con ella, simplemente permite más búsquedas por segundo.

## Mientras tanto

La portada ya muestra 3 publicaciones de ejemplo para que veas el diseño. En cuanto se publique el primer estudio real (automáticamente, un día laborable a las 07:00 UTC), esos ejemplos desaparecen solos y se sustituyen por contenido real.

## Pendiente

- **Página de aviso legal / privacidad — esto ya no es opcional.** Desde que se guardan emails de suscriptores, el sitio recoge datos personales, así que hace falta cuanto antes (quién eres, para qué se usa el email, cómo se puede borrar). Lo puedo redactar cuando quieras.
- Decidir si el email captado se usa de verdad para enviar una newsletter periódica (necesitaría un servicio de envío de correo aparte) — hoy solo se guarda.
