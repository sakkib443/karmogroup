"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiX,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
} from "react-icons/fi";

/**
 * Karmo on screen — a screening room rather than a carousel.
 *
 * This section used to run the clips as 9:16 phone-style cards. Every file was
 * checked on 27 July 2026 and not one of them is vertical:
 *
 *   tvc-mattress  1280x720   16:9   1:02
 *   product-film  2560x1440  16:9   0:05
 *   reel-1..4     1536x1152  4:3    0:04 - 0:06
 *   tvc-foam       352x288   4:3    0:20
 *
 * A 4:3 frame forced into a 9:16 card loses about two thirds of its width, so
 * the old treatment was throwing away most of the picture. The stage below is
 * 16:9 and the video is contained, not cropped — the 4:3 clips sit pillarboxed
 * on black, the way a real player shows them, and nothing is lost.
 *
 * Captions were written from the actual frames, not from the old reference
 * build. Two things need the client's word before launch:
 *
 *   - reel-2.mp4 is deliberately NOT in this list. Its compression rig carries
 *     "durfi" branding on screen — a competing mattress brand — so it is not
 *     Karmo footage and cannot go on Karmo's homepage. Do not add it back
 *     without a replacement clip.
 *   - reel-1.mp4 is a CertiGuard certification sting. It is kept, but only if
 *     Karmo actually holds that certification.
 *   - tvc-foam.mp4 is 352x288. It is genuine archive footage and is labelled as
 *     such, but a higher-resolution master would help.
 *
 * `at` is the second the playlist thumbnail is pulled from, passed as a media
 * fragment so the browser paints that frame instead of a black opening one.
 */
const films = [
  {
    src: "/videos/tvc-mattress.mp4",
    title: "Karmo Mattress, the commercial",
    tag: "Commercial",
    blurb: "The full television spot, start to finish.",
    length: "1:02",
    at: 3,
  },
  {
    src: "/videos/product-film.mp4",
    title: "A room built on Karmo",
    tag: "Interiors",
    blurb: "Foam, cushioning and bedding, seen where they end up.",
    length: "0:05",
    at: 2.2,
  },
  {
    src: "/videos/reel-4.mp4",
    title: "Pocketed spring array",
    tag: "Inside the product",
    blurb: "Every spring answers on its own, so weight stays where it lands.",
    length: "0:06",
    at: 2.7,
  },
  {
    src: "/videos/reel-3.mp4",
    title: "Rebound on the quilted top",
    tag: "Inside the product",
    blurb: "A steel ball dropped on the sleeping surface, over and over.",
    length: "0:06",
    at: 2.6,
  },
  {
    src: "/videos/reel-1.mp4",
    title: "CertiGuard germ protection",
    tag: "Certification",
    blurb: "The antimicrobial mark carried on the mattress range.",
    length: "0:04",
    at: 1.9,
  },
  {
    src: "/videos/tvc-foam.mp4",
    title: "Karmo Foam, from the archive",
    tag: "Archive",
    blurb: "Where the group started, on film.",
    length: "0:20",
    at: 3,
  },
];

import { group, line, rise as fade, SETTLE, VIEWPORT } from "./motion";

export default function Reels({ heading }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const barRef = useRef(null);
  const lightboxRef = useRef(null);

  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // The flagship film is 8.5MB. Nothing is fetched until the section is
  // actually reached, so a visitor who never scrolls this far pays nothing.
  //
  // Pressing play arms it too. Without that second route the section is one
  // failed IntersectionObserver away from a dead black rectangle with a play
  // button that does nothing — the exact state a zero-height viewport produces.
  const inView = useInView(sectionRef, VIEWPORT);
  const [forced, setForced] = useState(false);
  const armed = inView || forced;

  const current = films[active];

  // Sound is wanted by default. It cannot simply be switched on, though:
  // every current browser refuses to start a video that has audio until the
  // visitor has interacted with the page, and a blocked play() means nothing
  // plays at all. So the clip always starts muted — which is never blocked —
  // and the sound is turned on the moment it is allowed.
  //
  // `soundWanted` is a ref, not state: it is the visitor's standing preference
  // and must survive the video remounting on every clip change without
  // re-running any of this.
  const soundWanted = useRef(true);

  const tryUnmute = useCallback(() => {
    const video = stageRef.current;
    if (!video || !soundWanted.current || !video.muted) return;

    video.muted = false;
    // Unmuting can make the browser reject playback outright, so the promise
    // is checked and the clip put back to muted rather than left stalled.
    const started = video.play();
    if (started) started.catch(() => { video.muted = true; });
  }, []);

  // First touch, click or key anywhere on the page counts as the gesture the
  // browser is waiting for, so the sound comes on then even if the attempt
  // above was refused.
  useEffect(() => {
    const events = ["pointerdown", "keydown", "touchstart"];
    const onGesture = () => tryUnmute();

    events.forEach((name) =>
      window.addEventListener(name, onGesture, { passive: true }),
    );
    return () =>
      events.forEach((name) => window.removeEventListener(name, onGesture));
  }, [tryUnmute]);

  const step = useCallback((delta) => {
    setActive((index) => (index + delta + films.length) % films.length);
  }, []);

  // Progress is written straight to the node. Through state it would re-render
  // the whole section several times a second for a bar nobody interacts with.
  const onTime = (event) => {
    const video = event.currentTarget;
    if (barRef.current && video.duration) {
      barRef.current.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  };

  const toggle = () => {
    const video = stageRef.current;

    // Not mounted yet: mount it. It carries autoPlay, so it starts on its own.
    if (!video) {
      setForced(true);
      return;
    }

    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  // A click is the gesture the browser wants, so unmuting from here always
  // takes. Muting is recorded as a standing choice and respected from then on.
  const toggleSound = () => {
    const video = stageRef.current;
    soundWanted.current = !soundWanted.current;
    if (!video) return;

    video.muted = !soundWanted.current;
    if (soundWanted.current) video.play().catch(() => {});
  };

  const open = () => {
    stageRef.current?.pause();
    setExpanded(true);
  };

  const close = useCallback(() => setExpanded(false), []);

  // Keyboard control while the lightbox is up, and the page held still behind
  // it so scrolling does not run on underneath.
  useEffect(() => {
    if (!expanded) return;

    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded, close, step]);

  useEffect(() => {
    if (expanded) lightboxRef.current?.focus();
  }, [expanded]);

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = VIEWPORT;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-linen py-20 md:py-28"
    >
      {/* Deliberately a light section. The page runs light the whole way down
          apart from 04, and a second dark band this close to it broke that. The
          only dark thing here is the stage itself, which has to be black for
          the video to letterbox against. */}
      <div className="shell relative">
        <motion.div
          variants={group}
          {...reveal}
          viewport={once}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          {heading ?? (
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
                    <span className="font-bold text-brand">
                      {" "}
                      comfort is made of
                    </span>
                  </motion.span>
                </span>
              </h2>
            </div>
          )}

          <motion.span
            variants={fade}
            className="display hidden text-[12px] font-bold tabular-nums tracking-[0.1em] text-ink/35 sm:block"
          >
            {String(active + 1).padStart(2, "0")}
            <span className="mx-2 text-ink/20">/</span>
            {String(films.length).padStart(2, "0")}
          </motion.span>
        </motion.div>

        <motion.div
          variants={fade}
          {...reveal}
          viewport={once}
          className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8"
        >
          {/* Stage. Fixed at 16:9 so the layout never jumps between clips, with
              the picture contained inside it — a 4:3 clip is pillarboxed on
              black instead of being cropped to fit. */}
          <div className="min-w-0 lg:col-span-8">
            <div className="group/stage relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_40px_80px_-40px_rgba(34,34,34,0.55)] ring-1 ring-ink/10">
              {armed && (
                <video
                  // Keyed on the source: switching clips remounts the element
                  // rather than leaving the previous one running underneath.
                  key={current.src}
                  ref={stageRef}
                  src={current.src}
                  // Held back under reduced motion, unless the visitor pressed
                  // play themselves — an explicit request outranks the setting.
                  autoPlay={!reduceMotion || forced}
                  muted
                  playsInline
                  preload="auto"
                  onTimeUpdate={onTime}
                  onEnded={() => step(1)}
                  onPlay={() => {
                    setPlaying(true);
                    tryUnmute();
                  }}
                  onPause={() => setPlaying(false)}
                  // The element is the single source of truth for sound: it can
                  // be muted by a refused play() as well as by the button.
                  onVolumeChange={(event) =>
                    setMuted(event.currentTarget.muted)
                  }
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}

              {/* Click anywhere on the picture to stop and start. Sits under
                  the controls, which stop the event. */}
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause video" : "Play video"}
                className="absolute inset-0 z-10 cursor-pointer"
              />

              <span className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />

              <span className="pointer-events-none absolute left-5 top-5 z-20 rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {current.tag}
              </span>

              {/* Shown only while the browser is still holding the sound back,
                  so the silence reads as "one tap away" rather than broken. */}
              {playing && muted && (
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute right-5 top-5 z-30 flex items-center gap-2 rounded-full bg-brand px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <FiVolumeX className="text-[13px]" />
                  Tap for sound
                </button>
              )}

              {/* Rests over the middle while paused and clears out of the way
                  once the clip is running. */}
              <span
                className={`pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  playing
                    ? "scale-125 opacity-0"
                    : "scale-100 opacity-100 group-hover/stage:bg-brand group-hover/stage:border-brand"
                }`}
              >
                <FiPlay className="ml-1 text-2xl text-white" />
              </span>

              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7">
                <div className="flex items-end justify-between gap-6">
                  <div className="min-w-0">
                    <p className="display truncate text-[1.15rem] font-bold text-white sm:text-[1.4rem]">
                      {current.title}
                    </p>
                    <p className="mt-1.5 hidden text-[13px] text-white/60 sm:block">
                      {current.blurb}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label={playing ? "Pause video" : "Play video"}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-md transition-colors duration-300 hover:border-brand hover:bg-brand"
                    >
                      {playing ? <FiPause /> : <FiPlay className="ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleSound}
                      aria-label={muted ? "Unmute video" : "Mute video"}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-md transition-colors duration-300 hover:border-brand hover:bg-brand"
                    >
                      {muted ? <FiVolumeX /> : <FiVolume2 />}
                    </button>
                    <button
                      type="button"
                      onClick={open}
                      aria-label="Open video full size"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-md transition-colors duration-300 hover:border-brand hover:bg-brand"
                    >
                      <FiMaximize2 />
                    </button>
                  </div>
                </div>

                <span className="mt-5 block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  <span ref={barRef} className="block h-full w-0 bg-brand" />
                </span>
              </div>
            </div>
          </div>

          {/* Playlist. On wide screens it is pinned to the stage's height and
              scrolls inside it, so the two columns always end level; below
              that it lies down into a horizontal strip. */}
          {/* min-w-0 is load-bearing. A grid item defaults to min-width:auto,
              so without it this column refuses to shrink below the full width
              of the six cards inside — the strip stops scrolling and the
              section's overflow-hidden simply cuts the rest off. */}
          <div className="relative min-w-0 lg:col-span-4">
            {/* Below lg this is a horizontal strip that scrolls. From lg it is
                pinned over the stage's own box, and the rows divide that height
                between them — so the two columns finish level at every width
                instead of the rail running short under a taller stage. */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3 lg:absolute lg:inset-0 lg:mx-0 lg:flex-col lg:overflow-hidden lg:px-0 lg:pb-0 [scrollbar-color:rgba(34,34,34,0.22)_transparent] [scrollbar-width:thin]">
              {films.map((film, index) => {
                const on = index === active;

                return (
                  <button
                    key={film.src}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={on}
                    className={`group/row flex w-60 shrink-0 items-center gap-3.5 rounded-xl p-2 text-left transition-all duration-500 lg:w-full lg:flex-1 lg:min-h-0 ${
                      on
                        ? "bg-white shadow-[0_14px_34px_-22px_rgba(34,34,34,0.55)]"
                        : "bg-white/55 hover:bg-white"
                    }`}
                  >
                    {/* Fixed width in the mobile strip; from lg it takes the
                        row's height and lets the 16:9 ratio set its width, so
                        the thumbnails grow and shrink with the rows. */}
                    <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-black lg:h-full lg:w-auto">
                      {armed && (
                        <video
                          // Media fragment, so the strip shows a real frame
                          // from the middle of the clip rather than whatever
                          // the first one happens to be.
                          src={`${film.src}#t=${film.at}`}
                          muted
                          playsInline
                          preload="metadata"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}

                      <span
                        className={`absolute inset-0 transition-colors duration-500 ${
                          on
                            ? "bg-transparent"
                            : "bg-white/45 group-hover/row:bg-white/10"
                        }`}
                      />

                      {on && (
                        <span className="absolute inset-0 rounded-lg ring-2 ring-inset ring-brand" />
                      )}
                    </span>

                    {/* Tag and running time share a line — on their own rows
                        the six entries no longer fit beside the stage. */}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`truncate text-[9.5px] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                            on ? "text-brand" : "text-ink/45"
                          }`}
                        >
                          {film.tag}
                        </span>
                        <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-ink/25" />
                        <span className="shrink-0 text-[10.5px] tabular-nums text-ink/40">
                          {film.length}
                        </span>
                      </span>

                      <span
                        className={`display mt-1.5 block truncate text-[13px] font-semibold transition-colors duration-500 ${
                          on ? "text-ink" : "text-ink/65"
                        }`}
                      >
                        {film.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox.
          Rendered conditionally rather than through AnimatePresence: the exit
          animation completed but the node was never unmounted, leaving an
          invisible full-screen backdrop that swallowed every click on the page
          afterwards. */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }
            }
            animate={
              reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.5, ease: SETTLE }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-5xl outline-none"
          >
            <video
              key={current.src}
              src={current.src}
              controls
              autoPlay
              playsInline
              className="max-h-[76vh] w-full rounded-xl bg-black"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="display truncate text-lg font-bold text-white">
                  {current.title}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-white/55">
                  <FiVolume2 />
                  {current.tag} · {current.length}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous video"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                >
                  <FiPlay className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next video"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                >
                  <FiPlay className="ml-0.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-3 right-0 flex h-10 w-10 -translate-y-full items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
            >
              <FiX />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
