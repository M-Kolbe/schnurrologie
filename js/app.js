/* Schnurrologie – screens and navigation. */
import { $, $$, h, frag, shuffle, pick, esc, daysUntil, todayStr, clamp } from './util.js';
import { S, save, reset, addXP, rankFor, RANKS, record, item, chapterState, mastery, unlockCat } from './store.js';
import { CHAPTERS, CARDS, PLAN, ALL_QUESTIONS, WORKSHEETS, chapterById } from './content.js';
import { DIAGRAMS, diagramSVG, numbering, highlight, partById, zoomTo } from './diagrams.js';
import { docSVG, CATS, catById, catPic } from './cats.js';
import { renderQuestion, pickSession, usableAt, itemKey } from './engine.js';
import { icon as I, CH_ICON } from './icons.js';
import * as snd from './audio.js';
import * as voice from './voice.js';
import { GLOSSARY } from './glossary.js';

const app = $('#app');
const QBYID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
snd.unlockOnGesture();
applyTheme();

/* ================= helpers ================= */
function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
function toast(html, cat) {
  const el = h('div', { class: 'toast' });
  if (cat) el.append(frag(cat));
  el.append(h('div', { html }));
  $('#toast').append(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3200);
}
function confetti(n = 60) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#fx'), ctx = c.getContext('2d');
  const W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
  const em = ['🐾', '🐟', '⭐', '💜', '🧶'];
  const P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: -Math.random() * H * 0.5, vy: (2 + Math.random() * 4) * devicePixelRatio, vx: (Math.random() - 0.5) * 3 * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, e: pick(em), s: (18 + Math.random() * 16) * devicePixelRatio }));
  const t0 = performance.now();
  const step = (t) => {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) { p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.font = `${p.s}px serif`; ctx.fillText(p.e, 0, 0); ctx.restore(); }
    if (t - t0 < 2600) requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(step);
}
function modal(content, onClose) {
  const m = h('div', { class: 'modal' });
  const p = h('div', { class: 'panel' }, content);
  m.append(p);
  m.onclick = (e) => { if (e.target === m) close(); };
  function close() { m.remove(); onClose && onClose(); }
  document.body.append(m);
  return close;
}
/* In-page confirmation (no browser confirm dialogs). */
function ask(text, yes, onYes) {
  const close = modal(h('div', { class: 'stack' }, h('h2', null, text),
    h('button', { class: 'btn coral block', onclick: () => { close(); onYes(); } }, yes),
    h('button', { class: 'btn ghost block', onclick: () => close() }, 'Abbrechen')));
}
const ico = (name, cls) => frag(I(name, cls));
function back(href, label) { return h('a', { class: 'back', href }, ico('chevL'), label); }
function chapterMastery(id) {
  const keys = [];
  chapterById(id).q.forEach((q) => { if (usableAt(q, 1)) keys.push(itemKey(q, 1)); if (usableAt(q, 2)) keys.push(itemKey(q, 2)); });
  return mastery(keys);
}
function levelMastery(ch, n) { const qs = ch.q.filter((q) => usableAt(q, n)); return qs.length ? mastery(qs.map((q) => itemKey(q, n))) : 0; }
function patientMood(m) {
  if (m >= 0.8) return { mood: 'happy', acc: ['heart'], label: 'geheilt' };
  if (m >= 0.35) return { mood: 'happy', acc: ['bandage'], label: 'wird gesund' };
  return { mood: 'sick', acc: ['cone', 'thermo'], label: 'krank' };
}
function patientSVG(ch) { const pm = patientMood(chapterMastery(ch.id)); return catPic(catById(ch.cat), pm.mood, pm.acc); }
const examDays = () => daysUntil(S.settings.examDate);
const nav = (hash) => { location.hash = hash; };
const focusMode = (on) => document.body.classList.toggle('focus', on);
function topbar() {
  const top = $('#top .inner');
  top.innerHTML = '';
  top.append(
    h('a', { class: 'brand', href: '#/', html: docSVG('happy') + '<span>Schnurrologie</span>' }),
    h('div', { class: 'spacer' }),
    h('a', { class: 'pill fish', href: '#/katzen', title: 'Leckerli (deine Punkte)' }, ico('fish'), String(S.xp)),
    h('a', { class: 'pill paw', href: '#/plan', title: 'Tage in Folge gelernt' }, ico('paw'), String(S.streak.count || 0)),
    h('button', { class: 'iconbtn', 'aria-pressed': String(!!S.settings.music), title: 'Musik an/aus', onclick: (e) => { snd.ensure(); snd.setMusic(!S.settings.music); e.currentTarget.setAttribute('aria-pressed', String(S.settings.music)); } }, ico('music')),
    h('button', { class: 'iconbtn', 'aria-pressed': String(!!S.settings.sound), title: 'Töne an/aus', onclick: (e) => { S.settings.sound = !S.settings.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(S.settings.sound)); if (S.settings.sound) snd.meow(); } }, ico('sound')),
    h('a', { class: 'iconbtn', href: '#/einstellungen', title: 'Einstellungen' }, ico('gear')),
  );
}
function tabs(active) { $$('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === active)); }
function checkUnlocks() {
  const got = [];
  for (const ch of CHAPTERS) if (chapterMastery(ch.id) >= 0.8 && unlockCat(ch.cat)) got.push(ch.cat);
  if (S.streak.count >= 3 && unlockCat('sternchen')) got.push('sternchen');
  if (S.stats.correct >= 100 && unlockCat('brownie')) got.push('brownie');
  if (S.stats.bestCombo >= 10 && unlockCat('blitz')) got.push('blitz');
  if (S.stats.typedRound && unlockCat('mausi')) got.push('mausi');
  if (CHAPTERS.every((c) => chapterState(c.id).learned) && unlockCat('nachtfee')) got.push('nachtfee');
  if (S.probe.some((p) => p.grade === 1) && unlockCat('cleo')) got.push('cleo');
  got.forEach((id, i) => setTimeout(() => {
    const c = catById(id);
    snd.fanfare(); confetti();
    toast(`<b>${esc(c.name)}</b> ${c.bonus ? 'ist zu dir gezogen' : 'ist wieder gesund'}!<br><span class="small">Neu in deiner Katzen-Sammlung</span>`, catPic(c, 'happy', ['heart']));
  }, 600 + i * 1800));
}
function gainXP(n) {
  const up = addXP(n);
  if (up) setTimeout(() => { snd.fanfare(); confetti(80); toast(`Befördert! Du bist jetzt <b>${esc(up.title)}</b>`, docSVG('wow')); }, 400);
}
function sheetProgress(w) {
  const qs = w.tasks.map((t) => QBYID[t.ref]).filter(Boolean);
  return qs.length ? mastery(qs.map((q) => itemKey(q, usableAt(q, 2) ? 2 : 1))) : 0;
}


/* "So funktioniert's": after every answer, explain how it really works (part functions / glossary). */
const GL_INDEX = GLOSSARY.map((g) => ({ g, keys: [g.t, ...String(g.alt || '').split(',')].map((k) => k.trim().toLowerCase()).filter((k) => k.length > 3) }));
function glossFor(text, max = 2, skip = '') {
  const t = String(text || '').toLowerCase();
  const out = [];
  for (const { g, keys } of GL_INDEX) {
    if (out.length >= max) break;
    if (keys.some((k) => t.includes(k)) && !skip.toLowerCase().includes(g.d.toLowerCase().slice(0, 30))) out.push(g);
  }
  return out;
}
function explainMore(q, res) {
  let items = [];
  if (q.t === 'label' || (q.t === 'pick' && q.d && q.markers !== false)) {
    const D = DIAGRAMS[q.d];
    const ids = q.t === 'label' ? (q.parts === 'all' ? D.parts.map((p) => p.id) : q.parts) : [];
    const nums = numbering(q.d, q.t === 'label' && q.parts !== 'all' ? ids : null);
    items = ids.map((id) => { const p = D.parts.find((x) => x.id === id); return `<b>${nums[id]} ${esc(p.name)}:</b> ${esc(p.info)}`; });
  } else if (q.t === 'explain' || q.t === 'formula' || q.t === 'grid') {
    return '';
  } else {
    const text = [q.a, res.answer, ...(q.right || []), ...(q.items || []).slice(0, 3), ...(q.pairs || []).flat()].join(' · ');
    items = glossFor(text, q.t === 'match' ? 3 : 2, res.html || '').map((g) => `<b>${esc(g.t)}:</b> ${esc(g.d)}`);
  }
  if (!items.length) return '';
  return `<div class="howto"><div class="howto-t">${I('bulb')} So funktioniert’s</div>${items.map((x) => `<div>${x}</div>`).join('')}</div>`;
}

function videoList(list) {
  const c = h('div', { class: 'card' });
  list.forEach((v) => c.append(h('a', { class: 'yt', href: v.url, target: '_blank', rel: 'noopener' },
    h('div', { class: 'play' + (v.kind === 'web' ? ' web' : v.kind === 'search' ? ' search' : ''), html: I(v.kind === 'web' ? 'doc' : v.kind === 'search' ? 'target' : 'play') }),
    h('div', null, h('b', null, v.title), h('span', null, v.ch)))));
  return c;
}

/* ================= router ================= */
const routes = [
  [/^#?\/?$/, home],
  [/^#\/k\/([\w-]+)$/, chapter],
  [/^#\/karten\/([\w-]+)$/, cards],
  [/^#\/lernen\/([\w-]+)$/, learn],
  [/^#\/film\/([\w-]+)$/, film],
  [/^#\/ueben\/([\w-]+)\/(\d)$/, (id, lv) => quiz({ chapter: id, level: +lv })],
  [/^#\/mix$/, mixIntro],
  [/^#\/mix\/los$/, () => quiz({ mix: true })],
  [/^#\/stoff$/, stoff],
  [/^#\/glossar$/, () => glossary()],
  [/^#\/videos$/, () => videosPage()],
  [/^#\/videos\/([\w-]+)$/, (c) => videosPage(c)],
  [/^#\/glossar\/([\w-]+)$/, (c) => glossary(c)],
  [/^#\/nochmal$/, () => quiz({ retry: true })],
  [/^#\/show$/, showIntro],
  [/^#\/show\/los$/, showRun],
  [/^#\/alle$/, fullIntro],
  [/^#\/alle\/los$/, fullRun],
  [/^#\/blatt\/(\d+)$/, (i) => quiz({ sheet: +i })],
  [/^#\/test$/, () => testBuilder()],
  [/^#\/test\/los$/, () => testStart()],
  [/^#\/test\/weiter$/, () => testResume()],
  [/^#\/test\/([\w-]+)$/, (c) => testBuilder(c)],
  [/^#\/probe$/, probeIntro],
  [/^#\/probe\/los$/, probeRun],
  [/^#\/bild\/([\w-]+)$/, explore],
  [/^#\/themen$/, topics],
  [/^#\/katzen$/, catsPage],
  [/^#\/plan$/, planPage],
  [/^#\/einstellungen$/, settingsPage],
];
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  $$('.modal, .sheet').forEach((m) => m.remove());
  focusMode(false);
  voice.stop();
  const hash = location.hash || '#/';
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) { app.innerHTML = ''; window.scrollTo(0, 0); topbar(); fn(...m.slice(1)); return; }
  }
  nav('#/');
}
addEventListener('hashchange', route);

/* ================= home ================= */
let introTimer = null;
function home() {
  tabs('start');
  const d = examDays(), r = rankFor(), name = S.name || 'Tierärztin';
  const hello = pick([
    `Hallo ${name}! Bereit für die Visite?`,
    `Miau, ${name}! Heute machen wir ein paar Patienten gesund.`,
    `Schön, dass du da bist, ${name}. Jede Runde macht dich sicherer.`,
    `${name}, Tierärztinnen-Wissen: ${pick(CATS).fact}`,
  ]);
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'hero' }, h('div', { class: 'cat', html: docSVG(d <= 0 ? 'wow' : 'happy', ['mirror']) }), h('div', { class: 'bubble' }, hello)));
  s.append(h('div', { class: 'kpis' },
    h('a', { class: 'kpi', href: '#/plan' },
      h('div', { class: 'num' }, d > 0 ? String(d) : d === 0 ? 'Heute' : '✓'),
      h('div', { class: 'lbl' }, d > 1 ? 'Tage bis zum Bio-Test' : d === 1 ? 'Tag – morgen ist der Test' : d === 0 ? 'ist der Bio-Test. Viel Glück!' : 'Test geschafft'),
      h('div', { class: 'sub' }, 'Freitag, 13. November')),
    h('a', { class: 'kpi', href: '#/katzen' },
      h('div', { class: 'rk' }, ico('steth'), h('div', { class: 'lbl', style: { marginTop: 0 } }, r.cur.title)),
      h('div', { class: 'bar accent' }, h('i', { style: { width: Math.round(r.pct * 100) + '%' } })),
      h('div', { class: 'sub' }, r.next ? `${S.xp} / ${r.next.xp} Leckerli` : 'Höchster Rang erreicht'))));
  const dayPlan = PLAN.find((p) => p.date === todayStr());
  if (dayPlan) {
    const open = dayPlan.tasks.filter((t) => !S.plan[t.id]).slice(0, 3);
    const c = h('div', { class: 'card today' }, h('div', { class: 'eyebrow' }, 'Heute · ' + dayPlan.label));
    if (open.length) open.forEach((t) => c.append(h('div', { class: 'task' }, h('span', { class: 'dot' }), t.link ? h('a', { href: t.link }, t.text) : h('span', null, t.text))));
    else c.append(h('p', { style: { margin: '8px 0 0', fontWeight: 700 } }, 'Alles für heute erledigt. Super gemacht!'));
    s.append(c);
  }
  s.append(h('div', { class: 'actions2' },
    h('a', { class: 'btn', href: '#/mix' }, ico('bolt'), 'Schnell-Runde', h('small', null, '10 Fragen gemischt')),
    h('a', { class: 'btn lav', href: '#/probe' }, ico('clock'), 'Probearbeit', h('small', null, '20 Min. mit Note'))));
  const done = WORKSHEETS.filter((w) => sheetProgress(w) >= 0.8).length;
  s.append(h('a', { class: 'card linkcard', href: '#/stoff' }, h('div', { class: 'ic', html: I('clipboard') }),
    h('div', null, h('b', null, 'Prüfstoff Seite für Seite'), h('span', { class: 'small muted' }, `Alle Aufgaben aus deinem Heft · ${done} von ${WORKSHEETS.length} Seiten sicher`)), h('span', { class: 'go', html: I('chevR') })));
  s.append(h('a', { class: 'card linkcard', href: '#/show' }, h('div', { class: 'ic', style: { background: 'var(--sun-soft)', color: 'var(--sun)' }, html: I('trophy') }),
    h('div', null, h('b', null, 'Wer wird Tierärztin?'), h('span', { class: 'small muted' }, `Die Quizshow · 15 Stufen · dein Rekord: ${S.showBest || 0}`)), h('span', { class: 'go', html: I('chevR') })));
  s.append(h('div', { class: 'section-title' }, ico('cat'), 'Deine Patienten'), h('p', { class: 'small muted', style: { margin: '-6px 2px 10px' } }, 'Jedes Kapitel ist eine Katze. Bei 80 % ist sie gesund und kommt in deine Sammlung.'));
  s.append(patientGrid());
  s.append(h('p', { class: 'small muted center', style: { marginTop: '18px' } }, 'Am iPhone: in Safari auf „Teilen“, dann „Zum Home-Bildschirm“.'));
  app.append(s);
  clearTimeout(introTimer);
  if (!S.seenIntro) introTimer = setTimeout(intro, 300);
}

function patientGrid() {
  const g = h('div', { class: 'patients' });
  CHAPTERS.forEach((ch, i) => {
    const m = chapterMastery(ch.id), cat = catById(ch.cat);
    g.append(h('a', { class: 'patient', href: '#/k/' + ch.id, style: { '--c': ch.color } },
      h('div', { class: 'pic', html: patientSVG(ch) }, h('span', { class: 'num' }, String(i + 1)), h('span', { class: 'chi', html: I(CH_ICON[ch.id]) })),
      h('b', null, ch.short),
      h('div', { class: 'who' }, `${cat.name} · ${patientMood(m).label} · ${Math.round(m * 100)} %`),
      h('div', { class: 'bar' }, h('i', { style: { width: Math.round(m * 100) + '%' } }))));
  });
  return g;
}

function intro() {
  if ($('.modal') || S.seenIntro || location.hash.length > 2) return;
  const inp = h('input', { type: 'text', id: 'intro-name', placeholder: 'Dein Vorname', value: S.name || '', autocapitalize: 'words' });
  const close = modal(h('div', { class: 'stack center' },
    h('div', { style: { width: '140px', margin: '0 auto' }, html: docSVG('happy', ['mirror']) }),
    h('h2', null, 'Willkommen in der Katzenklinik'),
    h('p', null, 'Ich bin Dr. Schnurrhaar. Unsere Patienten sind krank, und du machst sie gesund, indem du Bio lernst.'),
    h('p', { class: 'small muted' }, 'Jedes Kapitel ist eine Katze: mit Steckbrief-Karten, Erklär-Film, Stufe 1 (antippen) und Stufe 2 (eintippen). Dazu alle Aufgaben aus deinem Heft und eine Probearbeit.'),
    h('div', { class: 'field', style: { textAlign: 'left' } }, h('label', { for: 'intro-name' }, 'Wie heißt du?'), inp),
    h('button', { class: 'btn block', onclick: () => { S.name = inp.value.trim(); S.seenIntro = true; save(); snd.ensure(); snd.meow(); snd.purr(1.4, 0.35); close(); route(); } }, 'Los geht’s'),
  ), () => { S.seenIntro = true; save(); });
}

/* ================= chapters ================= */
function topics() {
  tabs('lernen');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Kapitel'), h('p', { class: 'muted' }, 'Deine 11 Seiten in 10 Kapiteln. Jede Katze wird gesund, wenn du ihr Kapitel kannst.'));
  s.append(h('a', { class: 'card linkcard', href: '#/stoff' }, h('div', { class: 'ic', html: I('clipboard') }), h('div', null, h('b', null, 'Prüfstoff Seite für Seite'), h('span', { class: 'small muted' }, 'Alle Aufgaben aus dem Heft')), h('span', { class: 'go', html: I('chevR') })));
  s.append(h('a', { class: 'card linkcard', href: '#/videos' }, h('div', { class: 'ic', style: { background: '#fde3e3', color: '#e62d2d' }, html: I('play') }), h('div', null, h('b', null, 'Alle Erklärvideos'), h('span', { class: 'small muted' }, 'YouTube und Co., nach Kapitel sortiert')), h('span', { class: 'go', html: I('chevR') })));
  s.append(h('a', { class: 'card linkcard', href: '#/glossar', style: { marginBottom: '14px' } }, h('div', { class: 'ic', style: { background: 'var(--lav-soft)', color: 'var(--lav)' }, html: I('book') }), h('div', null, h('b', null, 'Glossar A–Z'), h('span', { class: 'small muted' }, `${GLOSSARY.length} Fachbegriffe, mit Karteikarten`)), h('span', { class: 'go', html: I('chevR') })));
  const list = h('div', { class: 'modes' });
  CHAPTERS.forEach((ch, i) => {
    const m = chapterMastery(ch.id);
    list.append(h('a', { class: 'mode', href: '#/k/' + ch.id, style: { '--c': ch.color } },
      h('div', { class: 'ic', html: I(CH_ICON[ch.id]) }),
      h('div', null, h('b', null, `${i + 1}. ${ch.title}`), h('span', { class: 'sub' }, ch.page)),
      h('span', { class: 'pct' }, Math.round(m * 100) + ' %')));
  });
  s.append(list);
  s.append(h('div', { class: 'section-title' }, ico('image'), 'Alle Abbildungen'));
  const g = h('div', { class: 'chips' });
  Object.entries(DIAGRAMS).forEach(([id, d]) => g.append(h('a', { class: 'chip', href: '#/bild/' + id }, d.title)));
  s.append(g);
  app.append(s);
}

function chapter(id) {
  const ch = chapterById(id);
  if (!ch) return nav('#/');
  tabs('lernen');
  const st = chapterState(id), m = chapterMastery(id), cat = catById(ch.cat);
  const idx = CHAPTERS.indexOf(ch);
  const s = h('div', { class: 'screen', style: { '--c': ch.color } });
  s.append(back('#/themen', 'Kapitel'));
  s.append(h('div', { class: 'chap-head' }, h('div', { class: 'pic', html: patientSVG(ch) }),
    h('div', null, h('div', { class: 'eyebrow' }, `Kapitel ${idx + 1} · ${ch.page}`), h('h1', { style: { fontSize: '1.45rem', margin: '2px 0 6px' } }, ch.title),
      h('div', { class: 'bar' }, h('i', { style: { width: Math.round(m * 100) + '%', background: ch.color } })),
      h('div', { class: 'small muted', style: { marginTop: '4px' } }, `${cat.name}: ${patientMood(m).label} · ${Math.round(m * 100)} %`))));
  s.append(h('div', { class: 'bubble', style: { margin: '14px 0 4px 8px' } }, ch.story));
  const modes = h('div', { class: 'modes', style: { marginTop: '16px' } });
  const mode = (ic, t, sub, href, pct) => h('a', { class: 'mode', href }, h('div', { class: 'ic', html: I(ic) }), h('div', null, h('b', null, t), h('span', { class: 'sub' }, sub)), pct != null ? h('span', { class: 'pct' }, pct + ' %') : h('span', { class: 'go', html: I('chevR') }));
  modes.append(
    mode('cards', 'Steckbrief-Karten', `${(CARDS[id] || []).length} Karten, kurz und kompakt`, '#/karten/' + id),
    mode('film', 'Erklär-Film', st.video ? 'angeschaut · mit Stimme' : 'ca. 2 Minuten, mit Stimme', '#/film/' + id),
    mode('play', 'Erklärvideos auf YouTube', `${(ch.yt || []).length} ausgewählte Videos und Texte`, '#/videos/' + id),
    mode('book', 'Lernkarte', st.learned ? 'gelesen · Merksätze und Korrekturen' : 'ausführlich, mit Merksätzen und Korrekturen', '#/lernen/' + id),
    mode('star', 'Stufe 1: Antippen', 'Auswählen, Zuordnen, Beschriften', `#/ueben/${id}/1`, Math.round(levelMastery(ch, 1) * 100)),
    mode('pen', 'Stufe 2: Eintippen', 'Selbst schreiben wie im Test', `#/ueben/${id}/2`, Math.round(levelMastery(ch, 2) * 100)),
    mode('clipboard', 'Kapitel-Test', 'zufällige Fragen, mit Note am Ende', '#/test/' + id),
  );
  WORKSHEETS.forEach((w, i) => { if (w.ch === id) modes.append(mode('clipboard', `Heft ${w.page}: alle Aufgaben`, w.title, '#/blatt/' + i, Math.round(sheetProgress(w) * 100))); });
  const dias = [...new Set(ch.q.filter((q) => q.t === 'label').map((q) => q.d))];
  dias.forEach((d) => modes.append(mode('image', 'Abbildung erkunden', DIAGRAMS[d].title, '#/bild/' + d)));
  modes.append(mode('list', 'Fachbegriffe', `${GLOSSARY.filter((g) => g.ch === id).length} Begriffe aus diesem Kapitel`, '#/glossar/' + id));
  s.append(modes);
  if (ch.yt && ch.yt.length) {
    s.append(h('div', { class: 'section-title' }, ico('play'), 'Gute Erklärvideos'));
    const c = videoList(ch.yt);
    c.append(h('p', { class: 'small muted', style: { margin: '8px 0 0' } }, 'Die Videos gehen manchmal über dein Heft hinaus. Für den Test zählt dein Heft.'));
    s.append(c);
  }
  app.append(s);
}

/* ---------- Steckbrief-Karten ---------- */
function cards(id) {
  const ch = chapterById(id);
  tabs('lernen');
  const list = CARDS[id] || [];
  let hidden = false;
  const s = h('div', { class: 'screen', style: { '--c': ch.color } });
  s.append(back('#/k/' + id, ch.short), h('h1', null, 'Steckbrief-Karten'));
  const tog = h('button', { class: 'btn ghost small' }, ico('eyeOff'), 'Verdeckt üben');
  tog.onclick = () => {
    hidden = !hidden;
    tog.replaceChildren(ico(hidden ? 'eye' : 'eyeOff'), hidden ? 'Alles zeigen' : 'Verdeckt üben');
    $$('.qv', s).forEach((v) => v.classList.toggle('blur', hidden)); snd.tap();
  };
  const deck = h('div', { class: 'deck' + (S.cardsView === 'list' ? ' as-list' : '') });
  const viewBtn = (v, ic, label) => h('button', { class: 'seg' + ((S.cardsView || 'swipe') === v ? ' on' : ''), onclick: (e) => { S.cardsView = v; save(); deck.classList.toggle('as-list', v === 'list'); dots.style.display = v === 'list' ? 'none' : ''; e.currentTarget.parentNode.querySelectorAll('.seg').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, ico(ic), label);
  s.append(h('div', { class: 'row wrap', style: { marginBottom: '10px', gap: '8px' } }, h('div', { class: 'segs' }, viewBtn('swipe', 'cards', 'Wischen'), viewBtn('list', 'list', 'Übersicht')), h('div', { class: 'spacer' }), tog));
  s.append(h('p', { class: 'small muted', style: { margin: '-2px 2px 8px' } }, `${list.length} Karten. Verdeckt üben: erst überlegen, dann auf den Wert tippen.`));
  const chIdx = CHAPTERS.indexOf(ch) + 1;
  list.forEach((c, i) => {
    const card = h('div', { class: 'qcardx' });
    card.append(h('div', { class: 'qh' }, h('span', { class: 'qn' }, `${chIdx}.${i + 1}`), h('b', null, c.t), h('span', { html: I(CH_ICON[id]) })));
    if (c.d) { const pic = h('div', { class: 'qp diagram', html: diagramSVG(c.d, { markers: false, arrow: c.d === 'neuron' }) }); highlight(pic, c.hl || []); card.append(pic); }
    const tb = h('div', { class: 'qrows' });
    c.rows.forEach(([k, v]) => {
      const val = h('span', { class: 'qv' }, v);
      val.onclick = () => { if (val.classList.contains('blur')) { val.classList.remove('blur'); snd.tap(); } };
      tb.append(h('div', { class: 'qr' }, h('span', { class: 'qk' }, k), val));
    });
    card.append(tb);
    if (c.tip) card.append(h('div', { class: 'qt' }, ico('bulb'), h('span', null, c.tip)));
    deck.append(card);
  });
  const dots = h('div', { class: 'deckdots', style: { display: S.cardsView === 'list' ? 'none' : '' } }, list.map((_, i) => h('i', { class: i === 0 ? 'on' : '' })));
  deck.addEventListener('scroll', () => {
    const w = deck.firstChild ? deck.firstChild.getBoundingClientRect().width + 14 : 1;
    const k = clamp(Math.round(deck.scrollLeft / w), 0, list.length - 1);
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === k));
  }, { passive: true });
  s.append(deck, dots);
  s.append(h('div', { class: 'row', style: { marginTop: '16px', gap: '10px' } },
    h('a', { class: 'btn ghost', style: { flex: 1 }, href: '#/lernen/' + id }, ico('book'), 'Mehr lesen'),
    h('a', { class: 'btn', style: { flex: 1 }, href: `#/ueben/${id}/1` }, ico('star'), 'Jetzt üben')));
  app.append(s);
  if (!chapterState(id).learned) { chapterState(id).learned = true; save(); gainXP(10); }
}

/* ---------- Lernkarte ---------- */
const BOX_ICON = { merk: 'bulb', fix: 'alert', tip: 'info', vet: 'paw' };
function learn(id) {
  const ch = chapterById(id);
  tabs('lernen');
  const s = h('div', { class: 'screen', style: { '--c': ch.color } });
  s.append(back('#/k/' + id, ch.short));
  const c = h('div', { class: 'card learn', html: ch.learn });
  $$('.box', c).forEach((b) => {
    const t = $('.t', b); if (!t) return;
    const kind = Object.keys(BOX_ICON).find((k) => b.classList.contains(k));
    t.textContent = t.textContent.replace(/^[^\p{L}\d]+/u, '').trim();
    if (kind) t.prepend(ico(BOX_ICON[kind]));
  });
  s.append(c);
  $$('[data-diagram]', c).forEach((f) => {
    const did = f.dataset.diagram;
    const d = h('div', { class: 'diagram', html: diagramSVG(did, { arrow: !!f.dataset.arrow }) });
    const cap = h('div', { class: 'cap' }, 'Tipp auf eine Nummer.');
    f.append(d, cap);
    const nums = numbering(did);
    d.addEventListener('click', (e) => {
      const mk = e.target.closest('.mk'); if (!mk) return;
      const p = partById(did, mk.dataset.part);
      $$('.mk', d).forEach((x) => x.classList.toggle('sel', x === mk));
      highlight(d, [p.id]); snd.tap();
      zoomTo(d, [p.id]);
      cap.innerHTML = `<b>${nums[p.id]} · ${esc(p.name)}</b> – ${esc(p.info)} `;
      const r = h('a', { href: '#', class: 'small' }, 'Ganzes Bild');
      r.onclick = (ev) => { ev.preventDefault(); zoomTo(d, []); highlight(d, []); $$('.mk', d).forEach((x) => x.classList.remove('sel')); cap.textContent = 'Tipp auf eine Nummer.'; };
      cap.append(r);
    });
  });
  s.append(h('div', { class: 'row', style: { marginTop: '14px', gap: '10px' } },
    h('a', { class: 'btn ghost', style: { flex: 1 }, href: '#/film/' + id }, ico('film'), 'Film'),
    h('a', { class: 'btn', style: { flex: 1 }, href: `#/ueben/${id}/1` }, ico('star'), 'Jetzt üben')));
  app.append(s);
  if (!chapterState(id).learned) { chapterState(id).learned = true; save(); gainXP(10); checkUnlocks(); }
}

/* ---------- explore a diagram ---------- */
function explore(did) {
  const D = DIAGRAMS[did];
  if (!D) return nav('#/');
  tabs('lernen');
  const nums = numbering(did);
  const s = h('div', { class: 'screen' });
  s.append(back('#/themen', 'Abbildungen'), h('h1', null, D.title));
  if (D.note) s.append(h('p', { class: 'small muted' }, D.note));
  const d = h('div', { class: 'diagram card', html: diagramSVG(did, { arrow: did === 'neuron' }) });
  const cap = h('div', { class: 'card tint-teal', style: { marginTop: '10px', minHeight: '76px' } }, 'Tipp auf eine Nummer. Dann siehst du den Namen und was der Teil macht.');
  s.append(d, cap);
  const legend = h('div', { class: 'slots' });
  let showAll = false;
  const tog = h('button', { class: 'btn ghost small', style: { marginTop: '12px' } }, ico('eye'), 'Alle Namen zeigen');
  tog.onclick = () => { showAll = !showAll; tog.replaceChildren(ico(showAll ? 'eyeOff' : 'eye'), showAll ? 'Namen verstecken' : 'Alle Namen zeigen'); $$('.val', legend).forEach((v) => v.classList.toggle('blur', !showAll)); };
  D.parts.slice().sort((a, b) => String(nums[a.id]).localeCompare(String(nums[b.id]), 'de', { numeric: true })).forEach((p) => {
    const v = h('span', { class: 'val set blur' }, p.name);
    const el = h('div', { class: 'slot' }, h('span', { class: 'n' }, nums[p.id]), v);
    el.onclick = () => { v.classList.remove('blur'); pickPart(p); };
    legend.append(el);
  });
  const whole = h('button', { class: 'btn ghost small', style: { marginTop: '12px', display: 'none' } }, ico('shrink'), 'Ganzes Bild');
  whole.onclick = () => { zoomTo(d, []); highlight(d, []); $$('.mk', d).forEach((x) => x.classList.remove('sel')); whole.style.display = 'none'; };
  function pickPart(p) {
    $$('.mk', d).forEach((x) => x.classList.toggle('sel', x.dataset.part === p.id));
    highlight(d, [p.id]); snd.tap();
    zoomTo(d, [p.id]); whole.style.display = '';
    cap.innerHTML = `<b>${nums[p.id]} · ${esc(p.name)}</b><br>${esc(p.info)}`;
    d.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  d.addEventListener('click', (e) => { const mk = e.target.closest('.mk'); if (mk) pickPart(partById(did, mk.dataset.part)); });
  s.append(h('div', { class: 'row wrap', style: { gap: '8px' } }, tog, whole), legend);
  const ch = CHAPTERS.find((c) => c.q.some((q) => q.t === 'label' && q.d === did));
  if (ch) s.append(h('a', { class: 'btn block', style: { marginTop: '14px' }, href: `#/ueben/${ch.id}/1` }, ico('star'), 'Beschriften üben'));
  app.append(s);
}

/* ---------- Erklär-Film ---------- */
function film(id) {
  const ch = chapterById(id);
  tabs('lernen');
  const scenes = ch.video;
  let i = 0, playing = false, timer = null, finished = false;
  const s = h('div', { class: 'screen' });
  s.append(back('#/k/' + id, ch.short), h('h1', null, 'Erklär-Film: ' + ch.short));
  const stage = h('div', { class: 'stage' });
  const sub = h('div', { class: 'sub' });
  const bar = h('i', { style: { width: '0%' } });
  const playBtn = h('button', { class: 'btn small', style: { minWidth: '124px' } });
  const prev = h('button', { class: 'iconbtn', title: 'Zurück', html: I('prev') }), next = h('button', { class: 'iconbtn', title: 'Weiter', html: I('next') });
  const voiceBtn = h('button', { class: 'iconbtn', 'aria-pressed': String(S.settings.voice), title: 'Stimme an/aus', html: I('voice') });
  const bigBtn = h('button', { class: 'iconbtn', title: 'Vergrößern', html: I('expand') });
  setPlay('play', 'Abspielen');
  const player = h('div', { class: 'player' }, stage, sub, h('div', { class: 'ctrl' }, prev, playBtn, next, h('div', { class: 'bar' }, bar), voiceBtn, bigBtn));
  bigBtn.onclick = () => {
    const on = !player.classList.contains('full');
    player.classList.toggle('full', on); document.body.classList.toggle('noscroll', on);
    bigBtn.innerHTML = I(on ? 'shrink' : 'expand'); bigBtn.title = on ? 'Verkleinern' : 'Vergrößern';
    setTimeout(() => show(i, true), 60);
  };
  s.append(player, voiceHint());
  // what to do next: practice links right under the film
  const practice = h('div', { class: 'modes' });
  const pm = (ic, t, sub, href) => h('a', { class: 'mode', href, style: { '--c': ch.color } }, h('div', { class: 'ic', html: I(ic) }), h('div', null, h('b', null, t), h('span', { class: 'sub' }, sub)), h('span', { class: 'go', html: I('chevR') }));
  practice.append(
    pm('star', 'Stufe 1: Antippen', 'gleich nach dem Film am besten', `#/ueben/${id}/1`),
    pm('pen', 'Stufe 2: Eintippen', 'selbst schreiben wie im Test', `#/ueben/${id}/2`),
    ...WORKSHEETS.map((w, k) => (w.ch === id ? pm('clipboard', `Heft ${w.page}: alle Aufgaben`, w.title, '#/blatt/' + k) : null)).filter(Boolean),
    pm('cards', 'Steckbrief-Karten', 'alles kurz auf einen Blick', '#/karten/' + id),
    pm('book', 'Lernkarte', 'zum Nachlesen, mit Merksätzen', '#/lernen/' + id),
    pm('clipboard', 'Kapitel-Test', 'zufällige Fragen, mit Note', '#/test/' + id),
    pm('clock', 'Probearbeit', '20 Minuten, mit Note', '#/probe'),
  );
  s.append(h('div', { class: 'section-title' }, ico('target'), 'Jetzt üben'), practice);
  if (ch.yt && ch.yt.length) s.append(h('div', { class: 'section-title' }, ico('play'), 'Mehr Erklärvideos zu diesem Thema'), videoList(ch.yt));
  app.append(s);
  function setPlay(ic, label) { playBtn.replaceChildren(ico(ic), label); }
  let lastD = null, lastVB = null;
  function show(k, keepView) {
    i = clamp(k, 0, scenes.length - 1);
    const sc = scenes[i];
    stage.innerHTML = '';
    stage.append(h('div', { class: 'title' }, `${i + 1} / ${scenes.length}`));
    let inner;
    if (sc.d) {
      inner = h('div', { class: 'scene diagram', html: diagramSVG(sc.d, { markers: false, arrow: sc.d === 'neuron' }) }); highlight(inner, sc.hl || []);
      const names = (sc.hl || []).map((pid) => DIAGRAMS[sc.d].parts.find((p) => p.id === pid)?.name).filter(Boolean);
      if (names.length) stage.append(h('div', { class: 'focuschip' }, ico('target'), 'Im Fokus: ' + names.join(' · ')));
    }
    else if (sc.big) inner = h('div', { class: 'scene' }, h('div', { class: 'bigtext' }, h('div', { class: 'bt', html: esc(sc.big).replace(/\n/g, '<br>') }), h('div', { class: 'mini', html: docSVG('happy') })));
    else { const c = sc.cat === 'doc' ? docSVG('happy', ['mirror']) : sc.cat === 'sick' ? catPic(catById(ch.cat), 'sick', ['thermo']) : catPic(catById(sc.cat) || catById(ch.cat), 'happy'); inner = h('div', { class: 'scene', html: `<div style="width:60%;max-width:280px">${c}</div>` }); }
    stage.append(inner);
    if (sc.d) {
      const svg = inner.querySelector('svg');
      const from = lastD === sc.d && lastVB && !keepView ? lastVB : null;
      if (from) svg.setAttribute('viewBox', from.join(' '));
      const box = stage.getBoundingClientRect();
      lastVB = zoomTo(inner, sc.hl || [], { from: from || undefined, aspect: box.width / Math.max(1, box.height - 20), minFrac: 0.38, duration: from ? 800 : 900 });
      lastD = sc.d;
    } else { lastD = null; lastVB = null; }
    sub.textContent = sc.say;
    bar.style.width = Math.round(((i + 1) / scenes.length) * 100) + '%';
  }
  function speak(text, cb) {
    clearTimeout(timer);
    if (!S.settings.voice) { timer = setTimeout(cb, Math.max(3200, text.split(' ').length * 420)); return; }
    snd.duck(true);
    if (voice.hasFile(id, i)) voice.playFile(id, i, (err) => (err ? voice.speak(text, () => { timer = setTimeout(cb, 350); }) : (timer = setTimeout(cb, 350))));
    else voice.speak(text, () => { timer = setTimeout(cb, 350); });
  }
  function run() {
    if (!playing) return;
    show(i);
    speak(scenes[i].say, () => { if (!playing) return; if (i < scenes.length - 1) { i++; run(); } else finish(); });
  }
  function finish() {
    playing = false; finished = true; setPlay('refresh', 'Nochmal'); snd.duck(false);
    const st = chapterState(id);
    if (!st.video) { st.video = true; save(); gainXP(15); toast('Film geschaut: +15 Leckerli', docSVG('happy')); }
    stage.append(h('div', { class: 'scene', style: { background: 'color-mix(in srgb, var(--bg2) 94%, transparent)' } },
      h('div', { class: 'center stack' }, h('div', { style: { width: '110px', margin: '0 auto' }, html: docSVG('wink') }), h('b', null, 'Fertig! Jetzt bist du dran:'), h('a', { class: 'btn', href: `#/ueben/${id}/1` }, ico('star'), 'Stufe 1 üben'))));
  }
  playBtn.onclick = () => {
    snd.ensure();
    if (playing) { playing = false; voice.stop(); clearTimeout(timer); setPlay('play', 'Weiter'); snd.duck(false); return; }
    if (finished) { i = 0; finished = false; }
    playing = true; setPlay('pause', 'Pause'); run();
  };
  prev.onclick = () => { voice.stop(); clearTimeout(timer); show(i - 1); if (playing) run(); };
  next.onclick = () => { voice.stop(); clearTimeout(timer); show(i + 1); if (playing) run(); };
  voiceBtn.onclick = () => { S.settings.voice = !S.settings.voice; save(); voiceBtn.setAttribute('aria-pressed', String(S.settings.voice)); };
  show(0);
  cleanup = () => { playing = false; clearTimeout(timer); voice.stop(); snd.duck(false); document.body.classList.remove('noscroll'); };
}

function voiceHint() {
  if (voice.AUDIO.available) return h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Gesprochen mit einer aufgenommenen KI-Stimme.');
  const q = voice.voiceQuality();
  return h('div', { class: 'box tip', style: { marginTop: '12px' } }, h('span', { class: 't' }, ico('voice'), q === 'gut' ? 'Stimme: ' + (voice.currentVoice()?.name || '') : 'Tipp: schönere Stimme'),
    q === 'gut' ? 'Kein Ton? Lautlos-Schalter prüfen und die Lautstärke hochdrehen.' : h('span', null, 'Am iPhone gibt es viel natürlichere Stimmen: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Deutsch → „Anna (Premium)“ oder „Helena (Premium)“ laden. Danach in der App unter ', h('a', { href: '#/einstellungen' }, 'Einstellungen'), ' auswählen.'));
}

/* ================= practice ================= */
function mixIntro() {
  tabs('ueben');
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'card intro' },
    h('div', { class: 'cat', html: docSVG('happy', ['stetho']) }),
    h('h1', null, 'Schnell-Runde'),
    h('p', { class: 'muted' }, 'Zehn gemischte Fragen aus allen Kapiteln. Das ist die wirksamste Art zu üben.'),
    h('ul', null,
      h('li', null, ico('target'), h('span', null, 'Fragen, die du noch nicht sicher kannst, kommen zuerst.')),
      h('li', null, ico('pen'), h('span', null, 'Kapitel, die du in Stufe 1 schon gut kannst, kommen zum Eintippen.')),
      h('li', null, ico('refresh'), h('span', null, 'Falsche Antworten kommen in derselben Runde nochmal.')),
      h('li', null, ico('flame'), h('span', null, 'Ab 3 richtigen in Folge gibt es Bonus-Leckerli.'))),
    h('a', { class: 'btn block', href: '#/mix/los' }, ico('bolt'), 'Runde starten')));
  s.append(h('div', { class: 'section-title' }, ico('trophy'), 'Das große Bio-Quiz'));
  s.append(h('a', { class: 'card linkcard', href: '#/test', style: { marginBottom: '10px' } }, h('div', { class: 'ic', style: { background: 'var(--lav-soft)', color: 'var(--lav)' }, html: I('clipboard') }), h('div', null, h('b', null, 'Test-Baukasten'), h('span', { class: 'small muted' }, 'Zufällige Tests: gesamt oder pro Kapitel, 10 bis alle Fragen, mit Note · Komplett-Check')), h('span', { class: 'go', html: I('chevR') })));
  const fp = S.full && S.full.order ? Math.min(S.full.pos, S.full.order.length) : 0;
  s.append(h('div', { class: 'modes' },
    h('a', { class: 'mode', href: '#/show', style: { '--c': 'var(--sun)' } }, h('div', { class: 'ic', html: I('trophy') }), h('div', null, h('b', null, 'Wer wird Tierärztin?'), h('span', { class: 'sub' }, '15 Fragen, immer schwerer · 3 Joker · 3 Leben')), h('span', { class: 'go', html: I('chevR') })),
    h('a', { class: 'mode', href: '#/alle', style: { '--c': 'var(--accent)' } }, h('div', { class: 'ic', html: I('list') }), h('div', null, h('b', null, 'Der große Durchgang'), h('span', { class: 'sub' }, fp ? `Aufgabe ${fp} von ${S.full.order.length} · weitermachen` : `alle ${ALL_QUESTIONS.length} Aufgaben des Prüfstoffs`)), h('span', { class: 'go', html: I('chevR') }))));
  s.append(h('div', { class: 'section-title' }, ico('list'), 'Oder gezielt üben'));
  s.append(h('div', { class: 'modes' },
    h('a', { class: 'mode', href: '#/stoff' }, h('div', { class: 'ic', html: I('clipboard') }), h('div', null, h('b', null, 'Prüfstoff Seite für Seite'), h('span', { class: 'sub' }, 'alle Aufgaben aus dem Heft')), h('span', { class: 'go', html: I('chevR') })),
    h('a', { class: 'mode', href: '#/probe', style: { '--c': 'var(--lav)' } }, h('div', { class: 'ic', html: I('clock') }), h('div', null, h('b', null, 'Probearbeit'), h('span', { class: 'sub' }, '20 Minuten, mit Note')), h('span', { class: 'go', html: I('chevR') })),
    h('a', { class: 'mode', href: '#/themen', style: { '--c': 'var(--accent)' } }, h('div', { class: 'ic', html: I('book') }), h('div', null, h('b', null, 'Ein Kapitel üben'), h('span', { class: 'sub' }, 'Stufe 1 oder Stufe 2')), h('span', { class: 'go', html: I('chevR') }))));
  app.append(s);
}

function quiz({ chapter: cid, level, mix, sheet: sheetIdx, retry, custom }) {
  focusMode(true);
  tabs('ueben');
  let queue, backHref = '#/', title = '';
  if (mix) {
    const pool = [];
    for (const ch of CHAPTERS) {
      const lv = levelMastery(ch, 1) >= 0.7 ? 2 : 1;
      pickSession(ch.q.filter((q) => q.t !== 'explain'), lv, 3).forEach((q) => pool.push({ q, level: lv }));
    }
    queue = shuffle(shuffle(pool).sort((a, b) => item(itemKey(a.q, a.level)).box - item(itemKey(b.q, b.level)).box).slice(0, 10));
    backHref = '#/mix'; title = 'Schnell-Runde';
  } else if (custom) {
    queue = custom.items; backHref = '#/test'; title = custom.title;
  } else if (retry) {
    queue = (S.retry || []).map((x) => ({ q: QBYID[x.id], level: x.level })).filter((x) => x.q);
    backHref = '#/mix'; title = 'Fehler nochmal';
  } else if (sheetIdx != null) {
    const w = WORKSHEETS[sheetIdx];
    if (!w) return nav('#/stoff');
    queue = w.tasks.map((t) => QBYID[t.ref]).filter(Boolean).map((q) => ({ q, level: usableAt(q, 2) ? 2 : 1 }));
    backHref = '#/stoff'; title = `Heft ${w.page}`;
  } else {
    queue = pickSession(chapterById(cid).q, level, 10).map((q) => ({ q, level }));
    backHref = '#/k/' + cid; title = `Stufe ${level}`;
  }
  if (!queue.length) { app.append(h('p', null, 'Keine Fragen gefunden.')); return; }
  snd.moodMusic('happy');
  const total = queue.length;
  let pos = 0, combo = 0, xp = 0, firstScores = 0, firstCount = 0;
  const requeued = new Set();
  const s = h('div', { class: 'screen' });
  const barI = h('i', { style: { width: '0%' } });
  const comboEl = h('div', { class: 'combo' });
  s.append(h('div', { class: 'qtop' }, h('button', { class: 'close', title: 'Beenden', html: I('x'), onclick: () => nav(backHref) }), h('div', { class: 'bar' }, barI), comboEl));
  const meta = h('div', { class: 'qmeta' });
  const body = h('div');
  s.append(meta, body);
  app.append(s);
  next();

  function next() {
    if (pos >= queue.length) return end();
    const { q, level: lv } = queue[pos];
    const ch = chapterById(q.ch);
    meta.replaceChildren(
      h('span', null, `${title} · Frage ${pos + 1} von ${queue.length}`),
      ch ? h('span', { class: 'chn', style: { '--c': ch.color } }, ico(CH_ICON[ch.id]), ch.short) : '');
    body.innerHTML = '';
    body.append(renderQuestion(q, { level: lv, exam: false, done: (res) => answer(q, lv, res) }));
    barI.style.width = Math.round((pos / queue.length) * 100) + '%';
  }
  function answer(q, lv, res) {
    record(itemKey(q, lv), res.ok, res.score);
    if (pos < total) { firstScores += res.score; firstCount++; }
    if (res.ok) { combo++; S.stats.bestCombo = Math.max(S.stats.bestCombo, combo); } else combo = 0;
    const gain = Math.round((lv === 2 ? 20 : 10) * res.score + (res.ok ? Math.min(10, Math.max(0, combo - 1) * 2) : 0));
    xp += gain;
    if (res.ok) snd.correct(combo); else snd.wrong();
    if (combo >= 3) { comboEl.replaceChildren(ico('flame'), String(combo)); comboEl.classList.remove('hot'); void comboEl.offsetWidth; comboEl.classList.add('hot'); if (combo % 5 === 0) snd.purr(1.2, 0.4); } else comboEl.replaceChildren();
    if (!res.ok && res.score < 0.5 && !requeued.has(q.id + ':' + lv)) { requeued.add(q.id + ':' + lv); queue.splice(Math.min(queue.length, pos + 3), 0, { q, level: lv }); }
    save();
    feedbackSheet(res, gain);
  }
  function feedbackSheet(res, gain) {
    const ok = res.ok;
    const head = ok ? pick(['Super!', 'Miau-tastisch!', 'Perfekt!', 'Pfotenstark!', 'Richtig!', 'Schnurr-genial!']) : (res.score >= 0.5 ? 'Fast!' : pick(['Nicht ganz.', 'Hoppla!', 'Noch nicht.']));
    const el = h('div', { class: 'sheet ' + (ok ? 'ok' : 'bad') }, h('div', { class: 'inner' },
      h('div', { class: 'head', html: (ok ? docSVG('wink') : docSVG('sick')) + `<span>${head}${gain ? ` <span class="small">+${gain} Leckerli</span>` : ''}</span>` }),
      h('div', { class: 'expl', html: (res.html || '') + explainMore(queue[pos].q, res) }),
      h('button', { class: 'btn', onclick: () => { el.remove(); pos++; next(); } }, ok ? 'Weiter' : 'Verstanden, weiter', ico('arrowR'))));
    document.body.append(el);
    el.querySelector('button').focus({ preventScroll: true });
  }
  function end() {
    focusMode(false);
    const pct = firstCount ? firstScores / firstCount : 0;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    gainXP(xp + stars * 5);
    if (cid) { const st = chapterState(cid); st['l' + level] = Math.max(st['l' + level] || 0, pct); }
    if ((level === 2 || sheetIdx != null) && pct >= 0.5) S.stats.typedRound = true;
    save();
    snd.moodMusic(S.settings.track);
    if (stars >= 2) { snd.purr(1.8, 0.45); confetti(stars === 3 ? 90 : 40); } else snd.meow({ pitch: 0.9 });
    const ch = cid ? chapterById(cid) : null;
    meta.replaceChildren(h('span', null, title + ' · fertig'));
    body.innerHTML = '';
    barI.style.width = '100%';
    const starEl = h('div', { class: 'stars' });
    for (let k = 0; k < 3; k++) starEl.append(frag(I('star', k < stars ? 'on' : '')));
    body.append(h('div', { class: 'result card' },
      h('div', { class: 'cat', html: ch ? patientSVG(ch) : docSVG(stars >= 2 ? 'wow' : 'happy') }),
      starEl,
      h('h2', null, stars === 3 ? 'Ausgezeichnet!' : stars === 2 ? 'Sehr gut gemacht!' : stars === 1 ? 'Guter Anfang!' : 'Weiter üben, du schaffst das!'),
      ch ? h('p', { class: 'muted' }, `${catById(ch.cat).name} ist jetzt zu ${Math.round(chapterMastery(cid) * 100)} % gesund.`) : null,
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, Math.round(pct * 100) + ' %'), h('span', null, 'beim ersten Versuch')), h('div', { class: 'stat' }, h('b', null, '+' + (xp + stars * 5)), h('span', null, 'Leckerli')), h('div', { class: 'stat' }, h('b', null, String(S.stats.bestCombo)), h('span', null, 'beste Serie'))),
      h('div', { class: 'stack' },
        h('button', { class: 'btn block', onclick: () => route() }, ico('refresh'), 'Noch eine Runde'),
        cid && level === 1 && pct >= 0.7 ? h('a', { class: 'btn coral block', href: `#/ueben/${cid}/2` }, ico('pen'), 'Weiter mit Stufe 2') : null,
        h('a', { class: 'btn ghost block', href: backHref }, 'Zurück'))));
    checkUnlocks();
  }
  cleanup = () => { $$('.sheet').forEach((x) => x.remove()); snd.moodMusic(S.settings.track); };
}


/* ================= Wer wird Tierärztin? (quiz show) ================= */
const LADDER = [10, 20, 30, 50, 80, 120, 160, 200, 250, 300, 400, 500, 650, 800, 1000];
const CHOICE = new Set(['mc', 'pick']);
function showPools() {
  const small = (q) => q.t !== 'label' || (q.parts === 'all' ? DIAGRAMS[q.d].parts.length <= 7 : q.parts.length <= 7);
  const A = ALL_QUESTIONS.filter((q) => ['fact', 'mc', 'tf', 'pick'].includes(q.t)).map((q) => ({ q, level: 1 }));
  const B = ALL_QUESTIONS.filter((q) => ['match', 'order', 'sort', 'multi', 'cloze', 'formula', 'label'].includes(q.t) && small(q)).map((q) => ({ q, level: 1 }));
  const C = ALL_QUESTIONS.filter((q) => ['fact', 'cloze', 'formula', 'label'].includes(q.t) && small(q)).map((q) => ({ q, level: 2 }));
  return [A, B, C];
}
function spread(pool, n, used) {
  // different chapters first, never the same question twice
  const out = [], chs = new Set();
  for (const x of shuffle(pool)) { if (out.length >= n) break; if (used.has(x.q.id) || chs.has(x.q.ch)) continue; out.push(x); chs.add(x.q.ch); used.add(x.q.id); }
  for (const x of shuffle(pool)) { if (out.length >= n) break; if (!used.has(x.q.id)) { out.push(x); used.add(x.q.id); } }
  return out;
}
function hintFor(q, level) {
  const first = (s) => s.split(' ').map((w) => w[0] + w.slice(1).replace(/[^\s]/g, '·')).join(' ');
  if (q.t === 'fact') return level === 1 ? `Es ist nicht „${q.wrong[0]}“.` : `Die Antwort sieht so aus: ${first(q.a)}`;
  if (CHOICE.has(q.t)) return `Es ist nicht „${q.wrong[0]}“.`;
  if (q.t === 'multi') return `Eine richtige Antwort ist „${q.right[0]}“.`;
  if (q.t === 'order') return `Ganz vorne steht „${q.items[0]}“.`;
  if (q.t === 'match') { const p = pick(q.pairs); return `„${p[0]}“ gehört zu „${p[1]}“.`; }
  if (q.t === 'sort') { const it = pick(q.items); return `„${it[0]}“ gehört zu „${q.buckets[it[1]]}“.`; }
  if (q.t === 'cloze') { const m = q.text.match(/\{([^}|]+)/); return m ? `Die erste Lücke heißt „${m[1]}“.` : ''; }
  if (q.t === 'label') { const D = DIAGRAMS[q.d]; const ids = q.parts === 'all' ? D.parts.map((p) => p.id) : q.parts; const nums = numbering(q.d, q.parts === 'all' ? null : ids); const p = D.parts.find((x) => x.id === ids[0]); return `Nummer ${nums[p.id]} heißt „${p.name}“.`; }
  if (q.t === 'formula') return q.which === 'milch' ? 'Im Milchgebiss sind es pro Viertel 5 Zähne, Prämolaren gibt es noch nicht.' : 'Im Dauergebiss sind es pro Viertel 8 Zähne.';
  return '';
}
function showIntro() {
  tabs('ueben');
  const best = S.showBest || 0;
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'card intro' },
    h('div', { class: 'cat', html: docSVG('wow', ['crown']) }),
    h('h1', null, 'Wer wird Tierärztin?'),
    h('p', { class: 'muted' }, 'Die Quizshow der Katzenklinik. 15 Fragen aus dem ganzen Stoff, jede Stufe ein bisschen schwerer.'),
    h('ul', null,
      h('li', null, ico('list'), h('span', null, 'Fragen 1–5: Auswahl. Fragen 6–10: Zuordnen, Reihenfolge, Beschriften. Fragen 11–15: selbst eintippen.')),
      h('li', null, ico('sparkle'), h('span', null, '3 Joker: 50:50, Tipp von Dr. Schnurrhaar, Frage tauschen. Jeder nur einmal.')),
      h('li', null, ico('paw'), h('span', null, '3 Leben. Nach jeder Antwort siehst du die Erklärung, so lernst du auch aus Fehlern.')),
      h('li', null, ico('fish'), h('span', null, 'Bis zu 1000 Leckerli. Dein Rekord: Stufe ' + best + ' von 15.'))),
    h('a', { class: 'btn sun block', href: '#/show/los' }, ico('trophy'), 'Show starten')));
  app.append(s);
}
function showRun() {
  focusMode(true);
  tabs('ueben');
  snd.moodMusic('happy');
  const used = new Set();
  const [A, B, C] = showPools();
  const qs = [...spread(A, 5, used), ...spread(B, 5, used), ...spread(C, 5, used)];
  let step = 0, lives = 3, jokerUsed = false;
  const jokers = { fifty: true, hint: true, swap: true };
  const missed = [];
  const s = h('div', { class: 'screen' });
  const livesEl = h('div', { class: 'combo', style: { color: 'var(--lav)' } });
  const ladder = h('div', { class: 'ladder' });
  const head = h('div', { class: 'qtop' }, h('button', { class: 'close', title: 'Beenden', html: I('x'), onclick: () => ask('Show beenden?', 'Ja, beenden', () => finish(false)) }), ladder, livesEl);
  const jrow = h('div', { class: 'jokers' });
  const hintBox = h('div');
  const body = h('div');
  s.append(head, jrow, hintBox, body);
  app.append(s);
  render();
  function drawTop() {
    ladder.replaceChildren(...LADDER.map((v, k) => h('i', { class: (k < step ? 'done' : k === step ? 'on' : '') + (k === 4 || k === 9 ? ' safe' : ''), title: v + ' Leckerli' })));
    livesEl.replaceChildren(...Array.from({ length: 3 }, (_, k) => frag(I('paw', k < lives ? 'on' : 'off'))));
  }
  function render() {
    if (step >= qs.length) return finish(true);
    drawTop();
    const { q, level } = qs[step];
    hintBox.replaceChildren();
    const mkJ = (key, ic, label, enabled, fn) => { const b = h('button', { class: 'joker', disabled: !(jokers[key] && enabled) }, ico(ic), label); b.onclick = () => { jokers[key] = false; if (key !== 'swap') jokerUsed = true; snd.whoosh(); fn(); }; return b; };
    const isChoice = (q.t === 'fact' && level === 1) || CHOICE.has(q.t);
    jrow.replaceChildren(
      h('div', { class: 'stepinfo' }, h('b', null, `Frage ${step + 1} von 15`), h('span', null, `um ${LADDER[step]} Leckerli`)),
      mkJ('fifty', 'target', '50:50', isChoice, () => draw({ fifty: true })),
      mkJ('hint', 'bulb', 'Tipp', !!hintFor(q, level), () => { hintBox.replaceChildren(h('div', { class: 'box tip' }, h('span', { class: 't' }, ico('steth'), 'Dr. Schnurrhaar flüstert:'), hintFor(q, level))); render2(); }),
      mkJ('swap', 'refresh', 'Tauschen', true, () => { const pool = step < 5 ? A : step < 10 ? B : C; const alt = spread(pool, 1, used)[0]; if (alt) qs[step] = alt; render(); }),
    );
    draw({});
    function render2() { [...jrow.querySelectorAll('.joker')].forEach((b) => { if (!jokers.fifty && b.textContent.includes('50')) b.disabled = true; if (!jokers.hint && b.textContent.includes('Tipp')) b.disabled = true; if (!jokers.swap && b.textContent.includes('Tauschen')) b.disabled = true; }); }
  }
  function draw(extra) {
    const { q, level } = qs[step];
    body.replaceChildren(renderQuestion(q, { level, exam: false, ...extra, done: (res) => answer(q, level, res) }));
    [...jrow.querySelectorAll('.joker')].forEach((b) => { if (b.textContent.includes('50') && !jokers.fifty) b.disabled = true; });
  }
  function answer(q, level, res) {
    // an answer found with a joker counts as "guessed": it does not count as known yet
    record(itemKey(q, level), res.ok && !jokerUsed, jokerUsed ? Math.min(res.score, 0.5) : res.score);
    jokerUsed = false;
    const ok = res.ok || res.score >= 0.8;
    if (!ok) missed.push({ id: q.id, level, q: q.q, html: res.html });
    if (ok) { snd.correct(step); if (step === 4 || step === 9) snd.fanfare(); } else { lives--; snd.wrong(); }
    drawTop();
    const el = h('div', { class: 'sheet ' + (ok ? 'ok' : 'bad') }, h('div', { class: 'inner' },
      h('div', { class: 'head', html: (ok ? docSVG('wink') : docSVG('sick')) + `<span>${ok ? (step === 14 ? 'Gewonnen!' : `Richtig! ${LADDER[step]} Leckerli`) : (lives > 0 ? `Leider falsch. Noch ${lives} ${lives === 1 ? 'Leben' : 'Leben'}` : 'Leider falsch, keine Leben mehr')}</span>` }),
      h('div', { class: 'expl', html: (res.html || '') + explainMore(q, res) }),
      h('button', { class: 'btn', onclick: () => { el.remove(); if (ok) step++; else if (lives > 0) { const pool = step < 5 ? A : step < 10 ? B : C; const alt = spread(pool, 1, used)[0]; if (alt) qs[step] = alt; } if (lives <= 0) finish(false); else render(); } }, lives > 0 || ok ? 'Weiter' : 'Ergebnis', ico('arrowR'))));
    document.body.append(el);
    save();
  }
  function finish(won) {
    $$('.sheet').forEach((x) => x.remove());
    focusMode(false);
    const reached = step;
    const prize = reached ? LADDER[reached - 1] : 0;
    S.showBest = Math.max(S.showBest || 0, reached);
    gainXP(prize);
    save();
    snd.moodMusic(S.settings.track);
    if (won) { snd.fanfare(); confetti(120); } else if (reached >= 5) { snd.purr(1.6, 0.4); confetti(40); } else snd.meow();
    jrow.replaceChildren(); hintBox.replaceChildren(); drawTop();
    S.retry = missed.map((m) => ({ id: m.id, level: m.level })); save();
    body.replaceChildren(h('div', { class: 'result card' },
      h('div', { class: 'cat', html: docSVG(won ? 'wow' : 'happy', won ? ['crown'] : ['stetho']) }),
      h('div', { class: 'grade' }, `${reached}/15`),
      h('h2', null, won ? 'Du bist Tierärztin! Alle 15 Fragen geschafft.' : reached >= 10 ? 'Großartig, fast ganz oben!' : reached >= 5 ? 'Gut gemacht!' : 'Guter Versuch!'),
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, String(reached)), h('span', null, 'Stufen')), h('div', { class: 'stat' }, h('b', null, '+' + prize), h('span', null, 'Leckerli')), h('div', { class: 'stat' }, h('b', null, String(S.showBest)), h('span', null, 'Rekord'))),
      h('div', { class: 'stack' }, h('button', { class: 'btn sun block', onclick: () => route() }, ico('refresh'), 'Nochmal spielen'),
        missed.length ? h('a', { class: 'btn coral block', href: '#/nochmal' }, ico('target'), `Nur die ${missed.length} Fehler nochmal`) : null,
        h('a', { class: 'btn ghost block', href: '#/mix' }, 'Zurück'))));
    if (missed.length) {
      body.append(h('div', { class: 'section-title' }, ico('list'), 'Deine Fehler mit Erklärung'));
      missed.forEach((m) => body.append(h('div', { class: 'card', style: { borderLeft: '5px solid var(--bad)' } }, h('b', null, m.q), h('div', { class: 'small', style: { marginTop: '6px' }, html: m.html || '' }))));
    }
    checkUnlocks();
  }
  cleanup = () => { $$('.sheet').forEach((x) => x.remove()); snd.moodMusic(S.settings.track); };
}

/* ================= Der große Durchgang (complete material) ================= */
function fullOrder(mode) {
  const qs = ALL_QUESTIONS.slice();
  if (mode === 'mix') return shuffle(qs).map((q) => q.id);
  return CHAPTERS.flatMap((c) => shuffle(c.q)).map((q) => q.id);
}
function fullIntro() {
  tabs('ueben');
  const F = S.full;
  const s = h('div', { class: 'screen' });
  const c = h('div', { class: 'card intro' },
    h('div', { class: 'cat', html: docSVG('happy', ['book']) }),
    h('h1', null, 'Der große Durchgang'),
    h('p', { class: 'muted' }, `Alle ${ALL_QUESTIONS.length} Aufgaben des Prüfstoffs, eine nach der anderen. Du kannst jederzeit aufhören und später weitermachen.`),
    h('ul', null,
      h('li', null, ico('check'), h('span', null, 'Nach jeder richtigen Antwort: „Sicher gewusst“ oder „Geraten“. Geratenes kommt später nochmal.')),
      h('li', null, ico('refresh'), h('span', null, 'Falsche Antworten kommen ein paar Aufgaben später wieder.')),
      h('li', null, ico('pen'), h('span', null, 'Was du schon antippen kannst, fragt die App zum Eintippen ab.'))));
  if (F && F.order && F.pos < F.order.length) {
    c.append(h('div', { class: 'bar', style: { margin: '6px 0 6px' } }, h('i', { style: { width: Math.round((F.pos / F.order.length) * 100) + '%' } })),
      h('p', { class: 'small muted' }, `Du bist bei Aufgabe ${F.pos + 1} von ${F.order.length}.`),
      h('a', { class: 'btn coral block', href: '#/alle/los' }, ico('play'), 'Weitermachen'),
      h('div', { class: 'row', style: { marginTop: '10px', gap: '10px' } },
        h('button', { class: 'btn ghost small', style: { flex: 1 }, onclick: () => ask('Von vorne anfangen?', 'Ja, nach Kapiteln', () => start('chapters')) }, 'Neu: nach Kapiteln'),
        h('button', { class: 'btn ghost small', style: { flex: 1 }, onclick: () => ask('Von vorne anfangen?', 'Ja, gemischt', () => start('mix')) }, 'Neu: gemischt')));
  } else {
    if (F && F.order && F.pos >= F.order.length) c.append(h('p', null, h('span', { class: 'tag done' }, 'Letzter Durchgang komplett geschafft!')));
    c.append(h('div', { class: 'stack' },
      h('button', { class: 'btn coral block', onclick: () => start('chapters') }, ico('book'), 'Start: Kapitel für Kapitel'),
      h('button', { class: 'btn ghost block', onclick: () => start('mix') }, ico('refresh'), 'Start: alles gemischt')));
  }
  s.append(c);
  app.append(s);
  function start(mode) { S.full = { order: fullOrder(mode), pos: 0, mode, sure: 0, guessed: 0, wrong: 0 }; save(); nav('#/alle/los'); }
}
function fullRun() {
  const F = S.full;
  if (!F || !F.order) return nav('#/alle');
  focusMode(true);
  tabs('ueben');
  snd.moodMusic('lofi');
  const requeued = new Set();
  const s = h('div', { class: 'screen' });
  const barI = h('i');
  s.append(h('div', { class: 'qtop' }, h('button', { class: 'close', title: 'Pause', html: I('pause'), onclick: () => nav('#/alle') }), h('div', { class: 'bar' }, barI), h('div', { class: 'combo', style: { color: 'var(--muted)', minWidth: '84px' } }, '')));
  const meta = h('div', { class: 'qmeta' });
  const body = h('div');
  s.append(meta, body);
  app.append(s);
  next();
  function next() {
    while (F.pos < F.order.length && !QBYID[F.order[F.pos]]) F.pos++;
    if (F.pos >= F.order.length) return done();
    const q = QBYID[F.order[F.pos]];
    const lv = q.t === 'explain' ? 2 : (usableAt(q, 2) && item(itemKey(q, 1)).box >= 2 ? 2 : (usableAt(q, 1) ? 1 : 2));
    const ch = chapterById(q.ch);
    barI.style.width = Math.round((F.pos / F.order.length) * 100) + '%';
    meta.replaceChildren(h('span', null, `Aufgabe ${F.pos + 1} von ${F.order.length}`), h('span', { class: 'chn', style: { '--c': ch.color } }, ico(CH_ICON[ch.id]), ch.short));
    body.replaceChildren(renderQuestion(q, { level: lv, exam: false, done: (res) => answer(q, lv, res) }));
  }
  function answer(q, lv, res) {
    const key = itemKey(q, lv);
    if (res.ok) snd.correct(1); else snd.wrong();
    const later = () => { if (!requeued.has(q.id)) { requeued.add(q.id); F.order.splice(Math.min(F.order.length, F.pos + 6), 0, q.id); } };
    const go = () => { el.remove(); F.pos++; save(); next(); };
    const buttons = res.ok && !res.selfChecked
      ? [h('button', { class: 'btn', onclick: () => { record(key, true, res.score); F.sure++; gainXP(lv === 2 ? 12 : 8); go(); } }, ico('check'), 'Sicher gewusst'),
         h('button', { class: 'btn ghost', onclick: () => { record(key, false, 0.5); F.guessed++; later(); gainXP(3); go(); } }, 'Geraten')]
      : [h('button', { class: 'btn', onclick: () => { record(key, res.ok, res.score); if (!res.ok) { F.wrong++; later(); } else { F.sure++; gainXP(8); } go(); } }, res.ok ? 'Weiter' : 'Verstanden, weiter', ico('arrowR'))];
    const el = h('div', { class: 'sheet ' + (res.ok ? 'ok' : 'bad') }, h('div', { class: 'inner' },
      h('div', { class: 'head', html: (res.ok ? docSVG('wink') : docSVG('sick')) + `<span>${res.ok ? 'Richtig! Wie sicher warst du?' : res.score >= 0.5 ? 'Fast!' : 'Noch nicht.'}</span>` }),
      h('div', { class: 'expl', html: (res.html || '') + explainMore(q, res) }),
      h('div', { class: 'row', style: { gap: '10px' } }, ...buttons.map((b) => { b.style.flex = '1'; return b; }))));
    document.body.append(el);
  }
  function done() {
    focusMode(false);
    snd.fanfare(); confetti(120);
    body.replaceChildren(h('div', { class: 'result card' },
      h('div', { class: 'cat', html: docSVG('wow', ['crown']) }),
      h('h2', null, 'Der ganze Prüfstoff ist durch!'),
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, String(F.sure)), h('span', null, 'sicher gewusst')), h('div', { class: 'stat' }, h('b', null, String(F.guessed)), h('span', null, 'geraten')), h('div', { class: 'stat' }, h('b', null, String(F.wrong)), h('span', null, 'noch falsch'))),
      h('p', { class: 'muted' }, 'Was noch falsch oder geraten war, kommt jetzt bevorzugt in der Schnell-Runde.'),
      h('div', { class: 'stack' }, h('a', { class: 'btn block', href: '#/mix/los' }, ico('bolt'), 'Schnell-Runde'), h('a', { class: 'btn ghost block', href: '#/alle' }, 'Zurück'))));
    save();
    checkUnlocks();
  }
  cleanup = () => { $$('.sheet').forEach((x) => x.remove()); save(); snd.moodMusic(S.settings.track); };
}

/* ---------- Erklärvideos ---------- */
function videosPage(cid) {
  tabs('lernen');
  const s = h('div', { class: 'screen' });
  const one = cid ? chapterById(cid) : null;
  s.append(back(one ? '#/k/' + one.id : '#/themen', one ? one.short : 'Kapitel'), h('h1', null, one ? 'Erklärvideos: ' + one.short : 'Alle Erklärvideos'));
  s.append(h('p', { class: 'muted' }, 'Ausgewählte Videos von simpleclub, Studyflix, Learning Level Up und Co. Sie öffnen sich in einem neuen Fenster. Die Videos gehen manchmal über dein Heft hinaus: Für den Test zählt dein Heft.'));
  (one ? [one] : CHAPTERS).forEach((ch) => {
    if (!ch.yt || !ch.yt.length) return;
    if (!one) s.append(h('div', { class: 'section-title', style: { color: ch.color } }, ico(CH_ICON[ch.id]), h('span', { style: { color: 'var(--ink)' } }, ch.title)));
    s.append(videoList(ch.yt));
  });
  if (one) s.append(h('a', { class: 'btn ghost block', style: { marginTop: '14px' }, href: '#/videos' }, 'Alle Kapitel anzeigen'));
  app.append(s);
}

/* ---------- Glossar ---------- */
function glossary(chFilter) {
  tabs('lernen');
  const s = h('div', { class: 'screen' });
  const chF = chFilter ? chapterById(chFilter) : null;
  s.append(back(chF ? '#/k/' + chF.id : '#/themen', chF ? chF.short : 'Kapitel'), h('h1', null, chF ? 'Fachbegriffe: ' + chF.short : 'Glossar A–Z'));
  const base = chF ? GLOSSARY.filter((g) => g.ch === chF.id) : GLOSSARY;
  const search = h('input', { type: 'search', id: 'glossar-suche', placeholder: 'Begriff suchen …', autocomplete: 'off', class: 'search' });
  const cardsBtn = h('button', { class: 'btn small' }, ico('cards'), 'Karteikarten');
  s.append(h('div', { class: 'row', style: { gap: '8px', margin: '6px 0 12px' } }, h('div', { style: { flex: 1, minWidth: 0 } }, search), cardsBtn));
  const list = h('div', { class: 'gloss' });
  s.append(list);
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const items = base.filter((g) => !q || (g.t + ' ' + g.alt + ' ' + g.d).toLowerCase().includes(q));
    list.replaceChildren();
    let letter = '';
    for (const g of items) {
      const L = g.t[0].toUpperCase();
      if (L !== letter && !q) { letter = L; list.append(h('div', { class: 'gl-letter' }, L)); }
      const ch = chapterById(g.ch);
      list.append(h('div', { class: 'gl-item' },
        h('div', { class: 'gl-term' }, g.t, g.alt ? h('span', { class: 'gl-alt' }, g.alt) : null),
        h('div', { class: 'gl-def' }, g.d),
        h('a', { class: 'gl-ch', href: '#/k/' + ch.id, style: { '--c': ch.color } }, ico(CH_ICON[ch.id]), ch.short)));
    }
    if (!items.length) list.append(h('p', { class: 'muted' }, 'Kein Begriff gefunden.'));
  };
  search.addEventListener('input', draw);
  draw();
  cardsBtn.onclick = () => flash(shuffle(base));
  app.append(s);
  function flash(deck) {
    let i = 0, known = 0;
    const box = h('div');
    const close = modal(box);
    const show = () => {
      if (i >= deck.length) { box.replaceChildren(h('div', { class: 'stack center' }, h('div', { style: { width: '120px', margin: '0 auto' }, html: docSVG('wow') }), h('h2', null, `${known} von ${deck.length} gewusst`), h('button', { class: 'btn block', onclick: () => close() }, 'Fertig'))); gainXP(known); return; }
      const g = deck[i];
      const term = h('div', { class: 'fl-term hidden-term' }, g.t);
      const reveal = h('button', { class: 'btn block' }, ico('eye'), 'Begriff zeigen');
      const rate = h('div', { class: 'row', style: { gap: '10px', display: 'none' } },
        h('button', { class: 'btn ghost', style: { flex: 1 }, onclick: () => { deck.push(g); i++; show(); } }, 'Nochmal'),
        h('button', { class: 'btn', style: { flex: 1 }, onclick: () => { known++; snd.correct(known); i++; show(); } }, ico('check'), 'Gewusst'));
      reveal.onclick = () => { term.classList.remove('hidden-term'); reveal.style.display = 'none'; rate.style.display = 'flex'; snd.tap(); };
      box.replaceChildren(h('div', { class: 'eyebrow' }, `Karte ${Math.min(i + 1, deck.length)} von ${deck.length} · Welcher Begriff ist gemeint?`),
        h('div', { class: 'fl-def' }, g.d), term, reveal, rate);
    };
    show();
  }
}

/* ---------- Prüfstoff Seite für Seite ---------- */
function stoff() {
  tabs('ueben');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Prüfstoff Seite für Seite'), h('p', { class: 'muted' }, 'Hier ist alles aus deinen 11 Seiten. Jede Seite hat ihre Aufgaben aus dem Heft als Übung, zum Antippen und Eintippen, mit Musterlösung.'));
  const list = h('div', { class: 'ws' });
  WORKSHEETS.forEach((w, i) => {
    const ch = chapterById(w.ch);
    const p = Math.round(sheetProgress(w) * 100);
    list.append(h('div', { class: 'card', style: { '--c': ch.color } },
      h('div', { class: 'head' }, h('span', { class: 'pg' }, w.page), h('b', { style: { flex: 1 } }, w.title), h('span', { class: 'tag' + (p >= 80 ? ' done' : '') }, p + ' %')),
      h('ul', null, w.topics.map((t) => h('li', null, ico('check'), h('span', null, t)))),
      h('div', { class: 'row wrap' },
        h('a', { class: 'btn small', href: '#/blatt/' + i }, ico('clipboard'), `${w.tasks.length} Aufgaben üben`),
        h('a', { class: 'btn ghost small', href: '#/lernen/' + w.ch }, ico('book'), 'Lernkarte'))));
  });
  s.append(list);
  app.append(s);
}

/* ---------- Probearbeit ---------- */
function probeIntro() {
  tabs('ueben');
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'card intro' },
    h('div', { class: 'cat', html: docSVG('happy', ['book']) }),
    h('h1', null, 'Probearbeit'),
    h('p', { class: 'muted' }, 'Die Generalprobe, so wie ein echter Bio-Test.'),
    h('ul', null,
      h('li', null, ico('clock'), h('span', null, '20 Minuten. So lang darf ein Test in der Oberstufe höchstens dauern.')),
      h('li', null, ico('list'), h('span', null, 'Ca. 24 Punkte: Nervenzelle beschriften, Enzym-Tabelle, Abbildung, Zuordnen, Richtig/Falsch, Eintippen, eine Erklär-Aufgabe.')),
      h('li', null, ico('eyeOff'), h('span', null, 'Kein Feedback zwischendurch. Die Note und alle Lösungen kommen am Ende.')),
      h('li', null, ico('refresh'), h('span', null, 'Jedes Mal andere Aufgaben.'))),
    h('p', { class: 'small muted' }, 'Notenschlüssel (übliches Schema, deine Lehrkraft kann es anders machen): ab 90 % Sehr gut · ab 80 % Gut · ab 65 % Befriedigend · ab 50 % Genügend.'),
    h('a', { class: 'btn lav block', href: '#/probe/los' }, ico('clock'), 'Start: 20 Minuten')));
  if (S.probe.length) {
    s.append(h('div', { class: 'section-title' }, ico('trophy'), 'Deine bisherigen Probearbeiten'));
    const c = h('div', { class: 'card' });
    S.probe.slice(-6).reverse().forEach((p) => c.append(h('div', { class: 'task' }, h('b', null, 'Note ' + p.grade), h('span', null, `${p.pct} % · ${p.points}/${p.max} Punkte · ${p.date}`))));
    s.append(c);
  }
  app.append(s);
}

function buildProbe() {
  const by = (t, pred = () => true) => ALL_QUESTIONS.filter((q) => q.t === t && pred(q));
  const items = [];
  items.push({ q: ALL_QUESTIONS.find((q) => q.t === 'label' && q.d === 'neuron' && q.parts === 'all'), level: 2, pts: 5 });
  items.push({ q: { t: 'grid', id: 'probe-grid', q: 'Ergänze die Lücken in der Enzym-Tabelle.' }, level: 2, pts: 6 });
  items.push({ q: pick(by('label', (q) => q.d !== 'neuron' && (q.parts === 'all' ? DIAGRAMS[q.d].parts.length <= 7 : q.parts.length <= 7))), level: 2, pts: 3 });
  items.push({ q: pick([...by('formula'), ...by('cloze')]), level: 2, pts: 2 });
  shuffle(by('fact')).slice(0, 2).forEach((q) => items.push({ q, level: 2, pts: 1 }));
  shuffle(by('tf', (q) => !q.ok)).slice(0, 2).forEach((q) => items.push({ q, level: 1, pts: 1 }));
  items.push({ q: pick(by('match')), level: 1, pts: 2 });
  items.push({ q: pick(by('explain')), level: 2, pts: 2 });
  return items;
}

function probeRun() {
  runExam({ items: buildProbe(), minutes: 20, title: 'Probearbeit', againHref: '#/probe', history: true });
}

/* A test with a grade at the end: no feedback in between, full solutions afterwards. */
function runExam({ items, minutes, title, againHref, history, resume }) {
  const long = items.length > 30;
  if (long) minutes = 0;
  focusMode(true);
  tabs('ueben');
  snd.moodMusic('focus');
  const max = items.reduce((a, b) => a + b.pts, 0);
  const results = resume ? resume.results : [];
  let pos = resume ? resume.pos : 0, left = (minutes || 0) * 60;
  const persist = () => {
    if (!long) return;
    S.examRun = { title, againHref, pos, items: items.map((it) => ({ id: it.q.id, level: it.level, pts: it.pts })), results: results.map((r) => ({ k: r.k, score: r.res.score, ok: r.res.ok, you: r.res.you || '', html: r.res.html || '', detail: r.res.detail || null })) };
    save();
  };
  const s = h('div', { class: 'screen' });
  const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const clock = h('div', { class: 'combo', style: { minWidth: '76px', color: 'var(--ink)' } }, ico('clock'), minutes ? fmt(left) : '0:00');
  const barI = h('i', { style: { width: '0%' } });
  const closeBtn = long
    ? h('button', { class: 'close', title: 'Pause', html: I('pause'), onclick: () => { persist(); toast('Gespeichert. Du kannst später genau hier weitermachen.'); nav(againHref); } })
    : h('button', { class: 'close', title: 'Abbrechen', html: I('x'), onclick: () => ask(title + ' abbrechen?', 'Ja, abbrechen', () => nav(againHref)) });
  s.append(h('div', { class: 'qtop' }, closeBtn, h('div', { class: 'bar accent' }, barI), clock));
  const body = h('div');
  s.append(body);
  app.append(s);
  let up = 0;
  const tick = setInterval(() => {
    if (!minutes) { up++; clock.replaceChildren(ico('clock'), fmt(up)); return; }
    left--;
    clock.replaceChildren(ico('clock'), fmt(left));
    if (left === 60) { toast('Noch 1 Minute!'); snd.mrrp(); }
    if (left <= 0) { clearInterval(tick); finish(true); }
  }, 1000);
  results.forEach((r) => { if (!r.it) { r.it = items[r.k]; r.res = r.res || { score: r.score, ok: r.ok, you: r.you, html: r.html, detail: r.detail }; } });
  cleanup = () => { clearInterval(tick); persist(); snd.moodMusic(S.settings.track); };
  show();
  function show() {
    if (pos >= items.length) return finish(false);
    const it = items[pos];
    body.innerHTML = '';
    const chq = chapterById(it.q.ch);
    body.append(h('div', { class: 'qmeta' }, h('span', null, `${title} · Aufgabe ${pos + 1} von ${items.length}`), h('span', null, chq ? `${chq.short} · ` : '', `${it.pts} ${it.pts === 1 ? 'Punkt' : 'Punkte'}`)));
    barI.style.width = Math.round((pos / items.length) * 100) + '%';
    body.append(renderQuestion(it.q, { level: it.level, exam: true, done: (res) => {
      results.push({ k: pos, it, res });
      if (it.q.ch) record(itemKey(it.q, it.level), res.ok, res.score);
      setTimeout(() => { pos++; persist(); barI.style.width = Math.round((pos / items.length) * 100) + '%'; show(); }, res.selfChecked ? 300 : 650);
    } }));
  }
  function finish(timeUp) {
    clearInterval(tick);
    if (long) { delete S.examRun; save(); }
    cleanup = () => snd.moodMusic(S.settings.track);
    clock.replaceChildren(ico('check'));
    focusMode(false);
    const points = Math.round(results.reduce((a, r) => a + r.res.score * r.it.pts, 0) * 2) / 2;
    const pct = Math.round((points / max) * 100);
    const grade = pct >= 90 ? 1 : pct >= 80 ? 2 : pct >= 65 ? 3 : pct >= 50 ? 4 : 5;
    const names = ['', 'Sehr gut', 'Gut', 'Befriedigend', 'Genügend', 'Nicht genügend'];
    if (history) S.probe.push({ date: new Date().toLocaleDateString('de-AT'), pct, grade, points, max });
    else (S.tests = S.tests || []).push({ date: new Date().toLocaleDateString('de-AT'), title, pct, grade, points, max });
    S.retry = results.filter((r) => r.res.score < 0.99 && r.it.q.ch).map((r) => ({ id: r.it.q.id, level: r.it.level }));
    gainXP(Math.round(points * 5));
    save();
    snd.moodMusic(S.settings.track);
    if (grade <= 2) { snd.fanfare(); confetti(100); } else snd.meow();
    body.innerHTML = '';
    body.append(h('div', { class: 'result card' },
      timeUp ? h('p', null, h('span', { class: 'tag warn' }, 'Zeit abgelaufen')) : null,
      h('div', { class: 'cat', html: docSVG(grade <= 2 ? 'wow' : 'happy', grade === 1 ? ['crown'] : ['book']) }),
      h('div', { class: 'grade' }, String(grade)),
      h('h2', null, names[grade]),
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, `${points}/${max}`), h('span', null, 'Punkte')), h('div', { class: 'stat' }, h('b', null, pct + ' %'), h('span', null, 'erreicht')), h('div', { class: 'stat' }, h('b', null, '+' + Math.round(points * 5)), h('span', null, 'Leckerli'))),
      h('p', { class: 'muted' }, grade <= 2 ? 'So kannst du am Freitag ganz entspannt hineingehen.' : 'Schau dir unten die Lösungen an und übe die Kapitel mit den meisten Fehlern nochmal.')));
    // per chapter: where does it still go wrong?
    const byCh = {};
    results.forEach(({ it, res }) => { const c = it.q.ch || 'enzyme'; byCh[c] = byCh[c] || { got: 0, max: 0 }; byCh[c].got += res.score * it.pts; byCh[c].max += it.pts; });
    if (Object.keys(byCh).length > 1) {
      body.append(h('div', { class: 'section-title' }, ico('list'), 'Ergebnis pro Kapitel'));
      const t = h('div', { class: 'card' });
      CHAPTERS.forEach((ch) => { const v = byCh[ch.id]; if (!v) return; const pc = Math.round((v.got / v.max) * 100);
        t.append(h('a', { class: 'chres', href: '#/k/' + ch.id, style: { '--c': ch.color } }, h('span', { class: 'n', html: I(CH_ICON[ch.id]) }), h('b', null, ch.short), h('div', { class: 'bar' }, h('i', { style: { width: pc + '%', background: pc >= 80 ? 'var(--good)' : pc >= 50 ? 'var(--sun)' : 'var(--bad)' } })), h('span', { class: 'pc' }, pc + ' %'))); });
      body.append(t);
    }
    body.append(h('div', { class: 'section-title' }, ico('list'), 'Auflösung'));
    results.forEach(({ it, res }, k) => {
      const ok = res.score >= 0.99;
      const det = res.detail ? '<br>' + res.detail.map((d) => `${d.n}: ${d.you ? esc(d.you) : '–'} ${d.ok ? '✓' : '→ <b>' + esc(d.right) + '</b>'}`).join('<br>') : '';
      body.append(h('div', { class: 'card', style: { borderLeft: `5px solid var(--${ok ? 'good' : res.score > 0 ? 'sun' : 'bad'})` } },
        h('div', { class: 'eyebrow' }, `Aufgabe ${k + 1} · ${Math.round(res.score * it.pts * 2) / 2} von ${it.pts} P.`),
        h('b', null, it.q.q || ''),
        h('div', { class: 'small', style: { marginTop: '6px' }, html: (res.you ? `Deine Antwort: ${esc(res.you)}<br>` : '') + (res.html || '') + det + explainMore(it.q, res) })));
    });
    body.append(h('div', { class: 'stack', style: { marginTop: '14px' } },
      S.retry.length ? h('a', { class: 'btn coral block', href: '#/nochmal' }, ico('target'), `Nur die ${S.retry.length} Fehler nochmal üben`) : null,
      h('a', { class: 'btn lav block', href: againHref }, ico('refresh'), 'Nochmal mit neuen Aufgaben'), h('a', { class: 'btn ghost block', href: '#/' }, 'Zur Klinik')));
    checkUnlocks();
  }
}


/* ================= Test-Baukasten: random tests, per chapter or overall ================= */
const PTS = { label: 3, grid: 3, explain: 2, cloze: 2, formula: 2, match: 2, sort: 2 };
function buildTest(cfg) {
  const pool = [];
  for (const ch of CHAPTERS) {
    if (!cfg.chapters.includes(ch.id)) continue;
    for (const q of ch.q) {
      const can1 = usableAt(q, 1), can2 = usableAt(q, 2);
      let level = null;
      if (cfg.style === 'tap') level = can1 ? 1 : null;
      else if (cfg.style === 'type') level = can2 && !['tf', 'order', 'pick'].includes(q.t) ? 2 : null;
      else level = can1 && can2 ? (Math.random() < 0.5 ? 1 : 2) : can1 ? 1 : 2;
      if (level) pool.push({ q, level, pts: PTS[q.t] || 1 });
    }
  }
  if (cfg.chapters.includes('enzyme') && cfg.style !== 'tap') pool.push({ q: { t: 'grid', id: 'test-grid', q: 'Ergänze die Lücken in der Enzym-Tabelle.' }, level: 2, pts: 3 });
  const picked = shuffle(pool);
  return cfg.n === 'all' ? picked : picked.slice(0, cfg.n);
}
let pendingTest = null;
function testBuilder(preCh) {
  tabs('ueben');
  const cfg = Object.assign({ chapters: CHAPTERS.map((c) => c.id), n: 20, style: 'mix', mode: 'exam', timer: false }, S.testCfg || {});
  if (preCh && chapterById(preCh)) { cfg.chapters = [preCh]; cfg.n = 12; }
  const s = h('div', { class: 'screen' });
  s.append(back(preCh ? '#/k/' + preCh : '#/mix', preCh ? chapterById(preCh).short : 'Üben'), h('h1', null, 'Test-Baukasten'),
    h('p', { class: 'muted' }, 'Stell dir deinen eigenen Test zusammen. Die Fragen werden jedes Mal neu zufällig gezogen.'));
  if (S.examRun) {
    const R = S.examRun;
    s.append(h('div', { class: 'card tint-lav', style: { marginBottom: '12px' } }, h('b', null, R.title + ' läuft noch'),
      h('div', { class: 'bar', style: { margin: '8px 0' } }, h('i', { style: { width: Math.round((R.pos / R.items.length) * 100) + '%' } })),
      h('p', { class: 'small muted' }, `Aufgabe ${R.pos + 1} von ${R.items.length}. Dein Fortschritt ist gespeichert.`),
      h('div', { class: 'row wrap' }, h('a', { class: 'btn lav small', href: '#/test/weiter' }, ico('play'), 'Weitermachen'),
        h('button', { class: 'btn ghost small', onclick: () => ask('Laufenden Test verwerfen?', 'Ja, verwerfen', () => { delete S.examRun; save(); route(); }) }, 'Verwerfen'))));
  }
  s.append(h('button', { class: 'card linkcard', style: { width: '100%', textAlign: 'left', marginBottom: '12px', border: '2px solid var(--lav)' }, onclick: () => { S.testCfg = { chapters: CHAPTERS.map((c) => c.id), n: 'all', style: 'mix', mode: 'exam', timer: false }; save(); nav('#/test/los'); } },
    h('div', { class: 'ic', style: { background: 'var(--lav)', color: '#fff' }, html: I('trophy') }),
    h('div', null, h('b', null, 'Der Komplett-Check'), h('span', { class: 'small muted' }, `Alle ${buildTest({ chapters: CHAPTERS.map((c) => c.id), n: 'all', style: 'mix' }).length} Aufgaben des Prüfstoffs in zufälliger Reihenfolge, Note am Ende, Ergebnis pro Kapitel. Pausieren jederzeit möglich.`)),
    h('span', { class: 'go', html: I('chevR') })));
  const card = h('div', { class: 'card stack' });
  // chapters
  const chips = h('div', { class: 'chips' });
  const allChip = h('button', { class: 'chip toggle' }, 'Alle Kapitel');
  const chipEls = CHAPTERS.map((ch) => { const b = h('button', { class: 'chip toggle', style: { '--c': ch.color } }, ico(CH_ICON[ch.id]), ch.short); b.onclick = () => { const k = cfg.chapters.indexOf(ch.id); if (k >= 0) cfg.chapters.splice(k, 1); else cfg.chapters.push(ch.id); upd(); }; return b; });
  allChip.onclick = () => { cfg.chapters = cfg.chapters.length === CHAPTERS.length ? [] : CHAPTERS.map((c) => c.id); upd(); };
  chips.append(allChip, ...chipEls);
  const seg = (key, opts) => { const w = h('div', { class: 'segs wrapsegs' }); opts.forEach(([v, label]) => { const b = h('button', { class: 'seg' }, label); b.onclick = () => { cfg[key] = v; upd(); }; b.dataset.v = String(v); w.append(b); }); w.dataset.key = key; return w; };
  const nSeg = seg('n', [[10, '10'], [20, '20'], [30, '30'], ['all', 'Alle']]);
  const styleSeg = seg('style', [['tap', 'Antippen'], ['type', 'Eintippen'], ['mix', 'Gemischt']]);
  const modeSeg = seg('mode', [['exam', 'Wie ein Test (Note am Ende)'], ['learn', 'Üben mit Erklärung']]);
  const timer = h('label', { class: 'toggle', for: 'test-timer' }, h('span', null, 'Mit 20-Minuten-Uhr'), h('input', { type: 'checkbox', id: 'test-timer' }));
  timer.querySelector('input').onchange = (e) => { cfg.timer = e.target.checked; };
  const info = h('p', { class: 'small muted', style: { margin: 0 } });
  const start = h('button', { class: 'btn lav block' }, ico('clipboard'), 'Test starten');
  start.onclick = () => { S.testCfg = { ...cfg, chapters: cfg.chapters.slice() }; save(); nav('#/test/los'); };
  card.append(h('div', { class: 'eyebrow' }, 'Welche Kapitel?'), chips,
    h('div', { class: 'eyebrow' }, 'Wie viele Fragen?'), nSeg,
    h('div', { class: 'eyebrow' }, 'Wie antworten?'), styleSeg,
    h('div', { class: 'eyebrow' }, 'Wie prüfen?'), modeSeg, timer, info, start);
  s.append(card);
  const quick = h('div', { class: 'modes', style: { marginTop: '14px' } });
  const qk = (t, sub, c) => h('button', { class: 'mode', onclick: () => { S.testCfg = { ...cfg, ...c }; save(); nav('#/test/los'); } }, h('div', { class: 'ic', html: I('bolt') }), h('div', null, h('b', null, t), h('span', { class: 'sub' }, sub)), h('span', { class: 'go', html: I('chevR') }));
  quick.append(
    qk('Großer Gesamttest', '30 zufällige Fragen aus allem, gemischt, mit Note', { chapters: CHAPTERS.map((c) => c.id), n: 30, style: 'mix', mode: 'exam', timer: false }),
    qk('Alles eintippen', '20 Fragen aus allem, nur selbst schreiben', { chapters: CHAPTERS.map((c) => c.id), n: 20, style: 'type', mode: 'exam', timer: false }),
    qk('Nur Nervenzelle', '12 Fragen, gemischt, mit Note', { chapters: ['neuron'], n: 12, style: 'mix', mode: 'exam', timer: false }),
    qk('Nur Verdauung', '20 Fragen ohne Nervenzelle', { chapters: CHAPTERS.filter((c) => c.id !== 'neuron').map((c) => c.id), n: 20, style: 'mix', mode: 'exam', timer: false }),
  );
  s.append(h('div', { class: 'section-title' }, ico('sparkle'), 'Schnellstart'), quick);
  if (S.tests && S.tests.length) {
    s.append(h('div', { class: 'section-title' }, ico('trophy'), 'Deine letzten Tests'));
    const c = h('div', { class: 'card' });
    S.tests.slice(-6).reverse().forEach((t) => c.append(h('div', { class: 'task' }, h('b', null, 'Note ' + t.grade), h('span', null, `${t.pct} % · ${t.points}/${t.max} P. · ${t.date}`))));
    s.append(c);
  }
  app.append(s);
  upd();
  function upd() {
    allChip.classList.toggle('on', cfg.chapters.length === CHAPTERS.length);
    chipEls.forEach((b, k) => b.classList.toggle('on', cfg.chapters.includes(CHAPTERS[k].id)));
    [nSeg, styleSeg, modeSeg].forEach((w) => w.querySelectorAll('.seg').forEach((b) => b.classList.toggle('on', b.dataset.v === String(cfg[w.dataset.key]))));
    timer.style.display = cfg.mode === 'exam' && cfg.n !== 'all' && cfg.n <= 30 ? '' : 'none';
    const avail = buildTest({ ...cfg, n: 'all' }).length;
    const n = cfg.n === 'all' ? avail : Math.min(cfg.n, avail);
    info.textContent = cfg.chapters.length ? `${n} Fragen aus ${cfg.chapters.length === CHAPTERS.length ? 'allen Kapiteln' : cfg.chapters.length + (cfg.chapters.length === 1 ? ' Kapitel' : ' Kapiteln')} (insgesamt ${avail} passende Fragen).` : 'Wähle mindestens ein Kapitel.';
    start.disabled = !cfg.chapters.length || !n;
  }
}
function testResume() {
  const R = S.examRun;
  if (!R) return nav('#/test');
  const items = R.items.map((x) => ({ q: x.id === 'test-grid' ? { t: 'grid', id: 'test-grid', q: 'Ergänze die Lücken in der Enzym-Tabelle.' } : QBYID[x.id], level: x.level, pts: x.pts })).filter((x) => x.q);
  runExam({ items, minutes: 0, title: R.title, againHref: R.againHref || '#/test', history: false, resume: { pos: R.pos, results: R.results } });
}
function testStart() {
  const cfg = S.testCfg;
  if (!cfg || !cfg.chapters || !cfg.chapters.length) return nav('#/test');
  const items = buildTest(cfg);
  if (!items.length) return nav('#/test');
  const title = cfg.chapters.length === 1 ? 'Kapitel-Test ' + chapterById(cfg.chapters[0]).short : cfg.chapters.length === CHAPTERS.length ? (cfg.n === 'all' ? 'Komplett-Check' : 'Gesamttest') : 'Test';
  if (cfg.mode === 'learn') return quiz({ custom: { items, title } });
  runExam({ items, minutes: cfg.timer ? 20 : 0, title, againHref: '#/test', history: false });
}

/* ================= collection, plan, settings ================= */
function catsPage() {
  tabs('katzen');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Deine Katzen'), h('p', { class: 'muted' }, `${S.cats.length} von ${CATS.length} Katzen gesammelt. Mach Patienten gesund (Kapitel zu 80 %) und schaffe Bonus-Aufgaben.`));
  const g = h('div', { class: 'catgrid' });
  CATS.forEach((c) => {
    const has = S.cats.includes(c.id);
    const ch = CHAPTERS.find((x) => x.cat === c.id);
    const cell = h('button', { class: 'catcell' + (has ? '' : ' locked'), html: catPic(c, has ? 'happy' : 'sleep') });
    cell.append(h('b', null, has ? c.name : '???'), h('span', null, has ? c.breed : (c.bonus || (ch ? 'Kapitel: ' + ch.short : ''))));
    cell.onclick = () => {
      snd.ensure();
      if (has) { snd.meow({ pitch: 0.85 + Math.random() * 0.4 }); setTimeout(() => snd.purr(1.6, 0.4), 700); } else snd.mrrp();
      const close = modal(h('div', { class: 'stack center' },
        h('div', { style: { width: '170px', margin: '0 auto' }, html: catPic(c, has ? 'happy' : 'sleep', has ? ['heart'] : ['zzz']) }),
        h('h2', null, has ? c.name : 'Noch nicht freigeschaltet'),
        h('p', { class: 'muted' }, has ? c.breed : (c.bonus ? 'So bekommst du diese Katze: ' + c.bonus : `Mach ${c.name} im Kapitel „${ch.title}“ gesund (80 %).`)),
        h('div', { class: 'box vet', style: { textAlign: 'left' } }, h('span', { class: 't' }, ico('paw'), 'Tierärztinnen-Wissen'), has ? c.fact : 'Dieses Wissen bekommst du, wenn du die Katze freigeschaltet hast.'),
        h('button', { class: 'btn block', onclick: () => close() }, 'Schließen')));
    };
    g.append(cell);
  });
  s.append(g);
  s.append(h('div', { class: 'section-title' }, ico('steth'), 'Deine Karriere'));
  const r = rankFor();
  const c = h('div', { class: 'card' });
  RANKS.forEach((rk, i) => c.append(h('div', { class: 'task' + (i <= r.i ? '' : ' done') }, h('span', { html: I(i <= r.i ? 'check' : 'clock') }), h('b', { style: { flex: 1 } }, rk.title), h('span', { class: 'small muted' }, rk.xp + ' Leckerli'))));
  s.append(c);
  app.append(s);
}

function planPage() {
  tabs('plan');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Lernplan'), h('p', { class: 'muted' }, 'Nach Lernforschung: oft kurz abfragen statt lange lesen, Themen mischen, Pausen machen, genug schlafen. 25 Minuten lernen, 5 Minuten Pause, nach 4 Runden eine lange Pause.'));
  const t = todayStr();
  PLAN.forEach((d) => {
    const done = d.tasks.filter((x) => S.plan[x.id]).length;
    const card = h('div', { class: 'card day' + (d.date === t ? ' today' : ''), style: { marginBottom: '12px' } });
    const dt = new Date(d.date + 'T00:00:00');
    card.append(h('div', { class: 'd' }, d.day, h('b', null, String(dt.getDate())), h('span', { class: 'small' }, done + '/' + d.tasks.length)));
    const list = h('div', null, h('b', null, d.label));
    d.tasks.forEach((x) => {
      const cb = h('input', { type: 'checkbox', id: 'plan-' + x.id }); cb.checked = !!S.plan[x.id];
      const row = h('label', { class: 'task' + (cb.checked ? ' done' : ''), for: 'plan-' + x.id }, cb, x.link ? h('span', null, h('a', { href: x.link }, x.text)) : h('span', null, x.text));
      cb.onchange = () => { S.plan[x.id] = cb.checked; row.classList.toggle('done', cb.checked); save(); if (cb.checked) { snd.correct(2); gainXP(5); } };
      list.append(row);
    });
    card.append(list);
    s.append(card);
  });
  s.append(h('div', { class: 'box tip' }, h('span', { class: 't' }, ico('info'), 'Die 5 Lern-Tricks'), h('ul', { style: { margin: '4px 0 0', paddingLeft: '1.2em' } },
    h('li', null, 'Abfragen statt nur lesen: Die App fragt dich ab.'),
    h('li', null, 'Mehrmals kurz statt einmal lang, verteilt über die Tage.'),
    h('li', null, 'Themen mischen: die Schnell-Runde.'),
    h('li', null, 'Bild und Wort: Abbildungen aus dem Kopf zeichnen.'),
    h('li', null, 'Schlafen: Nachts speichert das Gehirn das Gelernte.'))));
  app.append(s);
}

function voicePicker() {
  const wrap = h('div', { class: 'field' });
  const fill = () => {
    const vs = voice.germanVoices();
    wrap.replaceChildren(h('label', { for: 'set-voice' }, 'Stimme'));
    if (!vs.length) { wrap.append(h('span', { class: 'small muted' }, 'Keine deutsche Stimme gefunden.')); return; }
    const cur = voice.currentVoice();
    const sel = h('select', { id: 'set-voice' }, vs.map((v) => { const o = h('option', { value: v.name }, `${v.name} (${v.lang})`); if (cur && v.name === cur.name) o.selected = true; return o; }));
    sel.onchange = () => { voice.chooseVoice(sel.value); voice.speak('Hallo! Ich bin Doktor Schnurrhaar. So klinge ich.', () => {}); };
    const test = h('button', { class: 'btn ghost small', onclick: () => voice.speak('Hallo! Ich bin Doktor Schnurrhaar. Die Amylase spaltet Stärke zu Maltose.', () => {}) }, ico('play'), 'Probehören');
    wrap.append(h('div', { class: 'row' }, h('div', { style: { flex: 1, minWidth: 0 } }, sel), test),
      h('span', { class: 'small muted' }, 'Am besten klingen Stimmen mit „Premium“, „Erweitert“ oder „Natural“ im Namen. Am iPhone kannst du sie unter Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Deutsch laden.'));
  };
  fill();
  if (window.speechSynthesis) speechSynthesis.addEventListener?.('voiceschanged', fill);
  return wrap;
}

function settingsPage() {
  tabs('plan');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Einstellungen'));
  const c = h('div', { class: 'card' });
  const name = h('input', { type: 'text', id: 'set-name', value: S.name || '', placeholder: 'Vorname' });
  name.onchange = () => { S.name = name.value.trim(); save(); };
  const date = h('input', { type: 'date', id: 'set-date', value: S.settings.examDate });
  date.onchange = () => { S.settings.examDate = date.value; save(); };
  const sel = (id, opts, cur, on) => { const el = h('select', { id }, opts.map(([k, v]) => { const o = h('option', { value: k }, v); if (String(k) === String(cur)) o.selected = true; return o; })); el.onchange = () => on(el.value); return el; };
  const toggle = (label, key, after) => { const cb = h('input', { type: 'checkbox', id: 'set-' + key }); cb.checked = !!S.settings[key]; cb.onchange = () => { S.settings[key] = cb.checked; save(); after && after(cb.checked); topbar(); }; return h('label', { class: 'toggle', for: 'set-' + key }, h('span', null, label), cb); };
  c.append(
    h('div', { class: 'field' }, h('label', { for: 'set-name' }, 'Dein Name'), name),
    h('div', { class: 'field' }, h('label', { for: 'set-date' }, 'Datum des Bio-Tests'), date),
    toggle('Töne (Miau, Schnurren …)', 'sound', (on) => on && snd.meow()),
    toggle('Hintergrundmusik', 'music', (on) => snd.setMusic(on)),
    h('div', { class: 'field' }, h('label', { for: 'set-track' }, 'Musikstück'), sel('set-track', Object.entries(snd.TRACKS).map(([k, v]) => [k, v.name]), S.settings.track, (v) => { snd.setMusic(true, v); topbar(); })),
    toggle('Stimme in den Erklär-Filmen', 'voice'),
    voicePicker(),
    h('div', { class: 'field' }, h('label', { for: 'set-rate' }, 'Sprechtempo'), sel('set-rate', [[0.85, 'langsam'], [1, 'normal'], [1.15, 'schnell']], S.settings.rate, (v) => { S.settings.rate = +v; save(); })),
    h('div', { class: 'field' }, h('label', { for: 'set-theme' }, 'Aussehen'), sel('set-theme', [['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']], S.settings.theme, (v) => { S.settings.theme = v; save(); applyTheme(); })),
  );
  s.append(c);
  s.append(h('div', { class: 'card' },
    h('h3', null, 'Auf dem iPhone installieren'),
    h('ol', { style: { paddingLeft: '1.2em', margin: '0 0 8px' } }, h('li', null, 'Diese Seite in Safari öffnen'), h('li', null, 'Unten auf „Teilen“ (Quadrat mit Pfeil) tippen'), h('li', null, '„Zum Home-Bildschirm“ wählen')),
    h('p', { class: 'small muted', style: { margin: 0 } }, 'Danach startet Schnurrologie wie eine App und funktioniert auch offline. Dein Fortschritt bleibt auf diesem Gerät gespeichert.')));
  s.append(h('div', { class: 'card' },
    h('h3', null, 'Fortschritt'),
    h('p', { class: 'small muted' }, `${S.stats.answered} Antworten · ${S.stats.correct} richtig · ${S.cats.length} Katzen`),
    h('button', { class: 'btn ghost small', onclick: () => ask('Wirklich allen Fortschritt löschen?', 'Ja, alles löschen', () => { reset(); route(); }) }, 'Alles zurücksetzen')));
  s.append(h('p', { class: 'small muted center', style: { marginTop: '16px' } }, 'Schnurrologie · gebaut für eine zukünftige Tierärztin'));
  app.append(s);
}

/* ================= boot ================= */
document.body.prepend(h('header', { id: 'top' }, h('div', { class: 'inner' })));
document.body.append(
  h('nav', { id: 'tabs', 'aria-label': 'Hauptmenü' }, h('div', { class: 'inner' },
    [['start', '#/', 'clinic', 'Klinik'], ['lernen', '#/themen', 'book', 'Kapitel'], ['ueben', '#/mix', 'bolt', 'Üben'], ['katzen', '#/katzen', 'cat', 'Katzen'], ['plan', '#/plan', 'calendar', 'Plan']]
      .map(([k, href, ic, label]) => h('a', { href, 'data-tab': k, html: I(ic) + `<span>${label}</span>` })))),
  h('div', { id: 'toast' }),
  h('canvas', { id: 'fx' }),
);
voice.loadAudioIndex();
route();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
