"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, rise, VIEWPORT } from "@/components/karmo/motion";
import SectionHeading, { Accent } from "@/components/karmo/SectionHeading";

/**
 * Home Two — Living Lookbook.
 *
 * Top: three equal promo tiles.
 * Bottom: FoamPromise film band ("Blending tradition with innovation"),
 * same gutter as the tiles so the block reads as one section.
 */

const GAP = "gap-1 md:gap-1.5";
/* Sides and bottom only. The top is left to the section above (Reels), which
   carries the 6px the client set as the gap between every two sections —
   padding on both would double it. */
const GUTTER = "px-0 pb-0 pt-0";
const TILE_H = "md:h-[min(60svh,620px)]";
const FILM_H =
  "h-[min(58svh,520px)] min-h-[320px] md:h-[min(68svh,700px)] md:min-h-[420px]";

const FILM = "/karmo/videos/product-film.mp4";
const STILL = "/karmo/livora/page-header-bg-image.jpg";
/* Same spinning mark as `/home-2` FilmBand. */
const BADGE = "/karmo/livora/intro-video-circle.svg";
/* Slower than FoamPromise (0.9) — calm read behind the lookbook copy. */
const PLAYBACK = 0.7;
const CROSSFADE = 0.85;

const panels = [
  {
    id: "living",
    href: "/foam",
    src: "/karmo/images/home-02/divisions/scandinavian-interior.jpg",
    alt: "A calm living room with a soft sofa, natural light and quiet finishes",
    eyebrow: "Karmo Foam",
    title: "Living rooms made for real rest",
    cta: "Explore foam",
  },
  {
    id: "seating",
    href: "/foam",
    src: "/karmo/images/home-02/lookbook/magnific-CqqJldCEEy.png",
    alt: "A cream Karmo sofa with soft cushions and a quiet styled corner",
    eyebrow: "Soft seating",
    title: "Support that stays all day",
    cta: "Shop seating",
  },
  {
    id: "foam-range",
    href: "/foam",
    src: "/karmo/images/home-02/divisions/hometex-karmo-foam-sofa-lavender.png",
    alt: "A three-seat Karmo Foam sofa with lavender cushions on a black frame",
    eyebrow: "Karmo Foam",
    title: "Foam built for everyday living",
    cta: "View the range",
  },
];

export default function LivingLookbook() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const layerA = useRef(null);
  const layerB = useRef(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    for (const video of [layerA.current, layerB.current]) {
      if (video) video.playbackRate = PLAYBACK;
    }
    if (layerA.current?.readyState >= 2) setReady(true);
  }, []);

  const relay = useCallback(
    (which) => (event) => {
      if (which !== front) return;
      const video = event.currentTarget;
      const remaining = video.duration - video.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE) return;

      const other = which === 0 ? layerB.current : layerA.current;
      if (!other) return;
      other.currentTime = 0;
      other.playbackRate = PLAYBACK;
      other.play().catch(() => {});
      setFront(which === 0 ? 1 : 0);
    },
    [front]
  );

  const park = (event) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  const layerProps = (which) => ({
    ref: which === 0 ? layerA : layerB,
    className:
      "absolute inset-0 h-full w-full object-cover transition-opacity duration-[850ms] ease-linear",
    style: { opacity: ready && front === which ? 1 : 0 },
    muted: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    tabIndex: -1,
    onLoadedData: (event) => {
      event.currentTarget.playbackRate = PLAYBACK;
      setReady(true);
    },
    onTimeUpdate: relay(which),
    onEnded: park,
  });

  return (
    <section
      className={`w-full overflow-hidden bg-white ${GUTTER}`}
      aria-label="Karmo living lookbook"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`flex flex-col ${GAP}`}
      >
        {/* Trio */}
        <div
          className={`grid min-h-0 grid-cols-1 ${GAP} ${TILE_H} md:grid-cols-3`}
        >
          {panels.map((panel) => (
            <motion.div
              key={panel.id}
              variants={fade}
              className="relative min-h-[min(52svh,420px)] min-w-0 md:min-h-0"
            >
              <Link
                href={panel.href}
                className="group relative block h-full overflow-hidden"
              >
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover object-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/25"
                />
                <div className="absolute inset-0 z-[1] flex flex-col items-start justify-start p-6 sm:p-7 lg:p-8">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/90 sm:text-[13px] lg:text-[14px]">
                    {panel.eyebrow}
                  </span>
                  <h2 className="mt-3 max-w-[14ch] text-[1.55rem] font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-[1.75rem] lg:text-[1.95rem]">
                    {panel.title}
                  </h2>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.02em] text-white transition-colors duration-300 group-hover:text-brand sm:mt-6 sm:text-[14px] lg:text-[15px]">
                    {panel.cta}
                    <FiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Film band — same gutter as the tiles */}
        <motion.div
          variants={fade}
          className={`relative overflow-hidden bg-shade-deep ${FILM_H}`}
        >
          <div aria-hidden className="absolute inset-0">
            <Image
              src={STILL}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {!reduceMotion ? (
            <div aria-hidden className="absolute inset-0">
              <video {...layerProps(0)} autoPlay src={FILM} />
              <video {...layerProps(1)} src={FILM} />
            </div>
          ) : null}

          <span
            aria-hidden
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgb(22 28 36 / 0.25) 0%, rgb(22 28 36 / 0.1) 45%, rgb(22 28 36 / 0.85) 100%)",
            }}
          />

          {/* Exact FilmBand chrome: shell gutter, heading left, spinning badge right. */}
          <div className="shell relative z-[2] flex h-full w-full flex-col items-start justify-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
            <SectionHeading
              tone="dark"
              eyebrow="60 years"
              title={[
                "Blending tradition",
                <Accent key="a">with innovation</Accent>,
              ]}
              className="hero-copy"
            />

            <motion.div variants={rise} className="shrink-0">
              <div className="group block rounded-full">
                <Image
                  src={BADGE}
                  alt=""
                  aria-hidden
                  width={140}
                  height={140}
                  unoptimized
                  className="aspect-square w-[140px] rounded-full animate-[film-badge-spin_20s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
