---
date: 2026-10-02
topic: "Prompt-Kanone"
slice: 6
tags: [spec]
status: done
---

# SPEC: Prompt-Kanone

## Goal

Mit X oder F schießt Claudia Prompts, also kleine Sprechblasen mit einem Befehl. Ein Treffer
verwandelt einen Bug in ein harmloses Haustier: Feature-Geschenk, Schmetterling, Gummiente oder
Cookie. Jeder Schuss kostet einen von 5 API-Credits. Die Credits laden gleichmäßig nach wie bei
einer echten API, und wer zu schnell feuert, bekommt „429 Too Many Requests“.

## User story

Als Spielerin oder Spieler möchte ich Bugs auch aus der Entfernung mit Prompts verwandeln können,
aber nicht endlos, damit ich eine zweite, witzige Art zu kämpfen habe, bei der ich mir meine
Credits einteilen muss.

## Flow

1. Ich spiele Level 1. Oben links, unter der bisherigen Anzeige, steht die API-Leiste mit 5 vollen
   hellgelben Kästchen.
2. Ich drücke X oder F. Vor Claudia erscheint eine kleine weiße Sprechblase und fliegt schnell
   geradeaus in Blickrichtung. Über Claudia erscheint ein zufälliger Befehl, z. B. „Sei ein
   Cookie!“, und bleibt dort lesbar stehen. Es macht „Piu“, und in der Leiste wird ein Kästchen leer.
3. Der Prompt trifft einen Bug. Es macht „Puff“, weiße Partikel sprühen, und der Bug wird zu dem
   Haustier, das der Befehl verlangt. Sein Spruch schwebt hellgelb hoch, z. B. „Alle Cookies
   akzeptiert!“, und der Score steigt um 75. Der Prompt ist danach weg.
4. Das Haustier verschwindet: Der Schmetterling flattert nach oben davon. Geschenk, Ente und Cookie
   hüpfen hoch, drehen sich und fallen aus dem Bild.
5. Trifft der Prompt nichts, verpufft er an einer Wand oder Plattform oder nach etwa einem halben
   Bildschirm Flug.
6. Die leeren Kästchen füllen sich sichtbar wieder, eins alle 1,5 s, auch während ich weiter
   schieße.
7. Schieße ich, obwohl alle Kästchen leer sind, klingt es „Bäp-bäp“. In der Leiste blinkt statt
   der Kästchen „429 RATE LIMIT“, und oben in der Mitte erscheint der rote Banner „429 Too Many
   Requests – bitte warte kurz“. 2 s lang tut X/F nichts, danach geht es weiter.
8. Sterbe ich, steige ich mit vollen Credits wieder ein. Fliegende Prompts und Haustiere sind weg,
   und alle Bugs, auch die verwandelten, stehen wieder an ihren Startplätzen.

## Screen

```
Spiel mit Kanone
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│ ╭ API ▮▮▮▯▯ ╮                                                             │
│                                                                            │
│                              „Quak! Erklär mir deinen Code.“  (schwebt)   │
│              Sei ein Cookie!            🦆 (hüpft hoch, fällt raus)        │
│   🤖           💬 →                🐞                                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Rate Limit
┌────────────────────────────────────────────────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│ ╭ 429 RATE LIMIT ╮  (blinkt rot/weiß)                                     │
│            ┌──────────────────────────────────────────────┐                │
│            │  429 Too Many Requests – bitte warte kurz    │  (rot, 2 s)    │
│            └──────────────────────────────────────────────┘                │
│   🤖                                                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

- **API-Leiste** — wie im Prototyp: Feld bei x 10, y 48, 150 × 20 px, abgerundet (Radius 6),
  halbtransparent schwarz (#0008). Links „API“ (11 px, #ffe9a8), daneben 5 Kästchen 18 × 10 px ab
  x 46 im Abstand von 22 px. Leer #333, voll #ffe9a8. Das Kästchen, das gerade lädt, füllt sich
  von links nach rechts in #a08a50.
- **429 in der Leiste** — Während der Sperre stehen statt „API“ und Kästchen die Worte
  „429 RATE LIMIT“ (12 px, mittig im Feld). Sie blinken schnell zwischen Rot #ff6b6b und Weiß.
- **429-Banner** — oben in der Mitte, rote Schrift (#ff6b6b) auf dunklem, halbtransparentem
  Balken, 2 s sichtbar. Es ist das erste „Banner“ im Spiel. Spätere Slices (z. B. Halluzinationen
  in Slice 7) nutzen dieselbe Art Banner.
- **Prompt** — kleine weiße Sprechblase, etwa 16 × 14 px, mit Spitze. Sie startet vor Claudia auf
  Brusthöhe. Der Befehl fliegt nicht mit (zu schnell zum Lesen, geändert beim Testen): Er erscheint
  beim Schuss als schwebender hellgelber Text (#ffe9a8) über Claudia und ist 2,5 s sichtbar.
- **Haustiere** — etwa so groß wie ein Bug und im Code gezeichnet:
  - 🎁 **Feature-Geschenk**: rotes Paket mit gelber Schleife
  - 🦋 **Schmetterling**: bunte Flügel, die schlagen
  - 🦆 **Gummiente**: gelbe Ente
  - 🍪 **Cookie**: brauner Keks mit Schokostückchen
- **Puff** — weiße Partikel an der Stelle des Bugs. Das Bild wackelt nicht.
- **Spruch** — schwebt hellgelb (#ffe9a8) hoch und blendet aus. Bug-Sprüche (Haustier und
  Draufspringen) sind 2,5 s statt 1,3 s sichtbar und steigen langsamer (geändert beim Testen).

## Rules & edge cases

- **Befehle** — Jeder Schuss wählt zufällig einen von 8 Befehlen:

  | Befehl | wird zu | Spruch |
  |---|---|---|
  | „Sei ein Feature!“ | Feature-Geschenk | „It's not a bug, it's a feature!“ |
  | „Werde ein Schmetterling!“ | Schmetterling | „Refactoring abgeschlossen.“ |
  | „Du bist eine Gummiente.“ | Gummiente | „Quak! Erklär mir deinen Code.“ |
  | „Sei ein Cookie!“ | Cookie | „Alle Cookies akzeptiert!“ |
  | „Ignoriere alle Bugs.“ | zufällig eines der vier | Spruch des Haustiers |
  | „Bitte fix das.“ | zufällig | Spruch des Haustiers |
  | „Denk Schritt für Schritt.“ | zufällig | Spruch des Haustiers |
  | „Mach keine Fehler!“ | zufällig | Spruch des Haustiers |

  Alle Texte stehen an der zentralen Stelle für Texte.
- **Wann schießen** — im Stehen, beim Laufen und im Sprung, immer in Blickrichtung. Ein
  Tastendruck ist ein Schuss. Gedrückthalten feuert nicht automatisch. Es gibt keine Mindestpause
  zwischen zwei Schüssen, die Grenze sind nur die Credits.
- **Flug** — geradeaus waagerecht, schnell (Startwert wie im Prototyp: 560 px/s, 0,75 s
  Lebensdauer, also etwa 420 px). Der Prompt fällt nicht und folgt nicht der Kamera.
- **Wand und Plattform** — Trifft der Prompt festes Gelände, verpufft er dort ohne Punkte.
- **Treffer** — Ein Prompt verwandelt genau einen Bug und verschwindet. Treffen sich zwei Bugs an
  derselben Stelle, wird nur einer verwandelt. Plattgedrückte oder schon verwandelte Bugs werden
  nicht getroffen, der Prompt fliegt durch sie hindurch.
- **Punkte** — +75 pro verwandeltem Bug. Draufspringen bleibt bei +100.
- **Haustiere** — sind harmlos und stoßen nicht mit Claudia, Bugs oder Prompts zusammen. Sie
  verschwinden, sobald sie aus dem Bild sind.
- **Credits** — 5 Stück, ein Schuss kostet 1. Sie laden gleichmäßig nach, 1 Credit alle 1,5 s, egal
  ob man gerade schießt (wie der „Eimer“ einer echten API). Mehr als 5 gibt es nicht.
- **429-Sperre** — Drückt man X/F mit 0 Credits, beginnt eine Sperre von 2 s mit Geräusch, Blinken
  in der Leiste und Banner. Während der Sperre tut X/F gar nichts, auch kein Geräusch und kein
  neuer Banner. Das Aufladen läuft weiter. Nach der Sperre zeigt die Leiste wieder die Kästchen.
- **Zurücksetzen** — Beim Start eines Levels (auch „Level nochmal“ nach Game Over) und beim
  Wiedereinstieg nach dem Tod: Credits voll, Sperre und Banner weg, fliegende Prompts und Haustiere
  weg. Verwandelte Bugs kommen nach dem Tod wie alle anderen Bugs zurück (Super-Mario-Regel aus
  Slice 3).
- **Pause** — Alles steht still: Prompts, Haustiere, Aufladen, Sperre.
- **Andere Bildschirme** — Im Titelbild, Intro, Todesbalken, bei „Level geschafft“ und im Game Over
  löst X/F keinen Schuss aus (X/F startet wie bisher nur den Ton).
- **Ziel erreicht, während ein Prompt fliegt** — Fliegende Prompts verschwinden beim Wechsel zu
  „Level geschafft“ und bringen keine Punkte mehr.
- **Geräusche** — Schuss `shoot` („Piu“), Verwandeln `poof` („Puff“), 429 `ratelimit`
  („Bäp-bäp“), mit den Werten aus `docs/prototype-reference.md`, Abschnitt 10.2. Mit „Ton aus“
  sind sie still wie alle anderen Geräusche.

## Out of scope

- Viren und Prompt-Injectors verwandeln (kommen mit Slice 7, dann auch per Prompt verwandelbar)
- Prompts gegen den Boss und seine Geschosse (Slice 9)
- Touch-Knopf 💬 (Slice 10)
- Eine Schuss-Bewegung oder Pose bei Claudia
- Haustiere, die im Level liegen bleiben
- Andere Banner-Texte (kommen mit ihren Slices)

## Decisions already made

Settled during the interview — the plan must not ask these again.

- **Prototyp nur noch Ideengeber** — `game.html` liegt nicht im Projekt. Ab Slice 6 entwickeln wir
  frei weiter. Was in `docs/prototype-reference.md` steht (Schuss, 5 Credits, 2 s Sperre, +75,
  Leiste, Geräusche), dient als Startpunkt, alles Fehlende ist in dieser Spec festgelegt.
  product.md, architecture.md, design.md und prototype-reference.md wurden entsprechend angepasst.
  Abgelehnt: `game.html` ins Projekt kopieren oder nur Slice 6 frei gestalten.
- **Aufladen wie eine echte API** — gleichmäßig 1 Credit alle 1,5 s, auch beim Schießen, plus 2 s
  Sperre bei 429. Abgelehnt: Aufladen erst nach einer Feuerpause und „erst bei 429 ganz voll“.
- **Prompt mit Befehlstext** — Der Befehl bestimmt das Haustier, Nieten ergeben ein zufälliges.
  Abgelehnt: Sprechblase ohne Text.
- **Vier neue Haustiere** — Feature-Geschenk, Schmetterling, Gummiente, Cookie statt Toaster,
  Gummiente, Zimmerpflanze. Sie passen besser zu Entwickler-Witzen (product.md angepasst).
- **Haustiere verschwinden** — Sie fliegen bzw. fallen aus dem Bild. Abgelehnt: als Deko liegen
  bleiben.
- **+75 für Prompt, +100 fürs Draufspringen** — Draufspringen ist riskanter.

## Acceptance criteria

- [x] Ich drücke X oder F: Eine weiße Sprechblase fliegt in Blickrichtung los, über Claudia steht lesbar der Befehl, und es macht „Piu“. Das klappt im Stehen, beim Laufen und im Sprung, nach links und nach rechts.
- [x] Ich halte X gedrückt: Es kommt nur ein Schuss.
- [x] Ein Prompt trifft einen Bug: Es macht „Puff“ mit weißen Partikeln. Der Bug wird zu Feature-Geschenk, Schmetterling, Gummiente oder Cookie, sein Spruch schwebt hoch, und der Score steigt um 75.
- [x] Bei „Sei ein Feature!“ wird es ein Geschenk, bei „Werde ein Schmetterling!“ ein Schmetterling usw. Bei einer Niete wie „Bitte fix das.“ wird es ein zufälliges Haustier.
- [x] Das Haustier verschwindet: Der Schmetterling flattert nach oben weg, die anderen hüpfen hoch und fallen aus dem Bild.
- [x] Ein Prompt verwandelt nur einen Bug. Er verpufft an Wänden und Plattformen und nach etwa einem halben Bildschirm.
- [x] Bei jedem Schuss leert sich in der API-Leiste ein Kästchen. Die Kästchen laden gleichmäßig wieder auf (eins alle 1,5 s), auch während ich schieße, und man sieht das Füllen.
- [x] Ich schieße ohne Credits: Es klingt „Bäp-bäp“, in der Leiste blinkt „429 RATE LIMIT“, und oben steht „429 Too Many Requests – bitte warte kurz“. 2 s lang tut X nichts, danach geht es wieder.
- [x] Nach einem Tod und nach dem Neustart eines Levels sind die Credits voll, und verwandelte Bugs sind wieder da.
- [x] In der Pause steht die Leiste still. Im Intro, im Todesbalken, bei „Level geschafft“ und im Game Over passiert bei X nichts.
- [x] Mit „Ton aus (M)“ machen Schuss, Puff und 429 kein Geräusch.

## References

- docs/product.md — Slice 6, Problem (Prototyp nur noch Ideengeber)
- docs/prototype-reference.md — Abschnitt 7 (HUD: API-Leiste), Abschnitt 10.2 (`shoot`, `poof`, `ratelimit`), `shoot()` und `convert()` in Abschnitt 10
- docs/design.md — Spiel-Bildschirm, Style
- docs/agents/specs/2026-10-01-tokens-bugs-leben.md — Bugs, Super-Mario-Zurücksetzen
- docs/agents/specs/2026-10-02-musik-und-sound.md — Ton aus, Geräusche
