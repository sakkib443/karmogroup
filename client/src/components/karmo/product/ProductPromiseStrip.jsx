"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiAward, FiCreditCard, FiShield, FiTruck } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Four service claims under the buy box — presented in the homepage
 * `StandardStrip` / `MattressFeatures` language: a centred icon in an 88px
 * hover-scale badge area, a bold uppercase title and a note, with `border-l`
 * dividers between columns. (No illustrated badge art exists for EMI / trial /
 * warranty, so the line icons are used, sized up and brand-coloured to sit in
 * the same badge slot.)
 */
const promises = [
  {
    icon: FiCreditCard,
    title: "No Cost EMI",
    note: "Flexible monthly plans on eligible orders",
  },
  {
    icon: FiAward,
    title: "30 Nights Free Trial",
    note: "Sleep on it — return within 30 nights if it is not right",
  },
  {
    icon: FiTruck,
    title: "Free Delivery",
    note: "Doorstep delivery across Bangladesh on this range",
  },
  {
    icon: FiShield,
    title: "Up to 20 Years Warranty",
    note: "Covered for long-term durability and manufacturing defects",
  },
];

export default function ProductPromiseStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-y border-ink/8 bg-white">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-4 md:gap-7 md:px-10 md:py-10 lg:gap-0 lg:px-16 lg:py-12"
      >
        {promises.map((item, i) => (
          <motion.li
            key={item.title}
            variants={fade}
            className={`group text-center lg:px-4 xl:px-6 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === promises.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="mx-auto flex h-20 w-20 items-center justify-center text-brand transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem]">
              <item.icon className="text-[40px]" strokeWidth={1.5} />
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
