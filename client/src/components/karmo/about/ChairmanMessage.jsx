"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { chairmanMessage } from "@/components/karmo/about/aboutData";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/** Regular hexagon, points left and right — the profile's own frame. */
const HEX = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

/**
 * Chairman's message (#board). One screen tall on a computer, in the same deep
 * navy as the homepage chemicals band: the portrait in the honeycomb frame of
 * the company profile on the left, a short quote on the right.
 */
export default function ChairmanMessage() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = chairmanMessage;

  return (
    <section
      id="board"
      className="relative scroll-mt-[112px] overflow-hidden bg-[#0B1A33] lg:h-[calc(100svh-112px)]"
      aria-label={c.eyebrow}
    >
      {/* Soft light behind the portrait, and a faint honeycomb on the far side. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_25%_50%,rgba(255,255,255,0.09),transparent_70%)]" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 h-[26rem] w-[30rem] bg-white/[0.03]"
        style={{ clipPath: HEX }}
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative grid h-full items-center gap-12 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-10"
      >
        <motion.div variants={fade} className="relative mx-auto w-[min(82vw,26rem)] lg:w-[min(36vw,64svh,36rem)]">
          {/* Brand-red frame: the same hexagon, a step larger, behind the photo. */}
          <span aria-hidden className="absolute -inset-[3.5%] bg-brand" style={{ clipPath: HEX }} />
          <div className="relative aspect-[1200/1042] w-full" style={{ clipPath: HEX }}>
            <Image src={c.portrait.src} alt={c.portrait.alt} fill sizes="(min-width: 1024px) 36vw, 82vw" className="object-cover" />
          </div>
          <span aria-hidden className="absolute -top-[6%] left-[8%] h-[11%] w-[11%] bg-[#E8C547]" style={{ clipPath: HEX }} />
          <span aria-hidden className="absolute -bottom-[4%] right-[4%] h-[8%] w-[8%] bg-white/80" style={{ clipPath: HEX }} />
        </motion.div>

        <motion.blockquote variants={fade} className="relative text-center text-white lg:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">{c.eyebrow}</span>
          <span aria-hidden className="display mt-4 block text-[5rem] leading-[0.6] text-brand lg:text-[6.5rem]">&ldquo;</span>
          <p
            className="display mt-2 text-white"
            style={{ fontSize: "clamp(1.3rem, 0.95rem + 1.25vw, 2.2rem)", fontWeight: 350, lineHeight: 1.3, letterSpacing: "-0.01em" }}
          >
            {c.quote}
          </p>
          <p className="body-copy mt-5 max-w-xl text-[14px] leading-[1.75] text-white/60 max-lg:mx-auto sm:text-[15px]">{c.line}</p>
          <footer className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
            <span aria-hidden className="h-px w-10 bg-brand" />
            <span>
              <cite className="display block text-[1.05rem] font-semibold not-italic uppercase tracking-[0.06em] text-white">{c.name}</cite>
              <span className="mt-0.5 block text-[12px] uppercase tracking-[0.18em] text-white/55">{c.role}</span>
            </span>
          </footer>
        </motion.blockquote>
      </motion.div>
    </section>
  );
}
