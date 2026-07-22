"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";

const points = [
  "In-house manufacturing",
  "Density-tested foam",
  "Four product divisions",
  "Nationwide dealers",
];

// Same curves the hero and About use, so the page keeps one movement
// vocabulary rather than three competing ones.
const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SETTLE } },
};

export default function WhyKarmo() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.25 };

  return (
    <section className="relative overflow-hidden bg-shade-deep py-20 md:py-28">
      {/* Layers, back to front: photograph → wash → wordmark → copy. The
          photograph is dropped right back so it reads as texture, and the
          wash is heaviest on the left where the headline sits, easing off to
          the right so the picture still shows through beside the card. */}
      <Image
        src="/SLIDE03.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-shade-deep via-shade-deep/92 to-shade-deep/70" />

      {/* Oversized wordmark sitting just above the background — enough to give
          the panel some depth, far too faint to compete with the copy. */}
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[26vw] font-extrabold leading-none tracking-tighter text-white/[0.035]"
      >
        KARMO
      </span>

      <div className="shell relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={group} {...reveal} viewport={once}>
          <motion.span
            variants={fade}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Started in 1965
          </motion.span>

          <h2 className="display mt-7 text-[2.1rem] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                Where comfort begins,
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                And <span className="text-brand">quality lives on</span>
              </motion.span>
            </span>
          </h2>

          <motion.ul
            variants={group}
            className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2"
          >
            {points.map((point) => (
              <motion.li
                key={point}
                variants={fade}
                className="flex items-center gap-3 text-sm font-semibold text-white"
              >
                <FiCheck className="shrink-0 text-base text-brand" />
                {point}
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            variants={fade}
            className="mt-9 max-w-md text-[15px] leading-[1.9] text-white/65"
          >
            Whether it is a single mattress or a factory order, everything
            carries the same standard — foam poured, cut and tested in our own
            plants, then finished into the products Bangladeshi homes have
            trusted for six decades.
          </motion.p>

          <motion.div variants={fade}>
            <Link
              href="/about"
              className="btn-secondary group mt-10 inline-flex items-center gap-4 rounded-full border border-white/25 py-2 pl-7 pr-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
            >
              More about us
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand transition-transform duration-300 group-hover:rotate-45">
                <FiArrowUpRight className="text-lg" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Curtain slides off while the photograph eases out of an over-scale,
            matching the reveal used in the About section. */}
        <motion.div
          {...reveal}
          viewport={once}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl"
        >
          <motion.div
            variants={{
              hidden: { scale: 1.16 },
              show: { scale: 1, transition: { duration: 1.5, ease: SWEEP } },
            }}
            className="absolute inset-0"
          >
            <Image
              src="/SLIDE02.png"
              alt="Living room furnished with deep buttoned leather sofas"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.span
            aria-hidden="true"
            variants={{
              hidden: { x: "0%" },
              show: { x: "101%", transition: { duration: 1.15, ease: SWEEP } },
            }}
            className="absolute inset-0 z-10 bg-shade-deep"
          />
        </motion.div>
      </div>
    </section>
  );
}
