"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { foamProductFeatures } from "@/components/karmo/product/foamProductDetailData";

const ORANGE = "#FF9A1F";

function LeafRule() {
  return (
    <span className="mt-4 flex items-center gap-3" aria-hidden>
      <span className="h-px w-10 bg-brand" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
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
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
        Crafted to last
      </span>
    </span>
  );
}

export default function ProductFoamBuildAside() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative overflow-hidden border-y border-ink/8 bg-white py-14 lg:py-20" aria-label="Inside every Karmo foam grade">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/products/foam/foam-texture-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.18]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/70" />
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1]"
      >
        <motion.div variants={fade} className="max-w-3xl">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              Pure rubber grade
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              Inside the foam
            </span>
          </p>

          <h2 className="display section-heading mt-3 uppercase text-ink">
            <span className="block">Inside every</span>
            <span className="block text-brand">Karmo foam</span>
          </h2>

          <LeafRule />

          <p className="body-copy mt-4 max-w-2xl text-[15px] leading-[1.7] text-ink/55 sm:text-[16px] lg:text-[17px]">
            Open-cell rubber-grade foam — no fillers, firm airflow, cut clean for
            furniture and specialty makers who need density that endures.
          </p>
        </motion.div>

        <motion.ul variants={fade} className="mt-10 grid gap-6 border-t border-ink/10 pt-8 md:grid-cols-2">
          {foamProductFeatures.map((feature) => (
            <li key={feature.title}>
              <p className="text-[15px] font-bold text-ink">{feature.title}</p>
              <p className="body-copy mt-2 max-w-md text-[14px] leading-[1.65] text-ink/60">{feature.body}</p>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={fade}>
          <Link href="/contact" className="group mt-8 inline-flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              Talk to us
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
