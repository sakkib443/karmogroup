"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — three-image explore gallery.
 *
 * Top: two equal full-height panels (copy left / right).
 * Bottom: one full-width full-height flagship band.
 * White gutters between all three, matching the reference grid.
 */

const GAP = "gap-1.5";
/* Same desktop height as DivisionEditorials (Iconic brands band). */
const BAND_H = "calc(100svh - 32px)";
const VIEW_H =
  "min-h-[min(52svh,420px)] md:h-[calc(100svh-32px)] md:min-h-[calc(100svh-32px)]";
/* Half-height band for mattress explore row. */
const VIEW_H_HALF =
  "min-h-[min(28svh,260px)] md:h-[calc(50svh-16px)] md:min-h-[calc(50svh-16px)]";

const DEFAULT_PANELS = [
  {
    id: "mattress",
    href: "/mattress",
    src: "/karmo/images/home-02/explore/mattress-panel-v2.jpg",
    alt: "A Karmo floral mattress styled in a calm grey bedroom",
    line1: "Mattress made",
    line2: "for deep rest",
    /* Copy sits on the open wall toward the centre gutter. */
    align: "right",
    position: "object-center",
  },
  {
    id: "hometex",
    href: "/hometex",
    src: "/karmo/images/home-02/explore/hometex-panel-v2.jpg",
    alt: "A cream sofa in a mustard yellow HomeTex living room",
    line1: "HomeTex for",
    line2: "every room",
    /* Sofa left — keep copy on the open yellow wall at right. */
    align: "right",
    position: "object-center",
  },
];

function CareIcon({ id, className = "" }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {id === "protect" && (
        <>
          <rect x="4" y="11" width="16" height="7" rx="1.2" {...stroke} />
          <path d="M5.2 11V9.2c0-.7.6-1.3 1.3-1.3h10.8c.7 0 1.3.6 1.3 1.3V11" {...stroke} />
          <path d="M8 7.9V6.4c0-1.3 1.4-2.1 4-2.1s4 .8 4 2.1V7.9" {...stroke} />
          <path d="M9.2 16.4c.4-1.6 1.6-2.6 2.8-2.6 1.3 0 2.3.8 2.8 2.2" {...stroke} />
        </>
      )}
      {id === "iron" && (
        <>
          <path d="M6.2 14.2h10.4c1.4 0 2.2-.9 2.2-2 0-2.2-2.4-3.6-5.4-3.6H9.6L7 10.6H4.8" {...stroke} />
          <path d="M7.4 14.2v1.6h9.4" {...stroke} />
          <circle cx="12" cy="12" r="10.15" {...stroke} />
          <path d="M5.15 18.85 18.85 5.15" {...stroke} />
        </>
      )}
      {id === "smoke" && (
        <>
          <path d="M5 15.2h9.2l1.4-2.2H5.8L5 15.2Z" {...stroke} />
          <path d="M15.8 13c.7-.1 1.3-.6 1.3-1.4 0-1-1-1.4-2-1.4" {...stroke} />
          <path d="M16.6 9.4c.9-.3 1.5-1 1.5-1.9" {...stroke} />
          <circle cx="12" cy="12" r="10.15" {...stroke} />
          <path d="M5.15 18.85 18.85 5.15" {...stroke} />
        </>
      )}
      {id === "fold" && (
        <>
          <path d="M5.4 16.4 12 7.8l6.6 8.6" {...stroke} />
          <path d="M7.2 16.4h9.6" {...stroke} />
          <path d="M9.4 13.4h5.2" {...stroke} />
          <circle cx="12" cy="12" r="10.15" {...stroke} />
          <path d="M5.15 18.85 18.85 5.15" {...stroke} />
        </>
      )}
      {id === "clean" && (
        <>
          <rect x="5.2" y="12.2" width="13.6" height="5.4" rx="1.1" {...stroke} />
          <path d="M8.2 12.2V10c1.1-1.4 2.5-2 3.8-2s2.7.6 3.8 2v2.2" {...stroke} />
          <path d="M12 6.4v1.2M9.4 7.1l.7 1M14.6 7.1l-.7 1" {...stroke} />
          <circle cx="16.6" cy="8.2" r="1.15" {...stroke} />
        </>
      )}
    </svg>
  );
}

function CarePanel({ panel }) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      <Image
        src={panel.src}
        alt={panel.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className={`object-cover ${panel.position || "object-center"}`}
      />
      <div className="absolute inset-y-0 right-0 z-[1] flex w-[min(46%,300px)] items-center bg-[#0b1a33]/92 sm:w-[40%] lg:w-[38%]">
        <ul className="flex w-full flex-col gap-7 px-5 py-10 sm:gap-8 sm:px-6 lg:gap-10 lg:px-8">
          {panel.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3.5 sm:gap-4">
              <CareIcon id={item.id} className="h-8 w-8 shrink-0 text-white lg:h-9 lg:w-9" />
              <p className="text-[13px] font-medium leading-[1.2] text-white sm:text-[14px] lg:text-[16px]">
                <span className="block">{item.line1}</span>
                <span className="block">{item.line2}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Full-bleed muted loop — no copy overlay. Still underneath while buffering. */
function VideoPanel({ panel }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion) return;
    if (inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [inView, reduceMotion]);

  return (
    <div ref={wrapRef} className="relative h-full min-h-0 overflow-hidden bg-[#0b1a33]">
      {panel.still && (
        <Image
          src={panel.still}
          alt={panel.alt || ""}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center"
        />
      )}
      {!reduceMotion && panel.film && (
        <video
          ref={videoRef}
          src={panel.film}
          muted
          playsInline
          loop
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function Panel({ panel, compact = false }) {
  if (panel.film) return <VideoPanel panel={panel} />;
  if (panel.items?.length) return <CarePanel panel={panel} />;

  const isRight = panel.align === "right";

  return (
    <Link
      href={panel.href}
      className="group relative block h-full min-h-0 overflow-hidden"
    >
      <Image
        src={panel.src}
        alt={panel.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className={`object-cover ${panel.position || "object-center"} transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]`}
      />
      {/* Even wash — same strength everywhere (no directional gradient). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-shade-deep/35"
      />
      <div
        className={`relative z-[1] flex h-full flex-col justify-start p-7 sm:p-9 lg:p-11 xl:p-12 ${
          compact
            ? "pt-10 sm:pt-14 lg:pt-16 xl:pt-20"
            : "pt-16 sm:pt-28 lg:pt-40 xl:pt-44"
        } ${
          isRight
            ? "items-end pr-10 text-right sm:pr-14 lg:pr-16 xl:pr-20"
            : "items-start text-left"
        }`}
      >
        <h2
          className={`display font-bold uppercase leading-[1.2] tracking-[0.02em] text-white ${
            compact
              ? "text-[1.2rem] sm:text-[1.35rem] lg:text-[1.5rem] xl:text-[1.65rem]"
              : "text-[1.45rem] sm:text-[1.65rem] lg:text-[1.85rem] xl:text-[2rem]"
          }`}
        >
          <span className="block sm:whitespace-nowrap">{panel.line1}</span>
          <span className="block sm:whitespace-nowrap">{panel.line2}</span>
        </h2>
        <span className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/55 underline-offset-[6px] transition-colors duration-300 group-hover:decoration-white sm:mt-4 sm:text-[13px]">
          Explore Now
        </span>
      </div>
    </Link>
  );
}

export default function ExploreSplit({
  panels = DEFAULT_PANELS,
  flagship = true,
  half = false,
  className = "mt-1 md:mt-1.5",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const bandH = half ? VIEW_H_HALF : VIEW_H;

  return (
    <section data-home-two-snap className={`bg-white ${className}`}>
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid bg-white ${GAP}`}
        style={{ ["--explore-band-h"]: half ? "calc(50svh - 16px)" : BAND_H }}
      >
        {/* Top row — two equal panels with a light white gutter between them */}
        <div
          className={`explore-band grid grid-cols-1 grid-rows-2 bg-white md:grid-cols-2 md:grid-rows-1 ${GAP} ${bandH}`}
        >
          {panels.map((panel) => (
            <motion.div key={panel.id} variants={fade} className="min-h-0 min-w-0 h-full">
              <Panel panel={panel} compact={half} />
            </motion.div>
          ))}
        </div>

        {flagship && (
          <motion.div
            variants={fade}
            className={`explore-band relative overflow-hidden bg-[#d8d8d8] ${bandH}`}
          >
            <Image
              src="/karmo/images/home-02/banners/magnific-3zzTfKCREY.png"
              alt="A Karmo Magnific lifestyle scene"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />

            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-shade-deep/25 via-shade-deep/20 to-shade-deep/45"
            />

            <div className="relative z-[1] mx-auto flex h-full w-full max-w-[1600px] items-center justify-end px-6 md:px-14 lg:pr-16 xl:pr-20">
              <div className="text-right">
                <h2 className="display text-[1.75rem] font-bold uppercase leading-[1.15] tracking-[0.02em] text-white sm:text-[2.1rem] lg:text-[2.35rem]">
                  <span className="block sm:whitespace-nowrap">Foam crafted</span>
                  <span className="block sm:whitespace-nowrap">for comfort</span>
                </h2>
                <Link
                  href="/foam"
                  className="mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/55 underline-offset-[6px] transition-colors duration-300 hover:decoration-white sm:mt-6 sm:text-[13px]"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
