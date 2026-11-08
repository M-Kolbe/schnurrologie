# BioCoach – Bio lernen für den Test

Eine Lern-App für den Bio-Test (5. Klasse AHS/BORG) zu **Verdauung, Verdauungsenzymen und Nervenzelle**.
Jedes Kapitel zeigt mit einem Ring, wie sicher du es kannst. Ab 80 % ist es gemeistert und du bekommst sein Abzeichen.

**Spielen:** https://m-kolbe.github.io/schnurrologie/

## Was drin ist

- **10 Kapitel** nach den 11 Arbeitsblatt-Seiten: Überblick, Mund & Zähne, Magen, Leber/Galle/Bauchspeicheldrüse, Dünndarm & Darmzotten, Vom Nährstoff zum Baustein, Zöliakie & Unverträglichkeiten, Dickdarm, Alle Enzyme, Nervenzelle
- **Steckbrief-Karten** (wie Quartett-Karten) pro Organ, Enzym und Nervenzellen-Teil, mit „Verdeckt üben“
- **Erklär-Filme** pro Kapitel: animierte Abbildungen mit Stimme und Untertiteln
- **Lernkarten** mit Merksätzen, Eselsbrücken und markierten **Korrekturen** (⚠️), wo das Arbeitsblatt oder eine Antwort nicht stimmte
- **Abbildungen zum Beschriften**, nachgezeichnet wie auf den Arbeitsblättern (Nervenzelle mit denselben Nummern 1–9)
- **Stufe 1 (antippen)**: Auswahl, Zuordnen, Reihenfolge, Sortieren, Lückentext, Beschriften, Enzym-Tabelle
- **Stufe 2 (eintippen)**: selbst schreiben, kleine Tippfehler werden verziehen und die richtige Schreibweise gezeigt
- **Prüfstoff Seite für Seite**: jede Heftseite mit ihren Inhalten und allen Aufgaben vom Blatt als Übung (siehe [ABDECKUNG.md](ABDECKUNG.md))
- **Wer wird Bio-Profi?**: Quizshow mit 15 Stufen, 3 Jokern (50:50, Tipp, Tauschen) und 3 Leben
- **Der große Durchgang**: alle Aufgaben des Prüfstoffs am Stück, mit „sicher gewusst / geraten“; Geratenes kommt wieder
- **Schnell-Runde**: mischt alle Themen und fragt die schwächsten Karten zuerst ab
- **Probearbeit**: 20 Minuten, ca. 24 Punkte, Note am Ende, jedes Mal andere Aufgaben
- **Lernplan** bis zum Test, nach Lernforschung (Abfragen, verteilt lernen, mischen, schlafen)
- **Gamification**: Punkte ⭐, Ränge von der Einsteigerin bis zum Bio-Champion, Lern-Serie 🔥, Combos, 16 Abzeichen zum Sammeln, jedes mit einem „Wusstest du?“-Fakt
- **Töne und Musik** werden live im Browser erzeugt (Feedback-Klänge, 3 Musikstücke)
- **Stimme der Filme**: die beste deutsche Gerätestimme (Premium/Natural bevorzugt, in den Einstellungen wählbar). Optional echte KI-Sprachaufnahmen: `OPENAI_API_KEY=… node tools/make-audio.mjs` legt sie unter `audio/` ab

## Am iPhone installieren

1. Link in **Safari** öffnen
2. **Teilen** (Quadrat mit Pfeil) → **Zum Home-Bildschirm**

Danach startet die App wie eine echte App und läuft auch offline.

## Technik

Statische Web-App ohne Build-Schritt: HTML, CSS und JavaScript-Module. Es gibt kein Konto und kein Tracking.
Der Fortschritt bleibt nur im Browser des Geräts (`localStorage`). Ein Service Worker macht die App offline-fähig.

```
index.html          Einstieg
css/app.css         Aussehen (hell und dunkel)
js/app.js           Bildschirme und Navigation
js/engine.js        Aufgabentypen, Stufe 1/2, Probearbeit
js/content.js       Alle Inhalte, Fragen, Steckbrief-Karten, Lernplan
js/diagrams.js      Die nachgezeichneten Abbildungen (SVG)
js/brand.js         Logo, Abzeichen und Illustrationen (SVG)
js/audio.js         Töne und Musik (Web Audio)
js/store.js         Fortschritt, Ränge, Karteikasten
js/icons.js         Symbole
js/voice.js         Stimme der Erklär-Filme
tools/make-audio.mjs  KI-Sprachaufnahmen erzeugen (optional)
sw.js               Offline
```

Lokal starten: `python3 -m http.server` im Ordner, dann http://localhost:8000 öffnen.
