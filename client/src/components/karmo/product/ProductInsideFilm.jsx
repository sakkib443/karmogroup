"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { PINS } from "@/components/karmo/product/ProductInside";

/**
 * The looping film above the cross-section picture: the mattress sits closed, opens
 * into its layers, and the lines run out to each layer's name and job, which stay on
 * screen throughout. Then it closes and starts again. Built from the cross-section picture cut into a room and four
 * moving layers, so the page gains no video file. Holds still off screen, and is
 * left out for visitors who ask for less motion (ProductInside says the same thing).
 */

const FILM = "/products/mattress/inside/film3";
const LABEL_X = 62; // % from the left where the labels start

/* The layer images hold only the mattress: 620 × 440 of the 1774 × 887 picture, at
   (395, 200). Smaller moving images keep the motion smooth. */
const BOX = { left: "22.267%", top: "22.548%", width: "34.949%", height: "49.605%" };

/* Top layer first. `drop` is how far it sits below its open place when closed, in %
   of its own height. `sink` and `tilt` are the slow float while open. Each layer sinks
   a little further than the one below, so the gaps only ever close up slightly and
   nothing the picture hides comes into view. */
const LAYERS = [
  { id: "cover", drop: 48.64, sink: 0.56, tilt: 0.34 },
  { id: "wave", drop: 38.18, sink: 0.44, tilt: -0.22 },
  { id: "blue", drop: 27.27, sink: 0.31, tilt: 0.16 },
  { id: "white", drop: 15, sink: 0.18, tilt: -0.1 },
];
const FLOAT_S = 4.4;

/** The slow rise and fall of one layer while the mattress is open. */
function floatOf(layer, floating) {
  return {
    animate: floating
      ? { y: ["0vw", `${layer.sink}vw`, "0vw"], rotate: [0, layer.tilt, 0] }
      : { y: "0vw", rotate: 0 },
    transition: floating ? { duration: FLOAT_S, repeat: Infinity, ease: "easeInOut" } : { duration: 0.7, ease: "easeInOut" },
  };
}

/* What each moment shows, and for how long. */
const STEPS = [
  { phase: "closed", ms: 1200 },
  { phase: "opening", ms: 2400 },
  { phase: "open", ms: 8800 },
  { phase: "closing", ms: 2400 },
];

export default function ProductInsideFilm({ product }) {
  const build = product?.build;
  const layers = build?.layers || [];
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    if (!inView) {
      setStep(0);
      return undefined;
    }
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms);
    return () => clearTimeout(t);
  }, [inView, reduce, step]);

  if (!build?.image || !layers.length || reduce) return null;

  const { phase } = STEPS[step];
  const opened = phase === "opening" || phase === "open";
  const showLabels = phase === "open";

  const heading = (
    <h2 className="display uppercase text-ink" style={{ fontSize: "clamp(1.05rem, 2.1cqw, 2.3rem)", fontWeight: 350, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
      <span className="block">{build.title}</span>
      <span className="mt-[0.12em] block text-brand">{build.accent}</span>
    </h2>
  );

  return (
    <section ref={ref} aria-label="How a Karmo mattress is built" className="@container relative w-full overflow-hidden bg-[#dcbb9c]">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: build.width / build.height }}>
        <Image src={`${FILM}/room.webp`} alt={build.alt} fill loading="eager" sizes="100vw" className="object-fill" />

        {/* Painted bottom layer first, so the cover ends up on top. */}
        <motion.div
          aria-hidden
          className="absolute"
          style={BOX}
          initial={false}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{ duration: 0.6, delay: opened ? 0.5 : 1.3 }}
        >
          <Image src={`${FILM}/fill.webp`} alt="" fill loading="eager" decoding="sync" sizes="35vw" className="object-fill" />
        </motion.div>

        {[...LAYERS].reverse().map((layer) => (
          <motion.div
            key={layer.id}
            className="absolute will-change-transform"
            style={BOX}
            initial={false}
            animate={{ y: opened ? "0%" : `${layer.drop}%` }}
            transition={{ duration: 2.2, ease: [0.45, 0, 0.25, 1] }}
          >
            <motion.div className="absolute inset-0 will-change-transform" {...floatOf(layer, showLabels)}>
              <Image src={`${FILM}/layer-${layer.id}.webp`} alt="" fill loading="eager" decoding="sync" sizes="35vw" className="object-fill" />
            </motion.div>
          </motion.div>
        ))}

        {/* Wide screens: the title and every label stay put; only the lines come and go. */}
        <div className="absolute hidden lg:block" style={{ left: `${LABEL_X}%`, top: "15%", width: "26%" }}>{heading}</div>

        {PINS.map(([x, y], i) => {
          const layer = layers[i];
          if (!layer) return null;
          const reach = ((LABEL_X - x) / (100 - x)) * 100;
          return (
            <div key={layer.title} className="absolute hidden lg:block" style={{ left: `${x}%`, top: `${y}%`, right: 0 }}>
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0"
                animate={LAYERS[i] ? { y: floatOf(LAYERS[i], showLabels).animate.y } : undefined}
                transition={LAYERS[i] ? floatOf(LAYERS[i], showLabels).transition : undefined}
              >
                <motion.span
                  className="absolute left-0 top-0 h-px origin-right bg-brand"
                  style={{ width: `${reach}%` }}
                  initial={false}
                  animate={{ scaleX: showLabels ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: showLabels ? i * 0.06 : 0, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute -left-1 -top-1 h-2 w-2 rounded-full border border-white bg-brand"
                  initial={false}
                  animate={{ opacity: showLabels ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: showLabels ? 0.4 + i * 0.06 : 0 }}
                />
              </motion.div>
              <div className="absolute top-0 flex -translate-y-1/2 items-center" style={{ left: `${reach}%`, width: "33cqw", gap: "0.8cqw" }}>
                <span
                  className="flex shrink-0 items-center justify-center bg-brand font-bold text-white"
                  style={{ width: "2cqw", height: "2cqw", minWidth: 18, minHeight: 18, fontSize: "clamp(10px, 0.95cqw, 16px)" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold uppercase text-ink" style={{ fontSize: "clamp(10px, 0.95cqw, 17px)", letterSpacing: "0.08em", lineHeight: 1.2 }}>{layer.title}</h3>
                  <p className="text-ink/60" style={{ fontSize: "clamp(9.5px, 0.85cqw, 15px)", lineHeight: 1.3 }}>{layer.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Phones and tablets: numbered pins on the picture, the list sits under it. */}
        <AnimatePresence>
          {showLabels
            ? PINS.map(([x, y], i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white bg-brand text-[10px] font-bold text-white sm:h-6 sm:w-6 sm:text-[12px] lg:hidden"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: i * 0.08 } }}
                  exit={{ opacity: 0 }}
                >
                  {i + 1}
                </motion.span>
              ))
            : null}
        </AnimatePresence>
      </div>

      <div className="bg-[#f7eee6] px-5 pb-6 pt-5 sm:px-8 lg:hidden">
        {heading}
        <ol className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {layers.map((layer, i) => (
            <li key={layer.title} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-brand text-[11px] font-bold text-white">{i + 1}</span>
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink">{layer.title}</h3>
                <p className="text-[12.5px] leading-snug text-ink/60">{layer.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
