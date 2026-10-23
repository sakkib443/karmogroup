"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Footwear-only "Designed to endure" band.
 *
 * These are the two shoe photos that used to sit at the bottom of the shared
 * DivisionShapeGrid (the spotlight + the `still`). The client asked to drop the
 * feature-card grid above them and show just these two images, each half the
 * screen, full-bleed. Kept as its own component so the shared DivisionShapeGrid
 * — used by every other division — is left completely untouched. Rendered only
 * for footwear via `data.footwearEndureBand` in DivisionPage.
 */
const LEFT = {
  src: "/pages/foam/furniture/mosaic/footwear-spotlight2.webp",
  alt: "Grey and red Karmo sport shoes on a sunlit foam block",
};
const RIGHT = {
  src: "/pages/foam/furniture/mosaic/footwear-sole-v4.webp",
  alt: "A blue Karmo running shoe on a rocky shore at sunset",
};

export default function FootwearEndureBand() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <section className="relative mb-1.5 w-full overflow-hidden">
      {/* 50 / 50 from md up; stacked full-width on phones so each shoe stays big. */}
      <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2">
        {/* Left — shoes with the heading */}
        <motion.div
          {...reveal}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="relative h-[46vh] min-h-[280px] overflow-hidden bg-[#f4f0e8] md:h-[min(64vh,580px)]"
        >
          <Image
            src={LEFT.src}
            alt={LEFT.alt}
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <span aria-hidden className="absolute inset-0 bg-black/40" />
          <div className="relative z-[1] flex h-full items-center justify-end px-7 pb-10 pt-7 sm:px-8 lg:px-10">
            <h3
              className="display title-card-line max-w-[22rem] text-right uppercase text-white"
              style={{
                fontSize: "clamp(1.28rem, 0.96rem + 1.1vw, 1.85rem)",
                fontWeight: 350,
                fontVariationSettings: '"wght" 350',
                letterSpacing: "-0.015em",
                lineHeight: 1.08,
                whiteSpace: "nowrap",
              }}
            >
              Designed to endure
            </h3>
          </div>
        </motion.div>

        {/* Right — second shoe photo */}
        <motion.div
          {...reveal}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.08 }}
          className="relative h-[46vh] min-h-[280px] overflow-hidden bg-[#0b1a33] md:h-[min(64vh,580px)]"
        >
          <Image
            src={RIGHT.src}
            alt={RIGHT.alt}
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
