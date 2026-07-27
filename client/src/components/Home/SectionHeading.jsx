"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * One heading for every section on Home 03.
 *
 * Home 01 grew its section headers one at a time, so they drifted: two eyebrow
 * styles (a pill badge and a line-and-caps), five different title sizes, no
 * numbering. This is the single treatment they all share on Home 03 — a
 * numbered index, one eyebrow style, one type scale — so the page reads as one
 * system rather than nine.
 *
 * The words are unchanged; only the presentation is unified. Pass `title` as an
 * array to mask each line on its own (a two-line title needs two masks).
 */
const SETTLE = [0.22, 1, 0.36, 1];

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Titles are uncovered from behind their own edge, the reveal the rest of the
// site already uses.
const lineReveal = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SETTLE } },
};

const TONES = {
  light: { index: "text-ink/25", title: "text-ink", lead: "text-ink/60" },
  dark: { index: "text-white/30", title: "text-white", lead: "text-white/60" },
};

export default function SectionHeading({
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
      viewport={{ once: true, amount: 0.5 }}
      className={`max-w-2xl ${className}`}
    >
      <motion.div variants={fade} className="flex items-center gap-4">
        {index && (
          <span
            className={`display text-[12px] font-bold tabular-nums tracking-[0.1em] ${t.index}`}
          >
            {index}
          </span>
        )}
        <span className="h-px w-10 bg-brand" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {eyebrow}
        </span>
      </motion.div>

      <h2
        className={`display mt-5 text-[1.9rem] font-light leading-[1.12] tracking-[-0.01em] sm:text-[2.5rem] lg:text-[2.9rem] ${t.title}`}
      >
        {lines.map((ln, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={lineReveal} className="block">
              {ln}
            </motion.span>
          </span>
        ))}
      </h2>

      {lead && (
        <motion.p
          variants={fade}
          className={`body-copy mt-6 max-w-xl text-[15px] leading-[1.9] ${t.lead}`}
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * The accent phrase inside a title — one weight and colour for the emphasised
 * words in every heading, so the emphasis reads the same section to section.
 */
export function Accent({ children }) {
  return <span className="font-bold text-brand">{children}</span>;
}
