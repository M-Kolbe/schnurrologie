# 🐾 Schnurrologie – Bio lernen in der Katzenklinik

Eine Lern-App für den Bio-Test (5. Klasse AHS/BORG) zu **Verdauung, Verdauungsenzymen und Nervenzelle**.
Du bist Tierärztin in Ausbildung bei **Dr. Schnurrhaar**: Jedes Kapitel ist eine kranke Katze, die gesund wird, wenn du den Stoff kannst.

**Spielen:** https://m-kolbe.github.io/schnurrologie/

## Was drin ist

- **10 Kapitel** nach den 11 Arbeitsblatt-Seiten: Überblick, Mund & Zähne, Magen, Leber/Galle/Bauchspeicheldrüse, Dünndarm & Darmzotten, Vom Nährstoff zum Baustein, Zöliakie & Unverträglichkeiten, Dickdarm, Alle Enzyme, Nervenzelle
- **Steckbrief-Karten** (wie Quartett-Karten) pro Organ, Enzym und Nervenzellen-Teil, mit „Verdeckt üben“
- **Erklär-Filme** pro Kapitel: animierte Abbildungen mit Stimme und Untertiteln
- **Lernkarten** mit Merksätzen, Eselsbrücken und markierten **Korrekturen** (⚠️), wo das Arbeitsblatt oder eine Antwort nicht stimmte
- **Abbildungen zum Beschriften**, nachgezeichnet wie auf den Arbeitsblättern (Nervenzelle mit denselben Nummern 1–9)
- **Stufe 1 (antippen)**: Auswahl, Zuordnen, Reihenfolge, Sortieren, Lückentext, Beschriften, Enzym-Tabelle
- **Stufe 2 (eintippen)**: selbst schreiben, kleine Tippfehler werden verziehen und die richtige Schreibweise gezeigt
- **Schnell-Runde**: mischt alle Themen und fragt die schwächsten Karten zuerst ab
- **Probearbeit**: 20 Minuten, ca. 24 Punkte, Note am Ende, jedes Mal andere Aufgaben
- **Lernplan** bis zum Test, nach Lernforschung (Abfragen, verteilt lernen, mischen, schlafen)
- **Gamification**: Leckerli 🐟, Karriere von der Praktikantin zur Chefärztin, Pfoten-Serie 🐾, Combos 🔥, 16 Katzen zum Sammeln mit echtem Tierärztinnen-Wissen
- **Töne und Musik** werden live im Browser erzeugt (Miau, Schnurren, 3 Musikstücke), es gibt keine Audiodateien

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
js/cats.js          Dr. Schnurrhaar und alle Katzen (SVG)
js/audio.js         Töne und Musik (Web Audio)
js/store.js         Fortschritt, Ränge, Karteikasten
sw.js               Offline
```

Lokal starten: `python3 -m http.server` im Ordner, dann http://localhost:8000 öffnen.
