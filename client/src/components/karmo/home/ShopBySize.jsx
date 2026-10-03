"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";

/**
 * Mattress sizes — four khats, same beds, mixed natural sleep poses.
 * Two looks (colour cartoon, pencil sketch) toggled by the right arrow.
 */

const LOOKS = ["src", "sketch"];

const sizes = [
  {
    id: "single",
    name: "Single",
    dims: "36 × 75 in",
    fits: "Fits 1",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-single-pose-red-v2.webp",
    sketch: "/karmo/images/home-02/sizes/size-single-pose-sketch-v4.webp",
    alt: "One person sleeping on their side on a Karmo single mattress",
  },
  {
    id: "double",
    name: "Double",
    dims: "48 × 75 in",
    fits: "Fits 2",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-double-pose-red-v2.webp",
    sketch: "/karmo/images/home-02/sizes/size-double-pose-sketch-v4.webp",
    alt: "Two people sleeping in different poses on a Karmo double mattress",
  },
  {
    id: "triple",
    name: "Queen",
    dims: "69 × 81 in",
    fits: "Fits 1 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-queen-pose-red-v2.webp",
    sketch: "/karmo/images/home-02/sizes/size-queen-pose-sketch-v4.webp",
    alt: "An adult and a child sleeping on their sides on a Karmo queen mattress",
  },
  {
    id: "king",
    name: "King",
    dims: "72 × 80 in",
    fits: "Fits 2 + child",
    href: "/mattress",
    src: "/karmo/images/home-02/sizes/size-king-pose-red-v2.webp",
    sketch: "/karmo/images/home-02/sizes/size-king-pose-sketch-v4.webp",
    alt: "A family sleeping in mixed poses on a Karmo king mattress",
  },
];

export default function ShopBySize() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [look, setLook] = useState(0);

  return (
    <section
      aria-label="Shop by mattress size"
      className="relative overflow-hidden bg-white py-8 md:py-10 lg:py-12"
    >
      <TextureSlides lighter />

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
          <motion.div key={size.id} variants={fade} className="min-w-0">
            <Link href={size.href} className="group block">
              <div
                className="relative h-[min(34svh,280px)] w-full sm:h-[min(40svh,340px)] md:h-[min(46svh,400px)] lg:h-[min(56svh,520px)]"
              >
                {LOOKS.map((key, i) => (
                  <Image
                    key={key}
                    src={size[key]}
                    alt={i === look ? size.alt : ""}
                    aria-hidden={i !== look}
                    fill
                    sizes="25vw"
                    unoptimized
                    className={`object-contain transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
                      i === look ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <p className="display mt-2 text-center text-sm font-semibold lg:-mt-9 uppercase tracking-[0.06em] text-ink/80 transition-colors duration-300 group-hover:text-brand sm:mt-2.5 sm:text-base lg:text-lg">
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

      <button
        type="button"
        onClick={() => setLook((l) => (l + 1) % LOOKS.length)}
        aria-label={look === 0 ? "Show sketch version" : "Show colour version"}
        className="absolute top-1/2 right-2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
      >
        <FiChevronRight className="text-[20px]" aria-hidden />
      </button>
    </section>
  );
}
