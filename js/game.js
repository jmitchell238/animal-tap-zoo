'use strict';

/** @type {'menu'|'play'} */
let state = 'menu';

/** Runtime animal instances on the play field */
let field = [];
let habitatId = 'savanna';
let bounceFlash = 0;
let lastTapName = '';
let nameTimer = 0;

// Milestone celebrations every N taps
const MILESTONE = 10;

function animalsForHabitat(hid) {
  return ANIMALS.filter(a => a.habitats.includes(hid));
}

function layoutField(hid) {
  const list = animalsForHabitat(hid);
  // Prefer habitat natives; fill with multi-habitat friends if sparse
  let picks = list.slice();
  if (picks.length < 4) {
    for (const a of ANIMALS) {
      if (!picks.find(p => p.id === a.id) && a.habitats.includes(hid)) picks.push(a);
    }
  }
  // Always show 4–6
  if (picks.length > 6) {
    // stable shuffle by habitat
    picks = picks.slice().sort((a, b) => a.id.localeCompare(b.id));
    picks = picks.slice(0, 6);
  }

  const n = picks.length;
  const cols = n <= 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const top = 150;
  const bot = H - 100;
  const areaH = bot - top;
  const areaW = W - 40;
  const cellW = areaW / cols;
  const cellH = areaH / rows;

  field = picks.map((animal, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return {
      animal,
      x: 20 + cellW * c + cellW / 2,
      y: top + cellH * r + cellH / 2 + 10,
      r: Math.min(cellW, cellH) * 0.38,
      scale: 1,
      bounce: 0,
      squash: 0,
      wiggle: Math.random() * Math.PI * 2,
    };
  });
}

function enterPlay() {
  state = 'play';
  habitatId = save.habitat || 'savanna';
  layoutField(habitatId);
  clearParticles();
  lastTapName = '';
  nameTimer = 0;
}

function enterMenu() {
  state = 'menu';
  clearParticles();
}

function cycleHabitat(dir) {
  const i = HABITAT_IDS.indexOf(habitatId);
  const next = HABITAT_IDS[(i + dir + HABITAT_IDS.length) % HABITAT_IDS.length];
  habitatId = next;
  setHabitat(next);
  layoutField(habitatId);
  sfxClick();
}

function hitTest(x, y) {
  // front-to-back: last drawn on top — check reverse
  for (let i = field.length - 1; i >= 0; i--) {
    const f = field[i];
    const dx = x - f.x;
    const dy = y - f.y;
    const hitR = f.r * 1.15;
    if (dx * dx + dy * dy <= hitR * hitR) return f;
  }
  return null;
}

function onTapAnimal(f) {
  if (!f) return;
  const rm = save.reducedMotion;
  f.bounce = rm ? 0.15 : 0.45;
  f.squash = rm ? 0.08 : 0.2;
  f.wiggle += 1;

  sfxAnimal(f.animal.sound);
  spawnStars(f.x, f.y - 20);
  spawnPraise(f.x, f.y - f.r - 10);
  recordTap(f.animal.id);

  lastTapName = f.animal.name;
  nameTimer = 1.2;

  if (save.taps > 0 && save.taps % MILESTONE === 0) {
    sfxCelebrate();
    spawnStars(W / 2, H * 0.35);
    spawnPraise(W / 2, H * 0.28, save.taps + ' taps!');
  }
}

function updatePlay(dt) {
  for (const f of field) {
    if (f.bounce > 0) {
      f.bounce = Math.max(0, f.bounce - dt);
      const t = f.bounce;
      // bounce scale peak
      f.scale = 1 + Math.sin((1 - t / 0.45) * Math.PI) * 0.22 * (t > 0 ? 1 : 0);
      if (save.reducedMotion) f.scale = 1 + f.bounce * 0.3;
    } else {
      f.scale = 1 + Math.sin(performance.now() / 500 + f.wiggle) * 0.02;
    }
    if (f.squash > 0) f.squash = Math.max(0, f.squash - dt * 1.5);
  }
  if (nameTimer > 0) nameTimer = Math.max(0, nameTimer - dt);
  updateParticles(dt);
}

function drawSkyGround(ctx, hab) {
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  g.addColorStop(0, hab.skyTop);
  g.addColorStop(1, hab.skyBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Sun
  ctx.fillStyle = 'rgba(255, 236, 140, 0.9)';
  ctx.beginPath();
  ctx.arc(W - 60, 70, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 200, 0.35)';
  ctx.beginPath();
  ctx.arc(W - 60, 70, 52, 0, Math.PI * 2);
  ctx.fill();

  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  drawCloud(ctx, 60, 90, 1);
  drawCloud(ctx, 200, 50, 0.8);
  drawCloud(ctx, 300, 110, 0.7);

  // Ground
  const groundY = H * 0.52;
  ctx.fillStyle = hab.ground;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.quadraticCurveTo(W * 0.25, groundY - 20, W * 0.5, groundY);
  ctx.quadraticCurveTo(W * 0.75, groundY + 24, W, groundY - 8);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Ground shade band
  ctx.fillStyle = hab.groundDark;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, H - 80, W, 80);
  ctx.globalAlpha = 1;

  // Habitat decorations
  if (hab.id === 'pond') {
    ctx.fillStyle = 'rgba(100, 200, 230, 0.55)';
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.72, 140, 50, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (hab.id === 'farm') {
    // Simple barn silhouette
    ctx.fillStyle = '#E57373';
    ctx.fillRect(28, groundY - 50, 50, 50);
    ctx.fillStyle = '#C62828';
    ctx.beginPath();
    ctx.moveTo(20, groundY - 50);
    ctx.lineTo(53, groundY - 80);
    ctx.lineTo(86, groundY - 50);
    ctx.closePath();
    ctx.fill();
  } else if (hab.id === 'forest') {
    for (const [tx, ty, s] of [[50, groundY - 10, 1], [320, groundY, 0.85], [100, groundY + 20, 0.7]]) {
      drawTree(ctx, tx, ty, s);
    }
  } else if (hab.id === 'savanna') {
    // Acacia-ish
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(48, groundY - 60, 8, 60);
    ctx.fillStyle = '#9CCC65';
    ctx.beginPath();
    ctx.ellipse(52, groundY - 70, 40, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCloud(ctx, x, y, s) {
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 14 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawTree(ctx, x, y, s) {
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(x - 4 * s, y - 40 * s, 8 * s, 40 * s);
  ctx.fillStyle = '#43A047';
  ctx.beginPath();
  ctx.arc(x, y - 50 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x - 14 * s, y - 40 * s, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 14 * s, y - 40 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlay(ctx) {
  const hab = HABITATS[habitatId] || HABITATS.savanna;
  drawSkyGround(ctx, hab);

  // Title bar
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, 56, 16);
  ctx.fill();

  ctx.font = 'bold 22px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hab.name + ' Zoo', W / 2, 36);

  ctx.font = '14px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('Taps: ' + (save.taps | 0), W / 2, 56);

  // Animals
  for (const f of field) {
    ctx.save();
    ctx.translate(f.x, f.y);
    const sy = f.scale * (1 - f.squash * 0.4);
    const sx = f.scale * (1 + f.squash * 0.35);
    // Fit animal art to radius — art is roughly ~100 units tall
    const artScale = (f.r / 55) * Math.min(sx, sy);
    ctx.scale(sx / Math.min(sx, sy), sy / Math.min(sx, sy));
    drawAnimalSprite(ctx, f.animal, artScale);
    ctx.restore();
  }

  // Name callout
  if (nameTimer > 0 && lastTapName) {
    const a = Math.min(1, nameTimer * 2);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeText(lastTapName + '!', W / 2, 100);
    ctx.fillStyle = '#FFF59D';
    ctx.fillText(lastTapName + '!', W / 2, 100);
    ctx.restore();
  }

  drawParticles(ctx);

  // Bottom hint
  ctx.font = '15px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.textAlign = 'center';
  ctx.fillText('Tap an animal!', W / 2, H - 36);
}

function drawMenuBackdrop(ctx) {
  const hab = HABITATS[save.habitat] || HABITATS.savanna;
  drawSkyGround(ctx, hab);
  // Dim for card readability
  ctx.fillStyle = 'rgba(8, 20, 30, 0.35)';
  ctx.fillRect(0, 0, W, H);

  // Decorative animals peeking
  const peek = ANIMALS.slice(0, 3);
  peek.forEach((animal, i) => {
    ctx.save();
    ctx.translate(70 + i * 120, H - 40);
    ctx.globalAlpha = 0.55;
    drawAnimalSprite(ctx, animal, 0.55);
    ctx.restore();
  });
}
