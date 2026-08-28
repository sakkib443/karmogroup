"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const ORANGE = "#FF9A1F";

const SIZE_OPTIONS = [
  {
    id: "Single",
    label: "Single",
    icon: "/karmo/images/trust/cartoon-v3/size-single.png?v=d44348",
  },
  {
    id: "Double",
    label: "Double",
    icon: "/karmo/images/trust/cartoon-v3/size-double.png?v=d44348",
  },
  {
    id: "Queen",
    label: "Queen",
    icon: "/karmo/images/trust/cartoon-v3/size-queen.png?v=d44348",
  },
  {
    id: "King",
    label: "King",
    icon: "/karmo/images/trust/cartoon-v3/size-king.png?v=d44348",
  },
];

/**
 * Division product grid — shared by every category page.
 * Mattress uses `variant="catalogue"` (reference-style offer cards).
 */

function discountPct(was, now) {
  const a = Number(String(was).replace(/[^\d]/g, ""));
  const b = Number(String(now).replace(/[^\d]/g, ""));
  if (!a || !b || b >= a) return null;
  return Math.round(((a - b) / a) * 100);
}

function Stars({ value = 4.8 }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
          <path
            d="M12 2.6 14.9 9l6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.8l1.6-6.7L2.2 9.6 9.1 9 12 2.6Z"
            fill={i < Math.round(value) ? ORANGE : "#D6D3CE"}
          />
        </svg>
      ))}
    </span>
  );
}

/** Simple tile — foam / chemicals / hometex. */
function ProductTile({ item, detailHref }) {
  const onOffer = Boolean(item.was);
  const hoverSrc = item.imageHover;
  const href = item.href || detailHref || null;

  const media = (
    <div className="relative aspect-square overflow-hidden">
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-[transform,opacity] duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
          hoverSrc ? "opacity-100 group-hover:opacity-0" : ""
        }`}
      />
      {hoverSrc && (
        <Image
          src={hoverSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          aria-hidden
          className="object-cover opacity-0 transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-100"
        />
      )}
      {onOffer && (
        <span className="absolute left-4 top-4 z-[1] bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
          Sale
        </span>
      )}
    </div>
  );

  return (
    <motion.div variants={fade} className="group flex flex-col bg-white/90 backdrop-blur-[2px]">
      {href ? (
        <Link href={href} className="block focus-visible:outline-none">
          {media}
        </Link>
      ) : (
        media
      )}

      <div className="flex flex-1 flex-col items-center px-5 pb-4 pt-3.5 text-center lg:px-6">
        <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
          {href ? (
            <Link href={href} className="hover:text-brand">
              {item.name}
            </Link>
          ) : (
            item.name
          )}
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
          href={href || "/contact"}
          className="btn-primary mt-auto inline-flex h-[46px] items-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
        >
          {href ? "Order Now" : "Enquire"}
        </Link>
      </div>
    </motion.div>
  );
}

/** 3D float offer card — raised product, center-aligned info stack. */
function MattressFloatCard({ item }) {
  const href = item.href || "/mattress";
  const [size, setSize] = useState(item.defaultSize || "Queen");
  const pct = discountPct(item.was, item.now);
  const rating = item.rating ?? 4.8;
  const reviews = item.reviews ?? 120;
  const specs = item.specs || [];
  const src = item.image3d || item.image;

  return (
    <motion.article
      variants={fade}
      className="group relative z-[2] flex h-full flex-col pt-[5.5rem] sm:pt-[5.75rem]"
    >
      <div className="relative flex h-full flex-col overflow-visible rounded-sm bg-white px-4 pb-4 pt-[7.75rem] text-center shadow-[0_18px_48px_rgba(11,26,51,0.14),0_2px_8px_rgba(11,26,51,0.06)] ring-1 ring-ink/[0.06] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_26px_58px_rgba(11,26,51,0.18)] sm:px-5 sm:pb-5 sm:pt-[9.25rem]">
        <Link
          href={href}
          className="absolute inset-x-0 top-0 z-[3] -translate-y-[52%] px-1 focus-visible:outline-none sm:-translate-y-[54%] sm:px-2"
          aria-label={item.name}
        >
          <span className="relative mx-auto block aspect-[5/4] w-[104%] max-w-[420px] -translate-x-[2%]">
            <Image
              src={src}
              alt={item.alt || item.name}
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 92vw"
              className="object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </span>
        </Link>

        <div className="mx-auto flex w-full max-w-[20rem] flex-1 flex-col items-center">
          {item.badge ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              {item.badge}
            </span>
          ) : null}

          <h3 className="mt-2 text-[1.05rem] font-bold leading-snug tracking-tight text-ink sm:text-[1.15rem]">
            <Link href={href} className="transition-colors hover:text-brand">
              Karmo {item.name}
            </Link>
          </h3>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-ink/65">
            <Stars value={rating} />
            <span className="font-semibold tabular-nums text-ink">
              {rating.toFixed(1)}
            </span>
            <span className="text-ink/25">·</span>
            <span className="tabular-nums">{reviews} reviews</span>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-ink/55">
            {item.line}
          </p>

          {specs.length > 0 || item.thickness ? (
            <p className="mt-2 text-[11px] font-medium leading-snug tracking-[0.01em] text-ink/40">
              {[item.thickness ? `${item.thickness} thick` : null, ...specs]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-2.5">
              <span className="text-[1.35rem] font-bold tabular-nums leading-none text-brand sm:text-[1.5rem]">
                {item.now}
              </span>
              {item.was ? (
                <s className="text-[13px] tabular-nums text-ink/35">{item.was}</s>
              ) : null}
            </div>
            {pct != null ? (
              <span
                className="mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white"
                style={{ backgroundColor: ORANGE }}
              >
                Save {pct}%
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid w-full grid-cols-4 gap-1.5">
            {SIZE_OPTIONS.map((opt) => {
              const on = size === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSize(opt.id)}
                  aria-pressed={on}
                  aria-label={opt.label}
                  title={opt.label}
                  className={
                    "flex flex-col items-center gap-0.5 border px-0.5 py-1.5 transition-colors duration-300 " +
                    (on
                      ? "border-brand bg-brand/[0.05]"
                      : "border-ink/10 hover:border-ink/25")
                  }
                >
                  <img
                    src={opt.icon}
                    alt=""
                    aria-hidden
                    width={28}
                    height={28}
                    className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                  />
                  <span
                    className={
                      "text-[7.5px] font-bold uppercase tracking-[0.05em] " +
                      (on ? "text-brand" : "text-ink/45")
                    }
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto w-full pt-5">
            <Link
              href={href}
              className="group/cta inline-flex h-11 w-full items-center justify-center gap-2.5 bg-brand text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-brand-dark"
            >
              <img
                src="/karmo/images/trust/order-cartoon/cart.png?v=d44348"
                alt=""
                aria-hidden
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain transition-transform duration-300 group-hover/cta:scale-110"
              />
              <span>Order Now</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** Mattress catalogue card — rating, specs, cartoon sizes. */
function MattressCatalogueCard({ item }) {
  const href = item.href || "/mattress";
  const [size, setSize] = useState(item.defaultSize || "Queen");
  const pct = discountPct(item.was, item.now);
  const rating = item.rating ?? 4.8;
  const reviews = item.reviews ?? 120;
  const specs = item.specs || [];
  const badge = item.badge;
  const hoverSrc = item.imageHover;

  return (
    <motion.article
      variants={fade}
      className="group flex h-full flex-col overflow-hidden bg-white shadow-[0_1px_8px_rgba(11,26,51,0.08)]"
    >
      <Link
        href={href}
        className="relative block aspect-[5/4] shrink-0 overflow-hidden bg-[#F4F6F8] focus-visible:outline-none"
      >
        <Image
          src={item.image}
          alt={item.alt || item.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover object-center transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] ${
            hoverSrc ? "opacity-100 group-hover:opacity-0" : ""
          }`}
        />
        {hoverSrc ? (
          <Image
            src={hoverSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            aria-hidden
            className="object-contain object-center opacity-0 transition-[transform,opacity] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
          />
        ) : null}
        {badge ? (
          <span className="absolute left-2.5 top-2.5 z-[2] bg-[#0b1a33] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white transition-opacity duration-300 group-hover:opacity-0">
            {badge}
          </span>
        ) : null}
      </Link>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3.5 pt-3 sm:px-3.5">
        <h3 className="text-[16px] font-bold leading-snug text-ink sm:text-[17px]">
          <Link href={href} className="transition-colors hover:text-brand">
            Karmo {item.name}
          </Link>
        </h3>

        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-ink/70">
              <Stars value={rating} />
              <span className="font-semibold tabular-nums text-ink">{rating.toFixed(1)}</span>
              <span className="text-ink/30">|</span>
              <span>({reviews})</span>
            </div>
            {item.thickness ? (
              <p className="mt-1.5 text-[11px] font-medium text-ink/45">
                Available in {item.thickness}
              </p>
            ) : null}
            <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-ink/55 sm:text-[12px]">
              {specs.length > 0 ? specs.join(" · ") : item.line}
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-end justify-start text-right">
            <span className="text-[18px] font-bold tabular-nums leading-none text-brand sm:text-[20px]">
              {item.now}
            </span>
            {item.was ? (
              <s className="mt-1 text-[12px] tabular-nums text-ink/40">{item.was}</s>
            ) : null}
            {pct != null ? (
              <span
                className="mt-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-white"
                style={{ backgroundColor: ORANGE }}
              >
                {pct}% off
              </span>
            ) : null}
          </div>
        </div>

        {/* Cartoon size icons — same language as homepage trust strip */}
        <div className="mt-3 grid grid-cols-4 gap-1">
          {SIZE_OPTIONS.map((opt) => {
            const on = size === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSize(opt.id)}
                aria-pressed={on}
                aria-label={opt.label}
                title={opt.label}
                className={`flex flex-col items-center gap-0.5 border px-0.5 py-1 transition-colors duration-300 ${
                  on
                    ? "border-brand bg-brand/[0.04]"
                    : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <img
                  src={opt.icon}
                  alt=""
                  aria-hidden
                  width={28}
                  height={28}
                  className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                />
                <span
                  className={`text-[7.5px] font-bold uppercase tracking-[0.05em] ${
                    on ? "text-brand" : "text-ink/45"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-3.5">
          <Link
            href={href}
            className="group/cta inline-flex h-11 w-full items-center justify-center gap-2.5 bg-brand text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-brand-dark"
          >
            <img
              src="/karmo/images/trust/order-cartoon/cart.png?v=d44348"
              alt=""
              aria-hidden
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain transition-transform duration-300 group-hover/cta:scale-110"
            />
            <span>Order Now</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 group-hover/cta:translate-x-0.5"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function DivisionProducts({
  eyebrow = "Best price",
  headingLead = "Hot offer",
  headingAccent = "for you",
  body = "Explore the range — tested comfort, lasting support, priced for every home.",
  offersId = "division-offers",
  items = [],
  categoryId = "all",
  detailHref,
  textured = false,
  /** `catalogue` = mattress-style offer cards. */
  variant = "default",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const catalogue = variant === "catalogue";

  const list =
    categoryId === "all"
      ? items
      : items.filter((p) => p.category === categoryId);

  const hasFloatCard =
    catalogue && list.some((p) => p.cardStyle === "float3d");

  return (
    <section
      id={offersId}
      className={`relative scroll-mt-[7.5rem] bg-white pb-16 pt-4 lg:pb-24 lg:pt-6 ${
        catalogue ? "overflow-x-clip overflow-y-visible" : "overflow-hidden"
      }`}
    >
      {textured && !hasFloatCard ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <Image
            src="/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-[0.38]"
            priority={false}
          />
          <span className="absolute inset-0 bg-white/55" />
        </div>
      ) : null}

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[1] mb-8 text-center lg:mb-10"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            {eyebrow}
          </span>
          <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            {headingLead}{" "}
            <span className="font-bold text-brand">{headingAccent}</span>
          </h2>
          {body ? (
            <p className="body-copy mx-auto mt-4 max-w-2xl text-[14px] leading-[1.65] text-ink/60 sm:text-[15px]">
              {body}
            </p>
          ) : null}
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

      {list.length === 0 ? (
        <p className="shell relative z-[1] text-center text-[14px] text-ink/50">
          No products in this category yet.{" "}
          <Link href="/contact" className="font-semibold text-brand underline">
            Contact us
          </Link>{" "}
          for sizes and pricing.
        </p>
      ) : (
        <motion.div
          key={categoryId}
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className={
            catalogue
              ? "relative z-[1] mx-auto grid w-full max-w-[1520px] grid-cols-1 items-stretch gap-5 px-5 pt-6 sm:grid-cols-2 sm:gap-6 sm:pt-8 md:px-8 lg:grid-cols-3 lg:gap-7 lg:px-10 lg:pt-10"
              : "relative z-[1] mx-auto grid w-full max-w-[1760px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 sm:gap-6 md:px-10 lg:grid-cols-4 lg:gap-8 lg:px-12"
          }
        >
          {list.map((item) =>
            catalogue ? (
              item.cardStyle === "float3d" ? (
                <MattressFloatCard key={item.id} item={item} />
              ) : (
                <MattressCatalogueCard key={item.id} item={item} />
              )
            ) : (
              <ProductTile key={item.id} item={item} detailHref={detailHref} />
            ),
          )}
        </motion.div>
      )}

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] mt-10 text-center lg:mt-12"
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
  );
}
