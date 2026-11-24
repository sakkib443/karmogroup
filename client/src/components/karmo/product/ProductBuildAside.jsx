"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { productFeatures } from "@/components/karmo/product/productDetailData";
import LazyVideo from "@/components/karmo/LazyVideo";

/**
 * PDP band — short left copy + asymmetric media flush right:
 * tall morph (3 sleep stills) | two stacked feature videos.
 * Hover = home DivisionEditorials frame + label. 6px gap to neighbours.
 */

/* Taller than before, and sized only in screen fractions (no fixed px), so browser zoom in/out never changes how the band looks. */
/* screenFit: exactly one screen under the 112px header; the middle column is as wide as the
   picture's own shape (2:3) needs at that height, so the middle picture shows whole. */
const SCREEN_H = "calc(100svh - 40px)";
const BAND_H = "min(86vw, 112svh, 1536px)";
const GAP = "gap-1.5";

const EASE = [0.33, 1, 0.68, 1];
const FIRST_HOLD_MS = 550;
const HOLD_MS = 2000;
const FADE_S = 0.18;
const ZOOM_MS = 14000;
const ZOOM_FROM = 1;
const ZOOM_TO = 1.03;
const Y_FROM = "0%";
const Y_TO = "-0.6%";

const SLIDES = [
  {
    id: "sleep-01",
    src: "/products/common/lifestyle/build-morph/karmo-morph-v3-01.webp",
    alt: "Back sleep on a Karmo navy floral mattress — pillow and katha",
    label: "Quiet rest",
  },
  {
    id: "sleep-02",
    src: "/products/common/lifestyle/build-morph/karmo-morph-v3-02.webp",
    alt: "Side sleep on a Karmo navy floral mattress — pillow hug with katha",
    label: "Pillow hug",
  },
  {
    id: "sleep-03",
    src: "/products/common/lifestyle/build-morph/karmo-morph-v3-03.webp",
    alt: "Deep sleep on a Karmo navy floral mattress — pillow and light cover",
    label: "Deep sleep",
  },
];

/* Fallback clips; each mattress page passes its own (product.insideClips). Left column: feet-and-water-bottle shot over the press test; right column: the red-cloth clip over the ball drop (the hand-press clip lives in the three-part band, ProductFeatureSlides). */
const DEFAULT_PAN = { src: "/products/videos/inside/pan-blue.mp4", label: "Cover in motion" };
/* Middle tall column: the Tanzin Tisha model film; the rotating layer pictures (TallMorph) moved to the middle of the three-part band, ProductFeatureSlides (client, 24 Nov 2026). Earlier: /shared/videos/tvc-mattress.mp4. */
const MODEL = { src: "/pages/mattress/mattress-model-film.mp4", label: "Tanzin Tisha", position: "55% center" };
const DEFAULT_FEET = { src: "/products/videos/inside/feet-for-king.mp4", label: "Tested by weight" };

function HoverChrome({ label }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[10%] z-[2] border-2 border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[12%] lg:inset-[13%]"
      />
      <span className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <span className="display translate-y-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[14px] lg:text-[15px]">
          {label}
        </span>
      </span>
    </>
  );
}

/* focusY: which part of the tall pictures stays in view when the tile crops them (higher % = pictures sit a little higher). */
export function TallMorph({ focusY = "18%" }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const firstSwapDone = useRef(false);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) {
          firstSwapDone.current = false;
          setIndex(0);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView) return undefined;
    const delay = firstSwapDone.current ? HOLD_MS : FIRST_HOLD_MS;
    const id = window.setTimeout(() => {
      firstSwapDone.current = true;
      setIndex((i) => (i + 1) % SLIDES.length);
    }, delay);
    return () => window.clearTimeout(id);
  }, [reduceMotion, inView, index]);

  return (
    <div
      ref={rootRef}
      className="group absolute inset-0 overflow-hidden bg-[#ebe7e1]"
    >
      <motion.div
        className="absolute inset-0 origin-[50%_40%] will-change-transform"
        initial={false}
        animate={
          reduceMotion
            ? { scale: 1, y: 0 }
            : { scale: [ZOOM_FROM, ZOOM_TO], y: [Y_FROM, Y_TO] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: ZOOM_MS / 1000,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        {SLIDES.map((slide, i) => {
          const on = i === index;
          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : FADE_S,
                ease: EASE,
              }}
              className={`absolute inset-0 ${
                on ? "z-[1]" : "pointer-events-none z-0"
              }`}
              aria-hidden={!on}
            >
              <Image
                src={slide.src}
                alt={on ? slide.alt : ""}
                fill
                sizes="(min-width: 1024px) 32vw, 60vw"
                quality={85}
                className="object-cover"
                style={{ objectPosition: `center ${focusY}` }}
              />
            </motion.div>
          );
        })}
      </motion.div>
      <HoverChrome label={SLIDES[index].label} />
    </div>
  );
}

/* lift (% of the tile): moves the picture up inside its tile — e.g. so the surface under the bouncing ball shows. The strip it uncovers at the bottom is the same pale colour, and the picture's lower edge fades into it. */
function VideoTile({ src, label, lift, drop, position }) { // always fills its relative wrapper
  const gif = typeof src === "string" && src.split("?")[0].endsWith(".gif");
  const mediaClass =
    "absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]";
  const posStyle = position ? { objectPosition: position } : {};
  const liftStyle = lift
    ? {
        transform: `translateY(-${lift}%)`,
        WebkitMaskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, #000 86%, transparent 100%)",
      }
    : undefined;
  /* drop (% of the tile): moves the picture down so more of the top shows (feet jumping); the strip uncovered at the top is the pale wall colour and the picture's upper edge fades into it. */
  const dropStyle = drop
    ? {
        transform: `translateY(${drop}%)`,
        WebkitMaskImage: "linear-gradient(to top, #000 86%, transparent 100%)",
        maskImage: "linear-gradient(to top, #000 86%, transparent 100%)",
      }
    : undefined;
  const mediaStyle = { ...posStyle, ...liftStyle, ...dropStyle };
  return (
    <div className={`group absolute inset-0 overflow-hidden ${lift || drop ? "bg-[#e9e8ea]" : "bg-ink"}`}>
      {gif ? (
        <img loading="lazy" decoding="async" src={src} alt={label} className={mediaClass} style={mediaStyle} />
      ) : (
        <LazyVideo
          className={mediaClass}
          style={mediaStyle}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        >
          <source src={src} type="video/mp4" />
        </LazyVideo>
      )}
      <HoverChrome label={label} />
    </div>
  );
}

/* cols = the three column widths on desktop (default equal). A second copy of the band under the first uses a narrower middle. */
export default function ProductBuildAside({ product, cols = "1fr 1fr 1fr", screenFit = false }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const clips = product?.insideClips;
  const SHOT_4 = clips?.pan || DEFAULT_PAN;
  const SHOT_5 = { ...(clips?.feet || DEFAULT_FEET), position: "90% center" }; /* right side of the picture, so the bottle is in view (the setting before the last two tweaks) */

  return (
    <section
      className="relative my-[6px] overflow-x-clip pt-10 lg:overflow-visible lg:pt-0"
      style={{ ["--build-h"]: screenFit ? SCREEN_H : BAND_H }}
      aria-label="Inside every Karmo mattress"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/products/mattress/mosaic/karmo-pattern-texture.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.2]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/58" />
      </div>

      {/* Heading on top, then one full-width row of three columns. */}
      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="relative z-[1]">
        <motion.div
          variants={fade}
          className="relative mx-auto flex max-w-[1600px] flex-col items-center px-6 pb-10 pt-2 text-center md:px-14 lg:px-16 lg:pb-12 lg:pt-10"
        >
          {/* The cutaway picture sits behind the heading like a faint sketch: bigger, grey, low opacity. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex w-full items-center justify-end overflow-hidden lg:w-[62%]"
          >
            <Image
              src="/products/mattress/brochure/inside/pocket-cutaway-cutout.webp"
              alt=""
              width={1280}
              height={720}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-[min(46rem,100%)] object-contain opacity-[0.16] mix-blend-multiply grayscale contrast-125"
              priority={false}
            />
          </div>

          <div className="relative min-w-0 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Inside every Karmo mattress</p>
            <h2 className="display mt-3 text-[1.6rem] font-bold uppercase leading-[1.08] tracking-[0.01em] text-ink sm:text-[1.95rem] lg:text-[2.3rem]">
              Five layers. <span className="text-brand">Built to last.</span>
            </h2>

            <Link href="/contact" className="group mt-5 inline-flex items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
                Talk to us
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <FiArrowUpRight />
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={fade} className="w-full">
          <div
            className={`grid w-full grid-cols-2 ${GAP} lg:h-[var(--build-h)] lg:[grid-template-columns:var(--cols)] lg:grid-rows-2`}
            style={{ ["--cols"]: screenFit ? `1fr calc(${SCREEN_H} / 1.5 * 1.07) 1fr` : cols }}
          >
            {[SHOT_5, { src: productFeatures[1]?.video, label: productFeatures[1]?.title }].map((clip, i) => (
              <div
                key={`left-${i}`}
                className={`relative aspect-video min-h-0 lg:col-start-1 lg:aspect-auto ${i === 0 ? "lg:row-start-1" : "lg:row-start-2"}`}
              >
                <VideoTile src={clip.src} label={clip.label} lift={clip.lift} drop={clip.drop} position={clip.position} />
              </div>
            ))}
            <div className="relative col-span-2 aspect-[4/3] min-h-0 lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-auto">
              <VideoTile src={MODEL.src} label={MODEL.label} position={MODEL.position} />
            </div>
            {[SHOT_4, { src: productFeatures[0]?.video, label: productFeatures[0]?.title, lift: 12 }].map((clip, i) => (
              <div
                key={`right-${i}`}
                className={`relative aspect-video min-h-0 lg:col-start-3 lg:aspect-auto ${i === 0 ? "lg:row-start-1" : "lg:row-start-2"}`}
              >
                <VideoTile src={clip.src} label={clip.label} lift={clip.lift} drop={clip.drop} position={clip.position} />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
