"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Footwear foam — a dark product lineup: one heading, then three stations
 * (cutaway shoe · two foam sheets · three insoles fanned from one heel) on a
 * rolled-black-foam backdrop.
 *
 * Height: full-height like the other bands on this page — the viewport minus
 * the fixed header (112px), plus twenty pixels so the next section can never
 * show along the bottom edge (it was six; the client asked for a little more). It is a `min-height`, so on a short or narrow screen
 * the band grows to its content instead of clipping it, and the content sits
 * in the middle of whatever height it gets. `data-home-two-snap` hands it to
 * `HomeTwoSectionSnap`, which eases the band flush under the header, same as
 * the other full-height sections.
 *
 * The three pieces used to be sized against the viewport height (`svh`) and
 * pinned to widths that didn't add up — 52% + a 36svh square + 28% is more than
 * 100% on anything narrower than a wide monitor, so the row overflowed and the
 * section's own `overflow-hidden` clipped the edges; on a phone the stacked
 * pieces were taller than the fixed screen-height section and got cut off top
 * and bottom. Everything here is sized by *width* instead (grid fractions and
 * aspect ratios), so nothing can overflow at any size:
 *
 *   · xl and up (≥1280)  one row — shoe · sheets · insoles, aligned on one
 *                        centre line, with hairlines between the stations.
 *                        Fractions are chosen so all three come out at roughly
 *                        the same height (shoe ≈ 0.89u, sheets 1u, insoles 1u).
 *   · below xl           shoe full-width on top, sheets + insoles side by side
 *                        underneath, the whole block capped at 820px so a wide
 *                        tablet doesn't blow the shoe up.
 */

const BG = "/karmo/images/home-02/footwear/rolled-black-foam-bg.webp";
const SHOE = "/karmo/images/home-02/footwear/shoe-catalog-real.webp";

/* The shoe PNG is 1223×528 but the shoe itself only fills (27,72)–(1198,505):
   13% of the height above it is empty. Laid out as-is, the shoe sits visibly
   lower than the pieces beside it. This trims the picture to the shoe's own
   1171×433 box (aspect-[1171/433]) and offsets the full image inside it, so the
   layout is aligning real edges, not transparent padding. */
const SHOE_TRIM = {
  left: "-2.306%", // 27 / 1171
  top: "-16.628%", // 72 / 433
  width: "104.44%", // 1223 / 1171
  height: "121.94%", // 528 / 433
};

const SOLES = [
  {
    id: "cream",
    src: "/karmo/images/home-02/footwear/sole-high-v3.webp",
    alt: "Cream Karmo foam insole",
    width: 320,
    height: 965,
    rotate: -34,
    z: 1,
  },
  {
    id: "pink",
    src: "/karmo/images/home-02/footwear/sole-mid-v3.webp",
    alt: "Magenta Karmo foam insole",
    width: 335,
    height: 946,
    rotate: 0,
    z: 3,
  },
  {
    id: "navy",
    src: "/karmo/images/home-02/footwear/sole-low-v3.webp",
    alt: "Navy Karmo foam insole",
    width: 347,
    height: 1004,
    rotate: 34,
    z: 2,
  },
];

/* A faint pool of light behind each piece, so the cut-outs lift off the dark
   foam instead of floating on it. */
function Pool() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.11),transparent)]"
    />
  );
}

/* Hairline between stations — xl only, fades out at both ends. Sits in the
   middle of the grid gap (gap-x-12 → 1.5rem either side). */
function Divider() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -left-6 bottom-6 top-6 hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent xl:block"
    />
  );
}

export default function ShoeSole() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-92px)] w-full items-center overflow-hidden bg-black"
      id="karmo-footwear"
      data-home-two-snap
      aria-label="Karmo footwear foam"
    >
      <Image
        src={BG}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        className="object-cover object-center"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/78"
      />
      {/* Light from above, so the middle of the band reads brighter than its
          corners. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(255,255,255,0.07),transparent)]"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[2] mx-auto flex w-full max-w-[1840px] flex-col items-center gap-9 px-5 py-14 sm:gap-12 sm:px-8 sm:py-16 xl:gap-14 xl:px-10 xl:py-20 2xl:px-14"
      >
        <motion.div variants={fade} className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Footwear foam
          </span>
          <h2
            className="display title-card-line mt-2 uppercase text-white"
            style={{
              fontSize: "clamp(1.35rem, 1.05rem + 1.3vw, 2.25rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            <span className="block sm:inline">Soles built to </span>
            <span className="block sm:inline">carry the day</span>
          </h2>
          <span aria-hidden className="mx-auto mt-4 block h-[2px] w-10 bg-brand" />
        </motion.div>

        {/* The lineup. Fractions are tuned so the three pieces come out the
            same height at xl; the shoe cell spans the full width below it. */}
        <div className="grid w-full max-w-[820px] grid-cols-[0.85fr_1.15fr] gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 xl:max-w-none xl:grid-cols-[2.4fr_1fr_1.45fr] xl:gap-x-12 xl:gap-y-0">
          {/* 1 — cutaway shoe */}
          <motion.div
            variants={fade}
            className="col-span-2 flex items-center justify-center xl:col-span-1"
          >
            <div className="relative aspect-[1171/433] w-full">
              <Pool />
              <Image
                src={SHOE}
                alt="Cross section of synthetic footwear — Karmo load-bearing foam"
                width={1223}
                height={528}
                unoptimized
                sizes="(min-width: 1280px) 46vw, (min-width: 820px) 820px, 92vw"
                className="absolute max-w-none drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]"
                style={SHOE_TRIM}
              />
            </div>
          </motion.div>

          {/* 2 — the two catalogue sheets, overlapped from opposite corners */}
          <motion.div
            variants={fade}
            className="relative flex items-center justify-center"
          >
            <Divider />
            <div className="relative aspect-square w-full max-w-[360px] xl:max-w-none">
              <Pool />
              <div className="absolute left-0 top-0 z-[1] aspect-square w-[66%] overflow-hidden shadow-[0_16px_34px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/25">
                <Image
                  src="/karmo/images/home-02/footwear/catalog-foam-sheet-purple.webp"
                  alt="Load-bearing purple foam sheet"
                  fill
                  sizes="(min-width: 1280px) 14vw, 30vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 z-[2] aspect-square w-[66%] overflow-hidden shadow-[0_16px_34px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/25">
                <Image
                  src="/karmo/images/home-02/footwear/catalog-foam-sheet-grey.webp"
                  alt="Load-bearing grey foam sheet"
                  fill
                  sizes="(min-width: 1280px) 14vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* 3 — three insoles fanned from one heel. The box is 1.45:1 because
              that is the shape the fan itself makes: at ±34° and a sole height
              of 96% of the box, the fan spans 1.35× its height. */}
          <motion.div
            variants={fade}
            className="relative flex items-center justify-center"
          >
            <Divider />
            <div className="relative aspect-[1.45/1] w-full max-w-[520px] xl:max-w-none">
              <Pool />
              {SOLES.map(({ id, src, alt, width, height, rotate, z }) => (
                <Image
                  key={id}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  unoptimized
                  sizes="(min-width: 1280px) 10vw, 22vw"
                  className="absolute bottom-[3%] left-1/2 h-[96%] w-auto max-w-none origin-bottom object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.5)]"
                  style={{
                    zIndex: z,
                    transform: `translateX(-50%) rotate(${rotate}deg)`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
