/* =============================================================
   Trung Nguyen — Portfolio motion engine
   - Particle canvas (toned down)
   - Theme toggle (live re-tint)
   - IntersectionObserver reveal
   - Scroll-progress rail
   - Magnetic hover (vanilla, transform-only)
   - Spotlight border tracking for project cards
   - Scramble-text on data-scramble elements
   - View Transitions API page transitions
   ============================================================= */

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------
  // Particle canvas
  // ---------------------------------------------------------
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function cssVarRGB(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (v.startsWith('#')) {
      let h = v.slice(1);
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
    }
    const m = v.match(/\d+/g);
    return m ? m.slice(0, 3).join(',') : fallback;
  }
  let accentRGB = cssVarRGB('--accent', '46,138,101');
  let textRGB = cssVarRGB('--text-primary', '237,235,230');

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.6 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.12;
      this.vy = (Math.random() - 0.5) * 0.12;
      this.opacity = Math.random() * 0.3 + 0.08;
      this.phase = Math.random() * Math.PI * 2;
      this.ps = Math.random() * 0.005 + 0.0015;
      this.type = Math.random();
    }
    update() {
      this.phase += this.ps;
      this.x += this.vx + Math.sin(this.phase) * 0.02;
      this.y += this.vy + Math.cos(this.phase * 0.7) * 0.02;
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw() {
      const b = 0.5 + Math.sin(this.phase) * 0.5;
      const o = this.opacity * (0.3 + b * 0.7);
      const s = this.size * (0.85 + b * 0.15);
      ctx.fillStyle = this.type > 0.55
        ? `rgba(${accentRGB},${o})`
        : `rgba(${textRGB},${o * 0.6})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const PARTICLE_COUNT = prefersReducedMotion ? 0 : 40;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Sparse connection lines via spatial grid
  const GRID = 160;
  let grid = {};
  function buildGrid() {
    grid = {};
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const k = `${Math.floor(p.x / GRID)},${Math.floor(p.y / GRID)}`;
      (grid[k] = grid[k] || []).push(i);
    }
  }
  function drawLines() {
    buildGrid();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const gx = Math.floor(p.x / GRID), gy = Math.floor(p.y / GRID);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cell = grid[`${gx + dx},${gy + dy}`];
          if (!cell) continue;
          for (const j of cell) {
            if (j <= i) continue;
            const q = particles[j];
            const ddx = p.x - q.x, ddy = p.y - q.y;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < 18000) {
              const o = (1 - Math.sqrt(d2) / 135) * 0.045;
              ctx.strokeStyle = `rgba(${accentRGB},${o})`;
              ctx.lineWidth = 0.4;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!prefersReducedMotion) {
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
    }
    requestAnimationFrame(animate);
  }
  if (ctx) animate();

  // ---------------------------------------------------------
  // Theme toggle
  // ---------------------------------------------------------
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      window.dispatchEvent(new Event('themeChange'));
    });
  }
  window.addEventListener('themeChange', () => {
    accentRGB = cssVarRGB('--accent', '46,138,101');
    textRGB = cssVarRGB('--text-primary', '237,235,230');
  });

  // ---------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || (i * 60);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // ---------------------------------------------------------
  // Scroll-progress rail
  // ---------------------------------------------------------
  const rail = document.querySelector('.scroll-rail-fill');
  if (rail && !prefersReducedMotion) {
    let ticking = false;
    const updateRail = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      rail.style.transform = `scaleY(${ratio})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateRail); ticking = true; }
    }, { passive: true });
    updateRail();
  }

  // ---------------------------------------------------------
  // Magnetic hover — vanilla, transform only, RAF-throttled
  // ---------------------------------------------------------
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.25;
      let rafId = null;
      let tx = 0, ty = 0;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        tx = (e.clientX - cx) * strength;
        ty = (e.clientY - cy) * strength;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            rafId = null;
          });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform = 'translate3d(0,0,0)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
      el.addEventListener('mouseenter', () => { el.style.transition = ''; });
    });
  }

  // ---------------------------------------------------------
  // Spotlight border tracking — sets --spot-x / --spot-y on .proj-card
  // ---------------------------------------------------------
  if (!prefersReducedMotion) {
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
      });
    });
  }

  // ---------------------------------------------------------
  // Scramble text on data-scramble — runs once on element enter
  // ---------------------------------------------------------
  const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#________';
  function scramble(el, finalText, duration = 900) {
    if (prefersReducedMotion) { el.textContent = finalText; return; }
    const length = finalText.length;
    const queue = [];
    for (let i = 0; i < length; i++) {
      const from = el.textContent[i] || '';
      const to = finalText[i];
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30) + 10;
      queue.push({ from, to, start, end, char: null });
    }
    let frame = 0;
    const step = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (frame >= q.end) {
          complete++;
          output += q.to;
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          output += `<span class="scramble-tmp">${q.char}</span>`;
        } else {
          output += q.from;
        }
      }
      el.innerHTML = output;
      if (complete < queue.length) {
        frame++;
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    };
    step();
  }
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const final = el.dataset.scramble || el.textContent;
    el.textContent = '';
    setTimeout(() => scramble(el, final), parseInt(el.dataset.scrambleDelay || '300'));
  });

  // ---------------------------------------------------------
  // View Transitions — same-origin internal nav
  // ---------------------------------------------------------
  if (document.startViewTransition && !prefersReducedMotion) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      // Internal HTML links only, no modifiers, no target, no hash-only
      if (
        href.startsWith('#') ||
        a.target === '_blank' ||
        a.hasAttribute('download') ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      if (!url.pathname.endsWith('.html') && url.pathname !== '/' && !url.pathname.endsWith('/')) return;

      e.preventDefault();
      document.startViewTransition(() => {
        location.href = url.href;
      });
    });
  }

  // ---------------------------------------------------------
  // Tiny utility: copy email on click for [data-copy]
  // ---------------------------------------------------------
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async (e) => {
      const value = el.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const original = el.dataset.copyOriginal || el.textContent;
        el.dataset.copyOriginal = original;
        el.textContent = 'copied';
        setTimeout(() => { el.textContent = original; }, 1400);
      } catch (_) { /* ignore */ }
    });
  });
})();
