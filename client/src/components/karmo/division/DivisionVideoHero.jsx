"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A full-viewport video banner for the top of a division page — the video
 * counterpart to `DivisionAbout`'s `asHero` overlay and `BedAutomotiveHero`.
 * Built for `/foam/furniture`'s new acoustic-foam-wall clip, but left generic
 * (video/heading/playbackRate as props) so any division can swap its static
 * `about` hero for one without a new component.
 *
 * The old `about` hero is not deleted when this is used — `DivisionPage` just
 * skips it while `data.videoHero` is set, so restoring the static banner
 * later is a one-line removal in the division's data file, not a rebuild.
 *
 * ── The loop ────────────────────────────────────────────────────────────
 * Two stacked copies of one clip, cross-faded at the seam — `FoamPromise`'s
 * loop rig, copied rather than imported (that component is a whole section
 * with its own heading and claims; there is nothing to import without taking
 * all of it). A plain `<video loop>` restarts on a hard cut, which is exactly
 * what the client asked to smooth over: when the playing copy is within
 * `CROSSFADE` of its end, the other starts from zero and the two swap
 * opacity, so the seam reads as a dissolve instead of a jump.
 */
const CROSSFADE = 0.8;

export default function DivisionVideoHero({
  video,
  poster,
  heading,
  /* Client asked for the clip "a little slow" — under 1 plays it back at that
     fraction of native speed. Applied on the element itself rather than to
     the video file, so the source stays untouched. */
  playbackRate = 0.65,
}) {
  const reduceMotion = useReducedMotion();
  const layerA = useRef(null);
  const layerB = useRef(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);

  const relay = useCallback(
    (which) => (event) => {
      if (which !== front) return;
      const el = event.currentTarget;
      const remaining = el.duration - el.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE) return;

      const other = which === 0 ? layerB.current : layerA.current;
      if (!other) return;
      other.currentTime = 0;
      other.playbackRate = playbackRate;
      // Autoplay can still be refused — a power-saving tab, an OS setting.
      // Swallowing it leaves the outgoing layer showing rather than throwing.
      other.play().catch(() => {});
      setFront(which === 0 ? 1 : 0);
    },
    [front, playbackRate]
  );

  const park = (event) => {
    const el = event.currentTarget;
    el.pause();
    el.currentTime = 0;
  };

  useEffect(() => {
    for (const el of [layerA.current, layerB.current]) {
      if (el) el.playbackRate = playbackRate;
    }
    if (layerA.current?.readyState >= 2) setReady(true);
  }, [playbackRate]);

  const layerProps = (which) => ({
    ref: which === 0 ? layerA : layerB,
    src: video,
    poster,
    /* `hero-breathe` is the slow brightness rise-and-fall the client asked
       for, on both layers so it reads as continuous through the crossfade
       rather than resetting each loop. */
    className:
      "hero-breathe absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear",
    style: { opacity: ready && front === which ? 1 : 0 },
    muted: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    tabIndex: -1,
    onLoadedData: (event) => {
      event.currentTarget.playbackRate = playbackRate;
      setReady(true);
    },
    onTimeUpdate: relay(which),
    onEnded: park,
  });

  return (
    <section
      aria-label={heading}
      className="relative isolate h-[calc(100vh-112px)] overflow-hidden bg-[#f7f8f8] text-white"
    >
      {reduceMotion ? (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )
      ) : (
        <>
          <video {...layerProps(0)} autoPlay />
          <video {...layerProps(1)} />
        </>
      )}
      {/* Same dark scrim every other hero on the site uses for white text over
          footage. Separate from `hero-breathe`, which dims/lifts the footage
          itself — this stays a flat, constant read for the heading. */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {heading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-8 lg:px-14 xl:px-20">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            /* Matches the Home / HomeTex / Bed & Automotive hero headings —
               the one weight and size this site's video banners now share.
               Dead-centre both axes, at the client's ask — was right-aligned,
               vertically centred only. */
            className="display whitespace-nowrap uppercase text-white"
            style={{
              fontSize: "clamp(1.12rem, 0.92rem + 1.45vw, 2.4rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              letterSpacing: "0.12em",
              lineHeight: 1.1,
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}
          >
            {heading}
          </motion.h1>
        </div>
      )}
    </section>
  );
}
