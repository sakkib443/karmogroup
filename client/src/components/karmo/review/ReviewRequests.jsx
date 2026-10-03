"use client";

import { useState } from "react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

import { formatFull, timeAgo } from "@/components/karmo/review/reviewApi";

/**
 * Open change requests for one section, oldest first. The team works through
 * them: Done (it leaves the list, history keeps it), Edit the note, or Delete.
 * Shared by the on-page panel and the /review tracker.
 *
 * `onAction(status, requestId, note?)` posts "done" | "edited" | "deleted".
 */
export default function ReviewRequests({ requests, onAction, className = "" }) {
  const open = (requests ?? []).filter((r) => !r.done);
  if (!open.length) return null;

  return (
    <ul className={`space-y-2.5 ${className}`}>
      {open.map((req, i) => (
        <RequestCard key={req.id} index={i + 1} req={req} onAction={onAction} />
      ))}
    </ul>
  );
}

function RequestCard({ index, req, onAction }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(req.note || "");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const act = async (status, note) => {
    setBusy(status);
    setError("");
    try {
      await onAction(status, req.id, note);
      if (status === "edited") setEditing(false);
    } catch (err) {
      setError(err?.message || "Could not save. Please try again.");
    } finally {
      setBusy("");
    }
  };

  return (
    <li className="rounded-xl bg-white p-3.5 ring-1 ring-rose-200/80 shadow-[0_8px_20px_-16px_rgba(244,63,94,0.6)]">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-500 text-[10.5px] font-bold tabular-nums text-white">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-ink/45" title={formatFull(req.at)}>
            {formatFull(req.at)}
            <span className="text-ink/35"> &middot; {timeAgo(req.at)}</span>
            {req.editedAt ? <span className="text-ink/35"> &middot; edited</span> : null}
          </p>

          {editing ? (
            <div className="mt-1.5">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={2000}
                rows={3}
                autoFocus
                className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-[13px] leading-[1.5] text-ink outline-none focus:border-brand/60 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.10)]"
              />
              <div className="mt-1.5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDraft(req.note || "");
                    setError("");
                  }}
                  className="h-8 rounded-lg px-3 text-[12px] font-semibold text-ink/60 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => act("edited", draft)}
                  disabled={!draft.trim() || busy === "edited"}
                  className="h-8 rounded-lg bg-ink px-3.5 text-[12px] font-bold text-white transition hover:bg-ink/85 disabled:opacity-50"
                >
                  {busy === "edited" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : req.note ? (
            <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-[1.55] text-ink/80">
              {req.note}
            </p>
          ) : null}

          {req.images?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {req.images.map((url) => (
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

          {error ? <p className="mt-2 text-[11.5px] font-medium text-rose-600">{error}</p> : null}

          {!editing && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => act("done")}
                disabled={Boolean(busy)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500 px-3 text-[11.5px] font-bold uppercase tracking-[0.05em] text-white shadow-[0_8px_18px_-10px_rgba(16,185,129,0.9)] transition hover:bg-emerald-600 disabled:opacity-60"
              >
                <FiCheck className="text-[14px]" /> {busy === "done" ? "Saving..." : "Done"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={Boolean(busy)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-semibold text-ink/60 ring-1 ring-black/10 transition hover:text-ink disabled:opacity-60"
              >
                <FiEdit2 className="text-[12.5px]" /> Edit
              </button>
              {confirmDelete ? (
                <span className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => act("deleted")}
                    disabled={Boolean(busy)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-rose-500 px-2.5 text-[11.5px] font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                  >
                    <FiTrash2 className="text-[12.5px]" /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Keep request"
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink/50 hover:text-ink"
                  >
                    <FiX />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={Boolean(busy)}
                  aria-label="Delete request"
                  title="Delete request"
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink/40 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                >
                  <FiTrash2 className="text-[13px]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
