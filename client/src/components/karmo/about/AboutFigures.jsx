"use client";

import { motion, useReducedMotion } from "framer-motion";

import { aboutFigures } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Four figures under the banner, in the slot the foam page gives its trust
 * strip. Numbers rather than icons: on an about page the figure *is* the claim,
 * and every one of these four is in the company profile.
 */
export default function AboutFigures() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-white py-10 lg:py-12">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-6"
      >
        {aboutFigures.map((item) => (
          <motion.li
            key={item.id}
            variants={fade}
            className="flex flex-col items-center text-center"
          >
            <span className="display text-[2rem] font-bold leading-none tabular-nums tracking-[-0.01em] text-brand lg:text-[2.4rem]">
              {item.figure}
            </span>
            <span aria-hidden className="mt-3 block h-px w-10 bg-ink/15" />
            <p className="display mt-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
              {item.title}
            </p>
            <p className="body-copy mt-2 max-w-[16rem] text-[13px] leading-[1.7] text-ink/50">
              {item.note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
