---
date: 2026-10-01
topic: "Claudia läuft durch Level 1"
slice: 1
tags: [spec]
status: ready
---

# SPEC: Claudia läuft durch Level 1

## Goal

Claudia lässt sich im Browser mit der Tastatur durch das Gelände von Level 1 „RAM-Dschungel“
steuern: laufen, springen, auf Plattformen landen, in Abgründe fallen und am OUTPUT-Terminal
ankommen. Die Bewegung fühlt sich genauso an wie im Prototyp.

## User story

Als Spielerin oder Spieler möchte ich Claudia durch Level 1 laufen und springen lassen, damit ich
sehe und spüre, dass Steuerung, Gelände und Kamera wie im Prototyp funktionieren.

## Flow

1. Ich öffne die Seite. Ohne Titelbild und ohne Intro bin ich sofort in Level 1. Claudia steht am
   Start (Spalte 2) auf dem Boden.
2. Mit ← → bzw. A D laufe ich, mit ↑ / W / Leertaste springe ich.
3. Die Kamera folgt Claudia waagerecht, und der Hintergrund zieht langsamer vorbei als der Boden.
4. Ich springe über Abgründe und auf Plattformen.
5. Falle ich in einen Abgrund, steht Claudia nach etwa 0,5 s wieder am Start, und die Kamera ist
   wieder vorne. Dann geht es weiter bei Schritt 2.
6. Berühre ich das OUTPUT-Terminal bei Spalte 125, bleibt das Spiel stehen und es erscheint
   „Task erfolgreich abgeschlossen ✓“.
7. Mit ENTER beginnt Level 1 von vorn (zurück zu Schritt 1, ohne neu zu laden).

## Screen

```
┌──────────────────────── 960 × 544, skaliert ───────────────────────┐
│  (Himmel: Farbverlauf #03140c → #0b3a22, grünes Leuchten #1aff8c,   │
│   Lianen in den vines-Farben – bewegt sich langsamer: Parallax)     │
│                                                                    │
│                  ════                                              │  ← Plattform Reihe 8
│                                                                    │
│        ════                                                        │  ← Plattform Reihe 11
│                                                                    │
│   🤖                                                                │  ← Claudia, Start Spalte 2
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Boden Reihe 15–16, Lücke
└────────────────────────────────────────────────────────────────────┘
           … 130 Kacheln weiter …                [>_] OUTPUT  (Spalte 125)

Nach Erreichen des Ziels:
┌────────────────────────────────────────────────────────────────────┐
│              (Spiel steht, halbtransparente Ebene)                  │
│                Task erfolgreich abgeschlossen ✓                     │
│                     ENTER: nochmal                                  │
└────────────────────────────────────────────────────────────────────┘
```

- **Rahmen**: dunkler, fast schwarzer Rand (#020a06) mit grünem Leuchten um die Spielfläche. Die
  Spielfläche (960 × 544) wird passend ins Fenster skaliert, ohne Verzerrung.
- **Hintergrund**: Himmel als Farbverlauf (`theme.sky`), grünes Leuchten (`theme.far`), Lianen in
  den `theme.vines`-Farben. Er bewegt sich langsamer als der Vordergrund (Parallax).
- **Boden**: Abschnitte laut `ground` aus Level 1, gefärbt in `theme.ground` mit hellerer Oberkante
  `theme.top`. Zwischen den Abschnitten liegen drei Abgründe mit je 4 Kacheln.
- **Plattformen**: die 10 festen Plattformen (`plats`) aus Level 1, im gleichen Farbschema.
- **Claudia**: kleine Roboterin, im Code gezeichnet, schaut in Laufrichtung, mit einfacher Lauf- und
  Sprunghaltung. Hitbox 22 × 28 px.
- **OUTPUT-Terminal**: bei Spalte 125, 48 × 64 px, Beschriftung „OUTPUT“, Akzentfarbe #3cff9a.
- **Ziel-Overlay**: „Task erfolgreich abgeschlossen ✓“ mit dem Hinweis, dass ENTER neu startet.
- **Fehlerhinweis**: Ist die Level-Datei fehlerhaft, zeigt die Spielfläche einen deutlichen Hinweis
  (z. B. „Level 1 konnte nicht geladen werden“ und was nicht stimmt) statt eines leeren Bildes.

## Rules & edge cases

- **Bewegungswerte** — Alle Werte aus `docs/prototype-reference.md`, Abschnitt 5 „Bewegung &
  Physik“, gelten exakt: Schwerkraft 2100 px/s², Sprung 780 px/s, Laufen max. 270 px/s,
  Beschleunigung 2600 px/s², Abbremsen 2400 px/s², max. Fallgeschwindigkeit 950 px/s. Beschleunigen
  und Bremsen gelten am Boden und in der Luft gleich. Gerechnet wird in festen Schritten von 1/60 s.
- **Variable Sprunghöhe** — Lässt man die Sprungtaste los, wird die Aufwärtsgeschwindigkeit auf
  höchstens 0,42 × 780 px/s gesenkt: kurzes Tippen = kleiner Hüpfer (≈ 0,8 Kacheln), langes Halten =
  voller Sprung (≈ 4,5 Kacheln).
- **Coyote Time** — Bis 0,1 s nach dem Verlassen einer Kante kann man noch springen.
- **Jump Buffer** — Ein Sprung, der bis 0,13 s vor der Landung gedrückt wurde, wird bei der Landung
  ausgeführt.
- **Kein Doppelsprung** — In diesem Slice gibt es nur einen Sprung. Der Doppelsprung kommt mit
  Level 3.
- **Plattformen sind massiv (wie im ersten Super Mario Bros.)** — Von oben landet man und kann darauf
  laufen. Springt man von unten dagegen, stößt Claudia sich den Kopf und fällt sofort zurück. Läuft
  man seitlich dagegen, bleibt sie stehen. Auf eine Plattform kommt man also nur, indem man seitlich
  daneben hochspringt.
- **Levelränder** — Links (Spalte 0) und rechts (Spalte 130) ist eine unsichtbare Wand. Nach oben
  ist keine Grenze nötig, denn Claudia erreicht den oberen Bildrand nicht.
- **Kamera** — Bewegt sich nur waagerecht, denn das Level ist genau eine Bildschirmhöhe (17 Reihen)
  hoch. Claudia bleibt etwa in der Bildmitte. Am Levelanfang und am Levelende bleibt die Kamera
  stehen, man sieht nie über den Levelrand hinaus.
- **Abgrund** — Fällt Claudia unten aus dem Bild, steht sie nach etwa 0,5 s wieder am Start
  (Spalte 2, Reihe 14), und die Kamera springt mit zurück. Es gibt keine Leben, keinen Todesspruch
  und kein Geräusch.
- **Ziel** — Die Trefferzone des Terminals ist so hoch wie das Terminal (64 px) und zählt auch im
  Sprung. Beim Berühren bleibt das Spiel stehen: Claudia bewegt sich nicht mehr, Tasten außer ENTER
  wirken nicht.
- **ENTER nach dem Ziel** — Startet Level 1 von vorn: Claudia am Start, Kamera vorne. ENTER während
  des Spiels bewirkt nichts.
- **Tab-Wechsel / Fenster im Hintergrund** — Kommt man zurück, läuft das Spiel dort weiter, wo es
  war. Claudia macht keinen Satz nach vorne und fällt nicht wegen der verstrichenen Zeit plötzlich
  in einen Abgrund.
- **Fenstergröße ändern** — Das Bild passt sich sofort an und bleibt unverzerrt.
- **Gleichzeitig links und rechts gedrückt** — Claudia bremst ab, als wäre keine Richtung gedrückt.
- **Level-Datei** — Level 1 liegt als eigene Datei vor und enthält **alle** Daten aus
  `docs/prototype-reference.md` (auch Tokens, Gegner, Fake-Plattform usw.), auch wenn in diesem
  Slice nur das Gelände genutzt wird. Die Datei wird beim Laden geprüft.
- **Level-Datei fehlerhaft** — Statt eines leeren Bildschirms erscheint ein deutlicher Fehlerhinweis
  (siehe Screen). Das Spiel startet dann nicht.
- **Andere Tasten** — X/F, P, M usw. bewirken in diesem Slice nichts.

## Out of scope

- Tokens, Bugs, Leben, Todessprüche, Checkpoints, Anzeige oben (Slice 3)
- Titelbild, Level-Intro, Pause, „Level geschafft“ mit Zeitbonus, Game Over, Highscore (Slice 4)
- Musik und Geräusche, Taste M (Slice 5)
- Prompt-Kanone, Taste X/F (Slice 6)
- Viren, Stacheln, Firewall, Halluzinations-Plattform (Spalte 78) samt Köder-Tokens,
  Prompt-Injector, „War diese Antwort hilfreich?“ (Slice 7)
- Doppelsprung, bewegliche Plattformen, Decke/Blöcke, Bröckel-Plattformen, Lava, Level 2–4 (Slice 8)
- Boss, Level 5, Abspann (Slice 9)
- Touch-Knöpfe am Handy (Slice 10)
- Online-Veröffentlichung (Slice 2)
- Pixelgenaues Aussehen von Claudia und Terminal wie im Prototyp (siehe Entscheidungen)

## Decisions already made

Settled during the interview — the plan must not ask these again.

- **Umfang** — Nur das Gelände von Level 1 (Boden, feste Plattformen, Abgründe, Hintergrund, Ziel).
  Gegner, Tokens und Fallen kommen in den späteren Slices.
- **Bewegungswerte** — Die Nutzerin bzw. der Nutzer hat die Werte aus `game.html` geliefert. Sie
  stehen jetzt in `docs/prototype-reference.md`, Abschnitt 5, und gelten exakt. `game.html` selbst
  liegt nicht im Projekt.
- **Plattformen massiv wie im ersten Super Mario Bros.** — Ausdrücklich gewünscht: Kopf stößt von
  unten an, seitlich stehen bleiben. Von unten durchlässige Plattformen wurden nicht gewählt.
- **Sofortstart ohne Titelbild** — Titelbild und Intro kommen in Slice 4.
- **Tasten** — ← → / A D laufen, ↑ / W / Leertaste springen.
- **Sprunghilfen** — Coyote Time, Jump Buffer und variable Sprunghöhe sind schon in diesem Slice
  aktiv.
- **Kamera** — Waagerecht, Claudia etwa mittig, stoppt an beiden Levelrändern. Weiches Nachziehen
  oder Vorlauf sind nicht gefordert.
- **Abgrund** — Nach ca. 0,5 s zurück zum Start, ohne Leben, Spruch oder Ton.
- **Ziel** — Spiel stoppt, Text „Task erfolgreich abgeschlossen ✓“, ENTER startet Level 1 neu
  (zum bequemen Mehrfach-Testen). Kein Score, kein Zeitbonus.
- **Fake-Plattform bei Spalte 78** — wird nicht gezeigt, sie gehört zu Slice 7.
- **Hintergrund mit Parallax** — Himmel-Verlauf, Leuchten, Lianen, langsamer als der Vordergrund.
- **Aussehen von Claudia** — Eine im Code gezeichnete kleine Roboterin, die dem Prototyp ähnelt,
  aber nicht pixelgenau gleich ist, weil der Zeichencode aus `game.html` nicht vorliegt.
- **Level-Datei vollständig** — Alle Level-1-Daten aus der Referenz werden jetzt schon übernommen,
  damit später nichts neu übertragen werden muss.
- **Tab-Wechsel** — Das Spiel springt nach der Rückkehr nicht vor.

## Acceptance criteria

- [x] Ich öffne die Seite und bin sofort in Level 1: Claudia steht links am Start auf dem Boden, dahinter grüner Dschungel mit Farbverlauf, Leuchten und Lianen.
- [x] Die Spielfläche füllt das Fenster ohne Verzerrung, außen herum ist ein dunkler Rand mit grünem Leuchten. Verkleinere ich das Fenster, passt sich das Bild an.
- [x] Mit ← → bzw. A D läuft Claudia, schaut in Laufrichtung und bleibt nach dem Loslassen fast sofort stehen.
- [x] Mit ↑ / W / Leertaste springt Claudia. Halte ich die Taste lange, springt sie hoch (gut 4 Kacheln). Tippe ich nur kurz, macht sie einen kleinen Hüpfer.
- [x] Laufe ich über eine Kante und drücke direkt danach Springen, springt Claudia trotzdem.
- [x] Drücke ich Springen kurz vor der Landung, springt Claudia beim Aufkommen sofort wieder ab.
- [x] Claudia kann auf jeder der 10 Plattformen landen und darauf laufen.
- [x] Springe ich von unten gegen eine Plattform, stößt Claudia sich den Kopf und fällt zurück. Laufe ich seitlich dagegen, bleibt sie stehen.
- [x] Laufe ich nach rechts, läuft die Kamera mit, Claudia bleibt ungefähr in der Bildmitte, und der Hintergrund bewegt sich langsamer als der Boden.
- [x] Am Levelanfang und am Levelende bleibt die Kamera stehen. Links und rechts kann Claudia nicht aus dem Level laufen.
- [x] Bei Spalte 78 ist keine Plattform zu sehen, und es gibt keine Tokens und keine Gegner.
- [x] Alle drei Abgründe lassen sich mit einem Anlauf-Sprung überspringen.
- [x] Falle ich in einen Abgrund, steht Claudia nach etwa einer halben Sekunde wieder am Start, und die Kamera ist wieder vorne.
- [x] Erreiche ich das OUTPUT-Terminal, auch im Sprung, bleibt das Spiel stehen und „Task erfolgreich abgeschlossen ✓“ erscheint.
- [x] Drücke ich danach ENTER, beginnt Level 1 von vorn.
- [x] Wechsle ich mitten im Spiel den Tab und komme zurück, steht Claudia noch an derselben Stelle.
- [x] Ist die Level-Datei kaputt, z. B. ein Komma gelöscht, sehe ich einen deutlichen Fehlerhinweis statt eines leeren Bildschirms.

## References

- docs/product.md — Slice 1
- docs/prototype-reference.md — Abschnitt 1 (Koordinaten), 2 (Level-Format), 3 (Level 1), 5 (Bewegung & Physik)
- docs/design.md — Style (Farben Level 1, Schrift), Screens „Spiel“ und „Overlays“ (Level geschafft), States „Error“
- docs/architecture.md — Building blocks (Spiellogik getrennt vom Zeichnen, Level-Dateien mit Prüfung), Constraints (960 × 544, skaliert)
