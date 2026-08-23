"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * "Certified By" — same three accreditations as the client's site, tightened
 * to sit with the rest of Home 02: centred heading rhythm, even soft wash,
 * quieter frames, light hover, short labels under each certificate.
 */

const ORANGE = "#FF9A1F";

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

function LeafRule() {
  return (
    <span aria-hidden className="mt-6 flex items-center justify-center gap-3">
      <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
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
      <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
    </span>
  );
}

export default function CertifiedBy() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <Image
        src="/karmo/images/home-02/certified/bg-living-room.jpg"
        alt=""
        fill
        sizes="100vw"
        className="scale-[1.02] object-cover"
        aria-hidden
      />
      {/* One even wash — same depth edge to edge, slightly deeper than the
          reference so the white frames and type sit cleaner. */}
      <span aria-hidden className="absolute inset-0 bg-[rgba(10,14,20,0.62)]" />
      {/* Soft top/bottom fade so the section meets the page without a hard cut. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent"
      />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] text-center"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-white/70">
            Certified By
          </span>
          <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-white lg:text-[2.4rem]">
            International{" "}
            <span className="font-bold" style={{ color: ORANGE }}>
              Accreditations
            </span>
          </h2>
          <LeafRule />
        </motion.div>

        <motion.ul
          variants={group}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:mt-16 lg:gap-8"
        >
          {certificates.map((cert) => (
            <motion.li
              key={cert.src}
              variants={fade}
              className="group flex flex-col items-center"
            >
              {/* Quiet frame: thin white mat + light lift on hover — not a
                  thick poster border. The cert artwork already carries its own
                  wood frame, so we only need a clean edge against the room. */}
              <div className="relative w-full max-w-[17.5rem] overflow-hidden bg-white p-2 shadow-[0_18px_48px_rgba(0,0,0,0.32)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_56px_rgba(0,0,0,0.4)] sm:max-w-none">
                <div className="relative aspect-[371/464] w-full overflow-hidden bg-[#f4f1ea]">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    sizes="(max-width: 640px) 70vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                {/* Brand hairline under the frame — ties the three as a set. */}
                <span
                  aria-hidden
                  className="absolute inset-x-2 bottom-2 h-[2px] origin-center scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
              </div>

              <p className="display mt-5 text-[13px] font-bold uppercase tracking-[0.16em] text-white">
                {cert.name}
              </p>
              <p className="mt-1.5 text-[12px] uppercase tracking-[0.14em] text-white/55">
                {cert.detail}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
