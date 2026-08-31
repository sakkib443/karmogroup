"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";

const ORANGE = "#FF9A1F";

/**
 * About band shared by every division. Default is the white split (copy left,
 * picture right). Mattress sets `layout: "overlay"` for a full-bleed photo
 * with compact copy; optional `slides` turn that band into a carousel.
 */

function LeafMark({ className = "", size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
    >
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
  );
}

export default function DivisionAbout({
  headingLead,
  headingAccent,
  kicker,
  eyebrow,
  bodyLead,
  body,
  cta = [],
  image,
  slides,
  layout = "split",
  asHero = false,
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  if (layout === "overlay") {
    const frames =
      slides?.length > 0
        ? slides
        : [
            {
              id: "about",
              align: "left",
              headingLead,
              headingAccent,
              kicker,
              cta,
              image,
            },
          ];
    return (
      <OverlayHeroSlider
        slides={frames}
        asHero={asHero}
        size={asHero ? "viewport" : "band"}
        firstSlideMs={asHero ? 2600 : undefined}
        autoplayMs={asHero ? 4800 : undefined}
      />
    );
  }

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
            {headingLead}{" "}
            <span className="text-brand">{headingAccent}</span>
          </h2>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            {kicker}
          </p>

          <span aria-hidden className="mt-3 flex items-center gap-3">
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
            <LeafMark />
          </span>

          <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.16em] text-brand">
            {eyebrow}
          </p>
          <p className="body-copy mt-2 max-w-xl text-[14px] leading-[1.7] text-ink/60">
            {bodyLead && (
              <span className="font-semibold text-ink">{bodyLead}</span>
            )}
            {body}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {cta.map((c) =>
              c.primary ? (
                <Link
                  key={`${c.href}-${c.label}`}
                  href={c.href}
                  className="inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
                >
                  {c.label}
                  <FiArrowRight className="text-[15px]" />
                </Link>
              ) : (
                <Link
                  key={`${c.href}-${c.label}`}
                  href={c.href}
                  className="inline-flex h-[48px] items-center border border-ink/15 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
                >
                  {c.label}
                </Link>
              )
            )}
          </div>
        </motion.div>

        {/* ── Right: lifestyle picture ───────────────────────────────────── */}
        <motion.div
          variants={fade}
          className="relative aspect-[16/10] overflow-hidden bg-[#EFE9E3] lg:aspect-[3/2]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
