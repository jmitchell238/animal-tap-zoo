'use strict';

const cv = document.getElementById('cv');
const stage = document.getElementById('stage');
let ctx = null;
let last = performance.now();
let lastPointerHandledAt = 0;
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function resizeCanvas() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  scale = Math.min(vw / W, vh / H);
  const cssW = Math.floor(W * scale);
  const cssH = Math.floor(H * scale);
  cv.style.width = cssW + 'px';
  cv.style.height = cssH + 'px';
  // HiDPI
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.floor(W * dpr);
  cv.height = Math.floor(H * dpr);
  ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  offsetX = (vw - cssW) / 2;
  offsetY = (vh - cssH) / 2;
  return { ctx };
}

function eventToStage(e) {
  const rect = cv.getBoundingClientRect();
  const clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
  const x = ((clientX - rect.left) / rect.width) * W;
  const y = ((clientY - rect.top) / rect.height) * H;
  return { x, y };
}

function setScreen(name) {
  document.querySelectorAll('.screen').forEach(el => {
    el.classList.toggle('hidden', el.dataset.screen !== name);
  });
  document.querySelectorAll('.play-chrome').forEach(el => {
    el.classList.toggle('hidden', name !== 'play');
  });
}

function updateMenuStats() {
  const tapsEl = document.getElementById('statTaps');
  const favEl = document.getElementById('statFav');
  if (tapsEl) tapsEl.textContent = String(save.taps | 0);
  if (favEl) {
    const id = topAnimalId();
    const a = id ? ANIMALS.find(x => x.id === id) : null;
    favEl.textContent = a ? a.emoji : '—';
  }
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) muteBtn.textContent = save.muted ? '🔇 Sound off' : '🔊 Sound on';
  const motionBtn = document.getElementById('motionBtn');
  if (motionBtn) motionBtn.textContent = save.reducedMotion ? 'Calm motion' : 'Full motion';
  const habLabel = document.getElementById('habLabel');
  if (habLabel) {
    const h = HABITATS[save.habitat] || HABITATS.savanna;
    habLabel.textContent = h.name;
  }
}

function showMenu() {
  enterMenu();
  updateMenuStats();
  setScreen('menu');
  if (window.__pendingReload) {
    window.__pendingReload = false;
    window.__reloaded = true;
    location.reload();
  }
}

function showPlay() {
  enterPlay();
  updatePlayChrome();
  setScreen('play');
}

function updatePlayChrome() {
  const hab = HABITATS[habitatId] || HABITATS.savanna;
  const label = document.getElementById('playHabLabel');
  if (label) label.textContent = hab.name;
  const taps = document.getElementById('playTaps');
  if (taps) taps.textContent = String(save.taps | 0);
}

function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (!ctx) resizeCanvas();

  if (state === 'play') {
    updatePlay(dt);
    updatePlayChrome();
  } else {
    updateParticles(dt);
  }

  ctx.clearRect(0, 0, W, H);

  if (state === 'play') {
    drawPlay(ctx);
  } else {
    drawMenuBackdrop(ctx);
  }

  requestAnimationFrame(frame);
}

function handlePointer(e) {
  if (state !== 'play') return;
  const now = performance.now();
  if (now - lastPointerHandledAt < 40) return;
  lastPointerHandledAt = now;

  const { x, y } = eventToStage(e);
  // Habitat strip: left / right thirds of bottom bar already have buttons — canvas taps only animals
  const hit = hitTest(x, y);
  if (hit) {
    onTapAnimal(hit);
    updatePlayChrome();
  }
  e.preventDefault();
}

function wireUi() {
  document.getElementById('btnPlay')?.addEventListener('click', () => {
    ensureAudio();
    sfxClick();
    showPlay();
  });

  document.getElementById('btnHow')?.addEventListener('click', () => {
    const panel = document.getElementById('howPanel');
    if (panel) panel.classList.toggle('hidden');
    sfxClick();
  });

  document.getElementById('muteBtn')?.addEventListener('click', () => {
    setMuted(!save.muted);
    if (!save.muted) {
      ensureAudio();
      sfxClick();
    }
    updateMenuStats();
  });

  document.getElementById('motionBtn')?.addEventListener('click', () => {
    setReducedMotion(!save.reducedMotion);
    sfxClick();
    updateMenuStats();
  });

  document.getElementById('btnHabPrev')?.addEventListener('click', () => {
    const i = HABITAT_IDS.indexOf(save.habitat);
    const next = HABITAT_IDS[(i - 1 + HABITAT_IDS.length) % HABITAT_IDS.length];
    setHabitat(next);
    sfxClick();
    updateMenuStats();
  });

  document.getElementById('btnHabNext')?.addEventListener('click', () => {
    const i = HABITAT_IDS.indexOf(save.habitat);
    const next = HABITAT_IDS[(i + 1) % HABITAT_IDS.length];
    setHabitat(next);
    sfxClick();
    updateMenuStats();
  });

  document.getElementById('btnMenu')?.addEventListener('click', () => {
    sfxClick();
    showMenu();
  });

  document.getElementById('btnPrevHab')?.addEventListener('click', () => {
    cycleHabitat(-1);
    updatePlayChrome();
  });

  document.getElementById('btnNextHab')?.addEventListener('click', () => {
    cycleHabitat(1);
    updatePlayChrome();
  });

  document.getElementById('btnHub')?.addEventListener('click', () => {
    window.location.href = 'https://jmitchell238.github.io/arcade-hub/';
  });

  cv.addEventListener('pointerdown', handlePointer, { passive: false });
  // Prevent double-tap zoom delay
  cv.addEventListener('touchstart', e => {
    if (state === 'play') e.preventDefault();
  }, { passive: false });

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state === 'play') showMenu();
      return;
    }
    if (state !== 'play') return;
    if (e.key === 'ArrowLeft') {
      cycleHabitat(-1);
      updatePlayChrome();
    }
    if (e.key === 'ArrowRight') {
      cycleHabitat(1);
      updatePlayChrome();
    }
  });
}

function setVersionTags() {
  const label = GAME_NAME + ' ' + GAME_VERSION_LABEL;
  document.querySelectorAll('#versionTag, #versionMenu').forEach(el => {
    el.textContent = label;
  });
}

function registerSw() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('[sw] register failed', err);
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (window.__reloaded) return;
      window.__pendingReload = true;
    });
  });
}

// Boot
wireUi();
setVersionTags();
resizeCanvas();
showMenu();
requestAnimationFrame(frame);
registerSw();
