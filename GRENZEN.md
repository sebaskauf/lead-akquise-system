# Was dieses System kann - und was nicht

Die meisten Tools verschweigen ihre Grenzen. Hier stehen sie, damit du weißt,
worauf du dich verlassen kannst und worauf nicht.

Grundlage sind neun Testläufe in sieben Branchen.

## Was belegt ist

| Was | Belegt durch |
|---|---|
| Preistabelle Apify | drei Läufe, Schätzung traf jeweils auf den Zehntelcent |
| LinkedIn-Kette (company, posts, employees, profile-search) | zwei Läufe, Preise zurückgerechnet |
| Verifikationsregel für LinkedIn-Zuordnung | griff dreimal, verhinderte Firmen aus Nigeria, Texas, Pakistan in einer Hamburg-Liste |
| Verbands- und Innungslisten als Quelle | zweimal besser als der bezahlte Scrape |
| Der kostenlose Weg ohne jedes Guthaben | lieferte 10 bis 15 Leads mit Ansprechpartnern |
| Trennung benachbarter Branchen | 5 Druckereien aus einer Maschinenbau-Liste erkannt |
| Negativ-Kriterien belegen | 11 von 15 mit positivem Gegenbeleg statt "nicht gefunden" |
| Personensuche über LinkedIn | 12 Personen, alle unabhängig verifiziert |

## Sehr große Läufe sind nicht gemessen

Der größte Testlauf holte 100 Rohtreffer. Ungeprüft: ob die Blockgrößen bei 500 Firmen tragen, wie lange das dauert und ob der Kontext für die Auswertung reicht. Für große Läufe gibt es Hochrechnungen, keine Messung.

## Firecrawl ist kaum erprobt

Danach war das Kontingent aufgebraucht. Die Angaben zu Credits, Rate-Limit und JSON-Schema stammen aus diesem einen Lauf plus einem Teillauf. Der Weg über `WebFetch` ist dagegen mehrfach erprobt.

## Manche Website-Merkmale bleiben unsichtbar

Prüfbar sind Merkmale, die im Quelltext eine Spur hinterlassen: Skript-URLs, iframes, ausgehende Links, Text. Ein Dienst, der ausschließlich zur Laufzeit erzeugt wird und keine dieser Spuren hinterlässt, wird übersehen. Unwahrscheinlich, nicht ausgeschlossen.

## Mitarbeiterzahlen sind selten belegbar

Über alle Läufe hinweg die härteste Grenze: Deutsche Mittelständler veröffentlichen ihre Mitarbeiterzahl fast nie. Belegquoten lagen bei 3 bis 6 von 15. Die Ausnahme war der Orgelbau, wo Verbandsdaten die Zahl mitliefern. LinkedIns `employeeCount` taugt nicht als Ersatz, er unterschätzt um Faktor 2 bis 3.

## Die Preisangaben gelten für den Free-Plan

Ab Starter sinkt `place-scraped` auf 0,003 USD. Apify ändert Preise ohne Ankündigung. Verbindlich ist immer `usageTotalUsd` nach dem Lauf.

## Was das für dich heißt

Für den Normalfall - eine Branche, eine Region, 50 bis 200 Firmen - ist das
System erprobt. Bei sehr großen Läufen, bei Kriterien, die nirgends
geschrieben stehen, und bei Mitarbeiterzahlen solltest du damit rechnen,
dass Felder leer bleiben.

**Ein leeres Feld ist kein Fehler, sondern eine ehrliche Angabe.** Der Agent
schreibt lieber nichts hin als etwas Geratenes. Die Liste sagt dir zu jedem
Lead, ob eine Angabe belegt, offen oder ungeprüft ist - das sind drei
verschiedene Handlungen für dich.
