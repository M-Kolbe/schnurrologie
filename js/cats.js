/* Cats drawn as SVG: the mascot Dr. Schnurrhaar, the patients and the collection. */

const OUT = '#3b2a35';

export function catSVG(o = {}) {
  const c = {
    fur: '#f2a35e', belly: '#fff3e6', stripe: '#c96d2b', eyes: '#7bc043', ear: '#ffb3c1',
    pattern: 'tabby', mood: 'happy', acc: [], size: 200, ...o,
  };
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const acc = new Set(c.acc);
  const sw = 3.2;
  let s = `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="catsvg">`;
  s += `<defs><clipPath id="${id}h"><ellipse cx="100" cy="90" rx="54" ry="47"/></clipPath><clipPath id="${id}b"><ellipse cx="100" cy="154" rx="52" ry="44"/></clipPath></defs>`;
  // tail
  const tailCol = c.pattern === 'siam' ? c.stripe : c.fur;
  s += `<path d="M146 178 C 186 176, 196 132, 172 116 C 164 111, 158 118, 166 124 C 182 138, 170 166, 142 166" fill="${tailCol}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  // body
  s += `<ellipse cx="100" cy="154" rx="52" ry="44" fill="${c.fur}" stroke="${OUT}" stroke-width="${sw}"/>`;
  s += `<g clip-path="url(#${id}b)">`;
  if (c.pattern === 'tabby') s += `<path d="M52 140 h18 M50 158 h20 M54 176 h16 M148 140 h-18 M150 158 h-20 M146 176 h-16" stroke="${c.stripe}" stroke-width="6" stroke-linecap="round"/>`;
  if (c.pattern === 'calico') s += `<circle cx="62" cy="140" r="22" fill="${c.stripe}"/><circle cx="142" cy="178" r="20" fill="#2f2a2e"/>`;
  if (c.pattern === 'siam') s += `<ellipse cx="100" cy="200" rx="60" ry="16" fill="${c.stripe}" opacity=".7"/>`;
  s += `<ellipse cx="100" cy="166" rx="${c.pattern === 'tuxedo' ? 30 : 27}" ry="34" fill="${c.belly}"/>`;
  s += `</g>`;
  s += `<ellipse cx="100" cy="154" rx="52" ry="44" fill="none" stroke="${OUT}" stroke-width="${sw}"/>`;
  // paws
  const pawCol = c.pattern === 'siam' ? c.stripe : (c.pattern === 'tuxedo' ? c.belly : c.fur);
  s += `<ellipse cx="80" cy="194" rx="15" ry="10" fill="${pawCol}" stroke="${OUT}" stroke-width="${sw}"/><ellipse cx="120" cy="194" rx="15" ry="10" fill="${pawCol}" stroke="${OUT}" stroke-width="${sw}"/>`;
  s += `<path d="M75 192 v5 M81 192 v5 M115 192 v5 M121 192 v5" stroke="${OUT}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`;
  // ears
  const earCol = c.pattern === 'siam' ? c.stripe : c.fur;
  s += `<path d="M56 72 L60 20 L98 50 Z" fill="${earCol}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<path d="M144 72 L140 20 L102 50 Z" fill="${c.pattern === 'calico' ? '#2f2a2e' : earCol}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<path d="M64 60 L66 32 L88 50 Z M136 60 L134 32 L112 50 Z" fill="${c.ear}"/>`;
  // head
  s += `<ellipse cx="100" cy="90" rx="54" ry="47" fill="${c.fur}" stroke="${OUT}" stroke-width="${sw}"/>`;
  s += `<g clip-path="url(#${id}h)">`;
  if (c.pattern === 'tabby') s += `<path d="M100 44 v16 M88 46 l3 13 M112 46 l-3 13 M46 86 h14 M48 98 h12 M154 86 h-14 M152 98 h-12" stroke="${c.stripe}" stroke-width="5" stroke-linecap="round"/>`;
  if (c.pattern === 'calico') s += `<circle cx="140" cy="62" r="26" fill="#2f2a2e"/><circle cx="58" cy="70" r="20" fill="${c.stripe}"/>`;
  if (c.pattern === 'tuxedo') s += `<path d="M100 70 C 82 78, 70 100, 74 140 L126 140 C 130 100, 118 78, 100 70 Z" fill="${c.belly}"/>`;
  if (c.pattern === 'siam') s += `<ellipse cx="100" cy="108" rx="30" ry="26" fill="${c.stripe}" opacity=".85"/>`;
  if (c.pattern === 'patch') s += `<circle cx="132" cy="70" r="18" fill="${c.stripe}"/>`;
  s += `<ellipse cx="100" cy="112" rx="24" ry="17" fill="${c.pattern === 'siam' ? c.stripe : c.belly}" opacity="${c.pattern === 'siam' ? 1 : .9}"/>`;
  s += `</g>`;
  s += `<ellipse cx="100" cy="90" rx="54" ry="47" fill="none" stroke="${OUT}" stroke-width="${sw}"/>`;
  // cheeks
  s += `<ellipse cx="66" cy="104" rx="9" ry="6" fill="#ff8fa3" opacity=".45"/><ellipse cx="134" cy="104" rx="9" ry="6" fill="#ff8fa3" opacity=".45"/>`;
  // eyes
  if (c.mood === 'sleep') {
    s += `<path d="M70 88 q10 8 20 0 M110 88 q10 8 20 0" fill="none" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else if (c.mood === 'sick') {
    s += `<path d="M70 86 q10 -6 20 0 M110 86 q10 -6 20 0" fill="none" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
    s += `<path d="M72 92 q8 5 16 0 M112 92 q8 5 16 0" fill="none" stroke="${OUT}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`;
  } else if (c.mood === 'wink') {
    s += eye(80, c.eyes) + `<path d="M110 88 q10 -8 20 0" fill="none" stroke="${OUT}" stroke-width="3.5" stroke-linecap="round"/>`;
  } else if (c.mood === 'wow') {
    s += eye(80, c.eyes, 1.2) + eye(120, c.eyes, 1.2);
  } else {
    s += eye(80, c.eyes) + eye(120, c.eyes);
  }
  // nose + mouth
  s += `<path d="M94 101 h12 l-6 7 z" fill="#ff7a93" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>`;
  if (c.mood === 'sick') s += `<path d="M90 118 q10 -6 20 0" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/>`;
  else if (c.mood === 'wow') s += `<ellipse cx="100" cy="117" rx="6" ry="7" fill="#7a2f3f" stroke="${OUT}" stroke-width="2"/>`;
  else s += `<path d="M100 108 q-5 8 -11 3 M100 108 q5 8 11 3" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round"/>`;
  // whiskers
  s += `<path d="M58 104 l-24 -4 M58 110 l-24 4 M142 104 l24 -4 M142 110 l24 4" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>`;
  // accessories
  if (acc.has('glasses')) s += `<g fill="rgba(255,255,255,.25)" stroke="${OUT}" stroke-width="3"><circle cx="80" cy="88" r="15"/><circle cx="120" cy="88" r="15"/></g><path d="M95 86 q5 -4 10 0" stroke="${OUT}" stroke-width="3" fill="none"/>`;
  if (acc.has('mirror')) s += `<path d="M62 56 q38 -20 76 0" stroke="#5d6b7a" stroke-width="4" fill="none"/><circle cx="100" cy="46" r="11" fill="#dfe8f0" stroke="#5d6b7a" stroke-width="3"/><circle cx="100" cy="46" r="4" fill="#5d6b7a"/>`;
  if (acc.has('stetho')) s += `<path d="M70 128 C 70 160, 130 160, 130 128" fill="none" stroke="#2b8a7e" stroke-width="5" stroke-linecap="round"/><path d="M100 150 v18" stroke="#2b8a7e" stroke-width="5"/><circle cx="100" cy="172" r="8" fill="#c9d6df" stroke="#2b8a7e" stroke-width="3.5"/>`;
  if (acc.has('coat')) s += `<path d="M60 136 L84 130 L100 168 L116 130 L140 136 C 152 160, 150 186, 140 196 L60 196 C 50 186, 48 160, 60 136 Z" fill="#ffffff" stroke="${OUT}" stroke-width="2.6" opacity=".95"/><path d="M100 168 V196" stroke="${OUT}" stroke-width="2"/><rect x="120" y="160" width="12" height="9" rx="2" fill="#ff7a59"/>`;
  if (acc.has('bow')) s += `<path d="M126 52 l-14 -10 v20 z M126 52 l14 -10 v20 z" fill="#ff5d8f" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="126" cy="52" r="5" fill="#ff5d8f" stroke="${OUT}" stroke-width="2.4"/>`;
  if (acc.has('cone')) s += `<path d="M38 132 L60 120 Q100 140 140 120 L162 132 Q100 162 38 132 Z" fill="rgba(200,230,255,.55)" stroke="#6aa3c8" stroke-width="3" stroke-linejoin="round"/>`;
  if (acc.has('bandage')) s += `<rect x="112" y="56" width="26" height="10" rx="4" transform="rotate(-25 125 61)" fill="#ffe1b5" stroke="${OUT}" stroke-width="2"/><path d="M121 59 l2 2 M127 56 l2 2" stroke="${OUT}" stroke-width="1.5"/>`;
  if (acc.has('thermo')) s += `<g transform="rotate(-20 110 116)"><rect x="104" y="112" width="34" height="6" rx="3" fill="#fff" stroke="${OUT}" stroke-width="2"/><circle cx="138" cy="115" r="4.5" fill="#ff4d4d" stroke="${OUT}" stroke-width="2"/></g>`;
  if (acc.has('crown')) s += `<path d="M76 46 L80 24 L92 38 L100 18 L108 38 L120 24 L124 46 Z" fill="#ffc83d" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (acc.has('heart')) s += `<path d="M162 40 c-6 -10 -20 -4 -14 8 l14 12 l14 -12 c6 -12 -8 -18 -14 -8 z" fill="#ff5d8f" stroke="${OUT}" stroke-width="2"/>`;
  if (acc.has('book')) s += `<path d="M64 178 L100 172 L136 178 L136 200 L100 194 L64 200 Z" fill="#8a6cff" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/><path d="M100 172 V194" stroke="${OUT}" stroke-width="2"/>`;
  if (acc.has('zzz')) s += `<text x="150" y="40" font-family="Nunito, sans-serif" font-weight="900" font-size="22" fill="${OUT}">z</text><text x="166" y="24" font-family="Nunito, sans-serif" font-weight="900" font-size="16" fill="${OUT}">z</text>`;
  s += `</svg>`;
  return s;

  function eye(cx, col, k = 1) {
    return `<ellipse cx="${cx}" cy="88" rx="${10 * k}" ry="${12 * k}" fill="${col}" stroke="${OUT}" stroke-width="2.4"/>` +
      `<ellipse cx="${cx}" cy="89" rx="${4.2 * k}" ry="${9 * k}" fill="#1d1418"/>` +
      `<circle cx="${cx + 3.5 * k}" cy="${83 - 1 * k}" r="${3.2 * k}" fill="#fff"/><circle cx="${cx - 3 * k}" cy="94" r="${1.5 * k}" fill="#fff" opacity=".8"/>`;
  }
}

/* The mascot. */
export const DOC = { name: 'Dr. Schnurrhaar', fur: '#a3a9b3', belly: '#eef0f4', stripe: '#6c727c', eyes: '#58c08a', pattern: 'tabby' };
export function docSVG(mood = 'happy', extra = []) {
  return catSVG({ ...DOC, mood, acc: ['glasses', 'stetho', ...extra] });
}

/* Patients (one per chapter) and bonus cats. Each has a real vet fact. */
export const CATS = [
  { id: 'mo', name: 'Kater Mo', breed: 'Rot getigert', look: { fur: '#f2a35e', stripe: '#c96d2b', belly: '#fff3e6', eyes: '#9ccc3c', pattern: 'tabby' },
    fact: 'Katzen sind Fleischfresser. Ihr Darm ist im Verhältnis zum Körper viel kürzer als bei Pflanzenfressern, weil Fleisch leichter zu verdauen ist als Pflanzen.' },
  { id: 'luna', name: 'Luna', breed: 'Schwarze Hauskatze', look: { fur: '#3a3438', stripe: '#262124', belly: '#4d464b', eyes: '#ffcc33', ear: '#d98a9c', pattern: 'plain' },
    fact: 'Erwachsene Katzen haben 30 Zähne, Kätzchen 26 Milchzähne. Mit ihren Reißzähnen schneiden sie Fleisch wie mit einer Schere.' },
  { id: 'minka', name: 'Minka', breed: 'Glückskatze (dreifarbig)', look: { fur: '#fff6ec', stripe: '#f0a04b', belly: '#ffffff', eyes: '#58b368', pattern: 'calico' },
    fact: 'Katzen würgen manchmal Haarballen aus dem Magen hoch. Die Haare verschlucken sie beim Putzen, verdauen können sie sie nicht.' },
  { id: 'felix', name: 'Felix', breed: 'Schwarz-weiß (Tuxedo)', look: { fur: '#2e2a2d', stripe: '#2e2a2d', belly: '#ffffff', eyes: '#7fd36b', ear: '#d98a9c', pattern: 'tuxedo' },
    fact: 'Für Katzen ist schon wenig Paracetamol giftig. Ihrer Leber fehlt ein Enzym, mit dem wir Menschen den Wirkstoff abbauen.' },
  { id: 'simba', name: 'Simba', breed: 'Maine Coon', look: { fur: '#e9973f', stripe: '#b8641c', belly: '#ffe7c7', eyes: '#d4a62a', pattern: 'tabby' },
    fact: 'Katzen müssen den Baustein Taurin mit dem Fleisch fressen, ihr Körper bildet zu wenig davon. Fehlt Taurin, werden Herz und Augen krank.' },
  { id: 'nala', name: 'Nala', breed: 'Siamkatze', look: { fur: '#f4e6d2', stripe: '#6b4a3a', belly: '#fbf3e8', eyes: '#4aa3df', pattern: 'siam' },
    fact: 'Auch im Katzendarm sitzen Zotten mit Mikrovilli. Sie vergrößern die Oberfläche, damit möglichst viele Nährstoffe ins Blut kommen.' },
  { id: 'kiki', name: 'Kiki', breed: 'Grau-weiß', look: { fur: '#9aa3ad', stripe: '#77808a', belly: '#ffffff', eyes: '#f2c14e', pattern: 'tuxedo' },
    fact: 'Viele erwachsene Katzen vertragen keine Kuhmilch. Ihnen fehlt, wie bei der Laktoseintoleranz, das Enzym Laktase. Davon bekommen sie Durchfall.' },
  { id: 'tiger', name: 'Tiger', breed: 'Braun getigert', look: { fur: '#9b7653', stripe: '#5b4330', belly: '#efe0cf', eyes: '#a5c93a', pattern: 'tabby' },
    fact: 'Katzen fressen manchmal Gras. Fachleute vermuten, dass es hilft, Haare wieder loszuwerden.' },
  { id: 'pixel', name: 'Pixel', breed: 'Weiße Katze', look: { fur: '#ffffff', stripe: '#e8e8e8', belly: '#ffffff', eyes: '#5aa9e6', pattern: 'plain' },
    fact: 'Die Schnurrhaare einer Katze sind mit sehr vielen Nervenzellen verbunden. So spürt sie sogar kleine Luftbewegungen im Dunkeln.' },
  { id: 'zimt', name: 'Zimt', breed: 'Abessinier', look: { fur: '#c98a4b', stripe: '#9c6232', belly: '#f0d2ad', eyes: '#c7a43a', pattern: 'patch' },
    fact: 'Im Speichel von Katzen gibt es praktisch keine Amylase. Stärke spielt für Katzen als Fleischfresser kaum eine Rolle.' },
  // bonus cats
  { id: 'sternchen', name: 'Sternchen', breed: 'Britisch Kurzhaar', bonus: 'Lerne 3 Tage hintereinander', look: { fur: '#8c9bb0', stripe: '#7385a0', belly: '#a9b6c8', eyes: '#f0a83a', pattern: 'plain' },
    fact: 'Katzen können nichts Süßes schmecken. Ihnen fehlt der Geschmackssensor (Rezeptor) für süß.' },
  { id: 'mausi', name: 'Mausi', breed: 'Kätzchen', bonus: 'Schaffe deine erste Tipp-Runde (Stufe 2)', look: { fur: '#ffd7a8', stripe: '#f0a95c', belly: '#fff6ea', eyes: '#6fb7ff', pattern: 'tabby' },
    fact: 'Kätzchen trinken Muttermilch und haben deshalb viel Laktase. Nach dem Abstillen sinkt die Menge stark.' },
  { id: 'brownie', name: 'Brownie', breed: 'Burma', bonus: '100 richtige Antworten', look: { fur: '#6b4a35', stripe: '#4d3424', belly: '#8a6650', eyes: '#f2c94c', pattern: 'plain' },
    fact: 'Katzen schnurren meist mit 25 bis 150 Schwingungen pro Sekunde. Forscher untersuchen, ob das Schnurren beim Heilen von Knochen hilft.' },
  { id: 'blitz', name: 'Blitz', breed: 'Bengal', bonus: 'Schaffe eine 10er-Combo', look: { fur: '#f0b45a', stripe: '#6b4220', belly: '#fff0d6', eyes: '#89c540', pattern: 'calico' },
    fact: 'Katzen reagieren blitzschnell. Ihre Nervenbahnen sind wie unsere mit einer Myelinscheide isoliert, das macht die Reizleitung schnell.' },
  { id: 'cleo', name: 'Königin Cleo', breed: 'Perserkatze', bonus: 'Probearbeit mit Note 1 (Sehr gut)', look: { fur: '#f7efe6', stripe: '#e6d6c4', belly: '#ffffff', eyes: '#3fb1c9', pattern: 'plain' }, acc: ['crown'],
    fact: 'Eine gesunde Katze hat eine Körpertemperatur von etwa 38 bis 39 °C, also etwas mehr als wir Menschen.' },
  { id: 'nachtfee', name: 'Nachtfee', breed: 'Russisch Blau', bonus: 'Alle Kapitel einmal gelernt', look: { fur: '#7d8ba1', stripe: '#6b7990', belly: '#93a0b4', eyes: '#3fd48b', pattern: 'plain' },
    fact: 'Katzen schlafen 12 bis 16 Stunden am Tag. Auch Menschen lernen im Schlaf weiter: Das Gehirn speichert das Gelernte nachts ab.' },
];

export function catById(id) { return CATS.find((c) => c.id === id); }
export function catPic(cat, mood = 'happy', extra = []) {
  return catSVG({ ...cat.look, mood, acc: [...(cat.acc || []), ...extra] });
}
