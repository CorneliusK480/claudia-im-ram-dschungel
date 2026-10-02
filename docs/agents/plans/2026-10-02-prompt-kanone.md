---
date: 2026-10-02
topic: "Prompt-Kanone"
spec: "docs/agents/specs/2026-10-02-prompt-kanone.md"
tags: [plan, prompt-kanone, haustiere, api-credits, rate-limit, banner, hud]
status: ready
---

# PLAN: Prompt-Kanone

Dieser Plan setzt Slice 6 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-02-prompt-kanone.md`](../specs/2026-10-02-prompt-kanone.md).
Startwerte (Tempo 560 px/s, 0,75 s Flug, 5 Credits, 2 s Sperre, +75, API-Leiste, Geräusche
`shoot`, `poof`, `ratelimit`) kommen aus `docs/prototype-reference.md` (Abschnitt 7 und 10.2).
Alles andere legt die Spec bzw. dieser Plan fest (der Prototyp ist ab Slice 6 nur noch
Ideengeber).

## What you'll be able to do

Mit X oder F schießt Claudia kleine weiße Sprechblasen mit einem Befehl wie „Sei ein Cookie!“.
Trifft eine einen Bug, macht es „Puff“, und der Bug wird zu einem Feature-Geschenk, einem
Schmetterling, einer Gummiente oder einem Cookie, das mit einem Spruch aus dem Bild hüpft oder
flattert (+75 Punkte). Unter der Anzeige oben links steht die API-Leiste mit 5 Kästchen. Jeder
Schuss leert eins, alle 1,5 s füllt sich eins wieder. Wer ohne Credits schießt, bekommt
„429 Too Many Requests“ und muss 2 s warten.

```
Spiel mit Kanone (neu: API-Leiste, Prompt, Haustier)
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│ ╭ API ▮▮▮▯▯ ╮                         ← neu, x 10, y 48, 150 × 20         │
│                                                                            │
│                              „Quak! Erklär mir deinen Code.“  (schwebt)   │
│              Sei ein Cookie!            🦆 (hüpft hoch, fällt raus)        │
│   🤖           💬 →                🐞                                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Rate Limit (2 s)
┌────────────────────────────────────────────────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│ ╭ 429 RATE LIMIT ╮  (blinkt rot/weiß)                                     │
│            ┌──────────────────────────────────────────────┐                │
│            │  429 Too Many Requests – bitte warte kurz    │  (rot, y 128)  │
│            └──────────────────────────────────────────────┘                │
│   🤖                                                                       │
└────────────────────────────────────────────────────────────────────────────┘

API-Leiste im Detail (Kästchen 18 × 10 px ab x 46, Abstand 22 px)
 API [██][██][█▒░][░░][░░]      ██ voll #ffe9a8 · ▒ lädt gerade #a08a50 · ░ leer #333
```

## Acceptance Criteria

Aus der Spec, unverändert:

- [ ] Ich drücke X oder F: Eine weiße Sprechblase mit einem Befehl darüber fliegt in Blickrichtung los, und es macht „Piu“. Das klappt im Stehen, beim Laufen und im Sprung, nach links und nach rechts.
- [ ] Ich halte X gedrückt: Es kommt nur ein Schuss.
- [ ] Ein Prompt trifft einen Bug: Es macht „Puff“ mit weißen Partikeln. Der Bug wird zu Feature-Geschenk, Schmetterling, Gummiente oder Cookie, sein Spruch schwebt hoch, und der Score steigt um 75.
- [ ] Bei „Sei ein Feature!“ wird es ein Geschenk, bei „Werde ein Schmetterling!“ ein Schmetterling usw. Bei einer Niete wie „Bitte fix das.“ wird es ein zufälliges Haustier.
- [ ] Das Haustier verschwindet: Der Schmetterling flattert nach oben weg, die anderen hüpfen hoch und fallen aus dem Bild.
- [ ] Ein Prompt verwandelt nur einen Bug. Er verpufft an Wänden und Plattformen und nach etwa einem halben Bildschirm.
- [ ] Bei jedem Schuss leert sich in der API-Leiste ein Kästchen. Die Kästchen laden gleichmäßig wieder auf (eins alle 1,5 s), auch während ich schieße, und man sieht das Füllen.
- [ ] Ich schieße ohne Credits: Es klingt „Bäp-bäp“, in der Leiste blinkt „429 RATE LIMIT“, und oben steht „429 Too Many Requests – bitte warte kurz“. 2 s lang tut X nichts, danach geht es wieder.
- [ ] Nach einem Tod und nach dem Neustart eines Levels sind die Credits voll, und verwandelte Bugs sind wieder da.
- [ ] In der Pause steht die Leiste still. Im Intro, im Todesbalken, bei „Level geschafft“ und im Game Over passiert bei X nichts.
- [ ] Mit „Ton aus (M)“ machen Schuss, Puff und 429 kein Geräusch.

Neu beim Planen:

- [ ] Sterbe ich, während ein Prompt fliegt, fliegt er im Todesbalken weiter und kann noch einen Bug verwandeln (+75). Beim Wiedereinstieg ist er weg.

## Technical Key Decisions and Tradeoffs

1. **Prompts, Haustiere, Credits und Banner sind Teil der Spiellogik (`GameState`), das Zeichnen
   liest sie nur.**
   - Why: So prüfen automatische Tests Treffer, Punkte, Aufladen und Sperre ohne Bildschirm, wie
     es `docs/architecture.md` verlangt.
   - Instead of: Zustand im Zeichen-Code. Dann ließe sich nichts testen.
2. **Credits sind eine Kommazahl** (`credits`, 0 bis 5), die in jedem Rechenschritt um
   `dt / 1,5` wächst. Ein Schuss braucht einen vollen Credit und zieht 1 ab. Bei 2,5 Credits
   bleiben nach einem Schuss 1,5 (das halbe Kästchen rückt eins nach links).
   - Why: So füllt sich das ladende Kästchen stufenlos und sichtbar, und das Aufladen läuft
     gleichmäßig weiter, egal wie oft man schießt (wie der „Eimer“ einer echten API).
   - Instead of: ganze Credits mit eigenem Lade-Zähler. Mehr Zustand, gleiches Ergebnis.
3. **Ein verwandelter Bug wird aus `state.bugs` entfernt und als Haustier in `state.pets`
   angelegt.**
   - Why: Er kann dann weder treffen noch getroffen werden noch platt gezeichnet werden. Weil
     `respawn()` und `startLevel()` alle Bugs neu aus der Level-Datei bauen, kommt er nach dem Tod
     von selbst zurück (Super-Mario-Regel).
   - Instead of: ein zusätzliches Feld `converted` am Bug. Dann müsste jede Stelle, die Bugs
     prüft oder zeichnet, daran denken.
4. **Der Banner ist ein allgemeiner Baustein** (`logic/banner.ts`: Text, Farbe, Restzeit;
   `render/banner.ts` zeichnet ihn).
   - Why: Slice 7 (Halluzinationen) braucht denselben Banner mit anderem Text.
   - Instead of: ein fest eingebauter 429-Banner. Müsste in Slice 7 umgebaut werden.
5. **Was in welchem Spielzustand weiterläuft:**

   | Zustand | Prompts | Haustiere | Credits/Sperre/Banner | X/F |
   |---|---|---|---|---|
   | Spiel | fliegen, treffen | fliegen | laden / zählen herunter | schießt |
   | Pause | stehen | stehen | stehen | nichts |
   | Todesbalken | fliegen weiter, treffen noch (+75) | fliegen | stehen, Banner wird beim Tod ausgeblendet | nichts |
   | Level geschafft | beim Wechsel gelöscht | fliegen weiter aus dem Bild | stehen, Banner ausgeblendet | nichts |
   | Titel, Intro, Game Over | – (leer) | – (leer) | voll | nichts |

   Beim Wiedereinstieg nach dem Tod und beim Levelstart: Credits 5, keine Sperre, kein Banner,
   keine Prompts, keine Haustiere.
   - Why: entspricht der Spec und der Entscheidung im Planungsgespräch (Prompts fliegen im
     Todesbalken weiter). Ein roter 429-Banner über dem roten Todesbalken wäre unruhig, darum
     verschwindet er beim Tod.
   - Instead of: Prompts beim Tod sofort löschen (vom Nutzer abgelehnt).
6. **Befehl und Haustier:** Beim Schuss wird einer der 8 Befehle zufällig gewählt (`pick` mit
   `state.random`). Bei einer Niete wird das Haustier erst beim Treffer zufällig gewählt.
   - Why: Tests können mit `fixedRandom` jeden Fall gezielt erzeugen.
7. **Prompt-Treffer werden vor der Berührung mit Claudia geprüft** (`stepPrompts` vor
   `touchBugs`).
   - Why: Ein Bug, der im selben Schritt verwandelt wird, darf Claudia nicht mehr verletzen.
8. **Werte und Texte:** Alle neuen Zahlen stehen in `config.ts`, alle Texte (Befehle, Sprüche,
   „API“, „429 …“) in `texts.ts`.
   - Why: Projektregel „alle Texte an einer zentralen Stelle“ und feste Werte an einem Ort.
9. **Neue Werte, die die Spec offen lässt** (Startwerte, beim Testen anpassbar):
   - Prompt 16 × 14 px, Start vor Claudia: rechts `x + 22`, links `x − 16`, Höhe `y + 6`.
   - Wand/Plattform: Prompt weg, 4 kleine weiße Partikel, kein Geräusch. Steht Claudia direkt
     vor einer Wand, verpufft der Prompt sofort, der Credit ist trotzdem weg.
   - Puff beim Treffer: 14 weiße Partikel (wie beim Draufspringen), kein Wackeln.
   - Haustier schaut in die Richtung, in die der Bug lief.
   - Schmetterling: steigt mit 90 px/s, pendelt sichtbar hin und her. Geschenk, Ente, Cookie:
     Hüpfer mit 420 px/s nach oben, 60 px/s zur Seite (Blickrichtung), Schwerkraft 1200 px/s²,
     drehen sich mit 8 rad/s. Weg, sobald sie oben (y < −40), unten (y > 584) oder seitlich
     aus dem Bild sind.

## Current State

```
Tastatur ──▶ keyboard.ts ──▶ InputState { left, right, jumpHeld, jumpPressed, enterPressed, pausePressed }
                │                        (X/F zählen nur als „Spieltaste“ → Ton freischalten)
                ▼
          stepGame(state, input, dt)          game.ts, Zustände title/intro/playing/paused/dying/gameOver/won
            playing: stepPlayer → Abgrund? → stepBugs → touchBugs (Draufspringen +100) → Tokens → Checkpoint → Ziel
                │ state.events: 'jump' | 'coin' | 'oneup' | 'stomp' | 'hurt' | 'save' | 'win' | 'over'
                ▼
          main.ts ──▶ audio.play(event)   (SOUNDS in audio/sounds.ts, Record<GameEvent, ToneSpec[]>)
          render() ──▶ Welt (Bugs, Claudia, Effekte) ──▶ HUD (eine Zeile) ──▶ Overlays
```

- Bugs: `logic/bugs.ts` (`Bug { x, y, vx, vy, alive, deadTime }`), werden bei `respawn()` und
  `createGame()` neu aus der Level-Datei gebaut.
- Effekte: `burst()` (Partikel) und `say()` (schwebender Text) in `logic/effects.ts`.
- HUD: `render/hud.ts`, Feld 440 × 34 px bei (10, 10).
- Tests: Vitest, u. a. `logic/game.test.ts` mit Helfern `playingGame()` (`test/game.ts`),
  `fixedRandom()` (`test/random.ts`), `step()`.

## Desired End State

```
Tastatur ──▶ keyboard.ts ──▶ InputState { …, shootPressed }   ← neu (X/F, nur beim ersten Drücken)
                ▼
          stepGame
            playing: Credits laden, Sperre & Banner zählen
                     stepPlayer → Abgrund? → Schuss (Credits? sonst 429-Sperre) → stepBugs
                     → stepPrompts (Wand? Treffer → Haustier, +75) → stepPets → touchBugs → …
            dying:   stepBugs → stepPrompts → stepPets          (Prompts treffen noch)
            won:     stepBugs → stepPets                        (Prompts beim Wechsel gelöscht)
                │ neue Events: 'shoot' | 'poof' | 'ratelimit'
                ▼
          main.ts ──▶ audio.play  (unverändert, neue Töne in SOUNDS)
          render() ──▶ Welt (Bugs, Haustiere, Prompts, Claudia, Effekte)
                   ──▶ HUD + API-Leiste ──▶ Banner ──▶ Overlays

GameState neu: prompts: Prompt[] · pets: Pet[] · credits: number · rateLock: number · banner: Banner | null
```

## Abstractions and Code Reuse

- `src/config.ts` — neue Werte: `PROMPT_SPEED = 560`, `PROMPT_LIFE = 0.75`, `PROMPT_W = 16`,
  `PROMPT_H = 14`, `PROMPT_Y = 6`, `PROMPT_POINTS = 75`, `POOF_PARTICLES = 14`,
  `PET_FLY_SPEED = 90`, `PET_HOP = 420`, `PET_SIDE = 60`, `PET_GRAV = 1200`, `PET_SPIN = 8`,
  `CREDITS_MAX = 5`, `CREDIT_TIME = 1.5`, `RATE_LOCK_TIME = 2`, `PROMPT_COLOR = '#ffe9a8'`.
- `src/texts.ts` — Befehle, Sprüche, Leisten- und Bannertexte.
- `src/logic/input.ts` — `InputState.shootPressed`, `NO_INPUT` ergänzt.
- `src/input/keyboard.ts` — `SHOOT` setzt `shootPressed` (nur ohne `e.repeat`), `consume()` und
  `blur` setzen es zurück.
- `src/logic/events.ts` — `GameEvent` um `'shoot' | 'poof'` (Phase 1) und `'ratelimit'`
  (Phase 2).
- `src/audio/sounds.ts` — `shoot`, `poof`, `ratelimit` wörtlich nach Abschnitt 10.2. `play()` in
  `audio.ts` bleibt unverändert, „Ton aus“ wirkt dadurch automatisch.
- `src/logic/prompts.ts` (neu) — `Prompt`, `createPrompt`, `stepPrompts` (Flug, Wand, Treffer).
- `src/logic/pets.ts` (neu) — `PetKind`, `Pet`, `createPet`, `stepPets`.
- `src/logic/credits.ts` (neu, Phase 2) — `rechargeCredits`, `tryShoot`-Entscheidung.
- `src/logic/banner.ts` (neu, Phase 2) — `Banner`, `showBanner`, `stepBanner`.
- `src/logic/game.ts` — neue Felder in `GameState`, `createGame`, `respawn`, `die`, `reachGoal`,
  `stepGame` (Zustände `playing`, `dying`, `won`), neue Funktion `shoot`.
- Wiederverwendet: `overlaps()` (`logic/rect.ts`), `bugRect()` (`logic/bugs.ts`), `burst()` und
  `say()` (`logic/effects.ts`), `pick()` (`logic/random.ts`), `shadowText()` (`render/text.ts`),
  `ERROR_COLOR`, `EPS`.
- `src/render/prompts.ts`, `src/render/pets.ts` (neu), `src/render/banner.ts` (neu, Phase 2),
  `src/render/hud.ts` (API-Leiste, Phase 2), `src/render/renderer.ts` (Reihenfolge).

## Pitfalls

- **`NO_INPUT` und alle Test-Eingaben:** Sobald `InputState` das Feld `shootPressed` bekommt,
  muss `NO_INPUT` es enthalten, sonst schlägt die Typprüfung fehl. Die Tests bauen Eingaben über
  `{ ...NO_INPUT, ...over }`, das passt dann von selbst.
- **X/F darf nichts starten:** `go` in `stepGame` (`enterPressed || jumpPressed`) bleibt ohne
  `shootPressed`. Sonst würde X das Titelbild oder das Game Over verlassen.
- **`SOUNDS` ist ein `Record<GameEvent, …>`:** Jedes neue Event braucht im selben Schritt seinen
  Ton, sonst meldet die Typprüfung einen Fehler. Darum kommt `'ratelimit'` erst in Phase 2 zu
  `GameEvent`.
- **Zufall in Tests:** `shoot()` verbraucht eine Zufallszahl (Befehl), eine Niete beim Treffer
  eine weitere (Haustier), `burst()` viele. Bisherige Tests schießen nicht und bleiben
  unverändert. Neue Tests sollten Befehl und Haustier über `fixedRandom` steuern und die
  Reihenfolge der Zufallsaufrufe kennen: erst Befehl (beim Schuss), beim Treffer erst Haustier
  (nur bei Niete), dann `burst`.
- **Bug aus der Liste entfernen:** Nicht während eines `for…of` über `state.bugs` löschen. Erst
  den getroffenen Bug finden, dann `state.bugs = state.bugs.filter((b) => b !== hit)`.
- **Nur lebende Bugs treffen:** `alive === false` (plattgedrückt oder in den Abgrund gefallen)
  wird übersprungen, der Prompt fliegt hindurch.
- **Reihenfolge Wand vor Bug:** Erst bewegen, dann Wand prüfen, dann Bugs. Ein Bug hinter einer
  Wand wird so nicht getroffen.
- **Kamera:** Prompts und Haustiere leben in Weltkoordinaten. „Seitlich aus dem Bild“ bei
  Haustieren wird mit `state.camX` geprüft (im Todesbalken steht die Kamera still).
- **Credits nur im Zustand `playing` aufladen.** In der Pause steht alles (Spec). Im Todesbalken
  ist es egal, weil `respawn()` ohnehin auffüllt.
- **Banner-Text ist breit:** Breite mit `ctx.measureText()` messen (wie im Prototyp), nicht fest
  vorgeben.
- **Titelbild-Hilfe:** `texts.titleKeys2` nennt X/F schon („Prompt abfeuern“), keine Änderung
  nötig. Der Kommentar bei `SHOOT` in `keyboard.ts` („For now these keys only start the sound“)
  muss angepasst werden.

## Implementation

### Phase 1: Schießen & Verwandeln

Dependencies: None

X/F feuert Prompts mit Befehl ab („Piu“). Ein Treffer verwandelt einen Bug mit „Puff“ in ein
Haustier, das mit seinem Spruch aus dem Bild verschwindet (+75). Prompts verpuffen an Wänden,
Plattformen und nach 0,75 s. Nach dem Tod ist alles zurückgesetzt. In dieser Phase gibt es noch
keine Credit-Grenze: Jeder Druck ist ein Schuss.

**Tasks**:
- [ ] `config.ts`: Abschnitt `// Prompt cannon (slice 6)` mit `PROMPT_SPEED`, `PROMPT_LIFE`,
  `PROMPT_W`, `PROMPT_H`, `PROMPT_Y`, `PROMPT_POINTS`, `POOF_PARTICLES`, `PET_FLY_SPEED`,
  `PET_HOP`, `PET_SIDE`, `PET_GRAV`, `PET_SPIN`, `PROMPT_COLOR` (Werte siehe „Abstractions“,
  mit kurzem Kommentar und Einheit).
- [ ] `texts.ts`: Abschnitt `// Prompt cannon`:
  ```ts
  petSayings: {
    gift: "It's not a bug, it's a feature!",
    butterfly: 'Refactoring abgeschlossen.',
    duck: 'Quak! Erklär mir deinen Code.',
    cookie: 'Alle Cookies akzeptiert!',
  },
  /** pet null = random pet ("Niete") */
  promptCommands: [
    { text: 'Sei ein Feature!', pet: 'gift' },
    { text: 'Werde ein Schmetterling!', pet: 'butterfly' },
    { text: 'Du bist eine Gummiente.', pet: 'duck' },
    { text: 'Sei ein Cookie!', pet: 'cookie' },
    { text: 'Ignoriere alle Bugs.', pet: null },
    { text: 'Bitte fix das.', pet: null },
    { text: 'Denk Schritt für Schritt.', pet: null },
    { text: 'Mach keine Fehler!', pet: null },
  ],
  ```
  Typen so wählen, dass `pet` nur `'gift' | 'butterfly' | 'duck' | 'cookie' | null` sein kann
  (z. B. `as const`).
- [ ] `logic/pets.ts` (neu):
  - `export type PetKind = keyof typeof texts.petSayings` und `PET_KINDS: PetKind[]`.
  - `Pet { kind, x, y, vx, vy, angle, facing: 1 | -1, t }` (`t` = Sekunden seit Entstehen, für
    Flügelschlag und Pendeln).
  - `createPet(kind, bug)`: an der Stelle des Bugs, `facing` aus `bug.vx` (> 0 → 1, sonst −1).
    Schmetterling: `vx 0`, `vy −PET_FLY_SPEED`. Andere: `vx facing · PET_SIDE`, `vy −PET_HOP`.
  - `stepPets(pets, camX, dt)` → neue Liste: Schmetterling steigt gleichmäßig, die anderen mit
    `PET_GRAV` und `angle += facing · PET_SPIN · dt`. Entfernt, wenn `y < −40`, `y > PIT_Y` oder
    `x` mehr als 40 px links/rechts außerhalb von `[camX, camX + VIEW_W]`.
- [ ] `logic/prompts.ts` (neu):
  - `Prompt { x, y, dir: 1 | -1, text, pet: PetKind | null, life }`.
  - `promptRect(p)`, `createPrompt(player, command)`: Start vor Claudia (siehe Key Decision 9),
    `life = PROMPT_LIFE`.
  - `stepPrompts(prompts, bugs, world, dt)` → `{ prompts, wallHits: {x, y}[], hits: { prompt, bug }[] }`:
    pro Prompt `x += dir · PROMPT_SPEED · dt`, `life −= dt`; weg bei `life ≤ EPS`; weg bei
    Überlappung mit `world.solids` (→ `wallHits`); sonst der **erste** lebende Bug, der überlappt
    und in diesem Schritt noch nicht getroffen wurde (→ `hits`, Prompt weg). Die Funktion ändert
    keine Bugs, das macht `game.ts`.
- [ ] `logic/events.ts`: `GameEvent` um `'shoot' | 'poof'` ergänzen.
- [ ] `audio/sounds.ts`: `shoot: [tone(1200, 600, 0.08, 'square', 0.035)]`,
  `poof: [tone(400, 1400, 0.15, 'triangle', 0.07), tone(1400, 1800, 0.08, 'square', 0.03, 0.12)]`.
- [ ] `logic/input.ts`: `shootPressed: boolean` (Doku: X/F neu gedrückt seit dem letzten Schritt),
  in `NO_INPUT` `false`.
- [ ] `input/keyboard.ts`: `let shootPressed = false`. In `keydown` (nach der `e.repeat`-Prüfung)
  `if (SHOOT.has(e.code)) shootPressed = true`. In `blur` und `consume()` zurücksetzen, in
  `read()` zurückgeben. Kommentar bei `SHOOT` anpassen.
- [ ] `logic/game.ts`:
  - `GameState` um `prompts: Prompt[]` und `pets: Pet[]` ergänzen, in `createGame` leer.
  - `shoot(state)`: Befehl mit `pick(texts.promptCommands, state.random)`, Prompt anlegen, Event
    `'shoot'`.
  - `convertBugs(state)` (intern): ruft `stepPrompts` auf; für `wallHits` `burst(…, '#fff', 4, 80)`;
    für jeden Treffer: Haustier = `prompt.pet ?? pick(PET_KINDS, state.random)`, Bug aus
    `state.bugs` entfernen, `createPet` in `state.pets`, `state.score += PROMPT_POINTS`,
    `burst(…, '#fff', POOF_PARTICLES)` an der Bug-Mitte, `say(…, texts.petSayings[kind],
    PROMPT_COLOR)` über dem Bug, Event `'poof'`.
  - `playing`: nach der Abgrund-Prüfung `if (input.shootPressed) shoot(state)`, nach `stepBugs`
    `convertBugs(state)` und `state.pets = stepPets(…)`, danach wie bisher `touchBugs`.
  - `dying`: nach `stepBugs` ebenfalls `convertBugs` und `stepPets`.
  - `won`: nach `stepBugs` `stepPets`.
  - `reachGoal`: `state.prompts = []`.
  - `respawn`: `state.prompts = []`, `state.pets = []`.
- [ ] `render/prompts.ts` (neu): `drawPrompts(ctx, state, camX)`: weiße Sprechblase 16 × 14 px
  (abgerundetes Rechteck, kleine Spitze nach hinten unten, dünner dunkler Rand), darüber der
  Befehl mit `shadowText` in 10 px, `PROMPT_COLOR`, mittig. Prompts außerhalb des Bildes
  überspringen.
- [ ] `render/pets.ts` (neu): `drawPets(ctx, state, camX)`, je etwa Bug-Größe (24 × 18), um die
  Mitte gedreht (`angle`), gespiegelt nach `facing`:
  - Geschenk: rotes Paket (#e53935) mit gelber Schleife (#ffd84a), Band kreuzförmig.
  - Schmetterling: zwei Flügelpaare in Pink/Violett/Gelb, Flügel schlagen
    (`scaleX = |sin(t · 20)|`), Körper dunkel, seitliches Pendeln `x + sin(t · 6) · 8`.
  - Gummiente: gelber Körper (#ffd84a), Kopf, orangener Schnabel, schwarzes Auge.
  - Cookie: brauner Kreis (#c68642) mit 4–5 dunklen Schokostückchen.
- [ ] `render/renderer.ts`: nach `drawBugs` erst `drawPets`, dann `drawPrompts` (vor Claudia und
  den Effekten).
- [ ] `logic/prompts.test.ts` (neu), mit kleiner Test-Welt bzw. `loadLevel1()`:
  - fliegt 560 px/s in `dir`-Richtung, verschwindet nach 45 Schritten (0,75 s), nicht davor.
  - verschwindet an einem Festkörper und meldet einen `wallHit`.
  - trifft genau einen von zwei übereinanderliegenden Bugs.
  - fliegt durch einen Bug mit `alive = false`.
- [ ] `logic/pets.test.ts` (neu): Schmetterling steigt und ist nach `y < −40` weg; Ente hüpft
  erst hoch, fällt dann und ist nach `y > 584` weg; dreht sich in Blickrichtung des Bugs.
- [ ] `logic/game.test.ts`, neuer Block `prompt cannon`:
  - `shootPressed` im Spiel legt einen Prompt vor Claudia in Blickrichtung an und meldet
    `'shoot'`; nach links (`facing −1`) startet er links von ihr; geht auch im Sprung.
  - Befehl aus `fixedRandom`: `'Sei ein Feature!'` → Treffer ergibt `gift`; Niete
    `'Bitte fix das.'` + nächste Zufallszahl wählt das Haustier.
  - Treffer: Bug weg aus `state.bugs`, Haustier da, Score +75, Event `'poof'`, Spruch in
    `effects.texts` in `#ffe9a8`, 14 weiße Partikel, `effects.shake` bleibt 0.
  - Ein verwandelter Bug, der Claudia im selben Schritt berührt, kostet kein Leben.
  - `shootPressed` in Titel, Intro, Pause, Todesbalken, „Level geschafft“ und Game Over legt
    keinen Prompt an und startet/beendet nichts.
  - Im Todesbalken fliegt ein Prompt weiter und verwandelt einen Bug (+75).
  - Nach dem Wiedereinstieg: keine Prompts, keine Haustiere, alle 7 Bugs wieder da.
  - Beim Erreichen des Ziels werden fliegende Prompts gelöscht, Haustiere bleiben.
  - Pause: Prompt und Haustier bewegen sich 60 Schritte lang nicht.

**Automated Verification**:
- [ ] `npm run typecheck` ist fehlerfrei
- [ ] `npm test` ist grün
- [ ] `npm run build` läuft durch

**Manual Verification**:
- [ ] Im eigenen Terminal (Mac: Cmd + Leertaste → „Terminal“) in den Projektordner wechseln
  (`cd ~/Documents/0_Work/1_other_stuff/little_game_real`), `npm install` und danach
  `npm run dev` ausführen. Die angezeigte Adresse öffnen (meist http://localhost:5173). Ton
  anlassen.
- [ ] Auf dem Titelbild X drücken: Das Spiel startet **nicht**, das Titelbild bleibt.
- [ ] ENTER drücken. Im Intro X drücken: Es fliegt nichts.
- [ ] Im Spiel im Stehen X drücken: Vor Claudia fliegt eine kleine weiße Sprechblase schnell nach
  rechts, darüber ein hellgelber Befehl (z. B. „Sei ein Cookie!“). Es macht „Piu“. Nach etwa
  einem halben Bildschirm ist sie weg.
- [ ] Ein paar Mal X drücken und auf die Befehle achten: Sie wechseln zufällig.
- [ ] Nach links drehen (←) und F drücken: Der Prompt fliegt nach links.
- [ ] Laufen und dabei X drücken, dann springen und in der Luft X drücken: Beides schießt.
- [ ] X gedrückt halten: Es kommt nur ein einziger Prompt.
- [ ] Am Start hochspringen und oben im Sprung nach rechts in die erste schwebende Plattform
  schießen: Der Prompt verpufft an der Plattform mit ein paar weißen Krümeln.
- [ ] Nach rechts laufen, bis der erste Bug zu sehen ist, und auf ihn schießen: „Puff“, weiße
  Partikel, das Bild wackelt nicht. Aus dem Bug wird ein Geschenk, ein Schmetterling, eine
  Gummiente oder ein Cookie, ein hellgelber Spruch schwebt hoch, der Score steigt um 75.
- [ ] Mehrere Bugs verwandeln und prüfen, dass Befehl und Haustier zusammenpassen: „Sei ein
  Feature!“ → Geschenk („It's not a bug, it's a feature!“), „Werde ein Schmetterling!“ →
  Schmetterling („Refactoring abgeschlossen.“), „Du bist eine Gummiente.“ → Ente („Quak! Erklär
  mir deinen Code.“), „Sei ein Cookie!“ → Cookie („Alle Cookies akzeptiert!“). Bei den anderen
  Befehlen ist das Haustier zufällig.
- [ ] Haustiere beobachten: Der Schmetterling flattert mit schlagenden Flügeln nach oben weg.
  Geschenk, Ente und Cookie hüpfen hoch, drehen sich und fallen unten aus dem Bild.
- [ ] Zu den Bugs bei den Plattformen in der Mitte laufen, wo zwei Bugs nah beieinander sind,
  und so schießen, dass beide in der Flugbahn sind: Nur der erste wird verwandelt.
- [ ] Einen Bug plattspringen und sofort auf den platten Bug schießen: Der Prompt fliegt durch.
- [ ] In einen Bug laufen und gleich nach dem Tod noch schnell X drücken: Es kommt kein neuer
  Prompt. (Tipp: kurz vorher auf einen weiter entfernten Bug schießen und dann sterben: Der
  Prompt fliegt im roten Todesbalken weiter und kann ihn noch verwandeln.)
- [ ] Nach dem Wiedereinstieg: Keine Prompts und keine Haustiere mehr zu sehen, die verwandelten
  Bugs stehen wieder an ihren Plätzen.
- [ ] Einen Prompt abfeuern und sofort P drücken: Prompt und Haustiere stehen still. Nochmal P:
  Sie fliegen weiter.
- [ ] M drücken („Ton aus (M)“), schießen und einen Bug verwandeln: kein „Piu“, kein „Puff“.
  M wieder an.

### Phase 2: API-Credits & 429

Dependencies: Phase 1

Die API-Leiste zeigt 5 Kästchen. Jeder Schuss kostet einen Credit, alle 1,5 s lädt einer nach,
auch beim Schießen, und man sieht das Füllen. Ohne Credits kommt „Bäp-bäp“, die Leiste blinkt
„429 RATE LIMIT“, oben erscheint der rote Banner, und 2 s lang tut X/F nichts. Pause, Tod und
Levelstart verhalten sich wie in Key Decision 5.

**Tasks**:
- [ ] `config.ts`: `CREDITS_MAX = 5`, `CREDIT_TIME = 1.5` (Sekunden pro Credit),
  `RATE_LOCK_TIME = 2`.
- [ ] `texts.ts`: `apiLabel: 'API'`, `rateLimitBar: '429 RATE LIMIT'`,
  `rateLimitBanner: '429 Too Many Requests – bitte warte kurz'`.
- [ ] `logic/events.ts`: `'ratelimit'` ergänzen. `audio/sounds.ts`:
  `ratelimit: [tone(140, 120, 0.15, 'square', 0.07), tone(140, 120, 0.15, 'square', 0.07, 0.2)]`.
- [ ] `logic/banner.ts` (neu): `Banner { text, color, time }` (`time` = Restzeit),
  `showBanner(text, color, time): Banner`, `stepBanner(banner, dt): Banner | null` (weg bei
  `time ≤ EPS`). Kommentar: wird in Slice 7 auch für Halluzinationen genutzt.
- [ ] `logic/credits.ts` (neu): `rechargeCredits(credits, dt) = min(CREDITS_MAX, credits + dt /
  CREDIT_TIME)`, `hasCredit(credits) = credits >= 1 − EPS`.
- [ ] `logic/game.ts`:
  - `GameState` um `credits: number`, `rateLock: number` (Restzeit der Sperre) und
    `banner: Banner | null` ergänzen. `createGame`: `CREDITS_MAX`, `0`, `null`.
  - `playing`: am Anfang des Schritts (nach der Pause-Prüfung) Credits aufladen, `rateLock`
    herunterzählen (nicht unter 0), Banner mit `stepBanner` weiterzählen.
  - Schuss: `if (input.shootPressed) tryShoot(state)`: bei `rateLock > EPS` nichts; bei
    `hasCredit` `credits −= 1` und `shoot(state)`; sonst `rateLock = RATE_LOCK_TIME`,
    `banner = showBanner(texts.rateLimitBanner, ERROR_COLOR, RATE_LOCK_TIME)`, Event
    `'ratelimit'`.
  - `die` und `reachGoal`: `state.banner = null`.
  - `respawn`: `credits = CREDITS_MAX`, `rateLock = 0`, `banner = null`.
- [ ] `render/hud.ts`: `drawApiBar(ctx, state)` unter dem bisherigen Feld: `#0008`,
  `roundRect(10, 48, 150, 20, 6)`. Bei `rateLock > EPS`: `texts.rateLimitBar` mittig bei x 85,
  Grundlinie 63, 12 px, Farbe `Math.floor(state.time · 6) % 2 ? ERROR_COLOR : '#fff'`. Sonst
  `texts.apiLabel` bei x 16, 11 px, `PROMPT_COLOR`, links; 5 Kästchen bei x `46 + k · 22`,
  y 53, 18 × 10: Grund `#333`, darüber `fill = clamp(credits − k, 0, 1)` breit in `#ffe9a8`
  (voll) bzw. `#a08a50` (lädt gerade). Aus `drawHud` aufrufen.
- [ ] `render/banner.ts` (neu): `drawBanner(ctx, banner)`: `ctx.globalAlpha = min(1, time · 3)`
  (blendet am Ende aus), Schrift 17 px fett, Breite = `measureText + 30`, Kasten `#000c` mit
  Radius 8 bei y 128, Höhe 32, mittig; Text bei y 150 in `banner.color`.
- [ ] `render/renderer.ts`: nach `drawHud` `if (state.banner) drawBanner(ctx, state.banner)`.
- [ ] `logic/credits.test.ts` (neu): lädt 1 Credit in 90 Schritten (1,5 s), nie über 5.
- [ ] `logic/game.test.ts`, neuer Block `API credits and rate limit`:
  - Start mit 5 Credits; ein Schuss → 4 (plus ein Hauch Aufladen); 5 schnelle Schüsse → 5 Prompts.
  - Aufladen läuft während des Schießens weiter: 2,5 Credits, Schuss → etwa 1,5.
  - 6. Schuss ohne Credits: kein Prompt, `rateLock = 2`, Banner mit dem 429-Text in `#ff6b6b`,
    Event `'ratelimit'`.
  - Während der Sperre: `shootPressed` macht nichts (kein Prompt, kein Event, Banner unverändert),
    die Credits laden weiter. Nach 120 Schritten (2 s) ist die Sperre weg, der Banner auch, und
    ein Schuss klappt wieder.
  - Pause: Credits, Sperre und Banner ändern sich in 60 Schritten nicht.
  - Tod: Banner weg; nach dem Wiedereinstieg 5 Credits, keine Sperre.
  - `startLevel` (Level nochmal nach Game Over): 5 Credits, keine Sperre, kein Banner.

**Automated Verification**:
- [ ] `npm run typecheck` ist fehlerfrei
- [ ] `npm test` ist grün
- [ ] `npm run build` läuft durch

**Manual Verification**:
- [ ] `npm run dev` läuft noch (sonst wie in Phase 1 starten), Seite neu laden (Cmd + R), Ton an.
  ENTER drücken.
- [ ] Oben links unter der bisherigen Anzeige steht ein kleines dunkles Feld „API“ mit 5 vollen
  hellgelben Kästchen.
- [ ] Einmal X drücken: Ein Kästchen wird leer und füllt sich in etwa 1,5 s sichtbar von links
  nach rechts in dunklerem Gelb, dann ist es wieder hell.
- [ ] Fünfmal schnell X drücken: Alle Kästchen leeren sich. Schon während des Schießens beginnt
  das linke Kästchen sich wieder zu füllen.
- [ ] Sofort noch einmal X drücken: „Bäp-bäp“. In der Leiste blinkt rot/weiß „429 RATE LIMIT“,
  oben in der Mitte steht der rote Banner „429 Too Many Requests – bitte warte kurz“.
- [ ] Während der 2 s mehrmals X drücken: kein Prompt, kein Geräusch, kein neuer Banner.
- [ ] Nach 2 s: Banner weg, die Leiste zeigt wieder Kästchen (ein oder zwei sind inzwischen
  aufgeladen), X schießt wieder.
- [ ] Ein paar Kästchen leer schießen und P drücken: Die Kästchen füllen sich in der Pause nicht.
  Ebenso während der Sperre P drücken: „429 RATE LIMIT“ und Banner bleiben stehen. Nochmal P:
  Es geht weiter.
- [ ] Credits leer schießen und dann in einen Bug laufen: Im Todesbalken ist kein 429-Banner zu
  sehen. Nach dem Wiedereinstieg sind alle 5 Kästchen voll.
- [ ] Alle Leben verlieren, im Game Over X drücken: nichts. ENTER (Level nochmal): 5 volle
  Kästchen.
- [ ] Bis zum OUTPUT-Terminal laufen und bei „Level geschafft“ X drücken: nichts.
- [ ] M drücken („Ton aus (M)“), Credits leer schießen und nochmal X: kein „Bäp-bäp“, aber
  Blinken und Banner erscheinen. M wieder an.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

## References

- Spec: `docs/agents/specs/2026-10-02-prompt-kanone.md`
- `docs/product.md` (Slice 6, Problem: Prototyp nur noch Ideengeber)
- `docs/architecture.md` (Spiellogik getrennt von Zeichnen und Ton, Tests)
- `docs/design.md` (Spiel-Bildschirm, Farben)
- `docs/prototype-reference.md`: Abschnitt 7 (HUD, API-Leiste), `drawHUD()` (API-Leiste,
  Banner), Abschnitt 10.2 (`shoot`, `poof`, `ratelimit`)
- `docs/agents/specs/2026-10-01-tokens-bugs-leben.md` (Bugs, Super-Mario-Zurücksetzen)
- `docs/agents/specs/2026-10-02-musik-und-sound.md` (Ton aus, Geräusche)
