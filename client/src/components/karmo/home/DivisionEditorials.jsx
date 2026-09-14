"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — third section. Screen-tall band: left tagline (shell-aligned) +
 * right masonry. Soft mattress damask texture behind the whole band.
 */

const GAP = "gap-1 md:gap-1.5";
const DESKTOP_H = "calc(100svh - 32px)";

const columns = [
  [
    {
      id: "foam-studio",
      href: "/mattress",
      label: "Mattress",
      src: "/karmo/images/home-02/divisions/editorial-v2/mattress-press-pro-fill-hq.jpg",
      alt: "Hand pressing a quilted Karmo mattress on a bright bed",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
      position: "object-[center_62%]",
      zoom: true,
    },
    {
      id: "foam-lavender",
      href: "/hometex",
      label: "HomeTex",
      src: "/karmo/images/home-02/divisions/editorial-v2/hometex-pillows-sideboard-hq.jpg",
      alt: "White pillows and down feathers styled on a cane sideboard",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
      position: "object-[72%_center]",
    },
  ],
  [
    {
      id: "mattress-bedroom",
      href: "/foam",
      label: "Foam",
      src: "/karmo/images/home-02/divisions/editorial-v2/foam-luxury-arch-sofa-hq.jpg",
      alt: "Charcoal foam sofa in a quiet luxury room with an arched forest mural",
      ratio: "aspect-[12/11]",
      grow: "md:flex-[11]",
      position: "object-[center_58%]",
    },
    {
      id: "mattress-grey",
      href: "/hometex",
      label: "HomeTex",
      src: "/karmo/images/home-02/divisions/editorial-v2/hometex-quilt-stack-hq.jpg",
      alt: "Stacked floral Karmo HomeTex quilts with floating feathers on a white bed",
      ratio: "aspect-[3/5]",
      grow: "md:flex-[20]",
    },
  ],
  [
    {
      id: "foam-campaign",
      href: "/foam",
      label: "Foam",
      src: "/karmo/images/home-02/divisions/editorial-v2/foam-karmo-letter-sofa-hq.jpg",
      alt: "Blue Karmo letter-cushion sofa in a quiet living room",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "mattress-floral",
      href: "/chemicals",
      label: "Chemicals",
      src: "/karmo/images/home-02/divisions/editorial-v2/chemicals-tins-hq.jpg",
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
        quality={85}
        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 42vw"
        className={`object-cover ${shot.position || "object-center"} origin-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          shot.zoom
            ? "scale-[1.28] group-hover:scale-[1.32]"
            : "group-hover:scale-[1.04]"
        }`}
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
      className="division-editorials relative my-[6px] overflow-x-clip py-14 lg:overflow-visible lg:py-0"
      style={{
        ["--division-h"]: DESKTOP_H,
      }}
    >
      {/* Soft mattress damask — readable pattern, no blur */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
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
          {...reveal}
          viewport={VIEWPORT}
          className="min-w-0 self-center text-left"
        >
          {/* Tagline only. "We create the" sits a step left of the
              chemistry line so the pair still reads left-aligned. */}
          <h2 className="display section-heading uppercase text-ink">
            <span className="block whitespace-nowrap -ml-[1.55em]">
              We create the
            </span>
            <span className="block whitespace-nowrap text-brand">
              Chemistry of comfort
            </span>
          </h2>
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
