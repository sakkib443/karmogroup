"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

const SWEEP = [0.76, 0, 0.24, 1];
const SETTLE = [0.22, 1, 0.36, 1];

// Split by line rather than by word: each line gets its own mask, so the type
// is uncovered from behind its own edge instead of fading in. Fading reads as
// a page that has not finished loading; a wipe reads as intent.
const LINES = ["Comfort,", "engineered", "since 1965"];

export default function Opening() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  // Tracks this section only, from the moment its top meets the top of the
  // viewport until it has left. Everything below is driven off that one value.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The photograph drifts down at a fraction of the scroll speed and creeps
  // wider, so the frame feels like it has depth rather than being a backdrop
  // sliding past. The copy leaves faster than the picture — that difference is
  // the whole effect.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const copyFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const still = reduceMotion;

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[38rem] overflow-hidden bg-shade-deep"
    >
      <motion.div
        style={still ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src="/images/mattress-suite.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Two washes rather than one. The vertical pass anchors the type at the
          bottom; the horizontal pass keeps the right side of the frame open so
          the photograph is still doing something. */}
      <div className="absolute inset-0 bg-gradient-to-t from-shade-deep via-shade-deep/55 to-shade-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-shade-deep/85 via-shade-deep/20 to-transparent" />

      <motion.div
        style={still ? undefined : { y: copyY, opacity: copyFade }}
        className="shell relative flex h-full flex-col justify-end pb-16 md:pb-20"
      >
        {/* Eyebrow rides in from the left on the same curve the lines use, a
            beat ahead of them. */}
        <motion.span
          initial={still ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: SETTLE, delay: 0.15 }}
          className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand"
        >
          <span className="h-px w-12 bg-brand" />
          Karmo Group
        </motion.span>

        <h1 className="display mt-7 text-[3rem] font-light uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-[5rem] lg:text-[7.5rem]">
          {LINES.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={still ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.1,
                  ease: SWEEP,
                  delay: 0.25 + index * 0.11,
                }}
                className={`block ${index === LINES.length - 1 ? "font-bold text-brand" : ""}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={still ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: SETTLE, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6"
        >
          <p className="body-copy max-w-sm text-[15px] leading-relaxed text-white/65">
            Foam, mattress, HomeTex and polymers — poured, cured and finished in
            our own plants in Bangladesh.
          </p>

          <Link
            href="/mattress"
            className="btn-secondary group inline-flex items-center gap-4 rounded-full border border-white/25 py-2 pl-7 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
          >
            See the range
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue. Fades on the same curve as the copy so it does not hang
          around over the next section. */}
      <motion.div
        aria-hidden="true"
        style={still ? undefined : { opacity: copyFade }}
        className="absolute bottom-8 right-6 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45 md:right-14 md:flex lg:right-20"
      >
        Scroll
        <motion.span
          animate={still ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.div>
    </section>
  );
}
