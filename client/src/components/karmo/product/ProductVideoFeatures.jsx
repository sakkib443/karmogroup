"use client";

import { motion, useReducedMotion } from "framer-motion";

import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Alternating video + copy bands — the four feature blocks from
 * product-page.html, restyled to Home 02.
 */
export default function ProductVideoFeatures({ features = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!features.length) return null;

  return (
    <section className="border-t border-ink/8 bg-cream/40 py-8 md:py-10 lg:py-12">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell mb-12 text-center lg:mb-16"
      >
        <motion.div variants={fade}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Inside the product
          </span>
          <h2 className="display mt-3 text-[1.65rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.1rem]">
            Why this{" "}
            <span className="font-bold text-brand">feels different</span>
          </h2>
          <LeafRule />
        </motion.div>
      </motion.div>

      <div className="shell space-y-12 lg:space-y-16">
        {features.map((feat) => (
          <motion.article
            key={feat.title}
            variants={fade}
            {...reveal}
            viewport={VIEWPORT}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              feat.reverse ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-video overflow-hidden bg-ink">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={feat.video} type="video/mp4" />
              </video>
            </div>
            <div className={feat.reverse ? "lg:order-1" : ""}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">
                Feature
              </span>
              <h3 className="display mt-3 text-[1.35rem] font-bold uppercase leading-[1.15] tracking-[0.02em] text-ink lg:text-[1.55rem]">
                {feat.title}
              </h3>
              <p className="body-copy mt-4 max-w-md text-[15px] leading-[1.85] text-ink/60">
                {feat.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
