"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Footwear foam — bright room still. Products live in the photograph;
 * no callout pins or numbered badges on top of the image.
 */

const VIEW_H = "h-[calc(100svh-72px)] min-h-[calc(100svh-72px)]";

export default function ShoeSole() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className={`relative w-full overflow-hidden ${VIEW_H}`}
      id="karmo-footwear"
      aria-label="Karmo footwear foam"
    >
      <Image
        src="/karmo/images/home-02/footwear/footwear-room-scene-v2-hq.png"
        alt="Cutaway running shoe and three Karmo foam footbeds on a wooden table"
        fill
        sizes="100vw"
        quality={90}
        className="object-cover object-center"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-shade-deep/40"
      />

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="absolute top-[22%] left-[7%] z-[2] sm:top-[24%] sm:left-[9%] lg:top-[26%] lg:left-[10%]"
      >
        <h2 className="display max-w-[14ch] text-[1.35rem] font-bold uppercase leading-[1.12] tracking-[0.01em] text-white sm:text-[1.75rem] lg:text-[2.1rem]">
          Soles built to
          <span className="block">carry the day</span>
        </h2>
      </motion.div>
    </section>
  );
}
