"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Category gallery — cards shown like the homepage ShopByMaterial: the label
 * sits *on* the picture over a bottom gradient. Clicking a card filters the
 * product grid below to that category.
 *
 * Hidden by default on every page (the client's ideal mattress page hides it) —
 * slot `<DivisionCategories>` back into `DivisionPage` to bring it to all four.
 */
function CategoryCard({ cat, active, onSelect }) {
  return (
    <motion.div variants={fade} className="min-w-0">
      <button
        type="button"
        onClick={() => onSelect(active ? "all" : cat.id)}
        aria-pressed={active}
        className={`group relative block aspect-[4/5] w-full overflow-hidden bg-[#EFE9E3] transition-[box-shadow] duration-300 ${
          active ? "ring-2 ring-brand ring-offset-2" : ""
        }`}
      >
        <Image
          src={cat.image}
          alt={cat.alt}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />

        {/* Bottom-weighted so the white label always reads over the picture. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-left sm:p-6">
          <div className="min-w-0">
            <h3 className="display text-[1.05rem] font-bold! uppercase leading-[1.15]! tracking-[0.01em] text-white sm:text-[1.2rem]">
              {cat.name}
            </h3>
            <p className="body-copy mt-1.5 max-w-[20rem] text-[12px] leading-[1.55] text-white/75 sm:text-[12.5px]">
              {cat.line}
            </p>
          </div>

          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-300 sm:h-10 sm:w-10 ${
              active ? "bg-brand text-white" : "bg-white group-hover:bg-brand group-hover:text-white"
            }`}
          >
            <FiArrowRight className="text-[15px]" />
          </span>
        </div>
      </button>
    </motion.div>
  );
}

export default function DivisionCategories({ items = [], activeId, onSelect }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white py-1.5">
      {/* No heading — the category gallery butts up under the section above with
          a 6px seam (homepage gallery rhythm). Full-bleed, edge padding only. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-2 gap-1 px-0 md:grid-cols-4 md:gap-1.5"
      >
        {items.map((cat) => (
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
