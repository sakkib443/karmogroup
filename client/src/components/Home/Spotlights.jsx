"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowUpRight,
  FiShield,
  FiWind,
  FiHeart,
  FiLayers,
} from "react-icons/fi";

/**
 * A single deep-dive row on the mattress division.
 *
 * The headline, copy and the four roundel claims come from Karmo's own company
 * profile — the page reproduced in recource/Karmo Website/images as matts.png
 * (p06), carrying the karmogroup.com footer. Nothing here is invented; the
 * wording is condensed, not embellished.
 *
 * It was a three-row block (HomeTex and Chemicals alongside) until 27 July
 * 2026. Both were dropped: their divisions already have a card in the deck
 * above, and three long rows in a row read as the same section three times.
 * Kept as an array so a second row can be added back without a rewrite.
 */
const spotlights = [
  {
    tag: "Mattress",
    title: "We test every mattress.",
    titleAccent: "Every single one.",
    lead: "Your perfect partner for a complete bedding solution.",
    body: "Karmo mattresses are an ergonomic design that supports the contours of the body, body weight and the spine. Quilted by US machinery so air passes between you and the mattress, and edged on European automatic machines at 180–200°C under 500 tonnes of roller pressure, so the mattress never loses its thickness.",
    points: [
      { icon: FiWind, label: "Anti dust" },
      { icon: FiShield, label: "Quality certified" },
      { icon: FiHeart, label: "Recommended by doctors" },
      { icon: FiLayers, label: "Firm posture" },
    ],
    quote: "Everyone assures quality, but not everyone can promise experiences.",
    href: "/mattress",
    image: "/images/products/spotlight-mattress-cutaway.png",
    alt: "Karmo mattress cut away at one corner, showing the quilted top, comfort foam and pocketed spring base",
  },
];

import {
  group,
  line,
  rise as fade,
  zoomOut,
  curtainUp as curtain,
  VIEWPORT,
} from "./motion";

function Spotlight({ item, flipped, reveal, once, curtainColour }) {
  return (
    <motion.article
      variants={group}
      {...reveal}
      viewport={once}
      className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      {/* Picture. On wide screens every other row puts it on the right, so the
          three rows read as a rhythm rather than a list. */}
      <div className={flipped ? "lg:order-2" : ""}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5">
          <motion.div variants={zoomOut} className="absolute inset-0">
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.span
            aria-hidden="true"
            variants={curtain}
            className={`absolute inset-0 z-10 ${curtainColour}`}
          />

          {/* The division name set down the outer edge — the same marking
              Karmo runs on its own division pages, and the same device the
              divisions deck above uses. */}
          <span
            aria-hidden="true"
            className="display absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 select-none text-[0.68rem] font-bold uppercase tracking-[0.32em] text-white/60 lg:block"
            style={{ writingMode: "vertical-rl" }}
          >
            {item.tag}
          </span>
        </div>
      </div>

      <div className={flipped ? "lg:order-1" : ""}>
        <span className="block overflow-hidden">
          <motion.span
            variants={line}
            className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
          >
            <span className="h-px w-10 bg-brand" />
            {item.tag}
          </motion.span>
        </span>

        <h3 className="display mt-5 text-[1.7rem] font-light leading-[1.15] text-ink sm:text-[2.1rem]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block">
              {item.title}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block font-bold">
              {item.titleAccent}
            </motion.span>
          </span>
        </h3>

        <span className="mt-5 block overflow-hidden">
          <motion.span
            variants={line}
            className="block text-[15px] font-medium text-ink/75"
          >
            {item.lead}
          </motion.span>
        </span>

        <motion.p
          variants={fade}
          className="mt-4 max-w-xl text-[14px] leading-[1.9] text-ink/60"
        >
          {item.body}
        </motion.p>

        {/* Set as circular badges rather than a bulleted list — the four claims
            are exactly the four roundels Karmo prints on its own product
            pages, so they are given the same shape here. */}
        <motion.ul
          variants={group}
          className="mt-9 flex flex-wrap gap-x-8 gap-y-6 border-t border-ink/10 pt-8"
        >
          {item.points.map((point) => (
            <motion.li
              key={point.label}
              variants={fade}
              className="group/pt flex w-[calc(50%-1rem)] items-center gap-3 sm:w-auto sm:max-w-[7.5rem] sm:flex-col sm:gap-2.5 sm:text-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/[0.07] ring-1 ring-brand/15 transition-colors duration-500 group-hover/pt:bg-brand/[0.13]">
                <point.icon className="text-[19px] text-brand" />
              </span>
              <span className="text-[12px] font-semibold leading-tight text-ink">
                {point.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={fade}
          className="mt-8 border-l-2 border-brand/40 pl-4 text-[13px] italic leading-relaxed text-ink/55"
        >
          {item.quote}
        </motion.p>

        <motion.div variants={fade}>
          {/* Not btn-secondary here: that variant fills white on hover, which on
              this white section leaves nothing to see. */}
          <Link
            href={item.href}
            className="group mt-8 inline-flex items-center gap-4 rounded-full border border-ink/20 py-2 pl-7 pr-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:border-brand hover:text-brand"
          >
            Explore {item.tag}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Spotlights({ heading }) {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = VIEWPORT;

  return (
    <section className="bg-white py-20 md:py-24">
      {/* This section never had a header of its own — each row carries its own
          tag. Home 03 gives the group a single heading for consistency; Home 01
          renders it headerless as before. */}
      {heading && <div className="shell mb-16 md:mb-20">{heading}</div>}

      <div className="space-y-20 md:space-y-28">
        {spotlights.map((item, index) => (
          <Spotlight
            key={item.tag}
            item={item}
            flipped={index % 2 === 1}
            reveal={reveal}
            once={once}
            curtainColour="bg-white"
          />
        ))}
      </div>
    </section>
  );
}
