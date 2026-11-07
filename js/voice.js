/* Narration for the Erklär-Filme.
   1) If recorded audio files exist (audio/<chapter>-<n>.mp3, listed in AUDIO), they are used: most natural.
   2) Otherwise the best German voice of the device is used (Premium/Enhanced/Natural voices first). */
import { S, save } from './store.js';

export const AUDIO = { available: false, chapters: {} }; // filled from audio/index.json if present

export async function loadAudioIndex() {
  try {
    const r = await fetch('audio/index.json', { cache: 'no-cache' });
    if (!r.ok) return;
    const j = await r.json();
    AUDIO.available = true;
    AUDIO.chapters = j.chapters || {};
    AUDIO.voice = j.voice || '';
  } catch (e) { /* no recorded audio */ }
}

const GOOD = /premium|enhanced|erweitert|verbessert|natural|neural|online/i;
const NICE_NAMES = /anna|helena|petra|marlene|vicki|katja|seraphina|amala|louisa|elke|klara|ingrid|conrad|markus|yannick|viktor/i;
function score(v) {
  let s = 0;
  if (GOOD.test(v.name)) s += 100;
  if (/google/i.test(v.name)) s += 40;
  if (NICE_NAMES.test(v.name)) s += 10;
  if (/de-AT/i.test(v.lang)) s += 6; else if (/de-DE/i.test(v.lang)) s += 5; else if (/de-CH/i.test(v.lang)) s += 3;
  if (/espeak|compact|eloquence|grandpa|grandma|rocko|shelley|sandy|flo|reed|eddy/i.test(v.name)) s -= 60;
  if (v.localService === false) s += 5;
  return s;
}
export function germanVoices() {
  if (!window.speechSynthesis) return [];
  return speechSynthesis.getVoices().filter((v) => /^de/i.test(v.lang)).sort((a, b) => score(b) - score(a));
}
export function currentVoice() {
  const all = germanVoices();
  if (S.settings.voiceName) { const v = all.find((x) => x.name === S.settings.voiceName); if (v) return v; }
  return all[0] || null;
}
export function voiceQuality() {
  const v = currentVoice();
  return v ? (GOOD.test(v.name) || /google/i.test(v.name) ? 'gut' : 'einfach') : 'keine';
}

let cur = null;
/* Speak text sentence by sentence (smoother, and avoids cut-offs). cb fires once at the end. */
export function speak(text, cb, opts = {}) {
  stop();
  const done = once(cb);
  const ss = window.speechSynthesis;
  if (!ss) { cur = setTimeout(done, Math.max(3200, text.split(' ').length * 420)); return; }
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  const v = currentVoice();
  let i = 0;
  const next = () => {
    if (i >= parts.length) return done();
    const u = new SpeechSynthesisUtterance(parts[i++].trim());
    u.lang = v ? v.lang : 'de-DE';
    if (v) u.voice = v;
    u.rate = (opts.rate || S.settings.rate || 1) * 0.96;
    u.pitch = 1.02;
    u.onend = () => setTimeout(next, 120);
    u.onerror = () => setTimeout(next, 200);
    ss.speak(u);
  };
  next();
}
export function stop() {
  if (typeof cur === 'number') clearTimeout(cur);
  try { speechSynthesis.cancel(); } catch (e) {}
  if (cur && cur.pause) { cur.pause(); cur.src = ''; }
  cur = null;
}
/* Recorded file for one film scene, if present. */
export function playFile(chId, n, cb) {
  stop();
  const done = once(cb);
  const a = new Audio(`audio/${chId}-${n}.mp3`);
  a.onended = done;
  a.onerror = () => done(true);
  cur = a;
  a.play().catch(() => done(true));
}
export function hasFile(chId, n) { return AUDIO.available && (AUDIO.chapters[chId] || 0) > n; }
function once(cb) { let f = false; return (...a) => { if (!f) { f = true; cb && cb(...a); } }; }
export function chooseVoice(name) { S.settings.voiceName = name; save(); }
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
