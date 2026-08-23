"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The Home 02 divisions band — left-flush headline above four full-bleed
 * picture cards in one row. Same four divisions and photographs as before.
 *
 * Heading keeps a small left inset; the four cards run full-bleed edge to edge.
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
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-SyOgGVtUb8.jpg",
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
        <div className="relative aspect-[1/1] overflow-hidden">
          <Image
            src={division.image}
            alt={division.alt}
            fill
            sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 90vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        </div>

        <p className="display mt-2.5 text-center text-[16px] font-semibold uppercase text-ink/80 transition-colors duration-300 group-hover:text-brand lg:mt-3 lg:text-[18px]">
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
    <section className="bg-white">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="pl-4 text-left"
      >
        <motion.div variants={fade}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Our Divisions
          </span>
          <h2 className="display mt-1 whitespace-nowrap text-[1.25rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink sm:text-[1.4rem] lg:text-[1.55rem]">
            One group, <span className="font-bold text-brand">four crafts</span>
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-3 grid grid-cols-2 gap-1 px-0 md:mt-3.5 md:gap-1.5 lg:grid-cols-4"
      >
        {divisions.map((division) => (
          <DivisionCard key={division.name} division={division} />
        ))}
      </motion.div>
    </section>
  );
}
