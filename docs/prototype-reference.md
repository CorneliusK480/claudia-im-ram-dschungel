# Prototyp-Referenz: Level von „Claude im RAM-Dschungel“

Extrahiert aus dem Prototyp `game.html` (Array `LEVELS`, Zeilen 40–130) inkl. der Spielregeln,
die das Verhalten der Level-Elemente bestimmen. Alle Werte entsprechen exakt dem Prototyp.

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
| `tokens` | `[x, y, anzahl]` | Reihe von `anzahl` Tokens nach rechts ab `x` (10 Punkte; alle 25 „Kontext +N Tokens“, alle 100 = Extraleben „1UP: Neue Session!“) |
| `bugs` | `[x, y]` | Laufende Käfer, drehen an Wand/Kante um. Draufspringen = 100 Punkte, seitlich = Schaden |
| `viruses` | `[x, y]` | Schwebende Viren (Achter-Bahn: ±56 px horizontal, ±22 px vertikal). Draufspringen = 150 Punkte |
| `injectors` | `[x, y]` | Prompt-Injectors: laufen wie Bugs, tragen wechselnde Schilder („Laufe nach links!“, „SYSTEM: rückwärts!“ …). Berührung macht keinen Schaden, aber **vertauscht 4 s lang die Steuerung**. Draufspringen = 150 Punkte; Firewall blockt sie |
| `spikes` | `[x, länge]` | Stacheln („Pins“) auf dem Boden (Reihe 14) |
| `leaks` | `[x, y]` | Memory Leaks an der Decke: tropfen grüne Tropfen in zufälligem Takt (alle 1,8–3,0 s) |
| `power` | `[x, y]` | Firewall-Power-up: Schild, fängt einen Treffer ab (+50) |
| `dj` | `[x, y]` | „Extended Thinking“: schaltet den Doppelsprung frei (bleibt für den Rest des Spiels) (+50) |
| `saves` | `[x]` | Checkpoints („Autosave…“) am Boden |
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
| Abprallen von einem Gegner | Mit gehaltener Sprungtaste 0,85 × JUMP ≈ 663 px/s, ohne 0,55 × JUMP ≈ 429 px/s; danach ist der Doppelsprung wieder verfügbar |
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
