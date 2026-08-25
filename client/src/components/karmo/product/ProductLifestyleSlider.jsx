"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * One fixed frame — 2–4 near-identical lifestyle poses (side / back / sit)
 * soft-crossfade every ~1s in the same place. Helix-style pose morph.
 */

const INTERVAL_MS = 1100;

const DEFAULT_SLIDES = [
  {
    src: "/karmo/images/product/lifestyle/pose-side.jpg",
    alt: "Resting on the side on a Karmo mattress",
  },
  {
    src: "/karmo/images/product/lifestyle/pose-back.jpg",
    alt: "Resting on the back on a Karmo mattress",
  },
  {
    src: "/karmo/images/product/lifestyle/pose-sit.jpg",
    alt: "Sitting up in bed on a Karmo mattress",
  },
];

export default function ProductLifestyleSlider({ slides = DEFAULT_SLIDES }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || slides.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative mt-[6px] w-full overflow-hidden bg-[#e8e4de]"
      aria-label="Sleep pose gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] min-h-[min(48svh,380px)] w-full md:min-h-[min(58svh,520px)] lg:aspect-[21/9] lg:min-h-[min(64svh,600px)]">
        {/* Soft crossfade in place — same spot, pose changes */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Tiny progress dots — no big copy overlay */}
        <div className="absolute bottom-5 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {slides.map((item, i) => (
            <button
              key={item.src}
              type="button"
              aria-label={`Pose ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
