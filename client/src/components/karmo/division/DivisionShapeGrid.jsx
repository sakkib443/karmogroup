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

function CoilsIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect x="5" y="6" width="6.2" height="20" rx="3.1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="12.9" y="6" width="6.2" height="20" rx="3.1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="20.8" y="6" width="6.2" height="20" rx="3.1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.1 10.2c1.6 0 1.6 2.2 0 2.2s-1.6 2.2 0 2.2 1.6 2.2 0 2.2M16 10.2c1.6 0 1.6 2.2 0 2.2s-1.6 2.2 0 2.2 1.6 2.2 0 2.2M23.9 10.2c1.6 0 1.6 2.2 0 2.2s-1.6 2.2 0 2.2 1.6 2.2 0 2.2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PulseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path
        d="M4 17h5l2.2-6 3.2 12 2.6-8.5H28"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M23.5 8.4v3.2M21.9 10h3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClaimGlyph({ id, className = "" }) {
  if (id === "coils") return <CoilsIcon className={className} />;
  if (id === "pulse") return <PulseIcon className={className} />;
  const Icon = CLAIM_ICONS[id] || TbShieldCheck;
  return <Icon className={className} aria-hidden />;
}

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
          : `min-h-[220px] md:min-h-0 ${NAVY}`
      }`}
    >
      {item.background && !solid ? (
        <>
          <Image
            src={item.background}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
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

/* ——— Two claims: stacked on mobile, side-by-side from md ——— */
function ClaimsPairPanel({ items = [] }) {
  if (!items.length) return null;

  return (
    <motion.article
      variants={fade}
      className={`grid grid-cols-1 gap-0 md:grid-cols-2 ${NAVY}`}
    >
      {items.map((item, i) => {
        const Icon = CLAIM_ICONS[item.icon] || TbShieldCheck;
        const badge = BADGE[item.badge] || BADGE.blue;
        return (
          <div
            key={item.id}
            className={`flex min-h-[200px] flex-col justify-center px-5 py-5 sm:px-5 sm:py-6 md:min-h-0 ${
              i > 0
                ? "border-t border-white/15 md:border-l md:border-t-0"
                : ""
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
      className="relative col-span-1 min-h-[240px] overflow-hidden rounded-none bg-[#dfe7ef] md:col-span-2 md:min-h-0"
    >
      <Image
        src={data.image}
        alt={data.alt || ""}
        fill
        sizes="(min-width: 768px) 55vw, 100vw"
        className="object-cover object-[center_40%]"
        priority={false}
      />
      {data.overlay && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
      <div className="relative z-[1] flex h-full items-center justify-end px-6 py-6 sm:px-8 lg:px-10">
        <div className="max-w-[16rem] text-right sm:max-w-[18rem] lg:max-w-[20rem]">
          <h3 className="display section-heading title-card-line uppercase text-[#0b1a33]">
            {data.headingLead}{" "}
            {data.headingAccent ? (
              <span className="italic text-[#0b1a33]/80">
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

function InsideIntroCard({ heading, accent, body }) {
  return (
    <motion.article
      variants={fade}
      className={`flex flex-col justify-center px-5 py-5 sm:px-6 sm:py-6 ${LIGHT}`}
    >
      <h2 className="display section-heading title-card-line uppercase text-[#0b1a33]">
        {heading}{" "}
        {accent ? <span className="text-brand">{accent}</span> : null}
      </h2>
      {body ? (
        <p className="body-copy mt-2.5 text-[12.5px] leading-[1.5] text-[#0b1a33]/62 sm:text-[13px]">
          {body}
        </p>
      ) : null}
    </motion.article>
  );
}

function InsideLayersCard({ layers = [] }) {
  if (!layers.length) return null;

  return (
    <motion.article
      variants={fade}
      className={`flex min-h-0 flex-col justify-center overflow-hidden px-5 py-4 sm:px-6 sm:py-5 ${LIGHT}`}
    >
      <ol className="flex flex-col gap-2 sm:gap-2.5">
        {layers.map((layer, i) => (
          <li key={layer.id} className="flex gap-3">
            <span className="display w-6 shrink-0 text-[11px] font-semibold text-brand sm:text-[12px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="display block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0b1a33] sm:text-[12px]">
                {layer.name}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[#0b1a33]/55 sm:text-[12px]">
                {layer.line}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </motion.article>
  );
}

function InsidePhotoCard({ photo }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.2 });
  const film = photo?.video;
  const startAt = photo?.videoStart ?? 0;

  useEffect(() => {
    const node = videoRef.current;
    if (!node || reduceMotion || !film) return undefined;

    const skipHead = () => {
      if (startAt > 0 && node.currentTime < startAt) {
        node.currentTime = startAt;
      }
    };

    const onEnded = () => {
      if (startAt > 0) node.currentTime = startAt;
      node.play().catch(() => {});
    };

    node.addEventListener("loadedmetadata", skipHead);
    node.addEventListener("playing", skipHead);
    node.addEventListener("timeupdate", skipHead);
    node.addEventListener("ended", onEnded);

    if (inView) {
      skipHead();
      node.play().catch(() => {});
    } else {
      node.pause();
    }

    return () => {
      node.removeEventListener("loadedmetadata", skipHead);
      node.removeEventListener("playing", skipHead);
      node.removeEventListener("timeupdate", skipHead);
      node.removeEventListener("ended", onEnded);
    };
  }, [inView, reduceMotion, film, startAt]);

  if (!photo?.src && !film) return null;

  return (
    <motion.figure
      ref={wrapRef}
      variants={fade}
      className="relative h-full min-h-[220px] overflow-hidden bg-[#efe9e3] md:min-h-0"
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt || ""}
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
          loop={startAt <= 0}
          preload="auto"
          aria-label={photo.alt || ""}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
      {photo.caption ? (
        <figcaption className="absolute bottom-4 left-4 z-[1] bg-white/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0b1a33] sm:bottom-5 sm:left-5 sm:text-[11px]">
          {photo.caption}
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

function FilmPanel({ film, still, filmAlt = "", overlay }) {
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
      {overlay && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
    </motion.div>
  );
}

const SECTION_TYPE = {
  fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

const CARD_TYPE = {
  fontSize: "clamp(1.12rem, 0.96rem + 0.65vw, 1.45rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

const INSIDE_TYPE = {
  fontSize: "clamp(1.05rem, 0.92rem + 0.55vw, 1.32rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

function OrganizedClaim({ item, reveal }) {
  if (!item) return null;
  const Icon = CLAIM_ICONS[item.icon] || TbShieldCheck;
  const badge = BADGE[item.badge] || BADGE.red;

  return (
    <motion.article
      variants={fade}
      {...reveal}
      viewport={VIEWPORT}
      className="relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden bg-[#0b1a33] md:min-h-0"
    >
      {item.background ? (
        <Image
          src={item.background}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-center"
          aria-hidden
        />
      ) : null}
      <span aria-hidden className="absolute inset-0 bg-black/40" />
      <div className="relative z-[1] px-7 py-7 lg:px-8 lg:py-8">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${badge}`}
        >
          <Icon className="text-[24px] text-white" aria-hidden />
        </span>
        <h3
          className="display title-card-line mt-4 uppercase text-white"
          style={CARD_TYPE}
        >
          {item.title}
        </h3>
        <p className="body-copy mt-2.5 max-w-[24rem] text-[13px] leading-[1.6] text-white/80 sm:text-[14px]">
          {item.overview}
        </p>
        <span aria-hidden className="mt-5 h-[3px] w-8 bg-brand" />
      </div>
    </motion.article>
  );
}

function OrganizedPair({ items = [], reveal }) {
  if (!items.length) return null;

  return (
    <motion.article
      variants={fade}
      {...reveal}
      viewport={VIEWPORT}
      className="grid h-full min-h-[200px] grid-cols-1 bg-[#0b1a33] md:min-h-0 md:grid-cols-2"
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`flex min-h-[180px] flex-col justify-center px-6 py-6 md:min-h-0 lg:px-7 lg:py-7 ${
            i > 0 ? "border-t border-white/12 md:border-l md:border-t-0" : ""
          }`}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              BADGE[item.badge] || BADGE.blue
            }`}
          >
            <ClaimGlyph id={item.icon} className="text-[24px] text-white" />
          </span>
          <h3
            className="display title-card-line mt-4 uppercase text-white"
            style={CARD_TYPE}
          >
            {item.title}
          </h3>
          <p className="body-copy mt-2 max-w-[18rem] text-[12px] leading-[1.5] text-white/72 sm:text-[13px]">
            {item.overview}
          </p>
          <span aria-hidden className="mt-4 h-[3px] w-8 bg-brand" />
        </div>
      ))}
    </motion.article>
  );
}

function OrganizedSpotlight({ data, reveal }) {
  if (!data?.image) return null;

  return (
    <motion.article
      variants={fade}
      {...reveal}
      viewport={VIEWPORT}
      className="relative min-h-[260px] overflow-hidden bg-[#f4f0e8] md:min-h-0"
    >
      <Image
        src={data.image}
        alt={data.alt || ""}
        fill
        unoptimized
        sizes="(min-width: 768px) 65vw, 100vw"
        className="object-cover object-left"
        priority={false}
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(11,26,51,0.22) 0%, rgba(11,26,51,0.34) 48%, rgba(11,26,51,0.50) 100%)",
        }}
      />
      <div
        className="relative z-[1] flex h-full px-7 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        style={{ alignItems: "center", justifyContent: "flex-end" }}
      >
        <div style={{ textAlign: "right", transform: "translateY(-14%)" }}>
          <h3
            className="display title-card-line uppercase text-white"
            style={{
              ...SECTION_TYPE,
              whiteSpace: "nowrap",
              fontSize: "clamp(1.28rem, 0.96rem + 1.1vw, 1.85rem)",
            }}
          >
            Designed to {data.headingEnd}
          </h3>
          {data.subline ? (
            <p
              className="body-copy mt-3 max-w-[22rem] text-[13px] leading-[1.6] sm:text-[14px]"
              style={{ color: "rgba(255,255,255,0.8)", marginLeft: "auto" }}
            >
              {data.subline}
            </p>
          ) : null}
          {data.brand ? (
            <p
              className="display mt-4 text-[11px] uppercase tracking-[0.18em] sm:text-[12px]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {data.brand}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function OrganizedLightCard({ item, reveal }) {
  if (!item) return null;

  return (
    <motion.article
      variants={fade}
      {...reveal}
      viewport={VIEWPORT}
      className="flex h-full min-h-[160px] items-center gap-4 bg-[#f7f7f8] px-5 py-4 sm:gap-5 sm:px-6 md:min-h-0"
    >
      <span className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden bg-white text-[#0b1a33] shadow-[0_0_0_1px_rgba(11,26,51,0.08)] sm:h-[80px] sm:w-[80px]">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="80px"
            className="object-contain object-center p-1.5"
          />
        ) : (
          <ClaimGlyph id={item.icon} className="h-10 w-10" />
        )}
      </span>
      <div className="min-w-0">
        <h3
          className="display title-card-line uppercase text-[#0b1a33]"
          style={CARD_TYPE}
        >
          {item.title}
        </h3>
        <p className="body-copy mt-1.5 text-[12.5px] leading-[1.5] text-[#0b1a33]/62 sm:text-[13px]">
          {item.overview}
        </p>
      </div>
    </motion.article>
  );
}

function OrganizedInside({ inside, reveal }) {
  if (!inside) return null;
  const layers = inside.layers || [];
  const pair = inside.pair || [];
  const bg = inside.background;

  return (
    <div className="grid min-h-0 gap-[6px] md:h-full md:grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {pair.length >= 2 ? (
        <div className="grid h-full min-h-0 grid-rows-2 gap-[6px]">
          {pair.slice(0, 2).map((item) => (
            <OrganizedLightCard key={item.id} item={item} reveal={reveal} />
          ))}
        </div>
      ) : (
        <motion.article
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-[#0b1a33] px-6 py-6 lg:px-7 lg:py-7"
        >
          {bg ? (
            <Image
              src={bg}
              alt=""
              fill
              sizes="(min-width: 768px) 32vw, 100vw"
              className="object-cover object-center"
              aria-hidden
            />
          ) : null}
          <span aria-hidden className="absolute inset-0 bg-[#0b1a33]/58" />
          <div className="relative z-[1]">
            <h2
              className="display title-card-line uppercase text-white"
              style={INSIDE_TYPE}
            >
              {inside.heading}{" "}
              {inside.accent ? (
                <span className="text-brand">{inside.accent}</span>
              ) : null}
            </h2>
            {inside.body ? (
              <p className="body-copy mt-2 max-w-[28rem] text-[12px] leading-[1.45] text-white/72 sm:text-[12.5px]">
                {inside.body}
              </p>
            ) : null}
            {layers.length > 0 ? (
              <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:mt-5 sm:gap-x-5">
                {layers.map((layer, i) => (
                  <li key={layer.id} className="flex gap-2">
                    <span
                      className="display w-5 shrink-0 text-[10px] text-brand sm:text-[11px]"
                      style={{
                        fontWeight: 350,
                        fontVariationSettings: '"wght" 350',
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display min-w-0 text-[10.5px] uppercase leading-snug tracking-[0.05em] text-white sm:text-[11.5px]">
                      {layer.name}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </motion.article>
      )}
      <InsidePhotoCard photo={inside.photo} />
    </div>
  );
}

function OrganizedGrid({
  highlights,
  spotlight,
  inside,
  reveal,
}) {
  const primary = highlights[0];
  const pair = highlights.slice(1, 3);

  return (
    <div className="relative z-[1] mx-auto w-full max-w-[1600px] px-5 py-[6px] sm:px-8 lg:px-10">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-1 gap-[6px] md:h-[min(90svh,980px)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
      >
        <div className="grid min-h-0 grid-cols-1 gap-[6px] md:h-full md:grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="grid min-h-0 h-full grid-cols-1 gap-[6px] md:grid-cols-2">
            <OrganizedClaim item={primary} reveal={reveal} />
            <OrganizedPair items={pair} reveal={reveal} />
          </div>
          <OrganizedSpotlight data={spotlight} reveal={reveal} />
        </div>
        <OrganizedInside inside={inside} reveal={reveal} />
      </motion.div>
    </div>
  );
}

function MosaicGrid({
  highlights,
  spotlight,
  inside,
  certifications,
  film,
  still,
  filmAlt,
  filmOverlay,
  hasInside,
  hasFilm,
  reveal,
}) {
  const primary = highlights[0];
  const pair = highlights.slice(1, 3);

  return (
    <div className="relative z-[1] w-full p-[6px]">
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-1 gap-[6px] md:h-[min(90svh,980px)] md:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] md:grid-rows-1"
      >
        <div className="grid grid-cols-1 gap-[6px] md:h-full md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ClaimPanel item={primary} />
          <ClaimsPairPanel items={pair} />
          <SpotlightPanel data={spotlight} />
        </div>

        <div
          className={`grid min-h-0 gap-[6px] md:h-full ${
            hasInside
              ? "grid-rows-none md:grid-rows-[auto_minmax(0,1.5fr)_minmax(0,1.15fr)]"
              : "grid-rows-none md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2.4fr)]"
          }`}
        >
          {hasInside ? (
            <>
              <InsideIntroCard
                heading={inside.heading}
                accent={inside.accent}
                body={inside.body}
              />
              <InsideLayersCard layers={inside.layers} />
              <InsidePhotoCard photo={inside.photo} />
            </>
          ) : (
            <>
              {certifications.slice(0, 2).map((item) => (
                <CertCard key={item.id} item={item} />
              ))}
              {hasFilm ? (
                <div className="h-[min(56svh,440px)] w-full md:h-full md:min-h-0">
                  <FilmPanel film={film} still={still} filmAlt={filmAlt} overlay={filmOverlay} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function DivisionShapeGrid({
  className = "mb-1.5",
  background,
  highlights = [],
  spotlight,
  certifications = [],
  inside,
  film,
  still,
  filmAlt = "",
  filmOverlay = false,
  skin = "mosaic",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const bg =
    background || "/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg";
  const hasInside = Boolean(inside);
  const hasFilm = Boolean(film || still);
  const organized = skin === "organized";

  return (
    <section
      id={hasInside ? "inside-every-karmo" : undefined}
      className={`relative w-full overflow-hidden ${className}`}
    >
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

      {organized && hasInside ? (
        <OrganizedGrid
          highlights={highlights}
          spotlight={spotlight}
          inside={inside}
          reveal={reveal}
        />
      ) : (
        <MosaicGrid
          highlights={highlights}
          spotlight={spotlight}
          inside={inside}
          certifications={certifications}
          film={film}
          still={still}
          filmAlt={filmAlt}
          filmOverlay={filmOverlay}
          hasInside={hasInside}
          hasFilm={hasFilm}
          reveal={reveal}
        />
      )}
    </section>
  );
}
