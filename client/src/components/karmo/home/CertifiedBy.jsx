"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * International Accreditations — always sits directly above the site footer
 * (mounted from the karmo-2 layout). Quiet dark band, three certificate
 * frames, centred heading rhythm matching Divisions / Partners.
 */

const certificates = [
  {
    src: "/karmo/images/home-02/certified/01-iso-9001.jpg",
    alt: "ISO 9001 — International Organization for Standardization",
    name: "ISO 9001",
    detail: "Quality management",
  },
  {
    src: "/karmo/images/home-02/certified/02-ukas.jpg",
    alt: "UKAS Quality Management — Karmo Foam & Adhesive Industries Ltd.",
    name: "UKAS",
    detail: "Accredited body",
  },
  {
    src: "/karmo/images/home-02/certified/03-moody.jpg",
    alt: "Moody International Certification — ISO 9001 Approved",
    name: "Moody International",
    detail: "ISO 9001 approved",
  },
];

export default function CertifiedBy() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section
      className="relative overflow-hidden pt-14 pb-12 md:pt-16 md:pb-14 lg:pt-20 lg:pb-16"
      aria-label="International accreditations"
    >
      <Image
        src="/karmo/images/home-02/certified/bg-living-room.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
        priority={false}
      />
      <span aria-hidden className="absolute inset-0 bg-black/68" />
      {/* Soft top only — bottom sits flush against the footer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            Certified by
          </span>
          <h2 className="display mt-2 text-[1.35rem] font-light uppercase leading-[1.15] tracking-[0.01em] text-white sm:text-[1.55rem] lg:text-[1.75rem]">
            International{" "}
            <span className="font-bold text-brand">Accreditations</span>
          </h2>
          <span
            aria-hidden
            className="mx-auto mt-5 block h-px w-14 bg-brand/80 sm:mt-6"
          />
        </motion.div>

        <motion.ul
          variants={group}
          className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-8"
        >
          {certificates.map((cert) => (
            <motion.li
              key={cert.src}
              variants={fade}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full max-w-[15.5rem] overflow-hidden border border-white/15 bg-white/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:border-white/35 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.38)] sm:max-w-none">
                <div className="relative aspect-[371/464] w-full overflow-hidden bg-[#f4f1ea]">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    sizes="(max-width: 640px) 70vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
              </div>

              <p className="display mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white sm:mt-5 sm:text-[13px]">
                {cert.name}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                {cert.detail}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
