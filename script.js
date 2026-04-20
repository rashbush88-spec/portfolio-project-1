/* ═══════════════════════════════════════════════════════════════
   script.js — Portfolio interactions
   Abdul-Rashid Bushran
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Dark / Light mode ──────────────────────────────────────── */
const html         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('arb-theme', theme);
}

(function initTheme() {
  const saved      = localStorage.getItem('arb-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
});


/* ── Custom cursor (pointer devices only) ───────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot   = document.getElementById('cursor');
  const ring  = document.getElementById('cursorTrail');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Smooth ring follows with lerp */
  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.45';
  });
}


/* ── Magnetic buttons ───────────────────────────────────────── */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});


/* ── Nav: scroll state ──────────────────────────────────────── */
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 36);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


/* ── Nav: active section highlight ─────────────────────────── */
const sections  = Array.from(document.querySelectorAll('section[id]'));
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActive() {
  const y = window.scrollY + 110;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < bottom);
  });
}
window.addEventListener('scroll', updateActive, { passive: true });


/* ── Mobile menu ────────────────────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(force) {
  const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
}

menuBtn.addEventListener('click', () => toggleMenu());

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu(false);
    menuBtn.focus();
  }
});


/* ── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('on'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

/* Stagger siblings within the same parent */
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const idx = siblings.indexOf(el);
  if (idx > 0) el.dataset.delay = idx * 75;
  revealObserver.observe(el);
});


/* ── Contact form validation & submission ───────────────────── */
const contactForm = document.getElementById('contactForm');
const formOk      = document.getElementById('formOk');
const submitBtn   = document.getElementById('submitBtn');

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function showErr(input, msg) {
  const g = input.closest('.fgroup');
  g.querySelector('.ferr').textContent = msg;
  input.classList.add('error');
}

function clearErr(input) {
  const g = input.closest('.fgroup');
  g.querySelector('.ferr').textContent = '';
  input.classList.remove('error');
}

function validateField(f) {
  clearErr(f);
  if (f.required && !f.value.trim()) {
    showErr(f, 'This field is required.');
    return false;
  }
  if (f.type === 'email' && f.value && !isValidEmail(f.value)) {
    showErr(f, 'Please enter a valid email address.');
    return false;
  }
  return true;
}

/* Live inline validation */
contactForm.querySelectorAll('input, textarea').forEach(f => {
  f.addEventListener('blur',  () => validateField(f));
  f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(f); });
});

function validateAll() {
  return Array.from(contactForm.querySelectorAll('input, textarea'))
    .map(validateField)
    .every(Boolean);
}

/*
  handleFormSubmit:
  ─────────────────────────────────────────────────────────────
  If the form action is still "#" (default), we fall back to
  mailto so the site works with zero server config.

  To use Formspree: set action="https://formspree.io/f/YOUR_ID"
  To use Web3Forms: set action="https://api.web3forms.com/submit"
    and add <input type="hidden" name="access_key" value="KEY">
  ─────────────────────────────────────────────────────────────
*/
async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateAll()) return;

  const origHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const data   = new FormData(contactForm);
  const action = contactForm.getAttribute('action');

  /* Fall back to mailto if action is unset or still has the placeholder ID */
  if (!action || action === '#' || action.includes('YOUR_FORM_ID')) {
    const name    = data.get('name');
    const email   = data.get('email');
    const message = data.get('message');
    const subj    = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body    = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:rashbush88@gmail.com?subject=${subj}&body=${body}`;
    submitBtn.disabled = false;
    submitBtn.innerHTML = origHTML;
    return;
  }

  try {
    const res = await fetch(action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      contactForm.reset();
      formOk.hidden = false;
      formOk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { formOk.hidden = true; }, 6000);
    } else {
      throw new Error('non-ok');
    }
  } catch {
    /* Network failure — fall back to mailto */
    const name    = data.get('name');
    const email   = data.get('email');
    const message = data.get('message');
    const subj    = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body    = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:rashbush88@gmail.com?subject=${subj}&body=${body}`;
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = origHTML;
}

contactForm.addEventListener('submit', handleFormSubmit);


/* ── Hero particle network ──────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;
  const DIST  = 145;
  const RGB   = '212,168,83';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:  Math.random() * (W || window.innerWidth),
      y:  Math.random() * (H || window.innerHeight),
      vx: (Math.random() - .5) * .5,
      vy: (Math.random() - .5) * .5,
      r:  Math.random() * 1.6 + .7
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < DIST) {
          ctx.strokeStyle = `rgba(${RGB},${(1 - d / DIST) * .22})`;
          ctx.lineWidth = .6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      const p = particles[i];
      ctx.fillStyle = `rgba(${RGB},.42)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── Footer year ────────────────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();
