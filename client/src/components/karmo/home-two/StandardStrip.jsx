"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FiAward,
  FiCalendar,
  FiHeart,
  FiMapPin,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two trust strip — six pillars in one full row (client ref count),
 * same circular-icon treatment as before.
 */
const pillars = [
  {
    icon: FiCalendar,
    title: "A legacy of 60 years",
    note: "of healthy sleep",
  },
  {
    icon: FiHeart,
    title: "Trusted By Million",
    note: "families worldwide.",
  },
  {
    icon: FiAward,
    title: "Recognised By",
    note: "Super Brand",
  },
  {
    icon: FiMapPin,
    title: "5k+ Stores",
    note: "Pan Bangladesh",
  },
  {
    icon: FiShield,
    title: "Natural and",
    note: "Sustainable Products",
  },
  {
    icon: FiTruck,
    title: "Free Delivery",
    note: "Available",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-cream/60">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell-home-two grid w-full grid-cols-2 gap-5 py-8 md:grid-cols-3 md:gap-7 md:py-10 lg:grid-cols-6 lg:gap-0 lg:py-12"
      >
        {pillars.map(({ icon: Icon, title, note }, i) => (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-3 xl:px-4 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === pillars.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/8 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white sm:h-[4.5rem] sm:w-[4.5rem]">
              <Icon className="text-[30px] sm:text-[34px]" strokeWidth={1.6} />
            </span>
            <h3 className="display mt-4 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {title}
            </h3>
            <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
              {note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
