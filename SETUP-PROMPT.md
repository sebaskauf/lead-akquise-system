# Setup-Prompt

Diesen Prompt komplett kopieren und in Claude Code pasten. Am besten startest du Claude Code vorher in dem Ordner, in dem deine Leads liegen sollen.

---

Installiere mir das Lead-Akquise-System aus diesem Repo und richte es auf MICH ein: https://github.com/sebaskauf/lead-akquise-system

SCHRITT 1 - INSTALLIEREN
1. `git clone https://github.com/sebaskauf/lead-akquise-system.git ~/Documents/Projects/lead-akquise-system` (falls der Ordner schon existiert: dort `git pull` statt clone).
2. Führ `./install.sh` im Repo aus. Das Script kopiert die Agent-Definition nach `~/.claude/agents/` und sichert eine bestehende Version vorher mit Zeitstempel.

SCHRITT 2 - APIFY ANBINDEN
Frag mich, ob ich schon ein Apify-Konto habe.
- Habe ich keins: führ mich durch die Anmeldung auf apify.com (Free-Plan, 5 USD Guthaben im Monat, keine Kreditkarte nötig) und dann zum Token unter Settings, API & Integrations, Personal API tokens. Der Token beginnt mit `apify_api_`.
- Leg ihn als `APIFY_TOKEN=` in die `.env` in meinem Arbeitsordner und schreib `.env` in die `.gitignore`. Gib den Token nie im Klartext aus.
- Erklär mir die Abrechnung in zwei Sätzen: bezahlt wird pro geholtem Datensatz, nicht pro Monat, und ein Lauf über 200 Betriebe kostet grob 1 USD.
- Will ich keinen Apify-Zugang: sag mir, dass das System trotzdem läuft, dann eben über deine eigene Web-Recherche, nur langsamer.

SCHRITT 3 - SCRAPLING EINRICHTEN (empfohlen, kostenlos, dauert eine Minute)
Erklär mir in zwei Sätzen, wofür es gut ist: Es holt Firmenwebsites um ein Vielfaches schneller als der eingebaute Abruf (gemessen 13 Firmen in 4 Sekunden statt 40 Minuten) und sieht auch JavaScript-Inhalte. Kostenlos, Open Source, kein Konto nötig.
Wenn ich einverstanden bin, richte es ein:
```
python3 -m venv .venv-scrapling
.venv-scrapling/bin/pip install "scrapling[all]>=0.4.15"
```
Prüf danach, dass es läuft, indem du eine beliebige Website damit holst und mir Statuscode und Größe nennst. Nur wenn ich später JavaScript-lastige Seiten brauche, kommt zusätzlich `scrapling install` dazu (lädt Browser, mehrere hundert MB) - das machen wir erst, wenn es nötig wird.
Will ich nicht: sag mir, dass alles auch ohne läuft, nur langsamer. Zwing mich nicht.

SCHRITT 4 - FIRECRAWL PRÜFEN (optional)
Prüf, ob ich Firecrawl als MCP verbunden habe (`/mcp` zeigt es, oder du siehst Tools mit dem Präfix `firecrawl`). Der Agent braucht es, um Firmenwebsites gezielt auszulesen, wenn ein Suchkriterium in keinem Datenfeld steht.
- Ist es da: sag mir kurz, dass es bereit ist.
- Ist es nicht da: erklär mir in zwei Sätzen, wofür es gut ist, nenn firecrawl.dev, und sag mir, dass das System auch ohne läuft, dann aber ungenauer prüft. Zwing mich nicht dazu.

SCHRITT 5 - AUF MICH EINRICHTEN (das Interview)
Lies die installierte Agent-Datei (`~/.claude/agents/lead-akquise.md`, Abschnitt "SETUP-MODUS") und führe das Interview jetzt selbst mit mir durch, EINE Frage nach der anderen. Bei "weiß nicht" gibst du mir 2 bis 3 Vorschläge zur Auswahl.

Die wichtigste Frage ist die nach gutem und schlechtem Lead. Hak dort nach, bis es konkret ist, statt eine vage Antwort stehen zu lassen: Firmengröße, Inhaber oder Kette, mit oder ohne Website, bestimmte Leistungen. An dieser Antwort prüfst du später jeden Treffer, also ist sie der Maßstab für die ganze Liste.

Schreib die Antworten als `akquise-profil.md` in meinen Arbeitsordner.

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

Erst wenn ich die Treffer abgenickt habe, ist das Setup fertig.

Sag mir zum Schluss, dass ich Claude Code einmal neu starten soll, und wie ich das System ab dann benutze: "Leads für [Branche] in [Region]" für die Suche, "wen muss ich nachfassen" für den Stand, und einfach erzählen was passiert ist ("hab mit X telefoniert, Rückruf Dienstag"), damit das CRM gepflegt wird.

Wenn ein Schritt fehlschlägt, zeig mir die genaue Fehlermeldung, statt es als erledigt zu melden.

---

# Zusatz: nur wenn du das Agentic OS nutzt

Wenn du das Agentic OS hast, kopier diesen Block **zusätzlich** in dieselbe Claude-Code-Session, nachdem der Prompt oben durchgelaufen ist.

---

Ich nutze das Agentic OS und will meine Leads im LEADS-Tab sehen.

1. Prüf, ob mein Plugin den LEADS-Tab schon kennt: Steht in `~/Documents/skaile-brain/.obsidian/plugins/agentic-os/main.js` der String `leads-root`? Wenn ja, ist alles da, dann direkt zu Punkt 3.
2. Wenn nein, hol dir die aktuelle Version: `cd ~/Documents/skaile-brain/.obsidian/plugins/agentic-os && git pull && npm install && npm run build`. Sag mir vorher, dass Obsidian dabei das Plugin neu lädt und offene Terminals im Cockpit geschlossen werden.
3. Leg `~/.skaile/data/leads/` an, falls der Ordner fehlt.
4. Sag mir, dass ich im Cockpit auf den Tab **LEADS** gehen kann. Erklär mir in drei Sätzen, was ich dort tun kann: oben die Kampagne wählen und filtern, links die Firma anklicken, rechts den Status setzen. Ein Klick auf Website, Mail oder LinkedIn öffnet den Browser.
5. Wichtig für dich als Agent: Die Dateien im Cockpit und deine Dateien sind dieselben. Ändere ich dort einen Status, siehst du das beim nächsten Lesen. Änderst du etwas, sehe ich es im Cockpit nach spätestens zwanzig Sekunden.
