"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Full-bleed firmness scale — heading above, organic kettlebell graphic below.
 * About half a viewport tall so the chart reads as a hero band, not a strip.
 */

export default function ProductFirmnessScale() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="bg-white"
      aria-label="Mattress firmness scale"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell pt-10 pb-5 text-center sm:pt-12 sm:pb-6 lg:pt-14"
      >
        <motion.p
          variants={fade}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand"
        >
          Find your feel
        </motion.p>
        <motion.h2
          variants={fade}
          className="display mx-auto mt-3 max-w-3xl text-[1.55rem] font-bold uppercase leading-[1.12] tracking-[0.02em] text-ink sm:text-[1.9rem] lg:text-[2.2rem]"
        >
          From cloud-soft to extra firm
        </motion.h2>
        <motion.p
          variants={fade}
          className="body-copy mx-auto mt-3 max-w-xl text-[14px] leading-[1.6] text-ink/55"
        >
          The same weight, seven responses — see how a Karmo surface holds you
          from extra soft through medium firm to extra firm.
        </motion.p>
      </motion.div>

      <div className="relative w-full overflow-hidden bg-[#f7f5f2]">
        <div className="relative h-[min(50svh,520px)] w-full min-h-[280px] sm:min-h-[340px] lg:h-[min(52svh,580px)]">
          <Image
            src="/karmo/images/product/karmo-firmness-scale-v1.png"
            alt="Firmness scale from extra soft to extra firm, with medium firm highlighted"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
