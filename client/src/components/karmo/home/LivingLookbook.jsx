"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, rise, VIEWPORT } from "@/components/karmo/motion";
import SectionHeading, { Accent } from "@/components/karmo/SectionHeading";

/**
 * Home Two — still living-room band ("Blending tradition with innovation").
 * The three living-room promo tiles above this were removed.
 */

const GAP = "gap-1 md:gap-1.5";
/* Sides and bottom only. The top is left to the section above (Reels), which
   carries the 6px the client set as the gap between every two sections —
   padding on both would double it. */
const GUTTER = "px-0 pb-0 pt-0";
const BAND_H =
  "h-[min(58svh,520px)] min-h-[320px] md:h-[min(68svh,700px)] md:min-h-[420px]";

const BAND_IMAGE =
  "/karmo/images/home-02/lookbook/lookbook-tradition-innovation-v1.jpg";
/* Same spinning mark as `/home-2` FilmBand. */
const BADGE = "/karmo/livora/intro-video-circle.svg";

export default function LivingLookbook() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className={`w-full overflow-hidden bg-white ${GUTTER}`}
      aria-label="Karmo living lookbook"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`flex flex-col ${GAP}`}
      >
        {/* Still band — hero-style living room */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className={`relative overflow-hidden bg-shade-deep ${BAND_H}`}
        >
          <Image
            src={BAND_IMAGE}
            alt="A terracotta foam lounge in a calm maroon living room"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />

          <span
            aria-hidden
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgb(22 28 36 / 0.25) 0%, rgb(22 28 36 / 0.1) 45%, rgb(22 28 36 / 0.85) 100%)",
            }}
          />

          <div className="shell relative z-[2] flex h-full w-full flex-col items-start justify-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
            <SectionHeading
              tone="dark"
              eyebrow="60 years"
              title={[
                "Blending tradition",
                <Accent key="a">with innovation</Accent>,
              ]}
              className="hero-copy uppercase"
            />

            <motion.div variants={rise} className="shrink-0">
              <div className="group block rounded-full">
                <Image
                  src={BADGE}
                  alt=""
                  aria-hidden
                  width={140}
                  height={140}
                  unoptimized
                  className="aspect-square w-[140px] rounded-full animate-[film-badge-spin_20s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
