"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EASE = [0.33, 1, 0.68, 1];
const AUTOPLAY_MS = 5600;
const FADE_S = 1.1;

/**
 * Full-bleed overlay hero carousel — same pattern as the mattress about/hero
 * band: photo fills the frame, copy sits left or right per slide, autoplay +
 * dots. Used on the homepage (viewport tall) and division overlay bands.
 *
 * Images use next/image and only the active + next slide mount at first so
 * production does not download every full-bleed frame on first paint.
 */
export default function OverlayHeroSlider({
  slides = [],
  asHero = false,
  /** `band` = 1916/821 aspect (division pages). `viewport` = under fixed header. */
  size = "band",
  className = "",
  autoplayMs = AUTOPLAY_MS,
  fadeDuration = FADE_S,
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const go = useCallback(
    (i) => setActive(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (reduce || slides.length < 2) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), autoplayMs);
    return () => clearTimeout(t);
  }, [active, reduce, slides.length, autoplayMs]);

  /*
   * Every slide's picture is mounted from the first render.
   *
   * This used to hold a `loaded` set — slide 0 and 1 to begin with, then the
   * current and next one added as the carousel advanced — and a slide whose
   * index was not in it rendered no <Image> at all. The saving was real but so
   * were the holes: jumping straight to the last slide on a dot painted the
   * copy over an empty frame while the picture was still being fetched, and
   * with `prefers-reduced-motion` the autoplay never runs, so `active` stays 0
   * and slides 2 and 3 were never added to the set at all — their images
   * simply never existed. The last slide was the one that showed it most,
   * because it is the furthest from where the set starts.
   *
   * Four viewport-sized photographs is a fair weight to carry for a hero that
   * is the first thing on the page; correctness wins over the saving here.
   * `priority` still marks only the first as the LCP candidate, so the rest
   * queue behind it rather than competing with it.
   */

  const fadeMs = useMemo(
    () => (reduce ? { duration: 0 } : { duration: fadeDuration, ease: EASE }),
    [reduce, fadeDuration]
  );
  const copyMs = useMemo(
    () =>
      reduce
        ? { duration: 0 }
        : { duration: fadeDuration * 0.85, ease: EASE },
    [reduce, fadeDuration]
  );

  if (!slides.length) return null;

  const multi = slides.length > 1;
  /* Desktop keeps the original full-bleed math. Mobile gets a taller usable
     frame so copy and photo both read (band aspect alone collapses to ~170px). */
  const frameClass =
    size === "viewport"
      ? "relative h-[min(78svh,620px)] min-h-[520px] w-full md:h-[calc(100svh-112px)] md:min-h-[calc(100svh-112px)]"
      : "relative h-[min(68svh,520px)] min-h-[420px] w-full md:h-auto md:min-h-0 md:aspect-[1916/821]";

  return (
    <section
      data-home-two-snap={size === "viewport" ? true : undefined}
      className={`relative w-full overflow-hidden bg-[#0c0c0c] ${
        size === "band" ? "mb-[6px]" : ""
      } ${className}`}
    >
      <div className={frameClass}>
        {slides.map((s, i) => {
          const on = i === active;
          const right = s.align === "right";
          const light = s.tone === "light";
          const primary = s.cta?.find((c) => c.primary) ?? s.cta?.[0];
          const Heading = on ? (asHero ? "h1" : "h2") : "p";

          return (
            <div key={s.id} className="absolute inset-0">
              <motion.div
                initial={false}
                animate={{
                  opacity: on ? 1 : 0,
                  scale: on ? 1 : 1.03,
                }}
                transition={fadeMs}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={s.image.src}
                  alt={on ? s.image.alt : ""}
                  fill
                  sizes="100vw"
                  quality={72}
                  priority={i === 0}
                  /* `eager` on all of them, not just the first: a lazy image
                     inside a slide sitting at opacity 0 is still in the
                     viewport, so the browser is free to defer it right up to
                     the moment the slide is revealed — which is exactly when
                     it is too late to fetch a viewport-sized photograph. */
                  loading="eager"
                  className={`object-cover ${
                    s.image.position || "object-center"
                  }`}
                />
              </motion.div>
              {s.breeze && !reduce ? (
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{
                    opacity: on ? [0.2, 0.35, 0.25] : 0,
                    x: on ? ["-4%", "3%", "-2%"] : 0,
                  }}
                  transition={
                    on
                      ? { duration: 10, repeat: Infinity, ease: "easeInOut" }
                      : fadeMs
                  }
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,rgba(140,197,255,0.22),transparent_55%)]"
                />
              ) : null}
              {!light ? (
                <>
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={fadeMs}
                    className={`pointer-events-none absolute inset-0 hidden md:block ${
                      right
                        ? "bg-gradient-to-l from-[#0c0c0c]/55 via-transparent to-transparent"
                        : "bg-gradient-to-r from-[#0b1528]/40 via-transparent to-transparent"
                    }`}
                  />
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={fadeMs}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1528]/75 via-[#0b1528]/35 to-transparent md:hidden"
                  />
                </>
              ) : null}
              <motion.div
                initial={false}
                animate={{
                  opacity: on ? 1 : 0,
                  y: on ? 0 : 10,
                }}
                transition={{
                  ...copyMs,
                  delay: reduce ? 0 : on ? 0.08 : 0,
                }}
                className={`shell pointer-events-none absolute inset-0 z-[1] flex items-end pb-16 md:items-center md:pb-0 ${
                  right ? "md:justify-end" : ""
                }`}
              >
                <div
                  className={`w-full max-w-[min(92vw,22rem)] sm:max-w-[min(90vw,34rem)] lg:max-w-[min(55vw,44rem)] ${
                    on ? "pointer-events-auto" : "pointer-events-none"
                  } ${right ? "md:text-right" : ""}`}
                  aria-hidden={!on}
                >
                  {(s.eyebrowStart || s.eyebrowEnd) && (
                    <div
                      className={`mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:mb-4 sm:gap-x-3 ${
                        right ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      {s.eyebrowStart ? (
                        <span
                          className={`text-[12px] font-bold uppercase tracking-[0.1em] sm:text-[15px] ${
                            light ? "text-ink" : "text-white"
                          }`}
                        >
                          {s.eyebrowStart}
                        </span>
                      ) : null}
                      {s.badge ? (
                        <Image
                          src={s.badge.src}
                          alt=""
                          width={s.badge.width ?? 420}
                          height={s.badge.height ?? 330}
                          sizes="88px"
                          quality={70}
                          className="h-8 w-auto shrink-0 -translate-y-[8%] sm:h-11"
                        />
                      ) : null}
                      {s.eyebrowEnd ? (
                        <span
                          className={`text-[12px] font-bold uppercase tracking-[0.1em] sm:text-[15px] ${
                            light ? "text-ink" : "text-white"
                          }`}
                        >
                          {s.eyebrowEnd}
                        </span>
                      ) : null}
                    </div>
                  )}
                  {/* `hero-heading` marks this as the hero role for the Theme
                      Control panel — it carries its own face, scale and weight,
                      separate from the section titles below the fold. */}
                  <Heading className="display hero-heading text-[1.7rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-white sm:text-[2.45rem] lg:text-[2.95rem]">
                    <span className="block whitespace-normal sm:whitespace-nowrap">
                      {s.headingLead}
                    </span>
                    <span className="block whitespace-normal font-bold text-brand sm:whitespace-nowrap">
                      {s.headingAccent}
                    </span>
                  </Heading>
                  {s.kicker ? (
                    <p className="mt-2 max-w-[28ch] text-[11px] font-semibold uppercase leading-snug tracking-[0.22em] text-white/80 sm:max-w-none sm:text-[12px] sm:tracking-[0.3em]">
                      {s.kicker}
                    </p>
                  ) : null}
                  {primary ? (
                    <Link
                      href={primary.href}
                      tabIndex={on ? 0 : -1}
                      className="mt-5 inline-flex h-[44px] items-center gap-2 bg-brand px-7 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark sm:h-[48px] sm:px-8"
                    >
                      {primary.label}
                      <FiArrowRight className="text-[15px]" />
                    </Link>
                  ) : null}
                </div>
              </motion.div>
            </div>
          );
        })}

        {multi ? (
          <div className="absolute inset-x-0 bottom-3 z-[2] flex items-center justify-center gap-3 sm:gap-4 lg:bottom-6">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white"
            >
              <FiChevronLeft className="text-[18px]" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === active ? "w-8 bg-brand" : "w-5 bg-white/45 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white"
            >
              <FiChevronRight className="text-[18px]" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
