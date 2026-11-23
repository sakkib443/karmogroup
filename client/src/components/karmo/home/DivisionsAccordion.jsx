"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Anton, Poppins } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useSection } from "@/cms/CmsProvider";
import { divisions as section } from "@/cms/pages/home";

/**
 * The four divisions as an expanding row, after the "hover to open" reel: four flat
 * colour panels, each with its product cut out (no background) and its name set small
 * at the top. The panel under the pointer widens to about half the row while the
 * others narrow and slide aside; its product grows and its name becomes a large title.
 * On phones the panels stack; the first tap opens one, the second follows it.
 * Fills the screen under the sticky header (112px). Names and links come from
 * Admin → Site content → Home → Our divisions; colours and cut-outs are set here.
 */

const CUT = "/pages/home/divisions/cutouts";

/* The outline name behind the product is set in Poppins: the site face draws a
   broken stroke at that size. */
const poppins = Poppins({ subsets: ["latin"], weight: ["700"], display: "swap" });
/* Poster panels ("MULTI" over "LEAVES") use a tall condensed face, as in the print ad. */
const anton = Anton({ subsets: ["latin"], weight: ["400"], display: "swap" });
const OUTLINE_CSS = `.division-outline{font-family:${poppins.style.fontFamily} !important}.division-poster,.division-poster *{font-family:${anton.style.fontFamily} !important}`;

/* Per division, by link: panel colour, product cut-out, and the client-approved
   tagline (docs/copy/taglines.md, word for word). */
const LOOK = {
  "/foam": {
    bg: "#E9A23B", src: `${CUT}/foam.webp`, w: 874, h: 404, tagline: "Redefining Everyday Comfort",
    poster: { outline: "Karmo", title: "Foam" },
    openW: "78%", bleed: "14%",
  },
  "/mattress": {
    bg: "#C8232C", src: `${CUT}/mattress.webp`, w: 583, h: 220, tagline: "Sleep Well, Live Well",
    poster: { outline: "Karmo", title: "Mattress" },
    openW: "80%", bleed: "18%",
  },
  "/hometex": {
    bg: "#24414E", src: `${CUT}/hometex-quilt-roll.webp`, w: 786, h: 630, tagline: "Where Comfort meets Elegance",
    poster: { outline: "Karmo", title: "HomeTex" },
    openW: "62%", bleed: "0%",
  },
  "/chemicals": {
    bg: "#3FAE93", src: `${CUT}/chemicals.webp`, w: 1100, h: 593, tagline: "We Create The Chemistry Of Comfort",
    poster: { outline: "Karmo", title: "Chemicals" },
    openW: "70%", bleed: "8%",
  },
};
/* Open, every panel reads like the Multi Leaves comforter ad:
   an outline word over a solid name, the navy tag with the approved tagline, and the
   product large at the bottom right, running off the right edge onto a white floor.
   `openW` is how much of the open panel the product spans; `bleed` how far it runs
   past the right edge (the quilt cut-out already ends at its own edge). */

/* One name per panel, sized in the panel's own width: it grows as the panel opens
   and shrinks as it closes, in step with it. Fitted so the longest ("Chemicals")
   still sits inside a narrow panel. */
const NAME_SIZE = "min(8rem, 14.5cqw)";
/* How big the name settles when its panel is open, against its full width there. */
const OPEN_SCALE = 0.72;
/* The outline word over the name when open, poster style ("FLORAL" over "REVERIE"). */
const OUTLINE_WORD = "Karmo";
const OUTLINE_SIZE = "18cqw";

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const TITLE = { fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.9 };

function Panel({ division, look, active, onOpen, posterGrow }) {
  /* Whether the name takes its open pose (poster panels swap it for their own words). */
  const named = active && !look.poster;
  /* Touch screens have no hover: the first tap opens the panel, the next one follows the link. */
  const onClick = (e) => {
    if (active) return;
    if (window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <Link
      href={division.href || "#"}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onClick}
      aria-label={`${division.name}${look.tagline ? ` — ${look.tagline}` : ""}`}
      className="@container relative block min-h-0 min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      style={{ backgroundColor: look.bg, flexGrow: active ? posterGrow || 3.2 : 1, flexBasis: 0, transition: `flex-grow 900ms ${EASE}` }}
    >
      {/* Open: poster light — a soft glow at the top, the floor fading to white. The floor eases
          out over many stops (a cosine curve) so it melts into even the deep red and teal
          without a visible band. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: look.poster
            ? "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%), linear-gradient(0deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.97) 14%, rgba(255,255,255,0.961) 16.1%, rgba(255,255,255,0.933) 18.3%, rgba(255,255,255,0.888) 20.4%, rgba(255,255,255,0.828) 22.5%, rgba(255,255,255,0.754) 24.6%, rgba(255,255,255,0.671) 26.8%, rgba(255,255,255,0.580) 28.9%, rgba(255,255,255,0.485) 31.0%, rgba(255,255,255,0.390) 33.1%, rgba(255,255,255,0.299) 35.3%, rgba(255,255,255,0.216) 37.4%, rgba(255,255,255,0.142) 39.5%, rgba(255,255,255,0.082) 41.6%, rgba(255,255,255,0.037) 43.8%, rgba(255,255,255,0.009) 45.9%, rgba(255,255,255,0.000) 48.0%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 42%), linear-gradient(0deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 24%)",
          opacity: active ? 1 : 0,
          transition: `opacity 900ms ${EASE}`,
        }}
      />

      {/* The name: centred at the top when closed, moving left and settling a little
          smaller as the panel opens. One element the whole way, so it never blinks.
          Closed it has a short rule and "Karmo Group" under it; open, it reads like the
          poster: a huge outline word above it and the tagline on a line below. */}
      <span
        className="pointer-events-none absolute w-max text-white"
        style={{
          opacity: look.poster && active ? 0 : 1,
          top: named ? `calc(6% + ${OUTLINE_SIZE} * 0.86)` : "7%",
          left: named ? "7%" : "50%",
          transform: `translateX(${named ? "0%" : "-50%"})`,
          transition: `top 900ms ${EASE}, left 900ms ${EASE}, transform 900ms ${EASE}, opacity ${active ? "200ms ease-out" : `500ms ${EASE} 300ms`}`,
        }}
      >
        {/* Open: the huge outline word above */}
        <span
          aria-hidden
          className="division-outline absolute bottom-full left-[-0.04em] block whitespace-nowrap uppercase"
          style={{
            fontWeight: 700,
            lineHeight: 0.86,
            letterSpacing: "-0.01em",
            fontSize: OUTLINE_SIZE,
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.95)",
            opacity: named ? 1 : 0,
            transform: `translateY(${named ? 0 : 14}px)`,
            transition: named ? `opacity 700ms ${EASE} 250ms, transform 900ms ${EASE} 200ms` : "opacity 150ms ease-out, transform 200ms ease-out",
          }}
        >
          {OUTLINE_WORD}
        </span>

        <span
          className="display block whitespace-nowrap uppercase"
          style={{
            ...TITLE,
            fontSize: NAME_SIZE,
            transform: `scale(${named ? OPEN_SCALE : 1})`,
            transformOrigin: "0 0",
            transition: `transform 900ms ${EASE}`,
          }}
        >
          {division.name}
        </span>

        {/* Closed: the rule and the group, centred under the name */}
        <span
          className="absolute left-0 right-0 top-full flex flex-col items-center"
          style={{ opacity: named ? 0 : 1, transition: named ? "opacity 200ms ease-out" : `opacity 500ms ${EASE} 300ms` }}
        >
          <span aria-hidden className="mt-3 block h-[2px] w-8 bg-white/80" />
          <span className="mt-2.5 block whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.3em] text-white md:text-[13px]">Karmo Group</span>
        </span>

        {/* Open: the line below */}
        {look.tagline ? (
          <span
            className="absolute left-0 flex w-[min(32rem,80cqw)] items-center gap-3 text-[15px] font-bold leading-snug text-white md:text-[20px]"
            style={{
              top: `calc(${OPEN_SCALE * 100}% + 14px)`,
              opacity: named ? 1 : 0,
              transform: `translateY(${named ? 0 : 10}px)`,
              transition: named ? `opacity 600ms ${EASE} 450ms, transform 800ms ${EASE} 400ms` : "opacity 150ms ease-out, transform 200ms ease-out",
            }}
          >
            <span aria-hidden className="h-[3px] w-7 shrink-0 bg-white" />
            {look.tagline}
          </span>
        ) : null}
      </span>


      {/* Poster panels, open: an outline word over a solid one, as in the print ad */}
      {look.poster ? (
        <span
          aria-hidden
          className="division-poster pointer-events-none absolute left-[5%] top-[15%] block uppercase text-white"
          style={{ lineHeight: 0.82, opacity: active ? 1 : 0, transform: `translateY(${active ? 0 : 16}px)`, transition: active ? `opacity 700ms ${EASE} 300ms, transform 900ms ${EASE} 250ms` : "opacity 150ms ease-out, transform 200ms ease-out" }}
        >
          <span className="block whitespace-nowrap" style={{ fontSize: "min(14rem, 20cqw)", letterSpacing: "0.01em", color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.78)" }}>
            {look.poster.outline}
          </span>
          <span className="mt-[2.4cqw] block whitespace-nowrap" style={{ fontSize: `min(9rem, ${Math.min(12.5, 100 / look.poster.title.length)}cqw)`, letterSpacing: "0.01em" }}>
            {look.poster.title}
          </span>
        </span>
      ) : null}

      {/* The product, standing at the bottom with a soft shadow */}
      <span
        className={look.poster ? "pointer-events-none absolute flex items-end justify-end" : "pointer-events-none absolute inset-x-[8%] bottom-[12%] top-[42%] flex items-end justify-center"}
        style={{
          ...(look.poster ? { right: `-${look.bleed}`, width: `calc(${active ? look.openW : "94%"} + ${look.bleed})`, top: active ? "40%" : "36%", bottom: active ? "6%" : "13%" } : {}),
          transform: look.poster ? "none" : `translateX(${active ? "5%" : "0%"}) scale(${active ? 1.22 : 0.92})`,
          transformOrigin: look.poster ? "100% 100%" : "50% 100%",
          transition: `transform 1000ms ${EASE}, width 900ms ${EASE}, top 900ms ${EASE}, bottom 900ms ${EASE}`,
        }}
      >
        {look.poster ? null : <span aria-hidden className="absolute bottom-[-2%] left-1/2 h-[6%] w-[78%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-md" />}
        <span className={look.poster ? "relative block h-full w-full" : "relative block max-h-full"} style={look.poster ? undefined : { width: `${look.size}%` }}>
          <Image
            src={look.src}
            alt={division.image?.alt || division.name}
            width={look.w}
            height={look.h}
            sizes="(min-width: 768px) 45vw, 90vw"
            className={look.poster ? "relative block h-full w-full object-contain object-right-bottom" : "relative block h-auto w-full object-contain object-bottom"}
            style={look.poster ? { filter: "drop-shadow(0 22px 16px rgba(0,0,0,0.38))" } : undefined}
          />
          {/* Open: its reflection on the floor */}
          <Image
            src={look.src}
            alt=""
            aria-hidden
            width={look.w}
            height={look.h}
            sizes="(min-width: 768px) 45vw, 90vw"
            className={look.poster ? "absolute left-0 top-full block h-full w-full object-contain object-right-bottom" : "absolute left-0 top-full block h-auto w-full"}
            style={{
              transform: "scaleY(-1)",
              opacity: active || look.poster ? 0.28 : 0,
              transition: `opacity 900ms ${EASE}`,
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 45%)",
              maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
            }}
          />
        </span>
      </span>

      {/* Poster panels, open: the navy tag with speed lines that sits on the product, as in the ad */}
      {look.poster && look.tagline ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-[11%] top-[30%] block"
          style={{ opacity: active ? 1 : 0, transform: `translateX(${active ? 0 : 24}px) rotate(-4deg)`, transition: active ? `opacity 600ms ${EASE} 550ms, transform 800ms ${EASE} 500ms` : "opacity 150ms ease-out, transform 200ms ease-out" }}
        >
          <span className="absolute -right-[12%] -top-[22%] block h-[2px] w-[70%] bg-black/70" />
          <span className="absolute -right-[4%] top-[8%] block h-[2px] w-[34%] bg-white/80" />
          <span className="absolute -left-[18%] bottom-[30%] block h-[2px] w-[40%] bg-black/70" />
          <span className="absolute -right-[16%] bottom-[18%] block h-[2px] w-[28%] bg-white/80" />
          <span className="division-poster relative block w-[31cqw] [text-wrap:balance] rounded-tl-[1.6cqw] rounded-br-[1.6cqw] bg-[#1d3f8f] px-[3.2cqw] py-[1.6cqw] text-center uppercase leading-[1.02] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]" style={{ fontSize: "min(2.4rem, 3.7cqw)", letterSpacing: "0.02em" }}>
            {look.tagline}
          </span>
          <span className="division-poster relative -mt-[0.4cqw] ml-auto block w-fit rounded-br-[1.2cqw] bg-[#D44348] px-[2.6cqw] py-[0.9cqw] uppercase text-white" style={{ fontSize: "min(1.6rem, 2.8cqw)", letterSpacing: "0.08em" }}>
            Karmo {division.name}
          </span>
        </span>
      ) : null}

      {/* Open: the link along the bottom */}
      <span
        className={`pointer-events-none absolute bottom-[4%] left-[7%] inline-flex items-center gap-2 border-b pb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] ${look.poster ? "border-[#1d3f8f]/60 text-[#1d3f8f]" : "border-white/70 text-white"}`}
        style={{ opacity: active ? 1 : 0, transition: active ? `opacity 500ms ${EASE} 450ms` : "opacity 150ms ease-out" }}
      >
        Explore {division.name}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

export default function DivisionsAccordion() {
  const c = useSection("divisions", section.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [active, setActive] = useState(-1);
  /* Every panel opens to a square, like the print ad: the grow factor is worked out
     from the row's size so the open width always equals the height. */
  const rowRef = useRef(null);
  const [posterGrow, setPosterGrow] = useState(null);
  const tiles = (c.tiles || []).filter((t) => LOOK[t?.href]);
  const count = tiles.length;
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => {
      const { width: w, height: h } = row.getBoundingClientRect();
      if (w < 768 || w <= h || count < 2) return setPosterGrow(null);
      setPosterGrow(Math.min(8, ((count - 1) * h) / (w - h)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [count]);
  if (c.hidden || tiles.length < 2) return null;

  return (
    <section aria-label="Our divisions" className="relative bg-white">
      <style>{OUTLINE_CSS}</style>
      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        ref={rowRef}
        onMouseLeave={() => setActive(-1)}
        className="flex h-[calc(100svh-112px)] min-h-[520px] flex-col md:flex-row"
      >
        {tiles.map((division, i) => (
          <Panel
            key={`${i}-${division.name}`}
            division={division}
            look={LOOK[division.href]}
            active={active === i}
            onOpen={() => setActive(i)}
            posterGrow={posterGrow}
          />
        ))}
      </motion.div>
    </section>
  );
}
