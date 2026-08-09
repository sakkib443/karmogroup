"use client";

import { motion, useReducedMotion } from "framer-motion";
import { group, rise, VIEWPORT } from "@/components/karmo/motion";
import HeadingThree, { Mark } from "../HeadingThree/HeadingThree";
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
