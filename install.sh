#!/usr/bin/env bash
# Installiert den lead-akquise-Agenten nach ~/.claude/agents/.
# Eine bestehende Datei wird nie ohne ausdrückliche Ansage überschrieben.
#
#   ./install.sh                    installiert, fragt bei Kollision nach
#   ./install.sh --force            überschreibt (sichert vorher mit Zeitstempel)
#   ./install.sh --name leads  installiert unter anderem Namen
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZIEL="${HOME}/.claude/agents"
QUELLE="${REPO}/agent/lead-akquise.md"
NAME="lead-akquise"
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --name)  NAME="${2:-}"; [ -n "$NAME" ] || { echo "FEHLER: --name braucht einen Wert."; exit 1; }; shift 2 ;;
    -h|--help) sed -n '2,7p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "FEHLER: unbekannte Option '$1'."; exit 1 ;;
  esac
done

[ -f "$QUELLE" ] || { echo "FEHLER: $QUELLE fehlt."; exit 1; }
mkdir -p "$ZIEL"
DATEI="${ZIEL}/${NAME}.md"

if [ -f "$DATEI" ] && [ "$FORCE" -eq 0 ]; then
  echo "Es liegt schon ein Agent unter ${DATEI}:"
  echo
  sed -n '1,6p' "$DATEI" | sed 's/^/  /' | cut -c1-160
  echo
  echo "Der wird NICHT überschrieben. Wenn das dein eigener Agent ist, behalt ihn."
  echo
  echo "Du hast zwei Möglichkeiten:"
  echo "  ./install.sh --force              überschreiben (vorher wird gesichert)"
  echo "  ./install.sh --name leads    unter anderem Namen installieren"
  echo
  echo "Es wurde nichts verändert."
  exit 2
fi

if [ -f "$DATEI" ]; then
  BACKUP="${DATEI}.bak-$(date +%Y%m%d-%H%M%S)"
  cp "$DATEI" "$BACKUP"
  echo "Vorhandene Version gesichert: $BACKUP"
fi

cp "$QUELLE" "$DATEI"

# Beim Umbenennen muss das name-Feld mitziehen, sonst findet Claude den Agenten nicht.
if [ "$NAME" != "lead-akquise" ]; then
  perl -0pi -e "s/^name: lead-akquise$/name: ${NAME}/m" "$DATEI"
fi

echo "Installiert als '${NAME}': ${DATEI}"
echo
echo "Wenn du gerade den Setup-Prompt abarbeitest, geht es direkt weiter -"
echo "ein Neustart ist erst am Ende nötig. Rufst du den Agenten dagegen jetzt"
echo "zum ersten Mal auf, starte Claude Code einmal neu."
