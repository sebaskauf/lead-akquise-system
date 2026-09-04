# Offen / nicht verifiziert

Stand 03.09.2026, nach **neun Testläufen** in sieben Branchen. Gesamtkosten aller Tests: 1,70 USD.

## Was geprüft ist

| Bereich | Belegt durch |
|---|---|
| Preistabelle Apify | drei Läufe, Schätzung traf jeweils auf den Zehntelcent |
| LinkedIn-Kette (company, posts, employees, profile-search) | zwei Läufe, Preise zurückgerechnet |
| Verifikationsregel für LinkedIn-Zuordnung | griff dreimal, verhinderte Firmen aus Nigeria, Texas, Pakistan in einer Hamburg-Liste |
| Verbands- und Innungslisten als Quelle | zweimal besser als der bezahlte Scrape |
| Der kostenlose Weg ohne jedes Guthaben | lieferte 10 bis 15 Leads mit Ansprechpartnern |
| Trennung benachbarter Branchen | 5 Druckereien aus einer Maschinenbau-Liste erkannt |
| Negativ-Kriterien belegen | 11 von 15 mit positivem Gegenbeleg statt "nicht gefunden" |
| Personensuche über LinkedIn | 12 Personen, alle unabhängig verifiziert |

## 1. Grosse Läufe sind nicht gemessen

Der grösste Testlauf holte 100 Rohtreffer. Ungeprüft: ob die Blockgrössen bei 500 Firmen tragen, wie lange das dauert und ob der Kontext für die Auswertung reicht. Für grosse Läufe gibt es Hochrechnungen, keine Messung.

## 2. Firecrawl ist nur in einem Lauf zum Einsatz gekommen

Danach war das Kontingent aufgebraucht. Die Angaben zu Credits, Rate-Limit und JSON-Schema stammen aus diesem einen Lauf plus einem Teillauf. Der Weg über `WebFetch` ist dagegen mehrfach erprobt.

## 3. Ein rein zur Laufzeit erzeugtes Merkmal bleibt unsichtbar

Prüfbar sind Merkmale, die im Quelltext eine Spur hinterlassen: Skript-URLs, iframes, ausgehende Links, Text. Ein Dienst, der ausschliesslich zur Laufzeit erzeugt wird und keine dieser Spuren hinterlässt, wird übersehen. Unwahrscheinlich, nicht ausgeschlossen.

## 4. Das Grössenkriterium ist selten belegbar

Über alle Läufe hinweg die härteste Grenze: Deutsche Mittelständler veröffentlichen ihre Mitarbeiterzahl fast nie. Belegquoten lagen bei 3 bis 6 von 15. Die Ausnahme war der Orgelbau, wo Verbandsdaten die Zahl mitliefern. LinkedIns `employeeCount` taugt nicht als Ersatz, er unterschätzt um Faktor 2 bis 3.

## 5. Preise gelten für die Free-Plan-Stufe

Ab Starter sinkt `place-scraped` auf 0,003 USD. Apify ändert Preise ohne Ankündigung. Verbindlich ist immer `usageTotalUsd` nach dem Lauf.
