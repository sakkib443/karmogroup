"use client";

import { motion } from "framer-motion";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { CmsText } from "@/cms/CmsProvider";

/**
 * The centred heading over a homepage band (Our Divisions, Shop by material):
 * a small red title between two hairlines, the heading with its red part, and a
 * short rule with a dot under it. Shared so the two bands match.
 */
export default function SectionHeading({ eyebrow, title, titleAccent, titleSize, reveal }) {
  return (
    <motion.div variants={fade} {...reveal} viewport={VIEWPORT} className="relative z-[1] px-4 text-center">
      {eyebrow ? (
        <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          <span aria-hidden className="h-px w-7 bg-brand/50 sm:w-10" />
          {eyebrow}
          <span aria-hidden className="h-px w-7 bg-brand/50 sm:w-10" />
        </span>
      ) : null}
      <h2
        className="display title-card-line mt-2 uppercase text-ink"
        style={{
          fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
          fontWeight: 350,
          fontVariationSettings: '"wght" 350',
          lineHeight: 1.08,
          letterSpacing: "-0.015em",
        }}
      >
        <CmsText value={title} size={titleSize} />{" "}
        <CmsText className="text-brand" value={titleAccent} size={titleSize} />
      </h2>
      <span aria-hidden className="mx-auto mt-3.5 flex items-center justify-center gap-1.5">
        <span className="h-[2px] w-8 bg-brand" />
        <span className="h-1.5 w-1.5 rotate-45 bg-brand" />
        <span className="h-[2px] w-8 bg-brand" />
      </span>
    </motion.div>
  );
}
