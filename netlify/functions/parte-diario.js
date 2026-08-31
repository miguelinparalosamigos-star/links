import { getStore } from '@netlify/blobs';

// ---------------------------------------------------------------------------
// PARTE DIARIO POR TELEGRAM
//
// Cada mañana manda un mensaje con cómo va la web: qué publicó el bot de
// PubMed, visitas, consultas sin responder, suscriptores y avisos si algo no
// cuadra. Se dispara solo con el `config.schedule` del final.
//
// QUÉ HACE FALTA (una vez):
//   1. En Telegram, habla con @BotFather → /newbot → te da un token.
//   2. Escríbele algo a tu bot desde tu cuenta (si no, no te puede contestar).
//   3. Abre https://api.telegram.org/bot<TU_TOKEN>/getUpdates y copia el
//      "chat":{"id":123456789} que salga: ese es tu TELEGRAM_CHAT_ID.
//   4. En Netlify → Site configuration → Environment variables, añade
//      TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID.
//
// Si falta alguna de las dos variables, la función no revienta: lo escribe en
// el log y no manda nada.
//
// Para probarlo sin esperar a mañana, entra a mano en
// https://psicolinks.com/.netlify/functions/parte-diario
//
// NO manda el contenido de las consultas, solo cuántas hay. Lo que la gente
// escribe en el consultorio no sale de Netlify.
// ---------------------------------------------------------------------------

const ZONA = 'Europe/Madrid';
// El mismo tope que lleva fetch-studies.js: si un día salen más, es que la
// función se ha disparado dos veces.
const MAX_POR_EJECUCION = 5;

function hoyLocal(desplazamientoDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + desplazamientoDias);
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA }).format(d); // AAAA-MM-DD
}

function fechaBonita() {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date());
}

function diaSemana() {
  return new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'short' }).format(new Date());
}

function esFinDeSemana() {
  const d = diaSemana();
  return d === 'Sat' || d === 'Sun';
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Lee todos los blobs de un store y los devuelve como objetos.
async function leerTodo(nombre) {
  const store = getStore(nombre);
  const { blobs } = await store.list();
  const salida = [];
  for (const b of blobs) {
    const item = await store.get(b.key, { type: 'json' });
    if (item) salida.push({ _clave: b.key, ...item });
  }
  return salida;
}

async function contar(nombre) {
  try {
    const { blobs } = await getStore(nombre).list();
    return blobs.length;
  } catch {
    return null;
  }
}

async function enviarTelegram(texto) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.log('parte-diario: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID. El parte habría sido:\n' + texto);
    return { enviado: false, motivo: 'faltan las variables de entorno' };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat,
      text: texto,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const detalle = await res.text();
    console.error('parte-diario: Telegram respondió', res.status, detalle.slice(0, 300));
    return { enviado: false, motivo: `Telegram ${res.status}` };
  }
  return { enviado: true };
}

export default async () => {
  const avisos = [];
  const lineas = [`📋 <b>Psicolinks</b> · ${esc(fechaBonita())}`, ''];

  // ------------------------------------------------------- artículos de hoy
  try {
    const posts = await leerTodo('posts');
    const hoy = hoyLocal();
    const deHoy = posts.filter((p) => (p.fechaPublicacion || p.fecha || '').slice(0, 10) === hoy);
    lineas.push(`📰 <b>Artículos hoy:</b> ${deHoy.length} (${posts.length} en total)`);
    deHoy.slice(0, 6).forEach((p) => lineas.push(`   · ${esc((p.titulo || '').slice(0, 90))}`));

    if (deHoy.length === 0 && !esFinDeSemana()) {
      avisos.push('Hoy no ha publicado nada el bot de PubMed. Mira los logs de fetch-studies: la vez anterior fue por quedarse sin saldo en la API.');
    }
    if (deHoy.length > MAX_POR_EJECUCION) {
      avisos.push(`Hoy han salido ${deHoy.length} artículos y el tope por ejecución son ${MAX_POR_EJECUCION}: parece que fetch-studies ha corrido dos veces.`);
    }
  } catch (err) {
    avisos.push('No se han podido leer los artículos: ' + err.message);
  }

  // ------------------------------------------------------------- visitas
  try {
    const stats = getStore('estadisticas');
    const { blobs } = await stats.list();
    const porDia = {};
    for (const b of blobs) {
      if (!b.key.startsWith('dia:')) continue;
      const item = await stats.get(b.key, { type: 'json' });
      porDia[b.key.slice(4)] = (item && item.total) || 0;
    }
    const ayer = hoyLocal(-1);
    const ultimos = Object.keys(porDia).sort().reverse().slice(0, 7);
    const media = ultimos.length
      ? Math.round(ultimos.reduce((a, d) => a + porDia[d], 0) / ultimos.length)
      : 0;
    const deAyer = porDia[ayer] || 0;
    lineas.push('', `👀 <b>Visitas ayer:</b> ${deAyer} (media de los últimos ${ultimos.length} días: ${media})`);

    if (deAyer === 0 && ultimos.length > 1) {
      avisos.push('Ayer no se contó ni una visita. O no entró nadie, o track-view ha dejado de contar.');
    }
  } catch (err) {
    avisos.push('No se han podido leer las estadísticas: ' + err.message);
  }

  // ------------------------------------------- consultas y suscriptores
  const pendientes = await contar('consultas');
  const suscriptores = await contar('suscriptores');
  if (pendientes !== null) {
    lineas.push(`✉️ <b>Consultas sin responder:</b> ${pendientes}`);
    if (pendientes > 0) {
      avisos.push(`Tienes ${pendientes} consulta${pendientes === 1 ? '' : 's'} esperando respuesta en /admin-consultas.html.`);
    }
  }
  if (suscriptores !== null) lineas.push(`🔔 <b>Suscriptores:</b> ${suscriptores}`);

  // ------------------------------------------------------------- sitemap
  try {
    const res = await fetch('https://psicolinks.com/sitemap.xml');
    if (res.ok) {
      const xml = await res.text();
      const n = (xml.match(/<loc>/g) || []).length;
      lineas.push(`🗺️ <b>Sitemap:</b> ${n} direcciones`);
      if (n < 300) avisos.push(`El sitemap solo trae ${n} direcciones: algo se ha quedado fuera.`);
    } else {
      avisos.push(`El sitemap responde ${res.status}.`);
    }
  } catch (err) {
    avisos.push('No se ha podido leer el sitemap: ' + err.message);
  }

  // Los lunes, el recordatorio de la copia. Los artículos y los suscriptores
  // solo existen en el almacén de Netlify: si eso se pierde, no hay repuesto.
  if (diaSemana() === 'Mon') {
    avisos.push('Lunes: toca bajarse la copia de seguridad desde /admin.html. Los artículos y los suscriptores no están en GitHub.');
  }

  // --------------------------------------------------------------- avisos
  if (avisos.length) {
    lineas.push('', '⚠️ <b>Para mirar</b>');
    avisos.forEach((a) => lineas.push(`   · ${esc(a)}`));
  } else {
    lineas.push('', '✅ Sin novedades.');
  }

  const texto = lineas.join('\n');
  const envio = await enviarTelegram(texto);

  return new Response(JSON.stringify({ ok: true, avisos: avisos.length, ...envio }, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

// Todos los días a las 07:30 UTC — media hora después de que fetch-studies haya
// publicado, para que el parte ya cuente lo de hoy. En hora española son las
// 9:30 en verano y las 8:30 en invierno.
export const config = {
  schedule: '30 7 * * *',
};
