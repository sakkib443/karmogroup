"use client";

import { useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiCornerUpLeft,
  FiEdit2,
  FiEdit3,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";

import { formatFull, timeAgo } from "@/components/karmo/review/reviewApi";

const ENTRY = {
  approved: { icon: FiCheck, bg: "bg-emerald-500", text: "Approved" },
  changes: { icon: FiEdit3, bg: "bg-rose-500", text: "Requested changes" },
  done: { icon: FiCheckCircle, bg: "bg-emerald-600", text: "Marked done" },
  reopened: { icon: FiCornerUpLeft, bg: "bg-amber-500", text: "Reopened request" },
  edited: { icon: FiEdit2, bg: "bg-sky-500", text: "Edited request" },
  deleted: { icon: FiTrash2, bg: "bg-slate-500", text: "Deleted request" },
  reset: { icon: FiRotateCcw, bg: "bg-slate-400", text: "Reset to pending" },
};

/**
 * Newest-first history of one section: every approval, request, done, edit,
 * delete and reset, each with its exact date and time. Nothing here is ever
 * removed. A request marked done can be reopened from its "Marked done" line.
 * Shared by the on-page panel and the /review tracker.
 */
export default function ReviewHistory({ entries, requests, onReopen, className = "" }) {
  if (!entries?.length) return null;
  const ordered = [...entries].reverse();
  const doneIds = new Set((requests ?? []).filter((r) => r.done).map((r) => r.id));
  // Only the newest "done" line of a request offers Reopen.
  const seen = new Set();

  return (
    <ol className={`relative space-y-4 ${className}`}>
      <span aria-hidden className="absolute bottom-2 left-[11px] top-2 w-px bg-ink/10" />
      {ordered.map((entry) => {
        const meta = ENTRY[entry.status] ?? ENTRY.reset;
        const Icon = meta.icon;
        let canReopen = false;
        if (entry.status === "done" && !seen.has(entry.ref)) {
          seen.add(entry.ref);
          canReopen = Boolean(onReopen) && doneIds.has(entry.ref);
        }
        return (
          <li key={entry.id} className="relative flex gap-3">
            <span
              className={`relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ring-4 ring-white ${meta.bg}`}
            >
              <Icon className="text-[12px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink">{meta.text}</p>
              <p className="text-[11px] text-ink/45">
                {formatFull(entry.at)}
                <span className="text-ink/35"> &middot; {timeAgo(entry.at)}</span>
              </p>
              {entry.status === "edited" && entry.before ? (
                <p className="mt-1 whitespace-pre-wrap break-words text-[12px] leading-[1.5] text-ink/40 line-through">
                  {entry.before}
                </p>
              ) : null}
              {entry.note ? (
                <p
                  className={`mt-1 whitespace-pre-wrap break-words text-[12.5px] leading-[1.55] ${
                    entry.status === "done" || entry.status === "deleted"
                      ? "text-ink/45"
                      : "text-ink/70"
                  }`}
                >
                  {entry.note}
                </p>
              ) : null}
              {entry.images?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.images.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-14 w-14 overflow-hidden rounded-lg ring-1 ring-black/10 transition hover:ring-brand/50"
                    >
                      <img src={url} alt="Reference" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : null}
              {canReopen ? <ReopenButton onClick={() => onReopen(entry.ref)} /> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ReopenButton({ onClick }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await onClick();
        } catch {
          /* the list refreshes on the next poll */
        } finally {
          setBusy(false);
        }
      }}
      className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-amber-700 transition hover:text-amber-800 disabled:opacity-50"
    >
      <FiCornerUpLeft /> {busy ? "Reopening..." : "Not done? Reopen"}
    </button>
  );
}
