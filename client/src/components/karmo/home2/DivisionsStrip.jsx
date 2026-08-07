"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The Home 02 divisions band — a centred headline above four full-bleed
 * picture cards in one row. Same four divisions and photographs as before;
 * the layout was rebuilt after the client found the old left-heading /
 * right-grid arrangement hard to read.
 *
 * The header sits in `.shell` so the copy has a comfortable measure. The cards
 * below skip `.shell` and run edge to edge with the page's 12px gutter
 * between them — the same figure `CollectionsShowcase` uses.
 */
/* Images are borrowed from the Popular Products row further down the page, at
   the client's ask — the four division cards now show the same four product
   pictures. The `name`, `line` and `href` still belong to the divisions, so
   the caption over each picture is unchanged; only the artwork changed.
   Restoring the original division photography is swapping the four `image`
   and `alt` lines back to what they were. */
const divisions = [
  {
    index: "01",
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    image: "/karmo/images/mattress/plant-bedroom.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off",
  },
  {
    index: "02",
    name: "HomeTex",
    line: "Bed sheets, comforters, pillows",
    href: "/hometex",
    image: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    alt: "Karmo campaign poster — a modular sofa on Karmo 2001 lavender foam cushions above a stack of foam blocks, offered at 20% off with free delivery",
  },
  {
    index: "03",
    name: "Mattress",
    line: "Pocket spring, euro top, orthopaedic",
    href: "/mattress",
    image: "/karmo/images/mattress/cloud-poster.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off",
  },
  {
    index: "04",
    name: "Chemicals",
    line: "Adhesives, polymers, sodium silicate",
    href: "/chemicals",
    image: "/karmo/images/mattress/suite-interior.jpg",
    alt: "A Karmo mattress in red floral ticking with white piping on an upholstered bed, lit by two bedside lamps beneath a chandelier",
  },
];

/**
 * A near-square picture with only its name centred underneath — the pattern
 * the client sent as a second reference (a furniture catalogue's product row).
 * Nothing sits on the picture, and the index and the description that lived
 * with the name are gone; the name alone is the caption.
 *
 * The 6px radius is the client's own figure (asked for after 14px read as too
 * rounded). Nothing else on the page carries this radius yet — if a second
 * card ever wants soft corners at this weight, share the token.
 */
function DivisionCard({ division }) {
  return (
    <motion.div variants={fade} className="min-w-0">
      <Link href={division.href} className="group block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={division.image}
            alt={division.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          {/* The page-wide `photo-veil`, kept: this pattern is on every
              picture-card on the page, and the hover lift is what says the
              card is a link once the gradient and the arrow are gone. */}
          <span
            aria-hidden
            className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-45"
          />
        </div>

        <p className="mt-2.5 text-center text-[14px] font-medium text-ink/70 transition-colors duration-300 group-hover:text-brand lg:mt-3 lg:text-[15px]">
          {division.name}
        </p>
      </Link>
    </motion.div>
  );
}

export default function DivisionsStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    // Centred heading, then a full-width row of four cards — the client's
    // second reference (a furniture catalogue's product row), which they
    // preferred to the asymmetric left-copy / right-grid arrangement.
    <section className="bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell text-center"
      >
        <motion.span
          variants={fade}
          className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand sm:text-[12px]"
        >
          <span className="h-px w-8 bg-brand" />
          Our Divisions
          <span className="h-px w-8 bg-brand" />
        </motion.span>

        <motion.h2
          variants={fade}
          className="display mx-auto mt-4 max-w-2xl text-[1.75rem] font-light uppercase leading-[1.14] tracking-[0.01em] text-ink sm:text-[2rem] lg:text-[2.35rem]"
        >
          One group, <span className="font-bold text-brand">four crafts</span>
        </motion.h2>
      </motion.div>

      {/* Full width — the row skips `.shell` at the client's ask and runs on
          a small edge padding instead, so the cards get as much of the window
          as they can. The heading above still sits in `.shell` for a proper
          measure; this row is deliberately wider than it. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-10 grid grid-cols-2 gap-4 px-3 md:mt-14 md:gap-6 md:px-4 lg:grid-cols-4"
      >
        {divisions.map((division) => (
          <DivisionCard key={division.name} division={division} />
        ))}
      </motion.div>
    </section>
  );
}
