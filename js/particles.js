'use strict';

const particles = [];
const floatTexts = [];

function spawnConfetti(x, y, color, count = 18) {
  if (save.reducedMotion) {
    count = Math.min(count, 6);
  }
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 80 + Math.random() * 160;
    particles.push({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 60,
      life: 0.55 + Math.random() * 0.45,
      max: 0.55 + Math.random() * 0.45,
      r: 3 + Math.random() * 5,
      color: color || '#FFD56A',
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 8,
    });
  }
}

function spawnStars(x, y) {
  const cols = ['#FFD56A', '#7DFFA0', '#3DE7FF', '#FF4FD8', '#FFFFFF'];
  spawnConfetti(x, y, cols[Math.floor(Math.random() * cols.length)], save.reducedMotion ? 8 : 22);
  // extra colored bursts
  if (!save.reducedMotion) {
    for (const c of cols) {
      if (Math.random() > 0.5) spawnConfetti(x, y, c, 4);
    }
  }
}

function spawnPraise(x, y, text) {
  floatTexts.push({
    x, y,
    text: text || PRAISE[Math.floor(Math.random() * PRAISE.length)],
    life: 0.9,
    max: 0.9,
    vy: -40,
  });
}

function spawnHearts(x, y) {
  const n = save.reducedMotion ? 3 : 8;
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const sp = 40 + Math.random() * 80;
    particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y,
      vx: Math.cos(ang) * sp * 0.4,
      vy: Math.sin(ang) * sp - 30,
      life: 0.7 + Math.random() * 0.4,
      max: 0.7 + Math.random() * 0.4,
      r: 4 + Math.random() * 4,
      color: ['#FF6B8A', '#FF8FAB', '#FF4081'][i % 3],
      rot: 0,
      spin: 0,
      kind: 'heart',
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    p.vy += 280 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;
    p.vx *= 0.98;
  }
  for (let i = floatTexts.length - 1; i >= 0; i--) {
    const t = floatTexts[i];
    t.life -= dt;
    if (t.life <= 0) {
      floatTexts.splice(i, 1);
      continue;
    }
    t.y += t.vy * dt;
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    const a = Math.max(0, p.life / p.max);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    if (p.kind === 'heart') {
      // simple heart blob
      ctx.beginPath();
      ctx.arc(-p.r * 0.35, 0, p.r * 0.55, 0, Math.PI * 2);
      ctx.arc(p.r * 0.35, 0, p.r * 0.55, 0, Math.PI * 2);
      ctx.moveTo(-p.r * 0.85, p.r * 0.1);
      ctx.lineTo(0, p.r * 1.1);
      ctx.lineTo(p.r * 0.85, p.r * 0.1);
      ctx.fill();
    } else {
      ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
    }
    ctx.restore();
  }
  for (const t of floatTexts) {
    const a = Math.max(0, t.life / t.max);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = 'bold 28px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.strokeText(t.text, t.x, t.y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
  }
}

function clearParticles() {
  particles.length = 0;
  floatTexts.length = 0;
}
