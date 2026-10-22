"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  /* A still picture instead of the clip. When set it wins over `video`, so
     switching back is removing this one field. */
  image,
  imageAlt = "",
  /* Where the still is anchored when the screen crops it (CSS object-position). */
  imagePosition = "75% center",
  heading,
  /* "center" (the video default) or "left" — over a picture with an empty
     dark left side, the heading sits there. */
  align = "center",
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
      className={`relative isolate h-[calc(100vh-112px)] overflow-hidden text-white ${
        image ? "bg-black" : "bg-[#f7f8f8]"
      }`}
    >
      {image ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : reduceMotion ? (
        poster && (
          <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
        )
      ) : (
        <>
          <video {...layerProps(0)} autoPlay />
          <video {...layerProps(1)} />
        </>
      )}
      {/* Footage, or a still with the heading centred: the same flat dark
          scrim every other hero on the site uses for white text (separate
          from `hero-breathe`, which dims/lifts the footage itself). A still
          with a left heading keeps its own light — it only gets a left-side
          shade, so the heading still reads where a narrow screen crops the
          picture's dark side away. */}
      {image && align === "left" ? (
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent lg:from-black/40 lg:via-transparent"
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      )}

      {heading && (
        <div
          className={`absolute inset-0 flex flex-col justify-center px-4 sm:px-8 lg:px-14 xl:px-20 ${
            align === "left"
              ? "items-start text-left lg:pl-[max(3.5rem,calc((100vw-1600px)/2+4rem))]"
              : "items-center text-center"
          }`}
        >
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
