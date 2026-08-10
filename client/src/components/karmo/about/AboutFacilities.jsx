"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";

import { aboutFacilities } from "@/components/karmo/about/aboutData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The three industrial parks.
 *
 * No photographs: the profile's plant pages are page-sized composites that do
 * not crop to a card, and there is no site photography in the repo. So the
 * cards are typographic, and the status pill does the work a photo would —
 * one park is running, one is being built, one is planned, and saying so is
 * more use than three pictures of a gate.
 */

const STATUS_TONE = {
  live: "border-brand/30 bg-brand/[0.06] text-brand",
  building: "border-ink/15 bg-cream text-ink/60",
  planned: "border-ink/15 bg-white text-ink/45",
};

export default function AboutFacilities() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-t border-ink/8 bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell"
      >
        <motion.div variants={fade} className="text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            {aboutFacilities.eyebrow}
          </span>
          <h2 className="display mt-2 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            {aboutFacilities.titleLead}{" "}
            <span className="font-bold text-brand">{aboutFacilities.titleAccent}</span>
          </h2>
          <LeafRule />
        </motion.div>

        <motion.ol
          variants={group}
          className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3"
        >
          {aboutFacilities.units.map((unit) => (
            <motion.li
              key={unit.n}
              variants={fade}
              className="group flex flex-col border border-ink/10 bg-white p-7 transition-colors duration-300 hover:border-brand/30 lg:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="display text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
                  {unit.n}
                </span>
                <span
                  className={`shrink-0 border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    STATUS_TONE[unit.tone] ?? STATUS_TONE.planned
                  }`}
                >
                  {unit.status}
                </span>
              </div>

              <h3 className="display mt-6 text-[1.05rem] font-bold uppercase leading-[1.2] tracking-[0.04em] text-ink lg:text-[1.15rem]">
                {unit.title}
              </h3>

              <p className="mt-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                <FiMapPin className="text-[14px] text-brand" />
                {unit.place}
              </p>

              <p className="body-copy mt-auto pt-6 text-[13px] leading-[1.75] text-ink/55">
                {unit.note}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </section>
  );
}
