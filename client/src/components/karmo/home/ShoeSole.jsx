"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import {
  IconDensity,
  IconFormula,
  IconLight,
  IconScale,
} from "@/components/karmo/home/footwearIcons";

/**
 * Footwear foam — one full-height "foam spec sheet" section: copy, claim cards
 * and stats on the left, the client's exploded shoe and a foam-microstructure
 * card on the right, and a "foam engineered around your product" services band
 * underneath, all over the rolled-foam still.
 */

const DESKTOP_H = "calc(100svh - 64px)";
const BG = "/karmo/images/home-02/footwear/rolled-black-foam-bg.webp";
const EXPLODED_LABELLED =
  "/karmo/images/home-02/footwear/shoe-exploded-neon.webp";

const TITLE_STYLE = {
  fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

/* Opening slide — the foam spec sheet: copy + claim cards + stats on the left,
   the client's exploded shoe and a foam-microstructure card on the right, and a
   "foam engineered around your product" services band underneath. */
const specCards = [
  {
    id: "footbeds",
    src: "/karmo/images/home-02/footwear/icon-foam-footbeds-clean.webp",
    alt: "Moulded foam footbeds",
  },
  {
    id: "pink",
    src: "/karmo/images/home-02/footwear/icon-foam-sheet-pink-clean.webp",
    alt: "Folded pink foam sheet",
  },
  {
    id: "grey",
    src: "/karmo/images/home-02/footwear/icon-foam-sheet-grey-clean.webp",
    alt: "Folded grey foam sheet",
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

const foamServices = [
  { id: "density", icon: IconDensity, title: "Consistent density", body: "Uniform performance throughout production." },
  { id: "formula", icon: IconFormula, title: "Custom formulation", body: "Foam engineered for your application." },
  { id: "light", icon: IconLight, title: "Lightweight construction", body: "Reduce weight without compromising comfort." },
  { id: "scale", icon: IconScale, title: "Production scale", body: "Reliable supply for commercial manufacturing." },
];

function FoamSpecLayout({ reveal }) {
  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] mx-auto flex w-full max-w-[1600px] min-h-[min(82svh,720px)] flex-col justify-center gap-8 px-6 py-10 text-white sm:px-8 sm:py-12 lg:h-full lg:min-h-0 lg:gap-10 lg:px-12 xl:px-16"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-12">
        {/* Left — copy, claim cards, stats */}
        <motion.div variants={fade} className="relative">
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Karmo Foam
            <span aria-hidden className="h-px w-10 bg-white/35" />
          </span>

          <h2 className="display title-card-line mt-3 uppercase text-white" style={TITLE_STYLE}>
            <span className="block">Engineered foam</span>
            <span className="block">
              for <span className="text-white/50">better</span> footwear
            </span>
          </h2>

          <p className="mt-2 text-[13px] font-medium text-white/80">
            Lightweight. Resilient. Built for performance.
          </p>
          <p className="mt-3 max-w-[30rem] text-[12.5px] leading-relaxed text-white/60">
            High-performance polyurethane foam solutions engineered for cushioning,
            load-bearing and everyday footwear applications.
          </p>

          <ul className="mt-4 grid w-[min(100%,19.5rem)] grid-cols-3 gap-1.5">
            {specCards.map(({ id, src, alt }) => (
              <li key={id} className="relative aspect-[4/3] overflow-hidden rounded-md bg-white ring-1 ring-white">
                <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            {specStats.map((s) => (
              <div key={s.label}>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/45">{s.label}</dt>
                <dd className="mt-1 text-[15px] font-bold tabular-nums text-white">{s.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/foam/footwear"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-white hover:bg-white/5"
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
          <div className="relative aspect-[1408/1117] w-full max-w-[40rem]">
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
            <div className="relative mx-auto aspect-square w-[8.5rem] overflow-hidden rounded-full ring-1 ring-white/25 lg:mx-0">
              <Image
                src={BG}
                alt="Karmo PU foam microstructure"
                fill
                sizes="136px"
                className="object-cover object-center"
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

      {/* Bottom — services band */}
      <motion.div variants={fade} className="border-t border-white/12 pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="display text-[15px] font-bold uppercase leading-tight tracking-[0.04em] text-white">
              Foam engineered
              <br />
              around your product
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand transition-colors hover:text-white"
            >
              Talk to our foam team
              <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-4">
            {foamServices.map(({ id, icon: Icon, title, body }, i) => (
              <div
                key={id}
                className={`flex flex-col items-center px-2 text-center ${i > 0 ? "sm:border-l sm:border-white/15" : ""}`}
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-[0_8px_18px_rgba(0,0,0,0.28)] sm:h-16 sm:w-16">
                  <Icon />
                </span>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.05em] text-white">{title}</p>
                <p className="mt-1 max-w-[11rem] text-[10.5px] leading-[1.45] text-white/55">{body}</p>
              </div>
            ))}
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
