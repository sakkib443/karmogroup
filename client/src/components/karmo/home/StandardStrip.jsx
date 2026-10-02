"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home trust strip — two icon sets. Colorful cartoon pack, then
 * the 3D sketch pack. A right-side arrow cycles them.
 */

const SETS = [
  [
    {
      title: "A legacy of 60 years",
      note: "of healthy sleep",
      icon: "/karmo/images/trust/cartoon-v3/legacy-60-v2.webp",
    },
    {
      title: "Largest Raw Material",
      note: "Stock",
      icon: "/karmo/images/trust/cartoon-v3/cartoon-pillow-v3.webp",
    },
    {
      title: "International Quality",
      note: "Certification",
      icon: "/karmo/images/trust/cartoon-v3/cartoon-globe-v3.webp",
    },
    {
      title: "Natural and",
      note: "Sustainable Products",
      icon: "/karmo/images/trust/cartoon-v3/natural-v2.webp",
    },
    {
      title: "Free Delivery",
      note: "Available",
      icon: "/karmo/images/trust/cartoon-v3/delivery-v2.webp",
    },
    {
      title: "5k+ Stores",
      note: "Pan Bangladesh",
      icon: "/karmo/images/trust/cartoon-v3/stores-v2.webp",
    },
  ],
  [
    {
      title: "A legacy of 60 years",
      note: "of healthy sleep",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-legacy-60.webp",
    },
    {
      title: "Largest Raw Material",
      note: "Stock",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-pillow.webp",
    },
    {
      title: "International Quality",
      note: "Certification",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-globe.webp",
    },
    {
      title: "Natural and",
      note: "Sustainable Products",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-natural.webp",
    },
    {
      title: "Free Delivery",
      note: "Available",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-delivery.webp",
    },
    {
      title: "5k+ Stores",
      note: "Pan Bangladesh",
      icon: "/karmo/images/trust/cartoon-v3/sketch-3d-stores.webp",
    },
  ],
];

function IconGrid({ items, large = false }) {
  const box = large
    ? "aspect-square h-[105px] w-[105px] shrink-0 sm:h-[125px] sm:w-[125px] lg:h-[133px] lg:w-[133px]"
    : "aspect-square h-[5.5rem] w-[5.5rem] shrink-0 sm:h-24 sm:w-24";
  const imgPx = large ? 133 : 96;

  const imgScale = (i) => {
    if (!large && (i === 1 || i === 2)) return "scale-[0.92]";
    if (large && i === 1) return "scale-[1.1]";
    if (large && i === 2) return "scale-[0.86]";
    if (large && i === 3) return "scale-[0.88]";
    return "";
  };

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
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              width={imgPx}
              height={imgPx}
              loading="lazy"
              decoding="async"
              className={`object-contain ${box} ${imgScale(i)}`}
            />
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
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const node = event.target;
      if (
        node instanceof HTMLElement &&
        (node.isContentEditable ||
          node.closest("input, textarea, select, [contenteditable='true']"))
      ) {
        return;
      }
      event.preventDefault();
      setSlide((s) =>
        event.key === "ArrowRight"
          ? (s + 1) % SETS.length
          : (s - 1 + SETS.length) % SETS.length,
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative bg-white">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="overflow-hidden"
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${SETS.length * 100}%`,
            transform: `translateX(-${slide * (100 / SETS.length)}%)`,
          }}
        >
          {SETS.map((items, index) => (
            <div
              key={index}
              className="shrink-0"
              style={{ width: `${100 / SETS.length}%` }}
            >
              <IconGrid items={items} large={index !== 0} />
            </div>
          ))}
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => setSlide((s) => (s + 1) % SETS.length)}
        aria-label="Show next icon set"
        className="absolute top-1/2 right-2 z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:right-3 sm:h-11 sm:w-11 lg:right-4"
      >
        <FiChevronRight className="text-[20px]" aria-hidden />
      </button>
    </section>
  );
}
