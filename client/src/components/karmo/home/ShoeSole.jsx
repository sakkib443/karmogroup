"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import {
  IconClaimCushion,
  IconClaimLight,
  IconClaimLoad,
  IconServiceDensity,
  IconServiceFormula,
  IconServiceLight,
  IconServiceScale,
} from "@/components/karmo/home/footwearClaimIcons";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle, overlayStyle } from "@/cms/core";
import { footwear } from "@/cms/pages/home";

/**
 * Footwear foam — one full-height "foam spec sheet" section: copy, claim cards
 * and stats on the left, the client's exploded shoe and a foam-microstructure
 * card on the right, and a "foam engineered around your product" services band
 * underneath, all over the rolled-foam still.
 */

const DESKTOP_H = "calc(100svh - 64px)";

const TITLE_STYLE = {
  fontSize: "clamp(1.4rem, 1.02rem + 1.2vw, 2rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.06,
  letterSpacing: "-0.015em",
};

/* Icons stay with the design, by position. Words: Admin → Site content → Home →
   Footwear foam (defaults in src/cms/pages/home.js). */
const CLAIM_ICONS = [IconClaimCushion, IconClaimLoad, IconClaimLight];
const SERVICE_ICONS = [IconServiceDensity, IconServiceFormula, IconServiceLight, IconServiceScale];

function FoamSpecLayout({ reveal, c }) {
  return (
    <motion.div
      variants={group}
      {...reveal}
      viewport={VIEWPORT}
      className="relative z-[2] mx-auto flex min-h-[inherit] w-full max-w-[1600px] flex-col justify-center gap-6 px-6 py-10 text-white sm:px-8 sm:py-12 lg:gap-8 lg:px-12 lg:py-14 xl:px-16 [@media(max-height:800px)]:gap-5 [@media(max-height:800px)]:py-8"
    >
      <div className="grid min-h-0 items-center gap-6 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-10 [@media(max-height:800px)]:gap-5">
        {/* Left — copy, claim cards, stats */}
        <motion.div variants={fade} className="relative">
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            {c.eyebrow}
            <span aria-hidden className="h-px w-10 bg-white/35" />
          </span>

          <h2 className="display title-card-line mt-2 uppercase text-white" style={TITLE_STYLE}>
            <CmsText as="span" className="block" value={c.titleLine1} size={c.titleLine1Size} />
            <span className="block" style={c.titleLine1Size && c.titleLine1Size !== 100 ? { fontSize: `${c.titleLine1Size / 100}em` } : undefined}>
              {c.titleBefore} {c.titleAccent ? <span className="text-white/50">{c.titleAccent}</span> : null} {c.titleAfter}
            </span>
          </h2>

          {c.subtitle ? <p className="mt-1.5 text-[12.5px] font-medium text-white/80">{c.subtitle}</p> : null}
          {c.body ? (
            <p className="mt-2 max-w-[30rem] text-[12px] leading-snug text-white/60" style={{ whiteSpace: "pre-line" }}>
              {c.body}
            </p>
          ) : null}

          <ul className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/12">
            {(c.claims || []).map(({ title, body }, i) => {
              const Icon = CLAIM_ICONS[i % CLAIM_ICONS.length];
              return (
              <li key={`${i}-${title}`} className="flex flex-col items-start gap-1.5 bg-black/45 px-3 py-2.5 sm:px-3.5">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full shadow-[0_6px_14px_rgba(0,0,0,0.35)] sm:h-9 sm:w-9">
                  <Icon />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">{title}</p>
                <p className="text-[10px] leading-[1.35] text-white/55">{body}</p>
              </li>
              );
            })}
          </ul>

          <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
            {(c.stats || []).map((s, i) => (
              <div key={`${i}-${s.label}`}>
                <dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">{s.label}</dt>
                <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-white">{s.value}</dd>
              </div>
            ))}
          </dl>

          {c.button?.label ? (
            <Link
              href={c.button.href || "#"}
              className="mt-4 inline-flex h-11 items-center gap-2 bg-brand px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark sm:px-6"
            >
              {c.button.label}
              <FiArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          ) : null}
        </motion.div>

        {/* Right — exploded shoe + foam microstructure card */}
        <motion.div
          variants={fade}
          className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-end"
        >
          <div className="relative h-[min(46svh,28rem)] w-full max-w-[44rem] lg:h-[min(52svh,34rem)]">
            {c.shoe?.src ? (
              <Image
                src={c.shoe.src}
                alt={c.shoe.alt || ""}
                fill
                sizes="(min-width: 1024px) 44vw, 92vw"
                quality={92}
                className="object-contain object-center"
                style={imageStyle(c.shoe)}
              />
            ) : null}
          </div>
          <div className="w-full max-w-[15rem] shrink-0">
            <div className="relative mx-auto aspect-square w-[8.5rem] overflow-hidden rounded-full ring-1 ring-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.45)] lg:mx-0">
              {c.micro?.src ? (
                <Image
                  src={c.micro.src}
                  alt={c.micro.alt || ""}
                  fill
                  sizes="136px"
                  className="object-cover object-center"
                  style={imageStyle(c.micro)}
                />
              ) : null}
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-white">{c.microTitle}</p>
            <ul className="mt-2 space-y-1.5">
              {(c.microBullets || []).map((b, i) => (
                <li key={`${i}-${b.text}`} className="flex items-center gap-2 text-[11px] text-white/65">
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {b.text}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Bottom — services band + density CTA, per client spec sheet */}
      <motion.div variants={fade} className="shrink-0 border-t border-white/12 pt-5 lg:pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_minmax(0,13rem)] lg:items-start">
          <div>
            <p className="display text-[14px] font-bold uppercase leading-tight tracking-[0.04em] text-white" style={{ whiteSpace: "pre-line" }}>
              {c.servicesTitle}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
            {(c.services || []).map(({ title, body }, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
              <div
                key={`${i}-${title}`}
                className={`flex gap-2.5 ${i > 0 ? "sm:border-l sm:border-white/12 sm:pl-3" : ""}`}
              >
                <Icon />
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.04em] text-white">{title}</p>
                  <p className="mt-0.5 text-[10px] leading-[1.4] text-white/50">{body}</p>
                </div>
              </div>
              );
            })}
          </div>
          <div className="lg:border-l lg:border-white/12 lg:pl-5">
            <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.04em] text-white">
              {c.askTitle}
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-white/55">{c.askBody}</p>
            {c.askLink?.label ? (
              <Link
                href={c.askLink.href || "#"}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand transition-colors hover:text-white"
              >
                {c.askLink.label}
                <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ShoeSole() {
  const c = useSection("footwear", footwear.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;

  return (
    <section
      id="karmo-footwear"
      data-home-two-snap
      className="footwear-band relative overflow-hidden bg-black"
      style={{ ["--footwear-h"]: DESKTOP_H }}
      aria-label="Karmo footwear foam"
    >
      {c.background?.src ? (
        <Image
          src={c.background.src}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
          style={imageStyle(c.background)}
        />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={overlayStyle(c.overlay)}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/55 via-black/30 to-black/10"
      />

      <FoamSpecLayout reveal={reveal} c={c} />
    </section>
  );
}
