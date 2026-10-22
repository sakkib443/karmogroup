"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LuMapPin } from "react-icons/lu";

import { aboutReach } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";

/**
 * Dealers & sales points. One screen tall on a computer: the company profile's
 * dealer map of Bangladesh fills the left half, the 747 figure and the seven
 * divisions sit on the right.
 */
export default function AboutReach() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = aboutReach;

  return (
    <section className="relative bg-white lg:h-[calc(100svh-112px)]" aria-label="Dealers and sales points">
      {/* The homepage's section texture (Admin → Section background texture). */}
      <TextureSlides lighter />
      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="relative z-[1] grid h-full lg:grid-cols-2">
        <motion.div variants={fade} className="relative min-h-[min(110vw,560px)] lg:min-h-0">
          <Image
            src={c.map.src}
            alt={c.map.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-4 mix-blend-multiply lg:p-[clamp(1rem,3svh,2.5rem)]"
          />
        </motion.div>

        <motion.div
          variants={fade}
          className="flex flex-col justify-center border-ink/8 px-6 pb-14 text-center sm:px-10 lg:border-l lg:px-[clamp(2.5rem,5vw,6rem)] lg:py-8 lg:text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/50">{c.eyebrow}</span>
          <p className="display mt-3 leading-none text-brand" style={{ fontSize: "clamp(5rem, 3rem + 7vw, 10rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {c.figure}
          </p>
          <p className="display mt-2 text-[clamp(1.05rem,0.85rem+0.8vw,1.6rem)] font-semibold uppercase tracking-[0.03em] text-ink">
            {c.figureLabel}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2 max-lg:justify-center">
            {c.divisions.map((d) => (
              <li
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/75"
              >
                <LuMapPin size={13} className="text-brand" />
                {d}
              </li>
            ))}
          </ul>

          <address className="mt-10 border-t border-ink/10 pt-5 not-italic">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45">{c.office.label}</span>
            {c.office.lines.map((l) => (
              <span key={l} className="body-copy mt-1 block text-[14px] text-ink/70">{l}</span>
            ))}
          </address>
        </motion.div>
      </motion.div>
    </section>
  );
}
