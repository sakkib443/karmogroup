"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
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
const OUTLINE_CSS = `.division-outline{font-family:${poppins.style.fontFamily} !important}`;

/* Per division, by link: panel colour, product cut-out, and the client-approved
   tagline (docs/copy/taglines.md, word for word). */
const LOOK = {
  "/foam": { bg: "#E9A23B", src: `${CUT}/foam.webp`, w: 874, h: 404, size: 94, tagline: "Redefining Everyday Comfort" },
  "/mattress": { bg: "#C8232C", src: `${CUT}/mattress.webp`, w: 583, h: 220, size: 100, tagline: "Sleep Well, Live Well" },
  "/hometex": { bg: "#24414E", src: `${CUT}/hometex.webp`, w: 577, h: 455, size: 66, tagline: "Where Comfort meets Elegance" },
  "/chemicals": { bg: "#3FAE93", src: `${CUT}/chemicals.webp`, w: 1100, h: 593, size: 88, tagline: "We Create The Chemistry Of Comfort" },
};
/* `size` is the product's width in its stage (%): set by eye so a wide sofa, a flat
   mattress, a tall stack of quilts and a group of tins look about the same weight. */

/* One name per panel, sized in the panel's own width: it grows as the panel opens
   and shrinks as it closes, in step with it. Fitted so the longest ("Chemicals")
   still sits inside a narrow panel. */
const NAME_SIZE = "min(8rem, 14.5cqw)";
/* How big the name settles when its panel is open, against its full width there. */
const OPEN_SCALE = 0.68;

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const TITLE = { fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.9 };

function Panel({ division, look, active, onOpen }) {
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
      style={{ backgroundColor: look.bg, flexGrow: active ? 3.2 : 1, flexBasis: 0, transition: `flex-grow 900ms ${EASE}` }}
    >
      {/* The name: centred at the top when closed, moving left and settling a little
          smaller as the panel opens. One element the whole way, so it never blinks.
          Closed it has a short rule and "Karmo Group" under it; open, "Karmo Group"
          sits on a line above it and the tagline on a line below. */}
      <span
        className="pointer-events-none absolute w-max text-white"
        style={{
          top: active ? "11%" : "7%",
          left: active ? "7%" : "50%",
          transform: `translateX(${active ? "0%" : "-50%"})`,
          transition: `top 900ms ${EASE}, left 900ms ${EASE}, transform 900ms ${EASE}`,
        }}
      >
        {/* Open: the line above */}
        <span
          className="absolute bottom-full left-0 mb-3 block whitespace-nowrap text-[12px] font-extrabold uppercase tracking-[0.3em] text-white md:text-[13px]"
          style={{
            opacity: active ? 1 : 0,
            transform: `translateY(${active ? 0 : 8}px)`,
            transition: active ? `opacity 500ms ${EASE} 350ms, transform 700ms ${EASE} 300ms` : "opacity 150ms ease-out, transform 200ms ease-out",
          }}
        >
          Karmo Group
        </span>

        <span
          className="display block whitespace-nowrap uppercase"
          style={{
            ...TITLE,
            fontSize: NAME_SIZE,
            transform: `scale(${active ? OPEN_SCALE : 1})`,
            transformOrigin: "0 0",
            transition: `transform 900ms ${EASE}`,
          }}
        >
          {division.name}
        </span>

        {/* Closed: the rule and the group, centred under the name */}
        <span
          className="absolute left-0 right-0 top-full flex flex-col items-center"
          style={{ opacity: active ? 0 : 1, transition: active ? "opacity 200ms ease-out" : `opacity 500ms ${EASE} 300ms` }}
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
              opacity: active ? 1 : 0,
              transform: `translateY(${active ? 0 : 10}px)`,
              transition: active ? `opacity 600ms ${EASE} 450ms, transform 800ms ${EASE} 400ms` : "opacity 150ms ease-out, transform 200ms ease-out",
            }}
          >
            <span aria-hidden className="h-[3px] w-7 shrink-0 bg-white" />
            {look.tagline}
          </span>
        ) : null}
      </span>

      {/* Open: the name again, as a large outline behind the product */}
      <span
        aria-hidden
        className="division-outline pointer-events-none absolute bottom-[9%] left-0 whitespace-nowrap uppercase"
        style={{
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: "-0.01em",
          fontSize: "16cqw",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.32)",
          opacity: active ? 1 : 0,
          transform: `translateX(${active ? "4%" : "18%"})`,
          transition: active ? `opacity 800ms ${EASE} 200ms, transform 1400ms ${EASE} 100ms` : `opacity 200ms ease-out, transform 400ms ease-out`,
        }}
      >
        {division.name}
      </span>

      {/* The product, standing at the bottom with a soft shadow */}
      <span
        className="pointer-events-none absolute inset-x-[8%] bottom-[12%] top-[42%] flex items-end justify-center"
        style={{ transform: `scale(${active ? 1.14 : 0.92})`, transformOrigin: "50% 100%", transition: `transform 1000ms ${EASE}` }}
      >
        <span aria-hidden className="absolute bottom-[-3%] left-1/2 h-[8%] w-[80%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-md" />
        <Image
          src={look.src}
          alt={division.image?.alt || division.name}
          width={look.w}
          height={look.h}
          sizes="(min-width: 768px) 45vw, 90vw"
          className="relative h-auto max-h-full object-contain object-bottom"
          style={{ width: `${look.size}%` }}
        />
      </span>

      {/* Open: the link along the bottom */}
      <span
        className="pointer-events-none absolute bottom-[4%] left-[7%] inline-flex items-center gap-2 border-b border-white/70 pb-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
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
  const tiles = (c.tiles || []).filter((t) => LOOK[t?.href]);
  if (c.hidden || tiles.length < 2) return null;

  return (
    <section aria-label="Our divisions" className="relative bg-white">
      <style>{OUTLINE_CSS}</style>
      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
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
          />
        ))}
      </motion.div>
    </section>
  );
}
