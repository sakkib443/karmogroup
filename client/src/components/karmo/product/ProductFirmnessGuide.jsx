"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Soft → Extra Firm visual guide — educates the density choice above.
 */
const steps = [
  "Extra Soft",
  "Soft",
  "Medium Soft",
  "Medium",
  "Medium Firm",
  "Firm",
  "Extra Firm",
];

export default function ProductFirmnessGuide() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-cream/50 py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell"
      >
        <motion.div
          variants={fade}
          className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div className="lg:col-span-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
              Feel guide
            </span>
            <h2 className="display mt-3 text-[1.55rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[1.9rem]">
              Soft to{" "}
              <span className="font-bold text-brand">extra firm</span>
            </h2>
            <LeafRule align="start" />
            <p className="body-copy mt-5 text-[14px] leading-relaxed text-ink/55">
              Same weight, different sink. Use this scale when you pick Soft,
              Medium or Firm above — so the foam you order matches how you
              actually want the seat to feel.
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {steps.map((label) => (
                <li
                  key={label}
                  className="border border-ink/12 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink/70"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden border border-ink/10 bg-white lg:col-span-7">
            <Image
              src="/karmo/images/product/gg.gif"
              alt="Firmness scale from extra soft to extra firm"
              fill
              unoptimized
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain p-4 sm:p-6"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
