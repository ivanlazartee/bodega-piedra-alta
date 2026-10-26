/* =========================================================
   Bodega Piedra Alta — sitio de demostración
   1. Datos de los vinos
   2. La botella (SVG)
   3. Relato con scroll
   4. Vinos: lista y botella que cambia
   5. Carrito → WhatsApp
   6. Maridaje
   7. Reserva de visitas
   8. Aviso de edad
   ========================================================= */

const WHATSAPP = "5493816755692"; // número de pedidos (formato internacional, sin + ni espacios)

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const pesos = (n) => "$" + n.toLocaleString("es-AR");
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------
   1. VINOS
   --------------------------------------------------------- */
const VINOS = [
  {
    id: "torrontes",
    tipo: "Blanco · Torrontés",
    nombre: "Torrontés",
    linea: "Joven",
    anio: 2025,
    precio: 14500,
    desc: "La uva del Norte. Fresco, muy aromático y fácil de tomar: el vino de las empanadas y las tardes de calor.",
    notas: { Nariz: "Flor de azahar, durazno blanco y pomelo.", Boca: "Fresco, liviano, con acidez marcada.", Final: "Cítrico y floral." },
    ficha: ["Sin barrica", "13 % vol.", "Servir a 8–10 °C"],
    vidrio: "#E9E2D3", liquido: "#E6CF7A", opacidad: 0.95, capsula: "#C9A56A", tono: "#F3E6C4", texto: "#7A5A1E",
  },
  {
    id: "rosado",
    tipo: "Rosado · Malbec",
    nombre: "Rosado de Malbec",
    linea: "Joven",
    anio: 2025,
    precio: 13200,
    desc: "Malbec con un contacto cortito con las pieles. Rosa claro, frutado y para tomar bien frío.",
    notas: { Nariz: "Frutilla, frambuesa y pétalos de rosa.", Boca: "Seco, jugoso y refrescante.", Final: "Fruta roja y un toque de pomelo rosado." },
    ficha: ["Sin barrica", "12,5 % vol.", "Servir a 8–10 °C"],
    vidrio: "#EFE3E3", liquido: "#E58A9E", opacidad: 0.95, capsula: "#E7B4BE", tono: "#F5DDE0", texto: "#A12F52",
  },
  {
    id: "malbec",
    tipo: "Tinto · Malbec",
    nombre: "Malbec Reserva",
    linea: "Reserva",
    anio: 2023,
    precio: 22800,
    desc: "El vino de la casa. Doce meses en barricas de roble francés le suman estructura sin tapar la fruta de altura.",
    notas: { Nariz: "Ciruela, violeta y un toque de pimienta.", Boca: "Taninos suaves, fruta madura, buena acidez.", Final: "Largo, con notas de vainilla y especias." },
    ficha: ["12 meses en barrica", "14 % vol.", "Servir a 16–18 °C"],
    vidrio: "#1A0D10", liquido: "#8C2B47", opacidad: 0.6, capsula: "#8C2B47", tono: "#E7B4BE", texto: "#8C2B47",
  },
  {
    id: "tannat",
    tipo: "Tinto · Tannat",
    nombre: "Tannat Gran Reserva",
    linea: "Gran Reserva",
    anio: 2022,
    precio: 34500,
    desc: "Nuestro vino más intenso. Dieciocho meses en barrica y uno más en botella antes de salir. Para guardar o regalar.",
    notas: { Nariz: "Mora, chocolate amargo y tabaco.", Boca: "Potente, con taninos firmes y mucho cuerpo.", Final: "Muy largo, con cacao y café." },
    ficha: ["18 meses en barrica", "14,5 % vol.", "Servir a 17–18 °C"],
    vidrio: "#120709", liquido: "#5B0F25", opacidad: 0.75, capsula: "#3B0F1E", tono: "#C98A99", texto: "#6B1E32",
  },
];
const vinoPorId = (id) => VINOS.find((v) => v.id === id);

/* ---------------------------------------------------------
   2. LA BOTELLA
   Silueta bordelesa en un viewBox de 120 × 400. El líquido es un
   rectángulo recortado con la forma de la botella: su "y" sube a
   medida que se llena (nivel 0 = vacía, 1 = llena hasta el hombro).
   --------------------------------------------------------- */
const FORMA = "M50 10 H70 V108 C70 134 102 144 102 180 V378 Q102 392 88 392 H32 Q18 392 18 378 V180 C18 144 50 134 50 108 Z";
const FONDO = 392;
const HOMBRO = 140;
let idBotella = 0;

function yLiquido(nivel) {
  return FONDO - nivel * (FONDO - HOMBRO);
}

function botellaSVG(v, { nivel = 1, cristal = false } = {}) {
  const n = ++idBotella;
  const vidrio = cristal ? "rgba(251,244,241,0.1)" : v.vidrio;
  const borde = cristal ? 'stroke="rgba(231,180,190,0.6)" stroke-width="2"' : "";
  return `
  <svg viewBox="0 0 120 400" aria-hidden="true">
    <defs><clipPath id="forma-${n}"><path d="${FORMA}"/></clipPath></defs>
    <path d="${FORMA}" fill="${vidrio}" ${borde}/>
    <rect class="botella__liquido" clip-path="url(#forma-${n})" x="0" y="${yLiquido(nivel)}" width="120" height="400" fill="${v.liquido}" opacity="${cristal ? 0.9 : v.opacidad}"/>
    <rect class="botella__capsula" x="47.5" y="4" width="25" height="58" rx="3" fill="${v.capsula}"/>
    <rect class="botella__franja" x="47.5" y="54" width="25" height="4" fill="rgba(0,0,0,0.18)"/>
    <rect class="botella__etiqueta" x="24" y="206" width="72" height="122" rx="4"/>
    <rect x="28" y="210" width="64" height="114" rx="2" fill="none" stroke="${v.capsula}" stroke-width="1"/>
    <g transform="translate(51 218) scale(0.29)" color="#6B1E32"><use href="#sello" width="64" height="64"/></g>
    <text class="botella__marca" x="60" y="252" text-anchor="middle" textLength="58" lengthAdjust="spacingAndGlyphs">PIEDRA ALTA</text>
    <line x1="40" y1="260" x2="80" y2="260" stroke="${v.capsula}" stroke-width="1"/>
    <text class="botella__varietal" x="60" y="282" text-anchor="middle">${v.id === "rosado" ? "Rosado" : v.nombre.split(" ")[0]}</text>
    <text class="botella__anio" x="60" y="300" text-anchor="middle"${v.linea.length > 8 ? ' textLength="62" lengthAdjust="spacingAndGlyphs"' : ""}>${v.linea.toUpperCase()} · ${v.anio}</text>
    <text class="botella__anio" x="60" y="315" text-anchor="middle">CAFAYATE</text>
    <path class="botella__brillo" d="M27 196 V368"/>
  </svg>`;
}

/* ---------------------------------------------------------
   3. RELATO CON SCROLL
   El escenario queda fijo y todo depende de "p": cuánto se avanzó
   dentro de la sección (0 = arriba, 1 = abajo de todo).
   --------------------------------------------------------- */
const relato = $("#historia");
const relatoBotella = $("#relato-botella");
relatoBotella.innerHTML = botellaSVG(vinoPorId("malbec"), { nivel: 0, cristal: true });
const liquidoRelato = relatoBotella.querySelector(".botella__liquido");

// Colores del cielo (arriba / abajo) en distintos momentos del recorrido
const CIELO = [
  { p: 0.0, a: "#12040A", b: "#3B0F1E" },  // noche
  { p: 0.3, a: "#6B1E32", b: "#E7B4BE" },  // amanecer en el valle
  { p: 0.55, a: "#B9727F", b: "#F5DDE0" }, // día de cosecha
  { p: 0.82, a: "#2B1419", b: "#3B0F1E" }, // la bodega
  { p: 1.0, a: "#2B1419", b: "#3B0F1E" },
];

const limitar = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));
const tramo = (p, desde, hasta) => limitar((p - desde) / (hasta - desde)); // 0→1 entre dos puntos

function hexARgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mezclar(c1, c2, t) {
  const a = hexARgb(c1), b = hexARgb(c2);
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(",")})`;
}
function colorCielo(p, clave) {
  for (let i = 0; i < CIELO.length - 1; i++) {
    const k1 = CIELO[i], k2 = CIELO[i + 1];
    if (p <= k2.p) return mezclar(k1[clave], k2[clave], tramo(p, k1.p, k2.p));
  }
  return CIELO[CIELO.length - 1][clave];
}

function pintarRelato() {
  const r = relato.getBoundingClientRect();
  const recorrido = relato.offsetHeight - window.innerHeight;
  const p = limitar(-r.top / recorrido);
  const s = relato.style;

  s.setProperty("--cielo-a", colorCielo(p, "a"));
  s.setProperty("--cielo-b", colorCielo(p, "b"));
  s.setProperty("--estrellas", 1 - tramo(p, 0.05, 0.25));

  // Sol: sale entre 0,1 y 0,45 y se esconde al entrar a la bodega
  const subida = tramo(p, 0.1, 0.45);
  s.setProperty("--sol-y", `${70 - subida * 58}vh`);
  s.setProperty("--sol-o", tramo(p, 0.1, 0.22) * (1 - tramo(p, 0.66, 0.76)));

  // Cerros: suben en capas (los de atrás menos) y bajan cuando entramos a la bodega
  const suben = reducirMovimiento ? 1 : tramo(p, 0.04, 0.33);
  const bajan = reducirMovimiento ? 0 : tramo(p, 0.68, 0.84);
  [["--c3", 55], ["--c2", 75], ["--c1", 95], ["--c0", 110]].forEach(([prop, inicio]) => {
    s.setProperty(prop, `${(1 - suben) * inicio + bajan * 110}%`);
  });

  // La botella se llena durante la cosecha
  liquidoRelato.setAttribute("y", yLiquido(tramo(p, 0.38, 0.66)));

  s.setProperty("--barricas", tramo(p, 0.72, 0.9));
}

let pendiente = false;
function alScrollear() {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => {
    pintarRelato();
    pendiente = false;
  });
}
window.addEventListener("scroll", alScrollear, { passive: true });
window.addEventListener("resize", alScrollear);
pintarRelato();

/* ---------------------------------------------------------
   4. VINOS
   --------------------------------------------------------- */
const lista = $("#vinos-lista");
const botellaVinos = $("#vinos-botella");
const seccionVinos = $("#vinos");

lista.innerHTML = VINOS.map((v) => `
  <article class="vino" id="vino-${v.id}" data-id="${v.id}" style="--color-texto:${v.texto}">
    <div class="vino__cabecera">
      <div class="vino__mini">${botellaSVG(v)}</div>
      <div>
        <p class="vino__tipo">${v.tipo} · ${v.anio}</p>
        <h3 class="vino__nombre">${v.nombre}</h3>
      </div>
    </div>
    <p class="vino__desc">${v.desc}</p>
    <dl class="notas">
      ${Object.entries(v.notas).map(([k, t]) => `<div><dt>${k}</dt><dd>${t}</dd></div>`).join("")}
    </dl>
    <ul class="ficha">${v.ficha.map((f) => `<li>${f}</li>`).join("")}</ul>
    <div class="compra">
      <p class="compra__precio">${pesos(v.precio)}<small>la botella de 750 ml</small></p>
      <div class="cantidad" role="group" aria-label="Cantidad de ${v.nombre}">
        <button type="button" data-paso="-1" aria-label="Una botella menos">−</button>
        <output aria-live="polite">1</output>
        <button type="button" data-paso="1" aria-label="Una botella más">+</button>
      </div>
      <button class="btn btn--principal" type="button" data-agregar="${v.id}">Agregar al pedido</button>
    </div>
  </article>`).join("");

// Cantidad antes de agregar
lista.addEventListener("click", (e) => {
  const paso = e.target.closest("[data-paso]");
  if (paso) {
    const out = paso.parentElement.querySelector("output");
    out.textContent = limitar(Number(out.textContent) + Number(paso.dataset.paso), 1, 24);
    return;
  }
  const agregar = e.target.closest("[data-agregar]");
  if (agregar) {
    const out = agregar.closest(".compra").querySelector("output");
    agregarAlCarrito(agregar.dataset.agregar, Number(out.textContent));
    out.textContent = 1;
  }
});

// La botella grande cambia según el vino que está en el centro de la pantalla
let vinoActivo = null;
function mostrarVino(id) {
  if (id === vinoActivo) return;
  vinoActivo = id;
  const v = vinoPorId(id);
  botellaVinos.innerHTML = botellaSVG(v);
  if (!reducirMovimiento) botellaVinos.animate(
    [{ opacity: 0, transform: "translateY(16px) rotate(-2deg)" }, { opacity: 1, transform: "none" }],
    { duration: 450, easing: "ease-out" }
  );
  seccionVinos.style.setProperty("--tono", v.tono);
}
mostrarVino("torrontes");

const observadorVinos = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => { if (en.isIntersecting) mostrarVino(en.target.dataset.id); });
}, { rootMargin: "-45% 0px -45% 0px" });
lista.querySelectorAll(".vino").forEach((art) => observadorVinos.observe(art));

/* ---------------------------------------------------------
   5. CARRITO
   Se guarda en el navegador para no perderlo al recargar.
   --------------------------------------------------------- */
let carrito = {};
try { carrito = JSON.parse(localStorage.getItem("pa-carrito")) || {}; } catch (e) { carrito = {}; }
Object.keys(carrito).forEach((id) => { if (!vinoPorId(id)) delete carrito[id]; });

const panel = $("#carrito");
const fondo = $("#carrito-fondo");
const botonCarrito = $("#abrir-carrito");
const items = $("#carrito-items");
const form = $("#carrito-form");

const flotante = document.createElement("button");
flotante.type = "button";
flotante.className = "pedido-flotante";
document.body.append(flotante);

const unidades = () => Object.values(carrito).reduce((a, b) => a + b, 0);
const total = () => Object.entries(carrito).reduce((s, [id, c]) => s + vinoPorId(id).precio * c, 0);

function guardar() {
  try { localStorage.setItem("pa-carrito", JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
}

function pintarCarrito() {
  const u = unidades();
  const num = $("#carrito-num");
  num.textContent = u;
  num.hidden = u === 0;
  botonCarrito.setAttribute("aria-label", u ? `Abrir carrito, ${u} ${u === 1 ? "botella" : "botellas"}` : "Abrir carrito, vacío");

  items.innerHTML = Object.entries(carrito).map(([id, c]) => {
    const v = vinoPorId(id);
    return `
    <li class="item">
      <div class="item__botella">${botellaSVG(v)}</div>
      <div>
        <p class="item__nombre">${v.nombre} ${v.anio}</p>
        <p class="item__precio">${c} × ${pesos(v.precio)} = <strong>${pesos(c * v.precio)}</strong></p>
      </div>
      <div class="cantidad" role="group" aria-label="Cantidad de ${v.nombre}">
        <button type="button" data-cambiar="${id}" data-paso="-1" aria-label="Una botella menos">−</button>
        <output>${c}</output>
        <button type="button" data-cambiar="${id}" data-paso="1" aria-label="Una botella más">+</button>
      </div>
    </li>`;
  }).join("");

  const vacio = u === 0;
  $("#carrito-vacio").hidden = !vacio;
  form.hidden = vacio;
  $("#carrito-pie").hidden = vacio;
  $("#carrito-total").textContent = pesos(total());

  flotante.innerHTML = `Ver pedido <span>${u} · ${pesos(total())}</span>`;
  flotante.classList.toggle("visible", !vacio && !panel.classList.contains("abierto"));
}

function agregarAlCarrito(id, cantidad = 1) {
  carrito[id] = limitar((carrito[id] || 0) + cantidad, 0, 48);
  guardar();
  pintarCarrito();
  const v = vinoPorId(id);
  avisar(`Agregaste ${cantidad} ${v.nombre} al pedido`);
  botonCarrito.classList.remove("salta");
  void botonCarrito.offsetWidth;
  botonCarrito.classList.add("salta");
}

items.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cambiar]");
  if (!b) return;
  const id = b.dataset.cambiar;
  carrito[id] = (carrito[id] || 0) + Number(b.dataset.paso);
  if (carrito[id] <= 0) delete carrito[id];
  guardar();
  pintarCarrito();
});

let antesDeAbrir = null;
function abrirCarrito() {
  antesDeAbrir = document.activeElement;
  fondo.hidden = false;
  requestAnimationFrame(() => fondo.classList.add("visible"));
  panel.classList.add("abierto");
  panel.removeAttribute("inert");
  panel.setAttribute("aria-hidden", "false");
  flotante.classList.remove("visible");
  $("#cerrar-carrito").focus();
}
function cerrarCarrito() {
  fondo.classList.remove("visible");
  panel.classList.remove("abierto");
  panel.setAttribute("inert", "");
  panel.setAttribute("aria-hidden", "true");
  setTimeout(() => { fondo.hidden = true; }, 300);
  pintarCarrito();
  if (antesDeAbrir) antesDeAbrir.focus();
}
botonCarrito.addEventListener("click", abrirCarrito);
flotante.addEventListener("click", abrirCarrito);
$("#cerrar-carrito").addEventListener("click", cerrarCarrito);
fondo.addEventListener("click", cerrarCarrito);
$("#carrito-ver-vinos").addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("abierto")) cerrarCarrito(); });

// Envío o retiro: la dirección solo se pide para envío
function actualizarEntrega() {
  const envio = form.entrega.value === "envio";
  $("#campo-direccion").hidden = !envio;
  $("#carrito-envio").textContent = envio
    ? "Envío sin cargo en Cafayate. Al resto del país se coordina por WhatsApp."
    : "Lo retirás en la bodega, de martes a domingo de 10 a 18 h.";
}
form.addEventListener("change", actualizarEntrega);
actualizarEntrega();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const error = $("#pedido-error");
  const nombre = $("#pedido-nombre").value.trim();
  const envio = form.entrega.value === "envio";
  const direccion = $("#pedido-direccion").value.trim();

  if (!nombre) return mostrarError(error, "Escribí tu nombre para el pedido.", $("#pedido-nombre"));
  if (envio && !direccion) return mostrarError(error, "Falta la dirección de entrega.", $("#pedido-direccion"));
  error.hidden = true;

  const lineas = Object.entries(carrito).map(([id, c]) => {
    const v = vinoPorId(id);
    return `• ${c} × ${v.nombre} ${v.anio}: ${pesos(c * v.precio)}`;
  });
  const mensaje = [
    "Hola Piedra Alta, quiero hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: ${pesos(total())}`,
    "",
    `Nombre: ${nombre}`,
    envio ? `Entrega: envío a ${direccion}` : "Entrega: retiro en la bodega",
    `Pago: ${form.pago.value}`,
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
});

function mostrarError(el, texto, campo) {
  el.textContent = texto;
  el.hidden = false;
  campo.focus();
}

let timerAviso;
function avisar(texto) {
  const a = $("#aviso");
  a.textContent = texto;
  a.classList.add("visible");
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => a.classList.remove("visible"), 2200);
}

pintarCarrito();

/* ---------------------------------------------------------
   6. MARIDAJE
   --------------------------------------------------------- */
const ICONO = {
  asado: '<path d="M4 12h16M6 12l1.5 6h9L18 12M9 9c0-2 2-2 2-4M13 9c0-2 2-2 2-4M8 21h8"/>',
  empanadas: '<path d="M3 15a9 9 0 0 1 18 0Z"/><path d="M5.5 15l1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5"/>',
  pastas: '<path d="M3 11h18a9 9 0 0 1-18 0ZM8 11c0-3 2-6 2-8M12 11c0-3 1-5 3-7M15 11c1-2 3-3 5-3"/>',
  pescado: '<path d="M3 12c3-5 10-6 14-2l4-3v10l-4-3c-4 4-11 3-14-2Z"/><circle cx="8" cy="11" r="1"/>',
  quesos: '<path d="M3 17l10-10 8 4v6Z M3 17h18"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="13" r="1"/>',
  postre: '<path d="M5 11h14v9H5Z M5 15h14 M12 11V6 M10 6h4 M12 3v1"/>',
  cena: '<path d="M10 3c-1 2 1 3 0 5M14 3c-1 2 1 3 0 5M8 10h8l-1 11H9Z"/>',
  juntada: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-4 3-6 6-6s6 2 6 6M12 20c0-4 2-6 4-6s6 2 6 6"/>',
  regalo: '<path d="M3 9h18v4H3ZM5 13h14v8H5ZM12 9v12M12 9c-2-4-7-4-6-1 1 2 4 1 6 1Zm0 0c2-4 7-4 6-1-1 2-4 1-6 1Z"/>',
};
const icono = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONO[k]}</svg>`;

const PLATOS = {
  asado: { nombre: "Asado", desc: "Carnes a la parrilla", vino: "malbec",
    porque: "El Malbec tiene taninos suaves y fruta madura: acompaña la grasa del asado sin taparle el sabor." },
  empanadas: { nombre: "Empanadas", desc: "Salteñas, de carne cortada a cuchillo", vino: "torrontes",
    porque: "Empanadas salteñas y Torrontés de Cafayate: el clásico del Norte. Su frescura corta el comino y el ají." },
  pastas: { nombre: "Pastas", desc: "Con salsa roja o bolognesa", vino: "malbec",
    porque: "La acidez del Malbec de altura acompaña el tomate, y su fruta suma sin pelearse con la salsa." },
  pescado: { nombre: "Pescado", desc: "Trucha, salmón o mariscos", vino: "torrontes",
    porque: "Aromático y fresco: no tapa el sabor delicado del pescado. Va muy bien con trucha a la manteca." },
  quesos: { nombre: "Quesos", desc: "Picada, quesos frescos o de cabra", vino: "rosado",
    porque: "Con quesos frescos y de cabra de los Valles, el Rosado aporta fruta roja y frescura." },
  postre: { nombre: "Postre", desc: "Chocolate amargo o frutos rojos", vino: "tannat",
    porque: "El chocolate amargo pide un vino intenso: el Tannat tiene cuerpo y notas de cacao." },
};
const OCASIONES = {
  cena: { nombre: "Cena tranquila" },
  juntada: { nombre: "Juntada" },
  regalo: { nombre: "Para regalar" },
};

const eleccion = { plato: null, ocasion: null };

function pintarOpciones(cont, datos, clave) {
  cont.innerHTML = Object.entries(datos).map(([k, d]) => `
    <button type="button" class="opcion" data-${clave}="${k}" aria-pressed="false">
      ${icono(k)}
      <span><strong>${d.nombre}</strong>${d.desc ? `<br><small>${d.desc}</small>` : ""}</span>
    </button>`).join("");
  cont.addEventListener("click", (e) => {
    const b = e.target.closest(".opcion");
    if (!b) return;
    eleccion[clave] = b.dataset[clave];
    cont.querySelectorAll(".opcion").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    recomendar();
  });
}
pintarOpciones($("#opciones-plato"), PLATOS, "plato");
pintarOpciones($("#opciones-ocasion"), OCASIONES, "ocasion");

function recomendar() {
  const caja = $("#maridaje-resultado");
  if (!eleccion.plato || !eleccion.ocasion) return;

  const plato = PLATOS[eleccion.plato];
  let vinoId = plato.vino;
  let porque = plato.porque;
  let cantidad = 1;
  let tip;

  if (eleccion.ocasion === "regalo") {
    if (["asado", "pastas", "quesos"].includes(eleccion.plato)) {
      vinoId = "tannat";
      porque = "Para regalar, subí un escalón: el Tannat Gran Reserva tiene 18 meses de barrica y acompaña muy bien carnes, pastas y quesos estacionados.";
    }
    tip = "Para regalo lo entregamos en estuche de madera, sin costo. Avisalo en el pedido.";
  } else if (eleccion.ocasion === "juntada") {
    cantidad = 2;
    tip = "Calculá una botella cada 3 personas. Para 6, llevá 2: ya te las dejamos listas para agregar.";
  } else {
    const v = vinoPorId(vinoId);
    tip = v.id === "torrontes" || v.id === "rosado"
      ? "Sacalo de la heladera 10 minutos antes de servir."
      : "Abrilo 20 minutos antes y servilo a " + v.ficha[2].replace("Servir a ", "") + ".";
  }

  const v = vinoPorId(vinoId);
  caja.innerHTML = `
    <div class="resultado">
      <div class="resultado__botella">${botellaSVG(v)}</div>
      <div>
        <p class="resultado__eyebrow">${plato.nombre} · ${OCASIONES[eleccion.ocasion].nombre}</p>
        <h3 class="resultado__nombre">${v.nombre} ${v.anio}</h3>
        <p class="resultado__porque">${porque}</p>
        <p class="resultado__tip">${tip}</p>
        <div class="resultado__compra">
          <p class="resultado__precio">${pesos(v.precio)}</p>
          <button class="btn btn--principal" type="button" id="agregar-maridaje">Agregar ${cantidad > 1 ? cantidad + " botellas" : "al pedido"}</button>
        </div>
      </div>
    </div>`;
  $("#agregar-maridaje").addEventListener("click", () => agregarAlCarrito(v.id, cantidad));
}

/* ---------------------------------------------------------
   7. RESERVA DE VISITAS
   --------------------------------------------------------- */
const formReserva = $("#form-reserva");
const inputFecha = $("#reserva-fecha");
const hoy = new Date();
inputFecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function experienciaElegida() {
  return document.querySelector('input[name="experiencia"]:checked');
}
function totalReserva() {
  const exp = experienciaElegida();
  const personas = Number($("#reserva-personas").value);
  $("#reserva-total").textContent = pesos(Number(exp.dataset.precio) * personas);
}
document.querySelectorAll('input[name="experiencia"]').forEach((r) => r.addEventListener("change", totalReserva));
$("#reserva-personas").addEventListener("change", totalReserva);
totalReserva();

formReserva.addEventListener("submit", (e) => {
  e.preventDefault();
  const error = $("#reserva-error");
  const nombre = $("#reserva-nombre").value.trim();
  if (!nombre) return mostrarError(error, "Escribí tu nombre para la reserva.", $("#reserva-nombre"));
  if (!inputFecha.value) return mostrarError(error, "Elegí una fecha.", inputFecha);
  if (inputFecha.value < inputFecha.min) return mostrarError(error, "Elegí una fecha de hoy en adelante.", inputFecha);
  const dia = new Date(inputFecha.value + "T12:00:00");
  if (dia.getDay() === 1) return mostrarError(error, "Los lunes la bodega está cerrada. Elegí otro día.", inputFecha);
  error.hidden = true;

  const exp = experienciaElegida();
  const personas = Number($("#reserva-personas").value);
  const fecha = `${dia.toLocaleDateString("es-AR", { weekday: "long" })} ${dia.getDate()}/${dia.getMonth() + 1}`;
  const mensaje = `Hola Piedra Alta, soy ${nombre}. Quiero reservar la ${exp.value} para ${personas} ${personas === 1 ? "persona" : "personas"} el ${fecha}. Total estimado: ${pesos(Number(exp.dataset.precio) * personas)}.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
});

/* ---------------------------------------------------------
   8. AVISO DE EDAD
   --------------------------------------------------------- */
const dialogoEdad = $("#edad");
let mayor = false;
try { mayor = localStorage.getItem("pa-mayor") === "si"; } catch (e) { /* sin almacenamiento */ }

if (!mayor && typeof dialogoEdad.showModal === "function") {
  dialogoEdad.showModal();
  dialogoEdad.addEventListener("cancel", (e) => e.preventDefault()); // no se cierra con Escape
}
$("#edad-si").addEventListener("click", () => {
  try { localStorage.setItem("pa-mayor", "si"); } catch (e) { /* sin almacenamiento */ }
  dialogoEdad.close();
});
$("#edad-no").addEventListener("click", () => { $("#edad-mensaje").hidden = false; });
