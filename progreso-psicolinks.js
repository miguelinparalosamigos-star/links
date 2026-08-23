/* Progreso de lectura de Psicolinks.
   Guarda en el propio navegador qué guías has leído, para que al volver sepas
   por dónde ibas. No sale nada de aquí: es localStorage, no hay servidor de por
   medio, y se puede borrar con un botón. */
(function () {
  'use strict';

  var CLAVE = 'pl_guias_leidas';
  var MAX = 200;

  var CSS = [
    '#pl-progreso{border:1px solid rgba(0,0,0,.12);border-radius:14px;padding:1rem 1.1rem;',
    'margin:0 0 1.6rem;background:rgba(255,255,255,.55)}',
    '#pl-progreso .pl-progreso-tit{margin:0 0 .55rem;font-size:.98rem}',
    '#pl-progreso .pl-progreso-sug{margin:.7rem 0 0;font-size:.93rem}',
    '.pl-barra{height:7px;border-radius:99px;background:rgba(0,0,0,.09);overflow:hidden}',
    '.pl-barra span{display:block;height:100%;background:#7a8b6f;border-radius:99px}',
    '.pl-borrar-progreso{margin-top:.8rem;font:inherit;font-size:.82rem;cursor:pointer;',
    'background:none;border:1px solid rgba(0,0,0,.18);border-radius:99px;padding:.28rem .8rem;',
    'color:inherit;opacity:.75}',
    '.pl-borrar-progreso:hover{opacity:1}',
    '.card.pl-leida{position:relative}',
    '.card .pl-check{display:inline-block;margin-top:.6rem;font-size:.76rem;letter-spacing:.04em;',
    'text-transform:uppercase;opacity:.6}',
    '#pl-continuar{border-top:1px solid rgba(0,0,0,.1);margin:2.4rem 0 0;padding-top:1.2rem}',
    '#pl-continuar .pl-continuar-tit{font-size:1.05rem;margin:0 0 .6rem}',
    '#pl-continuar ul{margin:0 0 .6rem;padding-left:1.1rem}',
    '#pl-continuar li{margin:.25rem 0}',
    '#pl-continuar p{margin:0;font-size:.92rem}'
  ].join('');

  function estilos() {
    if (document.getElementById('pl-progreso-css')) return;
    var s = document.createElement('style');
    s.id = 'pl-progreso-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(d) ? d : [];
    } catch (e) {
      return [];
    }
  }

  function guardar(lista) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista.slice(0, MAX)));
    } catch (e) { /* modo privado o almacenamiento lleno: no pasa nada */ }
  }

  function esGuia() {
    var stamp = document.querySelector('.stamp');
    return !!(stamp && /Guía gratuita/i.test(stamp.textContent || ''));
  }

  function slugActual() {
    var p = location.pathname.replace(/^\//, '');
    if (!p) return '';
    return p.replace(/\.html$/, '');
  }

  /* ---------------------------------------------- 1. registrar la visita */
  function registrar() {
    if (!esGuia()) return;
    var slug = slugActual();
    if (!slug) return;
    var h1 = document.querySelector('h1');
    var titulo = h1 ? h1.textContent.trim() : slug;
    var lista = leer().filter(function (x) { return x && x.slug !== slug; });
    lista.unshift({ slug: slug, titulo: titulo, t: Date.now() });
    guardar(lista);
  }

  /* ------------------------------------- 2. marcar las tarjetas leídas */
  function marcarTarjetas() {
    var cont = document.querySelector('.cards, .grid-guias, main');
    if (!cont) return;
    var leidas = leer();
    if (!leidas.length) return;
    var mapa = {};
    leidas.forEach(function (x) { mapa[x.slug] = true; });

    var total = 0, hechas = 0;
    var pendientes = [];
    var tarjetas = document.querySelectorAll('.card');
    Array.prototype.forEach.call(tarjetas, function (card) {
      var a = card.querySelector('a[href$=".html"]');
      if (!a) return;
      var tag = card.querySelector('.tag');
      if (!tag || !/Guía gratuita/i.test(tag.textContent || '')) return;
      total++;
      var slug = a.getAttribute('href').replace(/^\//, '').replace(/\.html$/, '');
      if (mapa[slug]) {
        hechas++;
        card.classList.add('pl-leida');
        if (!card.querySelector('.pl-check')) {
          var m = document.createElement('span');
          m.className = 'pl-check';
          m.textContent = '✓ leída';
          card.appendChild(m);
        }
      } else {
        pendientes.push({ slug: slug, titulo: (card.querySelector('h2') || {}).textContent || slug });
      }
    });

    if (!hechas) return;
    pintarResumen(hechas, total, pendientes);
  }

  function pintarResumen(hechas, total, pendientes) {
    var main = document.querySelector('main');
    if (!main || document.getElementById('pl-progreso')) return;

    var caja = document.createElement('div');
    caja.id = 'pl-progreso';
    var pct = total ? Math.round((hechas / total) * 100) : 0;
    var sugerida = pendientes.length
      ? pendientes[Math.floor(Math.random() * pendientes.length)]
      : null;

    caja.innerHTML =
      '<p class="pl-progreso-tit">Llevas <strong>' + hechas + ' de ' + total +
      '</strong> guías leídas</p>' +
      '<div class="pl-barra"><span style="width:' + pct + '%"></span></div>' +
      (sugerida
        ? '<p class="pl-progreso-sug">¿Sigues? Te falta <a href="/' + sugerida.slug +
          '.html">' + sugerida.titulo + '</a>.</p>'
        : '<p class="pl-progreso-sug">Las has leído todas. Gracias por estar por aquí.</p>') +
      '<button type="button" class="pl-borrar-progreso">Borrar mi progreso</button>';

    var ancla = document.querySelector('.chips-temas') || document.querySelector('.cards');
    if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(caja, ancla);
    else main.insertBefore(caja, main.firstChild);

    caja.querySelector('.pl-borrar-progreso').addEventListener('click', function () {
      try { localStorage.removeItem(CLAVE); } catch (e) {}
      caja.innerHTML = '<p class="pl-progreso-tit">Progreso borrado.</p>';
      Array.prototype.forEach.call(document.querySelectorAll('.pl-leida'), function (c) {
        c.classList.remove('pl-leida');
        var ch = c.querySelector('.pl-check');
        if (ch) ch.remove();
      });
    });
  }

  /* --------------------------------- 3. "sigue donde lo dejaste" en portada */
  function seguirEnPortada() {
    var hueco = document.getElementById('pl-continuar');
    if (!hueco) return;
    var leidas = leer().slice(0, 3);
    if (!leidas.length) return;
    hueco.innerHTML =
      '<h2 class="pl-continuar-tit">Sigue donde lo dejaste</h2><ul>' +
      leidas.map(function (x) {
        return '<li><a href="/' + x.slug + '.html">' + x.titulo + '</a></li>';
      }).join('') +
      '</ul><p><a href="/guias.html">Ver todas las guías →</a></p>';
    hueco.hidden = false;
  }

  function init() {
    estilos();
    registrar();
    marcarTarjetas();
    seguirEnPortada();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
