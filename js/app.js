/* Schnurrologie – screens and navigation. */
import { $, $$, h, frag, shuffle, sample, pick, esc, daysUntil, todayStr, clamp } from './util.js';
import { S, save, reset, addXP, rankFor, RANKS, record, item, chapterState, mastery, unlockCat, today } from './store.js';
import { CHAPTERS, CARDS, PLAN, ALL_QUESTIONS, chapterById } from './content.js';
import { DIAGRAMS, diagramSVG, numbering, highlight, partById } from './diagrams.js';
import { catSVG, docSVG, CATS, catById, catPic } from './cats.js';
import { renderQuestion, pickSession, usableAt, itemKey } from './engine.js';
import * as snd from './audio.js';

const app = $('#app');
snd.unlockOnGesture();
applyTheme();

/* ================= helpers ================= */
function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
function toast(html, cat) {
  const box = $('#toast');
  const el = h('div', { class: 'toast' });
  if (cat) el.append(frag(cat));
  el.append(h('div', { html }));
  box.append(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3200);
}
function confetti(n = 60) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#fx'), ctx = c.getContext('2d');
  const W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
  const em = ['🐾', '🐟', '⭐', '💜', '🧶', '🐱'];
  const P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: -Math.random() * H * 0.5, vy: (2 + Math.random() * 4) * devicePixelRatio, vx: (Math.random() - 0.5) * 3 * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, e: pick(em), s: (18 + Math.random() * 18) * devicePixelRatio }));
  let t0 = performance.now();
  const step = (t) => {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) { p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.font = `${p.s}px serif`; ctx.fillText(p.e, 0, 0); ctx.restore(); }
    if (t - t0 < 2600) requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(step);
}
function modal(content, onClose) {
  const m = h('div', { class: 'modal' });
  const p = h('div', { class: 'panel' });
  p.append(content);
  m.append(p);
  m.onclick = (e) => { if (e.target === m) close(); };
  function close() { m.remove(); onClose && onClose(); }
  document.body.append(m);
  return close;
}
function chapterQuestions(id) { return chapterById(id).q; }
function chapterMastery(id) {
  const qs = chapterQuestions(id);
  const keys = [];
  qs.forEach((q) => { if (usableAt(q, 1)) keys.push(itemKey(q, 1)); if (usableAt(q, 2)) keys.push(itemKey(q, 2)); });
  return mastery(keys);
}
function patientMood(m) {
  if (m >= 0.8) return { mood: 'happy', acc: ['heart'], label: 'geheilt' };
  if (m >= 0.35) return { mood: 'happy', acc: ['bandage'], label: 'auf dem Weg der Besserung' };
  return { mood: 'sick', acc: ['cone', 'thermo'], label: 'krank' };
}
function patientSVG(ch) {
  const cat = catById(ch.cat), m = chapterMastery(ch.id), pm = patientMood(m);
  return catPic(cat, pm.mood, pm.acc);
}
function examDays() { return daysUntil(S.settings.examDate); }
function nav(hash) { location.hash = hash; }
function focusMode(on) { document.body.classList.toggle('focus', on); }
function topbar() {
  const r = rankFor();
  const top = $('#top');
  top.innerHTML = '';
  top.append(
    h('a', { class: 'brand', href: '#/', html: docSVG('happy') + '<span>Schnurrologie</span>' }),
    h('div', { class: 'spacer' }),
    h('button', { class: 'pill', title: 'Leckerli (Punkte)', onclick: () => nav('#/katzen') }, '🐟 ', S.xp),
    h('button', { class: 'pill', title: 'Tage in Folge gelernt', onclick: () => nav('#/plan') }, '🐾 ', S.streak.count || 0),
    h('button', { class: 'iconbtn', 'aria-pressed': String(!!S.settings.music), title: 'Musik', onclick: (e) => { snd.ensure(); snd.setMusic(!S.settings.music); e.currentTarget.setAttribute('aria-pressed', String(S.settings.music)); } }, '🎵'),
    h('button', { class: 'iconbtn', 'aria-pressed': String(!!S.settings.sound), title: 'Töne', onclick: (e) => { S.settings.sound = !S.settings.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(S.settings.sound)); if (S.settings.sound) snd.meow(); } }, '🔔'),
  );
}
function tabs(active) {
  $$('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === active));
}
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
    toast(`<b>${esc(c.name)}</b> ist ${c.bonus ? 'zu dir gezogen' : 'wieder gesund'}! 🎉<br><span class="small">Neu in deiner Katzen-Sammlung</span>`, catPic(c, 'happy', ['heart']));
  }, 600 + i * 1800));
  return got;
}
function gainXP(n, why) {
  const up = addXP(n);
  if (up) setTimeout(() => { snd.fanfare(); confetti(80); toast(`Befördert! Du bist jetzt <b>${up.icon} ${esc(up.title)}</b>`, docSVG('wow')); }, 400);
}

/* ================= router ================= */
const routes = [
  [/^#?\/?$/, home],
  [/^#\/k\/([\w-]+)$/, chapter],
  [/^#\/karten\/([\w-]+)$/, cards],
  [/^#\/lernen\/([\w-]+)$/, learn],
  [/^#\/film\/([\w-]+)$/, film],
  [/^#\/ueben\/([\w-]+)\/(\d)$/, (id, lv) => quiz({ chapter: id, level: +lv })],
  [/^#\/mix$/, () => quiz({ mix: true })],
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
  speechSynthesis?.cancel?.();
  const hash = location.hash || '#/';
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) { app.innerHTML = ''; window.scrollTo(0, 0); topbar(); fn(...m.slice(1)); return; }
  }
  nav('#/');
}
addEventListener('hashchange', route);

/* ================= screens ================= */
function home() {
  tabs('start');
  const d = examDays();
  const r = rankFor();
  const name = S.name || 'Tierärztin';
  const hello = pick([
    `Hallo ${name}! Bereit für die Visite? 🩺`,
    `Miau, ${name}! Heute heilen wir ein paar Patienten.`,
    `Schön, dass du da bist, ${name}! Jede Runde macht dich schlauer.`,
    `${name}, wusstest du? ${pick(CATS).fact}`,
  ]);
  const s = h('div', { class: 'screen' });
  s.append(
    h('div', { class: 'hero' }, h('div', { class: 'cat', html: docSVG(d <= 0 ? 'wow' : 'happy', ['mirror']) }), h('div', { class: 'bubble' }, hello)),
  );
  // countdown + today
  const dayPlan = PLAN.find((p) => p.date === todayStr());
  const cd = h('div', { class: 'card tint-accent', style: { marginTop: '14px' } });
  cd.append(h('div', { class: 'countdown' },
    h('div', { class: 'big' }, d > 0 ? d : (d === 0 ? '🍀' : '✓')),
    h('div', null, h('b', null, d > 1 ? `Tage bis zum Bio-Test` : d === 1 ? 'Morgen ist der Bio-Test!' : d === 0 ? 'Heute ist der Bio-Test – du schaffst das!' : 'Der Test ist vorbei. Super gemacht!'), h('div', { class: 'small muted' }, 'Freitag, 13. November · ' + (dayPlan ? 'Heute: ' + dayPlan.label : '')))));
  if (dayPlan) {
    const open = dayPlan.tasks.filter((t) => !S.plan[t.id]).slice(0, 3);
    if (open.length) cd.append(h('div', { style: { marginTop: '10px' } }, open.map((t) => h('div', { class: 'task' }, h('span', null, '◻️'), t.link ? h('a', { href: t.link }, t.text) : h('span', null, t.text)))));
    else cd.append(h('p', { class: 'small', style: { marginTop: '8px' } }, '✅ Alles für heute erledigt. Du bist großartig!'));
    cd.append(h('a', { class: 'small', href: '#/plan' }, 'Ganzer Lernplan →'));
  }
  s.append(cd);
  // rank
  s.append(h('div', { class: 'card', style: { marginTop: '14px' } },
    h('div', { class: 'rank' }, h('div', { class: 'badge' }, r.cur.icon), h('div', { style: { flex: 1 } },
      h('b', null, r.cur.title), h('div', { class: 'bar accent', style: { margin: '6px 0 4px' } }, h('i', { style: { width: Math.round(r.pct * 100) + '%' } })),
      h('div', { class: 'small muted' }, r.next ? `${S.xp} / ${r.next.xp} Leckerli bis „${r.next.title}“` : 'Höchster Rang erreicht! 👑')))));
  // big actions
  s.append(h('div', { class: 'row', style: { marginTop: '14px', gap: '10px' } },
    h('a', { class: 'btn teal', style: { flex: 1 }, href: '#/mix' }, '⚡ Schnell-Runde'),
    h('a', { class: 'btn lav', style: { flex: 1 }, href: '#/probe' }, '📝 Probearbeit')));
  // patients
  s.append(h('div', { class: 'section-title' }, '🏥 Deine Patienten'), h('p', { class: 'small muted', style: { margin: '-6px 4px 10px' } }, 'Jedes Kapitel heilt eine Katze. Bei 80 % ist sie gesund und kommt in deine Sammlung.'));
  s.append(patientGrid());
  s.append(h('p', { class: 'small muted center', style: { marginTop: '18px' } }, 'Tipp: Am iPhone in Safari auf „Teilen“ → „Zum Home-Bildschirm“, dann ist die App wie eine echte App.'));
  app.append(s);
  clearTimeout(introTimer);
  if (!S.seenIntro) introTimer = setTimeout(intro, 300);
}
let introTimer = null;

function patientGrid() {
  const g = h('div', { class: 'patients' });
  CHAPTERS.forEach((ch) => {
    const m = chapterMastery(ch.id), pm = patientMood(m), cat = catById(ch.cat);
    g.append(h('a', { class: 'patient', href: '#/k/' + ch.id, style: { '--c': ch.color } },
      h('div', { class: 'pic', html: patientSVG(ch) }),
      h('div', { class: 'who' }, ch.icon + ' ' + cat.name + ' · ' + pm.label),
      h('b', null, ch.short),
      h('div', { class: 'bar' }, h('i', { style: { width: Math.round(m * 100) + '%' } }))));
  });
  return g;
}

function intro() {
  if ($('.modal') || S.seenIntro || location.hash.length > 2) return;
  const inp = h('input', { type: 'text', placeholder: 'Dein Vorname', value: S.name || '', autocapitalize: 'words' });
  const content = h('div', { class: 'stack center' },
    h('div', { style: { width: '150px', margin: '0 auto' }, html: docSVG('wave' === 'x' ? 'wow' : 'happy', ['mirror']) }),
    h('h2', null, 'Willkommen in der Katzenklinik!'),
    h('p', null, 'Ich bin Dr. Schnurrhaar. Unsere Patienten sind krank, und du heilst sie, indem du Bio lernst. 🩺🐱'),
    h('p', { class: 'small muted' }, 'Jedes Kapitel = eine Katze. Mit Steckbrief-Karten, Erklär-Film, Stufe 1 (antippen) und Stufe 2 (eintippen). Am Mittwoch: Probearbeit!'),
    h('div', { class: 'field', style: { textAlign: 'left' } }, h('label', null, 'Wie heißt du?'), inp),
    h('button', { class: 'btn block', onclick: () => { S.name = inp.value.trim(); S.seenIntro = true; save(); snd.ensure(); snd.meow(); snd.purr(1.4, 0.35); close(); route(); } }, 'Los geht’s! 🐾'),
  );
  const close = modal(content, () => { S.seenIntro = true; save(); });
}

function topics() {
  tabs('lernen');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, 'Alle Kapitel'), h('p', { class: 'muted' }, 'Deine 11 Seiten in 10 kleinen Kapiteln. Jede Katze wird gesund, wenn du ihr Kapitel kannst.'));
  CHAPTERS.forEach((ch, i) => {
    const m = chapterMastery(ch.id);
    s.append(h('a', { class: 'mode', href: '#/k/' + ch.id, style: { marginBottom: '10px' } },
      h('div', { class: 'ic', style: { background: ch.color + '22' } }, ch.icon),
      h('div', null, h('b', null, `${i + 1}. ${ch.title}`), h('span', { class: 'sub' }, `${ch.page} · ${Math.round(m * 100)} % gekonnt`)),
      h('span', { class: 'go' }, '›')));
  });
  s.append(h('div', { class: 'section-title' }, '🖼️ Alle Abbildungen zum Beschriften'));
  const g = h('div', { class: 'chips', style: { flexWrap: 'wrap' } });
  Object.entries(DIAGRAMS).forEach(([id, d]) => g.append(h('a', { class: 'chip', href: '#/bild/' + id }, d.title)));
  s.append(g);
  app.append(s);
}

function chapter(id) {
  const ch = chapterById(id);
  if (!ch) return nav('#/');
  tabs('lernen');
  const st = chapterState(id), m = chapterMastery(id), cat = catById(ch.cat);
  const lv = (n) => { const qs = ch.q.filter((q) => usableAt(q, n)); return qs.length ? mastery(qs.map((q) => itemKey(q, n))) : 0; };
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'chap-head' }, h('div', { html: patientSVG(ch) }),
    h('div', null, h('div', { class: 'small muted' }, ch.icon + ' ' + ch.page), h('h1', { style: { fontSize: '1.4rem' } }, ch.title),
      h('div', { class: 'bar', style: { marginTop: '6px' } }, h('i', { style: { width: Math.round(m * 100) + '%', background: ch.color } })),
      h('div', { class: 'small muted', style: { marginTop: '4px' } }, `${cat.name}: ${patientMood(m).label} · ${Math.round(m * 100)} %`))));
  s.append(h('div', { class: 'bubble', style: { margin: '12px 0 4px' } }, ch.story));
  const modes = h('div', { class: 'modes', style: { marginTop: '14px' } });
  const mode = (ic, t, sub, href, extra = {}) => h('a', { class: 'mode', href, ...extra }, h('div', { class: 'ic', style: { background: ch.color + '22' } }, ic), h('div', null, h('b', null, t), h('span', { class: 'sub' }, sub)), h('span', { class: 'go' }, '›'));
  modes.append(
    mode('🃏', 'Steckbrief-Karten', `${(CARDS[id] || []).length} Karten · kurz & kompakt`, '#/karten/' + id),
    mode('🎬', 'Erklär-Film', st.video ? '✓ angeschaut · mit Stimme' : 'ca. 2 Min. · mit Stimme', '#/film/' + id),
    mode('📖', 'Lernkarte (ausführlich)', st.learned ? '✓ gelesen · mit Merksätzen & Korrekturen' : 'mit Merksätzen & Korrekturen', '#/lernen/' + id),
    mode('⭐', 'Stufe 1: Antippen', `${Math.round(lv(1) * 100)} % · Auswählen, Zuordnen, Beschriften`, `#/ueben/${id}/1`),
    mode('✍️', 'Stufe 2: Eintippen', `${Math.round(lv(2) * 100)} % · selbst schreiben wie im Test`, `#/ueben/${id}/2`),
  );
  const dias = [...new Set(ch.q.filter((q) => q.t === 'label').map((q) => q.d))];
  dias.forEach((d) => modes.append(mode('🖼️', 'Abbildung erkunden', DIAGRAMS[d].title, '#/bild/' + d)));
  s.append(modes);
  if (ch.yt && ch.yt.length) {
    s.append(h('div', { class: 'section-title' }, '▶️ Gute Erklärvideos (YouTube & Co.)'));
    const c = h('div', { class: 'card' });
    ch.yt.forEach((v) => c.append(h('a', { class: 'yt', href: v.url, target: '_blank', rel: 'noopener' }, h('div', { class: 'play' }, '▶'), h('div', null, h('b', null, v.title), h('span', null, v.ch)))));
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
  const s = h('div', { class: 'screen' });
  s.append(h('a', { href: '#/k/' + id, class: 'small' }, '‹ ' + ch.short), h('h1', null, '🃏 Steckbrief-Karten'));
  const tog = h('button', { class: 'btn ghost small' }, '🙈 Verdeckt üben');
  tog.onclick = () => { hidden = !hidden; tog.textContent = hidden ? '👀 Alles zeigen' : '🙈 Verdeckt üben'; $$('.qv', s).forEach((v) => v.classList.toggle('blur', hidden)); snd.tap(); };
  s.append(h('div', { class: 'row wrap', style: { marginBottom: '8px' } }, h('span', { class: 'small muted', style: { flex: 1 } }, 'Wische zur Seite. Im Verdeckt-Modus: erst überlegen, dann antippen!'), tog));
  const deck = h('div', { class: 'deck' });
  list.forEach((c, i) => {
    const card = h('div', { class: 'qcardx', style: { '--c': ch.color } });
    card.append(h('div', { class: 'qh' }, h('span', { class: 'qn' }, `${String.fromCharCode(65 + (CHAPTERS.indexOf(ch) % 26))}${i + 1}`), h('b', null, c.t), h('span', { class: 'qi' }, c.ic)));
    if (c.d) { const pic = h('div', { class: 'qp diagram', html: diagramSVG(c.d, { markers: false, arrow: c.d === 'neuron' }) }); highlight(pic, c.hl || []); card.append(pic); }
    const tb = h('div', { class: 'qrows' });
    c.rows.forEach(([k, v]) => {
      const val = h('span', { class: 'qv' + (hidden ? ' blur' : '') }, v);
      val.onclick = () => { if (val.classList.contains('blur')) { val.classList.remove('blur'); snd.tap(); } };
      tb.append(h('div', { class: 'qr' }, h('span', { class: 'qk' }, k), val));
    });
    card.append(tb);
    if (c.tip) card.append(h('div', { class: 'qt' }, '💡 ' + c.tip));
    deck.append(card);
  });
  s.append(deck);
  s.append(h('div', { class: 'row', style: { marginTop: '14px', gap: '10px' } },
    h('a', { class: 'btn ghost', style: { flex: 1 }, href: '#/lernen/' + id }, '📖 Mehr lesen'),
    h('a', { class: 'btn', style: { flex: 1 }, href: `#/ueben/${id}/1` }, '⭐ Jetzt üben')));
  app.append(s);
  if (!chapterState(id).learned) { chapterState(id).learned = true; save(); gainXP(10); }
}

/* ---------- Lernkarte ---------- */
function learn(id) {
  const ch = chapterById(id);
  tabs('lernen');
  const s = h('div', { class: 'screen' });
  s.append(h('a', { href: '#/k/' + id, class: 'small' }, '‹ ' + ch.short));
  const c = h('div', { class: 'card learn', html: ch.learn });
  s.append(c);
  // live diagrams inside the text
  $$('[data-diagram]', c).forEach((f) => {
    const did = f.dataset.diagram;
    const d = h('div', { class: 'diagram', html: diagramSVG(did, { arrow: !!f.dataset.arrow }) });
    const cap = h('div', { class: 'cap' }, '👆 Tipp auf eine Nummer');
    f.append(d, cap);
    const nums = numbering(did);
    d.addEventListener('click', (e) => {
      const mk = e.target.closest('.mk'); if (!mk) return;
      const p = partById(did, mk.dataset.part);
      $$('.mk', d).forEach((x) => x.classList.toggle('sel', x === mk));
      highlight(d, [p.id]); snd.tap();
      cap.innerHTML = `<b>${nums[p.id]} · ${esc(p.name)}</b> – ${esc(p.info)}`;
    });
  });
  s.append(h('div', { class: 'row', style: { marginTop: '14px', gap: '10px' } },
    h('a', { class: 'btn ghost', style: { flex: 1 }, href: '#/film/' + id }, '🎬 Film'),
    h('a', { class: 'btn', style: { flex: 1 }, href: `#/ueben/${id}/1` }, '⭐ Jetzt üben')));
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
  s.append(h('a', { href: '#/themen', class: 'small' }, '‹ Alle Abbildungen'), h('h1', null, D.title));
  if (D.note) s.append(h('p', { class: 'small muted' }, D.note));
  const d = h('div', { class: 'diagram card', html: diagramSVG(did, { arrow: did === 'neuron' }) });
  const cap = h('div', { class: 'card tint-teal', style: { marginTop: '10px', minHeight: '76px' } }, '👆 Tippe auf eine Nummer, dann siehst du den Namen und was es macht.');
  s.append(d, cap);
  const legend = h('div', { class: 'slots' });
  let showAll = false;
  const tog = h('button', { class: 'btn ghost small', style: { marginTop: '12px' } }, '👀 Alle Namen zeigen');
  tog.onclick = () => { showAll = !showAll; tog.textContent = showAll ? '🙈 Namen verstecken' : '👀 Alle Namen zeigen'; $$('.val', legend).forEach((v) => v.classList.toggle('blur', !showAll)); };
  D.parts.slice().sort((a, b) => nums[a.id] - nums[b.id]).forEach((p) => {
    const v = h('span', { class: 'val set blur' }, p.name);
    const el = h('div', { class: 'slot' }, h('span', { class: 'n' }, nums[p.id]), v);
    el.onclick = () => { v.classList.remove('blur'); pickPart(p); };
    legend.append(el);
  });
  function pickPart(p) {
    $$('.mk', d).forEach((x) => x.classList.toggle('sel', x.dataset.part === p.id));
    highlight(d, [p.id]); snd.tap();
    cap.innerHTML = `<b>${nums[p.id]} · ${esc(p.name)}</b><br>${esc(p.info)}`;
  }
  d.addEventListener('click', (e) => { const mk = e.target.closest('.mk'); if (mk) pickPart(partById(did, mk.dataset.part)); });
  s.append(tog, legend);
  const ch = CHAPTERS.find((c) => c.q.some((q) => q.t === 'label' && q.d === did));
  if (ch) s.append(h('div', { class: 'row', style: { marginTop: '14px', gap: '10px' } }, h('a', { class: 'btn', style: { flex: 1 }, href: `#/ueben/${ch.id}/1` }, '⭐ Beschriften üben')));
  app.append(s);
}

/* ---------- Erklär-Film ---------- */
function film(id) {
  const ch = chapterById(id);
  tabs('lernen');
  const scenes = ch.video;
  let i = 0, playing = false, timer = null, utter = null;
  const s = h('div', { class: 'screen' });
  s.append(h('a', { href: '#/k/' + id, class: 'small' }, '‹ ' + ch.short), h('h1', null, '🎬 ' + ch.title));
  const stage = h('div', { class: 'stage' });
  const sub = h('div', { class: 'sub' });
  const bar = h('i', { style: { width: '0%' } });
  const playBtn = h('button', { class: 'btn small', style: { minWidth: '110px' } }, '▶ Abspielen');
  const prev = h('button', { class: 'iconbtn' }, '⏮'), next = h('button', { class: 'iconbtn' }, '⏭');
  const voiceBtn = h('button', { class: 'iconbtn', 'aria-pressed': String(S.settings.voice), title: 'Stimme an/aus' }, '🗣️');
  const player = h('div', { class: 'player' }, stage, sub, h('div', { class: 'ctrl' }, prev, playBtn, next, h('div', { class: 'bar' }, bar), voiceBtn));
  s.append(player, h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Die Stimme kommt von deinem Gerät. Kein Ton? Am iPhone den Lautlos-Schalter prüfen und die Lautstärke hochdrehen.'));
  app.append(s);

  function show(k) {
    i = clamp(k, 0, scenes.length - 1);
    const sc = scenes[i];
    stage.innerHTML = '';
    stage.append(h('div', { class: 'title' }, `${i + 1} / ${scenes.length}`));
    let inner;
    if (sc.d) { inner = h('div', { class: 'scene diagram', html: diagramSVG(sc.d, { markers: false, arrow: sc.d === 'neuron' }) }); highlight(inner, sc.hl || []); }
    else if (sc.big) inner = h('div', { class: 'scene' }, h('div', { class: 'bigtext' }, h('div', { class: 'bt', html: esc(sc.big).replace(/\n/g, '<br>') }), h('div', { class: 'mini', html: docSVG('happy') })));
    else { const c = sc.cat === 'doc' ? docSVG('happy', ['mirror']) : sc.cat === 'sick' ? catPic(catById(ch.cat), 'sick', ['thermo']) : catPic(catById(sc.cat) || catById(ch.cat), 'happy'); inner = h('div', { class: 'scene', html: `<div style="width:62%;max-width:300px">${c}</div>` }); }
    stage.append(inner);
    sub.textContent = sc.say;
    bar.style.width = Math.round(((i + 1) / scenes.length) * 100) + '%';
  }
  function speak(text, cb) {
    clearTimeout(timer);
    const ss = window.speechSynthesis;
    if (!S.settings.voice || !ss) { timer = setTimeout(cb, Math.max(3200, text.split(' ').length * 420)); return; }
    ss.cancel();
    utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'de-DE';
    const v = germanVoice(); if (v) utter.voice = v;
    utter.rate = S.settings.rate || 1;
    let fired = false;
    utter.onend = () => { if (!fired) { fired = true; timer = setTimeout(cb, 450); } };
    utter.onerror = () => { if (!fired) { fired = true; timer = setTimeout(cb, 2500); } };
    snd.duck(true);
    ss.speak(utter);
  }
  function run() {
    if (!playing) return;
    show(i);
    speak(scenes[i].say, () => {
      if (!playing) return;
      if (i < scenes.length - 1) { i++; run(); }
      else finish();
    });
  }
  function finish() {
    playing = false; playBtn.textContent = '↺ Nochmal'; snd.duck(false);
    const st = chapterState(id);
    if (!st.video) { st.video = true; save(); gainXP(15); toast('Film geschaut: +15 🐟', docSVG('happy')); }
    stage.append(h('div', { class: 'scene', style: { background: 'color-mix(in srgb, var(--bg2) 92%, transparent)' } },
      h('div', { class: 'center stack' }, h('div', { style: { width: '120px', margin: '0 auto' }, html: docSVG('wink') }), h('b', null, 'Fertig! Jetzt du:'), h('a', { class: 'btn', href: `#/ueben/${id}/1` }, '⭐ Stufe 1 üben'))));
  }
  playBtn.onclick = () => {
    snd.ensure();
    if (playing) { playing = false; speechSynthesis?.cancel(); clearTimeout(timer); playBtn.textContent = '▶ Weiter'; snd.duck(false); return; }
    if (playBtn.textContent.startsWith('↺')) i = 0;
    playing = true; playBtn.textContent = '⏸ Pause'; run();
  };
  prev.onclick = () => { speechSynthesis?.cancel(); clearTimeout(timer); show(i - 1); if (playing) run(); };
  next.onclick = () => { speechSynthesis?.cancel(); clearTimeout(timer); show(i + 1); if (playing) run(); };
  voiceBtn.onclick = () => { S.settings.voice = !S.settings.voice; save(); voiceBtn.setAttribute('aria-pressed', String(S.settings.voice)); };
  show(0);
  cleanup = () => { playing = false; clearTimeout(timer); speechSynthesis?.cancel(); snd.duck(false); };
}
let _voice = null;
function germanVoice() {
  if (_voice) return _voice;
  const vs = speechSynthesis.getVoices();
  const de = vs.filter((v) => /^de/i.test(v.lang));
  _voice = de.find((v) => /anna|petra|helena|marlene|vicki|katja|female|siri/i.test(v.name)) || de.find((v) => /de-AT/i.test(v.lang)) || de[0] || null;
  return _voice;
}
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => { _voice = null; germanVoice(); };

/* ---------- Quiz (chapter level 1/2, or mixed) ---------- */
function quiz({ chapter: cid, level, mix }) {
  focusMode(true);
  tabs('ueben');
  let queue;
  if (mix) {
    // mix: weakest questions across all chapters, level depends on progress
    const pool = [];
    for (const ch of CHAPTERS) {
      const l1 = mastery(ch.q.filter((q) => usableAt(q, 1)).map((q) => itemKey(q, 1)));
      const lv = l1 >= 0.7 ? 2 : 1;
      pickSession(ch.q.filter((q) => q.t !== 'explain'), lv, 3).forEach((q) => pool.push({ q, level: lv }));
    }
    queue = shuffle(pool).sort((a, b) => item(itemKey(a.q, a.level)).box - item(itemKey(b.q, b.level)).box).slice(0, 10);
    queue = shuffle(queue);
  } else {
    queue = pickSession(chapterQuestions(cid), level, 10).map((q) => ({ q, level }));
  }
  if (!queue.length) { app.append(h('p', null, 'Keine Fragen gefunden.')); return; }
  snd.moodMusic('happy');
  const total = queue.length;
  let pos = 0, combo = 0, right = 0, xp = 0, answered = 0, requeued = new Set(), scoreSum = 0;
  const s = h('div', { class: 'screen' });
  const barI = h('i', { style: { width: '0%' } });
  const comboEl = h('div', { class: 'combo' });
  s.append(h('div', { class: 'qtop' }, h('button', { class: 'close', onclick: () => history.length > 1 ? history.back() : nav('#/') }, '✕'), h('div', { class: 'bar' }, barI), comboEl));
  const body = h('div');
  s.append(body);
  app.append(s);
  next();

  function next() {
    if (pos >= queue.length) return end();
    const { q, level: lv } = queue[pos];
    body.innerHTML = '';
    body.append(renderQuestion(q, { level: lv, exam: false, done: (res) => answer(q, lv, res) }));
    barI.style.width = Math.round((answered / (total + requeued.size)) * 100) + '%';
  }
  function answer(q, lv, res) {
    answered++;
    const key = itemKey(q, lv);
    record(key, res.ok, res.score);
    scoreSum += res.score;
    if (res.ok) { right++; combo++; S.stats.bestCombo = Math.max(S.stats.bestCombo, combo); } else combo = 0;
    const base = (lv === 2 ? 20 : 10) * res.score;
    const bonus = res.ok ? Math.min(10, Math.max(0, combo - 1) * 2) : 0;
    const gain = Math.round(base + bonus);
    xp += gain;
    if (res.ok) snd.correct(combo); else snd.wrong();
    if (combo >= 3) { comboEl.textContent = `🔥 ${combo}`; comboEl.classList.remove('hot'); void comboEl.offsetWidth; comboEl.classList.add('hot'); if (combo % 5 === 0) snd.purr(1.2, 0.4); } else comboEl.textContent = '';
    if (!res.ok && !requeued.has(q.id + lv) && res.score < 0.5) { requeued.add(q.id + lv); queue.splice(Math.min(queue.length, pos + 3), 0, { q, level: lv }); }
    save();
    sheet(res, gain);
  }
  function sheet(res, gain) {
    const ok = res.ok;
    const head = ok ? pick(['Super!', 'Miau-tastisch!', 'Perfekt!', 'Pfotenstark!', 'Richtig!', 'Schnurr-genial!']) : (res.score >= 0.5 ? 'Fast!' : pick(['Nicht ganz …', 'Hoppla!', 'Noch nicht …']));
    const el = h('div', { class: 'sheet ' + (ok ? 'ok' : 'bad') }, h('div', { class: 'inner' },
      h('div', { class: 'head', html: (ok ? docSVG('wink') : docSVG('sick')) + `<span>${head}${gain ? ` <span class="small">+${gain} 🐟</span>` : ''}</span>` }),
      res.html ? h('div', { class: 'expl', html: res.html }) : null,
      h('button', { class: 'btn', onclick: () => { el.remove(); pos++; next(); } }, ok ? 'Weiter' : 'Verstanden, weiter')));
    document.body.append(el);
    el.querySelector('button').focus({ preventScroll: true });
  }
  function end() {
    focusMode(false);
    const pct = scoreSum / answered;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
    gainXP(xp + stars * 5);
    if (cid) { const st = chapterState(cid); const k = 'l' + level; st[k] = Math.max(st[k] || 0, pct); }
    if (level === 2 && pct >= 0.5) S.stats.typedRound = true;
    save();
    snd.moodMusic(S.settings.track);
    if (stars >= 2) { snd.purr(1.8, 0.45); confetti(stars === 3 ? 90 : 40); } else snd.meow({ pitch: 0.9 });
    const ch = cid ? chapterById(cid) : null;
    const catSvg = ch ? patientSVG(ch) : docSVG(stars >= 2 ? 'wow' : 'happy');
    body.innerHTML = '';
    barI.style.width = '100%';
    body.append(h('div', { class: 'result card' },
      h('div', { class: 'cat', html: catSvg }),
      h('div', { class: 'stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('h2', null, stars === 3 ? 'Ausgezeichnet!' : stars === 2 ? 'Sehr gut gemacht!' : stars === 1 ? 'Guter Anfang!' : 'Weiter üben, du schaffst das!'),
      ch ? h('p', { class: 'muted' }, `${catById(ch.cat).name} ist jetzt zu ${Math.round(chapterMastery(cid) * 100)} % gesund.`) : null,
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, Math.round(pct * 100) + ' %'), h('span', null, 'richtig')), h('div', { class: 'stat' }, h('b', null, '+' + (xp + stars * 5)), h('span', null, 'Leckerli 🐟')), h('div', { class: 'stat' }, h('b', null, S.stats.bestCombo), h('span', null, 'beste Serie 🔥'))),
      h('div', { class: 'stack' },
        h('button', { class: 'btn block', onclick: () => route() }, '🔁 Noch eine Runde'),
        cid && level === 1 && pct >= 0.7 ? h('a', { class: 'btn teal block', href: `#/ueben/${cid}/2` }, '✍️ Weiter mit Stufe 2') : null,
        h('a', { class: 'btn ghost block', href: cid ? '#/k/' + cid : '#/' }, 'Zurück'))));
    checkUnlocks();
  }
  cleanup = () => { $$('.sheet').forEach((x) => x.remove()); snd.moodMusic(S.settings.track); };
}

/* ---------- Probearbeit (20 min, like the real test) ---------- */
function probeIntro() {
  tabs('ueben');
  const s = h('div', { class: 'screen' });
  s.append(h('div', { class: 'hero' }, h('div', { class: 'cat', html: docSVG('happy', ['book']) }), h('div', { class: 'bubble' }, 'Die Generalprobe! So wie ein echter Bio-Test: 20 Minuten, gemischte Aufgaben, und erst am Ende gibt es die Note.')));
  s.append(h('div', { class: 'card', style: { marginTop: '14px' } },
    h('h2', null, '📝 Probearbeit'),
    h('ul', null,
      h('li', null, '20 Minuten (so lang darf ein Test in der Oberstufe höchstens dauern)'),
      h('li', null, 'ca. 24 Punkte: Nervenzelle beschriften, Enzym-Tabelle, Zuordnen, Richtig/Falsch, Fragen zum Eintippen, eine Erklär-Aufgabe'),
      h('li', null, 'Kein Feedback zwischendurch, wie im echten Test'),
      h('li', null, 'Jedes Mal andere Aufgaben')),
    h('p', { class: 'small muted' }, 'Notenschlüssel (übliches Schema, deine Lehrkraft kann es anders machen): ab 90 % Sehr gut · ab 80 % Gut · ab 65 % Befriedigend · ab 50 % Genügend.'),
    h('a', { class: 'btn lav block', href: '#/probe/los' }, 'Start: 20 Minuten ⏱️')));
  if (S.probe.length) {
    s.append(h('div', { class: 'section-title' }, '📈 Deine bisherigen Probearbeiten'));
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
  items.push({ q: pick(by('label', (q) => q.d !== 'neuron' && q.parts !== 'all' && q.parts.length <= 6) .concat(by('label', (q) => q.d === 'zaehne' || q.d === 'schleimhaut'))), level: 2, pts: 3 });
  sample(by('fact'), 3).forEach((q) => items.push({ q, level: 2, pts: 1 }));
  sample(by('tf', (q) => !q.ok), 2).forEach((q) => items.push({ q, level: 1, pts: 1 }));
  items.push({ q: pick(by('match')), level: 1, pts: 2 });
  items.push({ q: pick(by('order')), level: 1, pts: 1 });
  items.push({ q: pick(by('explain')), level: 2, pts: 2 });
  return items;
}

function probeRun() {
  focusMode(true);
  tabs('ueben');
  snd.moodMusic('focus');
  const items = buildProbe();
  const max = items.reduce((a, b) => a + b.pts, 0);
  const results = [];
  let pos = 0, left = 20 * 60;
  const s = h('div', { class: 'screen' });
  const clock = h('div', { class: 'combo', style: { minWidth: '70px', color: 'var(--ink)' } }, '20:00');
  const barI = h('i', { style: { width: '0%' } });
  s.append(h('div', { class: 'qtop' }, h('button', { class: 'close', onclick: () => { if (confirm('Probearbeit abbrechen?')) nav('#/probe'); } }, '✕'), h('div', { class: 'bar accent' }, barI), clock));
  const body = h('div');
  s.append(body);
  app.append(s);
  const tick = setInterval(() => {
    left--;
    const m = Math.floor(left / 60), sec = left % 60;
    clock.textContent = `${m}:${String(sec).padStart(2, '0')}`;
    if (left === 60) { toast('Noch 1 Minute! ⏱️'); snd.mrrp(); }
    if (left <= 0) { clearInterval(tick); finish(true); }
  }, 1000);
  cleanup = () => { clearInterval(tick); snd.moodMusic(S.settings.track); };
  show();
  function show() {
    if (pos >= items.length) return finish(false);
    const it = items[pos];
    body.innerHTML = '';
    body.append(h('div', { class: 'small muted', style: { margin: '0 4px 8px', fontWeight: 800 } }, `Aufgabe ${pos + 1} von ${items.length} · ${it.pts} ${it.pts === 1 ? 'Punkt' : 'Punkte'}`));
    body.append(renderQuestion(it.q, { level: it.level, exam: true, done: (res) => {
      results.push({ it, res });
      if (it.q.ch) record(itemKey(it.q, it.level), res.ok, res.score);
      setTimeout(() => { pos++; barI.style.width = Math.round((pos / items.length) * 100) + '%'; show(); }, res.selfChecked ? 300 : 650);
    } }));
  }
  function finish(timeUp) {
    clearInterval(tick);
    clock.textContent = '✓';
    focusMode(false);
    const points = Math.round(results.reduce((a, r) => a + r.res.score * r.it.pts, 0) * 2) / 2;
    const pct = Math.round((points / max) * 100);
    const grade = pct >= 90 ? 1 : pct >= 80 ? 2 : pct >= 65 ? 3 : pct >= 50 ? 4 : 5;
    const names = ['', 'Sehr gut', 'Gut', 'Befriedigend', 'Genügend', 'Nicht genügend'];
    S.probe.push({ date: new Date().toLocaleDateString('de-AT'), pct, grade, points, max });
    gainXP(Math.round(points * 5));
    save();
    snd.moodMusic(S.settings.track);
    if (grade <= 2) { snd.fanfare(); confetti(100); } else snd.meow();
    body.innerHTML = '';
    const r = h('div', { class: 'result card' },
      timeUp ? h('p', { class: 'tag warn' }, '⏱️ Zeit abgelaufen') : null,
      h('div', { class: 'cat', html: docSVG(grade <= 2 ? 'wow' : 'happy', grade === 1 ? ['crown'] : ['book']) }),
      h('div', { class: 'grade' }, grade),
      h('h2', null, names[grade]),
      h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', null, `${points}/${max}`), h('span', null, 'Punkte')), h('div', { class: 'stat' }, h('b', null, pct + ' %'), h('span', null, 'erreicht')), h('div', { class: 'stat' }, h('b', null, '+' + Math.round(points * 5)), h('span', null, 'Leckerli 🐟'))),
      h('p', { class: 'muted' }, grade <= 2 ? 'Wow! So kannst du am Freitag ganz entspannt hineingehen.' : 'Schau dir unten die Lösungen an und übe die Kapitel mit den meisten Fehlern nochmal.'));
    body.append(r);
    body.append(h('div', { class: 'section-title' }, '🔍 Auflösung'));
    results.forEach(({ it, res }, k) => {
      const ok = res.score >= 0.99;
      const det = res.detail ? '<br>' + res.detail.map((d) => `${d.n}: ${d.you ? esc(d.you) : '–'} ${d.ok ? '✓' : '→ <b>' + esc(d.right) + '</b>'}`).join('<br>') : '';
      body.append(h('div', { class: 'card', style: { borderLeft: `6px solid var(--${ok ? 'good' : res.score > 0 ? 'sun' : 'bad'})` } },
        h('div', { class: 'small muted' }, `Aufgabe ${k + 1} · ${Math.round(res.score * it.pts * 2) / 2}/${it.pts} P.`),
        h('b', null, it.q.q || ''),
        h('div', { class: 'small', style: { marginTop: '6px' }, html: (res.you ? `Deine Antwort: ${esc(res.you)}<br>` : '') + (res.html || '') + det })));
    });
    body.append(h('div', { class: 'stack', style: { marginTop: '14px' } }, h('a', { class: 'btn lav block', href: '#/probe' }, 'Nochmal (neue Aufgaben)'), h('a', { class: 'btn ghost block', href: '#/' }, 'Zur Klinik')));
    checkUnlocks();
  }
}

/* ---------- Katzen-Sammlung ---------- */
function catsPage() {
  tabs('katzen');
  const s = h('div', { class: 'screen' });
  const n = S.cats.length;
  s.append(h('h1', null, '🐱 Deine Katzen'), h('p', { class: 'muted' }, `${n} von ${CATS.length} Katzen gesammelt. Heile Patienten (Kapitel zu 80 % können) und schaffe Bonus-Aufgaben!`));
  const g = h('div', { class: 'catgrid' });
  CATS.forEach((c) => {
    const has = S.cats.includes(c.id);
    const ch = CHAPTERS.find((x) => x.cat === c.id);
    const cell = h('button', { class: 'catcell' + (has ? '' : ' locked'), html: catPic(c, has ? 'happy' : 'sleep') });
    cell.append(h('b', null, has ? c.name : '???'), h('span', null, has ? c.breed : (c.bonus || (ch ? 'Heile: ' + ch.short : ''))));
    cell.onclick = () => {
      snd.ensure();
      if (has) { snd.meow({ pitch: 0.85 + Math.random() * 0.4 }); setTimeout(() => snd.purr(1.6, 0.4), 700); }
      else snd.mrrp();
      modal(h('div', { class: 'stack center' },
        h('div', { style: { width: '170px', margin: '0 auto' }, html: catPic(c, has ? 'happy' : 'sleep', has ? ['heart'] : ['zzz']) }),
        h('h2', null, has ? c.name : 'Noch nicht freigeschaltet'),
        h('p', { class: 'muted' }, has ? c.breed : (c.bonus ? 'So bekommst du diese Katze: ' + c.bonus : `Heile ${catById(c.id).name} im Kapitel „${ch.title}“ (80 %).`)),
        h('div', { class: 'box vet', style: { textAlign: 'left' } }, h('span', { class: 't' }, '🐾 Tierärztinnen-Wissen'), has ? c.fact : 'Dieses Wissen bekommst du, wenn du die Katze freigeschaltet hast.'),
        h('button', { class: 'btn block', onclick: (e) => e.target.closest('.modal').remove() }, 'Schließen')));
    };
    g.append(cell);
  });
  s.append(g);
  // rank ladder
  s.append(h('div', { class: 'section-title' }, '🩺 Deine Karriere'));
  const r = rankFor();
  const c = h('div', { class: 'card' });
  RANKS.forEach((rk, i) => c.append(h('div', { class: 'task' + (i <= r.i ? ' done' : '') }, h('span', null, i <= r.i ? rk.icon : '🔒'), h('b', { style: { flex: 1 } }, rk.title), h('span', { class: 'small muted' }, rk.xp + ' 🐟'))));
  s.append(c);
  app.append(s);
}

/* ---------- Lernplan ---------- */
function planPage() {
  tabs('plan');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, '📅 Dein Lernplan'), h('p', { class: 'muted' }, 'Nach Lernforschung: oft kurz abfragen statt lange lesen, Themen mischen, Pausen machen und genug schlafen. Lerne 25 Minuten, dann 5 Minuten Pause; nach 4 Runden eine lange Pause.'));
  const t = todayStr();
  PLAN.forEach((d) => {
    const done = d.tasks.filter((x) => S.plan[x.id]).length;
    const card = h('div', { class: 'card day' + (d.date === t ? ' today' : ''), style: { marginBottom: '12px' } });
    const dt = new Date(d.date + 'T00:00:00');
    card.append(h('div', { class: 'd' }, d.day, h('b', null, dt.getDate()), h('span', { class: 'small' }, done + '/' + d.tasks.length)));
    const list = h('div', null, h('b', null, d.label));
    d.tasks.forEach((x) => {
      const cb = h('input', { type: 'checkbox' }); cb.checked = !!S.plan[x.id];
      const row = h('label', { class: 'task' + (cb.checked ? ' done' : '') }, cb, x.link ? h('span', null, h('a', { href: x.link }, x.text)) : h('span', null, x.text));
      cb.onchange = () => { S.plan[x.id] = cb.checked; row.classList.toggle('done', cb.checked); save(); if (cb.checked) { snd.correct(2); gainXP(5); } };
      list.append(row);
    });
    card.append(list);
    s.append(card);
  });
  s.append(h('div', { class: 'box tip' }, h('span', { class: 't' }, '🧠 Die 5 Lern-Tricks'), h('ul', null,
    h('li', null, '**Abfragen** statt nur lesen: Die App fragt dich ab.'.replace(/\*\*/g, '')),
    h('li', null, 'Mehrmals kurz statt einmal lang (verteilt über die Tage)'),
    h('li', null, 'Themen mischen (Schnell-Runde)'),
    h('li', null, 'Bild + Wort: Abbildungen aus dem Kopf zeichnen'),
    h('li', null, 'Schlafen: Nachts speichert das Gehirn das Gelernte'))));
  app.append(s);
}

/* ---------- Einstellungen ---------- */
function settingsPage() {
  tabs('plan');
  const s = h('div', { class: 'screen' });
  s.append(h('h1', null, '⚙️ Einstellungen'));
  const c = h('div', { class: 'card' });
  const name = h('input', { type: 'text', value: S.name || '', placeholder: 'Vorname' });
  name.onchange = () => { S.name = name.value.trim(); save(); };
  const date = h('input', { type: 'date', value: S.settings.examDate });
  date.onchange = () => { S.settings.examDate = date.value; save(); };
  const track = h('select', null, Object.entries(snd.TRACKS).map(([k, v]) => { const o = h('option', { value: k }, v.name); if (k === S.settings.track) o.selected = true; return o; }));
  track.onchange = () => { snd.setMusic(true, track.value); topbar(); };
  const theme = h('select', null, [['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([k, v]) => { const o = h('option', { value: k }, v); if (k === S.settings.theme) o.selected = true; return o; }));
  theme.onchange = () => { S.settings.theme = theme.value; save(); applyTheme(); };
  const rate = h('select', null, [[0.85, 'langsam'], [1, 'normal'], [1.15, 'schnell']].map(([k, v]) => { const o = h('option', { value: k }, v); if (+k === +S.settings.rate) o.selected = true; return o; }));
  rate.onchange = () => { S.settings.rate = +rate.value; save(); };
  const toggle = (label, key, after) => { const cb = h('input', { type: 'checkbox' }); cb.checked = !!S.settings[key]; cb.onchange = () => { S.settings[key] = cb.checked; save(); after && after(cb.checked); topbar(); }; return h('label', { class: 'toggle' }, h('span', null, label), cb); };
  c.append(
    h('div', { class: 'field' }, h('label', null, 'Dein Name'), name),
    h('div', { class: 'field' }, h('label', null, 'Datum des Bio-Tests'), date),
    toggle('🔔 Töne (Miau, Schnurren …)', 'sound', (on) => on && snd.meow()),
    toggle('🎵 Hintergrundmusik', 'music', (on) => snd.setMusic(on)),
    h('div', { class: 'field' }, h('label', null, 'Musikstück'), track),
    toggle('🗣️ Stimme in den Erklär-Filmen', 'voice'),
    h('div', { class: 'field' }, h('label', null, 'Sprechtempo'), rate),
    h('div', { class: 'field' }, h('label', null, 'Aussehen'), theme),
  );
  s.append(c);
  s.append(h('div', { class: 'card', style: { marginTop: '14px' } },
    h('h3', null, '📲 Auf dem iPhone installieren'),
    h('ol', { style: { paddingLeft: '1.2em' } }, h('li', null, 'Diese Seite in Safari öffnen'), h('li', null, 'Unten auf „Teilen“ (Quadrat mit Pfeil) tippen'), h('li', null, '„Zum Home-Bildschirm“ wählen')),
    h('p', { class: 'small muted' }, 'Danach startet Schnurrologie wie eine App und funktioniert auch offline. Dein Fortschritt bleibt auf diesem Gerät gespeichert.')));
  s.append(h('div', { class: 'card', style: { marginTop: '14px' } },
    h('h3', null, 'Fortschritt'),
    h('p', { class: 'small muted' }, `${S.stats.answered} Antworten · ${S.stats.correct} richtig · ${S.cats.length} Katzen`),
    h('button', { class: 'btn ghost small', onclick: () => { if (confirm('Wirklich allen Fortschritt löschen?')) { reset(); route(); } } }, '🗑️ Alles zurücksetzen')));
  s.append(h('p', { class: 'small muted center', style: { marginTop: '16px' } }, 'Schnurrologie · mit Liebe für eine zukünftige Tierärztin gebaut 🐾'));
  app.append(s);
}

/* ================= boot ================= */
document.body.prepend(h('header', { id: 'top' }));
document.body.append(
  h('nav', { id: 'tabs' }, h('div', { class: 'inner' },
    [['start', '#/', '🏠', 'Klinik'], ['lernen', '#/themen', '📚', 'Kapitel'], ['ueben', '#/mix', '⚡', 'Üben'], ['katzen', '#/katzen', '🐱', 'Katzen'], ['plan', '#/plan', '📅', 'Plan']]
      .map(([k, href, ic, label]) => h('a', { href, 'data-tab': k }, h('span', { class: 'ic' }, ic), label)))),
  h('div', { id: 'toast' }),
  h('canvas', { id: 'fx' }),
);
route();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
