"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — three-image explore gallery.
 *
 * Top: two equal full-height panels (copy left / right).
 * Bottom: one full-width full-height flagship band.
 * White gutters between all three, matching the reference grid.
 */

const GAP = "gap-1 md:gap-1.5";
/* Same desktop height as DivisionEditorials (Iconic brands band). */
const BAND_H = "calc(100svh - 32px)";
const VIEW_H = "h-[calc(100svh-32px)] min-h-[calc(100svh-32px)]";

const panels = [
  {
    id: "mattress",
    href: "/mattress",
    src: "/karmo/images/home-02/banners/magnific-100-100-6AAcgpAiJO.png",
    alt: "A Karmo Magnific mattress lifestyle scene",
    line1: "Mattress made",
    line2: "for deep rest",
    align: "right",
    // Keep the left of the frame; crop excess on the right.
    position: "object-left",
  },
  {
    id: "hometex",
    href: "/hometex",
    src: "/karmo/images/foam/banner-yellow-room-v1.png",
    alt: "Karmo HomeTex comfort for the home",
    line1: "HomeTex for",
    line2: "every room",
    align: "right",
    position: "object-center",
  },
];

function Panel({ panel }) {
  const isRight = panel.align === "right";

  return (
    <Link
      href={panel.href}
      className="group relative block h-full min-h-0 overflow-hidden"
    >
      <Image
        src={panel.src}
        alt={panel.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className={`object-cover ${panel.position || "object-center"} transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]`}
      />
      {/* Even wash — same strength everywhere (no directional gradient). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-shade-deep/35"
      />
      <div
        className={`relative z-[1] flex h-full flex-col justify-start pt-28 sm:pt-32 lg:pt-40 xl:pt-44 p-7 sm:p-9 lg:p-11 xl:p-12 ${
          isRight
            ? "items-end pr-10 text-right sm:pr-14 lg:pr-16 xl:pr-20"
            : "items-start text-left"
        }`}
      >
        <h2 className="display text-[1.45rem] font-bold uppercase leading-[1.2] tracking-[0.02em] text-white sm:text-[1.65rem] lg:text-[1.85rem] xl:text-[2rem]">
          <span className="block whitespace-nowrap">{panel.line1}</span>
          <span className="block whitespace-nowrap">{panel.line2}</span>
        </h2>
        <span className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/55 underline-offset-[6px] transition-colors duration-300 group-hover:decoration-white sm:mt-5 sm:text-[13px]">
          Explore Now
        </span>
      </div>
    </Link>
  );
}

export default function ExploreSplit() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section data-home-two-snap className={`bg-white mt-1 md:mt-1.5`}>
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid bg-white ${GAP}`}
        style={{ ["--explore-band-h"]: BAND_H }}
      >
        {/* Top row — two equal panels with a light white gutter between them */}
        <div
          className={`explore-band grid grid-cols-1 grid-rows-2 bg-white md:grid-cols-2 md:grid-rows-1 ${GAP} ${VIEW_H}`}
        >
          {panels.map((panel) => (
            <motion.div key={panel.id} variants={fade} className="min-h-0 min-w-0 h-full">
              <Panel panel={panel} />
            </motion.div>
          ))}
        </div>

        {/* Bottom — full-width flagship, same height as the row above */}
        <motion.div
          variants={fade}
          className={`explore-band relative overflow-hidden bg-[#d8d8d8] ${VIEW_H}`}
        >
          <Image
            src="/karmo/images/home-02/banners/magnific-3zzTfKCREY.png"
            alt="A Karmo Magnific lifestyle scene"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-shade-deep/25 via-shade-deep/20 to-shade-deep/45"
          />

          <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1600px] items-center justify-end px-6 md:px-14 lg:pr-16 xl:pr-20">
            <div className="text-right">
              <h2 className="display text-[1.75rem] font-bold uppercase leading-[1.15] tracking-[0.02em] text-white sm:text-[2.1rem] lg:text-[2.35rem]">
                <span className="block whitespace-nowrap">Foam crafted</span>
                <span className="block whitespace-nowrap">for comfort</span>
              </h2>
              <Link
                href="/foam"
                className="mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/55 underline-offset-[6px] transition-colors duration-300 hover:decoration-white sm:mt-6 sm:text-[13px]"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
