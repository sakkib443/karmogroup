"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Comfort morph — same Karmo bed/angle, changing sleeper.
 * Slides swap quickly (normal crossfade). Zoom is separate: one slow,
 * subtle continuous push across the whole cycle — not restarted per slide.
 * First hold is short once the section enters view; later holds stay normal.
 */

const EASE = [0.33, 1, 0.68, 1];
/** First visible swap — fire almost immediately once the section hits the screen. */
const FIRST_HOLD_MS = 80;
const HOLD_MS = 2000;
const FADE_S = 0.18;
/** Full loop zoom duration — slower than three slide holds, barely drifts. */
const ZOOM_MS = 14000;
const ZOOM_FROM = 1;
const ZOOM_TO = 1.06;
const Y_FROM = "0%";
const Y_TO = "-1.6%";

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

export default function ProductFeatureSlides() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const firstSwapDone = useRef(false);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) {
          /* Arrive on pose 1, then fire the quick first swap. */
          firstSwapDone.current = false;
          setIndex(0);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
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
    <section
      ref={sectionRef}
      className="relative bg-[#f7f3ee]"
      aria-label="Comfort on a Karmo mattress"
    >
      <div className="grid min-h-[34rem] grid-cols-1 lg:min-h-[36rem] lg:grid-cols-2">
        <div className="relative min-h-[22rem] overflow-hidden bg-[#ebe7e1] sm:min-h-[26rem] lg:min-h-full">
          <motion.div
            className="absolute inset-0 origin-[50%_42%] will-change-transform"
            initial={false}
            animate={
              reduceMotion
                ? { scale: 1, y: 0 }
                : {
                    scale: [ZOOM_FROM, ZOOM_TO],
                    y: [Y_FROM, Y_TO],
                  }
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
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={82}
                    priority={i === 0}
                    className="object-cover object-[center_42%]"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="relative flex items-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Image
              src="/products/mattress/mosaic/karmo-pattern-texture.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center opacity-[0.22]"
            />
            <span className="absolute inset-0 bg-[#f7f3ee]/72" />
          </div>

          <div className="relative z-[1] w-full px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              Feel the comfort
            </p>
            <h2 className="display mt-3 max-w-[16ch] text-[1.85rem] font-bold uppercase leading-[1.05] tracking-[0.01em] text-ink sm:text-[2.15rem] lg:text-[2.45rem]">
              One Karmo mattress.
              <span className="mt-1 block text-brand">Three ways to rest.</span>
            </h2>

            <div className="mt-8 flex max-w-sm flex-col" role="tablist" aria-label="Ways to rest">
              {SLIDES.map((slide, i) => {
                const on = i === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-label={slide.name}
                    onClick={() => setIndex(i)}
                    className={`flex items-center gap-4 border-t border-ink/10 py-4 text-left transition-colors last:border-b ${
                      on ? "text-ink" : "text-ink/40 hover:text-ink/70"
                    }`}
                  >
                    <span
                      className={`display text-[13px] font-bold tabular-nums tracking-[0.14em] ${
                        on ? "text-brand" : ""
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="display text-[15px] font-bold uppercase tracking-[0.12em] sm:text-[16px]">
                      {slide.name}
                    </span>
                    <span
                      className={`ml-auto h-px transition-all duration-500 ${
                        on ? "w-10 bg-brand" : "w-4 bg-ink/15"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
