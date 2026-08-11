"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Foam page hero — one still banner, no carousel.
 * Top line mirrors the homepage hero: Bangladesh's · badge · Foam Brand.
 */

const badge = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

const banner = {
  /* New filename so browsers / next/image cannot keep serving an old crop. */
  src: "/karmo/images/foam/banner-yellow-room-v1.png",
  alt: "A cream sofa in a golden-yellow living room — Karmo Foam comfort",
  title: "Chemistry of Comfort",
  line: "Pure rubber grade foam, made in Bangladesh since 1965.",
};

export default function FoamBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative h-[min(72vw,520px)] min-h-[280px] w-full overflow-hidden bg-ink lg:h-[min(48vw,560px)]">
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_72%]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.28)]"
      />

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] flex h-full flex-col items-center justify-center text-center"
      >
        {/* Same one-line treatment as HeroTwo — badge interrupts the phrase. */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-4">
          <span className="text-[14px] font-bold uppercase tracking-[0.1em] text-white sm:text-[16px] lg:text-[18px]">
            Bangladesh&rsquo;s
          </span>
          <Image
            src={badge.src}
            alt=""
            width={badge.width}
            height={badge.height}
            className="h-11 w-auto shrink-0 -translate-y-[10%] sm:h-12 lg:h-14"
          />
          <span className="text-[14px] font-bold uppercase tracking-[0.1em] text-white sm:text-[16px] lg:text-[18px]">
            Foam Brand
          </span>
        </div>

        <h1 className="display mt-4 text-[clamp(1.85rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)] lg:mt-5">
          {banner.title}
        </h1>
        <p className="body-copy mt-4 max-w-lg text-[14px] text-white/85 sm:text-[15px]">
          {banner.line}
        </p>
      </motion.div>
    </section>
  );
}
