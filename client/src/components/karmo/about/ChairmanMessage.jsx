"use client";

import { motion, useReducedMotion } from "framer-motion";

import { chairmanMessage } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The chairman's message — the page's one dark band before `CertifiedBy`, and
 * the only place on the site where a person speaks in the first person.
 *
 * Typographic on purpose. There is no portrait of the chairman in the repo, and
 * a stock face or an initials avatar behind a signed statement would be worse
 * than none — so the quote carries the section and the signature closes it.
 */
export default function ChairmanMessage() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative overflow-hidden bg-shade-deep py-16 lg:py-24">
      {/* An oversized quote mark, cropped by the section. Decorative — the
          `aria-hidden` keeps a stray punctuation glyph out of the reading
          order. */}
      <span
        aria-hidden
        className="display pointer-events-none absolute -top-16 right-4 select-none text-[16rem] font-bold leading-none text-white/[0.04] lg:right-16 lg:text-[24rem]"
      >
        &rdquo;
      </span>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] max-w-4xl"
      >
        <motion.span
          variants={fade}
          className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
        >
          <span className="h-px w-8 bg-brand" />
          {chairmanMessage.eyebrow}
        </motion.span>

        <motion.blockquote
          variants={fade}
          className="display mt-6 text-[1.25rem] font-light leading-[1.5] tracking-[0.01em] text-white sm:text-[1.5rem] lg:text-[1.8rem]"
        >
          {chairmanMessage.quote}
        </motion.blockquote>

        <motion.div variants={fade} className="mt-8 space-y-4">
          {chairmanMessage.body.map((text) => (
            <p
              key={text.slice(0, 24)}
              className="body-copy max-w-2xl text-[14px] leading-[1.9] text-white/65 lg:text-[15px]"
            >
              {text}
            </p>
          ))}
        </motion.div>

        <motion.div
          variants={fade}
          className="mt-10 flex items-center gap-4 border-t border-white/10 pt-7"
        >
          <span aria-hidden className="h-10 w-[3px] shrink-0 bg-brand" />
          <div>
            <p className="display text-[15px] font-bold uppercase tracking-[0.1em] text-white">
              {chairmanMessage.name}
            </p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-white/50">
              {chairmanMessage.role}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
