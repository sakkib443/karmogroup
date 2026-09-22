"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Full-bleed mattress story band — heading + description dead-centre.
 */

const BG = "/karmo/images/mattress/bands/sleep-well-film-still-hq.jpg";

export default function ProductMattressBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      style={{ minHeight: "100svh" }}
    >
      <Image
        src={BG}
        alt=""
        fill
        sizes="100vw"
        priority={false}
        className="object-cover object-center"
      />

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-shade-deep/75 via-shade-deep/25 to-shade-deep/55"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-shade-deep/70 via-transparent to-transparent"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] flex min-h-[100svh] items-center justify-center px-6"
      >
        <motion.div variants={fade} className="mx-auto max-w-3xl text-center">
          <h2 className="display section-heading title-card-line uppercase text-white">
            Orthopedic Mattress
          </h2>
          <p className="body-copy mt-3 text-[15px] text-white/90">
            Engineered for better sleep health — hi-density foam, Turkey felt
            and spring support, tested one by one.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
