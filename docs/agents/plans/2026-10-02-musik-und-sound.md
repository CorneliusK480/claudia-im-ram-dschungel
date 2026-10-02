---
date: 2026-10-02
topic: "Musik & Sound"
spec: "docs/agents/specs/2026-10-02-musik-und-sound.md"
tags: [plan, ton, musik, geraeusche, stummschalten, speicher, web-audio]
status: ready
---

# PLAN: Musik & Sound

Dieser Plan setzt Slice 5 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-02-musik-und-sound.md`](../specs/2026-10-02-musik-und-sound.md).
Alle Töne, Noten, Tempi, Wellenformen, Lautstärken und Zeitpunkte stehen in
`docs/prototype-reference.md`, Abschnitt 10 (10.1 Audio-Start, 10.2 Geräusche, 10.3 Musik,
10.4 Stummschalten, 10.5 Besonderheiten). Die Werte werden von dort **unverändert** übernommen.

## What you'll be able to do

Das Spiel klingt jetzt wie der Prototyp. Nach dem ersten Klick auf das Spielbild oder der ersten
Spieltaste läuft die Chiptune-Musik „jungle“, ohne Unterbrechung vom Titelbild ins Spiel. Springen,
Tokens, Bugs, Checkpoint, Tod, Ziel und Game Over machen ihre 8-Bit-Geräusche. Mit M ist sofort
alles still, und oben rechts steht „Ton aus (M)“, auch auf dem Titelbild und auch nach dem
Neuladen.

```
Spiel, Ton aus
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│                                                              Ton aus (M)  │  ← neu, 12 px, #fff8
│   🤖              🐞            ◆◆◆                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Titelbild, Ton aus (neu: Hinweis auch hier)
┌────────────────────────────────────────────────────────────────────────────┐
│                                                              Ton aus (M)  │
│                                CLAUDIA                                     │
│                            im RAM-Dschungel                                │
│                                 🤖                                         │
│                       Drücke ENTER oder LEERTASTE                          │
│                              ...                                           │
└────────────────────────────────────────────────────────────────────────────┘
```

Ist der Ton an, fehlt der Hinweis, und am Bild ändert sich nichts.

Musik je Bildschirm:

```
(still bis zum ersten Klick / zur ersten Taste)
Titel ──▶ Intro ──▶ Spiel ──▶ Tod ──▶ Spiel            jungle läuft nahtlos durch
                     │ P/ESC/Tab ─▶ Pause: Musik steht, danach weiter an derselben Stelle
                     ├─ Ziel ──▶ Level geschafft ──ENTER──▶ Titel     jungle läuft weiter
                     └─ Game Over: Musik aus + „over“ ──┬─ Level nochmal ─▶ jungle von vorn
                                                         └─ Hauptmenü    ─▶ jungle von vorn
M (überall): alles sofort still ⇄ Musik weiter an derselben Stelle
```

## Acceptance Criteria

Aus der Spec (unverändert):

- [ ] Ich öffne die Seite: Das Titelbild ist still. Klicke ich auf das Spielbild oder drücke z. B. ←, startet die Level-1-Musik.
- [ ] Ich starte mit ENTER: Die Musik läuft ohne Unterbrechung weiter ins Intro und ins Spiel.
- [ ] Springen, Token sammeln, Bug plattmachen, Checkpoint berühren, Sterben (Bug oder Abgrund) und Ziel erreichen machen jeweils ihr Geräusch wie im Prototyp.
- [ ] Mit P (oder Tab-Wechsel) stoppt die Musik. Beim Weiterspielen geht sie an derselben Stelle weiter.
- [ ] Beim Tod läuft die Musik weiter.
- [ ] Beim Game Over verstummt die Musik, und das traurige Game-Over-Geräusch erklingt. „Level nochmal“ oder „Hauptmenü“ starten die Musik von vorn.
- [ ] Nach „Level geschafft“ und ENTER läuft die Musik auf dem Titelbild einfach weiter.
- [ ] M beim Spielen: Sofort ist alles still, und oben rechts steht „Ton aus (M)“. Springen macht kein Geräusch mehr.
- [ ] Nochmal M: Der Hinweis verschwindet, und die Musik läuft an der Stelle weiter, wo sie aufgehört hat.
- [ ] M wirkt auch auf dem Titelbild, in Pause, Todesbalken, Level geschafft und Game Over. Auf dem Titelbild steht dann auch „Ton aus (M)“.
- [ ] Ton aus, Seite neu laden: Auf dem Titelbild steht „Ton aus (M)“, und auch nach einem Klick bleibt alles still.
- [ ] Ton wieder an, neu laden: Der Hinweis fehlt, und die Musik startet nach dem ersten Klick bzw. der ersten Taste.

Automatisch getestet (in Level 1 schwer zu erreichen): Beim 100. Token erklingt zusätzlich das
1UP-Geräusch. Blockierter oder seltsamer Speicher führt zu „Ton an“ ohne Absturz.

Beim Planen hinzugekommen (mit dem Nutzer abgestimmt):

- [ ] Klicke ich auf dem Titelbild, im Todesbalken, bei „Level geschafft“ oder im Game Over in ein anderes Programm (der Tab bleibt sichtbar), läuft die Musik weiter. Nur beim Spielen pausiert ein Fensterwechsel das Spiel, und damit stoppt auch die Musik.
- [ ] Am Handy startet ein Tippen auf das Spielbild den Ton mit (Nebeneffekt des Mausklicks, sonst bewirkt das Tippen nichts).

## Technical Key Decisions and Tradeoffs

1. **Die Spiellogik meldet Ereignisse, der Ton-Baustein spielt sie ab:** `GameState` bekommt
   eine Liste `events: GameEvent[]`. `stepGame` leert sie zu Beginn jedes Schritts, und die
   Regeln hängen ein, was passiert ist (`'jump'`, `'coin'`, `'oneup'`, `'stomp'`, `'hurt'`,
   `'save'`, `'win'`, `'over'`). `main.ts` liest die Liste nach jedem Schritt und ruft für jedes
   Ereignis `audio.play(event)` auf. Die Namen der Ereignisse sind die Namen der Geräusche aus dem
   Prototyp.
   - Why: Die Spielregeln bleiben ohne Browser testbar (architecture.md). Zwei Ereignisse im
     selben Schritt (zwei Bugs, `coin` + `oneup`) stehen einfach zweimal in der Liste und klingen
     übereinander.
   - Instead of: `SND.jump()` direkt in der Logik wie im Prototyp. Das wäre nicht testbar.
2. **Welche Musik läuft, ergibt sich aus dem Zustand:** `musicFor(state)` liefert im `gameOver`
   `null` (keine Musik), sonst `state.level.music` (`'jungle'`). Der Ton-Baustein vergleicht
   jedes Bild mit dem letzten Stück: gleiches Stück → läuft nahtlos weiter, anderes Stück (auch
   `null` → `'jungle'`) → beginnt von vorn. Pause = `state.mode === 'paused' || document.hidden`.
   - Why: Genau die Regel des Prototyps (`playMusic`), ohne dass die Logik den Ton kennt.
     Titel → Spiel und „Level geschafft“ → Titel bleiben nahtlos, nach Game Over beginnt die
     Musik von vorn, ein Tod ändert nichts.
3. **Musik-Planung wie im Prototyp, einmal pro gezeichnetem Bild:** `audio.update(track, paused)`
   plant alle Achtelnoten der nächsten 0,15 s vor (Bass, Melodie, Schlagzeug), merkt sich
   `step` und `next`. Ist die Musik pausiert, stumm oder kein Stück gesetzt, wird nichts geplant
   und `next = 0`. Beim Weiterspielen setzt sie mit 30 ms Puffer an derselben Stelle (`step`) fort.
   - Why: Klingt exakt wie der Prototyp, auch im Rhythmus. Ein unsichtbarer Tab bekommt keine
     Bilder mehr, darum stoppt die Musik dort von selbst. Dasselbe gilt auf dem Titelbild.
4. **Ein gemeinsamer „Hauptschalter“ für alle Töne** (ein Lautstärke-Knoten mit Wert 1 zwischen
   allen Tönen und dem Lautsprecher): M trennt ihn sofort vom Lautsprecher und wirft ihn weg. Alle
   gerade klingenden und schon vorgeplanten Töne verstummen damit sofort. Beim Wieder-Einschalten
   entsteht ein neuer Schalter. Die Musik dreht beim Ausschalten ihren Zähler um die vorgeplanten,
   noch nicht begonnenen Achtel zurück. So setzt sie beim Einschalten genau dort ein, wo man
   aufgehört hat zu hören.
   - Why: „Sofort still“ (Spec). Der Schalter hat den Wert 1, die Lautstärken bleiben also exakt
     wie im Prototyp.
   - Instead of: Lautstärke auf 0 stellen und wieder auf 1. Dann würden alte, vorgeplante Noten
     nach dem Einschalten noch erklingen.
5. **M ist eine Einstellung, keine Spielregel:** Die Tastatur ruft bei M (nur beim ersten Drücken,
   nicht beim Halten) einen Rückruf `onMute` auf. `main.ts` schaltet dann um, sagt es dem
   Ton-Baustein und speichert es. M kommt nie in `InputState` an und kann darum kein Spiel
   starten, kein Intro wegdrücken und keine Pause beenden. Die Tastatur bleibt die Stelle, die
   M erkennt (wie architecture.md sagt). Sie gibt den Befehl nur nicht an die Spiellogik weiter,
   sondern an `main.ts`.
6. **Der Ton startet bei jeder Spieltaste und bei einem Klick auf das Spielbild:** Die Tastatur
   kennt jetzt auch M, X und F (X/F tun sonst noch nichts, die Prompt-Kanone kommt in Slice 6). Bei
   jeder Spieltaste ruft sie `onGameKey` auf, und zwar **vor** `onMute`. Dazu kommt ein
   `click`-Handler auf der Zeichenfläche. Beide rufen `audio.unlock()` auf. Erst dann entsteht der
   `AudioContext` (bzw. wird fortgesetzt). Ist M die erste Taste, startet der Ton und ist sofort
   aus.
   - Why: Browser erlauben Ton erst nach einer Eingabe. `click` funktioniert in allen Browsern,
     auch in Safari. Ein Tippen am Handy löst ebenfalls `click` aus *(mit dem Nutzer abgestimmt:
     erlaubt)*.
7. **Fensterwechsel außerhalb des Spiels lässt die Musik laufen** *(mit dem Nutzer abgestimmt)*:
   Nur `document.hidden` (Tab nicht sichtbar) zählt als Musik-Pause. `blur` pausiert wie bisher
   nur das Spiel im Zustand `playing`, und das stoppt die Musik über den Zustand `paused`.
8. **„Ton aus“ wird gespeichert, genauso abgesichert wie der Highscore:** neues Modul
   `storage/sound.ts` mit `readSoundOff` / `writeSoundOff`, Schlüssel
   `claudiaRamDschungelTonAus`, Wert `'1'` = aus, `'0'` = an. Jeder andere Wert, ein fehlender
   Wert oder ein Fehler beim Lesen bedeutet „Ton an“. Schreibfehler werden ignoriert.
   `browserStorage()` und der Speicher-Typ ziehen in eine gemeinsame Datei `storage/browser.ts`.
9. **Kein Ton möglich → einfach still:** Das Erzeugen des `AudioContext` und jeder Ton-Aufruf
   stehen in `try/catch`. Ohne Context tun `play` und `update` nichts.
10. **Klänge als Daten:** Die 8 Geräusche stehen als Liste von Teiltönen
    (`{ f1, f2, dur, type, vol, delay }`) in `audio/sounds.ts`. Das Stück `jungle` steht als Text
    wie im Prototyp in `audio/tracks.ts` und wird beim Laden in Frequenzen umgerechnet. Nur
    `jungle` kommt jetzt dazu, die anderen Stücke folgen mit ihren Slices.
11. **Tests:** Das Projekt hat Vitest. Getestet wird alles ohne Browser: welche Ereignisse die
    Logik meldet, `musicFor`, die Notenumrechnung und die Spur `jungle`, der Speicher für „Ton
    aus“. Der Web-Audio-Teil selbst (`audio/audio.ts`) wird nur von Hand gehört, weil Vitest
    hier ohne Browser läuft.

## Current State

```
main.ts ── lädt level1.json ── createGame(level, random, highscore)
   │  createKeyboard(window): ← → A D ↑ W Leertaste ENTER P ESC   (M, X, F ignoriert)
   │  blur / visibilitychange(hidden) ─▶ pauseGame(state)
   │  startLoop(step: stepGame + Highscore speichern, render: render(ctx, state))
   ▼
logic/game.ts: title → intro → playing ⇄ paused, dying, won, gameOver
               (meldet keine Ereignisse; stepPlayer sagt nicht, ob gesprungen wurde)
render: Titel ohne HUD (drawTitle) · sonst drawHud + Overlay
storage/highscore.ts: browserStorage(), readHighscore, writeHighscore
```

Es gibt keinerlei Ton.

## Desired End State

```
 Taste ──▶ keyboard ──onGameKey──▶ audio.unlock()        Klick auf Canvas ──▶ audio.unlock()
              │ └────onMute─────▶ main: soundOff umschalten ─▶ audio.setMuted() + writeSoundOff()
              ▼
        InputState ──▶ stepGame ──▶ state.events ['jump', 'coin', …] ──▶ audio.play(event)
                                                                         (nach jedem Schritt)
 jedes Bild: audio.update(musicFor(state), mode === 'paused' || document.hidden)
             render(ctx, state, soundOff) ──▶ „Ton aus (M)“ im HUD und auf dem Titel

 audio/audio.ts
   AudioContext ─▶ Hauptschalter (Gain 1) ─▶ Lautsprecher
       ▲  Geräusche: tone() je Teilton aus SOUNDS
       └─ Musik: noteAt()/drumAt() für jede Achtel aus TRACKS.jungle
```

## Abstractions and Code Reuse

- `src`
  - `config.ts` - `SOUND_OFF_KEY = 'claudiaRamDschungelTonAus'`, Musik-Werte
    `MUSIC_LOOKAHEAD = 0.15`, `MUSIC_START_DELAY = 0.03`
  - `texts.ts` - `soundOff: 'Ton aus (M)'`
  - `main.ts` - Ton-Baustein anlegen, Klick freischalten, Ereignisse abspielen, Musik je Bild,
    M umschalten und speichern, `soundOff` an `render` geben
  - `input/keyboard.ts`
    - `createKeyboard(target, callbacks)` - neue Gruppen `MUTE` (KeyM) und `SHOOT` (KeyX, KeyF)
      in `GAME_KEYS`; Rückrufe `onGameKey()` (jede Spieltaste) und `onMute()` (M, ohne Wiederholung)
  - `logic/events.ts` (neu) - `type GameEvent = 'jump' | 'coin' | 'oneup' | 'stomp' | 'hurt' | 'save' | 'win' | 'over'`
  - `logic/player.ts` - `stepPlayer` gibt `true` zurück, wenn in diesem Schritt gesprungen wurde
  - `logic/game.ts`
    - `GameState.events` - neu, `[]` in `createGame`
    - `stepGame` - leert `events` zu Beginn; meldet `'jump'`, `'over'`
    - `die` → `'hurt'`, `reachGoal` → `'win'`, `touchBugs` → `'stomp'` je Bug,
      `collectTokens` → `'coin'` (+ `'oneup'`), `checkCheckpoints` → `'save'`
    - `musicFor(state)` - neu, exportiert
  - `audio/sounds.ts` (neu) - `ToneSpec`, `SOUNDS: Record<GameEvent, ToneSpec[]>`
  - `audio/tracks.ts` (neu) - `TRACKS` (nur `jungle`), `noteFreq(name)`, `parseTrack(track)`
  - `audio/audio.ts` (neu) - `createAudio(muted)` → `{ unlock, play, setMuted, update }`
  - `storage/browser.ts` (neu) - `GameStorage` (bisher `HighscoreStorage`), `browserStorage()`
    (aus `highscore.ts` verschoben)
  - `storage/highscore.ts` - nutzt `GameStorage` aus `browser.ts`
  - `storage/sound.ts` (neu) - `readSoundOff(storage)`, `writeSoundOff(storage, off)`
  - `render/renderer.ts` - `render(ctx, state, soundOff)` gibt `soundOff` an HUD und Titel weiter
  - `render/hud.ts` - `drawSoundOffHint(ctx)` (neu, exportiert), `drawHud(ctx, state, soundOff)`
  - `render/title.ts` - `drawTitle(ctx, state, soundOff)` zeichnet den Hinweis zuletzt
  - Tests: `logic/game.test.ts`, `logic/tokens.test.ts`, `audio/tracks.test.ts` (neu),
    `storage/sound.test.ts` (neu), `storage/highscore.test.ts` (Import des Typs)

Wiederverwendet: `shadowText()` für den Hinweis, der sichere Speicher-Zugriff aus Slice 4
(`try/catch`, `null` = kein Speicher), das Fake-Speicher-Muster aus `highscore.test.ts`, die
Test-Helfer `playingGame()`, `fixedRandom()` und `step()`.

## Pitfalls

- **Ereignisliste leeren:** `stepGame` muss `state.events` **zu Beginn jedes Schritts** leeren
  (`state.events.length = 0`), nicht erst `main.ts`. Sonst klingt ein Geräusch in jedem Schritt
  erneut. Zustände, die `startLevel`/`createGame` neu bauen, starten mit `[]`. `main.ts` muss
  die Liste **nach jedem einzelnen Schritt** abspielen, nicht einmal pro Bild, weil pro Bild
  mehrere Schritte laufen können.
- **Sprung-Geräusch nur bei echtem Sprung:** Nur `stepPlayer` weiß, ob der Sprung tatsächlich
  ausgelöst wurde (Sprungpuffer + Coyote-Zeit). Darum gibt es `true` zurück. Das Abprallen von
  einem Bug ist **kein** Sprung und macht nur `'stomp'`. Die Sprungtaste, die das Intro
  wegdrückt oder das Spiel startet, erreicht `stepPlayer` nie, macht also auch kein Geräusch.
  Die bisherigen Aufrufe von `stepPlayer` in `player.test.ts` ignorieren den Rückgabewert, das
  bleibt gültig.
- **`'over'` nur beim Übergang zu `gameOver`,** nicht beim Wiedereinstieg mit Leben (dort kein
  Geräusch, wie im Prototyp). `'hurt'` entsteht in `die()`, also bei Bug **und** Abgrund.
- **`'stomp'` je Bug:** In `touchBugs` innerhalb der Schleife über `stomped`, damit zwei Bugs zwei
  Geräusche ergeben.
- **`'coin'` und `'oneup'`:** Beim 100. Token erst `'coin'`, dann `'oneup'`, beide im selben
  Schritt.
- **Musikwechsel nach Name, nicht nach Zustand:** `audio.update` startet nur von vorn, wenn sich
  der **Name** ändert (`'jungle'` → `null` → `'jungle'`). Sonst würden Titel → Spiel oder Tod →
  Wiedereinstieg die Musik neu starten. Ein unbekannter Name (später ein Level mit noch nicht
  eingebautem Stück) bedeutet einfach Stille.
- **Musik erst, wenn der Context läuft:** `update` plant nur bei `ctx.state === 'running'`.
  `resume()` ist asynchron, das Promise mit `.catch(() => {})` abfangen. Auf dem stummen
  Titelbild vor der ersten Eingabe zählt `step` nicht weiter, darum beginnt die Musik beim ersten
  Klick am Anfang.
- **Zurückdrehen beim Stummschalten:** Vorgeplante Achtel beginnen bei `next - sd`,
  `next - 2·sd`, … Solange `next - sd > ctx.currentTime` und `step > 0`, gilt: `next -= sd`,
  `step--`. Danach `next = 0`. Erst dann den Hauptschalter trennen (`disconnect()`) und auf
  `null` setzen. Alle neuen Töne hängen an `output()`, der bei Bedarf einen neuen Schalter baut.
  Ohne Context (M vor der ersten Eingabe) wird nur der Merker gesetzt.
- **Pause lässt ausklingen:** Bei P plant die Musik nichts mehr, bereits vorgeplante ≤ 0,15 s
  klingen wie im Prototyp aus. Dort wird **nicht** zurückgedreht.
- **Reihenfolge bei M als erster Taste:** In `keydown` zuerst `onGameKey()` (freischalten), dann
  `onMute()`. Gehaltenes M (`e.repeat`) ruft `onMute` nicht erneut auf. `preventDefault()` wie bei
  allen Spieltasten.
- **`keyboard.consume()` und `blur`** betreffen M nicht, weil M keinen „gedrückt“-Merker in
  `InputState` hat.
- **`webkitAudioContext`:** Ältere Safari-Versionen kennen nur diesen Namen. TypeScript kennt ihn
  nicht: `(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext`.
- **Rauschen für Snare/HiHat** einmal anlegen (0,3 s Mono, Zufallswerte -1…1), dann jedes Mal
  denselben Puffer von vorn abspielen, wie im Prototyp. Der Kick-Oszillator ist ein Sinus (Typ
  ausdrücklich auf `'sine'` setzen).
- **Hinweis auf dem Titel nach der Abdunklung zeichnen**, sonst ist er dort schwächer. In HUD-
  Bildschirmen wird er im HUD gezeichnet, und die Overlays dunkeln ihn danach ab (Pause, Level
  geschafft, Game Over), genau wie in der Spec.
- **ESC als allererste Taste:** Chrome zählt ESC nicht als Nutzer-Eingabe, die Ton erlauben darf.
  Ist ESC die erste Taste, bleibt es darum still, bis eine andere Taste oder ein Klick kommt. Im
  Prototyp ist es genauso, das ist kein Fehler.
- **M kurz nach P:** Die Pause setzt `next = 0`. Schaltet man danach stumm, wird nichts
  zurückgedreht, und beim Wieder-Einschalten fehlt höchstens ein Bruchteil einer Sekunde. Das
  ist unhörbar und bleibt so.
- **Klick während des Ladens:** Der Klick-Handler wird erst nach dem Laden des Levels registriert.
  Das Laden dauert nur einen Augenblick, darum ist das unkritisch.
- **Highscore-Test:** Nach dem Umzug von `HighscoreStorage` nach `storage/browser.ts`
  (`GameStorage`) den Typ-Import in `highscore.test.ts` anpassen.

## Implementation

### Phase 1: Musik

Dependencies: None

Nach dem ersten Klick bzw. der ersten Spieltaste läuft „jungle“. Die Musik geht nahtlos vom Titel
ins Spiel und zurück, steht in der Pause und im unsichtbaren Tab, läuft beim Tod weiter, ist im
Game Over aus und beginnt danach von vorn. Noch ohne Geräusche und ohne M.

**Tasks**:
- [ ] `config.ts`: `MUSIC_LOOKAHEAD = 0.15`, `MUSIC_START_DELAY = 0.03` (mit Verweis auf
  Abschnitt 10.3).
- [ ] `audio/tracks.ts` (neu):
  - `Track` = `{ bpm, bassWave, leadWave, bass, lead, drums }` (Texte wie im Prototyp).
  - `TRACKS: Record<string, Track>` mit nur `jungle` (Werte wörtlich aus 10.3: 132 BPM,
    `triangle`/`square`, Bass-, Lead- und Drum-Text).
  - `noteFreq(name)`: `/^([A-G])(#?)(\d)$/`, `440 · 2^((semi - 69) / 12)` wie im Prototyp.
  - `parseTrack(track)` → `{ sd: 60 / bpm / 2, bass: number[], lead: number[], drums: string[],
    bassWave, leadWave }` (`.` = 0 bzw. `'.'`).
- [ ] `audio/audio.ts` (neu): `createAudio(muted: boolean)` mit:
  - `unlock()`: Context einmal anlegen (`AudioContext` oder `webkitAudioContext`) in
    `try/catch`, bei `'suspended'` `resume()` (Fehler abfangen).
  - `output()` (intern): Hauptschalter (Gain 1 → `destination`), bei Bedarf neu anlegen.
  - `noteAt(freq, t0, dur, type, vol)` und `drumAt(kind, t0)` wörtlich nach 10.3, aber an
    `output()` statt an `destination` angeschlossen.
  - `update(trackName: string | null, paused: boolean)`: Name geändert → `step = 0`, `next = 0`.
    Abbruch, wenn kein Context, nicht `'running'`, kein (bekanntes) Stück, stumm oder `paused`
    (dann `next = 0`). Sonst Planung wie `tickMusic()` (Lookahead 0,15 s, Neuansatz
    `currentTime + 0.03`). Bass-Lautstärke 0,035 bei `sawtooth`, sonst 0,06. Lead 0,05 bei
    `triangle`, sonst 0,022. Dauer `sd · 0.9` bzw. `sd · 0.85`.
  - Alles in `try/catch`, damit ein Ton-Fehler das Spiel nie anhält.
  - `play` und `setMuted` folgen in Phase 2 und 3.
- [ ] `logic/game.ts`: `musicFor(state: GameState): string | null` = `null` in `gameOver`, sonst
  `state.level.music`.
- [ ] `input/keyboard.ts`: `createKeyboard(target, { onGameKey })`. Neue Gruppen
  `MUTE = new Set(['KeyM'])` und `SHOOT = new Set(['KeyX', 'KeyF'])` in `GAME_KEYS` (vorerst ohne
  weitere Wirkung). In `keydown` nach `preventDefault()` `onGameKey()` aufrufen.
- [ ] `main.ts`: `const audio = createAudio(false)`. `createKeyboard(window, { onGameKey: () =>
  audio.unlock() })`. `canvas.addEventListener('click', () => audio.unlock())`. Im
  Zeichen-Rückruf von `startLoop` zuerst `audio.update(musicFor(state), state.mode === 'paused'
  || document.hidden)`, dann `draw()`.
- [ ] `audio/tracks.test.ts` (neu):
  - `noteFreq`: `A4` = 440, `A2` = 110, `C6` ≈ 1046,50, `G#4` ≈ 415,30 (`toBeCloseTo`).
  - `parseTrack(TRACKS.jungle)`: 32 Bass-, 64 Lead-, 16 Drum-Achtel, `sd` ≈ 0,2273. Erste
    Bassnote = `A2` (110), zweite = Pause (0). Erste Drums: `k`, `.`, `h`.
- [ ] `logic/game.test.ts`, neue Tests `musicFor`:
  - `'jungle'` in `title`, `intro`, `playing`, `paused`, `dying`, `won`.
  - `null` in `gameOver`. Nach „Level nochmal“ (ENTER) und nach „Hauptmenü“ (P) wieder
    `'jungle'`.

**Automated Verification**:
- [ ] `npm run typecheck` ist fehlerfrei
- [ ] `npm test` ist grün
- [ ] `npm run build` läuft durch

**Manual Verification**:
- [ ] Lautsprecher bzw. Kopfhörer am Mac einschalten. Im eigenen Terminal (Mac: Cmd + Leertaste
  → „Terminal“) in den Projektordner wechseln
  (`cd ~/Documents/0_Work/1_other_stuff/little_game_real`), `npm install` und danach
  `npm run dev` ausführen. Die angezeigte Adresse öffnen (meist http://localhost:5173). Das
  Titelbild ist still.
- [ ] Klick einmal mit der Maus auf das Spielbild: Die Musik beginnt (Bass, Schlagzeug, eine
  kleine Melodie). Das Spiel startet dabei **nicht**, das Titelbild bleibt.
- [ ] Lade neu (Cmd + R) und drück als erste Taste ←: Die Musik beginnt, das Titelbild bleibt.
- [ ] Lade neu und drück als erste Taste ENTER: Die Musik beginnt genau jetzt und läuft ohne
  Unterbrechung ins Intro und ins Spiel.
- [ ] Spiel etwa 10 Sekunden und drück dann P: Die Musik verstummt. Warte ein paar Sekunden und
  drück P: Die Musik läuft mitten in der Melodie weiter, nicht von vorn.
- [ ] Wechsle beim Spielen mit Cmd + T in einen neuen Tab, warte ein paar Sekunden und geh zurück:
  Es ist still, das Spiel steht in der Pause. Drück P: Die Musik läuft an derselben Stelle weiter.
- [ ] Verliere ein Leben (Abgrund): Die Musik läuft einfach weiter, auch nach dem
  Wiedereinstieg.
- [ ] Verliere alle Leben: Beim Game Over ist die Musik aus. Drück ENTER („Level nochmal“): Die
  Musik beginnt von vorn. Sie klingt genau so wie beim allerersten Klick nach dem Neuladen.
- [ ] Geh nochmal Game Over und drück ESC („Hauptmenü“): Auf dem Titelbild beginnt die Musik von
  vorn.
- [ ] Spiel bis zum OUTPUT-Terminal: Die Musik läuft weiter. Drück nach gut 1 s ENTER: Auch auf
  dem Titelbild läuft sie einfach weiter.
- [ ] Auf dem Titelbild: Wechsle mit Cmd + T in einen neuen Tab: still. Zurück: Die Musik läuft
  an derselben Stelle weiter.
- [ ] Auf dem Titelbild: Klick in ein anderes Programm (z. B. ins Terminal), sodass das
  Spielfenster sichtbar bleibt: Die Musik läuft weiter.

### Phase 2: Geräusche

Dependencies: Phase 1 (Ton-Baustein)

Die Spiellogik meldet ihre Ereignisse, und der Ton-Baustein spielt die 8 Geräusche wie im
Prototyp.

**Tasks**:
- [ ] `logic/events.ts` (neu): `export type GameEvent = 'jump' | 'coin' | 'oneup' | 'stomp' |
  'hurt' | 'save' | 'win' | 'over'` mit Kommentar: Die Namen sind die Geräusch-Namen des
  Prototyps.
- [ ] `logic/player.ts`: `stepPlayer(...)`: `boolean` – `true`, wenn in Schritt 3 gesprungen
  wurde, sonst `false`.
- [ ] `logic/game.ts`:
  - `GameState.events: GameEvent[]` (Kommentar: was in diesem Schritt passiert ist; `main.ts`
    spielt die Geräusche dazu), `[]` in `createGame`.
  - `stepGame`: als Erstes `state.events.length = 0`.
  - `playing`: `if (stepPlayer(...)) state.events.push('jump')`.
  - `touchBugs`: je besiegtem Bug `'stomp'`.
  - `collectTokens`: `'coin'` je Token (vor der 1UP-Prüfung). Im bestehenden Zweig
    `tokenCount % TOKEN_LIFE_EVERY === 0` (jeder 100.) danach zusätzlich `'oneup'`.
  - `checkCheckpoints`: `'save'`. `reachGoal`: `'win'`. `die`: `'hurt'`.
  - `dying` → `gameOver`: `'over'`.
- [ ] `audio/sounds.ts` (neu): `ToneSpec = { f1, f2, dur, type: OscillatorType, vol, delay }`.
  `SOUNDS: Record<GameEvent, ToneSpec[]>` mit den Werten aus 10.2 (Standard: `square`, Lautstärke
  0,07, Verzögerung 0):
  - `jump`: 320 → 640, 0,12, square, 0,05
  - `coin`: 988 → 988, 0,05, square, 0,04; 1319 → 1319, 0,12, square, 0,04, +0,05
  - `oneup`: 784, 988, 1175, 1568, je 0,08, square, 0,05, Abstand 0,06
  - `stomp`: 500 → 60, 0,18, square, 0,07
  - `hurt`: 300 → 40, 0,5, sawtooth, 0,07
  - `save`: 660, 880, je 0,1, triangle, 0,07, Abstand 0,1
  - `win`: 523, 659, 784, 1047, 784, 1047, je 0,14, square, 0,05, Abstand 0,11
  - `over`: 392, 330, 262, 196 → jeweils `f · 0.98`, je 0,22, triangle, 0,08, Abstand 0,2
- [ ] `audio/audio.ts`: `play(event)`: stumm oder kein Context → nichts. Sonst für jeden
  Teilton `tone(...)` wörtlich nach 10.2 (kein Anstieg, exponentiell auf 0,0001, Tonhöhe
  exponentiell auf `max(20, f2)`, Stopp nach `dur + 0.02`), angeschlossen an `output()`.
- [ ] `main.ts`: Im Schritt-Rückruf nach `stepGame`: `for (const e of state.events) audio.play(e)`.
- [ ] `logic/game.test.ts`, neue Tests (Block „sounds“):
  - Sprung vom Boden → `['jump']` nur in diesem Schritt, im nächsten Schritt `[]`.
  - Gehaltene Sprungtaste ohne neuen Druck und Abprallen von einem Bug → kein `'jump'`.
  - Die Sprungtaste, die auf dem Titel startet bzw. das Intro wegdrückt → kein `'jump'`.
  - Ein Bug plattgemacht → `['stomp']`. Zwei Bugs zugleich → `['stomp', 'stomp']`.
  - Abgrund → `'hurt'`. Bug von der Seite → `'hurt'`.
  - Checkpoint → `'save'`, beim zweiten Berühren nichts.
  - Ziel → `'win'`.
  - Letzter Todesbalken → `'over'` im Übergangsschritt. Todesbalken mit Leben übrig →
    Wiedereinstieg ohne Ereignis.
  - Keine Ereignisse in `paused`, `title`, `intro` und `gameOver`, auch mit allen Tasten.
- [ ] `logic/tokens.test.ts`: Im Test zum 25. Token `events` = `['coin']`. Im Test zum 100. Token
  `events` = `['coin', 'oneup']`.

**Automated Verification**:
- [ ] `npm run typecheck` ist fehlerfrei
- [ ] `npm test` ist grün
- [ ] `npm run build` läuft durch

**Manual Verification**:
- [ ] `npm run dev` starten (läuft er noch, reicht Cmd + R). Klick auf das Bild, starte mit ENTER.
  Spring: kurzes, helles „Bwip“ nach oben. Halte die Sprungtaste gedrückt: Es kommt nur ein
  Geräusch pro Sprung.
- [ ] Sammle einen Token: „Ding-Ding“ (zwei Töne).
- [ ] Spring auf einen Bug: schnell fallendes „Pjuu“. Das Abprallen danach macht kein
  Sprung-Geräusch.
- [ ] Lauf über die Diskette (Checkpoint): zwei sanfte, aufsteigende Töne. Beim zweiten Mal
  nichts.
- [ ] Fall in einen Abgrund: langes, schnarrendes Abwärts-Geräusch. Die Musik läuft darunter
  weiter. Lauf in einen Bug hinein: dasselbe Geräusch.
- [ ] Drück P und dann nochmal P: Weder Pause noch Weiterspielen machen ein Geräusch.
- [ ] Verliere ein Leben: Nach dem roten Balken taucht Claudia ohne Geräusch wieder auf.
- [ ] Verliere alle Leben: Beim Game Over verstummt die Musik, und die traurige, absteigende
  Tonfolge erklingt.
- [ ] Spiel bis zum OUTPUT-Terminal: Die Fanfare erklingt über der weiterlaufenden Musik.

### Phase 3: Ton aus mit M

Dependencies: Phase 2 (Geräusche, damit „still“ auch für Geräusche prüfbar ist)

M schaltet überall sofort alles still, der Hinweis „Ton aus (M)“ erscheint (auch auf dem Titel),
und die Einstellung bleibt nach dem Neuladen erhalten.

**Tasks**:
- [ ] `config.ts`: `SOUND_OFF_KEY = 'claudiaRamDschungelTonAus'`.
- [ ] `texts.ts`: `soundOff: 'Ton aus (M)'`.
- [ ] `storage/browser.ts` (neu): `GameStorage = Pick<Storage, 'getItem' | 'setItem'>` und
  `browserStorage()` aus `storage/highscore.ts` hierher verschieben. `highscore.ts`,
  `highscore.test.ts` und `main.ts` importieren von dort.
- [ ] `storage/sound.ts` (neu):
  - `readSoundOff(storage: GameStorage | null): boolean` → `true` nur bei `'1'`. Fehlender Wert,
    anderer Wert, Fehler oder `null` → `false` (Ton an).
  - `writeSoundOff(storage, off)` → `'1'` bzw. `'0'`, in `try/catch`.
- [ ] `audio/audio.ts`: `setMuted(muted)`: Merker setzen. Beim Ausschalten (mit Context): Musik
  zurückdrehen (siehe Pitfalls), `next = 0`, Hauptschalter trennen und verwerfen, falls es schon
  einen gibt (`if (master) { master.disconnect(); master = null; }`, bei M als erster Taste gibt es
  noch keinen). Beim
  Einschalten nichts weiter: Der nächste Ton baut einen neuen Schalter, und `update` setzt die
  Musik an der gemerkten Stelle fort.
- [ ] `input/keyboard.ts`: Rückruf `onMute`. Reihenfolge in `keydown`: `preventDefault()`,
  `onGameKey()`, `held.add(...)`, dann die bestehende Zeile `if (e.repeat) return;`, **danach**
  `if (MUTE.has(e.code)) onMute()`. So schaltet gehaltenes M nur einmal.
- [ ] `main.ts`: `let soundOff = readSoundOff(storage)`, `createAudio(soundOff)`.
  `onMute: () => { soundOff = !soundOff; audio.setMuted(soundOff); writeSoundOff(storage,
  soundOff); }`. `draw = () => render(ctx, state, soundOff)`.
- [ ] `render/hud.ts`: `drawSoundOffHint(ctx)` = `shadowText(ctx, texts.soundOff, VIEW_W - 20, 58,
  12, '#fff8', 'right')`. `drawHud(ctx, state, soundOff)` ruft ihn am Ende auf, wenn `soundOff`.
- [ ] `render/title.ts`: `drawTitle(ctx, state, soundOff)` ruft `drawSoundOffHint` als Letztes
  auf, wenn `soundOff`.
- [ ] `render/renderer.ts`: `render(ctx, state, soundOff: boolean)` gibt den Wert an `drawHud`
  und `drawTitle` weiter.
- [ ] `storage/sound.test.ts` (neu), mit Fake-Speicher wie in `highscore.test.ts`:
  - nichts gespeichert → `false`. `'1'` → `true`. `'0'` → `false`.
  - seltsame Werte (`'true'`, `'ja'`, `''`, `'2'`) → `false`.
  - `getItem` wirft → `false`. `setItem` wirft → kein Fehler nach außen. `null` → `false` bzw.
    nichts passiert.
  - `writeSoundOff(true)` und wieder Lesen → `true`, danach `writeSoundOff(false)` → `false`.

**Automated Verification**:
- [ ] `npm run typecheck` ist fehlerfrei
- [ ] `npm test` ist grün
- [ ] `npm run build` läuft durch

**Manual Verification**:
- [ ] `npm run dev` starten oder neu laden. Klick auf das Bild, starte mit ENTER. Drück beim
  Spielen M: Sofort ist alles still, und oben rechts unter „RAM-Dschungel“ steht klein
  „Ton aus (M)“. Spring: kein Geräusch.
- [ ] Warte ein paar Sekunden und drück M: Der Hinweis verschwindet, und die Musik läuft an der
  Stelle weiter, an der sie aufgehört hat (nicht von vorn).
- [ ] Halte M zwei Sekunden gedrückt: Es schaltet nur einmal um.
- [ ] Verliere alle Leben. Drück sofort M, sobald die traurige Game-Over-Tonfolge beginnt: Sie
  bricht mitten drin ab.
- [ ] Ton aus: Spring zweimal und sammle einen Token, dann drück M: Es kommen keine verspäteten
  Geräusche, nur die Musik setzt wieder ein.
- [ ] Starte ein Spiel und drück M, während der Intro-Balken noch zu sehen ist: Es schaltet um, und
  der Balken bleibt, bis er von selbst ausblendet.
- [ ] Probier M in der Pause, im roten Todesbalken, bei „Level geschafft“ und im Game Over: Es
  schaltet jedes Mal um, und sonst passiert nichts (die Pause bleibt, der Balken läuft weiter,
  das Spiel geht nicht weiter). Der Hinweis ist in Pause, „Level geschafft“ und Game Over unter
  der Abdunklung etwas schwächer.
- [ ] Geh zum Titelbild und drück M: Oben rechts steht „Ton aus (M)“, und das Spiel startet nicht.
- [ ] Lade die Seite mit ausgeschaltetem Ton neu: Auf dem Titelbild steht sofort „Ton aus (M)“.
  Klick auf das Bild und drück ←: Es bleibt still. Drück M: Der Hinweis verschwindet, die Musik
  startet.
- [ ] Lade jetzt (Ton an) neu: Der Hinweis fehlt, die Seite ist still, bis du klickst oder eine
  Taste drückst.
- [ ] Lade neu und drück als allererste Taste M: Es bleibt still, und „Ton aus (M)“ erscheint.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

## References

- Spec: `docs/agents/specs/2026-10-02-musik-und-sound.md`
- `docs/prototype-reference.md` — Abschnitt 10 (10.1 Audio-Start, 10.2 Geräusche und wann sie
  erklingen, 10.3 `TRACKS.jungle`, `noteAt`, `drumAt`, `tickMusic`, Musik je Zustand,
  10.4 Stummschalten und Hinweis, 10.5 Besonderheiten), Abschnitt 9.9 (Tastenzuordnung)
- `docs/design.md` — States (Loading, Ton aus), Style (Ton)
- `docs/architecture.md` — Building blocks (Ereignisse → Ton & Musik), Speicher, Data
- Vorheriger Plan: `docs/agents/plans/2026-10-01-spielablauf-bildschirme.md` (Entscheidungen 3
  und 6: sicherer Speicher, Pause bei `blur`/`visibilitychange`)
