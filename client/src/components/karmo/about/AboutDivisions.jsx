"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { aboutDivisions, chemicalUnits } from "@/components/karmo/about/aboutData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The group structure — the four industries, then the four units inside the
 * chemicals arm.
 *
 * The homepage's `DivisionsStrip` shows the same four with a name and nothing
 * else, because there it is navigation. Here each card carries what the
 * division actually makes, which is the part an about page owes the reader.
 */
export default function AboutDivisions() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="border-t border-ink/8 bg-white py-14 md:py-20 lg:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            The group
          </span>
          <h2 className="display mt-2 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Four industries,{" "}
            <span className="font-bold text-brand">one group</span>
          </h2>
          <LeafRule />
        </motion.div>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6"
      >
        {aboutDivisions.map((division) => (
          <motion.article key={division.name} variants={fade} className="min-w-0">
            <Link href={division.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                <Image
                  src={division.image}
                  alt={division.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span className="display absolute left-0 top-0 bg-brand px-3 py-1.5 text-[11px] font-bold tabular-nums tracking-[0.14em] text-white">
                  {division.index}
                </span>
              </div>

              <h3 className="display mt-4 text-[15px] font-bold uppercase tracking-[0.06em] text-ink transition-colors duration-300 group-hover:text-brand lg:text-[16px]">
                {division.name}
              </h3>
              <p className="body-copy mt-1.5 text-[13px] italic leading-snug text-ink/45">
                {division.line}
              </p>
            </Link>

            <ul className="mt-4 space-y-2 border-t border-ink/8 pt-4">
              {division.points.map((point) => (
                <li
                  key={point}
                  className="body-copy flex gap-2.5 text-[13px] leading-[1.65] text-ink/58"
                >
                  <span aria-hidden className="mt-[0.55em] h-[3px] w-[3px] shrink-0 bg-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>

      {/* ── Inside the chemicals arm ──────────────────────────────────────── */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell mt-14 lg:mt-20"
      >
        <motion.div variants={fade} className="border border-ink/10 bg-white">
          <div className="border-b border-ink/8 px-6 py-5 lg:px-8">
            <h3 className="display text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
              Inside Karmo Chemical &amp; Adhesives
            </h3>
            <p className="body-copy mt-1.5 text-[13px] text-ink/50">
              Four units, run under the one chemicals division.
            </p>
          </div>

          {/* Hairlines between every cell at every breakpoint, without a rule
              per edge per column count: the grid's own gap is the line, and the
              cells paint white over it. */}
          <ol className="grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
            {chemicalUnits.map((unit) => (
              <li key={unit.title} className="bg-white px-6 py-6 lg:px-8">
                <span className="display text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
                  ( {unit.n} )
                </span>
                <h4 className="display mt-3 text-[14px] font-bold uppercase tracking-[0.04em] text-ink">
                  {unit.title}
                </h4>
                <p className="body-copy mt-2.5 text-[13px] leading-[1.7] text-ink/55">
                  {unit.note}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}
