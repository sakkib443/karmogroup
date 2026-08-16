"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const ORANGE = "#FF9A1F";

/**
 * "Moments that makes a house feel like home" — the About split from the
 * client's reference: heading + subline + leaf, then an About paragraph and two
 * CTAs on the left, a lifestyle picture on the right. Copy adapted from the
 * reference (which described the Comforter) to the mattress, since this is the
 * mattress page.
 *
 * ⚠ Image is a stand-in — the reference's "কারমো'র আরামে রিচার্জ" creative is
 * not in the repo. Drop it under `/karmo/images/mattress/` and swap `src`.
 */
export default function MattressAbout() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pt-6 pb-16 lg:pt-8 lg:pb-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        {/* ── Left: copy ─────────────────────────────────────────────────── */}
        <motion.div variants={fade}>
          <h2 className="display text-[2rem] font-bold uppercase leading-[1.1] tracking-[0.01em] text-ink lg:text-[2.6rem]">
            Moments that make a house{" "}
            <span className="text-brand">feel like home</span>
          </h2>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            We test every mattress, every single one
          </p>

          <span aria-hidden className="mt-3 flex items-center gap-3">
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill={ORANGE}
              />
              <path
                d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                stroke="#B4651A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.16em] text-brand">
            About Karmo Mattress
          </p>
          <p className="body-copy mt-2 max-w-xl text-[14px] leading-[1.7] text-ink/60">
            <span className="font-semibold text-ink">Karmo Mattress</span> gives you
            luxury in sensational comfort, engineered for peaceful, healthy sleep
            across every season. Built in layers of hi-density rebonded and
            polyethylene foam, Turkey-imported felt, and — depending on the model —
            pocket springs or natural coconut coir. Anti-allergic, anti-dust and
            ergonomically shaped for your spine, every mattress is tested one by one
            for comfort that lasts.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#mattress-offers"
              className="inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
            >
              Find your perfect mattress
              <FiArrowRight className="text-[15px]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-[48px] items-center border border-ink/15 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
            >
              Contact us
            </Link>
          </div>
        </motion.div>

        {/* ── Right: lifestyle picture ───────────────────────────────────── */}
        <motion.div
          variants={fade}
          className="relative aspect-[16/10] overflow-hidden bg-[#EFE9E3] lg:aspect-[3/2]"
        >
          <Image
            src="/karmo/images/home-02/divisions/mattress-karmo-floral-bedroom.png"
            alt="A Karmo mattress styled in a bright, restful bedroom"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
