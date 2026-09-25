"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const slides = [
  { 
    src: "/karmo/images/hometex/pillow/karmo-pillow-wide-logo-v2.png", 
    alt: "Two white Karmo pillows with printed logos on a sage-green bed in a sunlit bedroom",
    title: "ELEVATE YOUR SLEEP EXPERIENCE"
  },
  { 
    src: "/karmo/images/hometex/pillow/karmo-open-pillow-banner-v3.png", 
    alt: "Karmo pillow with an open corner revealing down filling beside a pile of feathers in a bright bedroom",
    title: "CRAFTED FOR PREMIUM COMFORT"
  },
];

export default function PillowHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return (
    <section aria-labelledby="pillow-title" aria-roledescription="carousel"
      className="relative isolate h-[calc(100dvh-112px)] overflow-hidden bg-stone-200"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      {slides.map((slide, index) => (
        <div key={slide.src} aria-hidden={index !== active}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`}>
          <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw"
            className="object-cover object-[70%_center] lg:object-center" />
        </div>
      ))}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
        <AnimatePresence initial={false} mode="wait">
          <motion.h1
            key={`${slides[active].src}-title`}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            id="pillow-title"
            className="display text-left text-[clamp(1.5rem,3.5vw,3.5rem)] font-semibold uppercase leading-tight tracking-[0.025em] text-white"
          >
            {slides[active].title}
          </motion.h1>
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
        {slides.map((slide, index) => (
          <button key={slide.src} type="button" onClick={() => setActive(index)}
            aria-label={`Show pillow banner ${index + 1}`} aria-current={index === active ? "true" : undefined}
            className="flex h-11 w-11 items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <span className={`h-1 w-6 transition-colors duration-300 ${index === active ? "bg-[#d81920]" : "bg-white/40"}`} />
          </button>
        ))}

      </div>
    </section>
  );
}
