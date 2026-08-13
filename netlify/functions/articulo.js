import { getStore } from '@netlify/blobs';

// =====================================================================
// PÁGINA DE ARTÍCULO RENDERIZADA EN EL SERVIDOR (para SEO)
// =====================================================================
// Se sirve en URLs limpias tipo  /articulo/titulo-legible/<id>  gracias a
// la redirección de netlify.toml:  /articulo/*  ->  esta función.
//
// A diferencia de post.html (que pinta el artículo con JavaScript, y Google
// ve "Cargando…"), aquí el TEXTO del artículo ya viene dentro del HTML, con
// su <title>, descripción, canonical y datos estructurados. Eso es lo que
// hace que Google lo indexe bien. El diseño es idéntico al de post.html.
//
// Los libros y el "sigue leyendo" se resuelven igual que en post.html: los
// libros van en el HTML (server), y los relacionados + el registro de visita
// se cargan con un pequeño script al final (no son críticos para SEO).
//
// Si algún día añades un libro nuevo, acuérdate de añadirlo TAMBIÉN en
// post.html (el catálogo vive en los dos sitios).

// ---------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------
function escapeHtml(t) {
  return String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'articulo';
}

function dividirEnParrafos(texto) {
  if (!texto) return [];
  let partes = texto.split(/\n\s*\n+/).map((t) => t.trim()).filter(Boolean);
  if (partes.length <= 1) partes = texto.split(/\n+/).map((t) => t.trim()).filter(Boolean);
  return partes.length > 0 ? partes : [texto.trim()];
}

// ---------------------------------------------------------------------
// Catálogo de libros (misma lista que post.html — mantener las dos iguales)
// ---------------------------------------------------------------------
const CATALOGO_LIBROS = [
  { id: 'superregla', titulo: 'La superregla', emoji: '📖', url: 'https://amzn.to/3TLnBZL', general: true, temas: ['ansiedad', 'estres-trauma', 'estado-animo', 'bienestar'], palabrasClave: ['ansiedad', 'ansioso', 'ansiosa', 'miedo', 'miedos', 'evitación', 'evitar', 'pánico', 'panico', 'fobia', 'fobias', 'estrés', 'estres', 'preocupación', 'preocupa', 'preocupaciones', 'emoción', 'emociones', 'emocional', 'malestar', 'psicofármaco', 'angustia', 'nervios', 'nerviosismo', 'rumia', 'rumiación', 'obsesión', 'obsesivo'] },
  { id: 'esqueyosoyasi', titulo: 'Es que yo soy así', emoji: '📖', url: 'https://www.amazon.es/dp/B0GSJYQNHD?tag=conciencia07-21', general: true, temas: ['personalidad', 'bienestar'], palabrasClave: ['personalidad', 'identidad', 'carácter', 'caracter', 'patrón', 'patrones', 'costumbre', 'rutina', 'autoconcepto', 'creencia', 'creencias', 'diagnóstico', 'etiqueta', 'autoestima', 'inseguridad', 'autocrítica', 'autocritica', 'autocompasión', 'perfeccionismo', 'vergüenza', 'verguenza'] },
  { id: 'habitos-sueno', titulo: 'Los hábitos del sueño', emoji: '📖', url: 'https://www.amazon.es/dp/8410467216?tag=conciencia07-21', temas: ['sueno'], palabrasClave: ['sueño', 'sueno', 'dormir', 'insomnio', 'descanso', 'siesta', 'despertar', 'dormido', 'duerme', 'duermen', 'rem', 'circadiano', 'melatonina', 'pesadilla'] },
  { id: 'ciencia-memoria', titulo: 'La ciencia de la memoria', emoji: '📖', url: 'https://www.amazon.es/dp/8413612276?tag=conciencia07-21', temas: ['memoria', 'atencion'], palabrasClave: ['memoria', 'recordar', 'recuerdo', 'recuerdos', 'olvido', 'olvidar', 'aprendizaje', 'aprender', 'aprende', 'cognición', 'cognitivo', 'cognitiva', 'atención', 'atencion', 'concentración', 'concentracion'] },
  { id: 'amar-o-depender', titulo: '¿Amar o depender?', emoji: '📖', url: 'https://www.amazon.es/dp/8408126245?tag=conciencia07-21', temas: ['pareja', 'social'], palabrasClave: ['pareja', 'relación', 'relaciones', 'apego', 'dependencia emocional', 'amor', 'vínculo', 'vínculos', 'vinculo', 'vinculos', 'ruptura', 'celos', 'matrimonio', 'divorcio', 'soledad', 'amistad', 'amigos'] },
  { id: 'pensar-rapido-despacio', titulo: 'Pensar rápido, pensar despacio', emoji: '📖', url: 'https://www.amazon.es/dp/8483068613?tag=conciencia07-21', temas: ['decisiones'], palabrasClave: ['decisión', 'decisiones', 'sesgo', 'sesgos', 'intuición', 'intuitivo', 'racional', 'elegir', 'elección', 'juicio', 'heurística', 'razonamiento'] },
  { id: 'solucion-procrastinacion', titulo: 'La solución a la procrastinación', emoji: '📖', url: 'https://www.amazon.es/dp/8416720452?tag=conciencia07-21', temas: ['habitos', 'trabajo'], palabrasClave: ['procrastinación', 'procrastinar', 'posponer', 'aplazar', 'postergar', 'fuerza de voluntad', 'productividad', 'hábito', 'hábitos', 'habito', 'habitos', 'motivación', 'motivacion', 'autocontrol', 'disciplina'] },
  { id: 'aprender-de-la-perdida', titulo: 'Aprender de la pérdida', emoji: '📖', url: 'https://www.amazon.es/dp/8408215051?tag=conciencia07-21', temas: ['duelo'], palabrasClave: ['duelo', 'pérdida', 'perdida', 'luto', 'pérdidas', 'perdidas', 'muerte', 'fallecimiento', 'morir', 'suicidio'] },
  { id: 'cerebro-y-ejercicio', titulo: 'Cerebro y ejercicio', emoji: '📖', url: 'https://www.amazon.es/dp/841352041X?tag=conciencia07-21', temas: ['ejercicio', 'alimentacion'], palabrasClave: ['ejercicio', 'actividad física', 'deporte', 'correr', 'entrenamiento', 'sedentarismo', 'ejercicio físico', 'deportistas', 'físico', 'alimentación', 'alimentacion', 'dieta', 'nutrición', 'nutricion'] },
  { id: 'habitos-atomicos', titulo: 'Hábitos atómicos', emoji: '📖', url: 'https://www.amazon.es/dp/8418118032?tag=conciencia07-21', temas: ['habitos', 'trabajo'], palabrasClave: ['hábito', 'hábitos', 'habito', 'habitos', 'rutina', 'rutinas', 'costumbre', 'cambiar', 'cambio', 'disciplina', 'constancia', 'motivación', 'productividad', 'procrastinación', 'comportamiento', 'conducta'] },
  { id: 'sentirse-bien', titulo: 'Sentirse bien', emoji: '📖', url: 'https://www.amazon.es/dp/8449323991?tag=conciencia07-21', temas: ['estado-animo', 'ansiedad'], palabrasClave: ['depresión', 'depresion', 'tristeza', 'ánimo', 'animo', 'desánimo', 'desanimo', 'autoestima', 'pensamientos negativos', 'autocrítica', 'autocritica', 'culpa', 'rumiación', 'rumiacion', 'desesperanza', 'melancolía'] },
  { id: 'cuerpo-lleva-cuenta', titulo: 'El cuerpo lleva la cuenta', emoji: '📖', url: 'https://www.amazon.es/dp/8412503600?tag=conciencia07-21', temas: ['estres-trauma'], palabrasClave: ['trauma', 'traumático', 'traumatico', 'tept', 'estrés postraumático', 'estres postraumatico', 'abuso', 'maltrato', 'violencia', 'duelo', 'disociación', 'disociacion', 'trauma psicológico', 'guerra', 'conflicto'] },
  { id: 'cosas-buenas', titulo: 'Cómo hacer que te pasen cosas buenas', emoji: '📖', url: 'https://www.amazon.es/dp/8467053305?tag=conciencia07-21', temas: ['bienestar', 'ansiedad', 'estres-trauma'], palabrasClave: ['cortisol', 'estrés', 'estres', 'ansiedad', 'preocupación', 'preocupacion', 'emociones', 'emocional', 'bienestar', 'felicidad', 'cerebro', 'optimismo', 'miedo'] },
  { id: 'no-amargarse', titulo: 'El arte de no amargarse la vida', emoji: '📖', url: 'https://www.amazon.es/dp/8425355869?tag=conciencia07-21', temas: ['bienestar', 'ansiedad'], palabrasClave: ['ansiedad', 'preocupación', 'preocupacion', 'felicidad', 'pensamientos', 'autoexigencia', 'perfeccionismo', 'malestar', 'exigencia', 'catastrofismo', 'fortaleza'] },
  { id: 'se-amable', titulo: 'Sé amable contigo mismo', emoji: '📖', url: 'https://www.amazon.es/dp/8449331986?tag=conciencia07-21', temas: ['personalidad', 'bienestar'], palabrasClave: ['autocompasión', 'autocompasion', 'autocrítica', 'autocritica', 'autoestima', 'vergüenza', 'verguenza', 'culpa', 'perfeccionismo', 'amabilidad', 'compasión', 'autoexigencia'] },
  { id: 'por-que-dormimos', titulo: 'Por qué dormimos', emoji: '📖', url: 'https://www.amazon.es/dp/8412064526?tag=conciencia07-21', temas: ['sueno'], palabrasClave: ['sueño', 'sueno', 'dormir', 'insomnio', 'descanso', 'rem', 'circadiano', 'siesta', 'melatonina', 'despertar', 'soñar', 'pesadilla'] },
  { id: 'cinco-lenguajes-amor', titulo: 'Los cinco lenguajes del amor', emoji: '📖', url: 'https://www.amazon.es/dp/0789918358?tag=conciencia07-21', temas: ['pareja', 'social'], palabrasClave: ['pareja', 'amor', 'relación', 'relaciones', 'matrimonio', 'afecto', 'comunicación', 'comunicacion', 'convivencia', 'cariño', 'carino'] },
  { id: 'centrate-deep-work', titulo: 'Céntrate (Deep Work)', emoji: '📖', url: 'https://www.amazon.es/dp/8411000516?tag=conciencia07-21', temas: ['atencion', 'trabajo'], palabrasClave: ['concentración', 'concentracion', 'atención', 'atencion', 'foco', 'distracción', 'distraccion', 'productividad', 'procrastinación', 'móvil', 'movil', 'multitarea', 'rendimiento'] },
  { id: 'inteligencia-emocional', titulo: 'Inteligencia emocional', emoji: '📖', url: 'https://www.amazon.es/dp/8472453715?tag=conciencia07-21', general: true, temas: ['bienestar', 'estado-animo', 'social'], palabrasClave: ['emoción', 'emociones', 'emocional', 'inteligencia emocional', 'autocontrol', 'empatía', 'empatia', 'autoconocimiento', 'gestión emocional', 'gestionar', 'relaciones', 'sentimientos'] },
  { id: 'hombre-busca-sentido', titulo: 'El hombre en busca de sentido', emoji: '📖', url: 'https://www.amazon.es/dp/8425432022?tag=conciencia07-21', temas: ['duelo', 'estres-trauma', 'bienestar'], palabrasClave: ['sentido', 'propósito', 'proposito', 'sufrimiento', 'adversidad', 'resiliencia', 'esperanza', 'duelo', 'pérdida', 'perdida', 'muerte', 'trauma', 'superación', 'superacion'] },
  { id: 'ganar-amigos', titulo: 'Cómo ganar amigos e influir sobre las personas', emoji: '📖', url: 'https://www.amazon.es/dp/8412299728?tag=conciencia07-21', temas: ['social', 'trabajo'], palabrasClave: ['social', 'relaciones', 'amistad', 'amigos', 'comunicación', 'comunicacion', 'habilidades sociales', 'trato', 'empatía', 'empatia', 'persuasión', 'persuasion', 'influencia', 'conflicto', 'timidez'] },
  { id: 'poder-habitos', titulo: 'El poder de los hábitos', emoji: '📖', url: 'https://www.amazon.es/dp/8417664130?tag=conciencia07-21', temas: ['habitos', 'trabajo'], palabrasClave: ['hábito', 'hábitos', 'habito', 'habitos', 'rutina', 'rutinas', 'cambio', 'cambiar', 'motivación', 'motivacion', 'conducta', 'comportamiento', 'productividad', 'adicción', 'adiccion'] },
  { id: 'tus-zonas-erroneas', titulo: 'Tus zonas erróneas', emoji: '📖', url: 'https://www.amazon.es/dp/8425352835?tag=conciencia07-21', general: true, temas: ['bienestar', 'personalidad', 'estado-animo'], palabrasClave: ['autoestima', 'culpa', 'preocupación', 'preocupacion', 'autoexigencia', 'inseguridad', 'felicidad', 'aprobación', 'aprobacion', 'dependencia', 'infelicidad', 'pensamiento negativo'] },
  { id: 'trampa-felicidad', titulo: 'La trampa de la felicidad', emoji: '📖', url: 'https://www.amazon.es/dp/8408261908?tag=conciencia07-21', general: true, temas: ['ansiedad', 'bienestar', 'estres-trauma'], palabrasClave: ['ansiedad', 'ansioso', 'ansiosa', 'aceptación', 'aceptacion', 'aceptar', 'evitación', 'evitacion', 'evitar', 'malestar', 'emociones', 'emocional', 'pensamientos', 'preocupación', 'preocupacion', 'mindfulness', 'atención plena', 'valores', 'sufrimiento', 'incertidumbre'] },
  { id: 'fin-ansiedad', titulo: 'El fin de la ansiedad', emoji: '📖', url: 'https://www.amazon.es/dp/8417664335?tag=conciencia07-21', temas: ['ansiedad', 'estres-trauma'], palabrasClave: ['ansiedad', 'ansioso', 'ansiosa', 'angustia', 'pánico', 'panico', 'ataque de pánico', 'miedo', 'miedos', 'fobia', 'fobias', 'nervios', 'nerviosismo', 'preocupación', 'preocupacion', 'hipocondría', 'hipocondria'] },
  { id: 'persona-vitamina', titulo: 'Encuentra tu persona vitamina', emoji: '📖', url: 'https://www.amazon.es/dp/846706269X?tag=conciencia07-21', temas: ['pareja', 'social', 'bienestar'], palabrasClave: ['pareja', 'relación', 'relaciones', 'vínculo', 'vínculos', 'vinculo', 'vinculos', 'apego', 'amor', 'amistad', 'amigos', 'familia', 'social', 'confianza', 'dependencia', 'oxitocina', 'cortisol'] },
  { id: 'comunicacion-no-violenta', titulo: 'Comunicación no violenta', emoji: '📖', url: 'https://www.amazon.es/dp/8415053665?tag=conciencia07-21', temas: ['social', 'pareja', 'trabajo'], palabrasClave: ['comunicación', 'comunicacion', 'conflicto', 'conflictos', 'discusión', 'discusiones', 'discutir', 'pareja', 'relaciones', 'límites', 'limites', 'asertividad', 'empatía', 'empatia', 'escucha', 'diálogo', 'dialogo', 'necesidades'] },
];

function barajar(lista) {
  const c = lista.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function elegirLibrosRelevantes(datos, cantidad) {
  const tema = (datos.tema || '').toLowerCase().trim();
  const texto = ((datos.titulo || '') + ' ' + (datos.parrafos || []).join(' ') + ' ' + (datos.fuente || '')).toLowerCase();
  const puntuados = barajar(CATALOGO_LIBROS).map((libro) => {
    let p = 0;
    if (tema && Array.isArray(libro.temas) && libro.temas.includes(tema)) p += 10;
    p += libro.palabrasClave.reduce((t, palabra) => t + (texto.includes(palabra.toLowerCase()) ? 1 : 0), 0);
    return { libro, p };
  });
  puntuados.sort((a, b) => b.p - a.p);
  const relevantes = puntuados.filter((x) => x.p > 0).map((x) => x.libro);
  if (relevantes.length >= cantidad) return relevantes.slice(0, cantidad);
  const generales = barajar(CATALOGO_LIBROS.filter((l) => l.general && !relevantes.includes(l)));
  return [...relevantes, ...generales].slice(0, cantidad);
}

// ---------------------------------------------------------------------
// Plantilla HTML del artículo (mismo diseño que post.html)
// ---------------------------------------------------------------------
const ESTILO = `
  :root { --paper:#EEEDE6; --surface:#FFFFFF; --ink:#211F2E; --ink-soft:#625C70; --border:#DDD7CB; --accent:#4A3B78; --stamp:#B5541D; --font-display:'Lora',Georgia,serif; --font-body:'Work Sans',system-ui,sans-serif; --font-mono:'Space Mono','Courier New',monospace; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:var(--font-body); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
  a { color:inherit; }
  :focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
  .site-header { border-bottom:1px solid var(--border); padding:2rem 1.5rem 1.5rem; text-align:center; }
  .logo { font-family:var(--font-display); font-weight:700; font-size:1.7rem; color:var(--ink); text-decoration:none; }
  .logo em { color:var(--accent); font-style:normal; }
  main { max-width:640px; margin:0 auto; padding:2.5rem 1.5rem 1.5rem; }
  .back-link { font-size:0.9rem; color:var(--ink-soft); text-decoration:none; display:inline-block; margin-bottom:1.5rem; }
  .back-link:hover { text-decoration:underline; }
  .articulo-card { background:var(--surface); border:1px solid var(--border); border-top:4px solid var(--accent); border-radius:12px; padding:1.8rem 1.8rem 1.6rem; margin-bottom:1.5rem; }
  .post-title { font-family:var(--font-display); font-size:1.75rem; font-weight:700; line-height:1.28; margin:0 0 1.2rem; overflow-wrap:break-word; }
  .meta-fila { display:flex; flex-wrap:wrap; align-items:center; gap:0.6rem; margin-bottom:1rem; }
  .stamp { display:inline-flex; align-items:center; gap:0.4rem; font-family:var(--font-mono); font-size:0.72rem; color:var(--stamp); border:1.3px dashed var(--stamp); border-radius:999px; padding:0.25rem 0.7rem; transform:rotate(-1.2deg); overflow-wrap:break-word; }
  .tiempo-lectura { font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-soft); }
  .desglose { background:var(--paper); border:1px solid var(--border); border-radius:12px; padding:1.4rem 1.4rem 1.5rem; margin:0 0 1.6rem; }
  .desglose-titulo { font-family:var(--font-mono); font-size:0.68rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-soft); margin:0 0 1rem; }
  .flujo { display:flex; flex-direction:column; }
  .flujo-paso { display:flex; align-items:flex-start; gap:0.7rem; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0.8rem 1rem; }
  .flujo-icono { font-size:1.2rem; line-height:1; flex-shrink:0; margin-top:0.15rem; }
  .flujo-etiqueta { display:block; font-family:var(--font-mono); font-size:0.64rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--stamp); margin-bottom:0.3rem; }
  .flujo-texto { font-family:var(--font-display); font-size:1rem; font-style:italic; color:var(--ink); margin:0; line-height:1.45; overflow-wrap:break-word; }
  .flujo-flecha { text-align:center; color:var(--accent); font-size:1.05rem; line-height:1; padding:0.3rem 0; font-weight:700; }
  .flujo-paso-destacado { border-color:var(--accent); border-width:1.5px; }
  .flujo-paso-destacado .flujo-etiqueta { color:var(--accent); }
  .post-body { font-size:1.05rem; line-height:1.7; color:var(--ink); overflow-wrap:break-word; }
  .post-body p { margin:0 0 1.3rem; }
  .post-body p:last-child { margin-bottom:0; }
  .fuente-original { margin-top:1.8rem; padding-top:1.6rem; border-top:1px dashed var(--border); }
  .fuente-original p { margin:0 0 0.8rem; color:var(--ink-soft); font-size:0.9rem; }
  .btn-source { display:inline-block; background:var(--ink); color:var(--paper); text-decoration:none; font-weight:600; padding:0.65rem 1.1rem; border-radius:9px; font-size:0.92rem; }
  .btn-source:hover { background:var(--accent); }
  .libros-box { margin-top:1.1rem; padding:1.3rem 1.4rem; background:var(--surface); border:1px solid var(--border); border-radius:12px; }
  .libros-box p { margin:0 0 0.9rem; color:var(--ink-soft); font-size:0.9rem; }
  .libros-lista { display:flex; flex-direction:column; gap:0.6rem; }
  .libro-link { display:flex; align-items:center; gap:0.6rem; text-decoration:none; color:var(--ink); font-weight:600; font-size:0.95rem; padding:0.7rem 0.9rem; border:1px solid var(--border); border-radius:9px; transition:border-color 0.15s, background 0.15s; }
  .libro-link:hover { border-color:var(--accent); background:var(--paper); }
  .libros-box p.libros-disclosure { margin:0.7rem 0 0; }
  .guia-cta { margin-top:1.1rem; padding:1.3rem 1.4rem; background:var(--accent-soft); border:1px solid #d8d0ec; border-radius:12px; text-align:center; }
  .guia-cta .guia-cta-titulo { font-family:var(--font-display); font-weight:600; font-size:1.15rem; color:var(--ink); margin:0 0 0.4rem; }
  .guia-cta p { color:var(--ink-soft); font-size:0.9rem; margin:0 0 0.9rem; }
  .guia-cta-btn { display:inline-block; text-decoration:none; font-weight:600; font-size:0.95rem; padding:0.7rem 1.3rem; border-radius:9px; background:var(--accent); color:#fff; }
  .guia-cta-btn:hover { background:#3a2e63; }
  .compartir-box { margin-top:1.1rem; padding:1.1rem 1.4rem; background:var(--surface); border:1px solid var(--border); border-radius:12px; }
  .compartir-box p { margin:0 0 0.8rem; color:var(--ink-soft); font-size:0.9rem; }
  .compartir-lista { display:flex; flex-wrap:wrap; gap:0.7rem; align-items:center; }
  .compartir-btn { display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:50%; text-decoration:none; color:#fff; box-shadow:0 1px 2px rgba(33,31,46,0.15); transition:transform 0.15s ease, box-shadow 0.15s ease; }
  .compartir-btn:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(33,31,46,0.2); }
  .compartir-btn svg { width:20px; height:20px; }
  .compartir-btn .compartir-letra { font-family:Georgia,'Times New Roman',serif; font-style:italic; font-weight:700; font-size:1.25rem; line-height:1; }
  .compartir-btn .compartir-letra-x { font-family:var(--font-body); font-style:normal; font-weight:700; font-size:1.1rem; }
  .compartir-whatsapp { background:#25D366; } .compartir-facebook { background:#1877F2; } .compartir-x { background:#000; } .compartir-email { background:var(--ink); }
  .guia-rel { margin-top:1.1rem; padding:1.3rem 1.4rem; background:#ECE8F5; border:1px solid #d8d0ec; border-radius:12px; }
  .guia-rel-tag { font-family:var(--font-mono); font-size:0.66rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--accent); margin:0 0 0.4rem; }
  .guia-rel h3 { font-family:var(--font-display); font-size:1.12rem; font-weight:600; margin:0 0 0.4rem; color:var(--ink); }
  .guia-rel p { margin:0 0 0.9rem; color:#3d3357; font-size:0.94rem; line-height:1.6; }
  .guia-rel a.btn-guia-rel { display:inline-block; text-decoration:none; font-weight:600; font-size:0.92rem; padding:0.6rem 1.1rem; border-radius:9px; background:var(--accent); color:#fff; }
  .guia-rel a.btn-guia-rel:hover { background:#3a2e63; }
  .relacionados-box { margin-top:1.1rem; }
  .relacionados-titulo { font-family:var(--font-mono); font-size:0.68rem; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-soft); margin:0 0 0.8rem; }
  .relacionados-lista { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .relacionado-link { display:block; padding:0.9rem 1.2rem; text-decoration:none; color:var(--ink); font-weight:600; font-size:0.92rem; }
  .relacionado-link:not(:last-child) { border-bottom:1px solid var(--border); }
  .relacionado-link:hover { color:var(--accent); text-decoration:underline; }
  .site-footer { border-top:1px solid var(--border); padding:1.75rem 1.5rem 2.5rem; text-align:center; color:var(--ink-soft); font-size:0.82rem; }
  .otras-webs-titulo { font-family:var(--font-display); font-size:0.8rem; font-weight:600; color:var(--ink); text-transform:uppercase; letter-spacing:0.07em; margin:0 0 0.8rem; }
  .otras-webs-lista { display:flex; flex-wrap:wrap; gap:0.7rem; justify-content:center; margin-bottom:1.2rem; }
  .sitio-amigo { display:flex; align-items:center; gap:0.6rem; text-decoration:none; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:0.65rem 1rem; transition:border-color 0.15s ease, transform 0.15s ease; }
  .sitio-amigo:hover { border-color:var(--accent); transform:translateY(-1px); }
  .sitio-amigo-icono { width:28px; height:auto; flex-shrink:0; }
  .sitio-amigo-texto { display:flex; flex-direction:column; text-align:left; }
  .sitio-amigo-nombre { font-family:var(--font-display); font-style:italic; font-weight:600; font-size:0.98rem; color:var(--ink); }
  .sitio-amigo-desc { font-size:0.72rem; color:var(--ink-soft); }
  .status-msg { text-align:center; color:var(--ink-soft); padding:3rem 1rem; }
`;

function paginaHtml({ base, urlCanonica, post }) {
  const parrafos = dividirEnParrafos(post.resumen);
  const descripcion = (post.teaser || parrafos[0] || '').slice(0, 155);
  const totalPalabras = parrafos.join(' ').split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(totalPalabras / 200));
  const urlEstudio = post.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${post.pmid}/` : '#';

  const desgloseHtml = !post.desglose ? '' : `
    <div class="desglose">
      <p class="desglose-titulo">Cómo fue el estudio, de un vistazo</p>
      <div class="flujo">
        <div class="flujo-paso"><span class="flujo-icono">❓</span><div><span class="flujo-etiqueta">La pregunta</span><p class="flujo-texto">${escapeHtml(post.desglose.pregunta)}</p></div></div>
        <div class="flujo-flecha">↓</div>
        <div class="flujo-paso"><span class="flujo-icono">🧪</span><div><span class="flujo-etiqueta">El método</span><p class="flujo-texto">${escapeHtml(post.desglose.metodo)}</p></div></div>
        <div class="flujo-flecha">↓</div>
        <div class="flujo-paso flujo-paso-destacado"><span class="flujo-icono">💡</span><div><span class="flujo-etiqueta">El hallazgo</span><p class="flujo-texto">${escapeHtml(post.desglose.hallazgo)}</p></div></div>
        <div class="flujo-flecha">↓</div>
        <div class="flujo-paso"><span class="flujo-icono">🧠</span><div><span class="flujo-etiqueta">Por qué pasa</span><p class="flujo-texto">${escapeHtml(post.desglose.porQue)}</p></div></div>
      </div>
    </div>`;

  const libros = elegirLibrosRelevantes({ titulo: post.titulo, parrafos, fuente: post.fuente, tema: post.tema }, 2);
  const librosHtml = libros
    .map((l) => `<a class="libro-link" href="${l.url}" target="_blank" rel="noopener sponsored" onclick="registrarClic('libro-${l.id}')">${l.emoji} ${escapeHtml(l.titulo)} →</a>`)
    .join('');

  // Guía de compra relacionada con el tema del artículo. Solo se muestra cuando
  // el tema encaja CLARAMENTE con una guía (así no mandamos a la gente a cosas
  // que no tienen que ver). Si el tema no está en el mapa, no aparece nada.
  const GUIA_DORMIR = { url: '/cosas-para-dormir-mejor.html', tag: 'Guía práctica · Sueño', titulo: 'Cosas que ayudan a dormir mejor', desc: 'Despertador de luz, antifaz, tapones, ruido blanco, manta de peso: qué ayuda de verdad y qué no vale la pena.' };
  const GUIA_CONCENTRA = { url: '/rincon-para-concentrarte.html', tag: 'Guía práctica · Concentración', titulo: 'Montar un rincón para concentrarte', desc: 'Auriculares con cancelación, temporizador, flexo, ergonomía: lo que ayuda de verdad a concentrarte en tu mesa, sin humo.' };
  const GUIA_CALMA = { url: '/guia-mantas-de-peso.html', tag: 'Guía práctica · Calma', titulo: 'Mantas de peso: cuál elegir', desc: 'Cómo acertar con el peso, el tamaño y el material de una manta ponderada para relajarte, y a quién no le conviene.' };
  const GUIAS_POR_TEMA = {
    sueno: GUIA_DORMIR,
    atencion: GUIA_CONCENTRA,
    trabajo: GUIA_CONCENTRA,
    habitos: GUIA_CONCENTRA,
    ansiedad: GUIA_CALMA,
    'estres-trauma': GUIA_CALMA,
  };
  const guiaRel = GUIAS_POR_TEMA[(post.tema || '').toLowerCase().trim()];
  const guiaRelHtml = !guiaRel ? '' : `
  <div class="guia-rel">
    <p class="guia-rel-tag">${guiaRel.tag}</p>
    <h3>${guiaRel.titulo}</h3>
    <p>${guiaRel.desc}</p>
    <a class="btn-guia-rel" href="${guiaRel.url}" onclick="registrarClic('guia-rel')">Leer la guía →</a>
  </div>`;

  const compartir = [
    { n: 'whatsapp', href: `https://wa.me/?text=${encodeURIComponent(post.titulo + ' — ' + urlCanonica)}`, ico: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.4-4.2A7.9 7.9 0 1 1 9 19.2z"/><path d="M8.2 9.6c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.2.2-.3.3-.5.5-.2.2-.3.3-.1.6.2.4.8 1.2 1.7 1.9 1.1 1 2 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.5.2.5.3 0 .2 0 .9-.4 1.3-.4.5-1.5.9-2.1.9-.6.1-1 .1-2.5-.5-2.1-.9-3.5-2.9-3.6-3.1-.1-.1-.9-1.2-.9-2.3 0-1.1.6-1.6.8-1.8z" fill="#fff" stroke="none"/></svg>', et: 'Compartir por WhatsApp' },
    { n: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlCanonica)}`, ico: '<span class="compartir-letra">f</span>', et: 'Compartir en Facebook' },
    { n: 'x', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titulo)}&url=${encodeURIComponent(urlCanonica)}`, ico: '<span class="compartir-letra compartir-letra-x">X</span>', et: 'Compartir en X' },
    { n: 'email', href: `mailto:?subject=${encodeURIComponent(post.titulo)}&body=${encodeURIComponent(urlCanonica)}`, ico: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>', et: 'Compartir por email' },
  ].map((e) => `<a class="compartir-btn compartir-${e.n}" href="${e.href}" target="_blank" rel="noopener" aria-label="${e.et}" title="${e.et}" onclick="registrarClic('compartir-${e.n}')">${e.ico}</a>`).join('');

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.titulo,
    description: descripcion, image: `${base}/og-image.jpg`, url: urlCanonica, inLanguage: 'es',
    isAccessibleForFree: true, datePublished: post.fechaPublicacion || post.fecha,
    publisher: { '@type': 'Organization', name: 'Psicolinks' }, mainEntityOfPage: { '@type': 'WebPage', '@id': urlCanonica },
  });
  const breadcrumbLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Psicolinks', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: post.titulo, item: urlCanonica },
    ],
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(post.titulo)} · Psicolinks</title>
<meta name="description" content="${escapeHtml(descripcion)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Psicolinks">
<meta property="og:title" content="${escapeHtml(post.titulo)}">
<meta property="og:description" content="${escapeHtml(descripcion)}">
<meta property="og:url" content="${urlCanonica}">
<meta property="og:image" content="${base}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${urlCanonica}">
<meta name="theme-color" content="#EEEDE6">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Work+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${ESTILO}</style>
<script type="application/ld+json">${jsonLd}</script>
<script type="application/ld+json">${breadcrumbLd}</script>
</head>
<body>
<header class="site-header"><a href="/" class="logo">psico<em>links</em></a></header>
<main>
  <a href="/" class="back-link">← Volver a Psicolinks</a>
  <div class="articulo-card">
    <h1 class="post-title">${escapeHtml(post.titulo)}</h1>
    <div class="meta-fila">
      <span class="stamp">📎 ${escapeHtml(post.fuente)}</span>
      <span class="tiempo-lectura">🕒 ${minutos} min de lectura</span>
    </div>
    ${desgloseHtml}
    <div class="post-body">${parrafos.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
    <div class="fuente-original">
      <p>Este resumen se basa en un estudio científico real. Si quieres profundizar, el original está aquí:</p>
      <a class="btn-source" href="${urlEstudio}" target="_blank" rel="noopener">Ver el estudio original en PubMed (en inglés) →</a>
      <p style="margin-top:0.9rem; font-size:0.85rem;"><a href="/como-leemos-los-estudios.html">¿Qué significa que un estudio sea "significativo"? Cómo leemos los estudios →</a></p>
    </div>
  </div>
  <div class="compartir-box">
    <p>Comparte este artículo:</p>
    <div class="compartir-lista">${compartir}</div>
  </div>
  <div class="libros-box">
    <p>¿Te ha interesado el tema? Estos libros lo desarrollan y te ayudan a llevarlo a tu vida:</p>
    <div class="libros-lista">${librosHtml}</div>
    <p class="libros-disclosure">Publicidad. En calidad de Afiliado de Amazon</p>
  </div>
  ${guiaRelHtml}
  <div class="guia-cta">
    <p class="guia-cta-titulo">📎 Guías gratis para tu día a día</p>
    <p>Descarga mis guías prácticas en PDF —dormir mejor, calmar la ansiedad, concentrarte— escritas por un psicólogo. Gratis, en lenguaje claro.</p>
    <a class="guia-cta-btn" href="/guias.html">Ver las guías gratuitas →</a>
  </div>
  <div id="relacionados-container"></div>
  <div class="pl-newsletter" data-variant="digest" data-origen="articulo"></div>
</main>
<footer class="site-footer">
  <p class="otras-webs-titulo">Otras webs</p>
  <div class="otras-webs-lista">
    <a class="sitio-amigo" href="https://concienciaconductual.com" target="_blank" rel="noopener" onclick="registrarClic('concienciaconductual')">
      <svg class="sitio-amigo-icono" viewBox="0 0 42 22" fill="none" stroke="#8C3B4A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1,12 L5,4 L8,19 L12,3 L15,13 C17.5,8 20.5,8 23,12 C24.5,14.5 27,14.5 28.5,12 C30,9.5 32,9.5 34,12 L41,12"/></svg>
      <span class="sitio-amigo-texto">
        <span class="sitio-amigo-nombre">Conciencia Conductual</span>
        <span class="sitio-amigo-desc">Consulta de psicología con Miguel Martínez</span>
      </span>
    </a>
  </div>
  <p>© 2026 Psicolinks · <a href="#" onclick="PL_configurarCookies(); return false;">Configurar cookies</a></p>
</footer>
<script>
  var POST_ID = ${JSON.stringify(post.id)};
  var POST_TITULO = ${JSON.stringify(post.titulo)};
  var POST_TEMA = ${JSON.stringify(post.tema || '')};
  function registrarClic(nombre) {
    fetch('/.netlify/functions/track-view', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ clic: nombre }) }).catch(function(){});
  }
  // Las visitas al artículo se miden con Google Analytics; ya no escribimos en la
  // base de datos en cada visita (era el mayor gasto de Netlify).

  function slugify(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80) || 'articulo'; }
  function palabrasClaveDe(t){ return (t||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9\\s]/g,' ').split(/\\s+/).filter(function(p){return p.length>4;}); }
  (function(){
    fetch('/.netlify/functions/list-posts?limit=30').then(function(r){return r.ok?r.json():null;}).then(function(resp){
      if(!resp||!resp.posts) return;
      var cand = resp.posts.filter(function(p){return p.id!==POST_ID;});
      if(!cand.length) return;
      var mias = {}; palabrasClaveDe(POST_TITULO).forEach(function(w){mias[w]=1;});
      cand.forEach(function(p){ var s=0; palabrasClaveDe((p.titulo||'')+' '+(p.teaser||'')).forEach(function(w){ if(mias[w]) s++; }); p._s=s; });
      cand.sort(function(a,b){return b._s-a._s;});
      var top = cand.slice(0,3);
      if(!top.length) return;
      var dest = document.getElementById('relacionados-container');
      dest.innerHTML = '<div class="relacionados-box"><p class="relacionados-titulo">Sigue leyendo</p><div class="relacionados-lista">'+
        top.map(function(p){ return '<a class="relacionado-link" href="/articulo/'+slugify(p.titulo)+'/'+encodeURIComponent(p.id)+'">'+p.titulo+' →</a>'; }).join('')+
        '</div></div>';
    }).catch(function(){});
  })();
</script>
<script type="text/plain" data-categoria="analiticas" src="https://www.googletagmanager.com/gtag/js?id=G-8KY8MR3L9Y"></script>
<script type="text/plain" data-categoria="analiticas">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8KY8MR3L9Y');
</script>
<script src="/cookies-psicolinks.js" defer></script>
<script src="/newsletter-psicolinks.js" defer></script>
</body>
</html>`;
}

function paginaError(base, mensaje) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Psicolinks</title><meta name="robots" content="noindex"><style>${ESTILO}</style></head>
<body><header class="site-header"><a href="/" class="logo">psico<em>links</em></a></header>
<main><p class="status-msg">${escapeHtml(mensaje)}</p><p style="text-align:center;"><a href="/" class="btn-source">← Volver a la portada</a></p></main></body></html>`;
}

export default async (req) => {
  const url = new URL(req.url);
  const host = req.headers.get('host') || 'psicolinks.com';
  const base = `https://${host}`;

  // La redirección de netlify.toml pasa la ruta en el parámetro "ruta".
  // Como respaldo, también se intenta sacar del propio pathname.
  let ruta = url.searchParams.get('ruta') || '';
  if (!ruta) ruta = url.pathname.replace(/^\/articulo\//, '');
  const partes = ruta.split('/').filter(Boolean);
  const id = partes.length ? decodeURIComponent(partes[partes.length - 1]) : '';

  const htmlHeaders = { 'content-type': 'text/html; charset=utf-8' };
  // Caché en el CDN de Netlify para los artículos que SÍ existen: se sirven desde
  // la caché del edge y la función NO se vuelve a ejecutar en cada visita (esto es
  // lo que más ahorra). El contenido es estable tras publicar; si editas un artículo,
  // tarda como mucho ~1 día en refrescarse en caché.
  const htmlHeadersOk = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'public, max-age=600',
    'netlify-cdn-cache-control': 'public, durable, s-maxage=86400, stale-while-revalidate=604800',
  };

  if (!id) {
    return new Response(paginaError(base, 'Publicación no especificada.'), { status: 404, headers: htmlHeaders });
  }

  try {
    const store = getStore('posts');
    const post = await store.get(id, { type: 'json' });
    if (!post) {
      return new Response(paginaError(base, 'No se ha encontrado esta publicación.'), { status: 404, headers: htmlHeaders });
    }
    const urlCanonica = `${base}/articulo/${slugify(post.titulo)}/${encodeURIComponent(post.id)}`;
    return new Response(paginaHtml({ base, urlCanonica, post }), { status: 200, headers: htmlHeadersOk });
  } catch (err) {
    console.error('articulo: error interno:', err);
    return new Response(paginaError(base, 'No se ha podido cargar esta publicación.'), { status: 500, headers: htmlHeaders });
  }
};
