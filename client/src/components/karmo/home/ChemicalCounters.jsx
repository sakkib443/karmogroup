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

    const timer = setTimeout(() => {
      // Slower, graceful luxury count-up animation (~3.2s)
      controls = animate(0, targetValue, {
        duration: 3.2,
        ease: [0.12, 0.96, 0.24, 1], // ultra-smooth luxury curve: steady build, silky gliding deceleration
        onUpdate: (latest) => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.round(latest).toLocaleString();
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
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={
        isContainerInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.96 }
      }
      transition={{
        delay: index * 0.12,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1], // gentle, graceful settle into place
      }}
      className="group relative flex flex-col justify-center overflow-hidden rounded-xl border border-white/20 bg-white/[0.07] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12] hover:shadow-[0_12px_36px_0_rgba(228,82,92,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.35)] sm:p-6 lg:px-4 lg:py-5 xl:px-5 2xl:px-6"
    >
      {/* Top delicate frosted glass highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Subtle brand red ambient glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/15 blur-xl transition-all duration-300 group-hover:bg-brand/25 group-hover:opacity-100 opacity-40"
      />

      {/* Number + Suffix on one line (never wraps) */}
      <div className="relative flex items-baseline whitespace-nowrap leading-none">
        {item.prefix ? (
          <span className="mr-1 text-2xl font-black text-brand sm:text-3xl lg:text-[1.15rem] xl:text-[1.35rem] 2xl:text-[1.6rem]">
            {item.prefix}
          </span>
        ) : null}
        <span
          ref={numberRef}
          className="tabular-nums font-black tracking-tight text-white text-3xl sm:text-4xl lg:text-[1.65rem] xl:text-[2rem] 2xl:text-[2.4rem]"
        >
          0
        </span>
        {item.suffix ? (
          <span className="ml-1 text-xl font-bold tracking-tight text-brand sm:text-2xl lg:text-[1.05rem] xl:text-[1.25rem] 2xl:text-[1.5rem]">
            {item.suffix}
          </span>
        ) : null}
      </div>

      {/* Clean Stat Title */}
      <h3 className="relative mt-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90 transition-colors group-hover:text-white sm:text-[13px] lg:text-[11px] xl:text-xs">
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
      className="relative order-1 flex w-full items-center justify-end px-4 py-8 sm:px-6 lg:order-2 lg:h-full lg:items-end lg:pb-20 lg:pl-6 lg:pr-6 lg:pt-10 xl:pr-10 2xl:pb-24 2xl:pr-14"
    >
      {/* Glassmorphism cards: 2x2 on phones/tablets, one row of four along the bottom on desktop */}
      <div className="grid w-full max-w-[36rem] grid-cols-2 gap-4 sm:gap-5 lg:max-w-[64rem] lg:grid-cols-4 lg:gap-4 xl:gap-5">
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
