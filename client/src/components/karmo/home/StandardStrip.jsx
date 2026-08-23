"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home trust strip — same six labels, two icon packs for side-by-side comparison.
 * Pack A = current live icons. Pack B = `/public/new icon` (copied to trust/v2).
 * Right-edge controls + swipe switch packs; copy never changes.
 */

const labels = [
  {
    title: "A legacy of 60 years",
    note: "of healthy sleep",
  },
  {
    title: "Trusted By Million",
    note: "families worldwide.",
  },
  {
    title: "Recognised By",
    note: "Super Brand",
  },
  {
    title: "Natural and",
    note: "Sustainable Products",
  },
  {
    title: "Free Delivery",
    note: "Available",
  },
  {
    title: "5k+ Stores",
    note: "Pan Bangladesh",
  },
];

const iconPacks = [
  {
    id: "current",
    name: "Current",
    icons: [
      "/karmo/images/trust/legacy-60-years.jpg?v=final",
      "/karmo/images/trust/trusted-families.png?v=Group1686551880",
      "/karmo/images/trust/recognised-super-brand.png?v=orig",
      "/karmo/images/trust/sustainable-products.png",
      "/karmo/images/trust/free-delivery.png",
      "/karmo/images/trust/stores-nationwide.png?v=SyP66",
    ],
  },
  {
    id: "new",
    name: "New",
    icons: [
      "/karmo/images/trust/v2/legacy-60.png",
      "/karmo/images/trust/v2/trusted.png",
      "/karmo/images/trust/v2/recognised.png",
      "/karmo/images/trust/v2/natural.png",
      "/karmo/images/trust/v2/free-delivery.png",
      "/karmo/images/trust/v2/stores.png?v=p8IJawpehw",
    ],
    /* Slightly tighter art for Trust + Recognised — they read larger than the rest. */
    scale: [1, 0.82, 0.82, 1, 1, 1],
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [pack, setPack] = useState(0);
  const [touchX, setTouchX] = useState(null);

  const go = useCallback((dir) => {
    setPack((p) => (p + dir + iconPacks.length) % iconPacks.length);
  }, []);

  const onTouchStart = (e) => {
    setTouchX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e) => {
    if (touchX == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
    setTouchX(null);
    if (Math.abs(dx) < 48) return;
    go(dx < 0 ? 1 : -1);
  };

  const active = iconPacks[pack];

  return (
    <section
      className="relative mb-1 bg-white md:mb-1.5"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 pr-14 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 md:pr-16 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12 lg:pr-20"
      >
        {labels.map(({ title, note }, i) => {
          const scale = active.scale?.[i] ?? 1;
          return (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-3 xl:px-4 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === labels.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={`${active.id}-${i}`}
                  src={active.icons[i]}
                  alt=""
                  aria-hidden="true"
                  width={88}
                  height={88}
                  loading="lazy"
                  decoding="async"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-0 m-auto h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
                  style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
                />
              </AnimatePresence>
            </span>
            <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {title}
            </h3>
            <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
              {note}
            </p>
          </motion.li>
          );
        })}
      </motion.ul>

      {/* Right-edge pack switch — compare Current vs New icons. */}
      <div className="absolute inset-y-0 right-0 z-[2] flex w-11 flex-col items-center justify-center gap-3 md:w-14">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous icon set"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/70 shadow-sm transition-colors hover:border-brand hover:text-brand"
        >
          <FiChevronLeft className="text-[18px]" />
        </button>

        <div className="flex flex-col items-center gap-1.5" role="tablist" aria-label="Icon set">
          {iconPacks.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              onClick={() => setPack(i)}
              aria-label={`Show ${p.name} icons`}
              aria-selected={i === pack}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === pack ? "w-5 bg-brand" : "w-1.5 bg-ink/25 hover:bg-ink/45"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next icon set"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/70 shadow-sm transition-colors hover:border-brand hover:text-brand"
        >
          <FiChevronRight className="text-[18px]" />
        </button>

        <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
          {active.name}
        </span>
      </div>
    </section>
  );
}
