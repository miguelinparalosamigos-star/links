/* Buscador de Psicolinks -----------------------------------------------------
   Un solo campo en la cabecera. Al pinchar en él salen las secciones (que es
   el menú de siempre, pero solo cuando hace falta) y, al escribir, busca en
   todas las páginas de la web.

   El índice (/buscador.json) se descarga la primera vez que alguien escribe,
   no al cargar la página, para no penalizar la velocidad de nadie.
   No usa librerías, no guarda nada y no manda nada a ningún sitio.          */
(function () {
  'use strict';

  var caja = document.getElementById('pl-buscador');
  if (!caja) return;
  var campo = document.getElementById('plb-input');
  var panel = document.getElementById('plb-panel');
  if (!campo || !panel) return;

  var SECCIONES = [
    { u: '/empieza-aqui.html', i: '🧭', n: 'Empieza aquí', q: 'si no sabes por dónde tirar' },
    { u: '/temas.html', i: '📎', n: 'Las guías', q: 'más de doscientas, por tema' },
    { u: '/herramientas.html', i: '🗒️', n: 'Herramientas', q: 'registros para llevar entre sesiones' },
    { u: '/tests.html', i: '📝', n: 'Tests', q: 'cuestionarios con la fuente a la vista' },
    { u: '/laboratorio.html', i: '🧪', n: 'Laboratorio', q: 'experimentos de un minuto' },
    { u: '/sesgos.html', i: '🧠', n: 'Sesgos', q: 'los atajos de la cabeza, uno a uno' }
  ];

  var SUGERENCIAS = ['ansiedad', 'dormir', 'duelo', 'autoestima', 'límites', 'procrastinar'];

  var indice = null, cargando = null, abierto = false, marcado = -1, resultados = [];

  function pelar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ------------------------------------------------------------ el índice
     Dos fuentes: /buscador.json (las páginas fijas, generado al publicar) y
     los estudios del día, que viven en el almacén y no están en el fichero.
     Si lo segundo falla, la búsqueda sigue funcionando con lo primero.     */
  function slug(s) {
    return pelar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'articulo';
  }

  function cargar() {
    if (indice) return Promise.resolve(indice);
    if (cargando) return cargando;

    var paginas = fetch('/buscador.json')
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; });

    var estudios = fetch('/.netlify/functions/list-posts?limit=300')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.posts) return [];
        return d.posts.map(function (p) {
          return { t: p.titulo, u: '/articulo/' + slug(p.titulo) + '/' + encodeURIComponent(p.id),
                   s: 'Estudio del día', d: p.teaser || '' };
        });
      })
      .catch(function () { return []; });

    cargando = Promise.all([paginas, estudios]).then(function (partes) {
      indice = partes[0].concat(partes[1]).map(function (e) {
        return { t: e.t, u: e.u, s: e.s,
                 b: pelar(e.t + ' ' + (e.d || '') + ' ' + (e.k || '')), bt: pelar(e.t) };
      });
      return indice;
    });
    return cargando;
  }

  /* ------------------------------------------------------------ la búsqueda */
  function buscar(q) {
    var trozos = pelar(q).split(/\s+/).filter(Boolean);
    if (!trozos.length) return [];
    var salida = [];
    for (var i = 0; i < indice.length; i++) {
      var e = indice[i], vale = true, punt = 0;
      for (var j = 0; j < trozos.length; j++) {
        var t = trozos[j];
        if (e.b.indexOf(t) < 0) { vale = false; break; }
        if (e.bt.indexOf(t) === 0) punt += 6;          // empieza el título por ahí
        else if (e.bt.indexOf(' ' + t) >= 0) punt += 4; // una palabra del título
        else if (e.bt.indexOf(t) >= 0) punt += 3;
        else punt += 1;
      }
      /* Las guías de compra van detrás del todo: mientras no haya programa de
         afiliados, no son lo que la gente viene a buscar aquí. */
      if (vale) salida.push({ e: e, p: punt - e.t.length / 200 -
                                        (e.s === 'Cosas que ayudan' ? 20 : 0) +
                                        (e.u === '/registro-rapido.html' ? 5 : 0) });
    }
    salida.sort(function (a, b) { return b.p - a.p; });
    return salida.slice(0, 14).map(function (x) { return x.e; });
  }

  /* ------------------------------------------------------------ el panel */
  function pintarInicio() {
    var h = '<p class="plb-eti">Secciones</p><div class="plb-secciones">';
    SECCIONES.forEach(function (s) {
      h += '<a class="plb-sec" href="' + s.u + '"><span class="ico" aria-hidden="true">' + s.i +
           '</span><span class="txt"><b>' + esc(s.n) + '</b><i>' + esc(s.q) + '</i></span></a>';
    });
    h += '</div><p class="plb-eti">O escribe lo que buscas</p><div class="plb-chips">';
    SUGERENCIAS.forEach(function (s) {
      h += '<button type="button" class="plb-chip" data-q="' + esc(s) + '">' + esc(s) + '</button>';
    });
    h += '</div>';
    panel.innerHTML = h;
    resultados = [];
    marcado = -1;
  }

  function pintarResultados(lista, q) {
    if (!lista.length) {
      panel.innerHTML = '<p class="plb-nada">No hay nada con <strong>' + esc(q) + '</strong>. ' +
        'Prueba con una palabra suelta —«dormir», «culpa», «límites»— o mira ' +
        '<a href="/temas.html">todas las guías</a>.</p>';
      resultados = [];
      marcado = -1;
      return;
    }
    var h = '<p class="plb-eti">' + lista.length + (lista.length === 1 ? ' resultado' : ' resultados') + '</p><ul class="plb-lista" role="listbox" id="plb-lista">';
    lista.forEach(function (e, i) {
      h += '<li role="option" id="plb-op-' + i + '" aria-selected="false"><a href="' + e.u + '">' +
           '<span class="plb-t">' + esc(e.t) + '</span>' +
           '<span class="plb-s">' + esc(e.s) + '</span></a></li>';
    });
    h += '</ul>';
    panel.innerHTML = h;
    resultados = lista;
    marcado = -1;
  }

  function abrir() {
    if (abierto) return;
    panel.hidden = false;
    abierto = true;
    campo.setAttribute('aria-expanded', 'true');
    caja.classList.add('abierto');
  }
  function cerrar() {
    if (!abierto) return;
    panel.hidden = true;
    abierto = false;
    campo.setAttribute('aria-expanded', 'false');
    caja.classList.remove('abierto');
    marcado = -1;
  }

  function refrescar() {
    var q = campo.value.trim();
    if (q.length < 2) { pintarInicio(); abrir(); return; }
    cargar().then(function () {
      if (campo.value.trim() !== q) return;      // ha seguido escribiendo
      pintarResultados(buscar(q), q);
      abrir();
    });
  }

  function marcar(n) {
    var lis = panel.querySelectorAll('.plb-lista li');
    if (!lis.length) return;
    if (marcado >= 0 && lis[marcado]) {
      lis[marcado].classList.remove('on');
      lis[marcado].setAttribute('aria-selected', 'false');
    }
    marcado = (n + lis.length) % lis.length;
    lis[marcado].classList.add('on');
    lis[marcado].setAttribute('aria-selected', 'true');
    campo.setAttribute('aria-activedescendant', 'plb-op-' + marcado);
    lis[marcado].scrollIntoView({ block: 'nearest' });
  }

  /* ------------------------------------------------------------ los eventos */
  campo.addEventListener('focus', refrescar);
  campo.addEventListener('input', refrescar);

  campo.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { cerrar(); campo.blur(); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); abrir(); marcar(marcado + 1); return; }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); marcar(marcado - 1); return; }
    if (ev.key === 'Enter') {
      var lis = panel.querySelectorAll('.plb-lista li a');
      if (lis.length) { ev.preventDefault(); (lis[marcado >= 0 ? marcado : 0]).click(); }
    }
  });

  panel.addEventListener('click', function (ev) {
    var chip = ev.target.closest('.plb-chip');
    if (chip) { campo.value = chip.dataset.q; campo.focus(); refrescar(); }
  });

  document.addEventListener('click', function (ev) {
    if (!caja.contains(ev.target)) cerrar();
  });

  /* La barra "/" abre el buscador, como en cualquier sitio con buscador. */
  document.addEventListener('keydown', function (ev) {
    if (ev.key === '/' && document.activeElement !== campo &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      ev.preventDefault();
      campo.focus();
    }
  });
})();
