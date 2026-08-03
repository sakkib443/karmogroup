"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { rise, VIEWPORT } from "./motion";

/**
 * Three ways into the catalogue, as a picture mosaic.
 *
 * This slot used to be the product grid — six cards and a promo tile, each a
 * named product with a price. It is now three routes in instead: the visitor
 * picks a shelf rather than a mattress, and the picking of the mattress
 * happens on the page they land on.
 *
 * Built on the same device as the division wall higher up: unequal plates, so
 * the eye is given an order to read them in rather than three identical
 * squares to choose between. One tall plate on the left against a pair on the
 * right, and the pair is split 52/48 so even those two are not twins.
 *
 * The pictures are the room scenes the old product cards used on hover, which
 * were the only photographs in the library that show a product actually in
 * use. Each is cropped to clear the generator's watermark and sized for the
 * slot it lands in.
 */
const collections = [
  {
    index: "01",
    name: "Popular products",
    line: "What people buy most",
    href: "/products/popular",
    image: "/images/collections/popular.jpg",
    alt: "A Karmo pillow-top mattress dressed in white bedding in a sunlit bedroom",
  },
  {
    index: "02",
    name: "Best selling",
    line: "The ones that move fastest",
    href: "/products/best-selling",
    image: "/images/collections/best-selling.jpg",
    alt: "A deep-red Karmo comforter laid across a bed in a bright bedroom",
  },
  {
    index: "03",
    name: "New arrival",
    line: "Just added to the range",
    href: "/products/new-arrivals",
    image: "/images/collections/new-arrivals.jpg",
    alt: "A printed cotton Karmo bed sheet made up on a wooden bed",
  },
];

/**
 * One plate. `share` carries the md-and-up grow class — the share of its
 * column this plate takes. It has to arrive as a whole utility name: Tailwind
 * reads these files as text, so a class stitched together at runtime would
 * never reach the stylesheet.
 */
function Plate({ item, share = "" }) {
  return (
    <Link
      href={item.href}
      className={`group relative aspect-[16/10] overflow-hidden md:aspect-auto md:basis-0 ${share}`}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 58vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      {/* Reaches just under halfway, so it holds the label without dimming the
          photograph. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-shade-deep/85 via-shade-deep/35 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 lg:p-7">
        <div>
          <span className="display text-[11px] font-bold tracking-[0.22em] text-white/70">
            {item.index}
          </span>
          <h3 className="display mt-1.5 text-[1.3rem] font-bold uppercase leading-none tracking-[-0.02em] text-white lg:text-[1.65rem]">
            {item.name}
          </h3>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 lg:text-[11px]">
            {item.line}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:border-brand group-hover:bg-brand">
          <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}

export default function Collections({ heading }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-20">
      {heading && <div className="shell">{heading}</div>}

      {/* Deliberately shorter than the division wall, which runs a full screen.
          Two full-height picture walls on one page read as the same section
          twice; this one is a band. A definite height, not a floor — the
          plates below divide whatever this is given, and `min-height` alone
          would leave them nothing to divide. */}
      <motion.div
        initial={reduceMotion ? false : rise.hidden}
        whileInView={rise.show}
        viewport={VIEWPORT}
        className={`flex flex-col gap-1.5 md:h-[70svh] md:min-h-[30rem] md:flex-row ${
          heading ? "mt-12" : ""
        }`}
      >
        <Plate item={collections[0]} share="md:grow-[58]" />

        <div className="flex flex-col gap-1.5 md:basis-0 md:grow-[42]">
          <Plate item={collections[1]} share="md:grow-[52]" />
          <Plate item={collections[2]} share="md:grow-[48]" />
        </div>
      </motion.div>
    </section>
  );
}
