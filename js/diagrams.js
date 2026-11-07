/* The figures from the worksheets, redrawn as SVG.
   Every labelable structure is a <g class="part" data-part="id">, every label a numbered marker. */

const OUT = '#4a3542';
const C = {
  skin: '#ffe7d6', skinLine: '#e9b9a0', pink: '#ffb0c0', gum: '#ff9eb0', tongue: '#ff6f8a', gland: '#ffcf5c',
  eso: '#ff9a8b', stomach: '#ff8fa3', liver: '#c4614b', gall: '#7cc46a', pancreas: '#ffc463', small: '#ffb8a6', large: '#f0906c',
  rect: '#e0735a', red: '#e5484d', blue: '#4a7fe0', violet: '#7a5ce0', lymph: '#8ad07b', cell: '#ffd9b3', neuron: '#ffc9d6',
  myelin: '#ffe08a', myelinDark: '#d39b00', nucleus: '#9b7bea', tooth: '#fffaf0',
};

/* outlined tube: the outline is a wider stroke underneath */
function tube(d, w, col, extra = '') {
  return `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>` +
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}
const blob = (d, col, sw = 3) => `<path d="${d}" fill="${col}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const part = (id, inner) => `<g class="part" data-part="${id}">${inner}</g>`;

/* ------------------------------------------------------------------ */
/* 1. Nervenzelle – same layout and numbers as the worksheet            */
/* ------------------------------------------------------------------ */
function neuronArt() {
  const den = [
    ['M828 205 L812 150 L790 95', 12], ['M812 150 L842 108', 7], ['M790 95 L760 62', 6], ['M790 95 L806 48', 6],
    ['M872 210 L915 160 L945 112', 12], ['M915 160 L966 150', 7], ['M945 112 L940 70', 6], ['M945 112 L978 96', 6],
    ['M890 256 L950 262 L990 240', 12], ['M950 262 L985 292', 7],
    ['M872 292 L905 345 L945 380', 12], ['M905 345 L900 402', 7], ['M945 380 L982 370', 6],
    ['M825 298 L812 360 L790 420', 12], ['M812 360 L846 410', 7], ['M790 420 L760 452', 6], ['M790 420 L802 472', 6],
    ['M800 220 L770 186 L740 176', 11], ['M770 186 L764 146', 6],
  ];
  const denB = [
    ['M172 414 L203 372', 9], ['M126 416 L96 372 L70 348', 10], ['M96 372 L106 332', 6], ['M112 450 L60 456 L30 432', 10],
    ['M60 456 L34 482', 6], ['M188 458 L240 472 L272 452', 10], ['M240 472 L252 510', 6],
  ];
  const outline = (list) => list.map(([d, w]) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const fill = (list) => list.map(([d, w]) => `<path d="${d}" fill="none" stroke="${C.neuron}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const soma = 'M790 250 C790 205 830 192 860 200 C895 210 902 245 894 270 C886 300 850 310 825 302 C798 294 790 275 790 250 Z';
  const hill = 'M800 230 L746 249 L746 261 L800 280 Z';
  const segs = [342, 406, 470, 534, 598, 662];
  const gaps = [394, 458, 522, 586, 650];
  const knobs = [[155, 152], [212, 157], [186, 262], [209, 352]];
  let s = '';
  // neuron B (second cell, receives the signal)
  s += `<g opacity=".9">${outline(denB)}<path d="M150 482 L150 560" stroke="${OUT}" stroke-width="15" fill="none"/><path d="M150 482 L150 560" stroke="${C.neuron}" stroke-width="10" fill="none"/>`;
  s += `<path d="M112 445 C112 412 140 404 160 408 C186 414 192 440 186 462 C180 484 150 490 132 482 C116 474 112 462 112 445 Z" fill="${C.neuron}" stroke="${OUT}" stroke-width="3"/>`;
  s += fill(denB);
  s += `<circle cx="150" cy="446" r="12" fill="${C.nucleus}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += `<rect x="136" y="508" width="28" height="56" rx="13" fill="${C.myelin}" stroke="${OUT}" stroke-width="3"/></g>`;
  // neuron A
  s += part('dendriten', outline(den) + fill(den));
  s += part('axon', tube('M748 255 L246 255', 9, C.neuron));
  // terminals
  s += part('endknoepfchen-aeste', tube('M246 255 L200 215 L160 160', 7, C.neuron) + tube('M200 215 L210 166', 6, C.neuron) + tube('M246 255 L192 261', 6, C.neuron) + tube('M246 255 L226 305 L211 340', 7, C.neuron));
  s += part('endknoepfchen', knobs.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${C.neuron}" stroke="${OUT}" stroke-width="3"/><circle cx="${x - 3}" cy="${y - 3}" r="2.6" fill="#36b3a3"/><circle cx="${x + 4}" cy="${y + 1}" r="2.6" fill="#36b3a3"/><circle cx="${x - 1}" cy="${y + 5}" r="2.2" fill="#36b3a3"/>`).join(''));
  s += part('synapse', `<rect x="184" y="328" width="50" height="50" rx="10" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-dasharray="6 5"/><path d="M200 364 q9 -5 18 0" stroke="#36b3a3" stroke-width="2.5" fill="none"/>`);
  s += part('axonhuegel', blob(hill, C.neuron));
  s += part('zellkoerper', blob(soma, C.neuron));
  // re-cover the joints so the cell looks like one piece
  s += `<path d="M796 236 L800 274" stroke="${C.neuron}" stroke-width="8"/>`;
  s += part('zellkern', `<circle cx="848" cy="248" r="20" fill="${C.nucleus}" stroke="${OUT}" stroke-width="3"/><circle cx="853" cy="244" r="6" fill="#5b3fb8"/>`);
  s += part('schwann', segs.map((x) => `<rect x="${x}" y="239" width="52" height="32" rx="15" fill="${C.myelin}" stroke="${OUT}" stroke-width="3"/><ellipse cx="${x + 26}" cy="245" rx="9" ry="3.6" fill="${C.myelinDark}"/>`).join(''));
  s += part('ranvier', gaps.map((x) => `<ellipse cx="${x + 6}" cy="255" rx="5" ry="8" fill="${C.neuron}" stroke="${OUT}" stroke-width="2"/>`).join(''));
  // direction of the signal (shown in learn mode)
  s += `<g class="arrow"><path d="M660 478 L430 478" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><path d="M424 478 l20 -12 v24 z" fill="${C.red}"/><text x="545" y="514" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="20" fill="${C.red}">Richtung der Reizleitung</text></g>`;
  return s;
}

/* ------------------------------------------------------------------ */
/* 2. Übersicht Verdauungsorgane                                        */
/* ------------------------------------------------------------------ */
function organsArt() {
  let s = '';
  // body silhouette
  s += `<path d="M300 22 C252 22 226 52 222 92 L204 126 Q200 136 213 139 L215 150 Q209 157 217 161 L213 171 Q211 184 224 187 C238 191 246 200 248 222 L250 262 C200 280 140 290 112 320 C96 340 98 380 104 420 L120 600 C126 700 138 800 150 880 L450 880 C462 800 474 700 480 600 L496 420 C502 380 504 340 488 320 C460 290 400 280 350 262 L350 228 C352 206 368 190 378 160 C392 116 384 70 358 44 C342 30 322 22 300 22 Z" fill="${C.skin}" stroke="${C.skinLine}" stroke-width="3"/>`;
  // ear
  s += `<path d="M352 92 C368 84 380 98 376 116 C372 132 360 140 352 132" fill="${C.skin}" stroke="${C.skinLine}" stroke-width="3"/>`;
  // mouth cavity
  s += `<path d="M216 147 C240 136 286 132 312 146 C322 160 316 176 300 180 C270 186 236 176 216 160 Z" fill="${C.gum}" stroke="${OUT}" stroke-width="2.5"/>`;
  s += part('zunge', `<path d="M236 166 C252 152 292 150 306 162 C310 172 298 180 282 180 C262 182 246 178 236 166 Z" fill="${C.tongue}" stroke="${OUT}" stroke-width="2.5"/>`);
  s += part('zaehne', `<g fill="${C.tooth}" stroke="${OUT}" stroke-width="2"><rect x="218" y="143" width="10" height="9" rx="2"/><rect x="229" y="141" width="10" height="9" rx="2"/><rect x="240" y="140" width="11" height="9" rx="2"/><rect x="219" y="158" width="10" height="9" rx="2"/><rect x="230" y="160" width="10" height="9" rx="2"/><rect x="241" y="161" width="11" height="9" rx="2"/></g>`);
  // pharynx + esophagus
  s += part('speiseroehre', tube('M308 160 C318 176 320 200 318 230 L318 300 C318 340 322 380 334 408', 14, C.eso));
  // salivary glands with ducts
  s += part('ohrspeicheldruese', blob('M322 112 C336 104 352 112 350 132 C348 150 338 162 326 158 C314 154 312 122 322 112 Z', C.gland) + `<path d="M326 140 C300 140 288 144 282 150" stroke="${OUT}" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`);
  s += part('unterkieferspeicheldruese', blob('M282 190 C292 182 312 184 314 196 C316 210 300 216 288 212 C276 208 274 196 282 190 Z', C.gland) + `<path d="M286 196 C272 190 262 184 258 178" stroke="${OUT}" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`);
  s += part('unterzungenspeicheldruese', blob('M240 182 C248 176 266 177 268 185 C270 193 256 197 246 195 C238 193 234 188 240 182 Z', C.gland));
  // large intestine frame (behind)
  const colon = 'M178 770 L176 640 C176 622 186 616 200 616 L420 612 C436 612 444 620 444 636 L444 770 C444 800 410 806 360 806 C330 806 312 812 306 830';
  s += part('dickdarm', tube(colon, 32, C.large) + `<path d="${colon}" fill="none" stroke="${OUT}" stroke-width="30" stroke-dasharray="2.5 20" opacity=".55"/>`);
  s += part('blinddarm', blob('M160 760 C160 790 196 796 198 772 L196 752 L160 752 Z', C.large) + tube('M170 790 C164 810 148 818 142 836', 7, C.large));
  s += part('mastdarm', tube('M306 830 L304 862', 24, C.rect));
  s += part('after', `<path d="M290 874 h28" stroke="${OUT}" stroke-width="6" stroke-linecap="round"/><circle cx="304" cy="874" r="9" fill="${C.rect}" stroke="${OUT}" stroke-width="3"/>`);
  // small intestine coils
  const coils = 'M346 594 C392 598 410 640 380 648 L232 650 C204 652 204 676 232 676 L392 676 C418 676 418 702 392 702 L232 702 C204 702 204 728 232 728 L392 728 C418 728 418 752 392 754 L226 756 C208 756 200 764 192 768';
  s += part('duenndarm', tube(coils, 13, C.small));
  // pancreas, duodenum, stomach, liver, gall bladder
  s += part('bauchspeicheldruese', blob('M284 560 C300 548 340 552 380 546 C410 542 430 530 446 532 C456 534 456 548 444 554 C420 566 380 570 344 576 C316 580 290 580 284 572 Z', C.pancreas) + `<g fill="${OUT}" opacity=".25"><circle cx="320" cy="566" r="2.5"/><circle cx="350" cy="562" r="2.5"/><circle cx="380" cy="556" r="2.5"/><circle cx="410" cy="548" r="2.5"/><circle cx="335" cy="572" r="2"/><circle cx="395" cy="562" r="2"/></g>`);
  s += part('zwoelffingerdarm', tube('M302 514 C278 516 266 532 266 556 C266 584 284 600 312 598 C328 597 338 596 346 594', 15, C.small));
  s += part('magen', blob('M334 406 C360 392 424 392 444 432 C462 474 448 526 404 540 C370 550 334 538 304 520 L298 506 C320 506 336 494 344 476 C352 456 352 432 342 420 C338 414 336 410 334 406 Z', C.stomach) + `<path d="M366 440 q14 12 4 26 M392 432 q18 18 6 40 M412 448 q12 16 2 34" stroke="${OUT}" stroke-width="2" fill="none" opacity=".3"/>`);
  s += part('leber', blob('M142 404 C150 368 250 356 330 376 C362 384 366 402 344 414 C306 432 270 462 222 478 C176 492 144 462 142 404 Z', C.liver) + `<path d="M250 376 C246 410 236 444 222 476" stroke="${OUT}" stroke-width="2" fill="none" opacity=".35"/>`);
  s += part('gallenblase', blob('M232 470 C230 452 250 446 258 458 C264 468 258 490 246 494 C238 496 234 484 232 470 Z', C.gall) + `<path d="M252 462 C264 478 270 500 272 520" stroke="${C.gall}" stroke-width="4" fill="none"/>`);
  return s;
}

/* ------------------------------------------------------------------ */
/* 3. Gebiss (Dauergebiss, Oberkiefer von unten)                        */
/* ------------------------------------------------------------------ */
const TCX = 300;
function toothAt(deg) { const r = deg * Math.PI / 180, a = 196, b = 330, top = 92; return [TCX + a * Math.sin(r), top + b * (1 - Math.cos(r)), Math.atan2(b * Math.sin(r), a * Math.cos(r)) * 180 / Math.PI]; }
const toothL = (deg) => { const [x, y] = toothAt(deg); return [Math.round(2 * TCX - x), Math.round(y)]; };
function toothShape(k) {
  if (k === 'I') return `<rect x="-16" y="-11" width="32" height="22" rx="7"/><path d="M-11 -4 h22" stroke-width="1.6" opacity=".5"/>`;
  if (k === 'C') return `<path d="M0 -17 C14 -10 16 6 8 14 C3 18 -3 18 -8 14 C-16 6 -14 -10 0 -17 Z"/><circle r="2.5" cy="-2" fill="${OUT}" opacity=".35"/>`;
  if (k === 'P') return `<rect x="-16" y="-17" width="32" height="34" rx="11"/><path d="M-9 0 h18" stroke-width="1.8" opacity=".5"/>`;
  const sz = k === 'W' ? 19 : 22;
  return `<rect x="-${sz}" y="-${sz}" width="${sz * 2}" height="${sz * 2}" rx="12"/><path d="M-${sz - 6} 0 h${2 * sz - 12} M0 -${sz - 6} v${2 * sz - 12}" stroke-width="1.8" opacity=".5"/>`;
}

function teethArt() {
  const cx = TCX, at = toothAt;
  const teeth = [
    ['schneidezaehne', 7, 'I'], ['schneidezaehne', 19, 'I'], ['eckzaehne', 31, 'C'], ['backenzaehne', 43, 'P'], ['backenzaehne', 55, 'P'],
    ['mahlzaehne', 69, 'M'], ['mahlzaehne', 84, 'M'], ['weisheitszaehne', 99, 'W'],
  ];
  let s = '';
  // palate and gum ridge
  const arch = []; for (let d = -104; d <= 104; d += 4) { const [x, y] = at(d < 0 ? -d : d); arch.push([d < 0 ? 2 * cx - x : x, y]); }
  const path = 'M' + arch.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
  s += `<path d="${path}" fill="none" stroke="${C.gum}" stroke-width="84" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${path} Z" fill="#ffc8d2"/>`;
  s += `<path d="M300 140 V470" stroke="${OUT}" stroke-width="2" stroke-dasharray="6 6" opacity=".35"/>`;
  s += `<path d="M260 190 q40 18 80 0 M250 240 q50 18 100 0 M246 290 q54 18 108 0" stroke="#ff9eb0" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const groups = {};
  for (const side of [1, -1]) {
    for (const [id, deg, k] of teeth) {
      const [x0, y, ang] = at(deg);
      const x = side === 1 ? x0 : 2 * cx - x0;
      const rot = side === 1 ? ang : 180 - ang;
      const dash = k === 'W' ? ' stroke-dasharray="5 4"' : '';
      groups[id] = (groups[id] || '') + `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rot - 90).toFixed(1)}) scale(1.22)" fill="${C.tooth}" stroke="${OUT}" stroke-width="3"${dash}>${toothShape(k)}</g>`;
    }
  }
  for (const [id, g] of Object.entries(groups)) s += part(id, g);
  return s;
}


/* Milchgebiss: 5 teeth per side (I, I, C, M, M), smaller arch */
function milkAt(deg) { const r = deg * Math.PI / 180, a = 150, b = 250, top = 110; return [TCX + a * Math.sin(r), top + b * (1 - Math.cos(r)), Math.atan2(b * Math.sin(r), a * Math.cos(r)) * 180 / Math.PI]; }
const milkL = (deg) => { const [x, y] = milkAt(deg); return [Math.round(2 * TCX - x), Math.round(y)]; };
function milkArt() {
  const teeth = [['schneidezaehne', 9, 'I'], ['schneidezaehne', 25, 'I'], ['eckzaehne', 42, 'C'], ['mahlzaehne', 62, 'M'], ['mahlzaehne', 86, 'M']];
  let s = '';
  const arch = []; for (let d = -92; d <= 92; d += 4) { const [x, y] = milkAt(Math.abs(d)); arch.push([d < 0 ? 2 * TCX - x : x, y]); }
  const path = 'M' + arch.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
  s += `<path d="${path}" fill="none" stroke="${C.gum}" stroke-width="76" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${path} Z" fill="#ffc8d2"/>`;
  s += `<path d="M300 150 V400" stroke="${OUT}" stroke-width="2" stroke-dasharray="6 6" opacity=".35"/>`;
  const groups = {};
  for (const side of [1, -1]) for (const [id, deg, k] of teeth) {
    const [x0, y, ang] = milkAt(deg);
    const x = side === 1 ? x0 : 2 * TCX - x0, rot = side === 1 ? ang : 180 - ang;
    groups[id] = (groups[id] || '') + `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rot - 90).toFixed(1)}) scale(${k === 'M' ? 1.05 : 1.1})" fill="${C.tooth}" stroke="${OUT}" stroke-width="3">${toothShape(k)}</g>`;
  }
  for (const [id, g] of Object.entries(groups)) s += part(id, g);
  return s;
}

/* ------------------------------------------------------------------ */
/* 4. Magen (Abb. 13a)                                                  */
/* ------------------------------------------------------------------ */
function stomachArt() {
  let s = '';
  const body = 'M262 124 C280 84 380 70 430 110 C470 142 478 230 462 300 C448 362 410 410 350 420 C300 428 252 410 226 384 L234 352 C260 368 300 372 326 352 C352 330 356 290 344 250 C332 214 300 170 282 150 C276 140 270 132 262 124 Z';
  s += part('speicherraum', `<path d="M268 128 C290 90 380 78 428 114 C458 138 468 190 466 236 L346 246 C334 212 302 168 282 150 Z" fill="#ffd3dd" opacity=".9"/>`);
  s += part('mischraum', `<path d="M346 246 L466 236 C464 268 462 290 458 306 C444 364 408 408 350 418 C300 426 254 410 232 386 L236 356 C262 370 300 372 326 352 C352 330 356 290 346 246 Z" fill="#ffd3dd" opacity=".9"/>`);
  s += part('magen', `<path d="${body}" fill="${C.stomach}" fill-opacity=".55" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M300 140 q30 30 60 20 M330 120 q40 40 90 20 M380 190 q30 30 70 10 M390 260 q30 26 64 6 M360 330 q30 20 70 -6 M300 380 q30 16 60 -2" stroke="${OUT}" stroke-width="2" fill="none" opacity=".3"/>` +
    `<path d="M346 300 C370 320 420 312 456 300 C446 360 410 404 350 414 C300 422 260 404 240 384 C280 386 318 360 346 300 Z" fill="#c9a27a" opacity=".55"/>`);
  s += part('speiseroehre', tube('M232 18 C236 50 244 86 258 120', 26, C.eso));
  s += part('magenmund', `<rect x="244" y="104" width="36" height="16" rx="7" transform="rotate(-30 262 112)" fill="#e56b86" stroke="${OUT}" stroke-width="3"/>`);
  s += part('zwoelffingerdarm', tube('M222 372 C176 368 150 392 150 430 C150 470 186 488 236 476 C276 466 300 470 320 486', 30, C.small));
  s += part('pfoertner', `<rect x="214" y="352" width="18" height="44" rx="8" transform="rotate(12 223 374)" fill="#e56b86" stroke="${OUT}" stroke-width="3"/>`);
  return s;
}

/* 5. Magenschleimhaut (Abb. 13b) */
function mucosaArt() {
  let s = '';
  // surface epithelium
  s += `<path d="M40 120 H250 M350 120 H560" stroke="${OUT}" stroke-width="3"/>`;
  for (let x = 44; x < 560; x += 22) if (x < 246 || x > 352) s += `<rect x="${x}" y="98" width="20" height="22" rx="6" fill="#bfe6ff" stroke="${OUT}" stroke-width="1.8"/>`;
  const wall = (x, dir) => {
    let w = '';
    for (let y = 140; y <= 440; y += 30) {
      const zone = y < 230 ? 'nebenzelle' : (y < 350 ? 'belegzelle' : 'hauptzelle');
      const col = zone === 'nebenzelle' ? '#8fd3ff' : (zone === 'belegzelle' ? '#ff9b9b' : '#b39cff');
      const r = zone === 'belegzelle' ? 17 : 14;
      w += `<g class="z-${zone}"><circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="${OUT}" stroke-width="2"/><circle cx="${x + dir * 4}" cy="${y}" r="4" fill="${OUT}" opacity=".55"/></g>`;
    }
    return w;
  };
  const cells = wall(250, -1) + wall(350, 1);
  // bottom of the gland
  const bottom = [[268, 466], [300, 476], [332, 466]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#b39cff" stroke="${OUT}" stroke-width="2"/>`).join('');
  s += `<path d="M268 120 V440 C268 462 332 462 332 440 V120" fill="#fff4e8" stroke="none"/>`;
  // split per zone so each part can light up
  const pick = (zone) => cells.split('<g class="z-').filter((t) => t.startsWith(zone)).map((t) => '<g class="z-' + t).join('');
  s += part('nebenzelle', pick('nebenzelle'));
  s += part('belegzelle', pick('belegzelle'));
  s += part('hauptzelle', pick('hauptzelle') + bottom);
  // secretions
  s += part('schleim', `<path d="M180 92 C170 60 160 40 140 28" stroke="#5aa9e6" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M140 28 l4 18 l12 -12 z" fill="#5aa9e6"/><g fill="#5aa9e6" opacity=".6"><circle cx="120" cy="88" r="6"/><circle cx="160" cy="84" r="5"/><circle cx="200" cy="86" r="6"/><circle cx="420" cy="86" r="5"/><circle cx="470" cy="88" r="6"/></g>`);
  s += part('magensaft', `<path d="M300 300 V60 C300 40 330 30 360 24" stroke="#e5484d" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="1 12"/><path d="M360 24 l-16 -6 l4 16 z" fill="#e5484d"/>`);
  return s;
}

/* ------------------------------------------------------------------ */
/* 6. Leber und Nachbarn (Seite 6, Abb. 1)                              */
/* ------------------------------------------------------------------ */
function liverArt() {
  let s = '';
  s += part('arterie', tube('M402 10 L402 470', 16, C.red) + tube('M402 300 C430 300 450 320 470 340', 7, C.red));
  s += part('vene', tube('M372 10 L372 470', 18, C.blue));
  s += part('bauchspeicheldruese', blob('M262 338 C300 322 380 330 440 318 C480 310 516 300 534 312 C546 322 536 340 514 346 C470 358 400 362 340 370 C300 374 268 368 262 356 Z', C.pancreas) + `<g fill="${OUT}" opacity=".25"><circle cx="300" cy="352" r="2.5"/><circle cx="340" cy="350" r="2.5"/><circle cx="390" cy="346" r="2.5"/><circle cx="440" cy="336" r="2.5"/><circle cx="490" cy="326" r="2.5"/></g>`);
  s += part('duenndarm', tube('M310 292 C260 292 232 316 232 352 C232 392 262 412 300 410 C330 408 344 400 360 392', 28, C.small));
  s += part('pfortader', tube('M330 470 C330 420 320 380 300 330 C286 290 280 240 276 196', 13, C.violet) + tube('M318 384 C360 384 420 392 480 396', 7, C.violet));
  s += part('magen', blob('M352 96 C400 80 500 96 530 150 C556 200 540 262 490 290 C450 312 380 304 330 298 L322 268 C362 270 400 262 420 240 C436 220 430 190 410 170 C392 152 368 128 352 96 Z', C.stomach));
  s += part('speiseroehre', tube('M346 10 C346 40 348 70 354 98', 20, C.eso));
  s += part('leber', blob('M70 140 C80 92 200 70 320 92 C380 102 410 118 396 140 C380 164 330 166 300 196 C270 226 220 250 160 252 C100 254 64 210 70 140 Z', C.liver) + `<path d="M248 86 C244 140 232 200 214 246" stroke="${OUT}" stroke-width="2" fill="none" opacity=".35"/>`);
  s += part('gallenblase', blob('M222 244 C214 222 236 210 248 222 C258 232 256 262 242 268 C232 272 226 258 222 244 Z', C.gall) + `<path d="M246 236 C262 256 276 280 286 304" stroke="${C.gall}" stroke-width="5" fill="none"/>`);
  return s;
}

/* ------------------------------------------------------------------ */
/* 7. Darmzotte (Seite 8 Abb. 2 / Seite 9)                              */
/* ------------------------------------------------------------------ */
function villusArt() {
  let s = '';
  // tissue + muscles
  s += part('muskulatur', `<rect x="20" y="430" width="560" height="50" rx="8" fill="#e98a7a" stroke="${OUT}" stroke-width="3"/><path d="M30 446 H570 M30 462 H570" stroke="${OUT}" stroke-width="2" opacity=".35"/><g stroke="${OUT}" stroke-width="2" opacity=".35">${Array.from({ length: 27 }, (_, i) => `<path d="M${36 + i * 20} 434 v10"/>`).join('')}</g>`);
  s += `<rect x="20" y="380" width="560" height="54" fill="#ffe1cf" stroke="${OUT}" stroke-width="3"/>`;
  // neighbour villi
  const vil = (x, w, top) => `M${x} 384 L${x} ${top + w / 2} C${x} ${top - 6} ${x + w} ${top - 6} ${x + w} ${top + w / 2} L${x + w} 384`;
  s += `<path d="${vil(40, 70, 170)}" fill="${C.cell}" stroke="${OUT}" stroke-width="3"/>`;
  s += `<path d="${vil(420, 70, 190)}" fill="${C.cell}" stroke="${OUT}" stroke-width="3"/>`;
  // crypt
  s += part('krypte', `<path d="M150 384 L156 410 C160 424 176 424 180 410 L186 384" fill="#fff4e8" stroke="${OUT}" stroke-width="3"/><path d="M314 384 L320 410 C324 424 340 424 344 410 L350 384" fill="#fff4e8" stroke="${OUT}" stroke-width="3"/>`);
  // main villus
  const main = vil(190, 120, 80);
  s += part('darmzotte', `<path d="${main}" fill="${C.cell}" stroke="${OUT}" stroke-width="3.5"/>`);
  // epithelial cells around the main villus
  s += part('darmzelle', `<path d="${main}" fill="none" stroke="${OUT}" stroke-width="22" stroke-dasharray="2 16" opacity=".35"/><path d="M204 384 L204 146 C204 96 296 96 296 146 L296 384" fill="#fff0e2" stroke="${OUT}" stroke-width="2" opacity=".9"/>`);
  // capillaries
  s += part('blutgefaess', `<path d="M222 400 L222 160 C222 124 278 124 278 160 L278 400" fill="none" stroke="${C.red}" stroke-width="7"/><path d="M278 400 L278 160" stroke="${C.blue}" stroke-width="7"/><g stroke="${C.red}" stroke-width="3" fill="none" opacity=".8"><path d="M222 190 C240 200 260 180 278 192"/><path d="M222 240 C240 252 262 228 278 244"/><path d="M222 290 C242 300 260 280 278 296"/><path d="M222 340 C242 352 262 330 278 346"/></g>`);
  // lymph vessel
  s += part('lymphgefaess', `<path d="M250 404 L250 168 C250 156 250 150 250 150" stroke="${OUT}" stroke-width="14" stroke-linecap="round"/><path d="M250 404 L250 168" stroke="${C.lymph}" stroke-width="9" stroke-linecap="round"/>`);
  // zoom window with microvilli
  s += `<rect x="286" y="112" width="20" height="20" fill="none" stroke="${OUT}" stroke-width="2.5"/><path d="M306 112 L404 40 M306 132 L404 236" stroke="${OUT}" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/>`;
  s += `<rect x="404" y="20" width="176" height="226" rx="16" fill="#fffaf5" stroke="${OUT}" stroke-width="3"/>`;
  let mv = '';
  for (let x = 416; x <= 566; x += 7) mv += `<rect x="${x}" y="52" width="5" height="26" rx="2.5" fill="#ffc48a" stroke="${OUT}" stroke-width="1.2"/>`;
  s += part('mikrovilli', mv);
  s += `<g>${[0, 1, 2].map((i) => `<rect x="${414 + i * 54}" y="78" width="50" height="150" rx="8" fill="${C.cell}" stroke="${OUT}" stroke-width="2.5"/><ellipse cx="${439 + i * 54}" cy="170" rx="12" ry="16" fill="${C.nucleus}" stroke="${OUT}" stroke-width="2"/>`).join('')}</g>`;
  return s;
}

/* ------------------------------------------------------------------ */
/* 8. Vom Nährstoff zum Baustein (Seite 8, Abb. 1 – die Katzen-Stelle)  */
/* ------------------------------------------------------------------ */
function breakdownArt() {
  const ring = (x, y, col = '#ffcf5c') => `<polygon points="${[0, 60, 120, 180, 240, 300].map((a) => { const r = a * Math.PI / 180; return `${(x + 13 * Math.cos(r)).toFixed(1)},${(y + 13 * Math.sin(r)).toFixed(1)}`; }).join(' ')}" fill="${col}" stroke="${OUT}" stroke-width="2.4"/>`;
  const bead = (x, y, col) => `<circle cx="${x}" cy="${y}" r="10" fill="${col}" stroke="${OUT}" stroke-width="2.4"/>`;
  const AA = ['#ff8fa3', '#8fd3ff', '#b39cff', '#7cc46a', '#ffb020', '#ff7a59'];
  const arrow = (x1, y, x2, label, label2) => `<path d="M${x1} ${y} H${x2 - 10}" stroke="${OUT}" stroke-width="3.5"/><path d="M${x2} ${y} l-14 -8 v16 z" fill="${OUT}"/>` +
    `<text x="${(x1 + x2) / 2}" y="${y + 36}" text-anchor="middle" class="enz">${label}</text>` + (label2 ? `<text x="${(x1 + x2) / 2}" y="${y + 56}" text-anchor="middle" class="enz2">${label2}</text>` : '');
  let s = `<style>.enz{font:900 19px Nunito,sans-serif;fill:#7a3fd1}.enz2{font:800 14px Nunito,sans-serif;fill:#8a7a90}.ttl{font:900 24px Nunito,sans-serif;fill:${OUT}}.dst{font:900 17px Nunito,sans-serif}</style>`;
  // headings
  s += `<rect x="10" y="10" width="580" height="270" rx="20" fill="#fff3d6"/><text x="30" y="46" class="ttl">Kohlenhydrate</text>`;
  s += `<rect x="10" y="296" width="580" height="270" rx="20" fill="#ffe3ea"/><text x="30" y="332" class="ttl">Proteine (Eiweiße)</text>`;
  s += `<rect x="10" y="582" width="580" height="290" rx="20" fill="#e5f6dc"/><text x="30" y="618" class="ttl">Fette</text>`;
  // carbohydrates
  let st = ''; [[46, 120], [70, 106], [94, 120], [118, 106], [142, 120], [166, 106], [70, 140], [94, 154]].forEach(([x, y]) => { st += ring(x, y); });
  s += part('staerke', st);
  s += arrow(190, 128, 262, 'Amylase', 'Mund, Bauchspeicheldr.');
  s += part('maltose', ring(288, 128) + ring(312, 128));
  s += arrow(334, 128, 412, 'Maltase', 'Dünndarm');
  s += part('glucose', ring(436, 128));
  s += part('blut-kh', `<path d="M460 128 H500" stroke="${C.red}" stroke-width="4"/><path d="M512 128 l-14 -8 v16 z" fill="${C.red}"/><circle cx="545" cy="128" r="26" fill="#ffd9d9" stroke="${C.red}" stroke-width="3"/><path d="M545 112 C538 124 534 130 534 136 a11 11 0 0 0 22 0 C556 130 552 124 545 112 Z" fill="${C.red}"/>`);
  s += `<text x="545" y="180" text-anchor="middle" class="dst" fill="${C.red}">Blut</text>`;
  // proteins
  let pr = ''; const chain = [[36, 404], [56, 394], [76, 404], [96, 394], [116, 404], [136, 394], [128, 418], [108, 428], [88, 418], [68, 428]];
  pr += `<path d="M${chain.map((p) => p.join(' ')).join(' L')}" stroke="${OUT}" stroke-width="3" fill="none"/>`;
  chain.forEach(([x, y], i) => { pr += bead(x, y, AA[i % AA.length]); });
  s += part('proteine', pr);
  s += arrow(160, 414, 252, 'Pepsin, Trypsin', 'Magen, Bauchspeicheldr.');
  s += part('oligopeptide', `<path d="M270 414 H318" stroke="${OUT}" stroke-width="3"/>` + bead(270, 414, AA[0]) + bead(294, 414, AA[2]) + bead(318, 414, AA[4]));
  s += arrow(340, 414, 412, 'Peptidasen', 'Dünndarm');
  s += part('aminosaeuren', bead(430, 404, AA[1]) + bead(446, 426, AA[3]));
  s += part('blut-ps', `<path d="M462 414 H500" stroke="${C.red}" stroke-width="4"/><path d="M512 414 l-14 -8 v16 z" fill="${C.red}"/><circle cx="545" cy="414" r="26" fill="#ffd9d9" stroke="${C.red}" stroke-width="3"/><path d="M545 398 C538 410 534 416 534 422 a11 11 0 0 0 22 0 C556 416 552 410 545 398 Z" fill="${C.red}"/>`);
  s += `<text x="545" y="466" text-anchor="middle" class="dst" fill="${C.red}">Blut</text>`;
  // fats
  const fat = (x, y) => `<rect x="${x}" y="${y - 30}" width="16" height="60" rx="5" fill="#ffcf5c" stroke="${OUT}" stroke-width="2.4"/>` + [-22, 0, 22].map((dy) => `<rect x="${x + 16}" y="${y + dy - 5}" width="82" height="10" rx="5" fill="#7cc46a" stroke="${OUT}" stroke-width="2.2"/>`).join('');
  s += part('fette', fat(36, 708));
  s += arrow(150, 708, 262, 'Lipase', 'Galle emulgiert vorher');
  s += part('glycerin', `<rect x="282" y="678" width="16" height="60" rx="5" fill="#ffcf5c" stroke="${OUT}" stroke-width="2.4"/>`);
  s += part('fettsaeuren', [-22, 0, 22].map((dy) => `<rect x="${316}" y="${708 + dy - 5}" width="82" height="10" rx="5" fill="#7cc46a" stroke="${OUT}" stroke-width="2.2"/>`).join(''));
  s += part('lymphe', `<path d="M414 708 H496" stroke="#3a9d2f" stroke-width="4"/><path d="M508 708 l-14 -8 v16 z" fill="#3a9d2f"/><circle cx="545" cy="708" r="26" fill="#e1f5d8" stroke="#3a9d2f" stroke-width="3"/><path d="M545 692 C538 704 534 710 534 716 a11 11 0 0 0 22 0 C556 710 552 704 545 692 Z" fill="${C.lymph}" stroke="#3a9d2f" stroke-width="2"/>`);
  s += `<text x="545" y="760" text-anchor="middle" class="dst" fill="#3a9d2f">Lymphe</text>`;
  s += `<text x="300" y="852" text-anchor="middle" class="enz2">Über die Lymphe gelangen die Fette später auch ins Blut.</text>`;
  return s;
}


/* ------------------------------------------------------------------ */
/* 9. Seite 8, Abbildung 1 "Vorgänge bei der Verdauung" – like the booklet:
      legend left, small intestine in the middle, blood and lymph vessels above and below */
function page8Art() {
  const ring = (x, y, r = 9) => `<polygon points="${[0, 60, 120, 180, 240, 300].map((a) => { const t = a * Math.PI / 180; return `${(x + r * Math.cos(t)).toFixed(1)},${(y + r * Math.sin(t)).toFixed(1)}`; }).join(' ')}" fill="#ffcf5c" stroke="${OUT}" stroke-width="2"/>`;
  const bead = (x, y, col, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="${OUT}" stroke-width="2"/>`;
  const fa = (x, y, w = 40, rot = 0) => `<rect x="${x}" y="${y - 4}" width="${w}" height="8" rx="4" fill="#7cc46a" stroke="${OUT}" stroke-width="1.8" transform="rotate(${rot} ${x} ${y})"/>`;
  const gly = (x, y) => `<rect x="${x}" y="${y - 11}" width="9" height="22" rx="3" fill="#ffcf5c" stroke="${OUT}" stroke-width="1.8"/>`;
  const AA = ['#ff8fa3', '#8fd3ff', '#b39cff', '#7cc46a', '#ffb020'];
  const chain = (x, y, n) => Array.from({ length: n }, (_, i) => ring(x + i * 16, y + (i % 2 ? -7 : 0))).join('');
  const prot = (x, y) => { const pts = [[0, 0], [14, -8], [28, 0], [22, 13], [8, 15], [-4, 10], [36, 12]]; return `<path d="M${pts.map((q) => (x + q[0]) + ' ' + (y + q[1])).join(' L')}" stroke="${OUT}" stroke-width="2" fill="none"/>` + pts.map((q, i) => bead(x + q[0], y + q[1], AA[i % 5], 6)).join(''); };
  const fat = (x, y) => gly(x, y) + fa(x + 9, y - 7, 30) + fa(x + 9, y, 30) + fa(x + 9, y + 7, 30);
  const arrow = (x, y1, y2, col) => `<path d="M${x} ${y1} V${y2 + (y2 < y1 ? 10 : -10)}" stroke="${col}" stroke-width="3"/><path d="M${x} ${y2} l-7 ${y2 < y1 ? 12 : -12} h14 z" fill="${col}"/>`;
  let s = '';
  // legend (left), like the booklet
  s += `<rect x="6" y="10" width="178" height="452" rx="14" fill="#fff8ee" stroke="${OUT}" stroke-opacity=".15"/>`;
  s += `<g font-family="Nunito, sans-serif" font-weight="900" font-size="17" fill="${OUT}"><text x="18" y="38">1. Fette</text><text x="18" y="168">2. Proteine</text><text x="18" y="322">3. Kohlenhydrate</text></g>`;
  s += part('fettsaeuren', fa(28, 62, 60));
  s += part('glycerin', gly(30, 96));
  s += part('proteine', prot(30, 200));
  s += part('oligopeptide', `<path d="M30 248 H66" stroke="${OUT}" stroke-width="2"/>` + bead(30, 248, AA[0]) + bead(48, 248, AA[2]) + bead(66, 248, AA[4]));
  s += part('aminosaeuren', bead(32, 284, AA[1]) + bead(56, 284, AA[3]));
  s += part('staerke', chain(28, 360, 6));
  s += part('maltose', ring(30, 402) + ring(48, 402));
  s += part('glucose', ring(32, 438));
  // vessels
  const bloodTop = 'M214 70 C300 34 420 40 486 104', lymphTop = 'M520 82 C600 56 690 62 750 100';
  const lymphBot = 'M214 404 C300 368 420 360 486 338', bloodBot = 'M520 340 C600 378 690 396 750 362';
  s += part('blutgefaess8', tube(bloodTop, 30, '#f2878b') + tube(bloodBot, 30, '#f2878b') +
    ring(300, 52, 7) + bead(340, 50, AA[1], 6) + ring(380, 56, 7) + bead(420, 66, AA[3], 6) +
    ring(580, 360, 7) + bead(620, 372, AA[0], 6) + ring(660, 376, 7) + bead(700, 372, AA[2], 6));
  s += part('lymphgefaess8', tube(lymphTop, 16, '#d6efc0') + tube(lymphBot, 16, '#d6efc0') +
    fa(580, 68, 26, 8) + fa(640, 66, 26, 4) + gly(690, 74) + fa(270, 384, 26, -14) + fa(330, 372, 26, -10) + gly(400, 362));
  // small intestine (lumen) with walls
  s += part('darm8', `<rect x="196" y="136" width="560" height="160" fill="#fff1e3"/>` +
    `<path d="M196 132 H756 M196 140 H756 M196 292 H756 M196 300 H756" stroke="${OUT}" stroke-width="2" stroke-dasharray="7 6" opacity=".55"/>`);
  // contents: big on the left, small on the right
  s += chain(222, 176, 6) + prot(232, 236) + fat(330, 200) + chain(300, 266, 4);
  s += ring(420, 176) + ring(436, 176) + `<path d="M410 230 H446" stroke="${OUT}" stroke-width="2"/>` + bead(410, 230, AA[0]) + bead(428, 230, AA[2]) + bead(446, 230, AA[4]) + ring(470, 268) + ring(486, 268) + gly(500, 196) + fa(512, 190, 30, 10);
  s += ring(560, 172) + ring(612, 252) + bead(586, 210, AA[1]) + bead(650, 180, AA[3]) + bead(700, 238, AA[0]) + ring(726, 186) + gly(640, 228) + fa(660, 270, 34, -6) + fa(690, 160, 30, 12) + bead(560, 270, AA[2]);
  s += `<text x="204" y="128" font-family="Nunito, sans-serif" font-weight="900" font-size="15" fill="${OUT}" opacity=".7">Dünndarm</text>`;
  // arrows: Glucose + Aminosäuren into blood, fat building blocks into lymph
  s += arrow(360, 140, 84, C.red) + arrow(640, 296, 352, C.red) + arrow(640, 140, 82, '#3a9d2f') + arrow(360, 296, 372, '#3a9d2f');
  return s;
}

/* ------------------------------------------------------------------ */
/* Registry: parts in label order. at = point on the structure, mk = marker position. */
export const DIAGRAMS = {
  neuron: {
    title: 'Aufbau einer Nervenzelle (Neuron)', vb: [0, 0, 1000, 560], art: neuronArt,
    note: 'Gleiche Nummern wie auf deinem Arbeitsblatt.',
    parts: [
      { id: 'endknoepfchen', n: 1, name: 'Endknöpfchen', alts: ['synaptische Endknöpfchen', 'synaptisches Endknöpfchen', 'Endknöpfchen', 'Endknoepfchen', 'Synapsenendknöpfchen'], at: [155, 152], mk: [92, 60], info: 'Nehmen Kontakt mit anderen Nerven-, Muskel- oder Drüsenzellen auf.' },
      { id: 'synapse', n: 2, name: 'Synapse', alts: ['Synapse', 'Synapsen'], at: [210, 354], mk: [306, 430], info: 'Kontaktstelle: Hier wird die Information auf die nächste Zelle (Zielzelle) übertragen.' },
      { id: 'schwann', n: 3, name: 'Schwann’sche Zelle', alts: ['Schwannsche Zelle', 'Schwann Zelle', 'Schwann-Zelle', 'Gliazelle', 'Gliazellen', 'Hüllzelle', 'Schwannsche Zellen', 'Myelinscheide', 'Markscheide'], at: [496, 240], mk: [478, 160], info: 'Eine Gliazelle (Hüllzelle). Sie wickelt sich um das Axon und bildet die isolierende Myelinscheide (= Markscheide).' },
      { id: 'axon', n: 4, name: 'Axon', alts: ['Axon', 'Neurit', 'Nervenfaser'], at: [296, 258], mk: [372, 356], info: 'Langer Fortsatz: leitet die Impulse vom Zellkörper weg zu anderen Zellen.' },
      { id: 'ranvier', n: 5, name: 'Ranvier’scher Schnürring', alts: ['Ranvierscher Schnürring', 'Ranvier Schnürring', 'Schnürring', 'Ranviersche Schnürringe', 'Ranvier-Schnürring', 'Ranvierscher Schnuerring'], at: [592, 250], mk: [606, 160], info: 'Lücke zwischen zwei Schwann’schen Zellen. Der Impuls „springt“ von Schnürring zu Schnürring – so ist die Leitung besonders schnell.' },
      { id: 'axonhuegel', n: 6, name: 'Axonhügel', alts: ['Axonhügel', 'Axonhuegel', 'Ursprungskegel'], at: [768, 262], mk: [690, 348], info: 'Übergang vom Zellkörper zum Axon. Hier entsteht das Aktionspotenzial, wenn der Schwellenwert überschritten wird.' },
      { id: 'dendriten', n: 7, name: 'Dendriten', alts: ['Dendriten', 'Dendrit', 'Dentriten', 'Dendriden'], at: [790, 420], mk: [720, 478], info: 'Kurze, verzweigte Fortsätze: empfangen Signale von anderen Nervenzellen.' },
      { id: 'zellkoerper', n: 8, name: 'Zellkörper', alts: ['Zellkörper', 'Soma', 'Zellkoerper', 'Perikaryon'], at: [852, 296], mk: [880, 508], info: 'Stoffwechselzentrum der Nervenzelle: enthält den Großteil der Zellorganellen.' },
      { id: 'zellkern', n: 9, name: 'Zellkern', alts: ['Zellkern', 'Nucleus', 'Kern', 'Nukleus'], at: [848, 248], mk: [970, 44], info: 'Steuerzentrale der Nervenzelle (enthält die Erbinformation).' },
    ],
  },
  organe: {
    title: 'Übersicht der Verdauungsorgane', vb: [0, 0, 600, 900], art: organsArt,
    note: 'Nummeriert in der Reihenfolge, in der die Nahrung wandert.',
    parts: [
      { id: 'zaehne', name: 'Zähne', alts: ['Zähne', 'Zahn', 'Gebiss'], at: [226, 150], mk: [70, 110], info: 'Zerkleinern die Nahrung (mechanische Verdauung).' },
      { id: 'zunge', name: 'Zunge', alts: ['Zunge'], at: [262, 170], mk: [70, 210], info: 'Mischt die Nahrung mit Speichel und schiebt sie zum Schlucken nach hinten.' },
      { id: 'ohrspeicheldruese', name: 'Ohrspeicheldrüse', alts: ['Ohrspeicheldrüse', 'Ohrspeicheldruese', 'Ohrenspeicheldrüse'], at: [334, 134], mk: [520, 70], info: 'Größte Speicheldrüse, vor dem Ohr. Bildet Speichel mit Amylase.' },
      { id: 'unterzungenspeicheldruese', name: 'Unterzungenspeicheldrüse', alts: ['Unterzungenspeicheldrüse', 'Unterzungendrüse', 'Unterzungenspeicheldruese'], at: [252, 188], mk: [70, 290], info: 'Speicheldrüse unter der Zunge.' },
      { id: 'unterkieferspeicheldruese', name: 'Unterkieferspeicheldrüse', alts: ['Unterkieferspeicheldrüse', 'Unterkieferdrüse', 'Unterkieferspeicheldruese'], at: [298, 200], mk: [520, 170], info: 'Speicheldrüse im Unterkiefer.' },
      { id: 'speiseroehre', name: 'Speiseröhre', alts: ['Speiseröhre', 'Speiseroehre', 'Ösophagus'], at: [318, 300], mk: [520, 290], info: 'Transportiert den Speisebrei durch Peristaltik zum Magen. Keine Verdauung.' },
      { id: 'magen', name: 'Magen', alts: ['Magen'], at: [410, 470], mk: [540, 430], info: 'Speichert, durchknetet und verdaut (Salzsäure + Pepsin für Eiweiße).' },
      { id: 'leber', name: 'Leber', alts: ['Leber'], at: [200, 420], mk: [60, 400], info: 'Größte Drüse. Bildet Gallenflüssigkeit, Stoffwechselzentrum, Entgiftung.' },
      { id: 'gallenblase', name: 'Gallenblase', alts: ['Gallenblase', 'Galle'], at: [246, 474], mk: [60, 490], info: 'Speichert die Galle und gibt sie in den Zwölffingerdarm ab.' },
      { id: 'bauchspeicheldruese', name: 'Bauchspeicheldrüse', alts: ['Bauchspeicheldrüse', 'Pankreas', 'Bauchspeicheldruese'], at: [400, 556], mk: [545, 540], info: 'Bildet Verdauungssaft mit Amylase, Trypsin und Lipase (und die Hormone Insulin und Glucagon).' },
      { id: 'zwoelffingerdarm', name: 'Zwölffingerdarm', alts: ['Zwölffingerdarm', 'Zwoelffingerdarm', 'Duodenum'], at: [268, 560], mk: [60, 570], info: 'Erster Abschnitt des Dünndarms. Hier münden Galle und Bauchspeichel.' },
      { id: 'duenndarm', name: 'Dünndarm', alts: ['Dünndarm', 'Duenndarm'], at: [300, 702], mk: [545, 690], info: 'Hier wird fertig verdaut und die Bausteine kommen über die Darmzotten ins Blut.' },
      { id: 'dickdarm', name: 'Dickdarm', alts: ['Dickdarm'], at: [440, 640], mk: [545, 620], info: 'Holt Wasser und Elektrolyte zurück. Keine Nährstoffaufnahme.' },
      { id: 'blinddarm', name: 'Blinddarm mit Wurmfortsatz', alts: ['Blinddarm', 'Wurmfortsatz', 'Blinddarm mit Wurmfortsatz', 'Blinddarm/Wurmfortsatz', 'Blinddarm und Wurmfortsatz'], at: [150, 826], mk: [60, 760], info: 'Sackartiger Anfang des Dickdarms. Der Wurmfortsatz enthält viele Lymphknoten (Immunabwehr).' },
      { id: 'mastdarm', name: 'Mastdarm (Enddarm)', alts: ['Mastdarm', 'Enddarm', 'Rektum', 'Mastdarm/Enddarm'], at: [304, 846], mk: [545, 800], info: 'Endabschnitt des Dickdarms: sammelt den Kot und löst den Stuhldrang aus.' },
      { id: 'after', name: 'After', alts: ['After', 'Anus'], at: [304, 876], mk: [545, 870], info: 'Ausgang, im Ruhezustand durch einen Schließmuskel verschlossen.' },
    ],
  },
  zaehne: {
    title: 'Das Dauergebiss (Oberkiefer)', vb: [0, 0, 600, 560], art: teethArt,
    note: 'Wie auf Seite 3: 1 vorne bis 5 ganz hinten.',
    parts: [
      { id: 'schneidezaehne', n: 1, name: 'Schneidezähne', alts: ['Schneidezähne', 'Schneidezahn', 'Incisivi', 'Inzisiven'], at: toothL(7), mk: [300, 26], info: 'Abbeißen und Abschneiden (Incisivi, I).' },
      { id: 'eckzaehne', n: 2, name: 'Eckzähne', alts: ['Eckzähne', 'Eckzahn', 'Canini'], at: toothL(31), mk: [56, 120], info: 'Festhalten und Abreißen. Bei Raubtieren wie Katzen werden sie zu langen Fangzähnen (Canini, C).' },
      { id: 'backenzaehne', n: 3, name: 'Backenzähne (Prämolaren)', alts: ['Backenzähne', 'Backenzahn', 'Prämolaren', 'vordere Backenzähne', 'Praemolaren'], at: toothL(43), mk: [46, 236], info: 'Kaufläche mit 2 Höckern: zerkleinern und zermahlen (Prämolaren, P).' },
      { id: 'mahlzaehne', n: 4, name: 'Mahlzähne (Molaren)', alts: ['Mahlzähne', 'Mahlzahn', 'Molaren', 'hintere Backenzähne'], at: toothL(69), mk: [40, 350], info: 'Große Kaufläche mit mehreren Höckern: zermahlen (Molaren, M).' },
      { id: 'weisheitszaehne', n: 5, name: 'Weisheitszähne', alts: ['Weisheitszähne', 'Weisheitszahn'], at: toothL(99), mk: [40, 480], info: 'Die dritten Mahlzähne ganz hinten. Brechen oft erst spät oder gar nicht durch.' },
    ],
  },
  milchgebiss: {
    title: 'Das Milchgebiss (Oberkiefer)', vb: [0, 0, 600, 440], art: milkArt,
    note: 'Wie auf Seite 3: Die Nummer 3 fehlt, denn Kinder haben noch keine Backenzähne (Prämolaren).',
    parts: [
      { id: 'schneidezaehne', n: 1, name: 'Schneidezähne', alts: ['Schneidezähne', 'Schneidezahn', 'Incisivi', 'Milchschneidezähne'], at: milkL(9), mk: [300, 40], info: '2 pro Viertel: abbeißen.' },
      { id: 'eckzaehne', n: 2, name: 'Eckzähne', alts: ['Eckzähne', 'Eckzahn', 'Canini', 'Milcheckzähne'], at: milkL(42), mk: [70, 150], info: '1 pro Viertel: festhalten, abreißen.' },
      { id: 'mahlzaehne', n: 4, name: 'Mahlzähne (Milchmolaren)', alts: ['Mahlzähne', 'Mahlzahn', 'Molaren', 'Milchmolaren', 'Milchmahlzähne', 'Backenzähne'], at: milkL(74), mk: [60, 330], info: '2 pro Viertel: zermahlen. Prämolaren gibt es im Milchgebiss nicht.' },
    ],
  },
  magen: {
    title: 'Der Magen', vb: [0, 0, 600, 500], art: stomachArt,
    parts: [
      { id: 'speiseroehre', name: 'Speiseröhre', alts: ['Speiseröhre', 'Speiseroehre'], at: [236, 50], mk: [80, 40], info: 'Bringt den Speisebrei zum Magen.' },
      { id: 'magenmund', name: 'Schließmuskel des Magenmundes', alts: ['Schließmuskel des Magenmundes', 'Magenmund', 'Mageneingang', 'Schließmuskel', 'Schliessmuskel'], at: [262, 112], mk: [80, 130], info: 'Mageneingang. Lässt den Speisebrei hinein, aber (meistens) nicht zurück. Wenn nicht: Sodbrennen.' },
      { id: 'magen', name: 'Magen', alts: ['Magen'], at: [400, 200], mk: [540, 160], info: 'Sackartiges Organ: speichert, durchknetet und verdaut den Speisebrei.' },
      { id: 'speicherraum', name: 'Speicherraum', alts: ['Speicherraum', 'Speicher'], at: [440, 130], mk: [540, 70], info: 'Oberer Teil: Hier wird der Nahrungsbrei zwischengespeichert.' },
      { id: 'mischraum', name: 'Zerkleinern und Mischen', alts: ['Zerkleinern und Mischen', 'Mischraum', 'Zerkleinern', 'Mischen'], at: [420, 360], mk: [540, 380], info: 'Unterer Teil: Die Muskeln kneten den Brei etwa alle 20 Sekunden durch.' },
      { id: 'pfoertner', name: 'Pförtner (Magenausgang)', alts: ['Pförtner', 'Pfoertner', 'Magenausgang', 'Magenpförtner'], at: [222, 372], mk: [70, 300], info: 'Ringmuskel am Magenausgang. Gibt den Brei portionsweise in den Dünndarm ab.' },
      { id: 'zwoelffingerdarm', name: 'Zwölffingerdarm', alts: ['Zwölffingerdarm', 'Zwoelffingerdarm'], at: [160, 440], mk: [60, 470], info: 'Erster Teil des Dünndarms (ca. 30 cm, „12 Finger breit“).' },
    ],
  },
  schleimhaut: {
    title: 'Die Magenschleimhaut im Detail', vb: [0, 0, 600, 500], art: mucosaArt,
    parts: [
      { id: 'schleim', name: 'Schleim', alts: ['Schleim', 'Magenschleim'], at: [150, 40], mk: [60, 40], info: 'Schützt die Magenwand vor Salzsäure und Selbstverdauung.' },
      { id: 'magensaft', name: 'Magensaft', alts: ['Magensaft'], at: [350, 28], mk: [540, 40], info: 'Ca. 2 Liter am Tag: Salzsäure + Schleim + Enzyme (Pepsin).' },
      { id: 'nebenzelle', name: 'Nebenzelle', alts: ['Nebenzelle', 'Nebenzellen'], at: [366, 170], mk: [540, 170], info: 'Bildet den Magenschleim (Schutz).' },
      { id: 'belegzelle', name: 'Belegzelle', alts: ['Belegzelle', 'Belegzellen'], at: [367, 290], mk: [540, 290], info: 'Bildet die Salzsäure (pH 2): tötet Bakterien, lässt Nahrung aufquellen, macht aus Pepsinogen Pepsin.' },
      { id: 'hauptzelle', name: 'Hauptzelle', alts: ['Hauptzelle', 'Hauptzellen'], at: [364, 410], mk: [540, 420], info: 'Bildet Pepsinogen (die inaktive Vorstufe von Pepsin).' },
    ],
  },
  leber: {
    title: 'Leber und ihre Nachbarn', vb: [0, 0, 600, 480], art: liverArt,
    note: 'Wie Abbildung 1 auf Seite 6.',
    parts: [
      { id: 'arterie', name: 'Arterie', alts: ['Arterie', 'Aorta', 'Hauptschlagader'], at: [402, 40], mk: [540, 40], info: 'Bringt sauerstoffreiches Blut vom Herzen.' },
      { id: 'leber', name: 'Leber', alts: ['Leber'], at: [160, 160], mk: [40, 100], info: 'Größte Drüse (1,5–2 kg), zweilappig: das Stoffwechselzentrum.' },
      { id: 'pfortader', name: 'Pfortader', alts: ['Pfortader'], at: [286, 290], mk: [40, 290], info: 'Bringt das nährstoffreiche Blut vom Darm direkt zur Leber.' },
      { id: 'gallenblase', name: 'Gallenblase', alts: ['Gallenblase'], at: [236, 248], mk: [40, 210], info: 'Speichert die Galle aus der Leber.' },
      { id: 'speiseroehre', name: 'Speiseröhre', alts: ['Speiseröhre', 'Speiseroehre'], at: [348, 40], mk: [250, 22], info: 'Führt zum Magen.' },
      { id: 'magen', name: 'Magen', alts: ['Magen'], at: [480, 200], mk: [560, 150], info: 'Liegt links unter der Leber (von dir aus gesehen rechts).' },
      { id: 'bauchspeicheldruese', name: 'Bauchspeicheldrüse', alts: ['Bauchspeicheldrüse', 'Pankreas', 'Bauchspeicheldruese'], at: [470, 330], mk: [560, 390], info: 'Liegt quer hinter/unter dem Magen.' },
      { id: 'vene', name: 'Vene', alts: ['Vene', 'Hohlvene', 'untere Hohlvene'], at: [372, 440], mk: [470, 462], info: 'Führt das Blut zurück zum Herzen.' },
      { id: 'duenndarm', name: 'Dünndarm (Zwölffingerdarm)', alts: ['Dünndarm', 'Zwölffingerdarm', 'Duenndarm', 'Zwoelffingerdarm'], at: [236, 360], mk: [40, 400], info: 'Der Anfang des Dünndarms legt sich wie ein C um den Kopf der Bauchspeicheldrüse.' },
    ],
  },
  seite8abb1: {
    title: 'Seite 8, Abbildung 1: Vorgänge bei der Verdauung', vb: [0, 0, 760, 470], art: page8Art,
    note: 'So wie im Heft: links die Teilchen (Legende), in der Mitte der Dünndarm, oben und unten Blut- und Lymphgefäße.',
    parts: [
      { id: 'fettsaeuren', name: 'Fettsäuren', alts: ['Fettsäuren', 'Fettsäure', 'Fettsaeuren'], at: [58, 62], mk: [130, 62], info: 'Bausteine der Fette (lange Stäbchen). Sie gehen ins Lymphgefäß.' },
      { id: 'glycerin', name: 'Glycerin', alts: ['Glycerin', 'Glyzerin'], at: [35, 96], mk: [130, 100], info: 'Baustein der Fette (kurzes Stück). Geht ins Lymphgefäß.' },
      { id: 'proteine', name: 'Proteine', alts: ['Proteine', 'Protein', 'Eiweiße', 'Eiweiß'], at: [44, 205], mk: [130, 200], info: 'Lange, gefaltete Ketten aus vielen Aminosäuren.' },
      { id: 'oligopeptide', name: 'Oligopeptide', alts: ['Oligopeptide', 'Oligopeptid', 'Peptide'], at: [48, 248], mk: [130, 246], info: 'Kurze Ketten aus wenigen Aminosäuren (Zwischenstufe).' },
      { id: 'aminosaeuren', name: 'Aminosäuren', alts: ['Aminosäuren', 'Aminosäure', 'Aminosaeuren'], at: [44, 284], mk: [130, 288], info: 'Einzelne Bausteine der Proteine. Gehen ins Blutgefäß.' },
      { id: 'staerke', name: 'Stärke', alts: ['Stärke', 'Staerke'], at: [70, 356], mk: [150, 352], info: 'Lange Kette aus Glucose-Ringen.' },
      { id: 'maltose', name: 'Maltose', alts: ['Maltose', 'Malzzucker'], at: [40, 402], mk: [130, 402], info: 'Zwei Glucose-Ringe (Zwischenstufe).' },
      { id: 'glucose', name: 'Glucose', alts: ['Glucose', 'Glukose', 'Traubenzucker'], at: [32, 438], mk: [130, 440], info: 'Ein einzelner Ring: kleinster Baustein der Kohlenhydrate. Geht ins Blutgefäß.' },
      { id: 'darm8', name: 'Dünndarm', alts: ['Dünndarm', 'Duenndarm', 'Darm'], at: [470, 216], mk: [470, 216], info: 'Hier zerlegen die Enzyme die großen Nährstoffe in Bausteine.' },
      { id: 'blutgefaess8', name: 'Blutgefäß', alts: ['Blutgefäß', 'Blutgefäße', 'Blutgefaess', 'Blut'], at: [300, 46], mk: [262, 22], info: 'Nimmt Glucose und Aminosäuren auf (weiter über die Pfortader zur Leber).' },
      { id: 'lymphgefaess8', name: 'Lymphgefäß', alts: ['Lymphgefäß', 'Lymphgefäße', 'Lymphgefaess', 'Lymphe'], at: [620, 64], mk: [740, 30], info: 'Nimmt die Fettbausteine (Fettsäuren, Glycerin) auf, über die obere Hohlvene später ins Blut.' },
    ],
  },
  seite8abb2: {
    title: 'Seite 8, Abbildung 2: Bau des Dünndarms', vb: [0, 0, 600, 500], art: villusArt,
    note: 'Mit denselben Buchstaben wie im Heft (a bis d). „Darmzelle“ steht im Heft schon im Kästchen.',
    parts: [
      { id: 'darmzotte', n: 'a', name: 'Darmzotten', alts: ['Darmzotten', 'Darmzotte', 'Zotten', 'Zotte'], at: [200, 220], mk: [60, 90], info: 'Fingerförmige Ausstülpungen der Darmwand: vergrößern die Oberfläche.' },
      { id: 'mikrovilli', n: 'b', name: 'Mikrovilli', alts: ['Mikrovilli', 'Microvilli', 'Bürstensaum'], at: [490, 64], mk: [490, 280], info: 'Winzige Ausstülpungen der Darmzellen, zusammen der Bürstensaum.' },
      { id: 'blutgefaess', n: 'c', name: 'Blutgefäße', alts: ['Blutgefäße', 'Blutgefäß', 'Kapillaren', 'Blutgefaesse'], at: [222, 260], mk: [60, 240], info: 'Nehmen Glucose und Aminosäuren auf.' },
      { id: 'lymphgefaess', n: 'd', name: 'Lymphgefäß', alts: ['Lymphgefäß', 'Lymphgefäße', 'Lymphgefaess'], at: [250, 200], mk: [60, 160], info: 'Nimmt die Fette auf.' },
      { id: 'darmzelle', n: 'e', name: 'Darmzelle', alts: ['Darmzelle', 'Darmzellen', 'Epithelzelle'], at: [302, 300], mk: [370, 320], info: 'Deckzelle der Zotte, trägt die Mikrovilli und nimmt die Bausteine auf.' },
    ],
  },
  zotte: {
    title: 'Bau des Dünndarms: die Darmzotte', vb: [0, 0, 600, 500], art: villusArt,
    parts: [
      { id: 'darmzotte', name: 'Darmzotte', alts: ['Darmzotte', 'Darmzotten', 'Zotte', 'Zotten', 'Dünndarmzotte'], at: [200, 220], mk: [60, 90], info: 'Fingerförmige Ausstülpung der Darmwand. Vergrößert die Oberfläche.' },
      { id: 'darmzelle', name: 'Darmzelle (Epithelzelle)', alts: ['Darmzelle', 'Epithelzelle', 'Epithelzellen', 'Darmzellen', 'Darmschleimhautzelle'], at: [302, 300], mk: [370, 320], info: 'Deckzellen der Zotte. Nehmen die Bausteine der Nahrung auf.' },
      { id: 'mikrovilli', name: 'Mikrovilli (Bürstensaum)', alts: ['Mikrovilli', 'Bürstensaum', 'Mikrovillus', 'Buerstensaum', 'Microvilli'], at: [490, 64], mk: [490, 280], info: 'Winzige Ausstülpungen der Darmzellen. Zusammen bilden sie den Bürstensaum: noch mehr Oberfläche.' },
      { id: 'blutgefaess', name: 'Blutgefäß (Kapillaren)', alts: ['Blutgefäß', 'Blutgefäße', 'Kapillaren', 'Zottenkapillaren', 'Blutkapillaren', 'Blutgefaess', 'Kapillare'], at: [222, 260], mk: [60, 240], info: 'Nehmen Glucose und Aminosäuren auf und bringen sie über die Pfortader zur Leber.' },
      { id: 'lymphgefaess', name: 'Lymphgefäß', alts: ['Lymphgefäß', 'Lymphgefäße', 'Lymphgefaess', 'Lymphe', 'Chylusgefäß'], at: [250, 200], mk: [60, 160], info: 'Nimmt die Fette (Fettsäuren und Glycerin) auf.' },
      { id: 'krypte', name: 'Krypte', alts: ['Krypte', 'Krypten'], at: [168, 414], mk: [60, 350], info: 'Vertiefung zwischen den Zotten.' },
      { id: 'muskulatur', name: 'Ring- und Längsmuskulatur', alts: ['Muskulatur', 'Ringmuskulatur', 'Längsmuskulatur', 'Ring- und Längsmuskulatur', 'Muskelschicht', 'Muskeln'], at: [300, 456], mk: [540, 470], info: 'Bewegen den Darm (Peristaltik).' },
    ],
  },
  abbau: {
    title: 'Vom Nährstoff zum Baustein', vb: [0, 0, 600, 880], art: breakdownArt,
    note: 'Das ist die Abbildung „Vorgänge bei der Verdauung“ von Seite 8.',
    parts: [
      { id: 'staerke', name: 'Stärke', alts: ['Stärke', 'Staerke', 'Vielfachzucker', 'Polysaccharid'], at: [106, 130], mk: [106, 224], info: 'Lange Kette aus vielen Glucose-Ringen (Vielfachzucker).' },
      { id: 'maltose', name: 'Maltose (Malzzucker)', alts: ['Maltose', 'Malzzucker', 'Zweifachzucker'], at: [300, 128], mk: [300, 224], info: 'Zweifachzucker aus 2 Glucose-Molekülen.' },
      { id: 'glucose', name: 'Glucose (Traubenzucker)', alts: ['Glucose', 'Glukose', 'Traubenzucker', 'Einfachzucker'], at: [436, 128], mk: [436, 224], info: 'Einfachzucker: der kleinste Baustein der Kohlenhydrate.' },
      { id: 'proteine', name: 'Proteine (Eiweiße)', alts: ['Proteine', 'Protein', 'Eiweiß', 'Eiweiße', 'Eiweiss'], at: [86, 412], mk: [86, 510], info: 'Lange Ketten aus vielen Aminosäuren.' },
      { id: 'oligopeptide', name: 'Oligopeptide (Peptide)', alts: ['Oligopeptide', 'Oligopeptid', 'Peptide', 'Peptid'], at: [294, 414], mk: [294, 510], info: 'Kurze Ketten aus wenigen Aminosäuren.' },
      { id: 'aminosaeuren', name: 'Aminosäuren', alts: ['Aminosäuren', 'Aminosäure', 'Aminosaeuren'], at: [438, 414], mk: [438, 510], info: 'Die Bausteine der Proteine.' },
      { id: 'fette', name: 'Fette', alts: ['Fette', 'Fett', 'Lipide'], at: [80, 708], mk: [80, 800], info: 'Ein Fett besteht aus Glycerin und drei Fettsäuren.' },
      { id: 'glycerin', name: 'Glycerin', alts: ['Glycerin', 'Glyzerin'], at: [290, 708], mk: [290, 800], info: 'Der „Kamm-Rücken“ des Fettes.' },
      { id: 'fettsaeuren', name: 'Fettsäuren', alts: ['Fettsäuren', 'Fettsäure', 'Fettsaeuren'], at: [358, 708], mk: [370, 800], info: 'Die langen „Zinken“ des Fettes.' },
      { id: 'lymphe', name: 'Lymphgefäß', alts: ['Lymphgefäß', 'Lymphe', 'Lymphgefäße', 'Lymphgefaess'], at: [545, 730], mk: [545, 800], info: 'Fette gehen zuerst in die Lymphe (über die obere Hohlvene später ins Blut).' },
      { id: 'blut-kh', name: 'Blutgefäß', alts: ['Blutgefäß', 'Blut', 'Blutgefäße', 'Blutgefaess', 'Kapillaren'], at: [545, 150], mk: [545, 224], info: 'Glucose und Aminosäuren gehen ins Blut und über die Pfortader zur Leber.' },
    ],
  },
};

/* Build the SVG markup. opts: { numbers, only:[ids], hl:[ids], arrow, legend } */
export function diagramSVG(id, opts = {}) {
  const d = DIAGRAMS[id];
  const [x, y, w, hgt] = d.vb;
  const only = opts.only ? new Set(opts.only) : null;
  const nums = numbering(id, opts.only);
  let s = `<svg viewBox="${x} ${y} ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${d.title}">`;
  s += `<g class="art${opts.arrow ? '' : ' no-arrow'}">${d.art()}</g>`;
  if (opts.markers !== false) {
    for (const p of d.parts) {
      if (only && !only.has(p.id)) continue;
      const [ax, ay] = p.at, [mx, my] = p.mk;
      s += `<g class="mk" data-part="${p.id}" tabindex="0">` +
        `<line class="lead" x1="${mx}" y1="${my}" x2="${ax}" y2="${ay}"/>` +
        `<circle cx="${ax}" cy="${ay}" r="5" fill="#4a3542"/>` +
        `<circle cx="${mx}" cy="${my}" r="${w > 800 ? 34 : 22}"/>` +
        `<text x="${mx}" y="${my + 1}" style="font-size:${w > 800 ? 34 : 22}px">${nums[p.id]}</text></g>`;
    }
  }
  s += `</svg>`;
  return s;
}

/* Marker numbers: fixed if the worksheet has them, otherwise 1..n in order. */
export function numbering(id, onlyIds) {
  const d = DIAGRAMS[id];
  const list = onlyIds ? d.parts.filter((p) => onlyIds.includes(p.id)) : d.parts;
  const fixed = d.parts.every((p) => p.n);
  const out = {};
  list.forEach((p, i) => { out[p.id] = fixed ? p.n : (onlyIds ? i + 1 : d.parts.indexOf(p) + 1); });
  return out;
}

export function partById(id, pid) { return DIAGRAMS[id].parts.find((p) => p.id === pid); }

/* Small helpers for the diagram on the page: highlight + tap. */
export function highlight(root, ids = []) {
  const set = new Set(ids);
  root.classList.toggle('dim', set.size > 0);
  root.querySelectorAll('.part').forEach((g) => g.classList.toggle('hl', set.has(g.dataset.part)));
}

/* Zoom the SVG inside `root` onto the parts `ids` (animated viewBox). Empty ids = whole picture. */
export function zoomTo(root, ids = [], opts = {}) {
  const svg = root.querySelector('svg');
  if (!svg) return null;
  if (!svg.dataset.vb) svg.dataset.vb = svg.getAttribute('viewBox');
  const [fx, fy, fw, fh] = svg.dataset.vb.split(/\s+/).map(Number);
  let target = [fx, fy, fw, fh];
  if (ids && ids.length) {
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const id of ids) root.querySelectorAll(`.part[data-part="${id}"]`).forEach((g) => {
      let b; try { b = g.getBBox(); } catch (e) { return; }
      if (!b || (!b.width && !b.height)) return;
      x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height);
    });
    if (x1 < Infinity) {
      const ar = opts.aspect || fw / fh;
      const pad = Math.max(x2 - x1, y2 - y1) * 0.35 + 24;
      let w = x2 - x1 + pad * 2, hh = y2 - y1 + pad * 2;
      if (w / hh > ar) hh = w / ar; else w = hh * ar;
      const minW = fw * (opts.minFrac || 0.42);
      if (w < minW) { w = minW; hh = w / ar; }
      if (w > fw && hh > fh) { w = fw; hh = fh; }
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      let x = cx - w / 2, y = cy - hh / 2;
      if (w <= fw) x = Math.max(fx, Math.min(x, fx + fw - w)); else x = fx + (fw - w) / 2;
      if (hh <= fh) y = Math.max(fy, Math.min(y, fy + fh - hh)); else y = fy + (fh - hh) / 2;
      target = [x, y, w, hh];
    }
  }
  const from = (opts.from || svg.getAttribute('viewBox').split(/\s+/).map(Number));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dur = reduce ? 0 : (opts.duration ?? 700);
  const t0 = performance.now();
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const step = (t) => {
    const u = dur ? Math.min(1, (t - t0) / dur) : 1, e = ease(u);
    svg.setAttribute('viewBox', from.map((v, k) => (v + (target[k] - v) * e).toFixed(1)).join(' '));
    if (u < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  return target;
}
