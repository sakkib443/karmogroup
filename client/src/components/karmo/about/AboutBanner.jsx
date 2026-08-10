"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { aboutBanner } from "@/components/karmo/about/aboutData";
import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * About page banner — the same still-photo header the foam page uses, so the
 * two sub-pages open the same way. No carousel and no badge: the badge line on
 * the foam banner is a foam claim, and repeating it here would put a product
 * boast above the company's own history.
 */
export default function AboutBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative h-[min(72vw,520px)] min-h-[280px] w-full overflow-hidden bg-ink lg:h-[min(46vw,540px)]">
      <Image
        src={aboutBanner.src}
        alt={aboutBanner.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.42)]"
      />

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] flex h-full flex-col items-center justify-center text-center"
      >
        <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
          <span className="h-px w-8 bg-brand" />
          {aboutBanner.eyebrow}
          <span className="h-px w-8 bg-brand" />
        </span>

        <h1 className="display mt-5 text-[clamp(1.85rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">
          {aboutBanner.title}
        </h1>
        <p className="body-copy mt-4 max-w-xl text-[14px] leading-[1.8] text-white/85 sm:text-[15px]">
          {aboutBanner.line}
        </p>
      </motion.div>
    </section>
  );
}
