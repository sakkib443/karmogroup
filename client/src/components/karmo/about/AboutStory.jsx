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
    <section id="history" className="relative mb-1.5 scroll-mt-[140px] bg-white">
      {/* Split band: the picture runs off the left screen edge and the copy
          keeps a measured column on the right — the shape `ChemicalsBand` uses
          on the homepage.

          This was a `shell` two-column with a 40/64px gap, which held the photo
          in a 684px box floating in white. On a page whose neighbours all run
          edge to edge that reads as a different site; the picture is the band
          here, not an illustration inside one. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid items-center gap-8 lg:grid-cols-2 lg:gap-0"
      >
        {/* ── Picture ─────────────────────────────────────────────────────── */}
        <motion.div variants={fade} {...reveal} viewport={VIEWPORT} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream lg:aspect-auto lg:h-full lg:min-h-[560px]">
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
          <div className="absolute -bottom-5 left-5 bg-brand px-6 py-4 text-center shadow-[0_18px_40px_-18px_rgba(212,67,72,0.55)] lg:-bottom-6 lg:left-8">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
              {aboutStory.plaque.label}
            </span>
            <span className="display mt-1 block text-[1.6rem] font-bold leading-none tabular-nums text-white lg:text-[1.85rem]">
              {aboutStory.plaque.figure}
            </span>
          </div>
        </motion.div>

        {/* ── Copy ────────────────────────────────────────────────────────── */}
        {/* Carries its own padding now that the grid has left `shell`: the
            picture is allowed to touch the screen edge, the words are not. */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="px-6 pb-12 pt-6 md:px-12 lg:max-w-[46rem] lg:py-16 lg:pl-14 lg:pr-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            {aboutStory.eyebrow}
          </span>
          <h2 className="display section-heading mt-3 uppercase text-ink">
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
