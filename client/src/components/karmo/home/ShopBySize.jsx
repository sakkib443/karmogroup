"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";

/**
 * Mattress sizes — four khats, same beds, mixed natural sleep poses.
 */

const sizes = [
  {
    id: "single",
    name: "Single",
    dims: "36 × 75 in",
    fits: "Fits 1",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-single-pose-clear.png",
    alt: "One person sleeping on their side on a Karmo single mattress",
  },
  {
    id: "double",
    name: "Double",
    dims: "48 × 75 in",
    fits: "Fits 2",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-double-pose-clear.png",
    alt: "Two people sleeping in different poses on a Karmo double mattress",
  },
  {
    id: "triple",
    name: "Queen",
    dims: "69 × 81 in",
    fits: "Fits 1 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-queen-pose-clear.png",
    alt: "An adult and a child sleeping on their sides on a Karmo queen mattress",
  },
  {
    id: "king",
    name: "King",
    dims: "72 × 80 in",
    fits: "Fits 2 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-king-pose-clear.png",
    alt: "A family sleeping in mixed poses on a Karmo king mattress",
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
      <TextureSlides />

      <div className="relative z-[1] px-6 md:px-10 lg:px-16">
        <h2 className="display section-heading title-card-line text-center uppercase text-ink">
          Shop by <span className="text-brand">mattress size</span>
        </h2>
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mx-auto mt-6 grid lg:w-[88%] grid-cols-2 gap-x-2 gap-y-6 px-3 sm:mt-7 sm:gap-x-3 sm:px-4 md:mt-8 md:grid-cols-4 md:gap-x-1.5 md:gap-y-0 md:px-3 lg:-mt-6 lg:gap-0 lg:px-2 xl:px-0"
      >
        {sizes.map((size) => (
          <motion.div key={size.id} variants={fade} className="min-w-0 lg:-mx-5 xl:-mx-8">
            <Link href={size.href} className="group block">
              <div
                className="relative h-[min(38svh,320px)] w-full sm:h-[min(44svh,380px)] md:h-[min(52svh,460px)] lg:h-[min(70svh,660px)]"
              >
                <Image
                  src={size.src}
                  alt={size.alt}
                  fill
                  sizes="25vw"
                  unoptimized
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="display mt-2 text-center text-sm font-semibold lg:-mt-12 uppercase tracking-[0.06em] text-ink/80 transition-colors duration-300 group-hover:text-brand sm:mt-2.5 sm:text-base lg:text-lg">
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
