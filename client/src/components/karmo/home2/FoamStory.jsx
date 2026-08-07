"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The foam story — copy and a set of tabs on the left, one picture on the
 * right. The arrangement is the client's own site, rebuilt in this page's
 * language rather than copied pixel for pixel.
 *
 * Three things were changed on the way across, and each is a judgement worth
 * being able to argue with:
 *
 *   · **The two buttons are no longer both solid red.** On the original they
 *     are identical, which means the page is shouting two things at once and
 *     the eye has to choose. The primary action keeps the red; "Contact us"
 *     becomes an outline, so there is one obvious next step and one quieter
 *     alternative.
 *   · **The rule under the eyebrow is a plain brand-red line**, not the small
 *     leaf-and-gold device the original uses. Nothing else on this page has a
 *     leaf, and one ornament that appears exactly once reads as a leftover.
 *   · **The tabs are real tabs** — `role="tablist"`, arrow keys, one panel
 *     swapped underneath — rather than three links that reload. Same look,
 *     but it works from the keyboard and screen readers announce it properly.
 *
 * The words are the client's. The "About" panel is theirs verbatim from the
 * live site; the other two are written from the company profile (p.4–5), which
 * is where the density grades and the furniture/automotive and footbed/insole
 * split come from. Nothing here is invented.
 */
/**
 * Two lines, broken where the client's own artwork breaks it — the three
 * sentences do not each get a line of their own. Written out rather than left
 * to wrap, because a wrap puts the break wherever the column happens to end
 * and that moves with the window.
 */
const HEADING = ["Iconic brands. Storied history.", "Industry-leading innovation."];

const tabs = [
  {
    id: "about",
    label: "About Karmo Foam",
    lead: "Karmo Foam",
    body: "is engineered to deliver high-density resilience, long-lasting durability, and superior body support. Manufactured using pure rubber grade foam with no fillers, our foam solutions maintain optimal air flow and firmness over years of use. Whether for home furniture, commercial projects, or specialty padding, Karmo Foam ensures an unmatched standard of comfort and quality.",
  },
  {
    id: "furniture",
    label: "Furniture Foam",
    lead: "Furniture and automotive",
    body: "grades are cut from the same flexible polyurethane block, formulated for the load each one carries — seat, back, arm, headrest. The raw materials come from BASF, Momentive, Shell, Mitsui and Dow, and the formulation is developed per customer rather than sold off a shelf, which is why the same plant supplies both a sofa maker and a car interior.",
  },
  {
    id: "footwear",
    label: "Footwear Foam",
    lead: "Footbeds and insoles",
    body: "use three densities in one shoe: high density under the insole where the weight lands, mid density at the collar, low density at the tongue. Getting that stack right is what stops a sole flattening after a season — and it is the same rigid-and-flexible chemistry that goes into the furniture range, tuned for a different job.",
  },
];

/**
 * The client's own picture, and the slot is square because the picture is —
 * 2048 x 2048. The stand-in before it was a 21:9 card shot forced into a 4:3
 * box and cropped hard for it; shaping the box to the photograph instead is
 * the same move the division cards needed, and it costs nothing here because
 * the copy beside it sets the section's height anyway.
 */
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

  // Left and right walk the tabs and move focus with the selection, which is
  // what the tab pattern expects — without it a keyboard user can reach the
  // strip but not get past the first tab.
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    const next =
      e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const wrapped = (next + tabs.length) % tabs.length;
    setActive(tabs[wrapped].id);
    tabRefs.current[wrapped]?.focus();
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      {/* `.shell`, not a hand-rolled padding. Every other section on this page
          runs full-bleed or on its own gutter, but this one is a column of
          reading copy and it has to start where the hero's headline starts —
          1.5rem / 3.5rem / 5rem, capped at 1600px, which is exactly what
          `.shell` is. Writing the same figures out by hand would drift the
          first time one of them changed. */}
      <div className="shell">
        {/* One outlined card holding both halves, which is the reference's own
            arrangement — and it settles an argument the previous version could
            not win. The picture is square, so its height followed its column's
            width and drifted away from the copy's height as the window grew:
            50px apart at 1440, 79px at 1920, and no fixed column split holds
            both. Inside a card the two halves are one row, so they are the
            same height by construction at every width.

            A soft 14px radius, not the square corners the rest of the page
            uses. The client asked for this one specifically — neither a pill
            nor a hard corner — and `overflow-hidden` is what carries it
            through to the photograph, whose corners would otherwise sit
            outside the card's. */}
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid overflow-hidden rounded-[14px] border border-ink/12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch"
        >
          {/* ── Copy ───────────────────────────────────────────────────── */}
          <motion.div
            variants={fade}
            className="flex flex-col justify-center p-8 sm:p-10 lg:p-14"
          >
          <h2 className="display text-[clamp(1.35rem,2.2vw,2.2rem)] font-bold! uppercase leading-[1.08]! tracking-[-0.01em] text-ink">
            {HEADING.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-ink/45">
            Crafted to last
          </p>
          <span className="mt-3 block h-[3px] w-14 bg-brand" />

          {/* ── Tabs ───────────────────────────────────────────────────── */}
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

          {/* `key` on the panel so React swaps the node rather than editing it
              in place — that is what lets the fade run on every change. The
              min-height stops the buttons below jumping as panels of different
              lengths come and go. */}
          <div
            role="tabpanel"
            id={`foam-panel-${current.id}`}
            aria-labelledby={`foam-tab-${current.id}`}
            className="mt-7 min-h-[10.5rem] sm:min-h-[11.5rem]"
          >
            <motion.p
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="body-copy max-w-[34rem] text-[15px] leading-[1.8] text-ink/65"
            >
              <strong className="font-semibold text-ink">{current.lead}</strong>{" "}
              {current.body}
            </motion.p>
          </div>

          {/* One loud action and one quiet one — see the note at the top. */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/foam"
              className="btn-primary group inline-flex h-[52px] items-center gap-3 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
            >
              Find your perfect foam
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-[52px] items-center border border-ink/20 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              Contact us
            </Link>
          </div>
        </motion.div>

          {/* ── Picture ────────────────────────────────────────────────── */}
          {/* No padding and no gap: the photograph runs to the card's own
              edges, and the hairline between it and the copy is the card's
              border carried inward rather than a second rule. Stacked below
              lg it keeps its square shape; from lg it takes the row's height,
              which the copy sets. */}
          <motion.div
            variants={fade}
            className="relative aspect-square border-t border-ink/12 bg-cream lg:aspect-auto lg:h-full lg:border-l lg:border-t-0"
          >
            <Image
              src={picture.src}
              alt={picture.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
