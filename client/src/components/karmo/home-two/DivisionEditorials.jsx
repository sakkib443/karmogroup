"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — third section. Screen-tall band: left copy (shell-aligned) +
 * right masonry that meets the viewport right edge with a light pad.
 *
 * On desktop, shots flex-fill the viewport height so the three columns stay
 * level (same top/bottom). `grow` weights keep the modern masonry rhythm.
 * Mobile keeps fixed aspect ratios and stacks normally.
 */

const ORANGE = "#FF9A1F";
/* Desktop band height — set as an inline style too so the masonry
   cannot miss a Tailwind rebuild / stale class. ~80px taller than the
   original calc(100svh-112px). */
const DESKTOP_H = "calc(100svh - 32px)";

const columns = [
  [
    {
      id: "foam-studio",
      href: "/mattress",
      src: "/karmo/images/home-02/divisions/mattress-karmo-magnific-SyOgGVtUb8.jpg",
      alt: "A Karmo floral quilted mattress on a channel-tufted taupe bed, styled with green and ochre cushions between potted plants",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "foam-lavender",
      href: "/hometex",
      src: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
      alt: "Karmo HomeTex bedding set with pillows and comforter",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
  [
    {
      id: "mattress-bedroom",
      href: "/foam",
      src: "/karmo/images/home-02/divisions/foam-karmo-sofa-blocks-studio.png",
      alt: "A Karmo Foam sofa with lavender cushions and stacked foam blocks in a studio setting",
      ratio: "aspect-[12/11]",
      grow: "md:flex-[11]",
    },
    {
      id: "mattress-grey",
      href: "/mattress",
      src: "/karmo/images/home-02/divisions/mattress-karmo-magnific-huuqthnvqL.jpg",
      alt: "A Karmo Magnific mattress in a bedroom setting",
      ratio: "aspect-[3/5]",
      grow: "md:flex-[20]",
    },
  ],
  [
    {
      id: "foam-campaign",
      href: "/foam",
      src: "/karmo/images/home-02/divisions/scandinavian-interior.jpg",
      alt: "A Scandinavian-style interior living space",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "mattress-floral",
      href: "/chemicals",
      src: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
      alt: "Karmo adhesive tins from the chemicals division",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
];

function Shot({ shot }) {
  if (shot.placeholder) {
    return (
      <div
        aria-hidden
        className={`relative block w-full min-h-0 border border-[#d0d0d0] bg-gray-100 ${shot.ratio} md:aspect-auto md:flex-1 ${shot.grow}`}
      />
    );
  }

  return (
    <Link
      href={shot.href}
      className={`group relative block w-full min-h-0 overflow-hidden border border-[#d0d0d0] ${shot.ratio} md:aspect-auto md:flex-1 ${shot.grow}`}
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
        className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-50"
      />
      <span
        aria-hidden
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-shade-deep/80 text-white transition-colors duration-300 group-hover:border-brand group-hover:bg-brand sm:h-10 sm:w-10"
      >
        <FiArrowUpRight />
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
      className="division-editorials overflow-x-clip bg-white py-14 lg:mt-4 lg:overflow-visible lg:py-0"
      style={{
        // Inline so desktop height always applies even if a utility class is stale.
        ["--division-h"]: DESKTOP_H,
      }}
    >
      {/*
        Left aligns with .shell; right meets the screen edge with a light pad.
        Height locks to the viewport under the header on lg+.
      */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid items-center gap-10 px-6 md:px-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.65fr)] lg:h-full lg:min-h-0 lg:items-stretch lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1760px)/2+4rem))] lg:pr-3 xl:gap-10 xl:pr-4"
      >
        <motion.div
          variants={fade}
          className="min-w-0 max-w-md self-center text-right lg:max-w-[28rem]"
        >
          <p className="flex flex-wrap items-baseline justify-end gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              60+ Years
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              Since 1965
            </span>
          </p>

          <h2 className="display mt-3 text-[1.75rem] font-extrabold! uppercase leading-[1.02]! tracking-[-0.015em] text-ink sm:text-[2rem] lg:text-[2.35rem]">
            <span className="block whitespace-nowrap">Iconic brands.</span>
            <span className="block whitespace-nowrap text-brand">
              Lasting craft.
            </span>
          </h2>

          <span className="mt-4 flex items-center justify-end gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              Crafted to last
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
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

          <Link
            href="/foam"
            className="group mt-8 inline-flex items-center justify-end gap-3"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              Explore foam
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        <div className="grid min-h-0 w-full min-w-0 grid-cols-2 gap-0 md:grid-cols-3 lg:h-full">
          {columns.map((col, i) => (
            <div
              key={`div-col-${i}`}
              className="flex min-h-0 flex-col gap-0 lg:h-full"
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
