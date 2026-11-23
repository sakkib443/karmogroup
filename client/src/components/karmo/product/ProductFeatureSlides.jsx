"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import LazyVideo from "@/components/karmo/LazyVideo";

/**
 * Comfort — one Karmo mattress, three ways to rest. Three equal parts side by side:
 *   left   — a hand pressing the cloth (fixed clip, the same on every mattress page)
 *   middle — the ball-drop clip (fixed, the same on every mattress page)
 *   right  — the Tanzin Tisha model film (fixed, the same on every mattress page)
 * A short title strip sits above. Stacks on phones.
 */

/* Middle part: ball-drop clip (client, 23 Nov 2026). It replaced the three rotating sleeper
   photos: /products/common/lifestyle/karmo-comfort-v3-pose-01.webp, -pose-02d.webp, -pose-03.webp */
const BALL = { src: "/pages/mattress/ball.mp4", label: "Ball drop" };

/* Right part: the whole mattress TVC (62 s) for now, so the client can pick the parts to keep.
   The running time is shown on it as a review aid — remove with the TIME lines once decided. */
/* Swapped to the new mattress clip (client, 23 Nov 2026). Earlier: /shared/videos/tvc-mattress.mp4 */
const MODEL = { src: "/pages/mattress/mattress-model-film.mp4", label: "Tanzin Tisha" };

/* One screen under the 112px header, plus a little (40px more), on every mattress page. */
const PART = "group relative aspect-[4/5] overflow-hidden sm:aspect-auto sm:h-[calc(100svh-72px)]";
const SHADE = "pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent";
const BAR = "absolute inset-x-0 bottom-0 flex items-center gap-4 px-6 pb-6 text-white";
const NUM = "display text-[13px] font-bold tabular-nums tracking-[0.14em] text-white/80";
const NAME = "display text-[15px] font-bold uppercase tracking-[0.14em] sm:text-[16px]";

export default function ProductFeatureSlides({ product }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const press = product?.insideClips?.press || { src: "/products/videos/inside/press-for-king.mp4", label: "Soft to the touch" };

  const [clock, setClock] = useState(0); // TIME: review aid

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
          <span aria-hidden className={SHADE} />
          <div className={BAR}>
            <span className={NUM}>01</span>
            <span className={NAME}>{press.label}</span>
            <span className="ml-auto h-px w-10 bg-white/70" />
          </div>
        </motion.div>

        {/* Middle: ball-drop clip — fixed. */}
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
          <span aria-hidden className={SHADE} />
          <div className={BAR}>
            <span className={NUM}>02</span>
            <span className={NAME}>{BALL.label}</span>
            <span className="ml-auto h-px w-10 bg-white/70" />
          </div>
        </motion.div>

        {/* Right: the Tanzin Tisha model film — fixed. */}
        <motion.div variants={fade} className={`${PART} bg-ink`}>
          <LazyVideo
            className="absolute inset-0 h-full w-full object-cover object-[55%_center] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={MODEL.label}
            onTimeUpdate={(e) => setClock(e.currentTarget.currentTime)} /* TIME */
          >
            <source src={MODEL.src} type="video/mp4" />
          </LazyVideo>
          <span aria-hidden className={SHADE} />
          <div className={BAR}>
            <span className={NUM}>03</span>
            <span className={NAME}>{MODEL.label}</span>
            <span className="rounded bg-black/55 px-2 py-0.5 text-[12px] font-semibold tabular-nums tracking-wider text-white" aria-hidden>
              {/* TIME */}{Math.floor(clock / 60)}:{String(Math.floor(clock % 60)).padStart(2, "0")}
            </span>
            <span className="ml-auto h-px w-10 bg-white/70" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
