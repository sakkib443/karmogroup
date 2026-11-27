"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import FirmnessKettlebells from "@/components/karmo/product/FirmnessKettlebells";

/**
 * Firmness scale band — short centred heading, then a full-bleed graphic
 * (same height as before) with level labels and THIS mattress highlighted
 * inside the artwork.
 */

export default function ProductFirmnessScale({ highlight = "Medium Firm" }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative flex min-h-[calc(100svh-112px)] flex-col overflow-hidden bg-white"
      aria-label="Mattress firmness scale"
    >
      {/* One full screen under the header. Background: the homepage's quilted damask, used the
          same way as there (cover, 50% strength, white wash on top) — client, 27 Nov 2026. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/shared/divisions/karmo-damask-quilted-v3.webp)",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />
      </div>
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative pt-8 pb-0 text-center sm:pt-10 lg:pt-12"
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

      {/* The scale, drawn and animated in code (replaced the old firmness video, client 27 Nov 2026). */}
      {/* sits at the bottom of the screen-high section */}
      <div className="relative mt-auto pt-4">
        <FirmnessKettlebells highlight={highlight} />
      </div>
    </section>
  );
}
