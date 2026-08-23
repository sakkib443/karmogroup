"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Product feature 2×2 media grid — no section heading; 6px gap from the
 * band above (homepage inter-section language).
 */

const GAP = "gap-1 md:gap-1.5";

export default function ProductVideoFeatures({ features = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!features.length) return null;

  return (
    <section className="mt-[6px] mb-8 bg-white md:mb-10 lg:mb-12">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid grid-cols-1 sm:grid-cols-2 ${GAP}`}
      >
        {features.map((feat, i) => (
          <motion.li
            key={feat.title}
            variants={fade}
            className="group relative h-[min(72svh,640px)] min-h-[440px] overflow-hidden bg-ink sm:h-[min(68svh,700px)] lg:h-[min(74svh,780px)]"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            >
              <source src={feat.video} type="video/mp4" />
            </video>

            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-shade-deep/90 via-shade-deep/35 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-1.5 text-[1.15rem] font-bold uppercase leading-[1.15] tracking-[0.02em] text-white sm:text-[1.25rem]">
                {feat.title}
              </h3>
              <p className="body-copy mt-2 max-w-[22rem] text-[12.5px] leading-[1.55] text-white/75 sm:text-[13px] line-clamp-3">
                {feat.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
