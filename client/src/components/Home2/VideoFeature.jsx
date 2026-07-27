"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lightbox from "./Lightbox";
import { FadeUp, SplitWords } from "./motion";

const FILM = "/videos/product-film.mp4";

/* Seconds of overlap between the outgoing and incoming copy of the loop. Long
   enough to hide the cut, short enough that the blended frames are not on
   screen long enough to read as a ghost. */
const CROSSFADE = 0.7;

/**
 * The film band.
 *
 * ── Seamless loop ──────────────────────────────────────────────────────────
 * `<video loop>` restarts on a hard cut, and on a five-second clip that jump
 * comes round often enough to be the only thing anyone notices. So the loop is
 * run manually across two stacked copies: when the playing one is within
 * CROSSFADE of its end, the other starts from zero and the two swap opacity.
 * The seam is dissolved rather than cut.
 *
 * ── Layers ─────────────────────────────────────────────────────────────────
 * A still sits under both videos and is never removed, so the band is never a
 * black rectangle — not while the video buffers, not if it fails, and not for
 * a visitor who asked for less motion, who gets no video element at all.
 */
export default function VideoFeature() {
  const ref = useRef(null);
  const openerRef = useRef(null);
  const reduce = useReducedMotion();

  const layerA = useRef(null);
  const layerB = useRef(null);

  // Which copy is on top. Flipping it is what performs the crossfade — the
  // opacity transition lives in CSS.
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
    className: "intro-video-media",
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
    <div ref={ref} className="intro-video dark-section">
      <motion.div className="intro-video-bg" style={reduce ? undefined : { y }}>
        <Image
          src="/livora/page-header-bg-image.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        {!reduce && (
          <>
            <video {...layerProps(0)} autoPlay src={FILM} />
            <video {...layerProps(1)} src={FILM} />
          </>
        )}
      </motion.div>

      <div className="container">
        <div className="intro-video-row">
          <FadeUp className="intro-video-circle">
            <button
              ref={openerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Play the Karmo product film"
            >
              <Image
                src="/livora/intro-video-circle.svg"
                alt=""
                aria-hidden="true"
                width={140}
                height={140}
              />
            </button>
          </FadeUp>

          <div className="section-title section-title-center">
            <FadeUp>
              <span className="section-sub-title">Product film</span>
            </FadeUp>
            <SplitWords as="h2" text="Watch Comfort Being Made By Hand" />
          </div>
        </div>
      </div>

      {open && (
        <Lightbox src={FILM} label="Karmo product film" onClose={close} />
      )}
    </div>
  );
}
