# Prototyp-Referenz: Level von „Claude im RAM-Dschungel“

Extrahiert aus dem Prototyp `game.html` (Array `LEVELS`, Zeilen 40–130) inkl. der Spielregeln,
die das Verhalten der Level-Elemente bestimmen. Alle Werte entsprechen exakt dem Prototyp.

> Ab Slice 6 ist der Prototyp nur noch Ideengeber (siehe product.md). Diese Datei wird nicht mehr
> ergänzt. Was hier steht, ist ein Startpunkt, und die Specs dürfen davon abweichen.

---

## 1. Grundlagen & Koordinatensystem

| Größe | Wert | Bedeutung |
|---|---|---|
| Kachelgröße `T` | 32 px | Alle Level-Koordinaten sind in Kacheln angegeben |
| Sichtfenster | 960 × 544 px (30 × 17 Kacheln) | |
| Reihen (`ROWS`) | 17 (0 = oben, 16 = unten) | |
| Boden | Reihen 15 und 16 | „Auf dem Boden stehen“ = Reihe 14 |
| Startposition | in allen Level `[2, 14]` | |
| Ziel („OUTPUT“-Terminal) | `goal: [x, 14]` | 48 × 64 px, hohe Trefferzone (zählt auch im Sprung) |

Zwischen den Boden-Abschnitten liegen Lücken; wer hineinfällt, stirbt (in Level 4 ist dort Lava).

---

## 2. Level-Format (Legende)

| Feld | Format | Bedeutung |
|---|---|---|
| `name` | Text | Titel, wird im Level-Intro gezeigt |
| `sub` | Text | Einzeiler/Tipp im Level-Intro |
| `theme` | Objekt | Farben: `sky` (Verlauf oben→unten), `far` (Hintergrund-Glühen), `ground`, `top` (Grasnarbe/Oberkante), `accent` (Tokens, UI), `vines` (Lianen/Kabel-Farben), optional `lava: true` |
| `music` | Schlüssel | Musikspur (`jungle`, `cache`, `cave`, `volcano`, `boss`) |
| `width` | Kacheln | Levellänge |
| `start` / `goal` | `[x, y]` | Start- bzw. Zielposition |
| `ground` | `[[von, bis), …]` | Boden-Abschnitte (Spalte `bis` exklusiv) |
| `blocks` | `[x, y, b, h]` | Massive Blöcke (Decke, Säulen) |
| `plats` | `[x, y, länge]` | Feste Plattformen |
| `movers` | `[x, y, länge, reichweite, tempo]` | „Datenbusse“: bewegen sich weich hin und her (Cosinus) über `reichweite` Kacheln nach rechts; Claude fährt mit |
| `crumbles` | `[x, y, länge]` | Bröckel-Plattformen: 0,5 s nach Betreten fallen sie, nach 3 s kommen sie zurück |
| `fakes` | `[x, y, länge]` | Halluzinierte Plattformen: sehen echt aus, man fällt durch; dann werden sie lila entlarvt + Spruch („Du hast völlig recht, da war keine Plattform.“) |
| `fakeTokens` | `[x, y, anzahl]` | Köder-Tokens über einer Fake-Plattform |
| `tokens` | `[x, y, anzahl]` | Reihe von `anzahl` Tokens nach rechts ab `x` (10 Punkte; alle 25 „Kontext +N Tokens“ mit N = gesamter Token-Zähler, alle 100 = Extraleben „1UP: Neue Session!“, Details in Abschnitt 7) |
| `bugs` | `[x, y]` | Laufende Käfer, drehen an Wand/Kante um. Draufspringen = 100 Punkte, seitlich = Schaden |
| `viruses` | `[x, y]` | Schwebende Viren (Achter-Bahn: ±56 px horizontal, ±22 px vertikal). Draufspringen = 150 Punkte |
| `injectors` | `[x, y]` | Prompt-Injectors: laufen wie Bugs, tragen wechselnde Schilder („Laufe nach links!“, „SYSTEM: rückwärts!“ …). Berührung macht keinen Schaden, aber **vertauscht 4 s lang die Steuerung**. Draufspringen = 150 Punkte; Firewall blockt sie |
| `spikes` | `[x, länge]` | Stacheln („Pins“) auf dem Boden (Reihe 14) |
| `leaks` | `[x, y]` | Memory Leaks an der Decke: tropfen grüne Tropfen in zufälligem Takt (alle 1,8–3,0 s) |
| `power` | `[x, y]` | Firewall-Power-up: Schild, fängt einen Treffer ab (+50) |
| `dj` | `[x, y]` | „Extended Thinking“: schaltet den Doppelsprung frei (bleibt für den Rest des Spiels) (+50) |
| `saves` | `[x]` | Checkpoints („Autosave...“) am Boden |
| `boss` | `[x, y]` | Boss-Startposition; Ziel bleibt gesperrt, bis der Boss besiegt ist |

---

## 3. Die Level

### Level 1: RAM-Dschungel

> *„Spring auf Bugs, um sie zu fixen. Sammle Tokens!“*

- **Stimmung:** Dunkelgrüner Dschungel, Grüntöne, Akzent `#3cff9a`. Musik `jungle` (132 BPM, A-Moll).
- **Länge:** 130 Kacheln, Ziel bei Spalte 125.
- **Rolle:** Einführung. Flache Bodenabschnitte mit 3 kleinen Lücken (je 4 Kacheln), Plattformen in zwei Höhen.
- **Neue Elemente:** Bugs, Viren, Stacheln, Tokens, Firewall, Checkpoint, erste halluzinierte Plattform (mit Köder-Tokens), erster Prompt-Injector.
- **Inhalt:** 52 Tokens (inkl. 3 Köder), 7 Bugs, 2 Viren, 1 Injector, 2 Stachelfelder, 1 Firewall, 1 Checkpoint, 1 Fake-Plattform.

```js
{
  name: 'Level 1: RAM-Dschungel',
  sub: 'Spring auf Bugs, um sie zu fixen. Sammle Tokens!',
  theme: { sky: ['#03140c', '#0b3a22'], far: '#1aff8c', ground: '#123d27', top: '#2fbf6a', accent: '#3cff9a',
           vines: ['#1e7a45', '#2a9d5c', '#c9a227', '#16603a', '#b33a3a'] },
  music: 'jungle', width: 130, start: [2, 14], goal: [125, 14],
  ground: [[0, 28], [32, 58], [62, 84], [88, 130]],
  plats: [[9, 11, 4], [17, 8, 4], [36, 11, 3], [43, 8, 4], [51, 11, 3], [65, 11, 4], [72, 8, 4], [92, 11, 4], [99, 8, 4], [107, 11, 3]],
  tokens: [[9, 10, 4], [17, 7, 4], [28, 12, 4], [36, 10, 3], [43, 7, 4], [58, 12, 4], [65, 10, 4], [72, 7, 4], [84, 12, 4], [92, 10, 4], [99, 7, 4], [112, 13, 6]],
  bugs: [[22, 14], [40, 14], [47, 14], [69, 14], [77, 14], [95, 14], [103, 14]],
  viruses: [[91, 9], [115, 10]],
  spikes: [[50, 2], [118, 2]],
  power: [[19, 5]],
  saves: [64],
  fakes: [[78, 11, 3]], fakeTokens: [[78, 10, 3]],
  injectors: [[110, 14]],
}
```

---

### Level 2: Cache-Canyon

> *„Reite auf den Datenbussen über den Canyon!“*

- **Stimmung:** Nächtlicher Canyon in Blau/Violett, Akzent `#7cc4ff`. Musik `cache` (150 BPM, treibende Arpeggien).
- **Länge:** 140 Kacheln, Ziel bei Spalte 135.
- **Rolle:** Breite Schluchten (6–10 Kacheln), die nur mit beweglichen Plattformen überquert werden können.
- **Neue Elemente:** Datenbusse (`movers`).
- **Inhalt:** 52 Tokens (inkl. 3 Köder), 8 Bugs, 4 Viren, 2 Injectors, 4 Stachelfelder, 5 Datenbusse, 1 Firewall, 1 Checkpoint, 2 Fake-Plattformen.

```js
{
  name: 'Level 2: Cache-Canyon',
  sub: 'Reite auf den Datenbussen über den Canyon!',
  theme: { sky: ['#070a1e', '#1b2a5a'], far: '#5ab0ff', ground: '#1a2150', top: '#4f7cff', accent: '#7cc4ff',
           vines: ['#3b4fa8', '#6a3fb0', '#2d7fc4', '#c9a227', '#283a80'] },
  music: 'cache', width: 140, start: [2, 14], goal: [135, 14],
  ground: [[0, 20], [26, 40], [48, 52], [60, 80], [90, 96], [104, 140]],
  movers: [[20, 13, 3, 3, 1.6], [40, 12, 3, 5, 1.4], [52, 13, 3, 5, 1.8], [80, 11, 3, 7, 1.2], [96, 12, 3, 5, 1.6]],
  plats: [[8, 11, 4], [30, 10, 4], [64, 11, 4], [71, 8, 4], [110, 11, 4], [118, 8, 4], [126, 11, 3]],
  tokens: [[8, 10, 4], [21, 11, 4], [30, 9, 4], [42, 10, 4], [54, 11, 4], [64, 10, 4], [71, 7, 4], [82, 9, 6], [97, 10, 4], [110, 10, 4], [118, 7, 4], [126, 10, 3]],
  bugs: [[12, 14], [34, 14], [66, 14], [75, 14], [108, 14], [115, 14], [122, 14], [130, 14]],
  viruses: [[44, 8], [84, 7], [100, 8], [121, 5]],
  spikes: [[12, 2], [30, 2], [68, 2], [112, 2]],
  power: [[73, 5]],
  saves: [62],
  fakes: [[34, 10, 3], [100, 9, 3]], fakeTokens: [[100, 8, 3]],
  injectors: [[37, 14], [106, 14]],
}
```

---

### Level 3: Festplatten-Höhle

> *„Vorsicht: Memory Leaks tropfen von der Decke!“*

- **Stimmung:** Höhle in Braun/Orange, Akzent `#ffb347`. Musik `cave` (112 BPM, düster, D-Moll).
- **Länge:** 150 Kacheln, Ziel bei Spalte 146.
- **Rolle:** Geschlossene Decke (Reihen 0–1 über die ganze Länge) und Säulen als Hindernisse; tropfende Gefahr von oben.
- **Neue Elemente:** Massive Blöcke (Decke, Säulen), Memory Leaks, Doppelsprung-Power-up „Extended Thinking“ (bei Spalte 76 über einer Lücke).
- **Inhalt:** 59 Tokens, 7 Bugs, 5 Viren, 2 Injectors, 5 Stachelfelder, 7 Memory Leaks, 5 Datenbusse, 2 Firewalls, 1 Doppelsprung, 2 Checkpoints, 2 Fake-Plattformen (ohne Köder).

```js
{
  name: 'Level 3: Festplatten-Höhle',
  sub: 'Vorsicht: Memory Leaks tropfen von der Decke!',
  theme: { sky: ['#120606', '#3a1a10'], far: '#ff8a3c', ground: '#3a2016', top: '#b8662f', accent: '#ffb347',
           vines: ['#7a3b1e', '#a0522d', '#c9a227', '#5a2a14', '#8b1e1e'] },
  music: 'cave', width: 150, start: [2, 14], goal: [146, 14],
  ground: [[0, 25], [29, 45], [50, 70], [75, 78], [83, 100], [105, 150]],
  blocks: [[0, 0, 150, 2], [20, 12, 2, 3], [60, 12, 2, 3], [120, 11, 3, 4]],
  movers: [[25, 12, 2, 2, 1.5], [45, 12, 3, 2, 1.5], [70, 12, 2, 3, 1.7], [78, 11, 2, 3, 1.7], [100, 12, 2, 3, 1.5]],
  plats: [[8, 11, 4], [33, 10, 4], [54, 10, 3], [64, 9, 3], [87, 11, 4], [94, 8, 3], [110, 11, 3], [116, 12, 2], [130, 10, 4]],
  tokens: [[8, 10, 4], [19, 10, 4], [25, 10, 4], [33, 9, 4], [46, 10, 3], [54, 9, 3], [64, 8, 3], [70, 10, 6], [78, 9, 4], [87, 10, 4], [94, 7, 3], [101, 10, 3], [110, 10, 3], [121, 9, 3], [130, 9, 4], [142, 13, 4]],
  bugs: [[16, 14], [35, 14], [55, 14], [85, 14], [108, 14], [128, 14], [143, 14]],
  viruses: [[30, 8], [73, 8], [98, 7], [124, 6], [137, 9]],
  spikes: [[11, 2], [35, 2], [55, 2], [90, 2], [134, 2]],
  leaks: [[14, 2], [38, 2], [57, 2], [91, 2], [114, 2], [134, 2], [140, 2]],
  power: [[65, 6], [131, 7]],
  dj: [[76, 12]],
  saves: [52, 106],
  fakes: [[67, 9, 2], [103, 9, 2]],
  injectors: [[41, 14], [88, 14]],
}
```

---

### Level 4: CPU-Vulkan

> *„Überhitzte Register zerbröseln unter dir. Nicht trödeln!“*

- **Stimmung:** Vulkan in Rot mit Lava am unteren Bildrand, Akzent `#ff7b54`. Musik `volcano` (160 BPM, hektisch, G-Moll).
- **Länge:** 150 Kacheln, Ziel bei Spalte 146.
- **Rolle:** Viele große Lücken (bis 12 Kacheln), überbrückt fast nur mit Bröckel-Plattformen – man muss zügig weiter.
- **Neue Elemente:** Bröckel-Plattformen (`crumbles`), Lava (`theme.lava`): Herunterfallen = Tod mit „Überhitzt! CPU bei 105 °C“. Ein Doppelsprung liegt direkt am Start (falls noch nicht vorhanden).
- **Inhalt:** 54 Tokens (inkl. 3 Köder), 10 Bugs, 5 Viren, 2 Injectors, 3 Stachelfelder, 9 Bröckel-Plattformen, 1 Datenbus, 1 Firewall, 1 Doppelsprung, 2 Checkpoints, 2 Fake-Plattformen.

```js
{
  name: 'Level 4: CPU-Vulkan',
  sub: 'Überhitzte Register zerbröseln unter dir. Nicht trödeln!',
  theme: { sky: ['#1a0408', '#4a0e14'], far: '#ff4f6a', ground: '#3a1418', top: '#d0403a', accent: '#ff7b54',
           vines: ['#6a1a20', '#8a2a2a', '#c9a227', '#4a1010', '#b0502a'], lava: true },
  music: 'volcano', width: 150, start: [2, 14], goal: [146, 14],
  ground: [[0, 14], [20, 30], [38, 42], [52, 64], [74, 78], [88, 104], [116, 150]],
  crumbles: [[15, 12, 3], [33, 12, 3], [44, 12, 2], [48, 11, 2], [80, 12, 2], [84, 11, 2], [106, 12, 2], [110, 10, 2], [113, 12, 2]],
  movers: [[64, 12, 3, 7, 1.3]],
  plats: [[5, 11, 4], [24, 10, 3], [56, 11, 4], [58, 7, 3], [92, 11, 4], [98, 8, 3], [120, 11, 3], [126, 8, 3], [134, 11, 4]],
  tokens: [[15, 11, 3], [24, 9, 3], [33, 11, 3], [44, 11, 2], [48, 10, 2], [56, 10, 4], [58, 6, 3], [66, 10, 6], [80, 11, 2], [84, 10, 2], [92, 10, 4], [98, 7, 3], [106, 11, 2], [110, 9, 2], [120, 10, 3], [126, 7, 3], [134, 10, 4]],
  bugs: [[8, 14], [25, 14], [55, 14], [61, 14], [90, 14], [96, 14], [101, 14], [120, 14], [128, 14], [140, 14]],
  viruses: [[46, 7], [68, 8], [82, 8], [108, 6], [131, 9]],
  spikes: [[92, 2], [124, 2], [138, 2]],
  power: [[59, 6]],
  dj: [[6, 10]],
  saves: [53, 118],
  fakes: [[70, 9, 3], [129, 8, 3]], fakeTokens: [[70, 8, 3]],
  injectors: [[23, 14], [97, 14]],
}
```

---

### Level 5: Legacy-Code (Boss)

> *„BOSS: LEGACY_BUG.exe – seit 1998 ungetestet. Spring ihm auf den Kopf!“*

- **Stimmung:** Grau, Alt-Monitor-Grün, Akzent `#9aff9a`. Musik `boss` (172 BPM, Sägezahn-Bass, C-Moll).
- **Länge:** 30 Kacheln = genau ein Bildschirm (Arena), Ziel bei Spalte 28.
- **Aufbau:** Durchgehender Boden, zwei seitliche Plattformen (links/rechts, Reihe 10) und eine hohe Mittelplattform (Reihe 7) mit 6 Tokens.
- **Ziel ist gesperrt**, bis der Boss besiegt ist („Legacy-Code refactored! Ab zum OUTPUT!“).

```js
{
  name: 'Level 5: Legacy-Code',
  sub: 'BOSS: LEGACY_BUG.exe – seit 1998 ungetestet. Spring ihm auf den Kopf!',
  theme: { sky: ['#0a0a0c', '#262033'], far: '#9aff9a', ground: '#26262e', top: '#5a5a6a', accent: '#9aff9a',
           vines: ['#3a3a44', '#4a4a55', '#2f4f2f', '#555', '#6b5b4b'] },
  music: 'boss', width: 30, start: [2, 14], goal: [28, 14],
  ground: [[0, 30]],
  plats: [[2, 10, 4], [24, 10, 4], [12, 7, 6]],
  tokens: [[12, 6, 6]],
  boss: [21, 14],
}
```

#### Boss LEGACY_BUG.exe

- **Größe:** 96 × 72 px, **5 Lebenspunkte** (Lebensbalken oben mittig). Ignoriert Plattformen, steht nur auf dem Arena-Boden.
- **Wut-Stufe** `rage = 5 − HP`: Mit jedem Treffer wird er schneller und aggressiver.
- **Verhalten (Wechsel zwischen):**
  - *Laufen* auf Claude zu, Tempo 60 + 25 × rage px/s.
  - *Sprung-Angriff* (50 %): springt in Richtung Claude; bei der Landung Bildschirmwackeln und **zwei Schockwellen** am Boden nach links und rechts (Tempo 260 + 30 × rage).
  - *Wurf* (50 %): wirft nach 0,6 s Ausholen 3 Code-Geschosse im Bogen (ab rage 3: 4 Stück) mit Labels wie `TODO`, `FIXME`, `goto`, `eval()`, `// hack`, `XXX`, `final_v2_FINAL`, `var`.
  - Angriffspause: max(1,0 s; 2,4 s − 0,3 × rage).
- **Treffer:** Nur durch Draufspringen (+300 Punkte, 1 s unverwundbar). Danach spuckt er 1 kleinen Bug aus (bei ≤ 2 HP: 2 Bugs). Bei 2 HP erscheint eine Firewall auf der Mittelplattform.
- **Seitlicher Kontakt:** Schaden + Rückstoß.
- **Prompt-Kanone wirkt nicht** auf ihn („Ich verstehe nur COBOL.“, „Legacy ignoriert Prompts!“); Geschosse können damit aber abgeschossen werden („Code Review: abgelehnt“).
- **Sprüche** (alle 5–8 s): „Never touch a running system!“, „Das war schon immer so!“, „Funktioniert doch!“, „Kommentare sind für Anfänger!“, „1998 war alles besser!“, „Wer braucht schon Tests?“, „goto ist super!“
- **Treffer-Sprüche:** „Refactoring...“, „Tests geschrieben!“, „Typen ergänzt!“, „Doku nachgereicht!“, „Code Review bestanden!“
- **Niederlage:** +2000 Punkte, Explosionen, letzter Satz „Aber... es lief doch...“, danach öffnet sich das Ziel.

---

## 4. Level-übergreifende Regeln

- **Leben:** Start mit 3. Game Over → Level nochmal (Leben wieder 3, Score halbiert) oder zurück ins Menü.
- **Level geschafft:** +500 Punkte + Zeitbonus `max(0, (240 − Sekunden) × 5)`.
- **Persistenz zwischen Leveln:** Score, Leben, Token-Zähler und Doppelsprung bleiben erhalten; Firewall geht beim Tod verloren.
- **Checkpoint:** Respawn an der zuletzt aktivierten Stelle; sonst am Levelstart.
- **Prompt-Kanone:** Verwandelt Bugs, Viren und Injectors in harmlose „Haustiere“ (Toaster, Gummiente, Zimmerpflanze), begrenzt durch 5 API-Credits (Rate-Limit), die bei jedem Level/Respawn zurückgesetzt werden.

---

## 5. Bewegung & Physik

Gerechnet wird in Pixeln und Sekunden, eine Kachel ist 32 px groß. Die Physik läuft in festen
Schritten von 1/60 s.

### Grundwerte

| Konstante | Wert | Bedeutung |
|---|---|---|
| `GRAV` | 2100 px/s² | Schwerkraft |
| `JUMP` | 780 px/s | Startgeschwindigkeit nach oben beim Sprung |
| `SPEED` | 270 px/s | Höchste Laufgeschwindigkeit (≈ 8,4 Kacheln/s) |
| `ACC` | 2600 px/s² | Beschleunigung beim Laufen |
| `FRICTION` | 2400 px/s² | Abbremsen ohne Eingabe |
| `MAXFALL` | 950 px/s | Höchste Fallgeschwindigkeit |

Beschleunigen und Bremsen gelten am Boden und in der Luft gleich. Eine eigene Luftsteuerung gibt
es nicht.

### Weitere Sprung- und Bewegungswerte

| Wert | Bedeutung |
|---|---|
| Coyote Time 0,1 s | Man kann noch springen, kurz nachdem man von einer Kante gelaufen ist |
| Jump Buffer 0,13 s | Ein zu früh gedrückter Sprung wird bei der Landung trotzdem ausgeführt |
| Variable Sprunghöhe | Lässt man die Sprungtaste los, wird die Aufwärtsgeschwindigkeit auf höchstens 0,42 × JUMP (≈ 328 px/s) gesenkt |
| Doppelsprung | 0,88 × JUMP ≈ 686 px/s |
| Abprallen von einem Gegner | Mit gehaltener Sprungtaste 0,85 × JUMP ≈ 663 px/s. Ohne setzt der Code 0,55 × JUMP ≈ 429 px/s, die variable Sprunghöhe kappt das aber im nächsten Schritt auf 0,42 × JUMP ≈ 328 px/s (effektiver Wert). Danach ist der Doppelsprung wieder verfügbar |
| Abprallen vom Boss | 0,9 × JUMP ≈ 702 px/s |
| Treffer, den die Firewall abfängt | Hüpfer mit 0,5 × JUMP = 390 px/s nach oben, 1,4 s unverwundbar |
| Rückstoß vom Boss | 420 px/s zur Seite, 450 px/s nach oben |
| Wiedereinstieg nach dem Tod | 1,5 s unverwundbar |
| Hitbox von Claude | 22 × 28 px |

### Daraus berechnet (stehen so nicht im Code)

| Größe | Wert |
|---|---|
| Höchste Sprunghöhe | ≈ 145 px ≈ 4,5 Kacheln |
| Flugzeit bis zur Absprunghöhe | ≈ 0,74 s |
| Sprungweite bei voller Geschwindigkeit | ≈ 200 px ≈ 6,3 Kacheln |
| Kürzester Hüpfer (Taste sofort losgelassen) | ≈ 26 px ≈ 0,8 Kacheln |
| Höhe des Doppelsprungs allein | ≈ 112 px ≈ 3,5 Kacheln |
| Höhe mit Doppelsprung (am höchsten Punkt gezündet) | ≈ 257 px ≈ 8 Kacheln |
| Zeit bis zur höchsten Laufgeschwindigkeit | ≈ 0,10 s |
| Zeit bis zum Stillstand | ≈ 0,11 s |
| Zeit bis zur höchsten Fallgeschwindigkeit | ≈ 0,45 s |

### Gegner (zum Vergleich)

- Bug: läuft mit 60 px/s
- Prompt-Injector: läuft mit 40 px/s
- Virus: schwebt in einer Achterbahn, ±56 px zur Seite und ±22 px nach oben und unten
- Boss: läuft mit 60 + 25 × Wut px/s, springt mit 900 px/s nach oben und seitlich mit höchstens 320 px/s

---

## 6. Progression neuer Mechaniken

| Level | Neu eingeführt |
|---|---|
| 1 RAM-Dschungel | Bugs, Viren, Stacheln, Tokens, Firewall, Checkpoint, Fake-Plattform, Prompt-Injector |
| 2 Cache-Canyon | Datenbusse (bewegliche Plattformen), breite Schluchten |
| 3 Festplatten-Höhle | Decke & Säulen, Memory Leaks, Doppelsprung |
| 4 CPU-Vulkan | Bröckel-Plattformen, Lava |
| 5 Legacy-Code | Bossarena, gesperrtes Ziel |

---

## 7. Tokens, Bugs, Leben, Tod, Checkpoints & HUD im Detail

Aus `game.html` nachgetragen. Ergänzt die Abschnitte 2, 4 und 5, ohne sie zu wiederholen. Texte sind
wörtlich, nur „Claude“ wird im neuen Spiel zu „Claudia“.

### Texte

- **Todessprüche** (zufällig, Wiederholung direkt hintereinander möglich): `Segmentation fault!`,
  `Stack Overflow!`, `Kernel Panic!`, `404: Claudia nicht gefunden` (Prototyp: „Claude“),
  `Out of Memory!`, `Halluzination erkannt!`, `Unerwartetes Token...`, `Strg+Z! Strg+Z!`,
  `Null Pointer Exception!`. Eigener Spruch nur bei Lava: `Überhitzt! CPU bei 105 °C`. Alle anderen
  Todesarten (Bug, Abgrund, Virus, Stacheln, Tropfen, Boss) nehmen einen zufälligen Spruch.
- **Zusatz unter dem Todesspruch** (zeigt die verbleibenden Leben): `Noch ${lives} Leben`, beim
  letzten Tod `Keine Leben mehr...`.
- **„War diese Antwort hilfreich?“** ab 0,7 s nach dem Tod: Zeile `←  👍        👎  →`; nach ← bzw. →
  großes 👍/👎 und ein zufälliger Satz.
  - 👍: `Danke für dein Feedback! Claudia ist trotzdem kaputt.` (Prototyp: „Claude“),
    `Freut mich, dass dir das Sterben gefallen hat!`, `Feedback gespeichert. Wird ignoriert.`
  - 👎: `Feedback wurde an /dev/null weitergeleitet.`,
    `Wir berücksichtigen das im nächsten Training. Vielleicht.`,
    `Tut mir leid! Soll ich es nochmal genauso versuchen?`
- **Bug besiegt** (zufällig, weiß, ohne Punktzahl): `Bug gefixt!`, `Patch deployed!`,
  `Ticket geschlossen!`, `Works on my machine!`, `LGTM!`
- **Virus besiegt**: `Virus entfernt!`, `Quarantäne!`, `Malware gelöscht!`, `sudo rm virus`
- **Tokens:** pro Token kein Text. Alle 25 (außer Vielfachen von 100) `Kontext +${tokens} Tokens` in
  Akzentfarbe am Token. Alle 100 `1UP: Neue Session!` in #ffd84a über der Figur.
- **Checkpoint:** `Autosave...` in #ffd84a über dem Checkpoint. Am Checkpoint selbst steht nichts.
- **Firewall fängt Treffer ab:** `Firewall hat's abgefangen!` (#7cf)
- **Game Over:** `KONTEXTFENSTER VOLL`, `Game Over – die Session ist abgelaufen.`,
  `Score: ${score}   Highscore: ${highscore}`, nach 1,2 s `ENTER: Level nochmal versuchen (Score halbiert)`
  und `ESC: zurück zum Hauptmenü`.
- **Level geschafft:** `Task erfolgreich abgeschlossen ✓`, `Zeitbonus: +${bonus}   Score: ${score}`,
  nach 1,2 s `ENTER: nächster Task` (nach Level 5: `ENTER: Abschluss`).
- **Pause:** `PAUSE`, `Claudia denkt nach... (P zum Weiterspielen)` (Prototyp: „Claude“)
- **Abspann:** `ALLE TASKS ERLEDIGT! 🎉`, `Legacy-Code besiegt. Der Nutzer ist begeistert.`,
  `Claudia hat sich einen Keks verdient. 🍪` (Prototyp: „Claude“), `Endstand: ${score}  (${tokens} Tokens)`,
  ggf. `NEUER HIGHSCORE!`, nach 1,2 s `ENTER: nochmal spielen`.
- **Titel:** `Highscore: ${highscore}`
- **Schwebende Texte allgemein:** fett 15 px, schwarzer Schatten 1 px versetzt, steigen mit 40 px/s
  auf, werden gleichmäßig durchsichtig und verschwinden nach 1,3 s.

### Tokens

- Mittelpunkt in der Kachelmitte, in einer Reihe je 32 px Abstand.
- Eingesammelt, wenn die Mitte der Figur waagerecht < 20 px und senkrecht < 22 px vom Token-Mittelpunkt
  entfernt ist. Nur während des Spielens.
- Aussehen: gefülltes Sechseck (Radius 9 px, Spitzen oben/unten) in der Akzentfarbe des Levels, darauf
  ein `T` (fett 11 px, #0008). Schwebt ±3 px (Periode ≈ 1,57 s) und „dreht“ sich durch waagerechtes
  Stauchen auf 35–100 % Breite (Periode ≈ 1,05 s). Phase je Token leicht versetzt.
- Beim Einsammeln 6 Partikel in Akzentfarbe.
- Meilensteine: alle 100 → +1 Leben (keine Extrapunkte). Alle 25 → nur Text. Keine Höchstzahl an Leben.
- Der Token-Zähler gilt fürs ganze Spiel (auch über Game-Over-Neuversuche); zurückgesetzt nur bei
  einem neuen Spiel.

### Bugs

- Trefferzone 24 × 18 px, stehen auf dem Boden der angegebenen Kachel, starten nach **links**.
- Drehen an festen Kacheln (Boden, Blöcke, Plattformen, Levelrand) und an Abgrundkanten um.
  Fake-Plattformen und Stacheln zählen nicht als fest. Bewegliche Plattformen ignorieren sie.
- Schwerkraft wirkt. Fällt doch einer (z. B. vom Boss ausgespuckt) unter 594 px, verschwindet er ohne
  Punkte.
- Laufen auch während Intro, Todesablauf und Level-Ende weiter, nicht bei Pause/Game Over.
- **Draufspringen** zählt, wenn sich die Figur nach unten bewegt **und** ihre Unterkante weniger als
  16 px unter der Oberkante des Bugs liegt. Sonst ist es ein seitlicher Treffer. Draufspringen wirkt
  auch während der Unverwundbarkeit. Immer 100 Punkte, keine Kombo.
- Eigenheit: Überlappen zwei Bugs, zählt der zweite im selben Schritt als seitlicher Treffer, weil die
  Figur schon nach oben fliegt.
- **Besiegt:** bleibt stehen, wird in ≈ 0,21 s auf 15 % Höhe plattgedrückt (unten verankert),
  verschwindet nach 0,6 s. 14 Partikel in #ff5a8a. Kein Bildschirmwackeln.
- **Partikel allgemein:** leben 0,5–0,9 s, 2–5 px groß, 66–286 px/s, Startimpuls 80 px/s nach oben,
  Schwerkraft 600 px/s².

### Tod & Wiedereinstieg

1. Leben −1, zufälliger Spruch, Bildschirmwackeln (anfangs ±6 px, in 0,3 s auf 0), 30 Partikel in
   #D97757. Die Figur verschwindet sofort, eine eigene Sterbeanimation gibt es nicht.
2. Die Welt läuft weiter, Steuerung wirkt nicht.
3. Sofort: dunkelroter Balken (#300c, y 202–372 px), Spruch fett 34 px #ff6b6b, darunter Leben-Text
   16 px weiß.
4. Ab 0,7 s die Feedback-Frage (siehe Texte).
5. Ende: automatisch nach 3,2 s, oder 1,6 s nach dem Feedback-Tastendruck, oder sofort mit ENTER bzw.
   Tippen (frühestens ab 0,7 s). Die Sprungtaste überspringt nicht.
6. Leben übrig → Figur steht sofort am Wiedereinstiegspunkt, die Kamera gleitet weich dorthin.
   1,5 s unverwundbar, sichtbar durch Blinken (Wechsel alle 1/15 s). Geschwindigkeit 0, Firewall weg,
   API-Credits voll, Prompts und Boss-Geschosse gelöscht.
   Keine Leben mehr → Game Over (Eingaben erst nach 1,2 s; ENTER/Leertaste/↑/W = Level nochmal mit
   3 Leben und halbiertem Score, P/ESC = Titel; angezeigt und gespeichert wird der Score **vor** dem
   Halbieren).

- Abgrund: Tod, sobald die Oberkante der Figur unter 584 px ist. Firewall und Unverwundbarkeit schützen
  nicht (gilt auch für Lava).
- Nach einem Tod kommen besiegte Bugs und gesammelte Tokens **nicht** zurück. Score, Token-Zähler,
  Power-ups, Checkpoints, Doppelsprung und Boss-Lebenspunkte bleiben. Erst „Level nochmal“ nach Game
  Over baut das Level komplett neu auf.

### Checkpoints

- Liegen auf dem Boden (Reihe 14). Aktiviert, sobald die Figur waagerecht die 32 px breite Spalte
  berührt, in beliebiger Höhe (auch beim Drüberspringen). Jeder nur einmal.
- Aussehen: Diskette, Körper 20 × 22 px (6 px vom linken Kachelrand, 8 px unter der Kacheloberkante),
  inaktiv #4a5a7a, aktiv #ffd84a. Schieber #ddd 12 × 7 px mit Loch #222 3 × 5 px, Etikett weiß
  14 × 9 px.
- Wiedereinstieg 5 px rechts vom linken Kachelrand, stehend auf dem Boden. Es zählt der zuletzt
  aktivierte.

### HUD

- Feld oben links: x 10, y 10, 440 × 34 px, Radius 8, #0008. Texte fett, Schatten #000a um +2/+2 px,
  Grundlinie y 34.

| Element | x | Größe | Farbe |
|---|---|---|---|
| kleines Roboter-Icon (gezeichnet, Skalierung 0,85) | 20 (y 14) | – | Figurfarben |
| `x${lives}` | 44 | 16 px | #fff |
| `Tokens ${tokens}` | 90 | 16 px | Akzentfarbe des Levels |
| `Score ${score}` (ohne Tausenderpunkte) | 230 | 16 px | #ffd84a |
| `FW` (nur mit Firewall) | 385 | 14 px | #7cf |
| `2x` (nur mit Doppelsprung) | 415 | 14 px | #d68cff |
| Levelname ohne „Level N: “, rechtsbündig | 940 | 15 px | #fffa |
| `Ton aus (M)`, rechtsbündig, y 58 | 940 | 12 px | #fff8 |

- Zweite Zeile (Prompt-Kanone): Feld x 10, y 48, 150 × 20 px, Radius 6, #0008. `API` (11 px, #ffe9a8),
  5 Kästchen 18 × 10 px ab x 46 im Abstand 22 px (leer #333, voll #ffe9a8, teilweise #a08a50). Bei
  Sperre blinkend `429 RATE LIMIT` (#ff6b6b/#fff).
- Situativ: `⚠ PROMPT INJECTION: Steuerung vertauscht (${sekunden}s)`, Boss-Leiste `LEGACY_BUG.exe`.

### Weitere Punkte und Schaden

- Punkte: Virus/Injector draufspringen 150, Gegner per Prompt verwandeln 75, Firewall- und
  Doppelsprung-Power-up je 50, Boss-Treffer 300, Boss besiegt 2000.
- Ziel: Trefferzone 48 × 224 px (reicht 160 px über das Terminal). `levelTime` für den Zeitbonus läuft
  nur beim Spielen (nicht in Intro, Pause, Todesablauf).
- Treffer über Schaden (Firewall und Unverwundbarkeit wirken): Bugs, Viren, Stacheln, Memory-Leak-Tropfen,
  Boss-Kontakt, Boss-Geschosse, Schockwellen. Direkter Tod: Abgrund, Lava.
- Viren-Trefferzone 18 × 18 px (rundum 3 px kleiner), das Draufspringen prüft aber die ungekürzte
  Oberkante. Stacheln je Kachel: Trefferzone ab x + 5, y + 14, 22 × 18 px.
- Boss-Draufspringen: großzügiger (< 30 px statt 16 px), danach 0,3 s unverwundbar. Ausgespuckte Bugs
  fliegen mit 80 px/s seitlich und 400 px/s nach oben.
- Highscore wird bei Game Over und beim Sieg gespeichert.

---

## 8. Zeichen-Code für Slice 3 (wörtlich aus game.html)

### Gemeinsame Grundlagen

Konstanten: Kachelgröße T, Canvas-Größe VW/VH, Bodenhöhe FLOOR, Physik (game.html, Zeilen 29–30):

```js
const T = 32, ROWS = 17, VW = 960, VH = 544, STEP = 1 / 60, FLOOR = 15 * T;
const GRAV = 2100, JUMP = 780, SPEED = 270, ACC = 2600, FRICTION = 2400, MAXFALL = 950;
```

Schriftart FONT, die alle Texte benutzen (game.html, Zeile 31):

```js
const FONT = "'Courier New', ui-monospace, monospace";
```

hash(): Pseudo-Zufall, der u. a. im Hintergrund genutzt wird; pick() für zufällige Sprüche (game.html, Zeilen 150–151):

```js
const pick = a => a[Math.floor(Math.random() * a.length)];
const hash = n => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };
```

Globaler Zustand: gt (Spielzeit, treibt alle Animationen), shake (Wackeln), state/stateT (game.html, Zeile 302):

```js
let state = 'title', stateT = 0, gt = 0, shake = 0;
```

Kamera: die Welt wird um -cam verschoben, bevor Objekte gezeichnet werden (game.html, Zeilen 1129–1131):

```js
function drawWorld() {
  ctx.save();
  ctx.translate(-Math.round(cam), 0);
```

rr(): Hilfsfunktion für abgerundete Rechtecke (genutzt von Roboter, HUD, Boss usw.) (game.html, Zeilen 836–840):

```js
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
```

### 1. Bug zeichnen (lebend/laufend und plattgedrückt)

Bug-Objekt beim Laden des Levels: Größe 24×18, startet mit vx = -60 (läuft nach links), squash = 0 (game.html, Zeile 325):

```js
    bugs: (L.bugs || []).map(([c, r]) => ({ x: c * T + 4, y: (r + 1) * T - 18, w: 24, h: 18, vx: -60, vy: 0, alive: true, squash: 0 })),
```

Farbpaletten (BUG_COLORS für normale Bugs; BOSS_COLORS/FLASH_COLORS stehen direkt daneben) und bugShape(): Käferform mit Beinanimation (legPhase), Kopf links, Ursprung Mitte unten (game.html, Zeilen 1002–1021):

```js
const BUG_COLORS = { leg: '#2a0a1a', body: '#c2185b', line: '#7a0f3a', spot: '#ff6fa5', head: '#3a0a24' };
const BOSS_COLORS = { leg: '#2a2218', body: '#6b5b4b', line: '#3a3028', spot: '#9aff9a', head: '#3a3028' };
const FLASH_COLORS = { leg: '#fff', body: '#fff', line: '#ddd', spot: '#fff', head: '#fff' };
// Käfer-Form, Kopf links, Ursprung = Mitte unten
function bugShape(col, legPhase, angry) {
  const leg = Math.sin(legPhase) * 2;
  ctx.strokeStyle = col.leg; ctx.lineWidth = 2;
  for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(k * 6, -6); ctx.lineTo(k * 7 + (k ? leg : -leg), 0); ctx.stroke(); }
  ctx.fillStyle = col.body; ctx.beginPath(); ctx.ellipse(2, -9, 11, 8, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(2, -17); ctx.lineTo(2, -1); ctx.stroke();
  ctx.fillStyle = col.spot; ctx.beginPath(); ctx.arc(-1, -12, 2, 0, 7); ctx.arc(6, -8, 2, 0, 7); ctx.fill();
  ctx.fillStyle = col.head; ctx.beginPath(); ctx.arc(-10, -8, 5, 0, 7); ctx.fill();
  ctx.fillStyle = angry ? '#ff3030' : '#fff'; ctx.fillRect(-13, -10, 3, 3);
  ctx.strokeStyle = col.head; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-12, -12); ctx.lineTo(-16, -18); ctx.moveTo(-9, -12); ctx.lineTo(-10, -19); ctx.stroke();
  if (angry) {
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-15, -12.5); ctx.lineTo(-10, -10.5); ctx.stroke();
  }
}
```

drawBug(): Blickrichtung über ctx.scale(-1/1) je nach vx, Beinphase gt * 18 + b.x, Plattdrücken über vertikale Skalierung squash (min. 0.15), nach 0.6 s unsichtbar (game.html, Zeilen 1023–1031):

```js
function drawBug(b) {
  const squash = b.alive ? 1 : Math.max(0.15, 1 - b.squash * 4);
  if (!b.alive && b.squash > 0.6) return;
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h);
  ctx.scale(b.vx > 0 ? -1 : 1, squash);
  bugShape(BUG_COLORS, gt * 18 + b.x, false);
  ctx.restore();
}
```

Update: tote Bugs zählen b.squash hoch (treibt die Plattdrück-Animation), lebende laufen (game.html, Zeilen 619–624):

```js
  // Bugs
  for (const b of ents.bugs) {
    if (!b.alive) { b.squash += dt; continue; }
    walk(b, dt);
    if (interactive && overlap(p, b)) stompOrHurt(b, BUG_MSGS, 100);
  }
```

walk(): Laufen bis Wand/Kante, dann vx umdrehen (ändert damit die Blickrichtung) (game.html, Zeilen 705–716):

```js
// Laufen bis zur Wand oder Kante, dann umdrehen
function walk(b, dt) {
  b.vy = Math.min(b.vy + GRAV * dt, MAXFALL);
  if (moveX(b, b.vx * dt)) b.vx = -b.vx;
  const h = moveY(b, b.vy * dt);
  if (h) b.vy = 0;
  if (h === 'down') {
    const ahead = b.vx > 0 ? Math.floor((b.x + b.w + 1) / T) : Math.floor((b.x - 1) / T);
    if (!solidAt(ahead, Math.floor((b.y + b.h + 2) / T))) b.vx = -b.vx;
  }
  if (b.y > VH + 50) b.alive = false;
}
```

stompOrHurt(): Draufspringen setzt alive = false und startet so das Plattdrücken (game.html, Zeilen 718–726):

```js
function stompOrHurt(e, msgs, pts) {
  if (p.vy > 0 && p.y + p.h - e.y < 16) {
    e.alive = false; score += pts; SND.stomp();
    p.vy = held.jump ? -JUMP * 0.85 : -JUMP * 0.55;
    p.usedDouble = false;
    burst(e.x + e.w / 2, e.y + e.h / 2, '#ff5a8a', 14);
    say(e.x, e.y - 14, pick(msgs), '#fff');
  } else hurt();
}
```

Aufruf in drawWorld() (game.html, Zeile 1232):

```js
  for (const b of ents.bugs) drawBug(b);
```

### 2. Token zeichnen

Token-Objekte beim Laden: Mittelpunkt in der Kachelmitte (game.html, Zeile 343):

```js
  for (const [c, r, n] of [...(L.tokens || []), ...(L.fakeTokens || [])]) for (let k = 0; k < n; k++) ents.tokens.push({ x: (c + k) * T + 16, y: r * T + 16, taken: false });
```

Tokens: Sechseck in theme.accent mit dunklem "T", Schweben (bob, Sinus) und Drehen (horizontale Skalierung 0.35–1 über |cos|) (game.html, Zeilen 1169–1179):

```js
  // Tokens
  for (const t of ents.tokens) {
    if (t.taken) continue;
    const bob = Math.sin(gt * 4 + t.x * 0.05) * 3, sw = Math.abs(Math.cos(gt * 3 + t.x * 0.02));
    ctx.save(); ctx.translate(t.x, t.y + bob); ctx.scale(0.35 + sw * 0.65, 1);
    ctx.fillStyle = theme.accent;
    ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); } ctx.fill();
    ctx.fillStyle = '#0008'; ctx.font = `bold 11px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('T', 0, 4);
    ctx.restore();
  }
  ctx.textAlign = 'left';
```

### 3. Checkpoint / Diskette zeichnen

Checkpoint-Objekte beim Laden: auf Bodenreihe 14 (game.html, Zeile 333):

```js
    saves: (L.saves || []).map(c => ({ x: c * T, y: 14 * T, active: false })),
```

Disketten: gelb (#ffd84a) wenn aktiv, sonst blaugrau (#4a5a7a), mit Metallschieber und Etikett (game.html, Zeilen 1146–1153):

```js
  // Checkpoints (Disketten)
  for (const s of ents.saves) {
    const x = s.x + 6, y = s.y + 8;
    ctx.fillStyle = s.active ? '#ffd84a' : '#4a5a7a'; ctx.fillRect(x, y, 20, 22);
    ctx.fillStyle = '#ddd'; ctx.fillRect(x + 4, y, 12, 7);
    ctx.fillStyle = '#222'; ctx.fillRect(x + 11, y + 1, 3, 5);
    ctx.fillStyle = '#fff'; ctx.fillRect(x + 3, y + 11, 14, 9);
  }
```

### 4. Partikel und schwebende Texte

burst(): erzeugt Partikel; say(): erzeugt schwebenden Text (game.html, Zeilen 384–390):

```js
function burst(x, y, color, n = 12, spd = 220) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = spd * (0.3 + Math.random());
    ents.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, life: 0.5 + Math.random() * 0.4, color, size: 2 + Math.random() * 3 });
  }
}
function say(x, y, text, color = '#fff') { ents.texts.push({ x, y, text, color, t: 0 }); }
```

Update: Partikel fallen mit Schwerkraft 600 und laufen aus; Texte leben 1.3 s (game.html, Zeilen 692–696):

```js
  // Partikel & Texte
  for (const q of ents.particles) { q.life -= dt; q.vy += 600 * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
  ents.particles = ents.particles.filter(q => q.life > 0);
  for (const t of ents.texts) t.t += dt;
  ents.texts = ents.texts.filter(t => t.t < 1.3);
```

Zeichnen am Ende von drawWorld(): Partikel als Quadrate mit Ausblenden, Texte mit schwarzem Schatten (+1 px), steigen 40 px/s und blenden aus (game.html, Zeilen 1275–1285):

```js
  for (const q of ents.particles) { ctx.globalAlpha = Math.min(1, q.life * 2); ctx.fillStyle = q.color; ctx.fillRect(q.x, q.y, q.size, q.size); }
  ctx.globalAlpha = 1;
  ctx.font = `bold 15px ${FONT}`;
  for (const t of ents.texts) {
    ctx.globalAlpha = 1 - t.t / 1.3;
    ctx.fillStyle = '#000'; ctx.fillText(t.text, t.x + 1, t.y - t.t * 40 + 1);
    ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y - t.t * 40);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
```

### 5. Bildschirmwackeln

shake wird um 1 pro Sekunde heruntergezählt (in update()) (game.html, Zeile 395):

```js
  shake = Math.max(0, shake - dt);
```

Beispiel, wo shake gesetzt wird: beim Tod 0.3 (weitere Stellen: Zeile 641 = 0.2, 735 = 0.15, 755 = 0.35, 796 = 0.3) (game.html, Zeilen 588–594):

```js
function die(msg) {
  if (state !== 'play') return;
  lives--; deathMsg = msg || pick(DEATH_MSGS); SND.hurt(); shake = 0.3;
  feedback = null; invertT = 0;
  burst(p.x + p.w / 2, Math.min(p.y + p.h / 2, VH - 10), '#D97757', 30, 320);
  setState('dead');
}
```

Anwendung in render(): zufälliger Versatz bis ±6 px (bei shake 0.3), gilt nur für Hintergrund und Welt, nicht für HUD/Overlays (game.html, Zeilen 1342–1347):

```js
function render() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 12 * shake / 0.3, (Math.random() - 0.5) * 12 * shake / 0.3);
  drawBackground();
  drawWorld();
  ctx.restore();
```

### 6. Blinken beim Unverwundbar-Sein

p.inv wird heruntergezählt (in updatePlayer()) (game.html, Zeile 515):

```js
  if (p.inv > 0) p.inv -= dt;
```

hurt(): Firewall fängt Treffer ab und setzt p.inv = 1.4 (game.html, Zeilen 579–587):

```js
function hurt() {
  if (p.inv > 0 || state !== 'play') return;
  if (p.shield) {
    p.shield = false; p.inv = 1.4; SND.shield();
    say(p.x, p.y - 16, 'Firewall hat\'s abgefangen!', '#7cf');
    burst(p.x + p.w / 2, p.y + p.h / 2, '#7cf', 16);
    p.vy = -JUMP * 0.5;
  } else die();
}
```

respawn(): setzt p.inv = 1.5 (game.html, Zeilen 595–600):

```js
function respawn() {
  p.x = p.spawnX; p.y = p.spawnY; p.vx = p.vy = 0; p.inv = 1.5; p.shield = false; p.riding = null;
  ents.projs = []; ents.waves = []; ents.shots = [];
  rate = { credits: 5, lock: 0, idle: 0 }; banner = null;
  setState('play');
}
```

Spieler zeichnen: bei p.inv > 0 wird der Roboter in jedem zweiten 1/15-s-Takt ausgelassen (Blinken); dazu der Firewall-Schildring (game.html, Zeilen 1266–1273):

```js
  // Spieler
  if (state !== 'title' && state !== 'dead' && !(p.inv > 0 && Math.floor(gt * 15) % 2)) {
    drawRobot(p.x, p.y, p.face, p.onGround && Math.abs(p.vx) > 20 ? p.runT : 0);
    if (p.shield) {
      ctx.strokeStyle = `rgba(120,200,255,${0.5 + 0.3 * Math.sin(gt * 6)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + p.h / 2, 22, 0, 7); ctx.stroke();
    }
  }
```

### 7. HUD zeichnen (inklusive Roboter-Icon)

drawRobot(): der Roboter, im HUD mit scale 0.85 als Icon benutzt (Antennenfarbe hängt von hasDouble ab) (game.html, Zeilen 967–1000):

```js
function drawRobot(x, y, face, run, scale = 1) {
  ctx.save();
  ctx.translate(x + 11 * scale, y);
  ctx.scale(scale * face, scale);
  ctx.translate(-11, 0);
  const step = run ? Math.sin(run / 7) * 2.5 : 0;
  // Beine
  ctx.fillStyle = '#8f4a33';
  ctx.fillRect(5, 22 + Math.max(0, step), 4, 6 - Math.max(0, step));
  ctx.fillRect(13, 22 + Math.max(0, -step), 4, 6 - Math.max(0, -step));
  // Antenne
  ctx.strokeStyle = '#8f4a33'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(11, 5); ctx.quadraticCurveTo(11 - step, 1, 13, -2); ctx.stroke();
  ctx.fillStyle = hasDouble ? `rgba(214,140,255,${0.6 + 0.4 * Math.sin(gt * 6)})` : `rgba(255,220,120,${0.6 + 0.4 * Math.sin(gt * 6)})`;
  ctx.beginPath(); ctx.arc(13, -3, 3, 0, 7); ctx.fill();
  // Körper
  ctx.fillStyle = '#D97757'; rr(0, 4, 22, 20, 6); ctx.fill();
  ctx.fillStyle = '#e8937a'; rr(2, 5, 18, 4, 2); ctx.fill();
  // Arm
  ctx.fillStyle = '#c4654a'; rr(-3, 14 - step * 0.5, 4, 7, 2); ctx.fill();
  // Gesicht
  ctx.fillStyle = '#2b1d16'; rr(4, 8, 16, 9, 3); ctx.fill();
  const blink = (gt % 3.2) < 0.12;
  ctx.fillStyle = '#9ff';
  ctx.fillRect(8, blink ? 12 : 10, 3, blink ? 1 : 4);
  ctx.fillRect(15, blink ? 12 : 10, 3, blink ? 1 : 4);
  // Funke auf der Brust
  ctx.strokeStyle = '#fff8'; ctx.lineWidth = 1.2;
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 4 + gt;
    ctx.beginPath(); ctx.moveTo(11 - Math.cos(a) * 2.5, 20 - Math.sin(a) * 2.5); ctx.lineTo(11 + Math.cos(a) * 2.5, 20 + Math.sin(a) * 2.5); ctx.stroke();
  }
  ctx.restore();
}
```

Hilfsfunktionen text() (fett, mit Schatten +2 px), panel() (Abdunklung) und blinkCol() (blinkendes Weiß) (game.html, Zeilen 1287–1294):

```js
function text(str, x, y, size, color = '#fff', align = 'center') {
  ctx.font = `bold ${size}px ${FONT}`; ctx.textAlign = align;
  ctx.fillStyle = '#000a'; ctx.fillText(str, x + 2, y + 2);
  ctx.fillStyle = color; ctx.fillText(str, x, y);
  ctx.textAlign = 'left';
}
function panel(alpha = 0.6) { ctx.fillStyle = `rgba(0,0,0,${alpha})`; ctx.fillRect(0, 0, VW, VH); }
const blinkCol = () => gt % 1 < 0.6 ? '#fff' : '#fff6';
```

drawHUD(): Leiste mit Roboter-Icon, Leben, Tokens, Score, FW/2x, Levelname, API-Credits, Prompt-Injection-Hinweis, Banner und Boss-Lebensbalken (game.html, Zeilen 1296–1340):

```js
function drawHUD() {
  ctx.fillStyle = '#0008'; rr(10, 10, 440, 34, 8); ctx.fill();
  drawRobot(20, 14, 1, 0, 0.85);
  text(`x${lives}`, 44, 34, 16, '#fff', 'left');
  text(`Tokens ${tokens}`, 90, 34, 16, theme.accent, 'left');
  text(`Score ${score}`, 230, 34, 16, '#ffd84a', 'left');
  if (p.shield) text('FW', 385, 34, 14, '#7cf', 'left');
  if (hasDouble) text('2x', 415, 34, 14, '#d68cff', 'left');
  text(L.name.split(': ')[1], VW - 20, 34, 15, '#fffa', 'right');
  if (muted) text('Ton aus (M)', VW - 20, 58, 12, '#fff8', 'right');
  // API-Credits der Prompt-Kanone
  ctx.fillStyle = '#0008'; rr(10, 48, 150, 20, 6); ctx.fill();
  if (rate.lock > 0) text('429 RATE LIMIT', 85, 63, 12, Math.floor(gt * 6) % 2 ? '#ff6b6b' : '#fff', 'center');
  else {
    text('API', 16, 63, 11, '#ffe9a8', 'left');
    for (let k = 0; k < 5; k++) {
      const fill = Math.max(0, Math.min(1, rate.credits - k));
      ctx.fillStyle = '#333'; ctx.fillRect(46 + k * 22, 53, 18, 10);
      ctx.fillStyle = fill >= 1 ? '#ffe9a8' : '#a08a50'; ctx.fillRect(46 + k * 22, 53, 18 * fill, 10);
    }
  }
  // Prompt Injection aktiv
  if (invertT > 0 && state === 'play') {
    ctx.fillStyle = `rgba(155,77,255,${0.08 + 0.05 * Math.sin(gt * 10)})`; ctx.fillRect(0, 0, VW, VH);
    text(`⚠ PROMPT INJECTION: Steuerung vertauscht (${invertT.toFixed(1)}s)`, VW / 2, 110, 18, Math.floor(gt * 4) % 2 ? '#d68cff' : '#fff');
  }
  if (banner) {
    ctx.globalAlpha = Math.min(1, banner.t * 3);
    ctx.font = `bold 17px ${FONT}`;
    const w = ctx.measureText(banner.text).width + 30;
    ctx.fillStyle = '#000c'; rr(VW / 2 - w / 2, 128, w, 32, 8); ctx.fill();
    text(banner.text, VW / 2, 150, 17, banner.color);
    ctx.globalAlpha = 1;
  }
  const b = ents.boss;
  if (b && !(b.dead && b.deadT > 1.8)) {
    const bw = 320, bx = VW / 2 - bw / 2, by = 64;
    text('LEGACY_BUG.exe', VW / 2, by - 6, 14, '#9aff9a');
    ctx.fillStyle = '#000a'; ctx.fillRect(bx, by, bw, 14);
    for (let k = 0; k < b.maxHp; k++) {
      ctx.fillStyle = k < b.hp ? (b.inv > 0 ? '#fff' : '#ff4f6a') : '#333';
      ctx.fillRect(bx + 3 + k * (bw - 6) / b.maxHp, by + 3, (bw - 6) / b.maxHp - 4, 8);
    }
  }
}
```

Aufruf in render() (nach der Welt, ohne Wackeln) (game.html, Zeile 1360):

```js
  drawHUD();
```

### 8. Overlays: Todesbalken, Game Over, Level geschafft

Todesmeldungen (zufällig ausgewählt, falls die()-Aufruf keine eigene Meldung mitgibt) (game.html, Zeilen 132–133):

```js
const DEATH_MSGS = ['Segmentation fault!', 'Stack Overflow!', 'Kernel Panic!', '404: Claude nicht gefunden',
  'Out of Memory!', 'Halluzination erkannt!', 'Unerwartetes Token...', 'Strg+Z! Strg+Z!', 'Null Pointer Exception!'];
```

Todesbalken (state dead): dunkelroter Balken über die volle Breite, Meldung, Leben, Feedback-Frage (game.html, Zeilen 1372–1384):

```js
  } else if (state === 'dead') {
    ctx.fillStyle = '#300c'; ctx.fillRect(0, VH / 2 - 70, VW, 170);
    text(deathMsg, VW / 2, VH / 2 - 25, 34, '#ff6b6b');
    text(lives > 0 ? `Noch ${lives} Leben` : 'Keine Leben mehr...', VW / 2, VH / 2 + 5, 16, '#fff');
    if (stateT > 0.7) {
      if (!feedback) {
        text('War diese Antwort hilfreich?', VW / 2, VH / 2 + 45, 18, '#ffd84a');
        text('←  👍        👎  →', VW / 2, VH / 2 + 78, 22, '#fff');
      } else {
        text(feedback.up ? '👍' : '👎', VW / 2, VH / 2 + 50, 26, '#fff');
        text(feedback.text, VW / 2, VH / 2 + 82, 16, '#ccc');
      }
    }
```

Level geschafft (state levelDone) (game.html, Zeilen 1385–1389):

```js
  } else if (state === 'levelDone') {
    panel(0.5);
    text('Task erfolgreich abgeschlossen ✓', VW / 2, VH / 2 - 40, 32, theme.accent);
    text(`Zeitbonus: +${ents.goal.bonus}   Score: ${score}`, VW / 2, VH / 2, 18, '#ffd84a');
    if (stateT > 1.2) text(levelIdx + 1 < LEVELS.length ? 'ENTER: nächster Task' : 'ENTER: Abschluss', VW / 2, VH / 2 + 50, 18, blinkCol());
```

Game Over (state gameover) (game.html, Zeilen 1390–1398):

```js
  } else if (state === 'gameover') {
    panel(0.75);
    text('KONTEXTFENSTER VOLL', VW / 2, VH / 2 - 60, 40, '#ff6b6b');
    text('Game Over – die Session ist abgelaufen.', VW / 2, VH / 2 - 20, 18, '#fff');
    text(`Score: ${score}   Highscore: ${highscore}`, VW / 2, VH / 2 + 15, 18, '#ffd84a');
    if (stateT > 1.2) {
      text('ENTER: Level nochmal versuchen (Score halbiert)', VW / 2, VH / 2 + 65, 17, blinkCol());
      text('ESC: zurück zum Hauptmenü', VW / 2, VH / 2 + 92, 15, '#ccc');
    }
```

---

## 9. Spielablauf-Bildschirme im Detail (Slice 4)

Aus `game.html` nachgetragen (Titel, Level-Intro, Pause, Level geschafft, Game Over, Abspann,
Highscore, Tasten). Code wörtlich, „Claude“ steht so wie im Prototyp; im neuen Spiel wird daraus
„Claudia“. Was schon in Abschnitt 7 oder 8 steht, wird hier nicht wiederholt:
`text()`, `panel()`, `blinkCol()`, `rr()`, `hash()`, `pick()`, `drawRobot()`, `drawHUD()`,
Spieler zeichnen, `hurt()`/`die()`/`respawn()`, Todessprüche und Feedback-Texte sowie die Zeichnung
von Todesbalken, „Level geschafft“ und Game Over. Hintergrund und Welt (`drawBackground()`
Zeilen 842–894, `drawTiles()` 916–965, `drawWorld()` 1129–1285) sind im neuen Code schon umgesetzt.

**Lesehilfe für Positionen:** `VW / 2 = 480`, `VH / 2 = 272`. Bei `text(str, x, y, size, color, align)`
ist `y` die Grundlinie. Ohne Angabe ist der Text um `x` zentriert, immer fett, mit Schatten `#000a`
um +2/+2 px.

**Zeitbasis:** feste Schritte von 1/60 s. `gt` ist die Gesamtspielzeit. `stateT` ist die Zeit seit
dem letzten Zustandswechsel. Beide laufen in jedem Zustand weiter, auch in der Pause.

### 9.1 Zustände

#### Alle Werte von `state`

| Wert | Bedeutung |
|---|---|
| `'title'` | Titelbild (Startwert, Zeile 302) |
| `'intro'` | Level-Intro (Levelname wird eingeblendet) |
| `'play'` | Spielen |
| `'pause'` | Pause |
| `'dead'` | Todesbalken nach dem Verlust eines Lebens |
| `'levelDone'` | Level geschafft |
| `'gameover'` | Game Over |
| `'win'` | Abspann nach dem letzten Level |

#### Übergänge

| Von → Nach | Auslöser (Taste/Bedingung) | Was dabei passiert / zurückgesetzt wird |
|---|---|---|
| Seitenstart → `title` | `toTitle()` in Zeile 1412 | `loadLevel(0)` (setzt kurz `intro`, baut Level 1 neu auf), `playMusic('jungle')`, `setState('title')` |
| `title` → `intro` | `go` = `pressed.start \|\| pressed.jump` (ENTER, Leertaste, ↑, W, Touch-Sprungknopf, Tippen auf die Zeichenfläche). Keine Wartezeit. | `newGame()`: `score = 0`, `lives = 3`, `tokens = 0`, `hasDouble = false`, `loadLevel(0)` |
| `intro` → `play` | `stateT > 2.5` (automatisch) **oder** `stateT > 0.4 && go` | nichts weiter |
| `play` → `pause` | `pressed.pause` (P oder ESC) | nichts |
| `pause` → `play` | `pressed.pause \|\| pressed.start` (P, ESC oder ENTER, Touch: Tippen auf die Zeichenfläche) | nichts. Leertaste/↑/W setzen die Pause **nicht** fort. |
| `play` → `dead` | `die()`: Treffer ohne Firewall (`hurt()`), Lava (`p.y + p.h > VH - 30` in Lava-Leveln, Meldung „Überhitzt! CPU bei 105 °C“) oder Absturz (`p.y > VH + 40`) | `lives--`, `deathMsg` (eigene Meldung oder zufällig aus `DEATH_MSGS`), `SND.hurt()`, `shake = 0.3`, `feedback = null`, `invertT = 0`, Partikel `#D97757` |
| `dead` → `play` | `lives > 0` und (Feedback gegeben und 1.6 s vergangen **oder** ohne Feedback `stateT > 3.2` **oder** `stateT > 0.7 && pressed.start` = nur ENTER bzw. Tippen) | `respawn()`: Position = letzter Checkpoint (`spawnX/spawnY`), `vx = vy = 0`, `inv = 1.5`, `shield = false`, `riding = null`, Boss-Geschosse/Schockwellen/Prompt-Schüsse gelöscht, API-Credits `rate` zurück auf 5, `banner = null`. `levelTime` läuft **weiter** (kein Reset). |
| `dead` → `gameover` | wie oben, aber `lives <= 0` | `saveHigh()`, `playMusic(null)` (Musik aus), `SND.over()` |
| `play` → `levelDone` | Spieler berührt das (entsperrte) Ziel-Terminal | `score += 500 + bonus`, `ents.goal.bonus = bonus`, `SND.win()`, Partikel |
| `levelDone` → `intro` | `stateT > 1.2 && go`, wenn es ein nächstes Level gibt | `loadLevel(levelIdx + 1)` |
| `levelDone` → `win` | `stateT > 1.2 && go` nach dem letzten Level | `saveHigh()`, `playMusic(null)`, `SND.win()` |
| `gameover` → `intro` | `stateT > 1.2 && go` (ENTER, Leertaste, ↑, W, Touch) | `lives = 3`, `score = Math.floor(score / 2)`, `loadLevel(levelIdx)` (gleiches Level von vorn) |
| `gameover` → `title` | `stateT > 1.2 && pressed.pause` (ESC **oder P**) | `toTitle()` |
| `win` → `title` | `stateT > 1.2 && go` | `toTitle()` |

Taste M (Ton an/aus) wirkt in **jedem** Zustand (Zeile 397). In den Zuständen `intro`, `dead`, `levelDone`, `win` und `title` wird P/ESC ignoriert.

Zustandsvariablen (Zeilen 301–308):

(game.html, Zeilen 301–308)

```js
// ---------------------------------------------------------------- Zustand
let state = 'title', stateT = 0, gt = 0, shake = 0;
let levelIdx = 0, L, grid, theme;
let p, cam = 0, score = 0, lives = 3, tokens = 0, levelTime = 0, deathMsg = '', hasDouble = false;
let highscore = +(localStorage.getItem('claudeJungleHigh') || 0);
let rate = { credits: 5, lock: 0, idle: 0 };   // API-Credits für die Prompt-Kanone
let invertT = 0, banner = null, feedback = null, bossPromptCd = 0;
let ents; // alle Objekte des aktuellen Levels
```

`loadLevel()`, `newGame()` und `setState()` (Zeilen 322–352). `loadLevel()` ruft am Ende `setState('intro')` auf und setzt `cam = 0` und `levelTime = 0`:

(game.html, Zeilen 322–352)

```js
function loadLevel(i) {
  levelIdx = i; L = LEVELS[i]; theme = L.theme; grid = buildGrid(L);
  ents = {
    bugs: (L.bugs || []).map(([c, r]) => ({ x: c * T + 4, y: (r + 1) * T - 18, w: 24, h: 18, vx: -60, vy: 0, alive: true, squash: 0 })),
    viruses: (L.viruses || []).map(([c, r], k) => ({ x0: c * T, y0: r * T, x: c * T, y: r * T, w: 24, h: 24, t: k * 1.7, alive: true, squash: 0 })),
    movers: [
      ...(L.movers || []).map(([c, r, len, range, speed]) => ({ x0: c * T, x: c * T, y: r * T, w: len * T, h: 12, range: range * T, speed, t: 0, dx: 0 })),
      ...(L.crumbles || []).map(([c, r, len]) => ({ crumble: true, x: c * T, y: r * T, y0: r * T, w: len * T, h: 14, dx: 0, vy: 0, timer: -1, gone: 0 })),
    ],
    tokens: [], power: (L.power || []).map(([c, r]) => ({ x: c * T + 16, y: r * T + 16, taken: false })),
    dj: (L.dj || []).map(([c, r]) => ({ x: c * T + 16, y: r * T + 16, taken: false })),
    saves: (L.saves || []).map(c => ({ x: c * T, y: 14 * T, active: false })),
    leaks: (L.leaks || []).map(([c, r], k) => ({ x: c * T + 16, y: r * T, t: 0.5 + k * 0.6, period: 1.8 + hash(k + 3) * 1.2 })),
    injectors: (L.injectors || []).map(([c, r]) => ({ x: c * T + 5, y: (r + 1) * T - 34, w: 22, h: 34, vx: -40, vy: 0, alive: true, squash: 0,
      sign: pick(INJECT_SIGNS), signT: Math.random() * 2 })),
    drops: [], particles: [], texts: [], projs: [], waves: [], shots: [], pets: [],
    goal: { x: L.goal[0] * T, y: (L.goal[1] - 1) * T, w: 48, h: 64, locked: !!L.boss },
    boss: L.boss ? { x: L.boss[0] * T, y: FLOOR - 72, w: 96, h: 72, vx: 0, vy: 0, hp: 5, maxHp: 5, inv: 0, face: -1,
                     mode: 'walk', attackT: 2.5, throwT: 0, talk: '', talkT: 0, talkCd: 3, dead: false, deadT: 0, onGround: true } : null,
  };
  rate = { credits: 5, lock: 0, idle: 0 }; invertT = 0; banner = null;
  for (const [c, r, n] of [...(L.tokens || []), ...(L.fakeTokens || [])]) for (let k = 0; k < n; k++) ents.tokens.push({ x: (c + k) * T + 16, y: r * T + 16, taken: false });
  p = { x: L.start[0] * T + 5, y: L.start[1] * T + 4, w: 22, h: 28, vx: 0, vy: 0, onGround: false, coyote: 0, jumpBuf: 0, usedDouble: false,
        face: 1, shield: false, inv: 0, riding: null, runT: 0, spawnX: L.start[0] * T + 5, spawnY: L.start[1] * T + 4 };
  cam = 0; levelTime = 0;
  playMusic(L.music);
  setState('intro');
}

function newGame() { score = 0; lives = 3; tokens = 0; hasDouble = false; loadLevel(0); }
function setState(s) { state = s; stateT = 0; }
```

Die komplette Zustandsmaschine `update()` (Zeilen 393–436). Am Ende werden alle `pressed`-Tasten gelöscht, ein Tastendruck gilt also nur für einen Schritt:

(game.html, Zeilen 393–436)

```js
function update(dt) {
  gt += dt; stateT += dt;
  shake = Math.max(0, shake - dt);
  if (banner && (banner.t -= dt) <= 0) banner = null;
  if (pressed.mute) muted = !muted;
  const go = pressed.start || pressed.jump;

  if (state === 'title') {
    cam = (gt * 60) % (L.width * T - VW);
    if (go) newGame();
  } else if (state === 'intro') {
    updateWorld(dt, false);
    if (stateT > 2.5 || (stateT > 0.4 && go)) setState('play');
  } else if (state === 'play') {
    if (pressed.pause) setState('pause');
    else { levelTime += dt; updatePlayer(dt); updateWorld(dt, true); }
  } else if (state === 'pause') {
    if (pressed.pause || pressed.start) setState('play');
  } else if (state === 'dead') {
    updateWorld(dt, false);
    // "War diese Antwort hilfreich?" – ← = 👍, → = 👎
    if (!feedback && stateT > 0.7 && (pressed.left || pressed.right)) {
      feedback = { up: !!pressed.left, text: pick(pressed.left ? FEEDBACK_UP : FEEDBACK_DOWN), t: stateT };
      SND.blip();
    }
    const done = feedback ? stateT - feedback.t > 1.6 : stateT > 3.2;
    if (done || (stateT > 0.7 && pressed.start)) {
      if (lives <= 0) { saveHigh(); playMusic(null); SND.over(); setState('gameover'); }
      else respawn();
    }
  } else if (state === 'levelDone') {
    updateWorld(dt, false);
    if (stateT > 1.2 && go) {
      if (levelIdx + 1 < LEVELS.length) loadLevel(levelIdx + 1);
      else { saveHigh(); playMusic(null); setState('win'); SND.win(); }
    }
  } else if (state === 'gameover') {
    if (stateT > 1.2 && go) { lives = 3; score = Math.floor(score / 2); loadLevel(levelIdx); }
    else if (stateT > 1.2 && pressed.pause) toTitle();
  } else if (state === 'win') {
    if (stateT > 1.2 && go) toTitle();
  }
  for (const k in pressed) delete pressed[k];
}
```

`toTitle()`, `saveHigh()` und `showBanner()` (Zeilen 438–441):

(game.html, Zeilen 438–441)

```js
function toTitle() { loadLevel(0); playMusic('jungle'); setState('title'); }
function saveHigh() { if (score > highscore) { highscore = score; localStorage.setItem('claudeJungleHigh', highscore); } }

function showBanner(text, color = '#fff', t = 2.2) { banner = { text, color, t }; }
```

Auslöser für den Tod: Lava und Absturz (Zeilen 534–535):

(game.html, Zeilen 534–535)

```js
  if (theme.lava && p.y + p.h > VH - 30) return die('Überhitzt! CPU bei 105 °C');
  if (p.y > VH + 40) return die();
```

Musik in der Pause stummschalten (Zeilen 286–289; `tickMusic` plant keine neuen Noten, solange `state === 'pause'`):

(game.html, Zeilen 286–289)

```js
function tickMusic() {
  if (!actx || actx.state !== 'running') return;
  const tr = music.track;
  if (!tr || muted || state === 'pause') { music.next = 0; return; }
```

---

### 9.2 Titelbild

**Was gezeichnet wird (in dieser Reihenfolge):**

1. **Hintergrund:** `drawBackground()` + `drawWorld()` von **Level 1** (der Titel ruft immer vorher `loadLevel(0)` auf), inkl. Bildschirmwackeln-Transform. Die Kamera fährt automatisch: `cam = (gt * 60) % (L.width * T - VW)`, also 60 px/s nach rechts. Bei Level 1 ist `L.width * T - VW = 130 * 32 - 960 = 3200`, danach springt sie zurück auf 0 (nach ≈ 53.3 s). `updateWorld` läuft im Titel **nicht**: Gegner stehen still, aber alles, was nur von `gt` abhängt, bewegt sich (Binär-Regen, Lianen, schwebende/drehende Tokens, Bug-Beine, Virus-Drehung …). Der Spieler-Roboter in der Welt wird im Titel **nicht** gezeichnet (Zeile 1267).
2. `panel(0.55)`: schwarze Abdunklung über das ganze Bild, Alpha 0.55.
3. `'CLAUDE'`: 64 px, `#D97757`, x `VW / 2` (480), y 130
4. `'im RAM-Dschungel'`: 32 px, `theme.accent` (Level 1: `#3cff9a`), x `VW / 2`, y 180
5. **Figur:** `drawRobot(VW / 2 - 33, 215 + Math.abs(Math.sin(gt * 3)) * -20, 1, gt * 300, 3)`, also Skalierung 3 (22 px Breite × 3 = 66 px, darum `- 33` zum Zentrieren), schaut nach rechts (`face = 1`). **Hüpfen:** y schwankt zwischen 215 (unten) und 195 (oben), Form `|sin|` = federnde Bögen, ein Hüpfer dauert π/3 ≈ 1.05 s. **Beine** laufen (`run = gt * 300` → Schrittphase `Math.sin(run / 7) * 2.5`). Die Augen blinken alle 3.2 s für 0.12 s. Die Antennenkugel ist gelb, oder lila, wenn `hasDouble` noch vom letzten Spiel `true` ist (wird erst bei `newGame()` zurückgesetzt).
6. `'Drücke ENTER oder LEERTASTE'`: 22 px, `blinkCol()`, y 360. **Blinken:** `gt % 1 < 0.6` → `#fff`, sonst `#fff6`: 0.6 s voll weiß, 0.4 s halbtransparent, Takt 1 s.
7. `'← → / A D : laufen     ↑ / W / Leertaste : springen'`: 15 px, `#ccc`, y 410
8. `'X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus'`: 15 px, `#ccc`, y 435
9. `'Hilf Claude, sich durch den Speicher zum OUTPUT zu kämpfen!'`: 15 px, `#ffd84a`, y 480
10. Nur wenn `highscore` ungleich 0: `` `Highscore: ${highscore}` ``, 14 px, `#fff9`, y 515

Kein HUD auf dem Titelbild (`return` vor `drawHUD()`).

**Tasten zum Starten:** `go = pressed.start || pressed.jump`, also ENTER, Leertaste, ↑, W. Auf Touch-Geräten der Sprungknopf ⤒ oder Tippen auf die Zeichenfläche. Keine Eingabesperre. Der erste Tastendruck startet auch das Audio (`initAudio()` im keydown-Handler). Erst ab da ist die Titelmusik `jungle` hörbar.

**Was beim Start passiert:** `newGame()`: `score = 0`, `lives = 3`, `tokens = 0`, `hasDouble = false`, dann `loadLevel(0)`: `levelIdx = 0`, Level/Gegner/Tokens neu, neuer Spieler `p` (ohne Firewall, ohne Unverwundbarkeit, Start-Position), `rate` (5 API-Credits), `invertT = 0`, `banner = null`, `cam = 0`, `levelTime = 0`, Musik des Levels, Zustand `intro`. `highscore` bleibt.

Titel-Logik in `update()` (Zeilen 400–402):

(game.html, Zeilen 400–402)

```js
  if (state === 'title') {
    cam = (gt * 60) % (L.width * T - VW);
    if (go) newGame();
```

`newGame()` (Zeile 351) und `toTitle()` (Zeile 438):

(game.html, Zeile 351)

```js
function newGame() { score = 0; lives = 3; tokens = 0; hasDouble = false; loadLevel(0); }
```

(game.html, Zeile 438)

```js
function toTitle() { loadLevel(0); playMusic('jungle'); setState('title'); }
```

Anfang von `render()`: Hintergrund und Welt mit Wackeln, dann das Titelbild (Zeilen 1342–1359):

(game.html, Zeilen 1342–1359)

```js
function render() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 12 * shake / 0.3, (Math.random() - 0.5) * 12 * shake / 0.3);
  drawBackground();
  drawWorld();
  ctx.restore();
  if (state === 'title') {
    panel(0.55);
    text('CLAUDE', VW / 2, 130, 64, '#D97757');
    text('im RAM-Dschungel', VW / 2, 180, 32, theme.accent);
    drawRobot(VW / 2 - 33, 215 + Math.abs(Math.sin(gt * 3)) * -20, 1, gt * 300, 3);
    text('Drücke ENTER oder LEERTASTE', VW / 2, 360, 22, blinkCol());
    text('← → / A D : laufen     ↑ / W / Leertaste : springen', VW / 2, 410, 15, '#ccc');
    text('X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus', VW / 2, 435, 15, '#ccc');
    text('Hilf Claude, sich durch den Speicher zum OUTPUT zu kämpfen!', VW / 2, 480, 15, '#ffd84a');
    if (highscore) text(`Highscore: ${highscore}`, VW / 2, 515, 14, '#fff9');
    return;
  }
```

---

### 9.3 Level-Intro

- **Dauer:** 2.5 s automatisch (`stateT > 2.5`).
- **Überspringen:** ja, ab `stateT > 0.4` mit `go` (ENTER, Leertaste, ↑, W, Touch). Weil `pressed` nach jedem Schritt geleert wird, löst die Taste zum Überspringen **keinen** Sprung im Spiel aus.
- **Ein- und Ausblenden:** `a = Math.min(1, stateT * 3, (2.5 - stateT) * 3)` als `globalAlpha`. Das heißt 0.33 s einblenden, voll sichtbar bis 2.17 s, dann 0.33 s ausblenden. Beim Überspringen verschwindet das Intro sofort, ohne Ausblenden.
- **Halbtransparente Ebene:** ja, nur ein Balken, kein Vollbild-Panel: `#000b` (schwarz, Alpha ≈ 0.73), volle Breite, `y = VH / 2 - 70` (202), Höhe 120. Er wird zusätzlich mit `a` ausgeblendet.
- **Texte:**
  - `L.name` (z. B. `'Level 1: RAM-Dschungel'`): 34 px, x `VW / 2`, y `VH / 2 - 15` (257), Farbe `theme.accent`, im Boss-Level `#ff4f6a`
  - `L.sub` (z. B. `'Spring auf Bugs, um sie zu fixen. Sammle Tokens!'`): 17 px, `#fff`, y `VH / 2 + 25` (297)
- **HUD** wird gezeichnet (unter dem Balken).
- **Welt läuft weiter:** ja, `updateWorld(dt, false)`. Gegner laufen, Plattformen fahren, Partikel und Texte laufen weiter, aber ohne Kollision mit Claude (`interactive = false`). Der Boss steht still (`b.vx = 0`). Die Kamera folgt dem Spieler (Zeilen 697–702).
- **Claude bewegt sich nicht:** `updatePlayer()` wird nur in `play` aufgerufen. Der Roboter wird an der Startposition gezeichnet, ohne Laufanimation.
- **Level-Zeit:** läuft **nicht** (`levelTime += dt` nur in `play`). Sie wurde in `loadLevel()` auf 0 gesetzt.
- Pause ist im Intro nicht möglich.

Intro-Logik (Zeilen 403–405):

(game.html, Zeilen 403–405)

```js
  } else if (state === 'intro') {
    updateWorld(dt, false);
    if (stateT > 2.5 || (stateT > 0.4 && go)) setState('play');
```

Intro-Zeichnung (Zeilen 1360–1367):

(game.html, Zeilen 1360–1367)

```js
  drawHUD();
  if (state === 'intro') {
    const a = Math.min(1, stateT * 3, (2.5 - stateT) * 3);
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = '#000b'; ctx.fillRect(0, VH / 2 - 70, VW, 120);
    text(L.name, VW / 2, VH / 2 - 15, 34, ents.boss ? '#ff4f6a' : theme.accent);
    text(L.sub, VW / 2, VH / 2 + 25, 17, '#fff');
    ctx.globalAlpha = 1;
```

Kamera in `updateWorld()` (Zeilen 697–702):

(game.html, Zeilen 697–702)

```js
  // Kamera
  if (state !== 'title') {
    const target = p.x + p.w / 2 - VW / 2 + p.face * 60;
    cam += (target - cam) * Math.min(1, dt * 5);
    cam = Math.max(0, Math.min(cam, L.width * T - VW));
  }
```

Boss steht still, wenn nicht interaktiv (Zeilen 816–818):

(game.html, Zeilen 816–818)

```js
  } else {
    b.vx = 0;
  }
```

Level-Namen und Untertitel (Zeilen 44–45, 61–62, 79–80, 100–101, 120–121):

(game.html, Zeilen 44–45)

```js
    name: 'Level 1: RAM-Dschungel',
    sub: 'Spring auf Bugs, um sie zu fixen. Sammle Tokens!',
```

(game.html, Zeilen 61–62)

```js
    name: 'Level 2: Cache-Canyon',
    sub: 'Reite auf den Datenbussen über den Canyon!',
```

(game.html, Zeilen 79–80)

```js
    name: 'Level 3: Festplatten-Höhle',
    sub: 'Vorsicht: Memory Leaks tropfen von der Decke!',
```

(game.html, Zeilen 100–101)

```js
    name: 'Level 4: CPU-Vulkan',
    sub: 'Überhitzte Register zerbröseln unter dir. Nicht trödeln!',
```

(game.html, Zeilen 120–121)

```js
    name: 'Level 5: Legacy-Code',
    sub: 'BOSS: LEGACY_BUG.exe – seit 1998 ungetestet. Spring ihm auf den Kopf!',
```

---

### 9.4 Pause

- **Pausieren:** P oder ESC (beide auf `'pause'` gelegt), **nur im Zustand `play`**.
- **Weiter:** P, ESC oder ENTER (`pressed.pause || pressed.start`). Auf Touch-Geräten: Tippen auf die Zeichenfläche setzt `pressed.start` und setzt die Pause fort. Es gibt aber **keinen** Touch-Knopf zum Pausieren.
- **Andere Tasten in der Pause:** M (Ton an/aus) funktioniert. ESC macht dasselbe wie P. Alles andere wird ignoriert.
- **Was steht still:** Spieler, Welt, Gegner, Partikel, Kamera, `levelTime`, `invertT` (Prompt-Injection-Timer) und die API-Credits. Das liegt daran, dass `updatePlayer`/`updateWorld` nicht laufen.
- **Was läuft weiter:** `gt` und `stateT` (darum bewegen sich alle `gt`-Animationen in der Zeichnung weiter, z. B. Binär-Regen, Token-Drehen, Lianen, Blinken). Außerdem laufen der Banner-Timer (`banner.t`, Zeile 396) und das Abklingen von `shake` (Zeile 395) weiter. Die **Musik** stoppt (`tickMusic` plant keine Noten, `music.next = 0`). Bereits geplante Noten (bis 0.15 s) klingen noch aus.
- **Zeichnung:** Welt und HUD, darüber `panel(0.6)` (Vollbild schwarz, Alpha 0.6), dann
  - `'PAUSE'`: 48 px, `#fff`, x `VW / 2`, y `VH / 2 - 10` (262)
  - `'Claude denkt nach... (P zum Weiterspielen)'`: 16 px, `#ccc`, y `VH / 2 + 30` (302)
- **Automatisch bei Tab-Wechsel:** **nein.** Es gibt keinen `visibilitychange`-, `blur`- oder `focus`-Handler. Im Hintergrund-Tab pausiert der Browser `requestAnimationFrame`, das Spiel friert also faktisch ein, steht danach aber weiter im Zustand `play`. Beim Zurückkehren wird der Zeitsprung auf 0.25 s gekappt (`Math.min(0.25, …)`), also höchstens 15 Simulationsschritte Nachholen. Gedrückt gehaltene Tasten (`held`) können „hängen“, wenn sie während des Tab-Wechsels losgelassen wurden, weil dann kein `keyup` ankommt.

Pause-Logik (Zeilen 406–410):

(game.html, Zeilen 406–410)

```js
  } else if (state === 'play') {
    if (pressed.pause) setState('pause');
    else { levelTime += dt; updatePlayer(dt); updateWorld(dt, true); }
  } else if (state === 'pause') {
    if (pressed.pause || pressed.start) setState('play');
```

Pause-Zeichnung (Zeilen 1368–1371):

(game.html, Zeilen 1368–1371)

```js
  } else if (state === 'pause') {
    panel(0.6);
    text('PAUSE', VW / 2, VH / 2 - 10, 48, '#fff');
    text('Claude denkt nach... (P zum Weiterspielen)', VW / 2, VH / 2 + 30, 16, '#ccc');
```

Hauptschleife mit der 0.25-s-Kappung (Zeilen 1411–1421):

(game.html, Zeilen 1411–1421)

```js
// ---------------------------------------------------------------- Loop
toTitle();
let last = performance.now(), acc = 0;
function frame(now) {
  acc += Math.min(0.25, (now - last) / 1000); last = now;
  while (acc >= STEP) { update(STEP); acc -= STEP; }
  tickMusic();
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

---

### 9.5 Level geschafft

- **Auslöser:** im Zustand `play`, wenn das Ziel **nicht gesperrt** ist (`!ents.goal.locked`) und der Spieler die Zone `{ x: goal.x, y: goal.y - 160, w: 48, h: 224 }` berührt. Die Zone ist absichtlich hoch, damit es auch im Sprung zählt. Das Ziel steht bei `goal.x = L.goal[0] * T`, `goal.y = (L.goal[1] - 1) * T`. Im Boss-Level ist das Ziel gesperrt (`locked: !!L.boss`), bis der Boss besiegt ist und dann 1.8 s vergangen sind.
- **Punkte:** `score += 500 + bonus`. Zeitbonus: `bonus = Math.max(0, Math.floor((240 - levelTime) * 5))`, also 5 Punkte pro Sekunde unter 240 s, abgerundet, nie negativ. Ab 240 s gibt es 0 Bonus.
- **levelTime:** wird in `loadLevel()` auf 0 gesetzt (Levelstart, Level nochmal nach Game Over). Sie zählt nur im Zustand `play` hoch, also nicht im Intro, in der Pause, im Todesbalken oder in „Level geschafft“. Beim Respawn nach einem Tod wird sie **nicht** zurückgesetzt.
- **Sound/Effekt:** `SND.win()` und 40 Partikel in `theme.accent`. Das Terminal zeigt jetzt `'✓'` statt `'>_'`.
- **Welt** läuft weiter (`updateWorld(dt, false)`), Claude steht still, Kollisionen sind aus.
- **Zeichnung:** Welt und HUD, darüber `panel(0.5)`, dann
  - `'Task erfolgreich abgeschlossen ✓'`: 32 px, `theme.accent`, y `VH / 2 - 40` (232)
  - `` `Zeitbonus: +${ents.goal.bonus}   Score: ${score}` ``: 18 px, `#ffd84a`, y `VH / 2` (272). Der Score enthält schon die 500 und den Bonus.
  - erst ab `stateT > 1.2`: `'ENTER: nächster Task'` bzw. nach dem letzten Level `'ENTER: Abschluss'`, 18 px, `blinkCol()`, y `VH / 2 + 50` (322)
- **Eingabesperre:** 1.2 s (`stateT > 1.2`).
- **Tasten weiter:** `go`, also ENTER, Leertaste, ↑, W (Touch: Sprungknopf, Tippen).
- **Nach dem letzten Level** (`levelIdx + 1 >= LEVELS.length`, also nach Level 5): `saveHigh()`, Musik aus, Zustand `win`, `SND.win()` (der Sieg-Jingle erklingt damit ein zweites Mal).
- **Beim Wechsel ins nächste Level** (`loadLevel(levelIdx + 1)`):
  - **übernommen:** `lives`, `score`, `tokens` (Zähler läuft weiter, auch für 1UP alle 100), `hasDouble` (Doppelsprung bleibt), `highscore`, `muted`
  - **zurückgesetzt:** Spieler `p` wird neu erzeugt: Firewall (`shield`) **weg**, `inv = 0`, Start-Position, Checkpoint = Start, Blick nach rechts. Ebenfalls zurückgesetzt: alle Objekte (`ents`), API-Credits (`rate`), `invertT`, `banner`, `cam = 0`, `levelTime = 0`. Die Musik wechselt zum Level-Track, der Zustand wird `intro`.

Ziel-Erkennung in `updatePlayer()` (Zeilen 570–576):

(game.html, Zeilen 570–576)

```js
  // Ziel (hohe Trefferzone, damit es auch im Sprung zählt)
  if (!ents.goal.locked && overlap(p, { x: ents.goal.x, y: ents.goal.y - 160, w: 48, h: 224 })) {
    const bonus = Math.max(0, Math.floor((240 - levelTime) * 5));
    score += 500 + bonus; ents.goal.bonus = bonus;
    SND.win(); burst(ents.goal.x + 24, ents.goal.y + 20, theme.accent, 40, 300);
    setState('levelDone');
  }
```

Ziel-Objekt in `loadLevel()` (Zeile 338):

(game.html, Zeile 338)

```js
    goal: { x: L.goal[0] * T, y: (L.goal[1] - 1) * T, w: 48, h: 64, locked: !!L.boss },
```

Ziel wird nach dem Boss entsperrt (Zeilen 737–740):

(game.html, Zeilen 737–740)

```js
    if (b.deadT > 1.8 && ents.goal.locked) {
      ents.goal.locked = false; SND.power();
      say(VW / 2 - 140, 200, 'Legacy-Code refactored! Ab zum OUTPUT!', '#9aff9a');
    }
```

Logik in `update()` (Zeilen 423–428):

(game.html, Zeilen 423–428)

```js
  } else if (state === 'levelDone') {
    updateWorld(dt, false);
    if (stateT > 1.2 && go) {
      if (levelIdx + 1 < LEVELS.length) loadLevel(levelIdx + 1);
      else { saveHigh(); playMusic(null); setState('win'); SND.win(); }
    }
```

`levelTime` zählt nur in `play` (Zeilen 406–408):

(game.html, Zeilen 406–408)

```js
  } else if (state === 'play') {
    if (pressed.pause) setState('pause');
    else { levelTime += dt; updatePlayer(dt); updateWorld(dt, true); }
```

Ziel-Terminal mit `'✓'` (Zeilen 1155–1167):

(game.html, Zeilen 1155–1167)

```js
  // Ziel-Terminal
  const gl = ents.goal;
  if (!gl.locked) {
    ctx.save();
    ctx.shadowColor = theme.accent; ctx.shadowBlur = 20 + Math.sin(gt * 4) * 8;
    ctx.fillStyle = '#222'; rr(gl.x, gl.y, 48, 40, 5); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#071a10'; ctx.fillRect(gl.x + 5, gl.y + 5, 38, 28);
    ctx.fillStyle = theme.accent; ctx.font = `bold 14px ${FONT}`;
    ctx.fillText(state === 'levelDone' ? '✓' : (gt % 1 < 0.5 ? '>_' : '>'), gl.x + 10, gl.y + 24);
    ctx.fillStyle = '#333'; ctx.fillRect(gl.x + 20, gl.y + 40, 8, 14); ctx.fillRect(gl.x + 10, gl.y + 54, 28, 10);
    ctx.fillStyle = theme.accent; ctx.font = `bold 10px ${FONT}`; ctx.fillText('OUTPUT', gl.x + 6, gl.y - 6);
  }
```

---

### 9.6 Game Over

- **Auslöser:** Todesbalken endet mit `lives <= 0` (siehe 9.1). Genau **dabei** wird `saveHigh()` aufgerufen. Der Highscore wird also mit dem **vollen** Score verglichen, bevor halbiert wird. Danach: Musik aus, `SND.over()`.
- **Welt** steht still (`updateWorld` wird nicht aufgerufen). Nur `gt`-Animationen laufen weiter. Der Roboter wird an seiner letzten Position gezeichnet (der Zustand ist nicht `dead`). Bei einem Absturz liegt diese Position außerhalb des Bildes.
- **Zeichnung:** Welt und HUD, darüber `panel(0.75)`, dann
  - `'KONTEXTFENSTER VOLL'`: 40 px, `#ff6b6b`, y `VH / 2 - 60` (212)
  - `'Game Over – die Session ist abgelaufen.'`: 18 px, `#fff`, y `VH / 2 - 20` (252)
  - `` `Score: ${score}   Highscore: ${highscore}` ``: 18 px, `#ffd84a`, y `VH / 2 + 15` (287). Hier steht der noch **nicht** halbierte Score.
  - erst ab `stateT > 1.2`:
    - `'ENTER: Level nochmal versuchen (Score halbiert)'`: 17 px, `blinkCol()`, y `VH / 2 + 65` (337)
    - `'ESC: zurück zum Hauptmenü'`: 15 px, `#ccc`, y `VH / 2 + 92` (364)
- **Eingabesperre:** 1.2 s.
- **Tasten:**
  - ENTER, Leertaste, ↑, W (`go`, Touch: Sprungknopf/Tippen) → **Level nochmal**
  - ESC **und P** (`pressed.pause`) → **Hauptmenü**. Der Text nennt nur ESC.
- **„Level nochmal“:** `lives = 3`, `score = Math.floor(score / 2)` (**abgerundet**, z. B. 1235 → 617), dann `loadLevel(levelIdx)`: **dasselbe** Level von vorn (Checkpoints verfallen, alle Tokens/Gegner neu, `levelTime = 0`, Firewall weg, Intro wird erneut gezeigt).
  - **bleibt:** `tokens` (der Zähler wird **nicht** zurückgesetzt), `hasDouble`, `highscore`, `levelIdx`. Ein erneutes Halbieren beim nächsten Game Over ist möglich.
- **„Hauptmenü“:** `toTitle()`: `loadLevel(0)`, `playMusic('jungle')`, Zustand `title`. `score`, `lives`, `tokens` und `hasDouble` werden dabei **nicht** zurückgesetzt. Das passiert erst beim Start über `newGame()`. Sichtbar ist das nur an der Antennenfarbe der Titel-Figur.

Übergang `dead` → `gameover` (Zeilen 419–421):

(game.html, Zeilen 419–421)

```js
    if (done || (stateT > 0.7 && pressed.start)) {
      if (lives <= 0) { saveHigh(); playMusic(null); SND.over(); setState('gameover'); }
      else respawn();
```

Game-Over-Logik (Zeilen 429–431):

(game.html, Zeilen 429–431)

```js
  } else if (state === 'gameover') {
    if (stateT > 1.2 && go) { lives = 3; score = Math.floor(score / 2); loadLevel(levelIdx); }
    else if (stateT > 1.2 && pressed.pause) toTitle();
```

---

### 9.7 Abspann (Zustand `win`)

- **Auslöser:** „Level geschafft“ im letzten Level (Level 5, Boss) + `go`. Vorher: `saveHigh()`, Musik aus, `SND.win()`.
- **Hintergrund:** Welt von Level 5 (still, nur `gt`-Animationen) und HUD, darüber `panel(0.7)`. `theme.accent` ist hier der von Level 5: `#9aff9a`.
- **Texte:**
  - `'ALLE TASKS ERLEDIGT! 🎉'`: 40 px, `theme.accent`, x `VW / 2`, y 150
  - Figur: `drawRobot(VW / 2 - 33, 190 - Math.abs(Math.sin(gt * 5)) * 30, 1, gt * 300, 3)`. Skalierung 3, Blick nach rechts, laufende Beine. Sie hüpft zwischen y 190 und 160, ein Hüpfer dauert π/5 ≈ 0.63 s (schneller und höher als auf dem Titelbild).
  - `'Legacy-Code besiegt. Der Nutzer ist begeistert.'`: 17 px, `#fff`, y 330
  - `'Claude hat sich einen Keks verdient. 🍪'`: 17 px, `#fff`, y 355
  - `` `Endstand: ${score}  (${tokens} Tokens)` ``: 22 px, `#ffd84a`, y 395 (zwei Leerzeichen vor der Klammer)
  - `'NEUER HIGHSCORE!'`: 20 px, `#ff9de2`, y 430. Er erscheint, wenn `score >= highscore`. Weil `saveHigh()` vorher schon gelaufen ist, gilt das bei neuem Rekord **und** bei exaktem Gleichstand mit dem alten Rekord. Es blinkt nicht.
  - erst ab `stateT > 1.2`: `'ENTER: nochmal spielen'`, 18 px, `blinkCol()`, y 480
- **Tasten:** `go` (ENTER, Leertaste, ↑, W, Touch) nach 1.2 s → `toTitle()`. Man landet also auf dem **Titelbild**, nicht direkt in einem neuen Spiel. P/ESC tun nichts.

Logik (Zeilen 427 und 432–433):

(game.html, Zeile 427)

```js
      else { saveHigh(); playMusic(null); setState('win'); SND.win(); }
```

(game.html, Zeilen 432–433)

```js
  } else if (state === 'win') {
    if (stateT > 1.2 && go) toTitle();
```

Zeichnung (Zeilen 1399–1408):

(game.html, Zeilen 1399–1408)

```js
  } else if (state === 'win') {
    panel(0.7);
    text('ALLE TASKS ERLEDIGT! 🎉', VW / 2, 150, 40, theme.accent);
    drawRobot(VW / 2 - 33, 190 - Math.abs(Math.sin(gt * 5)) * 30, 1, gt * 300, 3);
    text('Legacy-Code besiegt. Der Nutzer ist begeistert.', VW / 2, 330, 17, '#fff');
    text('Claude hat sich einen Keks verdient. 🍪', VW / 2, 355, 17, '#fff');
    text(`Endstand: ${score}  (${tokens} Tokens)`, VW / 2, 395, 22, '#ffd84a');
    if (score >= highscore) text('NEUER HIGHSCORE!', VW / 2, 430, 20, '#ff9de2');
    if (stateT > 1.2) text('ENTER: nochmal spielen', VW / 2, 480, 18, blinkCol());
  }
```

---

### 9.8 Highscore & Speicher

- **localStorage-Schlüssel:** `'claudeJungleHigh'` (genau so geschrieben)
- **Lesen:** einmal beim Laden der Seite (Zeile 305), `+(… || 0)` → Zahl, 0 wenn nicht vorhanden.
- **Schreiben:** nur in `saveHigh()`, und nur wenn `score > highscore`. Dann wird zuerst die Variable `highscore` gesetzt und danach `localStorage.setItem`. `saveHigh()` wird an genau zwei Stellen aufgerufen:
  1. beim Übergang `dead` → `gameover` (Zeile 420)
  2. nach dem letzten Level beim Übergang `levelDone` → `win` (Zeile 427)

  Beim Verlassen der Seite mitten im Spiel, in der Pause oder bei „Level geschafft“ in Level 1–4 wird **nicht** gespeichert.
- **Anzeige:** Titelbild (nur wenn ungleich 0), Game Over, Abspann („NEUER HIGHSCORE!“).
- **Wenn localStorage blockiert ist:** Es gibt **kein** `try/catch` darum. Das folgende Verhalten habe ich aus dem Code abgeleitet und nicht im Browser getestet:
  - Wirft schon `localStorage.getItem` (z. B. `SecurityError` bei blockierten Cookies/Speicher), bricht das ganze Skript in Zeile 305 ab, bevor die Spielschleife startet. Die Zeichenfläche bleibt leer und das Spiel startet nicht.
  - Wirft nur `setItem` (z. B. Speicher voll), fliegt der Fehler mitten in `update()`. `highscore` ist dann im Speicher schon gesetzt, aber `setState('gameover')` bzw. `setState('win')` wird nicht mehr erreicht. Weil der Fehler in `frame()` vor `requestAnimationFrame(frame)` auftritt, **friert das Spiel ein**.

(game.html, Zeile 305)

```js
let highscore = +(localStorage.getItem('claudeJungleHigh') || 0);
```

(game.html, Zeile 439)

```js
function saveHigh() { if (score > highscore) { highscore = score; localStorage.setItem('claudeJungleHigh', highscore); } }
```

---

---

### 9.9 Tastenzuordnung insgesamt

| Taste | Aktion (`KEYMAP`) |
|---|---|
| ← / A | `left` (im Todesbalken: 👍) |
| → / D | `right` (im Todesbalken: 👎) |
| Leertaste / ↑ / W | `jump` (zählt auch als `go`) |
| ENTER | `start` (zählt als `go`, setzt Pause fort, beendet Todesbalken nach 0.7 s) |
| P / ESC | `pause` (Pause an/aus, im Game Over: Hauptmenü) |
| M | `mute` (Musik & Ton an/aus, in jedem Zustand) |
| X / F | `shoot` (Prompt abfeuern) |

- `keydown`: nur für zugeordnete Tasten. Dabei `preventDefault()` (die Seite scrollt nicht), `initAudio()`, und `pressed[k]` nur beim **ersten** Drücken. Auto-Repeat löst also nichts erneut aus.
- `keyup`: setzt `held[k] = false`.
- Touch (nur wenn `'ontouchstart' in window`): Knöpfe ◀ ▶ 💬 ⤒ (`left`, `right`, `shoot`, `jump`). Tippen auf die Zeichenfläche = `start`. Es gibt keinen Touch-Knopf für Pause und Ton.
- `pressed` wird am Ende jedes `update()`-Schritts geleert (Zeile 435).

Touch-Knöpfe im HTML (Zeilen 19–22):

(game.html, Zeilen 19–22)

```js
<div id="touch">
  <div class="grp"><button data-k="left">◀</button><button data-k="right">▶</button></div>
  <div class="grp"><button data-k="shoot">💬</button><button data-k="jump">⤒</button></div>
</div>
```

Eingabe (Zeilen 153–173):

(game.html, Zeilen 153–173)

```js
// ---------------------------------------------------------------- Input
const held = {}, pressed = {};
const KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', Enter: 'start', KeyP: 'pause', Escape: 'pause', KeyM: 'mute',
  KeyX: 'shoot', KeyF: 'shoot' };
addEventListener('keydown', e => {
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault(); initAudio();
  if (!held[k]) pressed[k] = true;
  held[k] = true;
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) held[k] = false; });
if ('ontouchstart' in window) {
  document.getElementById('touch').style.display = 'flex';
  document.querySelectorAll('#touch button').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('touchstart', e => { e.preventDefault(); initAudio(); if (!held[k]) pressed[k] = true; held[k] = true; });
    b.addEventListener('touchend', e => { e.preventDefault(); held[k] = false; });
  });
  canvas.addEventListener('touchstart', () => { initAudio(); pressed.start = true; });
}
```

Ton an/aus und `go` in `update()` (Zeilen 397–398):

(game.html, Zeilen 397–398)

```js
  if (pressed.mute) muted = !muted;
  const go = pressed.start || pressed.jump;
```

---

### 9.10 Alle Stellen mit „Claude“ in game.html

Groß-/Kleinschreibung genau „Claude“:

| Zeile | Stelle |
|---|---|
| 6 | `<title>Claude im RAM-Dschungel</title>` (Browser-Tab-Titel) |
| 132 | `DEATH_MSGS`: `'404: Claude nicht gefunden'` (sichtbarer Text) |
| 147 | `FEEDBACK_UP`: `'Danke für dein Feedback! Claude ist trotzdem kaputt.'` (sichtbarer Text) |
| 789 | Kommentar: `// Kontakt mit Claude` |
| 793 | Kommentar: `// Claude über den Boss setzen, sonst zählt der nächste Frame als seitlicher Treffer` |
| 812 | Kommentar: `// Rückstoß, damit Claude (z. B. mit Firewall) nicht im Boss hängen bleibt` |
| 1356 | Titelbild: `'Hilf Claude, sich durch den Speicher zum OUTPUT zu kämpfen!'` |
| 1371 | Pause: `'Claude denkt nach... (P zum Weiterspielen)'` |
| 1404 | Abspann: `'Claude hat sich einen Keks verdient. 🍪'` |

In anderer Schreibweise:

| Zeile | Stelle |
|---|---|
| 25 | Kommentar: `//  CLAUDE IM RAM-DSCHUNGEL – ein kleines Jump & Run` |
| 305 | localStorage-Schlüssel `'claudeJungleHigh'` (lesen) |
| 439 | localStorage-Schlüssel `'claudeJungleHigh'` (schreiben) |
| 1350 | Titelbild: `'CLAUDE'` (große Überschrift) |

---

## 10. Ton und Musik im Detail (Slice 5)

Aus `game.html` nachgetragen (Ton, Musik, Stummschalten). Code wörtlich, „Claude“ steht so wie im
Prototyp. Zeilennummern beziehen sich auf `game.html`.

Alle Code-Ausschnitte sind wörtlich aus `game.html` kopiert (automatisch per Zeilenbereich, nicht abgetippt). Der ganze Ton wird zur Laufzeit mit der **Web Audio API** erzeugt. Es gibt **keine** Audiodateien.

Überblick über den Audio-Teil (Zeilen 175–299):

- `actx`, `muted`, `noiseBuf`: globale Variablen (Zeile 176)
- `initAudio()`: AudioContext anlegen/fortsetzen (Zeilen 177–180)
- `tone()`: Baustein für alle Geräusche (Zeilen 181–192)
- `SND`: alle Geräusche (Zeilen 193–216)
- `TRACKS`: alle Musikspuren (Zeilen 218–242)
- `noteFreq()` und das Vorberechnen der Notenlisten (Zeilen 243–253)
- `music`, `playMusic()`, `noteAt()`, `drumAt()`, `tickMusic()` (Zeilen 254–299)

---

### 10.1 Audio-Start

#### `initAudio()` komplett

(game.html, Zeilen 175–180)

```js
// ---------------------------------------------------------------- Sound
let actx = null, muted = false, noiseBuf = null;
function initAudio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (actx && actx.state === 'suspended') actx.resume();
}
```

- **AudioContext:** wird beim ersten Aufruf **einmal** erzeugt (`window.AudioContext` oder für ältere Safari-Versionen `window.webkitAudioContext`). Schlägt das fehl, wird der Fehler still verschluckt (`catch (e) {}`). `actx` bleibt dann `null` und das Spiel bleibt einfach stumm, ohne Fehlermeldung.
- **Fortsetzen:** Bei jedem Aufruf gilt: Ist der Context `'suspended'` (Autoplay-Sperre des Browsers), wird `actx.resume()` aufgerufen. Das Promise wird nicht abgewartet.
- **Master-Lautstärke / Gain-Knoten / Kompressor:** **gibt es nicht.** Jede Note und jedes Geräusch erzeugt eigene Knoten (Oszillator → Gain bzw. Rauschen → Filter → Gain) und hängt sie **direkt** an `actx.destination`. Es gibt keinen gemeinsamen Lautstärkeregler, keinen Kompressor/Limiter und keine Trennung von Musik- und Geräusch-Lautstärke.

#### Wann `initAudio()` aufgerufen wird

| Stelle | Zeile | Bedingung |
|---|---|---|
| `keydown` | 160 | Nur bei Tasten aus `KEYMAP` (Pfeiltasten, A, D, W, Leertaste, ENTER, P, ESC, M, X, F). Bei anderen Tasten bricht der Handler vorher ab (`if (!k) return;`). |
| Touch-Knöpfe ◀ ▶ 💬 ⤒ | 169 | `touchstart` auf einem Knopf (nur auf Touch-Geräten) |
| Tippen auf die Zeichenfläche | 172 | `touchstart` auf dem Canvas (nur auf Touch-Geräten) |

Ein **Mausklick** startet das Audio **nicht** (es gibt keinen `click`/`mousedown`-Handler). Auch `keyup` ruft `initAudio()` nicht auf.

(game.html, Zeilen 158–173)

```js
addEventListener('keydown', e => {
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault(); initAudio();
  if (!held[k]) pressed[k] = true;
  held[k] = true;
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) held[k] = false; });
if ('ontouchstart' in window) {
  document.getElementById('touch').style.display = 'flex';
  document.querySelectorAll('#touch button').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('touchstart', e => { e.preventDefault(); initAudio(); if (!held[k]) pressed[k] = true; held[k] = true; });
    b.addEventListener('touchend', e => { e.preventDefault(); held[k] = false; });
  });
  canvas.addEventListener('touchstart', () => { initAudio(); pressed.start = true; });
}
```

Die Musik-Planung prüft zusätzlich bei jedem Bild, ob der Context läuft (Zeile 287). `tone()` prüft nur auf `!actx`, also nicht auf `'running'`. Geräusche werden darum auch an einen noch pausierten Context geschickt, sind dort aber stumm.

---

### 10.2 Geräusche

#### Baustein `tone()` wörtlich

(game.html, Zeilen 181–192)

```js
function tone(f1, f2, dur, type = 'square', vol = 0.07, delay = 0) {
  if (muted || !actx) return;
  const t0 = actx.currentTime + delay;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f1, t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(actx.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
```

So funktioniert ein Ton:

- **Parameter:** `f1` (Startfrequenz Hz), `f2` (Endfrequenz Hz), `dur` (Dauer s), `type` (Wellenform, Standard `'square'`), `vol` (Lautstärke, Standard `0.07`), `delay` (Verzögerung s, Standard `0`).
- **Stummschaltung:** Wenn `muted` gesetzt oder kein `actx` vorhanden ist, passiert nichts.
- **Tonhöhe:** springt auf `f1` und gleitet **exponentiell** auf `f2` (mindestens 20 Hz) über `dur`. Bei `f1 === f2` bleibt die Tonhöhe konstant.
- **Hüllkurve:** **kein Attack**. Die Lautstärke springt sofort auf `vol` (`setValueAtTime`) und fällt dann exponentiell auf 0.0001 über `dur` ab. Es klingt also wie ein Anschlag mit Ausklingen. Der harte Einsatz kann leise knacken.
- **Ende:** Der Oszillator stoppt `dur + 0.02` s nach dem Start.
- **Kette:** Oszillator → Gain → `actx.destination`.
- Mehrere Töne mit `delay` ergeben kleine Melodien (Arpeggios).

#### `SND`-Objekt komplett wörtlich

(game.html, Zeilen 193–216)

```js
const SND = {
  jump: () => tone(320, 640, 0.12, 'square', 0.05),
  djump: () => { tone(500, 1100, 0.14, 'triangle', 0.07); tone(750, 1500, 0.1, 'square', 0.03, 0.04); },
  coin: () => { tone(988, 988, 0.05, 'square', 0.04); tone(1319, 1319, 0.12, 'square', 0.04, 0.05); },
  stomp: () => tone(500, 60, 0.18, 'square', 0.07),
  hurt: () => tone(300, 40, 0.5, 'sawtooth', 0.07),
  shield: () => tone(200, 900, 0.25, 'triangle', 0.08),
  power: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.1, 'square', 0.05, i * 0.07)),
  save: () => [660, 880].forEach((f, i) => tone(f, f, 0.1, 'triangle', 0.07, i * 0.1)),
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, f, 0.14, 'square', 0.05, i * 0.11)),
  over: () => [392, 330, 262, 196].forEach((f, i) => tone(f, f * 0.98, 0.22, 'triangle', 0.08, i * 0.2)),
  oneup: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, f, 0.08, 'square', 0.05, i * 0.06)),
  crumble: () => tone(180, 60, 0.25, 'sawtooth', 0.03),
  thud: () => { tone(120, 30, 0.35, 'sine', 0.2); tone(80, 30, 0.3, 'square', 0.05); },
  throw: () => tone(700, 200, 0.2, 'triangle', 0.05),
  bossHit: () => { tone(900, 100, 0.3, 'square', 0.08); tone(300, 50, 0.4, 'sawtooth', 0.06, 0.05); },
  boom: () => { for (let i = 0; i < 6; i++) tone(200 - i * 25, 30, 0.4, 'sawtooth', 0.06, i * 0.12); },
  shoot: () => tone(1200, 600, 0.08, 'square', 0.035),
  ratelimit: () => { tone(140, 120, 0.15, 'square', 0.07); tone(140, 120, 0.15, 'square', 0.07, 0.2); },
  poof: () => { tone(400, 1400, 0.15, 'triangle', 0.07); tone(1400, 1800, 0.08, 'square', 0.03, 0.12); },
  inject: () => { for (let i = 0; i < 5; i++) tone(300 + i * 150, 200 + i * 100, 0.08, 'sawtooth', 0.05, i * 0.06); },
  hallu: () => { tone(700, 150, 0.6, 'sine', 0.09); tone(705, 155, 0.6, 'sine', 0.06); },
  blip: () => tone(880, 880, 0.06, 'square', 0.04),
};
```

#### Einzelwerte aller Geräusche

| Name | Teiltöne (`f1 → f2` Hz, Dauer s, Wellenform, Lautstärke, Verzögerung s) | Gesamtlänge ca. |
|---|---|---|
| `jump` | 320 → 640, 0.12, square, 0.05 | 0.12 s |
| `djump` | 500 → 1100, 0.14, triangle, 0.07; dazu 750 → 1500, 0.1, square, 0.03, +0.04 | 0.14 s |
| `coin` | 988 → 988, 0.05, square, 0.04; dann 1319 → 1319, 0.12, square, 0.04, +0.05 (Töne H5 und E6) | 0.17 s |
| `stomp` | 500 → 60, 0.18, square, 0.07 | 0.18 s |
| `hurt` | 300 → 40, 0.5, sawtooth, 0.07 | 0.5 s |
| `shield` | 200 → 900, 0.25, triangle, 0.08 | 0.25 s |
| `power` | 523, 659, 784, 1047 (C5 E5 G5 C6), je 0.1, square, 0.05, Abstand 0.07 | 0.31 s |
| `save` | 660, 880 (≈ E5, A5), je 0.1, triangle, 0.07, Abstand 0.1 | 0.2 s |
| `win` | 523, 659, 784, 1047, 784, 1047 (C5 E5 G5 C6 G5 C6), je 0.14, square, 0.05, Abstand 0.11 | 0.69 s |
| `over` | 392, 330, 262, 196 (G4 E4 C4 G3), je 0.22, triangle, 0.08, Abstand 0.2, jeweils leicht abfallend auf `f * 0.98` | 0.82 s |
| `oneup` | 784, 988, 1175, 1568 (G5 H5 D6 G6), je 0.08, square, 0.05, Abstand 0.06 | 0.26 s |
| `crumble` | 180 → 60, 0.25, sawtooth, 0.03 | 0.25 s |
| `thud` | 120 → 30, 0.35, **sine, 0.2**; dazu 80 → 30, 0.3, square, 0.05 | 0.35 s |
| `throw` | 700 → 200, 0.2, triangle, 0.05 | 0.2 s |
| `bossHit` | 900 → 100, 0.3, square, 0.08; dazu 300 → 50, 0.4, sawtooth, 0.06, +0.05 | 0.45 s |
| `boom` | 6 Töne: 200, 175, 150, 125, 100, 75 → je 30, 0.4, sawtooth, 0.06, Abstand 0.12 | 1.0 s |
| `shoot` | 1200 → 600, 0.08, square, 0.035 | 0.08 s |
| `ratelimit` | 140 → 120, 0.15, square, 0.07, zweimal (+0 und +0.2) | 0.35 s |
| `poof` | 400 → 1400, 0.15, triangle, 0.07; dann 1400 → 1800, 0.08, square, 0.03, +0.12 | 0.2 s |
| `inject` | 5 Töne: 300→200, 450→300, 600→400, 750→500, 900→600, je 0.08, sawtooth, 0.05, Abstand 0.06 | 0.32 s |
| `hallu` | 700 → 150, 0.6, sine, 0.09; dazu 705 → 155, 0.6, sine, 0.06 (gleichzeitig) | 0.6 s |
| `blip` | 880 → 880, 0.06, square, 0.04 | 0.06 s |

**Rauschen:** Kein Geräusch aus `SND` benutzt Rauschen. Rauschen gibt es nur für Snare und HiHat der Musik (`drumAt`, Abschnitt 10.3).

#### Wann welches Geräusch erklingt

| Name | Wann es erklingt (Stelle im Code) | Wie es klingt |
|---|---|---|
| `jump` | Normaler Sprung vom Boden oder in der Coyote-Zeit, in `updatePlayer()` (Zeile 487) | kurzes, helles „Bwip“ nach oben (Oktav-Glissando) |
| `djump` | Doppelsprung in der Luft (Power-up „Extended Thinking“ nötig), `updatePlayer()` (Zeile 490) | höheres, weicheres „Wuiip“ mit schimmerndem Obertons-Pieps |
| `coin` | Token eingesammelt (Zeile 541). Bei jedem 100. Token zusätzlich `oneup` | klassisches Münz-„Ding-Ding“, zwei Töne |
| `stomp` | Bug oder Virus von oben zertreten, `stompOrHurt()` (Zeile 720). Prompt-Injector von oben zertreten (Zeile 633) | tiefer werdendes „Pjuu“, schnell fallend |
| `hurt` | Claude stirbt, `die()` (Zeile 590): Treffer ohne Firewall, Lava, Absturz | langes, schnarrendes Abwärts-Glissando (Sägezahn) |
| `shield` | Firewall fängt einen Treffer ab, `hurt()` (Zeile 582). Firewall blockt einen Prompt-Injector (Zeile 638) | aufsteigendes, weiches „Wuuup“ |
| `power` | Firewall-Power-up eingesammelt (Zeile 550). Doppelsprung-Power-up eingesammelt (Zeile 557). Ziel öffnet sich nach dem Boss-Sieg (Zeile 738) | schnelles Dur-Arpeggio C-E-G-C nach oben |
| `save` | Checkpoint (Diskette) aktiviert (Zeile 566) | zwei sanfte, aufsteigende Töne |
| `win` | Ziel erreicht (Zeile 574). Nach dem letzten Level **noch einmal** beim Wechsel in den Abspann (Zeile 427) | Fanfare C-E-G-C-G-C |
| `over` | Game Over, beim Übergang vom Todesbalken (Zeile 420) | traurige, absteigende Tonfolge G-E-C-G, weich |
| `oneup` | Jeder 100. Token: Extra-Leben „1UP: Neue Session!“ (Zeile 543) | schnelles, hohes Arpeggio G-H-D-G |
| `crumble` | Spieler landet auf einem bröselnden Register (Level 4), wenn es zu bröseln beginnt (Zeile 509) | leises, kurzes Knirschen nach unten |
| `thud` | Boss landet nach einem Sprung, dabei entstehen Schockwellen (Zeile 755) | dumpfer, lauter Bass-Schlag (lautestes Geräusch) |
| `throw` | Boss wirft Code-Schnipsel (TODO, FIXME …) (Zeile 776) | fallendes „Fjuu“ |
| `bossHit` | Boss wird von oben getroffen (Zeile 796) | lauter, fallender Treffer-Ton mit schnarrendem Nachklang |
| `boom` | Boss besiegt (letzter Treffer, Zeile 800) | Explosion aus 6 rasch aufeinanderfolgenden, absinkenden Sägezahn-Stößen, ca. 1 s |
| `shoot` | Prompt abgefeuert (X/F), wenn API-Credits da sind, `shoot()` (Zeile 452) | sehr kurzes, hohes „Piu“ |
| `ratelimit` | Prompt abfeuern ohne Credits → „429 Too Many Requests“, 2 s Sperre, `shoot()` (Zeile 446). Während der Sperre bleibt weiteres Drücken stumm (Zeile 444) | zwei tiefe, brummende Fehler-„Bööp Bööp“ |
| `poof` | Prompt trifft Bug/Virus/Injector, der wird zu Toaster/Ente/Pflanze, `convert()` (Zeile 457) | aufsteigendes „Puff“ mit hellem Glitzern am Ende |
| `inject` | Prompt-Injector berührt Claude ohne Firewall → Steuerung 4 s vertauscht (Zeile 641) | aufgeregte, stufig steigende Sägezahn-Kaskade |
| `hallu` | Durch eine halluzinierte Plattform gefallen, sie wird entlarvt (Zeile 530) | langes, schwebendes Abwärts-„Wuuuu“. Zwei leicht verstimmte Sinustöne (5 Hz Unterschied) erzeugen ein Schwebungs-Wabern |
| `blip` | Antwort auf die Feedback-Frage „War diese Antwort hilfreich?“ (← 👍 / → 👎) im Todesbalken (Zeile 416) | einzelner kurzer Piep |

Alle 22 Geräusche aus `SND` werden irgendwo benutzt. Es gibt kein ungenutztes Geräusch. Für diese Dinge gibt es **kein eigenes Geräusch**:

- Treffer auf den Boss mit einem Prompt (Text „Prompt abgelehnt.“ u. ä., Zeile 663)
- Prompt trifft Boss-Geschoss („Code Review: abgelehnt“, Zeile 658)
- Prompt prallt gegen eine Wand
- Memory-Leak-Tropfen
- Level-Intro, Pause, Menü-Auswahl, Start des Spiels
- Respawn nach dem Tod
- Ablauf der vertauschten Steuerung
- Boss-Sprüche

Code-Stellen, an denen Geräusche ausgelöst werden:

Feedback-Frage im Todesbalken (Zeilen 413–417):

(game.html, Zeilen 413–417)

```js
    // "War diese Antwort hilfreich?" – ← = 👍, → = 👎
    if (!feedback && stateT > 0.7 && (pressed.left || pressed.right)) {
      feedback = { up: !!pressed.left, text: pick(pressed.left ? FEEDBACK_UP : FEEDBACK_DOWN), t: stateT };
      SND.blip();
    }
```

Game Over und Abspann (Zeilen 418–428):

(game.html, Zeilen 418–428)

```js
    const done = feedback ? stateT - feedback.t > 1.6 : stateT > 3.2;
    if (done || (stateT > 0.7 && pressed.start)) {
      if (lives <= 0) { saveHigh(); playMusic(null); SND.over(); setState('gameover'); }
      else respawn();
    }
  } else if (state === 'levelDone') {
    updateWorld(dt, false);
    if (stateT > 1.2 && go) {
      if (levelIdx + 1 < LEVELS.length) loadLevel(levelIdx + 1);
      else { saveHigh(); playMusic(null); setState('win'); SND.win(); }
    }
```

Prompt-Kanone mit Rate Limit (Zeilen 443–453):

(game.html, Zeilen 443–453)

```js
function shoot() {
  if (rate.lock > 0) return;
  if (rate.credits < 1) {
    rate.lock = 2; SND.ratelimit();
    showBanner('429 Too Many Requests – bitte warte kurz', '#ff6b6b', 2);
    return;
  }
  rate.credits -= 1; rate.idle = 0;
  ents.shots.push({ x: p.face > 0 ? p.x + p.w : p.x - 16, y: p.y + 8, w: 16, h: 14, vx: p.face * 560, life: 0.75, text: pick(PROMPTS), face: p.face });
  SND.shoot();
}
```

Verwandlung durch Prompt (Zeilen 455–462):

(game.html, Zeilen 455–462)

```js
// Gegner wird durch einen Prompt in etwas Harmloses verwandelt
function convert(e, prompt, dir) {
  e.alive = false; e.squash = 99; score += 75; SND.poof();
  const kind = /Toaster/.test(prompt) ? 'toaster' : /Gummiente/.test(prompt) ? 'duck' : /Zimmerpflanze/.test(prompt) ? 'plant' : pick(['toaster', 'duck', 'plant']);
  ents.pets.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, vx: dir * (60 + Math.random() * 80), vy: -480, rot: 0, kind });
  burst(e.x + e.w / 2, e.y + e.h / 2, '#fff', 14, 160);
  say(e.x - 30, e.y - 16, PET_MSGS[kind], '#ffe9a8');
}
```

Sprung und Doppelsprung (Zeilen 482–495):

(game.html, Zeilen 482–495)

```js
  if (p.onGround) p.usedDouble = false;
  p.coyote = p.onGround ? 0.1 : p.coyote - dt;
  p.jumpBuf = pressed.jump ? 0.13 : p.jumpBuf - dt;
  if (p.jumpBuf > 0 && p.coyote > 0) {
    p.vy = -JUMP; p.jumpBuf = 0; p.coyote = 0; p.onGround = false;
    SND.jump(); burst(p.x + p.w / 2, p.y + p.h, '#ffffff88', 5, 80);
  } else if (pressed.jump && hasDouble && !p.usedDouble && !p.onGround) {
    p.vy = -JUMP * 0.88; p.jumpBuf = 0; p.usedDouble = true;
    SND.djump();
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * Math.PI * 2;
      ents.particles.push({ x: p.x + p.w / 2, y: p.y + p.h, vx: Math.cos(a) * 140, vy: Math.sin(a) * 40, life: 0.35, color: '#d68cff', size: 3 });
    }
  }
```

Bröselndes Register (Zeilen 504–512):

(game.html, Zeilen 504–512)

```js
  if (vyBefore >= 0) {
    for (const m of ents.movers) {
      if (m.gone) continue;
      if (p.x + p.w > m.x && p.x < m.x + m.w && prevBottom <= m.y + 2 && p.y + p.h >= m.y) {
        p.y = m.y - p.h; p.vy = 0; p.onGround = true; p.riding = m;
        if (m.crumble && m.timer < 0) { m.timer = 0; SND.crumble(); }
      }
    }
  }
```

Halluzinierte Plattform (Zeilen 523–532):

(game.html, Zeilen 523–532)

```js
  // Halluzinierte Plattformen: beim Durchfallen entlarven
  for (let c = l; c <= r; c++) for (let rr = t0; rr <= t1; rr++) {
    if (tileAt(c, rr) !== 5) continue;
    let a = c, b = c;
    while (tileAt(a - 1, rr) === 5) a--;
    while (tileAt(b + 1, rr) === 5) b++;
    for (let k = a; k <= b; k++) grid[rr][k] = 6;
    SND.hallu(); showBanner(pick(HALLU_MSGS), '#d68cff', 2.6);
    burst((a + b + 1) / 2 * T, rr * T + 6, '#d68cff', 20, 160);
  }
```

Tokens, Power-ups, Checkpoints, Ziel (Zeilen 537–576):

(game.html, Zeilen 537–576)

```js
  // Tokens
  for (const t of ents.tokens) {
    if (t.taken) continue;
    if (Math.abs(p.x + p.w / 2 - t.x) < 20 && Math.abs(p.y + p.h / 2 - t.y) < 22) {
      t.taken = true; tokens++; score += 10; SND.coin();
      burst(t.x, t.y, theme.accent, 6, 120);
      if (tokens % 100 === 0) { lives++; SND.oneup(); say(p.x, p.y - 20, '1UP: Neue Session!', '#ffd84a'); }
      else if (tokens % 25 === 0) say(t.x, t.y - 10, `Kontext +${tokens} Tokens`, theme.accent);
    }
  }
  // Power-ups
  for (const pw of ents.power) {
    if (!pw.taken && Math.abs(p.x + p.w / 2 - pw.x) < 22 && Math.abs(p.y + p.h / 2 - pw.y) < 24) {
      pw.taken = true; p.shield = true; score += 50; SND.power();
      say(pw.x, pw.y - 20, 'Firewall aktiv!', '#7cf');
      burst(pw.x, pw.y, '#7cf', 16);
    }
  }
  for (const d of ents.dj) {
    if (!d.taken && Math.abs(p.x + p.w / 2 - d.x) < 22 && Math.abs(p.y + p.h / 2 - d.y) < 24) {
      d.taken = true; score += 50; SND.power();
      say(d.x - 60, d.y - 24, hasDouble ? 'Denkt schon nach... +50' : 'Extended Thinking: Doppelsprung!', '#d68cff');
      hasDouble = true;
      burst(d.x, d.y, '#d68cff', 20);
    }
  }
  // Checkpoints
  for (const s of ents.saves) {
    if (!s.active && p.x + p.w > s.x && p.x < s.x + T) {
      s.active = true; p.spawnX = s.x + 5; p.spawnY = s.y + 4; SND.save();
      say(s.x, s.y - 30, 'Autosave...', '#ffd84a');
    }
  }
  // Ziel (hohe Trefferzone, damit es auch im Sprung zählt)
  if (!ents.goal.locked && overlap(p, { x: ents.goal.x, y: ents.goal.y - 160, w: 48, h: 224 })) {
    const bonus = Math.max(0, Math.floor((240 - levelTime) * 5));
    score += 500 + bonus; ents.goal.bonus = bonus;
    SND.win(); burst(ents.goal.x + 24, ents.goal.y + 20, theme.accent, 40, 300);
    setState('levelDone');
  }
```

Firewall-Treffer und Tod (Zeilen 579–594):

(game.html, Zeilen 579–594)

```js
function hurt() {
  if (p.inv > 0 || state !== 'play') return;
  if (p.shield) {
    p.shield = false; p.inv = 1.4; SND.shield();
    say(p.x, p.y - 16, 'Firewall hat\'s abgefangen!', '#7cf');
    burst(p.x + p.w / 2, p.y + p.h / 2, '#7cf', 16);
    p.vy = -JUMP * 0.5;
  } else die();
}
function die(msg) {
  if (state !== 'play') return;
  lives--; deathMsg = msg || pick(DEATH_MSGS); SND.hurt(); shake = 0.3;
  feedback = null; invertT = 0;
  burst(p.x + p.w / 2, Math.min(p.y + p.h / 2, VH - 10), '#D97757', 30, 320);
  setState('dead');
}
```

Prompt-Injector (Zeilen 625–645):

(game.html, Zeilen 625–645)

```js
  // Prompt-Injectors: kein Schaden, aber vertauschte Steuerung
  for (const e of ents.injectors) {
    if (!e.alive) { e.squash += dt; continue; }
    walk(e, dt);
    e.signT -= dt;
    if (e.signT <= 0) { e.sign = pick(INJECT_SIGNS); e.signT = 2.5; }
    if (interactive && overlap(p, e)) {
      if (p.vy > 0 && p.y + p.h - e.y < 16) {
        e.alive = false; score += 150; SND.stomp();
        p.vy = held.jump ? -JUMP * 0.85 : -JUMP * 0.55; p.usedDouble = false;
        burst(e.x + e.w / 2, e.y + e.h / 2, '#d68cff', 14);
        say(e.x - 20, e.y - 14, 'Injection abgewehrt!', '#fff');
      } else if (p.shield) {
        e.alive = false; p.shield = false; p.inv = 1; SND.shield();
        say(e.x - 30, e.y - 14, 'Firewall blockt Injection!', '#7cf');
      } else {
        e.alive = false; invertT = 4; SND.inject(); shake = 0.2;
        say(e.x - 20, e.y - 14, 'Hehe. Neue Anweisungen!', '#d68cff');
      }
    }
  }
```

Bug/Virus zertreten (Zeilen 718–726):

(game.html, Zeilen 718–726)

```js
function stompOrHurt(e, msgs, pts) {
  if (p.vy > 0 && p.y + p.h - e.y < 16) {
    e.alive = false; score += pts; SND.stomp();
    p.vy = held.jump ? -JUMP * 0.85 : -JUMP * 0.55;
    p.usedDouble = false;
    burst(e.x + e.w / 2, e.y + e.h / 2, '#ff5a8a', 14);
    say(e.x, e.y - 14, pick(msgs), '#fff');
  } else hurt();
}
```

Boss (Zeilen 737–740, 753–759, 773–784, 795–809):

(game.html, Zeilen 737–740)

```js
    if (b.deadT > 1.8 && ents.goal.locked) {
      ents.goal.locked = false; SND.power();
      say(VW / 2 - 140, 200, 'Legacy-Code refactored! Ab zum OUTPUT!', '#9aff9a');
    }
```

(game.html, Zeilen 753–759)

```js
  if (b.onGround && !wasGround) {
    // Landung: Schockwellen nach links und rechts
    shake = 0.35; SND.thud();
    burst(b.x + b.w / 2, FLOOR, '#aaa', 20, 200);
    if (interactive) for (const dir of [-1, 1]) ents.waves.push({ x: b.x + b.w / 2 - 12, y: FLOOR - 16, w: 24, h: 16, vx: dir * (260 + rage * 30) });
    b.mode = 'walk';
  }
```

(game.html, Zeilen 773–784)

```js
    } else if (b.mode === 'throw') {
      b.vx = 0; b.throwT -= dt;
      if (b.throwT <= 0) {
        SND.throw();
        const n = 3 + (rage >= 3 ? 1 : 0);
        for (let k = 0; k < n; k++) {
          ents.projs.push({ x: b.x + b.w / 2, y: b.y, w: 30, h: 14, label: pick(PROJ_LABELS),
            vx: b.face * (120 + k * 90 + Math.random() * 40), vy: -520 - Math.random() * 180, rot: 0 });
        }
        b.mode = 'walk';
      }
    }
```

(game.html, Zeilen 795–809)

```js
        if (b.inv <= 0) {
          b.hp--; b.inv = 1.0; shake = 0.3; score += 300; SND.bossHit();
          burst(p.x + p.w / 2, hb.y, '#ffd84a', 20, 260);
          say(b.x, b.y - 20, pick(BOSS_HIT_MSGS), '#ffd84a');
          if (b.hp <= 0) {
            b.dead = true; b.vx = 0; score += 2000; SND.boom();
            ents.projs = []; ents.waves = [];
            b.talk = 'Aber... es lief doch...'; b.talkT = 2;
          } else {
            // Er spuckt kleine Bugs aus
            for (let k = 0; k < (b.hp <= 2 ? 2 : 1); k++)
              ents.bugs.push({ x: b.x + b.w / 2, y: b.y + 20, w: 24, h: 18, vx: (k ? 1 : -1) * 80, vy: -400, alive: true, squash: 0 });
            if (b.hp === 2) ents.power.push({ x: 15 * T, y: 5 * T, taken: false });
          }
        }
```

---

### 10.3 Musik

#### Spuren `TRACKS` wörtlich

(game.html, Zeilen 218–242)

```js
// ---------------------------------------------------------------- Musik
// Jede Spur: Achtelnoten, durch Leerzeichen getrennt, "." = Pause. Drums: k = Kick, s = Snare, h = HiHat.
const TRACKS = {
  jungle: { bpm: 132, bassWave: 'triangle', leadWave: 'square',
    bass: 'A2 . A3 . A2 . A3 A2 F2 . F3 . F2 . F3 F2 G2 . G3 . G2 . G3 G2 E2 . E3 . E2 . G#2 B2',
    lead: 'E5 . A4 . C5 . E5 D5 C5 . A4 . . . . . D5 . F5 . A5 . G5 F5 E5 . . . . . . . ' +
          'B4 . D5 . G5 . F5 E5 D5 . B4 . . . . . C5 . B4 . A4 . G#4 . A4 . . . . . . .',
    drums: 'k . h . s . h . k k h . s . h h' },
  cache: { bpm: 150, bassWave: 'triangle', leadWave: 'square',
    bass: 'E2 E3 E2 E3 E2 E3 E2 E3 C2 C3 C2 C3 C2 C3 C2 C3 D2 D3 D2 D3 D2 D3 D2 D3 B1 B2 B1 B2 B1 B2 B1 B2',
    lead: 'E5 G5 B5 G5 E5 G5 B5 G5 E5 G5 C6 G5 E5 G5 C6 G5 F#5 A5 D6 A5 F#5 A5 D6 A5 D#5 F#5 B5 F#5 D#5 F#5 B5 A5',
    drums: 'k . h k s . h . k . h k s . h h' },
  cave: { bpm: 112, bassWave: 'triangle', leadWave: 'triangle',
    bass: 'D2 . . . D2 . A1 . A#1 . . . A#1 . F1 . C2 . . . C2 . G1 . A1 . . . A1 . C#2 .',
    lead: 'A4 . . . F4 . . . D5 . . . C5 . A#4 . A4 . . . G4 . . . E4 . . . C#5 . . .',
    drums: 'k . . . s . . h k . k . s . . h' },
  volcano: { bpm: 160, bassWave: 'square', leadWave: 'square',
    bass: 'G2 G2 G3 G2 G2 G2 A#2 G2 D#2 D#2 D#3 D#2 D#2 D#2 F2 D#2 F2 F2 F3 F2 F2 F2 A2 F2 D2 D2 D3 D2 F#2 F#2 A2 D3',
    lead: 'G5 . G5 A#5 . A5 G5 . D#5 . . . . . F5 . F5 . F5 A5 . G5 F5 . D5 . . . F#5 . A5 .',
    drums: 'k h s h k k s h' },
  boss: { bpm: 172, bassWave: 'sawtooth', leadWave: 'square',
    bass: 'C2 C3 C2 C3 C2 C3 C2 C3 G#1 G#2 G#1 G#2 G#1 G#2 G#1 G#2 A#1 A#2 A#1 A#2 A#1 A#2 A#1 A#2 G1 G2 G1 G2 B1 B2 D2 D3',
    lead: 'C5 . D#5 . G5 . F#5 G5 G#5 . G5 . D#5 . C5 . A#4 . D5 . F5 . D5 A#4 B4 . D5 . G5 . F5 D5',
    drums: 'k h s h k h s s' },
};
```

#### Notenlisten vorberechnen (`noteFreq()`)

(game.html, Zeilen 243–253)

```js
function noteFreq(n) {
  const m = /^([A-G])(#?)(\d)$/.exec(n);
  const semi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0) + (+m[3] + 1) * 12;
  return 440 * Math.pow(2, (semi - 69) / 12);
}
for (const k in TRACKS) {
  const tr = TRACKS[k];
  tr.bassN = tr.bass.trim().split(/\s+/).map(n => n === '.' ? 0 : noteFreq(n));
  tr.leadN = tr.lead.trim().split(/\s+/).map(n => n === '.' ? 0 : noteFreq(n));
  tr.drumN = tr.drums.trim().split(/\s+/);
}
```

- Noten haben das Format Buchstabe + optional `#` + Oktave (`A2`, `G#4`, `C6`). Es gibt **keine** Bs (♭), nur Kreuze. Gerechnet wird in gleichstufiger Stimmung mit A4 = 440 Hz (MIDI-Nummer 69).
- `.` = Pause (Frequenz 0). Schlagzeug: `k` = Kick, `s` = Snare, `h` = HiHat, `.` = nichts.
- Jedes Zeichen ist **eine Achtelnote**. Die Spuren sind beim Laden der Seite schon in Zahlenlisten umgerechnet (`bassN`, `leadN`, `drumN`).

#### Daten aller Spuren

Die Länge einer Achtel ist `sd = 60 / bpm / 2` Sekunden. Bass, Melodie (Lead) und Schlagzeug laufen **jeweils unabhängig in Schleife**, über `music.step % Länge`. Die Gesamtschleife ist das kleinste gemeinsame Vielfache. Die Tonarten habe ich aus den Noten abgeleitet, im Code stehen sie nicht.

| Spur | Level | BPM | Achtel (s) | Bass-Wellenform | Lead-Wellenform | Bass: Achtel / Dauer | Lead: Achtel / Dauer | Drums: Achtel / Dauer | Gesamtschleife | Tonart (abgeleitet) |
|---|---|---|---|---|---|---|---|---|---|---|
| `jungle` | 1 + Titelbild | 132 | 0.2273 | triangle | square | 32 / 7.27 s | 64 / 14.55 s | 16 / 3.64 s | 64 Achtel = 14.55 s | a-Moll (mit Gis: harmonisch) |
| `cache` | 2 | 150 | 0.2000 | triangle | square | 32 / 6.40 s | 32 / 6.40 s | 16 / 3.20 s | 32 Achtel = 6.40 s | e-Moll (mit Dis) |
| `cave` | 3 | 112 | 0.2679 | triangle | **triangle** | 32 / 8.57 s | 32 / 8.57 s | 16 / 4.29 s | 32 Achtel = 8.57 s | d-Moll (mit Cis, „A#“ = B) |
| `volcano` | 4 | 160 | 0.1875 | **square** | square | 32 / 6.00 s | 32 / 6.00 s | 8 / 1.50 s | 32 Achtel = 6.00 s | g-Moll (mit Fis, „A#“ = B, „D#“ = Es) |
| `boss` | 5 (Boss) | 172 | 0.1744 | **sawtooth** | square | 32 / 5.58 s | 32 / 5.58 s | 8 / 1.40 s | 32 Achtel = 5.58 s | c-Moll (mit H, „G#“ = As, „A#“ = B) |

Akkordfolgen im Bass (je 8 Achtel = ein Takt):

- `jungle`: A – F – G – E (am Ende Gis, H als Überleitung)
- `cache`: E – C – D – H, durchgehend Oktavsprünge
- `cave`: D – A – B – F – C – G – A – Cis, sehr luftig mit vielen Pausen
- `volcano`: G – Es – F – D (mit Fis, A zum Schluss)
- `boss`: C – As – B – G (H, D zum Schluss), durchgehend Oktavsprünge

Zuordnung der Spuren zu den Leveln (Zeilen 48, 65, 83, 104, 124):

(game.html, Zeile 48)

```js
    music: 'jungle', width: 130, start: [2, 14], goal: [125, 14],
```

(game.html, Zeile 65)

```js
    music: 'cache', width: 140, start: [2, 14], goal: [135, 14],
```

(game.html, Zeile 83)

```js
    music: 'cave', width: 150, start: [2, 14], goal: [146, 14],
```

(game.html, Zeile 104)

```js
    music: 'volcano', width: 150, start: [2, 14], goal: [146, 14],
```

(game.html, Zeile 124)

```js
    music: 'boss', width: 30, start: [2, 14], goal: [28, 14],
```

#### Abspielen: `music`, `playMusic()`, `noteAt()`, `drumAt()`, `tickMusic()` wörtlich

(game.html, Zeilen 254–299)

```js
const music = { track: null, step: 0, next: 0 };
function playMusic(name) {
  const tr = name ? TRACKS[name] : null;
  if (music.track === tr) return;
  music.track = tr; music.step = 0; music.next = 0;
}
function noteAt(freq, t0, dur, type, vol) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
function drumAt(kind, t0) {
  if (kind === 'k') {
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.setValueAtTime(150, t0); o.frequency.exponentialRampToValueAtTime(40, t0 + 0.12);
    g.gain.setValueAtTime(0.13, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
    o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + 0.16);
  } else if (kind === 's' || kind === 'h') {
    if (!noiseBuf) {
      noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.3, actx.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = kind === 'h' ? 7000 : 1500;
    const dur = kind === 'h' ? 0.04 : 0.12;
    g.gain.setValueAtTime(kind === 'h' ? 0.025 : 0.06, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(actx.destination); src.start(t0); src.stop(t0 + dur + 0.02);
  }
}
function tickMusic() {
  if (!actx || actx.state !== 'running') return;
  const tr = music.track;
  if (!tr || muted || state === 'pause') { music.next = 0; return; }
  const sd = 60 / tr.bpm / 2;
  if (music.next < actx.currentTime) music.next = actx.currentTime + 0.03;
  while (music.next < actx.currentTime + 0.15) {
    const s = music.step, b = tr.bassN[s % tr.bassN.length], l = tr.leadN[s % tr.leadN.length];
    if (b) noteAt(b, music.next, sd * 0.9, tr.bassWave, tr.bassWave === 'sawtooth' ? 0.035 : 0.06);
    if (l) noteAt(l, music.next, sd * 0.85, tr.leadWave, tr.leadWave === 'triangle' ? 0.05 : 0.022);
    drumAt(tr.drumN[s % tr.drumN.length], music.next);
    music.next += sd; music.step++;
  }
}
```

**`playMusic(name)`:**

- `name` ist ein Spurname oder `null` (= keine Musik).
- **Ist es dieselbe Spur wie die aktuelle, passiert nichts**: kein Neustart, die Schleife läuft nahtlos weiter.
- Sonst: `music.track` wechselt, `step = 0` und `next = 0`. Die neue Spur startet **sofort von vorn**. Es gibt **kein Überblenden**. Die bis zu 0.15 s bereits vorausgeplanten Noten der alten Spur klingen noch aus. Dadurch können sich ganz kurz beide Spuren überlappen.

**`tickMusic()`:** Planung mit Vorlauf („Lookahead-Scheduler“):

- Wird **einmal pro gezeichnetem Bild** in `frame()` aufgerufen (Zeile 1417), also nicht im festen 1/60-s-Takt der Spiellogik.
- Bricht ab, wenn kein `actx` da ist oder er nicht `'running'` ist.
- Bricht ab und setzt `music.next = 0`, wenn keine Spur gesetzt ist, `muted` gilt oder `state === 'pause'`.
- Liegt `music.next` in der Vergangenheit (Start, nach Pause, nach Ruckeln, nach Tab-Wechsel), wird neu angesetzt: `actx.currentTime + 0.03` (30 ms Puffer). **`music.step` bleibt dabei erhalten**: Die Musik setzt an der Stelle fort, an der sie aufgehört hat. Verpasste Noten werden nicht nachgeholt, aber auch nicht übersprungen.
- **Vorlauf:** Es werden alle Achtel geplant, die in den nächsten **0.15 s** beginnen.
- Pro Achtel: Bassnote, Melodienote und Schlagzeug-Schlag (falls keine Pause), dann `next += sd`, `step++`.

**Instrumente und Lautstärken:**

| Stimme | Erzeugung | Dauer | Lautstärke | Hüllkurve |
|---|---|---|---|---|
| Bass | Oszillator, Wellenform `bassWave` | `sd * 0.9` | `0.035` bei sawtooth (nur `boss`), sonst `0.06` | `noteAt`: 10 ms exponentieller Anstieg von 0.0001, dann exponentielles Ausklingen bis Notenende |
| Lead/Melodie | Oszillator, Wellenform `leadWave` | `sd * 0.85` | `0.05` bei triangle (nur `cave`), sonst `0.022` | wie Bass |
| Kick `k` | Oszillator ohne gesetzten Typ = **Sinus**, 150 → 40 Hz in 0.12 s | 0.14 s (Stopp 0.16 s) | `0.13` | sofort voll, exponentiell aus bis 0.14 s |
| Snare `s` | weißes Rauschen → Hochpass **1500 Hz** | 0.12 s | `0.06` | sofort voll, exponentiell aus |
| HiHat `h` | weißes Rauschen → Hochpass **7000 Hz** | 0.04 s | `0.025` | sofort voll, exponentiell aus |

**Rauschen:** Beim ersten Snare/HiHat-Schlag wird **einmal** ein Mono-Puffer von 0.3 s mit Zufallswerten zwischen −1 und 1 angelegt (`noiseBuf`). Jeder Schlag spielt denselben Puffer **von Anfang an**, darum klingt jede Snare und jede HiHat exakt gleich.

#### Welche Spur in welchem Zustand läuft

| Zustand | Musik | Code |
|---|---|---|
| **Seitenstart / Titelbild** | `jungle`, aber erst hörbar, wenn der AudioContext läuft, also nach dem ersten Tastendruck (siehe Abschnitt 10.5) | `toTitle()`: `loadLevel(0)` → `playMusic('jungle')`, dann `playMusic('jungle')` (zweiter Aufruf ohne Wirkung) |
| **Titel → Spielstart** | `jungle` läuft **nahtlos weiter**, kein Neustart, weil Level 1 dieselbe Spur hat | `newGame()` → `loadLevel(0)` → `playMusic('jungle')` = gleiche Spur → `return` |
| **Level-Intro** | Spur des Levels (`L.music`). Bei einem Levelwechsel **sofortiger Wechsel, Neustart von vorn** | `loadLevel()` Zeile 347 |
| **Spielen** | Spur des Levels | – |
| **Pause** | **Stille.** Es werden keine neuen Noten geplant, bereits geplante (≤ 0.15 s) klingen aus. Beim Weiterspielen geht es **an derselben Stelle** weiter (`step` bleibt) | `tickMusic` Zeile 289 |
| **Tod (Todesbalken)** | Level-Spur läuft **weiter**, `hurt` erklingt darüber | – |
| **Level geschafft** | Level-Spur läuft **weiter**, `win` erklingt darüber. Beim Weiter: sofortiger Wechsel zur nächsten Spur, von vorn | Zeilen 425–426 |
| **Game Over** | **Musik aus** (`playMusic(null)`), dazu `over` | Zeile 420 |
| **Game Over → Level nochmal** | Level-Spur **von vorn** (weil vorher `null`) | Zeile 430 → `loadLevel()` |
| **Game Over → Hauptmenü** | `jungle` **von vorn** | Zeile 431 → `toTitle()` |
| **Abspann** | **Musik aus** (`playMusic(null)`), dazu `win` | Zeile 427 |
| **Abspann → Titel** | `jungle` **von vorn** | Zeile 433 → `toTitle()` |

Der Boss-Sieg ändert die Musik **nicht**: `boss` läuft weiter, bis das Level geschafft und der Abspann erreicht ist.

Aufrufe von `playMusic()` und `tickMusic()`:

(game.html, Zeilen 322–323)

```js
function loadLevel(i) {
  levelIdx = i; L = LEVELS[i]; theme = L.theme; grid = buildGrid(L);
```

(game.html, Zeilen 346–349)

```js
  cam = 0; levelTime = 0;
  playMusic(L.music);
  setState('intro');
}
```

(game.html, Zeile 438)

```js
function toTitle() { loadLevel(0); playMusic('jungle'); setState('title'); }
```

(game.html, Zeilen 1411–1421)

```js
// ---------------------------------------------------------------- Loop
toTitle();
let last = performance.now(), acc = 0;
function frame(now) {
  acc += Math.min(0.25, (now - last) / 1000); last = now;
  while (acc >= STEP) { update(STEP); acc -= STEP; }
  tickMusic();
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

---

### 10.4 Stummschalten

- **Variable:** `let … muted = false` (Zeile 176). Beim Laden der Seite ist der Ton also immer **an**.
- **Taste:** M (`KeyM` → `'mute'`, Zeile 156). Umschalten in `update()`: `if (pressed.mute) muted = !muted;` (Zeile 397), **in jedem Zustand**: Titel, Intro, Spiel, Pause, Tod, Level geschafft, Game Over, Abspann. Weil M eine zugeordnete Taste ist, ruft sie auch `initAudio()` auf. Auf Touch-Geräten gibt es **keinen** Knopf dafür.
- **Was verstummt:** **beides**, Geräusche und Musik.
  - Geräusche: `tone()` bricht bei `muted` ab (Zeile 182).
  - Musik: `tickMusic()` plant bei `muted` nichts mehr und setzt `music.next = 0` (Zeile 289).
  - Schon geplante oder laufende Töne werden **nicht** abgebrochen: bis zu 0.15 s Musik und laufende Geräusche, z. B. `over` (0.82 s) oder `boom` (1 s), spielen zu Ende.
  - Beim Wieder-Einschalten setzt die Musik **an der gleichen Stelle** fort (`step` bleibt), nicht von vorn.
  - Die Musik läuft im Hintergrund nicht stumm mit. Der Schrittzähler steht still, solange stummgeschaltet ist.
- **Gespeichert:** **nein.** Es gibt keinen localStorage-Schlüssel für den Ton. Der einzige Schlüssel im Spiel ist `'claudeJungleHigh'` für den Highscore. Nach einem Neuladen ist der Ton wieder an.
- **Hinweis „Ton aus (M)“:** in `drawHUD()` (Zeile 1305), nur wenn `muted` gilt:
  - Text `'Ton aus (M)'`, 12 px, fett, Farbe `#fff8` (Weiß, ≈ 53 % deckend), **rechtsbündig** an x `VW - 20` (940), Grundlinie y 58, also direkt unter dem Levelnamen rechts oben. Mit schwarzem Schatten (+2/+2).
  - Sichtbar in allen Zuständen, in denen das HUD gezeichnet wird: Intro, Spiel, Pause, Tod, Level geschafft, Game Over, Abspann. In Pause, Level geschafft, Game Over und Abspann liegt er **unter** dem abdunkelnden Panel, ist also schwächer.
  - **Auf dem Titelbild nicht sichtbar**, weil `render()` dort vor `drawHUD()` mit `return` aussteigt. Das Titelbild nennt nur die Taste: `'X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus'`.
  - Ein Hinweis „Ton an“ oder ein Lautsprecher-Symbol gibt es nicht.

(game.html, Zeile 176)

```js
let actx = null, muted = false, noiseBuf = null;
```

(game.html, Zeilen 155–157)

```js
const KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', Enter: 'start', KeyP: 'pause', Escape: 'pause', KeyM: 'mute',
  KeyX: 'shoot', KeyF: 'shoot' };
```

(game.html, Zeilen 393–398)

```js
function update(dt) {
  gt += dt; stateT += dt;
  shake = Math.max(0, shake - dt);
  if (banner && (banner.t -= dt) <= 0) banner = null;
  if (pressed.mute) muted = !muted;
  const go = pressed.start || pressed.jump;
```

(game.html, Zeilen 1296–1305)

```js
function drawHUD() {
  ctx.fillStyle = '#0008'; rr(10, 10, 440, 34, 8); ctx.fill();
  drawRobot(20, 14, 1, 0, 0.85);
  text(`x${lives}`, 44, 34, 16, '#fff', 'left');
  text(`Tokens ${tokens}`, 90, 34, 16, theme.accent, 'left');
  text(`Score ${score}`, 230, 34, 16, '#ffd84a', 'left');
  if (p.shield) text('FW', 385, 34, 14, '#7cf', 'left');
  if (hasDouble) text('2x', 415, 34, 14, '#d68cff', 'left');
  text(L.name.split(': ')[1], VW - 20, 34, 15, '#fffa', 'right');
  if (muted) text('Ton aus (M)', VW - 20, 58, 12, '#fff8', 'right');
```

(game.html, Zeilen 1348–1360)

```js
  if (state === 'title') {
    panel(0.55);
    text('CLAUDE', VW / 2, 130, 64, '#D97757');
    text('im RAM-Dschungel', VW / 2, 180, 32, theme.accent);
    drawRobot(VW / 2 - 33, 215 + Math.abs(Math.sin(gt * 3)) * -20, 1, gt * 300, 3);
    text('Drücke ENTER oder LEERTASTE', VW / 2, 360, 22, blinkCol());
    text('← → / A D : laufen     ↑ / W / Leertaste : springen', VW / 2, 410, 15, '#ccc');
    text('X / F : Prompt abfeuern     P : Pause     M : Musik & Ton an/aus', VW / 2, 435, 15, '#ccc');
    text('Hilf Claude, sich durch den Speicher zum OUTPUT zu kämpfen!', VW / 2, 480, 15, '#ffd84a');
    if (highscore) text(`Highscore: ${highscore}`, VW / 2, 515, 14, '#fff9');
    return;
  }
  drawHUD();
```

---

### 10.5 Besonderheiten und Auffälligkeiten

#### Pause

- Die Musik verstummt (keine neuen Noten, Rest ≤ 0.15 s klingt aus) und setzt beim Weiterspielen an derselben Stelle fort, mit 30 ms Puffer.
- Geräusche: In der Pause wird nichts ausgelöst, weil Spieler und Welt stillstehen. `tone()` selbst kennt die Pause nicht.
- M funktioniert in der Pause.
- Die Pause hat kein eigenes Geräusch, weder beim Pausieren noch beim Fortsetzen.

#### Tab-Wechsel / Fenster im Hintergrund

- Es gibt **keinen** `visibilitychange`-/`blur`-Handler und kein `actx.suspend()`.
- Im Hintergrund-Tab ruft der Browser `requestAnimationFrame` nicht mehr (oder stark gedrosselt) auf. Damit wird `tickMusic()` nicht mehr aufgerufen, und die Musik **bricht nach ≤ 0.15 s ab**. Der AudioContext selbst läuft weiter.
- Beim Zurückkehren setzt die Musik an derselben Stelle fort (`next` liegt in der Vergangenheit → Neuansatz +0.03 s).
- Ob ein Browser den Hintergrund-Tab ganz anders drosselt (z. B. `setTimeout`-ähnlich alle 1 s), hängt vom Browser ab. Im Code ist das nicht behandelt. **Nicht getestet.**
- Wenn der Browser den Context selbst unterbricht (z. B. iOS bei einem Anruf, Zustand `'interrupted'`/`'suspended'`), bleibt das Spiel stumm, bis wieder eine zugeordnete Taste bzw. ein Touch `initAudio()` → `resume()` auslöst.

#### Erster Start: Titelmusik ist meist nicht zu hören

Der AudioContext entsteht erst beim ersten Tastendruck. Auf dem Titelbild ist der erste Tastendruck meist ENTER oder die Leertaste, und genau die starten gleichzeitig das Spiel. Wegen des nahtlosen Übergangs (`jungle` = Level 1) hört man die `jungle`-Spur zwar, aber erst ab dem Level-Intro. Das Titelbild selbst bleibt beim allerersten Besuch stumm, außer man drückt vorher eine andere zugeordnete Taste (z. B. ←). Drückt man als allererste Taste **M**, wird der Context gestartet **und** sofort stummgeschaltet.

#### Lautstärke-Unterschiede

Es gibt keinen Master-Regler, alle Werte gehen direkt an den Ausgang:

- **Lautester Einzelwert:** `thud` (Boss-Landung) mit Sinus 0.2 plus Rechteck 0.05. Danach folgt der Kick der Musik mit 0.13.
- Die Geräusche liegen sonst bei 0.03–0.09. Melodien mit Rechteck sind mit **0.022** sehr leise eingestellt, die Melodie in `cave` (Dreieck) mit 0.05. Rechteck und Sägezahn klingen bei gleichem Wert deutlich lauter als Sinus/Dreieck. Die Einstellungen gleichen das grob aus.
- Der Bass ist bei `boss` (Sägezahn 0.035) leiser eingestellt als bei den anderen Spuren (0.06), klingt wegen des Sägezahns aber kräftiger.
- `boom` (6 × Sägezahn 0.06) und `bossHit` überlagern sich mit der Boss-Musik. Ohne Kompressor ist bei vielen gleichzeitigen Geräuschen (z. B. mehrere Tokens + Stomp + Musik) Übersteuern denkbar. **Nicht gemessen.**

#### Was wie ein Fehler oder eine Ungenauigkeit aussieht

1. **`win` erklingt nach dem letzten Level zweimal:** einmal beim Berühren des Ziels (Zeile 574) und noch einmal beim Wechsel in den Abspann (Zeile 427).
2. **Kein Überblenden, aber kurze Überlappung** beim Spurwechsel: Die vorausgeplanten ≤ 0.15 s der alten Spur laufen noch.
3. **Stummschalten bricht laufende Töne nicht ab:** z. B. `over` oder `boom` spielen nach dem Drücken von M zu Ende.
4. **Stummschaltung wird nicht gespeichert:** nach jedem Neuladen ist der Ton wieder an.
5. **Kein Hinweis auf dem Titelbild,** wenn der Ton aus ist (das HUD fehlt dort).
6. **Kein Touch-Knopf für den Ton:** Auf Handy/Tablet kann man nicht stummschalten.
7. **Mausklick startet kein Audio,** nur Tasten aus `KEYMAP` und Touch. Andere Tasten (z. B. Shift, Buchstaben außer A/D/W/P/M/X/F) zählen nicht.
8. **`tone()` hat keinen Attack:** Die Lautstärke springt sofort auf den Zielwert. Das kann leise klicken. Die Musik-Noten (`noteAt`) haben dagegen 10 ms Anstieg. Kick, Snare und HiHat setzen ebenfalls hart ein, was dort gewollt ist.
9. **Gleiche Geräusche für verschiedene Ereignisse:** `power` für Firewall, Doppelsprung **und** Öffnen des Ziels nach dem Boss. `shield` für „Firewall fängt Treffer“ **und** „Firewall blockt Injection“. `stomp` für Bug, Virus und Injector.
10. **`hurt` heißt „verletzt“, erklingt aber nur beim Tod** (in `die()`). Ein Treffer mit Firewall spielt `shield`.
11. **Bei jedem 100. Token** erklingen `coin` und `oneup` gleichzeitig.
12. **Musik hängt an der Bildrate:** `tickMusic()` läuft pro gezeichnetem Bild. Ruckelt das Spiel länger als 0.15 s, entsteht eine Lücke. Danach setzt die Musik verzögert fort, weil keine Noten übersprungen werden. Der Rhythmus „stolpert“ dann kurz.
13. **Snare/HiHat sind immer derselbe Rausch-Schnipsel** (Anfang des 0.3-s-Puffers). Das wirkt etwas maschinell und ist vermutlich gewollt einfach.
14. **Kick-Oszillator hat keinen gesetzten Typ**, der Standard ist Sinus. Das funktioniert, ist aber nur implizit.
15. **Fehler beim Erzeugen des AudioContext werden still verschluckt.** Dann bleibt das Spiel ohne Hinweis stumm.
16. **`tone()` prüft nicht, ob der Context läuft** (`'running'`), `tickMusic()` schon. Vor dem ersten `resume()` geplante Geräusche gehen still verloren. Das ist praktisch unkritisch, weil Geräusche erst nach Tastendrücken entstehen.
17. **Game Over → Level nochmal** startet die Level-Musik von vorn. **Tod mit Respawn** lässt sie dagegen einfach weiterlaufen. Das ist uneinheitlich, aber vermutlich gewollt.
18. **Titelmusik beim ersten Besuch praktisch nie zu hören** (siehe oben).
