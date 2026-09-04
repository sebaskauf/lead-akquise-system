import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Der lead-akquise-Agent legt pro Firma eine Markdown-Datei mit flachem Frontmatter ab.
// Ein Ordner je Kampagne (Branche + Region), damit mehrere Recherchen nebeneinander leben.
// Für Nutzer ohne Agentic OS schreibt derselbe Agent eine CSV - dieser Tab liest nur die MDs.
export const LEADS_ROOT = join(homedir(), ".skaile/data/leads");

export type LeadStatus = "neu" | "kontaktiert" | "termin" | "gewonnen" | "verloren";

export const STATUS_ORDER: LeadStatus[] = ["neu", "kontaktiert", "termin", "gewonnen", "verloren"];

export interface Lead {
	/** Dateipfad, zugleich stabile id */
	path: string;
	firma: string;
	ort?: string;
	branche?: string;
	/** Ein bis zwei Sätze: was die Firma macht und anbietet */
	beschreibung?: string;
	/** Straße und PLZ, ergänzt den groben `ort` */
	adresse?: string;
	website?: string;
	telefon?: string;
	mail?: string;
	linkedin?: string;
	ansprechpartner?: string;
	position?: string;
	mitarbeiter?: string;
	status: LeadStatus;
	followup?: string;
	/** 1-10, vom Agenten vergeben */
	score?: number;
	quelle?: string;
	/** Kaufsignale als Liste, im Frontmatter kommagetrennt */
	signale: string[];
	/** Freitext unter dem Frontmatter (Begründung, Fundstellen, Notizen) */
	body: string;
	mtimeMs: number;
}

export interface LeadCampaign {
	/** Ordnername, z.B. "elektro-hamburg" */
	id: string;
	/** Anzeigename aus _kampagne.md, sonst der Ordnername */
	name: string;
	path: string;
	leads: Lead[];
}

/** Flaches YAML zwischen den --- Zeilen. Bewusst simpel: der Agent schreibt keine
 *  verschachtelten Strukturen, und Obsidian-Properties brechen bei nested YAML. */
function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
	if (!raw.startsWith("---")) return { fm: {}, body: raw.trim() };
	const end = raw.indexOf("\n---", 3);
	if (end === -1) return { fm: {}, body: raw.trim() };
	const head = raw.slice(3, end);
	const body = raw.slice(end + 4).trim();
	const fm: Record<string, string> = {};
	for (const line of head.split("\n")) {
		const i = line.indexOf(":");
		if (i <= 0) continue;
		const key = line.slice(0, i).trim().toLowerCase();
		let val = line.slice(i + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		if (key) fm[key] = val;
	}
	return { fm, body };
}

function toStatus(v: string | undefined): LeadStatus {
	const s = (v ?? "").trim().toLowerCase();
	return (STATUS_ORDER as string[]).includes(s) ? (s as LeadStatus) : "neu";
}

function parseLead(path: string): Lead | null {
	let raw: string;
	try {
		raw = readFileSync(path, "utf8");
	} catch {
		return null;
	}
	const { fm, body } = parseFrontmatter(raw);
	// Ohne Firmenname ist der Eintrag für die Übersicht wertlos - Dateiname als Rückfall.
	const firma = fm.firma || fm.name || path.split("/").pop()?.replace(/\.md$/, "") || "";
	if (!firma) return null;

	const scoreNum = Number(fm.score);
	let mtimeMs = 0;
	try {
		mtimeMs = statSync(path).mtimeMs;
	} catch {
		/* Datei kann zwischen readdir und stat verschwinden */
	}

	return {
		path,
		firma,
		ort: fm.ort || undefined,
		branche: fm.branche || undefined,
		beschreibung: fm.beschreibung || fm.was || undefined,
		adresse: fm.adresse || undefined,
		website: fm.website || undefined,
		telefon: fm.telefon || undefined,
		mail: fm.mail || fm.email || undefined,
		linkedin: fm.linkedin || undefined,
		ansprechpartner: fm.ansprechpartner || undefined,
		position: fm.position || undefined,
		mitarbeiter: fm.mitarbeiter || undefined,
		status: toStatus(fm.status),
		followup: fm.followup || undefined,
		score: Number.isFinite(scoreNum) && scoreNum > 0 ? scoreNum : undefined,
		quelle: fm.quelle || undefined,
		signale: (fm.signale || "")
			.split(/[;,]/)
			.map((s) => s.trim())
			.filter(Boolean),
		body,
		mtimeMs,
	};
}

/** Alle Kampagnen-Ordner unter LEADS_ROOT. Fehlt der Ordner, ist das kein Fehler:
 *  dann hat der Nutzer den Lead-Agenten schlicht noch nicht laufen lassen. */
export function loadLeadCampaigns(): LeadCampaign[] {
	if (!existsSync(LEADS_ROOT)) return [];
	let dirs: string[];
	try {
		dirs = readdirSync(LEADS_ROOT, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
	} catch {
		return [];
	}

	const campaigns: LeadCampaign[] = [];
	for (const id of dirs) {
		const dir = join(LEADS_ROOT, id);
		let files: string[];
		try {
			files = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
		} catch {
			continue;
		}
		const leads = files
			.map((f) => parseLead(join(dir, f)))
			.filter((l): l is Lead => l !== null)
			.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.firma.localeCompare(b.firma));

		let name = id;
		const metaPath = join(dir, "_kampagne.md");
		if (existsSync(metaPath)) {
			const { fm } = parseFrontmatter(readFileSync(metaPath, "utf8"));
			if (fm.name) name = fm.name;
		}
		campaigns.push({ id, name, path: dir, leads });
	}
	return campaigns.sort((a, b) => a.name.localeCompare(b.name));
}

/** Schreibt genau ein Frontmatter-Feld zurueck, ohne den Rest der Datei anzufassen.
 *  Der Nutzer editiert dieselben Dateien in Obsidian - deshalb kein Neuschreiben. */
export function updateLeadField(path: string, key: string, value: string): boolean {
	let raw: string;
	try {
		raw = readFileSync(path, "utf8");
	} catch {
		return false;
	}
	if (!raw.startsWith("---")) return false;
	const end = raw.indexOf("\n---", 3);
	if (end === -1) return false;

	const head = raw.slice(3, end);
	const rest = raw.slice(end);
	const lines = head.split("\n");
	const idx = lines.findIndex((l) => l.trim().toLowerCase().startsWith(key.toLowerCase() + ":"));
	if (idx >= 0) {
		lines[idx] = `${key}: ${value}`;
	} else {
		// Am Ende des Frontmatters anhängen, leere Schlusszeile berücksichtigen.
		const at = (lines[lines.length - 1] ?? "").trim() === "" ? lines.length - 1 : lines.length;
		lines.splice(at, 0, `${key}: ${value}`);
	}
	try {
		writeFileSync(path, "---" + lines.join("\n") + rest, "utf8");
		return true;
	} catch {
		return false;
	}
}

/** Vollständigkeit eines Leads: wie viele der sechs nützlichen Felder gefüllt sind. */
export function leadCompleteness(l: Lead): number {
	const fields = [l.website, l.telefon, l.mail, l.ansprechpartner, l.mitarbeiter, l.linkedin];
	return fields.filter(Boolean).length;
}

/** Fällig heißt: Follow-up-Datum liegt heute oder in der Vergangenheit. */
export function isOverdue(l: Lead, today = new Date()): boolean {
	if (!l.followup) return false;
	const d = new Date(l.followup);
	if (Number.isNaN(d.getTime())) return false;
	const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	return d.getTime() <= t.getTime();
}
