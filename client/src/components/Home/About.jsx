"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Figures below are drawn from Karmo's own site map and founding year — the
 * only numbers I could verify. Confirm them (and supply a real dealer count)
 * before this goes live; published company claims should not be guesses.
 */
const stats = [
  { value: "60+", label: "Years of manufacturing" },
  { value: "4", label: "Divisions under one group" },
  { value: "50+", label: "Products across the range" },
  { value: "1965", label: "Making comfort since" },
];

// Same two curves the hero uses, so the page keeps one movement vocabulary.
const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

// Lines are uncovered from behind their own edge rather than faded in.
const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

export default function About() {
  const reduceMotion = useReducedMotion();

  // With motion turned down the content is simply present — no travel, no
  // curtain, nothing that could be missed while it animates.
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.25 };

  return (
    <section className="bg-linen">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          {/* A panel slides off the frame while the photograph eases out of an
              over-scale, so the image is uncovered instead of appearing. */}
          <motion.div
            {...reveal}
            viewport={once}
            className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto lg:min-h-[440px]"
          >
            <motion.div
              variants={{
                hidden: { scale: 1.18 },
                show: { scale: 1, transition: { duration: 1.5, ease: SWEEP } },
              }}
              className="absolute inset-0"
            >
              <Image
                src="/image10.jpg"
                alt="Bedroom with a slatted timber wall, upholstered bed and forest view"
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover"
              />
            </motion.div>

            <motion.span
              aria-hidden="true"
              variants={{
                hidden: { x: "0%" },
                show: { x: "101%", transition: { duration: 1.15, ease: SWEEP } },
              }}
              className="absolute inset-0 z-10 bg-linen"
            />
          </motion.div>

          <motion.div variants={group} {...reveal} viewport={once}>
            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="block text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55"
              >
                About us
              </motion.span>
            </span>

            <h2 className="display mt-6 text-[2rem] font-light uppercase leading-[1.12] tracking-[-0.01em] text-ink sm:text-[2.6rem] lg:text-[3rem]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  Six decades of
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  making Bangladesh
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  comfortable
                </motion.span>
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={group}
            {...reveal}
            viewport={once}
            className="flex flex-col justify-start"
          >
            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="block max-w-md text-[15px] leading-[2] text-ink/70"
              >
                Karmo has been manufacturing in Bangladesh since 1965 — foam for
                furniture, footwear and automotive use, mattresses built for
                every kind of sleep, HomeTex bedding, and the adhesives and
                polymers that industry runs on. Four divisions, one standard of
                comfort.
              </motion.span>
            </span>

            <span className="mt-10 block overflow-hidden border-t border-ink/15 pt-6">
              <motion.span variants={line} className="block">
                <span className="block text-sm font-semibold text-ink">
                  Karmo Group
                </span>
                <span className="mt-1 block text-[13px] text-ink/55">
                  Motijheel, Dhaka
                </span>
              </motion.span>
            </span>
          </motion.div>
        </div>

        {/* Figures */}
        <motion.dl
          variants={group}
          {...reveal}
          viewport={once}
          className="mt-16 grid grid-cols-2 gap-y-10 border-t border-ink/15 pt-12 sm:gap-8 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="overflow-hidden">
                <motion.span
                  variants={line}
                  className="display block text-[2.25rem] font-light leading-none text-ink lg:text-[2.75rem]"
                >
                  {stat.value}
                </motion.span>
              </dt>
              <dd className="mt-3 overflow-hidden">
                <motion.span
                  variants={line}
                  className="block text-[13px] text-ink/60"
                >
                  {stat.label}
                </motion.span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
