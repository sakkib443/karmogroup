"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Trust strip — built to match the homepage `StandardStrip`: illustrated badge
 * images (not boxed line-icons), an 88px icon, hover lift, `border-l` dividers
 * and the 6px seam below. Four claims per division.
 *
 * Each item carries its own `icon` (an image path) so the strip is entirely
 * data-driven; the layout and type stay here, shared across all four pages.
 */
export default function DivisionFeatures({ items = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="mb-1 bg-[#F8F8F9] md:mb-1.5">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-4 md:gap-7 md:px-10 md:py-10 lg:gap-0 lg:px-16 lg:py-12"
      >
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            variants={fade}
            className={`group text-center lg:px-4 xl:px-6 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === items.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="mx-auto flex h-20 w-20 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem]">
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
              />
            </span>
            <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {item.title}
            </h3>
            <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
              {item.note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
