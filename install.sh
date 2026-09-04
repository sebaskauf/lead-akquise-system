#!/usr/bin/env bash
# Installiert den lead-akquise-Agenten nach ~/.claude/agents/.
# Bestehende Dateien werden vorher mit Zeitstempel gesichert.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZIEL="${HOME}/.claude/agents"
QUELLE="${REPO}/agent/lead-akquise.md"

[ -f "$QUELLE" ] || { echo "FEHLER: $QUELLE fehlt."; exit 1; }
mkdir -p "$ZIEL"

if [ -f "${ZIEL}/lead-akquise.md" ]; then
  BACKUP="${ZIEL}/lead-akquise.md.bak-$(date +%Y%m%d-%H%M%S)"
  cp "${ZIEL}/lead-akquise.md" "$BACKUP"
  echo "Vorhandene Version gesichert: $BACKUP"
fi

cp "$QUELLE" "${ZIEL}/lead-akquise.md"
echo "Installiert: ${ZIEL}/lead-akquise.md"
echo
echo "Starte Claude Code einmal neu, damit der Agent geladen wird."
