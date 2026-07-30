/* =========================================================
   AVISO DE COOKIES — Psicolinks
   =========================================================

   QUÉ HACE ESTE ARCHIVO
   - Muestra un aviso de cookies en la primera visita, con tres
     opciones al mismo nivel: "Rechazar todo", "Preferencias" y
     "Aceptar todo" (tal y como exige la Guía de Cookies de la
     AEPD: aceptar y rechazar deben pesar visualmente lo mismo).
   - Si el usuario pulsa "Preferencias", se abre un panel donde
     puede activar o desactivar, categoría por categoría:
     Análisis y Personalización/Publicidad. Las cookies
     "Necesarias" no se pueden desactivar porque son las que
     hacen que la web funcione.
   - Guarda la decisión en el navegador del usuario (localStorage)
     para no volver a preguntar en cada página.
   - Bloquea los scripts de análisis y publicidad hasta que el
     usuario da su consentimiento para esa categoría concreta.
     Ahora mismo Psicolinks no tiene Analytics ni publicidad
     activos, pero el bloqueo ya queda preparado para cuando los
     añadas — ver más abajo cómo engancharlos.

   CÓMO USAR ESTE ARCHIVO
   ---------------------------------------------------------
   Ya está enlazado en index.html, post.html y archivo.html, justo
   antes de </body>:

     <script src="js/cookies-psicolinks.js" defer></script>

   Si añades una página nueva, pon esa misma línea antes de su
   </body> y ya se encarga de todo (crea el aviso, los estilos y
   el panel de preferencias por sí mismo).

   CÓMO AÑADIR GOOGLE ANALYTICS O PUBLICIDAD MÁS ADELANTE
   ---------------------------------------------------------
   Cuando tengas ese código, NO lo pegues como un <script> normal,
   porque el navegador lo ejecutaría antes de que el usuario
   decida. Pégalo así, cambiando solo "type" y añadiendo
   "data-categoria":

     <script type="text/plain" data-categoria="analiticas"
             src="https://www.googletagmanager.com/gtag/js?id=TU-ID-DE-ANALYTICS">
     </script>

     <script type="text/plain" data-categoria="marketing">
       // tu código de publicidad aquí
     </script>

   Este archivo los activará automáticamente en cuanto el usuario
   acepte esa categoría, y los dejará apagados si la rechaza.

   CÓMO DEJAR QUE EL USUARIO CAMBIE DE OPINIÓN MÁS TARDE
   ---------------------------------------------------------
   La ley exige poder retirar el consentimiento tan fácilmente como
   se dio. Ya hay un enlace pensado para el pie de página:

     <a href="#" onclick="PL_configurarCookies(); return false;">
       Configurar cookies
     </a>

   ========================================================= */

(function () {
  'use strict';

  // ------- Configuración rápida -------
  var ENLACE_POLITICA_COOKIES = 'politica-cookies.html';
  var CLAVE_ALMACENAMIENTO = 'pl_consentimiento_cookies';

  // ------- Leer / guardar la decisión del usuario -------
  function leerConsentimientoGuardado() {
    try {
      var datos = localStorage.getItem(CLAVE_ALMACENAMIENTO);
      return datos ? JSON.parse(datos) : null;
    } catch (error) {
      return null;
    }
  }

  function guardarConsentimiento(analiticas, marketing) {
    var datos = {
      necesarias: true,
      analiticas: !!analiticas,
      marketing: !!marketing,
      fecha: new Date().toISOString()
    };
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datos));
    } catch (error) {
      /* si el navegador bloquea localStorage, seguimos sin guardar */
    }
    activarScriptsPermitidos(datos);
    return datos;
  }

  // ------- Activar los scripts bloqueados según lo aceptado -------
  function activarScriptsPermitidos(datos) {
    var bloqueados = document.querySelectorAll('script[type="text/plain"][data-categoria]');
    Array.prototype.forEach.call(bloqueados, function (etiquetaOriginal) {
      var categoria = etiquetaOriginal.getAttribute('data-categoria');
      if (!datos[categoria]) { return; }

      var nuevoScript = document.createElement('script');
      Array.prototype.forEach.call(etiquetaOriginal.attributes, function (atributo) {
        if (atributo.name !== 'type' && atributo.name !== 'data-categoria') {
          nuevoScript.setAttribute(atributo.name, atributo.value);
        }
      });
      if (!etiquetaOriginal.src) {
        nuevoScript.textContent = etiquetaOriginal.textContent;
      }
      etiquetaOriginal.parentNode.replaceChild(nuevoScript, etiquetaOriginal);
    });
  }

  // ------- Estilos (se inyectan una sola vez) -------
  function inyectarEstilos() {
    if (document.getElementById('plc-estilos')) { return; }
    var estilos = document.createElement('style');
    estilos.id = 'plc-estilos';
    estilos.textContent =
      '.plc-banner,.plc-overlay{' +
      '--plc-bg:#211F2E;--plc-bg-panel:#2A2740;--plc-text:#EEEDE6;' +
      '--plc-text-muted:#B7AFC9;--plc-accent:#6552A0;--plc-accent-hover:#7A66B8;' +
      '--plc-reject-bg:#3A3650;--plc-reject-bg-hover:#454064;--plc-border:#3D3956;' +
      'font-family:"Work Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'box-sizing:border-box;}' +
      '.plc-banner *,.plc-overlay *{box-sizing:border-box;}' +

      '.plc-banner{position:fixed;left:0;right:0;bottom:0;z-index:999999;' +
      'background:var(--plc-bg);color:var(--plc-text);padding:20px 24px;' +
      'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;' +
      'gap:16px;box-shadow:0 -4px 24px rgba(0,0,0,.35);border-top:1px solid var(--plc-border);' +
      'animation:plc-subir .35s ease-out;}' +
      '@keyframes plc-subir{from{transform:translateY(100%)}to{transform:translateY(0)}}' +

      '.plc-texto{margin:0;font-size:14px;line-height:1.5;color:var(--plc-text);max-width:640px;}' +
      '.plc-enlace{color:#B49CE0;text-decoration:underline;}' +
      '.plc-acciones{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}' +

      '.plc-boton{font:inherit;font-size:14px;font-weight:600;padding:11px 20px;' +
      'border-radius:8px;border:1px solid transparent;cursor:pointer;white-space:nowrap;' +
      'transition:background-color .15s ease;}' +
      '.plc-boton:focus-visible{outline:2px solid var(--plc-accent);outline-offset:2px;}' +
      '.plc-boton-principal{background:var(--plc-accent);color:#fff;}' +
      '.plc-boton-principal:hover{background:var(--plc-accent-hover);}' +
      '.plc-boton-secundario{background:var(--plc-reject-bg);color:var(--plc-text);border-color:var(--plc-border);}' +
      '.plc-boton-secundario:hover{background:var(--plc-reject-bg-hover);}' +
      '.plc-boton-texto{background:transparent;color:var(--plc-text-muted);' +
      'text-decoration:underline;padding:11px 6px;}' +
      '.plc-boton-texto:hover{color:var(--plc-text);}' +

      '.plc-overlay{position:fixed;inset:0;z-index:999999;background:rgba(15,13,23,.6);' +
      'display:flex;align-items:center;justify-content:center;padding:20px;}' +
      '.plc-modal{background:var(--plc-bg-panel);color:var(--plc-text);width:100%;max-width:520px;' +
      'max-height:85vh;overflow-y:auto;border-radius:14px;padding:28px;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.45);}' +
      '.plc-modal h2{margin:0 0 8px;font-size:19px;font-family:"Lora",Georgia,serif;}' +
      '.plc-modal>p{margin:0 0 20px;font-size:14px;color:var(--plc-text-muted);line-height:1.5;}' +

      '.plc-categoria{display:flex;justify-content:space-between;gap:16px;padding:16px 0;' +
      'border-top:1px solid var(--plc-border);}' +
      '.plc-categoria:first-of-type{border-top:none;padding-top:4px;}' +
      '.plc-categoria-info h3{margin:0 0 4px;font-size:15px;}' +
      '.plc-categoria-info p{margin:0;font-size:13px;color:var(--plc-text-muted);line-height:1.5;}' +

      '.plc-interruptor{position:relative;display:inline-block;width:44px;height:26px;flex-shrink:0;}' +
      '.plc-interruptor input{opacity:0;width:0;height:0;}' +
      '.plc-deslizante{position:absolute;inset:0;background:var(--plc-reject-bg);' +
      'border-radius:999px;transition:background-color .15s ease;cursor:pointer;}' +
      '.plc-deslizante::before{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;' +
      'background:#fff;border-radius:50%;transition:transform .15s ease;}' +
      '.plc-interruptor input:checked+.plc-deslizante{background:var(--plc-accent);}' +
      '.plc-interruptor input:checked+.plc-deslizante::before{transform:translateX(18px);}' +
      '.plc-interruptor input:disabled+.plc-deslizante{background:var(--plc-accent);opacity:.5;cursor:not-allowed;}' +
      '.plc-interruptor input:focus-visible+.plc-deslizante{outline:2px solid var(--plc-accent);outline-offset:2px;}' +

      '.plc-modal-acciones{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;justify-content:flex-end;}' +

      '@media (max-width:640px){' +
      '.plc-banner{flex-direction:column;align-items:stretch;padding:18px;}' +
      '.plc-acciones{justify-content:stretch;}' +
      '.plc-acciones .plc-boton{flex:1;text-align:center;}' +
      '.plc-boton-texto{flex:0 0 100%;order:3;text-align:center;}' +
      '.plc-modal{padding:22px;}' +
      '.plc-modal-acciones .plc-boton{flex:1;text-align:center;}' +
      '}';
    document.head.appendChild(estilos);
  }

  // ------- HTML del aviso (primera capa) -------
  function crearBanner() {
    var contenedor = document.createElement('div');
    contenedor.className = 'plc-banner';
    contenedor.setAttribute('role', 'region');
    contenedor.setAttribute('aria-label', 'Aviso de cookies');
    contenedor.innerHTML =
      '<p class="plc-texto">' +
        'Usamos cookies necesarias para que Psicolinks funcione y, si nos das permiso, ' +
        'cookies de análisis y publicidad para mejorar el blog. ' +
        '<a href="' + ENLACE_POLITICA_COOKIES + '" class="plc-enlace">Más información</a>.' +
      '</p>' +
      '<div class="plc-acciones">' +
        '<button type="button" class="plc-boton plc-boton-texto" data-accion="preferencias">Preferencias</button>' +
        '<button type="button" class="plc-boton plc-boton-secundario" data-accion="rechazar">Rechazar todo</button>' +
        '<button type="button" class="plc-boton plc-boton-principal" data-accion="aceptar">Aceptar todo</button>' +
      '</div>';
    return contenedor;
  }

  // ------- HTML del panel de preferencias (segunda capa) -------
  function crearModal() {
    var overlay = document.createElement('div');
    overlay.className = 'plc-overlay';
    overlay.innerHTML =
      '<div class="plc-modal" role="dialog" aria-modal="true" aria-labelledby="plc-titulo-modal">' +
        '<h2 id="plc-titulo-modal">Preferencias de cookies</h2>' +
        '<p>Elige qué cookies aceptas. Puedes cambiar esta decisión cuando quieras desde el enlace ' +
        '"Configurar cookies" del pie de página.</p>' +

        '<div class="plc-categoria">' +
          '<div class="plc-categoria-info">' +
            '<h3>Necesarias</h3>' +
            '<p>Imprescindibles para que la web funcione (por ejemplo, recordar esta misma decisión). Siempre activas.</p>' +
          '</div>' +
          '<label class="plc-interruptor">' +
            '<input type="checkbox" checked disabled aria-label="Cookies necesarias, siempre activas">' +
            '<span class="plc-deslizante"></span>' +
          '</label>' +
        '</div>' +

        '<div class="plc-categoria">' +
          '<div class="plc-categoria-info">' +
            '<h3>Análisis</h3>' +
            '<p>Nos ayudan a entender cómo se usa el blog para mejorarlo (por ejemplo, Google Analytics).</p>' +
          '</div>' +
          '<label class="plc-interruptor">' +
            '<input type="checkbox" data-toggle="analiticas" aria-label="Cookies de análisis">' +
            '<span class="plc-deslizante"></span>' +
          '</label>' +
        '</div>' +

        '<div class="plc-categoria">' +
          '<div class="plc-categoria-info">' +
            '<h3>Personalización y publicidad</h3>' +
            '<p>Permiten mostrar anuncios relevantes y financiar el blog gratuito.</p>' +
          '</div>' +
          '<label class="plc-interruptor">' +
            '<input type="checkbox" data-toggle="marketing" aria-label="Cookies de personalización y publicidad">' +
            '<span class="plc-deslizante"></span>' +
          '</label>' +
        '</div>' +

        '<div class="plc-modal-acciones">' +
          '<button type="button" class="plc-boton plc-boton-secundario" data-accion="rechazar-todo-modal">Rechazar todo</button>' +
          '<button type="button" class="plc-boton plc-boton-principal" data-accion="guardar">Guardar preferencias</button>' +
        '</div>' +
      '</div>';
    return overlay;
  }

  // ------- Abrir el panel de preferencias -------
  function abrirModal(banner) {
    var existente = document.querySelector('.plc-overlay');
    if (existente) { existente.remove(); }

    var overlay = crearModal();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var guardado = leerConsentimientoGuardado();
    if (guardado) {
      var toggleAnaliticas = overlay.querySelector('[data-toggle="analiticas"]');
      var toggleMarketing = overlay.querySelector('[data-toggle="marketing"]');
      if (toggleAnaliticas) { toggleAnaliticas.checked = !!guardado.analiticas; }
      if (toggleMarketing) { toggleMarketing.checked = !!guardado.marketing; }
    }

    function cerrar() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', alEscape);
    }

    function alEscape(evento) {
      if (evento.key === 'Escape') { cerrar(); }
    }
    document.addEventListener('keydown', alEscape);

    overlay.addEventListener('click', function (evento) {
      if (evento.target === overlay) { cerrar(); return; }

      var accion = evento.target.getAttribute('data-accion');
      if (accion === 'guardar') {
        var analiticas = overlay.querySelector('[data-toggle="analiticas"]').checked;
        var marketing = overlay.querySelector('[data-toggle="marketing"]').checked;
        guardarConsentimiento(analiticas, marketing);
        cerrar();
        if (banner) { banner.remove(); }
      } else if (accion === 'rechazar-todo-modal') {
        guardarConsentimiento(false, false);
        cerrar();
        if (banner) { banner.remove(); }
      }
    });
  }

  // ------- Arranque -------
  function iniciar() {
    inyectarEstilos();
    var guardado = leerConsentimientoGuardado();

    if (guardado) {
      activarScriptsPermitidos(guardado);
      return;
    }

    var banner = crearBanner();
    document.body.appendChild(banner);

    banner.addEventListener('click', function (evento) {
      var accion = evento.target.getAttribute('data-accion');
      if (accion === 'aceptar') {
        guardarConsentimiento(true, true);
        banner.remove();
      } else if (accion === 'rechazar') {
        guardarConsentimiento(false, false);
        banner.remove();
      } else if (accion === 'preferencias') {
        abrirModal(banner);
      }
    });
  }

  // ------- Función pública: enlázala desde "Configurar cookies" en el pie de página -------
  window.PL_configurarCookies = function () {
    abrirModal(null);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
