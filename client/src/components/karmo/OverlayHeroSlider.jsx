"use client";

import { useState, useEffect, useCallback } from "react";
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

  if (!slides.length) return null;

  const multi = slides.length > 1;
  const fadeMs = reduce
    ? { duration: 0 }
    : { duration: fadeDuration, ease: EASE };
  const copyMs = reduce
    ? { duration: 0 }
    : { duration: fadeDuration * 0.9, ease: EASE };
  const frameClass =
    size === "viewport"
      ? "relative h-[calc(100svh-112px)] min-h-[calc(100svh-112px)] w-full"
      : "relative aspect-[1916/821] w-full";

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
              <motion.img
                src={s.image.src}
                alt={on ? s.image.alt : ""}
                width={s.image.width}
                height={s.image.height}
                initial={false}
                animate={{
                  opacity: on ? 1 : 0,
                  scale: on ? 1 : 1.04,
                }}
                transition={fadeMs}
                className={`absolute inset-0 h-full w-full object-cover will-change-transform ${
                  s.image.position || "object-center"
                }`}
              />
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
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={fadeMs}
                  className={`pointer-events-none absolute inset-0 ${
                    right
                      ? "bg-gradient-to-l from-[#0c0c0c]/55 via-transparent to-transparent"
                      : "bg-gradient-to-r from-[#0b1528]/40 via-transparent to-transparent"
                  }`}
                />
              ) : null}
              <motion.div
                initial={false}
                animate={{
                  opacity: on ? 1 : 0,
                  y: on ? 0 : 14,
                }}
                transition={{
                  ...copyMs,
                  delay: reduce ? 0 : on ? 0.1 : 0,
                }}
                className={`shell pointer-events-none absolute inset-0 z-[1] flex items-center ${
                  right ? "justify-end" : ""
                }`}
              >
                <div
                  className={`max-w-[min(92vw,22rem)] sm:max-w-[min(90vw,34rem)] lg:max-w-[min(55vw,44rem)] ${
                    on ? "pointer-events-auto" : "pointer-events-none"
                  } ${right ? "text-right" : ""}`}
                  aria-hidden={!on}
                >
                  {(s.eyebrowStart || s.eyebrowEnd) && (
                    <div
                      className={`mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mb-4 ${
                        right ? "justify-end" : "justify-start"
                      }`}
                    >
                      {s.eyebrowStart ? (
                        <span
                          className={`text-[13px] font-bold uppercase tracking-[0.1em] sm:text-[15px] ${
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
                          className="h-9 w-auto shrink-0 -translate-y-[8%] sm:h-11"
                        />
                      ) : null}
                      {s.eyebrowEnd ? (
                        <span
                          className={`text-[13px] font-bold uppercase tracking-[0.1em] sm:text-[15px] ${
                            light ? "text-ink" : "text-white"
                          }`}
                        >
                          {s.eyebrowEnd}
                        </span>
                      ) : null}
                    </div>
                  )}
                  <Heading className="display text-[1.95rem] font-light uppercase leading-[1.08] tracking-[0.01em] text-white sm:text-[2.45rem] lg:text-[2.95rem]">
                    <span className="block whitespace-nowrap">{s.headingLead}</span>
                    <span className="block whitespace-nowrap font-bold text-brand">
                      {s.headingAccent}
                    </span>
                  </Heading>
                  {s.kicker ? (
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-white/80">
                      {s.kicker}
                    </p>
                  ) : null}
                  {primary ? (
                    <Link
                      href={primary.href}
                      tabIndex={on ? 0 : -1}
                      className="mt-5 inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
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
          <div className="absolute inset-x-0 bottom-4 z-[2] flex items-center justify-center gap-4 lg:bottom-6">
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
                  className={`h-[3px] rounded-full transition-all duration-300 ${
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
