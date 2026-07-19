'use strict';

const defaultSave = () => ({
  muted: false,
  reducedMotion: false,
  taps: 0,
  habitat: 'savanna',
  favorites: {}, // animalId -> count
});

let save = defaultSave();

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      save = defaultSave();
      return save;
    }
    const data = JSON.parse(raw);
    save = Object.assign(defaultSave(), data);
    if (!HABITAT_IDS.includes(save.habitat)) save.habitat = 'savanna';
    if (typeof save.taps !== 'number' || save.taps < 0) save.taps = 0;
    if (!save.favorites || typeof save.favorites !== 'object') save.favorites = {};
  } catch {
    save = defaultSave();
  }
  return save;
}

function persistSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch { /* quota / private mode */ }
}

function recordTap(animalId) {
  save.taps = (save.taps | 0) + 1;
  save.favorites[animalId] = (save.favorites[animalId] | 0) + 1;
  persistSave();
}

function setMuted(v) {
  save.muted = !!v;
  persistSave();
}

function setReducedMotion(v) {
  save.reducedMotion = !!v;
  persistSave();
}

function setHabitat(id) {
  if (HABITAT_IDS.includes(id)) {
    save.habitat = id;
    persistSave();
  }
}

function topAnimalId() {
  let best = null;
  let n = 0;
  for (const [id, c] of Object.entries(save.favorites || {})) {
    if (c > n) {
      n = c;
      best = id;
    }
  }
  return best;
}

loadSave();
