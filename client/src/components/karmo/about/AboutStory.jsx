"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

import { aboutStory } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The founding story — picture left, copy right, the same two-column editorial
 * arrangement `FoamStory` uses on the homepage (left heading scale, 1.65rem →
 * 2.15rem, not the centred 2.4rem one).
 *
 * The four facts under the copy are the load-bearing claims from the profile's
 * opening page, pulled out of the prose so they can be scanned without reading
 * two paragraphs first.
 */
export default function AboutStory() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white py-14 lg:py-20">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        {/* ── Picture ─────────────────────────────────────────────────────── */}
        <motion.div variants={fade} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
            <Image
              src={aboutStory.image.src}
              alt={aboutStory.image.alt}
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* The year, sat on the corner of the frame. It is the one number the
              whole page hangs off, so it gets to be an object rather than a
              line of body copy. */}
          <div className="absolute -bottom-5 left-5 bg-brand px-6 py-4 text-center shadow-[0_18px_40px_-18px_rgba(230,0,0,0.55)] lg:-bottom-6 lg:left-8">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
              {aboutStory.plaque.label}
            </span>
            <span className="display mt-1 block text-[1.6rem] font-bold leading-none tabular-nums text-white lg:text-[1.85rem]">
              {aboutStory.plaque.figure}
            </span>
          </div>
        </motion.div>

        {/* ── Copy ────────────────────────────────────────────────────────── */}
        <motion.div variants={fade} className="pt-6 lg:pt-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            {aboutStory.eyebrow}
          </span>
          <h2 className="display mt-3 text-[1.65rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.85rem] lg:text-[2.15rem]">
            {aboutStory.titleLead}{" "}
            <span className="font-bold text-brand">{aboutStory.titleAccent}</span>
          </h2>

          <div className="mt-6 space-y-4">
            {aboutStory.paragraphs.map((text) => (
              <p
                key={text.slice(0, 24)}
                className="body-copy max-w-[34rem] text-[15px] leading-[1.85] text-ink/58"
              >
                {text}
              </p>
            ))}
          </div>

          <ul className="mt-8 space-y-3 border-t border-ink/8 pt-7">
            {aboutStory.facts.map((factText) => (
              <li key={factText} className="flex gap-3.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand text-white">
                  <FiCheck className="text-[12px]" strokeWidth={3} />
                </span>
                <span className="body-copy text-[14px] leading-[1.7] text-ink/70">
                  {factText}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
