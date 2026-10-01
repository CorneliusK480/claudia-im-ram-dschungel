---
date: 2026-10-01
topic: "Claudia im RAM-Dschungel design"
tags: [design]
status: draft
---

# Design: Claudia im RAM-Dschungel

Ein verspieltes Retro-Jump-&-Run im Pixel-Look mit Terminal-Charme und leuchtenden Farben auf
dunklem Grund. Der Prototyp `game.html` ist die visuelle Vorlage: Alles soll genauso aussehen und
klingen.

## Style

- **Colours:** Dunkler, fast schwarzer Rand (#020a06) mit grünem Leuchten um die Spielfläche.
  Jedes Level hat sein eigenes Farbschema:
  - Level 1 RAM-Dschungel: Grüntöne, Akzent #3cff9a
  - Level 2 Cache-Canyon: Blau/Violett, Akzent #7cc4ff
  - Level 3 Festplatten-Höhle: Braun/Orange, Akzent #ffb347
  - Level 4 CPU-Vulkan: Rot mit Lava, Akzent #ff7b54
  - Level 5 Legacy-Code: Grau mit Alt-Monitor-Grün, Akzent #9aff9a
  - Fest: „CLAUDIA“-Titel in Titel-Orange #D97757, Score in Gelb #ffd84a, Fehler/Tod in Rot #ff6b6b,
    Prompt Injection in Violett #d68cff
- **Fonts:** Schreibmaschinen- bzw. Terminal-Schrift (Courier New, sonst die Monospace-Schrift des
  Systems)
- **Overall feel:** verspielt und albern, mit Entwickler- und KI-Witzen. Bildschirmwackeln,
  Partikel-Explosionen und schwebende Sprüche („LGTM!“, „Bug gefixt!“) geben Rückmeldung.
- **Brand rules:** keine offiziellen. Titel-Orange nur für den Titel (assumption).
- **Ton:** Chiptune-Musik, eigene Melodie pro Level plus Boss-Musik. Kurze 8-Bit-Geräusche für
  Sprung, Treffer, Sammeln usw.

## Screens

### Titelbild

Startpunkt, erklärt die Steuerung.

```
┌──────────────────────────────────────────────┐
│                  CLAUDIA                      │
│              im RAM-Dschungel                 │
│                   🤖 (hüpft)                  │
│         Drücke ENTER oder LEERTASTE           │
│  ← → / A D : laufen   ↑ / W / Leertaste : springen │
│  X / F : Prompt   P : Pause   M : Ton          │
│        Highscore: 12345                       │
└──────────────────────────────────────────────┘
```

### Spiel

Das eigentliche Spiel mit Anzeige oben links.

```
┌──────────────────────────────────────────────┐
│ 🤖x3 Tokens 12 Score 4200 FW 2x  RAM-Dschungel│
│ API ▮▮▮▯▯                                     │
│     ⚠ PROMPT INJECTION: Steuerung vertauscht  │
│        ════        ◆◆◆◆                       │
│  🤖 💬→    🐞      ☣         ⚠     [>_] OUTPUT│
│ ▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓^^▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└──────────────────────────────────────────────┘
```

Im Boss-Level erscheint oben in der Mitte „LEGACY_BUG.exe“ mit 5 Lebensbalken.

### Boss erschöpft (neu)

Nach jedem Angriff steht der Boss kurz still. Sein Kopf blinkt hell als Trefferzone, und ein
kleines Symbol zeigt, dass er verwundbar ist (z. B. „💤“ oder „Kontext offen“) (assumption).

```
        [ blinkt ]
        ┌───────┐  💤
        │ 1998  │
        └┬─┬─┬─┬┘   ← Draufspringen oder Prompt trifft jetzt
```

### Overlays

Halbtransparente Ebenen über dem Spiel:

- **Level-Intro:** Levelname und Einzeiler, blendet nach etwa 2 s aus
- **Pause:** „PAUSE – Claudia denkt nach…“
- **Tod:** roter Balken mit Todesspruch, „Noch 2 Leben“, danach
  „War diese Antwort hilfreich? ← 👍 👎 →“ mit frecher Antwort
- **Level geschafft:** „Task erfolgreich abgeschlossen ✓“, Zeitbonus, „ENTER: nächster Task“
- **Game Over:** „KONTEXTFENSTER VOLL“, Score und Highscore, ENTER = nochmal (Score halbiert),
  ESC = Menü
- **Abspann:** „ALLE TASKS ERLEDIGT! 🎉“, tanzender Roboter, Endstand, ggf. „NEUER HIGHSCORE!“

### Handy

Gleiches Bild, darunter vier runde, halbtransparente Knöpfe in Grün:
links ◀ ▶, rechts 💬 (Prompt) und ⤒ (Sprung). Ein Tippen auf das Bild ersetzt ENTER.

## Navigation

```
Titel ─ENTER─▶ Level-Intro ─▶ Spiel ─P─▶ Pause ─P─▶ Spiel
                   ▲            │
                   │            ├─ Tod ─▶ (Leben übrig) ─▶ Checkpoint ─▶ Spiel
                   │            │           └─(keine)─▶ Game Over ─ENTER─▶ Level-Intro (gleiches Level)
                   │            │                                  └─ESC──▶ Titel
                   │            └─ Ziel ─▶ Level geschafft ─ENTER─┐
                   └───────────────── nächstes Level ◀────────────┘
                                   nach Level 5 ─▶ Abspann ─ENTER─▶ Titel
```

Wird beim Spielen der Browser-Tab verlassen, geht das Spiel automatisch in die Pause (bewusste
Abweichung vom Prototyp, entschieden in Slice 4).

## States

- **Empty:** Kein Highscore vorhanden → die Zeile „Highscore“ auf dem Titel fehlt einfach.
- **Loading:** Es gibt keine sichtbare Ladephase, das Spiel startet sofort auf dem Titelbild. Ton
  startet erst nach dem ersten Tastendruck oder Tippen, weil Browser das so verlangen.
- **Error:** Ist eine Level-Datei fehlerhaft, erscheint ein deutlicher Hinweis statt eines leeren
  Bildschirms (assumption). Ist der Speicher im Browser blockiert, läuft das Spiel trotzdem, nur ohne
  gespeicherten Highscore.
- **Ton aus:** kleiner Hinweis „Ton aus (M)“ oben rechts.

## Open questions

- Keine.
