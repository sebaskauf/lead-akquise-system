import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
	loadLeadCampaigns,
	updateLeadField,
	leadCompleteness,
	isOverdue,
	STATUS_ORDER,
	LEADS_ROOT,
	type Lead,
	type LeadCampaign,
	type LeadStatus,
} from "./loadLeads";

const STATUS_LABEL: Record<LeadStatus, string> = {
	neu: "neu",
	kontaktiert: "kontaktiert",
	termin: "Termin",
	gewonnen: "gewonnen",
	verloren: "verloren",
};

/** Öffnet im echten Standardbrowser, nicht in einem Obsidian-Fenster. */
function openExternal(url: string): void {
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const electron = require("electron");
		if (electron?.shell?.openExternal) {
			void electron.shell.openExternal(url);
			return;
		}
	} catch {
		/* kein Electron erreichbar - Fallback unten */
	}
	window.open(url, "_blank");
}

function normalizeUrl(raw: string): string {
	const s = raw.trim();
	if (/^https?:\/\//i.test(s)) return s;
	return "https://" + s.replace(/^\/+/, "");
}

function hostOf(url: string): string {
	try {
		return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

function formatDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Sehr kleiner Markdown-Renderer für den Notizteil: Überschriften, Listen, fett, Links.
 *  Bewusst kein Fremdpaket - der Agent schreibt hier nur einfaches Markdown. */
function renderNotes(body: string): React.ReactNode {
	const blocks = body.split(/\n{2,}/);
	return blocks.map((block, bi) => {
		const lines = block.split("\n");
		const first = lines[0] ?? "";
		if (first.startsWith("#")) {
			const level = first.match(/^#+/)?.[0]?.length ?? 2;
			const text = first.replace(/^#+\s*/, "");
			const rest = lines.slice(1).join("\n");
			return (
				<div key={bi}>
					<div className={"leads-note-h" + (level >= 3 ? " sub" : "")}>{text}</div>
					{rest.trim() ? <div className="leads-note-p">{inline(rest)}</div> : null}
				</div>
			);
		}
		if (lines.every((l) => /^\s*[-*]\s+/.test(l) || l.trim() === "")) {
			return (
				<ul key={bi} className="leads-note-ul">
					{lines
						.filter((l) => l.trim())
						.map((l, li) => (
							<li key={li}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
						))}
				</ul>
			);
		}
		return (
			<div key={bi} className="leads-note-p">
				{inline(block)}
			</div>
		);
	});
}

/** **fett** und nackte URLs klickbar machen. */
function inline(text: string): React.ReactNode {
	const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
	return parts.map((p, i) => {
		if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
		if (/^https?:\/\//.test(p)) {
			return (
				<a
					key={i}
					className="leads-inline-link"
					onClick={(e) => {
						e.preventDefault();
						openExternal(p);
					}}
				>
					{hostOf(p)}
				</a>
			);
		}
		return <React.Fragment key={i}>{p}</React.Fragment>;
	});
}

function ScoreDot({ score }: { score?: number }): React.ReactElement {
	const s = score ?? 0;
	const tone = s >= 8 ? "hot" : s >= 6 ? "warm" : "cold";
	return (
		<span className={"leads-score " + tone} title={s ? `Score ${s} von 10` : "kein Score"}>
			{s || "-"}
		</span>
	);
}

interface ActionProps {
	label: string;
	value: string;
	href: string;
	kind: string;
}

function ActionLink({ label, value, href, kind }: ActionProps): React.ReactElement {
	const [copied, setCopied] = useState(false);
	const isWeb = kind === "web" || kind === "linkedin";
	return (
		<div className={"leads-action " + kind}>
			<div className="leads-action-label">{label}</div>
			<div className="leads-action-row">
				<a
					className="leads-action-value"
					title={isWeb ? "Im Browser öffnen" : value}
					onClick={(e) => {
						e.preventDefault();
						openExternal(href);
					}}
				>
					{value}
				</a>
				<button
					className="leads-copy"
					title="Kopieren"
					onClick={() => {
						void navigator.clipboard.writeText(value);
						setCopied(true);
						window.setTimeout(() => setCopied(false), 1200);
					}}
				>
					{copied ? "kopiert" : "kopieren"}
				</button>
			</div>
		</div>
	);
}

export function LeadsView(): React.ReactElement {
	const [campaigns, setCampaigns] = useState<LeadCampaign[]>([]);
	const [campaignId, setCampaignId] = useState<string>("");
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<LeadStatus | "alle" | "fällig">("alle");
	const [selectedPath, setSelectedPath] = useState<string>("");

	const reload = useCallback(() => {
		const list = loadLeadCampaigns();
		setCampaigns(list);
		setCampaignId((cur) => (cur && list.some((c) => c.id === cur) ? cur : (list[0]?.id ?? "")));
	}, []);

	useEffect(() => {
		reload();
		const t = window.setInterval(reload, 20000);
		return () => window.clearInterval(t);
	}, [reload]);

	const campaign = campaigns.find((c) => c.id === campaignId);
	const allLeads = useMemo(() => campaign?.leads ?? [], [campaign]);

	const counts = useMemo(() => {
		const c: Record<string, number> = { alle: allLeads.length, fällig: 0 };
		for (const s of STATUS_ORDER) c[s] = 0;
		for (const l of allLeads) {
			c[l.status] = (c[l.status] ?? 0) + 1;
			if (isOverdue(l)) c.fällig = (c.fällig ?? 0) + 1;
		}
		return c;
	}, [allLeads]);

	const leads = useMemo(() => {
		const q = query.trim().toLowerCase();
		return allLeads.filter((l) => {
			if (statusFilter === "fällig" && !isOverdue(l)) return false;
			if (statusFilter !== "alle" && statusFilter !== "fällig" && l.status !== statusFilter)
				return false;
			if (!q) return true;
			return [l.firma, l.ort, l.branche, l.beschreibung, l.ansprechpartner, l.signale.join(" "), l.body]
				.filter(Boolean)
				.join(" ")
				.toLowerCase()
				.includes(q);
		});
	}, [allLeads, query, statusFilter]);

	// Auswahl gültig halten, wenn Filter oder Kampagne wechseln.
	useEffect(() => {
		if (leads.length === 0) {
			setSelectedPath("");
		} else if (!leads.some((l) => l.path === selectedPath)) {
			setSelectedPath(leads[0]?.path ?? "");
		}
	}, [leads, selectedPath]);

	const selected = leads.find((l) => l.path === selectedPath) ?? null;

	const setStatus = (lead: Lead, status: LeadStatus): void => {
		if (updateLeadField(lead.path, "status", status)) reload();
	};

	const step = useCallback(
		(delta: number) => {
			if (leads.length === 0) return;
			const i = leads.findIndex((l) => l.path === selectedPath);
			const next = Math.max(0, Math.min(leads.length - 1, (i < 0 ? 0 : i) + delta));
			const target = leads[next];
			if (target) setSelectedPath(target.path);
		},
		[leads, selectedPath],
	);

	if (campaigns.length === 0) {
		return (
			<div className="leads-empty">
				<div className="leads-empty-title">Noch keine Leads da</div>
				<div className="leads-empty-text">
					Der Lead-Agent legt seine Ergebnisse unter <code>{LEADS_ROOT}</code> ab, ein Ordner je
					Kampagne. Sobald dort etwas liegt, erscheint es hier.
				</div>
				<div className="leads-empty-hint">
					Starte den Agenten mit: <code>lead-akquise</code> und nenn ihm deine Zielgruppe.
				</div>
			</div>
		);
	}

	return (
		<div className="leads-root" onKeyDown={(e) => {
			if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
			if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
		}} tabIndex={0}>
			<div className="leads-bar">
				<select
					className="leads-select"
					value={campaignId}
					onChange={(e) => setCampaignId(e.target.value)}
				>
					{campaigns.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name} ({c.leads.length})
						</option>
					))}
				</select>

				<input
					className="leads-search"
					placeholder="Firma, Ort, Ansprechpartner, Signal ..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>

				<div className="leads-chips">
					{(["alle", "fällig", ...STATUS_ORDER] as const).map((s) => (
						<button
							key={s}
							className={
								"leads-chip " + (statusFilter === s ? "active " : "") + (s === "fällig" ? "due " : "") + s
							}
							onClick={() => setStatusFilter(s)}
						>
							{s === "alle" ? "alle" : s === "fällig" ? "fällig" : STATUS_LABEL[s]}
							<span className="leads-chip-n">{counts[s] ?? 0}</span>
						</button>
					))}
				</div>
			</div>

			<div className="leads-body">
				<div className="leads-list">
					{leads.length === 0 ? (
						<div className="leads-list-empty">Kein Treffer</div>
					) : (
						leads.map((l) => (
							<button
								key={l.path}
								className={"leads-item " + (l.path === selectedPath ? "sel" : "")}
								onClick={() => setSelectedPath(l.path)}
							>
								<ScoreDot score={l.score} />
								<div className="leads-item-main">
									<div className="leads-item-firma">{l.firma}</div>
									<div className="leads-item-sub">
										{[l.ort, l.mitarbeiter ? l.mitarbeiter + " MA" : null]
											.filter(Boolean)
											.join(" · ")}
									</div>
								</div>
								<div className="leads-item-right">
									<span className={"leads-badge " + l.status}>{STATUS_LABEL[l.status]}</span>
									{isOverdue(l) ? <span className="leads-due-dot" title="Follow-up fällig" /> : null}
								</div>
							</button>
						))
					)}
				</div>

				<div className="leads-detail">
					{!selected ? (
						<div className="leads-list-empty">Nichts ausgewählt</div>
					) : (
						<>
							<div className="leads-head">
								<div className="leads-head-left">
									{selected.website ? (
										<a
											className="leads-firma link"
											title="Website öffnen"
											onClick={(e) => {
												e.preventDefault();
												openExternal(normalizeUrl(selected.website ?? ""));
											}}
										>
											{selected.firma}
											<span className="leads-firma-ext">↗</span>
										</a>
									) : (
										<div className="leads-firma">{selected.firma}</div>
									)}
									<div className="leads-meta">
										{[selected.branche, selected.ort, selected.mitarbeiter ? selected.mitarbeiter + " Mitarbeiter" : null]
											.filter(Boolean)
											.join(" · ")}
									</div>
								</div>
								<div className="leads-head-right">
									<ScoreDot score={selected.score} />
								</div>
							</div>

							{selected.beschreibung || selected.adresse ? (
								<div className="leads-steckbrief">
									{selected.beschreibung ? (
										<div className="leads-was">{selected.beschreibung}</div>
									) : null}
									{selected.adresse ? (
										<div className="leads-adresse">
											<span className="leads-adresse-pin">◉</span>
											<a
												title="In Google Maps öffnen"
												onClick={(e) => {
													e.preventDefault();
													openExternal(
														"https://www.google.com/maps/search/?api=1&query=" +
															encodeURIComponent(
																selected.firma + ", " + selected.adresse + (selected.ort ? ", " + selected.ort : ""),
															),
													);
												}}
											>
												{selected.adresse}
												{selected.ort ? ", " + selected.ort : ""}
											</a>
										</div>
									) : null}
								</div>
							) : null}

							<div className="leads-statusrow">
								{STATUS_ORDER.map((s) => (
									<button
										key={s}
										className={"leads-status-btn " + s + (selected.status === s ? " on" : "")}
										onClick={() => setStatus(selected, s)}
									>
										{STATUS_LABEL[s]}
									</button>
								))}
								{selected.followup ? (
									<span className={"leads-followup" + (isOverdue(selected) ? " due" : "")}>
										Follow-up {formatDate(selected.followup)}
									</span>
								) : null}
							</div>

							<div className="leads-actions">
								{selected.website ? (
									<ActionLink
										kind="web"
										label="Website"
										value={hostOf(selected.website)}
										href={normalizeUrl(selected.website)}
									/>
								) : null}
								{selected.mail ? (
									<ActionLink
										kind="mail"
										label="E-Mail"
										value={selected.mail}
										href={"mailto:" + selected.mail}
									/>
								) : null}
								{selected.telefon ? (
									<ActionLink
										kind="tel"
										label="Telefon"
										value={selected.telefon}
										href={"tel:" + selected.telefon.replace(/[^\d+]/g, "")}
									/>
								) : null}
								{selected.linkedin ? (
									<ActionLink
										kind="linkedin"
										label="LinkedIn"
										value={selected.ansprechpartner ?? "Profil"}
										href={normalizeUrl(selected.linkedin)}
									/>
								) : null}
							</div>

							{selected.ansprechpartner ? (
								<div className="leads-person">
									<span className="leads-person-name">{selected.ansprechpartner}</span>
									{selected.position ? (
										<span className="leads-person-role">{selected.position}</span>
									) : null}
								</div>
							) : null}

							{selected.signale.length > 0 ? (
								<div className="leads-signals">
									{selected.signale.map((s, i) => (
										<span key={i} className="leads-signal">
											{s}
										</span>
									))}
								</div>
							) : null}

							{selected.body ? <div className="leads-notes">{renderNotes(selected.body)}</div> : null}

							<div className="leads-foot">
								{selected.quelle ? <span>Quelle: {selected.quelle}</span> : null}
								<span>
									{leadCompleteness(selected)} von 6 Feldern gefüllt
								</span>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
