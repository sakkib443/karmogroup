"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiCalendar, FiLayers, FiMapPin, FiTruck } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The trust pillars under the hero — Home Two's cut.
 *
 * Home One puts a full section header above these four: the "The Karmo
 * Standard" eyebrow between two rules, a "Trusted craft, nationwide reach"
 * headline, and an "Our story" call to action, with a hairline separating that
 * block from the pillars. All of it is gone here at the client's ask; the row
 * is the four pillars and nothing else.
 *
 * It reads better this high on the page for it. The hero directly above already
 * carries a headline and two buttons, so the header underneath it was a second
 * headline and a third button within one screen of the first — and the pillars
 * are meant to be scanned on the way down rather than read as a titled section.
 *
 * `OVERLAP_HERO` and the floated white card behind it are not carried over.
 * That flag exists in Home One's copy to restore a card that overlapped the
 * hero, and the layout it restores is built around the header this design does
 * not have.
 */
const pillars = [
  {
    icon: FiCalendar,
    title: "60 Years Strong",
    note: "Manufacturing since 1965.",
  },
  {
    icon: FiLayers,
    title: "Market Leader in Foam",
    note: "Poured and tested in our plants.",
  },
  {
    icon: FiMapPin,
    title: "Stockists Nationwide",
    note: "Dealers across the country.",
  },
  {
    icon: FiTruck,
    title: "Safe Delivery",
    note: "Ships carefully across Bangladesh.",
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
        className="shell grid gap-7 py-8 sm:grid-cols-2 md:py-10 lg:grid-cols-4 lg:gap-0 lg:py-12"
      >
        {pillars.map(({ icon: Icon, title, note }, i) => (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-5 ${i === 0 ? "lg:pl-0" : ""} ${
              i === pillars.length - 1 ? "lg:pr-0" : ""
            } ${i > 0 ? "lg:border-l lg:border-ink/10" : ""}`}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/8 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
              <Icon className="text-[26px]" strokeWidth={1.6} />
            </span>
            <h3 className="display mt-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-ink">
              {title}
            </h3>
            <p className="mx-auto mt-1.5 max-w-[14rem] text-[12.5px] leading-[1.55] text-ink/55">
              {note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
