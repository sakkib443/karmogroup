"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FiBox, FiCpu, FiLayers, FiSliders } from "react-icons/fi";

import { aboutStrength } from "@/components/karmo/about/aboutData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const icons = {
  materials: FiBox,
  machinery: FiCpu,
  stock: FiLayers,
  rnd: FiSliders,
};

/**
 * "Our strength" — the profile's own section title, and its own argument:
 * imported material, computerised plant, the deepest stock in the country, and
 * formulation done per customer.
 *
 * The supplier row is names set as type rather than logos. Karmo buys from
 * BASF, Momentive, Shell, Mitsui and Dow; it does not represent them, and
 * five foreign marks in a row would read like a partnership claim the profile
 * never makes.
 */
export default function AboutStrength() {
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
            {aboutStrength.eyebrow}
          </span>
          <h2 className="display mt-2 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            {aboutStrength.titleLead}{" "}
            <span className="font-bold text-brand">{aboutStrength.titleAccent}</span>
          </h2>
          <LeafRule />
          <p className="body-copy mx-auto mt-6 max-w-2xl text-[15px] leading-[1.85] text-ink/55">
            {aboutStrength.lead}
          </p>
        </motion.div>

        <motion.ul
          variants={group}
          className="mt-12 grid gap-px bg-ink/8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {aboutStrength.pillars.map((pillar) => {
            const Icon = icons[pillar.id] ?? FiLayers;
            return (
              <motion.li
                key={pillar.id}
                variants={fade}
                className="group bg-white px-6 py-8 lg:px-7 lg:py-10"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-brand/8 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon className="text-[24px]" strokeWidth={1.7} />
                </span>
                <h3 className="display mt-6 text-[14px] font-bold uppercase tracking-[0.06em] text-ink">
                  {pillar.title}
                </h3>
                <p className="body-copy mt-3 text-[13px] leading-[1.75] text-ink/55">
                  {pillar.note}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* ── Suppliers ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fade}
          className="mt-12 border border-ink/10 px-6 py-8 text-center lg:mt-16 lg:px-10"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/40">
            {aboutStrength.suppliersLabel}
          </span>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:gap-x-14">
            {aboutStrength.suppliers.map((supplier) => (
              <li
                key={supplier}
                className="display text-[15px] font-bold uppercase tracking-[0.18em] text-ink/70 lg:text-[18px]"
              >
                {supplier}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
