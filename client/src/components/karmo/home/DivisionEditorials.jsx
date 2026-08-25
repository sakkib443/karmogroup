"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — third section. Screen-tall band: left copy (shell-aligned) +
 * right masonry. Soft mattress damask texture behind the whole band.
 */

const ORANGE = "#FF9A1F";
const GAP = "gap-1 md:gap-1.5";
const DESKTOP_H = "calc(100svh - 32px)";

const columns = [
  [
    {
      id: "foam-studio",
      href: "/mattress",
      label: "Mattress",
      src: "/karmo/images/mattress/products/orthopedic-room.jpg",
      alt: "Karmo Orthopedic Mattress in a rustic brick bedroom with garden light",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "foam-lavender",
      href: "/hometex",
      label: "HomeTex",
      src: "/karmo/images/home-02/divisions/editorial-v2/hometex-bedding.jpg",
      alt: "Karmo HomeTex bedding set with pillows and comforter",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
  [
    {
      id: "mattress-bedroom",
      href: "/foam",
      label: "Foam",
      src: "/karmo/images/home-02/divisions/editorial-v2/foam-sofa.jpg",
      alt: "A Karmo Foam sofa with lavender cushions in a cozy living room",
      ratio: "aspect-[12/11]",
      grow: "md:flex-[11]",
    },
    {
      id: "mattress-grey",
      href: "/mattress",
      label: "Mattress",
      src: "/karmo/images/home-02/divisions/editorial-v2/sleep-portrait.jpg",
      alt: "A woman resting peacefully on a Karmo mattress",
      ratio: "aspect-[3/5]",
      grow: "md:flex-[20]",
    },
  ],
  [
    {
      id: "foam-campaign",
      href: "/foam",
      label: "Foam",
      src: "/karmo/images/home-02/divisions/editorial-v2/living-scandi.jpg",
      alt: "A modern living room with a plush foam sofa",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "mattress-floral",
      href: "/chemicals",
      label: "Chemicals",
      src: "/karmo/images/home-02/divisions/editorial-v2/chemicals-tins.jpg",
      alt: "Karmo adhesive tins from the chemicals division",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
];

function Shot({ shot }) {
  return (
    <Link
      href={shot.href}
      className={`group relative block w-full min-h-0 overflow-hidden ${shot.ratio} md:aspect-auto md:flex-1 ${shot.grow}`}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 42vw"
        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[10%] border-2 border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[12%] lg:inset-[13%]"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="display translate-y-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[14px] lg:text-[15px]">
          {shot.label}
        </span>
      </span>
    </Link>
  );
}

export default function DivisionEditorials() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      data-home-two-snap
      className="division-editorials relative overflow-x-clip py-14 lg:mt-0 lg:overflow-visible lg:py-0"
      style={{
        ["--division-h"]: DESKTOP_H,
      }}
    >
      {/* Soft mattress damask — readable pattern, no blur */}
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
        className="relative z-[1] grid items-center gap-8 px-6 md:px-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.65fr)] lg:h-full lg:min-h-0 lg:items-stretch lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))] lg:pr-0 xl:gap-10"
      >
        <motion.div
          variants={fade}
          className="min-w-0 max-w-md self-center text-left lg:max-w-[28rem]"
        >
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              60+ Years
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              Since 1965
            </span>
          </p>

          <h2 className="display mt-3 text-[1.75rem] font-extrabold! uppercase leading-[1.02]! tracking-[-0.015em] text-ink sm:text-[2rem] lg:text-[2.35rem]">
            <span className="block sm:whitespace-nowrap">Iconic brands.</span>
            <span className="block text-brand sm:whitespace-nowrap">
              Lasting craft.
            </span>
          </h2>

          <span className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              Crafted to last
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden
            >
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill={ORANGE}
              />
              <path
                d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                stroke="#B4651A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <p className="body-copy mt-5 text-[16px] leading-[1.7] text-ink/55 lg:text-[17px]">
            Karmo Foam delivers high-density resilience and lasting body
            support — pure rubber grade, no fillers, firm air flow that holds
            for years.
          </p>

          <Link href="/foam" className="group mt-8 inline-flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              Explore foam
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        <div
          className={`grid min-h-0 w-full min-w-0 grid-cols-2 md:grid-cols-3 lg:h-full ${GAP}`}
        >
          {columns.map((col, i) => (
            <div
              key={`div-col-${i}`}
              className={
                i === columns.length - 1
                  ? `col-span-2 grid min-h-0 grid-cols-2 ${GAP} md:col-span-1 md:flex md:flex-col lg:h-full`
                  : `flex min-h-0 flex-col lg:h-full ${GAP}`
              }
            >
              {col.map((shot) => (
                <Shot key={shot.id} shot={shot} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
