"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { aboutFacilities } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const TONE = {
  live: "bg-emerald-400",
  building: "bg-amber-400",
  planned: "bg-sky-400",
};

/** Where each park's picture sits in the grid: Unit 01 tall on the left, the other two stacked. */
const TILE = [
  "col-span-2 aspect-[4/3] lg:col-span-1 lg:row-span-2 lg:aspect-auto",
  "aspect-[4/3] lg:aspect-auto",
  "aspect-[4/3] lg:aspect-auto",
];

/**
 * Where Karmo is made — the three industrial parks. One screen tall on a
 * computer: a short navy title panel on the left (the homepage chemicals band's
 * shape), the parks as pictures on the right with their status on each.
 * The pictures are cut from the company profile.
 */
export default function AboutFacilities() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = aboutFacilities;

  return (
    <section className="relative bg-white lg:h-[calc(100svh-112px)]" aria-label="Industrial parks">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid h-full gap-[6px] p-[6px] lg:grid-cols-[minmax(18rem,0.62fr)_minmax(0,1.6fr)]"
      >
        <motion.div
          variants={fade}
          className="flex flex-col justify-center bg-[#0B1A33] px-7 py-12 text-center text-white sm:px-10 lg:text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">{c.eyebrow}</span>
          <h2
            className="display title-card-line mt-3 uppercase text-white"
            style={{ fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.6rem)", fontWeight: 350, lineHeight: 1.08, letterSpacing: "-0.015em" }}
          >
            <span className="block text-white/85">{c.titleLead}</span>
            <span className="block text-white">{c.titleAccent}</span>
          </h2>
          <span aria-hidden className="mt-5 block h-[3px] w-14 bg-brand max-lg:mx-auto" />
          <p className="body-copy mt-5 text-[14px] leading-[1.7] text-white/65 sm:text-[15px]">{c.lead}</p>

          <ul className="mt-8 space-y-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80 max-lg:mx-auto">
            {c.units.map((u) => (
              <li key={u.n} className="flex items-center gap-3 max-lg:justify-center">
                <span className={`h-2 w-2 rounded-full ${TONE[u.tone]}`} />
                {u.status}
              </li>
            ))}
          </ul>
        </motion.div>

        <ul className="grid min-h-0 grid-cols-2 gap-[6px] lg:grid-rows-2">
          {c.units.map((u, i) => (
            <motion.li key={u.n} variants={fade} className={`group relative overflow-hidden bg-[#e9edf2] ${TILE[i]}`}>
              <Image
                src={u.image}
                alt={u.alt}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 36vw, 100vw" : "(min-width: 1024px) 36vw, 50vw"}
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                style={u.position ? { objectPosition: u.position } : undefined}
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:top-4 sm:left-4 sm:text-[11px]">
                <span className={`h-1.5 w-1.5 rounded-full ${TONE[u.tone]}`} />
                {u.status}
              </span>
              <span className="absolute inset-x-3 bottom-3 text-white sm:inset-x-5 sm:bottom-5">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">{u.n}</span>
                <span className="display mt-1 block text-[clamp(1rem,0.8rem+0.9vw,1.6rem)] font-semibold uppercase leading-tight">
                  {u.title} <span className="font-normal text-white/70">· {u.place}</span>
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
