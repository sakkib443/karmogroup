"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { editorials } from "@/cms/pages/home";

/**
 * Home Two — third section. Screen-tall band: left tagline (shell-aligned) +
 * right masonry. Soft mattress damask texture behind the whole band.
 */

const GAP = "gap-1 md:gap-1.5";
const DESKTOP_H = "calc(100svh - 32px)";

/* Layout of the six photos (3 columns × 2) — design, not content. The photos,
   names and links come from Site content → Home → Our craft. */
const SLOTS = [
  { ratio: "aspect-[3/4]", grow: "md:flex-[16]" },
  { ratio: "aspect-[4/5]", grow: "md:flex-[15]" },
  { ratio: "aspect-[12/11]", grow: "md:flex-[14]" },
  { ratio: "aspect-[3/5]", grow: "md:flex-[17]" },
  { ratio: "aspect-[3/4]", grow: "md:flex-[16]" },
  { ratio: "aspect-[4/5]", grow: "md:flex-[15]" },
];

function Shot({ shot, slot }) {
  const image = shot.image || {};
  return (
    <Link
      href={shot.href || "#"}
      className={`group relative block w-full min-h-0 overflow-hidden ${slot.ratio} md:aspect-auto md:flex-1 ${slot.grow}`}
    >
      {image.src ? (
        <span className="absolute inset-0 origin-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            quality={85}
            unoptimized
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 42vw"
            className="object-cover"
            style={imageStyle(image)}
          />
        </span>
      ) : null}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[10%] border-2 border-white/0 transition-all duration-500 ease-out group-hover:border-white/95 sm:inset-[12%] lg:inset-[13%]"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="display translate-y-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[14px] lg:text-[15px]">
          {shot.label}
        </span>
      </span>
    </Link>
  );
}

export default function DivisionEditorials() {
  const c = useSection("editorials", editorials.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;
  const shots = c.shots || [];
  const columns = [shots.slice(0, 2), shots.slice(2, 4), shots.slice(4, 6)].filter((col) => col.length);

  return (
    <section
      data-home-two-snap
      className="division-editorials relative mb-[6px] overflow-x-clip py-14 lg:overflow-visible lg:py-0"
      style={{
        ["--division-h"]: DESKTOP_H,
        backgroundColor: "#ffffff",
      }}
    >
      <TextureSlides lighter />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] grid items-center gap-8 px-6 md:px-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.65fr)] lg:h-full lg:min-h-0 lg:items-stretch lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))] lg:pr-0 xl:gap-10"
      >
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="min-w-0 self-center text-left"
        >
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              {c.eyebrow}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              {c.eyebrowNote}
            </span>
          </p>

          <h2 className="display section-heading title-card-line mt-3 uppercase text-ink">
            <CmsText as="span" className="block sm:whitespace-nowrap" value={c.titleLine1} size={c.titleLine1Size} />
            <CmsText as="span" className="block text-brand sm:whitespace-nowrap" value={c.titleLine2} size={c.titleLine2Size} />
          </h2>

          <span className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              {c.tagline}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill="#FF9A1F"
              />
              <path d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8" stroke="#B4651A" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>

          <p className="body-copy mt-5 text-[16px] leading-[1.7] text-ink/55 lg:text-[17px]">
            <CmsText value={c.body} size={c.bodySize} />
          </p>

          {c.link?.label ? (
          <Link href={c.link.href || "#"} className="group mt-8 inline-flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              {c.link.label}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
          ) : null}
        </motion.div>

        <div
          className={`grid min-h-0 w-full min-w-0 grid-cols-2 md:grid-cols-3 lg:h-full ${GAP}`}
        >
          {columns.map((col, i) => (
            <div
              key={`div-col-${i}`}
              className={
                i === columns.length - 1
                  ? `col-span-2 grid min-h-0 grid-cols-2 ${GAP} md:col-span-1 md:flex md:flex-col lg:h-full`
                  : `flex min-h-0 flex-col lg:h-full ${GAP}`
              }
            >
              {col.map((shot, j) => (
                <Shot key={`${i}-${j}`} shot={shot} slot={SLOTS[i * 2 + j] || SLOTS[0]} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
