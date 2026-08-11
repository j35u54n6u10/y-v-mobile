/* ==========================================================================
   Y&V MOBILE — script.js
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURACIÓN — WHATSAPP
   Sustituye WHATSAPP_NUMBER por el número real en formato internacional
   sin signos ni espacios. Ejemplo: 584121234567
   -------------------------------------------------------------------------- */
const WHATSAPP_NUMBER = 'WHATSAPP_NUMBER'; // <-- PLACEHOLDER, reemplazar al publicar

const MENSAJE_GENERAL =
  'Hola, Y&V Mobile. Vi sus diseños en la página y quisiera consultar los forros disponibles para mi teléfono.';

function mensajeProducto(nombre){
  return `Hola, Y&V Mobile. Me interesa el diseño ${nombre}. ¿Está disponible para mi modelo de teléfono?`;
}

function abrirWhatsApp(mensaje){
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noopener');
}

/* Delegación de eventos: cualquier botón/enlace con [data-wa] abre WhatsApp.
   Si trae data-product="Nombre del diseño" se arma el mensaje específico,
   si no, se usa el mensaje general. */
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-wa]');
  if(!trigger) return;
  e.preventDefault();
  const producto = trigger.getAttribute('data-product');
  abrirWhatsApp(producto ? mensajeProducto(producto) : MENSAJE_GENERAL);
});

/* --------------------------------------------------------------------------
   2. HEADER — sticky con transición transparente -> sólido
   -------------------------------------------------------------------------- */
const header = document.querySelector('.header');
const toggleHeaderState = () => {
  if(window.scrollY > 40){ header.classList.add('is-solid'); }
  else{ header.classList.remove('is-solid'); }
};
toggleHeaderState();
window.addEventListener('scroll', toggleHeaderState, { passive:true });

/* --------------------------------------------------------------------------
   3. MENÚ MÓVIL
   -------------------------------------------------------------------------- */
const hamburger = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav-mobile');

function closeMobileNav(){
  hamburger.classList.remove('is-open');
  navMobile.classList.remove('is-open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  navMobile.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navMobile?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL — fade-up con IntersectionObserver
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* --------------------------------------------------------------------------
   5. PARALELAJE SUTIL EN EL HERO (desktop únicamente, respeta reduced-motion)
   -------------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const phoneStage = document.querySelector('.phone-stage');

if(phoneStage && !prefersReducedMotion && window.innerWidth > 880){
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if(y < window.innerHeight){
      phoneStage.style.transform = `translateY(${y * 0.12}px)`;
    }
  }, { passive:true });
}

/* --------------------------------------------------------------------------
   6. CATÁLOGO VISUAL — se genera desde datos para mantener el HTML limpio
   Cada item necesita una imagen en /assets/images/productos/<id>.jpg
   -------------------------------------------------------------------------- */
const CATALOGO = [
  { id:'soccer-legend-sketch',   nombre:'Soccer Legend Sketch',  desc:'Ilustración a mano alzada de una leyenda del fútbol.' },
  { id:'dollar-rich-bling',      nombre:'Dollar Rich Bling',      desc:'Actitud statement con estampado de billetes.' },
  { id:'cream-hearts-cute',      nombre:'Cream Hearts Cute',      desc:'Corazones sobre base crema, dulce y minimal.' },
  { id:'solid-cyan-clean',       nombre:'Solid Cyan Clean',       desc:'Color sólido, líneas limpias, mínima expresión.' },
  { id:'cream-hearts-romantic',  nombre:'Cream Hearts Romantic',  desc:'Una versión romántica del clásico corazón.' },
  { id:'red-boarding-pass',      nombre:'Red Boarding Pass',      desc:'Inspirado en tickets de embarque, para quien siempre va en movimiento.' },
  { id:'silver-tactics-soccer',  nombre:'Silver Tactics Soccer',  desc:'Pizarra táctica en plata, para los que juegan a ganar.' },
  { id:'matte-tactics-soccer',   nombre:'Matte Tactics Soccer',   desc:'La misma actitud táctica, en acabado mate.' },
  { id:'dino-offline-humor',     nombre:'Dino Offline Humor',     desc:'Humor gráfico con un dinosaurio "desconectado".' },
];

const catalogGrid = document.querySelector('.catalog-grid');

if(catalogGrid){
  const frag = document.createDocumentFragment();

  CATALOGO.forEach(item => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-reveal', '');

    card.innerHTML = `
      <div class="pc-media">
        <span class="pc-code">${item.id}</span>
        <img src="assets/images/productos/${item.id}.jpg" alt="Forro para teléfono, diseño ${item.nombre}" loading="lazy">
      </div>
      <div class="pc-body">
        <h3>${item.nombre}</h3>
        <p>${item.desc}</p>
        <button class="btn btn-outline-dark btn-sm" data-wa data-product="${item.nombre}">
          Consultar por WhatsApp
        </button>
      </div>
    `;
    frag.appendChild(card);
  });

  catalogGrid.appendChild(frag);

  /* Observar las tarjetas recién creadas para el efecto fade-up */
  catalogGrid.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   7. AÑO AUTOMÁTICO EN EL FOOTER
   -------------------------------------------------------------------------- */
const yearEl = document.querySelector('[data-year]');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
