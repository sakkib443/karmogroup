"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle } from "@/cms/core";
import { promoBand } from "@/cms/pages/home";

/**
 * Bottom band — HATIL-style three-pane strip for Karmo.
 *
 * Left + middle: one fixed lifestyle pair (no carousel).
 * Left overlays: website order discount.
 * Right rail: EMI + bank partners artwork.
 * Content: Admin → Site content → Home → Discount & EMI band.
 */

const GAP = "gap-1.5";

function OfferPanels({ offer }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-stretch gap-1.5 p-2.5 sm:gap-2.5 sm:p-5 lg:p-6">
      <div className="flex min-w-0 flex-[1.15] flex-col justify-end bg-ink px-2.5 py-2.5 text-white sm:px-4 sm:py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
          {offer.eyebrow}
        </p>
        <p className="display mt-1 text-[11px] font-bold uppercase leading-[1.2] tracking-[0.04em] sm:mt-1.5 sm:text-[13px]">
          {offer.title}
        </p>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-end bg-brand px-2.5 py-2.5 text-white sm:px-4 sm:py-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-[10px]">
          {offer.eyebrow2}
        </p>
        <p className="display mt-0.5 text-[1.35rem] font-bold uppercase leading-none tracking-[0.02em] sm:text-[1.85rem]">
          <CmsText value={offer.big} size={offer.bigSize} />
        </p>
        <p className="display mt-1 text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
          {offer.label}
        </p>
      </div>
    </div>
  );
}

function ImagePane({ pane, priority, offer, hoverLabel }) {
  const image = pane?.image || {};
  return (
    <Link
      href={pane?.href || "#"}
      className="group relative block h-full min-h-[min(48svh,360px)] overflow-hidden md:min-h-0"
    >
      {image.src ? (
        <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            style={imageStyle(image)}
          />
        </span>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent"
      />
      {offer ? <OfferPanels offer={offer} /> : null}
      {!offer && hoverLabel ? (
        <span className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:bottom-6 sm:left-6">
          {hoverLabel}
          <FiArrowUpRight className="text-[13px]" />
        </span>
      ) : null}
    </Link>
  );
}

export default function PartnerPromoBand() {
  const c = useSection("promoBand", promoBand.defaults);
  const reduceMotion = useReducedMotion();
  if (c.hidden) return null;

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
          <ImagePane pane={c.left} priority offer={c.offer} />
          <ImagePane pane={c.right} priority hoverLabel={c.right?.hoverLabel} />
        </div>

        {/* EMI bank partners — original logo artwork, fully visible. */}
        <motion.aside
          variants={fade}
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={VIEWPORT}
          className="relative col-span-full min-h-[min(52svh,360px)] border border-ink/8 bg-white md:min-h-[460px] lg:col-span-1 lg:min-h-[460px] xl:min-h-[500px]"
        >
          {c.emi?.src ? (
            <Image
              src={c.emi.src}
              alt={c.emi.alt || ""}
              fill
              sizes="(min-width: 1280px) 264px, (min-width: 1024px) 248px, 100vw"
              className="object-contain p-4"
              style={imageStyle(c.emi)}
            />
          ) : null}
        </motion.aside>
      </div>
    </section>
  );
}
