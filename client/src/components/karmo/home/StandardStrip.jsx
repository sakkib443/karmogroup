"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home trust strip — cartoon pack only.
 * 3D sketch webps stay on disk for later:
 * sketch-3d-legacy-60, sketch-3d-pillow, sketch-3d-globe,
 * sketch-3d-natural, sketch-3d-delivery, sketch-3d-stores.
 */

const ICONS = [
  {
    title: "A legacy of 60 years",
    note: "of healthy sleep",
    icon: "/karmo/images/trust/cartoon-v3/legacy-60-v5.webp",
  },
  {
    title: "Largest Raw Material",
    note: "Stock",
    icon: "/karmo/images/trust/cartoon-v3/chem-stock-v3.webp",
  },
  {
    title: "International Quality",
    note: "Certification",
    icon: "/karmo/images/trust/cartoon-v3/cartoon-globe-v4.webp",
  },
  {
    title: "Natural and",
    note: "Sustainable Products",
    icon: "/karmo/images/trust/cartoon-v3/natural-v5.webp",
  },
  {
    title: "Free Delivery",
    note: "Available",
    icon: "/karmo/images/trust/cartoon-v3/delivery-v2.webp",
  },
  {
    title: "5k+ Stores",
    note: "Pan Bangladesh",
    icon: "/karmo/images/trust/cartoon-v3/stores-v5.webp",
  },
];

function IconGrid({ items }) {
  const box =
    "aspect-square h-[5.5rem] w-[5.5rem] shrink-0 sm:h-24 sm:w-24";
  const imgPx = 96;
  const imgScale = (i) => (i === 2 ? "scale-[0.92]" : "");

  return (
    <ul className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12">
      {items.map(({ title, note, icon }, i) => (
        <li
          key={title}
          className={`group text-center lg:px-3 xl:px-4 ${
            i === 0 ? "lg:pl-0" : ""
          } ${i === items.length - 1 ? "lg:pr-0" : ""} ${
            i > 0 ? "lg:border-l lg:border-ink/10" : ""
          }`}
        >
          <span
            className={`relative mx-auto flex items-center justify-center overflow-visible transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${box}`}
          >
            <Image
              src={icon}
              alt=""
              aria-hidden="true"
              width={imgPx}
              height={imgPx}
              unoptimized
              className={`object-contain ${box} ${imgScale(i)}`}
            />
            {i === 5 ? (
              <span className="pointer-events-none absolute top-[3%] right-[1%] rounded-full bg-white px-[7px] py-[3px] text-[10px] font-black leading-none tracking-tight text-[#e14a50] sm:text-[11px]">
                5K+
              </span>
            ) : null}
          </span>
          <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
            {title}
          </h3>
          <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
            {note}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative bg-white">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
      >
        <IconGrid items={ICONS} />
      </motion.div>
    </section>
  );
}
