"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Our Divisions — four square catalogue tiles in one row.
 * No caption under the image. On hover: soft wash + inset white frame +
 * centred division name (furniture-catalogue pattern).
 */

const divisions = [
  {
    name: "Foam",
    href: "/foam",
    image: "/karmo/images/home-02/divisions/foam-catalog-v4.jpg",
    alt: "Angled side view of a Karmo Foam sofa",
  },
  {
    name: "Mattress",
    href: "/mattress",
    image: "/karmo/images/home-02/divisions/mattress-catalog-v4.jpg",
    alt: "Angled close-up of a Karmo mattress and headboard",
  },
  {
    name: "HomeTex",
    href: "/hometex",
    image: "/karmo/images/home-02/divisions/hometex-catalog-v4.jpg",
    alt: "Angled view of Karmo HomeTex bedding layers",
  },
  {
    name: "Chemicals",
    href: "/chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-catalog-v6.jpg",
    alt: "Karmo Chemicals adhesive tins in a professional studio",
  },
];

function DivisionCard({ division }) {
  return (
    <motion.div variants={fade} className="min-w-0">
      <Link
        href={division.href}
        className="group relative block aspect-square overflow-hidden bg-[#e8e8e8]"
      >
        <Image
          src={division.image}
          alt={division.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* Hover: dim wash + inset white frame + centred name */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[12%] border border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[14%] lg:inset-[15%]"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="display translate-y-1 text-[15px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[16px] lg:text-[18px]">
            {division.name}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function DivisionsStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative overflow-hidden bg-white py-8 md:py-10">
      {/* Same mattress damask as Iconic brands — readable pattern, no blur */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic-karmo-pattern.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.38]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/50" />
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] px-4 text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Our Divisions
          </span>
          <h2 className="display mt-1 text-[1.25rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink sm:text-[1.4rem] lg:text-[1.55rem]">
            One group, <span className="font-bold text-brand">four crafts</span>
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mt-3 grid grid-cols-2 gap-[2px] px-0 md:mt-3.5 md:grid-cols-4 md:gap-1"
      >
        {divisions.map((division) => (
          <DivisionCard key={division.name} division={division} />
        ))}
      </motion.div>
    </section>
  );
}
