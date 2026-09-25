"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Pillow page hero — one banner, not a slider. The client replaced the old
 * two-slide rotation with a single suitcase flat-lay and asked for one line of
 * copy on it, so the autoplay, pager dots and per-slide state are gone.
 *
 * The artwork is bright cream with the suitcase (47–93% of the width) on the
 * right and the left half empty, so the picture is anchored right and centred
 * vertically, and the heading sits on the empty left. White on the same dark
 * overlay every other hero on the site uses.
 *
 * A padded copy that re-centred the suitcase was tried and rejected: it looked
 * wrong to the client, and left no room for the heading beside the suitcase.
 */
const HERO = {
  src: "/karmo/images/hometex/pillow/karmo-plush-travel-suitcase-hero-v2.png",
  alt: "A Karmo Plush pillow packed in an open suitcase beside headphones, a wallet, an orange knit and a travel list, on a warm cream backdrop",
  title: "PACK IN COMFORT",
};

export default function PillowHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="pillow-title"
      className="relative isolate h-[calc(100dvh-112px)] overflow-hidden bg-[#efe6dc]"
    >
      {/* A 2.5:1 banner in a tall hero: `cover` crops the sides, and the height
          always fills, so the picture stays vertically centred. Anchored to
          the right from `lg` up so the whole suitcase stays in frame; on
          phones and tablets the window is too narrow for it, so it is centred
          on the pillow instead. */}
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[63%_center] lg:object-right"
      />
      {/* Same scrim as the Home / HomeTex / Bed & Automotive heroes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Top-left on phones and tablets, where the crop leaves no empty side
          (the strip above the suitcase is clear); centred on the empty left
          from `lg` up. */}
      <div className="absolute inset-0 flex flex-col items-start justify-start px-6 pt-8 sm:px-10 sm:pt-10 lg:justify-center lg:px-14 lg:pt-0 xl:px-20">
        <motion.h1
          id="pillow-title"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          /* Same size, weight, tracking and shadow as the Home / HomeTex / Bed &
             Automotive hero headings. */
          className="display whitespace-nowrap text-left uppercase text-white"
          style={{
            fontSize: "clamp(1.12rem, 0.92rem + 1.45vw, 2.4rem)",
            fontWeight: 350,
            fontVariationSettings: '"wght" 350',
            letterSpacing: "0.12em",
            lineHeight: 1.1,
            textShadow: "0 2px 28px rgba(0,0,0,0.55)",
          }}
        >
          {HERO.title}
        </motion.h1>
      </div>
    </section>
  );
}
