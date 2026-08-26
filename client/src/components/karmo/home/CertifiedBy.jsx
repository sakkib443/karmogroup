"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Awards & trust — above the footer on every karmo-2 page.
 * Three-column proof band; section tone bleeds into the footer.
 */

const BADGE = {
  src: "/karmo/images/home-02/trust/badge-number-one-gold-v2.png",
  width: 1024,
  height: 1024,
};

const pillars = [
  {
    id: "recommended",
    src: BADGE.src,
    width: BADGE.width,
    height: BADGE.height,
    alt: "Bangladesh’s number one comfort brand badge",
    title: "Most highly recommended",
    body: "Leading on lasting comfort across foam, mattress, HomeTex and adhesives — the brand Bangladesh trusts for everyday rest.",
  },
  {
    id: "awards",
    src: "/karmo/images/home-02/trust/awards-trophies-v2.png",
    width: 1024,
    height: 1024,
    alt: "Recognition and awards for Karmo Group",
    title: "Recognised for six decades",
    body: "Founded in 1965 as the country’s first polyurethane producer. Super Brand recognition built on consistency, not campaigns.",
  },
  {
    id: "certified",
    src: "/karmo/images/home-02/trust/certified-seal-gold-v2.png",
    width: 1024,
    height: 1024,
    alt: "Certified quality seal — ISO accredited standards",
    title: "Internationally certified quality",
    body: "ISO 9001 quality management with UKAS and Moody International approval — every batch held to certified standards.",
  },
];

export default function CertifiedBy() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a] pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24"
      aria-label="Awards and trust"
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
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="display text-[1.55rem] font-bold uppercase leading-[1.15] tracking-[0.04em] text-white sm:text-[1.85rem] lg:text-[2.1rem]">
            Built on trust since 1965
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            Recommendation, recognition and certified quality — proof that lasts.
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
                i > 0 ? "md:border-l md:border-white/12" : ""
              }`}
            >
              <div className="relative flex h-[11rem] w-[11rem] items-center justify-center sm:h-[13rem] sm:w-[13rem] lg:h-[14.5rem] lg:w-[14.5rem]">
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
