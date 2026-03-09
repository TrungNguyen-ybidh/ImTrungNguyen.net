// ===== CONSTELLATION PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== STARS (main particles) =====
class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.12;
    this.vy = (Math.random() - 0.5) * 0.12;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.ps = Math.random() * 0.005 + 0.001;
    this.type = Math.random();
    this.twinkleSpeed = Math.random() * 0.03 + 0.01;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += this.ps;
    this.twinklePhase += this.twinkleSpeed;
    this.x += this.vx + Math.sin(this.phase) * 0.02;
    this.y += this.vy + Math.cos(this.phase * 0.7) * 0.02;
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;
  }
  draw() {
    const twinkle = 0.5 + Math.sin(this.twinklePhase) * 0.5;
    const o = this.opacity * (0.3 + twinkle * 0.7);
    const s = this.size * (0.8 + twinkle * 0.2);

    if (this.type > 0.75) {
      // Bright green accent stars
      ctx.fillStyle = `rgba(201,240,107,${o})`;
      // Cross sparkle for bright stars
      if (this.size > 1.5) {
        ctx.strokeStyle = `rgba(201,240,107,${o * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - s * 2.5, this.y);
        ctx.lineTo(this.x + s * 2.5, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - s * 2.5);
        ctx.lineTo(this.x, this.y + s * 2.5);
        ctx.stroke();
      }
    } else if (this.type > 0.55) {
      ctx.fillStyle = `rgba(120,200,255,${o * 0.6})`;
    } else if (this.type > 0.35) {
      ctx.fillStyle = `rgba(255,220,150,${o * 0.4})`;
    } else {
      ctx.fillStyle = `rgba(232,230,225,${o * 0.45})`;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== FIXED CONSTELLATION STARS (don't move, form patterns) =====
class ConstellationStar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.5 + 0.8;
    this.opacity = Math.random() * 0.35 + 0.15;
    this.phase = Math.random() * Math.PI * 2;
    this.ps = Math.random() * 0.015 + 0.005;
  }
  update() {
    this.phase += this.ps;
  }
  draw() {
    const twinkle = 0.6 + Math.sin(this.phase) * 0.4;
    const o = this.opacity * twinkle;
    const s = this.size * (0.9 + twinkle * 0.1);
    ctx.fillStyle = `rgba(201,240,107,${o})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== SHOOTING STARS =====
class ShootingStar {
  constructor() {
    this.x = Math.random() * canvas.width * 1.5;
    this.y = -10;
    this.len = Math.random() * 90 + 50;
    this.spd = Math.random() * 4 + 3;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.life = 1;
    this.decay = Math.random() * 0.006 + 0.003;
    this.w = Math.random() * 1.2 + 0.3;
    this.active = true;
  }
  update() {
    this.x += Math.cos(this.angle) * this.spd;
    this.y += Math.sin(this.angle) * this.spd;
    this.life -= this.decay;
    if (this.life <= 0 || this.y > canvas.height + 20) this.active = false;
  }
  draw() {
    const tx = this.x - Math.cos(this.angle) * this.len;
    const ty = this.y - Math.sin(this.angle) * this.len;
    const o = this.opacity * this.life;
    const g = ctx.createLinearGradient(tx, ty, this.x, this.y);
    g.addColorStop(0, `rgba(201,240,107,0)`);
    g.addColorStop(0.6, `rgba(201,240,107,${o * 0.3})`);
    g.addColorStop(1, `rgba(255,255,255,${o})`);
    ctx.strokeStyle = g;
    ctx.lineWidth = this.w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${o})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== DUST =====
class Dust {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 0.6 + 0.15;
    this.vy = -(Math.random() * 0.1 + 0.03);
    this.vx = (Math.random() - 0.5) * 0.06;
    this.opacity = Math.random() * 0.18 + 0.04;
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += 0.008;
    this.y += this.vy;
    this.x += this.vx + Math.sin(this.phase) * 0.06;
    if (this.y < -10) { this.y = canvas.height + 10; this.x = Math.random() * canvas.width; }
  }
  draw() {
    const o = this.opacity * (0.5 + Math.sin(this.phase) * 0.5);
    ctx.fillStyle = `rgba(201,240,107,${o})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== GENERATE CONSTELLATIONS =====
function generateConstellations() {
  const constellations = [];
  const count = 5 + Math.floor(Math.random() * 3); // 5-7 constellations

  for (let c = 0; c < count; c++) {
    const cx = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const cy = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
    const starCount = 4 + Math.floor(Math.random() * 4); // 4-7 stars per constellation
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      const x = cx + (Math.random() - 0.5) * 140;
      const y = cy + (Math.random() - 0.5) * 120;
      stars.push(new ConstellationStar(x, y));
    }

    // Create edges (connections) — connect sequentially + a couple randoms
    const edges = [];
    for (let i = 0; i < stars.length - 1; i++) {
      edges.push([i, i + 1]);
    }
    // Add 1-2 random cross-connections
    if (stars.length > 3) {
      const a = Math.floor(Math.random() * stars.length);
      let b = Math.floor(Math.random() * stars.length);
      while (b === a) b = Math.floor(Math.random() * stars.length);
      edges.push([a, b]);
    }

    constellations.push({ stars, edges });
  }
  return constellations;
}

let constellations = generateConstellations();
window.addEventListener('resize', () => { constellations = generateConstellations(); });

function drawConstellations() {
  for (const c of constellations) {
    // Draw edges
    for (const [i, j] of c.edges) {
      const a = c.stars[i], b = c.stars[j];
      const avgO = (a.opacity * (0.6 + Math.sin(a.phase) * 0.4) + b.opacity * (0.6 + Math.sin(b.phase) * 0.4)) / 2;
      ctx.strokeStyle = `rgba(201,240,107,${avgO * 0.12})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Draw stars
    for (const s of c.stars) {
      s.update();
      s.draw();
    }
  }
}

// ===== INIT =====
const stars = [];
const dustParticles = [];
let shootingStars = [];
let shootingStarTimer = 0;

for (let i = 0; i < 150; i++) stars.push(new Star());
for (let i = 0; i < 60; i++) dustParticles.push(new Dust());

// ===== CONNECTION LINES (spatial grid) =====
const GRID = 140;
let grid = {};
function gridKey(x, y) { return `${Math.floor(x / GRID)},${Math.floor(y / GRID)}`; }
function buildGrid() {
  grid = {};
  for (let i = 0; i < stars.length; i++) {
    const k = gridKey(stars[i].x, stars[i].y);
    if (!grid[k]) grid[k] = [];
    grid[k].push(i);
  }
}
function getNeighborKeys(x, y) {
  const gx = Math.floor(x / GRID), gy = Math.floor(y / GRID), keys = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) keys.push(`${gx + dx},${gy + dy}`);
  return keys;
}

function drawLines() {
  buildGrid();
  for (let i = 0; i < stars.length; i++) {
    const p = stars[i];
    for (const k of getNeighborKeys(p.x, p.y)) {
      const cell = grid[k];
      if (!cell) continue;
      for (const j of cell) {
        if (j <= i) continue;
        const q = stars[j];
        const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 12100) { // 110px
          const o = (1 - Math.sqrt(d2) / 110) * 0.05;
          ctx.strokeStyle = `rgba(201,240,107,${o})`;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
  }
}

// ===== MAIN LOOP =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Constellation patterns (static positions, twinkling)
  drawConstellations();

  // Floating dust
  dustParticles.forEach(d => { d.update(); d.draw(); });

  // Moving stars
  stars.forEach(p => { p.update(); p.draw(); });
  drawLines();

  // Shooting stars
  shootingStarTimer++;
  if (shootingStarTimer > 150 + Math.random() * 300) {
    shootingStars.push(new ShootingStar());
    shootingStarTimer = 0;
  }
  shootingStars = shootingStars.filter(s => s.active);
  shootingStars.forEach(s => { s.update(); s.draw(); });

  requestAnimationFrame(animate);
}
animate();

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('visible'); }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ===== THEME TOGGLE =====
(function initThemeToggle() {
  if (!document.querySelector('.theme-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle light/dark theme');
    toggle.innerHTML = `
      <div class="theme-toggle-thumb">
        <svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </div>
      <span class="theme-toggle-label">theme</span>
    `;
    document.body.appendChild(toggle);

    // Load saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      updateIcon('light');
    }

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : next);
      if (next === 'dark') document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  function updateIcon(theme) {
    const moon = document.querySelector('.icon-moon');
    const sun = document.querySelector('.icon-sun');
    if (moon && sun) {
      if (theme === 'light') {
        moon.style.display = 'none';
        sun.style.display = 'block';
      } else {
        moon.style.display = 'block';
        sun.style.display = 'none';
      }
    }
  }
})();