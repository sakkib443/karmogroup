"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { portfolioFilters, portfolioItems } from "@/components/karmo/portfolio/portfolioData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The gallery — a pill filter row (the foam categories' filter pattern, not
 * its photo-card one, since a portfolio's filter is choosing a lens on the
 * same grid rather than choosing a different destination) over a plain
 * three-up grid of the division photography.
 */
function FilterPill({ filter, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(filter.id)}
      aria-pressed={active}
      className={`shrink-0 border px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
        active
          ? "border-brand bg-brand text-white"
          : "border-ink/12 text-ink/60 hover:border-brand/40 hover:text-brand"
      }`}
    >
      {filter.name}
    </button>
  );
}

export default function PortfolioGallery() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [activeId, setActiveId] = useState("all");

  const items =
    activeId === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.division === activeId);

  return (
    <section className="bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell"
      >
        <motion.div variants={fade} className="text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            What we make
          </span>
          <h2 className="display mt-2 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Craft you can{" "}
            <span className="font-bold text-brand">see and touch</span>
          </h2>
        </motion.div>

        <motion.div
          variants={fade}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-10"
        >
          {portfolioFilters.map((filter) => (
            <FilterPill
              key={filter.id}
              filter={filter}
              active={activeId === filter.id}
              onSelect={setActiveId}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        key={activeId}
        variants={group}
        initial="hidden"
        animate="show"
        className="shell mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-6"
      >
        {items.map((item) => (
          <motion.div key={item.id} variants={fade} className="min-w-0">
            <Link href={item.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 45vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-70"
                />
                <span className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                  <span className="flex items-end justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                        {item.line}
                      </span>
                      <span className="display mt-1 block text-[13px] font-bold uppercase leading-tight tracking-[0.02em] text-white lg:text-[14px]">
                        {item.title}
                      </span>
                    </span>
                    <FiArrowUpRight className="shrink-0 text-[15px] text-white/70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
