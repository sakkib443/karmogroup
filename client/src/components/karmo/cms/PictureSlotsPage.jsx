"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import DivisionPage from "@/components/karmo/division/DivisionPage";
import { API_URL } from "@/config/api";
import { resolveMedia } from "@/cms/core";
import { applySlots, collectSlots, currentSrc, isVideo } from "@/cms/slots";
import { uploadMedia } from "@/components/admin/cms/upload";

/**
 * A division page whose every picture comes from the database (page-content/<page>),
 * with the design's own files in public/ as the fallback. Signed-in admins get a ✎
 * button on the top-right of each picture: upload a new one, pick any earlier one,
 * or lay a dark overlay on it. Changes go live at once.
 */

const token = () => {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
};
const isAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return !!token() && (u?.role === "superadmin" || u?.role === "admin");
  } catch { return false; }
};
const cssStr = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
const label = (key) =>
  key
    .split(".")
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : p.replace(/([A-Z])/g, " $1").toLowerCase()))
    .join(" › ");

export default function PictureSlotsPage({ page, data, content: initial }) {
  const [content, setContent] = useState(initial || {});
  const slots = useMemo(() => collectSlots(data), [data]);
  const shown = useMemo(() => applySlots(data, content), [data, content]);

  /* The overlay every visitor sees: a dark veil, drawn as a brightness filter on the
     picture itself so it works the same in any layout. */
  const overlayCss = useMemo(() => {
    const rules = [];
    for (const s of slots) {
      const v = content?.slots?.[s.key] || {};
      const o = Number(v.overlay || 0);
      const zoom = Number(v.zoom || 100);
      const hasPos = v.x != null || v.y != null;
      if (!o && zoom === 100 && !hasPos) continue;
      const src = cssStr(currentSrc(s, content));
      const sel = `img[src=${src}],video[src=${src}],video[poster=${src}],video:has(source[src=${src}])`;
      const x = v.x ?? 50;
      const y = v.y ?? 50;
      const decl = [];
      if (o) decl.push(`filter:brightness(${(1 - o / 100).toFixed(2)})`);
      /* Framing chosen in the editor: which part shows, and how close. */
      if (hasPos) decl.push(`object-position:${x}% ${y}% !important`);
      if (zoom !== 100) decl.push(`transform:scale(${(zoom / 100).toFixed(3)}) !important`, `transform-origin:${x}% ${y}% !important`);
      rules.push(`${sel}{${decl.join(";")}}`);
      // Pictures drawn as a CSS background (e.g. the mattress edge strip) move the same way.
      if (hasPos) rules.push(`[style*=${cssStr(currentSrc(s, content))}]{background-position:${x}% ${y}% !important}`);
    }
    return rules.join("\n");
  }, [slots, content]);

  const [admin, setAdmin] = useState(false);
  useEffect(() => setAdmin(isAdmin()), []);

  return (
    <>
      {overlayCss ? <style>{overlayCss}</style> : null}
      <DivisionPage data={shown} />
      {admin ? <SlotEditor page={page} slots={slots} content={content} setContent={setContent} /> : null}
    </>
  );
}

/* ───────────────────────── admin layer ───────────────────────── */

function findTargets(src) {
  const q = cssStr(src);
  const els = new Set(document.querySelectorAll(`img[src=${q}],video[src=${q}],video[poster=${q}]`));
  document.querySelectorAll(`source[src=${q}]`).forEach((s) => s.parentElement && els.add(s.parentElement));
  document.querySelectorAll("[style*='url(']").forEach((el) => {
    if (el.style.backgroundImage.includes(src)) els.add(el);
  });
  return [...els];
}

/* Fixed header (top bar + menu) — buttons never hide under it. */
const HEADER = 112;

function visible(el) {
  if (el.closest("[data-slot-editor]")) return null;
  if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 48 || r.height < 36) return null;
  if (r.bottom < HEADER + 50 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null;
  return r;
}

function SlotEditor({ page, slots, content, setContent }) {
  /* Off until the floating Edit switch on the right is pressed. */
  const [on, setOn] = useState(false);
  const [pins, setPins] = useState([]);
  const [open, setOpen] = useState(null); // slot key

  const measure = useCallback(() => {
    const next = [];
    const taken = new Map();
    for (const s of slots) {
      const src = currentSrc(s, content);
      for (const el of findTargets(src)) {
        const r = visible(el);
        if (!r) continue;
        // Buttons for pictures that share a corner step down so none hide another.
        const corner = `${Math.round(r.right)}:${Math.round(r.top)}`;
        const n = taken.get(corner) || 0;
        taken.set(corner, n + 1);
        next.push({ key: s.key, top: Math.max(r.top, HEADER) + 10 + n * 40, left: Math.min(r.right, innerWidth) - 46 });
      }
    }
    setPins((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next));
  }, [slots, content]);

  useEffect(() => {
    if (!on) return undefined;
    let raf = 0;
    const tick = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    tick();
    const id = setInterval(tick, 700);
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    return () => { clearInterval(id); cancelAnimationFrame(raf); removeEventListener("scroll", tick); removeEventListener("resize", tick); };
  }, [on, measure]);

  const save = useCallback(
    async (key, body) => {
      const res = await fetch(`${API_URL}/page-content/${page}/slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ key, ...body }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `Could not save (${res.status})`);
      setContent(json.data.content || {});
      // Let the live site drop its one-minute copy of this page.
      fetch("/api/cms-revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ page }),
      }).catch(() => {});
    },
    [page, setContent]
  );

  const slot = open ? slots.find((s) => s.key === open) : null;

  return (
    <div data-slot-editor>
      {on
        ? pins.map((p, i) => (
            <button
              key={`${p.key}-${i}`}
              type="button"
              title={`Change picture — ${label(p.key)}`}
              onClick={() => setOpen(p.key)}
              className="fixed z-[9990] flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111] shadow-[0_4px_14px_rgba(0,0,0,.35)] ring-2 ring-[#d9444c] transition hover:scale-110"
              style={{ top: p.top, left: p.left }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          ))
        : null}

      {/* Floating Edit switch — always on the right edge; turns the ✎ buttons on and off. */}
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        title={on ? "Stop editing pictures" : "Edit pictures"}
        className={`fixed right-0 top-1/2 z-[9991] flex -translate-y-1/2 items-center gap-2 rounded-l-xl py-3 pl-3.5 pr-3 text-[12px] font-bold uppercase tracking-[0.12em] shadow-[0_6px_20px_rgba(0,0,0,.3)] transition ${
          on ? "bg-[#d9444c] text-white" : "bg-[#111] text-white hover:pr-4"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span>{on ? "Done" : "Edit"}</span>
        <span className={`relative h-4 w-7 rounded-full transition ${on ? "bg-white/40" : "bg-white/25"}`}>
          <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? "left-3.5" : "left-0.5"}`} />
        </span>
      </button>

      {slot ? <SlotPanel slot={slot} content={content} setContent={setContent} save={save} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function Thumb({ src, active, onClick, caption }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-md bg-[#f2f2f2] text-left ring-2 transition ${active ? "ring-[#d9444c]" : "ring-transparent hover:ring-black/30"}`}
    >
      <span className="block aspect-[4/3] w-full">
        {isVideo(src) ? (
          <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        )}
      </span>
      {caption ? (
        <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">{caption}</span>
      ) : null}
      {active ? (
        <span className="absolute right-1 top-1 rounded bg-[#d9444c] px-1.5 py-0.5 text-[10px] font-semibold text-white">In use</span>
      ) : null}
    </button>
  );
}

function SlotPanel({ slot, content, setContent, save, onClose }) {
  const s = content?.slots?.[slot.key] || {};
  const history = (content?.history?.[slot.key] || []).filter((x) => x !== s.src || true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const fromSlot = (v) => ({ overlay: Number(v.overlay || 0), zoom: Number(v.zoom || 100), x: v.x ?? 50, y: v.y ?? 50 });
  const [vals, setVals] = useState(fromSlot(s));
  const overlay = vals.overlay;
  const fileRef = useRef(null);

  useEffect(() => setVals(fromSlot(s)), [slot.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (what, fn) => {
    setBusy(what);
    setError("");
    try { await fn(); } catch (e) { setError(e?.message || "Something went wrong"); }
    setBusy("");
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    run("Uploading…", async () => {
      const item = await uploadMedia(file, (pct) => setBusy(`Uploading… ${pct}%`));
      await save(slot.key, { src: item.url });
    });
  };

  const pick = (src) => run("Saving…", () => save(slot.key, { src }));

  /* Sliders change the page at once; the value is saved when the slider is let go. */
  const preview = (field, v) => {
    setVals((o) => ({ ...o, [field]: v }));
    setContent((c) => ({ ...c, slots: { ...(c?.slots || {}), [slot.key]: { ...(c?.slots?.[slot.key] || {}), [field]: v } } }));
  };
  const commit = (field) => () => run("Saving…", () => save(slot.key, { [field]: vals[field] }));
  const resetFrame = () => {
    setVals((o) => ({ ...o, zoom: 100, x: 50, y: 50 }));
    run("Saving…", () => save(slot.key, { zoom: 100, x: null, y: null }));
  };

  const inUse = s.src || "";
  const uploads = history.filter((x) => x && x !== slot.src);

  return (
    <div data-slot-editor className="fixed inset-0 z-[2147483000] flex justify-end bg-black/10" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-[400px] flex-col overflow-y-auto bg-white p-5 text-[#111] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9444c]">Change picture</p>
            <p className="mt-1 text-[13px] text-black/60">{label(slot.key)}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-2 text-[22px] leading-none text-black/50 hover:text-black" aria-label="Close">×</button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg bg-[#f2f2f2]">
          {isVideo(currentSrc(slot, content)) ? (
            <video src={currentSrc(slot, content)} muted playsInline autoPlay loop className="w-full" style={{ filter: `brightness(${1 - overlay / 100})` }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentSrc(slot, content)} alt="" className="w-full" style={{ filter: `brightness(${1 - overlay / 100})` }} />
          )}
        </div>

        <input ref={fileRef} type="file" accept={isVideo(slot.src) ? "video/mp4,video/webm" : "image/*"} className="hidden" onChange={onFile} />
        <button
          type="button"
          disabled={!!busy}
          onClick={() => fileRef.current?.click()}
          className="mt-4 rounded-md bg-[#d9444c] px-4 py-3 text-[13px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b8333b] disabled:opacity-60"
        >
          {busy || (isVideo(slot.src) ? "Upload new video" : "Upload new picture")}
        </button>
        {error ? <p className="mt-2 text-[12px] text-[#d9444c]">{error}</p> : null}

        <div className="mt-6 rounded-lg border border-black/10 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em]">Framing</p>
            <button type="button" onClick={resetFrame} disabled={!!busy} className="text-[11px] font-semibold text-[#d9444c] hover:underline">Reset</button>
          </div>
          <Slider label="Zoom" unit="%" min={30} max={300} value={vals.zoom} busy={busy} onChange={(v) => preview("zoom", v)} onDone={commit("zoom")} hint="Below 100% shows more of the picture; above 100% goes closer." />
          <Slider label="Move left ↔ right" unit="%" min={0} max={100} value={vals.x} busy={busy} onChange={(v) => preview("x", v)} onDone={commit("x")} />
          <Slider label="Move up ↕ down" unit="%" min={0} max={100} value={vals.y} busy={busy} onChange={(v) => preview("y", v)} onDone={commit("y")} />
        </div>

        <div className="mt-4 rounded-lg border border-black/10 p-3.5">
          <Slider label="Dark overlay" unit="%" min={0} max={80} value={vals.overlay} busy={busy} onChange={(v) => preview("overlay", v)} onDone={commit("overlay")} />
        </div>

        <div className="mt-6">
          <p className="text-[12px] font-semibold">Pictures used here — click one to use it</p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <Thumb src={slot.src} caption="Original" active={!inUse} onClick={() => pick("")} />
            {uploads.map((src) => (
              <Thumb key={src} src={resolveMedia(src)} active={inUse === src} onClick={() => pick(src)} />
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-black/45">
          Changes go live at once for everyone. Only signed-in admins see these buttons.
        </p>
      </aside>
    </div>
  );
}

function Slider({ label: text, unit, min, max, value, busy, onChange, onDone, hint }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[12px] font-semibold">
        <span>{text}</span>
        <span className="tabular-nums text-black/60">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={!!busy}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={onDone}
        onKeyUp={onDone}
        className="mt-1.5 w-full accent-[#d9444c]"
      />
      {hint ? <p className="mt-0.5 text-[10.5px] text-black/45">{hint}</p> : null}
    </div>
  );
}
