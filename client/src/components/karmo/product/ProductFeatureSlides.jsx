"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import LazyVideo from "@/components/karmo/LazyVideo";
import { HoverChrome, TallMorph } from "@/components/karmo/product/ProductBuildAside";

/**
 * Comfort — one Karmo mattress, three ways to rest. Three equal parts side by side:
 *   left   — a hand pressing the cloth (fixed clip, the same on every mattress page)
 *   middle — the rotating layer pictures (TallMorph, from ProductBuildAside)
 *   right  — the ball-drop clip (fixed, the same on every mattress page)
 * A short title strip sits above. Stacks on phones.
 */

/* Middle part: ball-drop clip (client, 23 Nov 2026). It replaced the three rotating sleeper
   photos: /products/common/lifestyle/karmo-comfort-v3-pose-01.webp, -pose-02d.webp, -pose-03.webp */
const BALL = { src: "/pages/mattress/ball.mp4", label: "Ball drop" };

/* The model film now lives in the middle of ProductBuildAside (client, 24 Nov 2026). */

/* One screen under the 112px header, plus a little (40px more), on every mattress page. */
const PART = "group relative aspect-[4/5] overflow-hidden sm:aspect-auto sm:h-[calc(100svh-72px)]";

export default function ProductFeatureSlides({ product }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const press = product?.insideClips?.press || { src: "/products/videos/inside/press-for-king.mp4", label: "Soft to the touch" };

  return (
    <section className="relative my-1.5 bg-[#f7f3ee]" aria-label="Comfort on a Karmo mattress">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/products/mattress/mosaic/karmo-pattern-texture.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-[0.22]"
          />
          <span className="absolute inset-0 bg-[#f7f3ee]/72" />
        </div>
        <div className="relative z-[1] px-6 py-9 text-center sm:px-10 lg:py-11">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Feel the comfort</p>
          <h2 className="display mt-3 text-[1.6rem] font-bold uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[1.95rem] lg:text-[2.3rem]">
            One Karmo mattress. <span className="text-brand">Three ways to rest.</span>
          </h2>
        </div>
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 gap-1.5 sm:grid-cols-3"
      >
        {/* Left: hand press — fixed. */}
        <motion.div variants={fade} className={`${PART} bg-ink`}>
          <LazyVideo
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={press.label}
          >
            <source src={press.src} type="video/mp4" />
          </LazyVideo>
          {/* Same hover frame and centred name as the middle part (client, 26 Nov 2026). Earlier: a bottom bar with 01 and the name. */}
          <HoverChrome label={press.label} />
        </motion.div>

        {/* Middle: the rotating layer pictures, moved up from the five-part "Inside every Karmo mattress" band;
            the Tanzin Tisha film went down there in its place (client, 24 Nov 2026). */}
        <motion.div variants={fade} className={`${PART} bg-ink`}>
          <TallMorph focusY="18%" />
        </motion.div>

        {/* Right: ball-drop clip, in the old spring spot (client 24 Nov 2026). */}
        <motion.div variants={fade} className={`${PART} bg-ink`}>
          <LazyVideo
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={BALL.label}
          >
            <source src={BALL.src} type="video/mp4" />
          </LazyVideo>
          {/* Same hover frame and centred name as the middle part (client, 26 Nov 2026). Earlier: a bottom bar with 03 and the name. */}
          <HoverChrome label={BALL.label} />
        </motion.div>

      </motion.div>
    </section>
  );
}
