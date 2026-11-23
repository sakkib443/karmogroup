"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { Barlow_Condensed, Poppins } from "next/font/google";

/**
 * Foam page — the seven Karmo set-foam grades as an expanding row, built after the
 * client's "Spider-Verse PowerPoint" reel (first five seconds):
 *   • all seven colour columns equal at rest;
 *   • the one under the pointer swells to about half the row, the rest narrow;
 *   • each column carries a big white condensed name, a small letter-spaced word under
 *     it, and the product standing at the bottom — the name grows with its column and sits
 *     BEHIND the product, so the product overlaps the letters;
 *   • columns are painted in a vertical gradient (deeper at the top, lighter at the bottom).
 * Each column is the grade's own foam colour (Karmo Foam Catalogue, pages 6–12).
 * On touch screens the first tap opens a column, the next follows its link. Stacks on phones.
 */

const condensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
/* The outline word "KARMO" is set in Poppins — round and solid, not tall and narrow. */
const poppins = Poppins({ subsets: ["latin"], weight: ["700"], display: "swap" });

/* The site's global type rules win over a plain class, so the condensed face is forced here
   (same trick as the homepage divisions row). */
const TYPE_CSS = `.foam-grade-type,.foam-grade-type *{font-family:${condensed.style.fontFamily} !important}.foam-grade-type .foam-grade-outline{font-family:${poppins.style.fontFamily} !important}.foam-grade-type .foam-grade-site{font-family:var(--font-heading) !important}@keyframes foam-grade-rise{0%{transform:translateY(110%);opacity:0}100%{transform:translateY(0);opacity:1}}.foam-grade-rise{animation:foam-grade-rise 700ms cubic-bezier(0.22,1,0.36,1) 350ms both}@keyframes foam-grade-fade{0%{opacity:0}100%{opacity:1}}.foam-grade-fade{animation:foam-grade-fade 450ms ease-out both}@media (prefers-reduced-motion:reduce){.foam-grade-rise,.foam-grade-fade{animation:none}}`;

const IMG = "/pages/foam/furniture/grades";

/* Catalogue order: Poly, 280, 480, 2001, HD, 4G, 1965. top / bottom = the column's gradient —
   a colour OPPOSITE to the foam (client, 23 Nov 2026), so the foam stands out: grey on red,
   coral on teal, brown on sky blue, purple on yellow, green on magenta, sage on orange,
   yellow on navy. */
const GRADES = [
  { id: "poly", name: "Poly", sub: "Karmo", colour: "Ash", grade: "Standard Grade", density: "25", top: "#a81c25", bottom: "#df4a50", href: "/foam/poly", src: `${IMG}/foam-poly-orig.webp`, w: 800, h: 605 },
  { id: "280", name: "280", sub: "Karmo", colour: "Pink", grade: "Semi Rubber Grade", density: "30", top: "#0c7a6f", bottom: "#22b3a2", href: "/foam/combo-280", src: `${IMG}/foam-280-orig.webp`, w: 800, h: 608 },
  { id: "480", name: "480", sub: "Karmo", colour: "Brick", grade: "Full Rubber Grade", density: "35", top: "#2867a6", bottom: "#5b9fdb", href: "/foam/furniture", src: `${IMG}/foam-480-orig-v2.webp`, w: 570, h: 456, fit: 0.95, drop: 5 },
  { id: "2001", name: "2001", sub: "Karmo", colour: "Purple", grade: "Full Rubber Grade", density: "37", top: "#cf9a00", bottom: "#f4c846", href: "/foam/combo-2001", src: `${IMG}/foam-2001-orig.webp`, w: 800, h: 599 },
  { id: "hd", name: "HD", sub: "Karmo", colour: "Lime Green", grade: "Full Rubber Grade", density: "40", top: "#9c1249", bottom: "#d8487f", href: "/foam/hd", src: `${IMG}/foam-hd-orig.webp`, w: 800, h: 616 },
  { id: "4g", name: "4G", sub: "Karmo", colour: "Olive", grade: "Pure Rubber Grade", density: "45", top: "#b94a26", bottom: "#ef8a58", href: "/foam/combo-4g", src: `${IMG}/foam-4g-orig.webp`, w: 800, h: 600 },
  { id: "1965", name: "1965", sub: "Karmo", colour: "Bright Yellow", grade: "Full Rubber Grade", density: "50", top: "#132c66", bottom: "#2f56a8", href: "/foam/combo-1965", src: `${IMG}/foam-1965-orig.webp`, w: 800, h: 607 },
];

/* A calm, even swell (about 1.1 s, soft at both ends). */
const EASE = "cubic-bezier(0.45,0,0.2,1)";
const MS = 1000;
/* The open column against a closed one: about half the row for the open one. */
const OPEN_GROW = 4;

/* Sizes the sideways grade line so its length is exactly the height of the heading block
   beside it, and keeps it so while the column (and so the heading) grows. */
function useFitToHeight(active) {
  const textRef = useRef(null);
  const blockRef = useRef(null);
  useLayoutEffect(() => {
    if (!active) return undefined;
    const text = textRef.current;
    const block = blockRef.current;
    if (!text || !block) return undefined;
    /* Measure the line's length once at 10px; after that each frame is one read + one write. */
    text.style.fontSize = "10px";
    const len10 = text.getBoundingClientRect().height;
    const fit = () => {
      const h = block.getBoundingClientRect().height;
      if (len10 > 0 && h > 0) text.style.fontSize = `${(10 * h) / len10}px`;
    };
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    ro?.observe(block);
    return () => ro?.disconnect();
  }, [active]);
  return { textRef, blockRef };
}

/* Where the foam ends up for a given column width, worked out from the same rules the CSS
   uses for the title, so the foam can travel straight to that spot in ONE transition that runs
   alongside the column's own (same duration, same easing) — it never zooms first and slides
   after. pw / H: the column's width and height in px; vw: 1% of the viewport width. */
function foamTarget(item, pw, H, vw) {
  const fit = item.fit || 1;
  let width = 20.5 * vw + 0.258 * pw; /* the design's size: grows a little with the column */
  /* Keep a hair of a gap under the outline name's letters. */
  const karmo = Math.min(27.2, 0.075 * pw);
  const nameFs = Math.min(144, 0.26 * pw);
  const lettersBottom = 0.09 * H + karmo + nameFs * (1 + 0.04 - 0.16);
  const room = H * 0.95 - lettersBottom - 6;
  width = Math.max(60, Math.min(width, (room * item.w) / item.h / fit));
  /* Pinned by the right edge: at rest past the column's edge (cut on the right, a little room
     on the left); open, just inside it (whole, right-aligned). */
  const right = 0.53 * pw - 19.1 * vw;
  return { width, right };
}

function Panel({ item, active, mode, geo, wide, onOpen, onClose }) {
  const { textRef, blockRef } = useFitToHeight(active);

  /* Target column width for this state (the flex-grow shares). */
  let foamStyle;
  if (geo && geo.W >= 768) {
    const n = GRADES.length;
    const pw =
      mode === "rest" ? geo.W / n : active ? (geo.W * OPEN_GROW) / (OPEN_GROW + n - 1) : geo.W / (OPEN_GROW + n - 1);
    const t = foamTarget(item, pw, geo.H, geo.vw);
    foamStyle = {
      left: "auto",
      width: `${t.width}px`,
      right: `${t.right}px`,
      transition: `width ${MS}ms ${EASE}, right ${MS}ms ${EASE}`,
    };
  }
  const fitT = item.fit ? `translateY(${item.drop || 0}%) scale(${item.fit})` : "";
  if (!foamStyle) {
    /* Phone: a card in a two-column grid. The foam stands centred at the bottom and swells a
       little when the card is tapped open. */
    foamStyle = {
      left: wide && !active ? "48%" : "6%",
      width: wide && !active ? "48%" : "88%",
      transform: `${fitT} scale(${active ? 1.08 : 1})`.trim(),
      transformOrigin: "50% 100%",
      transition: `transform 600ms ${EASE}`,
    };
  } else if (item.fit) {
    foamStyle = { ...foamStyle, transform: fitT, transformOrigin: "100% 100%" };
  }

  /* Touch screens have no hover: the first tap opens the column, the next one follows the link. */
  /* Phones / touch: a tap never leaves the page — it opens the card big (full row, taller)
     and a second tap closes it again (client, 23 Nov 2026). */
  const onClick = (e) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      if (active) onClose?.();
      else {
        onOpen();
        const el = e.currentTarget;
        window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      }
    }
  };

  /* The title's two arrangements ease into each other (no snap): the sideways grade slides
     open beside the rule while the grade line under the name folds away, and back. */
  const T = `${Math.round(MS * 0.7)}ms ${EASE}`;

  return (
    <Link
      href={item.href}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onClick}
      aria-label={`Karmo ${item.name} foam — ${item.grade}, ${item.colour}, ${item.density} kg/m³`}
      className={`@container relative block min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:col-span-1 md:aspect-auto md:h-auto md:min-h-0 md:[flex-basis:0%] md:[flex-grow:var(--fg)] ${active ? "col-span-2 aspect-[4/5]" : wide ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]"}`}
      style={{
        background: `linear-gradient(180deg, ${item.top} 0%, ${item.bottom} 30%, color-mix(in srgb, ${item.bottom} 18%, #ffffff) 78%, #fbf9f6 100%)`,
        /* Desktop only (md:): the open column swells, the rest narrow. */
        ["--fg"]: active ? OPEN_GROW : 1,
        transition: `flex-grow ${MS}ms ${EASE}`,
      }}
    >
      {/* On a phone the last (wide) card keeps its title to the left half, sized to that half,
          so the foam can stand on the right. */}
      <span className={wide && !active ? "pointer-events-none absolute inset-y-0 left-0 z-[1] block w-1/2 @container md:w-full" : "contents"}>
      {/* Title, top-left, behind the foam. Sizes are shares of the column width (cqw), so they
          grow and shrink in step with it. */}
      <span
        className={`${condensed.className} foam-grade-type pointer-events-none absolute left-[1.6vw] top-[9%] z-[1] flex w-max items-start text-left uppercase text-white`}
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.18)" }}
      >
        {/* Open: the grade on its side, read bottom-up, as long as the heading is tall. */}
        <span
          className="block self-stretch overflow-hidden"
          style={{ maxWidth: active ? "3em" : "0px", opacity: active ? 1 : 0, transition: `max-width ${T}, opacity ${T}` }}
        >
          <span
            ref={textRef}
            className="block whitespace-nowrap font-semibold text-white/90"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: 1, letterSpacing: "0.2em", fontSize: "min(1.05rem, 4.4cqw)" }}
          >
            {item.grade}
          </span>
        </span>
        <span
          ref={blockRef}
          className="flex flex-col items-start border-l"
          style={{
            fontSize: "min(1.05rem, 4.4cqw)",
            marginLeft: active ? "0.55em" : "0em",
            paddingLeft: active ? "0.6em" : "0em",
            borderLeftColor: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0)",
            transition: `margin-left ${T}, padding-left ${T}, border-color ${T}`,
          }}
        >
          <span className="foam-grade-site block whitespace-nowrap" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "0.14em", fontSize: "min(1.7rem, 7.5cqw)" }}>
            Karmo
          </span>
          <span
            className="foam-grade-outline block whitespace-nowrap"
            style={{
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0.01em",
              marginTop: "0.04em",
              fontSize: "min(9rem, 26cqw)",
              color: "transparent",
              WebkitTextStroke: "0.9px rgba(255,255,255,0.95)",
              /* No soft shadow inside the hollow letters — at most a hair of one. */
              textShadow: "0 1px 2px rgba(0,0,0,0.06)",
            }}
          >
            {item.name}
          </span>
          {/* At rest: the grade on a line under the name; folds away when open. */}
          <span
            className="block overflow-hidden"
            style={{ maxHeight: active ? "0em" : "2.4em", opacity: active ? 0 : 1, transition: `max-height ${T}, opacity ${T}` }}
          >
            <span className="mt-[0.9em] block whitespace-nowrap font-semibold text-white/90" style={{ lineHeight: 1, letterSpacing: "0.22em", fontSize: "min(1.35rem, 5.6cqw)" }}>
              {item.grade}
            </span>
          </span>
        </span>
      </span>
      </span>

      {/* The foam, pinned by its right edge, bottom 5%. On desktop its width and right offset are
          set to the end state (see foamTarget) and eased there in one go with the column. */}
      <span
        className="pointer-events-none absolute bottom-[5%] left-[1.6vw] z-[2] block w-[84%]"
        style={foamStyle}
      >
        <Image
          src={item.src}
          alt={`Karmo ${item.name} foam blocks in ${item.colour}`}
          width={item.w}
          height={item.h}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="relative z-[1] block h-auto w-full"
          style={{ filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.28))" }}
        />
        {/* Glossy floor: a tight contact shadow right under the stack, and the stack mirrored
            below it, faint, as on a polished surface. */}
        <span
          aria-hidden
          className="absolute inset-x-[2%] bottom-[-3%] h-[9%]"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)" }}
        />
        <Image
          src={item.src}
          alt=""
          aria-hidden
          width={item.w}
          height={item.h}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="absolute left-0 top-full block h-auto w-full"
          style={{
            transform: "scaleY(-1)",
            opacity: 0.42,
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 38%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 38%)",
          }}
        />
      </span>
    </Link>
  );
}

/* Wheel lock for this full-height band (client, 23 Nov 2026). Scrolling down onto it, or up
   back into it, a single wheel notch carries the page so the band sits exactly from the
   header (112px) to the bottom of the screen — no sliver above or below. Once it is flush,
   the next notch leaves it as normal. Runs before the site's SmoothScroll (capture phase)
   and swallows the wheel while the glide is under way. Desktop / fine pointer only. */
const HEADER_H = 112;
function useSnapBand() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return undefined;
    let lockUntil = 0;
    let raf = 0;
    let done = 0;

    const glide = (to) => {
      cancelAnimationFrame(raf);
      const from = window.scrollY;
      const dist = to - from;
      const dur = 650;
      const t0 = performance.now();
      lockUntil = t0 + dur + 120;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        window.scrollTo(0, from + dist * e);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      /* Land exactly on the spot even if frames were dropped. */
      window.clearTimeout(done);
      done = window.setTimeout(() => window.scrollTo(0, to), dur + 40);
    };

    const onWheel = (ev) => {
      const el = sectionRef.current;
      if (!el || ev.ctrlKey) return;
      if (performance.now() < lockUntil) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        return;
      }
      const rect = el.getBoundingClientRect();
      const y = window.scrollY;
      const snapY = Math.round(rect.top + y - HEADER_H);
      const off = y - snapY; /* < 0: band still below its spot; > 0: band pushed up */
      if (Math.abs(off) < 3) return; /* already flush: let this notch leave the band */
      const vh = window.innerHeight;
      const comingDown = ev.deltaY > 0 && off < 0 && -off < vh - HEADER_H;
      const comingUp = ev.deltaY < 0 && off > 0 && off < rect.height;
      if (!comingDown && !comingUp) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      glide(snapY);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, []);
  return sectionRef;
}

/* A soft music bed (about 60 s, a slow 8 s fade in and out — baked into the file) that plays each
   time the band comes into view, and fades away if the reader scrolls on. Browsers only allow
   sound after the visitor has clicked or tapped the page once: arriving from another page of the
   site already counts; a visitor who lands here directly hears it after their first click while
   the band is on screen. A small speaker button turns it off (remembered on this device). */
const MUSIC_SRC = "/pages/foam/furniture/audio/foam-grades-theme-v3.m4a";
const MUSIC_VOL = 0.22; /* softer again (client, 23 Nov 2026); was 0.35 */
function useSectionMusic(sectionRef) {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("karmo-foam-music-muted") === "1";
      mutedRef.current = saved;
      setMuted(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    let inView = false;
    let pending = false;
    let fade = 0;

    const audio = () => {
      if (!audioRef.current) {
        const a = new Audio(MUSIC_SRC);
        a.preload = "auto";
        audioRef.current = a;
      }
      return audioRef.current;
    };
    const start = () => {
      if (mutedRef.current) return;
      const a = audio();
      window.clearInterval(fade);
      a.volume = MUSIC_VOL;
      a.currentTime = 0;
      a.play().then(() => { pending = false; }).catch(() => { pending = true; });
    };
    const stop = () => {
      const a = audioRef.current;
      if (!a || a.paused) return;
      window.clearInterval(fade);
      fade = window.setInterval(() => {
        a.volume = Math.max(0, a.volume - 0.06);
        if (a.volume <= 0.01) {
          window.clearInterval(fade);
          a.pause();
        }
      }, 50);
    };
    const onFirstGesture = () => {
      if (pending && inView) start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const now = Boolean(entry?.isIntersecting);
        if (now && !inView) start();
        if (!now && inView) stop();
        inView = now;
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      io.disconnect();
      window.clearInterval(fade);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      audioRef.current?.pause();
    };
  }, [sectionRef]);

  const toggle = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      window.localStorage.setItem("karmo-foam-music-muted", next ? "1" : "0");
    } catch {}
    const a = audioRef.current;
    if (next) a?.pause();
    else {
      const el = new Audio(MUSIC_SRC);
      audioRef.current?.pause();
      audioRef.current = el;
      el.volume = MUSIC_VOL;
      el.play().catch(() => {});
    }
  };
  return { muted, toggle };
}

export default function FoamGradesAccordion() {
  /* None open at rest: all seven equal until one is hovered. */
  const [active, setActive] = useState(null);
  const sectionRef = useSnapBand();
  const music = useSectionMusic(sectionRef);
  /* The band's size, so each column can work out where its foam ends up. */
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const read = () => {
      const r = el.getBoundingClientRect();
      setGeo((g) => (g && Math.abs(g.W - r.width) < 1 && Math.abs(g.H - r.height) < 1 ? g : { W: r.width, H: r.height, vw: window.innerWidth / 100 }));
    };
    read();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(read) : null;
    ro?.observe(el);
    window.addEventListener("resize", read);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", read);
    };
  }, [sectionRef]);
  const mode = active == null ? "rest" : "open";

  return (
    <>
    <style>{TYPE_CSS}</style>
    <section
      id="foam-grades"
      ref={sectionRef}
      aria-label="Karmo set foam grades"
      onMouseLeave={() => setActive(null)}
      className="relative mb-1.5 grid w-full grid-cols-2 gap-1.5 overflow-hidden bg-white md:flex md:h-[calc(100svh-112px)] md:min-h-[480px] md:flex-row md:gap-0"
    >
      {GRADES.map((item, i) => (
        <Panel key={item.id} item={item} active={i === active} mode={mode} geo={geo} wide={i === GRADES.length - 1 && GRADES.length % 2 === 1} onOpen={() => setActive(i)} onClose={() => setActive(null)} />
      ))}
      {/* Speaker: turns the music cue off / on. */}
      <button
        type="button"
        onClick={music.toggle}
        aria-label={music.muted ? "Turn music on" : "Turn music off"}
        aria-pressed={!music.muted}
        className="absolute bottom-4 left-4 z-[5] hidden h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 md:flex"
      >
        {music.muted ? <FiVolumeX className="text-[16px]" /> : <FiVolume2 className="text-[16px]" />}
      </button>
    </section>
    </>
  );
}
