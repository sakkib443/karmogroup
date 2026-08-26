"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { TbCertificate, TbFeather, TbShieldCheck } from "react-icons/tb";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Mattress feature mosaic — Sleep Well claims (short) on top-left,
 * lifestyle spotlight below; certs + Sleep Well film on the right.
 */

const NAVY =
  "h-full min-h-0 rounded-none border border-[#e07a3a]/70 bg-[#0b1a33] text-white";
const LIGHT =
  "h-full min-h-0 rounded-none border border-[#e2e2e4] bg-[#f7f7f8]";

const CLAIM_ICONS = {
  shield: TbShieldCheck,
  feather: TbFeather,
  certificate: TbCertificate,
};

const BADGE = {
  red: "bg-[#E03131]",
  blue: "bg-[#1C7ED6]",
  green: "bg-[#2F9E44]",
};

/* ——— One big claim (top-left) ——— */
function ClaimPanel({ item, solid = false }) {
  if (!item) return null;
  const Icon = CLAIM_ICONS[item.icon] || TbShieldCheck;
  const badge = BADGE[item.badge] || BADGE.red;

  return (
    <motion.article
      variants={fade}
      className={`relative flex flex-col justify-center overflow-hidden px-5 py-5 sm:px-6 sm:py-6 lg:px-7 ${
        solid
          ? "h-full min-h-0 rounded-none border border-[#e2e2e4] bg-white text-[#0b1a33]"
          : NAVY
      }`}
    >
      {item.background && !solid ? (
        <>
          <Image
            src={item.background}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 50vw"
            className="object-cover object-center"
            aria-hidden
          />
          <span aria-hidden className="absolute inset-0 bg-[#0b1a33]/72" />
        </>
      ) : null}
      <div className="relative z-[1] flex flex-col">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 ${badge}`}
        >
          <Icon className="text-[28px] text-white sm:text-[32px]" aria-hidden />
        </span>
        <h3
          className={`display mt-4 text-[1.05rem] font-bold uppercase tracking-[0.04em] sm:text-[1.15rem] lg:text-[1.25rem] ${
            solid ? "text-[#0b1a33]" : "text-white"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`body-copy mt-2.5 max-w-[22rem] text-[12.5px] leading-[1.55] sm:text-[13px] ${
            solid ? "text-[#0b1a33]/65" : "text-white/85"
          }`}
        >
          {item.overview}
        </p>
        <span
          aria-hidden
          className="mt-5 h-[3px] w-10 bg-brand sm:mt-6"
        />
      </div>
    </motion.article>
  );
}

/* ——— Two claims side-by-side (top-right) ——— */
function ClaimsPairPanel({ items = [] }) {
  if (!items.length) return null;

  return (
    <motion.article
      variants={fade}
      className={`grid grid-cols-2 gap-0 ${NAVY}`}
    >
      {items.map((item, i) => {
        const Icon = CLAIM_ICONS[item.icon] || TbShieldCheck;
        const badge = BADGE[item.badge] || BADGE.blue;
        return (
          <div
            key={item.id}
            className={`flex flex-col justify-center px-4 py-5 sm:px-5 sm:py-6 ${
              i > 0 ? "border-l border-white/15" : ""
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${badge}`}
            >
              <Icon className="text-[24px] text-white sm:text-[28px]" aria-hidden />
            </span>
            <h3 className="display mt-3.5 text-[13px] font-bold uppercase tracking-[0.04em] text-white sm:text-[14px] lg:text-[15px]">
              {item.title}
            </h3>
            <p className="body-copy mt-2 text-[11.5px] leading-[1.5] text-white/70 sm:text-[12.5px]">
              {item.overview}
            </p>
            <span aria-hidden className="mt-4 h-[3px] w-8 bg-brand" />
          </div>
        );
      })}
    </motion.article>
  );
}

/* ——— Lifestyle spotlight: person left, copy right ——— */
function SpotlightPanel({ data }) {
  if (!data?.image) return null;

  return (
    <motion.article
      variants={fade}
      className="relative col-span-2 min-h-0 overflow-hidden rounded-none bg-[#dfe7ef]"
    >
      <Image
        src={data.image}
        alt={data.alt || ""}
        fill
        sizes="(min-width: 768px) 55vw, 100vw"
        className="object-cover object-[center_40%]"
        priority={false}
      />
      <div className="relative z-[1] flex h-full items-center justify-end px-6 py-6 sm:px-8 lg:px-10">
        <div className="max-w-[16rem] text-right sm:max-w-[18rem] lg:max-w-[20rem]">
          <h3 className="display text-[1.55rem] font-bold uppercase leading-[1.08] tracking-[0.01em] text-[#0b1a33] sm:text-[1.85rem] lg:text-[2.15rem]">
            {data.headingLead}{" "}
            {data.headingAccent ? (
              <span className="italic font-semibold text-[#0b1a33]/80">
                {data.headingAccent}
              </span>
            ) : null}{" "}
            {data.headingEnd}
          </h3>
          {data.subline ? (
            <p className="body-copy mt-3 text-[12.5px] leading-[1.5] text-[#0b1a33]/70 sm:text-[13.5px]">
              {data.subline}
            </p>
          ) : null}
          {data.brand ? (
            <p className="display mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand sm:mt-6 sm:text-[12px]">
              {data.brand}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function CertCard({ item }) {
  return (
    <motion.article
      variants={fade}
      className={`flex items-center gap-4 px-5 py-4 transition-colors duration-300 hover:bg-white sm:gap-5 sm:px-6 sm:py-5 ${LIGHT}`}
    >
      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden bg-white shadow-[0_0_0_1px_rgba(11,26,51,0.08)] sm:h-[88px] sm:w-[88px]">
        <Image
          src={item.image}
          alt={item.alt || ""}
          fill
          sizes="88px"
          className="object-contain object-center p-1.5"
        />
      </div>
      <div className="min-w-0">
        <h3 className="display text-[14px] font-bold uppercase leading-snug tracking-[0.04em] text-[#0b1a33] sm:text-[15px] lg:text-[16px]">
          {item.title}
        </h3>
        <p className="body-copy mt-1.5 text-[12.5px] leading-[1.5] text-[#0b1a33]/62 sm:text-[13px]">
          {item.body}
        </p>
      </div>
    </motion.article>
  );
}

function FilmPanel({ film, still, filmAlt = "" }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.2 });

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion || !film) return undefined;
    if (inView) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
    return undefined;
  }, [inView, reduceMotion, film]);

  if (!film && !still) return null;

  return (
    <motion.div
      ref={wrapRef}
      variants={fade}
      className="relative h-full min-h-0 overflow-hidden rounded-none bg-[#0b1a33]"
    >
      {still ? (
        <Image
          src={still}
          alt={filmAlt}
          fill
          sizes="(min-width: 768px) 30vw, 100vw"
          className="object-cover object-center"
        />
      ) : null}
      {!reduceMotion && film ? (
        <video
          ref={videoRef}
          src={film}
          muted
          playsInline
          loop
          preload="auto"
          aria-label={filmAlt || "Karmo mattress film"}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
    </motion.div>
  );
}

export default function DivisionShapeGrid({
  className = "mb-1.5",
  background,
  highlights = [],
  spotlight,
  certifications = [],
  film,
  still,
  filmAlt = "",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const bg =
    background || "/karmo/images/mattress/mosaic-karmo-pattern.jpg";

  const primary = highlights[0];
  const pair = highlights.slice(1, 3);
  const hasFilm = Boolean(film || still);

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={bg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-55"
          priority={false}
        />
        <span className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white/70" />
      </div>

      <div className="shell-home-two relative z-[1] py-5 sm:py-6 lg:py-7">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid w-full grid-cols-1 gap-[6px] md:h-[min(78svh,820px)] md:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] md:grid-rows-1"
        >
          <div className="grid h-[560px] grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)] gap-[6px] md:h-full">
            <ClaimPanel item={primary} />
            <ClaimsPairPanel items={pair} />
            <SpotlightPanel data={spotlight} />
          </div>

          <div className="grid h-[560px] grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2.4fr)] gap-[6px] md:h-full">
            {certifications.slice(0, 2).map((item) => (
              <CertCard key={item.id} item={item} />
            ))}
            {hasFilm ? (
              <FilmPanel film={film} still={still} filmAlt={filmAlt} />
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
