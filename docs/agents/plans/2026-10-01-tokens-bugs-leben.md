---
date: 2026-10-01
topic: "Tokens, Bugs, Leben"
spec: "docs/agents/specs/2026-10-01-tokens-bugs-leben.md"
tags: [plan, hud, tokens, bugs, leben, tod, checkpoint, effekte]
status: ready
---

# PLAN: Tokens, Bugs, Leben

Dieser Plan setzt Slice 3 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-01-tokens-bugs-leben.md`](../specs/2026-10-01-tokens-bugs-leben.md).
Alle Werte, Texte und Zeichenanweisungen stehen in `docs/prototype-reference.md`, Abschnitt 7
(Regeln und Maße) und Abschnitt 8 (Original-Zeichencode aus `game.html`).

## What you'll be able to do

Level 1 wird zum echten Spiel. Oben links zeigt eine Anzeige Leben, Tokens und Score, rechts oben
steht „RAM-Dschungel“. Du sammelst schwebende Tokens, springst auf laufende Bugs und verlierst bei
seitlicher Berührung oder im Abgrund ein Leben, mit Wackeln, Partikeln und einem Todesspruch im
roten Balken. Danach steigst du am Start oder an der gelben Diskette wieder ein. Nach dem letzten
Leben kommt „KONTEXTFENSTER VOLL“, und ENTER startet alles neu. Am Ziel siehst du deinen Score.

Heute:

```
┌──────────────────────────── 960 × 544 ────────────────────────────┐
│  (keine Anzeige oben)                                              │
│        ════         ════                                           │
│   🤖                                          [>_] OUTPUT          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────┘
```

Danach:

```
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭───────────────────────────────────────╮                    RAM-Dschungel │
│ │ 🤖 x3   Tokens 12      Score 420      │                                   │
│ ╰───────────────────────────────────────╯                                   │
│        ════         ⬡⬡⬡⬡                                                    │
│                   Bug gefixt!   (schwebt hoch, verblasst)                  │
│   🤖              🐞                       💾  (Diskette, grau → gelb)      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Todesablauf (Welt läuft weiter, Claudia ist weg, Anzeige oben zeigt schon x2):
│████████████████████████  Segmentation fault!  ████████████████████████████│  y 202–372
│████████████████████████     Noch 2 Leben      ████████████████████████████│

Game Over (alles steht, dunkle Ebene):        Ziel (alles steht, dunkle Ebene):
        KONTEXTFENSTER VOLL                     Task erfolgreich abgeschlossen ✓
 Game Over – die Session ist abgelaufen.                 Score: 1230
             Score: 1230                                ENTER: nochmal
           ENTER: nochmal   (ab 1,2 s, blinkt)
```

## Acceptance Criteria

Aus der Spec (unverändert):

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

Beim Planen hinzugekommen:

- [ ] Lande ich auf einem Bug und streife im selben Moment einen zweiten Bug seitlich, überlebe ich: Der erste ist besiegt, Claudia prallt ab.
- [ ] Falle ich in einen Abgrund, sieht man die orangen Partikel unten am Bildrand.

## Technical Key Decisions and Tradeoffs

1. **Effekte werden in der Spiellogik mitgerechnet:** Partikel, Schwebetexte, Wackel-Zeit,
   Unverwundbarkeit und eine Spielzeit für Animationen (Schweben, Beine, Blinken) liegen als
   einfache Daten im `GameState` und laufen in den festen 1/60-s-Schritten. Das Zeichnen liest sie
   nur.
   - Why: So frieren sie am Ziel und beim Game Over zuverlässig ein, nach einem Tab-Wechsel springt
     nichts vor, und Tests können z. B. prüfen, dass „Kontext +25 Tokens“ entsteht.
   - Instead of: Effekte nur im Zeichnen mit eigener Uhr. Dann wären sie nicht testbar und würden
     anders als die Spielwelt anhalten.
2. **Zufall ist austauschbar:** `createGame(level, random = Math.random)`. Der Zufall steckt im
   Zustand und wird für Todesspruch, Bug-Spruch und Partikel benutzt. Tests geben eine feste
   Zahlenfolge vor. Nur der Wackel-Versatz beim Zeichnen nimmt direkt `Math.random`.
   - Why: Tests liefern immer dasselbe Ergebnis.
3. **Bug-Berührungen werden pro Schritt gesammelt und dann entschieden:** Zuerst werden alle
   lebenden Bugs gesucht, die Claudia berührt. Dann wird für jeden geprüft, ob es ein
   Draufspringen ist, gemessen an Claudias Fallgeschwindigkeit **vor** dem Abprallen. Gibt es
   mindestens ein Draufspringen, sind alle diese Bugs besiegt (je +100), Claudia prallt einmal ab,
   und seitliche Berührungen im selben Schritt zählen nicht. Nur ohne Draufspringen kostet eine
   seitliche Berührung ein Leben, und zwar nur wenn Claudia nicht unverwundbar ist.
   *(Mit dem Nutzer abgestimmt: zwei Bugs gleichzeitig sind beide besiegt, und Abprallen gewinnt
   gegen eine gleichzeitige seitliche Berührung.)*
   - Instead of: Bugs nacheinander prüfen wie im Prototyp. Dort tötet der zweite Bug, weil
     Claudia schon nach oben fliegt.
4. **Spielzustände:** `playing` → `dying` → (`playing` | `gameOver`), dazu `won`. Ein
   gemeinsamer Zähler `modeTime` misst die Zeit im aktuellen Zustand (für 0,7 s / 3,2 s / 1,2 s).
   `respawning` und `RESPAWN_DELAY` aus Slice 1 entfallen.
5. **Neustart = neues Spiel:** ENTER bei `won` oder `gameOver` (ab 1,2 s) ruft `createGame` mit
   denselben Level-Daten und demselben Zufall auf. So sind Leben, Score, Tokens, Bugs und
   Diskette garantiert wieder im Anfangszustand.
6. **Gelände-Welt bleibt, Spielobjekte kommen in den Zustand:** `World` bleibt reines Gelände
   (feste Rechtecke, Ziel, Start). Tokens, Bugs und Checkpoints sind veränderlich und liegen als
   Listen im `GameState`. Sie werden in eigenen kleinen Modulen aus den Level-Daten gebaut.
7. **Bugs bewegen sich gegen dieselben festen Rechtecke wie Claudia** (Boden und Plattformen).
   Umdrehen an Wand und Levelrand, und an Kanten: Liegt 1 px vor dem Bug und 2 px unter seinen
   Füßen kein festes Rechteck, dreht er um (wie `walk()` im Prototyp).
8. **Zeichnen wie im Prototyp (Abschnitt 8):** Bug, Token, Diskette, Partikel, Schwebetexte,
   Wackeln, Overlays und HUD werden nach dem Original-Code nachgebaut, aber in unsere Module
   aufgeteilt und mit Werten aus `config.ts` bzw. Texten aus `texts.ts`.
9. **HUD-Icon = Claudia im heutigen Aussehen** (weiß/grün), auf 0,85 verkleinert, nicht der orange
   Prototyp-Roboter. Dafür bekommt `drawClaudia` eine Variante mit Position und Skalierung.
   *(Mit dem Nutzer abgestimmt.)*
10. **Was steht wann still** *(mit dem Nutzer abgestimmt)*:
    - `playing`: alles läuft.
    - `dying`: Bugs, Partikel, Schwebetexte, Wackeln und Spielzeit laufen weiter. Claudia ist weg,
      die Kamera steht, Steuerung wirkt nicht.
    - `won` und `gameOver`: alles steht, auch Partikel und Schwebetexte. Nur `modeTime` läuft
      (für die 1,2 s und das Blinken von „ENTER: nochmal“).
11. **ENTER zu früh wird nicht gemerkt:** Ein ENTER vor 0,7 s im Todesablauf bzw. vor 1,2 s beim
    Game Over wird verworfen. *(Mit dem Nutzer abgestimmt.)*
12. **Wackeln nur für die Spielwelt:** Hintergrund und Welt werden verschoben, HUD und Overlays
    nicht. Das HUD liegt unter den Overlays und bleibt sichtbar. *(Mit dem Nutzer abgestimmt.)*
13. **Ziel-Overlay:** wie bisher, darunter neu `Score: <Zahl>` in Gelb. „ENTER: nochmal“ steht
    sofort da. Game Over: „ENTER: nochmal“ blinkt leicht. Beides in der Anordnung aus Abschnitt 8.
    *(Mit dem Nutzer abgestimmt.)*
14. **Bugs laufen durcheinander hindurch**, wie im Prototyp. *(Mit dem Nutzer abgestimmt.)*
15. **Tests mit Vitest** für alle neuen Regeln, jeweils in der Phase, die das Verhalten liefert.
    Der 100er-Token wird nur automatisch geprüft (in Level 1 gibt es nur 49 Tokens).
    - Why: Das Projekt hat schon Tests, und `docs/architecture.md` verlangt sie für Treffer und
      Punkte.

## Current State

```
  Tastatur ─▶ input/keyboard.ts ─(left, right, jumpHeld, jumpPressed, enterPressed)─┐
                                                                                    ▼
  public/levels/level1.json ─▶ level/load.ts ─▶ level/validate.ts ─▶ logic/game.ts stepGame()
                                                                      ├─ player.ts  (Physik)
                                                                      ├─ world.ts   (solids, goalRect, startPos)
                                                                      └─ camera.ts
                                                                             │ Zustand
                          loop.ts (1/60 s) ─────────────────────────────────▶ render/renderer.ts
                                                     background · terrain · terminal · claudia · overlay
```

```
 playing ──(y > 544)──▶ respawning ──(0,5 s)──▶ playing (am Start)
    └──(berührt OUTPUT)──▶ won ──(ENTER)──▶ createGame()
```

Die Level-Datei enthält schon `tokens` (49), `bugs` (7) und `saves` ([64]). Sie werden geprüft,
aber nicht benutzt. `fakeTokens`, `viruses`, `spikes`, `power`, `fakes`, `injectors` bleiben auch
in diesem Slice ungenutzt.

## Desired End State

```
 GameState
 ├─ mode: 'playing' | 'dying' | 'gameOver' | 'won'     modeTime
 ├─ level, world, player (+ invulnerable), camX
 ├─ lives, score, tokenCount, spawn {x, y}
 ├─ tokens[]       (x, y, taken)
 ├─ bugs[]         (x, y, vx, vy, alive, deadTime)
 ├─ checkpoints[]  (x, active)
 ├─ effects        particles[], texts[], shake
 ├─ deathMessage, time, random
```

```
 playing ──(Abgrund y > 584 oder seitlicher Bug-Treffer)──▶ dying
    │                                                       │ 3,2 s oder ENTER ab 0,7 s
    │                                       Leben übrig ◀───┴───▶ keine Leben
    │                                            ▼                    ▼
    │                       playing (am spawn, 1,5 s blinkend)     gameOver ──(ENTER ab 1,2 s)──▶ createGame()
    └──(berührt OUTPUT)──▶ won ──(ENTER)──▶ createGame()
```

Ablauf eines Schritts in `playing`:

```
 time += dt; stepEffects
 stepPlayer (inkl. invulnerable −= dt)
 Abgrund? (player.y > 584) ─ ja ─▶ die() und fertig
 Bugs laufen (alle) · tote Bugs: deadTime += dt
 Bug-Berührungen sammeln → Draufspringen / seitlicher Treffer (siehe Entscheidung 3) ─ Tod ─▶ fertig
 Tokens einsammeln · Checkpoint prüfen · Ziel prüfen
 camX = cameraX(...)
```

Zeichenreihenfolge:

```
 save · Wackel-Versatz
   Hintergrund · Gelände · Disketten · Tokens · Terminal · Bugs · Claudia (nur in playing und
   won, blinkt bei Unverwundbarkeit) · Partikel · Schwebetexte
 restore
 HUD
 Overlay: dying → Todesbalken · gameOver → Game Over · won → Ziel
```

## Abstractions and Code Reuse

- `src/config.ts`
  - entfernen: `RESPAWN_DELAY`
  - neu: `START_LIVES = 3`, `PIT_Y = 584`, `TOKEN_POINTS = 10`, `TOKEN_HIT_X = 20`,
    `TOKEN_HIT_Y = 22`, `TOKEN_TEXT_EVERY = 25`, `TOKEN_LIFE_EVERY = 100`, `BUG_W = 24`,
    `BUG_H = 18`, `BUG_SPEED = 60`, `BUG_POINTS = 100`, `BUG_LOST_Y = 594` (VIEW_H + 50),
    `STOMP_DEPTH = 16`, `BOUNCE_HELD = 0.85`, `BOUNCE = 0.55`, `SQUASH_TIME = 0.6`,
    `DEATH_TIME = 3.2`, `DEATH_SKIP_AFTER = 0.7`, `GAMEOVER_INPUT_AFTER = 1.2`,
    `INVULNERABLE_TIME = 1.5`, `DEATH_SHAKE = 0.3`, `SHAKE_PX = 6`, `TEXT_LIFE = 1.3`,
    `TEXT_RISE = 40`, `PARTICLE_GRAV = 600`, `CHECKPOINT_SPAWN_X = 5`
  - Farben: `SCORE_COLOR = '#ffd84a'`, `DEATH_COLOR = '#D97757'`, `BUG_PARTICLE_COLOR = '#ff5a8a'`
    (`ERROR_COLOR = '#ff6b6b'` gibt es schon)
- `src/texts.ts` – neu:
  - `deathMessages`: die 9 Sprüche aus Abschnitt 7, mit „404: Claudia nicht gefunden“
  - `bugMessages`: `Bug gefixt!`, `Patch deployed!`, `Ticket geschlossen!`, `Works on my machine!`, `LGTM!`
  - `livesLeft(n)` → `Noch ${n} Leben`, `noLivesLeft` → `Keine Leben mehr...`
  - `contextTokens(n)` → `Kontext +${n} Tokens`, `oneUp` → `1UP: Neue Session!`, `autosave` → `Autosave...`
  - `hudLives(n)` → `x${n}`, `hudTokens(n)` → `Tokens ${n}`, `hudScore(n)` → `Score ${n}`
  - `gameOverTitle` → `KONTEXTFENSTER VOLL`, `gameOverText` → `Game Over – die Session ist abgelaufen.`
  - `scoreLine(n)` → `Score: ${n}`. Für „ENTER: nochmal“ wird `goalHint` wiederverwendet.
- `src/logic/`
  - `random.ts` (neu) – Typ `Random = () => number`, `pick(list, random)`.
  - `effects.ts` (neu) – `Particle { x, y, vx, vy, life, color, size }`,
    `FloatingText { x, y, text, color, t }`, `Effects { particles, texts, shake }`,
    `createEffects()`, `burst(effects, random, x, y, color, n, speed = 220)` (Tokens und Bugs
    mit 220, Tod mit 320) und `say(effects, x, y, text, color)`
    (Formeln aus Abschnitt 8, Teil 4), `stepEffects(effects, dt)` (Partikel: Schwerkraft 600,
    `life −= dt`, entfernen bei ≤ 0. Texte: `t += dt`, entfernen ab 1,3 s. `shake = max(0, shake − dt)`).
  - `tokens.ts` (neu) – `Token { x, y, taken }`, `buildTokens(level)` (nur `level.tokens`,
    **nicht** `fakeTokens`, Mittelpunkt `(c + k)·32 + 16`, `r·32 + 16`),
    `touchesToken(player, token)`.
  - `bugs.ts` (neu) – `Bug { x, y, vx, vy, alive, deadTime }`, `buildBugs(level)`
    (`x = c·32 + 4`, `y = (r + 1)·32 − 18`, `vx = −60`), `stepBug(bug, world, dt)` (Laufen,
    Schwerkraft, Umdrehen an Wand/Levelrand/Kante, verschwindet unter 594 px ohne Punkte),
    `bugRect(bug)`, `isStomp(player, bug)` (`vy > 0 && player.y + 28 − bug.y < 16`).
  - `checkpoints.ts` (neu) – `Checkpoint { col, active }`, `buildCheckpoints(level)`,
    `touchesCheckpoint(player, cp)` (nur waagerecht: Claudias x-Bereich überlappt
    `col·32 … col·32 + 32`), `spawnOf(cp)` → `{ x: col·32 + 5, y: 15·32 − PLAYER_H }` (= 452, gerechnet wie
    `world.startPos`).
  - `player.ts` – `Player` bekommt `invulnerable: number`. `createPlayer(world, at = world.startPos)`
    setzt `facing = 1`, `vx = vy = 0`. `stepPlayer` zählt `invulnerable` herunter.
  - `game.ts` – `GameMode`, `GameState` wie unter „Desired End State“,
    `createGame(level, random?)`, `stepGame` mit den vier Modi, interne Helfer
    `collectTokens`, `touchBugs(state, input)` (braucht `jumpHeld` fürs Abprallen), `checkCheckpoints`, `die(state)`, `respawn(state)`.
- `src/render/`
  - `text.ts` (neu) – `shadowText(ctx, str, x, y, size, color, align)`: fett, Schatten `#000a`
    um +2/+2 px (wie `text()` im Prototyp), Grundlinie `alphabetic`.
  - `hud.ts` (neu) – `drawHud(ctx, state)`: Feld `#0008` x 10, y 10, 440 × 34, Radius 8. Icon,
    `x3`, `Tokens`, `Score` und Levelname nach der HUD-Tabelle in Abschnitt 7. Levelname =
    `level.name.split(': ')[1] ?? level.name`.
  - `tokens.ts` (neu) – `drawTokens(ctx, state, camX)` nach Abschnitt 8, Teil 2, mit `state.time`
    statt `gt`.
  - `bugs.ts` (neu) – `drawBugs(ctx, state, camX)` nach Abschnitt 8, Teil 1 (`bugShape` mit
    `BUG_COLORS`, `angry` immer false, Beinphase `time·18 + x`, Plattdrücken
    `max(0.15, 1 − deadTime·4)`).
  - `checkpoint.ts` (neu) – `drawCheckpoints(ctx, state, camX)` nach Abschnitt 8, Teil 3.
  - `effects.ts` (neu) – `drawEffects(ctx, effects, camX)` nach Abschnitt 8, Teil 4.
  - `claudia.ts` – Zeichnen in `drawRobot(ctx, x, y, facing, pose, scale)` auslagern, mit
    `pose: 'stand' | 'jump' | { run: number }` (`run` = x-Position für den Beinwechsel, wie heute).
    `drawClaudia(ctx, player, camX, time)` ruft es auf und lässt Claudia bei
    `invulnerable > 0 && floor(time·15) % 2 === 1` weg (Blinken). Das HUD ruft `drawRobot` mit
    Skalierung 0,85 im Stehen auf.
  - `overlay.ts` – `drawGoalOverlay` mit Score-Zeile, neu `drawDeathOverlay` und
    `drawGameOverOverlay` (Positionen, Größen und Farben aus Abschnitt 8, Teil 8, mit
    `shadowText`).
  - `renderer.ts` – Reihenfolge wie unter „Desired End State“. Wackeln:
    `translate((Math.random() − 0.5)·2·SHAKE_PX·shake/0.3, …)`, nur wenn `shake > 0`.
- `src/main.ts` – unverändert (ruft weiter `createGame(level)` und `render(ctx, state)`).
- `src/level/` – unverändert. Tokens, Bugs und `saves` werden schon geprüft.
- `src/test/level1.ts` – bleibt. Neu ist eine kleine Hilfe `fixedRandom(values)` (wiederholt eine
  Zahlenfolge) für Tests, z. B. in `src/test/random.ts`.

## Pitfalls

- **Reihenfolge im Schritt beachten** (siehe „Desired End State“): erst Claudia bewegen, dann
  Abgrund, dann Bugs laufen lassen, dann Berührungen. Ist Claudia gestorben, wird im selben
  Schritt nichts mehr eingesammelt und kein Ziel geprüft.
- **Draufspringen mit der Geschwindigkeit nach `stepPlayer` prüfen:** Steht Claudia auf dem
  Boden und ein Bug läuft in sie hinein, ist `vy` nach der Landung 0. Das ist richtig so: kein
  Draufspringen, also ein seitlicher Treffer. Fällt Claudia auf einen Bug, ist `vy > 0`. Weil sie
  pro Schritt höchstens 950/60 ≈ 15,8 px fällt, ist ihre Unterkante beim ersten Überlappen immer
  weniger als 16 px unter der Bug-Oberkante.
- **Abprallen genau wie im Prototyp:** `vy = jumpHeld ? −0.85·JUMP : −0.55·JUMP` setzen,
  `onGround = false`. Die bestehende variable Sprunghöhe in `stepPlayer` kappt den Wert ohne
  gehaltene Taste im nächsten Schritt von 429 auf 328 px/s. Die Kappung **nicht** extra einbauen.
  Ein Test prüft: nach dem Abprallen ohne Taste ist im nächsten Schritt `vy ≈ −328 + GRAV·dt`.
- **Abgrund: Grenze 584, nicht mehr 544.** `player.y > PIT_Y` (Oberkante). Die orangen Partikel
  entstehen bei `y = min(player.y + 14, VIEW_H − 10)`, damit man sie unten am Bildrand sieht. Die
  Unverwundbarkeit schützt nicht vor dem Abgrund.
- **Leben sofort abziehen:** `lives −= 1` beim Tod, nicht erst am Ende des Todesablaufs. Das HUD
  zeigt sofort `x2`. Der Leben-Text im Balken nutzt den schon verringerten Wert (`lives > 0` →
  „Noch N Leben“, sonst „Keine Leben mehr...“).
- **Kamera:** Während `dying` bleibt `camX` stehen. Beim Wiedereinstieg wird sie sofort mit
  `cameraX` gesetzt, ohne Nachgleiten.
- **Zeit-Grenzen mit `EPS`** wie bisher: Todesablauf endet bei `modeTime ≥ 3.2 − EPS`, ENTER wirkt
  ab `modeTime ≥ 0.7 − EPS`, beim Game Over ab `1.2 − EPS`. `modeTime` wird zu Beginn des Schritts
  erhöht. `invulnerable` wird mit `Math.max(0, invulnerable − dt)` gezählt und gilt als aktiv
  bei `> EPS`. Dasselbe gilt für Schwebetexte (`t < 1.3 − EPS` bleibt) und besiegte Bugs
  (`deadTime ≥ 0.6 − EPS` → weg). Sonst dauert es wegen Rundungsfehlern einen Schritt länger.
- **ENTER verbrauchen:** `keyboard.consume()` läuft nach jedem Schritt. Ein zu frühes ENTER ist
  damit automatisch verworfen. Ein ENTER, das den Todesablauf beendet, darf im nächsten Schritt
  nichts weiter auslösen. Das passt, weil es nur einen Schritt lang gilt.
- **Sprungtaste beendet den Todesablauf nicht**, nur `enterPressed`.
- **Token-Meilensteine:** erst `tokenCount += 1`, dann prüfen: `% 100 === 0` → `lives += 1` und
  „1UP: Neue Session!“ (#ffd84a) über Claudia bei `(player.x, player.y − 16)`. Sonst `% 25 === 0` →
  „Kontext +N Tokens“ in Akzentfarbe am Token bei `(token.x, token.y)`. Keine Extrapunkte außer
  den 10 pro Token.
- **Schwebetext-Positionen (eigene Wahl, der Prototyp-Code dazu liegt nicht vor):** Bug-Spruch bei `(bug.x, bug.y − 14)` in Weiß, „Autosave...“ bei
  `(col·32, 14·32 − 10)` in #ffd84a. Schwebetexte sind linksbündig (wie im Prototyp).
- **Besiegte Bugs:** `alive = false`, `deadTime` zählt hoch, auch während `dying`. Ab 0,6 s
  werden sie nicht mehr gezeichnet und nicht mehr berührt. Sie bleiben in der Liste, damit nichts
  umsortiert wird.
- **Bug-Kanten-Prüfung mit Rechtecken statt Kacheln:** Punkt `(vorne ± 1 px, Füße + 2 px)` liegt
  in keinem festen Rechteck → umdrehen. Den Levelrand (`x < 0` bzw. `x + 24 > widthPx`) wie eine
  Wand behandeln. Bug bei Spalte 22 dreht an der Abgrundkante bei Spalte 28 um, Bug bei Spalte 77
  an der Kante bei Spalte 84.
- **Plattformen über Bugs** liegen in Reihe 11 (Unterkante 384). Bugs am Boden (Oberkante 462)
  stoßen nie daran. Trotzdem gegen alle `solids` prüfen, damit es mit anderen Leveln stimmt.
- **Checkpoint nur in `playing`** prüfen und nur einmal aktivieren. `spawn` wird dabei auf
  `(64·32 + 5, 452) = (2053, 452)` gesetzt.
- **`createGame` baut alles frisch:** Tokens, Bugs und Checkpoints müssen jedes Mal neu aus
  `level` gebaut werden (keine geteilten Objekte), sonst bleiben nach ENTER Tokens eingesammelt.
- **Bestehender Test „ENTER while playing changes nothing“** vergleicht zwei Zustände mit
  `toEqual`. Beide müssen denselben Zufall haben (gleiche Funktion übergeben), sonst schlägt er
  fehl.
- **Alter Abgrund-Test** in `game.test.ts` („respawns at the start exactly 30 steps“) gilt nicht
  mehr und wird in Phase 2 durch die neuen Todesablauf-Tests ersetzt. Der Test „keeps the camera
  still while respawning“ wird dabei zum `dying`-Kameratest umbenannt.
- **HUD-Icon ohne Blinken und ohne Laufen:** `drawRobot` im HUD immer in Steh-Haltung, Blick nach
  rechts, unabhängig von Claudias Zustand.
- **Spalte 78:** `fakeTokens` dürfen nicht in `buildTokens` landen (Abnahmekriterium „Bei
  Spalte 78 sind keine Tokens“).

## Implementation

### Phase 1: Anzeige oben und Tokens

Dependencies: None

Die Anzeige oben zeigt Icon, Leben, Tokens, Score und den Levelnamen. Die 49 Tokens schweben und
drehen sich und lassen sich einsammeln, mit Partikeln und den Meilenstein-Texten. Am Ziel steht der
Score. Bugs und Diskette sind noch nicht zu sehen.

**Tasks**:
- [ ] `src/config.ts`: neue Werte für Leben, Tokens, Effekte und Farben aus „Abstractions“
  ergänzen (`RESPAWN_DELAY` bleibt bis Phase 2).
- [ ] `src/texts.ts`: HUD-Texte, `contextTokens`, `oneUp`, `scoreLine`.
- [ ] `src/logic/random.ts`: `Random`, `pick`. `src/test/random.ts`: `fixedRandom(values)`.
- [ ] `src/logic/effects.ts`: `Effects`, `createEffects`, `burst`, `say`, `stepEffects`.
- [ ] `src/logic/tokens.ts`: `Token`, `buildTokens(level)`, `touchesToken(player, token)`
  (`|Claudia-Mitte x − token.x| < 20` und `|Claudia-Mitte y − token.y| < 22`).
- [ ] `src/logic/game.ts`: `GameState` um `lives = 3`, `score = 0`, `tokenCount = 0`, `tokens`,
  `effects`, `time`, `random` erweitern. `createGame(level, random = Math.random)`. In `playing`:
  `time += dt`, `stepEffects`, nach `stepPlayer` Tokens einsammeln (+1, +10, 6 Partikel in
  Akzentfarbe, Meilensteine wie in „Pitfalls“). In `respawning` laufen `time` und Effekte weiter, in `won`
  steht alles. ENTER in `won` → `createGame(level, state.random)`.
- [ ] `src/render/text.ts`: `shadowText`.
- [ ] `src/render/claudia.ts`: `drawRobot(ctx, x, y, facing, pose, scale)` auslagern,
  `drawClaudia` nutzt es (Aussehen bleibt gleich).
- [ ] `src/render/hud.ts`: `drawHud` (Feld, Icon bei x 20 / y 14 mit Skalierung 0,85, `x3` bei 44
  weiß 16 px, `Tokens N` bei 90 in Akzentfarbe 16 px, `Score N` bei 230 gelb 16 px, Levelname
  rechtsbündig bei 940 in `#fffa` 15 px, Grundlinie y 34).
- [ ] `src/render/tokens.ts`: `drawTokens` (Sechseck Radius 9, „T“ fett 11 px `#0008`, Schweben
  `sin(time·4 + x·0.05)·3`, Stauchen `0.35 + |cos(time·3 + x·0.02)|·0.65`).
- [ ] `src/render/effects.ts`: `drawEffects` (Partikel als Quadrate mit `alpha = min(1, life·2)`,
  Texte fett 15 px mit schwarzem Schatten +1 px, steigen 40 px/s, verblassen über 1,3 s).
- [ ] `src/render/overlay.ts`: `drawGoalOverlay(ctx, theme, score)` in der Anordnung aus
  Abschnitt 8 „Level geschafft“, alles mit `shadowText` und mittig: Ebene `rgba(0,0,0,0.5)`,
  Titel bei VH/2 − 40 fett 32 px in Akzentfarbe, `Score: N` bei VH/2 18 px #ffd84a,
  „ENTER: nochmal“ bei VH/2 + 50 18 px in `#e8e4da`, sofort sichtbar und ohne Blinken.
- [ ] `src/render/renderer.ts`: Tokens nach dem Gelände, Effekte nach Claudia, danach HUD, dann
  Ziel-Overlay.
- [ ] Tests `src/logic/tokens.test.ts`:
  - Level 1 ergibt genau 49 Tokens. Keiner hat seinen Mittelpunkt in Spalte 78–80
    (x 2496–2592).
  - Claudia genau auf einen Token setzen, ein Schritt → `tokenCount = 1`, `score = 10`,
    `taken = true`, 6 Partikel.
  - genau 20 px waagerecht bzw. genau 22 px senkrecht entfernt → nicht eingesammelt.
  - In `respawning` (Phase 2: `dying`) wird nichts eingesammelt.
  - 25. Token → Schwebetext „Kontext +25 Tokens“, keine Extrapunkte, Leben unverändert.
  - `tokenCount` auf 99 setzen und einen Token einsammeln → `lives = 4`, Text „1UP: Neue
    Session!“, **kein** „Kontext +100 Tokens“, Score +10.
  - in `won` wird nichts eingesammelt.
- [ ] Tests `src/logic/effects.test.ts`: Schwebetext ist nach 78 Schritten (1,3 s) weg, nach 77
  noch da. Partikel verschwinden nach Ablauf von `life`. In `won` bewegen sich Partikel nicht.
- [ ] Bestehende Tests in `game.test.ts` weiter grün halten.

**Automated Verification**:
- [ ] `npm run typecheck` läuft ohne Fehler
- [ ] `npm test` – alle Tests grün
- [ ] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [ ] Im Projektordner in deinem eigenen Terminal `npm install` und dann `npm run dev` ausführen und
  die angezeigte Adresse öffnen (meist http://localhost:5173). Oben links siehst du ein dunkles
  Feld mit einer kleinen Claudia, `x3` (weiß), `Tokens 0` (grün) und `Score 0` (gelb). Rechts oben
  steht `RAM-Dschungel`.
- [ ] Über der ersten Plattform schweben 4 grüne Sechsecke mit „T“. Sie wippen auf und ab und
  sehen aus, als würden sie sich drehen.
- [ ] Spring auf die erste Plattform und lauf durch die Tokens: Jeder verschwindet mit ein paar
  grünen Partikeln, `Tokens` steigt um 1, `Score` um 10.
- [ ] Sammle weiter, bis `Tokens 25` erreicht ist (die Tokens über dem ersten und zweiten Abgrund
  erwischst du im Sprung darüber): Beim 25. Token schwebt „Kontext +25 Tokens“ nach oben und
  verblasst.
- [ ] Lauf hinter dem zweiten Abgrund weiter bis etwa Spalte 78, kurz vor dem dritten Abgrund: Dort schweben keine Tokens.
- [ ] Erreiche das OUTPUT-Terminal: „Task erfolgreich abgeschlossen ✓“, darunter in Gelb
  `Score: …` mit deinem Score und „ENTER: nochmal“. Die Anzeige oben bleibt sichtbar, die Tokens
  wippen nicht mehr.
- [ ] Drück ENTER: Alles beginnt neu mit `Tokens 0`, `Score 0`, und alle Tokens sind wieder da.

### Phase 2: Leben, Todesablauf, Checkpoint und Game Over

Dependencies: Phase 1

Der Abgrund wird zum echten Tod mit Wackeln, orangen Partikeln, rotem Balken und Lebensverlust.
Danach geht es blinkend am Start oder an der Diskette weiter. Nach dem letzten Leben kommt der
Game-Over-Platzhalter. In dieser Phase kann man nur im Abgrund sterben.

**Tasks**:
- [ ] `src/config.ts`: `RESPAWN_DELAY` entfernen. Todes-, Unverwundbarkeits- und Checkpoint-Werte
  ergänzen.
- [ ] `src/texts.ts`: `deathMessages`, `livesLeft`, `noLivesLeft`, `autosave`, `gameOverTitle`,
  `gameOverText`.
- [ ] `src/logic/player.ts`: `invulnerable` (Start 0) und Herunterzählen in `stepPlayer`.
  `createPlayer(world, at)` mit Startpunkt als Parameter.
- [ ] `src/logic/checkpoints.ts`: `Checkpoint`, `buildCheckpoints`, `touchesCheckpoint`, `spawnOf`.
- [ ] `src/logic/game.ts`:
  - Modi `playing | dying | gameOver | won`, `modeTime`, `spawn`, `checkpoints`, `deathMessage`.
    `respawning` und `respawnTimer` entfernen.
  - `die(state)`: `lives −= 1`, Spruch mit `pick(deathMessages, random)`, `shake = 0.3`, 30
    Partikel #D97757 mit Tempo 320 bei `(player.x + 11, min(player.y + 14, 534))`,
    `mode = 'dying'`, `modeTime = 0`.
  - `playing`: `player.y > PIT_Y` → `die`. Nach dem Einsammeln: Checkpoint berühren → `active`,
    `spawn` setzen, „Autosave...“.
  - `dying`: `modeTime`, `time` und Effekte laufen. Ende bei `modeTime ≥ 3.2` oder
    `enterPressed && modeTime ≥ 0.7` → `lives > 0` ? `respawn` : `gameOver` (`modeTime = 0`).
  - `respawn(state)`: `player = createPlayer(world, spawn)` mit `invulnerable = 1.5`,
    `camX = cameraX(...)`, `mode = 'playing'`.
  - `gameOver`: nur `modeTime` läuft. `enterPressed && modeTime ≥ 1.2` → `createGame(level, random)`.
- [ ] `src/render/checkpoint.ts`: `drawCheckpoints` (Diskette nach Abschnitt 8, Teil 3).
- [ ] `src/render/claudia.ts`: Blinken bei Unverwundbarkeit (alle 1/15 s an/aus nach `time`).
- [ ] `src/render/overlay.ts`: `drawDeathOverlay` (Balken `#300c` y 202, Höhe 170. Spruch bei
  VH/2 − 25 fett 34 px #ff6b6b, Leben-Text bei VH/2 + 5 16 px weiß) und `drawGameOverOverlay`
  (Ebene `rgba(0,0,0,0.75)`, Titel bei VH/2 − 60 40 px #ff6b6b, Untertitel bei VH/2 − 20 18 px
  weiß, `Score: N` bei VH/2 + 15 18 px #ffd84a, ab `modeTime ≥ 1.2` „ENTER: nochmal“ bei
  VH/2 + 65 17 px blinkend: `modeTime % 1 < 0.6 ? '#fff' : '#fff6'`).
- [ ] `src/render/renderer.ts`: Wackel-Versatz um Hintergrund und Welt, Disketten zeichnen,
  Claudia nur in `playing` und `won` zeichnen (nicht in `dying` und `gameOver`), `state.time` an
  `drawClaudia` übergeben, Overlays je Modus.
- [ ] Tests `src/logic/game.test.ts` (alten Abgrund-Test ersetzen; Hilfe `fallingIntoPit` bleibt):
  - Sturz → `dying` in dem Schritt, in dem `y > 584`. Vorher bleibt es `playing`, auch bei
    y 545–584.
  - Beim Tod: `lives = 2`, `shake = 0.3`, 30 Partikel, deren y höchstens 534 ist, und
    `deathMessage` stammt aus `deathMessages`. Mit festem Zufall: der erwartete Spruch.
  - Ohne Eingabe: nach 191 Schritten noch `dying`, nach 192 (3,2 s) `playing` am Start (69, 452),
    `camX = 0`, `invulnerable = 1.5`, `vx = vy = 0`, `facing = 1`.
  - ENTER im 41. Schritt nach dem Tod (`modeTime` = 41/60) → bleibt `dying`. ENTER im 42. Schritt
    (`modeTime` = 0,7) → `playing`. Sprungtaste beendet nichts.
  - Während `dying` ändert sich `camX` nicht, und Links/Rechts bewegen nichts.
  - Score, `tokenCount` und eingesammelte Tokens bleiben nach dem Wiedereinstieg erhalten.
  - Unverwundbarkeit schützt nicht vor dem Abgrund.
  - Checkpoint: Claudia im Sprung über Spalte 64 (y 300) → `active`, „Autosave...“, `spawn` =
    (2053, 452). Ein zweites Berühren erzeugt keinen zweiten Text. Danach Sturz in den dritten
    Abgrund → Wiedereinstieg bei (2053, 452) mit `camX = 2053 + 11 − 480 = 1584`.
  - Drei Stürze → im dritten Todesablauf `lives = 0`. Nach dessen Ende `gameOver`. ENTER im
    71. Schritt in `gameOver` wirkt nicht. Springen, Links und Rechts nach 1,2 s wirken auch
    nicht. ENTER im 72. Schritt (1,2 s): `lives = 3`, `score = 0`, `tokenCount = 0`, 49 nicht eingesammelte
    Tokens, Checkpoint inaktiv, Claudia am Start.
  - Während `dying` bewegen sich die Partikel weiter, und `shake` ist nach 18 Schritten 0.
  - In `gameOver` bewegen sich Partikel nicht.
  - Bestehende Ziel-Tests bleiben. Neu: ENTER bei `won` setzt Score, Tokens und Leben zurück.

**Automated Verification**:
- [ ] `npm run typecheck` läuft ohne Fehler
- [ ] `npm test` – alle Tests grün
- [ ] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [ ] `npm run dev` starten (läuft er noch, reicht Neuladen der Seite) und http://localhost:5173
  öffnen. Lauf in den ersten Abgrund: Das Bild wackelt kurz, unten am Bildrand spritzen orange
  Partikel. Nur die Spielwelt wackelt, die Anzeige oben und der Balken stehen still. Ein
  dunkelroter Balken zeigt einen Spruch wie „Segmentation fault!“ in Rot und
  darunter „Noch 2 Leben“. Oben steht sofort `x2`.
- [ ] Warte: Nach gut 3 Sekunden steht Claudia wieder am Start, die Kamera ist vorne, und Claudia
  blinkt etwa 1,5 s lang.
- [ ] Spring nochmal in den Abgrund und drück gleich danach mehrmals ENTER: Ganz am Anfang passiert
  nichts. Nach einem kurzen Moment beendet ENTER den Balken sofort. Die Leertaste beendet ihn nicht.
- [ ] Sammle ein paar Tokens und stirb dann: Die eingesammelten Tokens sind nach dem Wiedereinstieg
  weiterhin weg, `Tokens` und `Score` sind gleich geblieben.
- [ ] Lade die Seite neu. Lauf bis hinter den zweiten Abgrund zur grauen Diskette (Spalte 64):
  Sobald du sie berührst (oder darüber springst), wird sie gelb, und „Autosave...“ schwebt hoch.
- [ ] Lauf weiter und spring in den dritten Abgrund: Nach dem Todesablauf stehst du an der
  Diskette, nicht am Start.
- [ ] Stirb, bis keine Leben mehr übrig sind: Beim letzten Tod steht „Keine Leben mehr...“ im
  Balken. Danach liegt eine dunkle Ebene über allem mit „KONTEXTFENSTER VOLL“,
  „Game Over – die Session ist abgelaufen.“ und `Score: …`. Nach gut einer Sekunde erscheint
  blinkend „ENTER: nochmal“.
- [ ] Drück ENTER: `x3`, `Tokens 0`, `Score 0`, alle Tokens sind wieder da, die Diskette ist grau,
  und Claudia steht am Start.
- [ ] Wechsle mitten im roten Balken in einen anderen Tab und komm nach ein paar Sekunden zurück:
  Der Balken läuft dort weiter, wo er war, und ist nicht übersprungen.

### Phase 3: Bugs

Dependencies: Phase 2

Die 7 Bugs laufen hin und her. Draufspringen plattet sie mit Spruch und Abprallen, eine seitliche
Berührung kostet ein Leben. Dazu kommen der Schutz beim Wiedereinstieg und die Fairness-Regeln.

**Tasks**:
- [ ] `src/config.ts`: Bug-Werte, `BUG_PARTICLE_COLOR`.
- [ ] `src/texts.ts`: `bugMessages`.
- [ ] `src/logic/bugs.ts`: `Bug`, `buildBugs`, `stepBug` (Schwerkraft, waagerecht bewegen und an
  festen Rechtecken bzw. Levelrand umdrehen, senkrecht bewegen und landen, auf dem Boden die
  Kante prüfen, unter 594 px `alive = false` ohne Punkte), `bugRect`, `isStomp`.
- [ ] `src/logic/game.ts`: `bugs` im Zustand. In `playing` und `dying` laufen lebende Bugs, bei
  toten zählt `deadTime` hoch. In `playing` nach der Abgrund-Prüfung `touchBugs`:
  - Berührt werden alle lebenden Bugs, deren Rechteck sich mit Claudias überlappt.
  - Gibt es darunter Draufspringer (`isStomp`): jeder ist besiegt (`alive = false`, +100, 14
    Partikel #ff5a8a in der Bug-Mitte, Spruch `pick(bugMessages)` in Weiß). Dann einmal abprallen
    (`vy = jumpHeld ? −0.85·JUMP : −0.55·JUMP`, `onGround = false`). Seitliche Berührungen in
    diesem Schritt zählen nicht.
  - Sonst: Berührung und `invulnerable ≤ 0` → `die`.
- [ ] `src/render/bugs.ts`: `drawBugs` nach Abschnitt 8, Teil 1. Tote ab `deadTime ≥ 0.6 − EPS` nicht
  mehr zeichnen (dieselbe Regel wie in der Logik).
- [ ] `src/render/renderer.ts`: Bugs nach dem Terminal und vor Claudia zeichnen.
- [ ] Tests `src/logic/bugs.test.ts`:
  - Level 1 ergibt 7 Bugs, der erste bei (708, 462), alle mit `vx = −60`.
  - Ein Bug bewegt sich pro Schritt 1 px (60 px/s).
  - Bug bei Spalte 22 eine Weile laufen lassen (z. B. 2000 Schritte): Er bleibt immer zwischen
    x 0 und 28·32 − 24, dreht am linken Levelrand und an der Abgrundkante um, und `y` bleibt 462.
  - Alle 7 Bugs 3000 Schritte laufen lassen: Keiner fällt (y bleibt 462, alle `alive`).
- [ ] Tests in `src/logic/game.test.ts`:
  - Claudia fällt von oben auf einen Bug → besiegt, `score +100`, 14 Partikel, Schwebetext aus
    `bugMessages`, Claudia steigt danach (`vy < 0`). Mit gehaltener Taste `vy = −663`, ohne
    `vy = −429` und einen Schritt später durch die Kappung −328 + 2100/60 = −293 (±1).
  - Ein Bug läuft in die stehende Claudia → `dying`, `lives = 2`.
  - Seitliche Berührung mit `invulnerable > 0` → kein Tod. Draufspringen mit
    `invulnerable > 0` → Bug besiegt.
  - Zwei Bugs an fast gleicher x-Position unter Claudias Füßen → beide besiegt, +200, kein Tod.
  - Ein Bug unter den Füßen, ein zweiter seitlich auf Körperhöhe → der erste ist besiegt, der
    zweite lebt, kein Tod.
  - Ein besiegter Bug (`deadTime = 0`) löst weder Draufspringen noch Tod aus, wenn Claudia ihn
    berührt. Nach 36 Schritten ist `deadTime ≈ 0.6`. Nach einem Tod bleibt er besiegt.
  - Während `dying` laufen die Bugs weiter, in `won` und `gameOver` stehen sie.
  - Nach Game Over und ENTER sind alle 7 Bugs wieder da und leben.

**Automated Verification**:
- [ ] `npm run typecheck` läuft ohne Fehler
- [ ] `npm test` – alle Tests grün
- [ ] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [ ] `npm run dev` starten (oder Seite neu laden) und http://localhost:5173 öffnen. Rechts vom
  Start läuft ein pinker Käfer nach links. Er bewegt die Beine und schaut in Laufrichtung.
- [ ] Weich ihm aus (z. B. auf die erste Plattform) und schau zu: Am linken Levelrand dreht er um,
  an der Kante des ersten Abgrunds auch. Er fällt nie hinein.
- [ ] Spring von oben auf ihn: Er wird plattgedrückt und verschwindet mit pinken Partikeln, ein
  Spruch wie „LGTM!“ schwebt hoch, `Score` steigt um 100, und Claudia prallt ab. Mit gehaltener
  Sprungtaste prallt sie deutlich höher ab als ohne. Das Bild wackelt dabei nicht.
- [ ] Lauf seitlich in einen Bug hinein: Das Bild wackelt, Claudia zerplatzt in orange Partikel, der
  rote Balken zeigt einen Todesspruch und „Noch 2 Leben“, oben steht `x2`. Die Bugs laufen im
  Hintergrund weiter.
- [ ] Gleich nach dem Wiedereinstieg blinkt Claudia. Lauf in dieser Zeit in einen Bug: Nichts
  passiert. Nach dem Blinken kostet ein Bug wieder ein Leben.
- [ ] Ein besiegter Bug ist nach einem Tod nicht wieder da.
- [ ] Stirb bis zum Game Over und drück ENTER: Alle Bugs laufen wieder an ihren Startplätzen.
- [ ] Die Bugs bei Spalte 40 und 47 laufen manchmal dicht beieinander. Wenn du es schaffst, auf
  beide gleichzeitig zu springen, sind beide besiegt, und du überlebst.
  **Note:** Das ist schwer gezielt hinzubekommen. Es ist per Test geprüft, auch der Fall „einer
  unter den Füßen, einer seitlich“.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

## References

- Spec: `docs/agents/specs/2026-10-01-tokens-bugs-leben.md`
- `docs/product.md` – Slice 3
- `docs/architecture.md` – Building blocks (Logik getrennt vom Zeichnen, Texte zentral), Tests
- `docs/design.md` – Screens „Spiel“ und „Overlays“, Style (Farben, Schwebetexte, Wackeln)
- `docs/prototype-reference.md` – Abschnitt 2 (Tokens, Bugs, Checkpoints), 4 (Leben, Checkpoint),
  5 (Abprallen, Unverwundbarkeit), 7 (alle Regeln und Maße), 8 (Original-Zeichencode)
- Vorheriger Plan: `docs/agents/plans/2026-10-01-claudia-laeuft-durch-level-1.md`
