"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { group, rise, VIEWPORT } from "./motion";
import SectionHeading, { Accent } from "./SectionHeading";
import VideoModal from "./VideoModal";

const FILM = "/karmo/videos/product-film.mp4";
const STILL = "/karmo/livora/page-header-bg-image.jpg";
const BADGE = "/karmo/livora/intro-video-circle.svg";

/* Seconds of overlap between the outgoing and incoming copy of the loop. Long
   enough to hide the cut, short enough that the blended frames are not on
   screen long enough to read as a ghost. Must stay in step with the 700ms
   opacity transition on the layers below. */
const CROSSFADE = 0.7;

/**
 * The film band, brought over from Home 02.
 *
 * Home 02's version leans on livora.css, every rule of which is nested inside
 * `.lv` and loaded only by the (luxe) layout — dropped in here as-is it would
 * have rendered unstyled. So the behaviour is the same component logic and the
 * presentation is rebuilt in the utilities Home 01 uses, which also lets the
 * headline pick up the all-caps treatment the rest of this page now runs.
 *
 * ── Seamless loop ──────────────────────────────────────────────────────────
 * `<video loop>` restarts on a hard cut, and on a short clip that jump comes
 * round often enough to be the only thing anyone notices. So the loop is run
 * manually across two stacked copies: when the playing one is within CROSSFADE
 * of its end, the other starts from zero and the two swap opacity. The seam is
 * dissolved rather than cut.
 *
 * ── Layers ─────────────────────────────────────────────────────────────────
 * A still sits under both videos and is never removed, so the band is never a
 * black rectangle — not while the video buffers, not if it fails, and not for
 * a visitor who asked for less motion, who gets no video element at all.
 */
export default function FilmBand() {
  const ref = useRef(null);
  const openerRef = useRef(null);
  const reduce = useReducedMotion();

  const layerA = useRef(null);
  const layerB = useRef(null);

  // Which copy is on top. Flipping it is what performs the crossfade.
  const [front, setFront] = useState(0);
  // Gated on the first frame being decoded, NOT on playback starting. If this
  // waited for `playing`, then any browser that refuses autoplay — a
  // power-saving tab, a data-saver setting — would leave the band showing the
  // still forever with a loaded video sitting invisible on top of it.
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  // Hand over to the other copy shortly before this one runs out.
  const relay = useCallback(
    (which) => (event) => {
      if (which !== front) return;

      const video = event.currentTarget;
      const remaining = video.duration - video.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE) return;

      const other = which === 0 ? layerB.current : layerA.current;
      if (!other) return;

      other.currentTime = 0;
      // Autoplay can still be refused (a power-saving tab, an OS setting).
      // Swallowing it leaves the still showing rather than throwing.
      other.play().catch(() => {});
      setFront(which === 0 ? 1 : 0);
    },
    [front]
  );

  // Once the outgoing copy finishes, park it at the start so it is ready for
  // its next turn without a seek mid-fade.
  const park = (event) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  const close = useCallback(() => {
    setOpen(false);
    // Focus goes back where it came from, or the reader is dropped at the top
    // of the document with no idea what just happened.
    openerRef.current?.focus();
  }, []);

  // `loadeddata` is dispatched the moment the first frame decodes, which on a
  // cached file is before hydration has attached the handler — the event is
  // simply missed and the band would sit on the still forever. So the state is
  // also read straight off the element once, on mount.
  useEffect(() => {
    if (layerA.current?.readyState >= 2) setReady(true);
  }, []);

  const layerProps = (which) => ({
    ref: which === 0 ? layerA : layerB,
    className:
      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear",
    style: { opacity: ready && front === which ? 1 : 0 },
    muted: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    tabIndex: -1,
    onLoadedData: () => setReady(true),
    onTimeUpdate: relay(which),
    onEnded: park,
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[620px] items-center overflow-hidden bg-shade-deep py-24 lg:min-h-[780px]"
    >
      {/* Overscanned top and bottom so the parallax has somewhere to travel
          without ever exposing an edge. */}
      <motion.div
        className="absolute inset-x-0 -inset-y-[8%] z-0"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={STILL}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {!reduce && (
          <>
            <video {...layerProps(0)} autoPlay src={FILM} />
            <video {...layerProps(1)} src={FILM} />
          </>
        )}

        {/* Darkest at the floor, where the headline sits. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgb(22 28 36 / 0.25) 0%, rgb(22 28 36 / 0.1) 45%, rgb(22 28 36 / 0.85) 100%)",
          }}
        />
      </motion.div>

      {/* Heading left on the page gutter like every other section, with the
          badge opposite it. This band was centred — its own eyebrow with a
          rule either side, its own weight and size — which made it the one
          section that did not sit on the same left edge as the rest of the
          page. The badge moving to the right is what lets the words move
          left without leaving the composition lopsided. */}
      <motion.div
        variants={group}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={VIEWPORT}
        className="shell relative z-[2] flex w-full flex-col items-start gap-10 md:flex-row md:items-center md:justify-between md:gap-16"
      >
        <SectionHeading
          tone="dark"
          eyebrow="Product film"
          title={[
            "Watch comfort",
            <Accent key="a">being made by hand</Accent>,
          ]}
          className="hero-copy"
        />

        <motion.div variants={rise} className="shrink-0">
          <button
            ref={openerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play the Karmo product film"
            className="group block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-white"
          >
            {/* Turning label with the play mark at its centre. It stops under
                the pointer, so the words can actually be read. */}
            <Image
              src={BADGE}
              alt=""
              aria-hidden="true"
              width={140}
              height={140}
              className="aspect-square w-[140px] rounded-full animate-[film-badge-spin_20s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            />
          </button>
        </motion.div>
      </motion.div>

      {open && (
        <VideoModal src={FILM} label="Karmo product film" onClose={close} />
      )}
    </section>
  );
}
