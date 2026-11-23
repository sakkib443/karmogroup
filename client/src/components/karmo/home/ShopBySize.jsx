"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import TextureSlides from "@/components/karmo/home/TextureSlides";
import { sizes as section } from "@/cms/pages/home";

/**
 * How to choose the right mattress size — four size cards, each carrying its
 * width under the picture, with the shared length and a width key down the
 * left on desktop.
 *
 * Two looks, flipped by the side arrows: framed cards (white, bordered), and a
 * plain one where the frames drop away and the name and width tags slide in
 * close to the drawn mattress.
 *
 * Sized to the screen: on desktop the picture row (`--pic`) is the card's own
 * 3:4 height or what the viewport leaves after the heading, tags and edge
 * strip — whichever is smaller — so the whole band, title to edge strip, sits
 * in one screen. Slide distances and the length rule are shares of `--pic`, so
 * they track the picture at every size.
 * Content: Admin → Site content → Home → Choose your mattress size.
 */

const NAVY = "#0b1528";

export default function ShopBySize() {
  const c = useSection("sizes", section.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const [look, setLook] = useState(0);
  if (c.hidden) return null;
  const items = c.sizes || [];
  const plain = look === 1;
  const flip = () => setLook((l) => (l + 1) % 2);

  return (
    <section
      aria-label="Choose your mattress size"
      className="relative overflow-hidden bg-white pt-[clamp(24px,4svh,48px)] pb-0"
    >
      <TextureSlides lighter />

      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="relative z-[1] w-full">
        <motion.h2
          variants={fade}
          className="display section-heading title-card-line px-4 text-center uppercase text-ink sm:px-6"
        >
          <CmsText value={c.title} size={c.titleSize} />{" "}
          <CmsText className="text-brand" value={c.titleAccent} size={c.titleSize} />
        </motion.h2>

        {c.note ? (
          <motion.p variants={fade} className="mx-auto mt-2 max-w-2xl px-4 text-center text-[14px] text-ink/55">
            {c.note}
          </motion.p>
        ) : null}

        {/* Phones: the two arrows sit under the heading instead of over the cards. */}
        <motion.div variants={fade} className="mt-3 flex justify-center gap-3 md:hidden">
          <LookArrow dir={-1} onClick={flip} />
          <LookArrow dir={1} onClick={flip} />
        </motion.div>

        {/* Edge to edge: the band has no side margin; only the cards keep a small gutter. */}
        <motion.div variants={fade} className="mt-5 w-full lg:mt-[clamp(12px,2svh,24px)]">
          <div className={`relative px-3 sm:px-5 md:px-16 lg:px-20 ${c.edge?.src ? "" : "pb-6"}`}>
            <LookArrow dir={-1} onClick={flip} className="absolute left-3 top-1/2 z-[2] hidden -translate-y-1/2 md:flex lg:left-5" />
            <LookArrow dir={1} onClick={flip} className="absolute right-3 top-1/2 z-[2] hidden -translate-y-1/2 md:flex lg:right-5" />

            {/* Phones and tablets: the shared length as one line above the cards. */}
            {c.length ? (
              <p className="flex items-center gap-2.5 text-[13px] font-semibold text-ink/70 lg:hidden">
                <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Length
                </span>
                {c.length}
              </p>
            ) : null}

            {/* Desktop: rows are shared (subgrid) so the length rule lines up with the pictures. */}
            <div className="@container mt-5 grid grid-cols-2 gap-3 [--card:calc((100cqw_-_12px)/2)] [--pic:calc(var(--card)*4/3)] sm:gap-4 sm:[--card:calc((100cqw_-_16px)/2)] lg:mt-0 lg:grid-cols-[104px_repeat(4,minmax(0,1fr))] lg:gap-x-5 lg:gap-y-0 lg:[--card:calc((100cqw_-_184px)/4)] lg:[--pic:max(200px,min(calc(var(--card)*4/3),calc(84svh_-_260px)))]">
              <LengthRule value={c.length} />
              {items.map((size, idx) => (
                <SizeCard key={`${idx}-${size.name}`} size={size} plain={plain} />
              ))}
              <WidthRule />
            </div>

          </div>

          {/* Side view of a mattress — full border showing top quilted pillowtop, navy piping band, and base. */}
          {c.edge?.src ? (
            <div
              role="img"
              aria-label={c.edge.alt || "Karmo mattress full border profile"}
              className="mt-8 h-[95px] w-full sm:mt-10 sm:h-[120px] md:mt-12 md:h-[140px] lg:mt-16 lg:h-[165px] xl:h-[180px]"
              style={{
                backgroundImage: `url(${c.edge.src}${c.edge.src.includes("?") ? "&" : "?"}v=flush4)`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "auto 100%",
                backgroundPosition: "center top",
              }}
            />
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}

function SizeCard({ size, plain }) {
  const pic = size.image || {};
  return (
    <Link
      href={size.href || "#"}
      className={`group flex flex-col border transition-[border-color,background-color] duration-500 lg:row-span-3 lg:row-start-1 lg:grid lg:grid-rows-subgrid ${
        plain ? "border-transparent bg-transparent" : "border-ink/10 bg-white hover:border-brand/40"
      }`}
    >
      <div
        className={`flex h-11 items-center gap-2 border-b px-3 transition-[transform,border-color] duration-500 ease-out sm:px-4 ${
          plain ? "translate-y-[calc(var(--pic)*0.06)] justify-center border-transparent" : "justify-between border-ink/8"
        }`}
      >
        <span className="display text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 group-hover:text-brand sm:text-[14px]">
          {size.name}
        </span>
        {size.fits ? <span className="truncate text-[11px] text-ink/45">{size.fits}</span> : null}
      </div>

      <div className="relative h-[var(--pic)] w-full overflow-hidden">
        {pic.src ? (
          <Image
            src={pic.src}
            alt={pic.alt || ""}
            fill
            sizes="(min-width: 1024px) 22vw, 50vw"
            unoptimized
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={imageStyle(pic)}
          />
        ) : null}
      </div>

      <div
        className={`px-3 pb-3 pt-1 transition-transform duration-500 ease-out sm:px-4 ${
          plain ? "translate-y-[calc(var(--pic)*-0.075)]" : ""
        }`}
      >
        {size.width ? (
          <div className="flex flex-col items-center">
            {/* The horizontal width dimension line spanning edge-to-edge with end ticks */}
            <div className="relative flex h-[27px] w-full items-center">
              <span aria-hidden className="h-px w-full bg-ink/30" />
              <span aria-hidden className="absolute left-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-ink/50" />
              <span aria-hidden className="absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-ink/50" />
            </div>
            {/* Size measurement below the line */}
            <p className="pb-1 text-center text-[12px] font-bold tabular-nums tracking-wide text-ink sm:text-[13px]">
              {size.width}
            </p>
          </div>
        ) : null}
        <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45 lg:hidden">Width</p>
      </div>
    </Link>
  );
}

/** Desktop only — sits in the picture row, ends where the drawn mattresses end. */
function LengthRule({ value }) {
  if (!value) return null;
  const lines = String(value).split("/").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="relative hidden lg:col-start-1 lg:row-start-2 lg:block">
      <div aria-hidden className="absolute bottom-[10%] right-2 top-[8.5%] flex flex-col items-center">
        <span className="h-px w-3 bg-ink/40" />
        <span className="w-px flex-1 bg-ink/30" />
        <span className="h-px w-3 bg-ink/40" />
      </div>
      <div className="absolute inset-y-0 left-0 right-7 flex flex-col items-center justify-center gap-2 text-center">
        <span className="bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Length
        </span>
        <span className="text-[12.5px] font-bold leading-relaxed tabular-nums text-ink">
          {lines.map((l, i) => (
            <span key={i} className="block">{l}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

/** Desktop only — the WIDTH tag sits centred under the four cards (like LENGTH sits centred on the left), on a rule with end ticks. */
function WidthRule() {
  return (
    <div className="hidden lg:col-start-2 lg:col-span-4 lg:row-start-4 lg:block lg:pt-4">
      <div className="relative flex h-6 items-center justify-center">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-ink/30" />
        <span aria-hidden className="absolute left-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-ink/40" />
        <span aria-hidden className="absolute right-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-ink/40" />
        <span className="relative bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Width
        </span>
      </div>
    </div>
  );
}

function LookArrow({ dir, onClick, className = "" }) {
  const Icon = dir < 0 ? FiChevronLeft : FiChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Previous look" : "Next look"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-ink/30 hover:text-brand sm:h-11 sm:w-11 ${className}`}
    >
      <Icon className="text-[20px]" aria-hidden />
    </button>
  );
}
