"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Bottom band — HATIL-style three-pane strip for Karmo.
 *
 * Left + middle: one fixed lifestyle pair (no carousel).
 * Left overlays: website order 5% discount.
 * Right rail: up to 12 months EMI + bank partners.
 */

const GAP = "gap-1.5";

const leftPane = {
  src: "/karmo/images/home-02/divisions/scandinavian-interior.jpg",
  alt: "A calm Karmo living room with soft seating and natural light",
  href: "/foam",
};

const rightPane = {
  src: "/karmo/images/hero/slide-1-hometex-couple.png",
  alt: "A couple reading on the floor beside a Karmo bed dressed in HomeTex bedding",
  href: "/mattress",
};

function OfferPanels() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-stretch gap-1.5 p-2.5 sm:gap-2.5 sm:p-5 lg:p-6">
      <div className="flex min-w-0 flex-[1.15] flex-col justify-end bg-ink px-2.5 py-2.5 text-white sm:px-4 sm:py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
          Website orders
        </p>
        <p className="display mt-1 text-[11px] font-bold uppercase leading-[1.2] tracking-[0.04em] sm:mt-1.5 sm:text-[13px]">
          Shop online at Karmo
        </p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-end bg-brand px-2.5 py-2.5 text-white sm:px-4 sm:py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-[10px]">
          All products
        </p>
        <p className="display mt-0.5 text-[1.35rem] font-bold uppercase leading-none tracking-[0.02em] sm:text-[1.85rem]">
          5%
        </p>
        <p className="display mt-1 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
          Discount
        </p>
      </div>
    </div>
  );
}

function ImagePane({ pane, priority, showOffer }) {
  return (
    <Link
      href={pane.href}
      className="group relative block h-full min-h-[min(48svh,360px)] overflow-hidden md:min-h-0"
    >
      <Image
        src={pane.src}
        alt={pane.alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 40vw"
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
          showOffer
            ? "object-[center_30%] md:object-center"
            : "object-[center_25%] md:object-center"
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent"
      />
      {showOffer ? <OfferPanels /> : null}
      {!showOffer ? (
        <span className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:bottom-6 sm:left-6">
          View range
          <FiArrowUpRight className="text-[13px]" />
        </span>
      ) : null}
    </Link>
  );
}

export default function PartnerPromoBand() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Website discount and EMI facility"
      className="relative mt-1.5 w-full overflow-hidden bg-white"
    >
      <div
        className={`grid ${GAP} lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_15.5rem] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_16.5rem]`}
      >
        <div
          className={`col-span-full grid min-h-0 ${GAP} md:min-h-[460px] md:grid-cols-2 lg:col-span-2 lg:min-h-[460px] xl:min-h-[500px]`}
        >
          <ImagePane pane={leftPane} priority showOffer />
          <ImagePane pane={rightPane} priority />
        </div>

        {/* EMI bank partners — a single supplied artwork (the "12 months EMI"
            panel with every partner bank's logo) rather than the text cards it
            replaced. `object-contain` so no logo is cropped; the panel keeps
            the same min-height as the two image panes beside it. */}
        <motion.aside
          variants={fade}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="relative col-span-full min-h-[min(52svh,360px)] border border-ink/8 bg-white md:min-h-[460px] lg:col-span-1 lg:min-h-[460px] xl:min-h-[500px]"
        >
          <Image
            src="/karmo/images/home-02/emi-banks-panel.png"
            alt="Up to 12 months EMI available with BRAC Bank, City Bank, MTB, Prime Bank, UCB, One Bank, Jamuna Bank and other partner banks"
            fill
            sizes="(min-width: 1280px) 264px, (min-width: 1024px) 248px, 100vw"
            className="object-contain p-3"
          />
        </motion.aside>
      </div>
    </section>
  );
}
