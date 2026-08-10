"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * What’s inside the grade — Karmo-facing layers (replaces the Douglas image).
 */
const layers = [
  {
    n: "01",
    title: "Surface comfort layer",
    body: "A softer top pour that takes the first sit — pressure relief without a quicksand feel, so cushions stay inviting day after day.",
  },
  {
    n: "02",
    title: "High-resilience core",
    body: "The working heart of Karmo 180. Pure rubber-grade foam that springs back after every load and keeps sofa seats from sagging.",
  },
  {
    n: "03",
    title: "Support base",
    body: "A denser foundation layer for edge hold and long-term structure — the part that carries the frame’s weight without crumbling.",
  },
  {
    n: "04",
    title: "Clean cut finish",
    body: "Sheets cut to your width, length and height so the foam fills the cavity properly — no gaps, no stuffing with fillers.",
  },
];

export default function ProductLayers() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-b border-ink/8 bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16"
      >
        <motion.div variants={fade} className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <Image
              src="/karmo/images/home-02/divisions/foam-karmo-sofa-blocks-studio.png"
              alt="Karmo foam blocks stacked in studio"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div variants={fade} className="lg:col-span-7">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Construction
          </span>
          <h2 className="display mt-3 text-[1.55rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[1.9rem]">
            Built in{" "}
            <span className="font-bold text-brand">four layers</span>
          </h2>
          <LeafRule align="start" />
          <p className="body-copy mt-5 max-w-lg text-[14px] leading-relaxed text-ink/55">
            Not a mystery sandwich of unknown foam. Every sheet is poured,
            graded and cut so comfort, bounce and support each have a job.
          </p>

          <ol className="mt-8 space-y-0">
            {layers.map((layer, i) => (
              <li
                key={layer.n}
                className={`flex gap-4 py-5 ${
                  i < layers.length - 1 ? "border-b border-ink/8" : ""
                }`}
              >
                <span className="display shrink-0 text-[1.25rem] font-bold tabular-nums text-brand">
                  {layer.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold uppercase tracking-[0.06em] text-ink">
                    {layer.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
                    {layer.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}
