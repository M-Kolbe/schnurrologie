/* Progress lives only in this browser (localStorage). Nothing is sent anywhere. */
import { todayStr } from './util.js';

const KEY = 'schnurrologie.v1';

const DEFAULT = {
  name: '',
  xp: 0,
  streak: { count: 0, last: null },
  days: {},            // 'YYYY-MM-DD' -> { answered, correct, xp, minutes }
  items: {},           // itemId -> { box, right, wrong, last }
  chapters: {},        // chapterId -> { learned, video, l1, l2 } best scores 0..1
  cats: [],            // unlocked collectible cat ids
  plan: {},            // taskId -> true
  probe: [],           // [{date, pct, grade}]
  stats: { answered: 0, correct: 0, bestCombo: 0, typed: 0 },
  settings: { sound: true, music: false, track: 'lofi', voice: true, rate: 1, examDate: '2026-11-13', theme: 'auto' },
  seenIntro: false,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const s = JSON.parse(raw);
    return { ...structuredClone(DEFAULT), ...s, settings: { ...DEFAULT.settings, ...(s.settings || {}) }, stats: { ...DEFAULT.stats, ...(s.stats || {}) } };
  } catch (e) {
    return structuredClone(DEFAULT);
  }
}

export const S = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: keep in memory */ }
}

export function reset() {
  const keep = { name: S.name, settings: S.settings };
  Object.keys(S).forEach((k) => delete S[k]);
  Object.assign(S, structuredClone(DEFAULT), keep);
  save();
}

/* ---------- ranks: the vet career ---------- */
export const RANKS = [
  { xp: 0, title: 'Schnupper-Praktikantin', icon: '🐾' },
  { xp: 150, title: 'Praktikantin', icon: '🩹' },
  { xp: 400, title: 'Tierarzt-Helferin', icon: '🧤' },
  { xp: 800, title: 'Studentin der Tiermedizin', icon: '📚' },
  { xp: 1400, title: 'Assistenz-Tierärztin', icon: '🩺' },
  { xp: 2200, title: 'Tierärztin', icon: '👩‍⚕️' },
  { xp: 3200, title: 'Fachtierärztin für Katzen', icon: '🐈' },
  { xp: 4500, title: 'Chefärztin der Katzenklinik', icon: '👑' },
];
export function rankFor(xp = S.xp) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const cur = RANKS[i], next = RANKS[i + 1] || null;
  const pct = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
  return { i, cur, next, pct };
}

export function addXP(n) {
  const before = rankFor().i;
  S.xp = Math.max(0, S.xp + n);
  const d = today();
  d.xp += n;
  save();
  const after = rankFor().i;
  return after > before ? RANKS[after] : null;
}

export function today() {
  const k = todayStr();
  if (!S.days[k]) S.days[k] = { answered: 0, correct: 0, xp: 0, minutes: 0 };
  return S.days[k];
}

/* Daily streak ("Pfoten-Serie"): counts consecutive days with at least one answer. */
export function touchStreak() {
  const t = todayStr();
  if (S.streak.last === t) return false;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak.count = S.streak.last === todayStr(y) ? S.streak.count + 1 : 1;
  S.streak.last = t;
  save();
  return true;
}

/* ---------- Leitner boxes per item ---------- */
export function item(id) {
  return S.items[id] || { box: 0, right: 0, wrong: 0, last: 0 };
}
export function record(id, ok, score = ok ? 1 : 0) {
  const it = item(id);
  if (ok) { it.box = Math.min(5, it.box + 1); it.right++; }
  else { it.box = score >= .5 ? Math.max(1, it.box - 1) : 0; it.wrong++; }
  it.last = Date.now();
  S.items[id] = it;
  S.stats.answered++;
  if (ok) S.stats.correct++;
  const d = today();
  d.answered++;
  if (ok) d.correct++;
  touchStreak();
  save();
  return it;
}

export function chapterState(id) {
  if (!S.chapters[id]) S.chapters[id] = { learned: false, video: false, l1: 0, l2: 0 };
  return S.chapters[id];
}

/* Mastery 0..1 for a list of item ids: box 3+ counts as known. */
export function mastery(ids) {
  if (!ids.length) return 0;
  let sum = 0;
  for (const id of ids) sum += Math.min(item(id).box, 3) / 3;
  return sum / ids.length;
}

export function unlockCat(id) {
  if (S.cats.includes(id)) return false;
  S.cats.push(id);
  save();
  return true;
}
