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
    src: "/karmo/images/product/lifestyle/karmo-comfort-v3-pose-01.png",
    alt: "Side sleep on a Karmo mattress — young woman at rest",
  },
  {
    id: "pose-02",
    src: "/karmo/images/product/lifestyle/karmo-comfort-v3-pose-02d.png",
    alt: "Back sleep on the same Karmo mattress — young man at rest",
  },
  {
    id: "pose-03",
    src: "/karmo/images/product/lifestyle/karmo-comfort-v3-pose-03.png",
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
      className="relative overflow-hidden border-b border-ink/8 bg-white"
      aria-label="Comfort on a Karmo mattress"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.38]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/55" />
      </div>

      <div className="shell relative z-[1] py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-16">
          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ebe7e1] shadow-[0_18px_50px_rgba(11,26,51,0.08)]">
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
                        sizes="(min-width: 1024px) 42vw, 90vw"
                        quality={82}
                        priority={i === 0}
                        className="object-cover object-[center_40%]"
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Comfort pose ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === index
                      ? "w-8 bg-brand"
                      : "w-5 bg-ink/18 hover:bg-ink/35"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="max-w-xl lg:justify-self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Feel the comfort
            </p>
            <h2 className="display mt-3 text-[1.65rem] font-bold uppercase leading-[1.12] tracking-[0.02em] text-ink sm:text-[1.95rem] lg:text-[2.15rem]">
              One Karmo mattress.
              <span className="mt-1 block text-brand">Three ways to rest.</span>
            </h2>
            <p className="body-copy mt-5 text-[14.5px] leading-[1.7] text-ink/60 sm:text-[15px]">
              Side sleep. Back sleep. Pillow hug. Same Karmo mattress from the
              same quiet angle — three ways Bangladesh rests.
            </p>
            <ul className="mt-8 space-y-4 border-t border-ink/10 pt-7">
              <li className="body-copy text-[13.5px] leading-[1.55] text-ink/65">
                <span className="font-bold text-ink">Body-mapped support</span>
                {" — "}
                pressure relief that holds whether you sleep light or deep.
              </li>
              <li className="body-copy text-[13.5px] leading-[1.55] text-ink/65">
                <span className="font-bold text-ink">Breathable quilted top</span>
                {" — "}
                cooler nights on a finish made for Bangladesh homes.
              </li>
              <li className="body-copy text-[13.5px] leading-[1.55] text-ink/65">
                <span className="font-bold text-ink">Built to last</span>
                {" — "}
                the same layered craft families have trusted since 1965.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
