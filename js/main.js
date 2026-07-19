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
  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceBtn) voiceBtn.textContent = save.voiceOff ? '🗣 Voice off' : '🗣 Voice on';
  const habLabel = document.getElementById('habLabel');
  if (habLabel) {
    const h = HABITATS[save.habitat] || HABITATS.savanna;
    habLabel.textContent = h.name;
  }
  document.querySelectorAll('.mode-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === (save.mode || 'find'));
  });
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
  if (label) {
    if (findTarget) label.textContent = 'Find ' + findTarget.name;
    else label.textContent = hab.name;
  }
  const taps = document.getElementById('playTaps');
  if (taps) taps.textContent = findTarget ? (finds + ' found') : ((save.taps | 0) + ' taps');
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
  if (hitTreat(x, y)) {
    onTapTreat();
    updatePlayChrome();
    e.preventDefault();
    return;
  }
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

  document.getElementById('voiceBtn')?.addEventListener('click', () => {
    setVoiceOff(!save.voiceOff);
    sfxClick();
    updateMenuStats();
  });

  document.querySelectorAll('.mode-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.dataset.mode);
      sfxClick();
      updateMenuStats();
    });
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

/** Reload when idle; defer mid-play so a session isn't interrupted. */
function safeReloadForUpdate() {
  if (window.__reloaded) return;
  if (typeof state !== 'undefined' && state === 'play') {
    window.__pendingReload = true;
    return;
  }
  window.__reloaded = true;
  location.reload();
}

function activateWaitingWorker(reg) {
  if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
}

function watchInstallingWorker(reg) {
  const worker = reg.installing;
  if (!worker) return;
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
      worker.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

function registerSw() {
  if (!('serviceWorker' in navigator)) return;
  if (!(location.protocol === 'https:' || location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1')) return;

  navigator.serviceWorker.register('./sw.js').then(reg => {
    activateWaitingWorker(reg);
    if (reg.installing) watchInstallingWorker(reg);
    reg.addEventListener('updatefound', () => watchInstallingWorker(reg));

    const checkForUpdate = () => { reg.update().catch(() => {}); };
    checkForUpdate();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkForUpdate();
    });
    window.addEventListener('focus', checkForUpdate);
    setInterval(checkForUpdate, 60 * 1000);

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      safeReloadForUpdate();
    });
  }).catch(err => console.warn('[sw] register failed', err));

  function checkRemoteVersion() {
    if (typeof state !== 'undefined' && state === 'play') return;
    fetch('js/config.js', { cache: 'no-store' })
      .then(r => r.ok ? r.text() : '')
      .then(text => {
        const m = text.match(/GAME_VERSION\s*=\s*['"]([^'"]+)['"]/);
        if (m && m[1] && typeof GAME_VERSION !== 'undefined' && m[1] !== GAME_VERSION) {
          safeReloadForUpdate();
        }
      })
      .catch(() => {});
  }
  checkRemoteVersion();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkRemoteVersion();
  });
  setInterval(checkRemoteVersion, 2 * 60 * 1000);
}


// Boot
wireUi();
setVersionTags();
resizeCanvas();
showMenu();
requestAnimationFrame(frame);
registerSw();
