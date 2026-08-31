"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

export default function ProductDensityScale({ highlight = "Firm support" }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white" aria-label="Foam density scale">
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
          Find your density
        </motion.p>
        <motion.h2
          variants={fade}
          className="display mx-auto mt-3 max-w-3xl text-[1.55rem] font-bold uppercase leading-[1.12] tracking-[0.02em] text-ink sm:text-[1.9rem] lg:text-[2.2rem]"
        >
          From soft seating to extra firm
        </motion.h2>
        <motion.p
          variants={fade}
          className="body-copy mx-auto mt-3 max-w-xl text-[14px] leading-[1.6] text-ink/55"
        >
          Several densities on one scale — this grade sits at{" "}
          <span className="font-semibold text-brand">{highlight}</span>, marked
          on the chart below.
        </motion.p>
      </motion.div>

      <div className="relative w-full overflow-hidden bg-[#f3f1ec]">
        <div className="relative h-[min(50svh,520px)] w-full min-h-[280px] sm:min-h-[340px] lg:h-[min(52svh,580px)]">
          <Image
            src="/karmo/images/foam-2/pdp/density-scale-hq.jpg"
            alt={`Karmo foam density scale — ${highlight} highlighted for this grade`}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
