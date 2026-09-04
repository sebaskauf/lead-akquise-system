# Lead-Akquise-System - Claude-Code-Agent

Sag ihm, wen du suchst, und du bekommst eine Liste mit Kontaktdaten. Nicht "Adressen ziehen", sondern: der Agent findet selbst heraus, **wo** diese Firmen überhaupt zu finden sind, holt sie, prüft was er hat, und bessert nach, bis die Liste brauchbar ist.

Der Unterschied zu einem Scraper: Ein Scraper führt eine Abfrage aus. Dieser Agent liefert ein Ergebnis. Wenn "Hersteller von Verbindungselementen für die Luftfahrt" auf Google Maps nur Baumärkte trifft, merkt er das und wechselt die Quelle, statt dir 200 Baumärkte zu liefern.

Aus dem Systeme-Modul der [SKAILE Academy](https://www.skool.com/skaile-academy).

## Was er macht, und was nicht

**Macht er:** Firmen finden, Kontaktdaten beschaffen, auf Wunsch ein **Profil je Firma** anreichern (was sie macht, seit wann, welche Projekte, was gerade läuft, wer ansprechbar ist), Duplikate und Karteileichen aussortieren, die Liste nach Belegbarkeit einordnen, ein Mini-CRM pflegen.

**Macht er nicht:** anrufen, E-Mails schreiben, Gesprächseinstiege formulieren, Kontaktformulare ausfüllen. Die Arbeit endet bei der Liste. Was du damit machst, ist deine Sache.

## Wie er entscheidet

Er arbeitet **keinen festen Ablauf** ab. Er stellt sich nach jedem Schritt eine Frage:

> "Wenn ich morgen selbst 20 dieser Firmen kontaktieren müsste: wäre diese Liste gut genug? Wenn nein, was fehlt?"

Solange die Antwort Nein ist, greift er zum passenden Werkzeug: Nische recherchieren, Quelle wechseln, andere Suchbegriffe, selbst im Web suchen, Kontaktdaten nachholen, Relevanz einzeln prüfen. Ist die Antwort Ja, hört er auf. **Ein einfacher Fall bleibt einfach** und wird nicht durch Extra-Schritte gebremst.

Zwei Beispiele, wie sich das unterscheidet:

- *"Zahnärzte in Hannover"* - klare Kategorie, bewährte Quelle. Er holt, säubert, liefert. Fertig.
- *"Yoga-Studios, die Online-Kurse anbieten"* - die Studios hat er sofort, aber "Online-Kurse" steht in keinem Datenfeld. Also prüft er die Websites, aber nur auf dieses eine Kriterium.

Findet er nach zwei ernsthaften Anläufen nichts Brauchbares, sagt er das und was du entscheiden müsstest, statt die Liste aufzufüllen.

## Die Regeln, an die er sich hält

- **Nichts wird erfunden.** Fehlt eine Telefonnummer, bleibt das Feld leer. Eine geratene Nummer oder eine aus dem Firmennamen konstruierte E-Mail zerstört das Vertrauen in die ganze Liste.
- **Kosten vor jedem bezahlten Lauf**, mit der Rechnung dahinter, und er wartet auf dein Ja. Kein Lauf ohne Bestätigung, auch kein winziger.
- **Im Zweifel behalten, nicht löschen.** Die Liste hat drei Abschnitte: **sicher** (belegt, mit Zitat), **offen** (die richtigen Seiten geprüft, nichts gefunden) und **ungeprüft** (Website tot, Prüfung nicht möglich). Das sind für dich drei verschiedene Handlungen. Du entscheidest, nicht er.
- **Kein geschönter Bericht.** Zwölf Leads sind zwölf, nicht "über zehn".
- **Deine Daten bleiben lokal.** Listen, Leads und Roh-Scrapes liegen auf deiner Platte.

## Nicht kopieren, einrichten

Beim Setup interviewt dich Claude: was du verkaufst, wen du suchst, welche Region, **und vor allem was für dich ein guter und was ein schlechter Lead ist**. Diese Antwort ist der Maßstab, an dem er später jeden Treffer prüft. Alles landet in `akquise-profil.md`, die bei Updates unangetastet bleibt.

Beweis am Ende des Setups: ein Mini-Lauf über 10 Betriebe für rund 5 Cent.

## Er sucht erst die beste Quelle, dann scrapt er

Bevor Geld fließt, sucht der Agent nach einem Verzeichnis, auf dem ohnehin nur draufsteht, wer dein Kriterium erfüllt: Innungen, Kammern, Fachverbände. In beiden Messungen war das die **bessere** Quelle, nicht nur die billigere. Ein Innungsverzeichnis lieferte 207 geprüfte Betriebe kostenlos, wo ein Scrape 0,30 USD kostete und mehr Fehltreffer brachte.

Den bezahlten Scrape setzt er dann oft als **Vollständigkeitsprüfung** ein: 40 Treffer geholt, 34 waren schon bekannt, einer neu. Damit ist die Abdeckung belegt statt behauptet, für 16 Cent.

## Kontaktdaten sagen dir, wen du anrufst. Ein Profil sagt dir, was du sagst.

Auf Wunsch bleibt es nicht bei Telefon und E-Mail. Der Agent baut dann je Firma ein Profil aus dem, was er belegen kann:

- **Was die Firma genau macht**, in ihren eigenen Worten. Der Unterschied zwischen "Maschinenbau" und "Sondermaschinen für die Lebensmittelabfüllung" ist der ganze Gesprächseinstieg
- **Seit wann**, Grösse, Standorte
- **Projekte und Referenzen**, aktuelle wie abgeschlossene
- **Was gerade läuft**: News, Presse, LinkedIn-Beiträge der letzten Monate
- **Offene Stellen** - das unterschätzteste Signal. Wer drei Buchhalter sucht, hat ein Buchhaltungsproblem
- **Entscheider mit Rolle**

Dafür liest er die Firmenwebsite gezielt aus und zieht, wenn vorhanden, die LinkedIn-Firmenseite samt Beiträgen dazu. Das läuft **ohne Cookies und ohne eigenen LinkedIn-Account**, du musst dort nichts einrichten.

**Den LinkedIn-Account ordnet er nur zu, wenn er zusammenpasst.** Mindestens zwei Merkmale müssen stimmen (Domain, Ort, Firmenname inklusive Rechtsform, beschriebene Tätigkeit). Passt nur der Name, notiert er "nicht sicher zuordenbar" und lässt die Daten weg. Ein falsch zugeordnetes Profil wäre schlimmer als gar keins: Du sprichst sonst eine Firma auf Projekte an, die sie nie gemacht hat.

Und er filtert nach dem, was **du** verkaufst. Was nicht zu deinem Angebot passt, kommt nicht ins Profil. Am Ende steht immer, was er **nicht** gefunden hat, damit du eine Lücke nicht für ein Nichtvorhandensein hältst.

## Wenn das Kriterium nirgends im Datenfeld steht

Manches lässt sich nicht scrapen: "bietet Online-Kurse an", "arbeitet mobil", "ist nach EN 9100 zertifiziert". Solche Kriterien stehen nur auf der Firmenwebsite. Dafür nutzt der Agent [Firecrawl](https://firecrawl.dev) und fragt gezielt nach genau diesem einen Punkt, mit einem wörtlichen Zitat als Beleg.

Zwei Dinge, die er dabei aus echten Testläufen gelernt hat: Die **Startseite ist die schlechteste Quelle** (in einem Test stand kein einziger Beleg dort, alle auf Unterseiten), und ein **Nein ist fast nie belegbar** - keine Firma schreibt auf ihre Website, was sie nicht anbietet. Deshalb sagt er dir die Quote direkt: "4 von 13 belegt, 9 unbeantwortet, ein belegtes Nein gibt es bei diesem Kriterium nicht."

Und weil solche Zusatzkriterien nur etwa ein Viertel der Rohtreffer erfüllen, rechnet er das **vor** dem Lauf vor, damit du nicht 15 bestellst und 3 bekommst.

## Kosten (Apify, geprüft am 03.09.2026)

Abgerechnet wird **pro Datensatz**, nicht pro Monat. Free-Plan-Preise:

| Posten | Preis | 200 Betriebe |
|---|---|---|
| Betrieb geholt (immer) | 0,004 USD | 0,80 USD |
| Filter, je Filter und Betrieb | 0,001 USD | 0,20 USD |
| Kontaktdaten von der Website | 0,002 USD | 0,40 USD |
| Bewertungen (nur wenn gebraucht) | ab 0,002 USD | - |

**Ein normaler Lauf über 200 Betriebe kostet rund 1 USD**, mit E-Mail-Suche etwa 1,40 USD. Der Free-Plan enthält 5 USD Guthaben im Monat, das reicht für mehrere Läufe. Ab dem Starter-Plan (19 USD im Monat) sinkt der Preis je Betrieb auf 0,003 USD.

Der Agent setzt zusätzlich `maxTotalChargeUsd` als harte Obergrenze und meldet nach dem Lauf die **tatsächlichen** Kosten, damit die Schätzung überprüfbar bleibt.

Ohne Apify-Konto ist er nicht blockiert: dann recherchiert er selbst im Web. Langsamer, aber kostenlos.

**Firecrawl** rechnet getrennt davon in Credits: ein Auslesen mit Schema kostet 5, ein einfacher Seitenabruf 1. Der Free-Plan hat einige hundert im Monat, das reicht für rund 60 geprüfte Firmen. Der Agent nennt dir vorher, wie viele Seiten er holen will.

## Was drin ist

```
agent/lead-akquise.md   Der Agent. Mehr braucht es nicht: Leitprinzip, Werkzeugkasten,
                        Apify-Playbook, CRM-Format, Setup-Interview
install.sh              kopiert ihn nach ~/.claude/agents/ (mit Backup)
SETUP-PROMPT.md         der Prompt, der alles einrichtet
.env.example            Vorlage für deinen Apify-Token
GRENZEN.md              was belegt ist und was nicht
```

Kein Skript, keine Abhängigkeiten. Leads suchen, Liste bauen, Stand ausgeben: das kann Claude selbst, dafür braucht es keinen Code, der nebenher gewartet werden muss.

## Installation

Den kompletten Prompt aus [`SETUP-PROMPT.md`](SETUP-PROMPT.md) in Claude Code kopieren.

## Benutzung

```
Leads für Zahnarztpraxen in Hannover
```
```
Wen muss ich nachfassen?
```
```
Ich habe mit Praxis Musterle telefoniert, will ein Angebot sehen, Rückruf nächsten Dienstag
```

Der erste sucht und liefert die Liste. Der zweite zeigt dir, wer überfällig ist und was heute ansteht. Der dritte pflegt das CRM.

## Das Mini-CRM

Eine Markdown-Datei pro Firma mit flachem Frontmatter (Status, Follow-up, Kontaktdaten, Quelle). Damit ist sie zugleich lesbare Notiz **und** Datensatz: Obsidian stellt solche Dateien über Bases als sortierbare Tabelle dar, also erscheint dein CRM im Agentic OS ohne Zusatzarbeit als Liste.

## Tempo: Scrapling statt Seite für Seite

Für das Lesen von Firmenwebsites nutzt der Agent [Scrapling](https://github.com/D4Vinci/Scrapling) - kostenlos, Open Source, lokal. Gemessen am 04.09.2026 an denselben Websites:

| | 13 Firmen, volle Prüfung (33 Seiten) |
|---|---|
| **Scrapling, 8 parallel** | **4 Sekunden** |
| Seite für Seite über den eingebauten Abruf | rund 40 Minuten für einen vergleichbaren Lauf |

Damit ist das Holen der Seiten praktisch gratis, und du kannst 100 Leads in einem Durchgang machen statt in vieren. Einrichtung ist eine Zeile, ohne Konto und ohne Schlüssel:

```bash
python3 -m venv .venv-scrapling && .venv-scrapling/bin/pip install "scrapling[all]"
```

Ohne Scrapling läuft alles genauso, nur langsamer und ohne JavaScript-Inhalte. Der Setup-Prompt fragt dich danach und richtet es auf Wunsch ein.

## Voraussetzungen

- [Claude Code](https://claude.com/claude-code)
- Apify-Konto für Scrapes ([Free-Plan](https://apify.com/pricing) reicht: 5 USD Guthaben im Monat, keine Kreditkarte). Ohne geht es auch, dann per Web-Recherche
- **Empfohlen:** [Scrapling](https://github.com/D4Vinci/Scrapling), kostenlos und in einer Zeile installiert. Macht das Lesen von Websites um ein Vielfaches schneller und sieht auch JavaScript-Inhalte
- Optional: [Firecrawl](https://firecrawl.dev) als MCP. Bequem für kleine Läufe, rechnet aber in Credits. Ohne beides fällt der Agent auf einfaches Seitenabrufen zurück, das funktioniert, ist aber langsamer und JavaScript-blind

## Rechtlicher Hinweis

Dieses System recherchiert öffentlich zugängliche Unternehmensdaten. Ob und wie du die Kontakte ansprichst, entscheidest du, und die rechtssichere Nutzung liegt bei dir. In Deutschland gibt es dafür belastbare Wege: das Telefonat mit sachlichem Bezug zum Geschäftsgegenstand des Angerufenen (§ 7 UWG kennt für B2B die mutmaßliche Einwilligung), Briefpost, die Ansprache über LinkedIn und der Weg über eigene Inhalte mit Opt-in. Für E-Mail-Werbung gelten strengere Anforderungen als fürs Telefon. Im Zweifel klärst du das einmal mit jemandem, der es beurteilen kann, und danach nie wieder.

## Lizenz

MIT (siehe [LICENSE](LICENSE)).

Gebaut von [Sebastian Kauffmann](https://github.com/sebaskauf) (SKAILE) mit Claude Code.
