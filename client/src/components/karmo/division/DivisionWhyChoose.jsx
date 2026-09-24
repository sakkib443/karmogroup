"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * "Why choose …" band — a centred heading over three captioned image columns
 * (full-bleed row, fixed 6px gutter, hover zoom). Same design as the pillow
 * page's WhyChoosePillows section; driven entirely by data so any division
 * page can reuse it via `data.whyChoose`.
 *
 * Props:
 *   · heading — section title (optional)
 *   · items[] — { img, title, alt? }, rendered left → right
 *   · hover — zoom the image on hover (default true; hometex sets false)
 */
export default function DivisionWhyChoose({ heading, items = [], hover = true }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (!items.length) return null;

  return (
    <section className="bg-white py-2 md:py-4">
      <motion.div variants={group} {...reveal} viewport={VIEWPORT}>
        {heading ? (
          <motion.div
            variants={fade}
            className="mx-auto mb-4 px-4 sm:px-6 lg:px-8"
          >
            <h2 className="display text-center text-[clamp(1.5rem,3vw,2.5rem)] font-semibold uppercase tracking-wider text-[#17191c]">
              {heading}
            </h2>
          </motion.div>
        ) : null}

        <div className="flex w-full flex-col gap-[6px] md:flex-row">
          {items.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              variants={fade}
              className="flex flex-1 flex-col"
            >
              <div
                className={`relative aspect-[3/2] w-full overflow-hidden bg-stone-200 ${
                  hover ? "group" : ""
                }`}
              >
                <Image
                  src={item.img}
                  alt={item.alt || item.title || ""}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={`object-cover ${
                    hover ? "transition-transform duration-700 group-hover:scale-105" : ""
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20" />
              </div>
              {item.title ? (
                <div className="px-4 pb-2 pt-4 text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#17191c] sm:text-[12px]">
                    {item.title}
                  </h3>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
