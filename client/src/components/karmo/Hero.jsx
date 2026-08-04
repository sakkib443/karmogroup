"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Montserrat } from "next/font/google";
import {
  FiArrowRight,
  FiArrowLeft,
  FiArrowDown,
  FiArrowUpRight,
} from "react-icons/fi";

/**
 * TRIAL — the hero headline only, so Montserrat can be judged against the
 * Plus Jakarta Sans every other heading on the page still uses.
 *
 * Montserrat is the closest free face to the Gotham in the company profile:
 * the same geometric build and much the same width, and it carries nine
 * weights, so the thin setting the client's screenshot shows is available.
 * Gotham itself is licensed by Monotype, and a web licence is sold separately
 * from the desktop one the profile was designed with.
 *
 * To adopt it for the whole site, delete this and set BRAND_FONT_HEADING in
 * src/config/brand.ts instead — that is the one place a typeface should be
 * named. To drop it, remove this and the `font-trial` class below.
 */
const trial = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
  variable: "--font-trial",
  display: "swap",
});

const slides = [
  {
    id: "hometex",
    index: "01",
    eyebrow: "HomeTex / Bedding",
    titleLight: "Where comfort",
    titleBold: "settles in",
    // "woven" was wrong here — pillows and cushions are filled, not woven.
    subtitle:
      "Bed sheets, comforters, pillows and cushions — the layers that finish a bedroom.",
    href: "/hometex",
    image: "/karmo/images/hero/slide-1-hometex-couple.png",
    alt: "Couple reading together on a jute rug beside a bed dressed in Karmo HomeTex bedding",
  },
  {
    id: "mattress",
    index: "02",
    eyebrow: "Mattress",
    titleLight: "Rest, built",
    titleBold: "to last",
    subtitle:
      "EuroTop, pocket spring, orthopaedic and memory foam mattresses, made for every kind of sleep.",
    href: "/mattress",
    image: "/karmo/images/hero/slide-2-mattress-suite.png",
    alt: "Quilted Karmo euro-top mattress on a low walnut bed frame in a sunlit bedroom",
  },
  {
    id: "foam",
    index: "03",
    eyebrow: "Foam",
    titleLight: "Comfort that",
    titleBold: "starts within",
    subtitle:
      "Furniture and upholstery foam, footwear, automotive and acoustic grades — engineered in Bangladesh since 1965.",
    href: "/foam",
    // Upholstery foam is the material inside the sofa, so the foam slide shows
    // the living-room scene; the bedroom scene stays with Mattress above.
    image: "/karmo/images/hero/slide-3-foam-livingroom.png",
    alt: "Sunlit living-room corner with a cream bouclé sofa built on Karmo upholstery foam",
  },
  // Three slides, one per supplied image. Chemicals & Polymers is reached
  // from the nav instead — add it here as "04" if a fourth image arrives.
];

const AUTOPLAY_MS = 7000;

// The incoming image is split into vertical panels that rise one after the
// other, so the picture assembles itself rather than sliding in as a slab.
// Fewer panels reads as a plain wipe; more turns into a gimmick.
const PANELS = 5;
const PANEL_MS = 1100;
const PANEL_STAGGER_MS = 90;
const REVEAL_MS = PANEL_MS + PANEL_STAGGER_MS * (PANELS - 1);

// The assembled image drifts from 100% to 108% across its turn.
const PANZOOM_MS = 10000;
const PANZOOM_TO = 1.08;

// Every slide after the opening one simply dissolves.
const CROSSFADE_MS = 900;

// power4.inOut: slow to leave, fast through the middle, long to settle.
const POWER4 = [0.76, 0, 0.24, 1];

// Each line sits in an overflow-hidden sleeve and slides up out of it, so the
// text is uncovered rather than faded — the detail that separates a premium
// hero from a default one.
const lineRise = {
  hidden: { y: "115%" },
  show: {
    y: "0%",
    transition: { duration: 1.5, ease: POWER4 },
  },
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  // The panel build is an arrival moment for the page, not a way of moving
  // between slides. It plays once on load; every change after it dissolves.
  const [opening, setOpening] = useState(true);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((next) => {
    setOpening(false);
    setIndex(next);
  }, []);

  const paginate = useCallback((step) => {
    setOpening(false);
    setIndex((current) => (current + step + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paginate, index]);

  const slide = slides[index];

  // Copy waits for the panels on the opening slide, but follows straight
  // behind the dissolve afterwards.
  const copyStagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: opening ? 0.85 : 0.25,
      },
    },
  };

  return (
    // Negative margin cancels the layout's header offset so the hero runs
    // under the fixed bar. Keep both numbers in step with the header height:
    // 80px bar, plus the 40px utility strip from lg up.
    //
    // Height tracks a 16:9 ratio (56.25vw) so a 16:9 hero image fills the frame
    // with no side-cropping on a normal laptop or desktop, whatever the exact
    // window shape. It is capped at the viewport height so it can never
    // overflow the screen, with a floor so it stays usable on small phones.
    <section
      className="relative -mt-20 overflow-hidden bg-shade-deep lg:-mt-30"
      style={{ height: "max(620px, min(100svh, 56.25vw))" }}
    >
      {/* Imagery. The incoming picture is cut into vertical panels that rise
          from the bottom in sequence, so it builds across the frame instead
          of arriving as one moving slab. Each panel holds its own slice of
          the same image, offset so the seams line back up into one picture.
          The outgoing slide simply waits underneath — nothing fades, so the
          join never goes muddy. Once assembled the whole thing drifts on a
          slow pan-zoom for the rest of its turn. */}
      {/* `initial` left on so the opening slide plays its build on load. */}
      <AnimatePresence>
        <motion.div
          key={slide.id}
          // Must start at scale 1 for the drift to have somewhere to travel;
          // `initial={false}` would park it at the end value immediately.
          // Opening slide is already opaque — the panels do the revealing.
          // Later slides fade up over the one they are replacing.
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { scale: 1, opacity: opening ? 1 : 0 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { scale: PANZOOM_TO, opacity: 1 }
          }
          // Hold the outgoing slide at full opacity until the incoming one has
          // covered it, then drop it. Animating opacity 1 -> 1 is a no-op, so
          // framer would treat exit as already complete and unmount it
          // immediately — leaving a bare gap between the two slides.
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  transition: { duration: 0.01, delay: CROSSFADE_MS / 1000 },
                }
          }
          transition={
            reduceMotion
              ? { duration: 0.35 }
              : {
                  scale: { duration: PANZOOM_MS / 1000, ease: "linear" },
                  opacity: { duration: CROSSFADE_MS / 1000, ease: "easeInOut" },
                }
          }
          className="absolute inset-0"
        >
          {opening && !reduceMotion ? (
            // Split only while the opening build is running. Assembled, the
            // panels are indistinguishable from the single image below, so
            // dropping back to one element afterwards is seamless — and
            // avoids painting the same large picture five times for the rest
            // of the visit.
            Array.from({ length: PANELS }).map((_, panel) => (
              <motion.div
                key={panel}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: PANEL_MS / 1000,
                  delay: (panel * PANEL_STAGGER_MS) / 1000,
                  ease: POWER4,
                }}
                className="absolute inset-y-0 overflow-hidden"
                style={{
                  left: `${(panel * 100) / PANELS}%`,
                  width: `${100 / PANELS}%`,
                }}
              >
                {/* Full-width image pulled left so this panel frames its own
                    slice; together the panels reconstruct one picture. */}
                <div
                  className="absolute inset-y-0"
                  style={{
                    left: `${-panel * 100}%`,
                    width: `${PANELS * 100}%`,
                  }}
                >
                  <Image
                    src={slide.image}
                    alt={panel === 0 ? slide.alt : ""}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="hero-veil absolute inset-0" />

      {/* Copy */}
      <div className="shell relative flex h-full items-center">
        <motion.div
          key={slide.id}
          variants={copyStagger}
          initial="hidden"
          animate="show"
          className="hero-copy max-w-2xl pb-24"
        >
          <span className="block overflow-hidden">
            <motion.span
              variants={lineRise}
              className="flex items-center gap-4"
            >
              <span className="h-px w-14 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/85">
                {slide.eyebrow}
              </span>
            </motion.span>
          </span>

          {/* Two registers rather than one: a quiet lead-in line, then the
              statement. The first line is sized in `em` so it stays at the same
              proportion of the headline across all three breakpoints.

              Set all-caps, like every other label in the hero. Caps fill the
              line box in a way mixed case does not, so three things are pulled
              back to keep the block the same visual weight it had in title
              case: the size drops about a tenth, the near-negative tracking
              opens up (caps need air between letters where lowercase does
              not), and the leading tightens — with no descenders to clear,
              0.98 left the two lines looking loose. */}
          {/* One weight for both lines, with size doing the work — the two
              registers are a small line over a big one, not a thin line over a
              fat one. That is how the face is set in the company profile the
              client sent, and light caps at this size need the extra tracking
              or the letters close up on each other.

              Both the family and the weight carry `!`. globals.css sets
              `* { font-family: … !important }` and `h1 { font-weight: 600 }`
              outside any cascade layer, and unlayered rules beat layered ones
              — so a plain Tailwind utility loses to both no matter how
              specific it looks. */}
          <h1
            className={`display ${trial.variable} [font-family:var(--font-trial),sans-serif]! mt-8 text-[2.7rem] font-light! uppercase leading-[1.02] tracking-[0.03em] text-white sm:text-[3.8rem] lg:text-[4.9rem]`}
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.span
                variants={lineRise}
                className="block text-[0.6em] leading-[1.1] tracking-[0.05em] text-white/85"
              >
                {slide.titleLight}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={lineRise} className="block">
                {slide.titleBold}
              </motion.span>
            </span>
          </h1>

          {/* Caps again, so the hero has no mixed-case type left in it. A
              running sentence set this way needs more help than a label does:
              smaller, tracked out, and on looser leading, or the line turns
              into an unbroken wall of rectangles. */}
          <span className="mt-8 block max-w-lg overflow-hidden">
            <motion.span
              variants={lineRise}
              className="body-copy block text-[12.5px] uppercase leading-[1.95] tracking-[0.07em] text-white/70 md:text-[13.5px]"
            >
              {slide.subtitle}
            </motion.span>
          </span>

          <span className="mt-11 block overflow-hidden">
            <motion.span
              variants={lineRise}
              className="flex flex-wrap items-center gap-4"
            >
            <Link
              href={slide.href}
              className="btn-primary group inline-flex items-center gap-3 rounded-full bg-brand px-9 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
            >
              Discover more
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Padding is asymmetric so the circle sits flush inside the pill
                and the button still matches the primary's height. */}
            <Link
              href="/find-store"
              className="btn-secondary group inline-flex items-center gap-4 rounded-full border border-white/30 py-1.5 pl-8 pr-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
            >
              Find a store
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:rotate-45">
                <FiArrowUpRight className="text-base" />
              </span>
            </Link>
            </motion.span>
          </span>
        </motion.div>
      </div>

      {/* Controls rail, sharing the page gutter so it lines up with the copy */}
      <div className="shell pointer-events-none absolute inset-x-0 bottom-9">
        <div className="flex items-end justify-between">
          <div className="pointer-events-auto flex items-center gap-5">
            <span className="display text-xl font-bold text-white">
              {slide.index}
            </span>

            {/* Bar fills across the dwell time, so the slider reads as paced
                rather than arbitrary. Keyed on index to restart each slide. */}
            <div className="h-px w-28 bg-white/25">
              <motion.div
                key={slide.id}
                className="h-px bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            <span className="text-[11px] font-medium tracking-wider text-white/45">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <div className="pointer-events-auto flex gap-3">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
            >
              <FiArrowLeft />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
            >
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Division switcher */}
      <ul className="shell pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 lg:block">
        {/* Sits over the open part of the picture now that the scrim no
            longer reaches this far, so it carries its own shadow. */}
        <div className="hero-copy pointer-events-auto ml-auto w-fit space-y-5 text-right">
          {slides.map((item, itemIndex) => (
            <li key={item.id}>
              <button
                onClick={() => goTo(itemIndex)}
                aria-current={itemIndex === index}
                className={`group inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 ${
                  itemIndex === index
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.eyebrow}
                <span
                  className={`h-px transition-all duration-500 ${
                    itemIndex === index
                      ? "w-10 bg-brand"
                      : "w-4 bg-white/30 group-hover:w-7"
                  }`}
                />
              </button>
            </li>
          ))}
        </div>
      </ul>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-9 left-1/2 hidden -translate-x-1/2 md:block">
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="hero-copy flex flex-col items-center gap-2 text-white/65"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.28em]">
            Scroll
          </span>
          <FiArrowDown className="text-sm" />
        </motion.div>
      </div>
    </section>
  );
}
