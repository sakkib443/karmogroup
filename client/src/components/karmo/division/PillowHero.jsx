"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Pillow page hero — one banner, not a slider. The client replaced the old
 * two-slide rotation with a single image and one line of copy, so the
 * autoplay, pager dots and per-slide state are gone.
 *
 * The artwork is a sunlit living room: a grey sofa piled with white Karmo
 * pillows and a knit throw, centred in the frame with feathers drifting
 * around it. The picture is centred (not anchored) and fills the tall hero,
 * and the heading sits over the darker left wall. White on the same dark
 * overlay every other hero on the site uses.
 */
const HERO = {
  src: "/pages/hometex/pillow/pillow-banner.png",
  alt: "A sunlit living room with a grey sofa piled with white Karmo pillows and a knit throw, soft feathers drifting in the air, framed by panelled walls, potted plants and a bright window",
  title: "PREMIUM COMFORT",
};

export default function PillowHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="pillow-title"
      className="relative isolate h-[calc(100dvh-112px)] overflow-hidden bg-[#efe6dc]"
    >
      {/* A wide banner in a tall hero: `cover` crops the sides and the height
          always fills, so the picture stays vertically centred. The sofa and
          pillows sit in the middle of the frame, so this one is centred at
          every width instead of anchored right. */}
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Same scrim as the Home / HomeTex / Bed & Automotive heroes. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Centred near the top, on the bare panelled wall above the sofa (client
          ask) — horizontally centred at every width and nudged down from the
          header so it sits in the empty panel over the pillows. */}
      <div className="absolute inset-0 flex flex-col items-center justify-start px-6 pt-[14vh] sm:px-10 sm:pt-[14vh] lg:px-14 lg:pt-[15vh] xl:px-20">
        <motion.h1
          id="pillow-title"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          /* Same size, weight, tracking and shadow as the Home / HomeTex / Bed &
             Automotive hero headings. */
          className="display whitespace-nowrap text-center uppercase text-white"
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
