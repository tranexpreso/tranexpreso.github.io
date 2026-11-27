/* ============================================
   TRANSPORTE EXPRESO — main.js
   Empresa Provincial de Transporte Santiago de Cuba
   ============================================ */
(function () {
  'use strict';

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const navMovil = document.querySelector('.nav-movil');
  if (toggle && navMovil) {
    toggle.addEventListener('click', function () {
      const abierto = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !abierto);
      navMovil.classList.toggle('abierto', !abierto);
    });
    navMovil.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        navMovil.classList.remove('abierto');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Header sombra al scroll ---------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 20
        ? '0 4px 20px rgba(0,0,0,.35)'
        : '0 2px 12px rgba(0,0,0,.25)';
    }, { passive: true });
  }

  /* ---------- Filtros catálogo ---------- */
  const filtros = document.querySelectorAll('.filtro-btn');
  const itemsCatalogo = document.querySelectorAll('.catalogo-item');
  if (filtros.length && itemsCatalogo.length) {
    filtros.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filtros.forEach(function (b) { b.classList.remove('activo'); });
        this.classList.add('activo');
        const categoria = this.dataset.filtro;
        itemsCatalogo.forEach(function (item) {
          const coincide = categoria === 'todos' || item.dataset.categoria === categoria;
          item.style.display = coincide ? 'flex' : 'none';
        });
      });
    });
  }

  /* ---------- Formulario WhatsApp ---------- */
  const form = document.querySelector('#form-cotizacion');
  if (form) {
    const WHATSAPP = '5352170105'; // Número real de Transporte Expreso

    const selectServicio = form.querySelector('#servicio');
    const campoOtro      = form.querySelector('#campo-otro-servicio');
    const inputOtro      = form.querySelector('#otro-servicio');

    /* Mostrar/ocultar campo "Otro servicio" */
    function toggleOtroServicio() {
      const esOtro = selectServicio.value === 'Otro servicio';
      campoOtro.style.display = esOtro ? 'block' : 'none';
      inputOtro.required = esOtro;
      if (!esOtro) {
        inputOtro.value = '';
        campoOtro.classList.remove('invalido');
      }
    }
    selectServicio.addEventListener('change', toggleOtroServicio);
    toggleOtroServicio(); // estado inicial

    /* Envío del formulario */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valido = true;
      const campos = form.querySelectorAll('[required]');

      campos.forEach(function (campo) {
        const contenedor = campo.closest('.campo');
        if (!campo.value.trim()) {
          contenedor.classList.add('invalido');
          valido = false;
        } else {
          contenedor.classList.remove('invalido');
        }
      });

      // Validación email
      const email = form.querySelector('#email');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.campo').classList.add('invalido');
        valido = false;
      }

      if (!valido) return;

      const nombre   = form.querySelector('#nombre').value.trim();
      const telefono = form.querySelector('#telefono').value.trim();
      const servicio = selectServicio.value;
      const mensaje  = form.querySelector('#mensaje').value.trim();

      // Si eligió "Otro servicio", añadimos la especificación
      let servicioTexto = servicio;
      if (servicio === 'Otro servicio') {
        const especificacion = inputOtro.value.trim();
        servicioTexto = 'Otro servicio: ' + especificacion;
      }

      const texto = encodeURIComponent(
        '🚛 *Nueva solicitud de cotización — Transporte Expreso*\n\n' +
        '👤 *Nombre:* ' + nombre + '\n' +
        '📞 *Teléfono:* ' + telefono + '\n' +
        '📦 *Servicio:* ' + servicioTexto + '\n' +
        '📝 *Mensaje:* ' + mensaje
      );

      const exito = form.querySelector('.mensaje-exito');
      if (exito) exito.classList.add('visible');

      window.open('https://wa.me/' + WHATSAPP + '?text=' + texto, '_blank');
      form.reset();
      toggleOtroServicio(); // ocultar campo extra tras resetear
      setTimeout(function () { if (exito) exito.classList.remove('visible'); }, 5000);
    });

    // Limpiar error al escribir
    form.querySelectorAll('input, textarea, select').forEach(function (campo) {
      campo.addEventListener('input', function () {
        this.closest('.campo').classList.remove('invalido');
      });
    });
  }

  /* ---------- Generar QR (tarjeta) ---------- */
  const qrImg = document.querySelector('#qr-tarjeta');
  if (qrImg && window.location.protocol !== 'file:') {
    const url = window.location.href;
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=' + encodeURIComponent(url);
  }

  /* ---------- Guardar contacto .vcf ---------- */
  const btnVcf = document.querySelector('#guardar-contacto');
  if (btnVcf) {
    btnVcf.addEventListener('click', function (e) {
      e.preventDefault();
      const vcf = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Transporte Expreso',
        'ORG:Empresa Provincial de Transporte Santiago de Cuba',
        'TITLE:Carga y Pasajeros por Flete',
        'TEL;TYPE=CELL:+5352170105',
        'TEL;TYPE=WORK:+5322646218',
        'EMAIL:tranexpreso@eptsc.transnet.cu',
        'ADR;TYPE=WORK:;;Carretera del Caney S/N e/ 15 y 17, Reparto Vista Alegre;Santiago de Cuba;;;Cuba',
        'URL:' + window.location.origin,
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcf], { type: 'text/vcard' });
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = 'transporte-expreso.vcf';
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      URL.revokeObjectURL(enlace.href);
    });
  }

})();