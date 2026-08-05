"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The Home 02 divisions strip — a headline and CTA on the left, four
 * contained picture cards on the right, each bare until hovered. The layout
 * is the reference the client sent (a furniture site's "Explore Spaces"
 * block); the four divisions and their photographs are Home 01's
 * (`DivisionPanels.jsx`) — same plants, same crops, same claims, restyled as
 * a tight grid of cards instead of a full-bleed wall.
 *
 * ── The right edge ────────────────────────────────────────────────────────
 * The reference runs its cards to the true edge of the browser while the
 * copy on the left keeps a gutter — an asymmetric bleed, not the usual
 * `.shell` (which pads both sides equally and caps at 1600px). So this
 * section skips `.shell`, pads the left column by hand at the same widths
 * `.shell` would have used, and lets the card grid run uncapped to the right
 * edge — the same full-bleed treatment `Capabilities.jsx` and
 * `DivisionPanels.jsx` already use elsewhere on the page.
 *
 * ── The height ─────────────────────────────────────────────────────────────
 * All four cards need to read at once, in one screen, with nothing cropped
 * by the fold — so from md up the section is pinned to `100svh` (the same
 * move `DivisionPanels.jsx` makes for the same reason) and the grid fills it
 * exactly: 2 rows sized by the section's height, not by each photograph's own
 * aspect ratio. Below md the pin is dropped — four cards at screen height on
 * a phone would be a wall of slivers, not a row anyone can read — and the
 * cards fall back to a fixed aspect ratio in the normal scrolling stack.
 */
const divisions = [
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
 * The caption used to sit below the image, always on. Moved onto the
 * photograph instead, hidden until the card is hovered: a scrim and the
 * index/name/line fade in together over the picture, the same gradient
 * `DivisionPanels.jsx` uses on Home 01, just at rest instead of always shown.
 */
function DivisionCard({ division }) {
  return (
    <motion.div variants={fade}>
      <Link
        href={division.href}
        /* Square corners. The 4px here was the only radius left anywhere on
           Home 02, and the client does not want rounded. */
        className="group relative block aspect-[4/3] overflow-hidden md:aspect-auto md:h-full"
      >
        <Image
          src={division.image}
          alt={division.alt}
          fill
          sizes="(min-width: 1024px) 38vw, 50vw"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-shade-deep/85 via-shade-deep/30 to-transparent p-6 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 lg:p-7">
          <span className="display text-[11px] font-bold tabular-nums tracking-[0.1em] text-white/70">
            {division.index}
          </span>
          <h3 className="display mt-1.5 text-[1.1rem] font-bold uppercase tracking-[0.04em] text-white lg:text-[1.25rem]">
            {division.name}
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-white/75">
            {division.line}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DivisionsStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    // White, like the section under it and like the page behind everything.
    // This ran on a pale blue (#F8FAFC) while the collections band ran on
    // white, and the step between the two drew a visible seam across the page
    // — the same seam a removed hairline had been blamed for. One ground
    // colour, and the only tinted things on the page are the cards themselves.
    <section className="flex flex-col bg-white py-16 md:h-[100svh] md:min-h-[36rem] md:justify-center md:py-14">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid gap-12 md:h-full md:max-h-[46rem] lg:grid-cols-[minmax(0,27rem)_1fr] lg:items-stretch lg:gap-14"
      >
        <motion.div
          variants={fade}
          /* This section keeps a left gutter while the two below it run
             full-bleed. It is the one that opens with a heading, and a heading
             hard against the window edge reads as a mistake — the cards on its
             right already bleed, which is the asymmetry the reference has. */
          className="pl-6 pr-6 md:flex md:flex-col md:justify-center md:pl-10 md:pr-10 lg:pl-12 lg:pr-0"
        >
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" />
            Our Divisions
          </span>
          <h2 className="display mt-5 text-[1.55rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.85rem]">
            One group,
            <br />
            <span className="font-bold text-brand">four crafts</span> perfected
          </h2>

          <Link
            href="/products"
            className="group mt-8 inline-flex items-center gap-4"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              View all divisions
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        {/* 12px is the page's one gutter figure — the same value separates the
            three cards in `CollectionsShowcase` below and holds those cards
            off the scene under them. Changing it here means changing it in
            both places. */}
        <div className="grid grid-cols-2 gap-3 md:h-full md:grid-rows-2">
          {divisions.map((division) => (
            <DivisionCard key={division.name} division={division} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
