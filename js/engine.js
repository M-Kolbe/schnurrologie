/* Question renderers + quiz session.
   Level 1 = tap/choose, Level 2 = type. Exam mode = no feedback until the end. */
import { h, shuffle, sample, pick, matchAnswer, esc } from './util.js';
import { DIAGRAMS, diagramSVG, numbering, highlight } from './diagrams.js';
import { ENZYME_GRID } from './content.js';
import * as snd from './audio.js';

const TYPE_NAMES = {
  fact: 'Frage', mc: 'Auswahl', multi: 'Mehrere richtig', tf: 'Richtig oder falsch?', match: 'Zuordnen', order: 'Reihenfolge',
  sort: 'Sortieren', cloze: 'Lückentext', label: 'Beschriften', grid: 'Tabelle', explain: 'Erklären', formula: 'Zahnformel', pick: 'Bild-Frage',
};
const L1 = new Set(['fact', 'mc', 'multi', 'tf', 'match', 'order', 'sort', 'cloze', 'label', 'grid', 'formula', 'pick']);
const L2 = new Set(['fact', 'cloze', 'label', 'grid', 'explain', 'tf', 'order', 'formula', 'pick']);
export const usableAt = (q, level) => (level === 1 ? L1 : L2).has(q.t);

/* Each renderer: render(q, ctx) -> element. ctx: { level, exam, done(result) }.
   result: { score 0..1, ok, html (feedback), answer (short text of the correct answer) } */
export function renderQuestion(q, ctx) {
  const wrap = h('div', { class: 'qcard' });
  const kind = h('div', { class: 'qkind' }, ctx.level === 2 && ['fact', 'cloze', 'label', 'grid', 'formula'].includes(q.t) ? 'Eintippen · ' : '', TYPE_NAMES[q.t] || '');
  wrap.append(kind);
  const R = RENDER[q.t];
  R(q, ctx, wrap);
  return wrap;
}

function title(text) { return h('div', { class: 'qtext' }, text); }
function actions(btnText, onClick, disabled = false) {
  const b = h('button', { class: 'btn block', onclick: onClick }, btnText);
  if (disabled) b.disabled = true;
  return { box: h('div', { class: 'qactions' }, b), btn: b };
}

const RENDER = {
  /* ---------- dental formula (Seite 4): fill the table ---------- */
  formula(q, ctx, wrap) {
    wrap.append(title(q.q));
    const F = q.which === 'milch'
      ? { cols: ['M', 'C', 'I', 'I', 'C', 'M'], row: [2, 1, 2, 2, 1, 2], total: 20, opts: [16, 20, 24, 28] }
      : { cols: ['M', 'P', 'C', 'I', 'I', 'C', 'P', 'M'], row: [3, 2, 1, 2, 2, 1, 2, 3], total: 32, opts: [20, 28, 32, 36] };
    const half = F.row.length / 2 - 1;
    const table = h('table', { class: 'formula' });
    table.append(h('tr', null, h('th', { class: 'side' }, ''), F.cols.map((c, i) => h('th', { class: i === half ? 'mid' : '' }, c))));
    const cells = [];
    [['Oberkiefer', 'OK'], ['Unterkiefer', 'UK']].forEach(([name, short], r) => {
      const tr = h('tr', { class: r === 0 ? 'upper' : 'lower' }, h('th', { class: 'side', title: name }, short));
      F.row.forEach((val, i) => {
        let el;
        if (ctx.level === 1) {
          el = h('button', { class: 'fcell', 'aria-label': `${name} ${F.cols[i]}` }, '?');
          el.dataset.v = '';
          el.onclick = () => { snd.tap(); const v = el.dataset.v === '' ? 1 : (+el.dataset.v + 1) % 4; el.dataset.v = v; el.textContent = v; el.classList.add('set'); upd(); };
        } else {
          el = h('input', { class: 'fcell', type: 'text', inputmode: 'numeric', maxlength: '1', autocomplete: 'off', 'aria-label': `${name} ${F.cols[i]}` });
          el.addEventListener('input', () => { el.value = el.value.replace(/[^0-9]/g, ''); const k = cells.findIndex((c) => c.el === el); if (el.value && cells[k + 1]) cells[k + 1].el.focus(); upd(); });
        }
        cells.push({ el, val });
        tr.append(h('td', { class: i === half ? 'mid' : '' }, el));
      });
      table.append(tr);
    });
    wrap.append(h('div', { class: 'formulawrap' }, table));
    let total = null;
    const tot = h('div', { class: 'row wrap', style: { marginTop: '12px', gap: '8px' } }, h('b', null, 'Summe = '));
    if (ctx.level === 1) {
      F.opts.forEach((n) => { const b = h('button', { class: 'word' }, n + ' Zähne'); b.onclick = () => { snd.tap(); total = n; $$sel(tot, b); upd(); }; tot.append(b); });
    } else {
      const inp = h('input', { class: 'gap', type: 'text', inputmode: 'numeric', style: { width: '80px' }, 'aria-label': 'Summe' });
      inp.addEventListener('input', () => { total = parseInt(inp.value, 10); upd(); });
      tot.append(inp, h('span', null, ' Zähne'));
    }
    wrap.append(h('div', { class: 'hint' }, ctx.level === 1 ? 'Tippe auf ein Feld, bis die richtige Zahl dasteht (1, 2, 3, 0 …).' : 'Trag für jedes Feld die Anzahl der Zähne ein.'), tot);
    const act = actions('Prüfen', () => {
      act.btn.disabled = true;
      let right = 0;
      cells.forEach((c) => { const v = ctx.level === 1 ? c.el.dataset.v : c.el.value; const ok = String(v) === String(c.val); if (ok) right++; c.el.disabled = true; if (!ctx.exam) { c.el.classList.add(ok ? 'ok' : 'bad'); if (!ok) c.el.textContent !== undefined && (ctx.level === 1 ? (c.el.textContent = c.val) : (c.el.value = c.val)); } });
      const totOk = total === F.total;
      if (totOk) right++;
      const max = cells.length + 1;
      const half2 = F.row.slice(0, F.row.length / 2).reverse().join('-');
      ctx.done({ score: right / max, ok: right === max, html: `<b>Richtig:</b> pro Viertel ${half2} (von der Mitte aus: ${F.cols.slice(F.cols.length / 2).join('-')}), insgesamt <b>${F.total} Zähne</b>.${q.which === 'milch' ? ' Im Milchgebiss gibt es keine Prämolaren (P).' : ''}`, answer: F.total + ' Zähne' });
    }, true);
    wrap.append(act.box);
    function upd() {
      const filled = cells.every((c) => (ctx.level === 1 ? c.el.dataset.v !== '' : c.el.value !== ''));
      act.btn.disabled = !(filled && total != null && !Number.isNaN(total));
    }
    function $$sel(box, b) { box.querySelectorAll('.word').forEach((x) => x.classList.toggle('sel', x === b)); }
  },
  /* ---------- multiple choice with a picture ---------- */
  pick(q, ctx, wrap) {
    wrap.append(title(q.q));
    if (q.d) {
      const dg = h('div', { class: 'diagram qpic', html: diagramSVG(q.d, { markers: q.markers !== false, only: q.only, arrow: false }) });
      if (q.hl) highlight(dg, q.hl);
      wrap.append(dg);
    }
    choice(wrap, shuffle([q.a, ...q.wrong]), (o) => o === q.a, ctx, q, q.a);
  },
  /* ---------- fact: L1 multiple choice, L2 typing ---------- */
  fact(q, ctx, wrap) {
    wrap.append(title(q.q));
    if (ctx.level === 1) {
      const opts = shuffle([q.a, ...sample(q.wrong, 3)]);
      choice(wrap, opts, (o) => o === q.a, ctx, q, q.a);
    } else {
      typeBox(wrap, q.alts, ctx, q);
    }
  },
  mc(q, ctx, wrap) {
    wrap.append(title(q.q));
    choice(wrap, shuffle([q.a, ...q.wrong]), (o) => o === q.a, ctx, q, q.a);
  },
  tf(q, ctx, wrap) {
    wrap.append(h('div', { class: 'qtext' }, '„' + q.q + '“'));
    const box = h('div', { class: 'opts', style: { gridTemplateColumns: '1fr 1fr' } });
    let locked = false;
    for (const [label, val] of [['✓ Richtig', true], ['✗ Falsch', false]]) {
      const b = h('button', { class: 'opt', style: { justifyContent: 'center', fontSize: '1.1rem' } }, label);
      b.onclick = () => {
        if (locked) return; locked = true;
        const ok = val === q.ok;
        if (!ctx.exam) { b.classList.add(ok ? 'ok' : 'bad'); } else b.classList.add('sel');
        const fix = q.ok ? 'Die Aussage stimmt.' : `Die Aussage ist falsch. <b>Richtig:</b> ${esc(q.fix)}`;
        ctx.done({ score: ok ? 1 : 0, ok, html: fix + (q.ex ? `<br>${esc(q.ex)}` : ''), answer: q.ok ? 'richtig' : 'falsch: ' + q.fix });
      };
      box.append(b);
    }
    wrap.append(box);
  },
  multi(q, ctx, wrap) {
    wrap.append(title(q.q), h('div', { class: 'hint', style: { marginTop: '-8px', marginBottom: '10px' } }, 'Tippe alle richtigen an.'));
    const opts = shuffle([...q.right, ...q.wrong]);
    const sel = new Set();
    const box = h('div', { class: 'opts' });
    const btns = opts.map((o) => {
      const b = h('button', { class: 'opt' }, h('span', { class: 'key' }, '☐'), o);
      b.onclick = () => { snd.tap(); if (sel.has(o)) { sel.delete(o); b.classList.remove('sel'); b.firstChild.textContent = '☐'; } else { sel.add(o); b.classList.add('sel'); b.firstChild.textContent = '☑'; } act.btn.disabled = !sel.size; };
      box.append(b); return [o, b];
    });
    wrap.append(box);
    const act = actions('Prüfen', () => {
      act.btn.disabled = true;
      let hit = 0, miss = 0;
      for (const [o, b] of btns) {
        const right = q.right.includes(o);
        if (sel.has(o) && right) hit++;
        if (sel.has(o) && !right) miss++;
        if (!ctx.exam) b.classList.add(right ? 'ok' : (sel.has(o) ? 'bad' : 'dim'));
        b.disabled = true;
      }
      const score = Math.max(0, (hit - miss) / q.right.length);
      const ok = hit === q.right.length && miss === 0;
      ctx.done({ score, ok, html: `<b>Richtig sind:</b> ${q.right.map(esc).join(', ')}.` + (q.ex ? `<br>${esc(q.ex)}` : ''), answer: q.right.join(', ') });
    }, true);
    wrap.append(act.box);
  },
  match(q, ctx, wrap) {
    wrap.append(title(q.q), h('div', { class: 'hint', style: { marginTop: '-8px', marginBottom: '10px' } }, 'Tippe links an, dann das passende Feld rechts.'));
    const left = shuffle(q.pairs.map((p, i) => [p[0], i]));
    const right = shuffle(q.pairs.map((p, i) => [p[1], i]));
    let selL = null, mistakes = 0, matched = 0;
    const grid = h('div', { class: 'pairs' });
    const colL = h('div', { class: 'col' }), colR = h('div', { class: 'col' });
    const lb = left.map(([t, i]) => { const b = h('button', { class: 'pair' }, t); b.dataset.i = i; colL.append(b); return b; });
    const rb = right.map(([t, i]) => { const b = h('button', { class: 'pair' }, t); b.dataset.i = i; colR.append(b); return b; });
    lb.forEach((b) => b.onclick = () => { if (b.classList.contains('done')) return; snd.tap(); lb.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); selL = b; });
    rb.forEach((b) => b.onclick = () => {
      if (b.classList.contains('done') || !selL) return;
      if (b.dataset.i === selL.dataset.i) {
        b.classList.add('done'); selL.classList.add('done'); selL.classList.remove('sel'); selL = null; matched++;
        if (!ctx.exam) snd.correct(matched);
        if (matched === q.pairs.length) finish();
      } else {
        mistakes++;
        if (ctx.exam) { // in the exam a wrong pair still locks (no second chance)
          b.classList.add('done'); selL.classList.add('done'); selL.classList.remove('sel'); selL = null; matched++;
          if (matched === q.pairs.length) finish();
        } else { snd.wrong(); b.classList.add('shake'); selL.classList.add('shake'); const s = selL; setTimeout(() => { b.classList.remove('shake'); s.classList.remove('shake'); }, 400); }
      }
    });
    grid.append(colL, colR);
    wrap.append(grid);
    function finish() {
      const score = Math.max(0, 1 - mistakes / q.pairs.length);
      ctx.done({ score, ok: mistakes === 0, html: q.pairs.map((p) => `${esc(p[0])} → <b>${esc(p[1])}</b>`).join('<br>') + (q.ex ? `<br>${esc(q.ex)}` : ''), answer: q.pairs.map((p) => p[0] + ' → ' + p[1]).join('; ') });
    }
  },
  order(q, ctx, wrap) {
    wrap.append(title(q.q), h('div', { class: 'hint', style: { marginTop: '-8px', marginBottom: '10px' } }, 'Tippe die Begriffe in der richtigen Reihenfolge an. Nochmal tippen = zurücknehmen.'));
    const items = shuffleNot(q.items);
    const chosen = [];
    const box = h('div', { class: 'order' });
    const rows = items.map((t) => {
      const num = h('span', { class: 'num' }, '');
      const b = h('button', { class: 'opt' }, num, t);
      b.onclick = () => {
        snd.tap();
        const k = chosen.indexOf(t);
        if (k >= 0) chosen.splice(k, 1); else chosen.push(t);
        rows.forEach(([tt, bb, nn]) => { const j = chosen.indexOf(tt); nn.textContent = j >= 0 ? j + 1 : ''; nn.classList.toggle('set', j >= 0); bb.classList.toggle('sel', j >= 0); });
        act.btn.disabled = chosen.length !== items.length;
      };
      box.append(b); return [t, b, num];
    });
    wrap.append(box);
    const act = actions('Prüfen', () => {
      act.btn.disabled = true;
      let right = 0;
      chosen.forEach((t, i) => { const ok = q.items[i] === t; if (ok) right++; const r = rows.find((x) => x[0] === t); if (!ctx.exam) r[1].classList.add(ok ? 'ok' : 'bad'); r[1].disabled = true; });
      ctx.done({ score: right / q.items.length, ok: right === q.items.length, html: `<b>Richtig:</b> ${q.items.map(esc).join(' → ')}` + (q.ex ? `<br>${esc(q.ex)}` : ''), answer: q.items.join(' → ') });
    }, true);
    wrap.append(act.box);
  },
  sort(q, ctx, wrap) {
    wrap.append(title(q.q), h('div', { class: 'hint', style: { marginTop: '-8px', marginBottom: '6px' } }, 'Tippe einen Begriff an, dann die passende Kiste.'));
    const place = new Map();
    let sel = null;
    const bank = h('div', { class: 'bank' });
    const chips = shuffle(q.items).map(([t, k]) => {
      const c = h('button', { class: 'word' }, t);
      c.onclick = (e) => {
        snd.tap();
        if (sel && sel.t !== t && place.has(t)) { e.stopPropagation(); buckets[place.get(t)].el.click(); return; } // tapped a chip inside a box while carrying another one
        if (place.has(t)) { e.stopPropagation(); place.delete(t); bank.append(c); c.classList.remove('sel'); sel = null; upd(); return; } chips.forEach((x) => x.el.classList.remove('sel')); c.classList.add('sel'); sel = { t, el: c }; buckets.forEach((b) => b.el.classList.add('target')); };
      bank.append(c); return { t, k, el: c };
    });
    const bwrap = h('div', { class: 'buckets' });
    const buckets = q.buckets.map((name, bi) => {
      const el = h('div', { class: 'bucket' }, h('h4', null, name));
      el.onclick = () => { if (!sel) return; place.set(sel.t, bi); sel.el.classList.remove('sel'); el.append(sel.el); sel = null; buckets.forEach((b) => b.el.classList.remove('target')); upd(); };
      bwrap.append(el); return { el };
    });
    wrap.append(bank, bwrap);
    const act = actions('Prüfen', () => {
      act.btn.disabled = true;
      let right = 0;
      for (const c of chips) { const ok = place.get(c.t) === c.k; if (ok) right++; if (!ctx.exam) c.el.classList.add(ok ? 'done' : 'shake'); c.el.style.borderColor = ctx.exam ? '' : (ok ? 'var(--good)' : 'var(--bad)'); c.el.disabled = true; }
      const html = q.buckets.map((b, bi) => `<b>${esc(b)}:</b> ${q.items.filter((x) => x[1] === bi).map((x) => esc(x[0])).join(', ')}`).join('<br>') + (q.ex ? `<br>${esc(q.ex)}` : '');
      ctx.done({ score: right / chips.length, ok: right === chips.length, html, answer: html.replace(/<[^>]+>/g, '') });
    }, true);
    wrap.append(act.box);
    function upd() { act.btn.disabled = place.size !== chips.length; }
  },
  cloze(q, ctx, wrap) {
    if (q.q) wrap.append(title(q.q));
    const parts = parseCloze(q.text);
    const gaps = [];
    const p = h('div', { class: 'cloze' });
    for (const part of parts) {
      if (typeof part === 'string') { p.append(part); continue; }
      gaps.push(makeGap(part, ctx));
      p.append(gaps[gaps.length - 1].el);
    }
    wrap.append(p);
    gapLogic(wrap, gaps, ctx.level === 1 ? shuffle([...gaps.map((g) => g.alts[0]), ...(q.extra || [])]) : null, ctx, (res) => ctx.done({
      ...res, html: `<b>Lösung:</b> ${esc(parts.map((x) => typeof x === 'string' ? x : '[' + x[0] + ']').join(''))}` + (q.ex ? `<br>${esc(q.ex)}` : ''), answer: gaps.map((g) => g.alts[0]).join(', '),
    }));
  },
  grid(q, ctx, wrap) {
    wrap.append(title(q.q || 'Ergänze die Tabelle.'));
    const G = ENZYME_GRID;
    const rows = sample(G.rows.map((r, i) => i), ctx.exam ? 4 : 3).sort((a, b) => a - b);
    // choose blanks: per row 1–2 cells, never all
    const blanks = new Set();
    rows.forEach((ri) => { const cells = sample([0, 1, 2, 3, 4], ctx.exam ? 2 : 2); cells.forEach((c) => blanks.add(ri + ':' + c)); });
    // one small card per enzyme row: reads well on a phone (no sideways scrolling)
    const list = h('div', { class: 'gridrows' });
    const gaps = [];
    rows.forEach((ri) => {
      const card = h('div', { class: 'grow' });
      G.rows[ri].forEach((cell, ci) => {
        let val;
        if (blanks.has(ri + ':' + ci)) { const g = makeGap(cell, ctx, true); gaps.push(g); val = g.el; }
        else val = h('b', null, cell[0]);
        card.append(h('div', { class: 'gr' }, h('span', { class: 'gk' }, G.cols[ci]), val));
      });
      list.append(card);
    });
    wrap.append(list);
    const extra = ['Galle', 'Leber', 'Insulin', 'Salzsäure'];
    gapLogic(wrap, gaps, ctx.level === 1 ? shuffle([...gaps.map((g) => g.alts[0]), ...sample(extra, 2)]) : null, ctx, (res) => ctx.done({
      ...res, html: gaps.map((g) => `<b>${esc(g.alts[0])}</b>`).join(' · ') + '<br>Die ganze Tabelle findest du im Kapitel „Alle Enzyme“.', answer: gaps.map((g) => g.alts[0]).join(', '),
    }));
  },
  label(q, ctx, wrap) {
    const D = DIAGRAMS[q.d];
    const ids = q.parts === 'all' ? D.parts.map((p) => p.id) : q.parts;
    const parts = ids.map((id) => D.parts.find((p) => p.id === id));
    const nums = numbering(q.d, q.parts === 'all' ? null : ids);
    wrap.append(title(q.q));
    const dg = h('div', { class: 'diagram', html: diagramSVG(q.d, { only: ids }) });
    wrap.append(dg);
    const sorted = parts.slice().sort((a, b) => nums[a.id] - nums[b.id]);
    const slots = h('div', { class: 'slots' });
    const S = sorted.map((p) => {
      const val = ctx.level === 1 ? h('span', { class: 'val' }, 'antippen …') : h('input', { type: 'text', placeholder: 'Name eintippen', autocapitalize: 'sentences', autocomplete: 'off', spellcheck: 'false', enterkeyhint: 'next' });
      const el = h('div', { class: 'slot' }, h('span', { class: 'n' }, nums[p.id]), val);
      slots.append(el);
      return { p, el, val, filled: null, ok: false };
    });
    wrap.append(slots);
    const mk = (id) => dg.querySelector(`.mk[data-part="${id}"]`);
    let cur = null;
    const select = (s) => {
      cur = s;
      S.forEach((x) => { x.el.classList.toggle('sel', x === s); const m = mk(x.p.id); if (m) m.classList.toggle('sel', x === s); });
      if (s && ctx.level === 2) s.val.focus();
    };
    S.forEach((s) => {
      s.el.onclick = () => { if (!s.ok || ctx.level === 2) select(s); };
      const m = mk(s.p.id); if (m) m.addEventListener('click', () => { if (!s.ok || ctx.level === 2) { snd.tap(); select(s); s.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
    });
    if (ctx.level === 1) {
      // word bank; in learn mode every pin gets instant feedback
      let mistakes = 0;
      const bank = h('div', { class: 'bank' });
      const words = shuffle(parts.map((p) => p.name));
      const chips = words.map((w) => {
        const c = h('button', { class: 'word' }, w);
        c.onclick = () => {
          const s = cur || S.find((x) => !x.filled);
          if (!s || c.classList.contains('used')) return;
          if (ctx.exam) {
            if (s.filled) s.filled.chip.classList.remove('used');
            s.filled = { w, chip: c }; c.classList.add('used'); s.val.textContent = w; s.val.classList.add('set'); mk(s.p.id)?.classList.add('filled');
            select(S.find((x) => !x.filled) || null);
            act.btn.disabled = S.some((x) => !x.filled);
            return;
          }
          if (w === s.p.name) {
            s.ok = true; s.filled = { w, chip: c }; c.classList.add('used'); s.val.textContent = w; s.val.classList.add('set'); s.el.classList.add('ok'); mk(s.p.id)?.classList.add('ok');
            snd.correct(S.filter((x) => x.ok).length);
            const next = S.find((x) => !x.ok); select(next || null);
            if (!next) finish();
          } else {
            mistakes++; snd.wrong();
            s.el.classList.add('bad'); c.classList.add('shake');
            setTimeout(() => { s.el.classList.remove('bad'); c.classList.remove('shake'); }, 450);
          }
        };
        bank.append(c); return c;
      });
      wrap.append(h('div', { class: 'hint' }, 'Nummer oder Feld antippen, dann den passenden Begriff.'), bank);
      select(S[0]);
      const act = ctx.exam ? actions('Abgeben', () => {
        act.btn.disabled = true;
        let right = 0;
        S.forEach((s) => { if (s.filled && s.filled.w === s.p.name) right++; });
        ctx.done({ score: right / S.length, ok: right === S.length, html: labelSolution(S, nums), answer: S.map((s) => nums[s.p.id] + ' ' + s.p.name).join(', ') });
      }, true) : null;
      if (act) wrap.append(act.box);
      function finish() {
        const score = Math.max(0, 1 - mistakes / (S.length * 2));
        ctx.done({ score, ok: mistakes === 0, html: (mistakes ? `${mistakes} Fehlversuch${mistakes > 1 ? 'e' : ''}. ` : 'Fehlerfrei! ') + 'Alles beschriftet.', answer: '' });
      }
    } else {
      select(S[0]);
      S.forEach((s, i) => s.val.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const n = S[i + 1]; if (n) select(n); else act.btn.click(); } }));
      S.forEach((s) => s.val.addEventListener('focus', () => select(s)));
      const act = actions('Prüfen', () => {
        act.btn.disabled = true;
        let pts = 0;
        S.forEach((s) => {
          const r = matchAnswer(s.val.value, s.p.alts.concat([s.p.name]));
          s.val.disabled = true;
          if (r.ok) pts += 1;
          if (!ctx.exam) {
            s.el.classList.add(r.ok ? 'ok' : 'bad'); mk(s.p.id)?.classList.add(r.ok ? 'ok' : 'bad');
            if (!r.ok || !r.exact) s.el.append(h('span', { class: 'fix' }, (r.ok ? '✓ Schreibweise: ' : '→ ') + s.p.name));
          }
          s.typed = s.val.value; s.right = r.ok;
        });
        ctx.done({ score: pts / S.length, ok: pts === S.length, html: labelSolution(S, nums), answer: S.map((s) => nums[s.p.id] + ' ' + s.p.name).join(', '), detail: S.map((s) => ({ n: nums[s.p.id], you: s.typed, right: s.p.name, ok: s.right })) });
      });
      wrap.append(act.box);
    }
  },
  explain(q, ctx, wrap) {
    wrap.append(title(q.q));
    const ta = h('textarea', { class: 'answer', placeholder: 'Schreib deine Antwort in 2–4 Sätzen (oder sag sie laut).' });
    wrap.append(ta);
    const act = actions('Musterlösung zeigen', () => {
      act.box.remove();
      ta.disabled = true;
      const checks = q.points.map((p) => { const cb = h('input', { type: 'checkbox' }); return { cb, el: h('label', null, cb, h('span', null, p)) }; });
      wrap.append(
        h('div', { class: 'box tip', style: { marginTop: '14px' } }, h('span', { class: 't' }, '📝 Musterlösung'), q.model),
        h('div', { class: 'hint' }, 'Selbst-Check: Welche Punkte hast du drin? Sei ehrlich 😺'),
        h('div', { class: 'selfcheck' }, checks.map((c) => c.el)),
      );
      const fin = actions('Fertig', () => {
        fin.btn.disabled = true;
        const n = checks.filter((c) => c.cb.checked).length;
        const score = n / q.points.length;
        ctx.done({ score, ok: score >= 0.66, html: `Du hast ${n} von ${q.points.length} Punkten.`, answer: q.model, selfChecked: true });
      });
      wrap.append(fin.box);
    });
    wrap.append(act.box);
  },
};

/* ---------- shared bits ---------- */
function shuffleNot(items) {
  let s = shuffle(items);
  for (let i = 0; i < 5 && s.every((x, j) => x === items[j]); i++) s = shuffle(items);
  return s;
}

function choice(wrap, opts, isRight, ctx, q, rightText) {
  const box = h('div', { class: 'opts' });
  let locked = false;
  const keys = 'ABCD';
  const btns = opts.map((o, i) => {
    const b = h('button', { class: 'opt' }, h('span', { class: 'key' }, keys[i] || '•'), o);
    b.onclick = () => {
      if (locked) return; locked = true;
      const ok = isRight(o);
      if (!ctx.exam) { b.classList.add(ok ? 'ok' : 'bad'); if (!ok) btns.find((x) => isRight(x.dataset.v))?.classList.add('ok'); }
      else b.classList.add('sel');
      ctx.done({ score: ok ? 1 : 0, ok, html: (ok ? '' : `<b>Richtig:</b> ${esc(rightText)}. `) + esc(q.ex || ''), answer: rightText });
    };
    b.dataset.v = o;
    box.append(b); return b;
  });
  wrap.append(box);
}

function typeBox(wrap, answers, ctx, q) {
  const inp = h('input', { type: 'text', placeholder: 'Antwort eintippen …', autocomplete: 'off', autocapitalize: 'sentences', spellcheck: 'false', enterkeyhint: 'done' });
  let hintUsed = 0;
  const hint = h('div', { class: 'hint' });
  const hb = h('button', { class: 'btn ghost small' }, '💡 Tipp');
  hb.onclick = () => {
    hintUsed++;
    const a = answers[0];
    const show = a.split(' ').map((w) => w.slice(0, Math.min(hintUsed, w.length)) + w.slice(Math.min(hintUsed, w.length)).replace(/[^\s]/g, '·')).join(' ');
    hint.textContent = 'Tipp: ' + show + (hintUsed === 1 ? '  (Tipps kosten ein paar Leckerli)' : '');
    inp.focus();
  };
  const go = () => {
    if (!inp.value.trim()) { inp.focus(); return; }
    inp.disabled = true; btn.disabled = true; hb.disabled = true;
    const r = matchAnswer(inp.value, answers);
    if (!ctx.exam) inp.classList.add(r.ok ? 'ok' : 'bad');
    let html = '';
    if (r.ok && !r.exact) html += `Fast perfekt! Schreibweise: <b>${esc(answers[0])}</b>. `;
    if (!r.ok) html += `<b>Richtig:</b> ${esc(answers[0])}. `;
    html += esc(q.ex || '');
    const score = r.ok ? Math.max(0.4, 1 - hintUsed * 0.25) : 0;
    ctx.done({ score, ok: r.ok, html, answer: answers[0], you: inp.value });
  };
  const btn = h('button', { class: 'btn', onclick: go }, 'Prüfen');
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  wrap.append(h('div', { class: 'typebox' }, inp, btn), h('div', { class: 'row', style: { marginTop: '10px' } }, ctx.exam ? null : hb, hint));
  setTimeout(() => inp.focus(), 250);
}

function parseCloze(text) {
  const out = [];
  const re = /\{([^}]+)\}/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[1].split('|'));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function makeGap(alts, ctx, inTable = false) {
  if (ctx.level === 2) {
    const el = h('input', { class: 'gap', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'sentences', style: inTable ? { width: '100%', minWidth: '110px' } : null });
    return { alts, el, get value() { return el.value; } };
  }
  const el = h('button', { class: 'gap' }, '   ');
  return { alts, el, value: '' };
}

function gapLogic(wrap, gaps, bankWords, ctx, done) {
  if (bankWords) {
    let cur = gaps[0];
    const sel = (g) => { cur = g; gaps.forEach((x) => x.el.classList.toggle('sel', x === g)); };
    sel(cur);
    const bank = h('div', { class: 'bank' });
    const chips = bankWords.map((w) => {
      const c = h('button', { class: 'word' }, w);
      c.onclick = () => {
        if (c.classList.contains('used') || !cur) return;
        snd.tap();
        if (cur.chip) cur.chip.classList.remove('used');
        cur.value = w; cur.chip = c; cur.el.textContent = w; c.classList.add('used');
        sel(gaps.find((g) => !g.value) || null);
        act.btn.disabled = gaps.some((g) => !g.value);
      };
      bank.append(c); return c;
    });
    gaps.forEach((g) => g.el.onclick = () => { if (g.value && g.chip) { g.chip.classList.remove('used'); g.value = ''; g.chip = null; g.el.textContent = '   '; act.btn.disabled = true; } sel(g); });
    wrap.append(bank);
    const act = actions('Prüfen', check, true);
    wrap.append(act.box);
    function check() {
      act.btn.disabled = true; chips.forEach((c) => c.disabled = true);
      let right = 0;
      gaps.forEach((g) => { const ok = g.alts.includes(g.value) || matchAnswer(g.value, g.alts).exact; if (ok) right++; if (!ctx.exam) g.el.classList.add(ok ? 'ok' : 'bad'); if (!ok && !ctx.exam) g.el.textContent = g.value + ' → ' + g.alts[0]; g.el.disabled = true; });
      done({ score: right / gaps.length, ok: right === gaps.length });
    }
  } else {
    gaps.forEach((g, i) => g.el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const n = gaps[i + 1]; if (n) n.el.focus(); else act.btn.click(); } }));
    const act = actions('Prüfen', () => {
      act.btn.disabled = true;
      let right = 0;
      gaps.forEach((g) => {
        const r = matchAnswer(g.el.value, g.alts);
        if (r.ok) right++;
        g.el.disabled = true;
        if (!ctx.exam) { g.el.classList.add(r.ok ? 'ok' : 'bad'); if (!r.exact) { g.el.value = (r.ok ? '' : (g.el.value ? g.el.value + ' → ' : '')) + g.alts[0]; } }
      });
      done({ score: right / gaps.length, ok: right === gaps.length });
    });
    wrap.append(act.box);
    setTimeout(() => gaps[0]?.el.focus(), 250);
  }
}

function labelSolution(S, nums) {
  return S.map((s) => `<b>${nums[s.p.id]}</b> ${esc(s.p.name)}`).join(' · ');
}

/* ---------- picking questions ---------- */
import { item } from './store.js';
export function pickSession(questions, level, n = 10) {
  const usable = questions.filter((q) => usableAt(q, level));
  // weakest first (low Leitner box, never seen), then a bit of randomness
  const scored = usable.map((q) => ({ q, w: item(q.id + ':' + level).box + Math.random() * 1.5 }));
  scored.sort((a, b) => a.w - b.w);
  return scored.slice(0, n).map((x) => x.q);
}
export function itemKey(q, level) { return q.id + ':' + level; }
export { TYPE_NAMES, pick };
