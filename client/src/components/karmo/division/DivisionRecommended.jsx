"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Why-buy band under the icon strip — half-viewport tall, title + three
 * captioned columns. Photos come from data; all copy is HTML.
 * Image row is full-bleed with a fixed 6px gutter between panels.
 */
export default function DivisionRecommended({
  heading = "Recommended Best",
  columns = [],
  uncropped = false,
  imageOverlay = false,
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!columns.length) return null;
  const hasDescriptions = columns.some((col) => col.description);

  return (
    <section id="which-foam" className="mb-1.5 w-full overflow-hidden bg-[#f7f7f8]">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`flex min-h-[340px] flex-col py-5 sm:min-h-[300px] sm:py-6 lg:py-7 ${hasDescriptions || uncropped ? "" : "sm:h-[50svh]"}`}
      >
        <motion.h2
          variants={fade}
          className="display section-heading title-card-line shrink-0 px-4 text-center uppercase text-[#0b1a33] sm:px-8 lg:px-12"
        >
          {heading}
        </motion.h2>

        <div className="mt-4 grid min-h-0 w-full flex-1 grid-cols-1 gap-[6px] sm:mt-5 sm:grid-cols-3">
          {columns.map((col) => (
            <motion.article
              key={col.id}
              variants={fade}
              className="flex min-h-0 min-w-0 flex-col"
            >
              <div className={`relative w-full overflow-hidden ${uncropped ? "aspect-[3/2]" : hasDescriptions ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-auto sm:min-h-0 sm:flex-1"}`}>
                <Image
                  src={col.image}
                  alt={col.alt || ""}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className={uncropped ? "object-contain object-center" : "object-cover object-center"}
                  style={{ objectPosition: col.objectPosition || "center" }}
                />
                {imageOverlay ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/20"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "rgba(11, 26, 51, 0.18)" }}
                  />
                )}
              </div>
              <p className="display shrink-0 px-2 pb-1 pt-3 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-[#0b1a33] sm:px-3 sm:text-[12px] lg:text-[13px]">
                {col.caption}
              </p>
              {col.description && (
                <p className="mx-auto max-w-md px-5 pb-4 pt-1 text-center text-sm leading-relaxed text-[#0b1a33]/75">
                  {col.description}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
