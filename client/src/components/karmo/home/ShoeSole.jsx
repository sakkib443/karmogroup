"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Footwear foam — five layouts, cycled by the right arrow:
 * 0) left claim panel
 * 1) right claim panel
 * 2) centered overlay, large shoe at the bottom
 * 3) one-line title only
 * 4) slow-motion generated film
 */

const DESKTOP_H = "calc(100svh - 64px)";
const BG = "/karmo/images/home-02/footwear/rolled-black-foam-bg.webp";
const SHOE = "/karmo/images/home-02/footwear/shoe-catalog-real.webp";
const FILM = "/karmo/images/home-02/footwear/gemini-generated-video-e79029c4.mp4";
const SLOW_MO = 0.72;

const SHOE_TRIM = {
  left: "-2.306%",
  top: "-16.628%",
  width: "104.44%",
  height: "121.94%",
};

const TITLE_STYLE = {
  fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

const claims = [
  {
    id: "insole",
    title: "Cushioned insoles",
    icon: "/karmo/images/trust/cartoon-v3/foot-insole-v2.webp",
  },
  {
    id: "sheets",
    title: "Load-bearing foam sheets",
    icon: "/karmo/images/trust/cartoon-v3/foot-sheets-v2.webp",
  },
  {
    id: "shoe",
    title: "Light for all-day wear",
    icon: "/karmo/images/trust/cartoon-v3/foot-shoe-v2.webp",
  },
];

function ClaimRow() {
  return (
    <ul className="relative grid w-full grid-cols-3 gap-x-1 gap-y-3 sm:gap-x-1.5">
      {claims.map((claim) => (
        <li key={claim.id} className="group flex flex-col items-center text-center">
          <span className="relative mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[4.75rem] sm:w-[4.75rem]">
            <Image
              src={claim.icon}
              alt=""
              aria-hidden="true"
              width={76}
              height={76}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="mt-2 text-[10px] font-semibold uppercase leading-[1.35] tracking-[0.04em] text-white/85 sm:text-[11px]">
            {claim.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Wraps (balanced) instead of overflowing: in the narrow side panel on a
   smaller laptop the one-line title ran off the screen. */
function Heading({ className = "" }) {
  return (
    <h2
      className={`display title-card-line max-w-full text-balance break-words uppercase text-white ${className}`}
      style={TITLE_STYLE}
    >
      Soles built to carry the day
    </h2>
  );
}

function ShoeArt({ sizes, className = "" }) {
  return (
    <div className={`relative aspect-[1171/433] w-full ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.12),transparent)]"
      />
      <Image
        src={SHOE}
        alt="Cross section of a sports shoe built on Karmo footwear foam"
        width={1223}
        height={528}
        unoptimized
        sizes={sizes}
        className="absolute max-w-none drop-shadow-[0_22px_40px_rgba(0,0,0,0.55)]"
        style={SHOE_TRIM}
      />
    </div>
  );
}

function VideoLayout({ reveal, active }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion) return;
    node.playbackRate = SLOW_MO;
    if (active && inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [active, inView, reduceMotion]);

  return (
    <motion.div
      ref={wrapRef}
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] min-h-[min(72svh,620px)] overflow-hidden bg-black lg:h-full lg:min-h-0"
    >
      <video
        ref={videoRef}
        src={FILM}
        muted
        playsInline
        loop
        preload="auto"
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/45"
      />
      <div className="relative z-[1] flex h-full min-h-[min(72svh,620px)] items-center justify-center px-7 lg:min-h-0">
        <Heading className="text-center" />
      </div>
    </motion.div>
  );
}

function TitleOnlyLayout({ reveal }) {
  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] flex min-h-[min(72svh,620px)] items-center justify-center px-7 lg:h-full lg:min-h-0"
    >
      <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
        <Heading className="text-center" />
      </motion.div>
    </motion.div>
  );
}

function CenterLayout({ reveal }) {
  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] flex min-h-[min(72svh,620px)] flex-col items-center lg:h-full lg:min-h-0"
    >
      <motion.aside
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="relative flex w-full max-w-xl flex-1 translate-y-8 flex-col items-center justify-center px-7 pt-10 text-center text-white sm:translate-y-10 sm:px-9 lg:translate-y-12 lg:px-10 lg:pt-12"
      >
        <ClaimRow />
        <Heading className="relative mt-5 sm:mt-6" />
      </motion.aside>

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="relative mx-auto w-full max-w-[78vw] shrink-0 -translate-y-5 px-4 pb-2 sm:max-w-[44rem] sm:-translate-y-6 sm:px-8 lg:max-w-[52rem] lg:-translate-y-8 lg:pb-3"
      >
        <ShoeArt sizes="92vw" />
      </motion.div>
    </motion.div>
  );
}

function PanelLayout({ reveal, side = "left" }) {
  const isRight = side === "right";

  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className={`relative z-[2] grid min-h-[min(72svh,620px)] lg:h-full lg:min-h-0 ${
        isRight
          ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.72fr)]"
          : "lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.55fr)]"
      }`}
    >
      <motion.aside
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className={`relative flex flex-col items-center justify-center px-7 py-10 text-center text-white sm:px-9 lg:px-10 lg:py-12 ${
          isRight ? "lg:col-start-2" : ""
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        />
        <div className="relative w-full max-w-[22rem]">
          <ShoeArt sizes="(min-width: 1024px) 22rem, 80vw" />
        </div>
        <div className="relative mt-7 w-full sm:mt-8">
          <ClaimRow />
        </div>
        <Heading className="relative mt-5 sm:mt-6" />
      </motion.aside>
      <div
        className={`relative min-h-[min(36svh,300px)] lg:min-h-0 ${
          isRight ? "lg:col-start-1 lg:row-start-1" : ""
        }`}
        aria-hidden
      />
    </motion.div>
  );
}

export default function ShoeSole() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [slide, setSlide] = useState(0);

  return (
    <section
      id="karmo-footwear"
      data-home-two-snap
      className="footwear-band relative overflow-hidden bg-black"
      style={{ ["--footwear-h"]: DESKTOP_H }}
      aria-label="Karmo footwear foam"
    >
      {slide !== 4 ? (
        <>
          <Image
            src={BG}
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-black/45"
          />
        </>
      ) : null}

      {slide === 0 ? (
        <PanelLayout reveal={reveal} side="left" />
      ) : slide === 1 ? (
        <PanelLayout reveal={reveal} side="right" />
      ) : slide === 2 ? (
        <CenterLayout reveal={reveal} />
      ) : slide === 3 ? (
        <TitleOnlyLayout reveal={reveal} />
      ) : (
        <VideoLayout reveal={reveal} active={slide === 4} />
      )}

      <button
        type="button"
        onClick={() => setSlide((s) => (s + 1) % 5)}
        aria-label="Show next footwear layout"
        className="absolute top-1/2 right-2 z-[3] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
      >
        <FiChevronRight className="text-[20px]" aria-hidden />
      </button>
    </section>
  );
}
