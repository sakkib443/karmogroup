"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise, VIEWPORT } from "../motion";
import HeadingThree, { Mark } from "./HeadingThree";

/**
 * The heritage panel — and the only section on this page with no photograph in
 * it, on purpose.
 *
 * By the time the reader arrives here they have passed a full-width hero
 * photograph and a rail of four divisions, and below this sit three curated
 * room scenes, a film band and a strip of running video. A page of pictures
 * needs somewhere to stop. A dark panel of nothing but type is that stop, and
 * it makes the two sections either side of it look better than they do next to
 * each other.
 *
 * It also carries no call to action. Everything else on this page is asking for
 * something — explore the division, see the range, watch the film. This is the
 * one block that only states a fact, and putting a button on it would turn the
 * company's own history into another offer.
 *
 * ── On the claims ───────────────────────────────────────────────────────────
 * Two are figures and two are the client's own words, and they are set
 * differently because they are different kinds of statement:
 *
 *   · **1965** and **04** are facts this site already publishes elsewhere — the
 *     founding year in the (karmo) layout's own description, the four divisions
 *     in every navigation on the site.
 *   · *Largest Raw Material Stock* and *International Quality Certified* are
 *     Generic 2 and 3 from `docs/copy/taglines.md`, verbatim. That file lists
 *     both as approved but unused, with the trust strip as their suggested
 *     home. They fit better here, where the section is about standing rather
 *     than about product.
 *
 * Nothing is invented, and nothing is dressed up with a number it does not
 * have. `Capabilities.jsx` records what happened the last time claims were
 * borrowed for this site without checking whose they were; the two lines here
 * without a figure are the ones Karmo has words for but no measure, and they
 * are set as words.
 */

const figures = [
  {
    value: "1965",
    label: "Manufacturing in Bangladesh since",
  },
  {
    value: "04",
    label: "Divisions, one supply chain",
  },
];

/* Generic 2 and Generic 3, exactly as supplied. */
const claims = ["Largest Raw Material Stock", "International Quality Certified"];

export default function ProofPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-shade-deep py-20 md:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <HeadingThree
            index="02"
            eyebrow="Rooted in Heritage"
            tone="dark"
            title={["The Journey", <Mark key="a">Since 1965</Mark>]}
            lead="Six decades in the same trade, in the same country — and every link in the chain still under one roof."
          />
        </div>

        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="lg:col-span-7 lg:pt-3"
        >
          <div className="grid gap-10 sm:grid-cols-2">
            {figures.map((f) => (
              <motion.div key={f.value} variants={rise}>
                <span className="display block text-[3.4rem] font-light leading-none tracking-[-0.04em] text-white lg:text-[4.2rem]">
                  {f.value}
                </span>
                <span className="mt-4 block h-px w-12 bg-brand" />
                <p className="body-copy mt-4 max-w-[22ch] text-[13.5px] leading-[1.7] text-white/55">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 border-t border-white/12">
            {claims.map((claim) => (
              <motion.p
                key={claim}
                variants={rise}
                className="flex items-center gap-4 border-b border-white/12 py-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80"
              >
                <span aria-hidden="true" className="h-px w-6 shrink-0 bg-brand" />
                {claim}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
