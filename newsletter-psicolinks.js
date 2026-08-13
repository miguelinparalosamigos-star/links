/* Psicolinks · Cajetín de newsletter reutilizable.
   Uso: coloca en la página
     <div class="pl-newsletter" data-variant="pdf" data-origen="mi-guia"></div>
   y al final
     <script src="/newsletter-psicolinks.js" defer></script>
   Variantes: "pdf" (páginas de guía) y "digest" (artículos y portada).
   Envía el correo a /.netlify/functions/suscribir. No frena el SEO: el
   contenido de la página sigue abierto; esto es solo un extra. */
(function () {
  'use strict';

  var TEXTOS = {
    pdf: {
      titulo: '📬 Llévate lo próximo en tu correo',
      texto: 'Ya puedes descargar esta guía en PDF ahí arriba. Y si quieres, cada domingo te mando un correo corto con los mejores estudios de la semana y las guías nuevas.',
      boton: 'Apuntarme'
    },
    digest: {
      titulo: '📬 ¿Te gusta este tipo de análisis?',
      texto: 'Únete a la newsletter de Psicolinks: cada domingo, un resumen con los mejores estudios de psicología de la semana y las guías nuevas. Sin spam, un solo correo.',
      boton: 'Apuntarme'
    }
  };

  function inyectarEstilos() {
    if (document.getElementById('pl-newsletter-css')) return;
    var css =
      '.pl-nl{background:var(--surface,#fff);border:1px solid var(--border,#DDD7CB);border-top:4px solid var(--accent,#4A3B78);border-radius:14px;padding:1.3rem 1.5rem 1.4rem;margin:2rem 0;font-family:var(--font-body,"Work Sans",system-ui,sans-serif);}' +
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
      '.pl-nl .pl-msg.err{color:#8C3B4A;}';
    var st = document.createElement('style');
    st.id = 'pl-newsletter-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function construir(box) {
    if (box.dataset.plReady) return;
    box.dataset.plReady = '1';
    var variant = box.getAttribute('data-variant') === 'digest' ? 'digest' : 'pdf';
    var origen = box.getAttribute('data-origen') || (location.pathname || '');
    var t = TEXTOS[variant];

    box.classList.add('pl-nl');
    box.innerHTML =
      '<h3>' + t.titulo + '</h3>' +
      '<p class="pl-nl-sub">' + t.texto + '</p>' +
      '<form novalidate>' +
        '<div class="pl-row">' +
          '<input type="email" name="email" required autocomplete="email" placeholder="tu@correo.com" aria-label="Tu correo electrónico">' +
          '<button type="submit">' + t.boton + '</button>' +
        '</div>' +
        '<label class="pl-consent"><input type="checkbox" name="consentimiento" required> Acepto recibir la newsletter de Psicolinks y he leído la <a href="/privacidad.html" target="_blank" rel="noopener">política de privacidad</a>. Me puedo borrar cuando quiera.</label>' +
        '<div class="pl-hp"><label>No rellenar<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<p class="pl-msg" role="status" aria-live="polite" hidden></p>' +
      '</form>';

    var form = box.querySelector('form');
    var msg = box.querySelector('.pl-msg');
    var btn = box.querySelector('button');

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
        msg.textContent = 'Marca la casilla para poder apuntarte.';
        return;
      }
      btn.disabled = true;
      msg.textContent = 'Enviando…';
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
            form.innerHTML = '<p class="pl-msg ok">¡Listo! Ya estás apuntado. Nos leemos el domingo. 📩</p>';
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
    inyectarEstilos();
    cajas.forEach(construir);
  }

  // Exposed so páginas que inyectan contenido tras cargar (p. ej. post.html)
  // puedan volver a montar el cajetín cuando aparezca en el DOM.
  window.PL_initNewsletter = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
