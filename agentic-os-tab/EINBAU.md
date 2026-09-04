# LEADS-Tab ins Agentic OS einbauen

Diese Anleitung richtet sich an Claude, nicht an den Nutzer. Sie baut den
LEADS-Tab in ein bestehendes Agentic OS ein: Firmen links, Steckbrief und
Kontaktdaten rechts, Status per Klick, Website und LinkedIn direkt anklickbar.

Der Tab liest genau die Dateien, die der `lead-akquise`-Agent ohnehin schreibt.
Es gibt keine zweite Datenhaltung.

## Voraussetzungen prüfen

Bevor du irgendetwas anfasst:

- **Node und npm** vorhanden (`node --version`, `npm --version`). Fehlt das, brich hier ab und sag dem Nutzer, dass er Node installieren muss (nodejs.org, LTS-Version). Ohne Node lässt sich das Plugin nicht bauen.
- **Der Vault des Nutzers.** Rate den Pfad nicht. Unter macOS steht in `~/Library/Application Support/obsidian/obsidian.json`, welche Vaults es gibt. Gibt es mehrere, frag welcher. Das Plugin liegt unter `<vault>/.obsidian/plugins/agentic-os/`.
- **Der Tab ist noch nicht da:** `grep -c leads-root <vault>/.obsidian/plugins/agentic-os/main.js` muss 0 ergeben. Ist er schon drin, bist du fertig, sag das dem Nutzer.

## Ablauf

### 1. Quellcode holen

Das Plugin im Vault ist nur das fertige Bundle, dort lässt sich nichts einbauen.
Hol den Quellcode in einen Arbeitsordner:

```
git clone https://github.com/sebaskauf/agentic-os.git ~/Documents/Projects/agentic-os
cd ~/Documents/Projects/agentic-os
npm install
```

Existiert der Ordner schon, dort `git pull`.

**Versionsabgleich, bevor du weitermachst:** Vergleich `manifest.json` im
geklonten Repo mit der `manifest.json` im Vault des Nutzers. Ist die Version im
Vault **neuer** als im Repo, brich ab und sag dem Nutzer Bescheid - ein Build aus
dem älteren Quellcode würde ihm neuere Tabs wegnehmen. In dem Fall ist ein
Plugin-Update über die Skool-Section der richtige Weg, nicht dieser Einbau.

### 2. Dateien kopieren

Aus diesem Ordner (`agentic-os-tab/` im lead-akquise-system-Repo) nach `src/`:

```
cp agentic-os-tab/LeadsView.tsx  ~/Documents/Projects/agentic-os/src/
cp agentic-os-tab/loadLeads.ts   ~/Documents/Projects/agentic-os/src/
```

Und das CSS ans Ende von `styles.css` anhängen:

```
cat agentic-os-tab/leads.css >> ~/Documents/Projects/agentic-os/styles.css
```

### 3. Vier Stellen in `src/App.tsx` ändern

Die Zeilennummern unten gelten für v0.2.2. Such die Stellen über den Inhalt,
nicht über die Nummer - die Datei kann sich geändert haben.

**a) Import** - direkt nach dem Import von `CutterView`:

```tsx
import { LeadsView } from "./LeadsView";
```

**b) Der Typ `TabId`** - `"LEADS"` ergänzen:

```tsx
type TabId = "OVERVIEW" | "RESEARCH" | "CUTTER" | "LEADS";
```

Heißt der Typ anders oder ist `tab` schlicht ein `string`, entfällt dieser
Schritt. Prüf das, statt blind zu ersetzen.

**c) Die Tab-Leiste** - einen Eintrag ergänzen, am besten hinter `CUTTER`:

```tsx
const TABS: Array<[TabId, string]> = [["OVERVIEW", "ÜBERSICHT"], ["RESEARCH", "RESEARCH"], ["CUTTER", "CUTTER"], ["LEADS", "LEADS"]];
```

In neueren Fassungen ist das ein mehrzeiliges Array. Dann dort `["LEADS", "LEADS"],`
als eigene Zeile einfügen.

**d) Das Rendering** - in die Verzweigung einhängen, die schon `CUTTER`
abfängt. Aus:

```tsx
{tab === "CUTTER" ? (
    <CutterView />
) : (
```

wird:

```tsx
{tab === "CUTTER" ? (
    <CutterView />
) : tab === "LEADS" ? (
    <LeadsView />
) : (
```

### 4. Bauen und prüfen

```
cd ~/Documents/Projects/agentic-os
npx tsc --noEmit --skipLibCheck    # muss fehlerfrei durchlaufen
npm run build
```

Meldet TypeScript Fehler in `LeadsView.tsx` oder `loadLeads.ts` zu
Array-Zugriffen, hat das Projekt `noUncheckedIndexedAccess` an. Dann fehlt in
diesen Dateien ein `?? ""` oder eine Prüfung - meld das dem Nutzer, statt die
Prüfung abzuschalten.

Danach im Bundle nachsehen (esbuild minifiziert Funktionsnamen, deshalb nach
CSS-Klassen suchen, nicht nach `LeadsView`):

```
grep -c leads-root main.js        # muss 1 sein
grep -c leads-steckbrief main.js  # muss 1 sein
```

### 5. Ins Vault kopieren

**Sicher erst das Alte:**

```
cp <vault>/.obsidian/plugins/agentic-os/main.js    <vault>/.obsidian/plugins/agentic-os/main.js.bak
cp <vault>/.obsidian/plugins/agentic-os/styles.css <vault>/.obsidian/plugins/agentic-os/styles.css.bak
```

Dann die neuen Dateien hinüber:

```
cp main.js styles.css <vault>/.obsidian/plugins/agentic-os/
```

Sag dem Nutzer, dass Obsidian das Plugin jetzt neu lädt und **offene Terminals
im Cockpit dabei geschlossen werden**. Läuft deine eigene Sitzung in so einem
Terminal, sag ihm das vorher - sie wird mit beendet.

### 6. Datenordner anlegen

```
mkdir -p ~/.skaile/data/leads
```

Trag in `LEAD-SETUP.md` im Arbeitsordner ein, dass die Leads dorthin gehören,
ein Unterordner je Kampagne.

## Wenn etwas schiefgeht

Der Tab erscheint nicht oder das Cockpit bleibt leer: Spiel die Sicherung
zurück (`main.js.bak`, `styles.css.bak`), lade Obsidian neu, und sag dem
Nutzer, was du versucht hast. Ein kaputtes Cockpit ist schlimmer als ein
fehlender Tab.
