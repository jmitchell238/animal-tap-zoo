'use strict';

/** @type {'menu'|'play'} */
let state = 'menu';

/** Runtime animal instances on the play field */
let field = [];
let habitatId = 'savanna';
let lastTapName = '';
let nameTimer = 0;
let findTarget = null; // animal id to find, or null in free roam
let finds = 0;
let streak = 0;
let promptPulse = 0;
let treat = null; // { x, y, vx, vy, life, kind }
let confettiRain = 0;
let lastSpeak = 0;

const MILESTONE = 5;
const PLAY_MODES = {
  find: { id: 'find', name: 'Find Me!', tagline: 'Tap the animal I name' },
  free: { id: 'free', name: 'Free Play', tagline: 'Tap anyone · big reactions' },
};

function animalsForHabitat(hid) {
  return ANIMALS.filter(a => a.habitats.includes(hid));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function layoutField(hid) {
  const list = animalsForHabitat(hid);
  let picks = list.slice();
  // Visitors: sometimes pull 1 friend from another habitat
  if (picks.length < 5) {
    const visitors = shuffle(ANIMALS.filter(a => !picks.find(p => p.id === a.id))).slice(0, 1);
    picks = picks.concat(visitors);
  }
  // Prefer 4 big animals (not a tiny grid of 6)
  picks = shuffle(picks).slice(0, Math.min(4, picks.length));

  const n = picks.length;
  const cols = 2;
  const rows = Math.ceil(n / cols);
  const top = 165;
  const bot = H - 110;
  const areaH = bot - top;
  const areaW = W - 36;
  const cellW = areaW / cols;
  const cellH = areaH / rows;

  field = picks.map((animal, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const baseX = 18 + cellW * c + cellW / 2;
    const baseY = top + cellH * r + cellH / 2;
    return {
      animal,
      x: baseX,
      y: baseY,
      homeX: baseX,
      homeY: baseY,
      r: Math.min(cellW, cellH) * 0.42,
      scale: 1,
      bounce: 0,
      squash: 0,
      spin: 0,
      wiggle: Math.random() * Math.PI * 2,
      facing: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 10,
      happy: 0,
      hops: 0,
    };
  });

  pickFindTarget();
  treat = null;
}

function pickFindTarget() {
  if ((save.mode || 'find') !== 'find') {
    findTarget = null;
    return;
  }
  if (!field.length) {
    findTarget = null;
    return;
  }
  // Prefer a different animal than last
  const options = field.map(f => f.animal);
  let next = options[Math.floor(Math.random() * options.length)];
  if (findTarget && options.length > 1) {
    const filtered = options.filter(a => a.id !== findTarget.id);
    if (filtered.length) next = filtered[Math.floor(Math.random() * filtered.length)];
  }
  findTarget = next;
  promptPulse = 0;
  // Speak the prompt after a short beat
  setTimeout(() => speakFind(), 280);
}

function speak(text) {
  if (save.muted || save.voiceOff) return;
  if (!window.speechSynthesis) return;
  const now = performance.now();
  if (now - lastSpeak < 400) return;
  lastSpeak = now;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.15;
    u.volume = 0.9;
    window.speechSynthesis.speak(u);
  } catch { /* */ }
}

function speakFind() {
  if (!findTarget) return;
  speak('Find the ' + findTarget.name + '!');
}

function enterPlay() {
  state = 'play';
  habitatId = save.habitat || 'savanna';
  finds = 0;
  streak = 0;
  confettiRain = 0;
  layoutField(habitatId);
  clearParticles();
  lastTapName = '';
  nameTimer = 0;
}

function enterMenu() {
  state = 'menu';
  clearParticles();
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch { /* */ }
  }
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
  for (let i = field.length - 1; i >= 0; i--) {
    const f = field[i];
    const dx = x - f.x;
    const dy = y - f.y;
    const hitR = f.r * 1.2;
    if (dx * dx + dy * dy <= hitR * hitR) return f;
  }
  return null;
}

function spawnTreatNear(f) {
  treat = {
    x: f.x + (Math.random() - 0.5) * 40,
    y: f.y - f.r - 20,
    vx: (Math.random() - 0.5) * 30,
    vy: -40 - Math.random() * 40,
    life: 2.2,
    kind: ['🍎', '🥕', '🌽', '🐟', '⭐'][Math.floor(Math.random() * 5)],
  };
}

function bigCelebration(x, y) {
  sfxCelebrate();
  spawnStars(x, y);
  spawnStars(x - 40, y + 20);
  spawnStars(x + 40, y + 20);
  confettiRain = 1.2;
  if (typeof spawnHearts === 'function') spawnHearts(x, y - 30);
}

function onTapAnimal(f) {
  if (!f) return;
  const rm = save.reducedMotion;
  const isFind = (save.mode || 'find') === 'find' && findTarget;
  const correct = !isFind || f.animal.id === findTarget.id;

  f.bounce = rm ? 0.2 : 0.55;
  f.squash = rm ? 0.1 : 0.28;
  f.wiggle += 1;
  f.hops = Math.min(5, (f.hops | 0) + 1);
  f.happy = 1.2;
  if (!rm) f.spin = correct && isFind ? Math.PI * 2 : Math.PI * 0.35;
  f.facing = f.x < W / 2 ? 1 : -1;

  sfxAnimal(f.animal.sound);
  spawnStars(f.x, f.y - 20);
  if (typeof spawnHearts === 'function') spawnHearts(f.x, f.y - f.r);

  recordTap(f.animal.id);
  lastTapName = f.animal.name;
  nameTimer = 1.1;

  if (correct) {
    speak(f.animal.name + '!');
    spawnPraise(f.x, f.y - f.r - 12, f.animal.name + '!');
    streak++;
    if (isFind) {
      finds++;
      bigCelebration(f.x, f.y);
      spawnPraise(W / 2, 130, 'You found it!');
      // Short delay then new target
      const delay = rm ? 500 : 900;
      setTimeout(() => {
        if (state === 'play') {
          // Reshuffle positions a bit so it stays fresh
          if (finds % 3 === 0) layoutField(habitatId);
          else pickFindTarget();
        }
      }, delay);
    } else {
      spawnPraise(f.x, f.y - f.r - 12);
    }

    if (Math.random() < 0.35 || f.hops >= 3) spawnTreatNear(f);

    if (streak > 0 && streak % MILESTONE === 0) {
      bigCelebration(W / 2, H * 0.35);
      spawnPraise(W / 2, H * 0.28, streak + ' in a row!');
      // Surprise: hop all animals
      for (const o of field) {
        o.bounce = 0.5;
        o.happy = 1;
      }
    }
  } else {
    // Soft miss in Find Me — still reacts, no shame
    streak = 0;
    spawnPraise(f.x, f.y - f.r - 10, 'Not the ' + findTarget.name);
    speak('Find the ' + findTarget.name);
    // Hint pulse on target
    const target = field.find(o => o.animal.id === findTarget.id);
    if (target) target.happy = 1.5;
  }
}

function onTapTreat() {
  if (!treat) return;
  spawnStars(treat.x, treat.y);
  spawnPraise(treat.x, treat.y, 'Yum!');
  sfxPop();
  // Nearest animal gets super happy
  let best = null;
  let bestD = Infinity;
  for (const f of field) {
    const d = Math.hypot(f.x - treat.x, f.y - treat.y);
    if (d < bestD) { bestD = d; best = f; }
  }
  if (best) {
    best.bounce = 0.5;
    best.happy = 1.5;
    best.hops++;
    sfxAnimal(best.animal.sound);
  }
  treat = null;
}

function hitTreat(x, y) {
  if (!treat) return false;
  return Math.hypot(x - treat.x, y - treat.y) < 36;
}

function updatePlay(dt) {
  promptPulse += dt;
  const pad = 50;
  const topBound = 150;
  const botBound = H - 100;

  for (const f of field) {
    // Idle wander
    if (!save.reducedMotion) {
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      // bounce off soft bounds around home cell
      const maxD = f.r * 0.9;
      if (f.x < f.homeX - maxD) { f.x = f.homeX - maxD; f.vx = Math.abs(f.vx); f.facing = 1; }
      if (f.x > f.homeX + maxD) { f.x = f.homeX + maxD; f.vx = -Math.abs(f.vx); f.facing = -1; }
      if (f.y < f.homeY - maxD * 0.5) { f.y = f.homeY - maxD * 0.5; f.vy = Math.abs(f.vy); }
      if (f.y > f.homeY + maxD * 0.5) { f.y = f.homeY + maxD * 0.5; f.vy = -Math.abs(f.vy); }
      // keep on screen
      f.x = Math.max(pad, Math.min(W - pad, f.x));
      f.y = Math.max(topBound, Math.min(botBound, f.y));
      // occasional direction change
      if (Math.random() < dt * 0.4) {
        f.vx += (Math.random() - 0.5) * 12;
        f.vy += (Math.random() - 0.5) * 8;
        f.vx = Math.max(-24, Math.min(24, f.vx));
        f.vy = Math.max(-14, Math.min(14, f.vy));
      }
      if (f.vx > 2) f.facing = 1;
      if (f.vx < -2) f.facing = -1;
    }

    if (f.bounce > 0) {
      f.bounce = Math.max(0, f.bounce - dt);
      const t = f.bounce;
      f.scale = 1 + Math.sin((1 - t / 0.55) * Math.PI) * 0.28;
      if (save.reducedMotion) f.scale = 1 + f.bounce * 0.35;
    } else {
      f.scale = 1 + Math.sin(performance.now() / 450 + f.wiggle) * 0.03;
    }
    if (f.squash > 0) f.squash = Math.max(0, f.squash - dt * 1.4);
    if (f.spin > 0) f.spin = Math.max(0, f.spin - dt * 5);
    if (f.happy > 0) f.happy = Math.max(0, f.happy - dt);
  }

  if (treat) {
    treat.life -= dt;
    treat.vy += 90 * dt;
    treat.x += treat.vx * dt;
    treat.y += treat.vy * dt;
    treat.vx *= 0.98;
    if (treat.life <= 0 || treat.y > H - 40) treat = null;
  }

  if (nameTimer > 0) nameTimer = Math.max(0, nameTimer - dt);
  if (confettiRain > 0) {
    confettiRain = Math.max(0, confettiRain - dt);
    if (!save.reducedMotion && Math.random() < 0.5) {
      spawnStars(40 + Math.random() * (W - 80), 80 + Math.random() * 40);
    }
  }
  updateParticles(dt);
}

function drawSkyGround(ctx, hab) {
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  g.addColorStop(0, hab.skyTop);
  g.addColorStop(1, hab.skyBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255, 236, 140, 0.9)';
  ctx.beginPath();
  ctx.arc(W - 60, 70, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 200, 0.35)';
  ctx.beginPath();
  ctx.arc(W - 60, 70, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  drawCloud(ctx, 60, 90, 1);
  drawCloud(ctx, 200, 50, 0.8);
  drawCloud(ctx, 300, 110, 0.7);

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

  ctx.fillStyle = hab.groundDark;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, H - 80, W, 80);
  ctx.globalAlpha = 1;

  if (hab.id === 'pond') {
    ctx.fillStyle = 'rgba(100, 200, 230, 0.55)';
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.72, 140, 50, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (hab.id === 'farm') {
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

  // Prompt / title bar
  const barH = findTarget ? 72 : 52;
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(14, 12, W - 28, barH, 16);
  else ctx.rect(14, 12, W - 28, barH);
  ctx.fill();

  if (findTarget) {
    const pulse = 1 + Math.sin(promptPulse * 4) * 0.04;
    ctx.save();
    ctx.translate(W / 2, 36);
    ctx.scale(pulse, pulse);
    ctx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#FFF59D';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Find the ' + findTarget.name + '! ' + (findTarget.emoji || ''), 0, 0);
    ctx.restore();
    ctx.font = '13px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('Found ' + finds + ' · Streak ' + streak, W / 2, 62);

    // Hint glow on target after 5s
    if (promptPulse > 5) {
      const t = field.find(f => f.animal.id === findTarget.id);
      if (t) {
        const a = 0.25 + 0.25 * Math.sin(promptPulse * 5);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = '#FFF59D';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  } else {
    ctx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hab.name + ' Zoo', W / 2, 30);
    ctx.font = '13px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText('Taps ' + (save.taps | 0) + ' · Streak ' + streak, W / 2, 48);
  }

  // Sort by y for simple depth
  const sorted = field.slice().sort((a, b) => a.y - b.y);
  for (const f of sorted) {
    ctx.save();
    ctx.translate(f.x, f.y);
    const sy = f.scale * (1 - f.squash * 0.4);
    const sx = f.scale * (1 + f.squash * 0.35);
    const artScale = (f.r / 58) * Math.min(sx, sy);
    // target pulse
    if (findTarget && f.animal.id === findTarget.id && f.happy > 0) {
      ctx.shadowColor = '#FFF59D';
      ctx.shadowBlur = 20;
    }
    drawAnimalSprite(ctx, f.animal, artScale, {
      flip: f.facing < 0,
      spin: f.spin > 0 ? Math.sin(f.spin * 10) * 0.35 : 0,
      hearts: f.happy > 0.3,
    });
    ctx.restore();
  }

  // Treat
  if (treat) {
    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(treat.kind, treat.x, treat.y);
  }

  // Name callout
  if (nameTimer > 0 && lastTapName) {
    const a = Math.min(1, nameTimer * 2);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = 'bold 34px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeText(lastTapName + '!', W / 2, 100);
    ctx.fillStyle = '#FFF59D';
    ctx.fillText(lastTapName + '!', W / 2, 100);
    ctx.restore();
  }

  drawParticles(ctx);

  ctx.font = '14px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.textAlign = 'center';
  ctx.fillText(findTarget ? 'Tap the right friend!' : 'Tap · make them dance!', W / 2, H - 36);
}

function drawMenuBackdrop(ctx) {
  const hab = HABITATS[save.habitat] || HABITATS.savanna;
  drawSkyGround(ctx, hab);
  ctx.fillStyle = 'rgba(8, 20, 30, 0.35)';
  ctx.fillRect(0, 0, W, H);

  const peek = [ANIMALS[0], ANIMALS[1], ANIMALS[3]];
  peek.forEach((animal, i) => {
    ctx.save();
    ctx.translate(70 + i * 120, H - 50);
    ctx.globalAlpha = 0.7;
    drawAnimalSprite(ctx, animal, 0.6, { flip: i === 1 });
    ctx.restore();
  });
}
