"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, rise, VIEWPORT } from "@/components/karmo/motion";
import SectionHeading, { Accent } from "@/components/karmo/SectionHeading";

/**
 * Home Two — Living Lookbook.
 *
 * Top: three equal promo tiles.
 * Bottom: still living-room band ("Blending tradition with innovation"),
 * same gutter as the tiles so the block reads as one section.
 */

const GAP = "gap-1 md:gap-1.5";
/* Sides and bottom only. The top is left to the section above (Reels), which
   carries the 6px the client set as the gap between every two sections —
   padding on both would double it. */
const GUTTER = "px-0 pb-0 pt-0";
const TILE_H = "md:h-[min(60svh,620px)]";
const BAND_H =
  "h-[min(58svh,520px)] min-h-[320px] md:h-[min(68svh,700px)] md:min-h-[420px]";

const BAND_IMAGE =
  "/karmo/images/home-02/lookbook/lookbook-tradition-innovation-v1.jpg";
/* Same spinning mark as `/home-2` FilmBand. */
const BADGE = "/karmo/livora/intro-video-circle.svg";

const panels = [
  {
    id: "living",
    href: "/foam",
    src: "/karmo/images/home-02/divisions/editorial-v2/living-scandi-hq.jpg",
    alt: "A modern living room with a plush foam sofa and warm orange cushion",
    eyebrow: "Karmo Foam",
    title: "Living rooms made for real rest",
    cta: "Explore foam",
  },
  {
    id: "seating",
    href: "/foam",
    src: "/karmo/images/home-02/lookbook/lookbook-seating-v4.jpg",
    alt: "Close-up of cream bouclé seating with oak arm and a red throw accent",
    eyebrow: "Soft seating",
    title: "Support that stays all day",
    cta: "Shop seating",
  },
  {
    id: "foam-range",
    href: "/foam",
    src: "/karmo/images/home-02/lookbook/lookbook-living-v7.jpg",
    alt: "Cream foam sofa with a red accent cushion in a warm living room",
    eyebrow: "Karmo Foam",
    title: "Foam built for everyday living",
    cta: "View the range",
  },
];

export default function LivingLookbook() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className={`w-full overflow-hidden bg-white ${GUTTER}`}
      aria-label="Karmo living lookbook"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`flex flex-col ${GAP}`}
      >
        {/* Trio */}
        <div
          className={`grid min-h-0 grid-cols-1 ${GAP} ${TILE_H} md:grid-cols-3`}
        >
          {panels.map((panel) => (
            <motion.div
              key={panel.id}
              variants={fade}
              className="relative min-h-[min(52svh,420px)] min-w-0 md:min-h-0"
            >
              <Link
                href={panel.href}
                className="group relative block h-full overflow-hidden"
              >
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover object-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 z-[1] flex flex-col items-start justify-start p-6 sm:p-7 lg:p-8">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] sm:text-[13px] lg:text-[14px]">
                    {panel.eyebrow}
                  </span>
                  <h2 className="mt-3 max-w-[14ch] text-[1.55rem] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-[1.75rem] lg:text-[1.95rem]">
                    {panel.title}
                  </h2>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.02em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] transition-colors duration-300 group-hover:text-brand sm:mt-6 sm:text-[14px] lg:text-[15px]">
                    {panel.cta}
                    <FiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Still band — hero-style living room */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className={`relative overflow-hidden bg-shade-deep ${BAND_H}`}
        >
          <Image
            src={BAND_IMAGE}
            alt="A terracotta foam lounge in a calm maroon living room"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />

          <span
            aria-hidden
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgb(22 28 36 / 0.25) 0%, rgb(22 28 36 / 0.1) 45%, rgb(22 28 36 / 0.85) 100%)",
            }}
          />

          <div className="shell relative z-[2] flex h-full w-full flex-col items-start justify-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
            <SectionHeading
              tone="dark"
              eyebrow="60 years"
              title={[
                "Blending tradition",
                <Accent key="a">with innovation</Accent>,
              ]}
              className="hero-copy uppercase"
            />

            <motion.div variants={rise} className="shrink-0">
              <div className="group block rounded-full">
                <Image
                  src={BADGE}
                  alt=""
                  aria-hidden
                  width={140}
                  height={140}
                  unoptimized
                  className="aspect-square w-[140px] rounded-full animate-[film-badge-spin_20s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
