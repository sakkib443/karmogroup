"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import {
  IconHeritage,
  IconFoamStack,
  IconStockists,
  IconDelivery,
} from "@/components/karmo/icons/CartoonIcons";

import {
  group,
  rise as fade,
  VIEWPORT,
} from "@/components/karmo/motion";

/**
 * The Karmo Standard — trust pillars under the hero.
 *
 * Was originally a white card floated up over the hero bottom (`OVERLAP_HERO`).
 * Now sits as its own band below the hero. Flip `OVERLAP_HERO` to `true` to
 * restore the old floated look in one place.
 */

const OVERLAP_HERO = false;

const pillars = [
  {
    icon: IconHeritage,
    title: "60 Years Strong",
    note: "Manufacturing since 1965.",
  },
  {
    icon: IconFoamStack,
    title: "Market Leader in Foam",
    note: "Poured and tested in our plants.",
  },
  {
    icon: IconStockists,
    title: "Stockists Nationwide",
    note: "Dealers across the country.",
  },
  {
    icon: IconDelivery,
    title: "Safe Delivery",
    note: "Ships carefully across Bangladesh.",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (OVERLAP_HERO) {
    return <OverlapCard />;
  }

  return (
    <section className="border-b border-ink/8 bg-cream/60">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell py-8 md:py-10 lg:py-12"
      >
        {/* Header — centred title, story CTA under it */}
        <motion.div variants={fade} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand sm:gap-3 sm:text-[11px] sm:tracking-[0.3em]">
            <span className="h-px w-5 bg-brand sm:w-8" />
            The Karmo Standard
            <span className="h-px w-5 bg-brand sm:w-8" />
          </span>
          <h2 className="display mt-3 text-[1.45rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.6rem] lg:text-[1.85rem]">
            Trusted craft,{" "}
            <span className="font-bold text-brand">nationwide</span> reach
          </h2>

          <Link
            href="/about"
            className="group mt-4 inline-flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:rotate-45">
              <FiArrowUpRight className="text-[16px]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              Our story
            </span>
          </Link>
        </motion.div>

        <span
          aria-hidden
          className="mx-auto mt-6 block h-px w-full max-w-xs bg-ink/10 lg:mt-7"
        />

        {/* Four pillars — equal columns, compact icons + copy */}
        <motion.ul
          variants={group}
          className="mt-6 grid gap-7 sm:grid-cols-2 lg:mt-7 lg:grid-cols-4 lg:gap-0"
        >
          {pillars.map(({ icon: Icon, title, note }, i) => (
            <motion.li
              key={title}
              variants={fade}
              className={`group text-center lg:px-5 ${
                i === 0 ? "lg:pl-0" : ""
              } ${i === pillars.length - 1 ? "lg:pr-0" : ""} ${
                i > 0 ? "lg:border-l lg:border-ink/10" : ""
              }`}
            >
              {/* The tile no longer flips to solid red on hover. These icons
                  carry their own colour, so inverting the tile under them left
                  a red drawing on a red disc. It lifts and warms instead. */}
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/6 p-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand/12">
                <Icon />
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
      </motion.div>
    </section>
  );
}

/** Previous floated-over-hero card — kept for a one-flag revert. */
function OverlapCard() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="shell relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid gap-10 rounded-[4px] bg-white p-8 shadow-[0_35px_90px_-25px_rgba(20,20,20,0.22)] sm:p-10 lg:grid-cols-[minmax(0,16rem)_1px_1fr_auto] lg:items-center lg:gap-12 lg:p-14"
      >
        <motion.div variants={fade}>
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" />
            The Karmo Standard
          </span>
          <h2 className="display mt-5 text-[1.55rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.85rem]">
            Trusted craft,
            <br />
            <span className="font-bold text-brand">nationwide</span> reach
          </h2>
        </motion.div>

        <span
          aria-hidden
          className="hidden h-full w-px bg-ink/10 lg:block"
        />

        <motion.div
          variants={group}
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-10"
        >
          {pillars.map(({ icon: Icon, title, note }) => (
            <motion.div key={title} variants={fade} className="group">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/6 p-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand/12">
                <Icon />
              </span>
              <h3 className="display mt-5 text-[0.88rem] font-bold uppercase tracking-[0.08em] text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-ink/55">{note}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fade} className="lg:pl-6">
          <Link
            href="/about"
            className="group flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:rotate-45">
              <FiArrowUpRight className="text-2xl" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              Our story
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
