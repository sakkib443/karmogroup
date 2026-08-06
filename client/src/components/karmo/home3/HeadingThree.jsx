"use client";

import { motion, useReducedMotion } from "framer-motion";

// The same reveal system as the rest of the site. Home 03 argues with type and
// layout, not with a private set of easings — a third motion vocabulary on top
// of the two that already exist would make the three designs incomparable.
import { group, line as lineReveal, rise as fade, VIEWPORT } from "../motion";

/**
 * Home 03's section heading.
 *
 * This is the one thing that separates the three designs at a glance, so it is
 * worth being explicit about why it is not the shared `SectionHeading`.
 *
 * That component sets every title in **caps**, and both Home 01 and Home 02 run
 * on it. Caps are a deliberate choice there: they hold a headline together over
 * a photograph and they make a short line look bigger than it is. But they cost
 * two things this design wants back —
 *
 *   1. **The client's own casing.** `docs/copy/taglines.md` says the words are
 *      the brand's property and must not be edited, then notes that the site
 *      re-cases them anyway because every heading is caps. Home 03 sets them
 *      mixed, exactly as supplied, so nothing about the line is ours.
 *   2. **Length.** Caps stop scanning well past about five words. Half the
 *      approved taglines are longer than that — "We Create The Chemistry Of
 *      Comfort" is six — and they read as a wall in caps.
 *
 * So: mixed case, larger, negative tracking, light weight with the emphasis in
 * a semibold red. The eyebrow drops the shared 40px rule for an index, a leaning
 * hairline and the label — a smaller mark that repeats down the page without
 * announcing itself before every headline.
 *
 * `font-light!` and `font-semibold!` carry the bang because globals.css sets
 * `h1, h2, h3 { font-weight: 600 }` outside any cascade layer, and an unlayered
 * rule beats a layered utility whatever its specificity.
 */

const TONES = {
  light: {
    index: "text-brand",
    rule: "bg-ink/25",
    eyebrow: "text-ink/55",
    title: "text-ink",
    lead: "text-ink/60",
  },
  dark: {
    index: "text-brand",
    rule: "bg-white/25",
    eyebrow: "text-white/55",
    title: "text-white",
    lead: "text-white/60",
  },
};

export default function HeadingThree({
  index,
  eyebrow,
  title,
  lead,
  tone = "light",
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const t = TONES[tone] ?? TONES.light;

  const lines = Array.isArray(title) ? title : [title];

  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className={`max-w-2xl ${className}`}
    >
      <motion.div variants={fade} className="flex items-center gap-3.5">
        {index && (
          <span
            className={`display text-[12px] font-bold tabular-nums tracking-[0.08em] ${t.index}`}
          >
            {index}
          </span>
        )}
        {/* Leaning, so it reads as a mark rather than a piece of the grid. The
            same hairline separates the division rows in the hero. */}
        <span className={`h-3.5 w-px rotate-[18deg] ${t.rule}`} />
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${t.eyebrow}`}
        >
          {eyebrow}
        </span>
      </motion.div>

      <h2
        className={`display mt-5 text-[1.95rem] font-light! leading-[1.08] tracking-[-0.025em] sm:text-[2.6rem] lg:text-[3.15rem] ${t.title}`}
      >
        {lines.map((ln, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={lineReveal} className="block">
              {ln}
            </motion.span>
          </span>
        ))}
      </h2>

      {lead && (
        <motion.p
          variants={fade}
          className={`body-copy mt-6 max-w-xl text-[15px] leading-[1.85] ${t.lead}`}
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * The emphasised words inside a title. Semibold rather than the shared bold —
 * at this size and in mixed case, bold against light is a jump of three steps
 * and the line stops reading as one sentence.
 */
export function Mark({ children }) {
  return <span className="font-semibold! text-brand">{children}</span>;
}
