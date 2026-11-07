/* Small helpers: DOM builder, randomness, fuzzy answer matching. */

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* h('div', {class:'x', onclick: fn}, 'text', child) */
export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') { for (const [sk, sv] of Object.entries(v)) { if (sv == null) continue; if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv; } }
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

/* HTML from a string: h.html('<b>x</b>') */
export function frag(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}

export function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
export const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const sample = (a, n) => shuffle(a).slice(0, n);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- fuzzy answer matching ---------- */
export function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/[’'`´]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[.,;:!?"„“”/\\+*_–-]/g, ' ')
    .replace(/^\s*(der|die|das|den|dem|des|ein|eine|einen|einem)\s+/, '')
    .replace(/\s+/g, '')
    .trim();
}

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/* Tolerance grows with word length: short words must be exact. */
function tolerance(len) {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 13) return 2;
  return 3;
}

/* Returns { ok, exact, best } — ok if a typo-tolerant match exists. */
export function matchAnswer(input, answers) {
  const x = norm(input);
  if (!x) return { ok: false, exact: false, best: answers[0] };
  let best = null, bestD = 1e9;
  for (const a of answers) {
    const y = norm(a);
    if (x === y) return { ok: true, exact: true, best: a };
    const d = lev(x, y);
    if (d < bestD) { bestD = d; best = a; }
  }
  const ok = bestD <= tolerance(norm(best).length);
  return { ok, exact: false, best: answers[0], near: best, dist: bestD };
}

/* Days between today and a date string (YYYY-MM-DD), local time. */
export function daysUntil(dateStr) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.round((d - t) / 86400000);
}
export function todayStr(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
