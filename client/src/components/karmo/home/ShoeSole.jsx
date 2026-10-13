"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import {
  IconClaimCushion,
  IconClaimLight,
  IconClaimLoad,
  IconServiceDensity,
  IconServiceFormula,
  IconServiceLight,
  IconServiceScale,
} from "@/components/karmo/home/footwearClaimIcons";

/**
 * Footwear foam — one full-height "foam spec sheet" section: copy, claim cards
 * and stats on the left, the client's exploded shoe and a foam-microstructure
 * card on the right, and a "foam engineered around your product" services band
 * underneath, all over the rolled-foam still.
 */

const DESKTOP_H = "calc(100svh - 64px)";
const BG = "/pages/home/footwear/rolled-black-foam-bg.webp";
const EXPLODED_LABELLED =
  "/pages/home/footwear/shoe-exploded-neon.webp";
const MICROSTRUCTURE =
  "/pages/home/footwear/foam-microstructure.webp";

const TITLE_STYLE = {
  fontSize: "clamp(1.4rem, 1.02rem + 1.2vw, 2rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.06,
  letterSpacing: "-0.015em",
};

/* Opening slide — the foam spec sheet: copy + claim cards + stats on the left,
   the client's exploded shoe and a foam-microstructure card on the right, and a
   "foam engineered around your product" services band underneath. */
const claimCards = [
  {
    id: "cushioning",
    icon: IconClaimCushion,
    title: "Cushioning",
    body: "Enhanced shock absorption and lasting comfort.",
  },
  {
    id: "load",
    icon: IconClaimLoad,
    title: "Load performance",
    body: "Reliable resistance under repeated compression.",
  },
  {
    id: "light",
    icon: IconClaimLight,
    title: "Lightweight",
    body: "High performance without unnecessary weight.",
  },
];

const foamServices = [
  {
    id: "density",
    icon: IconServiceDensity,
    title: "Consistent density",
    body: "Uniform performance throughout production.",
  },
  {
    id: "formula",
    icon: IconServiceFormula,
    title: "Custom formulation",
    body: "Foam engineered for your application.",
  },
  {
    id: "light",
    icon: IconServiceLight,
    title: "Lightweight construction",
    body: "Reduce weight without compromising comfort.",
  },
  {
    id: "scale",
    icon: IconServiceScale,
    title: "Production scale",
    body: "Reliable supply for commercial manufacturing.",
  },
];

const specStats = [
  { label: "Density range", value: "25 – 40 kg/m³" },
  { label: "Resilience", value: "≥ 50%" },
  { label: "Compression set", value: "≤ 5%" },
];

const microBullets = [
  "Open / closed cell structure",
  "Resilience",
  "Compression recovery",
  "Lightweight construction",
];


function FoamSpecLayout({ reveal }) {
  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] mx-auto flex min-h-[inherit] w-full max-w-[1600px] flex-col justify-center gap-6 px-6 py-10 text-white sm:px-8 sm:py-12 lg:gap-8 lg:px-12 lg:py-14 xl:px-16 [@media(max-height:800px)]:gap-5 [@media(max-height:800px)]:py-8"
    >
      <div className="grid min-h-0 items-center gap-6 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-10 [@media(max-height:800px)]:gap-5">
        {/* Left — copy, claim cards, stats */}
        <motion.div variants={fade} className="relative">
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Karmo Foam
            <span aria-hidden className="h-px w-10 bg-white/35" />
          </span>

          <h2 className="display title-card-line mt-2 uppercase text-white" style={TITLE_STYLE}>
            <span className="block">Engineered foam</span>
            <span className="block">
              for <span className="text-white/50">better</span> footwear
            </span>
          </h2>

          <p className="mt-1.5 text-[12.5px] font-medium text-white/80">
            Lightweight. Resilient. Built for performance.
          </p>
          <p className="mt-2 max-w-[30rem] text-[12px] leading-snug text-white/60">
            High-performance polyurethane foam solutions engineered for cushioning,
            load-bearing and everyday footwear applications.
          </p>

          <ul className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/12">
            {claimCards.map(({ id, icon: Icon, title, body }) => (
              <li key={id} className="flex flex-col items-start gap-1.5 bg-black/45 px-3 py-2.5 sm:px-3.5">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:h-9 sm:w-9">
                  <Icon />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">{title}</p>
                <p className="text-[10px] leading-[1.35] text-white/55">{body}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
            {specStats.map((s) => (
              <div key={s.label}>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">{s.label}</dt>
                <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-white">{s.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/foam/footwear"
            className="mt-4 inline-flex h-11 items-center gap-2 bg-brand px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark sm:px-6"
          >
            Explore footwear foam
            <FiArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Right — exploded shoe + foam microstructure card */}
        <motion.div
          variants={fade}
          className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-end"
        >
          <div className="relative h-[min(46svh,28rem)] w-full max-w-[44rem] lg:h-[min(52svh,34rem)]">
            <Image
              src={EXPLODED_LABELLED}
              alt="Exploded view of a Karmo PU foam sports shoe"
              fill
              sizes="(min-width: 1024px) 44vw, 92vw"
              quality={92}
              className="object-contain object-center"
            />
          </div>
          <div className="w-full max-w-[15rem] shrink-0">
            <div className="relative mx-auto aspect-square w-[8.5rem] overflow-hidden rounded-full ring-1 ring-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.45)] lg:mx-0">
              <Image
                src={MICROSTRUCTURE}
                alt="Karmo PU foam open-cell microstructure"
                fill
                sizes="136px"
                className="object-cover object-center scale-[1.08]"
              />
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white">Foam microstructure</p>
            <ul className="mt-2 space-y-1.5">
              {microBullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-[11px] text-white/65">
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Bottom — services band + density CTA, per client spec sheet */}
      <motion.div variants={fade} className="shrink-0 border-t border-white/12 pt-5 lg:pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-start">
          <div>
            <p className="display text-[14px] font-bold uppercase leading-tight tracking-[0.04em] text-white">
              Foam engineered
              <br />
              around your product
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
            {foamServices.map(({ id, icon: Icon, title, body }, i) => (
              <div
                key={id}
                className={`flex gap-2.5 ${i > 0 ? "sm:border-l sm:border-white/12 sm:pl-3" : ""}`}
              >
                <Icon />
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-white">{title}</p>
                  <p className="mt-0.5 text-[10px] leading-[1.4] text-white/50">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:border-l lg:border-white/12 lg:pl-5">
            <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.04em] text-white">
              Need a specific density, hardness or resilience?
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-white/55">Let’s develop it together.</p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand transition-colors hover:text-white"
            >
              Talk to our foam team
              <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ShoeSole() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      id="karmo-footwear"
      data-home-two-snap
      className="footwear-band relative overflow-hidden bg-black"
      style={{ ["--footwear-h"]: DESKTOP_H }}
      aria-label="Karmo footwear foam"
    >
      <Image
        src={BG}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        className="object-cover object-center"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/55 via-black/30 to-black/10"
      />

      <FoamSpecLayout reveal={reveal} />
    </section>
  );
}
