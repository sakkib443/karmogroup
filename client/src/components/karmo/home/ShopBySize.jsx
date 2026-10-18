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
      className="relative overflow-hidden bg-white py-[clamp(24px,4svh,48px)]"
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
                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ backgroundColor: NAVY }}>
                  Length
                </span>
                {c.length}
              </p>
            ) : null}

            {/* Desktop: rows are shared (subgrid) so the length rule lines up with the pictures. */}
            <div className="@container mt-5 grid grid-cols-2 gap-3 [--card:calc((100cqw_-_12px)/2)] [--pic:calc(var(--card)*4/3)] sm:gap-4 sm:[--card:calc((100cqw_-_16px)/2)] lg:mt-0 lg:grid-cols-[104px_repeat(4,minmax(0,1fr))] lg:gap-x-5 lg:gap-y-0 lg:[--card:calc((100cqw_-_184px)/4)] lg:[--pic:max(200px,min(calc(var(--card)*4/3),calc(84svh_-_260px)))]">
              <LengthRule value={c.length} />
              <WidthKey plain={plain} />
              {items.map((size, idx) => (
                <SizeCard key={`${idx}-${size.name}`} size={size} plain={plain} />
              ))}
            </div>

          </div>

          {/* Side view of a mattress — its thickness is the height. A seamless middle
              cut repeated side by side, so the band stays low and never shows an end. */}
          {c.edge?.src ? (
            <div
              role="img"
              aria-label={c.edge.alt || ""}
              className="mt-4 h-[50px] w-full opacity-70 sm:h-[66px] lg:mt-[clamp(12px,2svh,20px)] lg:h-[clamp(44px,7.5svh,82px)]"
              style={{
                backgroundImage: `url(${c.edge.src})`,
                backgroundRepeat: "repeat-x",
                backgroundSize: "auto 100%",
                backgroundPosition: "center",
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
        className={`px-3 pb-4 pt-1 transition-transform duration-500 ease-out sm:px-4 ${
          plain ? "translate-y-[calc(var(--pic)*-0.075)]" : ""
        }`}
      >
        {size.width ? (
          <div className="relative flex items-center justify-center">
            <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-ink/25" />
            <span aria-hidden className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink/40" />
            <span aria-hidden className="absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink/40" />
            <span
              className="relative px-2.5 py-1 text-[11.5px] font-bold tabular-nums text-white sm:text-[12.5px]"
              style={{ backgroundColor: NAVY }}
            >
              {size.width}
            </span>
          </div>
        ) : null}
        <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45 lg:hidden">Width</p>
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
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ backgroundColor: NAVY }}>
          Length
        </span>
        <span className="text-[12px] font-semibold leading-relaxed tabular-nums text-ink/70">
          {lines.map((l, i) => (
            <span key={i} className="block">{l}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

/** Desktop only — sits in the width row, beside the first card's width tag. */
function WidthKey({ plain }) {
  return (
    <div className="hidden pt-1 lg:col-start-1 lg:row-start-3 lg:block">
      <div
        className={`flex h-[27px] items-center gap-1.5 transition-transform duration-500 ease-out ${
          plain ? "translate-y-[calc(var(--pic)*-0.075)]" : ""
        }`}
      >
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white" style={{ backgroundColor: NAVY }}>
          Width
        </span>
        <span aria-hidden className="h-px flex-1 bg-ink/30" />
        <span aria-hidden className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-ink/45" />
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
