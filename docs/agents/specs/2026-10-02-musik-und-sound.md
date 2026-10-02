---
date: 2026-10-02
topic: "Musik & Sound"
slice: 5
tags: [spec]
status: done
---

# SPEC: Musik & Sound

## Goal

Das Spiel bekommt seinen Ton: Titelbild und Level 1 spielen die Chiptune-Musik „jungle“, und die
Aktionen, die es schon gibt, machen ihre 8-Bit-Geräusche. Mit M schaltet man Musik und Geräusche
aus und an, und diese Einstellung bleibt nach dem Neuladen erhalten. Alles klingt genau wie im
Prototyp.

## User story

Als Spielerin oder Spieler möchte ich Musik und Geräusche hören und sie mit einer Taste
abschalten können, damit sich das Spiel lebendig anfühlt und ich trotzdem leise spielen kann, auch
beim nächsten Besuch.

## Flow

1. Ich öffne die Seite. Das Titelbild ist still, weil Browser Ton erst nach einer Eingabe erlauben.
2. Ich drücke eine Spieltaste (z. B. ←) oder klicke auf das Spielbild. Ab jetzt läuft die Musik
   „jungle“. Der Klick macht sonst nichts, er startet kein Spiel.
3. Ich starte mit ENTER. Die Musik läuft ohne Unterbrechung weiter ins Intro und ins Spiel, denn
   Titelbild und Level 1 haben dasselbe Stück. War ENTER meine erste Taste, beginnt die Musik genau
   jetzt.
4. Beim Spielen machen Sprung, Token, Bug plattmachen, Checkpoint, Tod und Ziel ihr Geräusch.
5. **Pause** (P, ESC oder Tab-Wechsel): Die Musik stoppt. Beim Weiterspielen geht sie an derselben
   Stelle weiter.
6. **Tod:** Das Tod-Geräusch erklingt über der weiterlaufenden Musik.
7. **Level geschafft:** Die Sieges-Fanfare erklingt über der weiterlaufenden Musik. Mit ENTER geht
   es zum Titelbild, und die Musik läuft dort einfach weiter.
8. **Game Over:** Die Musik verstummt, und das traurige Game-Over-Geräusch erklingt. „Level nochmal“
   und „Hauptmenü“ starten die Musik jeweils von vorn.
9. **M** (in jedem Bildschirm): Sofort ist alles still, und oben rechts steht „Ton aus (M)“. Noch
   einmal M: Der Hinweis verschwindet, und die Musik läuft an der Stelle weiter, wo sie aufgehört
   hat.
10. Lade ich die Seite mit ausgeschaltetem Ton neu, steht schon auf dem Titelbild „Ton aus (M)“,
    und es bleibt still, bis ich M drücke.

## Screen

```
Spiel, Ton aus
┌──────────────────────────────── 960 × 544 ─────────────────────────────────┐
│ ╭ 🤖 x3   Tokens 12   Score 420 ╮                          RAM-Dschungel  │
│                                                              Ton aus (M)  │
│   🤖              🐞            ◆◆◆                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└────────────────────────────────────────────────────────────────────────────┘

Titelbild, Ton aus (neu)
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

- **Hinweis „Ton aus (M)“** — wie im Prototyp: 12 px, fett, Farbe #fff8, rechtsbündig bei x 940,
  Grundlinie y 58 (direkt unter dem Levelnamen), mit Schatten. Sichtbar in Intro, Spiel, Pause, Tod,
  Level geschafft und Game Over (in Pause, Level geschafft und Game Over unter der Abdunklung, also
  schwächer). Neu: an derselben Stelle auch auf dem Titelbild.
- **Musik** — Stück `jungle` (132 BPM, Bass, Melodie, Schlagzeug), in Schleife.
- **Geräusche** — 8 Stück:

  | Geräusch | Wann |
  | -------- | ---- |
  | `jump` | Claudia springt |
  | `coin` | Token eingesammelt |
  | `oneup` | jeder 100. Token (zusätzlich zu `coin`, gleichzeitig) |
  | `stomp` | Bug von oben plattgemacht |
  | `hurt` | Claudia stirbt (Bug-Berührung oder Abgrund) |
  | `save` | Checkpoint (Diskette) aktiviert |
  | `win` | Ziel (OUTPUT-Terminal) erreicht |
  | `over` | Übergang zum Game Over |

Alle Töne, Noten, Tempi, Wellenformen, Lautstärken und Zeitpunkte stehen in
`docs/prototype-reference.md`, Abschnitt 10.

## Rules & edge cases

- **Klang wie im Prototyp** — gleiche Töne, Tempo und Lautstärken (Abschnitt 10). Keine
  Audiodateien, alles wird im Browser erzeugt.
- **Ton-Start** — Der Ton startet mit der ersten Spieltaste (←, →, A, D, ↑, W, Leertaste, ENTER,
  P, ESC, M, X, F) oder mit einem Mausklick auf das Spielbild (neu). Vorher ist alles still. Ist
  M die erste Taste, startet der Ton und ist sofort aus.
- **Welche Musik wann** — Titelbild, Intro, Spiel, Tod und Level geschafft: `jungle`. Game Over:
  keine Musik. Ein Wechsel zum selben Stück lässt die Musik nahtlos weiterlaufen (Titel → Spiel,
  Level geschafft → Titel). Nach Game Over beginnt die Musik von vorn („Level nochmal“ und
  „Hauptmenü“). Der Wiedereinstieg nach einem Tod ändert die Musik nicht.
- **Pause** — Die Musik stoppt und läuft beim Weiterspielen an derselben Stelle weiter. Das gilt
  auch für die automatische Pause beim Tab- oder Fensterwechsel. Verlässt man den Tab in einem
  anderen Bildschirm (z. B. Titelbild), stoppt die Musik ebenfalls und läuft bei der Rückkehr an
  derselben Stelle weiter.
- **M** — wirkt in jedem Bildschirm: Titel, Intro, Spiel, Pause, Todesbalken, Level geschafft, Game
  Over. Es schaltet Musik und Geräusche gemeinsam. M löst sonst nichts aus (kein Spielstart, kein
  Wegdrücken des Intros, kein Weiterspielen). Gehaltenes M zählt nur einmal.
- **Sofort still** — M bricht auch gerade klingende Töne sofort ab (bewusste Abweichung, im
  Prototyp klangen sie zu Ende).
- **Wieder an** — Die Musik läuft an der Stelle weiter, an der sie aufgehört hat, nicht von vorn.
  Während der Ton aus ist, rückt die Musik nicht vor. Geräusche, die während „Ton aus“ ausgelöst
  wurden, werden nicht nachgeholt.
- **Gespeichert** — „Ton aus/an“ wird bei jedem Druck auf M im Browser gespeichert und beim Laden
  übernommen (bewusste Abweichung, der Prototyp vergaß es). Beim allerersten Besuch ist der Ton an.
- **Kein Geräusch** — für Pause, Menü, Intro, Spielstart und Wiedereinstieg (wie im Prototyp).
- **Zwei Ereignisse gleichzeitig** — Jedes Ereignis spielt sein Geräusch, auch übereinander (z. B.
  zwei Bugs zugleich, oder `coin` und `oneup` beim 100. Token).
- **Speicher blockiert** — M funktioniert trotzdem, die Einstellung wird nur nicht gespeichert. Kein
  Absturz.
- **Seltsamer gespeicherter Wert** — gilt als „Ton an“.
- **Ton im Browser nicht möglich** — Das Spiel läuft ganz normal ohne Ton weiter, ohne Fehlermeldung.

## Out of scope

- Musik von Level 2–4 (`cache`, `cave`, `volcano`) und Geräusche für Doppelsprung und bröckelnde
  Register (Slice 8)
- Boss-Musik (`boss`) und Boss-Geräusche (`thud`, `throw`, `bossHit`, `boom`), das Öffnen des Ziels
  nach dem Boss (`power`) und die zweite Fanfare beim Abspann (Slice 9)
- Geräusche der Prompt-Kanone (`shoot`, `ratelimit`, `poof`) (Slice 6)
- Geräusche für Firewall (`power`, `shield`), Prompt-Injector (`inject`), Halluzinations-Plattformen
  (`hallu`) und die Feedback-Frage (`blip`) (Slice 7)
- Touch-Ton-Start durch Tippen und ein Ton-Knopf am Handy (Slice 10, Ton-Knopf gar nicht geplant)
- Lautstärkeregler

## Decisions already made

Settled during the interview — the plan must not ask these again.

- **Prototyp als Quelle** — Alles aus `game.html`, eingepflegt in `docs/prototype-reference.md`,
  Abschnitt 10. Die Übergabedatei `prototype-audio.md` wurde danach gelöscht.
- **Nur, was es schon gibt** — Slice 5 enthält nur die Musik von Level 1/Titel und die 8 Geräusche
  für Dinge, die es schon gibt. Der Rest kommt mit den Slices 6–9 (dort in product.md vermerkt).
  Abgelehnt: alles auf einmal (vieles wäre jetzt nicht hör- oder testbar). Ein eigener späterer
  „Ton-Slice“ ist darum nicht nötig.
- **1UP-Geräusch gehört dazu** — Durch das Super-Mario-Zurücksetzen sind 100 Tokens in Level 1
  schon erreichbar.
- **„Ton aus“ wird gespeichert** — wie in product.md verlangt, Abweichung vom Prototyp.
- **Hinweis auch auf dem Titelbild** — Abweichung vom Prototyp, weil man sonst nach dem Neuladen
  nicht wüsste, warum es still ist (design.md angepasst).
- **M macht sofort still** — Abweichung vom Prototyp, wo laufende Töne zu Ende klangen.
- **Mausklick startet den Ton** — Abweichung vom Prototyp (dort nur Tasten und Touch), design.md
  angepasst. Der Klick macht sonst nichts.
- **Musik-Verhalten wie im Prototyp** — nahtlos bei gleichem Stück, Stopp in der Pause mit
  Fortsetzen an derselben Stelle, weiterlaufend bei Tod und Level geschafft, aus bei Game Over,
  danach von vorn.
- **Kein Lautstärkeregler, kein Ton-Knopf am Handy.**

## Acceptance criteria

- [x] Ich öffne die Seite: Das Titelbild ist still. Klicke ich auf das Spielbild oder drücke z. B. ←, startet die Level-1-Musik.
- [x] Ich starte mit ENTER: Die Musik läuft ohne Unterbrechung weiter ins Intro und ins Spiel.
- [x] Springen, Token sammeln, Bug plattmachen, Checkpoint berühren, Sterben (Bug oder Abgrund) und Ziel erreichen machen jeweils ihr Geräusch wie im Prototyp.
- [x] Mit P (oder Tab-Wechsel) stoppt die Musik. Beim Weiterspielen geht sie an derselben Stelle weiter.
- [x] Beim Tod läuft die Musik weiter.
- [x] Beim Game Over verstummt die Musik, und das traurige Game-Over-Geräusch erklingt. „Level nochmal“ oder „Hauptmenü“ starten die Musik von vorn.
- [x] Nach „Level geschafft“ und ENTER läuft die Musik auf dem Titelbild einfach weiter.
- [x] M beim Spielen: Sofort ist alles still, und oben rechts steht „Ton aus (M)“. Springen macht kein Geräusch mehr.
- [x] Nochmal M: Der Hinweis verschwindet, und die Musik läuft an der Stelle weiter, wo sie aufgehört hat.
- [x] M wirkt auch auf dem Titelbild, in Pause, Todesbalken, Level geschafft und Game Over. Auf dem Titelbild steht dann auch „Ton aus (M)“.
- [x] Ton aus, Seite neu laden: Auf dem Titelbild steht „Ton aus (M)“, und auch nach einem Klick bleibt alles still.
- [x] Ton wieder an, neu laden: Der Hinweis fehlt, und die Musik startet nach dem ersten Klick bzw. der ersten Taste.

Automatisch getestet (in Level 1 schwer zu erreichen): Beim 100. Token erklingt zusätzlich das
1UP-Geräusch. Blockierter oder seltsamer Speicher führt zu „Ton an“ ohne Absturz.

## References

- docs/product.md — Slice 5 (und die Ton-Hinweise in Slice 6–9)
- docs/prototype-reference.md — Abschnitt 10 (Ton und Musik: `tone()`, `SND`, `TRACKS`, `tickMusic()`, Stummschalten, Besonderheiten), Abschnitt 9.9 (Tastenzuordnung)
- docs/design.md — States (Loading, Ton aus), Style (Ton)
- docs/architecture.md — Ton & Musik, Speicher, Data
- docs/agents/specs/2026-10-01-spielablauf-bildschirme.md — Bildschirme und Zustände, an denen die Musik hängt
