"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Mattress hero — a carousel rebuilt from the client's previous site. The whole
 * left column is a FIXED scaffold: the #1 badge line, the headline and the CTAs
 * never move. Only the model name + sub-heading (in a fixed-height, absolutely
 * positioned slot so nothing below it can shift) and the floating mattress on the
 * right rotate. Auto-plays with a professional slide/fade; arrows, dots and a
 * per-slide progress bar give explicit manual control.
 */

const badge = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

const BG = "/karmo/images/mattress/mattress-sleep-well-bg.jpg";
const AUTOPLAY = 4800;
const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#FF9A1F";

/* Only `name` + `sub` + `image` change per slide — everything else stays fixed. */
const slides = [
  {
    id: "eurotop",
    name: "Euro Top Pocket Spring",
    sub: "Pocketed coils under a plush memory-foam pillow top.",
    image: "/karmo/images/mattress/hero-eurotop-pocket.png",
    alt: "Karmo Euro Top Pocket Spring mattress",
  },
  {
    id: "bonnell",
    name: "Bonnell Spring",
    sub: "Breathable open-coil support, crafted to perfection.",
    image: "/karmo/images/mattress/hero-bonnell.png",
    alt: "Karmo Bonnell Spring mattress",
  },
  {
    id: "pillowtop",
    name: "Pillow Top Pocket Spring",
    sub: "Bedding excellence since 1965 — luxury you can feel.",
    image: "/karmo/images/mattress/hero-pillowtop-pocket.png",
    alt: "Karmo Pillow Top Pocket Spring mattress",
  },
];

export default function MattressBanner() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const go = useCallback(
    (i) => setActive(((i % slides.length) + slides.length) % slides.length),
    []
  );

  /* Timer keyed to `active`, so any manual nav restarts the countdown and keeps
     the progress bar in step. */
  useEffect(() => {
    if (reduce) return undefined;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % slides.length),
      AUTOPLAY
    );
    return () => clearTimeout(t);
  }, [active, reduce]);

  const slide = slides[active];

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden bg-ink lg:h-[min(48vw,640px)] lg:min-h-0">
      <Image
        src={BG}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />
      {/* Darker overlay than the plain still, at the client's ask. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
      />

      <div className="shell relative z-[1] flex h-full flex-col items-center justify-center gap-8 py-14 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-0 lg:text-left">
        {/* ── Left: fixed scaffold, only the name/sub slot rotates ─────────── */}
        <div className="order-2 lg:order-1">
          {/* Fixed: #1 badge line */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start">
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              Bangladesh&rsquo;s
            </span>
            <Image
              src={badge.src}
              alt=""
              width={badge.width}
              height={badge.height}
              className="h-9 w-auto shrink-0 -translate-y-[8%] sm:h-11"
            />
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              Mattress Brand
            </span>
          </div>

          {/* Fixed: main headline (same on every slide) */}
          <h1 className="display mt-4 text-[clamp(1.95rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]">
            Always Sound Sleep
          </h1>

          {/* Rotating: model name + sub-heading.
              Fixed-height, absolutely-positioned slot → the CTAs below NEVER move. */}
          <div className="relative mt-5 h-[5.25rem] sm:h-[4.75rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? {} : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-x-0 top-0"
              >
                <p
                  className="display text-[15px] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[16px]"
                  style={{ color: ACCENT }}
                >
                  {slide.name}
                </p>
                <p className="body-copy mx-auto mt-2 max-w-md text-[14px] leading-[1.55] text-white/85 sm:text-[15.5px] lg:mx-0">
                  {slide.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed: CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="#mattress-offers"
              className="inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
            >
              Buy online
              <FiArrowRight className="text-[15px]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-[48px] items-center border border-white/45 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
            >
              Find in stores
            </Link>
          </div>

          {/* Fixed: carousel controls — arrows, dots, counter + progress bar */}
          <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous mattress"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                >
                  <FiChevronLeft className="text-[17px]" />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next mattress"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                >
                  <FiChevronRight className="text-[17px]" />
                </button>
              </div>

              <span aria-hidden className="h-5 w-px bg-white/20" />

              <div className="flex items-center gap-2.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? "w-7 bg-brand" : "w-2 bg-white/45 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>

              <span className="text-[12px] font-semibold tabular-nums tracking-[0.08em] text-white/60">
                0{active + 1}
                <span className="text-white/30"> / 0{slides.length}</span>
              </span>
            </div>

            {/* Per-slide autoplay progress — resets with each slide. */}
            {!reduce && (
              <div className="h-[2px] w-full max-w-[280px] overflow-hidden bg-white/15">
                <motion.span
                  key={active}
                  className="block h-full bg-brand"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY / 1000, ease: "linear" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Right: rotating floating mattress (a touch larger) ──────────── */}
        <div className="relative order-1 flex h-[240px] items-center justify-center sm:h-[300px] lg:order-2 lg:h-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={reduce ? false : { opacity: 0, x: 44, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, x: -44, scale: 0.94 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative aspect-square w-[min(100%,580px)]"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 580px, 76vw"
                className="object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
