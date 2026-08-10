"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiCalendar, FiDroplet, FiTruck, FiShield } from "react-icons/fi";

import { foamFeatures } from "@/components/karmo/foam/foamData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const icons = {
  years: FiCalendar,
  pure: FiDroplet,
  delivery: FiTruck,
  quality: FiShield,
};

/**
 * Quiet trust strip under the banner — four claims in Home 02 type, not a
 * foreign icon carousel.
 */
export default function FoamFeatures() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-white py-10 lg:py-12">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6"
      >
        {foamFeatures.map((item) => {
          const Icon = icons[item.id] ?? FiShield;
          return (
            <motion.li
              key={item.id}
              variants={fade}
              className="flex flex-col items-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-ink/12 text-ink">
                <Icon className="text-[22px]" strokeWidth={1.6} />
              </span>
              <p className="display mt-4 text-[13px] font-bold uppercase tracking-[0.1em] text-ink">
                {item.title}
              </p>
              <p className="body-copy mt-1.5 text-[13px] text-ink/50">{item.note}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
