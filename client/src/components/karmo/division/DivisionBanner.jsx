"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Division hero — the shared carousel for every category page (Foam, HomeTex,
 * Mattress, Chemicals). Full-bleed, viewport-tall under the fixed 112px header
 * (same math as the homepage hero). The whole left column is a FIXED scaffold:
 * the #1 badge line, the headline and the CTAs never move. Only the model name
 * + sub-heading (in a fixed-height, absolutely positioned slot so nothing below
 * it can shift) and the floating product on the right rotate. Auto-plays with a
 * slide/fade; arrows, dots and a per-slide progress bar give explicit manual
 * control.
 *
 * Only the CONTENT comes from props — every measurement, colour and animation
 * is fixed here, so editing this file changes the banner on all four pages at once.
 */

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#FF9A1F";
/* Matches homepage Hero — fills the screen under the fixed header. */
const VIEW_H = "h-[calc(100svh-112px+5px)] min-h-[calc(100svh-112px+5px)]";

export default function DivisionBanner({
  bg,
  /* "dark" (default) tints the background near-black like the mattress hero;
     "warm" lays a gold/amber wash over it, for the foam page's signature look.
     A named variant (same idea as FoamPromise's filmMode) so the choice stays a
     data flag while the treatment itself lives here, shared by all four pages. */
  overlay = "dark",
  badge,
  eyebrowStart = "Bangladesh’s",
  eyebrowEnd,
  headline,
  cta = [],
  slides = [],
  autoplay = 4800,
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const go = useCallback(
    (i) => setActive(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  /* Timer keyed to `active`, so any manual nav restarts the countdown and keeps
     the progress bar in step. */
  useEffect(() => {
    if (reduce || slides.length < 2) return undefined;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % slides.length),
      autoplay
    );
    return () => clearTimeout(t);
  }, [active, reduce, slides.length, autoplay]);

  const slide = slides[active] ?? slides[0];
  const multi = slides.length > 1;

  return (
    <section className={`relative w-full overflow-hidden bg-ink ${VIEW_H}`}>
      <Image
        src={bg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Background wash. `warm` is the foam page's gold treatment; `dark` is the
          mattress default. The left-to-right dark fade under both keeps the copy
          (which sits on the left) legible over the picture. */}
      {overlay === "warm" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3a250e]/85 via-[#8f5f1b]/60 to-[#caa23a]/45"
        />
      ) : (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
      />

      <div className="shell relative z-[1] flex h-full flex-col items-center justify-center gap-8 py-14 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-0">
        {/* ── Left: fixed scaffold, only the name/sub slot rotates ─────────── */}
        <div className="order-2 lg:order-1">
          {/* Fixed: #1 badge line */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              {eyebrowStart}
            </span>
            {badge && (
              <Image
                src={badge.src}
                alt=""
                width={badge.width}
                height={badge.height}
                className="h-9 w-auto shrink-0 -translate-y-[8%] sm:h-11"
              />
            )}
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              {eyebrowEnd}
            </span>
          </div>

          {/* Fixed: main headline (same on every slide) */}
          <h1 className="display mt-4 text-[clamp(1.95rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]">
            {headline}
          </h1>

          {/* Rotating: model name + sub-heading.
              Fixed-height, absolutely-positioned slot → the CTAs below NEVER move. */}
          <div className="relative mt-5 h-[5.25rem] sm:h-[4.75rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide?.id ?? active}
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
                  {slide?.name}
                </p>
                <p className="body-copy mx-auto mt-2 max-w-md text-[14px] leading-[1.55] text-white/85 sm:text-[15.5px]">
                  {slide?.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed: CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {cta.map((c) =>
              c.primary ? (
                <Link
                  key={`${c.href}-${c.label}`}
                  href={c.href}
                  className="inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
                >
                  {c.label}
                  <FiArrowRight className="text-[15px]" />
                </Link>
              ) : (
                <Link
                  key={`${c.href}-${c.label}`}
                  href={c.href}
                  className="inline-flex h-[48px] items-center border border-white/45 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                >
                  {c.label}
                </Link>
              )
            )}
          </div>

          {/* Fixed: carousel controls — arrows, dots, counter + progress bar.
              Only shown when there is more than one slide. */}
          {multi && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(active - 1)}
                    aria-label="Previous slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                  >
                    <FiChevronLeft className="text-[17px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(active + 1)}
                    aria-label="Next slide"
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
                    transition={{ duration: autoplay / 1000, ease: "linear" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: rotating floating product (a touch larger) ───────────── */}
        <div className="relative order-1 flex h-[min(42svh,320px)] items-center justify-center sm:h-[min(46svh,380px)] lg:order-2 lg:h-full lg:max-h-none">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide?.id ?? active}
              initial={reduce ? false : { opacity: 0, x: 44, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, x: -44, scale: 0.94 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative aspect-square w-[min(100%,min(72svh,640px))]"
            >
              {slide?.image && (
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1024px) 640px, 76vw"
                  className="object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.45)]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
