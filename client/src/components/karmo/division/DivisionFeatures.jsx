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
/* Six pillars sit in one row on desktop like the homepage strip; four stay at
   four across. Written out rather than interpolated so Tailwind keeps the
   classes at build time. */
const COLUMNS = {
  6: "md:grid-cols-3 lg:grid-cols-6",
  5: "md:grid-cols-3 lg:grid-cols-5",
  4: "md:grid-cols-4",
  3: "md:grid-cols-3",
};

/* Frame padding differs per PNG — nudge sizes so the strip reads even. */
const SMALLER_ICON_IDS = new Set(["legacy", "trusted"]);
const LARGER_ICON_IDS = new Set(["recognised", "natural"]);

export default function DivisionFeatures({ items = [] }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const columns = COLUMNS[items.length] ?? "md:grid-cols-4";

  return (
    <section className="mb-1 bg-white md:mb-1.5">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid w-full grid-cols-2 gap-5 px-6 py-8 md:gap-7 md:px-10 md:py-10 lg:gap-0 lg:px-16 lg:py-12 ${columns}`}
      >
        {items.map((item, i) => {
          const smaller = SMALLER_ICON_IDS.has(item.id);
          const larger = LARGER_ICON_IDS.has(item.id);
          const iconClass = smaller
            ? "h-[78px] w-[78px] object-contain sm:h-[86px] sm:w-[86px]"
            : larger
              ? "h-[82px] w-[82px] object-contain sm:h-[92px] sm:w-[92px]"
              : "h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]";
          const iconPx = smaller ? 86 : larger ? 92 : 88;

          return (
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
                  width={iconPx}
                  height={iconPx}
                  loading="lazy"
                  decoding="async"
                  className={iconClass}
                />
              </span>
              <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
                {item.title}
              </h3>
              <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
                {item.note}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
