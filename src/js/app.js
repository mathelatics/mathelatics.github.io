/* app.js — quantum entanglement particle field + portfolio interactions */
(function () {
  'use strict';

  /* ---------- Quantum particle canvas ---------- */
  const canvas = document.getElementById('quantum-canvas');
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const COLORS = ['#7c5cff', '#22d3ee', '#ff5c8a', '#34d399', '#fbbf24'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(110, Math.floor((W * H) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.7,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2 // "quantum" flicker phase
    }));
  }

  function step(t) {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // gentle attraction to cursor — observer effect 🛰️
      const dxm = mouse.x - p.x, dym = mouse.y - p.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 160 && dm > 0.001) {
        p.x += (dxm / dm) * 0.22;
        p.y += (dym / dm) * 0.22;
      }

      const glow = 0.55 + 0.45 * Math.sin(t * 0.0016 + p.phase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.35 + 0.5 * glow;
      ctx.fill();
    }

    // entanglement links
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.c === b.c ? a.c : '#5b6ea8';
          ctx.globalAlpha = (1 - d / 120) * 0.16;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  function initCanvas() {
    resize();
    makeParticles();
    if (!prefersReduced) requestAnimationFrame(step);
    else { // static frame
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = p.c; ctx.globalAlpha = .5; ctx.fill(); }
    }
  }

  window.addEventListener('resize', () => { resize(); makeParticles(); });
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
  initCanvas();

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Active nav highlighting ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks.map(l => document.getElementById(l.getAttribute('href').slice(1))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('nav-toggle');
  const linksBox = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = linksBox.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  linksBox.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) { linksBox.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Count-up hero stats ---------- */
  const statEls = document.querySelectorAll('.stat-value');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, raw = el.dataset.count;
      const m = raw.match(/^([\d.]+)(.*)$/);
      if (m && !prefersReduced) {
        const target = parseFloat(m[1]), suffix = m[2] || '';
        const dur = 1100, t0 = performance.now();
        (function tick(now) {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
          el.textContent = val + suffix;
          if (k < 1) requestAnimationFrame(tick); else el.textContent = raw;
        })(t0);
      }
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => cio.observe(el));
})();
