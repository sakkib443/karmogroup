"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * One banner, not a slider — the client asked to drop the automotive slide
 * and keep only this one. Kept as its own component (rather than folded into
 * `OverlayHeroSlider`) because the full-bleed `h-[calc(100vh-112px)]` frame
 * and the bottom-left placement are specific to this page.
 */
const SLIDE = {
  image: "/karmo/images/foam-2/bed-automotive/bed-approved-banner.png",
  alt: "A sunlit bedroom with exposed blue and cream mattress foam and Karmo branding",
  title: "THE COMFORT BEHIND YOUR SLEEP",
  objectPosition: "75% center",
};

export default function BedAutomotiveHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Karmo bed and automotive foam"
      className="relative isolate h-[calc(100vh-112px)] overflow-hidden bg-[#f7f8f8] text-[#17191c]"
    >
      <Image
        src={SLIDE.image}
        alt={SLIDE.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: SLIDE.objectPosition }}
      />
      {/* Dark overlay for text readability — unchanged, this part was fine. */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-8 lg:px-14 xl:px-20">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          /* Same weight/size/tracking as the Home and HomeTex hero headings
             (`OverlayHeroSlider`'s title-card style) — this one had grown its
             own much larger, much heavier look (up to 3rem, font-semibold)
             that read as a different page. */
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
          {SLIDE.title}
        </motion.h1>
      </div>
    </section>
  );
}
