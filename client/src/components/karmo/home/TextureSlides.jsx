"use client";

import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

/**
 * Homepage-only background textures. Parent section must be `relative`.
 * Slides marked `hidden` stay here for later use but are not shown.
 */

const SLIDES = [
  {
    id: "quilt-side",
    image: "/karmo/images/home-02/divisions/karmo-pattern-quilt-tuft.webp",
    imageOpacity: 0.24,
    overlay: "bg-white/50",
    hidden: true,
  },
  {
    id: "damask",
    image: "/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg",
    imageOpacity: 0.38,
    overlay: "bg-white/50",
    hidden: true,
  },
  {
    id: "damask-quilted",
    image: "/karmo/images/home-02/divisions/karmo-damask-quilted-v3.jpg",
    imageOpacity: 0.5,
    overlay: "bg-white/45",
  },
];

const ACTIVE_SLIDES = SLIDES.filter((s) => !s.hidden);

export default function TextureSlides({ lighter = false }) {
  const [slide, setSlide] = useState(0);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-white"
        aria-hidden
      />
      {ACTIVE_SLIDES.map((bg, i) => (
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
          <div className={`absolute inset-0 ${lighter ? "bg-white/70" : bg.overlay}`} />
        </div>
      ))}
      {ACTIVE_SLIDES.length > 1 ? (
        <button
          type="button"
          onClick={() => setSlide((s) => (s + 1) % ACTIVE_SLIDES.length)}
          aria-label="Show next background"
          className="absolute top-1/2 right-2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
        >
          <FiChevronRight className="text-[20px]" aria-hidden />
        </button>
      ) : null}
    </>
  );
}
