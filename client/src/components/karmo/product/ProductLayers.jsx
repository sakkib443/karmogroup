"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * One full-width band: Feel guide (left) + Build 4 layer (right).
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
    title: "Resilient support foam",
    body: "Mid-layer for recovery and posture — holds shape under load for years.",
  },
  {
    n: 4,
    title: "Motion-isolation base",
    body: "Dense foundation that limits motion transfer and protects edge support.",
  },
];

export default function ProductLayers() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="mt-[6px] bg-[#EEEFF1]">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        {/* ── Feel guide ── */}
        <motion.div
          variants={fade}
          className="flex flex-col bg-[#EEEFF1] px-5 py-6 sm:px-7 sm:py-7 lg:border-r lg:border-ink/8 lg:px-8 lg:py-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Feel guide
          </p>
          <h2 className="display mt-1.5 text-[1.35rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.55rem]">
            Soft to{" "}
            <span className="font-bold text-brand">extra firm</span>
          </h2>
          <p className="body-copy mt-2.5 max-w-md text-[13px] leading-relaxed text-ink/55">
            Same weight, different sink. Match Soft, Medium or Firm above to how
            deep you want the foam to give under everyday sitting.
          </p>

          <div className="relative mt-5 flex flex-1 items-center justify-center bg-[#EEEFF1] p-1 sm:mt-6">
            <div className="relative aspect-[16/7] w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
              <Image
                src="/karmo/images/product/gg.gif"
                alt="Firmness scale — how far the same weight sinks from soft to firm"
                fill
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Build 4 layer ── */}
        <motion.div
          variants={fade}
          className="flex flex-col bg-[#EEEFF1] px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Build 4 layer
          </p>
          <h2 className="display mt-1.5 text-[1.35rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.55rem]">
            Inside every{" "}
            <span className="font-bold text-brand">Karmo mattress</span>
          </h2>

          <div className="mt-4 grid flex-1 items-center gap-4 sm:mt-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] sm:max-w-[260px] lg:max-w-none lg:max-h-[420px]">
              <Image
                src="/karmo/images/product/build-4-layers.png"
                alt="Karmo mattress build — four numbered layers exploded"
                fill
                sizes="(min-width: 1024px) 22vw, 260px"
                className="object-contain object-center"
              />
            </div>

            <ol className="space-y-0">
              {layers.map((layer, i) => (
                <li
                  key={layer.n}
                  className={`flex gap-2.5 py-2.5 ${
                    i < layers.length - 1 ? "border-b border-ink/10" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white"
                  >
                    {layer.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold leading-snug text-brand sm:text-[14px]">
                      {layer.title}
                    </h3>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ink/55 sm:text-[12.5px]">
                      {layer.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
