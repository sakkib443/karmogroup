"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import LeafRule from "@/components/karmo/about/LeafRule";

/**
 * Inside the mattress — the product's own cross-section, layer by layer.
 *
 * Foam mattresses use the exploded brochure view (its numbers 1–6 are part of
 * the picture); spring mattresses use the cut-away photo with numbered markers
 * placed on each layer. The list on the right reads in the same order, and on
 * the spring view hovering a layer lights up its marker.
 *
 * The band runs edge to edge in a warm tone close to the pictures' own
 * backdrop, and the picture's rim is feathered so it melts into it.
 * Data: productDetailData.js → buildFor(slug). Hidden when a product has none.
 */

const BAND = "#f7eee6";

export default function ProductInside({ product }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [active, setActive] = useState(null);

  const build = product?.build;
  if (!build?.layers?.length) return null;
  const ratio = build.width / build.height;
  const specs = product.specs || [];

  return (
    <section
      aria-label={`Inside the ${product.shortName}`}
      className="relative overflow-hidden border-b border-ink/8"
      style={{ backgroundColor: BAND }}
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mx-auto grid w-full max-w-[1760px] items-center gap-8 px-5 py-10 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-12 lg:px-12 lg:py-14 xl:gap-16"
      >
        {/* ── Picture ───────────────────────────────────────────────── */}
        <motion.div variants={fade} className="min-w-0">
          <div
            className="relative mx-auto"
            style={{
              width: `min(100%, calc((100svh - 11rem) * ${ratio}))`,
              aspectRatio: `${build.width} / ${build.height}`,
            }}
          >
            <Image
              src={build.image}
              alt={build.alt}
              fill
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="object-contain"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse 72% 70% at 50% 50%, #000 62%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 72% 70% at 50% 50%, #000 62%, transparent 100%)",
              }}
            />
            {build.spots?.map(([x, y], i) => (
              <span
                key={`${x}-${y}`}
                aria-hidden
                className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-white text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.22)] transition-[transform,background-color] duration-300 sm:h-8 sm:w-8 sm:text-[13px] ${
                  active === i ? "scale-125 bg-ink" : "bg-brand"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Words ─────────────────────────────────────────────────── */}
        <motion.div variants={fade} className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            Layer by layer
          </span>
          <h2 className="display section-heading mt-2 uppercase text-ink">
            Inside the <span className="text-brand">{product.shortName}</span>
          </h2>
          <LeafRule align="start" className="mt-4" />

          {specs.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {specs.map((s) => (
                <li
                  key={s}
                  className="border border-ink/15 bg-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/70"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : null}

          <ol className="mt-6 border-t border-ink/10">
            {build.layers.map((layer, i) => (
              <li
                key={layer.title}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-ink/10 py-3 sm:py-3.5"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center text-[13px] font-bold text-white transition-colors duration-300 ${
                    active === i ? "bg-brand" : "bg-ink"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink">
                    {layer.title}
                  </h3>
                  <p className="body-copy mt-1 text-[13.5px] leading-relaxed text-ink/60">
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
