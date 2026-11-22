"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useGetCountersQuery } from "@/redux/api/counterApi";

const DEFAULT_COUNTERS = [
  {
    _id: "default-1",
    title: "Years of Heritage",
    value: 60,
    prefix: "",
    suffix: "+ Years",
    order: 1,
    isActive: true,
  },
  {
    _id: "default-2",
    title: "Annual Production",
    value: 50000,
    prefix: "",
    suffix: "+ MT",
    order: 2,
    isActive: true,
  },
  {
    _id: "default-3",
    title: "Dealer Network",
    value: 750,
    prefix: "",
    suffix: "+ Points",
    order: 3,
    isActive: true,
  },
  {
    _id: "default-4",
    title: "Quality Standard",
    value: 100,
    prefix: "",
    suffix: "%",
    order: 4,
    isActive: true,
  },
];

/** Single counter card with choreographed rise & smooth slow count animation */
function CounterCard({ item, index, isContainerInView }) {
  const numberRef = useRef(null);
  const targetValue = Number(item.value || 0);

  useEffect(() => {
    if (!isContainerInView || !numberRef.current) return;

    // Card smoothly floats up and settles first (0.75s + stagger), THEN the counter starts
    const startDelayMs = (0.7 + index * 0.12) * 1000;
    let controls = null;
    let lastShown = -1;

    const timer = setTimeout(() => {
      // Slower, graceful luxury count-up animation (~3.2s)
      controls = animate(0, targetValue, {
        duration: 3.2,
        ease: [0.12, 0.96, 0.24, 1], // ultra-smooth luxury curve: steady build, silky gliding deceleration
        onUpdate: (latest) => {
          const next = Math.round(latest);
          if (numberRef.current && next !== lastShown) {
            lastShown = next;
            numberRef.current.textContent = next.toLocaleString();
          }
        },
      });
    }, startDelayMs);

    return () => {
      clearTimeout(timer);
      if (controls) controls.stop();
    };
  }, [isContainerInView, targetValue, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={
        isContainerInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 40 }
      }
      transition={{
        delay: index * 0.12,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1], // gentle, graceful settle into place
      }}
      style={{ willChange: "transform, opacity" }}
      className="group relative flex flex-col justify-center overflow-hidden rounded-xl border border-white/20 bg-gradient-to-b from-[#0b1a33]/55 to-[#0b1a33]/40 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:border-white/40 hover:from-[#0b1a33]/65 sm:p-6 lg:px-7 lg:py-7"
    >
      {/* Top delicate frosted glass highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Subtle brand red ambient glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(228,82,92,0.28) 0%, rgba(228,82,92,0) 70%)" }}
      />

      {/* Number + Suffix on one line (never wraps) */}
      <div className="relative flex items-baseline whitespace-nowrap leading-none">
        {item.prefix ? (
          <span className="mr-1 text-2xl font-black text-brand sm:text-3xl">
            {item.prefix}
          </span>
        ) : null}
        <span className="relative inline-grid tabular-nums font-black tracking-tight text-white text-3xl sm:text-4xl xl:text-[2.75rem]">
          {/* Final number held invisible, so the box is its full width from the first frame. */}
          <span aria-hidden className="invisible col-start-1 row-start-1">{targetValue.toLocaleString()}</span>
          <span ref={numberRef} className="col-start-1 row-start-1 text-left">0</span>
        </span>
        {item.suffix ? (
          <span className="ml-1 text-xl font-bold tracking-tight text-brand sm:text-2xl xl:text-[1.75rem]">
            {item.suffix}
          </span>
        ) : null}
      </div>

      {/* Clean Stat Title */}
      <h3 className="relative mt-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90 transition-colors group-hover:text-white sm:text-[13px] xl:text-[14px]">
        {item.title}
      </h3>
    </motion.div>
  );
}

export default function ChemicalCounters() {
  const { data: serverCounters } = useGetCountersQuery();
  const containerRef = useRef(null);

  // Trigger when user scrolls and the section is nicely in front of them
  const isContainerInView = useInView(containerRef, {
    once: true,
    amount: 0.3,
  });

  const activeCounters =
    serverCounters && serverCounters.length > 0
      ? serverCounters.filter((c) => c.isActive).slice(0, 4)
      : DEFAULT_COUNTERS;

  return (
    <div
      ref={containerRef}
      className="relative order-1 flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:order-2 lg:h-full lg:p-10"
    >
      {/* Glassmorphism cards: two by two, dead centre of the photo side at every size */}
      <div className="grid w-full max-w-[36rem] grid-cols-2 gap-4 sm:gap-5 lg:gap-6 xl:max-w-[40rem]">
        {activeCounters.map((item, index) => (
          <CounterCard
            key={item._id || index}
            item={item}
            index={index}
            isContainerInView={isContainerInView}
          />
        ))}
      </div>
    </div>
  );
}
