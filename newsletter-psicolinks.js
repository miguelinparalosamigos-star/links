/* Psicolinks · Cajetín de suscripción con pack de regalo.
   ---------------------------------------------------------------------------
   SOLO SE MUESTRA EN LA PORTADA (24 de agosto de 2026).
   Cualquier <div class="pl-newsletter"> que aparezca en otra página se borra
   sola, así que no hace falta ir quitándolos a mano de las guías ni de los
   artículos. Si algún día quieres volver a enseñarlo en más sitios, cambia
   SOLO_EN_PORTADA a false.

   Cómo funciona:
     1. La persona deja su correo.
     2. Se guarda en el almacén "suscriptores" de Netlify (función `suscribir`).
     3. AL INSTANTE, en la misma página, aparecen los cinco PDF del pack.
   El paso 3 es la clave: el regalo no depende de que salga ningún correo, así
   que esto funciona desde el primer día aunque no tengas el envío montado.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  var SOLO_EN_PORTADA = true;

  function esPortada() {
    var p = (location.pathname || '/').toLowerCase();
    return p === '/' || p === '/index.html' || p === '/index.htm';
  }

  // Las cinco guías del pack. Los PDF ya existen en /descargas.
  var PACK = [
    ['Calmar la ansiedad', '/descargas/calmar-la-ansiedad.pdf'],
    ['Dormir mejor en 7 pasos', '/descargas/dormir-mejor-en-7-pasos.pdf'],
    ['Cuando no tienes ganas de nada', '/descargas/cuando-no-tienes-ganas-de-nada.pdf'],
    ['Deja de darle vueltas', '/descargas/deja-de-darle-vueltas.pdf'],
    ['Crear hábitos que duren', '/descargas/crear-habitos-que-duren.pdf']
  ];

  var TEXTOS = {
    titulo: '📚 Llévate el pack de inicio, gratis',
    texto: 'Cinco guías en PDF para tener a mano: calmar la ansiedad, dormir mejor, ' +
           'cuando no tienes ganas de nada, dejar de darle vueltas y crear hábitos que duren. ' +
           'Te las doy en cuanto dejes el correo —aparecen aquí mismo, al instante— y a partir ' +
           'de ahí te escribo <strong>los domingos</strong> con lo que haya publicado esa ' +
           'semana. Un correo. Te borras en un clic.',
    boton: 'Darme el pack'
  };

  function inyectarEstilos() {
    if (document.getElementById('pl-newsletter-css')) return;
    var css =
      '.pl-nl{background:var(--surface,#fff);border:1px solid var(--border,#DDD7CB);border-top:4px solid var(--accent,#4A3B78);border-radius:14px;padding:1.3rem 1.5rem 1.4rem;margin:2rem 0;font-family:var(--font-body,"Work Sans",system-ui,sans-serif);text-align:left;}' +
      '.pl-nl h3{font-family:var(--font-display,"Lora",Georgia,serif);font-weight:600;font-size:1.2rem;margin:0 0 .4rem;color:var(--ink,#211F2E);}' +
      '.pl-nl p.pl-nl-sub{margin:0 0 .9rem;font-size:.94rem;line-height:1.55;color:var(--ink-soft,#625C70);}' +
      '.pl-nl form{display:flex;flex-direction:column;gap:.6rem;}' +
      '.pl-nl .pl-row{display:flex;flex-wrap:wrap;gap:.6rem;}' +
      '.pl-nl input[type=email]{flex:1 1 220px;min-width:0;padding:.7rem .9rem;border:1px solid var(--border,#DDD7CB);border-radius:9px;font-size:1rem;font-family:inherit;background:var(--paper,#EEEDE6);color:var(--ink,#211F2E);}' +
      '.pl-nl input[type=email]:focus{outline:3px solid var(--accent,#4A3B78);outline-offset:1px;}' +
      '.pl-nl button{background:var(--accent,#4A3B78);color:#fff;border:0;font-weight:600;font-size:.95rem;padding:.7rem 1.3rem;border-radius:9px;cursor:pointer;font-family:inherit;}' +
      '.pl-nl button:hover{background:#3a2e63;}' +
      '.pl-nl button:disabled{opacity:.6;cursor:default;}' +
      '.pl-nl label.pl-consent{display:flex;gap:.5rem;align-items:flex-start;font-size:.8rem;line-height:1.45;color:var(--ink-soft,#625C70);}' +
      '.pl-nl label.pl-consent a{color:var(--accent,#4A3B78);}' +
      '.pl-nl .pl-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}' +
      '.pl-nl .pl-msg{margin:.2rem 0 0;font-size:.9rem;line-height:1.5;}' +
      '.pl-nl .pl-msg.ok{color:#2f6b4f;}' +
      '.pl-nl .pl-msg.err{color:#8C3B4A;}' +
      '.pl-nl .pl-pack{list-style:none;margin:.9rem 0 0;padding:0;display:flex;flex-direction:column;gap:.45rem;}' +
      '.pl-nl .pl-pack a{display:block;text-decoration:none;font-weight:600;font-size:.93rem;color:var(--ink,#211F2E);background:var(--paper,#EEEDE6);border:1px solid var(--border,#DDD7CB);border-radius:9px;padding:.6rem .85rem;}' +
      '.pl-nl .pl-pack a:hover{border-color:var(--accent,#4A3B78);color:var(--accent,#4A3B78);}' +
      '.pl-nl .pl-nota{margin:.9rem 0 0;font-size:.82rem;line-height:1.5;color:var(--ink-soft,#625C70);}';
    var st = document.createElement('style');
    st.id = 'pl-newsletter-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function listaPack() {
    var html = '<ul class="pl-pack">';
    for (var i = 0; i < PACK.length; i++) {
      html += '<li><a href="' + PACK[i][1] + '" download>📄 ' + PACK[i][0] + ' (PDF)</a></li>';
    }
    return html + '</ul>';
  }

  function construir(box) {
    if (box.dataset.plReady) return;
    box.dataset.plReady = '1';
    var origen = box.getAttribute('data-origen') || (location.pathname || '');

    box.classList.add('pl-nl');
    box.innerHTML =
      '<h3>' + TEXTOS.titulo + '</h3>' +
      '<p class="pl-nl-sub">' + TEXTOS.texto + '</p>' +
      '<form novalidate>' +
        '<div class="pl-row">' +
          '<input type="email" name="email" required autocomplete="email" placeholder="tu@correo.com" aria-label="Tu correo electrónico">' +
          '<button type="submit">' + TEXTOS.boton + '</button>' +
        '</div>' +
        '<label class="pl-consent"><input type="checkbox" name="consentimiento" required> Acepto recibir los avisos de Psicolinks y he leído la <a href="/privacidad.html" target="_blank" rel="noopener">política de privacidad</a>. Me puedo borrar cuando quiera.</label>' +
        '<div class="pl-hp"><label>No rellenar<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<p class="pl-msg" role="status" aria-live="polite" hidden></p>' +
      '</form>';

    var form = box.querySelector('form');
    var msg = box.querySelector('.pl-msg');
    var btn = box.querySelector('button');

    function entregarPack() {
      form.innerHTML =
        '<p class="pl-msg ok">¡Hecho! Aquí tienes el pack. Descárgalo ahora, que así lo tienes para siempre.</p>' +
        listaPack() +
        '<p class="pl-nota">Si algún enlace no te abre, prueba a pulsarlo manteniendo pulsado y «Guardar enlace». ' +
        'Te llegará también un correo con estos mismos enlaces. Y todas estas guías están en abierto en ' +
        '<a href="/temas.html">las guías</a>: el pack es por comodidad, no porque estén escondidas.</p>';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.hidden = false;
      msg.className = 'pl-msg';
      var email = form.email.value.trim();
      var consent = form.consentimiento.checked;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.className = 'pl-msg err';
        msg.textContent = 'Escribe un correo válido, por favor.';
        return;
      }
      if (!consent) {
        msg.className = 'pl-msg err';
        msg.textContent = 'Marca la casilla para poder darte el pack.';
        return;
      }
      btn.disabled = true;
      msg.textContent = 'Un segundo…';
      fetch('/.netlify/functions/suscribir', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email,
          consentimiento: true,
          origen: origen,
          website: form.website.value
        })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && res.d && res.d.ok) {
            entregarPack();
          } else {
            btn.disabled = false;
            msg.className = 'pl-msg err';
            msg.textContent = (res.d && res.d.error) || 'No se ha podido guardar. Inténtalo de nuevo.';
          }
        })
        .catch(function () {
          btn.disabled = false;
          msg.className = 'pl-msg err';
          msg.textContent = 'No hay conexión ahora mismo. Inténtalo más tarde.';
        });
    });
  }

  function init() {
    var cajas = document.querySelectorAll('.pl-newsletter');
    if (!cajas.length) return;

    // Fuera de la portada, el cajetín se quita y no se monta nada.
    if (SOLO_EN_PORTADA && !esPortada()) {
      for (var i = 0; i < cajas.length; i++) {
        if (cajas[i].parentNode) cajas[i].parentNode.removeChild(cajas[i]);
      }
      return;
    }

    inyectarEstilos();
    Array.prototype.forEach.call(cajas, construir);
  }

  // Expuesto para las páginas que inyectan contenido después de cargar.
  window.PL_initNewsletter = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
