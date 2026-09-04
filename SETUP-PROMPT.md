# Setup-Prompt

Kopier den ganzen Block unter der Linie und füg ihn in Claude Code ein.

Starte Claude Code vorher am besten in dem Ordner, in dem deine Leads liegen
sollen. Rechne mit zwanzig bis dreißig Minuten, den größten Teil davon für das
Interview - daran hängt später die Qualität jeder Liste.

Überleg dir vorher eine Sache: **was für dich ein guter und was ein schlechter
Kunde ist.** Danach wird gefragt, und je konkreter du das sagst, desto besser
wird die Liste.

---

Installiere mir das Lead-Akquise-System aus diesem Repo und richte es auf MICH ein: https://github.com/sebaskauf/lead-akquise-system

Arbeite die Schritte der Reihe nach ab. Schlägt etwas fehl, zeig mir die genaue Fehlermeldung und was du brauchst, statt den Schritt als erledigt zu melden oder ihn zu überspringen.

SCHRITT 0 - ARBEITSORDNER UND VORAUSSETZUNGEN
1. **Sag mir zuerst, in welchem Ordner du gerade bist, und frag mich, ob meine Leads dorthin sollen.** Ist es mein Home-Verzeichnis oder der Repo-Ordner, schlag mir etwas Besseres vor (zum Beispiel `~/Documents/Leads`) und leg es auf mein Ja an. Dieser Ordner ist ab jetzt "mein Arbeitsordner" - dort landen Profil, Leads und die `.env`, und nirgendwo sonst. Merk ihn dir für alle weiteren Schritte.
2. Prüf still: `git` vorhanden, `python3 --version` gibt eine echte Version aus (mindestens 3.10 - auf macOS ohne Entwicklerwerkzeuge ist `python3` manchmal nur eine Hülle, die ein Fenster öffnet), `~/.claude/agents/` existiert oder anlegbar, Schreibrecht im Arbeitsordner, und ob du Websuche nutzen kannst. Fehlt etwas, sag mir genau was und wie ich es nachhole, bevor wir anfangen.
3. Merk dir mein Betriebssystem. Unter Windows liegen die Pfade anders (`.venv-scrapling\Scripts\pip.exe` statt `.venv-scrapling/bin/pip`), und in Claude Code arbeitest du dort am besten in Git Bash.

SCHRITT 1 - INSTALLIEREN
1. `git clone https://github.com/sebaskauf/lead-akquise-system.git ~/Documents/Projects/lead-akquise-system`
   - Der Ordner existiert schon **und ist ein Git-Repo**: dort `git pull`. Gibt es dabei Konflikte, sag mir das und lass mich entscheiden.
   - Der Ordner existiert, ist **kein** Git-Repo (etwa ein entpacktes ZIP): benenn ihn um in `...-alt` und klon frisch.
   - Der Clone scheitert an einer Berechtigung, weil der Zielpfad ausserhalb meines Arbeitsordners liegt: frag mich, ob du stattdessen in einen Unterordner meines Arbeitsordners klonen sollst.
2. Führ `./install.sh` im Repo aus. Das Script kopiert die Agent-Definition nach `~/.claude/agents/`.
   - Läuft es durch: gut.
   - **Endet es mit Code 2**, habe ich schon einen Agenten dieses Namens. Das Script überschreibt ihn absichtlich nicht. Lies mir vor, wessen Agent da liegt, und frag MICH: `./install.sh --force` überschreibt ihn (mit Sicherungskopie), `./install.sh --name leads` installiert daneben unter neuem Namen. Entscheide das nicht selbst.
3. **Ich muss Claude Code jetzt NICHT neu starten** - du liest die Agent-Datei gleich direkt und führst das Setup selbst durch. Der Neustart kommt erst ganz am Ende.

SCHRITT 2 - APIFY ANBINDEN
Frag mich, ob ich schon ein Apify-Konto habe.
- Habe ich keins: führ mich durch die Anmeldung auf apify.com (Free-Plan, 5 USD Guthaben im Monat, keine Kreditkarte nötig) und dann zum Token unter Settings, API & Integrations, Personal API tokens. Der Token beginnt mit `apify_api_`.
- Leg ihn als `APIFY_TOKEN=` in die `.env` in meinem Arbeitsordner und schreib `.env` in die `.gitignore`. Gib den Token nie im Klartext aus.
- Erklär mir die Abrechnung in zwei Sätzen: bezahlt wird pro geholtem Datensatz, nicht pro Monat, und ein Lauf über 200 Betriebe kostet grob 1 USD.
- Will ich keinen Apify-Zugang: sag mir, dass das System trotzdem läuft, dann eben über deine eigene Web-Recherche, nur langsamer.

SCHRITT 3 - SCRAPLING EINRICHTEN (empfohlen, kostenlos, ein bis fünf Minuten je nach Leitung)
Erklär mir in zwei Sätzen, wofür es gut ist: Es holt Firmenwebsites um ein Vielfaches schneller als der eingebaute Abruf (gemessen 13 Firmen in 4 Sekunden statt 40 Minuten) und sieht auch JavaScript-Inhalte. Kostenlos, Open Source, kein Konto nötig.
Wenn ich einverstanden bin, richte es ein:
```
python3 -m venv .venv-scrapling
.venv-scrapling/bin/pip install "scrapling[all]>=0.4.15"
```
Prüf danach, dass es läuft, indem du eine beliebige Website damit holst und mir Statuscode und Größe nennst. Nur wenn ich später JavaScript-lastige Seiten brauche, kommt zusätzlich `scrapling install` dazu (lädt Browser, mehrere hundert MB) - das machen wir erst, wenn es nötig wird.
Will ich nicht: sag mir, dass alles auch ohne läuft, nur langsamer. Zwing mich nicht.

SCHRITT 4 - FIRECRAWL PRÜFEN (optional)
Prüf, ob dir Tools mit dem Präfix `firecrawl` zur Verfügung stehen. (Ich selbst sehe das über `/mcp` - das kannst du nicht für mich ausführen, schau in deinem eigenen Werkzeugkasten nach.) Der Agent braucht es, um Firmenwebsites gezielt auszulesen, wenn ein Suchkriterium in keinem Datenfeld steht.
- Ist es da: sag mir kurz, dass es bereit ist.
- Ist es nicht da: erklär mir in zwei Sätzen, wofür es gut ist, nenn firecrawl.dev, und sag mir, dass das System auch ohne läuft, dann aber ungenauer prüft. Zwing mich nicht dazu.

SCHRITT 5 - AUF MICH EINRICHTEN (das Interview)
**Schau zuerst nach, ob in meinem Arbeitsordner schon eine `akquise-profil.md` liegt.** Steht dort `setup: fertig`, sag mir das und frag, ob ich wirklich neu einrichten will - sonst überspringen wir das Interview. Steht `setup: unvollständig` drin, machst du dort weiter, wo wir aufgehört haben.
Lies die installierte Agent-Datei (`~/.claude/agents/<name>.md`, Abschnitt "Setup-Interview") und führe das Interview jetzt selbst mit mir durch, EINE Frage nach der anderen. Bei "weiß nicht" gibst du mir 2 bis 3 Vorschläge zur Auswahl.

Die wichtigste Frage ist die nach gutem und schlechtem Lead. Hak dort nach, bis es konkret ist, statt eine vage Antwort stehen zu lassen: Firmengröße, Inhaber oder Kette, mit oder ohne Website, bestimmte Leistungen. An dieser Antwort prüfst du später jeden Treffer, also ist sie der Maßstab für die ganze Liste.

Schreib die Antworten als `akquise-profil.md` in meinen Arbeitsordner. **Sichere dabei laufend:** Schreib nach jedem größeren Abschnitt weg, was du schon weißt, mit `setup: unvollständig` im Frontmatter. Erst am Ende wird daraus `setup: fertig`. Werde ich unterbrochen, machst du beim nächsten Mal dort weiter, statt von vorn zu fragen.

SCHRITT 6 - WOHIN DIE LEADS SOLLEN
Frag mich, ob ich das **Agentic OS** nutze (das Obsidian-Cockpit aus der Academy).

- **Ich sage nein:** Die Leads kommen in `leads/` in meinem Arbeitsordner, je Firma eine Markdown-Datei. Zusätzlich schreibst du nach jedem Lauf eine `leads.csv`, die ich direkt in Excel oder Numbers öffnen kann - mit Semikolon als Trennzeichen und BOM am Anfang, sonst zerlegt Excel die Umlaute. Spalten in dieser Reihenfolge: Firma, Was sie machen, Ort, Adresse, Branche, Mitarbeiter, Ansprechpartner, Position, Telefon, Mail, Website, LinkedIn, Status, Score, Follow-up, Quelle, Signale.
- **Ich sage ja:** Die Leads kommen nach `~/.skaile/data/leads/<kampagne>/`, ein Ordner je Suchauftrag, benannt nach Branche und Region. Leg dort auch eine `_kampagne.md` mit `name:` an, das ist die Beschriftung im Cockpit. Die `leads.csv` schreibst du trotzdem, sie kostet nichts.

Halt das Ergebnis in `LEAD-SETUP.md` fest, damit du beim nächsten Lauf weißt, wohin.

SCHRITT 7 - BEWEIS
Mach einen Mini-Lauf über 10 Betriebe aus meiner Branche und Region:
- Nenn mir vorher die Kosten mit der Rechnung dahinter (10 Betriebe sind rund 0,05 USD; das Cap setzt du trotzdem auf 0,50, weil Apify nicht weniger zulässt) und warte auf mein Ja.
- Hol die Betriebe, säuber die Liste und zeig sie mir.
- Leg aus zwei Treffern Lead-Dateien in `leads/` an und zeig mir einmal den Tagesreport, damit ich weiß wie ich später nach dem Stand frage.
- Frag mich, ob die Treffer dem entsprechen, was ich suche. Mein Feedback schreibst du in `akquise-profil.md`.

**Habe ich keinen Apify-Zugang**, machst du denselben Beweis über deine eigene Web-Recherche: 10 Betriebe aus meiner Branche und Region, ohne Kosten-Ansage. Der Zweck ist derselbe - ich will einmal sehen, was rauskommt.

**Schlägt der Lauf fehl** (Token falsch, Guthaben leer, Actor verweigert), zeig mir die genaue Fehlermeldung und was ich tun muss. Setz das Setup dann auf `setup: fertig` und sag mir, dass nur der Beweislauf offen ist - blockier mich nicht mit einem Setup, das nie fertig wird.

Zeig mir dann eine kurze Übersicht, was jetzt steht: Agent installiert, Apify ja/nein, Scrapling ja/nein, Firecrawl ja/nein, Profil geschrieben, Ausgabeort. Und was davon noch offen ist.

Erst danach: Sag mir, dass ich Claude Code einmal neu starten soll, und wie ich das System ab dann benutze: "Leads für [Branche] in [Region]" für die Suche, "wen muss ich nachfassen" für den Stand, und einfach erzählen was passiert ist ("hab mit X telefoniert, Rückruf Dienstag"), damit das CRM gepflegt wird.

Wenn ein Schritt fehlschlägt, zeig mir die genaue Fehlermeldung, statt es als erledigt zu melden.

---

# Zusatz: nur wenn du das Agentic OS nutzt

Das Agentic OS hat einen **LEADS-Tab**, der deine Lead-Dateien als Übersicht
anzeigt: Firmen links, Steckbrief und Kontaktdaten rechts, Status per Klick,
Website und LinkedIn direkt anklickbar.

Der Tab kommt mit einer Plugin-Version, die neuer ist als v0.2.2. Hast du eine
ältere, hol dir zuerst das aktuelle ZIP aus der Skool-Section - ohne das gibt es
den Tab nicht, und die Anleitung unten läuft ins Leere.

Kopier diesen Block **zusätzlich** in dieselbe Claude-Code-Session, nachdem der
Prompt oben durchgelaufen ist.

---

Ich nutze das Agentic OS und will meine Leads im LEADS-Tab sehen.

1. **Finde meinen Obsidian-Vault**, in dem das Agentic OS liegt. Rate den Pfad nicht: Schau unter macOS in `~/Library/Application Support/obsidian/obsidian.json` nach, welche Vaults es gibt, und frag mich, welcher es ist, wenn es mehrere sind. Das Plugin liegt dann unter `<vault>/.obsidian/plugins/agentic-os/`.
2. **Prüf, ob mein Plugin den LEADS-Tab kennt:** Steht in dessen `main.js` der String `leads-root`?
   - **Ja:** alles da, weiter mit Punkt 3.
   - **Nein:** Sag mir, dass ich das Plugin aktualisieren muss - neues ZIP aus der Skool-Section, entpacken nach `<vault>/.obsidian/plugins/agentic-os/`, dann Obsidian neu laden. Versuch nicht, das Plugin selbst zu bauen; bei mir liegt kein Quellcode, sondern nur die fertigen Dateien. Bis dahin bekomme ich meine Leads als CSV, das läuft ohnehin.
3. Leg `~/.skaile/data/leads/` an, falls der Ordner fehlt, und trag in `LEAD-SETUP.md` ein, dass meine Leads dorthin gehören - ein Unterordner je Kampagne, benannt nach Branche und Region.
4. Erklär mir den Tab in drei Sätzen: oben Kampagne wählen und filtern, links die Firma anklicken, rechts Status setzen. Ein Klick auf Firmenname, Mail oder LinkedIn öffnet den Browser.
5. Wichtig für dich als Agent: Die Dateien im Cockpit und deine Dateien sind dieselben. Ändere ich dort einen Status, siehst du das beim nächsten Lesen. Änderst du etwas, sehe ich es im Cockpit nach spätestens zwanzig Sekunden.
