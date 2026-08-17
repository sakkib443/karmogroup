"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import DivisionBanner from "@/components/karmo/division/DivisionBanner";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionAbout from "@/components/karmo/division/DivisionAbout";
import DivisionPromise from "@/components/karmo/division/DivisionPromise";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import DivisionDesignB from "@/components/karmo/division/DivisionDesignB";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * Shared product/category page — Foam, HomeTex, Mattress, Chemicals.
 * Design A = current layout. Design B = resource-style hero → icons → picks.
 * Bottom bar toggles between them for comparison.
 */

const DESIGNS = [
  { id: "a", name: "Design A" },
  { id: "b", name: "Design B" },
];

const EASE = [0.22, 1, 0.36, 1];

function DesignA({ data, categoryId }) {
  return (
    <>
      <DivisionBanner {...data.banner} />
      <DivisionFeatures items={data.features} />
      <DivisionAbout {...data.about} />
      <DivisionPromise {...data.promise} />
      <DivisionProducts {...data.products} categoryId={categoryId} />
      <OrderAndContact />
    </>
  );
}

export default function DivisionPage({ data }) {
  const reduceMotion = useReducedMotion();
  const [categoryId] = useState("all");
  const [design, setDesign] = useState(0);
  const [touchX, setTouchX] = useState(null);

  const go = useCallback((dir) => {
    setDesign((d) => (d + dir + DESIGNS.length) % DESIGNS.length);
  }, []);

  const onTouchStart = (e) => {
    setTouchX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e) => {
    if (touchX == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
    setTouchX(null);
    if (Math.abs(dx) < 56) return;
    go(dx < 0 ? 1 : -1);
  };

  const active = DESIGNS[design];

  return (
    <div
      className="relative pb-20"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id}
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {active.id === "a" ? (
            <DesignA data={data} categoryId={categoryId} />
          ) : (
            <DivisionDesignB data={data} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1 rounded-full border border-ink/10 bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous product page design"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-brand"
        >
          <FiChevronLeft className="text-[20px]" />
        </button>

        <div
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Product page design"
        >
          {DESIGNS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              onClick={() => setDesign(i)}
              aria-selected={i === design}
              className={`h-10 min-w-[7.5rem] rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                i === design
                  ? "bg-brand text-white"
                  : "text-ink/55 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next product page design"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-brand"
        >
          <FiChevronRight className="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
