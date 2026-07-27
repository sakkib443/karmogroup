"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiAward,
  FiUsers,
  FiStar,
  FiMapPin,
  FiFeather,
  FiTruck,
} from "react-icons/fi";

/**
 * The trust strip — six reasons to buy, the compact band a lot of retail sites
 * run right under the hero.
 *
 * The layout the client sent was lifted from an Indian mattress site, so its
 * claims are that company's, not Karmo's: "5k+ Stores Pan India", "Million
 * families worldwide", "Recognised Super Brand". Those have been rewritten to
 * what Karmo can actually stand behind, and the ones still unconfirmed are
 * flagged in HOMEPAGE-STATUS.md §6.8. Two are solid: the 1965 founding date,
 * and Free Delivery (which Karmo's own campaign posters already advertise).
 */
const trustPoints = [
  {
    icon: FiAward,
    title: "A legacy of 60 years",
    note: "Of comfort since 1965",
  },
  {
    icon: FiUsers,
    title: "Trusted by families",
    note: "Across Bangladesh",
  },
  {
    icon: FiStar,
    title: "Market leader in foam",
    note: "By volume, nationwide",
  },
  {
    icon: FiMapPin,
    title: "Stockists nationwide",
    note: "In cities across the country",
  },
  {
    icon: FiFeather,
    title: "Natural & sustainable",
    note: "Materials and process",
  },
  {
    icon: FiTruck,
    title: "Free delivery",
    note: "Available on every order",
  },
];

// The two curves the rest of the page moves on.
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

// Trust-strip carousel timings. The slide has to finish well inside the
// autoplay gap, or the seamless snap-back would collide with the next step.
const AUTOPLAY_MS = 2000;
const SLIDE_MS = 650;
const GAP_REM = 1.25; // matches the flex `gap` below

function TrustCard({ item, position }) {
  return (
    // Stacked rather than icon-beside-label. The horizontal version was built
    // for a narrow column; with the full page width to work in, the text no
    // longer has to be truncated to fit and the card can carry proper weight.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-[0_26px_50px_-28px_rgba(34,34,34,0.32)] sm:p-7">
      {/* Index in the corner, the same numbering the section headings use. */}
      <span
        aria-hidden="true"
        className="display absolute right-5 top-5 text-[11px] font-bold tabular-nums tracking-[0.1em] text-ink/15 transition-colors duration-500 group-hover:text-brand/35"
      >
        {String(position).padStart(2, "0")}
      </span>

      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/[0.07] transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
        <item.icon className="text-[24px] text-brand transition-colors duration-500 group-hover:text-white" />
      </span>

      <h3 className="display mt-7 text-[1.05rem] font-bold leading-[1.3] text-ink">
        {item.title}
      </h3>

      <p className="mb-7 mt-2 text-[13px] leading-[1.7] text-ink/55">
        {item.note}
      </p>

      {/* mt-auto keeps this on the floor of the card, so the rules line up
          across the row even when one note runs to two lines. */}
      <span className="mt-auto block h-px w-full bg-ink/[0.07]">
        <span className="block h-px w-0 bg-brand transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
      </span>
    </article>
  );
}

export default function Capabilities({ heading }) {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  // Four in view on a desktop — the four main points the client asked to lead
  // with — and the remaining two arrive one at a time as the rail advances.
  // Below 1280 the shell is too narrow for four without the titles wrapping
  // awkwardly, so it steps down. Starts at four so the server and the first
  // client render agree; the effect narrows it on smaller screens.
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const steps = [
      { query: window.matchMedia("(min-width: 1280px)"), value: 4 },
      { query: window.matchMedia("(min-width: 1024px)"), value: 3 },
      { query: window.matchMedia("(min-width: 640px)"), value: 2 },
    ];
    const sync = () => {
      const hit = steps.find(({ query }) => query.matches);
      setPerView(hit ? hit.value : 1);
    };
    sync();
    steps.forEach(({ query }) => query.addEventListener("change", sync));
    return () =>
      steps.forEach(({ query }) => query.removeEventListener("change", sync));
  }, []);

  // Advance one card every couple of seconds.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, paused]);

  // Seamless wrap: the track carries two copies of the list, so once it has
  // slid a full lap (index === length) the view is identical to the start.
  // Let that last slide finish, then snap back to zero with the transition off.
  useEffect(() => {
    if (index !== trustPoints.length) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index]);

  // Re-arm the transition on the frame after a silent snap.
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const slide = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})`;
  const shift = `calc(-${index} * (${slide} + ${GAP_REM}rem))`;
  const doubled = [...trustPoints, ...trustPoints];

  return (
    // A shade lighter than the linen panel, and on the same cool hue, so the
    // three light tones on the page step white → this → linen rather than
    // mixing a warm off-white in with cool ones.
    <section className="relative overflow-hidden bg-[#f7f8fa] py-16 md:py-24">
      <div className="shell relative">
        {/* The illustration is bounded to this block rather than to the whole
            section, so it stays beside the heading and no longer runs down
            behind the cards below. */}
        <div className="relative">
          {/* The cutaway illustration. A CSS background rather than <Image>
              because it is decoration: if the file is ever missing this simply
              shows nothing, where next/image would surface a broken request.

              The mask fades it out towards the left, which both keeps the copy
              column clean and dissolves the drawing's own leader labels.

              The drawing is a wide 1.79:1, so `contain` inside a box the height
              of the heading was fitting it to that height and leaving a fifth
              of the box empty. The box is therefore pushed past the heading top
              and bottom, and widened.

              Height is what limits it, so the section's vertical padding and
              the gap above the cards were both opened up to give the box more
              room to take. It reaches to about 32px short of the cards; going
              further would put the drawing behind them, where the opaque cards
              would clip it mid-illustration. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 -top-20 right-0 hidden w-[58%] bg-[url('/images/graphics/mattress-cutaway-diagram.png')] bg-contain bg-right bg-no-repeat opacity-[0.22] lg:block"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, #000 45%, #000 78%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, #000 45%, #000 78%, transparent 100%)",
            }}
          />

          {/* Only the copy is held clear of the drawing. The cards used to sit
              inside this same 62% column, which is why six of them were being
              squeezed into two thirds of the page and came out tiny. */}
          <div className="relative lg:pr-[38%]">
        {/* Home 03 passes a unified SectionHeading; Home 01 keeps its original
            badge-and-headline block. */}
        {heading ?? (
          <motion.div
            variants={group}
            {...reveal}
            viewport={once}
            className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16"
          >
            {/* Badge sits opposite the headline, with the crosshair rule from
                the reference marking the corner. */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-0 hidden h-24 w-40 lg:block"
              >
                <span className="absolute right-0 top-0 block h-px w-full bg-ink/15" />
                <span className="absolute right-10 top-0 block h-24 w-px bg-ink/15" />
              </span>

              <span className="block overflow-hidden">
                <motion.span
                  variants={line}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Who we are
                </motion.span>
              </span>
            </div>

            <div>
              <h2 className="display text-[2rem] font-bold leading-[1.14] tracking-[-0.02em] text-ink sm:text-[2.6rem] lg:text-[3rem]">
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span variants={line} className="block">
                    Built On Six Decades
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <motion.span variants={line} className="block text-brand">
                    Of Making Comfort
                  </motion.span>
                </span>
              </h2>

              <span className="mt-7 block max-w-lg overflow-hidden">
                <motion.span
                  variants={line}
                  className="block text-[15px] leading-[1.9] text-ink/65"
                >
                  Karmo has manufactured in Bangladesh since 1965. From the foam
                  inside a sofa to the mattress on the bed and the adhesive
                  holding it together, it is made in our own plants — and held
                  to one standard.
                </motion.span>
              </span>
            </div>
          </motion.div>
        )}
          </div>
        </div>

        {reduceMotion ? (
          // No autoplay when motion is reduced — the whole set is simply laid
          // out at once.
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trustPoints.map((item, i) => (
              <TrustCard key={item.title} item={item} position={i + 1} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={once}
            transition={{ duration: 0.7, ease: SETTLE }}
            className="mt-14 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div
              className="flex"
              style={{
                gap: `${GAP_REM}rem`,
                transform: `translateX(${shift})`,
                transition: animate
                  ? `transform ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)`
                  : "none",
              }}
            >
              {doubled.map((item, i) => (
                <div
                  key={`${item.title}-${i}`}
                  aria-hidden={i >= trustPoints.length}
                  className="shrink-0"
                  style={{ flexBasis: slide }}
                >
                  <TrustCard
                    item={item}
                    position={(i % trustPoints.length) + 1}
                  />
                </div>
              ))}
            </div>

            {/* Position markers. Decorative — the rail advances on its own and
                every card is reachable by waiting, so these report progress
                rather than offering a control, and are hidden from assistive
                tech accordingly. */}
            <div
              aria-hidden="true"
              className="mt-7 flex items-center gap-2"
            >
              {trustPoints.map((item, i) => (
                <span
                  key={item.title}
                  className={`h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    i === index % trustPoints.length
                      ? "w-7 bg-brand"
                      : "w-1.5 bg-ink/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
