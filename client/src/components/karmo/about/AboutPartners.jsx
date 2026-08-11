"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { aboutPartners } from "@/components/karmo/about/aboutData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Working partners — infinite logo/wordmark carousel for the About page.
 *
 * Built for real marks: drop a transparent PNG/SVG into `logo` on any entry
 * in `aboutPartners` and the tile swaps the type for the image. Until then
 * each partner renders as a quiet editorial wordmark so the band never
 * claims brands Karmo has not supplied artwork for.
 */

function PartnerTile({ partner }) {
  return (
    <li className="group relative mr-3 flex h-[5.5rem] w-[11.5rem] shrink-0 items-center justify-center border border-ink/10 bg-white px-5 transition-colors duration-300 hover:border-brand/30 sm:mr-4 sm:h-[6.25rem] sm:w-[13.5rem] lg:h-[6.75rem] lg:w-[15rem]">
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={partner.name}
          width={180}
          height={64}
          className="max-h-10 w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 sm:max-h-11"
        />
      ) : (
        <span className="text-center">
          <span className="display block text-[13px] font-bold uppercase leading-snug tracking-[0.12em] text-ink/75 transition-colors duration-300 group-hover:text-ink sm:text-[14px]">
            {partner.name}
          </span>
          {partner.sector ? (
            <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/35">
              {partner.sector}
            </span>
          ) : null}
        </span>
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </li>
  );
}

function PartnerTrack({ partners, direction = "left", still }) {
  const track = still ? partners : [...partners, ...partners];
  return (
    <ul
      className={
        still
          ? "flex list-none justify-center gap-3 overflow-x-auto px-4 pb-1 sm:gap-4"
          : `marquee list-none ${direction === "right" ? "marquee-right" : "marquee-left"}`
      }
    >
      {track.map((partner, index) => (
        <PartnerTile key={`${partner.name}-${index}`} partner={partner} />
      ))}
    </ul>
  );
}

export default function AboutPartners() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const { rowOne, rowTwo } = aboutPartners;

  return (
    <section
      id="partners"
      className="relative overflow-hidden border-t border-ink/8 bg-cream/50 py-14 md:py-20 lg:py-24"
      aria-label="Working partners"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative"
      >
        <motion.div variants={fade} className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            {aboutPartners.eyebrow}
          </span>
          <h2 className="display mt-3 text-[1.75rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink sm:text-[1.95rem] lg:text-[2.35rem]">
            {aboutPartners.titleLead}{" "}
            <span className="font-bold text-brand">{aboutPartners.titleAccent}</span>
          </h2>
          <LeafRule />
          <p className="body-copy mx-auto mt-5 max-w-xl text-[14px] leading-[1.8] text-ink/55 sm:text-[15px]">
            {aboutPartners.lead}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="marquee-rows relative mt-10 space-y-3 sm:mt-12 sm:space-y-4 lg:mt-14"
      >
        <PartnerTrack partners={rowOne} direction="left" still={!!reduceMotion} />
        <PartnerTrack partners={rowTwo} direction="right" still={!!reduceMotion} />
      </motion.div>
    </section>
  );
}
