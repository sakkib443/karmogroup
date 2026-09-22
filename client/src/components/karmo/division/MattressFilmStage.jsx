"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Sleep Well film — full-bleed, full-viewport, overlay + one white line.
 */
export default function MattressFilmStage({
  src,
  still,
  alt = "",
  heading = "The Art of Restful Living",
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion || !src) return undefined;
    if (inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
    return undefined;
  }, [inView, reduceMotion, src]);

  if (!src && !still) return null;

  return (
    <section
      id="mattress-sleep-well"
      ref={wrapRef}
      aria-label={alt || "Karmo mattress Sleep Well film"}
      className="relative mb-1.5 w-full overflow-hidden bg-[#0b1a33]"
      style={{ minHeight: "100svh" }}
    >
      {still ? (
        <Image
          src={still}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
      ) : null}
      {!reduceMotion && src ? (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          loop
          preload="auto"
          aria-label={alt || "Karmo mattress film"}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(11,21,40,0.72) 0%, rgba(11,21,40,0.32) 45%, rgba(11,21,40,0.22) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-5 text-center sm:px-8">
        <h2
          className="display hero-heading title-card-line whitespace-nowrap uppercase text-white"
          style={{
            fontSize: "clamp(1.35rem, 1.1rem + 2.1vw, 3.15rem)",
            fontWeight: 350,
            fontVariationSettings: '"wght" 350',
            letterSpacing: "0.12em",
            lineHeight: 1.1,
            textShadow: "0 2px 28px rgba(0,0,0,0.55)",
          }}
        >
          {heading}
        </h2>
      </div>
    </section>
  );
}
