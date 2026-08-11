"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Portfolio banner — same still-photo header as `/about` and `/foam`, so all
 * three company-level pages open the same way.
 */
export default function PortfolioBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative h-[min(72vw,520px)] min-h-[280px] w-full overflow-hidden bg-ink lg:h-[min(46vw,540px)]">
      <Image
        src="/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png"
        alt="A Karmo HomeTex bedding set photographed in studio"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.5)]"
      />

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] flex h-full flex-col items-center justify-center text-center"
      >
        <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
          <span className="h-px w-8 bg-brand" />
          Portfolio
          <span className="h-px w-8 bg-brand" />
        </span>

        <h1 className="display mt-5 text-[clamp(1.85rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">
          Our Work
        </h1>
        <p className="body-copy mt-4 max-w-xl text-[14px] leading-[1.8] text-white/85 sm:text-[15px]">
          Foam, mattress, HomeTex and chemicals — made, photographed and shipped from Bangladesh.
        </p>
      </motion.div>
    </section>
  );
}
