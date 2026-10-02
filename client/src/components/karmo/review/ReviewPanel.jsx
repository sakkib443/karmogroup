"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheck,
  FiEdit3,
  FiImage,
  FiRotateCcw,
  FiSend,
  FiX,
} from "react-icons/fi";

import { STATUS_LABEL } from "@/components/karmo/review/reviewConfig";
import { formatWhen, uploadImages } from "@/components/karmo/review/reviewApi";
import ReviewHistory from "@/components/karmo/review/ReviewHistory";

const MAX_FILES = 4;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

const CHIP = {
  pending: { dot: "bg-amber-400", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  changes: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const DONE_COPY = {
  approved: ["Approved. Thank you!", "This section now shows a green mark."],
  changes: ["Feedback sent", "The team will update this section."],
  reset: ["Back to pending", "You can review this section again any time."],
};

const DONE_BG = {
  approved: "bg-emerald-500 shadow-emerald-500/40",
  changes: "bg-rose-500 shadow-rose-500/40",
  reset: "bg-slate-400 shadow-slate-400/40",
};

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}

function ErrorLine({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-rose-600">
      <FiAlertCircle className="shrink-0" />
      {children}
    </p>
  );
}

/**
 * The review card for one section: approve it, or ask for changes with a note
 * and reference images. Non-modal on purpose so the section stays visible.
 */
export default function ReviewPanel({
  section,
  index,
  total,
  record,
  name,
  onNameChange,
  onClose,
  onSubmit,
}) {
  const reduce = useReducedMotion();
  const status = record?.status ?? "pending";
  const chip = CHIP[status];

  const [mode, setMode] = useState(null); // null | "changes"
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // "approved" | "changes" | "reset"
  const [drag, setDrag] = useState(false);

  const fileInput = useRef(null);
  const textRef = useRef(null);
  const closeTimer = useRef(0);
  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    },
    [],
  );

  const addFiles = (list) => {
    const images = Array.from(list || []).filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setFiles((prev) => {
      const room = Math.max(0, MAX_FILES - prev.length);
      const next = images.slice(0, room).map((file) => ({
        key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });
    setMode("changes");
  };

  // Paste a screenshot straight from the clipboard.
  useEffect(() => {
    const onPaste = (event) => {
      const pasted = event.clipboardData?.files;
      if (pasted?.length) {
        event.preventDefault();
        addFiles(pasted);
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

  const removeFile = (key) => {
    setFiles((prev) => {
      const gone = prev.find((f) => f.key === key);
      if (gone) URL.revokeObjectURL(gone.url);
      return prev.filter((f) => f.key !== key);
    });
  };

  const run = async (task, kind) => {
    setBusy(true);
    setError("");
    try {
      await task();
      setDone(kind);
      closeTimer.current = window.setTimeout(onClose, 1500);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const approve = () => run(() => onSubmit({ status: "approved", name }), "approved");

  const undo = () =>
    run(async () => {
      await onSubmit({ status: "reset", name });
      setMode(null);
    }, "reset");

  const sendChanges = () => {
    if (!note.trim() && !files.length) {
      setError("Tell us what to change, or attach an image.");
      textRef.current?.focus();
      return;
    }
    run(async () => {
      const images = files.length ? await uploadImages(files.map((f) => f.file)) : [];
      await onSubmit({ status: "changes", note, images, name });
    }, "changes");
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9500] flex items-end p-2 sm:items-center sm:py-4 sm:pl-[64px] sm:pr-4">
      <motion.aside
        role="dialog"
        aria-label={`Review: ${section.label}`}
        initial={{ opacity: 0, x: reduce ? 0 : -18, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: reduce ? 0 : -12, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative flex max-h-[min(88dvh,740px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-24px_rgba(11,26,51,0.55)] ring-1 ring-black/5 sm:w-[396px]"
      >
        <span aria-hidden className="h-[3px] w-full shrink-0 bg-gradient-to-r from-brand via-[#FF9A1F] to-brand" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink/45">
              Section {index} of {total}
            </p>
            <h2 className="mt-1 text-[17px] font-bold leading-snug text-ink">{section.label}</h2>
            <span
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${chip.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${chip.dot}`} />
              {STATUS_LABEL[status]}
              {record?.updatedAt && status !== "pending" ? ` · ${formatWhen(record.updatedAt)}` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/55 transition hover:bg-ink/5 hover:text-ink"
          >
            <FiX className="text-[17px]" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {done ? (
            <div className="flex flex-col items-center px-2 py-8 text-center">
              <motion.span
                initial={{ scale: reduce ? 1 : 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                className={`grid h-16 w-16 place-items-center rounded-full text-white shadow-lg ${DONE_BG[done]}`}
              >
                {done === "approved" ? (
                  <FiCheck className="text-[30px]" />
                ) : done === "changes" ? (
                  <FiSend className="text-[26px]" />
                ) : (
                  <FiRotateCcw className="text-[26px]" />
                )}
              </motion.span>
              <p className="mt-4 text-[16px] font-bold text-ink">{DONE_COPY[done][0]}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{DONE_COPY[done][1]}</p>
            </div>
          ) : mode === "changes" ? (
            <div>
              <p className="text-[13px] font-semibold text-ink">What should we change?</p>
              <textarea
                ref={textRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={2000}
                rows={4}
                autoFocus
                placeholder="e.g. make the headline bigger, swap the photo, tighten the spacing..."
                className="mt-2 w-full resize-none rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-[13.5px] leading-[1.55] text-ink outline-none transition placeholder:text-ink/35 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgba(212,67,72,0.10)]"
              />
              <p className="mt-1 text-right text-[10.5px] tabular-nums text-ink/35">{note.length}/2000</p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  addFiles(e.dataTransfer.files);
                }}
                className={`mt-1 rounded-xl border-2 border-dashed px-4 py-3.5 text-center transition ${
                  drag ? "border-brand bg-brand/5" : "border-ink/15 bg-ink/[0.02] hover:border-ink/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={files.length >= MAX_FILES}
                  className="mx-auto flex flex-col items-center gap-0.5 text-ink/60 disabled:opacity-50"
                >
                  <FiImage className="text-[19px]" />
                  <span className="text-[12.5px] font-semibold text-ink/80">Add reference images</span>
                  <span className="text-[11px]">
                    Drop, click, or paste a screenshot &middot; up to {MAX_FILES}
                  </span>
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  hidden
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {files.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {files.map((f) => (
                    <li key={f.key} className="group relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-black/10">
                      <img src={f.url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(f.key)}
                        aria-label="Remove image"
                        className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/65 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <FiX className="text-[12px]" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <ErrorLine>{error}</ErrorLine>

              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode(null);
                    setError("");
                  }}
                  disabled={busy}
                  className="h-11 rounded-xl border border-ink/15 px-4 text-[12.5px] font-bold text-ink/70 transition hover:border-ink/30 hover:text-ink disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={sendChanges}
                  disabled={busy}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-[12.5px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_-10px_rgba(212,67,72,0.8)] transition hover:bg-brand-dark disabled:opacity-60"
                >
                  {busy ? <Spinner /> : <FiSend className="text-[15px]" />}
                  {busy ? "Sending..." : "Send feedback"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {status === "approved" ? (
                <div className="rounded-xl bg-emerald-50 px-4 py-3.5 ring-1 ring-emerald-200">
                  <p className="flex items-center gap-2 text-[13.5px] font-bold text-emerald-800">
                    <FiCheck className="text-[17px]" /> You approved this section
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-emerald-800/70">
                    Changed your mind? You can ask for changes or undo the approval.
                  </p>
                </div>
              ) : (
                <p className="text-[13px] leading-relaxed text-ink/60">
                  Take a look at this section on the page. Is it ready, or should we change something?
                </p>
              )}

              <ErrorLine>{error}</ErrorLine>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {status === "approved" ? (
                  <button
                    type="button"
                    onClick={undo}
                    disabled={busy}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-ink/15 text-[12.5px] font-bold text-ink/75 transition hover:border-ink/30 hover:text-ink disabled:opacity-60"
                  >
                    <FiRotateCcw className="text-[15px]" /> Undo approval
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={approve}
                    disabled={busy}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-[12.5px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_12px_26px_-10px_rgba(16,185,129,0.85)] transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {busy ? <Spinner /> : <FiCheck className="text-[17px]" />}
                    Approve
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode("changes")}
                  disabled={busy}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 text-[12.5px] font-bold uppercase tracking-[0.06em] text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
                >
                  <FiEdit3 className="text-[15px]" /> {status === "approved" ? "Request changes" : "Needs changes"}
                </button>
              </div>

              {record?.entries?.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink/40">Activity</p>
                  <ReviewHistory entries={record.entries} className="mt-3" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: optional reviewer name */}
        {!done && (
          <label className="flex shrink-0 items-center gap-3 border-t border-ink/10 bg-ink/[0.025] px-5 py-3">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/45">Your name</span>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={60}
              placeholder="Optional"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink/30"
            />
          </label>
        )}
      </motion.aside>
    </div>
  );
}
