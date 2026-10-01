---
date: 2026-10-01
topic: "Spielablauf-Bildschirme"
spec: "docs/agents/specs/2026-10-01-spielablauf-bildschirme.md"
tags: [plan, titel, intro, pause, ziel, zeitbonus, game-over, highscore, speicher]
status: done
---

# PLAN: Spielablauf-Bildschirme

Dieser Plan setzt Slice 4 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-01-spielablauf-bildschirme.md`](../specs/2026-10-01-spielablauf-bildschirme.md).
Alle Texte, Größen, Farben, Positionen und Zeiten stehen in `docs/prototype-reference.md`,
Abschnitt 9 (Bildschirme, Zustände, Tasten, Highscore) und Abschnitt 8 (Zeichnung von
„Level geschafft“ und Game Over). Überall steht „Claudia“ statt „Claude“.

## What you'll be able to do

Das Spiel bekommt seinen Rahmen. Beim Öffnen siehst du das Titelbild mit einer großen hüpfenden
Claudia, und dahinter zieht Level 1 abgedunkelt vorbei. ENTER startet das Spiel mit einem
eingeblendeten Levelnamen. P oder ESC pausiert, und auch ein Tab- oder Fensterwechsel pausiert.
Am Ziel gibt es +500 und einen Zeitbonus, danach geht es zurück zum Titel. Nach dem letzten Leben
kannst du das Level mit halbiertem Score nochmal versuchen oder ins Menü gehen. Dein Highscore
steht auch nach dem Neuladen noch auf dem Titelbild.

Heute:

```
Seite öffnen ──▶ Level 1 läuft sofort ──▶ Ziel ──▶ „ENTER: nochmal“ ──▶ Level 1 von vorn
                        └─ letztes Leben ──▶ Game Over (Platzhalter) ──▶ ENTER ──▶ Level 1 von vorn
```

Danach:

```
Titel ─▶ Intro ─▶ Spiel ⇄ Pause (P/ESC, Tab- oder Fensterwechsel)
                    ├─ Ziel ─▶ +500 + Zeitbonus ─▶ ENTER ─▶ Titel (Highscore gespeichert)
                    └─ Game Over (Highscore gespeichert) ─┬─ ENTER ─▶ Intro (Score halbiert)
                                                          └─ ESC/P ─▶ Titel
```

```
Titelbild (kein HUD, Level 1 im Hintergrund zieht mit 60 px/s vorbei, abgedunkelt)
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│                                CLAUDIA                    (64 px, #D97757)  │
│                            im RAM-Dschungel               (32 px, Akzent)   │
│                                 🤖  (groß, hüpft, Beine laufen)             │
│                                                                            │
│                       Drücke ENTER oder LEERTASTE         (blinkt)          │
│           ← → / A D : laufen     ↑ / W / Leertaste : springen              │
│       X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus     │
│        Hilf Claudia, sich durch den Speicher zum OUTPUT zu kämpfen!  (gelb) │
│                             Highscore: 2410       (nur wenn > 0)           │
└────────────────────────────────────────────────────────────────────────────┘

Level-Intro (Spiel und HUD sichtbar, Balken blendet ein und aus)
┌────────────────────────────────────────────────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 0   Score 0 ╮                               RAM-Dschungel │
│████████████████████████████████████████████████████████████████████████████│
│███████████████████████ Level 1: RAM-Dschungel ██████████████████████████████│
│█████████████ Spring auf Bugs, um sie zu fixen. Sammle Tokens! ██████████████│
│████████████████████████████████████████████████████████████████████████████│
│   🤖               🐞                                                        │
└────────────────────────────────────────────────────────────────────────────┘

Pause (abgedunkelt 0,6)                   Level geschafft (abgedunkelt 0,5)
┌──────────────────────────────────┐      ┌──────────────────────────────────────┐
│              PAUSE               │      │   Task erfolgreich abgeschlossen ✓   │
│ Claudia denkt nach... (P zum     │      │     Zeitbonus: +870   Score: 2410    │
│ Weiterspielen)                   │      │          ENTER: Abschluss  (1,2 s)   │
└──────────────────────────────────┘      └──────────────────────────────────────┘

Game Over (abgedunkelt 0,75)
┌────────────────────────────────────────────────────────────────────────────┐
│                          KONTEXTFENSTER VOLL                               │
│                 Game Over – die Session ist abgelaufen.                    │
│                     Score: 1235   Highscore: 2410                          │
│            ENTER: Level nochmal versuchen (Score halbiert)   (ab 1,2 s)    │
│                      ESC: zurück zum Hauptmenü                (ab 1,2 s)    │
└────────────────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

Aus der Spec (unverändert):

- [x] Beim Öffnen der Seite sehe ich das Titelbild: „CLAUDIA“ in Orange, „im RAM-Dschungel“, eine große hüpfende Claudia, blinkend „Drücke ENTER oder LEERTASTE“, die Steuerungshilfe und „Hilf Claudia, …“. Dahinter zieht Level 1 abgedunkelt vorbei, und oben ist keine Anzeige.
- [x] Beim allerersten Besuch fehlt die Zeile „Highscore“.
- [x] ENTER, Leertaste, ↑ oder W startet das Spiel. Ein Balken zeigt „Level 1: RAM-Dschungel“ und „Spring auf Bugs, um sie zu fixen. Sammle Tokens!“ und blendet dann aus. Die Bugs laufen, Claudia steht still. Oben steht x3, Tokens 0, Score 0.
- [x] Drücke ich im Intro kurz nach dem Start ENTER oder die Leertaste, ist es sofort weg, und Claudia springt dabei nicht.
- [x] Mit P beim Spielen steht alles still, und ich sehe „PAUSE“ und „Claudia denkt nach... (P zum Weiterspielen)“. P, ESC oder ENTER spielen weiter, die Leertaste nicht. ESC pausiert ebenfalls.
- [x] Wechsle ich beim Spielen in einen anderen Tab und komme zurück, steht das Spiel in der Pause.
- [x] Am OUTPUT-Terminal erscheint „Task erfolgreich abgeschlossen ✓“, darunter „Zeitbonus: +N   Score: S“. Der Score ist um 500 + N gestiegen, und je schneller ich war, desto größer ist N. Das Terminal zeigt ✓. Nach gut 1 s erscheint „ENTER: Abschluss“.
- [x] ENTER führt danach zum Titelbild, auf dem jetzt „Highscore: S“ steht.
- [x] Nach dem letzten Leben erscheint „KONTEXTFENSTER VOLL“ mit „Score: X   Highscore: Y“. Ist X ein neuer Rekord, ist Y = X. Nach gut 1 s erscheinen „ENTER: Level nochmal versuchen“ und „ESC: zurück zum Hauptmenü“.
- [x] ENTER zeigt wieder das Intro. Danach habe ich x3, Score 0 und Tokens 0, und die Diskette ist grau. *(beim Umsetzen geändert, siehe Implementation Notes)*
- [x] ESC (oder P) im Game Over führt zum Titelbild. Ein neuer Start beginnt bei Score 0 und Tokens 0.
- [x] Lade ich die Seite neu, steht der Highscore weiter auf dem Titelbild.
- [x] Ein niedrigerer Score überschreibt den Highscore nicht.

Automatisch getestet: Zeitbonus-Formel (auch 0 ab 240 s), Neustart bei 0 nach Game Over, Level-Zeit
läuft nicht in Intro, Pause und Todesbalken, blockierter oder ungültiger Speicher.

Beim Planen hinzugekommen (auch in der Spec ergänzt):

- [x] Klicke ich beim Spielen in ein anderes Programm und komme zurück, steht das Spiel in der Pause.

## Technical Key Decisions and Tradeoffs

1. **Alle Bildschirme sind Zustände der Spiellogik:** `GameMode` wird zu
   `'title' | 'intro' | 'playing' | 'paused' | 'dying' | 'won' | 'gameOver'`. Wie bisher misst
   `modeTime` die Zeit im aktuellen Zustand (für 0,4 s, 2,5 s und 1,2 s).
   - Why: Ein einziger Ort entscheidet, was in welchem Zustand läuft, und alle Übergänge lassen
     sich ohne Browser testen.
   - Instead of: ein eigener „Bildschirm-Manager“ neben dem Spiel. Der wäre doppelt und nicht
     testbar.
2. **Ein Spielzustand für alles, neu gebaut bei jedem Levelstart:** `createGame(level, random,
   highscore)` liefert den Titel-Zustand mit frisch aufgebautem Level 1. `startLevel(state, score,
   tokenCount)` baut daraus ein frisches Level im Zustand `intro` (3 Leben, Level-Zeit 0, alle Bugs,
   Tokens und die graue Diskette neu) und übernimmt nur Score, Token-Zähler, Highscore und Zufall.
   Zurück zum Titel heißt: `createGame(level, random, highscore)`.
   - Why: Wie in Slice 3 ist so garantiert alles im Anfangszustand, ohne dass man einzelne Felder
     vergisst.
3. **Die Spielregeln speichern selbst nichts** *(mit dem Nutzer abgestimmt)*: Der Zustand hat ein
   Feld `highscore`. Die Logik erhöht es an genau zwei Stellen (Übergang zum Game Over, „ENTER:
   Abschluss“), und zwar nur, wenn der Score höher ist. `main.ts` bemerkt nach jedem Schritt, dass
   der Wert gestiegen ist, und schreibt ihn über ein kleines Modul `storage/highscore.ts` in den
   Browser. Lesen und Schreiben sind dort in `try/catch` verpackt: Ist der Speicher blockiert oder
   steht dort Unsinn, gilt 0, und das Spiel läuft weiter.
   - Why: Die Regeln bleiben ohne Browser testbar (architecture.md), und ein blockierter Speicher
     kann das Spiel nicht anhalten.
   - Instead of: `localStorage` direkt in der Logik wie im Prototyp. Das würde abstürzen und wäre
     nicht testbar.
4. **Neuer Speichername `claudiaRamDschungelHighscore`** *(mit dem Nutzer abgestimmt)*.
   - Why: Der Prototyp lief an einer anderen Adresse, es gibt nichts zu übernehmen.
5. **Neue Taste „Pause“ in der Eingabe:** `InputState` bekommt `pausePressed` (P und ESC). Es
   zählt wie `jumpPressed` und `enterPressed` nur einmal pro Druck.
   `go = enterPressed || jumpPressed` startet, überspringt das Intro und bestätigt am Ziel und beim
   Game Over.
6. **Pause auch beim Verlassen von Tab oder Fenster** *(mit dem Nutzer abgestimmt)*: `main.ts`
   hört auf `visibilitychange` (Tab wird unsichtbar) und auf `blur` (das Fenster verliert den
   Fokus, z. B. durch einen Klick in ein anderes Programm) und ruft dann `pauseGame(state)` auf.
   Das wirkt nur im Zustand `playing`.
   - Instead of: nur beim Tab-Wechsel. Dann könnte Claudia unbemerkt ein Leben verlieren, während
     man in einem anderen Programm ist.
7. **Was läuft wann** *(mit dem Nutzer abgestimmt)*:

   | Zustand | Claudia | Bugs, Partikel, Schwebetexte | Kamera | Level-Zeit | Animationszeit `time` |
   |---|---|---|---|---|---|
   | `title` | nicht gezeichnet | stehen | fährt 60 px/s | – | läuft |
   | `intro` | steht am Start, keine Kollision | laufen | folgt Claudia | steht | läuft |
   | `playing` | läuft | laufen | folgt Claudia | läuft | läuft |
   | `paused` | steht | stehen | steht | steht | läuft |
   | `dying` | weg | laufen | steht | steht | läuft |
   | `won` | steht dort, wo sie das Terminal berührt hat (auch in der Luft) | laufen, keine Kollision | steht | steht | läuft |
   | `gameOver` | weg | stehen | steht | steht | steht |

   `time` treibt nur Zeichen-Animationen (Tokens drehen sich, Bug-Beine zappeln, Blinken). Darum
   zappeln in der Pause und auf dem Titelbild die Beine auf der Stelle, wie im Prototyp. Der
   Game Over bleibt komplett stehen wie in Slice 3. Dort blinkt nur der Hinweis, über `modeTime`.
8. **Titel-Kamera startet bei jedem Titelbild vorne:** `camX = (modeTime · 60) mod (Levelbreite −
   960)`, also nach rund 53 s wieder bei 0 *(mit dem Nutzer abgestimmt)*.
   - Instead of: eine eigene Uhr seit dem Seitenstart wie im Prototyp. Den Unterschied sieht man
     kaum, und die Lösung ist komplizierter.
9. **Große Claudia = heutige Figur, dreimal so groß** *(mit dem Nutzer abgestimmt)*:
   `drawRobot(ctx, 480 − 33, 215 − |sin(time · 3)| · 20, 1, { run: time · SPEED }, 3)`. So laufen
   die Beine im selben Takt wie im Spiel bei voller Geschwindigkeit. Ohne Blinzeln und ohne lila
   Antenne (die kommt in Slice 8, das neue Aussehen in Slice 11).
10. **Zeitbonus als eigene kleine Funktion:** `timeBonus(levelTime) = max(0, floor((240 −
    levelTime) · 5))`, mit einer winzigen Toleranz gegen Rundungsfehler (siehe Pitfalls).
11. **Das Intro verschwindet beim Wegdrücken sofort,** weil der Zustand dann `playing` ist und
    der Balken nur im Zustand `intro` gezeichnet wird. Die Taste wird im selben Schritt
    verbraucht und kommt nie bei `stepPlayer` an. Darum springt Claudia nicht.
12. **Tests:** Das Projekt hat Vitest-Tests, darum bekommt jede Phase Tests für ihre Regeln.
    Bestehende Tests, die heute davon ausgehen, dass `createGame` direkt im Zustand `playing`
    startet, bekommen eine Hilfsfunktion `playingGame()`.

## Current State

```
main.ts ── lädt level1.json ── createGame(level) ── mode 'playing'
   │                                                   │
   │   loop.ts: 60 Schritte/s, verwirft Zeit nach      │ stepGame(state, input, dt)
   │   Tab-Wechsel (visibilitychange)                  ▼
   │                                    playing ─▶ dying ─▶ playing | gameOver
   │                                       └──▶ won
   │                                    gameOver/won + ENTER ─▶ createGame (neu, playing)
   ▼
render(ctx, state): Hintergrund, Gelände, Diskette, Tokens, Terminal (>_), Bugs, Claudia, Effekte
                    → HUD → Overlay (Tod / Game Over mit „ENTER: nochmal“ / Ziel mit Score)
```

- `src/input/keyboard.ts` kennt Pfeile, A/D, W/↑/Leertaste und ENTER. P und ESC gibt es noch
  nicht. Bei `blur` werden alle Tasten losgelassen.
- `src/logic/game.ts`: Im Zustand `won` steht alles, Bugs inklusive (Test „bugs stand still once
  the level is won“). Ziel = Score bleibt, es gibt keinen Zeitbonus.
- `src/render/overlay.ts` hat `dim()`, den Todesbalken, den Game-Over-Platzhalter und das
  Ziel-Overlay. Die Blinkfarbe steht inline im Game-Over-Platzhalter.
- `src/render/claudia.ts` → `drawRobot()` kann schon skalieren und laufende Beine zeichnen.
- `src/render/terminal.ts` zeichnet immer `>_`.
- Es gibt keinen Speicher.

## Desired End State

```
main.ts ── liest Highscore (storage/highscore.ts, sicher) ── createGame(level, random, highscore)
   │  blur / visibilitychange(hidden) ─▶ pauseGame(state)
   │  nach jedem Schritt: highscore gestiegen? ─▶ writeHighscore()
   ▼
 title ──go──▶ intro ──2,5 s oder (≥0,4 s + go)──▶ playing ⇄ paused (P/ESC rein, P/ESC/ENTER raus)
                ▲                                    │
                │                                    ├─ Tod ─▶ dying ─┬─ Leben übrig ─▶ playing
                │                                    │                └─ keine ─▶ gameOver (highscore = max)
                │                                    └─ Ziel (+500 + Bonus) ─▶ won
                │  gameOver ≥1,2 s + go: startLevel(score/2, tokens bleiben)
                └──────────────────────────────────────────────────────────────┘
 gameOver ≥1,2 s + P/ESC ─▶ title          won ≥1,2 s + go ─▶ (highscore = max) ─▶ title
```

## Abstractions and Code Reuse

- `src`
  - `config.ts` - neue Werte: `INTRO_TIME = 2.5`, `INTRO_SKIP_AFTER = 0.4`, `GOAL_INPUT_AFTER = 1.2`,
    `GOAL_POINTS = 500`, `BONUS_TIME_LIMIT = 240`, `BONUS_PER_SECOND = 5`, `TITLE_CAM_SPEED = 60`,
    `TITLE_COLOR = '#D97757'`, `HIGHSCORE_KEY = 'claudiaRamDschungelHighscore'`
  - `texts.ts` - alle neuen Texte (Titel, Pause, Ziel, Game Over). `goalHint` und `scoreLine`
    werden ersetzt und entfernt, sobald sie nicht mehr gebraucht werden.
  - `main.ts` - liest den Highscore, übergibt ihn an `createGame`, pausiert bei `blur` und
    `visibilitychange`, speichert einen gestiegenen Highscore
  - `input/keyboard.ts` - neue Gruppe `PAUSE` (KeyP, Escape), liefert `pausePressed`
  - `logic/input.ts` - `InputState.pausePressed`, `NO_INPUT` ergänzt
  - `logic/game.ts`
    - `GameMode` - neue Zustände `title`, `intro`, `paused`
    - `GameState` - neue Felder `levelTime`, `goalBonus`, `highscore`
    - `createGame(level, random, highscore)` - liefert den Titel-Zustand
    - `startLevel(state, score, tokenCount)` - neu: frisches Level im Zustand `intro`
    - `pauseGame(state)` - neu: `playing` → `paused`, sonst nichts
    - `timeBonus(levelTime)` - neu, exportiert
    - `stepGame` - neue Zweige `title`, `intro`, `paused`. `playing` mit Pause und Level-Zeit,
      `won` und `gameOver` mit den neuen Übergängen
    - `reachGoal(state)` - neu: Punkte, Bonus, 40 Partikel, `won`
  - `logic/camera.ts` - `titleCameraX(t, world)` neu
  - `storage/highscore.ts` - neu: `browserStorage()`, `readHighscore(storage)`,
    `writeHighscore(storage, value)`
  - `render/renderer.ts` - Titel ohne Claudia und ohne HUD, Claudia auch in `intro`/`paused`,
    neue Overlays aufrufen
  - `render/title.ts` - neu: `drawTitle(ctx, state)`
  - `render/overlay.ts` - `blinkColor(t)` (aus dem Game-Over-Platzhalter herausgezogen),
    `drawIntroOverlay`, `drawPauseOverlay`, `drawGoalOverlay` (mit Bonus und Hinweis),
    `drawGameOverOverlay` (mit Highscore und zwei Hinweisen)
  - `render/terminal.ts` - `drawTerminal(…, done)` zeigt `✓` statt `>_`
  - `render/claudia.ts` - `drawRobot` wird unverändert wiederverwendet
  - `logic/game.test.ts` - Hilfsfunktion `playingGame()`, angepasste und neue Tests
  - `storage/highscore.test.ts` - neu
  - `logic/camera.test.ts` - Test für `titleCameraX`

Bestehende Bausteine, die wiederverwendet werden: `dim()` und `shadowText()` für alle Overlays,
`stepBugs`/`stepEffects` für Intro und Ziel, `burst()` für die Ziel-Partikel, `cameraX()` für das
Intro.

## Pitfalls

- **Bestehende Tests starten heute in `playing`.** Nach Phase 1 liefert `createGame` den Titel.
  Eine Test-Hilfsfunktion `playingGame(random?)` in `src/test/game.ts` = `createGame` +
  `startLevel` + `mode = 'playing'`, `modeTime = 0` (ohne die 2,5 s Intro, damit sich die Bugs
  nicht bewegen) ersetzt `createGame(level, …)` in **allen** Testdateien, die Spielen
  voraussetzen: `logic/game.test.ts`, `logic/effects.test.ts` (z. B. „floating texts“) und
  `logic/tokens.test.ts` (`onFirstToken`). Die erwarteten Bug-Positionen (z. B. `708`) bleiben so
  gültig.
- **Zeiten in Tests:** Vergleiche laufen mit `≥ Grenze − EPS`. Darum wirkt eine Taste bei 1,2 s
  ab Schritt 72 (nicht 71), bei 0,4 s ab Schritt 24 (nicht 23). Summierte 1/60-s-Schritte sind
  nie exakt: Kamera- und Zeitwerte in Tests mit `toBeCloseTo` prüfen.
- **Ein gedrückter Knopf gilt nur einen Schritt.** `keyboard.consume()` läuft nach jedem Schritt,
  und `e.repeat` wird ignoriert. Darum überspringt ENTER auf dem Titel nicht auch das Intro, und
  die Intro-Taste löst keinen Sprung aus. Dabei darf `startLevel` die Eingabe nicht an
  `stepPlayer` weitergeben, und `intro` darf `stepPlayer` nie aufrufen.
- **Zustand `playing` mit P:** In dem Schritt, in dem pausiert wird, darf nichts anderes passieren
  (kein `stepPlayer`, keine Level-Zeit), wie im Prototyp.
- **`time` vs. `modeTime`:** `time` läuft in der Pause weiter (nur Zeichen-Animationen). Nichts
  in der Spiellogik darf `time` für Regeln benutzen. Heute tut das nichts, das soll so bleiben.
- **Zeitbonus und Rundung:** Die Level-Zeit ist eine Summe aus vielen 1/60-s-Schritten und liegt
  nach genau 60 Schritten z. B. bei 0,9999999… oder 1,0000001. Darum
  `Math.floor((240 − levelTime) · 5 + 1e-6)`, damit 1 s sicher 1195 ergibt.
- **Highscore „gleich“ zählt nicht:** Nur `score > highscore` erhöht ihn. `main.ts` schreibt nur,
  wenn `state.highscore` größer ist als der zuletzt geschriebene Wert. So wird nicht 60-mal pro
  Sekunde geschrieben.
- **Neuer Zustand nach `startLevel`/Titel:** `stepGame` gibt dann ein neues Objekt zurück.
  `main.ts` macht schon `state = stepGame(…)`. Auch `pauseGame` muss den (gleichen) Zustand
  zurückgeben, und `main.ts` weist ihn zu.
- **`blur` beim allerersten Laden:** Wenn die Seite ohne Fokus lädt, kommt kein `blur`. Das ist
  unkritisch, weil das Spiel auf dem Titel startet und `pauseGame` dort nichts tut.
- **Bugs im Intro:** Sie laufen, aber Claudia hat keine Kollision. Der erste Bug (x 708) braucht
  über 10 s bis zu Claudia (x 69), das Intro dauert höchstens 2,5 s. Es gibt also keinen Tod
  direkt beim Spielstart.
- **Abdunklung `#000b`** beim Intro ist `rgba(0,0,0,0.73)`, zusätzlich mal Ein-/Ausblende-Alpha.
  `ctx.globalAlpha` danach unbedingt wieder auf 1 setzen.
- **ESC** ist im Browser auch die Taste zum Beenden des Vollbilds. Das Spiel läuft nicht im
  Vollbild, darum ist das unkritisch. `preventDefault` wie bei den anderen Tasten.
- **Texte:** Überall „Claudia“. Der Gedankenstrich in „Game Over – die Session …“ ist ein
  Halbgeviertstrich (–), den `texts.gameOverText` schon richtig enthält.

## Implementation

### Phase 1: Titelbild und Level-Intro

Dependencies: None

Die Seite öffnet mit dem Titelbild. ENTER, Leertaste, ↑ oder W starten ein neues Spiel mit dem
Intro-Balken. Ziel und Game Over bleiben vorerst wie in Slice 3, nur führt ENTER dort jetzt in ein
neues Spiel mit Intro (wird in Phase 3 und 4 ersetzt).

**Tasks**:
- [x] `config.ts`: `INTRO_TIME`, `INTRO_SKIP_AFTER`, `TITLE_CAM_SPEED`, `TITLE_COLOR` ergänzen.
- [x] `texts.ts`: Titeltexte ergänzen: `titleName: 'CLAUDIA'`, `titleSub: 'im RAM-Dschungel'`,
  `titlePress: 'Drücke ENTER oder LEERTASTE'`,
  `titleKeys1: '← → / A D : laufen     ↑ / W / Leertaste : springen'`,
  `titleKeys2: 'X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus'`,
  `titleHelp: 'Hilf Claudia, sich durch den Speicher zum OUTPUT zu kämpfen!'`,
  `titleHighscore: (n) => \`Highscore: ${n}\``.
- [x] `logic/camera.ts`: `titleCameraX(t, world)` = `(t · TITLE_CAM_SPEED) % (world.widthPx − VIEW_W)`.
- [x] `logic/game.ts`: `GameMode` um `'title' | 'intro'` erweitern. `GameState` bekommt
  `highscore: number`. `createGame(level, random = Math.random, highscore = 0)` liefert
  `mode: 'title'`, `camX: 0`.
- [x] `logic/game.ts`: `startLevel(state, score, tokenCount): GameState` = `createGame(state.level,
  state.random, state.highscore)` mit übernommenem `score`/`tokenCount`, `mode: 'intro'`,
  `modeTime: 0`, `camX = cameraX(player, world)`.
- [x] `logic/game.ts` → `stepGame`:
  - `title`: `time += dt`, `camX = titleCameraX(modeTime, world)`. Bei `go` →
    `return startLevel(state, 0, 0)`.
  - `intro`: `time += dt`, `stepEffects`, `stepBugs` (kein `stepPlayer`, keine Kollision). Wechsel
    zu `playing`, wenn `modeTime ≥ INTRO_TIME − EPS` oder (`modeTime ≥ INTRO_SKIP_AFTER − EPS` und `go`).
  - `won`/`gameOver`: ENTER führt vorerst zu `startLevel(state, 0, 0)` statt `createGame`.
- [x] `render/title.ts` (neu): `drawTitle(ctx, state)`: `dim(0.55)`, dann die Texte nach 9.2
  (Größen, Farben, y 130/180/360/410/435/480/515), Blinken über `blinkColor(state.modeTime)`,
  Highscore-Zeile nur bei `state.highscore > 0`, große Claudia nach Entscheidung 9.
- [x] `render/overlay.ts`: `dim` exportieren, `blinkColor(t)` (`t % 1 < 0.6 ? '#fff' : '#fff6'`)
  herausziehen und im Game-Over-Overlay benutzen. `drawIntroOverlay(ctx, level, theme, modeTime)`
  nach 9.3: Alpha `max(0, min(1, t·3, (2,5 − t)·3))`, Balken `#000b` bei y 202, 120 hoch, `level.name`
  34 px Akzent bei y 257, `level.sub` 17 px weiß bei y 297.
- [x] `render/renderer.ts`: Im Zustand `title` die Welt ohne Claudia zeichnen, dann `drawTitle`,
  kein HUD. Claudia auch in `intro` zeichnen. Im Zustand `intro` nach dem HUD
  `drawIntroOverlay`.
- [x] `src/test/game.ts` (neu): Hilfsfunktion `playingGame(random?)` (siehe Pitfalls). Alle Tests
  in `logic/game.test.ts`, `logic/effects.test.ts` und `logic/tokens.test.ts`, die Spielen
  voraussetzen, darauf umstellen. Die Tests „ENTER after winning …“ und
  „ENTER works only from 1.2 s …“ erwarten jetzt `intro` statt `playing`.
- [x] `logic/game.test.ts`, neue Tests:
  - `createGame` startet im Titel mit 3 Leben, Score 0, Tokens 0, `camX` 0.
  - Titel: Die Kamera fährt 60 px/s (nach 60 Schritten ≈ 60, `toBeCloseTo`) und ist kurz nach
    3200 px (z. B. nach 3210 Schritten) wieder vorne (≈ 10).
    Bugs stehen still, `time` läuft.
  - Titel: ENTER, Leertaste (`jumpPressed`) startet `intro` mit Score 0, Tokens 0, 3 Leben,
    Diskette grau. Ohne Taste oder mit ←/→ bleibt der Titel.
  - Intro: Nach 150 Schritten (2,5 s) `playing`, vorher nicht. Bugs laufen, Claudia bleibt an
    `{ x: 69, y: 452 }`, auch mit gehaltenen Pfeiltasten.
  - Intro: ENTER oder Sprung vor 0,4 s (Schritt 23) bleibt im Intro, ab Schritt 24 → `playing`.
    Im Wechselschritt und im Schritt danach (ohne neue Taste) springt Claudia nicht
    (`vy === 0`, `onGround`).
  - `camera.test.ts`: `titleCameraX` bei 0 s (0), 10 s (600) und 53,4 s (≈ 4, `toBeCloseTo`).

**Automated Verification**:
- [x] `npm run typecheck` ist fehlerfrei
- [x] `npm test` ist grün
- [x] `npm run build` läuft durch

**Manual Verification**:
- [x] Im Projektordner in deinem eigenen Terminal (Mac: Cmd + Leertaste → „Terminal“, dann
  `cd` in den Projektordner) `npm install` und danach `npm run dev` ausführen. Die angezeigte
  Adresse öffnen (meist http://localhost:5173). Du siehst das Titelbild: oben „CLAUDIA“ in Orange,
  darunter „im RAM-Dschungel“ in Grün, eine große Claudia, die federnd hüpft und die Beine bewegt.
  „Drücke ENTER oder LEERTASTE“ blinkt. Darunter stehen zwei graue Zeilen mit den Tasten und gelb
  „Hilf Claudia, …“. Oben links ist keine Anzeige.
  **Note:** Seite lädt; mit einer Test-Zeichenfläche geprüft: Titel zeichnet genau diese Texte an den
  richtigen Stellen, ohne HUD.
- [x] Hinter der Abdunklung zieht Level 1 langsam nach rechts vorbei. Die Bugs stehen auf der
  Stelle, ihre Beine zappeln, und die Tokens drehen sich. Eine kleine Claudia im Level gibt es
  nicht. Eine Highscore-Zeile steht ganz unten nicht.
- [x] Drück ENTER: Oben links steht `x3`, `Tokens 0`, `Score 0`. Ein dunkler Balken blendet ein
  mit „Level 1: RAM-Dschungel“ (grün) und „Spring auf Bugs, um sie zu fixen. Sammle Tokens!“ (weiß).
  Claudia steht am Start, der erste Bug läuft. Nach etwa 2,5 s ist der Balken weggeblendet, und
  du kannst laufen.
  **Note:** automatisch getestet (Intro endet nach 150 Schritten, Bugs laufen, Claudia steht);
  Test-Zeichenfläche zeigt HUD x3/Tokens 0/Score 0 und beide Balkentexte.
- [x] Lade die Seite neu, starte mit der Leertaste und drück sofort danach nochmal die
  Leertaste: Der Balken ist sofort weg, und Claudia springt dabei **nicht**.
  **Note:** automatisch getestet (kein Sprung im Wechselschritt und danach).
- [x] Lade neu und halte ENTER auf dem Titel gedrückt: Das Intro startet, verschwindet aber nicht
  sofort, sondern läuft seine 2,5 s.

### Phase 2: Pause

Dependencies: Phase 1

P oder ESC pausiert beim Spielen, P, ESC oder ENTER spielt weiter. Ein Tab- oder Fensterwechsel
pausiert ebenfalls. Dazu kommt die Level-Zeit, die nur beim Spielen zählt.

**Tasks**:
- [x] `logic/input.ts`: `pausePressed` in `InputState` und `NO_INPUT`.
- [x] `input/keyboard.ts`: Gruppe `PAUSE = new Set(['KeyP', 'Escape'])` in `GAME_KEYS`,
  `pausePressed` wie `enterPressed` (einmal pro Druck, gelöscht in `consume` und bei `blur`).
- [x] `texts.ts`: `pauseTitle: 'PAUSE'`, `pauseText: 'Claudia denkt nach... (P zum Weiterspielen)'`.
- [x] `logic/game.ts`: `GameMode` um `'paused'` erweitern, `GameState.levelTime` (0 bei
  `createGame`).
  - `playing`: zuerst `if (input.pausePressed) { setMode(state, 'paused'); return state; }`,
    danach `levelTime += dt` und alles wie bisher.
  - `paused`: nur `time += dt`. Bei `pausePressed || enterPressed` → `playing`.
  - `pauseGame(state)`: exportiert, `playing` → `paused`, gibt `state` zurück.
- [x] `render/overlay.ts`: `drawPauseOverlay(ctx)` nach 9.4: `dim(0.6)`, „PAUSE“ 48 px weiß bei
  y 262, Text 16 px `#ccc` bei y 302.
- [x] `render/renderer.ts`: Claudia auch in `paused` zeichnen. Nach dem HUD `drawPauseOverlay`.
- [x] `main.ts`: `window.addEventListener('blur', …)` und
  `document.addEventListener('visibilitychange', …)` (nur wenn `document.hidden`) →
  `state = pauseGame(state)`.
- [x] `logic/game.test.ts`, neue Tests:
  - P im Spiel → `paused`. Claudia, Bugs, Partikel, Kamera und `levelTime` bleiben über 60
    Schritte gleich (auch mit gehaltenen Pfeiltasten), `time` läuft weiter.
  - In der Pause: Sprung, ←/→ tun nichts. P, ESC (`pausePressed`) und ENTER → `playing`.
  - Im Wechselschritt zu `paused` bewegt sich nichts.
  - P wirkt nicht in `title`, `intro`, `dying`, `won` und in `gameOver` **vor** 1,2 s (ab 1,2 s
    führt P dort ab Phase 4 zum Titel). `pauseGame` wirkt nur in `playing`.
  - Level-Zeit: Nach 60 Schritten Spielen ≈ 1 s. Sie bleibt in Intro, Pause und Todesbalken
    stehen und läuft nach dem Wiedereinstieg weiter (wird nicht auf 0 gesetzt).

**Automated Verification**:
- [x] `npm run typecheck` ist fehlerfrei
- [x] `npm test` ist grün
- [x] `npm run build` läuft durch

**Manual Verification**:
- [x] `npm run dev` starten (läuft er noch, reicht das Neuladen der Seite) und starte das Spiel.
  Lauf los, bis ein Bug in der Nähe ist, und drück P: Das Bild wird dunkel, „PAUSE“ und
  „Claudia denkt nach... (P zum Weiterspielen)“ erscheinen. Claudia und die Bugs bewegen sich nicht
  von der Stelle (Bug-Beine und Tokens dürfen auf der Stelle zappeln bzw. sich drehen).
  **Note:** automatisch getestet: Claudia, Bugs, Partikel, Kamera und Level-Zeit bleiben 60 Schritte gleich.
- [x] Drück Leertaste, ↑ und die Pfeiltasten: Nichts passiert. Drück P: Es geht weiter. Pausiere
  mit ESC und spiel mit ENTER weiter, dann pausiere mit P und spiel mit ESC weiter.
  **Note:** Logik automatisch getestet; die echten Tasten P/ESC kann nur der Browser zeigen.
- [x] Drück P im Intro, im roten Todesbalken und auf dem Titelbild: Nichts passiert.
  **Note:** automatisch getestet.
- [x] Wechsle beim Spielen mit Cmd + T in einen neuen Tab, warte ein paar Sekunden und geh zurück
  zum Spiel-Tab: Das Spiel steht in der Pause.
- [x] Klick beim Spielen in ein anderes Programm (z. B. ins Terminal), warte ein paar Sekunden und
  klick zurück ins Spiel: Das Spiel steht in der Pause, und Claudia hat kein Leben verloren.

### Phase 3: Level geschafft mit Zeitbonus und Highscore

Dependencies: Phase 2 (Level-Zeit)

Am Ziel gibt es +500 + Zeitbonus, das Terminal zeigt ✓, und Partikel fliegen. „ENTER: Abschluss“
führt zum Titel. Dabei wird der Highscore gespeichert, und er bleibt nach dem Neuladen erhalten.

**Tasks**:
- [x] `config.ts`: `GOAL_INPUT_AFTER`, `GOAL_POINTS`, `BONUS_TIME_LIMIT`, `BONUS_PER_SECOND`,
  `HIGHSCORE_KEY`.
- [x] `texts.ts`: `goalBonusLine: (bonus, score) => \`Zeitbonus: +${bonus}   Score: ${score}\``
  (je drei Leerzeichen), `goalFinish: 'ENTER: Abschluss'`. `goalHint` und `scoreLine` entfernen,
  sobald sie nicht mehr benutzt werden (Game Over folgt in Phase 4, bis dahin bleibt `goalHint`
  dort).
- [x] `logic/game.ts`: `timeBonus(levelTime)` exportieren (siehe Pitfalls), `GameState.goalBonus`
  (Startwert 0 in `createGame`).
  `reachGoal(state)`: `goalBonus = timeBonus(levelTime)`, `score += GOAL_POINTS + goalBonus`,
  `burst(effects, random, goalRect.x + 24, goalRect.y + 20, theme.accent, 40, 300)`, `won`.
- [x] `logic/game.ts` → `won`: `time += dt`, `stepEffects`, `stepBugs` (keine Kollision, kein
  `stepPlayer`, Kamera steht). Ab `modeTime ≥ GOAL_INPUT_AFTER − EPS` und `go`:
  `state.highscore = max(highscore, score)`, dann
  `return createGame(state.level, state.random, state.highscore)`.
- [x] `storage/highscore.ts` (neu):
  - `browserStorage(): Storage | null` (`window.localStorage` in `try/catch`)
  - `readHighscore(storage)`: liest `HIGHSCORE_KEY`. Fehlt der Wert, ist er keine endliche Zahl
    ≥ 0, oder wirft der Speicher, ist das Ergebnis 0. Kommazahlen werden abgerundet.
  - `writeHighscore(storage, value)`: `setItem` in `try/catch`, Fehler werden ignoriert.
  - Beide akzeptieren `null` (kein Speicher).
- [x] `main.ts`: `const storage = browserStorage()`, `let saved = readHighscore(storage)`,
  `createGame(level, Math.random, saved)`. Nach jedem Schritt: Wenn
  `state.highscore > saved`, dann `writeHighscore(storage, state.highscore)` und
  `saved = state.highscore`.
- [x] `render/terminal.ts`: Parameter `done: boolean` → `'✓'` statt `'>_'`. Der Renderer übergibt
  `state.mode === 'won'`.
- [x] `render/renderer.ts`: Aufruf von `drawGoalOverlay` an die neue Form anpassen
  (`theme, state.goalBonus, state.score, state.modeTime`).
- [x] `render/overlay.ts` → `drawGoalOverlay(ctx, theme, bonus, score, modeTime)` nach 9.5:
  `dim(0.5)`, Titel 32 px Akzent bei y 232, Bonus-Zeile 18 px gelb bei y 272, ab 1,2 s
  „ENTER: Abschluss“ 18 px `blinkColor` bei y 322.
- [x] `logic/game.test.ts`, angepasste und neue Tests:
  - „bugs stand still once the level is won“ → Bugs laufen weiter, Claudia bewegt sich nicht.
  - `effects.test.ts` „particles do not move once the level is won“ → Partikel fliegen jetzt
    weiter (umschreiben).
  - Am Ziel: `score` +500 + Bonus, `goalBonus` gesetzt, 40 Partikel in Akzentfarbe.
  - `timeBonus`: 0 s → 1200, 1 s (60 Schritte summiert) → 1195, 100,5 s → 697, 239,9 s → 0,
    240 s → 0, 300 s → 0.
  - Der alte Test „ENTER after winning …“ wird ersetzt: ENTER/Sprung bis Schritt 71 wirken
    nicht, ab Schritt 72 (1,2 s) → `title`, mit Score 0,
    Tokens 0, 3 Leben und `highscore` = Score vom Ziel. Ist der alte Highscore höher, bleibt er.
- [x] `storage/highscore.test.ts` (neu), mit einem kleinen Fake-Speicher:
  - nichts gespeichert → 0. `'2410'` → 2410.
  - `'abc'`, `''`, `'-5'`, `'NaN'`, `'Infinity'` → 0. `'12.7'` → 12.
  - `getItem` wirft → 0. `setItem` wirft → kein Fehler nach außen. `null` als Speicher → 0 bzw.
    nichts passiert.
  - Schreiben und wieder Lesen ergibt denselben Wert.

**Automated Verification**:
- [x] `npm run typecheck` ist fehlerfrei
- [x] `npm test` ist grün
- [x] `npm run build` läuft durch

**Manual Verification**:
- [x] `npm run dev` starten oder die Seite neu laden. Auf dem Titelbild steht unten noch keine
  Highscore-Zeile (falls doch, hast du schon einmal gespeichert, das ist in Ordnung).
- [x] Spiel Level 1 bis zum OUTPUT-Terminal und merk dir vorher den Score oben links: Im Terminal
  steht ✓, grüne Partikel fliegen, die Bugs laufen weiter, Claudia steht still. Du siehst
  „Task erfolgreich abgeschlossen ✓“ und gelb „Zeitbonus: +N   Score: S“. S ist der alte Score
  + 500 + N.
  **Note:** automatisch getestet (+500 + Bonus, 40 Partikel, Bugs laufen, Claudia steht);
  Test-Zeichenfläche zeigt ✓ im Terminal, „Zeitbonus: +869   Score: 1369“ und nach 1,2 s „ENTER: Abschluss“.
- [x] Drück sofort ENTER: Nichts passiert. Nach gut 1 s blinkt „ENTER: Abschluss“. Drück ENTER:
  Du bist auf dem Titelbild, und unten steht „Highscore: S“.
  **Note:** automatisch getestet (erst ab Schritt 72, danach Titel mit Highscore = S).
- [x] Lade die Seite neu (Cmd + R): „Highscore: S“ steht weiter da.
  **Note:** Speichern/Lesen mit Test-Speicher geprüft, auch blockierter Speicher und Unsinn-Werte.
- [x] Spiel nochmal und trödle bewusst (z. B. eine Minute stehen bleiben): Der Zeitbonus N ist
  kleiner als beim ersten Mal.
- [x] Ist dein neuer Score kleiner als der alte Highscore, steht auf dem Titelbild weiter der alte
  Wert.

### Phase 4: Echtes Game Over

Dependencies: Phase 3 (Highscore)

Der Platzhalter wird zum echten Game Over: Score und Highscore, „Level nochmal“ mit halbiertem
Score oder zurück zum Titel.

**Tasks**:
- [x] `texts.ts`: `gameOverScore: (score, high) => \`Score: ${score}   Highscore: ${high}\``,
  `gameOverRetry: 'ENTER: Level nochmal versuchen (Score halbiert)'`,
  `gameOverMenu: 'ESC: zurück zum Hauptmenü'`. Danach `goalHint` und `scoreLine` entfernen.
- [x] `logic/game.ts` → `dying`: Beim Übergang zu `gameOver` zuerst
  `state.highscore = max(highscore, score)`.
- [x] `logic/game.ts` → `gameOver` (alles steht, ab `GAMEOVER_INPUT_AFTER`):
  - `go` → `startLevel(state, Math.floor(state.score / 2), state.tokenCount)`
  - sonst `pausePressed` → `createGame(state.level, state.random, state.highscore)`
- [x] `render/renderer.ts`: Aufruf von `drawGameOverOverlay` an die neue Form anpassen
  (`state.score, state.highscore, state.modeTime`).
- [x] `render/overlay.ts` → `drawGameOverOverlay(ctx, score, highscore, modeTime)` nach 9.6:
  `dim(0.75)`, Titel 40 px rot bei y 212, Text 18 px weiß bei y 252, Score-Zeile 18 px gelb bei
  y 287, ab 1,2 s „ENTER: …“ 17 px `blinkColor` bei y 337 und „ESC: …“ 15 px `#ccc` bei y 364.
- [x] `logic/game.test.ts`, angepasste und neue Tests (Block „game over“):
  - Beim Übergang wird `highscore` auf den vollen Score gesetzt, wenn er höher ist, sonst nicht.
  - Bis Schritt 71 wirken ENTER und P nicht, ab Schritt 72 schon.
  - ENTER oder Sprung → `intro`, 3 Leben, Score halbiert und abgerundet (1235 → 617, 1 → 0),
    Token-Zähler bleibt, alle Tokens und Bugs wieder da, Diskette grau, Start-Position,
    `levelTime` 0, `highscore` bleibt.
  - Zweimal hintereinander Game Over halbiert zweimal.
  - P und ESC (`pausePressed`) → `title`, `highscore` bleibt. Ein neuer Start danach beginnt bei
    Score 0 und Tokens 0.
  - „other keys do nothing, also after 1.2 s“: `ALL_KEYS` enthält einen Sprung, der jetzt
    „Level nochmal“ auslöst. Den Test auf ←/→ und gehaltenen Sprung (`jumpHeld`) ohne
    `jumpPressed` umstellen. Die Tests „stops the bugs“ und „stops the particles“ bleiben.

**Automated Verification**:
- [x] `npm run typecheck` ist fehlerfrei
- [x] `npm test` ist grün
- [x] `npm run build` läuft durch

**Manual Verification**:
- [x] `npm run dev` starten oder die Seite neu laden. Starte, sammle ein paar Tokens und besiege
  einen Bug, merk dir Score und Tokens. Spring dann dreimal in einen Abgrund (mit ENTER kannst du
  den roten Balken abkürzen).
- [x] Nach dem letzten Balken erscheint „KONTEXTFENSTER VOLL“ (rot), „Game Over – die Session ist
  abgelaufen.“ und gelb „Score: X   Highscore: Y“. Ist X höher als dein bisheriger Highscore,
  ist Y = X. Nach gut 1 s blinkt „ENTER: Level nochmal versuchen (Score halbiert)“, darunter
  steht grau „ESC: zurück zum Hauptmenü“.
  **Note:** Test-Zeichenfläche: Score 1235 bei altem Highscore 900 zeigt „Score: 1235   Highscore: 1235“
  und nach 1,2 s beide Hinweise.
- [x] Drück ENTER: Das Intro erscheint wieder. Oben stehen `x3`, der halbe Score (abgerundet,
  z. B. 235 → 117) und derselbe Token-Zähler wie vorher. Die Diskette ist grau, alle Tokens und
  Bugs sind wieder da.
  **Note:** automatisch getestet (1235 → 617, Token-Zähler bleibt, alles neu aufgebaut).
- [x] Geh nochmal Game Over und drück ESC: Du bist auf dem Titelbild, der Highscore steht unten.
  Starte mit ENTER: `Score 0`, `Tokens 0`.
- [x] Geh nochmal Game Over und drück P: Auch damit kommst du zum Titelbild.
- [x] Lade die Seite neu: Der Highscore ist der höchste Score, den du in diesen Tests erreicht
  hast, auch wenn er von einem Game Over stammt.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

- **Phase 1, Titel-Claudia:** Die Beine im Takt von voller Geschwindigkeit (270 px/s, Wechsel
  alle ~30 ms) wirkten in dreifacher Größe verschwommen. Auf Wunsch des Nutzers laufen sie auf dem
  Titel jetzt mit `TITLE_RUN_SPEED = 60` (Wechsel alle ~0,13 s). Weicht von Entscheidung 9 ab.
  Danach immer noch „verpixelt und verschwommen“: Die Hüpfhöhe war keine ganze Zahl, darum wurden
  die Kanten bei dreifacher Größe in jedem Bild anders geglättet. Jetzt auf ganze Pixel gerundet.
  Das grobe Umspringen der Beine (zwei feste Stellungen statt weichem Schwingen wie im Prototyp)
  bleibt bis Slice 11 (neues Aussehen), vom Nutzer so entschieden.
- **Phase 4, „Level nochmal“:** Nach dem Test fand der Nutzer den halbierten Score komisch. Auf seinen
  Wunsch wie bei Super Mario: „Level nochmal“ = `startLevel(state, 0, 0)` (Score 0, Tokens 0, 3 Leben,
  Highscore bleibt). Hinweis jetzt „ENTER: Level nochmal versuchen“. Die Halbieren-Tests sind ersetzt.
  Spec, `product.md` und `design.md` angepasst.

## References

- Spec: `docs/agents/specs/2026-10-01-spielablauf-bildschirme.md`
- `docs/prototype-reference.md` — Abschnitt 9 (9.1 Zustände, 9.2 Titel, 9.3 Intro, 9.4 Pause,
  9.5 Level geschafft, 9.6 Game Over, 9.8 Highscore, 9.9 Tasten), Abschnitt 8 (Overlays)
- `docs/design.md` — Screens „Titelbild“ und „Overlays“, Navigation, States
- `docs/architecture.md` — Building blocks (Spiellogik getrennt, Speicher), Data
- Vorheriger Plan: `docs/agents/plans/2026-10-01-tokens-bugs-leben.md` (Entscheidungen 4, 5, 10)
