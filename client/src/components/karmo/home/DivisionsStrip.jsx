"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { divisions as section } from "@/cms/pages/home";

/**
 * Our Divisions — four square catalogue tiles in one row.
 * No caption under the image. On hover: soft wash + inset white frame +
 * centred division name (furniture-catalogue pattern).
 * Content: Admin → Site content → Home → Our divisions.
 */

function DivisionCard({ division }) {
  const image = division.image || {};
  return (
    <motion.div variants={fade} className="min-w-0">
      <Link
        href={division.href || "#"}
        className="group relative block aspect-square overflow-hidden bg-[#e8e8e8]"
      >
        {image.src ? (
          <span className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <Image
              src={image.src}
              alt={image.alt || ""}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              style={imageStyle(image)}
            />
          </span>
        ) : null}

        {/* Hover: dim wash + inset white frame + centred name */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/40"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[12%] border border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[14%] lg:inset-[15%]"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="display translate-y-1 text-[15px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[16px] lg:text-[18px]">
            {division.name}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function DivisionsStrip() {
  const c = useSection("divisions", section.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;
  const tiles = c.tiles || [];

  return (
    <section className="relative overflow-hidden bg-white py-8 md:py-10">
      <TextureSlides lighter />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] px-4 text-center"
      >
        <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
            {c.eyebrow}
          </span>
          <h2
            className="display title-card-line mt-1 uppercase text-ink"
            style={{
              fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            <CmsText value={c.title} size={c.titleSize} />{" "}
            <CmsText className="text-brand" value={c.titleAccent} size={c.titleSize} />
          </h2>
        </motion.div>
      </motion.div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`relative z-[1] mt-3 grid grid-cols-2 gap-[2px] px-0 md:mt-3.5 md:gap-1 ${
          tiles.length === 3 ? "md:grid-cols-3" : tiles.length >= 5 ? "md:grid-cols-4 lg:grid-cols-5" : "md:grid-cols-4"
        }`}
      >
        {tiles.map((division, i) => (
          <DivisionCard key={`${i}-${division.name}`} division={division} />
        ))}
      </motion.div>
    </section>
  );
}
