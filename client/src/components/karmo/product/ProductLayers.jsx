"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Build 5 layer — full-width construction breakdown under the firmness band.
 */

const layers = [
  {
    n: 1,
    title: "Quilted comfort cover",
    body: "Breathable top fabric that draws moisture away for a cool, dry sleep surface.",
  },
  {
    n: 2,
    title: "Hi-density comfort foam",
    body: "Responsive pour that cushions pressure points without a quicksand sink.",
  },
  {
    n: 3,
    title: "Transition foam",
    body: "Bridges soft sink and deeper support so the feel stays even through the night.",
  },
  {
    n: 4,
    title: "Resilient support foam",
    body: "Mid-layer for recovery and posture — holds shape under load for years.",
  },
  {
    n: 5,
    title: "Motion-isolation base",
    body: "Dense foundation that limits motion transfer and protects edge support.",
  },
];

export default function ProductLayers() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-t border-ink/8 bg-[#EEEFF1]" aria-label="Mattress build layers">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell px-5 py-8 sm:px-7 sm:py-10 lg:px-8 lg:py-12"
      >
        <motion.div variants={fade} className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Build 5 layer
          </p>
          <h2 className="display mt-1.5 text-[1.35rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.55rem] lg:text-[1.75rem]">
            Inside every{" "}
            <span className="font-bold text-brand">Karmo mattress</span>
          </h2>
        </motion.div>

        <motion.div
          variants={fade}
          className="mt-6 grid items-center gap-6 sm:mt-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-14"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] sm:max-w-[300px] lg:max-h-[460px] lg:max-w-none">
            <Image
              src="/karmo/images/product/build-4-layers.png"
              alt="Karmo mattress build — five layered construction"
              fill
              sizes="(min-width: 1024px) 32vw, 300px"
              className="object-contain object-center"
            />
          </div>

          <ol className="space-y-0">
            {layers.map((layer, i) => (
              <li
                key={layer.n}
                className={`flex gap-3 py-3 ${
                  i < layers.length - 1 ? "border-b border-ink/10" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white"
                >
                  {layer.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold leading-snug text-brand sm:text-[15px]">
                    {layer.title}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink/55 sm:text-[13px]">
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
