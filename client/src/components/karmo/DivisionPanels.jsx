"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { rise, VIEWPORT } from "./motion";
import SectionHeading, { Accent } from "./SectionHeading";

/**
 * The four divisions as a full-bleed picture wall directly under the hero.
 *
 * Two columns of two, and the seam between the pair sits at a different height
 * on each side — 58/42 on the left against 40/60 on the right. That mismatch is
 * the whole device: four plates of four different sizes, no empty cells, and no
 * horizontal line running the width of the screen to cut the band in half.
 *
 * An earlier version staggered the plates by leaving grid cells empty. It read
 * as unfinished — the white was doing more work than the photographs. Here the
 * only white is the hairline between plates and the strip the header sits on;
 * everything else is picture.
 *
 * Labels sit on the photographs, kept small and low against a gradient that
 * only covers the bottom of each plate. Deliberately quiet otherwise: one fade
 * for the header, one for the wall, and a slow push into the picture on hover.
 */
/**
 * One generated set, one room, one light — the four plates are meant to read as
 * four corners of the same house, which is why they are not shared with any
 * other section. Each file is already cropped to the ratio its plate wants, so
 * `object-cover` has only a little left to trim at any window width.
 */
const panels = [
  {
    index: "01",
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    image: "/karmo/images/divisions/foam-armchair.jpg",
    alt: "A linen armchair with a deep-red cushion and a wool throw in a daylit living-room corner",
  },
  {
    index: "02",
    name: "HomeTex",
    line: "Bed sheets, comforters, pillows",
    href: "/hometex",
    image: "/karmo/images/divisions/hometex-bed-linen.jpg",
    alt: "A bed made up in cream sateen bedding with stacked linen pillows and a wheat-yellow throw",
  },
  {
    index: "03",
    name: "Mattress",
    line: "Pocket spring, euro top, orthopaedic",
    href: "/mattress",
    image: "/karmo/images/divisions/mattress-platform-bed.jpg",
    alt: "A quilted pocket-spring mattress on a low walnut platform bed beside a lit bedside lamp",
  },
  {
    index: "04",
    name: "Chemicals",
    line: "Adhesives, polymers, sodium silicate",
    href: "/chemicals",
    image: "/karmo/images/divisions/chemicals-bench.jpg",
    alt: "Polyurethane foam sheets, a beaker of resin, sample tins and a moulded insole on an oak bench",
  },
];

/**
 * One plate. `share` carries the md-and-up grow class — the share of its column
 * this plate takes. It has to arrive as a whole utility name: Tailwind reads
 * these files as text, so a class stitched together from a number at runtime
 * would never reach the stylesheet.
 *
 * Below md the column is a stack, the grow classes do not apply, and every
 * plate falls back to one fixed ratio.
 */
function Plate({ panel, share }) {
  return (
    <Link
      href={panel.href}
      className={`group relative aspect-[16/10] overflow-hidden md:aspect-auto md:basis-0 ${share}`}
    >
      <Image
        src={panel.image}
        alt={panel.alt}
        fill
        sizes="(min-width: 768px) 58vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      {/* Reaches just under halfway and clears well before the middle of the
          picture, so it holds the label without dimming the photograph. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-shade-deep/85 via-shade-deep/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 lg:p-7">
        <div>
          <span className="display text-[11px] font-bold tracking-[0.22em] text-white/70">
            {panel.index}
          </span>
          <h3 className="display mt-1.5 text-[1.3rem] font-bold uppercase leading-none tracking-[-0.02em] text-white lg:text-[1.65rem]">
            {panel.name}
          </h3>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 lg:text-[11px]">
            {panel.line}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:border-brand group-hover:bg-brand">
          <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}

export default function DivisionPanels() {
  const reduceMotion = useReducedMotion();

  return (
    // A definite height, not a floor: the plates below divide whatever this
    // section is given, and `min-height` alone would leave them nothing to
    // divide. The floor is a separate guard for short windows.
    <section className="flex w-full flex-col bg-white md:h-[100svh] md:min-h-[42rem]">
      {/* The shared heading, unnumbered — this band sits outside the 01-04
          run. It used to be its own thing: a smaller mixed-case line on the
          left with the label pushed to the far right, which read as a
          different kind of section from the four that follow it. */}
      <div className="shell w-full shrink-0 pb-7 pt-10">
        <SectionHeading
          eyebrow="Four divisions"
          title={[
            "From the foam inside a sofa",
            <Accent key="a">to the sheet on the bed</Accent>,
          ]}
        />
      </div>

      {/* Two columns, both full bleed. The left is wider and splits 58/42; the
          right splits 40/60, so the two seams never line up. */}
      <motion.div
        initial={reduceMotion ? false : rise.hidden}
        whileInView={rise.show}
        viewport={VIEWPORT}
        className="flex flex-1 flex-col gap-1.5 md:flex-row"
      >
        <div className="flex flex-col gap-1.5 md:basis-0 md:grow-[57]">
          <Plate panel={panels[0]} share="md:grow-[58]" />
          <Plate panel={panels[1]} share="md:grow-[42]" />
        </div>

        <div className="flex flex-col gap-1.5 md:basis-0 md:grow-[43]">
          <Plate panel={panels[2]} share="md:grow-[40]" />
          <Plate panel={panels[3]} share="md:grow-[60]" />
        </div>
      </motion.div>
    </section>
  );
}
