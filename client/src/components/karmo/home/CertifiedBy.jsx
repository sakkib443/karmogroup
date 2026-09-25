"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Awards & trust — above the footer on every karmo-2 page.
 * Four gold marks on the dark band: number one plus three original
 * certification badges (transparent, no plate).
 */

const pillars = [
  {
    id: "number-one",
    src: "/karmo/images/home-02/trust/badge-number-one-gold-v2.webp",
    alt: "Bangladesh’s number one comfort brand badge",
    title: "Number one",
    body: "Leading on lasting comfort across foam, mattress, HomeTex and adhesives — the brand Bangladesh trusts for everyday rest.",
  },
  {
    id: "iso",
    src: "/karmo/images/home-02/certified/logos/logo-iso-9001-gold.webp",
    alt: "ISO 9001 quality management gold seal",
    title: "ISO 9001",
    body: "International Organization for Standardization — the international standard for quality management.",
  },
  {
    id: "ukas",
    src: "/karmo/images/home-02/certified/logos/logo-ukas-gold-v5.webp",
    alt: "UKAS Quality Management gold badge, registration number 014",
    title: "UKAS Quality Management",
    body: "Registration Number 014 — registered name Karmo Foam & Adhesive Industries Ltd.",
  },
  {
    id: "moody",
    src: "/karmo/images/home-02/certified/logos/logo-moody-gold-v5.webp",
    alt: "Moody International gold mark — ISO 9001 Approved",
    title: "Moody International",
    body: "ISO 9001 Approved — independent certification of the quality-management system.",
  },
];

export default function CertifiedBy() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a] pt-12 pb-12 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16"
      aria-label="Awards and certifications"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(212,67,72,0.12),transparent_48%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black/70"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1]"
      >
        <motion.header
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="display section-heading title-card-line uppercase text-white">
            Built on trust since 1965
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            Number one in Bangladesh — with ISO 9001, UKAS and Moody
            International certification behind every batch.
          </p>
        </motion.header>

        {/* Four cards on their own borders rather than a row of dividers —
            reads as one organized grid at any width instead of a line that
            only gains structure once it reaches the desktop column count. */}
        <motion.ul
          variants={group}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:mt-12 sm:gap-5 lg:max-w-none lg:grid-cols-4 lg:gap-6"
        >
          {pillars.map(({ id, src, alt, title, body }) => (
            <motion.li
              key={id}
              variants={fade}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center sm:px-5 sm:py-7"
            >
              <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                <Image
                  src={src}
                  alt={alt}
                  width={512}
                  height={512}
                  sizes="(min-width: 1024px) 128px, 112px"
                  quality={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="display mt-4 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white">
                {title}
              </h3>
              <p className="body-copy mt-2 max-w-[15rem] text-[12px] leading-[1.55] text-white/70 sm:text-[13px]">
                {body}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="mx-auto mt-10 max-w-4xl text-center text-[10px] leading-relaxed tracking-[0.02em] text-white/35 sm:mt-12 sm:text-[11px]"
        >
          Reflects Karmo Group’s position since 1965, and ISO 9001 quality
          management accredited by UKAS (Registration Number 014) and approved
          by Moody International — held by Karmo Foam &amp; Adhesive Industries
          Ltd.
        </motion.p>
      </motion.div>
    </section>
  );
}
