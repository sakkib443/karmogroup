"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { group, line as lineReveal, rise } from "@/components/karmo/motion";

/**
 * Home Two hero — same scene and copy as Home One's HeroTwo, but the box
 * fills the viewport under the fixed Home Two header (112px), with no
 * `43vw` cap. Live `/` keeps `karmo/home2/HeroTwo` unchanged.
 */

const badge = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

const SHOW_FOAM_BRAND_CLAIM = true;

const hero = {
  src: "/karmo/images/home-02/hero/karmo-family-white-outfits.webp",
  alt: "A family of three in white and yellow sitting together on a cream sofa whose tufted back spells KARMO, against a golden-yellow wall beside a red panel, with an olive tree and a round travertine coffee table",
};

const VIEW_H = "h-[calc(100svh-112px+5px)] min-h-[calc(100svh-112px+5px)]";

export default function HeroTwo() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-home-two-snap
      className={`relative w-full overflow-hidden bg-[#f4efe8] ${VIEW_H}`}
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_32%] sm:object-[74%_30%] lg:object-[80%_28%]"
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(8,8,10,0.58) 0%, rgba(8,8,10,0.50) 35%, rgba(8,8,10,0.42) 60%, rgba(8,8,10,0.38) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/18 to-transparent"
      />

      <div className="shell relative flex h-full items-center py-14 sm:py-16 lg:pb-20 lg:pt-10">
        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative max-w-[40rem] text-left sm:max-w-[42rem] lg:max-w-[44rem] lg:-translate-y-6"
        >
          {SHOW_FOAM_BRAND_CLAIM ? (
            <motion.div variants={rise}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 sm:text-[12px]">
                  Bangladesh&rsquo;s
                </span>
                <Image
                  src={badge.src}
                  alt=""
                  width={badge.width}
                  height={badge.height}
                  className="h-9 w-auto shrink-0 -translate-y-[10%] sm:h-10"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 sm:text-[12px]">
                  Foam Brand
                </span>
              </div>
              <span
                aria-hidden
                className="mt-5 block h-px w-12 bg-white/40 sm:mt-6 sm:w-14"
              />
            </motion.div>
          ) : null}

          <h1
            className={`display text-[clamp(1.6rem,4.3vw,3.4rem)] font-bold! uppercase leading-[1.02]! tracking-[-0.015em] text-white [text-shadow:0_2px_28px_rgba(10,6,2,0.35)] ${
              SHOW_FOAM_BRAND_CLAIM ? "mt-5 sm:mt-6" : "mt-0"
            }`}
          >
            {["We create the", "Chemistry of Comfort"].map((ln) => (
              <span key={ln} className="block overflow-hidden pb-[0.04em]">
                <motion.span variants={lineReveal} className="block">
                  {ln}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            className="mt-5 max-w-[22rem] text-[12.5px] font-medium leading-[1.65] tracking-[0.01em] text-white/78 sm:mt-6 sm:text-[13.5px]"
          >
            Foam, mattress and HomeTex — crafted in Bangladesh since 1965.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : rise.hidden}
            whileInView={rise.show}
            viewport={{ once: true }}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href="/products"
              className="btn-primary group inline-flex h-[50px] w-full items-center justify-center gap-2.5 bg-brand px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-12px_rgba(212,67,72,0.65)] transition-colors duration-300 hover:bg-brand-dark sm:h-[52px] sm:w-auto sm:justify-start sm:px-9 sm:text-[12px] sm:tracking-[0.12em]"
            >
              Shop the range
              <FiArrowRight className="text-[15px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/find-store"
              className="group inline-flex h-[50px] w-full items-center justify-center gap-2.5 border border-white/55 bg-white/5 px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-[2px] transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink sm:h-[52px] sm:w-auto sm:justify-start sm:px-8 sm:text-[12px] sm:tracking-[0.12em]"
            >
              <FiMapPin className="text-[15px]" />
              Find a store
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
