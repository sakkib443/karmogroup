"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import LazyVideo from "@/components/karmo/LazyVideo";
import { stackFor } from "@/components/karmo/product/foam/FoamTestingBand";

/**
 * Foam detail — three equal parts side by side, the mattress page's comfort band
 * (ProductFeatureSlides) in foam (client, 24 Nov 2026):
 *   left   — the foam short (a woman with a Karmo foam slab)
 *   middle — the compression test: weights pressed onto foam in two tubes (Gemini clip)
 *   right  — the ball-drop on a KARMO POLY block (Gemini clip)
 * Stacks on phones.
 */
const PARTS = [
  { kind: "video", src: "/pages/foam/detail/foam-made-for-home-10s.mp4", label: "Made for home", position: "object-[40%_center]" },
  /* Middle was the still karmo-embossed-charcoal-foam-layers.webp; ball drop and compression swapped 24 Nov 2026. */
  { kind: "video", src: "/pages/foam/detail/foam-ball-drop.mp4", poster: "/pages/foam/detail/foam-ball-drop-poster.webp", label: "Ball drop", position: "object-center" },
  { kind: "video", src: "/pages/foam/detail/foam-compression-test.mp4", poster: "/pages/foam/detail/foam-compression-test-poster.webp", label: "Compression test", position: "object-center" },
];

const PART = "group relative aspect-[4/5] overflow-hidden bg-ink sm:aspect-auto sm:h-[calc(100svh-72px)]";
const MEDIA = "absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";
const SHADE = "pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent";
const BAR = "absolute inset-x-0 bottom-0 flex items-center gap-4 px-6 pb-6 text-white";
const NUM = "display text-[13px] font-bold tabular-nums tracking-[0.14em] text-white/80";
const NAME = "display text-[15px] font-bold uppercase tracking-[0.14em] sm:text-[16px]";

export default function FoamFeatureTriplet({ product }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const stack = stackFor(product?.slug);

  return (
    <section className="relative my-1.5 bg-[#f7f3ee]" aria-label="Karmo foam, three ways">
      <div className="relative overflow-hidden">
        {/* The mattress page's own heading strip (ProductFeatureSlides): the Karmo damask pattern on cream,
            plus this grade's foam stack, faint on the left (moved from the right, client 28 Nov 2026), as in the "Inside every Karmo foam" band
            (client, 28 Nov 2026). Tried and dropped the same day: a light foam-grain strip with a colour
            bar, a KARMO watermark strip, a dark studio strip, and a darkened curled-foam photo. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image src="/products/mattress/mosaic/karmo-pattern-texture.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.22]" />
          <span className="absolute inset-0 bg-[#f7f3ee]/72" />
          <div className="absolute inset-y-0 left-0 hidden w-[56%] items-center justify-start pl-[4%] md:flex">
            <Image src={stack} alt="" width={1200} height={870} sizes="26vw" className="h-[88%] w-auto max-w-[62%] object-contain opacity-[0.26]" />
          </div>
        </div>
        <div className="relative z-[1] px-6 py-9 text-center sm:px-10 lg:py-11">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Feel the comfort</p>
          <h2 className="display mt-3 text-[1.6rem] font-bold uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[1.95rem] lg:text-[2.3rem]">
            One Karmo foam. <span className="text-brand">Built to bounce back.</span>
          </h2>
        </div>
      </div>

      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        {PARTS.map((p, i) => (
          <motion.div key={p.src} variants={fade} className={PART}>
            {p.kind === "video" ? (
              <LazyVideo className={`${MEDIA} ${p.position}`} autoPlay muted loop playsInline preload="metadata" poster={p.poster} aria-label={p.label}>
                <source src={p.src} type="video/mp4" />
              </LazyVideo>
            ) : (
              <Image src={p.src} alt={p.label} fill unoptimized sizes="(min-width: 640px) 33vw, 100vw" className={`${MEDIA} ${p.position}`} />
            )}
            <span aria-hidden className={SHADE} />
            <div className={BAR}>
              <span className={NUM}>{String(i + 1).padStart(2, "0")}</span>
              <span className={NAME}>{p.label}</span>
              <span className="ml-auto h-px w-10 bg-white/70" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
