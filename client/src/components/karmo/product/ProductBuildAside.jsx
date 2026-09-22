"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { productFeatures } from "@/components/karmo/product/productDetailData";

/**
 * PDP band — short left copy + asymmetric media flush right:
 * tall morph (3 sleep stills) | two stacked feature videos.
 * Hover = home DivisionEditorials frame + label. 6px gap to neighbours.
 */

const ORANGE = "#FF9A1F";
const BAND_H = "calc(100svh - 140px)";
const GAP = "gap-1.5";

const EASE = [0.33, 1, 0.68, 1];
const FIRST_HOLD_MS = 550;
const HOLD_MS = 2000;
const FADE_S = 0.18;
const ZOOM_MS = 14000;
const ZOOM_FROM = 1;
const ZOOM_TO = 1.03;
const Y_FROM = "0%";
const Y_TO = "-0.6%";

const SLIDES = [
  {
    id: "sleep-01",
    src: "/karmo/images/product/lifestyle/build-morph/karmo-morph-v3-01.png",
    alt: "Back sleep on a Karmo navy floral mattress — pillow and katha",
    label: "Quiet rest",
  },
  {
    id: "sleep-02",
    src: "/karmo/images/product/lifestyle/build-morph/karmo-morph-v3-02.png",
    alt: "Side sleep on a Karmo navy floral mattress — pillow hug with katha",
    label: "Pillow hug",
  },
  {
    id: "sleep-03",
    src: "/karmo/images/product/lifestyle/build-morph/karmo-morph-v3-03.png",
    alt: "Deep sleep on a Karmo navy floral mattress — pillow and light cover",
    label: "Deep sleep",
  },
];

function LeafRule() {
  return (
    <span className="mt-4 flex items-center gap-3" aria-hidden>
      <span className="h-px w-10 bg-brand" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
          fill={ORANGE}
        />
        <path
          d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
          stroke="#B4651A"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
        Crafted to last
      </span>
    </span>
  );
}

function HoverChrome({ label }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[10%] z-[2] border-2 border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[12%] lg:inset-[13%]"
      />
      <span className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <span className="display translate-y-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[14px] lg:text-[15px]">
          {label}
        </span>
      </span>
    </>
  );
}

function TallMorph() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const firstSwapDone = useRef(false);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) {
          firstSwapDone.current = false;
          setIndex(0);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView) return undefined;
    const delay = firstSwapDone.current ? HOLD_MS : FIRST_HOLD_MS;
    const id = window.setTimeout(() => {
      firstSwapDone.current = true;
      setIndex((i) => (i + 1) % SLIDES.length);
    }, delay);
    return () => window.clearTimeout(id);
  }, [reduceMotion, inView, index]);

  return (
    <div
      ref={rootRef}
      className="group relative row-span-2 min-h-0 overflow-hidden bg-[#ebe7e1]"
    >
      <motion.div
        className="absolute inset-0 origin-[50%_40%] will-change-transform"
        initial={false}
        animate={
          reduceMotion
            ? { scale: 1, y: 0 }
            : { scale: [ZOOM_FROM, ZOOM_TO], y: [Y_FROM, Y_TO] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: ZOOM_MS / 1000,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }
        }
      >
        {SLIDES.map((slide, i) => {
          const on = i === index;
          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : FADE_S,
                ease: EASE,
              }}
              className={`absolute inset-0 ${
                on ? "z-[1]" : "pointer-events-none z-0"
              }`}
              aria-hidden={!on}
            >
              <Image
                src={slide.src}
                alt={on ? slide.alt : ""}
                fill
                sizes="(min-width: 1024px) 32vw, 60vw"
                quality={85}
                priority={i === 0}
                className="object-cover object-[center_18%]"
              />
            </motion.div>
          );
        })}
      </motion.div>
      <HoverChrome label={SLIDES[index].label} />
    </div>
  );
}

function VideoTile({ src, label }) {
  return (
    <div className="group relative min-h-0 overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
      <HoverChrome label={label} />
    </div>
  );
}

export default function ProductBuildAside() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative my-[6px] overflow-x-clip py-12 lg:overflow-visible lg:py-0"
      style={{ ["--build-h"]: BAND_H }}
      aria-label="Inside every Karmo mattress"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.2]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/58" />
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] grid items-center gap-8 px-6 md:px-14 lg:h-[var(--build-h)] lg:min-h-[var(--build-h)] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.65fr)] lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))] lg:pr-0 xl:gap-10"
      >
        <motion.div variants={fade} className="min-w-0 max-w-md self-center lg:max-w-[28rem]">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              Build 5 layer
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              Inside the mattress
            </span>
          </p>

          <h2 className="display section-heading mt-3 uppercase text-ink">
            <span className="block">Inside every</span>
            <span className="block text-brand">Karmo mattress</span>
          </h2>

          <LeafRule />

          <p className="body-copy mt-4 text-[15px] leading-[1.7] text-ink/55 sm:text-[16px] lg:text-[17px]">
            Five layered construction — quilted cover to motion-isolation base —
            with spine-aware support and a cover made for Bangladesh homes.
          </p>

          <div className="relative mt-3 w-full max-w-[20rem]">
            <Image
              src="/karmo/images/product/sketches/mattress-5-layer-sketch-v5b.png"
              alt="Hand-drawn Karmo mattress cutaway with five distinct construction layers"
              width={880}
              height={520}
              sizes="(min-width: 1024px) 20rem, 75vw"
              className="h-auto w-full object-contain object-left"
              priority={false}
            />
          </div>

          <Link href="/contact" className="group mt-1.5 inline-flex items-center gap-3 sm:mt-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              Talk to us
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={fade}
          className="flex h-[min(52svh,380px)] w-full min-w-0 justify-end self-stretch lg:h-full lg:min-h-0"
        >
          <div
            className={`grid h-full w-full max-w-[min(100%,48rem)] grid-cols-[0.78fr_0.9fr] grid-rows-2 sm:max-w-[min(100%,54rem)] ${GAP} lg:max-w-[min(100%,62rem)]`}
          >
            <TallMorph />
            <VideoTile
              src={productFeatures[0]?.video}
              label="Spine-aware support"
            />
            <VideoTile
              src={productFeatures[1]?.video}
              label="Anti-dust cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
