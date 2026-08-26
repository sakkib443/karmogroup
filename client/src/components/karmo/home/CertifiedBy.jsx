"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Awards & trust — above the footer on every karmo-2 page.
 * Tempur-style three-column band: hero NO.1 badge, awards mark,
 * certified seal — with short proof copy under each.
 */

const BADGE = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

const pillars = [
  {
    id: "recommended",
    src: BADGE.src,
    width: BADGE.width,
    height: BADGE.height,
    alt: "Bangladesh’s number one comfort brand badge",
    fit: "contain",
    title: "Most highly recommended",
    body: "Leading on lasting comfort across foam, mattress, HomeTex and adhesives — the brand Bangladesh trusts for everyday rest.",
  },
  {
    id: "awards",
    src: "/karmo/images/home-02/trust/awards-trophies-v1.png",
    width: 1024,
    height: 1024,
    alt: "Recognition and awards for Karmo Group",
    fit: "contain",
    title: "Recognised for six decades",
    body: "Founded in 1965 as the country’s first polyurethane producer. Super Brand recognition built on consistency, not campaigns.",
  },
  {
    id: "certified",
    src: "/karmo/images/home-02/trust/certified-seal-v1.png",
    width: 1024,
    height: 1024,
    alt: "Certified quality seal — ISO accredited standards",
    fit: "contain",
    title: "Internationally certified quality",
    body: "ISO 9001 quality management with UKAS and Moody International approval — every batch held to certified standards.",
  },
];

export default function CertifiedBy() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative overflow-hidden bg-[#141414] pt-16 pb-12 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16"
      aria-label="Awards and trust"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,67,72,0.14),transparent_55%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1]"
      >
        <motion.header variants={fade} className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              Bangladesh’s
            </span>
            <Image
              src={BADGE.src}
              alt=""
              width={BADGE.width}
              height={BADGE.height}
              className="h-9 w-auto shrink-0 -translate-y-[8%] sm:h-11"
            />
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
              Comfort Brand
            </span>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            Trusted proof — recommendation, recognition and certified quality.
          </p>
        </motion.header>

        <motion.ul
          variants={group}
          className="mt-12 grid grid-cols-1 gap-10 sm:mt-14 md:mt-16 md:grid-cols-3 md:gap-0"
        >
          {pillars.map(({ id, src, width, height, alt, title, body }, i) => (
            <motion.li
              key={id}
              variants={fade}
              className={`flex flex-col items-center px-4 text-center md:px-8 lg:px-10 ${
                i > 0 ? "md:border-l md:border-white/15" : ""
              }`}
            >
              <div className="relative flex h-[8.5rem] w-[8.5rem] items-center justify-center sm:h-40 sm:w-40">
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="body-copy mt-6 max-w-[20rem] text-[13px] leading-[1.65] text-white/70 sm:mt-7 sm:text-[14px]">
                <span className="sr-only">{title}. </span>
                {body}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={fade}
          className="mx-auto mt-12 max-w-4xl text-center text-[10px] leading-relaxed tracking-[0.02em] text-white/35 sm:mt-14 sm:text-[11px]"
        >
          Reflects Karmo Group’s position since 1965, Super Brand recognition,
          and ISO 9001 / UKAS / Moody International accreditation held by Karmo
          Foam &amp; Adhesive Industries Ltd.
        </motion.p>
      </motion.div>
    </section>
  );
}
