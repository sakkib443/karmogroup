"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Mattress sizes — four khats, same top-down pose: mattress on the bed,
 * people lying on their backs. No grey plates.
 */

const sizes = [
  {
    id: "single",
    name: "Single",
    dims: "36 × 75 in",
    fits: "Fits 1",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-single-bed.webp",
    alt: "One person lying on a Karmo single mattress on a wooden bed",
  },
  {
    id: "double",
    name: "Double",
    dims: "48 × 75 in",
    fits: "Fits 2",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-double-bed.webp",
    alt: "Two people lying on a Karmo double mattress on a wooden bed",
  },
  {
    id: "triple",
    name: "Queen",
    dims: "69 × 81 in",
    fits: "Fits 1 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-triple-bed.webp",
    alt: "An adult and a child lying on a Karmo queen mattress on a wooden bed",
  },
  {
    id: "king",
    name: "King",
    dims: "72 × 80 in",
    fits: "Fits 2 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-king-bed.webp",
    alt: "Two adults and a child lying on a Karmo king mattress on a wooden bed",
  },
];

export default function ShopBySize() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      aria-label="Shop by mattress size"
      className="relative overflow-hidden bg-white py-8 md:py-10 lg:py-12"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.38]"
        />
        <span className="absolute inset-0 bg-white/50" />
      </div>

      <div className="relative z-[1] px-6 md:px-10 lg:px-16">
        <h2 className="display section-heading title-card-line text-center uppercase text-ink">
          Shop by <span className="text-brand">mattress size</span>
        </h2>
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mt-6 grid grid-cols-4 gap-1 px-2 sm:mt-7 sm:gap-2 sm:px-3 md:mt-8 md:gap-3 md:px-4 lg:gap-4 lg:px-6"
      >
        {sizes.map((size) => (
          <motion.div key={size.id} variants={fade} className="min-w-0">
            <Link href={size.href} className="group block">
              <div
                className="relative w-full"
                style={{ height: "min(52svh, 460px)" }}
              >
                <Image
                  src={size.src}
                  alt={size.alt}
                  fill
                  sizes="25vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="display mt-2 text-center text-sm font-semibold uppercase tracking-[0.06em] text-ink/80 transition-colors duration-300 group-hover:text-brand sm:mt-2.5 sm:text-base lg:text-lg">
                {size.name}
              </p>
              <p className="mt-0.5 text-center text-xs leading-snug text-ink/45 sm:text-sm">
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
