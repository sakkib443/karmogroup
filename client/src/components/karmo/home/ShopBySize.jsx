"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Mattress sizes — Karmo's four footprints, cartoon top-down occupancy:
 * Single 1, Double 2, Triple adult+child, King two adults+child.
 */

const sizes = [
  {
    id: "single",
    name: "Single",
    dims: "36 × 75 in",
    fits: "Fits 1",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-single-kingfabric.png",
    alt: "Cartoon top view of one person on a Karmo single mattress",
  },
  {
    id: "double",
    name: "Double",
    dims: "48 × 75 in",
    fits: "Fits 2",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-double-kingfabric.png",
    alt: "Cartoon top view of two people on a Karmo double mattress",
  },
  {
    id: "triple",
    name: "Triple",
    dims: "69 × 81 in",
    fits: "Fits 1 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-triple-kingfabric.png",
    alt: "Cartoon top view of an adult and a child on a Karmo triple mattress",
  },
  {
    id: "king",
    name: "King",
    dims: "72 × 80 in",
    fits: "Fits 2 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-king-kingfabric.png",
    alt: "Cartoon top view of two adults and a child on a Karmo king mattress",
  },
];

export default function ShopBySize() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      aria-label="Shop by mattress size"
      className="bg-white py-8 md:py-9 lg:py-10"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="px-6 md:px-10 lg:px-16"
      >
        <motion.h2
          variants={fade}
          className="display section-heading text-center uppercase text-ink"
        >
          Shop by <span className="font-bold text-brand">mattress size</span>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-5 grid grid-cols-2 gap-1.5 px-1 sm:mt-6 md:grid-cols-4 md:gap-2 md:px-1.5"
      >
        {sizes.map((size) => (
          <motion.div key={size.id} variants={fade} className="min-w-0">
            <Link href={size.href} className="group block">
              <div className="relative flex h-[min(38svh,280px)] items-center justify-center overflow-hidden bg-[#F4F1EC] sm:h-[min(40svh,300px)]">
                <Image
                  src={size.src}
                  alt={size.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:p-4"
                />
              </div>
              <p className="display mt-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/80 transition-colors duration-300 group-hover:text-brand lg:text-[14px]">
                {size.name}
              </p>
              <p className="mt-0.5 text-center text-[11px] text-ink/45 lg:text-[12px]">
                {size.dims}
                <span className="text-ink/25"> · </span>
                {size.fits}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
