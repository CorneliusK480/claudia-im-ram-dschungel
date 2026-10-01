---
date: 2026-10-01
topic: "Claudia läuft durch Level 1"
spec: "docs/agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md"
tags: [plan, setup, level, physik, kamera, zeichnen, eingabe]
status: done
---

# PLAN: Claudia läuft durch Level 1

Dieser Plan setzt Slice 1 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md`](../specs/2026-10-01-claudia-laeuft-durch-level-1.md).
Das Projekt hat noch keinen Code. Dieser Plan legt deshalb auch das Grundgerüst an (TypeScript,
Vite, Vitest), aber nur so viel, wie dieser Slice braucht.

## What you'll be able to do

Du öffnest die Seite und bist sofort in Level 1 „RAM-Dschungel“. Mit den Pfeiltasten bzw. WASD und
der Leertaste lässt du Claudia durch das Gelände laufen und springen. Sie landet auf Plattformen,
stößt sich von unten den Kopf und fällt in Abgründe, danach steht sie wieder am Start. Am
OUTPUT-Terminal erscheint „Task erfolgreich abgeschlossen ✓“, und ENTER startet das Level neu. Ist
die Level-Datei kaputt, siehst du einen roten Fehlerhinweis.

```
┌──────────────────────── 960 × 544, skaliert ───────────────────────┐
│  Himmel-Verlauf, grünes Leuchten, Lianen (bewegen sich langsamer)  │
│                  ▄▄▄▄                                              │  ← Plattform Reihe 8
│        ▄▄▄▄                                                        │  ← Plattform Reihe 11
│   🤖                                                                │  ← Claudia, Start Spalte 2
│ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │  ← Boden mit hellerer Oberkante
│ ████████████████████████████    █████████████████████████████████  │
└────────────────────────────────────────────────────────────────────┘

Ziel erreicht:                              Level-Datei kaputt:
┌──────────────────────────────────┐        ┌──────────────────────────────────────┐
│ (Spiel steht, dunkle Ebene)      │        │ Level 1 konnte nicht geladen werden  │ (rot)
│ Task erfolgreich abgeschlossen ✓ │        │                                      │
│        ENTER: nochmal            │        │ • plats[3]: erwartet 3 ganze Zahlen  │
└──────────────────────────────────┘        └──────────────────────────────────────┘
```

## Acceptance Criteria

Aus der Spec (unverändert):

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

Beim Planen hinzugekommen:

- [x] Halte ich die Sprungtaste nach der Landung einfach gedrückt, springt Claudia nicht von selbst wieder ab. Für jeden Sprung muss ich neu drücken.
- [x] Klicke ich während des Laufens aus dem Fenster heraus, bleibt Claudia stehen und läuft nicht endlos weiter.

## Technical Key Decisions and Tradeoffs

1. **Level-Datei wird zur Laufzeit geladen:** `public/levels/level1.json` wird beim Start per
   `fetch` geholt, mit `JSON.parse` gelesen und dann geprüft.
   - Why: Nur so lässt sich eine kaputte Datei (z. B. ein fehlendes Komma) im Spiel als Hinweis
     anzeigen.
   - Instead of: `import level from './level1.json'`. Dabei bricht bei einem Syntaxfehler schon
     Vite ab, und das Spiel kann keinen eigenen Hinweis mehr zeigen.
2. **Eigene Prüffunktion ohne Bibliothek:** `validateLevel` prüft jedes Feld aus dem Level-Format
   (`docs/prototype-reference.md`, Abschnitt 2) und sammelt **alle** Fehler mit Pfad, z. B.
   `plats[3]: erwartet 3 ganze Zahlen`.
   - Why: Das Format ist klein, die Meldungen sind deutsch und genau, und es kommt keine
     Abhängigkeit dazu.
   - Instead of: eine Prüf-Bibliothek (z. B. zod). Das wäre eine weitere Abhängigkeit mit
     englischen Meldungen.
3. **Spiellogik ist reiner Code ohne Browser:** `src/logic/` kennt weder Canvas noch Tastatur. Es
   bekommt einen Eingabe-Zustand und einen Zeitschritt und gibt neuen Zustand zurück. Das Zeichnen
   (`src/render/`) liest den Zustand nur.
   - Why: So verlangt es `docs/architecture.md`, und die Regeln lassen sich ohne Bildschirm testen.
4. **Kollision in zwei Schritten:** erst waagerecht bewegen und an festen Rechtecken stoppen, dann
   senkrecht bewegen und stoppen (landen bzw. Kopf stoßen). Boden und Plattformen sind einfach eine
   Liste von festen Rechtecken.
   - Why: Bewährtes Verfahren für Mario-artige massive Plattformen, ohne Hängenbleiben an Ecken.
   - Instead of: beide Richtungen gleichzeitig auflösen. Das führt an Kanten zu Sprüngen und
     Festkleben.
5. **Plattformen sind eine ganze Kachel dick (32 px)** und sehen aus wie schwebende Bodenstücke mit
   hellerer Oberkante (`theme.top`). *(Mit dem Nutzer abgestimmt.)*
6. **Feste 1/60-s-Schritte mit Obergrenze:** Die Schleife sammelt die echte Zeit und rechnet daraus
   ganze 1/60-s-Schritte. Pro Bild zählen höchstens 100 ms. Wird der Tab versteckt
   (`visibilitychange`), wird die gesammelte Zeit verworfen.
   - Why: gleiches Tempo auf jedem Gerät, und nach einem Tab-Wechsel kein Satz nach vorne.
     *(Mit dem Nutzer abgestimmt: Spiel pausiert im Hintergrund unbemerkt.)*
7. **Sprungtaste als „neu gedrückt“-Ereignis:** Ein Sprung entsteht nur aus einem *neuen*
   Tastendruck (für Jump Buffer). Das Halten der Taste steuert nur die variable Sprunghöhe.
   Automatische Tastenwiederholung (`event.repeat`) zählt nicht als neuer Druck.
   *(Mit dem Nutzer abgestimmt: kein automatisches Dauerhüpfen.)*
8. **Fenster verliert den Fokus → alle Tasten los** (`blur`-Ereignis).
   *(Mit dem Nutzer abgestimmt.)*
9. **Scharfe Darstellung in jeder Größe:** Das Canvas bekommt intern die echte Pixelgröße der
   Anzeige (Anzeigegröße × `devicePixelRatio`). Gezeichnet wird weiter in 960 × 544-Koordinaten,
   über einen Skalierungsfaktor (`ctx.setTransform`).
   - Why: Kanten und Text bleiben scharf, auch bei krummen Fenstergrößen.
   - Instead of: ein 960 × 544-Canvas per CSS strecken. Das wird verschwommen oder ungleichmäßig
     pixelig.
10. **Alle deutschen Texte in `src/texts.ts`**, auch die Prüf-Meldungen. Der Code selbst ist
    englisch benannt.
    - Why: So verlangt es `docs/architecture.md` (später ist eine englische Fassung möglich).
11. **Tasten über `event.code`** (`ArrowLeft`, `KeyA`, `Space` …) statt über `event.key`.
    - Why: Funktioniert auf deutscher und englischer Tastatur gleich, weil die Position zählt.
12. **Nach dem Sturz:** Das Bild bleibt 0,5 s stehen (Kamera ruht, Claudia ist nicht mehr zu sehen),
    dann stehen Claudia und Kamera am Start. *(Mit dem Nutzer abgestimmt.)*
13. **Fehlerhinweis:** roter Titel „Level 1 konnte nicht geladen werden“, darunter die einzelnen
    Fehler. Bei Syntaxfehlern steht dort die Original-Meldung des Browsers, die englisch sein kann.
    *(Mit dem Nutzer abgestimmt.)*
14. **Automatische Tests mit Vitest** für Level-Prüfung, Bewegung, Kollision, Kamera, Abgrund und
    Ziel. Sie entstehen in der Phase, die das Verhalten liefert.
    - Why: So verlangt es `docs/architecture.md`.
15. **Kein Linter in diesem Slice.** Die Prüfung läuft über TypeScript im strengen Modus
    (`strict`), dazu kommen Tests und der Build.
    - Why: weniger Einrichtung. Einen Linter kann man später ergänzen.

## Current State

Es gibt keinen Code, nur Dokumente. Das Projekt ist (noch) kein Git-Repository. Git und GitHub
kommen mit Slice 2.

```
little_game_real/
├── docs/            product.md · architecture.md · design.md · prototype-reference.md
│   └── agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md
└── .agents/ .claude/  (Skills)
```

## Desired End State

```
  Tastatur ──▶ input/keyboard.ts ──(left, right, jumpHeld, jumpPressed, enterPressed)──┐
                                                                                       ▼
  public/levels/level1.json ──▶ level/load.ts ──▶ level/validate.ts ──▶ ok? ──▶ logic/game.ts
                                                     │ Fehler                  stepGame(state, input, 1/60)
                                                     ▼                         ├─ logic/player.ts  (Physik)
                                              render/error.ts                  ├─ logic/world.ts   (Rechtecke)
                                                                               └─ logic/camera.ts
                                                                                       │ Zustand
                     loop.ts (feste 1/60-s-Schritte, max. 100 ms/Bild) ───────────────▶ render/
                                                                     background · terrain · terminal
                                                                     · claudia · overlay  (Canvas)
```

Spielzustände in diesem Slice:

```
 playing ──(Claudia unten aus dem Bild)──▶ respawning ──(0,5 s)──▶ playing (am Start, Kamera vorne)
    │
    └──(berührt OUTPUT)──▶ won ──(ENTER)──▶ playing (neues Spiel aus denselben Level-Daten)
```

## Abstractions and Code Reuse

Alles ist neu. Diese Struktur wird angelegt:

- `package.json` – Skripte `dev` (vite), `build` (`tsc --noEmit && vite build`), `typecheck`
  (`tsc --noEmit`), `test` (`vitest run`). Abhängigkeiten nur als devDependencies: `vite`,
  `vitest`, `typescript`, `@types/node` (Tests lesen die Level-Datei mit `fs`).
- `tsconfig.json` – `strict: true`, `noEmit`, Ziel ES2022, `moduleResolution: "bundler"`,
  `types: ["vite/client", "node"]`.
- `vite.config.ts` – `defineConfig` aus `vitest/config` (damit der `test`-Abschnitt erlaubt ist),
  `base: './'` (siehe Pitfalls), `test.environment: 'node'`.
- `index.html` – nur `<canvas id="game">` und `<script type="module" src="/src/main.ts">`, Titel
  „Claudia im RAM-Dschungel“.
- `.gitignore` – `node_modules`, `dist`.
- `public/levels/level1.json` – **alle** Level-1-Daten aus `docs/prototype-reference.md`,
  Abschnitt 3, als JSON (auch `tokens`, `bugs`, `viruses`, `spikes`, `power`, `saves`, `fakes`,
  `fakeTokens`, `injectors`).
- `src/`
  - `main.ts` – Start: Screen einrichten, Level laden, bei Fehler `drawError`, sonst Spiel anlegen,
    Eingabe anschließen, Schleife starten.
  - `config.ts` – alle festen Werte: `TILE = 32`, `VIEW_W = 960`, `VIEW_H = 544`, `ROWS = 17`,
    `GRAV = 2100`, `JUMP = 780`, `SPEED = 270`, `ACC = 2600`, `FRICTION = 2400`, `MAXFALL = 950`,
    `COYOTE = 0.1`, `JUMP_BUFFER = 0.13`, `JUMP_CUT = 0.42`, `PLAYER_W = 22`, `PLAYER_H = 28`,
    `GOAL_W = 48`, `GOAL_H = 64`, `RESPAWN_DELAY = 0.5`, `STEP = 1/60`, `MAX_FRAME = 0.1`, Farben
    für Rahmen (`#020a06`), Fehler (`#ff6b6b`), Schrift (`"Courier New", monospace`).
  - `texts.ts` – alle deutschen Texte: `levelLoadError(n)`, `goalTitle`
    („Task erfolgreich abgeschlossen ✓“), `goalHint` („ENTER: nochmal“), `terminalLabel`
    („OUTPUT“) und die Prüf-Meldungen als kleine Funktionen (z. B.
    `expectedInts(path, n)` → „plats[3]: erwartet 3 ganze Zahlen“).
  - `level/`
    - `types.ts` – `LevelData` (alle Felder aus dem Level-Format; Felder, die Level 1 nicht hat,
      wie `blocks`, `movers`, `crumbles`, `leaks`, `dj`, `boss`, sind optional), `Theme`.
    - `validate.ts` – `validateLevel(raw: unknown): { ok: true; level: LevelData } | { ok: false; errors: string[] }`.
    - `load.ts` – `parseLevel(text: string)` (JSON lesen + prüfen, testbar ohne Netzwerk) und
      `loadLevel(url)` (`fetch` + `parseLevel`, Netzwerk-/404-Fehler werden auch zu `errors`).
  - `logic/`
    - `rect.ts` – `Rect { x, y, w, h }`, `overlaps(a, b)` (echte Überlappung, bloßes Berühren
      zählt nicht).
    - `world.ts` – `buildWorld(level)`: `solids` (Boden-Abschnitte als Rechtecke über Reihen 15–16,
      die 10 `plats` als 1 Kachel hohe Rechtecke; **keine** `fakes`), `goalRect`, `widthPx`,
      `startPos` (Spalte 2 mittig, Füße auf Reihe 15).
    - `player.ts` – `Player { x, y, vx, vy, onGround, facing, coyote, jumpBuffer }`,
      `createPlayer(world)`, `stepPlayer(player, input, world, dt)`.
    - `camera.ts` – `cameraX(player, world)`: Claudia mittig, begrenzt auf `0 … widthPx − VIEW_W`.
    - `game.ts` – `GameState { mode: 'playing' | 'respawning' | 'won', world, player, camX, respawnTimer }`,
      `createGame(level)`, `stepGame(state, input, dt)`.
    - `input.ts` – Typ `InputState { left, right, jumpHeld, jumpPressed, enterPressed }` (gehört
      zur Logik, damit sie nichts von Tastatur weiß).
  - `input/keyboard.ts` – `createKeyboard(target)`: hört auf `keydown`/`keyup`/`blur`,
    `read(): InputState` liefert den aktuellen Zustand, die „gedrückt“-Ereignisse gelten bis zum
    nächsten Logikschritt, danach `consume()`.
  - `loop.ts` – `advance(accumulator, frameSeconds)` → `{ steps, accumulator }` (reine Funktion,
    testbar) und `startLoop(step, render)` mit `requestAnimationFrame` und `visibilitychange`.
  - `render/`
    - `screen.ts` – `setupScreen(canvas)`: Größe berechnen (`scale = min(innerW/960, innerH/544)`),
      Canvas zentrieren, interne Größe × `devicePixelRatio`, bei `resize` neu, liefert `ctx` mit
      passender Transformation.
    - `background.ts` – `drawBackground(ctx, theme, camX)`: Himmel als senkrechter Verlauf
      (`sky[0]` → `sky[1]`), weiche grüne Leucht-Flecken in `theme.far` (Parallax 0,15), hängende
      wellige Lianen in `theme.vines`-Farben (Parallax 0,4). Positionen kommen aus einem festen
      Zufallsgenerator mit Startwert, damit sie bei jedem Bild gleich sind.
    - `terrain.ts` – `drawTerrain(ctx, world, theme, camX)`: Rechtecke in `theme.ground` mit 6 px
      Oberkante in `theme.top`, nur was im Bild liegt.
    - `terminal.ts` – `drawTerminal(ctx, world, theme, camX)`: 48 × 64 Gehäuse, dunkler Bildschirm
      mit „>_“ und „OUTPUT“ in `theme.accent` (#3cff9a).
    - `claudia.ts` – `drawClaudia(ctx, player, camX)`: kleine Roboterin um die 22 × 28-Hitbox, helles
      Gehäuse, dunkles Visier mit grünen Augen, Antenne. Spiegeln nach `facing`. Haltungen:
      Stehen, Laufen (Beine wechseln abhängig von `x`), Springen (Beine angezogen).
    - `overlay.ts` – `drawGoalOverlay(ctx, theme)`: halbtransparentes Schwarz, `goalTitle` in
      `theme.accent`, `goalHint` darunter.
    - `error.ts` – `drawError(ctx, title, errors)`: dunkler Grund, roter Titel, Fehler als Liste
      (höchstens ~12 Zeilen, Rest als „… und N weitere“).
    - `renderer.ts` – `render(ctx, state, theme)`: ruft die Teile in fester Reihenfolge auf.
      Claudia wird im Modus `respawning` nicht gezeichnet. `won` zeichnet zusätzlich das Overlay.
- Tests liegen neben dem Code als `*.test.ts`.

## Pitfalls

- **`base: './'` in `vite.config.ts` und Laden mit `import.meta.env.BASE_URL`:** Die Level-URL
  muss `${import.meta.env.BASE_URL}levels/level1.json` sein, nicht `/levels/level1.json`. Sonst
  findet das Spiel die Datei in Slice 2 auf GitHub Pages (Unterordner) nicht.
- **Leertaste und Pfeiltasten scrollen die Seite:** Bei den Spieltasten `preventDefault()`
  aufrufen.
- **`event.repeat` ignorieren:** Gehaltene Tasten erzeugen wiederholte `keydown`-Ereignisse. Die
  dürfen nicht als neuer Sprung oder neues ENTER zählen.
- **„Gedrückt“-Ereignisse genau einmal verbrauchen:** `jumpPressed`/`enterPressed` gelten nur für
  den **ersten** Logikschritt nach dem Drücken. Laufen in einem Bild mehrere Schritte, sehen die
  weiteren das Ereignis nicht mehr. Läuft in einem Bild kein Schritt, bleibt das Ereignis erhalten.
  Ein ENTER während `playing` wird verbraucht und verworfen, damit es nicht später das Overlay
  überspringt.
- **Drücken und Loslassen im selben Bild:** `jumpPressed` ist dann wahr, `jumpHeld` falsch. Das
  muss einen kleinen Hüpfer ergeben (Sprung startet, wird im selben Schritt gekürzt) und darf nicht
  verloren gehen.
- **Reihenfolge in `stepPlayer`** (sonst stimmen Sprunghöhe und Sprunghilfen nicht):
  1. waagerecht: Richtung = rechts − links. Ist sie ≠ 0: `vx += dir·ACC·dt`, begrenzt auf ±SPEED,
     `facing` setzen (nach 7 Schritten ist `vx = 270` erreicht). Sonst Richtung 0 mit `FRICTION·dt` abbremsen, ohne über 0 hinaus. Beide
     Tasten gedrückt ergibt Richtung 0, also Bremsen.
  2. Zeiten: `coyote = onGround ? COYOTE : coyote − dt`, `jumpBuffer = jumpPressed ? JUMP_BUFFER : jumpBuffer − dt`.
  3. Sprung: wenn `jumpBuffer > 0 && coyote > 0`, dann `vy = −JUMP`, `jumpBuffer = 0`,
     `coyote = 0`, `onGround = false`.
  4. Variable Höhe: wenn `!jumpHeld && vy < −JUMP_CUT·JUMP`, dann `vy = −JUMP_CUT·JUMP`.
  5. Schwerkraft: `vy = min(vy + GRAV·dt, MAXFALL)`.
  6. `x += vx·dt`, gegen `solids` auflösen (`vx = 0`), dann auf `0 … widthPx − PLAYER_W`
     begrenzen (unsichtbare Wände).
  7. `onGround = false`, `y += vy·dt`, gegen `solids` auflösen: Fallen → auf Oberkante setzen,
     `vy = 0`, `onGround = true`. Steigen → unter Unterkante setzen, `vy = 0` (Kopf gestoßen).
- **Gemessene Sprunghöhe:** Die ≈ 145 px bzw. ≈ 26 px aus der Referenz sind eine Rechnung ohne
  Schritte. Mit festen 1/60-s-Schritten in der Reihenfolge oben ergeben sich nachgemessen
  ≈ 138 px (≈ 4,3 Kacheln, also „gut 4 Kacheln“) für den vollen Sprung und ≈ 23 px für den
  kürzesten Hüpfer. Tests prüfen mit Toleranz (133–143 px bzw. 18–28 px), nicht auf exakte Werte.
- **Zeitzähler mit Rundungsfehlern:** 30 × (1/60) von 0,5 abgezogen ergibt nicht exakt 0, sondern
  einen winzigen Rest. Deshalb alle Zähler (`respawnTimer`, `coyote`, `jumpBuffer`) mit kleiner
  Toleranz vergleichen (`<= 1e-9` statt `<= 0` bzw. `> 1e-9` statt `> 0`). Dann dauert der
  Wiedereinstieg genau 30 Schritte. Tests für Coyote und Buffer prüfen klar innerhalb bzw. klar
  außerhalb des Zeitfensters, nicht genau an der Grenze.
- **Start- und Zielposition rechnen:** Claudia-Start `x = 2·32 + (32 − 22)/2 = 69`,
  `y = 15·32 − 28 = 452`. Das Terminal liegt bei `x = 125·32 = 4000`, `y = 15·32 − 64 = 416`,
  48 × 64. Der volle Sprung ist höher als das Terminal, man kann also darüber springen. Dann
  stoppt die unsichtbare Wand bei Spalte 130, Claudia landet dahinter und läuft zurück hinein. Das
  ist so gewollt.
- **„Unten aus dem Bild“ = `player.y > 544`** (Oberkante von Claudia unterhalb der Spielfläche).
  Erst dann startet der 0,5-s-Zähler, nicht schon bei Reihe 16. Der Schritt, in dem das erkannt
  wird, zählt noch nicht. Ab dem nächsten Schritt wird 30-mal heruntergezählt.
- **Level-Datei nicht aus dem Browser-Speicher:** `fetch(url, { cache: 'no-store' })`, sonst
  zeigt der Browser nach dem Bearbeiten von `level1.json` womöglich noch die alte Fassung.
- **Kein leeres Bild beim Laden:** `design.md` sagt „keine sichtbare Ladephase“. Deshalb Rahmen und
  Himmel-Verlauf (Level-1-Farben aus `config.ts` als Platzhalter) sofort zeichnen, bevor die Datei
  da ist.
- **`goalHint` weicht bewusst von `design.md` ab:** Dort steht „ENTER: nächster Task“. In diesem
  Slice gibt es aber kein nächstes Level, laut Spec startet ENTER Level 1 neu, also
  „ENTER: nochmal“. Die Fassung aus `design.md` kommt mit Slice 4.
- **Kamera nur in `playing` nachführen.** In `respawning` bleibt sie stehen und springt erst beim
  Neustart auf den Anfang. Beim Zeichnen `camX` runden, damit der Boden nicht flimmert.
- **`fakes` und `fakeTokens` sind in der Datei, dürfen aber weder Rechteck noch Bild werden.** Das
  gilt auch für `tokens`, `bugs` usw.: Sie werden geladen und geprüft, aber weder in die Welt
  übernommen noch gezeichnet.
- **Reihenfolge beim Prüfen:** zuerst den Typ (Zahl/Text/Liste) prüfen, danach die Grenzen
  (`0 ≤ x < width`, `0 ≤ y < 17`, Boden `von < bis ≤ width`). Sonst entstehen Folgefehler.
- **TypeScript-Version:** Laut npm ist gerade TypeScript 7 aktuell, Vite 8, Vitest 5. Gibt es mit
  TypeScript 7 Probleme beim `tsc --noEmit`, stattdessen `typescript@~5.9` verwenden und das in
  den Implementation Notes festhalten.

## Implementation

### Phase 1: Level 1 ist zu sehen

Dependencies: None

Das Grundgerüst steht. Die Level-Datei wird geladen und geprüft, und das Bild zeigt Level 1 ab dem
Start: Rahmen, Hintergrund, Boden, Plattformen und Claudia. Das OUTPUT-Terminal ist erst nach dem
Laufen in Phase 2 zu sehen. Eine kaputte Datei zeigt den Fehlerhinweis. Noch bewegt sich nichts.

**Tasks**:
- [x] `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore` wie unter
  „Abstractions“ anlegen. `npm install -D vite vitest typescript @types/node` ausführen.
- [x] `index.html` + kleines CSS (im `<style>` der Seite): `body` ohne Rand,
  Hintergrund `#020a06`, `overflow: hidden`. Das Canvas mittig mit grünem Leuchten
  (`box-shadow: 0 0 40px rgba(26, 255, 140, 0.35)`).
- [x] `src/config.ts` und `src/texts.ts` mit allen Werten bzw. Texten aus „Abstractions“ anlegen.
- [x] `public/levels/level1.json`: Level 1 aus `docs/prototype-reference.md`, Abschnitt 3,
  vollständig als gültiges JSON übertragen (Schlüssel in Anführungszeichen, keine Kommas am Ende).
- [x] `src/level/types.ts`: `LevelData`, `Theme`.
- [x] `src/level/validate.ts`: `validateLevel` prüft `name`, `sub` (Text); `theme` (`sky` = 2
  Texte, `far`/`ground`/`top`/`accent` Text, `vines` Liste von Texten, `lava` optional ja/nein);
  `music` (Text); `width` (ganze Zahl > 0); `start`, `goal` (2 ganze Zahlen im Level); `ground`
  (Liste von `[von, bis]`); alle Listenfelder mit der richtigen Anzahl ganzer Zahlen (`plats`,
  `fakes`, `crumbles`, `tokens`, `fakeTokens` je 3; `bugs`, `viruses`, `injectors`, `power`, `dj`,
  `leaks` je 2; `spikes` 2; `blocks` 4; `movers` 5, das letzte darf eine Kommazahl sein).
  **Ausnahmen:** `saves` ist eine einfache Liste ganzer Zahlen (`[64]`), `boss` ist ein einzelnes
  Paar `[x, y]`, keine Liste von Paaren. Pflicht sind `name`, `sub`, `theme`, `music`, `width`, `start`,
  `goal`, `ground`. Alle Listen sind optional, fehlen sie, gilt die Liste als leer. Gesammelte
  Fehlertexte kommen aus `texts.ts`.
- [x] `src/level/load.ts`: `parseLevel(text)` (JSON-Fehler → `errors: [Browser-Meldung]`) und
  `loadLevel(url)` (HTTP-Fehler → `errors: ["Datei nicht gefunden (404)"]` o. ä., ebenfalls aus
  `texts.ts`).
- [x] `src/logic/rect.ts`, `src/logic/world.ts` (`buildWorld`) und `src/logic/player.ts` (vorerst
  nur `Player` und `createPlayer`), `src/logic/camera.ts` (`cameraX`), `src/logic/game.ts`
  (`GameState`, `createGame`, `stepGame` vorerst ohne Wirkung).
- [x] `src/render/screen.ts`: Skalierung, Zentrierung, `devicePixelRatio`, Neuberechnung bei
  `resize`.
- [x] `src/render/background.ts`, `terrain.ts`, `terminal.ts`, `claudia.ts` (Steh-Haltung),
  `error.ts`, `renderer.ts`.
- [x] `src/main.ts`: Screen einrichten, sofort Rahmen und Himmel zeichnen. Level laden. Bei Fehler `drawError` (auch nach `resize`
  neu zeichnen), sonst `createGame` und einmal pro Bild `render` (Schleife ohne Logikschritte,
  die kommt in Phase 2).
- [x] Tests `src/level/validate.test.ts`: die echte `public/levels/level1.json` (per `fs` gelesen)
  ist gültig; ein Text mit gelöschtem Komma → genau ein Fehler; `plats` mit nur 2 Zahlen → Fehler
  enthält „plats[“; fehlendes `width` → Fehler; Boden über `width` hinaus → Fehler; mehrere Fehler
  werden alle gemeldet.
- [x] Tests `src/logic/world.test.ts`: Level 1 ergibt 4 Boden- + 10 Plattform-Rechtecke = 14
  `solids`; kein Rechteck bei Spalte 78 Reihe 11; Start = (69, 452) steht genau auf dem Boden;
  Ziel-Rechteck = (4000, 416, 48, 64); Kamera ist bei 0 am Start und bei `130·32 − 960 = 3200`
  am Ende.

**Automated Verification**:
- [x] `npm run typecheck` läuft ohne Fehler
- [x] `npm test` – alle Tests grün
- [x] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [x] Im Projektordner in deinem eigenen Terminal `npm install` und dann `npm run dev` ausführen
  und die angezeigte Adresse öffnen (meist http://localhost:5173). Ohne Titelbild siehst du sofort
  Level 1: Claudia steht links auf dem Boden, dahinter Himmel-Verlauf, grünes Leuchten und Lianen.
  Rechts liegt die erste Plattform in Reihe 11.
  **Note:** Dev-Server geprüft: Seite, Skripte und `levels/level1.json` werden ausgeliefert.
- [x] Um die Spielfläche herum ist ein fast schwarzer Rand mit grünem Leuchten. Ziehst du das
  Fenster schmaler oder flacher, passt sich das Bild sofort an, bleibt unverzerrt und scharf.
  **Note:** Rund um die Spielfläche bleiben immer mindestens 16 px Rand, damit das Leuchten sichtbar ist.
- [x] Öffne `public/levels/level1.json` und lösche bei `plats` das Komma zwischen `[9, 11, 4]` und
  `[17, 8, 4]`. Speichere und lade die Seite neu: In Rot steht „Level 1 konnte nicht geladen werden“ mit einer Meldung darunter. Komma wieder
  einfügen, neu laden: Das Level ist wieder da.
  **Note:** per Test geprüft: gelöschtes Komma ergibt genau eine Fehlermeldung.
- [x] Ändere bei der ersten Plattform `[9, 11, 4]` in `[9, 11]`, speichere und lade neu: Der
  Hinweis nennt `plats[0]`. Danach wieder zurückändern.
  **Note:** per Test geprüft (`plats[3]` mit 2 Zahlen → „plats[3]: erwartet 3 ganze Zahlen“).

### Phase 2: Claudia läuft und springt

Dependencies: Phase 1

Tastatur, Physik mit allen Sprunghilfen, massive Plattformen, Levelränder, Kamera mit Parallax und
die feste Schleife mit Pause bei Tab-Wechsel.

**Tasks**:
- [x] `src/logic/input.ts`: Typ `InputState`.
- [x] `src/input/keyboard.ts`: Belegung über `event.code`: links `ArrowLeft`/`KeyA`, rechts
  `ArrowRight`/`KeyD`, springen `ArrowUp`/`KeyW`/`Space`, Enter `Enter`/`NumpadEnter`.
  `preventDefault()` für diese Tasten. `event.repeat` erzeugt kein neues „gedrückt“. `blur` lässt
  alles los. `read()` und `consume()` wie in „Pitfalls“ beschrieben. Alle anderen Tasten
  (X, F, P, M …) werden ignoriert.
- [x] `src/logic/player.ts`: `stepPlayer` in der Reihenfolge aus „Pitfalls“, Kollision gegen
  `world.solids` mit `overlaps`.
- [x] `src/logic/game.ts`: `stepGame` ruft im Modus `playing` `stepPlayer` auf und setzt
  danach `camX = cameraX(...)`.
- [x] `src/loop.ts`: `advance` (Bildzeit auf `MAX_FRAME` begrenzen, ganze `STEP` abzählen, Rest
  behalten) und `startLoop` (`requestAnimationFrame`; bei `visibilitychange` → sichtbar wird
  die letzte Zeitmarke neu gesetzt und der Rest verworfen).
- [x] `src/main.ts`: Schleife: pro Logikschritt `stepGame(state, keyboard.read(), STEP)` und
  danach `keyboard.consume()`, pro Bild `render`.
- [x] `src/render/background.ts`: Parallax mit `camX` (Leuchten 0,15, Lianen 0,4, Muster wiederholt
  sich lückenlos über die ganze Levelbreite).
- [x] `src/render/claudia.ts`: Lauf- und Sprunghaltung, Blickrichtung nach `facing`.
- [x] Tests `src/logic/player.test.ts` (Hilfsfunktion: Schritte mit festem Input simulieren):
  - nach 7 Schritten Rechts-Halten `vx = 270`; nach dem Loslassen nach 7 Schritten `vx = 0`
  - links + rechts gleichzeitig bremst wie ohne Eingabe
  - voller Sprung (Taste gehalten): höchster Punkt 138–150 px über dem Boden
  - kurzer Tipp (gedrückt und im selben Schritt los): höchster Punkt 18–34 px
  - Coyote: 3 Schritte (0,05 s) nach Verlassen einer Kante springen klappt, nach 9 Schritten
    (0,15 s) nicht
  - Buffer: Springen 6 Schritte (0,1 s) vor der Landung → springt beim Aufkommen; 12 Schritte
    (0,2 s) vorher → nicht
  - Taste nach der Landung weiter gehalten (ohne neues Drücken) → kein zweiter Sprung
  - Kopf stoßen: Claudia unter einer Plattform aus Reihe 11 springt → Oberkante von Claudia
    kommt nie über die Unterkante der Plattform (384 px), danach fällt sie zurück auf den Boden
  - seitlich gegen eine Plattform: Claudia mitten im Sprung direkt links neben `[9, 11, 4]` auf
    Plattformhöhe, Rechts gehalten → nach jedem Schritt gilt `x + 22 ≤ 9·32`, solange ihre
    Füße unterhalb der Oberkante (352 px) sind
  - vom Boden direkt neben einer Plattform aus Reihe 11 mit Rechts gehalten hochspringen → landet
    oben drauf; von einer Plattform aus Reihe 11 aus erreicht sie die nächste in Reihe 8
    (z. B. von `[65, 11, 4]` auf `[72, 8, 4]`)
  - Anlauf-Sprung über jeden der drei Abgründe (Spalten 28–31, 58–61, 84–87) → landet auf dem
    nächsten Boden-Abschnitt
  - Levelränder: links bei `x = 0` und rechts bei `130·32 − 22` ist Schluss
  - Fallgeschwindigkeit wird nie größer als 950
- [x] Tests `src/loop.test.ts`: 5 s Bildzeit → höchstens 6 Schritte; 1/60 s → 1 Schritt;
  Restzeit wird übernommen.
- [x] Tests `src/logic/camera.test.ts`: Claudia mitten im Level → Claudia in der Bildmitte (±1 px);
  Anfang → 0; Ende → 3200.

**Automated Verification**:
- [x] `npm run typecheck` läuft ohne Fehler
- [x] `npm test` – alle Tests grün
- [x] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [x] `npm run dev` starten (läuft er noch aus Phase 1, reicht Neuladen) und http://localhost:5173
  öffnen. Mit → bzw. D läuft Claudia nach rechts und schaut nach rechts. Mit ← bzw. A läuft sie
  nach links und schaut nach links. Lässt du los, steht sie fast sofort.
- [x] Hältst du ← und → gleichzeitig, bremst Claudia und bleibt stehen.
- [x] ↑, W und Leertaste lassen sie springen. Lange halten ergibt einen hohen Sprung (gut 4
  Kacheln), kurz tippen einen kleinen Hüpfer. Die Seite scrollt dabei nicht.
- [x] Hältst du die Sprungtaste nach der Landung einfach weiter gedrückt, springt sie nicht von
  selbst wieder ab.
  **Note:** per Test geprüft (1 s weiter gehalten → bleibt am Boden). Tastenwiederholung wird ignoriert.
- [x] Lauf von einer Plattform herunter und drück direkt danach Springen: Sie springt noch.
- [x] Drück Springen kurz bevor sie landet: Sie hüpft beim Aufkommen sofort wieder ab.
- [x] Spring unter einer Plattform hoch: Sie stößt sich den Kopf und fällt zurück. Spring knapp
  neben einer Plattform hoch und halte dabei die Pfeiltaste in ihre Richtung: Solange sie unterhalb
  der Oberkante ist, bleibt sie an der Seite stehen statt hineinzurutschen. Oben angekommen landet
  sie auf der Plattform und kann darauf laufen. Probiere alle 10 Plattformen. Die oberen
  Plattformen (Reihe 8) erreichst du nicht vom Boden aus, nur mit Anlauf von der benachbarten
  unteren Plattform.
  **Note:** per Test geprüft: alle 6 unteren Plattformen vom Boden, alle 4 oberen von der
  benachbarten unteren Plattform erreichbar.
- [x] Lauf nach rechts: Die Kamera folgt, Claudia bleibt ungefähr in der Bildmitte, Lianen und
  Leuchten ziehen langsamer vorbei als der Boden.
- [x] Ganz links steht die Kamera still, und Claudia kommt nicht über den linken Rand. Ganz rechts
  (hinter dem OUTPUT-Terminal) genauso. Das Terminal reagiert in dieser Phase noch nicht.
- [x] Kurz vor dem dritten Abgrund (Spalte 78) schwebt keine Plattform, und nirgends gibt es
  Tokens oder Gegner.
- [x] Alle drei Abgründe kannst du mit Anlauf überspringen.
  **Note:** per Test geprüft, alle drei Abgründe.
- [x] Drück X, F, P, M: Nichts passiert.
- [x] Wechsle mitten im Laufen oder Springen für ein paar Sekunden in einen anderen Tab und komm
  zurück: Claudia ist an derselben Stelle und macht keinen Satz.
- [x] Halte → gedrückt und klick dabei in ein anderes Fenster: Claudia bleibt stehen.
  **Note:** Tastatur-Logik ad hoc geprüft: Fokusverlust lässt alle Tasten los, X/F/P/M werden ignoriert.

### Phase 3: Abgrund und Ziel

Dependencies: Phase 2

Nach einem Sturz geht es zurück an den Start. Am OUTPUT-Terminal stoppt das Spiel mit dem
Ziel-Overlay, und ENTER startet neu.

**Tasks**:
- [x] `src/logic/game.ts`: In `playing` gilt: Ist die Oberkante von Claudia unter 544 px, wechselt
  der Modus zu `respawning` mit `respawnTimer = RESPAWN_DELAY`. Überlappt Claudia `goalRect`,
  wechselt er zu `won`.
- [x] `src/logic/game.ts`: In `respawning` den Zähler herunterzählen, bei ≤ 0 ein neuer Spieler am
  Start, `camX = 0`, `mode = 'playing'`. Die Kamera bleibt währenddessen stehen.
- [x] `src/logic/game.ts`: In `won` keine Bewegung. Nur `enterPressed` wirkt und ersetzt den
  Zustand durch `createGame(level)` (gleiche Level-Daten, kein Neuladen). In `playing` und
  `respawning` hat `enterPressed` keine Wirkung.
- [x] `src/render/overlay.ts`: `drawGoalOverlay` mit `texts.goalTitle` und `texts.goalHint`.
- [x] `src/render/renderer.ts`: Claudia in `respawning` nicht zeichnen. In `won` das Overlay über
  das stehende Bild legen.
- [x] Tests `src/logic/game.test.ts`:
  - Claudia über einem Abgrund fallen lassen → wird `respawning` in dem Schritt, in dem
    `y > 544` gilt; genau 30 weitere Schritte (0,5 s) später wieder `playing` mit Claudia bei
    (69, 452) und `camX = 0` (nach 29 Schritten noch `respawning`)
  - während `respawning` ändert sich `camX` nicht
  - Claudia im Sprung so platzieren, dass nur ihre Füße das Terminal überlappen → `won`
  - in `won` bewegt Rechts/Springen Claudia nicht
  - ENTER in `playing` ändert nichts. ENTER in `won` → `playing` am Start mit `camX = 0`

**Automated Verification**:
- [x] `npm run typecheck` läuft ohne Fehler
- [x] `npm test` – alle Tests grün
- [x] `npm run build` erzeugt `dist/` ohne Fehler

**Manual Verification**:
- [x] `npm run dev` starten (oder Seite neu laden) und http://localhost:5173 öffnen. Lauf in den
  ersten Abgrund: Claudia fällt aus dem Bild, das Bild steht etwa eine halbe Sekunde still, dann
  steht Claudia wieder am Start und die Kamera ist ganz vorne. Kein Text, kein Ton.
  **Note:** per Test geprüft: genau 30 Schritte (0,5 s), Kamera steht währenddessen still.
- [x] Mach dasselbe beim dritten Abgrund (weit rechts): Auch hier springt die Kamera zurück an den
  Anfang.
- [x] Drück ENTER während des Spiels: Nichts passiert.
  **Note:** per Test geprüft.
- [x] Lauf bis zum OUTPUT-Terminal und berühr es: Das Spiel steht, eine dunkle Ebene erscheint mit
  „Task erfolgreich abgeschlossen ✓“ und „ENTER: nochmal“. Pfeiltasten und Leertaste bewegen
  nichts mehr.
- [x] Drück ENTER: Level 1 beginnt von vorn, Claudia steht am Start, die Kamera ist vorne. Die
  Seite wurde nicht neu geladen.
- [x] Spring diesmal in das Terminal hinein (im Sprung berühren): Das Overlay erscheint ebenfalls.
  **Note:** per Test geprüft: schon die Füße im Sprung reichen.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

- TypeScript 7.0.2 funktioniert mit `tsc --noEmit`, kein Rückgriff auf 5.9 nötig. Vite 8.3, Vitest 5.0.
- Die Prüfung meldet zusätzlich unbekannte Felder (z. B. Tippfehler `platz`), damit Daten nicht
  stillschweigend verloren gehen.
- `GameState` enthält zusätzlich `level`, damit ENTER (Phase 3) ohne Neuladen neu starten kann und
  das Zeichnen die Farben kennt (`render(ctx, state)` statt `render(ctx, state, theme)`).
- Um die Spielfläche bleiben mindestens 16 px Rand, damit Rahmen und Leuchten auf allen Seiten
  sichtbar sind.
- Phase 2: Gemessene Sprunghöhe 138,4 px. Die Tests nutzen die Toleranzen aus „Pitfalls“
  (133–143 px bzw. 18–28 px), nicht die weiteren aus der Phase-2-Liste.
- Phase 2: Der Test „seitlich gegen eine Plattform“ prüft nur, solange Claudia auf Höhe der
  Plattform ist (Füße unter der Oberkante **und** Kopf über der Unterkante). Darunter darf sie
  weiterlaufen. Zusätzlich gibt es Tests für alle 10 Plattformen statt nur für ein Beispiel.
- Parallax im Hintergrund und Lauf-/Sprunghaltung von Claudia sind schon in Phase 1 mit angelegt.

## References

- Spec: `docs/agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md`
- `docs/product.md` – Slice 1
- `docs/architecture.md` – Building blocks, Technology, Constraints (960 × 544, skaliert)
- `docs/design.md` – Style (Farben Level 1, Rahmen, Schrift), Screens „Spiel“ und „Overlays“,
  States „Error“
- `docs/prototype-reference.md` – Abschnitt 1 (Koordinaten), 2 (Level-Format), 3 (Level 1),
  5 (Bewegung & Physik)
