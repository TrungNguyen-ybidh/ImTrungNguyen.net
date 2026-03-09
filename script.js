// ===== PARTICLE SYSTEM (non-interactive) =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== PARTICLES =====
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.ps = Math.random() * 0.006 + 0.002;
    this.wx = Math.random() * 0.3;
    this.wy = Math.random() * 0.3;
    this.type = Math.random();
  }
  update() {
    this.phase += this.ps;
    this.x += this.vx + Math.sin(this.phase) * this.wx * 0.05;
    this.y += this.vy + Math.cos(this.phase * 0.7) * this.wy * 0.05;
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.x > canvas.width + 20) this.x = -20;
    if (this.y < -20) this.y = canvas.height + 20;
    if (this.y > canvas.height + 20) this.y = -20;
  }
  draw() {
    const b = 0.5 + Math.sin(this.phase) * 0.5;
    const o = this.opacity * (0.3 + b * 0.7);
    const s = this.size * (0.85 + b * 0.15);
    ctx.fillStyle = this.type > 0.7
      ? `rgba(201,240,107,${o})`
      : this.type > 0.5
        ? `rgba(120,200,255,${o * 0.5})`
        : `rgba(232,230,225,${o * 0.45})`;
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
    this.len = Math.random() * 80 + 40;
    this.spd = Math.random() * 4 + 3;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.life = 1;
    this.decay = Math.random() * 0.007 + 0.004;
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
    g.addColorStop(0.7, `rgba(201,240,107,${o * 0.4})`);
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
    this.size = Math.random() * 0.7 + 0.2;
    this.vy = -(Math.random() * 0.12 + 0.04);
    this.vx = (Math.random() - 0.5) * 0.08;
    this.opacity = Math.random() * 0.2 + 0.05;
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += 0.01;
    this.y += this.vy;
    this.x += this.vx + Math.sin(this.phase) * 0.08;
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

// ===== INIT =====
const particles = [];
const dustParticles = [];
let shootingStars = [];
let shootingStarTimer = 0;

for (let i = 0; i < 80; i++) particles.push(new Particle());
for (let i = 0; i < 45; i++) dustParticles.push(new Dust());

// ===== CONNECTION LINES (spatial grid) =====
const GRID = 140;
let grid = {};
function gridKey(x, y) { return `${Math.floor(x / GRID)},${Math.floor(y / GRID)}`; }
function buildGrid() {
  grid = {};
  for (let i = 0; i < particles.length; i++) {
    const k = gridKey(particles[i].x, particles[i].y);
    if (!grid[k]) grid[k] = [];
    grid[k].push(i);
  }
}
function neighbors(x, y) {
  const gx = Math.floor(x / GRID), gy = Math.floor(y / GRID), keys = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) keys.push(`${gx + dx},${gy + dy}`);
  return keys;
}

function drawLines() {
  buildGrid();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    for (const k of neighbors(p.x, p.y)) {
      const cell = grid[k];
      if (!cell) continue;
      for (const j of cell) {
        if (j <= i) continue;
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 16900) {
          const o = (1 - Math.sqrt(d2) / 130) * 0.06;
          ctx.strokeStyle = `rgba(201,240,107,${o})`;
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

// ===== MAIN LOOP =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dustParticles.forEach(d => { d.update(); d.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();

  shootingStarTimer++;
  if (shootingStarTimer > 200 + Math.random() * 400) {
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
