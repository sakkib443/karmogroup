"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDES = [
  {
    id: "bed",
    image:
      "/karmo/images/foam-2/bed-automotive/bed-approved-banner.png",
    alt: "A sunlit bedroom with exposed blue and cream mattress foam and Karmo branding",
    title: "THE COMFORT BEHIND YOUR SLEEP",
    objectPosition: "75% center",
  },
  {
    id: "automotive",
    image:
      "/karmo/images/foam-2/bed-automotive/automotive-approved-banner.png",
    alt: "Blue coach seats beside a green coastline, with a vertical foam cutaway embossed KARMO on the front seat",
    title: "WHERE COMFORT MOVES WITH YOU",
    objectPosition: "88% center",
  },
];

const AUTOPLAY_MS = 6500;

export default function BedAutomotiveHero() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeActiveIndex = activeIndex % SLIDES.length;
  const active = SLIDES[safeActiveIndex];

  useEffect(() => {
    if (reduceMotion || paused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return (
    <section
      aria-label="Karmo bed and automotive foam"
      className="relative isolate h-[calc(100vh-112px)] overflow-hidden bg-[#f7f8f8] text-[#17191c]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={active.id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.008 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src={active.image}
            alt={active.alt}
            fill
            priority={safeActiveIndex === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: active.objectPosition }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-8 lg:px-14 xl:px-20">
        <AnimatePresence initial={false} mode="wait">
          <motion.h1
            key={`${active.id}-title`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="display whitespace-nowrap text-left text-[clamp(0.8rem,3.2vw,3rem)] font-semibold uppercase leading-tight tracking-[0.025em] text-white"
          >
            {active.title}
          </motion.h1>
        </AnimatePresence>

        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-8"
          aria-label="Choose a banner"
        >
          {SLIDES.map((slide, index) => {
            const selected = index === safeActiveIndex;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${slide.title.toLowerCase()} banner`}
                aria-current={selected ? "true" : undefined}
                className="group flex h-8 items-center px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d81920]"
              >
                <span
                  aria-hidden="true"
                  className={`block h-[3px] transition-[width,background-color] duration-500 ${
                    selected
                      ? "w-10 bg-[#d81920]"
                      : "w-5 bg-[#17191c]/25 group-hover:bg-[#17191c]/50"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
