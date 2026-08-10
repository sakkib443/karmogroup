"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";

import { aboutReach } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Reach — the 747 dealer points and the seven divisions they cover.
 *
 * The profile lists every shop by name across four pages. That is a dealer
 * directory and belongs on a "find a store" page, so only the total and the
 * seven divisions are here; the head office closes the section because it is
 * the one address a company page is actually asked for.
 */
export default function AboutReach() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-t border-ink/8 bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20"
      >
        {/* ── Copy ────────────────────────────────────────────────────────── */}
        <motion.div variants={fade}>
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" />
            {aboutReach.eyebrow}
          </span>
          <h2 className="display mt-4 text-[1.65rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.85rem] lg:text-[2.15rem]">
            {aboutReach.titleLead}{" "}
            <span className="font-bold text-brand">{aboutReach.titleAccent}</span>
          </h2>

          {aboutReach.paragraphs.map((text) => (
            <p
              key={text.slice(0, 24)}
              className="body-copy mt-6 max-w-[34rem] text-[15px] leading-[1.85] text-ink/58"
            >
              {text}
            </p>
          ))}

          <div className="mt-8 flex items-start gap-4 border-t border-ink/8 pt-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand/25 text-brand">
              <FiMapPin className="text-[18px]" />
            </span>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                {aboutReach.office.label}
              </span>
              {aboutReach.office.lines.map((line) => (
                <span key={line} className="mt-1 block text-[14px] leading-snug text-ink/70">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Figure + the seven divisions ─────────────────────────────────── */}
        <motion.div variants={fade}>
          <div className="border border-ink/10">
            <div className="border-b border-ink/8 bg-brand px-7 py-8 text-center lg:py-10">
              <span className="display block text-[3.2rem] font-bold leading-none tabular-nums tracking-[-0.02em] text-white lg:text-[4rem]">
                {aboutReach.figure}
              </span>
              <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                {aboutReach.figureLabel}
              </span>
            </div>

            <ul className="grid gap-px bg-ink/8 sm:grid-cols-2">
              {aboutReach.divisions.map((division, index) => (
                <li
                  key={division}
                  className={`flex items-baseline gap-3 bg-white px-6 py-4 ${
                    /* Seven is odd, so the last cell spans both columns rather
                       than leaving a hole beside it. */
                    index === aboutReach.divisions.length - 1 ? "sm:col-span-2" : ""
                  }`}
                >
                  <span className="display text-[11px] font-bold tabular-nums tracking-[0.14em] text-ink/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="display text-[13px] font-bold uppercase tracking-[0.12em] text-ink/80">
                    {division}
                  </span>
                  <span className="ml-auto text-[11px] uppercase tracking-[0.14em] text-ink/35">
                    Division
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
