---
date: 2026-10-01
topic: "Tokens, Bugs, Leben"
slice: 3
tags: [spec]
status: ready
---

# SPEC: Tokens, Bugs, Leben

## Goal

Level 1 wird zum echten Grundspiel: Claudia sammelt Tokens, besiegt Bugs durch Draufspringen und
verliert bei seitlicher Berührung oder im Abgrund ein Leben, mit Todesspruch. Sie steigt am Start
oder am Checkpoint wieder ein, und die Anzeige oben zeigt Leben, Tokens und Score. Alles verhält
sich wie im Prototyp.

## User story

Als Spielerin oder Spieler möchte ich Tokens sammeln, Bugs plattmachen und mit drei Leben
auskommen müssen, damit Level 1 eine echte Herausforderung mit Punkten ist und nicht nur ein
Laufweg.

## Flow

1. Ich öffne die Seite und bin wie bisher sofort in Level 1. Oben links steht die Anzeige mit
   `x3`, `Tokens 0` und `Score 0`, rechts oben `RAM-Dschungel`.
2. Ich laufe los. Überall schweben Tokens, und 7 Bugs laufen auf dem Boden hin und her.
3. Berühre ich einen Token, verschwindet er mit Partikeln. Tokens +1, Score +10. Beim 25. Token
   schwebt „Kontext +25 Tokens“ hoch.
4. Springe ich von oben auf einen Bug, wird er plattgedrückt und verschwindet. Ein Spruch wie
   „LGTM!“ schwebt hoch, Score +100, und Claudia prallt ab.
5. Berühre ich einen Bug seitlich oder falle in einen Abgrund, beginnt der **Todesablauf**:
   - Das Bild wackelt, Claudia zerplatzt in Partikel und ist weg.
   - Ein dunkelroter Balken zeigt einen zufälligen Todesspruch und darunter „Noch 2 Leben“.
   - Die Anzeige oben zeigt sofort `x2`.
   - Die Bugs laufen weiter, Steuerung wirkt nicht.
6. Nach 3,2 s, oder früher mit ENTER (frühestens nach 0,7 s), steht Claudia wieder da: am Start
   oder, falls aktiviert, am Checkpoint. Sie blinkt 1,5 s lang, und Bugs können ihr in dieser Zeit
   nichts tun.
7. Komme ich an der Diskette bei Spalte 64 vorbei (laufend oder im Sprung darüber), wird sie gelb,
   und „Autosave...“ schwebt hoch. Ab jetzt steige ich dort wieder ein.
8. Verliere ich das letzte Leben, steht im roten Balken „Keine Leben mehr...“. Nach dem Todesablauf
   erscheint der Game-Over-Platzhalter „KONTEXTFENSTER VOLL“. Nach 1,2 s kommt „ENTER: nochmal“,
   und ENTER startet Level 1 komplett neu.
9. Erreiche ich das OUTPUT-Terminal, bleibt das Spiel stehen, und es erscheint „Task erfolgreich
   abgeschlossen ✓“ mit meinem Score. ENTER startet Level 1 komplett neu.

## Screen

```
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭───────────────────────────────────────╮                    RAM-Dschungel │
│ │ 🤖 x3   Tokens 12      Score 420      │                                   │
│ ╰───────────────────────────────────────╯                                   │
│                                                                            │
│        ════         ⬡⬡⬡⬡                                                    │
│                   Bug gefixt!   (schwebt hoch, verblasst)                  │
│   🤖              🐞                       💾  (Checkpoint, grau → gelb)    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Todesablauf (Spiel läuft im Hintergrund weiter, Claudia ist weg):
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│████████████████████████████████████████████████████████████████████████████│
│██████████████████████  Segmentation fault!  ███████████████████████████████│
│██████████████████████     Noch 2 Leben      ███████████████████████████████│
│████████████████████████████████████████████████████████████████████████████│
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Game-Over-Platzhalter (Spiel steht, halbtransparente Ebene):
┌────────────────────────────────────────────────────────────────────────────┐
│                          KONTEXTFENSTER VOLL                               │
│                 Game Over – die Session ist abgelaufen.                    │
│                              Score: 1230                                   │
│                            ENTER: nochmal        (erst nach 1,2 s)         │
└────────────────────────────────────────────────────────────────────────────┘

Ziel:
┌────────────────────────────────────────────────────────────────────────────┐
│                    Task erfolgreich abgeschlossen ✓                        │
│                              Score: 1230                                   │
│                            ENTER: nochmal                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

Alle Maße, Farben und Texte stehen in `docs/prototype-reference.md`, Abschnitt 7.

- **Anzeige oben (HUD)** — Feld oben links mit einem kleinen gezeichneten Roboter-Icon (Claudia),
  `x<Leben>` weiß, `Tokens <Zahl>` in der Akzentfarbe #3cff9a, `Score <Zahl>` gelb #ffd84a (ohne
  Tausenderpunkte). Rechts oben der Levelname ohne „Level 1: “, also `RAM-Dschungel`. Positionen,
  Größen und Schatten wie in Abschnitt 7 „HUD“.
- **Tokens** — die 49 echten Tokens aus der Level-Datei: grüne Sechsecke mit „T“, die schweben und
  sich scheinbar drehen.
- **Bugs** — die 7 Bugs aus der Level-Datei, im Code gezeichnet, ähnlich wie im Prototyp.
  Besiegte Bugs werden plattgedrückt und verschwinden nach 0,6 s, dazu pinke Partikel.
- **Checkpoint** — Diskette bei Spalte 64, grau (#4a5a7a), nach dem Aktivieren gelb (#ffd84a).
- **Schwebende Texte** — „Kontext +25 Tokens“, „1UP: Neue Session!“, Bug-Sprüche, „Autosave...“:
  steigen auf, werden durchsichtig und verschwinden nach 1,3 s.
- **Todes-Overlay** — dunkelroter Balken, Spruch groß in Rot #ff6b6b, darunter der Leben-Text weiß.
- **Game-Over-Platzhalter** — die Texte oben. „ENTER: nochmal“ erscheint erst nach 1,2 s.
- **Ziel-Overlay** — wie in Slice 1, zusätzlich `Score: <Zahl>`.

## Rules & edge cases

- **Tokens** — Zählen nur beim Spielen (nicht im Todesablauf, nicht nach dem Ziel). +10 Punkte pro
  Token. Genaue Trefferzone siehe Abschnitt 7.
- **Alle 25 Tokens** — Text „Kontext +N Tokens“ mit N = Token-Zähler, ohne Punkte und ohne Leben.
  Bei Vielfachen von 100 kommt stattdessen der 100er-Text.
- **Alle 100 Tokens** — +1 Leben und „1UP: Neue Session!“. Es gibt keine Höchstzahl an Leben.
  In Level 1 (49 Tokens) ist das nicht erreichbar und wird nur automatisch getestet.
- **Bugs laufen** — mit 60 px/s, starten nach links, drehen an Wänden, Plattformen, Levelrand und
  Abgrundkanten um. Sie laufen auch während des Todesablaufs weiter und stehen erst nach dem Ziel
  und beim Game Over still.
- **Draufspringen** — zählt, wenn Claudia sich nach unten bewegt und ihre Unterkante weniger als
  16 px unter der Oberkante des Bugs liegt. Sonst gilt es als seitlicher Treffer. +100, keine Kombo.
- **Abprallen** — mit gehaltener Sprungtaste 663 px/s nach oben, ohne effektiv 328 px/s (siehe
  Abschnitt 5).
- **Mehrere Bugs gleichzeitig** — Landet Claudia im selben Moment auf zwei Bugs, sind **beide**
  besiegt (je +100), und sie stirbt nicht. Das weicht bewusst vom Prototyp ab.
- **Seitlicher Treffer** — kostet ein Leben, außer Claudia ist gerade unverwundbar. Draufspringen
  wirkt auch während der Unverwundbarkeit.
- **Abgrund** — Tod, sobald Claudias Oberkante tiefer als 584 px ist (wie im Prototyp). Das ersetzt
  den einfachen Neustart nach 0,5 s aus Slice 1. Die Unverwundbarkeit schützt hier nicht.
- **Todesspruch** — zufällig aus den 9 Sprüchen in Abschnitt 7, Wiederholung direkt hintereinander
  erlaubt. „404: Claudia nicht gefunden“ statt „Claude“.
- **Leben-Text** — zeigt die verbleibenden Leben: „Noch 2 Leben“, „Noch 1 Leben“, beim letzten Tod
  „Keine Leben mehr...“. Die Anzeige oben zählt sofort beim Tod herunter.
- **Ende des Todesablaufs** — automatisch nach 3,2 s, oder mit ENTER ab 0,7 s. Die Sprungtaste
  überspringt nicht.
- **Wiedereinstieg** — Claudia steht sofort am Start (Spalte 2) oder, falls aktiviert, am
  Checkpoint (5 px rechts vom linken Rand der Checkpoint-Spalte, auf dem Boden). Sie steht still.
  Die Kamera springt sofort dorthin. 1,5 s unverwundbar, sichtbar durch Blinken.
- **Nach einem Tod** — Besiegte Bugs und gesammelte Tokens kommen **nicht** zurück. Score,
  Token-Zähler und Checkpoint bleiben. Lebende Bugs bleiben dort, wo sie gerade sind.
- **Checkpoint** — wird aktiviert, sobald Claudia waagerecht die Spalte 64 berührt, in jeder Höhe,
  auch im Sprung darüber. Nur einmal. Ist er aktiv, gilt er bis zum Neustart des Levels.
- **Game Over** — nach dem Todesablauf des letzten Lebens. Das Spiel steht. ENTER wirkt erst nach
  1,2 s und startet Level 1 komplett neu: 3 Leben, Score 0, Tokens 0, alle Bugs und Tokens wieder
  da, Checkpoint grau, Claudia am Start. Andere Tasten wirken nicht.
- **Ziel** — Das Spiel steht, Score bleibt unverändert (kein +500, kein Zeitbonus). ENTER startet
  wie beim Game Over komplett neu.
- **Effekte** — Partikel beim Token (6, grün), beim Bug (14, pink #ff5a8a) und beim Tod (30, orange
  #D97757). Beim Tod wackelt das Bild 0,3 s, beim Bug-Besiegen nicht.
- **Tab-Wechsel** — wie in Slice 1: Nach der Rückkehr springt nichts vor, auch nicht im
  Todesablauf.

## Out of scope

- Feedback-Frage „War diese Antwort hilfreich? 👍 👎“ nach dem Tod (Slice 7)
- Viren, Stacheln, Firewall samt „FW“-Anzeige, Fake-Plattform und Köder-Tokens bei Spalte 78,
  Prompt-Injector (Slice 7)
- Titelbild, Level-Intro, Pause, echtes Game Over mit halbiertem Score und ESC, Highscore,
  +500 und Zeitbonus am Ziel (Slice 4)
- Alle Geräusche und „Ton aus (M)“ (Slice 5)
- Prompt-Kanone, API-Leiste (Slice 6)
- Doppelsprung und „2x“-Anzeige, Level 2–4, Lava-Spruch (Slice 8)
- Boss und seine ausgespuckten Bugs (Slice 9)
- Touch-Knöpfe, Tippen statt ENTER (Slice 10)
- Weiches Nachgleiten der Kamera zum Wiedereinstiegspunkt

## Decisions already made

Settled during the interview — the plan must not ask these again.

- **Prototyp als Quelle** — Alle Texte, Zahlen, Farben und Maße kommen aus `game.html`. Sie stehen
  jetzt in `docs/prototype-reference.md`, Abschnitt 7 (eingepflegt während dieser Spec, ohne
  Doppelungen). Dabei wurden zwei ungenaue Angaben korrigiert: Abprallen ohne Sprungtaste effektiv
  328 px/s, und N in „Kontext +N Tokens“ ist der gesamte Token-Zähler.
- **Umbenennung** — In allen Texten „Claudia“ statt „Claude“.
- **Game-Over-Platzhalter** — Einfacher Bildschirm mit „KONTEXTFENSTER VOLL“, statt sofort neu zu
  starten. ENTER setzt alles auf null. Score halbieren, Highscore und ESC kommen erst in Slice 4.
- **Todesablauf ohne Feedback-Frage** — Zeiten wie im Prototyp (3,2 s, ENTER ab 0,7 s).
- **Abgrund ist ein echter Tod** — mit Leben, Spruch und Todesablauf, Grenze 584 px.
- **Ziel ohne Bonus** — nur Score anzeigen. ENTER startet alles neu, wie bisher zum bequemen Testen.
- **Alle Effekte jetzt** — Schwebetexte, Partikel, Plattdrücken, Wackeln und Blinken gehören zu
  diesem Slice, damit es sich wie das Spiel anfühlt.
- **Token-Meilensteine jetzt** — 25er-Text und 100er-Extraleben werden schon gebaut.
- **HUD nur mit den Teilen dieses Slices** — Icon, Leben, Tokens, Score, Levelname.
- **Kamera springt beim Wiedereinstieg** — wie in Slice 1. Das Nachgleiten aus dem Prototyp wurde
  bewusst weggelassen.
- **Zwei Bugs gleichzeitig** — Beide sind besiegt. Die Prototyp-Eigenheit, dass der zweite tötet,
  wurde als unfair abgelehnt.
- **Besiegte Bugs und Tokens bleiben weg** — nach einem Tod, wie im Prototyp.

## Acceptance criteria

- [ ] Oben links sehe ich ein kleines Roboter-Icon, „x3“, „Tokens 0“ (grün) und „Score 0“ (gelb), rechts oben „RAM-Dschungel“.
- [ ] In Level 1 schweben grüne Sechseck-Tokens mit „T“, die sich zu drehen scheinen. Bei Spalte 78 sind keine Tokens.
- [ ] Berühre ich einen Token, verschwindet er mit ein paar Partikeln, „Tokens“ steigt um 1 und „Score“ um 10.
- [ ] Beim 25. Token schwebt „Kontext +25 Tokens“ nach oben und verblasst.
- [ ] 7 Bugs laufen hin und her und drehen an Kanten und Wänden um. Sie fallen nie in einen Abgrund.
- [ ] Springe ich auf einen Bug, wird er plattgedrückt, verschwindet mit pinken Partikeln, ein Spruch wie „LGTM!“ schwebt hoch, der Score steigt um 100, und Claudia prallt ab (höher, wenn ich Springen halte).
- [ ] Berühre ich einen Bug von der Seite, wackelt das Bild, Claudia zerplatzt in orange Partikel, und ein roter Balken zeigt einen Todesspruch wie „Segmentation fault!“ und „Noch 2 Leben“. Oben steht „x2“.
- [ ] Nach gut 3 Sekunden (oder früher mit ENTER) steht Claudia wieder da und blinkt etwa 1,5 s. In dieser Zeit tut ihr ein Bug nichts.
- [ ] Falle ich in einen Abgrund, passiert dasselbe wie bei einem Bug-Treffer, mit Lebensverlust.
- [ ] Laufe oder springe ich über die Diskette bei Spalte 64, wird sie gelb, und „Autosave...“ erscheint. Sterbe ich danach, steige ich dort wieder ein, nicht am Start.
- [ ] Nach einem Tod bleiben besiegte Bugs und gesammelte Tokens weg, und Score und Tokens bleiben stehen.
- [ ] Beim letzten Tod steht „Keine Leben mehr...“. Danach kommt „KONTEXTFENSTER VOLL“ mit Score und nach kurzer Zeit „ENTER: nochmal“. ENTER startet Level 1 neu: x3, Score 0, Tokens 0, alle Bugs und Tokens wieder da, Diskette grau.
- [ ] Am OUTPUT-Terminal erscheint „Task erfolgreich abgeschlossen ✓“ mit meinem Score. ENTER startet alles neu wie nach dem Game Over.
- [ ] Springe ich auf zwei Bugs gleichzeitig, sind beide besiegt, und ich sterbe nicht.

Automatisch getestet, weil in Level 1 nicht erreichbar: Beim 100. Token gibt es +1 Leben und
„1UP: Neue Session!“.

## References

- docs/product.md — Slice 3
- docs/prototype-reference.md — Abschnitt 2 (Tokens, Bugs, Checkpoints), 4 (Leben, Checkpoint), 5 (Abprallen, Unverwundbarkeit), 7 (alle Details)
- docs/design.md — Screens „Spiel“ (Anzeige oben) und „Overlays“ (Tod, Game Over, Level geschafft), Style (Farben, Schwebetexte)
- docs/agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md — Abgrund und Ziel, die hier erweitert werden
