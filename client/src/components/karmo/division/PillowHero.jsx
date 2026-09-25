"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Pillow page hero — one banner, not a slider. The client replaced the old
 * two-slide rotation with a single image and one line of copy, so the
 * autoplay, pager dots and per-slide state are gone.
 *
 * The artwork is a cream wall over a rattan sideboard, with the two pillows
 * (68–99% of the width) on the right and the left half empty wall, so the
 * picture is anchored right and centred vertically, and the heading sits on
 * the empty left. White on the same dark overlay every other hero on the site
 * uses. It has held two images so far: this one, and before it the suitcase
 * flat-lay, which now lives in the lower "Cloud-Like Comfort" band.
 */
const HERO = {
  src: "/karmo/images/hometex/pillow/karmo-pillow-cane-sideboard-hero.png",
  alt: "Two white Karmo pillows stacked on a light wood cane sideboard, one with an open corner showing its soft filling beside a pile of feathers, with dried-branch vases and a lantern against a cream wall",
  title: "PREMIUM COMFORT",
};

export default function PillowHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="pillow-title"
      className="relative isolate h-[calc(100dvh-112px)] overflow-hidden bg-[#efe6dc]"
    >
      {/* A 2.9:1 banner in a tall hero: `cover` crops the sides, and the height
          always fills, so the picture stays vertically centred. Anchored to
          the right from `md` up so both pillows stay in frame; on phones the
          window is narrower than the pair, so it is centred on them instead. */}
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[92%_center] md:object-right"
      />
      {/* Same scrim as the Home / HomeTex / Bed & Automotive heroes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Top-left on phones and tablets, over the bare wall above the pillows;
          dead-centre vertically on the empty left from `lg` up. (It was nudged
          up to clear the lantern at 16:9, and read as too high on the client's
          wider screen — so it is true centre now.) */}
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
