/* All learning content. Based on the 11 worksheet pages (Verdauung + Nervenzelle), simplified and corrected.
   ⚠️ boxes mark places where the worksheet or a handwritten answer was wrong or incomplete. */

/* ---------- question builders ---------- */
const F = (q, a, alts = [], wrong = [], ex = '') => ({ t: 'fact', q, a, alts: [a, ...alts], wrong, ex });
const TF = (s, ok, fix = '', ex = '') => ({ t: 'tf', q: s, ok, fix, ex });
const MC = (q, a, wrong, ex = '') => ({ t: 'mc', q, a, wrong, ex });
const MULTI = (q, right, wrong, ex = '') => ({ t: 'multi', q, right, wrong, ex });
const ORDER = (q, items, ex = '') => ({ t: 'order', q, items, ex });
const MATCH = (q, pairs, ex = '') => ({ t: 'match', q, pairs, ex });
const SORT = (q, buckets, items, ex = '') => ({ t: 'sort', q, buckets, items, ex });
const CLOZE = (q, text, extra = [], ex = '') => ({ t: 'cloze', q, text, extra, ex });
const LABEL = (d, parts, q) => ({ t: 'label', d, parts, q: q || 'Beschrifte die Abbildung.' });
const EXPLAIN = (q, points, model) => ({ t: 'explain', q, points, model });

/* ---------- the chapters ---------- */
export const CHAPTERS = [
  /* ================================================================ */
  {
    id: 'ueberblick', title: 'Überblick: Was ist Verdauung?', short: 'Überblick', color: '#ff7a59', icon: '🗺️', cat: 'mo', page: 'Seite 2',
    story: 'Kater Mo hat seine Jause in Rekordzeit verschlungen und will wissen, wohin sein Futter eigentlich wandert. Erklär es ihm!',
    learn: `
<h2>Verdauung in einem Satz</h2>
<p><span class="k">Verdauung</span> = große Nährstoff-Moleküle (Kohlenhydrate, Fette, Eiweiße) werden <b>mechanisch</b> (zerkleinern, kneten) und <b>chemisch</b> (mit Enzymen) in ihre kleinen <b>Grundbausteine</b> zerlegt.</p>
<ul>
<li><b>Mechanisch:</b> Zähne zerkleinern, Zunge mischt, Magen knetet.</li>
<li><b>Chemisch:</b> <b>Verdauungsenzyme</b> sind wie winzige Scheren. Beispiel: Proteine → Aminosäuren.</li>
</ul>
<div class="figure" data-diagram="organe"></div>
<h3>Der Weg der Nahrung</h3>
<p>Mundhöhle → Speiseröhre → Magen → Dünndarm (beginnt mit dem Zwölffingerdarm) → Dickdarm (mit Blinddarm) → Mastdarm → After</p>
<div class="box merk"><span class="t">💡 Merksatz (Weg der Nahrung)</span><b>M</b>eine <b>S</b>üße <b>M</b>ieze <b>D</b>öst <b>D</b>en <b>M</b>ittag <b>A</b>b.<br><span class="small">Mund · Speiseröhre · Magen · Dünndarm · Dickdarm · Mastdarm · After</span></div>
<h3>Helfer, durch die keine Nahrung wandert</h3>
<p>Diese <b>Drüsen</b> liefern Säfte in den Verdauungskanal: <b>Speicheldrüsen</b>, <b>Leber</b> (mit <b>Gallenblase</b>) und <b>Bauchspeicheldrüse</b>.</p>
<h3>Wo passiert was?</h3>
<ul>
<li><b>Mundhöhle, Magen, Dünndarm:</b> hier arbeiten Enzyme (chemische Verdauung).</li>
<li><b>Dünndarm:</b> fertig verdauen und Bausteine ins Blut aufnehmen.</li>
<li><b>Dickdarm:</b> vor allem <b>Wasser</b> zurückholen, dann wird der Rest als Kot ausgeschieden.</li>
</ul>
<div class="box fix"><span class="t">⚠️ Bitte prüfen: Seite 2, Nummer 5 und 6</span>Auf deinem Blatt steht bei 5 „Dünndarm“ und bei 6 „Dickdarm“. Die 5 sitzt aber auf dem dicken Darm mit den Ausbuchtungen oben quer (das ist der <b>Dickdarm</b>), die 6 mitten in den dünnen Schlingen (das ist der <b>Dünndarm</b>). Vergleich das mit der Lösung im Unterricht.<br><b>So erkennst du es:</b> Der Dickdarm liegt wie ein <b>Bilderrahmen</b> um die Dünndarm-Schlingen.</div>
`,
    video: [
      { cat: 'doc', say: 'Hallo! Ich bin Doktor Schnurrhaar. Heute verfolgen wir, was mit deinem Essen passiert.' },
      { d: 'organe', hl: [], say: 'Verdauung heißt: Große Nährstoffe wie Kohlenhydrate, Fette und Eiweiße werden in winzige Bausteine zerlegt.' },
      { d: 'organe', hl: ['zaehne', 'zunge'], say: 'Das beginnt mechanisch: Zähne zerkleinern, die Zunge mischt alles mit Speichel.' },
      { d: 'organe', hl: ['ohrspeicheldruese', 'unterkieferspeicheldruese', 'unterzungenspeicheldruese'], say: 'Die drei großen Speicheldrüsen liefern Speichel mit dem ersten Enzym.' },
      { d: 'organe', hl: ['speiseroehre'], say: 'Die Speiseröhre transportiert den Bissen zum Magen. Hier wird nichts verdaut.' },
      { d: 'organe', hl: ['magen'], say: 'Im Magen wird geknetet und die Eiweißverdauung beginnt.' },
      { d: 'organe', hl: ['leber', 'gallenblase', 'bauchspeicheldruese'], say: 'Leber, Gallenblase und Bauchspeicheldrüse sind Helfer. Durch sie wandert keine Nahrung, aber ihre Säfte fließen in den Darm.' },
      { d: 'organe', hl: ['zwoelffingerdarm', 'duenndarm'], say: 'Im Dünndarm wird fertig verdaut. Die Bausteine gehen von hier ins Blut.' },
      { d: 'organe', hl: ['dickdarm', 'blinddarm'], say: 'Der Dickdarm liegt wie ein Bilderrahmen um den Dünndarm. Er holt vor allem Wasser zurück.' },
      { d: 'organe', hl: ['mastdarm', 'after'], say: 'Zum Schluss sammelt der Mastdarm den Kot, und über den After wird er ausgeschieden.' },
      { big: 'Meine Süße Mieze Döst Den Mittag Ab', say: 'Merksatz: Meine Süße Mieze Döst Den Mittag Ab. Mund, Speiseröhre, Magen, Dünndarm, Dickdarm, Mastdarm, After.' },
    ],
    yt: [
      { title: 'Die Verdauung des Menschen', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=gcP0AiMDjes' },
      { title: 'Verdauungsorgane – Funktion, Weg der Nahrung', ch: 'Studyflix', url: 'https://studyflix.de/biologie/verdauungsorgane-3106/video' },
      { title: 'dm erklärt: Das Verdauungssystem', ch: 'dm', url: 'https://www.youtube.com/watch?v=ain1_VtDa4E' },
    ],
    q: [
      LABEL('organe', ['zaehne', 'zunge', 'ohrspeicheldruese', 'unterzungenspeicheldruese', 'unterkieferspeicheldruese', 'speiseroehre'], 'Beschrifte Kopf und Hals.'),
      LABEL('organe', ['magen', 'leber', 'gallenblase', 'bauchspeicheldruese', 'zwoelffingerdarm', 'duenndarm', 'dickdarm', 'blinddarm', 'mastdarm', 'after'], 'Beschrifte die Verdauungsorgane im Bauch.'),
      ORDER('Bring den Weg der Nahrung in die richtige Reihenfolge.', ['Mundhöhle', 'Speiseröhre', 'Magen', 'Dünndarm', 'Dickdarm', 'Mastdarm', 'After'], 'Merksatz: Meine Süße Mieze Döst Den Mittag Ab.'),
      F('Wie nennt man die Zerlegung großer Nährstoff-Moleküle in ihre Grundbausteine?', 'Verdauung', [], ['Atmung', 'Resorption', 'Peristaltik'], 'Verdauung = mechanische und chemische Zerlegung der Nährstoffe.'),
      F('In welche Grundbausteine werden Proteine (Eiweiße) zerlegt?', 'Aminosäuren', ['Aminosäure'], ['Glucose', 'Fettsäuren', 'Maltose'], 'Proteine → Aminosäuren.'),
      MULTI('Durch welche Organe wandert KEINE Nahrung, obwohl sie bei der Verdauung helfen?', ['Leber', 'Bauchspeicheldrüse', 'Gallenblase', 'Speicheldrüsen'], ['Magen', 'Dünndarm', 'Speiseröhre'], 'Das sind Drüsen bzw. ein Speicher. Sie geben Säfte in den Verdauungskanal ab.'),
      MULTI('In welchen Abschnitten finden enzymatische Abbauvorgänge statt?', ['Mundhöhle', 'Magen', 'Dünndarm'], ['Speiseröhre', 'Dickdarm', 'Mastdarm'], 'In den ersten drei Abschnitten von der Mundhöhle bis zum Dünndarm.'),
      TF('Im Dickdarm werden die meisten Nährstoffe verdaut.', false, 'Im Dickdarm wird vor allem Wasser zurückgeholt. Verdaut und aufgenommen wird im Dünndarm.'),
      F('Was wird im Dickdarm vor allem aufgenommen (resorbiert)?', 'Wasser', ['Wasser und Elektrolyte', 'Wasser und Salze'], ['Glucose', 'Aminosäuren', 'Fette'], 'Dadurch wird der Darminhalt eingedickt.'),
      SORT('Mechanische oder chemische Verdauung?', ['mechanisch', 'chemisch'], [['Zähne zerkleinern', 0], ['Magen knetet den Brei', 0], ['Zunge mischt mit Speichel', 0], ['Amylase spaltet Stärke', 1], ['Pepsin spaltet Proteine', 1], ['Lipase spaltet Fette', 1]], 'Chemisch = mit Enzymen. Mechanisch = zerkleinern, kneten, mischen.'),
      EXPLAIN('Erkläre den Unterschied zwischen mechanischer und chemischer Verdauung (mit je einem Beispiel).', ['Mechanisch: Nahrung wird zerkleinert/geknetet (z. B. Zähne, Magenmuskeln)', 'Chemisch: Enzyme spalten große Moleküle in Bausteine', 'Beispiel chemisch: Amylase spaltet Stärke zu Maltose (oder Pepsin, Lipase …)'], 'Bei der mechanischen Verdauung wird die Nahrung nur zerkleinert und gemischt, z. B. durch die Zähne oder die Magenmuskeln. Bei der chemischen Verdauung spalten Enzyme die großen Nährstoff-Moleküle in ihre Grundbausteine, z. B. spaltet die Amylase Stärke zu Maltose.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'mund', title: 'Mundhöhle, Zähne & Speiseröhre', short: 'Mund & Zähne', color: '#e2557f', icon: '🦷', cat: 'luna', page: 'Seiten 3–4',
    story: 'Luna knabbert nur noch auf einer Seite. Zeig ihr, was Zähne, Speichel und Speiseröhre leisten!',
    learn: `
<h2>Die Mundhöhle</h2>
<ul>
<li>Die Verdauung beginnt im Mund: Die <b>Zähne</b> zerkleinern die Nahrung.</li>
<li><b>Speichel</b> macht den Bissen gleitfähig und enthält schon ein Enzym. Pro Tag bilden wir <b>1–1,5 Liter</b>.</li>
<li>Speichel kommt aus vielen kleinen Drüsen der Mundschleimhaut und aus <b>3 großen Speicheldrüsen</b>: <b>Ohrspeicheldrüse</b>, <b>Unterkieferspeicheldrüse</b> und <b>Unterzungenspeicheldrüse</b>.</li>
<li>Das Enzym <b class="k">Amylase</b> spaltet einen Teil der <b>Stärke</b> schon im Mund zu <b>Maltose</b> (Malzzucker = 2 Glucose-Moleküle).</li>
</ul>
<div class="box tip"><span class="t">🍞 Ausprobieren</span>Kau ein Stück Brot ganz lange: Es schmeckt plötzlich süß. Das ist die Maltose, die die Amylase aus Stärke macht.</div>
<h2>Die Zähne</h2>
<div class="figure" data-diagram="zaehne"></div>
<div class="tablewrap"><table>
<tr><th>Nr.</th><th>Name</th><th>Latein</th><th>Aufgabe</th></tr>
<tr><td>1</td><td><b>Schneidezähne</b></td><td>Incisivi (I)</td><td>abbeißen, abschneiden</td></tr>
<tr><td>2</td><td><b>Eckzähne</b></td><td>Canini (C)</td><td>festhalten, abreißen. Bei Raubtieren sind das die Fangzähne zum Reißen der Beute.</td></tr>
<tr><td>3</td><td><b>Backenzähne</b></td><td>Prämolaren (P)</td><td>Kaufläche mit 2 Höckern: zerkleinern und zermahlen</td></tr>
<tr><td>4</td><td><b>Mahlzähne</b></td><td>Molaren (M)</td><td>Kaufläche mit mehreren Höckern: zermahlen</td></tr>
<tr><td>5</td><td><b>Weisheitszähne</b></td><td>3. Molaren</td><td>die hintersten Mahlzähne, ein Überbleibsel aus der Entwicklung des Menschen</td></tr>
</table></div>
<div class="box fix"><span class="t">⚠️ Korrektur zu Seite 3</span>Bei <b>3</b> und <b>4</b> sind die Namen vertauscht. Richtig ist:<br><b>3 = Backenzähne (Prämolaren)</b>, <b>4 = Mahlzähne (Molaren)</b>. Deine Beschreibungen der Funktionen daneben stimmen.</div>
<h3>Zahnformel</h3>
<p>Man zählt <b>ein Viertel</b> des Gebisses, von der Mitte nach hinten: I – C – P – M.</p>
<ul>
<li><b>Dauergebiss:</b> 2 – 1 – 2 – 3 pro Viertel → 8 × 4 = <b>32 Zähne</b></li>
<li><b>Milchgebiss:</b> 2 – 1 – 2 (I – C – M, <b>keine Prämolaren</b>) → 5 × 4 = <b>20 Zähne</b></li>
</ul>
<div class="box merk"><span class="t">💡 Merksatz</span>Erwachsene: <b>2-1-2-3 → 32</b>. Kinder: <b>2-1-2 → 20</b>.</div>
<div class="box tip"><span class="t">🦠 Wusstest du?</span>Ein Tropfen Speichel enthält ca. 10 Millionen Mikroorganismen, vor allem <b>Streptokokken</b> (kugelförmige Bakterien). Sie spielen bei der Entstehung von <b>Karies</b> eine große Rolle.</div>
<h2>Die Speiseröhre</h2>
<ul>
<li>Mehr als 20 Muskeln und der <b>Kehldeckel</b> sorgen beim Schlucken dafür, dass der Bissen in die Speiseröhre kommt und nicht in die <b>Luftröhre</b>.</li>
<li>In der Speiseröhre wird <b>nichts verdaut</b>.</li>
<li>Transport durch die <b class="k">Peristaltik</b>: eine unwillkürliche, wellenförmige Muskelbewegung.</li>
<li>Am Ende sitzt ein <b>Schließmuskel</b>. Er wirkt wie ein Ventil: Der Speisebrei kommt in den Magen, aber nicht zurück.</li>
</ul>
<div class="box tip"><span class="t">🤸 Kopfstand-Versuch</span>Man kann sogar im Kopfstand Wasser schlucken. <b>Begründung:</b> Die Peristaltik schiebt die Nahrung aktiv weiter, die Schwerkraft braucht es dafür nicht.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Katzen haben 30 Zähne (Kätzchen 26 Milchzähne). In ihrem Speichel gibt es praktisch keine Amylase, denn als Fleischfresser fressen sie kaum Stärke.</div>
`,
    video: [
      { cat: 'doc', say: 'Jetzt schauen wir in den Mund, denn hier beginnt die Verdauung.' },
      { d: 'organe', hl: ['zaehne'], say: 'Die Zähne zerkleinern die Nahrung. Das ist mechanische Verdauung.' },
      { d: 'organe', hl: ['ohrspeicheldruese', 'unterkieferspeicheldruese', 'unterzungenspeicheldruese'], say: 'Drei große Speicheldrüsen: Ohrspeicheldrüse, Unterkieferspeicheldrüse und Unterzungenspeicheldrüse. Zusammen bilden sie ein bis eineinhalb Liter Speichel am Tag.' },
      { big: 'Stärke ➜ Amylase ➜ Maltose', say: 'Im Speichel steckt das Enzym Amylase. Es spaltet Stärke zu Maltose, dem Malzzucker aus zwei Glucose-Teilchen. Deshalb schmeckt lange gekautes Brot süß.' },
      { d: 'zaehne', hl: ['schneidezaehne'], say: 'Vorne: die Schneidezähne zum Abbeißen.' },
      { d: 'zaehne', hl: ['eckzaehne'], say: 'Daneben die Eckzähne zum Festhalten und Abreißen. Bei Katzen sind das die langen Fangzähne.' },
      { d: 'zaehne', hl: ['backenzaehne'], say: 'Dann zwei Backenzähne, die Prämolaren, mit zwei Höckern.' },
      { d: 'zaehne', hl: ['mahlzaehne', 'weisheitszaehne'], say: 'Hinten die Mahlzähne, die Molaren, zum Zermahlen. Der letzte ist der Weisheitszahn.' },
      { big: '2-1-2-3 = 32\n2-1-2 = 20', say: 'Zahnformel: Erwachsene haben pro Viertel zwei, eins, zwei, drei, also zweiunddreißig Zähne. Das Milchgebiss hat zwei, eins, zwei, also zwanzig Zähne, ohne Prämolaren.' },
      { d: 'organe', hl: ['speiseroehre'], say: 'Beim Schlucken verschließt der Kehldeckel die Luftröhre. In der Speiseröhre schiebt die Peristaltik den Bissen wellenförmig zum Magen. Das klappt sogar im Kopfstand!' },
    ],
    yt: [
      { title: 'Die Verdauung des Menschen', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=gcP0AiMDjes' },
      { title: 'Verdauungsorgane – Funktion, Weg der Nahrung', ch: 'Studyflix', url: 'https://studyflix.de/biologie/verdauungsorgane-3106/video' },
    ],
    q: [
      LABEL('zaehne', 'all', 'Beschrifte das Dauergebiss (1 bis 5).'),
      F('Welches Enzym ist im Mundspeichel?', 'Amylase', ['Speichelamylase', 'Speichel-Amylase', 'Ptyalin', 'alpha-Amylase'], ['Pepsin', 'Lipase', 'Trypsin'], 'Die Amylase beginnt schon im Mund mit der Stärkeverdauung.'),
      F('Welchen Nährstoff spaltet die Amylase?', 'Stärke', ['Kohlenhydrate', 'Staerke'], ['Eiweiß', 'Fett', 'Maltose'], 'Amylase spaltet Stärke (ein Kohlenhydrat).'),
      F('Was entsteht, wenn die Amylase Stärke spaltet?', 'Maltose', ['Malzzucker'], ['Glucose', 'Aminosäuren', 'Fettsäuren'], 'Maltose = Malzzucker, besteht aus 2 Glucose-Molekülen.'),
      MULTI('Welche drei großen Speicheldrüsen gibt es?', ['Ohrspeicheldrüse', 'Unterkieferspeicheldrüse', 'Unterzungenspeicheldrüse'], ['Bauchspeicheldrüse', 'Schilddrüse', 'Gallenblase'], 'Achtung Falle: Die Bauchspeicheldrüse ist keine Mund-Speicheldrüse!'),
      MC('Wie viel Speichel bilden wir pro Tag?', '1–1,5 Liter', ['0,1 Liter', '5 Liter', '10 Liter']),
      MATCH('Ordne jedem Zahn seine Aufgabe zu.', [['Schneidezähne', 'abbeißen'], ['Eckzähne', 'festhalten, abreißen'], ['Backenzähne', '2 Höcker, zerkleinern'], ['Mahlzähne', 'mehrere Höcker, zermahlen']]),
      MATCH('Latein: Was gehört zusammen?', [['Incisivi (I)', 'Schneidezähne'], ['Canini (C)', 'Eckzähne'], ['Prämolaren (P)', 'Backenzähne'], ['Molaren (M)', 'Mahlzähne']]),
      F('Wie viele Zähne hat das Dauergebiss?', '32', ['zweiunddreißig'], ['20', '28', '36'], 'Zahnformel 2-1-2-3 pro Viertel: 8 × 4 = 32.'),
      F('Wie viele Zähne hat das Milchgebiss?', '20', ['zwanzig'], ['16', '24', '32'], 'Zahnformel 2-1-2 pro Viertel: 5 × 4 = 20.'),
      TF('Das Milchgebiss hat Backenzähne (Prämolaren).', false, 'Im Milchgebiss gibt es keine Prämolaren: 2 Schneidezähne, 1 Eckzahn, 2 Mahlzähne pro Viertel.'),
      F('Welche Zähne sind die hintersten Mahlzähne?', 'Weisheitszähne', ['Weisheitszahn'], ['Eckzähne', 'Schneidezähne', 'Milchzähne'], 'Weisheitszähne = dritte Molaren.'),
      CLOZE('Ergänze den Text zur Speiseröhre.', 'Beim Schlucken verhindert der {Kehldeckel} dass der Bissen in die {Luftröhre} gelangt. Die Speiseröhre transportiert ihn durch die {Peristaltik} zum {Magen}. Am Ende sitzt ein {Schließmuskel|Schliessmuskel}.', ['Amylase', 'Dünndarm', 'Zunge']),
      TF('In der Speiseröhre wird Stärke verdaut.', false, 'In der Speiseröhre finden keine Verdauungsvorgänge statt, nur Transport.'),
      F('Wie heißt die wellenförmige Muskelbewegung, die den Speisebrei transportiert?', 'Peristaltik', ['Peristaltick'], ['Emulgieren', 'Resorption', 'Verdauung'], 'Peristaltik = unwillkürliche Speiseröhrenbewegung.'),
      MC('Welche Bakterien im Speichel spielen bei Karies eine große Rolle?', 'Streptokokken', ['Salmonellen', 'Darmbakterien', 'Hefepilze'], 'Streptokokken sind kugelförmige Bakterien.'),
      EXPLAIN('Kopfstand-Versuch: Erläutere, warum man im Kopfstand Wasser schlucken kann.', ['Die Speiseröhre transportiert durch Peristaltik', 'Peristaltik = wellenförmige Muskelbewegung, die aktiv weiterschiebt', 'Darum ist die Schwerkraft nicht nötig'], 'Ja, man kann schlucken. Die Muskeln der Speiseröhre schieben den Bissen durch die Peristaltik, eine wellenförmige Muskelbewegung, aktiv Richtung Magen. Dafür braucht man keine Schwerkraft.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'magen', title: 'Der Magen', short: 'Magen', color: '#d94f9a', icon: '🫄', cat: 'minka', page: 'Seiten 5–6',
    story: 'Minka hat Sodbrennen und ein knurrendes Bäuchlein. Finde heraus, wie ein Magen funktioniert!',
    learn: `
<h2>Bau und Aufgaben</h2>
<div class="figure" data-diagram="magen"></div>
<ul>
<li>Der Magen ist ein <b>sackartiges Organ</b>. Der Brei kommt durch den <b>Mageneingang (Magenmund)</b> mit seinem Schließmuskel hinein.</li>
<li>Im Magen wird der Brei <b>zwischengespeichert</b> (oben, Speicherraum), <b>durchgeknetet</b> (unten, ca. alle 20 Sekunden) und weiter <b>verdaut</b>.</li>
<li>Durch den <b>Magenausgang (Pförtner)</b> gibt der Magen den Brei <b>portionsweise</b> an den Dünndarm (Zwölffingerdarm) weiter.</li>
<li>Fassungsvermögen: ca. <b>1,5–2 Liter</b>.</li>
</ul>
<h2>Der Magensaft</h2>
<p>Die Magenschleimhaut bildet pro Tag ca. <b>2 Liter Magensaft</b>: <b>Salzsäure + Schleim + Enzyme</b>.</p>
<div class="figure" data-diagram="schleimhaut"></div>
<div class="tablewrap"><table>
<tr><th>Zelle</th><th>bildet</th><th>wozu?</th></tr>
<tr><td><b>Belegzellen</b></td><td><b>Salzsäure</b> (pH 2)</td><td>tötet Bakterien, lässt die Nahrung aufquellen, wandelt <b>Pepsinogen in Pepsin</b> um</td></tr>
<tr><td><b>Hauptzellen</b></td><td><b>Pepsinogen</b></td><td>inaktive Vorstufe des Enzyms Pepsin</td></tr>
<tr><td><b>Nebenzellen</b></td><td><b>Magenschleim</b></td><td>schützt die Magenwand vor Salzsäure und Selbstverdauung</td></tr>
</table></div>
<p>Das aktive <b class="k">Pepsin</b> spaltet <b>Proteine</b> in kürzere Ketten, die <b>Peptide</b>.</p>
<div class="box merk"><span class="t">💡 Eselsbrücke</span><b>Haupt</b>zellen machen die <b>Haupt</b>sache: das Enzym (Pepsinogen).<br><b>Beleg</b>zellen <b>belegen</b> alles mit Säure.<br><b>Neben</b>zellen schützen <b>neben</b>bei mit Schleim.</div>
<div class="box fix"><span class="t">⚠️ Korrektur zu Seite 5 (Aufgabe b, Belegzellen)</span>Da steht: „wandelt sie das inaktive Enzym <s>zu Pepsinogen</s> um“.<br>Richtig: Die <b>Salzsäure wandelt das inaktive Pepsinogen in das aktive Pepsin um.</b></div>
<div class="box tip"><span class="t">🤔 Warum wird Pepsin erst inaktiv gebildet?</span>Sonst würde das Enzym schon die Zellen verdauen, die es herstellen. Erst im Magen macht die Salzsäure es scharf, und der Schleim schützt die Magenwand.</div>
<h3>Sodbrennen</h3>
<p>Ein <b>brennender Schmerz hinter dem Brustbein</b>. Er entsteht, wenn saurer Magensaft (Salzsäure) in die <b>Speiseröhre</b> zurückfließt, weil der Schließmuskel des Magenmundes nicht dicht schließt.</p>
<div class="box tip"><span class="t">⏱️ Wusstest du?</span>Fisch bleibt gut 1 Stunde im Magen, Schweinebraten 5–7 Stunden, Ölsardinen bis zu 12 Stunden. Fett bleibt am längsten. Wird ein <b>leerer</b> Magen durchgeknetet, knurrt er.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Katzen schlucken beim Putzen Haare. Die kann der Magen nicht verdauen, deshalb würgen Katzen sie manchmal als Haarballen hoch.</div>
`,
    video: [
      { cat: 'doc', say: 'Willkommen im Magen, der Knetmaschine unseres Körpers!' },
      { d: 'magen', hl: ['speiseroehre', 'magenmund'], say: 'Durch den Mageneingang, den Magenmund mit seinem Schließmuskel, kommt der Brei hinein.' },
      { d: 'magen', hl: ['speicherraum'], say: 'Oben wird der Brei zwischengespeichert.' },
      { d: 'magen', hl: ['mischraum'], say: 'Unten wird er etwa alle zwanzig Sekunden kräftig durchgeknetet und gemischt.' },
      { d: 'magen', hl: ['pfoertner', 'zwoelffingerdarm'], say: 'Der Pförtner am Magenausgang lässt den Brei portionsweise in den Zwölffingerdarm.' },
      { d: 'schleimhaut', hl: ['belegzelle'], say: 'In der Magenschleimhaut gibt es drei Zelltypen. Die Belegzellen bilden Salzsäure mit pH zwei. Die tötet Bakterien und lässt die Nahrung aufquellen.' },
      { d: 'schleimhaut', hl: ['hauptzelle'], say: 'Die Hauptzellen bilden Pepsinogen, eine inaktive Vorstufe. Erst die Salzsäure macht daraus das aktive Pepsin.' },
      { big: 'Proteine ➜ Pepsin ➜ Peptide', say: 'Pepsin spaltet Proteine in kürzere Ketten, die Peptide.' },
      { d: 'schleimhaut', hl: ['nebenzelle', 'schleim'], say: 'Die Nebenzellen bilden Schleim. Er schützt die Magenwand, damit sich der Magen nicht selbst verdaut.' },
      { cat: 'sick', say: 'Und Sodbrennen? Das ist ein Brennen hinter dem Brustbein, wenn Magensäure in die Speiseröhre zurückfließt.' },
    ],
    yt: [
      { title: 'Proteinverdauung einfach erklärt', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=wpgtg30-JVs' },
      { title: 'Die Verdauung des Menschen', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=gcP0AiMDjes' },
    ],
    q: [
      LABEL('magen', 'all', 'Beschrifte den Magen.'),
      LABEL('schleimhaut', 'all', 'Beschrifte die Magenschleimhaut.'),
      MATCH('Welche Zelle bildet was?', [['Belegzellen', 'Salzsäure'], ['Hauptzellen', 'Pepsinogen'], ['Nebenzellen', 'Schleim']]),
      F('Welche Zellen bilden die Salzsäure?', 'Belegzellen', ['Belegzelle'], ['Hauptzellen', 'Nebenzellen', 'Darmzellen'], 'Eselsbrücke: Belegzellen belegen alles mit Säure.'),
      F('Welche Zellen bilden das Pepsinogen?', 'Hauptzellen', ['Hauptzelle'], ['Belegzellen', 'Nebenzellen', 'Leberzellen'], 'Hauptzellen machen die Hauptsache: das Enzym.'),
      F('Welche Zellen bilden den Magenschleim?', 'Nebenzellen', ['Nebenzelle'], ['Hauptzellen', 'Belegzellen', 'Schwann’sche Zellen'], 'Nebenzellen schützen nebenbei mit Schleim.'),
      F('Welchen pH-Wert hat die Salzsäure im Magen ungefähr?', '2', ['pH 2', '1-2', '1,5', 'zwei', '1 bis 2'], ['7', '9', '12'], 'pH 2 = stark sauer.'),
      F('Was wandelt das inaktive Pepsinogen in aktives Pepsin um?', 'Salzsäure', ['Magensäure', 'die Salzsäure', 'HCl'], ['Schleim', 'Galle', 'Amylase'], 'Die Salzsäure aktiviert das Enzym erst im Magen.'),
      F('Welche Nährstoffe spaltet Pepsin?', 'Proteine', ['Eiweiße', 'Eiweiß', 'Protein'], ['Stärke', 'Fette', 'Maltose'], 'Pepsin spaltet Proteine in Peptide.'),
      F('Was entsteht, wenn Pepsin Proteine spaltet?', 'Peptide', ['Peptid', 'Oligopeptide', 'kürzere Aminosäureketten'], ['Aminosäuren', 'Glucose', 'Fettsäuren'], 'Pepsin macht kürzere Ketten = Peptide. Einzelne Aminosäuren entstehen erst im Dünndarm.'),
      TF('Die Salzsäure spaltet die Eiweiße.', false, 'Die Salzsäure tötet Bakterien, lässt die Nahrung aufquellen und aktiviert Pepsin. Spalten tut das Enzym Pepsin.'),
      TF('Pepsin zerlegt Eiweiße direkt in einzelne Aminosäuren.', false, 'Pepsin macht Peptide (kürzere Ketten). Aminosäuren entstehen erst im Dünndarm durch Peptidasen.'),
      TF('Der Schleim schützt die Magenwand vor der Salzsäure und vor Selbstverdauung.', true),
      F('Wie heißt der Magenausgang?', 'Pförtner', ['Pfoertner', 'Magenpförtner'], ['Magenmund', 'Kehldeckel', 'Zwölffingerdarm'], 'Der Pförtner gibt den Brei portionsweise in den Dünndarm ab.'),
      MC('Wie groß ist das Fassungsvermögen des Magens?', '1,5–2 Liter', ['0,2 Liter', '5 Liter', '10 Liter']),
      MC('Wie viel Magensaft bildet die Magenschleimhaut pro Tag?', 'ca. 2 Liter', ['ca. 2 Milliliter', 'ca. 20 Liter', 'ca. 0,2 Liter']),
      ORDER('Wie kommt der Brei durch den Magen?', ['Speiseröhre', 'Magenmund (Schließmuskel)', 'Magen', 'Pförtner', 'Zwölffingerdarm']),
      EXPLAIN('Warum wird das Pepsin zuerst als inaktives Pepsinogen gebildet?', ['Schutz: Sonst würde das Enzym die eigenen Zellen (Hauptzellen/Magenwand) verdauen', 'Erst im Magen wandelt die Salzsäure Pepsinogen in Pepsin um', 'Zusätzlich schützt der Schleim der Nebenzellen die Magenwand'], 'Würde Pepsin gleich aktiv gebildet, würde es die Zellen verdauen, die es herstellen (Selbstverdauung). Darum bilden die Hauptzellen die inaktive Vorstufe Pepsinogen. Erst im Magen macht die Salzsäure daraus aktives Pepsin. Der Schleim der Nebenzellen schützt außerdem die Magenwand.'),
      EXPLAIN('Was ist Sodbrennen und wie entsteht es?', ['Brennender Schmerz hinter dem Brustbein', 'Saurer Magensaft / Salzsäure fließt in die Speiseröhre zurück', 'Weil der Schließmuskel des Magenmundes nicht dicht schließt'], 'Sodbrennen ist ein brennender Schmerz hinter dem Brustbein. Er entsteht, wenn saurer Magensaft (Salzsäure) in die Speiseröhre zurückfließt, weil der Schließmuskel am Mageneingang nicht richtig schließt.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'leber', title: 'Leber, Galle & Bauchspeicheldrüse', short: 'Leber & Co.', color: '#b8563f', icon: '🧪', cat: 'felix', page: 'Seiten 6–7',
    story: 'Felix hat zu fettes Futter erwischt. Welche Helfer-Organe braucht er jetzt, und was machen sie genau?',
    learn: `
<h2>Die Leber</h2>
<div class="figure" data-diagram="leber"></div>
<ul>
<li>Die <b>größte Drüse</b> des Körpers, 1,5–2 kg schwer, zweilappig. Man nennt sie das <b class="k">Stoffwechselzentrum</b>.</li>
<li>Sie bildet die <b>Gallenflüssigkeit (Galle)</b>.</li>
<li>Sie nimmt die verdauten Nährstoffe aus dem Blut auf. Die kommen über die <b>Pfortader</b> direkt vom Darm. Daraus baut sie körpereigene Stoffe: <b>Fette, Eiweiße und Glykogen</b> (Speicherform von Glucose).</li>
<li><b>Entgiftung:</b> Sie baut Alkohol, Medikamente und alte rote Blutkörperchen ab.</li>
<li>Außerdem bildet sie <b>Blutgerinnungsfaktoren</b> und speichert <b>Eisen</b> und <b>Vitamin A</b>.</li>
</ul>
<div class="box fix"><span class="t">⚠️ Typischer Fehler</span>Die Leber bildet <b>keine Verdauungsenzyme</b>. Ihr Beitrag zur Verdauung ist die Galle.</div>
<h2>Gallenblase und Galle</h2>
<ul>
<li>Die Galle wird in der <b>Leber gebildet</b>, in der <b>Gallenblase gesammelt und gespeichert</b> und über den <b>Gallengang</b> in den <b>Zwölffingerdarm</b> abgegeben.</li>
<li>Sie wird nur für die <b>Fettverdauung</b> gebraucht: Sie zerteilt Fette in kleine Fetttröpfchen. Das heißt <b class="k">emulgieren</b>. So kommen die Enzyme besser an die Fette heran.</li>
</ul>
<div class="box merk"><span class="t">💡 Merksatz</span>Galle ist wie <b>Spülmittel</b>: Sie zerteilt Fett in Tröpfchen. Spalten tut erst die <b>Lipase</b>. <b>Galle ist kein Enzym!</b></div>
<h2>Die Bauchspeicheldrüse (Pankreas)</h2>
<ul>
<li>Ihr Ausgang mündet auch in den Gallengang, ihr Saft kommt also ebenfalls in den Zwölffingerdarm.</li>
<li>Ihr Saft enthält die Verdauungsenzyme <b>Amylase</b>, <b>Trypsin</b> (und Chymotrypsin) und <b>Lipase</b>.</li>
<li>Außerdem bildet sie die <b>Hormone</b> <b>Insulin</b> (senkt den Blutzucker) und <b>Glucagon</b> (hebt den Blutzucker). Das sind keine Verdauungsenzyme!</li>
<li>Die Verdauungssäfte machen den sauren Brei aus dem Magen <b>alkalisch</b> (pH über 7). Nur so können die Enzyme im Dünndarm arbeiten.</li>
</ul>
<div class="box merk"><span class="t">💡 Eselsbrücken</span>Enzyme der Bauchspeicheldrüse: <b>A</b>lle <b>T</b>iere <b>L</b>ieben Katzen → <b>A</b>mylase, <b>T</b>rypsin, <b>L</b>ipase.<br><b>Insulin</b> bringt den Zucker <b>in</b> die Zellen → Blutzucker sinkt. <b>Glucagon</b> = „Glucose, go!“ → Blutzucker steigt.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Schon wenig Paracetamol ist für Katzen giftig. Ihrer Leber fehlt ein Enzym, mit dem wir Menschen den Wirkstoff abbauen (entgiften).</div>
`,
    video: [
      { cat: 'doc', say: 'Jetzt lernst du die drei wichtigsten Helfer kennen: Leber, Gallenblase und Bauchspeicheldrüse.' },
      { d: 'leber', hl: ['leber'], say: 'Die Leber ist die größte Drüse, das Stoffwechselzentrum. Sie bildet die Galle, baut Gifte wie Alkohol ab und speichert Eisen und Vitamin A.' },
      { d: 'leber', hl: ['pfortader'], say: 'Über die Pfortader kommt nährstoffreiches Blut direkt vom Darm zur Leber.' },
      { d: 'leber', hl: ['gallenblase'], say: 'Die Galle wird in der Leber gebildet und in der Gallenblase gespeichert.' },
      { big: 'Galle = Spülmittel\nkein Enzym!', say: 'Die Galle zerteilt Fett in kleine Tröpfchen. Das nennt man emulgieren. Sie ist aber kein Enzym und spaltet nichts.' },
      { d: 'leber', hl: ['bauchspeicheldruese'], say: 'Die Bauchspeicheldrüse liefert Amylase, Trypsin und Lipase. Merksatz: Alle Tiere Lieben Katzen.' },
      { big: 'Insulin ⬇︎   Glucagon ⬆︎', say: 'Sie bildet auch zwei Hormone: Insulin senkt den Blutzucker, Glucagon hebt ihn.' },
      { d: 'leber', hl: ['duenndarm'], say: 'Galle und Bauchspeichel fließen in den Zwölffingerdarm. Dort machen sie den sauren Brei alkalisch, damit die Enzyme arbeiten können.' },
    ],
    yt: [
      { title: 'Fettverdauung einfach erklärt', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=tyDb80433lc' },
      { title: 'Die Verdauung des Menschen', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=gcP0AiMDjes' },
    ],
    q: [
      LABEL('leber', 'all', 'Beschrifte die Abbildung (wie Seite 6).'),
      F('Welches Organ ist die größte Drüse und das Stoffwechselzentrum?', 'Leber', [], ['Bauchspeicheldrüse', 'Magen', 'Gallenblase'], '1,5–2 kg, zweilappig.'),
      F('Wo wird die Galle gebildet?', 'Leber', ['in der Leber'], ['Gallenblase', 'Bauchspeicheldrüse', 'Magen'], 'Gebildet in der Leber, gespeichert in der Gallenblase.'),
      F('Wo wird die Galle gespeichert?', 'Gallenblase', ['in der Gallenblase'], ['Leber', 'Magen', 'Dünndarm'], 'Die Gallenblase sammelt und speichert die Galle.'),
      F('Wie nennt man es, wenn die Galle Fette in kleine Fetttröpfchen zerteilt?', 'emulgieren', ['Emulgieren', 'emulgiert', 'Emulgierung'], ['spalten', 'verdauen', 'resorbieren'], 'Emulgieren = in feine Tröpfchen zerteilen.'),
      TF('Die Galle ist ein Enzym, das Fette spaltet.', false, 'Die Galle ist kein Enzym. Sie emulgiert die Fette nur. Spalten tut die Lipase.'),
      TF('Die Gallenblase bildet die Galle.', false, 'Die Leber bildet die Galle, die Gallenblase speichert sie nur.'),
      MULTI('Welche Verdauungsenzyme bildet die Bauchspeicheldrüse?', ['Amylase', 'Trypsin', 'Lipase'], ['Pepsin', 'Insulin', 'Galle'], 'Merksatz: Alle Tiere Lieben Katzen. Insulin ist ein Hormon!'),
      MATCH('Welches Hormon macht was?', [['Insulin', 'senkt den Blutzucker'], ['Glucagon', 'hebt den Blutzucker']]),
      TF('Insulin ist ein Verdauungsenzym der Bauchspeicheldrüse.', false, 'Insulin ist ein Hormon. Es regelt den Blutzucker.'),
      F('Welches Blutgefäß bringt die Nährstoffe vom Darm zur Leber?', 'Pfortader', [], ['Arterie', 'Hohlvene', 'Lymphgefäß'], 'Die Pfortader führt direkt vom Darm zur Leber.'),
      MULTI('Was sind Aufgaben der Leber?', ['Galle bilden', 'Gifte wie Alkohol abbauen', 'Glykogen aufbauen', 'Eisen und Vitamin A speichern'], ['Insulin bilden', 'Pepsin bilden', 'Wasser aus dem Kot holen']),
      CLOZE('Ergänze.', 'Die Verdauungssäfte machen den sauren Brei {alkalisch|basisch}: Der pH-Wert steigt über {7|sieben}. Erst dann können die {Enzyme} im Dünndarm arbeiten.', ['sauer', '2', 'Hormone']),
      F('In welchen Darmabschnitt fließen Galle und Bauchspeichel?', 'Zwölffingerdarm', ['Zwoelffingerdarm', 'Duodenum'], ['Dickdarm', 'Magen', 'Mastdarm'], 'Über den Gallengang in den Zwölffingerdarm.'),
      EXPLAIN('Warum ist die Galle für die Fettverdauung wichtig, obwohl sie kein Enzym ist?', ['Galle emulgiert: zerteilt Fett in kleine Fetttröpfchen', 'Dadurch wird die Oberfläche größer', 'Die Lipase kann die Fette dann besser spalten (zu Glycerin + Fettsäuren)'], 'Die Galle spaltet selbst nichts, aber sie emulgiert die Fette: Sie zerteilt sie in viele kleine Fetttröpfchen. Dadurch ist die Oberfläche viel größer und das Enzym Lipase kann die Fette besser in Glycerin und Fettsäuren spalten.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'duenndarm', title: 'Dünndarm & Darmzotten', short: 'Dünndarm', color: '#e89b2f', icon: '🌀', cat: 'nala', page: 'Seiten 7–9',
    story: 'Nala frisst viel, wird aber nicht satt. Zeig ihr, wie die Nährstoffe im Dünndarm ins Blut kommen!',
    learn: `
<h2>Der Dünndarm</h2>
<ul>
<li>Mit ca. <b>5–6 Metern</b> der längste Abschnitt des Verdauungstraktes.</li>
<li>Er beginnt mit dem <b>Zwölffingerdarm</b> (ca. 30 cm, „so lang wie 12 Finger breit“), danach folgen Leerdarm und Krummdarm.</li>
<li>In den Zwölffingerdarm münden die Säfte der <b>Bauchspeicheldrüse</b> und der <b>Leber</b> (Galle).</li>
</ul>
<p class="small muted">Die Abbildung mit den Darmabschnitten ist in deinem Heft mit „nicht lernen“ markiert.</p>
<h2>Hier wird fertig verdaut</h2>
<ul>
<li><b>Stärke</b> → Amylase → <b>Maltose</b> → Maltase → <b>Glucose</b></li>
<li><b>Proteine</b> → Peptidasen (z. B. Trypsin) → <b>Aminosäuren</b></li>
<li><b>Fette</b> → Galle emulgiert → Lipase → <b>Fettsäuren + Glycerin</b></li>
</ul>
<p>Mehr dazu im Kapitel „Vom Nährstoff zum Baustein“.</p>
<h2>Aufnahme ins Blut: die Darmzotten</h2>
<div class="figure" data-diagram="zotte"></div>
<ul>
<li>Die Innenwand hat viele <b>Falten</b> (Ringfalten, Kerckring-Falten).</li>
<li>Auf den Falten sitzen winzige <b class="k">Darmzotten</b>.</li>
<li>Auf den Darmzellen der Zotten sitzen noch winzigere Ausstülpungen: die <b class="k">Mikrovilli</b>. Zusammen bilden sie den <b>Bürstensaum</b>.</li>
<li>In jeder Zotte gibt es feine <b>Blutgefäße (Kapillaren)</b> und ein <b>Lymphgefäß</b>.</li>
<li><b>Glucose</b> und <b>Aminosäuren</b> gehen ins <b>Blut</b> und über die <b>Pfortader</b> zur <b>Leber</b>.</li>
<li><b>Fette</b> (Fettsäuren und Glycerin) gehen in die <b>Lymphe</b>. Das Lymphsystem ist über die obere Hohlvene mit dem Blutkreislauf verbunden, so kommen auch die Fette ins Blut.</li>
</ul>
<div class="box merk"><span class="t">💡 Prinzip der Oberflächenvergrößerung</span><b>Falten → Zotten → Mikrovilli</b>: groß, klein, winzig. Mehr Oberfläche heißt mehr Kontaktfläche, also können viel mehr Nährstoffe aufgenommen werden.</div>
<div class="box fix"><span class="t">⚠️ Zur Angabe „ca. 1 Tennisplatz“ (Seite 9)</span>Das steht in vielen Schulbüchern (ca. 200 m²) und passt für den Test. Neuere Messungen (2014) kommen eher auf <b>30–40 m²</b>, so viel wie eine kleine Wohnung. Wichtig ist das <b>Prinzip</b>: Falten, Zotten und Mikrovilli vergrößern die Oberfläche riesig.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Auch Katzen haben Zotten mit Mikrovilli im Darm. Ihr Darm ist aber im Verhältnis kürzer als unserer, weil Fleisch leichter zu verdauen ist.</div>
`,
    video: [
      { cat: 'doc', say: 'Der Dünndarm ist der Star der Verdauung. Hier wird fertig verdaut und alles aufgenommen.' },
      { d: 'organe', hl: ['zwoelffingerdarm', 'duenndarm'], say: 'Er ist etwa fünf bis sechs Meter lang und beginnt mit dem Zwölffingerdarm. Dort münden Galle und Bauchspeichel.' },
      { big: 'Glucose · Aminosäuren\nFettsäuren + Glycerin', say: 'Am Ende sind alle Nährstoffe in Bausteine zerlegt: Glucose, Aminosäuren, Fettsäuren und Glycerin.' },
      { d: 'zotte', hl: ['darmzotte'], say: 'Die Innenwand hat Falten. Darauf sitzen fingerförmige Darmzotten.' },
      { d: 'zotte', hl: ['darmzelle', 'mikrovilli'], say: 'Die Darmzellen haben noch winzigere Ausstülpungen, die Mikrovilli. Zusammen heißen sie Bürstensaum.' },
      { big: 'Falten ➜ Zotten ➜ Mikrovilli', say: 'Falten, Zotten, Mikrovilli: Das ist das Prinzip der Oberflächenvergrößerung. Mehr Fläche heißt mehr Nährstoffe aufnehmen.' },
      { d: 'zotte', hl: ['blutgefaess'], say: 'Glucose und Aminosäuren gehen in die Blutgefäße und über die Pfortader zur Leber.' },
      { d: 'zotte', hl: ['lymphgefaess'], say: 'Die Fette gehen ins Lymphgefäß und kommen über die obere Hohlvene später auch ins Blut.' },
    ],
    yt: [
      { title: 'Die Verdauung des Menschen', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=gcP0AiMDjes' },
      { title: 'Verdauungsorgane – Funktion, Weg der Nahrung', ch: 'Studyflix', url: 'https://studyflix.de/biologie/verdauungsorgane-3106/video' },
    ],
    q: [
      LABEL('zotte', 'all', 'Beschrifte den Bau des Dünndarms.'),
      LABEL('zotte', ['darmzotte', 'mikrovilli', 'blutgefaess', 'lymphgefaess', 'darmzelle'], 'Beschrifte Abbildung 2 (Seite 8).'),
      MC('Wie lang ist der Dünndarm ungefähr?', '5–6 Meter', ['50 cm', '1,5 Meter', '20 Meter'], 'Der längste Abschnitt des Verdauungstraktes.'),
      F('Wie heißt der erste Abschnitt des Dünndarms?', 'Zwölffingerdarm', ['Zwoelffingerdarm', 'Duodenum'], ['Krummdarm', 'Blinddarm', 'Mastdarm'], 'Ca. 30 cm, „12 Finger breit“.'),
      F('Wie heißen die fingerförmigen Ausstülpungen der Dünndarmwand?', 'Darmzotten', ['Zotten', 'Darmzotte', 'Dünndarmzotten'], ['Mikrovilli', 'Krypten', 'Falten'], 'Darmzotten vergrößern die Oberfläche.'),
      F('Wie heißen die winzigen Ausstülpungen der Darmzellen?', 'Mikrovilli', ['Microvilli', 'Mikrovillus'], ['Darmzotten', 'Dendriten', 'Krypten'], 'Mikrovilli bilden zusammen den Bürstensaum.'),
      F('Wie heißt die Gesamtheit der Mikrovilli?', 'Bürstensaum', ['Buerstensaum'], ['Darmflora', 'Markscheide', 'Schleimhaut'], 'Sieht aus wie die Borsten einer Bürste.'),
      SORT('Wohin gelangen die Bausteine?', ['ins Blut', 'in die Lymphe'], [['Glucose', 0], ['Aminosäuren', 0], ['Fettsäuren', 1], ['Glycerin', 1]], 'Fette nehmen den Umweg über die Lymphe.'),
      F('Über welches Blutgefäß gelangen die Bausteine aus dem Darm zur Leber?', 'Pfortader', [], ['Hohlvene', 'Arterie', 'Lymphgefäß'], 'Die Pfortader führt direkt vom Darm zur Leber.'),
      TF('Die Darmzotten verkleinern die Oberfläche des Dünndarms.', false, 'Sie vergrößern die Oberfläche, damit mehr Nährstoffe aufgenommen werden können.'),
      ORDER('Ordne von groß nach winzig: Was vergrößert die Oberfläche?', ['Falten (Ringfalten)', 'Darmzotten', 'Mikrovilli'], 'Falten → Zotten → Mikrovilli.'),
      CLOZE('Ergänze den Text (Seite 8).', 'Die Innenwand des Dünndarms hat viele {Falten}, die mit winzigen {Darmzotten|Zotten} besetzt sind. Jede Zotte wird von feinen {Blutgefäßen|Kapillaren|Blutgefässen} und einem {Lymphgefäß|Lymphgefäss} durchzogen. Auf den Darmzotten sitzen die {Mikrovilli}, sie bilden den {Bürstensaum|Buerstensaum}.', ['Krypten', 'Dendriten', 'Pförtner']),
      EXPLAIN('Erläutere das Prinzip der Oberflächenvergrößerung im Dünndarm.', ['Falten, Darmzotten und Mikrovilli vergrößern die Innenfläche', 'Größere Fläche = mehr Kontaktfläche', 'So können mehr Nährstoffe schneller ins Blut/die Lymphe aufgenommen werden'], 'Die Innenwand des Dünndarms ist in Falten gelegt, auf den Falten sitzen Darmzotten und auf den Darmzellen noch Mikrovilli. Dadurch wird die innere Oberfläche riesig vergrößert. Mit mehr Kontaktfläche können viel mehr Nährstoffe in kurzer Zeit ins Blut und in die Lymphe aufgenommen werden.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'abbau', title: 'Vom Nährstoff zum Baustein', short: 'Nährstoff → Baustein', color: '#7a5ce0', icon: '🧩', cat: 'simba', page: 'Seite 8 (die Katzen-Stelle)',
    story: 'Simba will wissen, was aus Fett, Eiweiß und Kohlenhydraten in seinem Napf wird. Das ist die Stelle mit der Katze auf Seite 8!',
    learn: `
<h2>Die drei Nährstoffe und ihre Bausteine</h2>
<p>Das ist die Abbildung <b>„Vorgänge bei der Verdauung“</b> von Seite 8 (neben der gezeichneten Katze). Lies sie wie ein Comic von links nach rechts.</p>
<div class="figure" data-diagram="abbau"></div>
<div class="tablewrap"><table>
<tr><th>Nährstoff</th><th>Enzym(e)</th><th>Zwischenstufe</th><th>Enzym</th><th>Baustein</th><th>geht ins</th></tr>
<tr><td><b>Kohlenhydrate</b> (Stärke)</td><td>Amylase (Mund, Bauchspeicheldrüse)</td><td>Maltose</td><td>Maltase</td><td><b>Glucose</b></td><td>Blut</td></tr>
<tr><td><b>Proteine</b> (Eiweiße)</td><td>Pepsin (Magen), Trypsin (Bauchspeicheldrüse)</td><td>Oligopeptide</td><td>Peptidasen</td><td><b>Aminosäuren</b></td><td>Blut</td></tr>
<tr><td><b>Fette</b></td><td>vorher: Galle emulgiert</td><td>Fetttröpfchen</td><td>Lipase</td><td><b>Glycerin + Fettsäuren</b></td><td>Lymphe (später Blut)</td></tr>
</table></div>
<h3>So sehen die Teilchen im Heft aus</h3>
<ul>
<li><b>Glucose</b> = ein Ring · <b>Maltose</b> = 2 Ringe · <b>Stärke</b> = eine lange Kette aus Ringen</li>
<li><b>Aminosäure</b> = eine Perle · <b>Oligopeptid</b> = kurze Perlenkette · <b>Protein</b> = lange, gefaltete Perlenkette</li>
<li><b>Fett</b> = wie ein Kamm: <b>Glycerin</b> ist der Rücken, die drei <b>Fettsäuren</b> sind die Zinken</li>
</ul>
<div class="box merk"><span class="t">💡 Merksätze</span>
<b>Lange Kette → kurze Kette → einzelne Teile.</b><br>
Enzyme erkennst du an der Endung <b>-ase</b>: Malt<b>ase</b> spaltet Malt<b>ose</b>, Lip<b>ase</b> spaltet Lipide (Fette), Peptid<b>ase</b> spaltet Peptide. Die zwei „-in“-Enzyme <b>Pepsin</b> und <b>Trypsin</b> knacken Eiweiß.<br>
<b>Zucker und Eiweiß-Bausteine fahren mit dem Blut-Bus zur Leber, das Fett nimmt das Lymph-Boot.</b></div>
<h3>Wozu brauchen wir die Nährstoffe? <span class="tag warn">Zusatz</span></h3>
<ul>
<li><b>Kohlenhydrate:</b> schnelle Energie (ca. 17 kJ pro Gramm)</li>
<li><b>Fette:</b> Energiespeicher und Wärmeschutz (ca. 39 kJ pro Gramm, also mehr als doppelt so viel)</li>
<li><b>Proteine:</b> vor allem Baustoff für Muskeln, Haut, Haare und Enzyme (ca. 17 kJ pro Gramm)</li>
</ul>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Katzen müssen den Baustein <b>Taurin</b> mit dem Fleisch fressen, weil ihr Körper zu wenig davon bildet. Darum ist Hundefutter für Katzen auf Dauer ungesund.</div>
`,
    video: [
      { cat: 'doc', say: 'Das ist die wichtige Stelle mit der Katze auf Seite acht. Wir verfolgen drei Nährstoffe bis zu ihren Bausteinen.' },
      { d: 'abbau', hl: ['staerke'], say: 'Kohlenhydrate: Stärke ist eine lange Kette aus Glucose-Ringen.' },
      { d: 'abbau', hl: ['maltose'], say: 'Die Amylase aus Mund und Bauchspeicheldrüse schneidet sie in Maltose, das sind zwei Ringe.' },
      { d: 'abbau', hl: ['glucose', 'blut-kh'], say: 'Die Maltase im Dünndarm macht daraus einzelne Glucose. Die geht ins Blut.' },
      { d: 'abbau', hl: ['proteine'], say: 'Proteine sind lange, gefaltete Ketten aus Aminosäuren, wie eine Perlenkette.' },
      { d: 'abbau', hl: ['oligopeptide'], say: 'Pepsin im Magen und Trypsin aus der Bauchspeicheldrüse schneiden sie in kurze Stücke, die Oligopeptide.' },
      { d: 'abbau', hl: ['aminosaeuren'], say: 'Peptidasen im Dünndarm machen daraus einzelne Aminosäuren. Auch sie gehen ins Blut.' },
      { d: 'abbau', hl: ['fette'], say: 'Fette sehen aus wie ein Kamm: ein Glycerin und drei Fettsäuren. Zuerst emulgiert die Galle sie zu kleinen Tröpfchen.' },
      { d: 'abbau', hl: ['glycerin', 'fettsaeuren', 'lymphe'], say: 'Dann spaltet die Lipase sie in Glycerin und Fettsäuren. Die gehen in die Lymphe und später ins Blut.' },
      { big: 'Blut-Bus 🚌  Lymph-Boot ⛵', say: 'Merksatz: Zucker und Eiweiß-Bausteine fahren mit dem Blut-Bus zur Leber, das Fett nimmt das Lymph-Boot.' },
    ],
    yt: [
      { title: 'Proteinverdauung einfach erklärt', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=wpgtg30-JVs' },
      { title: 'Fettverdauung einfach erklärt', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=tyDb80433lc' },
      { title: 'Kohlenhydrate (Chemie) – Aufbau, Beispiele', ch: 'Studyflix', url: 'https://studyflix.de/chemie/kohlenhydrate-chemie-5322/video' },
    ],
    q: [
      LABEL('abbau', ['staerke', 'maltose', 'glucose', 'proteine', 'oligopeptide', 'aminosaeuren', 'fette', 'glycerin', 'fettsaeuren'], 'Beschrifte die Teilchen (wie Seite 8).'),
      ORDER('Kohlenhydrat-Abbau: Bring in die richtige Reihenfolge.', ['Stärke', 'Maltose', 'Glucose']),
      ORDER('Eiweiß-Abbau: Bring in die richtige Reihenfolge.', ['Proteine', 'Oligopeptide', 'Aminosäuren']),
      F('In welche Bausteine werden Fette zerlegt?', 'Fettsäuren und Glycerin', ['Glycerin und Fettsäuren', 'Fettsäuren + Glycerin', 'Glycerin + Fettsäuren', 'Fettsäuren, Glycerin', 'Glycerin, Fettsäuren'], ['nur Fettsäuren', 'Aminosäuren', 'Glucose und Maltose'], 'Achtung: Glycerin nicht vergessen!'),
      F('Was ist der Baustein der Proteine?', 'Aminosäuren', ['Aminosäure'], ['Glucose', 'Fettsäuren', 'Peptidasen'], 'Viele Aminosäuren bilden eine Kette = Protein.'),
      F('Was ist der kleinste Baustein der Stärke?', 'Glucose', ['Glukose', 'Traubenzucker'], ['Maltose', 'Aminosäure', 'Glycerin'], 'Stärke = viele Glucose-Ringe.'),
      MATCH('Nährstoff und Baustein', [['Kohlenhydrate (Stärke)', 'Glucose'], ['Proteine', 'Aminosäuren'], ['Fette', 'Glycerin + Fettsäuren']]),
      MATCH('Welches Enzym spaltet was?', [['Amylase', 'Stärke'], ['Maltase', 'Maltose'], ['Pepsin', 'Proteine'], ['Lipase', 'Fette']]),
      SORT('Wohin gehen die Bausteine?', ['Blut', 'Lymphe'], [['Glucose', 0], ['Aminosäuren', 0], ['Fettsäuren', 1], ['Glycerin', 1]]),
      F('Welches Enzym spaltet Maltose?', 'Maltase', [], ['Amylase', 'Lipase', 'Pepsin'], 'Maltase spaltet Maltose: Der Name verrät es.'),
      F('Welches Enzym spaltet Fette?', 'Lipase', [], ['Galle', 'Maltase', 'Pepsin'], 'Lipase, nachdem die Galle emulgiert hat.'),
      CLOZE('Ergänze die drei Abbauwege.', 'Stärke → {Maltose} → {Glucose|Glukose}. Proteine → {Oligopeptide|Peptide} → {Aminosäuren}. Fette → {Glycerin} und {Fettsäuren}.', ['Lipase', 'Galle', 'Laktose']),
      TF('Fette werden nur zu Fettsäuren abgebaut.', false, 'Zu Glycerin UND Fettsäuren.'),
      EXPLAIN('Erläutere mithilfe der Abbildung die Vorgänge bei der Verdauung im Dünndarm (Seite 9, Aufgabe b).', ['Enzyme zerlegen die Nährstoffe in Bausteine: Stärke → Glucose, Proteine → Aminosäuren, Fette → Glycerin + Fettsäuren', 'Galle emulgiert vorher die Fette', 'Die Bausteine werden durch die Dünndarmwand (Darmzotten) aufgenommen', 'Glucose und Aminosäuren → Blut (Pfortader → Leber), Fettsäuren und Glycerin → Lymphe'], 'Im Dünndarm zerlegen Enzyme die Nährstoffe in ihre Bausteine: Die Amylase spaltet Stärke zu Maltose, die Maltase spaltet Maltose zu Glucose. Peptidasen wie Trypsin zerlegen Proteine in Aminosäuren. Die Galle emulgiert die Fette, dann spaltet die Lipase sie in Glycerin und Fettsäuren. Die Bausteine werden über die Darmzotten aufgenommen: Glucose und Aminosäuren ins Blut (über die Pfortader zur Leber), Fettsäuren und Glycerin in die Lymphe.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'zoeliakie', title: 'Zöliakie & Unverträglichkeiten', short: 'Zöliakie', color: '#3fa16a', icon: '🌾', cat: 'kiki', page: 'Seiten 9–10',
    story: 'Kiki bekommt von Milch Bauchweh. Ist das eine Allergie? Finde den Unterschied heraus!',
    learn: `
<h2>Zöliakie</h2>
<ul>
<li>Zöliakie ist eine <b>Glutenunverträglichkeit</b>. Sie hat Merkmale einer <b>Allergie</b> und einer <b>Autoimmunerkrankung</b>.</li>
<li><b>Gluten</b> heißt auch <b>Klebereiweiß</b> und steckt z. B. in Weizen, Roggen, Gerste und Dinkel.</li>
<li>Glutenhaltige Nahrung führt zu einer <b>Entzündung der Dünndarmschleimhaut</b>. Die <b>Darmzotten werden kleiner und flacher</b>.</li>
<li>Weniger Oberfläche → die Nährstoffe werden schlecht aufgenommen und bleiben großteils unverdaut im Darm.</li>
<li><b>Folgen:</b> Müdigkeit, Antriebslosigkeit, starke Bauchschmerzen, Durchfälle.</li>
</ul>
<div class="box tip"><span class="t">🔎 Vergleich gesund und Zöliakie (Seite 10, Aufgabe b)</span>Gesund: lange Zotten, große Oberfläche. Bei Zöliakie: kurze, flache Zotten, kleine Oberfläche. Dadurch kommen weniger Nährstoffe ins Blut, man ist müde und hat keine Energie. Die unverdauten Reste im Darm verursachen Bauchweh und Durchfall.</div>
<h2>Intoleranz ≠ Allergie</h2>
<ul>
<li><b>Intoleranz</b> (Unverträglichkeit): Ein angeborener oder erworbener <b>Enzymdefekt</b>. Ein Enzym fehlt, deshalb werden bestimmte Stoffe nicht richtig verdaut. Folgen: Blähungen, Krämpfe, Durchfall oder Verstopfung.</li>
<li><b>Allergie:</b> Eine <b>Überreaktion des Immunsystems</b> auf eigentlich harmlose Stoffe.</li>
</ul>
<div class="tablewrap"><table>
<tr><th>Unverträglichkeit</th><th>fehlendes Enzym</th></tr>
<tr><td>Laktoseintoleranz (Milchzucker)</td><td><b>Laktase</b></td></tr>
<tr><td>Histaminintoleranz</td><td><b>DAO</b> (Diaminoxidase)</td></tr>
<tr><td>Erbliche Fruktoseintoleranz (Fruchtzucker)</td><td><b>Aldolase B</b> (in der Leber)</td></tr>
</table></div>
<div class="box fix"><span class="t">⚠️ Korrektur zu Seite 10</span>Bei der erblichen Fruktoseintoleranz war dein <b>durchgestrichenes „Aldolase B“ richtig!</b> Ein Enzym „Fruktase“ gibt es nicht.<br><span class="small">Profi-Info: Häufiger ist die <b>Fruktosemalabsorption</b>. Da funktioniert die Aufnahme im Darm nicht richtig (ein Transporter, kein Enzym).</span></div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Viele erwachsene Katzen vertragen keine Kuhmilch. Ihnen fehlt die <b>Laktase</b>, genau wie bei der Laktoseintoleranz. Davon bekommen sie Durchfall.</div>
`,
    video: [
      { cat: 'doc', say: 'Was passiert, wenn die Verdauung nicht richtig klappt? Zum Beispiel bei Zöliakie.' },
      { d: 'zotte', hl: ['darmzotte'], say: 'Bei Zöliakie verträgt man kein Gluten, das Klebereiweiß im Getreide. Die Dünndarmschleimhaut entzündet sich, und die Darmzotten werden klein und flach.' },
      { big: 'kleine Zotten = kleine Oberfläche', say: 'Kleinere Oberfläche heißt: Es werden weniger Nährstoffe aufgenommen. Die Folgen sind Müdigkeit, Antriebslosigkeit, Bauchschmerzen und Durchfall.' },
      { big: 'Intoleranz ≠ Allergie', say: 'Wichtig: Eine Intoleranz ist ein Enzymmangel. Eine Allergie ist eine Überreaktion des Immunsystems.' },
      { big: 'Laktose ➜ Laktase fehlt', say: 'Bei Laktoseintoleranz fehlt Laktase, bei Histaminintoleranz D A O, und bei der erblichen Fruktoseintoleranz Aldolase B.' },
      { cat: 'kiki', say: 'Übrigens: Viele Katzen vertragen keine Kuhmilch, weil ihnen die Laktase fehlt!' },
    ],
    yt: [],
    q: [
      F('Bei Zöliakie verträgt man welchen Stoff nicht?', 'Gluten', ['Klebereiweiß', 'Klebereiweiss'], ['Laktose', 'Fruktose', 'Histamin'], 'Gluten = Klebereiweiß im Getreide.'),
      MC('Was passiert bei Zöliakie mit den Darmzotten?', 'Sie werden kleiner und flacher', ['Sie werden länger', 'Sie bekommen mehr Mikrovilli', 'Nichts']),
      MULTI('Welche Beschwerden haben Zöliakie-Patienten häufig?', ['Müdigkeit', 'Antriebslosigkeit', 'Bauchschmerzen', 'Durchfall'], ['bessere Nährstoffaufnahme', 'längere Darmzotten']),
      TF('Eine Intoleranz und eine Allergie sind dasselbe.', false, 'Intoleranz = Enzymdefekt. Allergie = Überreaktion des Immunsystems.'),
      MATCH('Welches Enzym fehlt?', [['Laktoseintoleranz', 'Laktase'], ['Histaminintoleranz', 'DAO (Diaminoxidase)'], ['Erbliche Fruktoseintoleranz', 'Aldolase B']]),
      F('Welches Enzym fehlt bei Laktoseintoleranz?', 'Laktase', ['Lactase'], ['Lipase', 'Maltase', 'Amylase'], 'Laktase spaltet Laktose (Milchzucker).'),
      TF('Bei der erblichen Fruktoseintoleranz fehlt das Enzym „Fruktase“.', false, 'Es fehlt Aldolase B. Ein Enzym namens Fruktase gibt es nicht.'),
      F('Was ist eine Allergie?', 'Überreaktion des Immunsystems', ['Überreaktion des Immunsystems auf harmlose Stoffe', 'Ueberreaktion des Immunsystems', 'Immunreaktion'], ['Enzymmangel', 'Vitaminmangel', 'Darmentzündung durch Bakterien'], 'Das Immunsystem reagiert auf eigentlich harmlose Stoffe.'),
      EXPLAIN('Vergleiche den Dünndarm eines Zöliakie-Patienten mit dem eines gesunden Menschen und erkläre die Symptome.', ['Bei Zöliakie sind die Darmzotten kleiner/flacher (entzündete Schleimhaut)', 'Dadurch ist die Oberfläche kleiner', 'Es werden weniger Nährstoffe aufgenommen → Müdigkeit, Antriebslosigkeit', 'Unverdaute Reste im Darm → Bauchschmerzen, Durchfall'], 'Beim gesunden Menschen sind die Darmzotten lang und die Oberfläche groß. Bei Zöliakie ist die Schleimhaut entzündet, die Zotten sind klein und flach, also ist die Oberfläche viel kleiner. Deshalb werden weniger Nährstoffe aufgenommen: Die Patienten sind müde und antriebslos. Was unverdaut im Darm bleibt, verursacht Bauchschmerzen und Durchfall.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'dickdarm', title: 'Der Dickdarm', short: 'Dickdarm', color: '#8a6a4a', icon: '🦠', cat: 'tiger', page: 'Seite 11',
    story: 'Tiger hatte eine Blinddarm-OP – oder doch nicht? Finde heraus, was im Dickdarm passiert!',
    learn: `
<h2>Bau</h2>
<ul>
<li>Ca. <b>1,5 m</b> lang, <b>keine Zotten</b>.</li>
<li>Der Name kommt vom <b>größeren Durchmesser</b>: 5–8 cm (Dünndarm: 2,5 cm).</li>
<li>Wo der Dünndarm in den Dickdarm mündet, liegt der sackartige <b>Blinddarm</b> mit dem <b>Wurmfortsatz</b> (ca. 10 cm).</li>
</ul>
<div class="box tip"><span class="t">🏥 Blinddarmentzündung</span>Entzündet ist eigentlich der <b>Wurmfortsatz</b>, und nur er wird bei der „Blinddarm-OP“ entfernt. Er enthält viele <b>Lymphknoten</b> und hilft bei der <b>Immunabwehr</b>.</div>
<h2>Aufgaben</h2>
<ul>
<li>Es werden <b>keine Nährstoffe</b> mehr aufgenommen, nur noch <b>Wasser und Elektrolyte</b> (Salze).</li>
<li>Dadurch wird der Darminhalt eingedickt und kommt als <b>Kot</b> in den <b>Mastdarm</b> (Endabschnitt des Dickdarms).</li>
<li>Dort löst er den <b>Stuhldrang</b> aus und wird durch den <b>After</b> ausgeschieden. Der After ist im Ruhezustand durch einen <b>Schließmuskel</b> verschlossen.</li>
</ul>
<h2>Die Darmflora (Mikrobiom)</h2>
<ul>
<li>Im Dickdarm leben sehr viele <b>Bakterien, Archaeen und Einzeller</b>, die <b>Darmflora</b>.</li>
<li>Sie bauen Stoffe ab, die <b>wir nicht verdauen können</b>, z. B. <b>Cellulose</b> (aus Pflanzen). Damit unterstützen sie unsere Verdauung.</li>
<li>Dabei entstehen <b>Gase</b>. Ein Teil gelangt über das Blut in die Lunge und wird ausgeatmet, der Rest (0,5–1,5 l pro Tag) geht durch den After.</li>
</ul>
<div class="box tip"><span class="t">🔬 Profi-Info</span>Darmbakterien bilden auch Vitamin K. Methan bildet übrigens nur etwa jeder dritte Mensch. Die meisten Darmgase sind Stickstoff, Kohlendioxid und Wasserstoff.</div>
<div class="box merk"><span class="t">💡 Dünndarm oder Dickdarm?</span><b>Dünndarm:</b> 5–6 m · dünn (2,5 cm) · Zotten · Nährstoffe aufnehmen<br><b>Dickdarm:</b> 1,5 m · dick (5–8 cm) · keine Zotten · Wasser zurückholen</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Katzen fressen manchmal Gras. Fachleute vermuten, dass es ihnen hilft, verschluckte Haare wieder loszuwerden.</div>
`,
    video: [
      { cat: 'doc', say: 'Letzte Station: der Dickdarm.' },
      { d: 'organe', hl: ['dickdarm'], say: 'Er ist etwa eineinhalb Meter lang, hat keine Zotten und einen großen Durchmesser von fünf bis acht Zentimetern.' },
      { d: 'organe', hl: ['blinddarm'], say: 'Am Anfang liegt der Blinddarm mit dem Wurmfortsatz. Der Wurmfortsatz hat viele Lymphknoten für die Immunabwehr. Bei der Blinddarm-OP wird nur er entfernt.' },
      { big: 'Wasser + Salze zurück', say: 'Im Dickdarm werden keine Nährstoffe mehr aufgenommen, nur noch Wasser und Elektrolyte. So wird der Darminhalt eingedickt.' },
      { big: 'Darmflora 🦠 baut Cellulose ab', say: 'Viele Bakterien, die Darmflora, bauen Stoffe ab, die wir selbst nicht verdauen können, zum Beispiel Cellulose. Dabei entstehen Gase.' },
      { d: 'organe', hl: ['mastdarm', 'after'], say: 'Der Kot sammelt sich im Mastdarm, löst den Stuhldrang aus und wird durch den After ausgeschieden. Ein Schließmuskel hält ihn sonst verschlossen.' },
    ],
    yt: [
      { title: 'Verdauungsorgane – Funktion, Weg der Nahrung', ch: 'Studyflix', url: 'https://studyflix.de/biologie/verdauungsorgane-3106/video' },
    ],
    q: [
      MC('Wie lang ist der Dickdarm ungefähr?', '1,5 Meter', ['15 cm', '5–6 Meter', '10 Meter']),
      TF('Der Dickdarm hat viele Darmzotten.', false, 'Der Dickdarm hat keine Zotten.'),
      F('Was wird im Dickdarm zurückgewonnen?', 'Wasser', ['Wasser und Elektrolyte', 'Wasser und Salze', 'Elektrolyte und Wasser'], ['Glucose', 'Aminosäuren', 'Vitamine'], 'Keine Nährstoffe mehr, nur Wasser und Elektrolyte.'),
      F('Welche Funktion hat der Wurmfortsatz?', 'Immunabwehr', ['Abwehr', 'Immunsystem', 'enthält Lymphknoten für die Immunabwehr'], ['Wasser aufnehmen', 'Fett verdauen', 'Galle speichern'], 'Er enthält viele Lymphknoten.'),
      TF('Bei der „Blinddarmoperation“ wird meistens nur der Wurmfortsatz entfernt.', true),
      F('Wie nennt man die Bakterien im Dickdarm?', 'Darmflora', ['Mikrobiom', 'Darmbakterien'], ['Mikrovilli', 'Lymphe', 'Krypten'], 'Darmflora = Mikrobiom.'),
      F('Welchen Pflanzenstoff baut die Darmflora für uns ab?', 'Cellulose', ['Zellulose'], ['Stärke', 'Eiweiß', 'Insulin'], 'Cellulose können wir selbst nicht verdauen.'),
      ORDER('Der letzte Weg: Bring in die richtige Reihenfolge.', ['Dünndarm', 'Blinddarm', 'Dickdarm', 'Mastdarm', 'After']),
      SORT('Dünndarm oder Dickdarm?', ['Dünndarm', 'Dickdarm'], [['5–6 m lang', 0], ['ca. 1,5 m lang', 1], ['hat Zotten', 0], ['keine Zotten', 1], ['Ø 2,5 cm', 0], ['Ø 5–8 cm', 1], ['Nährstoffe werden aufgenommen', 0], ['Wasser wird zurückgeholt', 1]]),
      F('Wie heißt der Endabschnitt des Dickdarms?', 'Mastdarm', ['Enddarm', 'Rektum'], ['Blinddarm', 'Krummdarm', 'Zwölffingerdarm'], 'Mastdarm = Enddarm.'),
      EXPLAIN('Wofür haben wir die Bakterien der Darmflora? (Seite 11, b)', ['Sie bauen Stoffe ab, die wir selbst nicht verdauen können', 'z. B. Cellulose', 'Sie unterstützen dadurch unsere Verdauung'], 'Die Bakterien der Darmflora bauen Stoffe ab, die wir selbst nicht verdauen können, zum Beispiel Cellulose aus Pflanzen. So unterstützen sie unsere Verdauung.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'enzyme', title: 'Alle Enzyme auf einen Blick', short: 'Enzyme', color: '#c0478c', icon: '✂️', cat: 'zimt', page: 'Seiten 3–10',
    story: 'Zimt sortiert die Enzym-Scheren der Klinik. Weißt du, welche Schere wo liegt und was sie schneidet?',
    learn: `
<h2>Was sind Enzyme?</h2>
<ul>
<li>Enzyme sind <b>Eiweiß-Moleküle</b>, die wie winzige <b>Scheren</b> arbeiten (Biokatalysatoren). Die meisten Namen enden auf <b>-ase</b>.</li>
<li>Jedes Enzym spaltet nur „seinen“ Stoff (<b>Substrat</b>): Es passt wie ein Schlüssel ins Schloss (<b>Schlüssel-Schloss-Prinzip</b>).</li>
<li>Enzyme werden dabei <b>nicht verbraucht</b>.</li>
<li>Sie arbeiten nur bei <b>passender Temperatur</b> (bei uns ca. 37 °C) und <b>passendem pH-Wert</b>: Pepsin mag es sauer (pH 2), die Enzyme im Dünndarm leicht alkalisch.</li>
</ul>
<h2>Die große Enzym-Tabelle</h2>
<div class="tablewrap"><table>
<tr><th>Enzym</th><th>gebildet in</th><th>wirkt in</th><th>spaltet</th><th>zu</th></tr>
<tr><td><b>Amylase</b> (Speichel)</td><td>Speicheldrüsen</td><td>Mund</td><td>Stärke</td><td>Maltose</td></tr>
<tr><td><b>Pepsin</b> (aus Pepsinogen)</td><td>Magen (Hauptzellen)</td><td>Magen</td><td>Proteine</td><td>Peptide</td></tr>
<tr><td><b>Amylase</b></td><td>Bauchspeicheldrüse</td><td>Dünndarm</td><td>Stärke</td><td>Maltose</td></tr>
<tr><td><b>Trypsin</b> (+ Chymotrypsin)</td><td>Bauchspeicheldrüse</td><td>Dünndarm</td><td>Proteine, Peptide</td><td>kürzere Peptide, Aminosäuren</td></tr>
<tr><td><b>Lipase</b></td><td>Bauchspeicheldrüse</td><td>Dünndarm</td><td>Fette (emulgiert)</td><td>Glycerin + Fettsäuren</td></tr>
<tr><td><b>Peptidasen</b></td><td>Dünndarm (Schleimhaut)</td><td>Dünndarm</td><td>Peptide</td><td>Aminosäuren</td></tr>
<tr><td><b>Maltase</b></td><td>Dünndarm (Schleimhaut)</td><td>Dünndarm</td><td>Maltose</td><td>Glucose</td></tr>
<tr><td><b>Laktase</b></td><td>Dünndarm (Schleimhaut)</td><td>Dünndarm</td><td>Laktose (Milchzucker)</td><td>Glucose + Galactose</td></tr>
</table></div>
<div class="box fix"><span class="t">⚠️ KEINE Enzyme (Fallen im Test!)</span>
<b>Galle:</b> in der Leber gebildet, in der Gallenblase gespeichert. Sie <b>emulgiert</b> Fette, spaltet aber nichts.<br>
<b>Salzsäure:</b> aus den Belegzellen. Sie aktiviert Pepsin und tötet Bakterien.<br>
<b>Schleim:</b> aus den Nebenzellen. Er schützt die Magenwand.<br>
<b>Insulin, Glucagon:</b> Hormone der Bauchspeicheldrüse.</div>
<div class="box merk"><span class="t">💡 Merksätze</span>
<b>Name verrät das Substrat:</b> Malt<b>ase</b> → Malt<b>ose</b> · Lakt<b>ase</b> → Lakt<b>ose</b> · Lip<b>ase</b> → Lipide (Fette) · Peptid<b>ase</b> → Peptide · Amyl<b>ase</b> → Amylum (lateinisch für Stärke).<br>
<b>Die „-in“-Enzyme</b> Pepsin und Trypsin knacken Eiweiß.<br>
<b>Bauchspeicheldrüse:</b> <b>A</b>lle <b>T</b>iere <b>L</b>ieben Katzen → Amylase, Trypsin, Lipase.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Im Speichel von Katzen gibt es praktisch keine Amylase. Als Fleischfresser fressen sie kaum Stärke.</div>
`,
    video: [
      { cat: 'doc', say: 'Willkommen in der Enzym-Werkstatt! Enzyme sind wie kleine Scheren.' },
      { big: '🔑 Schlüssel-Schloss', say: 'Jede Schere schneidet nur einen bestimmten Stoff. Das Enzym passt zu seinem Substrat wie ein Schlüssel ins Schloss.' },
      { d: 'organe', hl: ['ohrspeicheldruese', 'unterkieferspeicheldruese', 'unterzungenspeicheldruese'], say: 'Mund: Die Amylase aus den Speicheldrüsen spaltet Stärke zu Maltose.' },
      { d: 'organe', hl: ['magen'], say: 'Magen: Pepsin spaltet Proteine zu Peptiden. Es wird als Pepsinogen gebildet und von der Salzsäure aktiviert.' },
      { d: 'organe', hl: ['bauchspeicheldruese'], say: 'Bauchspeicheldrüse: Amylase, Trypsin und Lipase. Alle Tiere Lieben Katzen.' },
      { d: 'organe', hl: ['duenndarm'], say: 'Dünndarmschleimhaut: Maltase, Peptidasen und Laktase machen die letzten Schnitte: Glucose und Aminosäuren.' },
      { big: 'Galle ✗  Salzsäure ✗', say: 'Achtung Falle: Galle und Salzsäure sind keine Enzyme! Die Galle emulgiert Fett, die Salzsäure aktiviert Pepsin.' },
      { big: 'Maltase ➜ Maltose', say: 'Trick: Oft verrät der Name, was gespalten wird. Maltase spaltet Maltose, Laktase spaltet Laktose, Lipase spaltet Lipide, also Fette.' },
    ],
    yt: [
      { title: 'Enzyme – Definition, Aufbau und Funktion', ch: 'Studyflix', url: 'https://studyflix.de/biologie/enzyme-2662/video' },
      { title: 'Enzyme – Aufbau und Wirkungsweise (Schlüssel-Schloss-Prinzip)', ch: 'TeacherToby', url: 'https://www.youtube.com/watch?v=tPwe3KnY9fs' },
      { title: 'Proteinverdauung einfach erklärt', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=wpgtg30-JVs' },
    ],
    q: [
      { t: 'grid', q: 'Ergänze die Enzym-Tabelle.' },
      F('Wo wird Pepsin (als Pepsinogen) gebildet?', 'Magen', ['Hauptzellen', 'Magenschleimhaut', 'in den Hauptzellen des Magens', 'im Magen'], ['Bauchspeicheldrüse', 'Leber', 'Speicheldrüsen'], 'In den Hauptzellen der Magenschleimhaut.'),
      F('Welches Enzym spaltet Fette?', 'Lipase', [], ['Galle', 'Amylase', 'Pepsin'], 'Die Galle emulgiert nur, die Lipase spaltet.'),
      F('Wo wird die Lipase gebildet?', 'Bauchspeicheldrüse', ['Pankreas', 'Bauchspeicheldruese'], ['Leber', 'Gallenblase', 'Magen'], 'Die Bauchspeicheldrüse liefert Amylase, Trypsin, Lipase.'),
      F('Wo wird Trypsin gebildet?', 'Bauchspeicheldrüse', ['Pankreas', 'Bauchspeicheldruese'], ['Magen', 'Dünndarmschleimhaut', 'Leber'], 'In der Bauchspeicheldrüse. Es wirkt im Dünndarm.'),
      F('Was spaltet Trypsin?', 'Proteine', ['Eiweiße', 'Eiweiß', 'Peptide', 'Proteine und Peptide'], ['Stärke', 'Fette', 'Maltose'], 'Trypsin ist ein Eiweiß-spaltendes Enzym (eine Peptidase).'),
      F('Welches Enzym spaltet Stärke?', 'Amylase', [], ['Maltase', 'Lipase', 'Trypsin'], 'Amylase (Amylum = Stärke).'),
      F('Welches Enzym spaltet Laktose (Milchzucker)?', 'Laktase', ['Lactase'], ['Lipase', 'Maltase', 'Pepsin'], 'Laktase spaltet Laktose.'),
      F('Welche Enzyme spalten Peptide in Aminosäuren?', 'Peptidasen', ['Peptidase'], ['Amylasen', 'Lipasen', 'Hormone'], 'Peptid-asen spalten Peptide.'),
      MATCH('Enzym und Bildungsort', [['Amylase (Speichel)', 'Speicheldrüsen'], ['Pepsin', 'Magen'], ['Trypsin', 'Bauchspeicheldrüse'], ['Maltase', 'Dünndarmschleimhaut']]),
      MATCH('Enzym und Substrat', [['Amylase', 'Stärke'], ['Pepsin', 'Proteine'], ['Lipase', 'Fette'], ['Maltase', 'Maltose'], ['Laktase', 'Laktose']]),
      SORT('Enzym oder kein Enzym?', ['Enzym', 'kein Enzym'], [['Amylase', 0], ['Pepsin', 0], ['Lipase', 0], ['Trypsin', 0], ['Galle', 1], ['Salzsäure', 1], ['Insulin', 1], ['Schleim', 1]]),
      TF('Enzyme werden bei der Reaktion verbraucht.', false, 'Enzyme gehen unverändert aus der Reaktion hervor und können immer wieder arbeiten.'),
      TF('Ein Enzym kann alle Nährstoffe spalten.', false, 'Enzyme sind substratspezifisch (Schlüssel-Schloss-Prinzip).'),
      TF('Die Speichel-Amylase spaltet Stärke direkt zu Glucose.', false, 'Zu Maltose. Glucose entsteht erst durch die Maltase im Dünndarm.'),
      TF('Die Leber bildet Verdauungsenzyme.', false, 'Die Leber bildet die Galle, aber keine Verdauungsenzyme.'),
      TF('Die Lipase spaltet Fette in Glycerin und Fettsäuren.', true),
      TF('Die Maltase spaltet Maltose in Glucose.', true),
      MC('Was beschreibt das Schlüssel-Schloss-Prinzip?', 'Jedes Enzym passt nur zu einem bestimmten Substrat', ['Enzyme schließen den Magen ab', 'Enzyme werden mit einem Schlüssel aktiviert', 'Alle Enzyme passen zu allen Stoffen']),
      EXPLAIN('Erkläre das Schlüssel-Schloss-Prinzip.', ['Enzym und Substrat passen zusammen wie Schlüssel und Schloss', 'Darum spaltet jedes Enzym nur ein bestimmtes Substrat (substratspezifisch)', 'Beispiel: Amylase spaltet nur Stärke, nicht Eiweiß'], 'Ein Enzym hat eine Form, in die nur ein bestimmtes Substrat genau hineinpasst, wie ein Schlüssel ins Schloss. Deshalb spaltet jedes Enzym nur einen bestimmten Stoff. Zum Beispiel spaltet die Amylase Stärke, aber kein Eiweiß.'),
    ],
  },
  /* ================================================================ */
  {
    id: 'neuron', title: 'Die Nervenzelle (Neuron)', short: 'Nervenzelle', color: '#1fa99a', icon: '⚡', cat: 'pixel', page: 'Arbeitsblatt Neuron',
    story: 'Pixels Schnurrhaare kribbeln. Die Signale laufen über Nervenzellen. Kannst du so eine Zelle beschriften?',
    learn: `
<h2>Aufbau einer Nervenzelle</h2>
<p>Gleiches Bild und gleiche Nummern wie auf deinem Arbeitsblatt. Tipp auf eine Nummer, dann siehst du den Namen.</p>
<div class="figure" data-diagram="neuron" data-arrow="1"></div>
<div class="tablewrap"><table>
<tr><th>Nr.</th><th>Bezeichnung</th><th>Funktion <span class="tag warn">Zusatz</span></th></tr>
<tr><td>1</td><td><b>Endknöpfchen</b></td><td>nehmen Kontakt mit anderen Nerven-, Muskel- oder Drüsenzellen auf</td></tr>
<tr><td>2</td><td><b>Synapse</b></td><td>Kontaktstelle: Die Information wird auf die Zielzelle übertragen</td></tr>
<tr><td>3</td><td><b>Schwann’sche Zelle</b> (eine Gliazelle)</td><td>bildet die isolierende Schicht (= <b>Myelinscheide</b>, auch Markscheide)</td></tr>
<tr><td>4</td><td><b>Axon</b> (Neurit)</td><td>leitet die Impulse zu anderen Zellen weiter</td></tr>
<tr><td>5</td><td><b>Ranvier’scher Schnürring</b></td><td>Lücke in der Isolierung: Der Impuls springt von Lücke zu Lücke, das ist besonders schnell</td></tr>
<tr><td>6</td><td><b>Axonhügel</b></td><td>Hier wird das Aktionspotenzial ausgelöst, wenn der Schwellenwert überschritten wird</td></tr>
<tr><td>7</td><td><b>Dendriten</b></td><td>empfangen Signale von anderen Nervenzellen</td></tr>
<tr><td>8</td><td><b>Zellkörper</b> (Soma)</td><td>Stoffwechselzentrum, enthält den Großteil der Zellorganellen</td></tr>
<tr><td>9</td><td><b>Zellkern</b></td><td>Steuerzentrale der Nervenzelle</td></tr>
</table></div>
<div class="box merk"><span class="t">💡 Merksatz: Weg des Signals</span><b>D</b>ie <b>Z</b>auberkatze <b>A</b>hnt <b>A</b>lles, <b>E</b>hrlich <b>S</b>icher!<br><span class="small">Dendriten → Zellkörper → Axonhügel → Axon → Endknöpfchen → Synapse</span></div>
<div class="box tip"><span class="t">🔌 Bild im Kopf: die Nervenzelle als Ladekabel</span>
<b>Dendriten</b> = Antennen (empfangen) · <b>Zellkörper</b> = Fabrik · <b>Zellkern</b> = Chef · <b>Axonhügel</b> = Startknopf · <b>Axon</b> = Kabel · <b>Myelinscheide / Schwann’sche Zellen</b> = Isolierung am Kabel · <b>Ranvier’scher Schnürring</b> = Lücke in der Isolierung · <b>Endknöpfchen</b> = Stecker · <b>Synapse</b> = Steckdose zur nächsten Zelle</div>
<div class="box fix"><span class="t">⚠️ Kleine Korrekturen zum Arbeitsblatt</span>
<b>Nr. 3:</b> „Gliazelle“ passt. Genauer heißt sie <b>Schwann’sche Zelle</b>, eine bestimmte Gliazelle.<br>
<b>Nr. 8 (Funktion):</b> Nicht „Organe“, sondern <b>Zellorganellen</b> für den Zellstoffwechsel.<br>
<b>Richtung der Reizleitung:</b> Dein Pfeil (von den Dendriten zu den Endknöpfchen) ist richtig.</div>
<div class="box vet"><span class="t">🐾 Tierärztinnen-Wissen</span>Die Schnurrhaare einer Katze sind mit sehr vielen Nervenzellen verbunden. So spürt sie sogar kleine Luftbewegungen im Dunkeln.</div>
`,
    video: [
      { cat: 'doc', say: 'Jetzt kommt die Nervenzelle, auch Neuron genannt. Achtung, das Bild ist wie auf deinem Arbeitsblatt!' },
      { d: 'neuron', hl: ['dendriten'], say: 'Nummer sieben: die Dendriten. Sie sind wie Antennen und empfangen Signale von anderen Nervenzellen.' },
      { d: 'neuron', hl: ['zellkoerper', 'zellkern'], say: 'Nummer acht ist der Zellkörper, das Stoffwechselzentrum. Darin Nummer neun, der Zellkern, die Steuerzentrale.' },
      { d: 'neuron', hl: ['axonhuegel'], say: 'Nummer sechs: der Axonhügel. Hier startet das Signal, wenn es stark genug ist.' },
      { d: 'neuron', hl: ['axon'], say: 'Nummer vier: das Axon. Es ist das lange Kabel, das den Impuls weiterleitet.' },
      { d: 'neuron', hl: ['schwann'], say: 'Nummer drei: die Schwann’schen Zellen. Das sind Gliazellen, die sich um das Axon wickeln und die isolierende Myelinscheide bilden.' },
      { d: 'neuron', hl: ['ranvier'], say: 'Nummer fünf: die Ranvier’schen Schnürringe. Das sind die Lücken in der Isolierung. Der Impuls springt von Lücke zu Lücke, das macht ihn schnell.' },
      { d: 'neuron', hl: ['endknoepfchen'], say: 'Nummer eins: die Endknöpfchen am Ende des Axons. Sie sind wie Stecker.' },
      { d: 'neuron', hl: ['synapse'], say: 'Nummer zwei: die Synapse, die Kontaktstelle zur nächsten Zelle. Hier wird die Information übertragen.' },
      { big: 'Die Zauberkatze Ahnt Alles,\nEhrlich Sicher!', say: 'Merksatz für den Weg des Signals: Die Zauberkatze Ahnt Alles, Ehrlich Sicher! Dendriten, Zellkörper, Axonhügel, Axon, Endknöpfchen, Synapse.' },
    ],
    yt: [
      { title: 'Nervenzelle – Aufbau und Funktion (4:43)', ch: 'Studyflix', url: 'https://studyflix.de/biologie-schueler/nervenzelle-2737/video' },
      { title: 'Nervenzelle, Nerv, Axon, Synapsen – Grundbegriffe', ch: 'simpleclub', url: 'https://www.youtube.com/watch?v=20m6fhh-G7U' },
      { title: 'Nervenzelle Aufbau und Funktion', ch: 'Learning Level Up', url: 'https://www.youtube.com/watch?v=tiNWPKoUwkU' },
    ],
    q: [
      LABEL('neuron', 'all', 'Beschrifte die Nervenzelle (1 bis 9).'),
      LABEL('neuron', ['dendriten', 'zellkoerper', 'zellkern', 'axonhuegel', 'axon'], 'Beschrifte den Zellkörper-Bereich.'),
      LABEL('neuron', ['endknoepfchen', 'synapse', 'schwann', 'axon', 'ranvier'], 'Beschrifte den Axon-Bereich.'),
      ORDER('Weg des Signals durch die Nervenzelle', ['Dendriten', 'Zellkörper', 'Axonhügel', 'Axon', 'Endknöpfchen', 'Synapse'], 'Merksatz: Die Zauberkatze Ahnt Alles, Ehrlich Sicher!'),
      MATCH('Bild im Kopf: Was passt?', [['Dendriten', 'Antennen'], ['Axon', 'Kabel'], ['Myelinscheide', 'Isolierung'], ['Endknöpfchen', 'Stecker'], ['Zellkern', 'Chef / Steuerzentrale']]),
      F('Welche Fortsätze empfangen Signale von anderen Nervenzellen?', 'Dendriten', ['Dendrit'], ['Axon', 'Endknöpfchen', 'Synapse'], 'Dendriten = Antennen.'),
      F('Wie heißt der lange Fortsatz, der Impulse weiterleitet?', 'Axon', ['Neurit', 'Nervenfaser'], ['Dendrit', 'Zellkern', 'Synapse'], 'Axon = Kabel.'),
      F('Welche Zellen bilden die isolierende Myelinscheide?', 'Schwann’sche Zellen', ['Schwannsche Zellen', 'Schwann-Zellen', 'Schwann Zellen', 'Gliazellen', 'Schwannsche Zelle', 'Gliazelle'], ['Nervenzellen', 'Belegzellen', 'Zellkerne'], 'Schwann’sche Zellen sind Gliazellen.'),
      F('Wie heißen die Lücken zwischen den Schwann’schen Zellen?', 'Ranvier’sche Schnürringe', ['Ranviersche Schnürringe', 'Ranvierscher Schnürring', 'Schnürringe', 'Schnürring', 'Ranvier Schnürring'], ['Synapsen', 'Dendriten', 'Endknöpfchen'], 'Hier springt der Impuls, das macht die Leitung schnell.'),
      F('Wo wird das Aktionspotenzial ausgelöst?', 'Axonhügel', ['Axonhuegel'], ['Zellkern', 'Dendriten', 'Synapse'], 'Wenn der Schwellenwert überschritten wird.'),
      F('Wie heißt die Kontaktstelle zur nächsten Zelle?', 'Synapse', [], ['Axonhügel', 'Dendrit', 'Schnürring'], 'An der Synapse wird die Information übertragen.'),
      F('Was ist das Stoffwechselzentrum der Nervenzelle?', 'Zellkörper', ['Soma', 'Zellkoerper'], ['Zellkern', 'Axon', 'Dendrit'], 'Der Zellkörper enthält die meisten Zellorganellen.'),
      MC('Welches Wort meint dasselbe wie Myelinscheide?', 'Markscheide', ['Zellmembran', 'Synapse', 'Bürstensaum']),
      TF('Die Reizleitung läuft vom Endknöpfchen zu den Dendriten.', false, 'Umgekehrt: Dendriten → Zellkörper → Axon → Endknöpfchen.'),
      TF('Der Impuls springt von Schnürring zu Schnürring, deshalb ist die Leitung schnell.', true),
    ],
  },
];

/* ---------- the enzyme grid (used in 'grid' questions) ---------- */
export const ENZYME_GRID = {
  cols: ['Enzym', 'gebildet in', 'wirkt in', 'spaltet', 'zu'],
  rows: [
    [['Amylase (Speichel)', 'Amylase', 'Speichelamylase'], ['Speicheldrüsen', 'Mundspeicheldrüsen', 'Speicheldrüse'], ['Mund', 'Mundhöhle'], ['Stärke'], ['Maltose', 'Malzzucker']],
    [['Pepsin'], ['Magen', 'Hauptzellen', 'Magenschleimhaut'], ['Magen'], ['Proteine', 'Eiweiße', 'Eiweiß'], ['Peptide', 'Oligopeptide']],
    [['Lipase'], ['Bauchspeicheldrüse', 'Pankreas'], ['Dünndarm', 'Zwölffingerdarm'], ['Fette', 'Fett'], ['Glycerin und Fettsäuren', 'Fettsäuren und Glycerin', 'Glycerin + Fettsäuren', 'Fettsäuren + Glycerin']],
    [['Trypsin'], ['Bauchspeicheldrüse', 'Pankreas'], ['Dünndarm', 'Zwölffingerdarm'], ['Proteine', 'Eiweiße', 'Peptide'], ['Peptide', 'Aminosäuren', 'kürzere Peptide']],
    [['Maltase'], ['Dünndarm', 'Dünndarmschleimhaut'], ['Dünndarm'], ['Maltose'], ['Glucose', 'Glukose', 'Traubenzucker']],
    [['Peptidasen', 'Peptidase'], ['Dünndarm', 'Dünndarmschleimhaut'], ['Dünndarm'], ['Peptide'], ['Aminosäuren']],
    [['Laktase', 'Lactase'], ['Dünndarm', 'Dünndarmschleimhaut'], ['Dünndarm'], ['Laktose', 'Milchzucker'], ['Glucose und Galactose', 'Glucose + Galactose', 'Glukose und Galaktose']],
  ],
};

/* ---------- learning plan (Sun 8.11. – Fri 13.11.) ---------- */
export const PLAN = [
  { date: '2026-11-07', day: 'Sa', label: 'Start', tasks: [
    { id: 'p0a', text: 'App am iPhone zum Home-Bildschirm hinzufügen und Namen eintragen', link: '#/einstellungen' },
    { id: 'p0b', text: 'Ein Kapitel anschauen: Überblick (Film + Lernkarte)', link: '#/k/ueberblick' },
  ] },
  { date: '2026-11-08', day: 'So', label: '4–5 Std. · Grundlagen', tasks: [
    { id: 'p1a', text: 'Kalter Vortest (15 Min.): eine Schnell-Runde ohne vorher zu lernen. Fehler zeigen dir die Lücken.', link: '#/mix' },
    { id: 'p1b', text: 'Überblick + Mund & Zähne: Film, Lernkarte, Stufe 1', link: '#/k/ueberblick' },
    { id: 'p1c', text: 'Magen: Film, Lernkarte, Stufe 1', link: '#/k/magen' },
    { id: 'p1d', text: 'Leber & Co.: Film, Lernkarte, Stufe 1', link: '#/k/leber' },
    { id: 'p1e', text: 'Verdauungsorgane einmal aus dem Kopf auf Papier zeichnen und beschriften, dann mit der App vergleichen', link: '#/bild/organe' },
    { id: 'p1f', text: 'Zum Abschluss: gemischte Schnell-Runde', link: '#/mix' },
  ] },
  { date: '2026-11-09', day: 'Mo', label: '4–5 Std. · Enzyme + Nervenzelle', tasks: [
    { id: 'p2a', text: 'Aufwärmen: Wiederholung der Fehler von gestern', link: '#/mix' },
    { id: 'p2b', text: 'Dünndarm + Vom Nährstoff zum Baustein (die Katzen-Stelle!): Film, Lernkarte, Stufe 1', link: '#/k/abbau' },
    { id: 'p2c', text: 'Alle Enzyme: Tabelle lernen, Stufe 1', link: '#/k/enzyme' },
    { id: 'p2d', text: 'Nervenzelle: Film, dann 3× beschriften (Stufe 1, danach Stufe 2)', link: '#/k/neuron' },
    { id: 'p2e', text: 'Zöliakie + Dickdarm: Film, Lernkarte, Stufe 1', link: '#/k/zoeliakie' },
    { id: 'p2f', text: 'Erste Tipp-Runden (Stufe 2) in zwei Kapiteln deiner Wahl', link: '#/' },
  ] },
  { date: '2026-11-10', day: 'Di', label: 'Abend ~1 Std. · Wiederholen', tasks: [
    { id: 'p3a', text: '25 Min. Schnell-Runden (die App mischt alle Themen)', link: '#/mix' },
    { id: 'p3b', text: 'Nervenzelle und Enzym-Tabelle in Stufe 2 (tippen)', link: '#/k/enzyme' },
    { id: 'p3c', text: 'Drei Warum-Fragen laut jemandem erklären (z. B. Warum ist Galle kein Enzym?)', link: '' },
  ] },
  { date: '2026-11-11', day: 'Mi', label: '4 Std. · Generalprobe', tasks: [
    { id: 'p4a', text: 'Probearbeit 1 (20 Min., wie echt)', link: '#/probe' },
    { id: 'p4b', text: 'Fehler anschauen und schwache Kapitel in Stufe 2 üben', link: '#/' },
    { id: 'p4c', text: 'Alle Erklär-Fragen einmal schriftlich beantworten', link: '#/' },
    { id: 'p4d', text: 'Probearbeit 2, Ziel: über 90 %', link: '#/probe' },
  ] },
  { date: '2026-11-12', day: 'Do', label: 'max. 45 Min. · Ruhig bleiben', tasks: [
    { id: 'p5a', text: 'Eine Schnell-Runde + Nervenzelle 1× beschriften', link: '#/mix' },
    { id: 'p5b', text: 'Früh schlafen gehen. Im Schlaf speichert das Gehirn alles ab! 😴', link: '' },
  ] },
  { date: '2026-11-13', day: 'Fr', label: 'Bio-Test! 🍀', tasks: [
    { id: 'p6a', text: 'Frühstücken, 10 Fragen zum Aufwärmen, nichts Neues mehr', link: '#/mix' },
    { id: 'p6b', text: 'Im Test: zuerst alles Sichere beantworten. Genau lesen: nennen ≠ erklären', link: '' },
  ] },
];

/* Attach stable ids to every question. */
for (const ch of CHAPTERS) ch.q.forEach((q, i) => { q.id = `${ch.id}-${i}`; q.ch = ch.id; });
export const chapterById = (id) => CHAPTERS.find((c) => c.id === id);
export const ALL_QUESTIONS = CHAPTERS.flatMap((c) => c.q);

/* ---------- Steckbrief-Karten (Quartett style): compact facts per organ / enzyme / part ---------- */
export const CARDS = {
  ueberblick: [
    { t: 'Verdauung', ic: '🍽️', d: 'organe', hl: [], rows: [['Was?', 'große Nährstoffe → kleine Grundbausteine'], ['Mechanisch', 'Zähne zerkleinern, Magen knetet'], ['Chemisch', 'Enzyme spalten (wie Scheren)'], ['Beispiel', 'Proteine → Aminosäuren']], tip: 'Verdauung = zerkleinern + spalten' },
    { t: 'Weg der Nahrung', ic: '🗺️', d: 'organe', hl: ['speiseroehre', 'magen', 'duenndarm', 'dickdarm', 'mastdarm'], rows: [['1–3', 'Mund → Speiseröhre → Magen'], ['4–5', 'Dünndarm → Dickdarm'], ['6–7', 'Mastdarm → After'], ['Verdauung mit Enzymen', 'Mund, Magen, Dünndarm']], tip: 'Meine Süße Mieze Döst Den Mittag Ab' },
    { t: 'Helfer-Drüsen', ic: '🧪', d: 'organe', hl: ['ohrspeicheldruese', 'unterkieferspeicheldruese', 'unterzungenspeicheldruese', 'leber', 'gallenblase', 'bauchspeicheldruese'], rows: [['Speicheldrüsen', 'Speichel mit Amylase'], ['Leber + Gallenblase', 'Galle (emulgiert Fett)'], ['Bauchspeicheldrüse', 'Amylase, Trypsin, Lipase'], ['Besonders', 'keine Nahrung geht durch sie hindurch']], tip: 'Sie liefern Säfte in den Darm' },
  ],
  mund: [
    { t: 'Mundhöhle', ic: '👄', d: 'organe', hl: ['zaehne', 'zunge', 'ohrspeicheldruese', 'unterkieferspeicheldruese', 'unterzungenspeicheldruese'], rows: [['Speichel/Tag', '1–1,5 Liter'], ['Große Drüsen', 'Ohr-, Unterkiefer-, Unterzungenspeicheldrüse'], ['Enzym', 'Amylase'], ['spaltet', 'Stärke → Maltose']], tip: 'Lange gekautes Brot schmeckt süß' },
    { t: 'Dauergebiss', ic: '🦷', d: 'zaehne', hl: [], rows: [['Anzahl', '32 Zähne'], ['Zahnformel', '2-1-2-3 (I-C-P-M)'], ['Vorne → hinten', 'Schneide-, Eck-, Backen-, Mahlzähne'], ['Ganz hinten', 'Weisheitszähne']], tip: '2-1-2-3 → 32' },
    { t: 'Milchgebiss', ic: '🍼', d: 'zaehne', hl: ['schneidezaehne', 'eckzaehne', 'mahlzaehne'], rows: [['Anzahl', '20 Zähne'], ['Zahnformel', '2-1-2 (I-C-M)'], ['Fehlt', 'keine Prämolaren (Backenzähne)']], tip: '2-1-2 → 20' },
    { t: 'Schneidezähne', ic: '✂️', d: 'zaehne', hl: ['schneidezaehne'], rows: [['Nr.', '1'], ['Latein', 'Incisivi (I)'], ['Aufgabe', 'abbeißen, abschneiden']] },
    { t: 'Eckzähne', ic: '🐯', d: 'zaehne', hl: ['eckzaehne'], rows: [['Nr.', '2'], ['Latein', 'Canini (C)'], ['Aufgabe', 'festhalten, abreißen'], ['Bei Katzen', 'lange Fangzähne']] },
    { t: 'Backenzähne', ic: '🔨', d: 'zaehne', hl: ['backenzaehne'], rows: [['Nr.', '3'], ['Latein', 'Prämolaren (P)'], ['Kaufläche', '2 Höcker'], ['Aufgabe', 'zerkleinern, zermahlen']] },
    { t: 'Mahlzähne', ic: '⚙️', d: 'zaehne', hl: ['mahlzaehne', 'weisheitszaehne'], rows: [['Nr.', '4 (5 = Weisheitszahn)'], ['Latein', 'Molaren (M)'], ['Kaufläche', 'mehrere Höcker'], ['Aufgabe', 'zermahlen']] },
    { t: 'Speiseröhre', ic: '🛝', d: 'organe', hl: ['speiseroehre'], rows: [['Verdauung', 'keine, nur Transport'], ['Transport', 'Peristaltik (wellenförmig)'], ['Schutz', 'Kehldeckel schließt die Luftröhre'], ['Am Ende', 'Schließmuskel = Ventil']], tip: 'Schlucken geht sogar im Kopfstand' },
  ],
  magen: [
    { t: 'Magen', ic: '🫄', d: 'magen', hl: ['magen'], rows: [['Form', 'sackartig'], ['Fassungsvermögen', '1,5–2 Liter'], ['Magensaft/Tag', 'ca. 2 Liter'], ['Eingang / Ausgang', 'Magenmund / Pförtner'], ['Enzym', 'Pepsin (Proteine → Peptide)']], tip: 'speichern · kneten · verdauen' },
    { t: 'Belegzellen', ic: '🧯', d: 'schleimhaut', hl: ['belegzelle'], rows: [['bilden', 'Salzsäure (pH 2)'], ['Wirkung', 'tötet Bakterien, Nahrung quillt auf'], ['Extra', 'macht Pepsinogen → Pepsin']], tip: 'belegen alles mit Säure' },
    { t: 'Hauptzellen', ic: '✂️', d: 'schleimhaut', hl: ['hauptzelle'], rows: [['bilden', 'Pepsinogen'], ['Was ist das?', 'inaktive Vorstufe von Pepsin'], ['Warum inaktiv?', 'Schutz vor Selbstverdauung']], tip: 'machen die Hauptsache: das Enzym' },
    { t: 'Nebenzellen', ic: '🛡️', d: 'schleimhaut', hl: ['nebenzelle', 'schleim'], rows: [['bilden', 'Magenschleim'], ['Wirkung', 'schützt die Magenwand vor Säure und Selbstverdauung']], tip: 'schützen nebenbei mit Schleim' },
    { t: 'Sodbrennen', ic: '🔥', d: 'magen', hl: ['magenmund', 'speiseroehre'], rows: [['Was?', 'brennender Schmerz hinter dem Brustbein'], ['Warum?', 'Magensäure fließt in die Speiseröhre zurück'], ['Schuld', 'Schließmuskel am Magenmund schließt nicht dicht']] },
  ],
  leber: [
    { t: 'Leber', ic: '🟤', d: 'leber', hl: ['leber'], rows: [['Gewicht', '1,5–2 kg, zweilappig'], ['Spitzname', 'Stoffwechselzentrum, größte Drüse'], ['bildet', 'Galle, Gerinnungsfaktoren'], ['baut auf', 'Fette, Eiweiße, Glykogen'], ['entgiftet', 'Alkohol, Medikamente'], ['speichert', 'Eisen, Vitamin A']], tip: 'bildet KEINE Verdauungsenzyme' },
    { t: 'Pfortader', ic: '🚌', d: 'leber', hl: ['pfortader'], rows: [['von', 'Darm'], ['nach', 'Leber'], ['bringt', 'Glucose, Aminosäuren']] },
    { t: 'Gallenblase & Galle', ic: '🧴', d: 'leber', hl: ['gallenblase'], rows: [['Galle gebildet in', 'Leber'], ['gespeichert in', 'Gallenblase'], ['fließt in', 'Zwölffingerdarm'], ['Wirkung', 'emulgiert Fette zu Tröpfchen'], ['Enzym?', 'NEIN']], tip: 'Galle = Spülmittel' },
    { t: 'Bauchspeicheldrüse', ic: '🧪', d: 'leber', hl: ['bauchspeicheldruese'], rows: [['Fachwort', 'Pankreas'], ['Enzyme', 'Amylase, Trypsin, Lipase'], ['Hormone', 'Insulin ⬇︎, Glucagon ⬆︎ (Blutzucker)'], ['Saft macht den Brei', 'alkalisch (pH über 7)']], tip: 'Alle Tiere Lieben Katzen' },
  ],
  duenndarm: [
    { t: 'Dünndarm', ic: '🌀', d: 'organe', hl: ['zwoelffingerdarm', 'duenndarm'], rows: [['Länge', '5–6 m (längster Abschnitt)'], ['Durchmesser', '2,5 cm'], ['Beginnt mit', 'Zwölffingerdarm (ca. 30 cm)'], ['Hier münden', 'Galle + Bauchspeichel'], ['Aufgabe', 'fertig verdauen + aufnehmen']] },
    { t: 'Darmzotte', ic: '🖐️', d: 'zotte', hl: ['darmzotte'], rows: [['Was?', 'fingerförmige Ausstülpung'], ['Innen', 'Blutgefäße (Kapillaren) + Lymphgefäß'], ['Außen', 'Darmzellen mit Mikrovilli']] },
    { t: 'Mikrovilli', ic: '🪥', d: 'zotte', hl: ['mikrovilli', 'darmzelle'], rows: [['Was?', 'winzige Ausstülpungen der Darmzellen'], ['Zusammen', 'Bürstensaum'], ['Wozu?', 'noch mehr Oberfläche']] },
    { t: 'Oberflächenvergrößerung', ic: '📐', d: 'zotte', hl: ['darmzotte', 'mikrovilli'], rows: [['Stufe 1', 'Falten (Ringfalten)'], ['Stufe 2', 'Darmzotten'], ['Stufe 3', 'Mikrovilli'], ['Nutzen', 'mehr Kontaktfläche, mehr Nährstoffe aufnehmen'], ['Größe', 'Heft: ca. 1 Tennisplatz']], tip: 'groß → klein → winzig' },
    { t: 'Blut oder Lymphe?', ic: '🚦', d: 'zotte', hl: ['blutgefaess', 'lymphgefaess'], rows: [['ins Blut', 'Glucose, Aminosäuren'], ['weiter zur', 'Leber (über die Pfortader)'], ['in die Lymphe', 'Fettsäuren, Glycerin'], ['später', 'über obere Hohlvene ins Blut']], tip: 'Blut-Bus 🚌 und Lymph-Boot ⛵' },
  ],
  abbau: [
    { t: 'Kohlenhydrate', ic: '🍞', d: 'abbau', hl: ['staerke', 'maltose', 'glucose'], rows: [['Beispiel', 'Stärke (lange Ringkette)'], ['1. Enzym', 'Amylase (Mund, Bauchspeicheldrüse)'], ['Zwischenstufe', 'Maltose (2 Ringe)'], ['2. Enzym', 'Maltase (Dünndarm)'], ['Baustein', 'Glucose → Blut'], ['Energie', 'ca. 17 kJ/g']] },
    { t: 'Proteine', ic: '🥚', d: 'abbau', hl: ['proteine', 'oligopeptide', 'aminosaeuren'], rows: [['auch genannt', 'Eiweiße'], ['1. Enzyme', 'Pepsin (Magen), Trypsin (Bauchspeicheldr.)'], ['Zwischenstufe', 'Oligopeptide (kurze Ketten)'], ['2. Enzyme', 'Peptidasen (Dünndarm)'], ['Baustein', 'Aminosäuren → Blut'], ['Aufgabe', 'Baustoff (Muskeln, Enzyme …)']] },
    { t: 'Fette', ic: '🧈', d: 'abbau', hl: ['fette', 'glycerin', 'fettsaeuren'], rows: [['Aufbau', 'Glycerin + 3 Fettsäuren („Kamm“)'], ['Vorbereitung', 'Galle emulgiert'], ['Enzym', 'Lipase'], ['Bausteine', 'Glycerin + Fettsäuren → Lymphe'], ['Energie', 'ca. 39 kJ/g (am meisten!)']] },
  ],
  zoeliakie: [
    { t: 'Zöliakie', ic: '🌾', d: 'zotte', hl: ['darmzotte'], rows: [['Was?', 'Glutenunverträglichkeit'], ['Gluten', 'Klebereiweiß im Getreide'], ['Folge im Darm', 'Entzündung, Zotten klein und flach'], ['Symptome', 'Müdigkeit, Bauchweh, Durchfall']], tip: 'kleine Zotten = kleine Oberfläche' },
    { t: 'Intoleranz', ic: '🚫', rows: [['Ursache', 'Enzymdefekt (angeboren oder erworben)'], ['Laktose', 'Laktase fehlt'], ['Histamin', 'DAO fehlt'], ['erbliche Fruktose', 'Aldolase B fehlt']], tip: 'Intoleranz ≠ Allergie' },
    { t: 'Allergie', ic: '🤧', rows: [['Ursache', 'Überreaktion des Immunsystems'], ['worauf?', 'auf eigentlich harmlose Stoffe']] },
  ],
  dickdarm: [
    { t: 'Dickdarm', ic: '🖼️', d: 'organe', hl: ['dickdarm'], rows: [['Länge', 'ca. 1,5 m'], ['Durchmesser', '5–8 cm'], ['Zotten', 'keine'], ['Aufgabe', 'Wasser + Elektrolyte zurückholen'], ['Lage', 'wie ein Bilderrahmen um den Dünndarm']] },
    { t: 'Blinddarm & Wurmfortsatz', ic: '🪱', d: 'organe', hl: ['blinddarm'], rows: [['Lage', 'Anfang des Dickdarms'], ['Wurmfortsatz', 'ca. 10 cm'], ['Aufgabe', 'Immunabwehr (viele Lymphknoten)'], ['„Blinddarm-OP“', 'entfernt wird der Wurmfortsatz']] },
    { t: 'Darmflora', ic: '🦠', d: 'organe', hl: ['dickdarm'], rows: [['Wer?', 'Bakterien, Archaeen, Einzeller'], ['auch genannt', 'Mikrobiom'], ['bauen ab', 'Cellulose (für uns unverdaulich)'], ['Nebenprodukt', 'Gase, 0,5–1,5 l pro Tag']] },
    { t: 'Mastdarm & After', ic: '🚪', d: 'organe', hl: ['mastdarm', 'after'], rows: [['Mastdarm', 'Endabschnitt, sammelt den Kot'], ['löst aus', 'Stuhldrang'], ['After', 'durch Schließmuskel verschlossen']] },
  ],
  enzyme: [
    { t: 'Amylase', ic: '🍞', rows: [['gebildet in', 'Speicheldrüsen + Bauchspeicheldrüse'], ['wirkt in', 'Mund + Dünndarm'], ['spaltet', 'Stärke'], ['zu', 'Maltose']], tip: 'Amylum = Stärke' },
    { t: 'Pepsin', ic: '🥩', rows: [['Vorstufe', 'Pepsinogen (aus den Hauptzellen)'], ['aktiviert durch', 'Salzsäure'], ['wirkt in', 'Magen (pH 2)'], ['spaltet', 'Proteine'], ['zu', 'Peptide']] },
    { t: 'Trypsin', ic: '🧀', rows: [['gebildet in', 'Bauchspeicheldrüse'], ['wirkt in', 'Dünndarm'], ['spaltet', 'Proteine, Peptide'], ['zu', 'kürzere Peptide / Aminosäuren'], ['Partner', 'Chymotrypsin']] },
    { t: 'Lipase', ic: '🧈', rows: [['gebildet in', 'Bauchspeicheldrüse'], ['wirkt in', 'Dünndarm'], ['spaltet', 'Fette (vorher von Galle emulgiert)'], ['zu', 'Glycerin + Fettsäuren']], tip: 'Lip-ase → Lipide' },
    { t: 'Maltase', ic: '🍬', rows: [['gebildet in', 'Dünndarmschleimhaut'], ['wirkt in', 'Dünndarm'], ['spaltet', 'Maltose'], ['zu', 'Glucose']], tip: 'Malt-ase → Malt-ose' },
    { t: 'Peptidasen', ic: '🔗', rows: [['gebildet in', 'Dünndarmschleimhaut'], ['wirkt in', 'Dünndarm'], ['spaltet', 'Peptide'], ['zu', 'Aminosäuren']] },
    { t: 'Laktase', ic: '🥛', rows: [['gebildet in', 'Dünndarmschleimhaut'], ['spaltet', 'Laktose (Milchzucker)'], ['zu', 'Glucose + Galactose'], ['fehlt bei', 'Laktoseintoleranz']] },
    { t: 'KEIN Enzym!', ic: '⚠️', rows: [['Galle', 'emulgiert Fett (Leber → Gallenblase)'], ['Salzsäure', 'aktiviert Pepsin, tötet Bakterien'], ['Schleim', 'schützt die Magenwand'], ['Insulin, Glucagon', 'Hormone']], tip: 'Fallen im Test!' },
  ],
  neuron: [
    { t: 'Endknöpfchen', n: 1, ic: '🔌', d: 'neuron', hl: ['endknoepfchen'], rows: [['Nr.', '1'], ['Bild im Kopf', 'Stecker'], ['Aufgabe', 'Kontakt zu Nerven-, Muskel-, Drüsenzellen']] },
    { t: 'Synapse', n: 2, ic: '🤝', d: 'neuron', hl: ['synapse'], rows: [['Nr.', '2'], ['Bild im Kopf', 'Steckdose'], ['Aufgabe', 'überträgt die Information auf die Zielzelle']] },
    { t: 'Schwann’sche Zelle', n: 3, ic: '🧣', d: 'neuron', hl: ['schwann'], rows: [['Nr.', '3'], ['Art', 'Gliazelle (Hüllzelle)'], ['bildet', 'Myelinscheide = Markscheide'], ['Bild im Kopf', 'Isolierung am Kabel']] },
    { t: 'Axon', n: 4, ic: '🔋', d: 'neuron', hl: ['axon'], rows: [['Nr.', '4'], ['auch', 'Neurit'], ['Bild im Kopf', 'Kabel'], ['Aufgabe', 'leitet Impulse weiter']] },
    { t: 'Ranvier’scher Schnürring', n: 5, ic: '🦘', d: 'neuron', hl: ['ranvier'], rows: [['Nr.', '5'], ['Was?', 'Lücke zwischen Schwann’schen Zellen'], ['Aufgabe', 'Impuls springt → schnelle Leitung']] },
    { t: 'Axonhügel', n: 6, ic: '🚦', d: 'neuron', hl: ['axonhuegel'], rows: [['Nr.', '6'], ['Bild im Kopf', 'Startknopf'], ['Aufgabe', 'hier startet das Aktionspotenzial']] },
    { t: 'Dendriten', n: 7, ic: '📡', d: 'neuron', hl: ['dendriten'], rows: [['Nr.', '7'], ['Bild im Kopf', 'Antennen'], ['Aufgabe', 'empfangen Signale']] },
    { t: 'Zellkörper', n: 8, ic: '🏭', d: 'neuron', hl: ['zellkoerper'], rows: [['Nr.', '8'], ['auch', 'Soma'], ['Aufgabe', 'Stoffwechselzentrum, enthält die Zellorganellen']] },
    { t: 'Zellkern', n: 9, ic: '👑', d: 'neuron', hl: ['zellkern'], rows: [['Nr.', '9'], ['Bild im Kopf', 'Chef'], ['Aufgabe', 'Steuerzentrale der Nervenzelle']] },
  ],
};
