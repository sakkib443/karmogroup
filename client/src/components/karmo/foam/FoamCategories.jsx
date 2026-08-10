"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { foamCategories } from "@/components/karmo/foam/foamData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Foam categories — same layout as homepage DivisionsStrip: centred heading
 * in `.shell`, then a full-bleed four-up row (edge padding only, not shell).
 * Clicking a card filters the product grid below.
 */
function CategoryCard({ cat, active, onSelect }) {
  return (
    <motion.div variants={fade} className="min-w-0">
      <button
        type="button"
        onClick={() => onSelect(active ? "all" : cat.id)}
        aria-pressed={active}
        className="group block w-full"
      >
        <div
          className={`relative aspect-square overflow-hidden transition-[box-shadow] duration-300 ${
            active ? "ring-2 ring-brand ring-offset-2" : ""
          }`}
        >
          <Image
            src={cat.image}
            alt={cat.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        </div>

        <p
          className={`display mt-3 text-center text-[16px] font-semibold uppercase transition-colors duration-300 lg:mt-4 lg:text-[18px] ${
            active ? "text-brand" : "text-ink/80 group-hover:text-brand"
          }`}
        >
          {cat.name}
        </p>
      </button>
    </motion.div>
  );
}

export default function FoamCategories({ activeId, onSelect }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            Shop by use
          </span>
          <h2 className="display mt-1 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Choose your <span className="font-bold text-brand">foam craft</span>
          </h2>
          <span
            aria-hidden
            className="mt-4 flex items-center justify-center gap-3"
          >
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill="#FF9A1F"
              />
              <path
                d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                stroke="#B4651A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
          </span>
        </motion.div>
      </motion.div>

      {/* Full width — mirrors DivisionsStrip: skips `.shell`, edge padding only. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-6 grid grid-cols-2 gap-4 px-3 md:mt-8 md:gap-6 md:px-4 lg:grid-cols-4"
      >
        {foamCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            active={activeId === cat.id}
            onSelect={onSelect}
          />
        ))}
      </motion.div>

      {activeId !== "all" && (
        <div className="shell mt-8 text-center">
          <button
            type="button"
            onClick={() => onSelect("all")}
            className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand"
          >
            Show all products
          </button>
        </div>
      )}
    </section>
  );
}
