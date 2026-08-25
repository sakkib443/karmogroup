"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Chemicals band — sits under Iconic brands (DivisionEditorials).
 * Split composition inspired by premium product banners: large chemicals
 * photography left, solid colour info panel right (not a 1:1 clone).
 */

const DESKTOP_H = "calc(100svh - 32px)";
/* Deep navy that sits with the blue drums without copying purple AI tropes. */
const PANEL = "#0B1A33";

const claims = [
  {
    id: "stock",
    title: "Largest raw material stock",
    icon: "drums",
  },
  {
    id: "quality",
    title: "International quality certified",
    icon: "shield",
  },
  {
    id: "poly",
    title: "Specialized polyurethanes & polymers",
    icon: "flask",
  },
];

function ClaimIcon({ id, className = "" }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {id === "drums" && (
        <>
          <ellipse cx="16" cy="7" rx="8" ry="3" {...stroke} />
          <path d="M8 7v14c0 1.7 3.6 3 8 3s8-1.3 8-3V7" {...stroke} />
          <path d="M8 14c0 1.7 3.6 3 8 3s8-1.3 8-3" {...stroke} />
        </>
      )}
      {id === "shield" && (
        <>
          <path
            d="M16 4.5 25 8v7.2c0 5.4-3.7 9.4-9 10.8-5.3-1.4-9-5.4-9-10.8V8l9-3.5Z"
            {...stroke}
          />
          <path d="m12.2 15.4 2.6 2.6 5-5" {...stroke} />
        </>
      )}
      {id === "flask" && (
        <>
          <path d="M13 5h6" {...stroke} />
          <path d="M14 5v7.2L9.2 22.2A3.2 3.2 0 0 0 12 26.5h8a3.2 3.2 0 0 0 2.8-4.3L17.8 12.2V5" {...stroke} />
          <path d="M10.5 18.5h11" {...stroke} />
        </>
      )}
    </svg>
  );
}

export default function ChemicalsBand() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      data-home-two-snap
      className="chemicals-band relative my-[6px] overflow-x-clip bg-white"
      style={{ ["--chemicals-h"]: DESKTOP_H }}
      aria-label="Karmo Chemicals"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid min-h-[min(70svh,560px)] lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.72fr)]"
      >
        {/* Left — warehouse hero photography */}
        <motion.div variants={fade} className="relative min-h-[min(52svh,420px)] lg:min-h-0">
          <Image
            src="/karmo/images/home-02/hero/home-hero-slide-chemicals-hero.jpg"
            alt="Organized Karmo chemicals warehouse with blue industrial drums"
            fill
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-center"
            priority={false}
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
            <p className="max-w-sm text-[13px] leading-relaxed text-white/80 sm:text-[14px]">
              Adhesives, resins and specialty chemistry — stocked, tested and
              ready for the craft.
            </p>
          </div>
        </motion.div>

        {/* Right — colour info panel */}
        <motion.aside
          variants={fade}
          className="relative flex flex-col justify-center px-7 py-10 text-white sm:px-9 lg:px-10 lg:py-12"
          style={{ backgroundColor: PANEL }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
            Karmo Chemicals
          </span>
          <h2 className="display mt-3 text-[1.65rem] font-extrabold! uppercase leading-[1.05]! tracking-[-0.015em] sm:text-[1.9rem] lg:text-[2.05rem]">
            <span className="block">The world of</span>
            <span className="block text-brand">polyurethane</span>
          </h2>

          <ul className="mt-8 space-y-6">
            {claims.map((claim) => (
              <li key={claim.id} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-white">
                  <ClaimIcon id={claim.icon} className="h-7 w-7" />
                </span>
                <span className="pt-2 text-[12px] font-bold uppercase leading-snug tracking-[0.08em] text-white/90 sm:text-[13px]">
                  {claim.title}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/chemicals"
            className="group mt-10 inline-flex items-center gap-3 self-start"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white underline decoration-white/30 underline-offset-4 transition-colors group-hover:decoration-brand">
              Explore chemicals
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:border-brand group-hover:bg-brand">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.aside>
      </motion.div>
    </section>
  );
}
