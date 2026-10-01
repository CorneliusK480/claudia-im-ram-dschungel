---
date: 2026-10-01
topic: "Claudia im RAM-Dschungel"
tags: [product]
status: draft
---

# Claudia im RAM-Dschungel

Ein kleines, humorvolles Jump & Run im Browser. Die kleine Roboterin Claudia kämpft sich durch den Speicher
eines Computers bis zum OUTPUT. Es gibt das Spiel bereits als Prototyp (`game.html`). Jetzt wird es
als **persönliches Lernprojekt** sauber neu aufgebaut, um zu lernen, wie aus einem Prototyp ein
ordentliches Projekt wird. Im Prototyp hieß die Figur noch „Claude“. Weil das Spiel öffentlich
wird, heißt sie jetzt **Claudia** und ist eine kleine Roboterin.

## Problem

Der Prototyp macht Spaß, steckt aber komplett in einer einzigen, schwer änderbaren Datei. Es gibt
keine Tests, und die Level sind lange Zahlenlisten im Code. Neue Ideen aus dem Backlog lassen sich
so kaum noch sicher einbauen. Die echte Version soll genau dasselbe Spiel bieten, aber so aufgebaut
sein, dass man es verstehen, prüfen und erweitern kann.

## Users

- **Die Entwicklerin bzw. der Entwickler selbst** — will lernen, ein Projekt Schritt für Schritt
  sauber aufzubauen und zu veröffentlichen.
- **Spielerinnen und Spieler** (Freunde, Leute aus der Dev- und KI-Welt) (assumption) — bekommen
  einen Link, wollen ein paar Minuten lachen und spielen, ohne etwas zu installieren.

## Main use cases

1. Eine Spielerin öffnet den Link, startet auf dem Titelbild und spielt Level 1–5 nacheinander durch.
2. Ein Spieler springt auf Bugs, sammelt Tokens und verwandelt Gegner mit der Prompt-Kanone in
   Toaster, Gummienten oder Zimmerpflanzen.
3. Eine Spielerin verliert alle Leben, versucht das Level nochmal (Score wieder bei 0) oder geht zurück
   ins Menü.
4. Ein Spieler besiegt den Boss LEGACY_BUG.exe, sieht den Abspann und hat vielleicht einen neuen
   Highscore.
5. Jemand spielt das Ganze auf dem Handy mit Touch-Knöpfen.

## First version

**In scope**
- Alles, was der Prototyp heute kann: 5 Level, alle Gegner und Fallen, Prompt-Kanone mit
  Rate Limit, Power-ups, Gags und Sprüche, Musik und Sound
- Spielbar am Desktop (Tastatur) und am Handy (Touch-Knöpfe)
- Highscore und „Ton an/aus“ bleiben im Browser gespeichert
- Der Boss ist klar erkennbar und fair besiegbar (siehe Slice 9). Im Prototyp ist unklar, wie man
  ihn schlägt.
- Nach einem Tod wird das Level wie bei Super Mario zurückgesetzt: Alle Gegner (auch besiegte)
  stehen wieder an ihren Startplätzen, und alle Tokens sind wieder da. Score, Token-Zähler, Leben
  und Checkpoint bleiben. Das weicht bewusst vom Prototyp ab (dort blieben besiegte Gegner und
  gesammelte Tokens weg) und gilt für alle späteren Gegner und Level (entschieden in Slice 3).
- Kostenlos online per Link spielbar
- Spielsprache Deutsch, alle Texte an einer zentralen Stelle

**Out of scope** (deliberately not now)
- Neue Ideen aus `BACKLOG.md`
- Level-Editor, Level-Auswahl, gespeicherter Spielfortschritt
- Konten, Online-Bestenliste, eigener Server
- Andere Sprachen als Deutsch (vorbereitet, aber nicht übersetzt)

## Slices

Build order. Each slice is something you can see and click when it's done. `/afs-implement` adds `(done)` after the name of a finished slice.

1. **Claudia läuft durch Level 1** (done) — Grundsteuerung, Gelände und Kamera.
   Done when: Im Browser läuft und springt Claudia mit der Tastatur durch das Gelände von Level 1
   (Boden, Plattformen, Abgründe, Hintergrund). Die Kamera folgt. Wer in einen Abgrund fällt, startet
   neu. Am OUTPUT-Terminal erscheint „Task erfolgreich abgeschlossen ✓“.
2. **Online spielbar** (done) — das Spiel ist im Netz erreichbar.
   Done when: Ein Link öffnet das Spiel, und nach jeder Änderung ist dort automatisch die neue
   Version zu sehen.
3. **Tokens, Bugs, Leben** (done) — das Grundspiel.
   Done when: Man sammelt Tokens, besiegt Bugs durch Draufspringen und verliert bei Berührung ein
   Leben (mit Todesspruch wie „Segmentation fault!“). Man steigt an Checkpoints wieder ein, und oben
   zeigt die Leiste Leben, Tokens und Score.
4. **Spielablauf-Bildschirme** (done) — vom Titel bis Game Over.
   Done when: Titelbild → Level-Intro → Spiel → Pause (P) → „Level geschafft“ mit Zeitbonus →
   Game Over (Level nochmal mit Score 0 oder zurück ins Menü). Der Highscore ist auch nach
   dem Neuladen noch da.
5. **Musik & Sound** — Chiptune und Geräusche.
   Done when: Jedes Level hat seine eigene Musik, Aktionen machen Geräusche, und M schaltet den Ton
   aus und an. Die Einstellung bleibt gespeichert.
6. **Prompt-Kanone** — Schießen mit Rate Limit.
   Done when: X/F feuert Prompts ab, und Bugs werden zu Toaster, Ente oder Pflanze. Die
   API-Credits-Leiste leert sich und lädt wieder auf. Bei Dauerfeuer erscheint
   „429 Too Many Requests“.
7. **Restliche Gefahren & Gags** — alles Übrige aus Level 1.
   Done when: Viren, Stacheln, Firewall-Power-up, Halluzinations-Plattformen, Prompt-Injector
   (Steuerung vertauscht) und „War diese Antwort hilfreich? 👍 👎“ beim Tod funktionieren wie im
   Prototyp.
8. **Level 2–4** — die weiteren Welten.
   Done when: Cache-Canyon (Datenbusse), Festplatten-Höhle (Decke, Memory Leaks,
   Doppelsprung-Power-up) und CPU-Vulkan (Lava, bröckelnde Register) sind nacheinander
   durchspielbar, jedes Level mit eigenen Farben.
9. **Boss-Level & Abspann** — LEGACY_BUG.exe, diesmal fair.
   Done when: Der Boss läuft, springt, wirft Code-Brocken und macht Schockwellen wie im Prototyp.
   Nach jedem Angriff ist er kurz sichtbar **erschöpft**: Sein Kopf blinkt, und eine seitliche
   Berührung ist dann harmlos. Nur in dieser Phase treffen Draufspringen **und** Prompts. Nach
   5 Treffern öffnet sich das Terminal, und der Abspann „ALLE TASKS ERLEDIGT! 🎉“ erscheint.
10. **Handy-Steuerung** — Touch-Knöpfe.
    Done when: Auf dem Handy erscheinen die Knöpfe ◀ ▶ 💬 ⤒, und das ganze Spiel ist damit spielbar,
    vom Titelbild bis zum Abspann.
11. **Claudias neues Aussehen** — man sieht, dass Claudia eine Roboterin ist.
    Done when: Claudia sieht im Spiel, auf dem Titelbild und im Abspann erkennbar weiblich aus
    (z. B. Schleife, Wimpern oder eine andere Antenne). Die Spielfigur ist dabei genauso groß wie
    vorher, sodass sich am Spielgefühl nichts ändert.

## Open questions

- Keine.
