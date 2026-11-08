/* BioCoach look: logo, round illustrations (emblems), chapter rings and collectible badges.
   All drawn as SVG, no image files. Icons come from icons.js. */
import { PATHS } from './icons.js';

export const APP_NAME = 'BioCoach';

let uid = 0;
const nid = (p) => `${p}${++uid}`;
const iconPaths = (name) => PATHS[name] || '';

/* Logo: rounded square, teal to violet, with a white double helix. */
export function logoSVG(size = '') {
  const g = nid('lg');
  return `<svg class="logo" viewBox="0 0 48 48" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#13b3a0"/><stop offset="1" stop-color="#5b4fd6"/></linearGradient></defs>
<rect width="48" height="48" rx="13" fill="url(#${g})"/>
<g transform="translate(12 12)" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round">
<path d="M8 2c0 4.8 8 5 8 10s-8 5.2-8 10"/><path d="M16 2c0 4.8-8 5-8 10s8 5.2 8 10" opacity=".72"/>
<path d="M9.4 4.6h5.2M9.4 19.4h5.2M10.6 9.4h2.8M10.6 14.6h2.8" stroke-width="1.8" opacity=".9"/></g></svg>`;
}

/* Round illustration with an icon: replaces any mascot. kind sets icon + colour. */
const KINDS = {
  happy: ['sparkle', '#0b8f80'],
  wow: ['trophy', '#e99a0c'],
  good: ['check', '#14915a'],
  oops: ['refresh', '#ef5f3c'],
  book: ['book', '#6656e0'],
  think: ['bulb', '#e99a0c'],
  alert: ['alert', '#ef5f3c'],
  film: ['film', '#0b8f80'],
  clock: ['clock', '#6656e0'],
  rank: ['medal', '#6656e0'],
  flame: ['flame', '#ef5f3c'],
};
export function emblem(kind = 'happy', opts = {}) {
  const [ic, col] = KINDS[kind] || KINDS.happy;
  const icon = opts.icon || ic, c = opts.color || col, g = nid('eg');
  return `<svg class="emblem" viewBox="0 0 120 120" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".78"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
<circle cx="60" cy="60" r="56" fill="${c}" opacity=".13"/>
<circle cx="60" cy="60" r="42" fill="url(#${g})"/>
<circle cx="60" cy="60" r="42" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
<g transform="translate(36 36) scale(2)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths(icon)}</g>
<g fill="${c}"><circle cx="104" cy="28" r="4" opacity=".55"/><circle cx="16" cy="86" r="3" opacity=".45"/><path d="M98 92l2.2 5.8L106 100l-5.8 2.2L98 108l-2.2-5.8L90 100l5.8-2.2z" opacity=".6"/></g></svg>`;
}

/* Chapter picture: chapter icon in its colour, surrounded by a progress ring. */
export function chapterArt(icon, color, m = 0, deco = false) {
  const r = 50, C = 2 * Math.PI * r, done = deco ? 1 : Math.max(0, Math.min(1, m));
  return `<svg class="chapart" viewBox="0 0 120 120" aria-hidden="true">
<circle cx="60" cy="60" r="${r}" fill="none" stroke="${color}" stroke-opacity=".16" stroke-width="9"/>
${done > 0.005 ? `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(C * done).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"${deco ? ' stroke-opacity=".5"' : ''}/>` : ''}
<circle cx="60" cy="60" r="38" fill="${color}"/>
<g transform="translate(40 40) scale(1.667)" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths(icon)}</g>
${done >= 0.8 && !deco ? `<g transform="translate(84 6)"><circle cx="14" cy="14" r="14" fill="#14915a" stroke="#fff" stroke-width="3"/><path d="M8 14.5l4 4 8-8.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>` : ''}</svg>`;
}

/* Collectible badges: one per chapter (unlocked at 80 %) and six bonus badges. Each carries a real fact. */
export const BADGES = [
  { id: 'ueberblick', ch: 'ueberblick', name: 'Wegweiserin', icon: 'map', color: '#e0603f',
    fact: 'Vom Mund bis zum After ist die Nahrung meist ein bis drei Tage unterwegs. Am längsten bleibt sie im Dickdarm.' },
  { id: 'mund', ch: 'mund', name: 'Zahn-Expertin', icon: 'tooth', color: '#d4467a',
    fact: 'Deine Speicheldrüsen bilden jeden Tag ein bis eineinhalb Liter Speichel, beim Essen besonders viel.' },
  { id: 'magen', ch: 'magen', name: 'Magen-Kennerin', icon: 'stomach', color: '#a64fc0',
    fact: 'Die Salzsäure im Magen ist so sauer, dass sie die meisten Bakterien im Essen abtötet.' },
  { id: 'leber', ch: 'leber', name: 'Leber-Profi', icon: 'flask', color: '#b5603e',
    fact: 'Die Leber ist das größte innere Organ. Beim Erwachsenen wiegt sie ungefähr 1,5 Kilogramm.' },
  { id: 'duenndarm', ch: 'duenndarm', name: 'Zotten-Forscherin', icon: 'spiral', color: '#c98314',
    fact: 'Falten, Zotten und Mikrovilli vergrößern die Oberfläche des Dünndarms riesig. Im Heft steht „ca. 1 Tennisplatz“, neuere Messungen kommen auf 30 bis 40 Quadratmeter.' },
  { id: 'abbau', ch: 'abbau', name: 'Baustein-Meisterin', icon: 'blocks', color: '#6656e0',
    fact: 'Aus nur 20 verschiedenen Aminosäuren baut dein Körper Tausende verschiedene Eiweiße, zum Beispiel Enzyme und Muskeleiweiß.' },
  { id: 'zoeliakie', ch: 'zoeliakie', name: 'Darm-Detektivin', icon: 'wheat', color: '#2f9a5c',
    fact: 'Gluten steckt in Weizen, Dinkel, Roggen und Gerste. Reis, Mais, Hirse und Kartoffeln sind von Natur aus glutenfrei.' },
  { id: 'dickdarm', ch: 'dickdarm', name: 'Dickdarm-Kennerin', icon: 'bacteria', color: '#7a6852',
    fact: 'Im Darm leben ungefähr so viele Bakterien, wie dein Körper Zellen hat: rund 38 Billionen.' },
  { id: 'enzyme', ch: 'enzyme', name: 'Enzym-Meisterin', icon: 'scissors', color: '#2f7fd1',
    fact: 'Enzyme werden bei der Arbeit nicht verbraucht. Ein einziges Enzym kann sehr viele Moleküle hintereinander spalten.' },
  { id: 'neuron', ch: 'neuron', name: 'Nerven-Expertin', icon: 'neuron', color: '#0b8f80',
    fact: 'Dein Gehirn hat ungefähr 86 Milliarden Nervenzellen. Jede ist mit Tausenden anderen verbunden.' },
  { id: 'serie', name: 'Dranbleiberin', icon: 'flame', color: '#ef5f3c', bonus: 'Lerne 3 Tage hintereinander',
    fact: 'Wer an mehreren Tagen kurz lernt, behält mehr als bei einem einzigen langen Lerntag. Das nennt man verteiltes Lernen.' },
  { id: 'tippen', name: 'Tipp-Profi', icon: 'pen', color: '#2f7fd1', bonus: 'Schaffe deine erste Tipp-Runde (Stufe 2)',
    fact: 'Antworten selbst aufschreiben trainiert das Erinnern viel stärker als nur die richtige Antwort wiederzuerkennen.' },
  { id: 'hundert', name: 'Hunderterin', icon: 'target', color: '#14915a', bonus: '100 richtige Antworten',
    fact: 'Jedes Mal, wenn du dich an etwas erinnerst, werden die Verbindungen zwischen deinen Nervenzellen stärker.' },
  { id: 'blitz', name: 'Blitzschnell', icon: 'bolt', color: '#e99a0c', bonus: 'Schaffe eine 10er-Combo',
    fact: 'Ziehst du die Hand von einer heißen Herdplatte weg, reagiert schon das Rückenmark. Dieser Reflex ist schneller als bewusstes Denken.' },
  { id: 'einser', name: 'Einser-Kandidatin', icon: 'trophy', color: '#c98314', bonus: 'Probearbeit mit Note 1 (Sehr gut)',
    fact: 'Probearbeiten sind eine der wirksamsten Lernmethoden: Du übst genau das, was in der echten Arbeit verlangt wird.' },
  { id: 'nachteule', name: 'Nachteule', icon: 'moon', color: '#6656e0', bonus: 'Alle Kapitel einmal gelernt',
    fact: 'Im Schlaf speichert das Gehirn das Gelernte ab. Gut schlafen vor der Arbeit lohnt sich also.' },
];
export const badgeById = (id) => BADGES.find((b) => b.id === id);

/* Old collection ids (earlier version) -> badge ids. */
export const OLD_IDS = { mo: 'ueberblick', luna: 'mund', minka: 'magen', felix: 'leber', nala: 'duenndarm', simba: 'abbau', kiki: 'zoeliakie', tiger: 'dickdarm', zimt: 'enzyme', pixel: 'neuron', sternchen: 'serie', mausi: 'tippen', brownie: 'hundert', blitz: 'blitz', cleo: 'einser', nachtfee: 'nachteule' };

/* Medal with ribbon. Locked badges are grey with a lock. */
export function badgeSVG(b, has = true) {
  const c = has ? b.color : '#9aa5ad', g = nid('bg');
  return `<svg class="badge${has ? '' : ' locked'}" viewBox="0 0 120 120" aria-hidden="true">
<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
<path d="M40 70l-12 40 16-6 10 12 10-34z" fill="${c}" opacity=".55"/><path d="M80 70l12 40-16-6-10 12-10-34z" fill="${c}" opacity=".55"/>
<circle cx="60" cy="54" r="44" fill="${c}" opacity=".18"/>
<circle cx="60" cy="54" r="36" fill="url(#${g})"/>
<circle cx="60" cy="54" r="30" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="3 4"/>
<g transform="translate(42 36) scale(1.5)" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${iconPaths(has ? b.icon : 'lock')}</g></svg>`;
}
