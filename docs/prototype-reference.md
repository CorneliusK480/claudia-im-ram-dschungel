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

