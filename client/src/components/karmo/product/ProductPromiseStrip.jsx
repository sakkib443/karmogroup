"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiAward, FiCreditCard, FiShield, FiTruck } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Converts the old `fq0.PNG` promise banner into real Home 02 markup —
 * four clear service claims under the buy box.
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
    <section className="border-b border-ink/8 bg-white">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {promises.map((item) => (
          <motion.li
            key={item.title}
            variants={fade}
            className="flex items-start gap-3.5 bg-white px-5 py-7 lg:px-6 lg:py-8"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand">
              <item.icon className="text-[18px]" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block text-[13px] font-bold uppercase tracking-[0.06em] text-ink">
                {item.title}
              </span>
              <span className="mt-1.5 block text-[12px] leading-snug text-ink/50">
                {item.note}
              </span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
