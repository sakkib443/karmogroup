"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { foamBanner } from "@/components/karmo/product/foamProductDetailData";

const SHELL =
  "relative min-h-[min(78svh,640px)] md:min-h-[min(72svh,700px)]";

export default function ProductFoamBanner() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const { bg, eyebrow, heading, bodyLead, body, layers } = foamBanner;

  return (
    <section className={`${SHELL} w-full overflow-hidden bg-ink`}>
      <Image
        src={bg}
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
        <motion.div
          variants={fade}
          className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center px-6"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              {eyebrow}
            </p>
            <h2 className="display mt-3 text-[1.85rem] font-light uppercase leading-[1.1] tracking-[0.01em] text-white sm:text-[2.35rem] lg:text-[2.75rem]">
              {heading}
            </h2>
            <p className="body-copy mx-auto mt-3 max-w-xl text-center text-[14px] leading-relaxed text-white/80 sm:text-[15px]">
              Engineered for{" "}
              <span className="font-semibold text-white">{bodyLead}</span>
              {body}
            </p>
            <Link
              href="/foam#foam-offers"
              className="mt-6 inline-flex items-center gap-2 bg-brand px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand/90"
            >
              Find your perfect foam
            </Link>
          </div>
        </motion.div>

        <motion.ul
          variants={fade}
          className="absolute bottom-6 left-6 z-[3] hidden flex-col gap-2 sm:flex md:bottom-8 md:left-10"
        >
          {layers.map((layer) => (
            <li key={layer.label} className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden border border-white/25">
                <Image
                  src={layer.src}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                {layer.label}
              </span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
