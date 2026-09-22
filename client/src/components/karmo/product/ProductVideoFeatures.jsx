"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Two feature bands — editorial split (media + copy), moderate height.
 * Not full-viewport fills; clean stacking under the build section.
 */

export default function ProductVideoFeatures({ features = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!features.length) return null;

  return (
    <div className="bg-white">
      {features.map((feat, i) => {
        const mediaRight = i % 2 === 1;
        return (
          <section
            key={feat.title}
            className="mt-[6px] overflow-hidden bg-[#F7F6F4]"
            aria-label={feat.title}
          >
            <motion.div
              variants={group}
              {...reveal}
              viewport={VIEWPORT}
              className={`grid min-h-[min(42svh,380px)] lg:min-h-[min(48svh,440px)] lg:grid-cols-2 ${
                mediaRight ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <motion.div
                variants={fade}
                className="group relative min-h-[min(36svh,280px)] overflow-hidden bg-ink lg:min-h-0"
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
              </motion.div>

              <motion.div
                variants={fade}
                className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 xl:px-16"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 max-w-[16ch] text-[1.45rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.7rem] lg:text-[1.9rem]">
                  {feat.title}
                </h3>
                <p className="body-copy mt-4 max-w-md text-[14px] leading-relaxed text-ink/55 sm:text-[15px]">
                  {feat.body}
                </p>
              </motion.div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
