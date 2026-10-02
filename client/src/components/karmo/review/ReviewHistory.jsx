"use client";

import { FiCheck, FiEdit3, FiRotateCcw } from "react-icons/fi";

import { timeAgo } from "@/components/karmo/review/reviewApi";

const ENTRY = {
  approved: { icon: FiCheck, bg: "bg-emerald-500", text: "Approved" },
  changes: { icon: FiEdit3, bg: "bg-rose-500", text: "Requested changes" },
  reset: { icon: FiRotateCcw, bg: "bg-slate-400", text: "Reset to pending" },
};

/**
 * Newest-first activity feed for one section: who approved / asked for what,
 * with the note text and reference thumbnails. Shared by the on-page panel and
 * the /review summary.
 */
export default function ReviewHistory({ entries, className = "" }) {
  if (!entries?.length) return null;
  const ordered = [...entries].reverse();

  return (
    <ul className={`space-y-4 ${className}`}>
      {ordered.map((entry) => {
        const meta = ENTRY[entry.status] ?? ENTRY.reset;
        const Icon = meta.icon;
        return (
          <li key={entry.id} className="flex gap-3">
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${meta.bg}`}
            >
              <Icon className="text-[12px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-ink">
                {meta.text}
                <span className="font-normal text-ink/45">
                  {" "}
                  &middot; {entry.name || "Anonymous"} &middot; {timeAgo(entry.at)}
                </span>
              </p>
              {entry.note ? (
                <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px] leading-[1.55] text-ink/70">
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}
