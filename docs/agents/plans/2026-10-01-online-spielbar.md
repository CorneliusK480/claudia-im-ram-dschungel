---
date: 2026-10-01
topic: "Online spielbar"
spec: "docs/agents/specs/2026-10-01-online-spielbar.md"
tags: [plan, veroeffentlichen, github, github-pages, github-actions, umbenennung]
status: in-progress
---

# PLAN: Online spielbar

Dieser Plan setzt Slice 2 aus `docs/product.md` um. Grundlage ist die Spec
[`docs/agents/specs/2026-10-01-online-spielbar.md`](../specs/2026-10-01-online-spielbar.md).
Das Spiel bekommt einen festen, öffentlichen Link. Nach jedem Hochladen wird es automatisch geprüft,
gebaut und veröffentlicht. Außerdem wird die Figur überall von „Claude“ in **Claudia** umbenannt.

## What you'll be able to do

Du schickst Freunden den Link `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/`, und
sie spielen Level 1 sofort im Browser. Wenn du etwas am Spiel änderst, klickst du in GitHub Desktop
auf *Commit* und *Push*. Ein paar Minuten später ist die neue Version unter dem Link zu sehen, aber
nur, wenn alle Tests grün sind. Bei einem Fehler siehst du bei GitHub ein rotes ✗, bekommst eine
E-Mail, und die alte Version bleibt online. Im Browser-Tab steht „Claudia im RAM-Dschungel“.

```
Dein Mac                         GitHub (öffentlich)                        Freunde
┌──────────────────┐  Push   ┌────────────────────────────────┐        ┌───────────────────┐
│ GitHub Desktop   │ ──────▶ │ claudia-im-ram-dschungel       │        │ Claudia im RAM-…  │
│ ☑ src/texts.ts   │         │ Roboter: Tests → Bauen         │ ──✓──▶ │ …github.io/claudia│
│ [Commit to main] │         │   ✓ → veröffentlichen          │        │  🤖  ▓▓▓▓  ▓▓▓▓▓  │
│ [Push origin]    │         │   ✗ → nichts, E-Mail an dich   │        └───────────────────┘
└──────────────────┘         └────────────────────────────────┘
```

## Acceptance Criteria

Aus der Spec (unverändert, inklusive des beim Planen ergänzten Kriteriums):

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

## Technical Key Decisions and Tradeoffs

1. **Kurs-Werkzeuge bleiben nur auf dem Mac:** `.agents/`, `.claude/skills/` und `skills-lock.json`
   kommen auf die Ausschluss-Liste (`.gitignore`).
   - Why: `skills-lock.json` enthält eine interne Firmen-Adresse, und die Skills sind
     Kursmaterial. Beides gehört nicht in ein öffentliches Projekt. Lokal funktionieren die
     Werkzeuge weiter.
   - Instead of: mit hochladen. Abgelehnt, weil Firmen-Adresse und Kursmaterial dann dauerhaft
     öffentlich in der Versionsgeschichte stehen würden.
2. **Hochladen mit GitHub Desktop:** Commit und Push laufen über die kostenlose App GitHub Desktop.
   - Why: Klicken statt tippen. Die Anmeldung läuft über den Browser (kein Zugangsschlüssel zum
     Abtippen), man sieht vor jedem Commit jede Datei mit Häkchen, und die Ersatz-E-Mail lässt sich
     dort auswählen.
   - Instead of: Terminal mit `git push` und selbst erzeugtem Zugangsschlüssel. Abgelehnt, weil es
     für Nicht-Entwickler mehr Stolperstellen hat und der Schlüssel abläuft.
3. **Ersatz-E-Mail zusätzlich im Projekt hinterlegt:** Der Agent setzt `user.name` und `user.email`
   in der Git-Einstellung des Projekts (`git config` ohne `--global`). GitHub Desktop setzt sie
   außerdem für den ganzen Mac.
   - Why: Der Agent arbeitet in der Sandbox mit eigener Git-Einstellung. So tragen auch Commits,
     die er später macht, nur die Ersatz-E-Mail und nie eine private Adresse.
   - Instead of: nur die Einstellung in GitHub Desktop. Abgelehnt, weil Commits aus der Sandbox
     dann eine andere Adresse tragen könnten und von der E-Mail-Sperre abgelehnt würden.
4. **Ein Ablauf (Workflow) bei GitHub Actions: Tests → Bauen → Veröffentlichen:** Eine Datei
   `.github/workflows/deploy.yml` mit zwei Schritten (Jobs). Der Job `build` macht `npm ci`,
   `npm test` und `npm run build` (darin steckt die Typprüfung `tsc --noEmit`) und lädt `dist` als
   Pages-Paket hoch. Der Job `deploy` veröffentlicht es und läuft nur, wenn `build` grün war.
   Auslöser ist nur `push` auf `main`. Es gibt kein `workflow_dispatch`, also keinen Extra-Knopf.
   - Why: Das ist der offizielle Weg von GitHub Pages mit Actions. Ein Fehler in Tests oder Bau
     stoppt alles vor dem Veröffentlichen, sodass die alte Version online bleibt.
   - Instead of: einen Zweig `gh-pages` mit fertigen Dateien. Abgelehnt, weil das umständlicher ist
     und gebaute Dateien in die Versionsgeschichte kämen.
5. **Node 24 im Roboter:** `actions/setup-node` mit `node-version: 24` und npm-Cache.
   - Why: Dieselbe Version wie beim Entwickeln (Sandbox: Node 24). So gibt es keine Überraschungen.
   - Instead of: „neueste“ Version. Abgelehnt, weil sich die Version dann unbemerkt ändern kann.
6. **Reihenfolge: Konto schützen → Code hochladen → Pages einstellen → Workflow hochladen:**
   Die Workflow-Datei wird erst angelegt, wenn bei GitHub Pages schon „GitHub Actions“ als Quelle
   eingestellt ist.
   - Why: Sonst schlägt der allererste Lauf fehl (rotes ✗ plus E-Mail), nur weil Pages noch nicht
     eingeschaltet ist. Das wäre verwirrend.
   - Instead of: alles im ersten Push und danach den Lauf neu starten. Abgelehnt aus genau diesem
     Grund.
7. **Am Spiel selbst nur die Umbenennung:** Für das Handy und den Unterordner muss nichts geändert
   werden. `vite.config.ts` hat schon `base: './'`, `main.ts` lädt das Level über
   `import.meta.env.BASE_URL`, und `setupScreen` skaliert auf jede Fenstergröße.
   - Why: Das wurde in Slice 1 schon vorbereitet.
   - Instead of: einen festen `base: '/claudia-im-ram-dschungel/'`. Unnötig, und der Projektname
     wäre dann im Code festgeschrieben.
8. **Auch Dateinamen werden umbenannt:** Spec und Plan von Slice 1 heißen danach
   `…-claudia-laeuft-durch-level-1.md`, `src/render/claude.ts` heißt `claudia.ts`, und der
   Projektname in `package.json` lautet `claudia-im-ram-dschungel`.
   - Why: Die Spec verlangt die Umbenennung überall. Im öffentlichen Projekt sollen auch Dateinamen
     sauber sein.
   - Instead of: nur Inhalte umbenennen. Abgelehnt, weil der alte Name dann in Dateinamen sichtbar
     bliebe.
9. **Prüfung mit Himmelsfarbe und absichtlich kaputtem Test:** Für die „Änderung sichtbar?“-Prüfung
   färbt der Agent den oberen Himmel in `public/levels/level1.json` vorübergehend lila. Danach wird
   die Farbe zurückgesetzt und *gleichzeitig* ein absichtlich kaputter Test hochgeladen. Bleibt der
   Himmel online lila, ist bewiesen, dass bei einem Fehler nichts veröffentlicht wird. Zum Schluss
   wird der kaputte Test entfernt.
   - Why: Die Farbe sieht man sofort beim Öffnen, ohne zu spielen. Die Kombination prüft beide
     Akzeptanzkriterien eindeutig.
   - Instead of: einen Text ändern, den man erst am Levelende sieht. Abgelehnt, weil die Prüfung
     dann jedes Mal ein ganzes Level Spielen kostet.

## Current State

```
Projektordner (Mac, auch in der Sandbox sichtbar)
├── index.html                <title>Claude im RAM-Dschungel</title>
├── package.json              "name": "claude-im-ram-dschungel"   (auch in package-lock.json)
├── vite.config.ts            base: './'  ✓ schon bereit für Unterordner
├── .gitignore                node_modules, dist   (.DS_Store fehlt!)
├── .DS_Store, docs/.DS_Store Mac-Dateien
├── dist/                     alter Bau (gehört nicht ins Projekt)
├── skills-lock.json          enthält eine interne Firmen-Adresse
├── .agents/skills/…          Kurs-Werkzeuge
├── .claude/skills/…          Verknüpfungen auf .agents/skills
├── src/render/claude.ts      drawClaude(…)
├── src/render/renderer.ts    importiert drawClaude
├── src/logic/*.ts, *.test.ts Kommentare/Testnamen mit „Claude“, „he/his“
└── docs/agents/
    ├── specs/2026-10-01-claude-laeuft-durch-level-1.md   ~31× „Claude“, „er“
    ├── plans/2026-10-01-claude-laeuft-durch-level-1.md   ~59× „Claude“, „er“
    └── specs/2026-10-01-online-spielbar.md

Kein Git, kein GitHub-Projekt, keine Veröffentlichung. Testen geht nur lokal mit npm run dev.
```

## Desired End State

```
Projektordner (Git-Projekt, Zweig main)
├── .gitignore                + .DS_Store, persönliche Einstellungen, Kurs-Werkzeuge
├── .github/workflows/deploy.yml   NEU: Tests → Bauen → Veröffentlichen
├── index.html                <title>Claudia im RAM-Dschungel</title>
├── package.json(+lock)       "name": "claudia-im-ram-dschungel"
├── src/render/claudia.ts     drawClaudia(…)
└── docs/agents/{specs,plans}/2026-10-01-claudia-laeuft-durch-level-1.md

github.com/<dein-github-name>/claudia-im-ram-dschungel   (öffentlich)
   │  push auf main
   ▼
GitHub Actions ── build: npm ci → npm test → npm run build → dist hochladen
                     │ grün                 │ rot
                     ▼                      ▼
                  deploy               nichts veröffentlicht, ✗ + E-Mail
                     ▼
https://<dein-github-name>.github.io/claudia-im-ram-dschungel/
```

GitHub-Konto: Zwei-Faktor-Anmeldung an, E-Mail privat (Ersatz-E-Mail), Sperre
„Block command line pushes that expose my email“ an, E-Mail bei fehlgeschlagenen Workflows an.

## Abstractions and Code Reuse

Neuer Spiel-Code entsteht nicht. Es wird nur umbenannt und Konfiguration ergänzt.

- `index.html` – Titel auf „Claudia im RAM-Dschungel“
- `package.json`, `package-lock.json` – `name` auf `claudia-im-ram-dschungel` (im Lockfile an beiden
  Stellen: oben und unter `packages[""]`)
- `src/render/claude.ts` → `src/render/claudia.ts`
  - `drawClaude` → `drawClaudia`, Doc-Kommentar „Claudia as a small robot …“
- `src/render/renderer.ts` – Import und Aufruf `drawClaudia`
- `src/logic/camera.ts`, `src/logic/world.ts` – Kommentare „Claude“ → „Claudia“
- `src/logic/game.test.ts`, `world.test.ts`, `camera.test.ts`, `player.test.ts` – Testnamen und
  Kommentare „Claude“ → „Claudia“, „he/his/him“ → „she/her“
- `docs/agents/specs/2026-10-01-claude-laeuft-durch-level-1.md` → `…-claudia-laeuft-durch-level-1.md`
  - Titel, Text, „er/ihn/ihm/sein“ → „sie/ihr“, wo die Figur gemeint ist
- `docs/agents/plans/2026-10-01-claude-laeuft-durch-level-1.md` → `…-claudia-laeuft-durch-level-1.md`
  - `spec:`-Feld, Links, Dateibaum, Text wie oben
- `docs/agents/specs/2026-10-01-online-spielbar.md` – Verweis unter *References* auf den neuen
  Dateinamen
- `.gitignore` – neue Ausschlüsse (siehe Phase 3)
- `.github/workflows/deploy.yml` – neu (siehe Phase 4)

## Pitfalls

- **„Claude“ darf an einigen Stellen bleiben:** in `docs/prototype-reference.md` (der Prototyp
  heißt so), in `docs/product.md` im Satz „Im Prototyp hieß die Figur noch ‚Claude‘“, in der
  Umbenennungs-Regel dieser Spec und in diesem Plan sowie überall, wo „Claude Code“ das Werkzeug
  meint (`.claude/`, `CLAUDE.md`, „in Claude Code“). Nicht blind ersetzen, sondern die
  Suchergebnisse einzeln durchgehen.
- **„er“ → „sie“ nicht per Suchen-Ersetzen:** „er“ steckt in vielen Wörtern („Spieler“, „wieder“)
  und kann auch Boden, Abgrund oder Sprung meinen. Nur ändern, wo die Figur gemeint ist. Das
  betrifft auch die Formen „ihn“, „ihm“, „sein/seine“ und im Code-Englisch „he/his/him“.
- **Lockfile von Hand mitändern:** `name` steht in `package-lock.json` zweimal (oben und unter
  `packages[""]`). Beide Zeilen von Hand ändern, nicht `npm install` laufen lassen. So ändert sich
  sonst nichts am Lockfile, und es gibt noch kein Git zum Vergleichen.
- **Plattform-Pakete im Lockfile:** Der Roboter läuft auf Linux x64 und braucht
  `@rolldown/binding-linux-x64-gnu`. Es steht schon in `package-lock.json` und darf nicht
  verschwinden, sonst schlägt `npm ci` im Roboter fehl.
- **Mac und Sandbox teilen sich `node_modules`:** Die Sandbox ist Linux (arm64), der Mac macOS. Wer
  zuletzt `npm install` ausgeführt hat, bestimmt, welche Bau-Bausteine darin liegen. Deshalb führt
  der Agent vor seinen automatischen Prüfungen `npm ci` in der Sandbox aus, und die Nutzerin bzw. der
  Nutzer führt vor `npm run dev` auf dem Mac `npm install` aus (steht so in den manuellen Prüfungen).
- **`.DS_Store` steht noch nicht in `.gitignore`.** Die Ausschluss-Liste muss fertig sein, *bevor*
  `git add` oder der erste Commit in GitHub Desktop passiert. Was einmal hochgeladen ist, bleibt in
  der Versionsgeschichte.
- **`.claude/skills/` enthält Verknüpfungen (Symlinks).** Der Eintrag `.claude/skills/` schließt den
  ganzen Ordner aus. Mit `git status --ignored` bzw. `git add --dry-run .` prüfen, dass keine
  Verknüpfung durchrutscht.
- **„Keep this code private“ ist in GitHub Desktop beim Veröffentlichen vorausgewählt.** Für
  kostenloses GitHub Pages muss das Häkchen **weg**.
- **Ersatz-E-Mail genau übernehmen:** Sie hat die Form `12345678+name@users.noreply.github.com`
  (mit Zahl vorne). Mit der falschen Form lehnt die E-Mail-Sperre den Push ab.
- **Git-Projekt in der Sandbox anlegen:** `git init -b main`, damit der Zweig `main` heißt (sonst
  eventuell `master`, und der Workflow würde nie starten).
- **Pages-Quelle vor der Workflow-Datei:** Zuerst bei GitHub *Settings → Pages → Source: GitHub
  Actions* einstellen, erst danach die Workflow-Datei hochladen (Entscheidung 6).
- **Aktions-Versionen:** In `deploy.yml` stehen Mindest-Hauptversionen der offiziellen Aktionen
  (siehe Phase 4). Beim Umsetzen auf den jeweiligen GitHub-Seiten (`github.com/actions/<name>`) die
  aktuelle Hauptversion nachsehen und diese verwenden. Ältere Versionen laufen teils noch auf
  Node 20, das GitHub 2026 abschaltet.
- **Kaputter Test bricht lokal `npm test`:** In Phase 4 ist ein Test absichtlich rot. Die
  automatische Prüfung des Agents ist in diesem Zwischenschritt also erwartungsgemäß rot und wird
  erst nach dem Entfernen wieder grün.
- **Dieser Plan und die Specs sind öffentlich:** Firmenname, interne Adressen, die private
  E-Mail und der echte Name der Nutzerin bzw. des Nutzers gehören in keine Datei im Projekt. Der
  GitHub-Benutzername ist öffentlich und darf in *Implementation Notes* stehen.
- **Zwischenspeicher:** Die neue Version kann bis zu ~10 Minuten brauchen. Erst Cmd + Shift + R
  versuchen, bevor man einen Fehler vermutet.

## Implementation

### Phase 1: Claudia heißt Claudia

Dependencies: None

Die Figur heißt überall Claudia, im Code, in den Tests und in den Dokumenten. Lokal sieht man es am
Tab-Titel.

**Tasks**:
- [x] `index.html`: `<title>Claudia im RAM-Dschungel</title>`
- [x] `package.json`: `"name": "claudia-im-ram-dschungel"`. In `package-lock.json` die beiden
      `name`-Zeilen (oben und unter `packages[""]`) genauso von Hand ändern, kein `npm install`.
- [x] `src/render/claude.ts` in `src/render/claudia.ts` umbenennen. `drawClaude` → `drawClaudia`,
      Doc-Kommentar anpassen.
- [x] `src/render/renderer.ts`: `import { drawClaudia } from './claudia';` und Aufruf anpassen.
- [x] Kommentare in `src/logic/camera.ts` und `src/logic/world.ts`: „Claude“ → „Claudia“.
- [x] Testnamen und Kommentare in `src/logic/game.test.ts`, `world.test.ts`, `camera.test.ts`,
      `player.test.ts`: „Claude“ → „Claudia“, „he/his/him“ → „she/her“ (z. B. „only her feet reach
      into it“, „she may walk underneath“).
- [x] Spec von Slice 1 umbenennen: `docs/agents/specs/2026-10-01-claude-laeuft-durch-level-1.md` →
      `2026-10-01-claudia-laeuft-durch-level-1.md`. Titel und Text auf „Claudia“, Pronomen der
      Figur auf „sie/ihr“.
- [x] Plan von Slice 1 genauso umbenennen und anpassen, einschließlich `spec:`-Feld, Link in der
      Einleitung, Dateibaum und *References*.
- [x] `docs/agents/specs/2026-10-01-online-spielbar.md`: Verweis unter *References* auf den neuen
      Spec-Dateinamen.
- [x] Abschluss-Suche: `grep -rni claude --exclude-dir=node_modules --exclude-dir=dist .` darf nur
      noch die erlaubten Stellen aus *Pitfalls* finden. `grep -rn "claude-laeuft" docs` findet
      nichts mehr. `find . -iname '*claude*' -not -path './node_modules/*' -not -path './dist/*'
      -not -path './.claude*' -not -path './.agents/*'` findet keine Datei mehr.

**Automated Verification**:
- [x] `npm ci` in der Sandbox läuft durch (dabei auch geprüft: Lockfile passt zu `package.json`)
- [x] `npm run typecheck` ist fehlerfrei
- [x] `npm test` ist grün
- [x] `npm run build` ist fehlerfrei

**Manual Verification**:
- [x] Terminal auf dem Mac öffnen (Cmd + Leertaste, „Terminal“ tippen, Enter). `cd ` (mit
      Leerzeichen) tippen, den Ordner `little_game_real` aus dem Finder ins Terminal-Fenster ziehen,
      Enter. Dann `npm install` und danach `npm run dev` eingeben. Die
      angezeigte Adresse öffnen (meist `http://localhost:5173/`). Im Browser-Tab steht „Claudia im
      RAM-Dschungel“.
      **Note:** Entwicklungs-Server in der Sandbox gestartet, Tab-Titel „Claudia im RAM-Dschungel“ geliefert; 54 Tests grün.
- [x] Mit ← → laufen und mit der Leertaste springen: Alles verhält sich wie vorher.
- [x] Danach im Terminal Ctrl + C drücken, um den Server zu beenden.

### Phase 2: Konto geschützt

Dependencies: None (kann parallel zu Phase 1 laufen, findet aber nur bei GitHub statt)

Du sicherst dein GitHub-Konto ab. Der Agent führt dich Schritt für Schritt durch, du klickst. Am
Code ändert sich nichts.

**Tasks** (die Nutzerin bzw. der Nutzer macht die Klicks, der Agent erklärt jeden Schritt einzeln
und wartet auf die Rückmeldung):
- [x] **Zwei-Faktor-Anmeldung:** Auf dem Handy eine Authenticator-App bereithalten (z. B. die
      eingebaute App „Passwörter“ auf dem iPhone, Google Authenticator oder Microsoft
      Authenticator). Auf github.com oben rechts auf das Profilbild → *Settings* → links
      *Password and authentication* → *Enable two-factor authentication*. Den QR-Code mit der App
      scannen und den 6-stelligen Code eingeben. Die **Recovery codes** herunterladen und sicher
      ablegen (nicht in den Projektordner!). Danach *Done*.
- [x] **Ersatz-E-Mail:** *Settings* → links *Emails*. Häkchen bei **Keep my email addresses
      private** setzen. Darunter steht dann die Ersatz-E-Mail der Form
      `12345678+name@users.noreply.github.com`. Sie notieren, sie wird in Phase 3 gebraucht.
- [x] **E-Mail-Sperre:** Auf derselben Seite Häkchen bei **Block command line pushes that expose
      my email** setzen.
- [x] **E-Mail bei Fehlern:** *Settings* → links *Notifications* → Abschnitt *System* → *Actions*.
      Dort muss *Email* ausgewählt sein, am besten mit *Only notify for failed workflows*.

**Manual Verification**:
- [x] Bei github.com abmelden (Profilbild → *Sign out*) und wieder anmelden: Nach dem Passwort
      fragt GitHub nach dem 6-stelligen Code aus der Handy-App.
- [x] *Settings → Emails*: „Keep my email addresses private“ und „Block command line pushes that
      expose my email“ sind beide angehakt.
- [x] *Settings → Notifications → System → Actions*: *Email* ist ausgewählt, und „Only notify for
      failed workflows“ ist angehakt.

### Phase 3: Code auf GitHub

Dependencies: Phase 1 (die Umbenennung soll schon im ersten Upload stecken, damit „Claude“ nie in
der öffentlichen Versionsgeschichte steht), Phase 2 (Ersatz-E-Mail und Sperre)

Der Projektordner wird ein Git-Projekt und kommt öffentlich zu GitHub, ohne private Dateien.
Veröffentlicht wird in dieser Phase noch nichts, das kommt in Phase 4.

**Tasks**:
- [x] Der Agent fragt nach dem GitHub-Benutzernamen und der Ersatz-E-Mail aus Phase 2.
- [x] `.gitignore` erweitern (Agent):
      ```
      # Abhängigkeiten und gebaute Dateien
      node_modules
      dist

      # Mac
      .DS_Store

      # Persönliche Einstellungen und Geheimnisse
      .claude/settings.local.json
      .env
      .env.*
      *.local
      *.pem
      *.key

      # Kurs-Werkzeuge (Kursmaterial, interne Adresse): bleiben nur auf diesem Mac
      .agents/
      .claude/skills/
      skills-lock.json
      ```
- [x] Git-Projekt anlegen (Agent, in der Sandbox im Projektordner):
      `git init -b main`, danach
      `git config user.name "<github-benutzername>"` und
      `git config user.email "<ersatz-e-mail>"` (ohne `--global`, gilt nur für dieses Projekt).
- [x] Dateiliste prüfen (Agent): `git add --dry-run .` ausführen und die **vollständige** Liste
      im Chat zeigen. Sie darf keine `.DS_Store`, nichts aus `dist/`, `node_modules/`, `.agents/`,
      `.claude/skills/`, kein `skills-lock.json` und keine Datei mit Passwörtern oder Schlüsseln
      enthalten. Zusätzlich `git ls-files -co --exclude-standard | xargs grep -nIE "gitlab\.|@gmail\.com|PRIVATE KEY|ghp_"`
      ausführen, das darf nichts finden. Außerdem selbst nach dem Firmennamen aus `skills-lock.json`
      suchen, ohne ihn irgendwo im Projekt aufzuschreiben (dieser Plan ist öffentlich). Der Agent committet
      **nicht**, das macht die Nutzerin bzw. der Nutzer in GitHub Desktop.
- [x] **GitHub Desktop installieren** (Nutzerin bzw. Nutzer): `https://desktop.github.com`
      öffnen → *Download for macOS*. Die heruntergeladene Datei öffnen und *GitHub Desktop* in den
      Ordner *Programme* ziehen. Starten.
- [x] **Anmelden:** *Sign in to GitHub.com* → Browser öffnet sich → *Authorize desktop* →
      zurück in die App. Bei *Configure Git* den GitHub-Benutzernamen als Name eintragen und bei
      *Email* im Auswahlfeld die Ersatz-E-Mail `…@users.noreply.github.com` wählen → *Finish*.
      (Später zu finden unter *GitHub Desktop → Settings → Git*.)
- [x] **Projekt hinzufügen:** *File → Add Local Repository…* → *Choose…* → den Projektordner
      `little_game_real` wählen → *Add Repository*.
- [x] **Erster Commit:** Links im Reiter *Changes* steht die Dateiliste mit Häkchen. Mit der Liste
      des Agents vergleichen: keine `.DS_Store`, kein `dist`, kein `node_modules`, keine
      Kurs-Werkzeuge. Unten links bei *Summary* „Erste Version: Claudia läuft durch Level 1“
      eintragen → *Commit to main*.
- [x] **Öffentlich hochladen:** Oben *Publish repository* klicken. Name:
      `claudia-im-ram-dschungel`. Das Häkchen bei **Keep this code private entfernen**. →
      *Publish Repository*.
- [x] **GitHub Pages einstellen:** Auf github.com das Projekt öffnen
      (`https://github.com/<dein-github-name>/claudia-im-ram-dschungel`) → oben *Settings* → links
      *Pages* → bei *Build and deployment* → *Source* die Option **GitHub Actions** wählen.
      Sonst nichts ändern, es gibt keinen *Save*-Knopf. GitHub schlägt danach fertige Workflows
      vor (z. B. „Static HTML“ mit *Configure*). **Nicht anklicken**, die Workflow-Datei legt der
      Agent in Phase 4 an.

**Automated Verification**:
- [x] `git status` zeigt nach dem Commit der Nutzerin bzw. des Nutzers „nothing to commit, working
      tree clean“
- [x] `git log --format='%an <%ae>'` zeigt nur die Ersatz-E-Mail
- [x] `git ls-files` enthält keine `.DS_Store`, nichts unter `dist/`, `node_modules/`, `.agents/`,
      `.claude/skills/` und kein `skills-lock.json`

**Manual Verification**:
- [x] `https://github.com/<dein-github-name>/claudia-im-ram-dschungel` öffnen: Ordner `docs`, `public`,
      `src` und Dateien wie `index.html`, `package.json` sind zu sehen. Es gibt **keine**
      `.DS_Store`, keinen `dist`- und keinen `node_modules`-Ordner, kein `.agents` und kein
      `skills-lock.json`. Der Ordner `.claude` fehlt ganz.
- [x] Direkt hinter dem Projektnamen (oben links) steht **Public**.
- [x] Ein privates Browserfenster öffnen (Cmd + Shift + N in Chrome und Safari,
      Cmd + Shift + P in Firefox), also ohne Anmeldung, und denselben Link aufrufen: Das Projekt ist sichtbar,
      aber es gibt keinen Knopf zum Ändern.
- [x] Bei *Settings → Pages* steht als Source „GitHub Actions“.

### Phase 4: Online und automatisch

Dependencies: Phase 3

Der Veröffentlichungs-Roboter kommt dazu. Danach ist das Spiel unter dem Link erreichbar, und jede
Änderung geht nach bestandenen Tests automatisch online.

**Tasks**:
- [x] `.github/workflows/deploy.yml` anlegen (Agent):
      ```yaml
      # Bei jedem Push auf main: prüfen, bauen und auf GitHub Pages veröffentlichen.
      # Schlägt ein Schritt fehl, wird nichts veröffentlicht und die alte Version bleibt online.
      name: Prüfen und veröffentlichen

      on:
        push:
          branches: [main]

      permissions:
        contents: read
        pages: write
        id-token: write

      # Nie zwei Veröffentlichungen gleichzeitig, eine laufende nicht abbrechen.
      concurrency:
        group: pages
        cancel-in-progress: false

      jobs:
        build:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v5
            - uses: actions/setup-node@v5
              with:
                node-version: 24
                cache: npm
            - run: npm ci
            - run: npm test
            - run: npm run build # enthält die Typprüfung (tsc --noEmit)
            - uses: actions/configure-pages@v5
            - uses: actions/upload-pages-artifact@v4
              with:
                path: dist

        deploy:
          needs: build
          runs-on: ubuntu-latest
          environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
          steps:
            - id: deployment
              uses: actions/deploy-pages@v4
      ```
- [x] Kurze Anleitung „So veröffentlichst du eine Änderung“ in `docs/architecture.md` unter
      *Technology* ergänzen, mit Link-Muster, dem Ablauf „Commit → Push → ✓ → bis 10 Min. →
      Cmd + Shift + R“ und dem Hinweis auf ✗ und E-Mail.
- [x] Nutzerin bzw. Nutzer: In GitHub Desktop erscheint `.github/workflows/deploy.yml` (und
      `docs/architecture.md`). Summary „Veröffentlichung einrichten“ → *Commit to main* → oben
      *Push origin*.
- [x] Der Agent trägt den echten Link `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/`
      unter *Implementation Notes* in diesem Plan ein (in der Spec bleibt der Platzhalter).
- [x] **Sichtbare Änderung (Agent):** In `public/levels/level1.json` die erste `sky`-Farbe
      vorübergehend von `#03140c` auf `#3a0b4a` (lila) ändern. Die Nutzerin bzw. der Nutzer
      committet „Test: Himmel lila“ und pusht.
- [x] **Kaputter Test (Agent):** Die Farbe zurück auf `#03140c` setzen **und** in
      `src/logic/camera.test.ts` einen absichtlich falschen Test ergänzen:
      `it('ist absichtlich kaputt (Slice-2-Prüfung)', () => { expect(1).toBe(2); });`.
      Die Nutzerin bzw. der Nutzer committet „Test: absichtlich kaputt“ und pusht.
- [-] **Aufräumen (Agent):** Den absichtlich kaputten Test wieder entfernen. Die Nutzerin bzw. der
      Nutzer committet „Kaputten Test entfernt“ und pusht.

**Automated Verification**:
- [ ] Nach `npm ci` in der Sandbox: `npm run typecheck`, `npm test` und `npm run build` sind fehlerfrei (vor dem kaputten Test
      und nach dem Aufräumen. Dazwischen ist `npm test` absichtlich rot.)
- [ ] `git status` ist nach dem letzten Push sauber, und `git log --format='%ae'` zeigt nur die
      Ersatz-E-Mail.

**Manual Verification**:
Hart neu laden heißt hier: Cmd + Shift + R in Chrome und Firefox, **Cmd + Option + R in Safari**
(in Safari öffnet Cmd + Shift + R die Leseansicht).

- [x] Nach dem Push „Veröffentlichung einrichten“: Auf github.com im Projekt oben auf *Actions*
      klicken. Ein Lauf „Prüfen und veröffentlichen“ erscheint, gelb (läuft), nach ein paar Minuten
      ein **grünes ✓**. Auf der Startseite des Projekts steht das ✓ auch neben dem letzten Commit.
- [x] Den Link `https://<dein-github-name>.github.io/claudia-im-ram-dschungel/` am Mac öffnen
      (steht auch unter *Settings → Pages*, „Your site is live at …“): Level 1 erscheint, der
      Tab heißt „Claudia im RAM-Dschungel“, und Claudia läuft mit ← → und springt mit der
      Leertaste.
- [x] Den Link auf dem Handy öffnen (z. B. per Nachricht an dich selbst schicken): Das Spiel ist
      vollständig zu sehen und passt auf den Bildschirm, im Hoch- und im Querformat. Steuern geht
      noch nicht, das ist richtig so (Slice 10).
- [x] Einen falschen Link testen, z. B. `…github.io/claudia-im-ram-dschungel/gibtsnicht`: Die
      normale GitHub-„404“-Seite erscheint.
- [x] Nach dem Push „Test: Himmel lila“: Bei *Actions* ein grünes ✓. Den Link mit
      Cmd + Shift + R neu laden (eventuell bis zu 10 Minuten warten): Der Himmel ist oben **lila**.
- [x] Nach dem Push „Test: absichtlich kaputt“: Bei *Actions* ein **rotes ✗**. Klickt man den Lauf
      an, ist beim Schritt `npm test` der Test „ist absichtlich kaputt“ rot, und `deploy` wurde
      nicht ausgeführt. Im Postfach der GitHub-Kontoadresse liegt eine E-Mail über den
      fehlgeschlagenen Lauf. Den Link mit Cmd + Shift + R neu laden: Der Himmel ist **immer noch
      lila**, also läuft die alte Version weiter.
- [ ] Nach dem Push „Kaputten Test entfernt“: grünes ✓, und nach Cmd + Shift + R ist der Himmel
      wieder **grün** wie gewohnt.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

- GitHub-Benutzername: `CorneliusK480`. Projekt-Link: `https://github.com/CorneliusK480/claudia-im-ram-dschungel`.
- Phase 3: Dateiliste geprüft (45 Dateien). Keine `.DS_Store`, kein `dist`, kein `node_modules`, keine Kurs-Werkzeuge. Die Suche nach Firmenname, Firmen-Adresse und privaten Daten fand nichts.
- Spiel-Link: `https://corneliusk480.github.io/claudia-im-ram-dschungel/`.
- Phase 4: Aktuelle Hauptversionen der Aktionen (Stand 2026-10-01): checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5.
- Testanleitungen gibt der Agent als eine vollständige Liste, nicht Schritt für Schritt mit einzelnen Fragen (Wunsch der Nutzerin bzw. des Nutzers).

## References

- Spec: `docs/agents/specs/2026-10-01-online-spielbar.md`
- `docs/product.md` – Slice 2 und Slice 11
- `docs/architecture.md` – Technology: Veröffentlichen, Code-Ablage
- `docs/design.md` – States (Loading), Handy
- Plan Slice 1: `docs/agents/plans/2026-10-01-claudia-laeuft-durch-level-1.md` (nach Umbenennung)
- GitHub-Vorlage für Pages-Workflows: `https://github.com/actions/starter-workflows/tree/main/pages`
- Vite-Anleitung zum Veröffentlichen: `https://vite.dev/guide/static-deploy`
