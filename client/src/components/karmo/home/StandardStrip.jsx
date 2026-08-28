"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home trust strip — six feature icons (cartoon v3: red + light-green,
 * character-led). Same set as the mattress features strip.
 */

const items = [
  {
    title: "A legacy of 60 years",
    note: "of healthy sleep",
    icon: "/karmo/images/trust/cartoon-v3/legacy-60.png?v=d44348",
  },
  {
    // Client Home-page tagline #2 — kept verbatim, split title/note the same
    // way "Natural and / Sustainable Products" is.
    title: "Largest Raw Material",
    note: "Stock",
    icon: "/karmo/images/trust/cartoon-v3/chem-stock.png?v=nobg",
  },
  {
    // Client Home-page tagline #3 — the exact wording ("Certification", not
    // "Certified"). Replaces the old "Recognised By / Super Brand" pillar.
    title: "International Quality",
    note: "Certification",
    icon: "/karmo/images/trust/cartoon-v3/chem-certified.png?v=nobg",
  },
  {
    title: "Natural and",
    note: "Sustainable Products",
    icon: "/karmo/images/trust/cartoon-v3/natural.png?v=d44348",
  },
  {
    title: "Free Delivery",
    note: "Available",
    icon: "/karmo/images/trust/cartoon-v3/delivery.png?v=d44348",
  },
  {
    title: "5k+ Stores",
    note: "Pan Bangladesh",
    icon: "/karmo/images/trust/cartoon-v3/stores.png?v=d44348",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative mb-1 bg-white md:mb-1.5">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12"
      >
        {items.map(({ title, note, icon }, i) => (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-3 xl:px-4 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === items.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="relative mx-auto flex h-[5.5rem] w-[5.5rem] items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-24 sm:w-24">
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-[5.5rem] w-[5.5rem] object-contain sm:h-24 sm:w-24"
              />
            </span>
            <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
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
