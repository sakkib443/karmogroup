"use client";

import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

/**
 * Homepage-only texture pair: side-shot quilt first, then the original damask.
 * Parent section must be `relative`.
 */

const SLIDES = [
  {
    id: "quilt-side",
    image: "/karmo/images/home-02/divisions/karmo-pattern-quilt-tuft.webp",
    imageOpacity: 0.24,
    overlay: "bg-white/50",
  },
  {
    id: "damask",
    image: "/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg",
    imageOpacity: 0.38,
    overlay: "bg-white/50",
  },
];

export default function TextureSlides() {
  const [slide, setSlide] = useState(0);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-white"
        aria-hidden
      />
      {SLIDES.map((bg, i) => (
        <div
          key={bg.id}
          className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: bg.imageOpacity,
            }}
          />
          <div className={`absolute inset-0 ${bg.overlay}`} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
        aria-label="Show next background"
        className="absolute top-1/2 right-2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
      >
        <FiChevronRight className="text-[20px]" aria-hidden />
      </button>
    </>
  );
}
