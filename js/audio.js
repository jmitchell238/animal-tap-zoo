'use strict';

let audioCtx = null;

function ensureAudio() {
  if (save.muted) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone({ freq = 440, dur = 0.12, type = 'sine', gain = 0.05, slide = 0, delay = 0 } = {}) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.linearRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function noiseBurst({ dur = 0.08, gain = 0.03, delay = 0 } = {}) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const n = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 900;
  g.gain.value = gain;
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  const t0 = ctx.currentTime + delay;
  src.start(t0);
  src.stop(t0 + dur);
}

function sfxClick() {
  tone({ freq: 520, dur: 0.05, type: 'square', gain: 0.02 });
}

function sfxPop() {
  tone({ freq: 600, dur: 0.08, type: 'sine', gain: 0.035, slide: 120 });
}

/** Play a friendly animal-ish sound from profile.kind */
function sfxAnimal(profile) {
  if (!profile) {
    sfxPop();
    return;
  }
  const b = profile.base || 300;
  switch (profile.kind) {
    case 'roar':
      tone({ freq: b, dur: 0.28, type: 'sawtooth', gain: 0.03, slide: -40 });
      tone({ freq: b * 1.5, dur: 0.22, type: 'triangle', gain: 0.025, slide: -20, delay: 0.05 });
      break;
    case 'trumpet':
      tone({ freq: b, dur: 0.18, type: 'square', gain: 0.03, slide: 80 });
      tone({ freq: b * 1.4, dur: 0.2, type: 'square', gain: 0.028, slide: 40, delay: 0.12 });
      break;
    case 'bleat':
      tone({ freq: b, dur: 0.12, type: 'triangle', gain: 0.04, slide: 60 });
      tone({ freq: b * 1.1, dur: 0.1, type: 'triangle', gain: 0.03, delay: 0.1 });
      break;
    case 'quack':
      tone({ freq: b, dur: 0.09, type: 'square', gain: 0.035, slide: -80 });
      tone({ freq: b * 0.9, dur: 0.08, type: 'square', gain: 0.03, delay: 0.1 });
      break;
    case 'ribbit':
      tone({ freq: b, dur: 0.1, type: 'sine', gain: 0.04, slide: 100 });
      tone({ freq: b * 1.3, dur: 0.12, type: 'sine', gain: 0.035, delay: 0.08 });
      break;
    case 'blub':
      tone({ freq: b, dur: 0.07, type: 'sine', gain: 0.03, slide: -100 });
      noiseBurst({ dur: 0.05, gain: 0.02, delay: 0.02 });
      break;
    case 'moo':
      tone({ freq: b, dur: 0.35, type: 'sawtooth', gain: 0.028, slide: -30 });
      tone({ freq: b * 0.75, dur: 0.3, type: 'triangle', gain: 0.025, delay: 0.05 });
      break;
    case 'oink':
      tone({ freq: b, dur: 0.08, type: 'square', gain: 0.03, slide: -50 });
      tone({ freq: b * 1.2, dur: 0.07, type: 'square', gain: 0.025, delay: 0.09 });
      break;
    case 'cluck':
      tone({ freq: b, dur: 0.05, type: 'square', gain: 0.025 });
      tone({ freq: b * 0.85, dur: 0.05, type: 'square', gain: 0.022, delay: 0.07 });
      tone({ freq: b * 1.1, dur: 0.05, type: 'square', gain: 0.02, delay: 0.14 });
      break;
    case 'growl':
      tone({ freq: b, dur: 0.25, type: 'sawtooth', gain: 0.025, slide: -20 });
      noiseBurst({ dur: 0.1, gain: 0.015, delay: 0.05 });
      break;
    case 'hoot':
      tone({ freq: b, dur: 0.15, type: 'sine', gain: 0.04 });
      tone({ freq: b * 0.85, dur: 0.18, type: 'sine', gain: 0.035, delay: 0.2 });
      break;
    case 'squeak':
      tone({ freq: b, dur: 0.08, type: 'sine', gain: 0.035, slide: 80 });
      break;
    case 'meow':
      tone({ freq: b, dur: 0.16, type: 'triangle', gain: 0.04, slide: 120 });
      tone({ freq: b * 1.2, dur: 0.12, type: 'sine', gain: 0.03, delay: 0.08 });
      break;
    case 'bark':
      tone({ freq: b, dur: 0.07, type: 'square', gain: 0.035, slide: -40 });
      tone({ freq: b * 0.9, dur: 0.08, type: 'square', gain: 0.03, delay: 0.1 });
      break;
    default:
      sfxPop();
  }
}

function sfxCelebrate() {
  tone({ freq: 523, dur: 0.1, type: 'sine', gain: 0.04 });
  tone({ freq: 659, dur: 0.1, type: 'sine', gain: 0.04, delay: 0.08 });
  tone({ freq: 784, dur: 0.14, type: 'sine', gain: 0.045, delay: 0.16 });
}
