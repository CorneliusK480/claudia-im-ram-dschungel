---
date: 2026-10-01
topic: "Claudia im RAM-Dschungel architecture"
tags: [architecture]
status: draft
---

# Architecture: Claudia im RAM-Dschungel

Eine reine Browser-Webseite ohne Server. Der Spiel-Code ist in klare Teile gegliedert: Die
**Spielregeln** (Bewegung, Treffer, Punkte) sind streng getrennt vom **Zeichnen** und vom **Ton**.
So lassen sich die Regeln automatisch testen, ohne dass ein Bildschirm nötig ist.

## Building blocks

```
  Tastatur / Touch
        │
        ▼
   ┌─────────┐   „links, springen, schießen“   ┌───────────────────────────┐
   │ Eingabe │ ──────────────────────────────▶ │ Spiellogik                │
   └─────────┘                                 │ 60 feste Schritte/Sekunde │
                                               │ Physik · Gegner · Boss ·  │
   ┌──────────────┐  liest Level beim Start    │ Punkte · Spielzustand     │
   │ Level-Dateien│ ─────────────────────────▶ │                           │
   └──────────────┘                            └──────┬──────────┬─────────┘
   ┌──────────────┐                                   │ Zustand  │ Ereignisse
   │ Texte/Sprüche│ ─────────────────────────────────▶│          │ („Bug besiegt“)
   └──────────────┘                                   ▼          ▼
                                               ┌──────────┐ ┌──────────┐
   ┌──────────────┐  Highscore, Ton an/aus     │ Zeichnen │ │ Ton &    │
   │ Speicher     │ ◀───────────────────────── │ (Canvas) │ │ Musik    │
   └──────────────┘                            └──────────┘ └──────────┘
```

- **Eingabe** — übersetzt Tasten und Touch-Knöpfe in Spielbefehle (links, rechts, springen,
  schießen, Pause, Ton). Die Spiellogik weiß nicht, ob jemand Tastatur oder Touch benutzt.
- **Spiellogik** — der Kern. Sie rechnet in festen Zeitschritten (60 pro Sekunde), damit das Spiel
  auf jedem Gerät gleich schnell ist. Sie zeichnet nichts und macht keinen Ton, sondern meldet nur
  Ereignisse wie „Bug besiegt“ oder „Claudia gestorben“.
- **Level-Dateien** — jedes Level ist eine eigene, lesbare Datei: Gelände, Plattformen, Gegner,
  Tokens, Farben und Musik. Beim Start wird jede Datei auf Fehler geprüft.
- **Texte/Sprüche** — alle deutschen Texte an einer Stelle (Todessprüche, Boss-Sprüche, Menütexte).
  Später lässt sich so eine englische Fassung daneben legen.
- **Zeichnen** — malt den aktuellen Zustand auf eine Zeichenfläche (Canvas). Alle Figuren werden im
  Code gezeichnet, es gibt keine Bilddateien.
- **Ton & Musik** — erzeugt Chiptune-Musik und Geräusche direkt im Browser (keine Audiodateien).
  Reagiert auf die Ereignisse der Spiellogik.
- **Speicher** — merkt sich Highscore und „Ton aus“ im Browser des Spielers.

## Technology

| What | Choice | Why (one line, plain language) |
| ---- | ------ | ------------------------------ |
| Sprache | TypeScript | JavaScript mit Typ-Prüfung: Viele Fehler fallen schon beim Schreiben auf statt erst beim Spielen. |
| Spiel-Engine | keine, eigener Code | Man lernt mehr, und das Spiel fühlt sich exakt an wie der Prototyp. |
| Grafik | HTML-Canvas (2D) | Funktioniert im Prototyp schon gut und läuft in jedem Browser. |
| Ton | Web Audio (im Browser eingebaut) | Wie im Prototyp: Töne werden erzeugt, keine Dateien nötig. |
| Bauwerkzeug | Vite | Startet beim Entwickeln sofort, lädt bei Änderungen neu und erzeugt am Ende fertige Webseiten-Dateien. |
| Tests | Vitest | Prüft die Spielregeln automatisch, passend zu Vite. |
| Level-Format | eine JSON-Datei pro Level | Einfaches Textformat, gut lesbar und später leicht zu bearbeiten. |
| Veröffentlichen | GitHub Pages, automatisch über GitHub Actions | Kostenlos. Jede Änderung im Hauptzweig ist kurz danach online. |
| Code-Ablage | Git + GitHub | Versionsgeschichte, und Voraussetzung für GitHub Pages. |

### So veröffentlichst du eine Änderung

Das Spiel liegt unter `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/`.

1. In GitHub Desktop im Reiter *Changes* die geänderten Dateien prüfen, bei *Summary* kurz
   beschreiben, was sich geändert hat → *Commit to main*.
2. Oben auf *Push origin* klicken.
3. Auf github.com im Projekt unter *Actions* läuft „Prüfen und veröffentlichen“: erst gelb (läuft),
   nach ein paar Minuten ein grünes ✓.
4. Bis zu 10 Minuten später ist die neue Version unter dem Link zu sehen. Falls nicht: hart neu
   laden mit Cmd + Shift + R (Safari: Cmd + Option + R).

Schlägt eine Typprüfung, ein Test oder der Bau fehl, erscheint ein rotes ✗, und GitHub schickt eine
E-Mail. Dann wird nichts veröffentlicht, und die alte Version bleibt online. Die Anleitung für den
Roboter steht in `.github/workflows/deploy.yml`.

## Data

- **What is stored:** Highscore (eine Zahl) und die Einstellung „Ton an/aus“.
- **Where:** Nur im Browser des Spielers (localStorage). Es gibt keinen Server und keine Datenbank.
- **Who can see it:** Nur die Person an diesem Gerät. Es werden keine persönlichen Daten erfasst
  und nichts übertragen.

## From the prototype

**Keep:**
- Alle Spielwerte (Schwerkraft, Sprunghöhe, Tempo, Leben, Punkte, Zeitbonus), damit es sich
  gleich anfühlt
- Den Aufbau der 5 Level (Positionen von Plattformen, Gegnern, Tokens)
- Die feste Rechenschritt-Schleife, den Chiptune-Ansatz und das Zeichnen im Code
- Alle Texte und Sprüche

**Throw away / redo:**
- Eine einzige Datei mit allem → klar getrennte Teile wie oben beschrieben
- Level als Zahlenlisten im Code → eigene Level-Dateien, die beim Laden geprüft werden
- Viele gemeinsam genutzte globale Variablen → jeder Teil verwaltet seinen eigenen Zustand
- Keine Tests → automatische Tests für Bewegung, Kollision, Treffer, Punkte, Boss-Phasen und das
  Laden der Level
- Boss-Kampf ohne erkennbare Trefferphase → Erschöpfungsphase, in der Sprung und Prompt wirken
  (siehe product.md, Slice 9)

## Constraints

- Muss ohne Installation in aktuellen Browsern laufen: Chrome, Firefox, Safari, auch auf dem Handy
  (assumption)
- Feste Spielfläche 960 × 544 Pixel, die auf jede Bildschirmgröße skaliert wird
- Keine externen Dienste, kein Tracking

## Open questions

- Keine.
