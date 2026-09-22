"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Firmness scale band — short centred heading, then a full-bleed graphic
 * (same height as before) with level labels and THIS mattress highlighted
 * inside the artwork.
 */

export default function ProductFirmnessScale({ highlight = "Medium Firm" }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white" aria-label="Mattress firmness scale">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell pt-6 pb-2 text-center sm:pt-7 sm:pb-2.5 lg:pt-8"
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
          Several softness levels on one scale — this mattress sits at{" "}
          <span className="font-semibold text-brand">{highlight}</span>, marked
          on the chart below.
        </motion.p>
      </motion.div>

      <div className="relative w-full overflow-hidden bg-[#f3f1ec]">
        <div className="relative h-[min(50svh,520px)] w-full min-h-[280px] sm:min-h-[340px] lg:h-[min(52svh,580px)]">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/karmo/images/product/Medium_Soft.webp"
            aria-label={`Karmo firmness scale from cloud-soft to extra firm — ${highlight} highlighted for this mattress`}
          >
            <source
              src="/karmo/videos/product/firmness-scale.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}
