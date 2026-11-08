/* Where everything comes from: page and task in the booklet ("Heft", pages 2–11) or the neuron worksheet.
   Every exercise, figure, Steckbrief card and Lernkarte section points here, so it can be checked in the booklet.
   kind 'heft'   = stands like this in the booklet (text, figure, box or task)
   kind 'app'    = exercise or summary made by the app from booklet content (pages given)
   kind 'zusatz' = extra knowledge, not in the booklet (with a link to check it) */
import { icon as I } from './icons.js';
import { esc } from './util.js';

const H = (...where) => ({ kind: 'heft', where });
const A = (...where) => ({ kind: 'app', where });
const Z = (what, url, ...where) => ({ kind: 'zusatz', what, url, where });
const note = (s, n) => ({ ...s, note: n });

/* ---- the places in the booklet (checked against the photos of all 11 pages) ---- */
const T2 = 'Seite 2 · Einleitungstext';
const F2 = 'Seite 2 · Abbildung „1. Übersicht Verdauungsorgane“';
const T3 = 'Seite 3 · Text „Die Mundhöhle“';
const A3 = 'Seite 3 · Aufgabe A';
const A3d = 'Seite 3 · Aufgabe A, Abbildung „Dauergebiss“';
const A3m = 'Seite 3 · Aufgabe A, Abbildung „Milchgebiss“';
const A3f = 'Seite 3 · Aufgabe A, Funktionen der Zähne';
const B4 = 'Seite 4 · Aufgabe B (Zahnformeln)';
const W4 = 'Seite 4 · Kasten „Wusstest du?“ (Speichel)';
const T4 = 'Seite 4 · Text „C. Speiseröhre“';
const N4 = 'Seite 4 · Kasten „Nachweis der Peristaltik“';
const T5 = 'Seite 5 · Text „D. Magen“';
const F5a = 'Seite 5 · Abbildung 13 a (Der Magen)';
const F5b = 'Seite 5 · Abbildung 13 b (Magenschleimhaut im Detail)';
const A5a = 'Seite 5 · Aufgabe a';
const A5b = 'Seite 5 · Aufgabe b';
const A6c = 'Seite 6 · Aufgabe c';
const W6 = 'Seite 6 · Kasten „Wusstest du?“ (Verweildauer, Kneten, Magenknurren)';
const T6 = 'Seite 6 · Text „E. Leber“';
const F6 = 'Seite 6 · Abbildung 1 mit Aufgabe „Beschrifte die Abbildung 1“';
const T7 = 'Seite 7 · Text „F. Gallenblase und Bauchspeicheldrüse“';
const F7 = 'Seite 7 · Abbildung Gallenblase und Bauchspeicheldrüse';
const T7d = 'Seite 7 · Text „G. Dünndarm“';
const T8 = 'Seite 8 · Infotext „Wie gelangt die Nahrung … in alle Körperregionen?“';
const F8a = 'Seite 8 · Abbildung 1 „Vorgänge bei der Verdauung“';
const F8b = 'Seite 8 · Abbildung 2 „Bau des Dünndarms“';
const A8a = 'Seite 8 · Aufgabe a (Beschrifte Abbildung 2)';
const A9b = 'Seite 9 · Aufgabe b (zu Abbildung 1 auf Seite 8)';
const A9c = 'Seite 9 · Aufgabe c (zu Abbildung 2 auf Seite 8)';
const T9 = 'Seite 9 · Text „Exkurs: Zöliakie“';
const F9 = 'Seite 9 · Abbildung 1 „Bau des Dünndarms“ (im Exkurs Zöliakie)';
const F10 = 'Seite 10 · Abbildung 2 (Dünndarm gesund und bei Zöliakie)';
const A10a = 'Seite 10 · Aufgabe a';
const A10b = 'Seite 10 · Aufgabe b';
const K10 = 'Seite 10 · Kasten „Achtung! Intoleranz ≠ Allergie“';
const I10 = 'Seite 10 · Informiere dich a';
const T11 = 'Seite 11 · Text „H. Dickdarm“';
const W11a = 'Seite 11 · Kasten „Wusstest du?“ (Wurmfortsatz)';
const W11b = 'Seite 11 · Kasten „Wusstest du?“ (Gase)';
const A11a = 'Seite 11 · Aufgabe a';
const A11b = 'Seite 11 · Aufgabe b';
const AB1 = 'Arbeitsblatt Neuron · Aufgabe 1 (Pfeil für die Reizleitung)';
const AB2 = 'Arbeitsblatt Neuron · Aufgabe 2 (Beschriften, Nummern 1–9)';
const ABT = (n) => `Arbeitsblatt Neuron · Aufgabe 2, Tabelle Nr. ${n}`;
const ABTall = 'Arbeitsblatt Neuron · Aufgabe 2, Tabelle (Bezeichnung und Funktion)';

const W = 'https://de.wikipedia.org/wiki/';
const SSP = [W + 'Schl%C3%BCssel-Schloss-Prinzip'];

/* ---- every exercise (id = chapter-index, as in content.js) ---- */
export const Q_SRC = {
  'ueberblick-0': H(F2), 'ueberblick-1': H(F2), 'ueberblick-2': H(F2, T2), 'ueberblick-3': H(T2), 'ueberblick-4': H(T2),
  'ueberblick-5': H(F2, T3, T7), 'ueberblick-6': H(T2), 'ueberblick-7': H(T2, T11), 'ueberblick-8': H(T2, T11), 'ueberblick-9': H(T2, T3, T5, T7),
  'ueberblick-10': A(T2), 'ueberblick-11': H(T2), 'ueberblick-12': H(T2), 'ueberblick-13': H(T2), 'ueberblick-14': H(T2), 'ueberblick-15': A(T3, T5, T7, F8a),

  'mund-0': H(A3d), 'mund-1': H(T3), 'mund-2': H(T3), 'mund-3': H(T3), 'mund-4': H(T3), 'mund-5': H(T3), 'mund-6': H(A3f),
  'mund-7': H('Seite 4 · Aufgabe B, lateinische Namen'), 'mund-8': H(B4), 'mund-9': H(B4), 'mund-10': H(A3m, B4), 'mund-11': H(A3d + ', Nr. 5'),
  'mund-12': H(T4), 'mund-13': H(T4), 'mund-14': H(T4), 'mund-15': H(W4), 'mund-16': H(N4), 'mund-17': H(B4), 'mund-18': H(B4),
  'mund-19': H(A3m), 'mund-20': H(A3m, B4), 'mund-21': H(T3), 'mund-22': note(H(A3f), 'Steht als deine Notiz im Heft.'), 'mund-23': note(H(A3f), 'Steht als deine Notiz im Heft.'),
  'mund-24': H(T4), 'mund-25': H(T4), 'mund-26': H(T4), 'mund-27': H(W4), 'mund-28': H(A3f),

  'magen-0': H(F5a), 'magen-1': H(F5b), 'magen-2': H(T5), 'magen-3': H(T5), 'magen-4': H(T5), 'magen-5': H(T5), 'magen-6': H(T5),
  'magen-7': H(T5), 'magen-8': H(T5), 'magen-9': H(T5), 'magen-10': H(T5), 'magen-11': H(T5), 'magen-12': H(T5), 'magen-13': H(T5),
  'magen-14': H(A5a), 'magen-15': H(T5), 'magen-16': H(T5, F5a), 'magen-17': note(A(T5), 'Die Begründung (Schutz vor Selbstverdauung) erklärt die App.'),
  'magen-18': H(A6c), 'magen-19': H(T5), 'magen-20': H(A5b), 'magen-21': H(W6), 'magen-22': H(W6), 'magen-23': H(W6), 'magen-24': H(T5),
  'magen-25': note(A(W6), 'Die Begründung (Fett bleibt länger im Magen) erklärt die App.'), 'magen-26': H(A5b),

  'leber-0': H(F6), 'leber-1': H(T6), 'leber-2': H(T6, T7), 'leber-3': H(T7), 'leber-4': H(T7), 'leber-5': H(T7), 'leber-6': H(T7),
  'leber-7': H(T7, F7), 'leber-8': H(T7), 'leber-9': H(T7), 'leber-10': H(T8, F6), 'leber-11': H(T6), 'leber-12': H(T7), 'leber-13': H(T7, T7d),
  'leber-14': H(T7), 'leber-15': H(T6), 'leber-16': H(T7), 'leber-17': H(T7, F7), 'leber-18': H(T6), 'leber-19': H(T6), 'leber-20': H(T7),
  'leber-21': H(T6), 'leber-22': H(T7), 'leber-23': H(T6), 'leber-24': H(F6),

  'duenndarm-0': H(F9), 'duenndarm-1': H(A8a, F9), 'duenndarm-2': H(T7d), 'duenndarm-3': H(T7d), 'duenndarm-4': H(T8), 'duenndarm-5': H(T8),
  'duenndarm-6': H(T8), 'duenndarm-7': H(T8, F8a), 'duenndarm-8': H(T8), 'duenndarm-9': H(T8, A10a), 'duenndarm-10': H(T8, A10a), 'duenndarm-11': H(T8),
  'duenndarm-12': H(A9c), 'duenndarm-13': H(T7d), 'duenndarm-14': H(T8), 'duenndarm-15': H(T8, F9), 'duenndarm-16': H(T8),
  'duenndarm-17': note(H(A9c), '„ca. 1 Tennisplatz“ steht als deine Notiz im Heft.'), 'duenndarm-18': H(T8, F9), 'duenndarm-19': H(F8b, A8a),
  'duenndarm-20': H(A10a), 'duenndarm-21': H(A8a),

  'abbau-0': H(F8a + ', Legende'), 'abbau-1': H(F8a, T7), 'abbau-2': H(F8a, T7), 'abbau-3': H(F8a, T7), 'abbau-4': H(F8a, T2), 'abbau-5': H(F8a, T3),
  'abbau-6': H(F8a), 'abbau-7': H(T3, T5, T7), 'abbau-8': H(T8, F8a), 'abbau-9': H(T7), 'abbau-10': H(T7), 'abbau-11': H(T7), 'abbau-12': H(T7, F8a),
  'abbau-13': H(A9b), 'abbau-14': H(F8a + ', Legende'), 'abbau-15': H(F8a + ', Legende', T7), 'abbau-16': H(T7), 'abbau-17': H(T3, T5, T7),
  'abbau-18': Z('Energiegehalt der Nährstoffe (Brennwert)', [W + 'Physiologischer_Brennwert']),
  'abbau-19': H(F8a), 'abbau-20': H(F8a, T8), 'abbau-21': H(F8a, T8), 'abbau-22': H(T8, F8a), 'abbau-23': note(A(F8a, A9b), 'Ähnlich wie Aufgabe b auf Seite 9.'),

  'zoeliakie-0': H(T9), 'zoeliakie-1': H(T9, F10), 'zoeliakie-2': H(T9), 'zoeliakie-3': H(K10), 'zoeliakie-4': H(I10), 'zoeliakie-5': H(K10, I10),
  'zoeliakie-6': note(H(I10), 'Korrektur zu deiner Antwort im Heft.'), 'zoeliakie-7': H(K10), 'zoeliakie-8': H(A10b, F10), 'zoeliakie-9': H(T9),
  'zoeliakie-10': H(K10), 'zoeliakie-11': H(K10), 'zoeliakie-12': note(H(I10), 'Im Heft steht die Abkürzung DAO. Die Langform Diaminoxidase ist Zusatzwissen.'),
  'zoeliakie-13': Z('Laktose = Milchzucker', [W + 'Lactose'], K10), 'zoeliakie-14': H(I10),

  'dickdarm-0': H(T11), 'dickdarm-1': H(T11), 'dickdarm-2': H(T11), 'dickdarm-3': H(W11a, A11a), 'dickdarm-4': H(A11a), 'dickdarm-5': H(T11),
  'dickdarm-6': H(T11), 'dickdarm-7': H(T11), 'dickdarm-8': H(T11, T7d), 'dickdarm-9': H(T11), 'dickdarm-10': H(A11b), 'dickdarm-11': H(T11),
  'dickdarm-12': H(T11), 'dickdarm-13': H(T11), 'dickdarm-14': H(T11), 'dickdarm-15': H(T11), 'dickdarm-16': H(T11), 'dickdarm-17': H(W11b),
  'dickdarm-18': H(W11b), 'dickdarm-19': H(A11a),

  'enzyme-0': note(A(T3, T5, T7, I10), 'Wo Maltase, Peptidasen und Laktase gebildet werden, ist Zusatzwissen.'), 'enzyme-1': H(T5), 'enzyme-2': H(T7),
  'enzyme-3': H(T7, F7), 'enzyme-4': H(T7, F7), 'enzyme-5': H(T7), 'enzyme-6': H(T3, T7), 'enzyme-7': H(I10), 'enzyme-8': H(T7),
  'enzyme-9': note(A(T3, T5, T7), 'Wo die Maltase gebildet wird (Dünndarmschleimhaut), ist Zusatzwissen.'), 'enzyme-10': H(T3, T5, T7, I10), 'enzyme-11': H(T5, T7),
  'enzyme-12': Z('Enzyme werden nicht verbraucht', [W + 'Enzym']), 'enzyme-13': Z('Schlüssel-Schloss-Prinzip', SSP), 'enzyme-14': H(T3, T7),
  'enzyme-15': H(T6, T7), 'enzyme-16': H(T7), 'enzyme-17': H(T7), 'enzyme-18': Z('Schlüssel-Schloss-Prinzip', SSP), 'enzyme-19': Z('Schlüssel-Schloss-Prinzip', SSP),
  'enzyme-20': H(T7), 'enzyme-21': H(T5), 'enzyme-22': H(T3), 'enzyme-23': H(T3, T7), 'enzyme-24': H(T5, T7),

  'neuron-0': H(AB2), 'neuron-1': H(AB2 + ', Ausschnitt Zellkörper'), 'neuron-2': H(AB2 + ', Ausschnitt Axon'), 'neuron-3': H(AB1, ABTall),
  'neuron-4': note(A(ABTall), 'Das Bild vom Ladekabel ist eine Merkhilfe der App.'), 'neuron-5': H(ABT(7)), 'neuron-6': H(ABT(4)),
  'neuron-7': note(H(ABT(3)), 'Im Arbeitsblatt steht „Gliazelle“. Schwann’sche Zelle ist der genauere Name.'), 'neuron-8': H(ABT(5)), 'neuron-9': H(ABT(6)),
  'neuron-10': H(ABT(2)), 'neuron-11': H(ABT(8)), 'neuron-12': Z('Markscheide als zweiter Name der Myelinscheide', [W + 'Myelinscheide'], ABT(3)),
  'neuron-13': H(AB1), 'neuron-14': Z('Sprunghafte (saltatorische) Erregungsleitung', [W + 'Saltatorische_Erregungsleitung'], ABT(5)), 'neuron-15': H(AB1),
  'neuron-16': H(ABTall), 'neuron-17': H(ABTall), 'neuron-18': H(ABTall), 'neuron-19': H(ABT(3)), 'neuron-20': H(ABT(1)), 'neuron-21': H(ABT(6)),
  'neuron-22': H(ABT(8)), 'neuron-23': note(A(ABT(3), ABT(5)), 'Warum es schneller geht, ist Zusatzwissen.'), 'neuron-24': A(AB1, ABTall), 'neuron-25': H(ABTall),
};

/* ---- every figure (diagram id in diagrams.js) ---- */
export const DIAGRAM_SRC = {
  organe: { ...note(H(F2), 'Im Heft haben die Organe die Nummern 1–13 und a–e. Die App nummeriert in der Reihenfolge, in der die Nahrung wandert.'), short: 'S. 2' },
  zaehne: { ...note(H(A3d), 'Nummern 1–5 wie im Heft.'), short: 'S. 3' },
  milchgebiss: { ...note(H(A3m), 'Nummern 1, 2 und 4 wie im Heft.'), short: 'S. 3' },
  magen: { ...H(F5a), short: 'S. 5, Abb. 13 a' },
  schleimhaut: { ...H(F5b), short: 'S. 5, Abb. 13 b' },
  leber: { ...H(F6), short: 'S. 6, Abb. 1' },
  seite8abb1: { ...H(F8a), short: 'S. 8, Abb. 1' },
  seite8abb2: { ...note(H(F8b, A8a), 'Buchstaben a–d wie im Heft.'), short: 'S. 8, Abb. 2' },
  zotte: { ...H(F9, F8b), short: 'S. 9, Abb. 1' },
  abbau: { ...note(A(F8a), 'Vereinfachte Fassung von Abbildung 1 auf Seite 8, mit denselben Teilchen wie in der Legende.'), short: 'nach S. 8, Abb. 1' },
  neuron: { ...note(H('Arbeitsblatt „Aufbau und Funktion eines Neurons“ · Abbildung zu Aufgabe 1 und 2'), 'Nummern 1–9 wie auf dem Arbeitsblatt.'), short: 'Arbeitsblatt' },
};

/* ---- every Steckbrief card (same order as CARDS in content.js) ---- */
export const CARD_SRC = {
  ueberblick: [H(T2), H(F2, T2), H(F2, T3, T7), H(F2)],
  mund: [H(T3), H(T3), H(W4), H(A3d, B4), H(A3m, B4), H(B4), H(A3f, B4), note(H(A3f, B4), 'Reißzähne: deine Notiz im Heft.'), note(H(A3f, B4), 'Höcker: deine Notiz im Heft.'), H(A3f, B4), H(A3f), H(T4), H(N4)],
  magen: [H(T5, F5a, A5a), H(T5, F5a), H(T5, F5b), H(T5, F5b, A5b), note(H(T5, A5b), 'Warum inaktiv: Erklärung der App.'), H(T5, A5b), H(T5), H(A6c), H(W6)],
  leber: [H(T6), H(T8, F6), H(T7, F7), H(T7, F7), H(T7), H(T7, T7d)],
  duenndarm: [H(T7d), H(T7), H(F9, T8), H(T8, F8b), H(T8, F9), note(H(T8, A9c, A10a), '„ca. 1 Tennisplatz“: deine Notiz im Heft.'), H(T8, F8a)],
  abbau: [H(F8a, T3, T7), H(F8a, T5, T7), note(H(F8a, T7), 'Energie pro Gramm ist Zusatzwissen.'), H(F8a, T8)],
  zoeliakie: [H(T9, F10), H(K10, I10), H(K10), H(F10, A10b)],
  dickdarm: [H(T11), H(T11, W11a, A11a), H(T11, W11b, A11b), H(T11), H(W11b)],
  enzyme: [note(A(T2), 'Schlüssel-Schloss-Prinzip und „nicht verbraucht“ sind Zusatzwissen.'), H(T3, T7, F7), H(T5), H(T7, F7), H(T7, F7),
    note(H(T7), 'Bildungsort (Dünndarmschleimhaut) ist Zusatzwissen.'), note(H(T7), 'Bildungsort (Dünndarmschleimhaut) ist Zusatzwissen.'),
    note(H(K10, I10), 'Bildungsort und Spaltprodukte sind Zusatzwissen.'), H(T5, T7), H(T3, T5, T7)],
  neuron: [note(A(AB1, ABTall), 'Der Sprung von Schnürring zu Schnürring ist Zusatzwissen.'), H(ABT(1)), H(ABT(2)), note(H(ABT(3)), 'Im Arbeitsblatt: Gliazelle.'), H(ABT(4)),
    note(H(ABT(5)), 'Der Sprung von Lücke zu Lücke ist Zusatzwissen.'), H(ABT(6)), H(ABT(7)), H(ABT(8)), H(ABT(9))],
};

/* ---- every Lernkarte section (chapter id -> heading text) ---- */
export const LEARN_SRC = {
  ueberblick: { 'Verdauung in einem Satz': H(T2), 'Der Weg der Nahrung': H(F2), 'Helfer, durch die keine Nahrung wandert': H(F2, T3, T7), 'Wo passiert was?': H(T2) },
  mund: { 'Die Mundhöhle': H(T3), 'Die Zähne': H(A3), 'Das Milchgebiss': H(A3m, B4), 'Zahnformel': H(B4), 'Die Speiseröhre': H(T4, N4) },
  magen: { 'Bau und Aufgaben': H(T5, F5a, A5a), 'Der Magensaft': H(T5, F5b, A5b), 'Sodbrennen': H(A6c, W6) },
  leber: { 'Die Leber': H(T6, F6), 'Gallenblase und Galle': H(T7, F7), 'Die Bauchspeicheldrüse (Pankreas)': H(T7, F7) },
  duenndarm: { 'Der Dünndarm': H(T7d), 'Hier wird fertig verdaut': H(T7), 'Aufnahme ins Blut: die Darmzotten': H(T8, F8b, A8a, A9c, F9) },
  abbau: { 'Die drei Nährstoffe und ihre Bausteine': H(F8a, T7), 'So liest du Abbildung 1': H(F8a, A9b), 'Dasselbe als Kette': H(F8a, T7), 'So sehen die Teilchen im Heft aus': H(F8a + ', Legende'), 'Wozu brauchen wir die Nährstoffe?': Z('Wofür der Körper die Bausteine braucht', [W + 'N%C3%A4hrstoff']) },
  zoeliakie: { 'Zöliakie': H(T9, F10, A10b), 'Intoleranz ≠ Allergie': H(K10, I10) },
  dickdarm: { 'Bau': H(T11, W11a), 'Aufgaben': H(T11, A11a), 'Die Darmflora (Mikrobiom)': H(T11, W11b, A11b) },
  enzyme: { 'Was sind Enzyme?': note(A(T2), 'Schlüssel-Schloss-Prinzip, Temperatur und pH-Wert sind Zusatzwissen.'), 'Die große Enzym-Tabelle': note(A(T3, T5, T7, F7, I10), 'Wo Maltase, Peptidasen und Laktase gebildet werden, ist Zusatzwissen.') },
  neuron: { 'Aufbau einer Nervenzelle': H(AB1, AB2, ABTall) },
};

/* ---- display ---- */
const LABEL = { heft: 'Quelle im Heft', app: 'Übung der App · Stoff aus dem Heft', zusatz: 'Zusatzwissen · nicht im Heft' };
const ICON = { heft: 'book', app: 'sparkle', zusatz: 'info' };

/* Full source block (questions, figures, cards, sections). */
export function srcHTML(s, { compact = false } = {}) {
  if (!s) return '';
  const where = (s.where || []).map(esc);
  let body = '';
  if (s.kind === 'zusatz') {
    body = `<b>${esc(s.what)}</b>` + (where.length ? ` · passt zu ${where.join('; ')}` : '') +
      (s.url && s.url[0] ? ` · <a href="${s.url[0]}" target="_blank" rel="noopener">nachlesen</a>` : '');
  } else body = where.join('<br>');
  if (s.note && !compact) body += `<span class="srcnote">${esc(s.note)}</span>`;
  return `<div class="src ${s.kind}"><span class="srclbl">${I(ICON[s.kind])}${LABEL[s.kind]}</span><span class="srcwhere">${body}</span></div>`;
}

/* One short line, e.g. for figure chips. */
export function srcShort(s) {
  if (!s) return '';
  if (s.short) return s.short;
  const w = (s.where || [])[0] || '';
  return w.split(' · ')[0];
}
