"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import LazyVideo from "@/components/karmo/LazyVideo";

/**
 * Comfort — one Karmo mattress, three ways to rest. Three equal parts side by side:
 *   left   — a hand pressing the cloth (fixed clip, the same on every mattress page)
 *   middle — the three sleeper photos, changing one after another for as long as the page is open
 *   right  — the Tanzin Tisha model film (fixed, the same on every mattress page)
 * A short title strip sits above. Stacks on phones.
 */

const EASE = [0.33, 1, 0.68, 1];
const FIRST_HOLD_MS = 80;
const HOLD_MS = 2000;
const FADE_S = 0.18;

const SLIDES = [
  {
    id: "pose-01",
    name: "Side sleep",
    src: "/products/common/lifestyle/karmo-comfort-v3-pose-01.webp",
    alt: "Side sleep on a Karmo mattress — young woman at rest",
  },
  {
    id: "pose-02",
    name: "Back sleep",
    src: "/products/common/lifestyle/karmo-comfort-v3-pose-02d.webp",
    alt: "Back sleep on the same Karmo mattress — young man at rest",
  },
  {
    id: "pose-03",
    name: "Pillow hug",
    src: "/products/common/lifestyle/karmo-comfort-v3-pose-03.webp",
    alt: "Stomach sleep on the same Karmo mattress — mature sleeper",
  },
];

/* Right part: the whole mattress TVC (62 s) for now, so the client can pick the parts to keep.
   The running time is shown on it as a review aid — remove with the TIME lines once decided. */
const MODEL = { src: "/shared/videos/tvc-mattress.mp4", label: "Tanzin Tisha" };

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
  const midRef = useRef(null);
  const firstSwapDone = useRef(false);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = midRef.current;
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
      { threshold: 0.2 }
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

        {/* Middle: the three sleepers, changing all the time. */}
        <motion.div variants={fade} ref={midRef} className={`${PART} bg-[#ebe7e1]`}>
          {SLIDES.map((slide, i) => {
            const on = i === index;
            return (
              <motion.div
                key={slide.id}
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : FADE_S, ease: EASE }}
                className={`absolute inset-0 ${on ? "z-[1]" : "pointer-events-none z-0"}`}
                aria-hidden={!on}
              >
                <Image
                  src={slide.src}
                  alt={on ? slide.alt : ""}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  quality={82}
                  className="object-cover object-[center_42%]"
                />
              </motion.div>
            );
          })}
          <span aria-hidden className={`${SHADE} z-[2]`} />
          <div className={`${BAR} z-[3]`}>
            <span className={NUM}>02</span>
            <span className={NAME}>{SLIDES[index].name}</span>
            <span className="ml-auto flex gap-1.5" aria-hidden>
              {SLIDES.map((s, i) => (
                <span key={s.id} className={`h-px transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-3 bg-white/40"}`} />
              ))}
            </span>
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
