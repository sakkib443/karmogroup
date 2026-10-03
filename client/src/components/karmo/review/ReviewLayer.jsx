"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FiCheck, FiEdit3, FiEye, FiEyeOff, FiList, FiMessageSquare } from "react-icons/fi";

import { REVIEW_PAGES, STATUS_LABEL } from "@/components/karmo/review/reviewConfig";
import { fetchReview, submitDecision } from "@/components/karmo/review/reviewApi";
import ReviewPanel from "@/components/karmo/review/ReviewPanel";

const MARKER = 34;
const LS_HIDDEN = "karmo-review-hidden";

const MARKER_STYLE = {
  pending:
    "bg-white text-[#0b1a33] ring-1 ring-black/10 shadow-[0_8px_24px_-6px_rgba(11,26,51,0.45)]",
  approved:
    "bg-emerald-500 text-white ring-2 ring-white shadow-[0_8px_24px_-6px_rgba(16,185,129,0.7)]",
  changes:
    "bg-rose-500 text-white ring-2 ring-white shadow-[0_8px_24px_-6px_rgba(244,63,94,0.7)]",
};

const BAR_STYLE = {
  pending: "opacity-0",
  approved: "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.65)]",
  changes: "bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.55)]",
};

const statusOf = (record) => record?.status ?? "pending";

/** The element whose box represents a section (the wrapper itself has none). */
function anchorOf(id) {
  const wrap = document.querySelector(`[data-review-id="${id}"]`);
  if (!wrap) return null;
  return wrap.querySelector(":scope > header") || wrap.firstElementChild;
}

function ProgressRing({ done, total }) {
  const radius = 15;
  const circ = 2 * Math.PI * radius;
  const pct = total ? done / total : 0;
  return (
    <span className="relative grid h-10 w-10 shrink-0 place-items-center">
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="3.5" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#34d399"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${circ * pct} ${circ}`}
          style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="relative text-[11px] font-bold tabular-nums text-white">{done}</span>
    </span>
  );
}

/**
 * Client review mode. On every reviewable page (see reviewConfig) it draws, in
 * a fixed layer above the page:
 *   - a small marker at the left edge of each section (click to review it)
 *   - a green / red bar down the left edge of approved / change-requested ones
 *   - a progress pill bottom-left with a link to the /review summary
 * Nothing is injected into the sections themselves, so page layout is untouched.
 */
export default function ReviewLayer() {
  const pathname = usePathname();
  const config = REVIEW_PAGES[pathname];
  if (!config) return null;
  return <ReviewLayerInner key={pathname} page={pathname} config={config} />;
}

function ReviewLayerInner({ page, config }) {
  const sections = config.sections;
  const [records, setRecords] = useState({});
  const [temporary, setTemporary] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openId, setOpenId] = useState(null);

  const markers = useRef({});
  const bars = useRef({});
  const outline = useRef(null);
  const frame = useRef(0);
  const openRef = useRef(null);

  useEffect(() => {
    openRef.current = openId;
  }, [openId]);

  /* -- saved preferences ---------------------------------------------------- */
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(LS_HIDDEN) === "1");
    } catch {
      /* private mode: preferences simply do not persist */
    }
  }, []);

  const toggleHidden = (next) => {
    setHidden(next);
    if (next) setOpenId(null);
    try {
      localStorage.setItem(LS_HIDDEN, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  /* -- data ----------------------------------------------------------------- */
  const load = useCallback(async () => {
    try {
      const json = await fetchReview(page);
      setRecords(json.sections || {});
      setTemporary(Boolean(json.temporary));
    } catch {
      /* keep what we have; the next poll retries */
    }
  }, [page]);

  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (!document.hidden) load();
    }, 30000);
    window.addEventListener("focus", load);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  const handleSubmit = useCallback(
    async (id, payload) => {
      const section = await submitDecision({ page, id, ...payload });
      setRecords((prev) => ({ ...prev, [id]: section }));
    },
    [page],
  );

  /* -- positioning (imperative, once per animation frame) ------------------- */
  const layout = useCallback(() => {
    frame.current = 0;
    const vh = window.innerHeight;
    const x = window.innerWidth < 640 ? 6 : 14;

    // The site header is fixed: sections slide under it, so clamp to its bottom.
    const siteHeader = document.querySelector("header");
    let headerBottom = 0;
    if (siteHeader && getComputedStyle(siteHeader).position === "fixed") {
      headerBottom = Math.max(0, siteHeader.getBoundingClientRect().bottom);
    }

    let outlined = false;
    for (const section of sections) {
      const marker = markers.current[section.id];
      const bar = bars.current[section.id];
      if (!marker || !bar) continue;

      const el = anchorOf(section.id);
      if (!el) {
        marker.style.display = "none";
        bar.style.display = "none";
        continue;
      }

      const rect = el.getBoundingClientRect();
      const isHeader = section.id === "header";
      const top = isHeader ? Math.max(rect.top, 0) : Math.max(rect.top, headerBottom, 0);
      const bottom = Math.min(rect.bottom, vh);
      const visible = bottom - top;

      if (visible < 10) {
        marker.style.display = "none";
        bar.style.display = "none";
        continue;
      }

      bar.style.display = "block";
      bar.style.transform = `translate3d(0,${top}px,0)`;
      bar.style.height = `${visible}px`;

      if (visible < 84) {
        marker.style.display = "none";
      } else {
        // Sticks near the top of the visible part, pushed up by the section end.
        const y = Math.min(top + 12, bottom - 12 - MARKER);
        marker.style.display = "grid";
        // `translate`, not `transform`: the hover `scale` is applied after
        // `translate` but before `transform`, so a transform offset would be
        // scaled too and the marker would jump away from the cursor.
        marker.style.translate = `${x}px ${y}px`;
      }

      if (section.id === openRef.current && outline.current) {
        outlined = true;
        outline.current.style.display = "block";
        outline.current.style.transform = `translate3d(0,${top}px,0)`;
        outline.current.style.height = `${visible}px`;
      }
    }
    if (outline.current && !outlined) outline.current.style.display = "none";
  }, [sections]);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(layout);
  }, [layout]);

  useEffect(() => {
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const timers = [400, 1200, 3000].map((ms) => window.setTimeout(schedule, ms));
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      if (frame.current) {
        cancelAnimationFrame(frame.current);
        // Reset, or a StrictMode re-mount thinks a frame is still pending.
        frame.current = 0;
      }
    };
  }, [schedule]);

  useEffect(() => {
    schedule();
  }, [openId, records, hidden, schedule]);

  /* -- deep link: /?review=hero scrolls to a section and opens its panel ----- */
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("review");
    if (!id || !sections.some((s) => s.id === id)) return undefined;
    const timer = window.setTimeout(() => {
      const el = anchorOf(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
      setOpenId(id);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [sections]);

  /* -- Esc closes the panel ------------------------------------------------- */
  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  /* -- derived -------------------------------------------------------------- */
  const approved = useMemo(
    () => sections.filter((s) => statusOf(records[s.id]) === "approved").length,
    [sections, records],
  );
  const openIndex = sections.findIndex((s) => s.id === openId);
  const openSection = openIndex >= 0 ? sections[openIndex] : null;

  return (
    <>
      {/* Markers + approval bars (non-interactive except the markers) */}
      <div
        className={`pointer-events-none fixed inset-0 z-[9000] ${hidden ? "hidden" : ""}`}
        aria-hidden={hidden}
      >
        <div
          ref={outline}
          style={{ display: "none" }}
          className="absolute left-0 top-0 w-full border-2 border-brand/70 shadow-[inset_0_0_0_9999px_rgba(212,67,72,0.04)]"
        />

        {sections.map((section) => {
          const status = statusOf(records[section.id]);
          const Icon = status === "approved" ? FiCheck : status === "changes" ? FiEdit3 : FiMessageSquare;
          return (
            <div key={section.id}>
              <div
                ref={(node) => {
                  bars.current[section.id] = node;
                }}
                style={{ display: "none" }}
                className={`absolute left-0 top-0 w-[4px] transition-colors duration-300 ${BAR_STYLE[status]}`}
              />
              <button
                ref={(node) => {
                  markers.current[section.id] = node;
                }}
                type="button"
                style={{ display: "none", width: MARKER, height: MARKER }}
                onClick={() => setOpenId((cur) => (cur === section.id ? null : section.id))}
                aria-label={`Review: ${section.label} (${STATUS_LABEL[status]})`}
                className={`group pointer-events-auto absolute left-0 top-0 place-items-center rounded-full transition-[background-color,box-shadow,scale] duration-200 hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${MARKER_STYLE[status]}`}
              >
                <Icon className="text-[15px]" />
                {status === "pending" && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                  </span>
                )}
                <span className="pointer-events-none absolute left-full ml-2.5 whitespace-nowrap rounded-lg bg-[#0b1a33] px-3 py-1.5 text-[11.5px] font-semibold text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {section.label}
                  <span className="ml-1.5 font-normal text-white/55">&middot; {STATUS_LABEL[status]}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Review card */}
      <AnimatePresence>
        {openSection && !hidden && (
          <ReviewPanel
            key={openSection.id}
            section={openSection}
            index={openIndex + 1}
            total={sections.length}
            record={records[openSection.id]}
            onClose={() => setOpenId(null)}
            onSubmit={(payload) => handleSubmit(openSection.id, payload)}
          />
        )}
      </AnimatePresence>

      {/* Progress pill */}
      <div className="fixed bottom-4 left-4 z-[9100]">
        {hidden ? (
          <button
            type="button"
            onClick={() => toggleHidden(false)}
            aria-label="Show review markers"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#0b1a33] text-white shadow-[0_18px_40px_-12px_rgba(11,26,51,0.6)] transition hover:scale-105"
          >
            <FiEye className="text-[17px]" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 rounded-full bg-[#0b1a33]/95 py-1.5 pl-1.5 pr-2 text-white shadow-[0_18px_40px_-12px_rgba(11,26,51,0.6)] backdrop-blur">
            <ProgressRing done={approved} total={sections.length} />
            <div className="hidden pr-1 leading-tight sm:block">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/50">Client review</p>
              <p className="text-[12.5px] font-semibold">
                {approved} of {sections.length} approved
              </p>
              {temporary && (
                <p className="text-[10px] font-medium text-amber-300" title="Review data is stored in a temporary folder and may reset on redeploy.">
                  Temporary storage
                </p>
              )}
            </div>
            <Link
              href="/review"
              aria-label="Open review summary"
              title="Review summary"
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <FiList className="text-[16px]" />
            </Link>
            <button
              type="button"
              onClick={() => toggleHidden(true)}
              aria-label="Hide review markers"
              title="Hide markers"
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <FiEyeOff className="text-[16px]" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
