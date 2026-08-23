"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Division product page — Design B (theme only, Karmo site language):
 * Design A copy (badge + CTAs), center-aligned over full background — no side
 * product image, no carousel. Then homepage trust icons → product grid.
 */

const TRUST = [
  {
    src: "/karmo/images/trust/v2/legacy-60.png",
    title: "A legacy of 60 years",
    note: "of healthy sleep",
    scale: 1,
  },
  {
    src: "/karmo/images/trust/v2/trusted.png",
    title: "Trusted By Million",
    note: "families worldwide.",
    scale: 0.82,
  },
  {
    src: "/karmo/images/trust/v2/recognised.png",
    title: "Recognised By",
    note: "Super Brand",
    scale: 0.82,
  },
  {
    src: "/karmo/images/trust/v2/natural.png",
    title: "Natural and",
    note: "Sustainable Products",
    scale: 1,
  },
  {
    src: "/karmo/images/trust/v2/free-delivery.png",
    title: "Free Delivery",
    note: "Available",
    scale: 1,
  },
  {
    src: "/karmo/images/trust/v2/stores.png?v=p8IJawpehw",
    title: "5k+ Stores",
    note: "Pan Bangladesh",
    scale: 1,
  },
];

const ORANGE = "#FF9A1F";
const ACCENT = "#FF9A1F";
const VIEW_H = "h-[calc(100svh-112px+5px)] min-h-[calc(100svh-112px+5px)]";

function ProductTile({ item }) {
  const onOffer = Boolean(item.was);

  return (
    <motion.div variants={fade} className="group flex h-full flex-col overflow-hidden bg-white">
      <div className="relative aspect-square overflow-hidden bg-ink/5">
        <Image
          src={item.image}
          alt={item.alt || item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {onOffer && (
          <span className="absolute left-4 top-4 bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center border-t border-ink/5 bg-ink/[0.015] px-5 pb-5 pt-4 text-center lg:px-6">
        <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
          {item.name}
        </h3>

        <p className="mt-2 flex items-baseline justify-center gap-3 leading-none">
          {item.was && (
            <s className="text-[14px] tabular-nums text-ink/40">{item.was}</s>
          )}
          <span className="text-[19px] font-bold tabular-nums text-ink">
            {item.now}
          </span>
        </p>

        <p className="mb-3.5 mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#2F9E44]" />
          In stock
        </p>

        <Link
          href="/product-detail"
          className="btn-primary mt-auto inline-flex h-[46px] items-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
        >
          Order Now
        </Link>
      </div>
    </motion.div>
  );
}

export default function DivisionDesignB({ data }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const banner = data?.banner ?? {};
  const badge = banner.badge;
  const eyebrowStart = banner.eyebrowStart || "Bangladesh’s";
  const eyebrowEnd = banner.eyebrowEnd;
  const headline = banner.headline || "Karmo";
  const cta = banner.cta || [];
  const slide = banner.slides?.[0];
  const bg = banner.bg || "/karmo/images/mattress/mattress-sleep-well-bg.jpg";

  const products = data?.products?.items ?? [];
  const headingLead = data?.products?.headingLead || "Hot offer";
  const headingAccent = data?.products?.headingAccent || "for you";
  const eyebrow = data?.products?.eyebrow || "Best price";

  return (
    <div className="bg-white">
      {/* Design A hero scaffold — no carousel */}
      <section className={`relative w-full overflow-hidden bg-ink ${VIEW_H}`}>
        <Image
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55"
        />

        <div className="shell relative z-[1] flex h-full items-center justify-center py-14 text-center">
          <div className="relative mx-auto max-w-[44rem]">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
                {eyebrowStart}
              </span>
              {badge && (
                <Image
                  src={badge.src}
                  alt=""
                  width={badge.width}
                  height={badge.height}
                  className="h-9 w-auto shrink-0 -translate-y-[8%] sm:h-11"
                />
              )}
              {eyebrowEnd ? (
                <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-white sm:text-[15px]">
                  {eyebrowEnd}
                </span>
              ) : null}
            </div>

            <h1 className="display mt-4 text-[clamp(1.95rem,5vw,3.4rem)] font-bold! uppercase leading-[1.05]! tracking-[0.02em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]">
              {headline}
            </h1>

            {(slide?.name || slide?.sub) && (
              <div className="mt-5">
                {slide?.name ? (
                  <p
                    className="display text-[15px] font-bold uppercase leading-tight tracking-[0.14em] sm:text-[16px]"
                    style={{ color: ACCENT }}
                  >
                    {slide.name}
                  </p>
                ) : null}
                {slide?.sub ? (
                  <p className="body-copy mx-auto mt-2 max-w-md text-[14px] leading-[1.55] text-white/85 sm:text-[15.5px]">
                    {slide.sub}
                  </p>
                ) : null}
              </div>
            )}

            {cta.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {cta.map((c) =>
                  c.primary ? (
                    <Link
                      key={`${c.href}-${c.label}`}
                      href={c.href}
                      className="inline-flex h-[48px] items-center gap-2 bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark"
                    >
                      {c.label}
                      <FiArrowRight className="text-[15px]" />
                    </Link>
                  ) : (
                    <Link
                      key={`${c.href}-${c.label}`}
                      href={c.href}
                      className="inline-flex h-[48px] items-center border border-white/45 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-brand hover:bg-brand"
                    >
                      {c.label}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Homepage trust icons */}
      <section className="mb-1 border-b border-ink/8 bg-white md:mb-1.5">
        <motion.ul
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12"
        >
          {TRUST.map(({ src, title, note, scale }, i) => (
            <motion.li
              key={title}
              variants={fade}
              className={`group text-center lg:px-3 xl:px-4 ${
                i === 0 ? "lg:pl-0" : ""
              } ${i === TRUST.length - 1 ? "lg:pr-0" : ""} ${
                i > 0 ? "lg:border-l lg:border-ink/10" : ""
              }`}
            >
              <span className="mx-auto flex h-20 w-20 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem]">
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width={88}
                  height={88}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
                  style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
                />
              </span>
              <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
                {title}
              </h3>
              <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
                {note}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Mattress-page product grid */}
      <section className="scroll-mt-24 bg-white pb-16 pt-6 lg:pb-24 lg:pt-8">
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="shell mb-8 text-center lg:mb-10"
        >
          <motion.div variants={fade}>
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
              {eyebrow}
            </span>
            <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
              {headingLead}{" "}
              <span className="font-bold text-brand">{headingAccent}</span>
            </h2>
            <span
              aria-hidden
              className="mt-6 flex items-center justify-center gap-3"
            >
              <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                  fill={ORANGE}
                />
                <path
                  d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                  stroke="#B4651A"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="shell grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {products.map((item) => (
            <ProductTile key={item.id} item={item} />
          ))}
        </motion.div>

        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="mt-10 text-center lg:mt-12"
        >
          <motion.p variants={fade} className="body-copy text-[14px] text-ink/50">
            Need a custom size?{" "}
            <Link
              href="tel:+8801713483284"
              className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              Call 01713 483 284
            </Link>
            {" · "}
            <Link
              href="/contact"
              className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
            >
              Send a message
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
