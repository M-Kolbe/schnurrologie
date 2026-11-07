/* Schnurrologie sound: everything is synthesised live with the Web Audio API.
   No sound files, works offline. Cat sounds (miau, schnurren, mrrp), feedback sounds, and three music tracks. */
import { S, save } from './store.js';

const A = { ctx: null, master: null, sfx: null, music: null, noise: {}, track: null, timer: null };

export function ensure() {
  if (!A.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    A.ctx = new C();
    A.master = A.ctx.createGain();
    A.master.gain.value = 0.9;
    const comp = A.ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 3;
    A.master.connect(comp); comp.connect(A.ctx.destination);
    A.sfx = A.ctx.createGain(); A.sfx.gain.value = 0.8; A.sfx.connect(A.master);
    A.music = A.ctx.createGain(); A.music.gain.value = 0.0; A.music.connect(A.master);
    setSessionType();
  }
  if (A.ctx.state === 'suspended') A.ctx.resume().catch(() => {});
  return A.ctx;
}

/* iPhone: play even when the ring/silent switch is on (Safari 16.4+). */
function setSessionType() {
  try { if (navigator.audioSession) navigator.audioSession.type = S.settings.silentOk === false ? 'ambient' : 'playback'; } catch (e) {}
}

/* Unlock audio on the first touch (iOS needs a user gesture). */
export function unlockOnGesture() {
  const go = () => {
    ensure();
    if (S.settings.music) startMusic(S.settings.track);
    window.removeEventListener('pointerdown', go, true);
    window.removeEventListener('keydown', go, true);
  };
  window.addEventListener('pointerdown', go, true);
  window.addEventListener('keydown', go, true);
}

function noiseBuf(kind = 'white') {
  if (A.noise[kind]) return A.noise[kind];
  const ctx = A.ctx, len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  A.noise[kind] = buf;
  return buf;
}
function noiseSrc(kind) { const s = A.ctx.createBufferSource(); s.buffer = noiseBuf(kind); s.loop = true; return s; }
function filt(type, f, q = 1) { const b = A.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
function gainNode(v = 0) { const g = A.ctx.createGain(); g.gain.value = v; return g; }
const N = (m) => 440 * Math.pow(2, (m - 69) / 12); // midi -> Hz

function canPlay() { return S.settings.sound && ensure(); }

/* ---------- cat sounds ---------- */
export function meow({ pitch = 1, len = 0.62, vol = 0.32, when = 0, up = false } = {}) {
  if (!canPlay()) return;
  const ctx = A.ctx, t = ctx.currentTime + when, f0 = 560 * pitch;
  const osc = ctx.createOscillator(); osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(f0 * 0.8, t);
  if (up) {
    osc.frequency.linearRampToValueAtTime(f0 * 1.0, t + len * 0.5);
    osc.frequency.linearRampToValueAtTime(f0 * 1.45, t + len);
  } else {
    osc.frequency.linearRampToValueAtTime(f0 * 1.3, t + len * 0.38);
    osc.frequency.linearRampToValueAtTime(f0 * 0.72, t + len);
  }
  const vib = ctx.createOscillator(), vg = gainNode(f0 * 0.018);
  vib.frequency.value = 7; vib.connect(vg); vg.connect(osc.frequency);
  const lp = filt('lowpass', 500, 0.7);
  lp.frequency.setValueAtTime(450, t);
  lp.frequency.exponentialRampToValueAtTime(5200, t + len * 0.22);
  lp.frequency.exponentialRampToValueAtTime(1800, t + len);
  const f1 = filt('bandpass', 800, 3.5), f2 = filt('bandpass', 2000, 5);
  f1.frequency.setValueAtTime(650, t); f1.frequency.linearRampToValueAtTime(1350, t + len * 0.38); f1.frequency.linearRampToValueAtTime(800, t + len);
  f2.frequency.setValueAtTime(1700, t); f2.frequency.linearRampToValueAtTime(2700, t + len * 0.38); f2.frequency.linearRampToValueAtTime(1400, t + len);
  const g1 = gainNode(1), g2 = gainNode(0.55), env = gainNode(0);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(vol, t + 0.06);
  env.gain.setValueAtTime(vol, t + len * 0.6);
  env.gain.exponentialRampToValueAtTime(0.0008, t + len);
  osc.connect(lp); lp.connect(f1); lp.connect(f2); f1.connect(g1); f2.connect(g2); g1.connect(env); g2.connect(env); env.connect(A.sfx);
  // a little breath
  const br = noiseSrc('white'), bf = filt('bandpass', 3000, 0.8), bg = gainNode(0);
  bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(vol * 0.05, t + 0.05); bg.gain.exponentialRampToValueAtTime(0.0001, t + len);
  br.connect(bf); bf.connect(bg); bg.connect(A.sfx);
  osc.start(t); vib.start(t); br.start(t);
  osc.stop(t + len + 0.05); vib.stop(t + len + 0.05); br.stop(t + len + 0.05);
}

export function mrrp(when = 0) { meow({ pitch: 1.15, len: 0.28, vol: 0.22, up: true, when }); }

export function purr(dur = 1.8, vol = 0.5) {
  if (!canPlay()) return;
  const ctx = A.ctx, t = ctx.currentTime;
  const src = noiseSrc('brown'), lp = filt('lowpass', 380, 0.9), am = gainNode(0), env = gainNode(0);
  const lfo = ctx.createOscillator(); lfo.type = 'triangle'; lfo.frequency.value = 26;
  const depth = gainNode(0.5); lfo.connect(depth); depth.connect(am.gain); am.gain.value = 0.5;
  const hum = ctx.createOscillator(); hum.type = 'sine'; hum.frequency.value = 52; const hg = gainNode(0.25);
  src.connect(lp); lp.connect(am); hum.connect(hg); hg.connect(am); am.connect(env); env.connect(A.sfx);
  const breaths = Math.max(1, Math.round(dur / 0.9));
  const step = dur / breaths;
  env.gain.setValueAtTime(0, t);
  for (let i = 0; i < breaths; i++) {
    const b = t + i * step;
    env.gain.linearRampToValueAtTime(vol * (i % 2 ? 0.7 : 1), b + step * 0.35);
    env.gain.linearRampToValueAtTime(vol * 0.15, b + step * 0.95);
  }
  env.gain.linearRampToValueAtTime(0, t + dur + 0.1);
  src.start(t); lfo.start(t); hum.start(t);
  src.stop(t + dur + 0.2); lfo.stop(t + dur + 0.2); hum.stop(t + dur + 0.2);
}

/* ---------- feedback sounds ---------- */
function bell(freq, t, dur = 0.6, vol = 0.18, type = 'sine') {
  const ctx = A.ctx, o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = gainNode(0);
  o.type = type; o.frequency.value = freq; o2.type = 'sine'; o2.frequency.value = freq * 2.01;
  const g2 = gainNode(0.25);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.sfx);
  o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
}

export function correct(combo = 0) {
  if (!canPlay()) return;
  const t = A.ctx.currentTime, k = Math.min(combo, 8);
  const base = 76 + [0, 2, 4, 5, 7, 9, 11, 12, 14][k];
  bell(N(base), t, 0.45, 0.16);
  bell(N(base + 7), t + 0.09, 0.6, 0.15);
  if (combo >= 2 && combo % 3 === 2) meow({ pitch: 1.1 + Math.random() * 0.2, len: 0.5, vol: 0.28, when: 0.18 });
}

export function wrong() {
  if (!canPlay()) return;
  const ctx = A.ctx, t = ctx.currentTime, o = ctx.createOscillator(), g = gainNode(0), lp = filt('lowpass', 900);
  o.type = 'triangle';
  o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(196, t + 0.28);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.35);
  o.connect(lp); lp.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.4);
  mrrp(0.32);
}

export function tap() {
  if (!canPlay()) return;
  const t = A.ctx.currentTime;
  bell(N(88), t, 0.08, 0.06, 'triangle');
}

export function fanfare() {
  if (!canPlay()) return;
  const t = A.ctx.currentTime;
  [72, 76, 79, 84, 88].forEach((m, i) => bell(N(m), t + i * 0.09, 0.7, 0.14, 'triangle'));
  bell(N(91), t + 0.5, 1.2, 0.12);
  meow({ pitch: 1.2, len: 0.7, vol: 0.3, when: 0.75 });
}

export function whoosh() {
  if (!canPlay()) return;
  const ctx = A.ctx, t = ctx.currentTime, s = noiseSrc('white'), f = filt('bandpass', 400, 1.2), g = gainNode(0);
  f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.25);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.3);
  s.connect(f); f.connect(g); g.connect(A.sfx); s.start(t); s.stop(t + 0.35);
}

/* ---------- music ---------- */
export const TRACKS = {
  lofi: { name: 'Schnurr-Lofi (ruhig lernen)', bpm: 76 },
  happy: { name: 'Pfoten-Galopp (fröhlich)', bpm: 108 },
  focus: { name: 'Stille Praxis (Konzentration)', bpm: 60 },
};

function epiano(freq, t, dur, vol) {
  const ctx = A.ctx, o = ctx.createOscillator(), m = ctx.createOscillator(), mg = gainNode(freq * 1.2), g = gainNode(0);
  o.type = 'sine'; o.frequency.value = freq; m.type = 'sine'; m.frequency.value = freq * 2;
  mg.gain.setValueAtTime(freq * 1.4, t); mg.gain.exponentialRampToValueAtTime(freq * 0.05, t + 0.5);
  m.connect(mg); mg.connect(o.frequency);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.connect(g); g.connect(A.music); o.start(t); m.start(t); o.stop(t + dur + 0.05); m.stop(t + dur + 0.05);
}
function pad(freqs, t, dur, vol) {
  const ctx = A.ctx, g = gainNode(0), lp = filt('lowpass', 1400, 0.5);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.35); g.gain.linearRampToValueAtTime(0, t + dur);
  freqs.forEach((f) => [-6, 6].forEach((det) => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + dur + 0.05);
  }));
  lp.connect(g); g.connect(A.music);
}
function pluck(freq, t, vol = 0.07, type = 'square') {
  const ctx = A.ctx, o = ctx.createOscillator(), g = gainNode(0), lp = filt('lowpass', 2400, 1);
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.22);
  o.connect(lp); lp.connect(g); g.connect(A.music); o.start(t); o.stop(t + 0.25);
}
function bass(freq, t, dur, vol = 0.18) {
  const ctx = A.ctx, o = ctx.createOscillator(), g = gainNode(0), lp = filt('lowpass', 300);
  o.type = 'triangle'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(lp); lp.connect(g); g.connect(A.music); o.start(t); o.stop(t + dur + 0.05);
}
function kick(t, vol = 0.35) {
  const ctx = A.ctx, o = ctx.createOscillator(), g = gainNode(0);
  o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.3);
  o.connect(g); g.connect(A.music); o.start(t); o.stop(t + 0.32);
}
function hat(t, vol = 0.04, len = 0.05) {
  const s = noiseSrc('white'), f = filt('highpass', 7000), g = gainNode(0);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + len);
  s.connect(f); f.connect(g); g.connect(A.music); s.start(t); s.stop(t + len + 0.02);
}
function snare(t, vol = 0.09) {
  const s = noiseSrc('white'), f = filt('bandpass', 1800, 0.8), g = gainNode(0);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.16);
  s.connect(f); f.connect(g); g.connect(A.music); s.start(t); s.stop(t + 0.18);
}
function crackle(t, beat) {
  for (let i = 0; i < 3; i++) if (Math.random() < 0.5) hat(t + Math.random() * beat, 0.012 + Math.random() * 0.01, 0.01);
}

const PENTA = [72, 74, 76, 79, 81, 84, 86];
const PROG = {
  lofi: [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [60, 64, 67, 71]],   // Fmaj7 Em7 Dm7 Cmaj7
  happy: [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]],   // C G Am F
  focus: [[57, 60, 64, 67], [53, 57, 60, 64], [60, 64, 67, 71], [55, 59, 62, 69]],   // Am7 Fmaj7 Cmaj7 G6
};

function scheduleBar(track, bar, t, beat) {
  const ch = PROG[track][bar % 4];
  const swing = beat * 0.16;
  if (track === 'lofi') {
    ch.forEach((m, i) => epiano(N(m), t + i * 0.015, beat * 3, 0.045));
    ch.slice(1).forEach((m, i) => epiano(N(m), t + beat * 2.5 + swing + i * 0.015, beat * 1.4, 0.03));
    bass(N(ch[0] - 24), t, beat * 1.6); bass(N(ch[0] - 24), t + beat * 2.5 + swing, beat * 1.2, 0.14);
    kick(t, 0.3); kick(t + beat * 1.5 + swing, 0.2); kick(t + beat * 2.5 + swing, 0.25);
    snare(t + beat, 0.07); snare(t + beat * 3, 0.07);
    for (let i = 0; i < 8; i++) hat(t + i * beat / 2 + (i % 2 ? swing : 0), i % 2 ? 0.018 : 0.03);
    crackle(t, beat * 4);
    if (Math.random() < 0.7) {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) epiano(N(PENTA[Math.floor(Math.random() * PENTA.length)]), t + beat * (Math.floor(Math.random() * 8) / 2), beat * 1.2, 0.035);
    }
  } else if (track === 'happy') {
    const arp = [0, 1, 2, 3, 2, 1, 2, 3];
    arp.forEach((k, i) => pluck(N(ch[k] + 12), t + i * beat / 2, 0.045, i % 2 ? 'triangle' : 'square'));
    bass(N(ch[0] - 24), t, beat * 0.9, 0.16); bass(N(ch[0] - 24), t + beat * 2, beat * 0.9, 0.16);
    bass(N(ch[0] - 12), t + beat * 1.5, beat * 0.4, 0.1); bass(N(ch[0] - 12), t + beat * 3.5, beat * 0.4, 0.1);
    for (let i = 0; i < 4; i++) kick(t + i * beat, 0.24);
    snare(t + beat, 0.08); snare(t + beat * 3, 0.08);
    for (let i = 0; i < 8; i++) hat(t + i * beat / 2 + beat / 4, 0.025);
    if (bar % 2 === 1) [0, 2, 4].forEach((k, i) => pluck(N(PENTA[(bar + k) % PENTA.length] + 12), t + beat * (2 + i * 0.5), 0.03, 'triangle'));
  } else {
    pad(ch.map(N), t, beat * 4.2, 0.03);
    bass(N(ch[0] - 24), t, beat * 4, 0.08);
    if (Math.random() < 0.6) bell(N(PENTA[Math.floor(Math.random() * PENTA.length)] + 12), t + beat * (1 + Math.floor(Math.random() * 3)), 2.2, 0.025);
  }
}

export function startMusic(track = S.settings.track) {
  if (!ensure()) return;
  stopMusic(true);
  A.track = track;
  const bpm = TRACKS[track].bpm, beat = 60 / bpm, barLen = beat * 4;
  let bar = 0, next = A.ctx.currentTime + 0.15;
  A.music.gain.cancelScheduledValues(A.ctx.currentTime);
  A.music.gain.setValueAtTime(A.music.gain.value, A.ctx.currentTime);
  A.music.gain.linearRampToValueAtTime(track === 'focus' ? 0.9 : 0.75, A.ctx.currentTime + 1.5);
  const tick = () => {
    while (next < A.ctx.currentTime + 0.6) { scheduleBar(track, bar, next, beat); bar++; next += barLen; }
  };
  tick();
  A.timer = setInterval(tick, 200);
}

export function stopMusic(fast = false) {
  if (A.timer) clearInterval(A.timer);
  A.timer = null;
  if (A.ctx && A.music) {
    const t = A.ctx.currentTime;
    A.music.gain.cancelScheduledValues(t);
    A.music.gain.setValueAtTime(A.music.gain.value, t);
    A.music.gain.linearRampToValueAtTime(0, t + (fast ? 0.05 : 0.6));
  }
}

export function setMusic(on, track) {
  S.settings.music = on;
  if (track) S.settings.track = track;
  save();
  if (on) startMusic(S.settings.track); else stopMusic();
}

/* Switch mood without changing the saved setting, e.g. focus during the Probearbeit. */
export function moodMusic(track) {
  if (!S.settings.music) return;
  if (A.track !== track) startMusic(track);
}

/* Duck music while the narrator speaks. */
export function duck(on) {
  if (!A.ctx || !A.music || !S.settings.music) return;
  const t = A.ctx.currentTime;
  A.music.gain.cancelScheduledValues(t);
  A.music.gain.setValueAtTime(A.music.gain.value, t);
  A.music.gain.linearRampToValueAtTime(on ? 0.22 : 0.75, t + 0.3);
}
