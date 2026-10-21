"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Dedicated full-width two-banner component for Bed & Automotive Foam.
 * Removes the top feature claims cards and presents the spotlight image
 * and brand film side-by-side in a responsive edge-to-edge layout,
 * matching the HomeTex and Pillow designs.
 */
export default function BedAutomotiveTwoBanners({
  className = "mb-1.5",
  spotlight = {
    image: "/pages/foam/banner-01.webp",
    alt: "Karmo Bed & Automotive Foam Banner",
    overlay: true,
    headingLead: "Designed",
    headingAccent: "to",
    headingEnd: "endure",
    subline: "High-density cores and open airflow for everyday living rooms.",
    brand: "Karmo Foam",
  },
  film = "/pages/foam/videos/shorts/v1-tisa-trim.mp4",
  still = "/pages/foam/mosaic/tisha-film-still-hq.webp",
  filmAlt = "Tanzin Tisha for Karmo Foam",
  filmOverlay = true,
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.2 });

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion || !film) return undefined;
    if (inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
    return undefined;
  }, [inView, reduceMotion, film]);

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative z-[1] w-full">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid w-full grid-cols-1 gap-[6px] md:h-[min(49svh,535px)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
        >
          {/* Left Banner: Spotlight (Man on cloud / designed to endure) */}
          <motion.article
            variants={fade}
            className="group relative h-full min-h-[260px] sm:min-h-[340px] md:min-h-0 overflow-hidden bg-[#0b1a33]"
          >
            {spotlight?.image ? (
              <Image
                src={spotlight.image}
                alt={spotlight.alt || ""}
                fill
                sizes="(min-width: 768px) 65vw, 100vw"
                className="object-cover object-[center_40%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                priority={false}
              />
            ) : null}

            {spotlight?.overlay ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/25"
              />
            ) : null}

            <div className="relative z-[1] flex h-full items-center justify-end px-6 py-6 sm:px-8 lg:px-10">
              <div className="max-w-[16rem] text-right sm:max-w-[18rem] lg:max-w-[20rem]">
                <h3 className="display section-heading title-card-line uppercase text-white">
                  {spotlight?.headingLead}{" "}
                  {spotlight?.headingAccent ? (
                    <span className="italic text-white/80">
                      {spotlight.headingAccent}
                    </span>
                  ) : null}{" "}
                  {spotlight?.headingEnd}
                </h3>
                {spotlight?.subline ? (
                  <p className="body-copy mt-3 text-[12.5px] leading-[1.5] text-white/85 sm:text-[13.5px]">
                    {spotlight.subline}
                  </p>
                ) : null}
                {spotlight?.brand ? (
                  <p className="display mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white sm:mt-6 sm:text-[12px]">
                    {spotlight.brand}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.article>

          {/* Right Banner: Film / Video Panel */}
          <motion.div
            ref={wrapRef}
            variants={fade}
            className="group relative h-full min-h-[220px] sm:min-h-[280px] md:min-h-0 overflow-hidden bg-[#0b1a33]"
          >
            {still ? (
              <Image
                src={still}
                alt={filmAlt}
                fill
                sizes="(min-width: 768px) 35vw, 100vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            ) : null}

            {!reduceMotion && film ? (
              <video
                ref={videoRef}
                src={film}
                muted
                playsInline
                loop
                preload="auto"
                aria-label={filmAlt || "Karmo foam film"}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : null}

            {filmOverlay ? (
              <div className="pointer-events-none absolute inset-0 bg-black/20" />
            ) : null}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
