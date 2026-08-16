"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

const ORANGE = "#FF9A1F";

/**
 * Division product grid — Home 02 Popular Products tile language, shared by
 * every category page. Order Now opens the shared product-detail page. The
 * heading, anchor id and products come from props; the tile, grid and footnote
 * design stay here.
 */
function ProductTile({ item }) {
  const onOffer = Boolean(item.was);

  return (
    <motion.div variants={fade} className="group flex flex-col bg-cream/40">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {onOffer && (
          <span className="absolute left-4 top-4 bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pb-4 pt-3.5 text-center lg:px-6">
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

export default function DivisionProducts({
  eyebrow = "Best price",
  headingLead = "Hot offer",
  headingAccent = "for you",
  offersId = "division-offers",
  items = [],
  categoryId = "all",
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const list =
    categoryId === "all"
      ? items
      : items.filter((p) => p.category === categoryId);

  return (
    <section id={offersId} className="scroll-mt-24 bg-white pb-16 pt-4 lg:pb-24 lg:pt-6">
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
            {headingLead} <span className="font-bold text-brand">{headingAccent}</span>
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

      {list.length === 0 ? (
        <p className="shell text-center text-[14px] text-ink/50">
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
          className="shell grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {list.map((item) => (
            <ProductTile key={item.id} item={item} />
          ))}
        </motion.div>
      )}

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
  );
}
