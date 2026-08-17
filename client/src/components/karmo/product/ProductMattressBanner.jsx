"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Full-bleed mattress story band — sub/heading/description dead-centre;
 * three layer thumbs stay stacked on the left.
 */

const BG = "/karmo/images/mattress/mattress-sleep-well-bg.jpg";
const SHELL =
  "relative min-h-[min(78svh,640px)] md:min-h-[min(72svh,700px)]";

const layers = [
  {
    src: "/karmo/images/foam/foam-texture-bg.jpg",
    label: "Hi-Density Foam",
  },
  {
    src: "/karmo/images/mattress/hero-eurotop-pocket.png",
    label: "Euro Top Comfort",
  },
  {
    src: "/karmo/images/mattress/hero-bonnell.png",
    label: "Ortho Spring Support",
  },
];

export default function ProductMattressBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className={`${SHELL} w-full overflow-hidden bg-ink`}>
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
        className={`${SHELL} z-[1]`}
      >
        {/* Dead-centre: subheading + heading + description */}
        <motion.div
          variants={fade}
          className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-6"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Karmo Mattress
            </p>
            <h2 className="display mt-3 text-[1.85rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-white sm:text-[2.35rem] lg:text-[2.75rem]">
              Orthopedic Mattresses
            </h2>
            <p className="body-copy mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
              Engineered for{" "}
              <span className="font-semibold text-white">better sleep health</span>
              — hi-density foam, Turkey felt and spring support, tested one by one
              for rest that lasts.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/mattress"
                className="inline-flex h-[46px] items-center justify-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand/90"
              >
                Explore mattresses
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Left stack — same as before, out of the centre flow */}
        <motion.ul
          variants={group}
          className="absolute bottom-10 left-6 z-[3] flex flex-col gap-5 md:bottom-12 md:left-10 md:gap-6 lg:left-16"
        >
          {layers.map((layer) => (
            <motion.li
              key={layer.label}
              variants={fade}
              className="flex items-center gap-3"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/80 sm:h-16 sm:w-16">
                <Image
                  src={layer.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span className="max-w-[9rem] text-left text-[11px] font-bold uppercase leading-snug tracking-[0.08em] text-white sm:text-[12px]">
                {layer.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
