"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronDown,
  FiClipboard,
  FiEdit3,
  FiExternalLink,
  FiRotateCcw,
} from "react-icons/fi";

import { REVIEW_PAGES, STATUS_LABEL } from "@/components/karmo/review/reviewConfig";
import { fetchReview, formatWhen, submitDecision } from "@/components/karmo/review/reviewApi";
import ReviewHistory from "@/components/karmo/review/ReviewHistory";

const PAGE = "/";
const config = REVIEW_PAGES[PAGE];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "changes", label: "Needs changes" },
  { id: "pending", label: "Awaiting review" },
  { id: "approved", label: "Approved" },
];

const BADGE = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  changes: "bg-rose-50 text-rose-700 ring-rose-200",
};

const DOT = { pending: "bg-amber-400", approved: "bg-emerald-500", changes: "bg-rose-500" };

const statusOf = (record) => record?.status ?? "pending";

/** Latest "changes" entry of a section (the one the team still has to action). */
function latestChange(record) {
  const list = (record?.entries ?? []).filter((e) => e.status === "changes");
  return list[list.length - 1];
}

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_18px_40px_-26px_rgba(11,26,51,0.35)] ring-1 ring-black/5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className={`mt-2 text-[34px] font-bold leading-none tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

export default function ReviewDashboard() {
  const [records, setRecords] = useState({});
  const [temporary, setTemporary] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const json = await fetchReview(PAGE);
      setRecords(json.sections || {});
      setTemporary(Boolean(json.temporary));
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (!document.hidden) load();
    }, 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const sections = config.sections;
  const counts = useMemo(() => {
    const c = { approved: 0, changes: 0, pending: 0 };
    sections.forEach((s) => {
      c[statusOf(records[s.id])] += 1;
    });
    return c;
  }, [sections, records]);

  const pct = sections.length ? Math.round((counts.approved / sections.length) * 100) : 0;
  const visible = sections.filter((s) => filter === "all" || statusOf(records[s.id]) === filter);

  const reset = async (id) => {
    try {
      const section = await submitDecision({ page: PAGE, id, status: "reset", name: "Team" });
      setRecords((prev) => ({ ...prev, [id]: section }));
    } catch {
      /* the next poll will show the truth */
    }
  };

  const copyChangeList = async () => {
    const lines = [`HOMEPAGE - CHANGE REQUESTS (${counts.changes})`, ""];
    sections.forEach((s) => {
      const rec = records[s.id];
      if (statusOf(rec) !== "changes") return;
      const entry = latestChange(rec);
      lines.push(`[ ] ${s.label}`);
      if (entry?.note) lines.push(`    ${entry.note.replace(/\n/g, "\n    ")}`);
      (entry?.images ?? []).forEach((u) => lines.push(`    image: ${window.location.origin}${u}`));
      lines.push("");
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="bg-[#F6F7F9] pb-24 pt-10 sm:pt-14">
      <div className="shell max-w-5xl">
        {/* Heading */}
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">Client review</p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight text-ink sm:text-[36px]">
          {config.title} approval tracker
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink/60">
          Every section of the page, its approval status and the client&apos;s notes. This list updates by
          itself.
        </p>

        {/* Progress */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-26px_rgba(11,26,51,0.35)] ring-1 ring-black/5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">Overall progress</p>
              <p className="mt-1.5 text-[15px] font-semibold text-ink">
                {counts.approved} of {sections.length} sections approved
              </p>
            </div>
            <p className="text-[34px] font-bold leading-none tabular-nums text-emerald-600">{pct}%</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard label="Approved" value={counts.approved} tone="text-emerald-600" />
          <StatCard label="Needs changes" value={counts.changes} tone="text-rose-600" />
          <StatCard label="Awaiting" value={counts.pending} tone="text-amber-600" />
        </div>

        {temporary && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-[12.5px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <FiAlertTriangle className="mt-0.5 shrink-0 text-[16px]" />
            <p>
              Review data is being saved to a <strong>temporary folder</strong> and will be wiped on the next
              deploy. Set <code className="rounded bg-amber-100 px-1">REVIEW_DATA_DIR</code> to a persistent
              volume (for Docker / Coolify: mount a volume at <code className="rounded bg-amber-100 px-1">/data/review</code>).
            </p>
          </div>
        )}

        {failed && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-[13px] text-rose-800 ring-1 ring-rose-200">
            <FiAlertTriangle className="shrink-0" /> Could not reach the review service. Retrying...
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${
                  filter === f.id
                    ? "bg-[#0b1a33] text-white shadow-md"
                    : "bg-white text-ink/65 ring-1 ring-black/10 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={copyChangeList}
            disabled={!counts.changes}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(212,67,72,0.8)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? <FiCheck /> : <FiClipboard />}
            {copied ? "Copied" : "Copy change list"}
          </button>
        </div>

        {/* Sections */}
        <ul className="mt-4 space-y-3">
          {!loaded && <li className="rounded-2xl bg-white p-8 text-center text-[13px] text-ink/50 ring-1 ring-black/5">Loading...</li>}
          {loaded && visible.length === 0 && (
            <li className="rounded-2xl bg-white p-8 text-center text-[13px] text-ink/50 ring-1 ring-black/5">
              Nothing in this view yet.
            </li>
          )}
          {visible.map((section) => {
            const index = sections.findIndex((s) => s.id === section.id) + 1;
            const record = records[section.id];
            const status = statusOf(record);
            const open = openId === section.id;
            const change = latestChange(record);
            return (
              <li
                key={section.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_-26px_rgba(11,26,51,0.4)] ring-1 ring-black/5"
              >
                <div className="flex items-stretch">
                  <span aria-hidden className={`w-1.5 shrink-0 ${DOT[status]}`} />
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : section.id)}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-center gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/5 text-[12px] font-bold tabular-nums text-ink/60">
                      {index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-bold text-ink">{section.label}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-ink/50">
                        {status === "changes" && change?.note
                          ? change.note
                          : record?.updatedAt
                            ? `Updated ${formatWhen(record.updatedAt)}`
                            : "Not reviewed yet"}
                      </span>
                    </span>
                    <span
                      className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:inline-flex ${BADGE[status]}`}
                    >
                      {status === "approved" ? <FiCheck /> : status === "changes" ? <FiEdit3 /> : null}
                      {STATUS_LABEL[status]}
                    </span>
                    <FiChevronDown className={`shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {open && (
                  <div className="border-t border-ink/8 bg-[#FAFBFC] px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 sm:hidden ${BADGE[status]}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                      <Link
                        href={`/?review=${section.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-bold text-ink ring-1 ring-black/10 transition hover:text-brand hover:ring-brand/40"
                      >
                        <FiExternalLink /> View on page
                      </Link>
                      {status !== "pending" && (
                        <button
                          type="button"
                          onClick={() => reset(section.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-bold text-ink/70 ring-1 ring-black/10 transition hover:text-ink"
                        >
                          <FiRotateCcw /> Reset to pending
                        </button>
                      )}
                    </div>
                    {record?.entries?.length ? (
                      <ReviewHistory entries={record.entries} className="mt-5" />
                    ) : (
                      <p className="mt-4 text-[13px] text-ink/50">No activity on this section yet.</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
