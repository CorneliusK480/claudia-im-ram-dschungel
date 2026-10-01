---
date: 2026-10-01
topic: "Spielablauf-Bildschirme"
slice: 4
tags: [spec]
status: ready
---

# SPEC: Spielablauf-Bildschirme

## Goal

Das Spiel bekommt seinen Rahmen: Titelbild → Level-Intro → Spiel → Pause → „Level geschafft“ mit
+500 und Zeitbonus → Game Over mit „Level nochmal (Score halbiert)“ oder zurück zum Titel. Der
Highscore wird im Browser gespeichert und ist nach dem Neuladen noch da. Alles sieht aus und verhält
sich wie im Prototyp, mit zwei bewussten Abweichungen (Ende nach Level 1, Pause beim Tab-Wechsel).

## User story

Als Spielerin oder Spieler möchte ich ein richtiges Spiel mit Titelbild, Pause, Levelabschluss,
Game Over und Highscore erleben, damit es sich wie ein fertiges Spiel anfühlt und ich meinen Rekord
schlagen kann.

## Flow

1. Ich öffne die Seite und sehe das **Titelbild** (nicht mehr direkt Level 1). Dahinter zieht
   Level 1 abgedunkelt langsam vorbei, und Claudia hüpft groß in der Mitte.
2. Ich drücke ENTER, Leertaste, ↑ oder W. Ein neues Spiel beginnt: 3 Leben, Score 0, Tokens 0.
3. **Level-Intro:** Über dem Spiel blendet ein dunkler Balken mit „Level 1: RAM-Dschungel“ und
   „Spring auf Bugs, um sie zu fixen. Sammle Tokens!“ ein. Die Bugs laufen, Claudia steht still am
   Start, die Anzeige oben ist zu sehen. Nach 2,5 s ist der Balken ausgeblendet. Ab 0,4 s kann ich
   ihn mit ENTER, Leertaste, ↑ oder W sofort wegdrücken, ohne dass Claudia dabei springt.
4. Ich spiele wie in Slice 3.
5. **Pause:** Mit P oder ESC steht alles still. Ich sehe „PAUSE“ und „Claudia denkt nach...
   (P zum Weiterspielen)“. P, ESC oder ENTER spielen weiter. Wechsle ich beim Spielen in einen
   anderen Browser-Tab, ist das Spiel bei meiner Rückkehr ebenfalls pausiert.
6. **Level geschafft:** Am OUTPUT-Terminal bleibt Claudia stehen, das Terminal zeigt ✓, und es
   gibt Partikel. Der Score steigt um 500 + Zeitbonus. Ich sehe „Task erfolgreich abgeschlossen ✓“
   und „Zeitbonus: +N   Score: S“. Nach 1,2 s erscheint „ENTER: Abschluss“.
7. ENTER, Leertaste, ↑ oder W: Der Highscore wird gespeichert (falls höher), und ich bin wieder
   auf dem **Titelbild**, das jetzt „Highscore: S“ zeigt.
8. **Game Over:** Nach dem Todesbalken des letzten Lebens wird der Highscore gespeichert (falls
   höher). Ich sehe „KONTEXTFENSTER VOLL“, „Game Over – die Session ist abgelaufen.“ und
   „Score: X   Highscore: Y“. Nach 1,2 s erscheinen „ENTER: Level nochmal versuchen (Score
   halbiert)“ und „ESC: zurück zum Hauptmenü“.
   - ENTER, Leertaste, ↑ oder W: Level 1 startet neu mit Intro, 3 Leben und halbiertem Score.
   - ESC oder P: zurück zum Titelbild.

## Screen

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
│          Hilf Claudia, sich durch den Speicher zum OUTPUT zu kämpfen!  (gelb) │
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

Pause (Spiel steht, abgedunkelt)          Level geschafft (abgedunkelt)
┌──────────────────────────────────┐      ┌──────────────────────────────────────┐
│              PAUSE               │      │   Task erfolgreich abgeschlossen ✓   │
│ Claudia denkt nach... (P zum     │      │     Zeitbonus: +870   Score: 2410    │
│ Weiterspielen)                   │      │          ENTER: Abschluss  (1,2 s)   │
└──────────────────────────────────┘      └──────────────────────────────────────┘

Game Over (Spiel steht, stark abgedunkelt)
┌────────────────────────────────────────────────────────────────────────────┐
│                          KONTEXTFENSTER VOLL                               │
│                 Game Over – die Session ist abgelaufen.                    │
│                     Score: 1235   Highscore: 2410                          │
│            ENTER: Level nochmal versuchen (Score halbiert)   (ab 1,2 s)    │
│                      ESC: zurück zum Hauptmenü                (ab 1,2 s)    │
└────────────────────────────────────────────────────────────────────────────┘
```

Alle Texte, Größen, Farben, Positionen und Zeiten stehen in `docs/prototype-reference.md`,
Abschnitt 9 (Bildschirme) und Abschnitt 8 (Zeichnung von „Level geschafft“ und Game Over). Überall
steht „Claudia“ statt „Claude“.

- **Titelbild** — Hintergrund wie in 9.2: Welt von Level 1, Kamera fährt mit 60 px/s nach rechts
  und springt am Ende zurück an den Anfang. Gegner stehen, Animationen (Tokens, Bug-Beine,
  Hintergrund) laufen. Darüber Abdunklung 0,55. Claudia ist dreifach so groß, hüpft in federnden
  Bögen und bewegt die Beine. Claudia in der Welt wird nicht gezeichnet, kein HUD.
  „Drücke ENTER oder LEERTASTE“ blinkt (0,6 s weiß, 0,4 s halbtransparent). Die Steuerungshilfe ist
  wörtlich wie im Prototyp, auch mit X/F und M. Die Highscore-Zeile fehlt, solange er 0 ist.
- **Level-Intro** — dunkler Balken (#000b, y 202, 120 px hoch), Levelname in Akzentfarbe (34 px),
  Einzeiler weiß (17 px). Beides kommt aus der Level-Datei (`name`, `sub`). Einblenden 0,33 s, voll
  sichtbar bis 2,17 s, Ausblenden bis 2,5 s. Beim Wegdrücken verschwindet er sofort.
- **Pause** — Abdunklung 0,6, „PAUSE“ 48 px weiß, darunter der Text 16 px #ccc.
- **Level geschafft** — wie in Slice 3, aber mit der Zeile „Zeitbonus: +N   Score: S“ (gelb). Der
  Score enthält schon die 500 und den Bonus. Das Terminal zeigt ✓ statt `>_`, dazu 40 Partikel in
  der Akzentfarbe. Hinweis „ENTER: Abschluss“ (blinkt), weil Level 1 vorerst das letzte Level ist.
- **Game Over** — ersetzt den Platzhalter aus Slice 3. Der Score ist hier noch nicht halbiert.

## Rules & edge cases

- **Spielstart** — ENTER, Leertaste, ↑ oder W auf dem Titelbild, ohne Wartezeit. Ein neues Spiel
  setzt immer alles zurück: 3 Leben, Score 0, Tokens 0, Checkpoint grau.
- **Intro** — Die Welt läuft (Bugs laufen), aber Claudia bewegt sich nicht und kann nicht verletzt
  werden. Die Level-Zeit läuft nicht. Pause ist im Intro nicht möglich. Die Taste zum Wegdrücken
  löst keinen Sprung aus.
- **Pause** — nur beim Spielen (nicht in Intro, Todesbalken, Level geschafft, Game Over, Titel).
  Rein mit P oder ESC, raus mit P, ESC oder ENTER. Leertaste, ↑, W und alle anderen Tasten wirken
  nicht. In der Pause steht alles: Claudia, Bugs, Partikel, Kamera und Level-Zeit. Nur reine
  Zeichen-Animationen dürfen weiterlaufen (wie im Prototyp).
- **Tab-Wechsel** — Wird der Tab beim Spielen verlassen, geht das Spiel in die Pause. In allen
  anderen Zuständen bleibt es wie in Slice 1 und 3: Nach der Rückkehr springt nichts vor.
- **Level-Zeit** — zählt nur beim Spielen. Sie startet bei 0, wenn das Level beginnt (auch bei
  „Level nochmal“), und läuft nach einem Tod weiter.
- **Zeitbonus** — max(0, abgerundet((240 − Level-Zeit in s) × 5)). Ab 240 s gibt es 0. Dazu
  immer +500.
- **Ziel** — Claudia steht still, die Bugs laufen weiter, Kollisionen sind aus. Eingaben wirken
  erst nach 1,2 s. Dann führen ENTER, Leertaste, ↑ oder W zum Titelbild (siehe Decisions).
- **Game Over** — Eingaben wirken erst nach 1,2 s. Das Spiel steht.
  - ENTER, Leertaste, ↑ oder W: dasselbe Level von vorn, mit Intro. 3 Leben, Score halbiert und
    abgerundet (z. B. 1235 → 617). Alle Bugs und Tokens wieder da, Checkpoint grau, Level-Zeit 0.
    Der **Token-Zähler bleibt**. Wer wieder Game Over geht, wird erneut halbiert.
  - ESC oder P: zum Titelbild. Auf dem Titel steht der Highscore. Ein neuer Start beginnt bei 0.
- **Highscore speichern** — nur in zwei Momenten: beim Übergang zum Game Over (mit dem vollen Score,
  vor dem Halbieren) und beim „Abschluss“ nach Level 1. Gespeichert wird nur, wenn der Score höher
  ist als der bisherige. Verlässt man die Seite mitten im Spiel, wird nichts gespeichert.
- **Game-Over-Anzeige** — „Highscore: Y“ zeigt schon den neuen Wert, wenn gerade ein Rekord
  aufgestellt wurde.
- **Nichts gespeichert** — Beim allerersten Besuch ist der Highscore 0, und die Zeile fehlt auf dem
  Titelbild.
- **Speicher blockiert** — Kann der Browser nichts lesen oder schreiben, läuft das Spiel trotzdem
  ganz normal, nur ohne gespeicherten Highscore. Kein Absturz, kein Einfrieren (im Prototyp hätte
  es beides gegeben).
- **Seltsamer gespeicherter Wert** — Steht im Speicher etwas, das keine gültige Zahl ist, gilt der
  Highscore als 0.
- **Taste festhalten** — Ein gehaltener Knopf zählt nur einmal. Wer ENTER auf dem Titel gedrückt
  hält, überspringt nicht automatisch auch das Intro.
- **Todesbalken** — wie in Slice 3. Überspringen nur mit ENTER, nicht mit der Leertaste.

## Out of scope

- Abspann „ALLE TASKS ERLEDIGT! 🎉“ und „NEUER HIGHSCORE!“ (Slice 9)
- Musik, Geräusche, Taste M und „Ton aus (M)“, Musikstopp in der Pause (Slice 5). Die Titelseite
  nennt M und X/F trotzdem schon.
- Prompt-Kanone (Slice 6), Feedback-Frage im Todesbalken (Slice 7)
- „ENTER: nächster Task“ und der Wechsel in Level 2 (Slice 8)
- Lila Antenne der Titel-Figur nach dem Doppelsprung (Slice 8)
- Touch-Knöpfe und Tippen statt ENTER (Slice 10)
- Weiches Nachgleiten der Kamera (bleibt wie in Slice 1 und 3 weggelassen)

## Decisions already made

Settled during the interview — the plan must not ask these again.

- **Prototyp als Quelle** — Alles aus `game.html`, eingepflegt in `docs/prototype-reference.md`,
  Abschnitt 9. Die Übergabedatei `prototype-screens.md` wurde danach gelöscht.
- **Nach Level 1 zum Titel** — „ENTER: Abschluss“ führt zum Titelbild, und dabei wird der
  Highscore gespeichert. Sobald es Level 2 gibt (Slice 8), geht es dorthin weiter, und erst nach
  dem letzten Level kommt der Abspann (Slice 9). Abgelehnt: ein Platzhalter-Abspann (wird später
  ohnehin ersetzt) und „Level 1 nochmal“ (kein echtes Ende, Highscore nur bei Game Over).
- **Automatische Pause beim Tab-Wechsel** — bewusste Abweichung vom Prototyp, nur beim Spielen.
- **Pause-Tasten wie im Prototyp** — P/ESC rein, P/ESC/ENTER raus, Leertaste nicht.
- **P führt im Game Over auch zum Titel** — wie im Prototyp, obwohl dort nur ESC steht.
- **Token-Zähler bleibt bei „Level nochmal“** — wie im Prototyp.
- **Highscore mit vollem Score** — Er wird vor dem Halbieren verglichen und gespeichert.
- **Steuerungshilfe komplett** — Die Titelseite nennt alle Tasten, auch die erst später wirkenden.
- **Umbenennung** — „CLAUDIA“, „Hilf Claudia, …“, „Claudia denkt nach...“.
- **Speicher blockiert** — Das Spiel läuft weiter, statt wie der Prototyp abzustürzen
  (design.md, States).
- **Slice-3-Platzhalter ersetzt** — ENTER am Ziel startet nicht mehr Level 1 neu, und der
  Game-Over-Platzhalter wird zum echten Game Over.

## Acceptance criteria

- [ ] Beim Öffnen der Seite sehe ich das Titelbild: „CLAUDIA“ in Orange, „im RAM-Dschungel“, eine große hüpfende Claudia, blinkend „Drücke ENTER oder LEERTASTE“, die Steuerungshilfe und „Hilf Claudia, …“. Dahinter zieht Level 1 abgedunkelt vorbei, und oben ist keine Anzeige.
- [ ] Beim allerersten Besuch fehlt die Zeile „Highscore“.
- [ ] ENTER, Leertaste, ↑ oder W startet das Spiel. Ein Balken zeigt „Level 1: RAM-Dschungel“ und „Spring auf Bugs, um sie zu fixen. Sammle Tokens!“ und blendet dann aus. Die Bugs laufen, Claudia steht still. Oben steht x3, Tokens 0, Score 0.
- [ ] Drücke ich im Intro kurz nach dem Start ENTER oder die Leertaste, ist es sofort weg, und Claudia springt dabei nicht.
- [ ] Mit P beim Spielen steht alles still, und ich sehe „PAUSE“ und „Claudia denkt nach... (P zum Weiterspielen)“. P, ESC oder ENTER spielen weiter, die Leertaste nicht. ESC pausiert ebenfalls.
- [ ] Wechsle ich beim Spielen in einen anderen Tab und komme zurück, steht das Spiel in der Pause.
- [ ] Am OUTPUT-Terminal erscheint „Task erfolgreich abgeschlossen ✓“, darunter „Zeitbonus: +N   Score: S“. Der Score ist um 500 + N gestiegen, und je schneller ich war, desto größer ist N. Das Terminal zeigt ✓. Nach gut 1 s erscheint „ENTER: Abschluss“.
- [ ] ENTER führt danach zum Titelbild, auf dem jetzt „Highscore: S“ steht.
- [ ] Nach dem letzten Leben erscheint „KONTEXTFENSTER VOLL“ mit „Score: X   Highscore: Y“. Ist X ein neuer Rekord, ist Y = X. Nach gut 1 s erscheinen „ENTER: Level nochmal versuchen (Score halbiert)“ und „ESC: zurück zum Hauptmenü“.
- [ ] ENTER zeigt wieder das Intro. Danach habe ich x3, den halben Score (abgerundet) und denselben Token-Zähler, und die Diskette ist grau.
- [ ] ESC (oder P) im Game Over führt zum Titelbild. Ein neuer Start beginnt bei Score 0 und Tokens 0.
- [ ] Lade ich die Seite neu, steht der Highscore weiter auf dem Titelbild.
- [ ] Ein niedrigerer Score überschreibt den Highscore nicht.

Automatisch getestet: Zeitbonus-Formel (auch 0 ab 240 s), Halbieren mit Abrunden, Level-Zeit
läuft nicht in Intro, Pause und Todesbalken, blockierter oder ungültiger Speicher.

## References

- docs/product.md — Slice 4
- docs/prototype-reference.md — Abschnitt 9 (alle Bildschirme, Zustände, Tasten, Highscore), Abschnitt 8 (Zeichnung von Level geschafft und Game Over, `drawRobot`, `text`/`panel`/`blinkCol`)
- docs/design.md — Screens „Titelbild“ und „Overlays“, Navigation, States (Empty, Error)
- docs/architecture.md — Data (Highscore im Browser)
- docs/agents/specs/2026-10-01-tokens-bugs-leben.md — Ziel und Game-Over-Platzhalter, die hier ersetzt werden
