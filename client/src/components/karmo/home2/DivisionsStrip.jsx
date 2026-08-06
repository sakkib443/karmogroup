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
 * The section used to be pinned to `100svh` so all four cards read in one
 * screen, with the grid filling it and each card taking its height from the
 * section. That is backwards once real product photography arrives: the
 * client shoots these at 2688x1152 and a card shaped by the viewport cannot
 * hold one without cutting it. So the pin is gone, every card is 21:9, and
 * the section is as tall as four of those plus its copy.
 */
const divisions = [
  {
    index: "01",
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    /* The client's own Karmo Zuti product shot, and it lives under `home-02/`
       rather than in the shared `images/divisions/` folder the other three
       still use. That folder is Home 01's as well — writing over
       `foam-armchair.jpg` would have changed a page nobody asked about.
       (The other three should follow when Home 01 is next touched; see
       `docs/images.md`.)

       It is used whole, at its native 2.33:1. It was padded out to a 1.287:1
       card for a while — each edge filled with its own colour, because the
       field reads #E8DCD8 at the top and #EDE3DE at the bottom and using one
       figure for both drew a line across the lower third. All of that went
       away when the card took the picture's shape instead. */
    image: "/karmo/images/home-02/divisions/foam-karmo-zuti-sofa-olive.webp",
    alt: "A three-seat Karmo Zuti sofa on a black frame, its lavender foam cushions branded KARMO ZUTI, beside a stepped stack of matching foam blocks and a potted olive plant",
  },
  {
    index: "02",
    name: "HomeTex",
    line: "Bed sheets, comforters, pillows",
    href: "/hometex",
    /* Shot to the brief in `IMAGE-PROMPTS.md` §9b, so it arrives at 21:9 and
       goes in whole — no crop, no padding. */
    image: "/karmo/images/home-02/divisions/hometex-bedding-set.webp",
    alt: "A white cotton pillow, a folded dove-grey comforter and two stacked bed sheets on a plain warm field, beside a potted olive tree",
  },
  {
    index: "03",
    name: "Mattress",
    line: "Pocket spring, euro top, orthopaedic",
    href: "/mattress",
    /* Used whole. This was cropped to a 1.287:1 card at first and it cost 30%
       of the mattress — 314px off one end, 315px off the other — because the
       room it sits in has a textured rug and could not be padded the way the
       foam shot could. Reshaping the card fixed both at once. */
    image: "/karmo/images/home-02/divisions/mattress-karmo-pro-foam-room.webp",
    alt: "A Karmo Pro Foam mattress in red floral ticking with white piping and a woven KARMO MATTRESS label, on a rug in front of an oak sideboard",
  },
  {
    index: "04",
    name: "Chemicals",
    line: "Adhesives, polymers, sodium silicate",
    href: "/chemicals",
    /* The last of the four to be shot to the brief. All of them are the
       client's own product photography now, all 21:9, all on the same field —
       so the row finally reads as one set rather than four pictures that
       happen to be next to each other. */
    image: "/karmo/images/home-02/divisions/chemicals-resin-tins.webp",
    alt: "A brushed steel drum and two smaller sample tins beside a glass dish of amber resin and a block of open-cell polyurethane foam, with a potted olive tree",
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
        /* 21:9, which is the shape the client's own product pictures arrive
           in — 2688x1152, every one of them.

           The card used to take its height from the grid instead (2 rows
           filling a 100svh section), which made it 1.287:1. Fitting a 2.33:1
           picture into that meant either cutting 30% off the product or
           padding the picture out, and both were done here before this: the
           foam shot was padded, the mattress was cropped, and the crop took
           both ends off a mattress. Neither is something to do to a photograph
           somebody framed deliberately. The card follows the picture now.

           Square corners — the 4px this carried was the only radius left
           anywhere on Home 02, and the client does not want rounded. */
        className="group relative block aspect-[21/9] overflow-hidden md:aspect-auto md:h-full"
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
    // One screenful, less the header. 143px is the header once it has scrolled
    // — the announcement band has rolled away by the time anyone reaches this
    // section, so that is the bar actually covering the page here, not the
    // 175px it measures at the very top.
    // The *grid* is one screenful — `100svh` less the 143px the header covers
    // once it has scrolled — and the 48px band above and below is added on top
    // of that rather than taken out of it. That is the whole trick here: the
    // three obvious ways to do this each lose something.
    //
    //   40px padding inside one screen  -> 333px cards, and the client read the
    //                                      leftover as empty space
    //   no padding at all               -> 373px cards, but the section touched
    //                                      its neighbours on both sides
    //   48px padding inside one screen  -> 324px cards, smaller than the first
    //
    // Adding the band outside gives both: 372px cards *and* a proper section
    // break. The section runs a little past a screen, which is no bad thing —
    // the sliver of the next one showing at the fold is what tells a reader
    // there is more below.
    <section className="flex flex-col bg-white py-16 md:h-[calc(100svh-143px+6rem)] md:min-h-[34rem] md:justify-center md:py-12">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid gap-12 md:h-full lg:grid-cols-[minmax(0,27rem)_1fr] lg:items-center lg:gap-14"
      >
        <motion.div
          variants={fade}
          /* This section keeps a left gutter while the two below it run
             full-bleed. It is the one that opens with a heading, and a heading
             hard against the window edge reads as a mistake — the cards on its
             right already bleed, which is the asymmetry the reference has. */
          className="pl-6 pr-6 md:pl-10 md:pr-10 lg:pl-12 lg:pr-0 lg:text-right"
        >
          {/* Right-aligned from lg up, which is the only alignment that means
              anything here: the column's ragged edge becomes a straight one
              against the cards, and the two blocks read as one grid instead of
              two things that happen to be side by side. The eyebrow's rule
              swaps to the far side with it — a rule leading the text from the
              left, on a right-aligned block, points away from everything. */}
          <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-brand lg:flex-row-reverse lg:justify-start">
            <span className="h-px w-8 bg-brand" />
            Our Divisions
          </span>
          <h2 className="display mt-5 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            One group,
            <br />
            <span className="font-bold text-brand">four crafts</span> perfected
          </h2>

          <Link
            href="/products"
            className="group mt-8 inline-flex items-center gap-4 lg:flex-row-reverse"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
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
