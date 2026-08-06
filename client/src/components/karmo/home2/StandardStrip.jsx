"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiCalendar, FiLayers, FiMapPin, FiTruck, FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, SETTLE, RISE_S, STAGGER, LEAD } from "@/components/karmo/motion";

/**
 * The Home 02 trust strip — a white card floated up over the hero's bottom
 * edge, four icon pillars beside a headline, a circular "Our story" CTA on
 * the end. The layout is borrowed from a furniture reference the client sent
 * (a Kave template); the claims are Karmo's own, restricted to what
 * HOMEPAGE-STATUS.md §6.8 has actually confirmed — no store count, no
 * "trusted by millions", nothing invented to fill a slot.
 *
 * ── The reveal ────────────────────────────────────────────────────────────
 * The card overlaps the hero, so its top sliver already sits inside the
 * viewport on load on most screens. The usual `whileInView` reveal — built
 * for a section that starts below the fold, and that only ever plays once —
 * would see that sliver and fire immediately instead of waiting for a
 * scroll. So this one tracks `scrollY` directly and stays in sync with it:
 * hidden at the very top, risen in past a few pixels of scroll, and back to
 * hidden if the page is scrolled back up to the top again — not a one-shot
 * reveal but a reflection of where the page actually is.
 *
 * `group`, the usual parent for a staggered set, carries no visual state of
 * its own — fine when a section's own background is already on screen and
 * only its text staggers in. Here the white card itself is the thing being
 * hidden, so this parent needs the fade-and-lift too, with the stagger
 * layered onto the same transition rather than left off.
 */
const SCROLL_REVEAL_PX = 40;

const cardReveal = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: RISE_S, ease: SETTLE, staggerChildren: STAGGER, delayChildren: LEAD },
  },
};
const pillars = [
  {
    icon: FiCalendar,
    title: "60 Years Strong",
    note: "Manufacturing in Bangladesh since 1965, six decades of craft in every product.",
  },
  {
    icon: FiLayers,
    title: "Market Leader in Foam",
    note: "Poured, cut and tested in our own plants, leading Bangladesh by volume.",
  },
  {
    icon: FiMapPin,
    title: "Stockists Nationwide",
    note: "Reaching homes through dealers and retailers across the country.",
  },
  {
    icon: FiTruck,
    title: "Free Delivery",
    note: "Every order ships free, wherever you are in Bangladesh.",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }
    const onScroll = () => setRevealed(window.scrollY > SCROLL_REVEAL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  return (
    <section className="shell relative z-10 -mt-14 sm:-mt-20 lg:-mt-24">
      <motion.div
        variants={cardReveal}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
        className="grid gap-10 rounded-[4px] bg-white p-8 shadow-[0_35px_90px_-25px_rgba(20,20,20,0.22)] sm:p-10 lg:grid-cols-[minmax(0,16rem)_1px_1fr_auto] lg:items-center lg:gap-12 lg:p-14"
      >
        <motion.div variants={fade}>
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" />
            The Karmo Standard
          </span>
          <h2 className="display mt-5 text-[1.55rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-ink lg:text-[1.85rem]">
            Trusted craft,
            <br />
            <span className="font-bold text-brand">nationwide</span> reach
          </h2>
        </motion.div>

        <span aria-hidden="true" className="hidden h-full w-px bg-ink/10 lg:block" />

        <motion.div
          variants={group}
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-10"
        >
          {pillars.map(({ icon: Icon, title, note }) => (
            <motion.div key={title} variants={fade} className="group">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/8 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <Icon className="text-[28px]" />
              </span>
              <h3 className="display mt-5 text-[0.88rem] font-bold uppercase tracking-[0.08em] text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-ink/55">{note}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fade} className="lg:pl-6">
          <Link
            href="/about"
            className="group flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:rotate-45">
              <FiArrowUpRight className="text-2xl" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
              Our story
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
