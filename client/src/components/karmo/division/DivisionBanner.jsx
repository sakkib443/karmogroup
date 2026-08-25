"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Division hero — the shared carousel for every category page (Foam, HomeTex,
 * Mattress, Chemicals). Full-bleed, viewport-tall under the fixed 112px header
 * (same math as the homepage hero).
 *
 * Each slide arrives in a DIFFERENT arrangement, cycling through `LAYOUTS`:
 *   1. copy left  · picture right  — copy slides in from the left
 *   2. copy right · picture left   — copy rises up from below
 *   3. copy centred over a large centred picture — copy settles down from above
 * A slide can pin its own by setting `layout: "copy-left" | "copy-right" |
 * "stacked"` in the data; otherwise it takes the one at its index.
 *
 * Because the whole copy block now re-enters on every slide, the badge line,
 * headline and CTAs animate with it rather than standing still as they used to.
 * Carousel controls (arrows, dots, counter, progress) are optional. Mattress
 * hides them via `showControls: false` so the hero still autoplays clean.
 *
 * Only the CONTENT comes from props — every measurement, colour and animation
 * is fixed here, so editing this file changes the banner on all four pages at once.
 */

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#FF9A1F";
/* Matches homepage Hero — fills the screen under the fixed header. */
const VIEW_H = "h-[calc(100svh-112px+5px)] min-h-[calc(100svh-112px+5px)]";

/* Below `lg` everything is centred and stacked, so alignment only forks on
   desktop. `center` is the odd one out — it stays centred at every width.
   Note both split arrangements use `left`: in the second one the copy sits in
   the RIGHT column but its text still reads left-aligned, at the client's ask. */
const ALIGN = {
  left: {
    text: "lg:text-left",
    row: "lg:justify-start",
    measure: "lg:mx-0",
  },
  center: {
    text: "text-center",
    row: "justify-center",
    measure: "mx-auto",
  },
};

const LAYOUTS = [
  {
    id: "copy-left",
    align: "left",
    copyOrder: "lg:order-1",
    mediaOrder: "lg:order-2",
    copyIn: { opacity: 0, x: -48 },
    copyOut: { opacity: 0, x: 32 },
    mediaIn: { opacity: 0, x: 56, scale: 0.94 },
    mediaOut: { opacity: 0, x: -44, scale: 0.94 },
  },
  {
    id: "copy-right",
    /* Right-hand column, but the text itself stays left-aligned. */
    align: "left",
    copyOrder: "lg:order-2",
    mediaOrder: "lg:order-1",
    /* The one that comes up from underneath. */
    copyIn: { opacity: 0, y: 56 },
    copyOut: { opacity: 0, y: -36 },
    mediaIn: { opacity: 0, x: -56, scale: 0.94 },
    mediaOut: { opacity: 0, x: 44, scale: 0.94 },
  },
  {
    id: "stacked",
    align: "center",
    stacked: true,
    /* Picture on top, centred copy below it — the two never overlap, so the
       headline reads clean instead of fighting the product behind it. The
       picture drops in from above while the copy rises up to meet it. */
    copyIn: { opacity: 0, y: 48 },
    copyOut: { opacity: 0, y: -28 },
    mediaIn: { opacity: 0, y: -56, scale: 0.96 },
    mediaOut: { opacity: 0, y: 32, scale: 0.96 },
  },
];

function layoutFor(slide, index) {
  const pinned = slide?.layout && LAYOUTS.find((l) => l.id === slide.layout);
  return pinned ?? LAYOUTS[index % LAYOUTS.length];
}

/* ── The copy column: badge line, headline, rotating name/sub, CTAs ────────── */
function HeroCopy({ align, badge, eyebrowStart, eyebrowEnd, headline, slide, cta }) {
  const a = ALIGN[align];

  return (
    <div className={`text-center ${a.text}`}>
      <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${a.row}`}>
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

      <h1 className="display mt-4 text-[clamp(1.95rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]">
        {headline}
      </h1>

      {/* Min-height rather than a fixed slot: the block re-enters with each
          slide now, so this only has to stop a short sub-line from pulling the
          CTAs up relative to a long one. */}
      <div className="mt-5 min-h-[5.25rem] sm:min-h-[4.75rem]">
        <p
          className="display text-[15px] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[16px]"
          style={{ color: ACCENT }}
        >
          {slide?.name}
        </p>
        <p
          className={`body-copy mt-2 max-w-md text-[14px] leading-[1.55] text-white/85 sm:text-[15.5px] ${a.measure}`}
        >
          {slide?.sub}
        </p>
      </div>

      <div className={`mt-7 flex flex-wrap items-center justify-center gap-3 ${a.row}`}>
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
    </div>
  );
}

function HeroMedia({
  slide,
  className = "",
  sizes = "(min-width: 1024px) 640px, 76vw",
  shadow = true,
}) {
  if (!slide?.image) return null;
  return (
    <Image
      src={slide.image}
      alt={slide.alt}
      fill
      sizes={sizes}
      className={`object-contain ${shadow ? "drop-shadow-[0_28px_38px_rgba(0,0,0,0.45)]" : ""} ${className}`}
    />
  );
}

function SplitSidesHero({
  bg,
  badge,
  eyebrowStart,
  eyebrowEnd,
  headline,
  cta,
  slides,
  autoplay,
  showControls,
  reduce,
  active,
  go,
  slide,
  multi,
}) {
  const copyProps = {
    align: "center",
    badge,
    eyebrowStart,
    eyebrowEnd,
    headline,
    slide,
    cta,
  };

  const slideEase = { duration: 0.85, ease: EASE };
  const slideKey = slide?.id ?? active;
  /* Slide 1 from the right, 2 from the left, 3 from the right, … */
  const fromRight = active % 2 === 0;
  const offX = fromRight ? "110%" : "-110%";

  return (
    <section className={`relative w-full overflow-hidden bg-ink ${VIEW_H}`}>
      {/* Pure background — no wash, no blur. */}
      <Image
        src={bg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-center"
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slideKey}
          initial={reduce ? false : { x: offX, y: "-50%" }}
          animate={{ x: 0, y: "-50%" }}
          exit={reduce ? { x: 0, y: "-50%" } : { x: offX, y: "-50%" }}
          transition={slideEase}
          className={`pointer-events-none absolute top-1/2 z-[1] h-[78%] w-[min(50%,580px)] ${
            fromRight ? "right-0" : "left-0"
          }`}
        >
          <HeroMedia
            slide={slide}
            shadow={false}
            className="object-contain object-center mix-blend-screen"
            sizes="50vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideKey}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="pointer-events-auto w-full max-w-2xl"
          >
            <HeroCopy {...copyProps} />
          </motion.div>
        </AnimatePresence>
      </div>

      {multi && showControls && (
        <HeroControls
          slides={slides}
          active={active}
          go={go}
          autoplay={autoplay}
          reduce={reduce}
        />
      )}
    </section>
  );
}

function HeroControls({ slides, active, go, autoplay, reduce }) {
  return (
    <div className="absolute inset-x-0 bottom-6 z-[3] flex flex-col items-center gap-3 lg:bottom-8">
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
  );
}

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
  showControls = true,
  style,
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

  if (style === "split-sides") {
    return (
      <SplitSidesHero
        bg={bg}
        badge={badge}
        eyebrowStart={eyebrowStart}
        eyebrowEnd={eyebrowEnd}
        headline={headline}
        cta={cta}
        slides={slides}
        autoplay={autoplay}
        showControls={showControls}
        reduce={reduce}
        active={active}
        go={go}
        slide={slide}
        multi={multi}
      />
    );
  }

  const layout = layoutFor(slide, active);

  const copyProps = {
    align: layout.align,
    badge,
    eyebrowStart,
    eyebrowEnd,
    headline,
    slide,
    cta,
  };

  const motionCopy = {
    initial: reduce ? false : layout.copyIn,
    animate: { opacity: 1, x: 0, y: 0 },
    exit: reduce ? {} : layout.copyOut,
    transition: { duration: 0.55, ease: EASE },
  };

  const motionMedia = {
    initial: reduce ? false : layout.mediaIn,
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: reduce ? {} : layout.mediaOut,
    transition: { duration: 0.6, ease: EASE },
  };

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
          legible over the picture. */}
      {overlay === "warm" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3a250e]/85 via-[#8f5f1b]/60 to-[#caa23a]/45"
        />
      ) : overlay === "none" ? null : (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
      )}
      {overlay !== "none" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent"
        />
      )}

      <div className="shell relative z-[1] h-full">
        <AnimatePresence mode="wait" initial={false}>
          {layout.stacked ? (
            /* ── Arrangement 3: picture on top, centred copy beneath it ───── */
            <motion.div
              key={slide?.id ?? active}
              className="flex h-full flex-col items-center justify-center gap-0 py-8"
            >
              {/* No square box here, unlike the split arrangements: the product
                  cutouts are wider than they are tall, so a square would leave a
                  band of transparent padding under them and read as a gap above
                  the copy. Filling the free height and anchoring to the bottom
                  (`object-bottom`) sits the product right on top of the words. */}
              <motion.div
                {...motionMedia}
                className="relative min-h-0 w-full flex-1"
              >
                <HeroMedia
                  slide={slide}
                  className="object-bottom"
                  sizes="(min-width: 1024px) 760px, 92vw"
                />
              </motion.div>

              {/* Pulled up hard: the product PNGs carry their own transparent
                  padding along the bottom edge, which no amount of closing the
                  flex gap can remove — the copy has to ride up into it. */}
              <motion.div
                {...motionCopy}
                className="-mt-28 w-full shrink-0 sm:-mt-32 lg:-mt-44"
              >
                <HeroCopy {...copyProps} />
              </motion.div>
            </motion.div>
          ) : (
            /* ── Arrangements 1 & 2: two columns, sides swapped ───────────── */
            <motion.div
              key={slide?.id ?? active}
              className="flex h-full flex-col items-center justify-center gap-8 py-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-0"
            >
              <motion.div
                {...motionCopy}
                className={`order-2 ${layout.copyOrder}`}
              >
                <HeroCopy {...copyProps} />
              </motion.div>

              <motion.div
                {...motionMedia}
                className={`relative order-1 flex h-[min(42svh,320px)] items-center justify-center sm:h-[min(46svh,380px)] lg:h-full lg:max-h-none ${layout.mediaOrder}`}
              >
                <span className="relative block aspect-square w-[min(100%,min(72svh,640px))]">
                  <HeroMedia slide={slide} />
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Carousel controls — pinned to the section, so they hold still while the
          arrangements swap around them. Mattress opts out via showControls. */}
      {multi && showControls && (
        <div className="absolute inset-x-0 bottom-6 z-[2] flex flex-col items-center gap-3 lg:bottom-8">
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
    </section>
  );
}
