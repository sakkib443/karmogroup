"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The mosaic from the client's reference: a tall tile at each end, and between
 * them a wide-then-narrow row sitting over a narrow-then-wide one, so the
 * vertical seams never line up.
 *
 * Both rows add to exactly twelve columns, and the two tall tiles span both
 * rows — so the block is a solid rectangle with no empty cell and a flush top
 * and bottom edge. Nothing is laid over the pictures.
 *
 * The two tall slots take hero photographs: they are the only frames with
 * enough going on in the centre to survive a portrait crop. The four wide and
 * narrow slots take Karmo's own event photography, which is all landscape at
 * roughly 3:2 and would have been cropped to slivers in a tall tile.
 *
 * `span` holds complete utility strings — Tailwind scans this file for
 * literals, so a class assembled at runtime would never reach the stylesheet.
 */
const tiles = [
  {
    src: "/images/hero/slide-1-hometex-couple.png",
    alt: "Couple reading together in a bedroom dressed with Karmo bedding",
    span: "lg:col-span-3 lg:row-span-2",
  },
  {
    src: "/images/gallery/award-ceremony.jpg",
    alt: "Karmo Group team at an award ceremony",
    span: "lg:col-span-4",
  },
  {
    src: "/images/gallery/mou-meeting.jpg",
    alt: "Karmo Group meeting around the boardroom table",
    span: "lg:col-span-2",
  },
  {
    src: "/images/hero/slide-2-mattress-suite.png",
    alt: "Karmo mattress dressed in a sunlit bedroom suite",
    span: "lg:col-span-3 lg:row-span-2",
  },
  {
    src: "/images/gallery/jute-bag-handover.jpg",
    alt: "A Karmo Group eco-friendly jute bag being handed over",
    span: "lg:col-span-2",
  },
  {
    src: "/images/gallery/agreement-signing.jpg",
    alt: "Karmo Group representatives at an agreement signing",
    span: "lg:col-span-4",
  },

  // Third row — 3 + 6 + 3. A different split again, so the seams keep moving
  // down the block rather than stacking into a column.
  {
    src: "/images/divisions/foam-workshop.png",
    alt: "Foam blocks and a Karmo cushion on an upholstery workbench",
    span: "lg:col-span-3",
  },
  {
    src: "/images/products/banner-foam.png",
    alt: "Living-room corner with a sofa built on Karmo upholstery foam",
    span: "lg:col-span-6",
  },
  {
    src: "/images/products/whykarmo-family.jpg",
    alt: "A Bangladeshi family together on a sofa built on Karmo foam",
    span: "lg:col-span-3",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const tile = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

export default function Gallery({ heading }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.12 };

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24">
      {/* Oversized word behind the mosaic, the way the reference sets it. */}
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none text-[13vw] font-extrabold leading-none tracking-tighter text-ink/[0.045]"
      >
        gallery
      </span>

      {/* The heading keeps the page gutter so it lines up with every other
          section; the pictures below deliberately do not. */}
      <div className="shell relative">
        {heading ?? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: SETTLE }}
          >
            <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              <span className="h-px w-10 bg-brand" />
              Gallery
            </span>
            <h2 className="display mt-5 max-w-xl text-[1.9rem] font-light leading-[1.1] text-ink sm:text-[2.5rem]">
              The group
              <span className="font-bold"> at work</span>
            </h2>
          </motion.div>
        )}
      </div>

      {/* Full bleed, and on lg a fixed row height drives the mosaic — the
          per-tile aspect ratio is dropped there so a tile fills its cell
          exactly. Keeping the ratio would leave gaps inside the block.
          `auto-rows` rather than a fixed grid height, so adding a row of
          pictures needs nothing but another entry in the list above. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={once}
        className="relative mt-12 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[19rem]"
      >
        {tiles.map((item) => (
          <motion.div
            key={item.src}
            variants={tile}
            className={`group/tile relative aspect-[3/2] overflow-hidden bg-black/5 lg:aspect-auto ${item.span}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.05]"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
