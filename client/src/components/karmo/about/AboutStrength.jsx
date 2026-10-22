"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LuAward, LuFactory, LuFlaskConical, LuTrendingUp, LuTruck, LuUsers } from "react-icons/lu";

import { aboutStrength } from "@/components/karmo/about/aboutData";
import LeafRule from "@/components/karmo/about/LeafRule";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useGlobal, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { certified } from "@/cms/pages/global";
import TextureSlides from "@/components/karmo/home/TextureSlides";

const BADGE_BG = "/pages/home/footwear/rolled-black-foam-bg.webp";

const ICONS = { award: LuAward, growth: LuTrendingUp, truck: LuTruck, people: LuUsers, factory: LuFactory, flask: LuFlaskConical };

/**
 * Our strength and accreditations (#achievements). One screen tall on a
 * computer: the four gold badges of the trust band above the footer (number one,
 * ISO 9001, UKAS, Moody) sit side by side on the left half, over the homepage's
 * rolled black foam photo, the six
 * strengths on the right as icon, title and one line. The badges come from
 * Admin → Site content → Brand & contact → Certifications, like that band.
 */
export default function AboutStrength() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const c = aboutStrength;
  const trust = useGlobal("certified", certified.defaults);
  const badges = trust.pillars || [];

  return (
    <section
      id="achievements"
      className="relative mt-1.5 scroll-mt-[112px] bg-white lg:h-[calc(100svh-112px)]"
      aria-label="Our strength and accreditations"
    >
      {/* The homepage's section texture behind the right half (Admin → Section background texture). */}
      <TextureSlides lighter />
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] grid h-full lg:grid-cols-2"
      >
        <motion.div
          variants={fade}
          className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-14 lg:px-[clamp(1.5rem,3vw,3.5rem)]"
        >
          {/* The rolled black foam photo from the homepage footwear band under one
              light, even veil — the same shade everywhere, no glow or gradient. */}
          <Image src={BADGE_BG} alt="" aria-hidden fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-black/70" />
          <h2 className="display section-heading title-card-line relative text-center uppercase text-white">
            <CmsText value={trust.heading} size={trust.headingSize} />
          </h2>
          <span aria-hidden className="relative mt-4 block h-[3px] w-14 bg-brand" />

          <ul className="relative mt-[clamp(2rem,6svh,4rem)] grid w-full grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-4 xl:gap-x-2">
            {badges.map(({ image, title }, i) => (
              <li
                key={`${i}-${title}`}
                className={`flex flex-col items-center text-center ${i > 0 ? "xl:border-l xl:border-white/15" : ""}`}
              >
                <span className="relative block aspect-square w-full max-w-[13rem] xl:max-w-[11.5rem]">
                  {image?.src ? (
                    <Image
                      src={image.src}
                      alt={image.alt || title || ""}
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 184px, 208px"
                      className="object-contain"
                      style={imageStyle(image)}
                    />
                  ) : null}
                </span>
                <span className="display mt-4 block px-2 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.12em] text-white xl:text-[0.75rem]">
                  {title}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fade}
          className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-[clamp(2.5rem,5vw,6rem)] lg:py-8"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/50">{c.eyebrow}</span>
          <h2 className="display section-heading title-card-line mt-2 uppercase text-ink">
            {c.titleLead} <span className="text-brand">{c.titleAccent}</span>
          </h2>
          <LeafRule align="left" className="mt-3" />

          <ul className="mt-[clamp(1.5rem,4svh,2.75rem)] grid grid-cols-1 gap-x-8 gap-y-[clamp(1.1rem,3svh,2rem)] sm:grid-cols-2">
            {c.pillars.map(({ id, icon, title, note }) => {
              const Icon = ICONS[icon];
              return (
                <li key={id} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="display block text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-ink">{title}</span>
                    <span className="body-copy mt-1 block text-[13.5px] leading-[1.55] text-ink/55">{note}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-[clamp(1.5rem,4svh,2.75rem)] flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink/10 pt-5 text-[12px] uppercase tracking-[0.16em] text-ink/45">
            <span className="font-semibold text-ink/70">{c.suppliersLabel}</span>
            {c.suppliers.map((s) => (
              <span key={s} className="font-semibold text-ink">{s}</span>
            ))}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
