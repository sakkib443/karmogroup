"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiPlay, FiX, FiArrowLeft, FiArrowRight, FiVolume2 } from "react-icons/fi";

/**
 * Labels come from Karmo's own reference build, not from watching the files —
 * index.html names the two TVCs, and product-Foam.html captions each of the
 * four short clips. Worth confirming against the footage before launch.
 */
const reels = [
  {
    src: "/videos/tvc-mattress.mp4",
    title: "Karmo Mattress TVC",
    tag: "Mattress",
    blurb: "The full commercial, start to finish.",
    length: "1:02",
  },
  {
    src: "/videos/reel-4.mp4",
    title: "High-grade spring system",
    tag: "Inside the product",
    blurb: "Pocket springs that answer to each sleeper.",
    length: "0:06",
  },
  {
    src: "/videos/reel-3.mp4",
    title: "Motion isolation",
    tag: "Inside the product",
    blurb: "One side moves, the other stays still.",
    length: "0:06",
  },
  {
    src: "/videos/reel-1.mp4",
    title: "Certiguard protection",
    tag: "Inside the product",
    blurb: "An antimicrobial layer, worked into the build.",
    length: "0:04",
  },
  {
    src: "/videos/reel-2.mp4",
    title: "Lab tested",
    tag: "Quality",
    blurb: "Compression and wear, measured every batch.",
    length: "0:04",
  },
  {
    src: "/videos/tvc-foam.mp4",
    title: "Karmo Foam TVC",
    tag: "Foam",
    blurb: "Where the group started, on film.",
    length: "0:20",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

// Both the slide width and the step have to agree on the gap — one source.
const GAP_REM = 1.25;

// Advances every two seconds. The track transition below is kept shorter
// than this so each slide comes to rest before the next step begins —
// otherwise the rail never stops moving and the hover preview is unusable.
const AUTOPLAY_MS = 2000;
const SLIDE_MS = 700;

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

function ReelCard({ reel, onOpen, reduceMotion, width }) {
  const videoRef = useRef(null);

  // Preview plays silently on hover and rewinds on the way out, so a card
  // always starts from its opening frame.
  const preview = (playing) => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    if (playing) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => preview(true)}
      onMouseLeave={() => preview(false)}
      onFocus={() => preview(true)}
      onBlur={() => preview(false)}
      style={{ flex: `0 0 ${width}` }}
      className="group relative block text-left"
    >
      {/* The frame is what scales, so the whole card grows without disturbing
          the track geometry the carousel measures against. */}
      <span className="relative block aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-[0_18px_40px_-24px_rgba(34,34,34,0.5)] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:shadow-[0_40px_70px_-30px_rgba(34,34,34,0.6)]">
        <video
          ref={videoRef}
          src={reel.src}
          muted
          loop
          playsInline
          // Only the first frame is fetched up front; the rest streams when a
          // card is hovered or opened.
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.14]"
        />

        {/* Deepens on hover so the caption keeps its footing once the copy
            grows into the space. */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 transition-opacity duration-700 group-hover:from-black/95 group-hover:via-black/30" />

        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 transition-colors duration-500 group-hover:ring-white/40" />

        <span className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            {reel.tag}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-white/85">
            {reel.length}
          </span>
        </span>

        {/* Play glyph swells, then hands over to the running preview. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-150 group-hover:opacity-0">
          <FiPlay className="ml-0.5 text-xl text-white" />
        </span>

        <span className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
          <span className="display block text-[1.05rem] font-bold leading-snug text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
            {reel.title}
          </span>

          {/* Blurb is folded away until the card is picked out — grid-rows
              animates height without needing a fixed value. */}
          <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr]">
            <span className="overflow-hidden">
              <span className="block pt-2 text-[12.5px] leading-relaxed text-white/75">
                {reel.blurb}
              </span>
            </span>
          </span>

          <span className="mt-3 block h-px w-0 bg-brand transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
        </span>
      </span>
    </button>
  );
}

export default function Reels() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(null);
  const [perView, setPerView] = useState(1);
  const [rawIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const lightboxRef = useRef(null);

  // Starts at one so the server render and the first client render agree.
  useEffect(() => {
    // Deliberately few per view — a 9:16 card only reads as a reel when it
    // is big enough to look like a phone screen, so the count is kept low
    // and the width per card high.
    const steps = [
      { query: window.matchMedia("(min-width: 1536px)"), value: 4 },
      { query: window.matchMedia("(min-width: 1280px)"), value: 3 },
      { query: window.matchMedia("(min-width: 768px)"), value: 2 },
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

  // The last position that still leaves no gap at the tail of the track.
  const lastIndex = Math.max(0, reels.length - perView);

  // Clamped on read rather than corrected in an effect, which would cost an
  // extra render pass every time the viewport changes.
  const index = Math.min(rawIndex, lastIndex);

  const go = useCallback(
    (step) =>
      setIndex((current) => {
        const next = Math.min(current, lastIndex) + step;
        if (next < 0) return lastIndex;
        if (next > lastIndex) return 0;
        return next;
      }),
    [lastIndex],
  );

  useEffect(() => {
    if (reduceMotion || paused || lastIndex === 0 || active !== null) return;

    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, lastIndex, paused, reduceMotion, active]);

  const close = useCallback(() => setActive(null), []);

  const stepLightbox = useCallback((delta) => {
    setActive((current) => {
      if (current === null) return current;
      return (current + delta + reels.length) % reels.length;
    });
  }, []);

  // Keyboard control while the lightbox is up, and the page held still behind
  // it so scrolling does not run on underneath.
  useEffect(() => {
    if (active === null) return;

    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") stepLightbox(1);
      if (event.key === "ArrowLeft") stepLightbox(-1);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, stepLightbox]);

  useEffect(() => {
    if (active !== null) lightboxRef.current?.focus();
  }, [active]);

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.15 };

  // A slide is an even share of the viewport once the gaps are removed, and
  // one step moves the track by exactly one slide plus one gap.
  const slide = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})`;
  const shift = `calc(-${index} * (${slide} + ${GAP_REM}rem))`;

  return (
    <section className="relative overflow-hidden bg-linen py-20 md:py-28">
      <div className="shell relative">
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <span className="block overflow-hidden">
              <motion.span
                variants={line}
                className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
              >
                <span className="h-px w-10 bg-brand" />
                Karmo on screen
              </motion.span>
            </span>

            <h2 className="display mt-6 max-w-xl text-[2rem] font-light leading-[1.15] text-ink sm:text-[2.5rem]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={line} className="block">
                  See what
                  <span className="font-bold"> comfort is made of</span>
                </motion.span>
              </span>
            </h2>
          </div>

          <motion.div variants={fade} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous videos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
            >
              <FiArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next videos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
            >
              <FiArrowRight />
            </button>
          </motion.div>
        </motion.div>

        {/* Vertical padding gives the hovered card room to grow; horizontal
            overflow stays clipped so off-track slides never show. */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={once}
          className="-mx-2 mt-12 overflow-x-clip px-2 py-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="flex ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              gap: `${GAP_REM}rem`,
              transform: `translateX(${shift})`,
              transition: `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            {reels.map((reel, cardIndex) => (
              <ReelCard
                key={reel.src}
                reel={reel}
                width={slide}
                reduceMotion={reduceMotion}
                onOpen={() => setActive(cardIndex)}
              />
            ))}
          </div>
        </motion.div>

        {/* Position readout, matching the carousel elsewhere on the page. */}
        <div className="mt-2 flex items-center gap-4">
          <span className="display text-sm font-bold tabular-nums text-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-ink/12">
            <span
              className="block h-px bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${((index + 1) / (lastIndex + 1)) * 100}%`,
              }}
            />
          </span>
          <span className="text-xs font-medium tabular-nums text-ink/45">
            {String(lastIndex + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Lightbox.
          Rendered conditionally rather than through AnimatePresence: the exit
          animation completed but the node was never unmounted, leaving an
          invisible full-screen backdrop that swallowed every click on the
          page afterwards. It animates in and closes immediately, which is how
          most video players behave anyway. */}
      {active !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={reels[active].title}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: SETTLE }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-4xl outline-none"
          >
            <video
              // Keyed on the source so switching clips remounts the element
              // rather than leaving the previous one playing underneath.
              key={reels[active].src}
              src={reels[active].src}
              controls
              autoPlay
              playsInline
              className="w-full rounded-xl bg-black"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="display text-lg font-bold text-white">
                  {reels[active].title}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-white/55">
                  <FiVolume2 />
                  {reels[active].tag} · {reels[active].length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Previous video"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
                >
                  <FiArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  aria-label="Next video"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-3 right-0 flex h-10 w-10 -translate-y-full items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-shade-deep"
            >
              <FiX />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
