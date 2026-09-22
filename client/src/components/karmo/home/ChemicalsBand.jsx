"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Chemicals band — sits under Iconic brands (DivisionEditorials).
 * Full-bleed warehouse photo fills the viewport under the 112px header;
 * the dark claim panel sits on the left; the warehouse photo fills the right.
 * Claim icons match the homepage StandardStrip cartoon-v3 style.
 */

const DESKTOP_H = "calc(100svh - 112px)";

const claims = [
  {
    id: "stock",
    title: "Largest raw material stock",
    icon: "/karmo/images/trust/cartoon-v3/chem-stock-v2.webp",
  },
  {
    id: "quality",
    title: "International quality certified",
    icon: "/karmo/images/trust/cartoon-v3/chem-certified-v2.webp",
  },
  {
    id: "poly",
    title: "Specialized polyurethanes & polymers",
    icon: "/karmo/images/trust/cartoon-v3/chem-polymer-v2.webp",
  },
];

export default function ChemicalsBand() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="chemicals-band relative overflow-hidden bg-[#0B1A33]"
      style={{ ["--chemicals-h"]: DESKTOP_H }}
      aria-label="Karmo Chemicals"
    >
      <Image
        src="/karmo/images/home-02/hero/home-hero-slide-chemicals-hero-hq.jpg"
        alt="Organized Karmo chemicals warehouse with blue industrial drums"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-black/10"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative grid min-h-[min(72svh,620px)] lg:h-full lg:min-h-0 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]"
      >
        <motion.aside
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="relative order-2 flex flex-col items-center justify-center px-7 py-10 text-center text-white sm:px-9 lg:order-1 lg:px-10 lg:py-12"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-black/72 lg:bg-black/68"
          />
          <span className="relative text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Karmo Chemicals
          </span>
          <h2 className="relative display section-heading mt-3 uppercase text-white">
            <span className="block font-semibold! text-white/90">The world of</span>
            <span className="block text-white">polyurethane</span>
          </h2>

          <ul className="relative mt-8 grid w-full grid-cols-3 gap-x-1 gap-y-3 sm:mt-9 sm:gap-x-1.5">
            {claims.map((claim) => (
              <li key={claim.id} className="group flex flex-col items-center text-center">
                <span className="relative mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[4.75rem] sm:w-[4.75rem]">
                  <img
                    src={claim.icon}
                    alt=""
                    aria-hidden="true"
                    width={76}
                    height={76}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="mt-2 text-[10px] font-semibold uppercase leading-[1.35] tracking-[0.04em] text-white/85 sm:text-[11px]">
                  {claim.title}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/chemicals"
            className="relative mt-10 inline-flex w-full max-w-sm items-center justify-center rounded-md bg-brand px-6 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark sm:mt-12 sm:py-[1.15rem] sm:text-[14px]"
          >
            Explore Chemicals
          </Link>
        </motion.aside>

        <div
          className="relative order-1 min-h-[min(36svh,300px)] lg:order-2 lg:min-h-0"
          aria-hidden
        />
      </motion.div>
    </section>
  );
}
