---
date: 2026-10-01
topic: "Online spielbar"
slice: 2
tags: [spec]
status: ready
---

# SPEC: Online spielbar

## Goal

Das Spiel hat eine feste, öffentliche Internet-Adresse, die man an Freunde schicken kann. Nach jeder
hochgeladenen Änderung ist dort automatisch die neue Version zu sehen, aber nur, wenn Tests und Bau
fehlerfrei durchlaufen. Gleichzeitig wird die Figur überall von „Claude“ in **Claudia** umbenannt,
damit das Projekt von Anfang an sauber öffentlich ist.

## User story

Als Hobby-Entwicklerin bzw. Hobby-Entwickler möchte ich einen Link haben, der immer die neueste
funktionierende Version meines Spiels zeigt, damit ich es Freunden schicken kann, ohne mich jedes
Mal selbst um das Veröffentlichen zu kümmern, und ohne dabei private Daten preiszugeben.

## Flow

**Einmalige Einrichtung** (Teil dieses Slices; der Plan muss jeden Schritt klick-für-klick erklären,
siehe Decisions):

1. Das private GitHub-Konto gibt es schon (angelegt während der Spec, Tarif Free).
2. Zwei-Faktor-Anmeldung bei GitHub einschalten.
3. Bei GitHub die Ersatz-E-Mail-Adresse (`…@users.noreply.github.com`) einrichten und die Sperre
   „Block command line pushes that expose my email“ einschalten.
4. Auf dem Mac Git einrichten, mit Benutzername und der Ersatz-E-Mail.
5. Den Projektordner zu einem Git-Projekt machen. Vor dem **ersten** Hochladen wird geprüft, welche
   Dateien mitgehen (siehe Rules).
6. Ein **öffentliches** Projekt `claudia-im-ram-dschungel` bei GitHub anlegen und den Code hochladen.
7. GitHub Pages so einstellen, dass der GitHub-Roboter (GitHub Actions) veröffentlicht.

**Danach bei jeder Änderung:**

1. Ich ändere etwas am Spiel und lade es zu GitHub hoch („push“ in den Hauptzweig).
2. Der GitHub-Roboter startet automatisch: Typprüfung und Tests → Spiel bauen → veröffentlichen.
3. Bei GitHub sehe ich beim Eintrag ein grünes ✓ (geklappt) oder ein rotes ✗ (Fehler).
4. Nach einigen Minuten (bis zu 10) zeigt der Link die neue Version. Falls nicht: hart neu laden
   mit **Cmd + Shift + R**.

**Spielerin/Spieler:**

1. Öffnet `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/`.
2. Sieht sofort Level 1 wie in Slice 1 und kann Claudia mit der Tastatur steuern.

## Screen

Am Spiel selbst ändert sich nichts außer dem Namen im Browser-Tab.

```
┌─ Claudia im RAM-Dschungel ─────────────────────────────────────────┐
│ https://<dein-github-name>.github.io/claudia-im-ram-dschungel/     │
├────────────────────────────────────────────────────────────────────┤
│   ┌──────────────────────────────────────────────┐                 │
│   │  🤖                                           │                 │
│   │        ════                                   │                 │
│   │ ▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       [>_] OUTPUT│                 │
│   └──────────────────────────────────────────────┘                 │
└────────────────────────────────────────────────────────────────────┘

GitHub, Projektseite → Liste der Änderungen:
  ✓ Text geändert            (veröffentlicht)
  ✗ Test absichtlich kaputt  (nicht veröffentlicht, E-Mail kommt)
```

- **Tab-Titel** — „Claudia im RAM-Dschungel“
- **Link** — `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/`; der echte
  Benutzername wird erst beim Umsetzen eingetragen
- **Keine Versionsnummer** im Spiel; das Aussehen bleibt wie in design.md

## Rules & edge cases

- **Wann veröffentlicht wird** — bei jedem Hochladen in den Hauptzweig, automatisch. Es gibt keinen
  Extra-Knopf.
- **Tests oder Bau schlagen fehl** — es wird nichts veröffentlicht, die alte Version bleibt online.
  Rotes ✗ bei GitHub, E-Mail an die Kontoadresse.
- **Neue Version noch nicht sichtbar** — GitHub speichert die Seite bis zu ~10 Minuten zwischen.
  Cmd + Shift + R lädt neu.
- **Handy** — der Link öffnet das Spiel und es passt auf den Bildschirm. Steuern geht dort noch
  nicht (Slice 10).
- **Falsche Adresse** (z. B. Tippfehler im Link) — die normale „404“-Seite von GitHub. Keine eigene
  Fehlerseite.
- **Nichts Geheimes hochladen** — das Projekt ist öffentlich, und auch gelöschte Dateien bleiben in
  der Versionsgeschichte sichtbar. Nie hochgeladen werden: `.DS_Store`, `dist`, `node_modules`,
  `.claude/settings.local.json` und sonstige persönliche Einstellungen, Passwörter oder Schlüssel.
  Auch die Kurs-Werkzeuge (`.agents/`, `.claude/skills/`, `skills-lock.json`) bleiben nur auf dem
  Mac, weil sie Kursmaterial und eine interne Firmen-Adresse enthalten (beim Planen entschieden).
  Das wird vor dem ersten Hochladen geprüft.
- **E-Mail-Adresse** — alle Änderungen tragen nur die GitHub-Ersatz-E-Mail. Die Sperre bei GitHub
  verhindert das Hochladen, falls doch die private Adresse drinsteht.
- **Konto-Sicherheit** — Zwei-Faktor-Anmeldung ist an, damit niemand fremde Inhalte unter dem Link
  ausliefern kann.
- **Wer darf ändern** — nur die Kontoinhaberin bzw. der Kontoinhaber. Andere können den Code nur
  ansehen.
- **Kosten** — keine. Öffentliches Projekt, GitHub Pages und GitHub Actions sind dafür kostenlos.
- **Umbenennung Claude → Claudia** — betrifft den Tab-Titel, alle Namen im Code (z. B. `drawClaude`
  → `drawClaudia`, Kommentare, Tests) und alle Dokumente, auch die Spec und den Plan von Slice 1.
  Aus „er“ wird „sie“. Den alten Namen erwähnen dürfen nur `docs/prototype-reference.md` (der
  Prototyp heißt so), der Satz dazu in `docs/product.md` sowie die Spec und der Plan dieses Slices,
  wo sie die Umbenennung beschreiben. Product.md, design.md und architecture.md sind bereits umbenannt.
  „Claude Code“ als Name des Werkzeugs (z. B. der Ordner `.claude/`) bleibt.

## Out of scope

- Eigene Domain (z. B. `ram-dschungel.de`)
- Besucherstatistik, Tracking
- Vorschau-Links für Entwürfe oder andere Zweige
- Veröffentlichung des alten Prototyps `game.html`
- Lizenz-Datei (vorerst keine: ansehen ja, übernehmen nein)
- Hinweis „Fan-Projekt, nicht von Anthropic“ (durch die Umbenennung nicht mehr nötig)
- Neues, weibliches Aussehen der Figur → Slice 11
- Titelbild mit „CLAUDIA“ → Slice 4
- Handy-Steuerung → Slice 10

## Decisions already made

- **Privates GitHub-Konto statt Firmen-GitLab** — persönliches Lernprojekt, öffentlich erreichbar
  und passend zu architecture.md. Das Konto wurde während der Spec angelegt.
- **Benutzername bleibt in der Spec ein Platzhalter** — die Nutzerin bzw. der Nutzer trägt ihn
  beim Umsetzen selbst ein (Datenschutz-Wunsch).
- **Projekt öffentlich** — nötig für kostenloses GitHub Pages. Privat (GitHub Pro, ~4 €/Monat)
  wurde abgelehnt.
- **Link `claudia-im-ram-dschungel`** — ausdrücklich gewählt. Die Empfehlung `ram-dschungel` (ohne
  Figur) wurde abgelehnt.
- **Name „Claudia“, kleine Roboterin** — statt „Claude“, weil der Name im öffentlichen Projekt zu
  heikel war. Die orange Titelfarbe #D97757 bleibt und heißt „Titel-Orange“.
- **Aussehen bleibt in diesem Slice** — nur Name und „sie“. Das neue Aussehen ist Slice 11.
- **Keine Versionsnummer im Spiel** — Prüfung über eine sichtbare Änderung und das ✓ bei GitHub.
- **Ersatz-E-Mail, E-Mail-Sperre und Zwei-Faktor-Anmeldung** gehören zu diesem Slice.
- **Die Einrichtung auf dem Mac gehört zu diesem Slice.** Die Nutzerin bzw. der Nutzer ist keine
  Entwicklerin bzw. kein Entwickler: Der Plan muss jeden Schritt (Terminal öffnen, Befehle, Klicks
  bei GitHub) einzeln erklären und sagen, was man danach sehen sollte.

## Acceptance criteria

- [ ] Wenn ich den Link am Mac öffne, sehe ich Level 1, kann Claudia mit der Tastatur laufen und
      springen lassen, und im Tab steht „Claudia im RAM-Dschungel“.
- [ ] Wenn ich den Link auf dem Handy öffne, sehe ich das Spiel passend auf dem Bildschirm (ohne
      Steuerung).
- [ ] Wenn ich etwas Sichtbares ändere und hochlade, sehe ich bei GitHub nach ein paar Minuten ein
      grünes ✓, und spätestens nach 10 Minuten (plus Cmd + Shift + R) sehe ich die Änderung unter
      dem Link.
- [ ] Wenn ich absichtlich einen kaputten Test hochlade, sehe ich bei GitHub ein rotes ✗, bekomme
      eine E-Mail, und unter dem Link läuft weiter die alte Version.
- [ ] Wenn ich mein Projekt auf github.com öffne, sehe ich keine `.DS_Store`, keinen `dist`- und
      keinen `node_modules`-Ordner.
- [ ] Wenn ich mein Projekt auf github.com öffne, sehe ich keine Kurs-Werkzeuge (`.agents`,
      `.claude/skills`, `skills-lock.json`). (beim Planen hinzugekommen)
- [ ] Wenn ich mich bei GitHub einlogge, fragt GitHub nach dem Code vom Handy, und in den
      GitHub-E-Mail-Einstellungen ist „Block command line pushes that expose my email“ eingeschaltet.

## References

- docs/product.md — Slice 2 (und neuer Slice 11)
- docs/architecture.md — Technology: Veröffentlichen, Code-Ablage
- docs/design.md — States (Loading), Handy
- docs/agents/specs/2026-10-01-claudia-laeuft-durch-level-1.md — der Stand, der online gehen soll
