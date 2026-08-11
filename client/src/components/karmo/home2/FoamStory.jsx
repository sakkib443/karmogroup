"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Foam story — same scale as last pass, with a quieter editorial finish:
 * numbered tabs, clearer type hierarchy, image with a soft matte edge.
 */

const ORANGE = "#FF9A1F";

/**
 * The three divisions, not three grades of foam.
 *
 * These were "About Karmo Foam / Furniture Foam / Footwear Foam" — all three
 * about the same product, which left the section speaking for one division on
 * a page that sells four. The client asked for the divisions instead, so the
 * strip now matches the header's menu and the division cards further up.
 *
 * Facts are from the company profile (p.4–5): the supplier list and the
 * per-customer formulation under Foam, the pocket-spring and density range
 * under Mattress, the bedding lines under HomeTex.
 */
const tabs = [
  {
    id: "foam",
    label: "Foam",
    lead: "Karmo Foam",
    body: "delivers high-density resilience and lasting body support — pure rubber grade, no fillers, firm air flow that holds for years.",
  },
  {
    id: "mattress",
    label: "Mattress",
    lead: "Karmo Mattress",
    body: "runs from firm orthopaedic foam to pocket springs, each layer graded for the load it takes so the surface holds its shape night after night.",
  },
  {
    id: "hometex",
    label: "HomeTex",
    lead: "Karmo HomeTex",
    body: "covers what goes over the mattress — bed sheets, comforters and pillows, woven and filled in the same plants that make the foam inside them.",
  },
];

const picture = {
  src: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
  alt: "A three-seat sofa in deep blue velvet with a leather KARMO tab on its front rail, against a marigold wall beside a red panel, with an olive tree and a round oak coffee table",
};

export default function FoamStory() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const [active, setActive] = useState(tabs[0].id);
  const tabRefs = useRef([]);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? i + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? i - 1
          : null;
    if (next === null) return;
    e.preventDefault();
    const wrapped = (next + tabs.length) % tabs.length;
    setActive(tabs[wrapped].id);
    tabRefs.current[wrapped]?.focus();
  };

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="shell">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16"
        >
          {/* ── Copy ─────────────────────────────────────────────────── */}
          <motion.div variants={fade} className="min-w-0">
            {/* The reference's opening move: the count of years, said plainly.
                1965 is on the client's own logo, so the figure is theirs, not
                a claim invented here — 2026 less 1965 is 61, which is what
                "60+" is standing on. Written as a range rather than "61 Years"
                so the line does not have to be edited every January. */}
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="display text-[1.2rem] font-bold! leading-none! tracking-[-0.01em] text-brand sm:text-[1.45rem]">
                60+ Years
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
                Since 1965
              </span>
            </p>

            {/* Two lines, still uppercase. Three of these plus the years line
                above made four big lines stacked before the reader reached a
                single word of copy, which is what the client was looking at.
                The break now falls after "history" — the first two sentences
                are the company, the third is what it does.

                Dropped from 2.15rem to 1.75rem to go with it: uppercase runs
                about a third wider than sentence case, and at the old size
                "ICONIC BRANDS. STORIED HISTORY." does not fit the copy column
                on one line, so it would have wrapped straight back to three. */}
            {/* Sized against the column, not by eye. "ICONIC BRANDS. STORIED
                HISTORY." measures a shade under 18em wide in this face at this
                tracking, so the largest it can be and still hold one line is
                column ÷ 18 — about 29px in a 524px column. `2.1vw` lands at 27
                there, and keeps roughly that margin as the column grows with
                the window; the 2.05rem cap stops it running away on a very
                wide screen. A fixed size cannot do both: whatever fits at 1024
                is small at 1920, and whatever suits 1920 wraps back to three
                lines at 1024. */}
            <h2 className="display mt-3 text-[1.2rem] font-light uppercase leading-[1.16] tracking-[0.01em] text-ink sm:text-[1.4rem] lg:text-[clamp(1.6rem,2.1vw,2.05rem)]">
              Iconic brands. Storied history.
              <br />
              <span className="font-bold text-brand">
                Industry-leading innovation.
              </span>
            </h2>

            <span className="mt-4 flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
                Crafted to last
              </span>
              <span aria-hidden className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                    fill={ORANGE}
                  />
                  <path
                    d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                    stroke="#B4651A"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>

            <div
              role="tablist"
              aria-label="Karmo Foam"
              onKeyDown={onKeyDown}
              className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-ink/10"
            >
              {tabs.map((tab, i) => {
                const on = tab.id === active;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => (tabRefs.current[i] = el)}
                    role="tab"
                    id={`foam-tab-${tab.id}`}
                    aria-selected={on}
                    aria-controls={`foam-panel-${tab.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(tab.id)}
                    className={`relative -mb-px pb-3 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors duration-300 ${
                      on ? "text-brand" : "text-ink/55 hover:text-ink"
                    }`}
                  >
                    {tab.label}
                    {/* The indicator sits on the strip's own bottom border, so
                        the selected tab looks like it is cut out of the rule
                        rather than underlined beneath it. */}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-px h-[2px] bg-brand transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`foam-panel-${current.id}`}
              aria-labelledby={`foam-tab-${current.id}`}
              className="mt-6 min-h-[6.5rem]"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="body-copy max-w-[34rem] text-[15px] leading-[1.75] text-ink/58 lg:text-[16px]"
                >
                  <strong className="font-semibold text-ink">{current.lead}</strong>{" "}
                  {current.body}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/foam"
                className="group inline-flex h-[50px] w-full items-center justify-center gap-3 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-brand-dark sm:w-auto sm:justify-start"
              >
                Find your perfect foam
                <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-[50px] w-full items-center justify-center border border-ink/12 px-8 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand sm:w-auto"
              >
                Contact us
              </Link>
            </div>
          </motion.div>

          {/* ── Picture ──────────────────────────────────────────────── */}
          <motion.div variants={fade} className="relative w-full">
            {/* Thin outer mat — quiet frame without a heavy card look */}
            <div className="relative border border-ink/8 bg-white p-2 sm:p-2.5">
              <div className="relative aspect-[5/4] w-full overflow-hidden lg:max-h-[520px] lg:aspect-[4/3]">
                <Image
                  src={picture.src}
                  alt={picture.alt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
                    Pure rubber grade
                  </p>
                  <p className="display mt-1.5 max-w-[16rem] text-[1.05rem] font-bold uppercase leading-snug tracking-[0.04em] text-white sm:text-[1.15rem]">
                    Brighten your home with{" "}
                    <span className="text-brand">Karmo</span> Foam
                  </p>
                </div>
              </div>
            </div>

            {/* Brand tick on the frame corner */}
            <span
              aria-hidden
              className="absolute -left-px top-8 hidden h-16 w-[3px] bg-brand lg:block"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
