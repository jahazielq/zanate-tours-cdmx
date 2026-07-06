/* ZANATE — JS principal: navegación, i18n, chat, itinerario, fallbacks */
(function () {
  "use strict";

  /* ---------- Fallback elegante para imágenes que no cargan ---------- */
  function placeholder(texto) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="533">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#16305F"/><stop offset="1" stop-color="#1E3D77"/>
      </linearGradient></defs>
      <rect width="800" height="533" fill="url(#g)"/>
      <text x="50%" y="48%" fill="#C9A227" font-family="Georgia,serif" font-size="30" text-anchor="middle">ZANATE</text>
      <text x="50%" y="58%" fill="#AFC0E2" font-family="Arial,sans-serif" font-size="17" text-anchor="middle">${(texto || "Ciudad de México").replace(/[<>&]/g, "")}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  document.addEventListener("error", function (e) {
    const el = e.target;
    if (el.tagName === "IMG" && !el.dataset.fallback) {
      el.dataset.fallback = "1";
      el.src = placeholder(el.alt);
    }
  }, true);
  window.ZANATE_PLACEHOLDER = placeholder;

  /* ---------- Menú móvil ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      navToggle.setAttribute("aria-expanded", abierto);
    });
  }

  /* ---------- Animaciones reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- i18n ES / EN ---------- */
  const DICC = {
    "nav.inicio": ["Inicio", "Home"],
    "nav.nosotros": ["Nosotros", "About"],
    "nav.experiencias": ["Experiencias", "Experiences"],
    "nav.mapa": ["Mapa", "Map"],
    "nav.galeria": ["Galería", "Gallery"],
    "nav.blog": ["Blog", "Blog"],
    "nav.contacto": ["Contacto", "Contact"],
    "nav.reservar": ["Reservar", "Book now"],
    "hero.cta": ["Reserva tu experiencia", "Book your experience"],
    "hero.cta2": ["Explorar recorridos", "Explore tours"],
    "footer.derechos": ["Todos los derechos reservados.", "All rights reserved."],
    "comun.desde": ["Desde", "From"],
    "comun.agregar": ["Añadir al itinerario", "Add to itinerary"],
    "comun.quitar": ["Quitar del itinerario", "Remove from itinerary"],
    "comun.ver": ["Ver detalles", "View details"]
  };
  function aplicarIdioma(lang) {
    const i = lang === "en" ? 1 : 0;
    document.documentElement.lang = lang === "en" ? "en" : "es";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      if (DICC[clave]) el.textContent = DICC[clave][i];
    });
    document.querySelectorAll("[data-es][data-en]").forEach((el) => {
      el.textContent = lang === "en" ? el.dataset.en : el.dataset.es;
    });
    const toggle = document.querySelector(".lang-toggle");
    if (toggle) toggle.textContent = lang === "en" ? "ES 🇲🇽" : "EN 🇺🇸";
    localStorage.setItem("zanate_lang", lang);
  }
  const langGuardado = localStorage.getItem("zanate_lang") || "es";
  const toggle = document.querySelector(".lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      aplicarIdioma((localStorage.getItem("zanate_lang") || "es") === "es" ? "en" : "es");
    });
  }
  if (langGuardado !== "es") aplicarIdioma(langGuardado);
  else if (toggle) toggle.textContent = "EN 🇺🇸";

  /* ---------- Barra de itinerario ---------- */
  function pintarBarra() {
    const barra = document.querySelector(".itinerario-barra");
    if (!barra || !window.ZANATE_ITINERARIO) return;
    const n = ZANATE_ITINERARIO.obtener().length;
    barra.classList.toggle("visible", n > 0);
    const cont = barra.querySelector("[data-contador]");
    if (cont) cont.textContent = n;
  }
  document.addEventListener("itinerario:cambio", pintarBarra);
  pintarBarra();

  /* ---------- Chat asistente virtual ---------- */
  const REGLAS = [
    { k: /precio|costo|cu[aá]nto|tarifa|price|cost/i, r: "Nuestras experiencias parten de $2,800 MXN por persona (medio día) y $4,500 MXN (día completo), con transporte privado y fotografía incluidos. En la página de Reservaciones hay una calculadora en tiempo real. 💙" },
    { k: /reserv|book|agend|disponib/i, r: "Puedes reservar en la sección Reservaciones: eliges fecha, número de personas, idioma e intereses, y te confirmamos por WhatsApp o correo en menos de 12 horas." },
    { k: /segur|primeros auxilios|botiqu|safe/i, r: "Tu bienestar es prioridad: todo nuestro personal está capacitado en primeros auxilios, cada van lleva botiquín y contamos con protocolos de atención inmediata ante incidentes menores. 🛡️" },
    { k: /foto|photo|c[aá]mara/i, r: "Todas nuestras experiencias incluyen cobertura fotográfica profesional durante el recorrido y entrega digital de fotos editadas, con sesiones en los puntos más emblemáticos. 📸" },
    { k: /transporte|van|traslado|aeropuerto|hotel|pickup/i, r: "Viajas en van ejecutiva privada con clima y wifi. Te recogemos y regresamos a tu hotel, aeropuerto o domicilio, sin costo adicional dentro de CDMX. 🚐" },
    { k: /idioma|ingl[eé]s|english|language/i, r: "Operamos recorridos en español e inglés; con aviso previo podemos coordinar otros idiomas. Our guides are fully bilingual! 🌎" },
    { k: /itinerario|personaliz|custom|medida/i, r: "Cada itinerario se diseña a tu medida: cuéntanos tus intereses (arte, historia, gastronomía, naturaleza…) en el formulario de reservas y el generador te propondrá una ruta base que afinamos contigo." },
    { k: /grupo|personas|familia|group/i, r: "Trabajamos con grupos reducidos (máx. 10 personas) para una atención exclusiva. Para familias o grupos académicos armamos logística especial." },
    { k: /hola|buen[oa]s|hello|hi/i, r: "¡Hola! Soy el asistente de Zanate 🐦. Puedo ayudarte con precios, reservas, seguridad, transporte o itinerarios personalizados. ¿Qué te gustaría saber?" },
    { k: /gracias|thank/i, r: "¡Con mucho gusto! Estamos para hacer de tu visita a CDMX una experiencia memorable. ✨" }
  ];
  const RESPUESTA_DEF = "¡Buena pregunta! Para una respuesta a tu medida escríbenos por WhatsApp (+52 55 0000 0000) o deja tus datos en Contacto. También puedo ayudarte con: precios, reservas, seguridad, fotografía o transporte.";

  function montarChat() {
    if (document.querySelector(".chat-boton")) return;
    const btn = document.createElement("button");
    btn.className = "chat-boton"; btn.setAttribute("aria-label", "Abrir chat de asistencia");
    btn.innerHTML = "💬";
    const panel = document.createElement("div");
    panel.className = "chat-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Asistente virtual Zanate");
    panel.innerHTML = `
      <div class="chat-panel__cabecera">Asistente Zanate <small>Respuesta inmediata · 24/7</small></div>
      <div class="chat-mensajes" aria-live="polite"></div>
      <div class="chat-sugerencias">
        <button type="button">¿Cuánto cuesta?</button>
        <button type="button">¿Es seguro?</button>
        <button type="button">¿Incluye fotos?</button>
      </div>
      <form class="chat-form">
        <input type="text" placeholder="Escribe tu pregunta…" aria-label="Mensaje" required>
        <button type="submit" aria-label="Enviar">➤</button>
      </form>`;
    document.body.append(btn, panel);

    const mensajes = panel.querySelector(".chat-mensajes");
    function agregar(texto, cls) {
      const div = document.createElement("div");
      div.className = "msg " + cls; div.textContent = texto;
      mensajes.appendChild(div); mensajes.scrollTop = mensajes.scrollHeight;
    }
    function responder(texto) {
      agregar(texto, "msg--user");
      const regla = REGLAS.find((r) => r.k.test(texto));
      setTimeout(() => agregar(regla ? regla.r : RESPUESTA_DEF, "msg--bot"), 450);
    }
    btn.addEventListener("click", () => {
      const abierto = panel.classList.toggle("abierto");
      if (abierto && !mensajes.children.length) {
        agregar("¡Hola! 👋 Soy el asistente virtual de Zanate. ¿En qué puedo ayudarte hoy?", "msg--bot");
      }
    });
    panel.querySelector(".chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = e.target.querySelector("input");
      if (input.value.trim()) { responder(input.value.trim()); input.value = ""; }
    });
    panel.querySelectorAll(".chat-sugerencias button").forEach((b) =>
      b.addEventListener("click", () => responder(b.textContent))
    );
  }
  montarChat();

  /* ---------- Año en footer ---------- */
  document.querySelectorAll("[data-anio]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Guardado genérico de formularios (demo sin backend) ---------- */
  window.ZANATE_GUARDAR = function (coleccion, datos) {
    const clave = "zanate_" + coleccion;
    const lista = JSON.parse(localStorage.getItem(clave) || "[]");
    lista.push(Object.assign({ _fecha: new Date().toISOString() }, datos));
    localStorage.setItem(clave, JSON.stringify(lista));
  };
})();
