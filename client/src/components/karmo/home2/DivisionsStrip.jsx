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
    image: "/karmo/images/home-02/divisions/foam-karmo-sofa-blocks-studio.png",
    alt: "A Karmo Foam sofa with lavender cushions and stacked foam blocks in a studio setting",
  },
  {
    index: "02",
    name: "Mattress",
    line: "Pocket spring, euro top, orthopaedic",
    href: "/mattress",
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-6A2NM3ciJO.png",
    alt: "A Karmo floral quilted mattress on a channel-tufted taupe bed, styled with green and ochre cushions between potted plants",
  },
  {
    index: "03",
    name: "HomeTex",
    line: "Bed sheets, comforters, pillows",
    href: "/hometex",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
    alt: "Karmo HomeTex bedding in a styled bedroom",
  },
  {
    index: "04",
    name: "Chemicals",
    line: "Adhesives, polymers, sodium silicate",
    href: "/chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
    alt: "Karmo Adhesive tins in a showroom setting",
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
        </div>

        <p className="display mt-3 text-center text-[16px] font-semibold uppercase text-ink/80 transition-colors duration-300 group-hover:text-brand lg:mt-4 lg:text-[18px]">
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
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            Our Divisions
          </span>
          <h2 className="display mt-1 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            One group, <span className="font-bold text-brand">four crafts</span>
          </h2>
          <span
            aria-hidden
            className="mt-4 flex items-center justify-center gap-3"
          >
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill="#FF9A1F"
              />
              <path
                d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                stroke="#B4651A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
          </span>
        </motion.div>
      </motion.div>

      {/* Full width — the row skips `.shell` at the client's ask and runs on
          a small edge padding instead, so the cards get as much of the window
          as they can. The heading above still sits in `.shell` for a proper
          measure; this row is deliberately wider than it. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-6 grid grid-cols-2 gap-4 px-3 md:mt-8 md:gap-6 md:px-4 lg:grid-cols-4"
      >
        {divisions.map((division) => (
          <DivisionCard key={division.name} division={division} />
        ))}
      </motion.div>
    </section>
  );
}
