"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";

import { aboutStory } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The journey and the four industries (#history): the four industries as tall
 * picture panels, edge to edge with 6px gutters like the homepage grids. No
 * visible heading — the pictures carry the names. On a computer the panels keep
 * the height they had under the old heading (screen − 112px header − 200px).
 * Phones get two-by-two portrait cards.
 */
export default function AboutStory() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = aboutStory;

  return (
    <section
      id="history"
      className="relative flex scroll-mt-[112px] flex-col bg-white lg:h-[calc(100svh-112px-12.5rem)]"
      aria-label="The journey since 1965"
    >
      {/* No visible heading: the four pictures carry the names. Kept for search engines and screen readers. */}
      <h2 className="sr-only">
        {c.eyebrow}: {c.titleLead} {c.titleAccent}. {c.lead}
      </h2>

      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid min-h-0 flex-1 grid-cols-2 gap-[6px] p-[6px] lg:grid-cols-4"
      >
        {c.industries.map((d) => (
          <motion.li key={d.index} variants={fade} className="min-h-0">
            <Link
              href={d.href}
              className="group relative block aspect-[3/4] h-full w-full overflow-hidden bg-ink lg:aspect-auto"
            >
              <Image
                src={d.image}
                alt={d.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
              />
              <span className="absolute top-4 left-4 text-[12px] font-semibold tabular-nums tracking-[0.2em] text-white/80 lg:top-6 lg:left-6">
                {d.index}
              </span>
              <span className="absolute inset-x-4 bottom-4 text-white lg:inset-x-6 lg:bottom-6">
                <span className="display block text-[clamp(1rem,0.8rem+0.9vw,1.6rem)] font-semibold uppercase leading-tight tracking-[0.02em]">
                  {d.name}
                </span>
                <span className="mt-1 flex items-center justify-between gap-3 text-[12px] text-white/75 sm:text-[13px]">
                  {d.line}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 group-hover:border-brand group-hover:bg-brand">
                    <LuArrowUpRight size={15} />
                  </span>
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
