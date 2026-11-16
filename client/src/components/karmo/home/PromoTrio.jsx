"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { useSection, CmsText } from "@/cms/CmsProvider";
import { imageStyle, overlayStyle } from "@/cms/core";
import { promo } from "@/cms/pages/home";

/**
 * Home Two — promo trio.
 *
 * Left feature + right stacked tiles. Content: Admin → Site content → Home →
 * Popular products.
 */

const VIEW_H =
  "h-auto min-h-0 lg:h-[calc(100svh-48px)] lg:min-h-[calc(100svh-48px)]";
const GAP = "gap-1 md:gap-1.5";
const TONES = ["bg-[#ececec]", "bg-[#e2e2e2]"];

function SideCard({ item, tone }) {
  const image = item.image || {};

  return (
    <Link
      href={item.href || "#"}
      className={`group relative flex h-full min-h-[min(42svh,360px)] flex-col justify-center overflow-hidden px-5 py-6 sm:px-6 lg:min-h-0 lg:px-7 ${tone}`}
    >
      {image.src ? (
        <>
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover object-center"
            style={imageStyle(image)}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={overlayStyle(item.overlay)} />
        </>
      ) : null}
      <div className="relative z-10 -translate-y-3 sm:-translate-y-4 lg:-translate-y-5">
        <h3 className="display text-[1.15rem] font-bold uppercase leading-[1.15] tracking-[0.01em] text-white sm:text-[1.25rem] lg:text-[1.35rem]">
          <CmsText value={item.title} size={item.titleSize} />
        </h3>
        {item.cta ? (
          <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/50 underline-offset-[5px] transition-colors group-hover:decoration-brand">
            {item.cta}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export default function PromoTrio() {
  const c = useSection("promo", promo.defaults);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  if (c.hidden) return null;
  const feature = c.feature || {};
  const fImage = feature.image || {};

  return (
    <section
      data-home-two-snap
      className="relative z-10 mt-1.5 w-full max-w-none bg-white pb-1.5"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className={`grid w-full grid-cols-1 bg-white lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] ${GAP} ${VIEW_H}`}
      >
        {/* Left — popular products feature */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="relative min-h-[min(48svh,400px)] w-full overflow-hidden bg-[#f3f3f3] lg:min-h-0 lg:h-full"
        >
          {fImage.src ? (
            <Image
              src={fImage.src}
              alt={fImage.alt || ""}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              style={imageStyle(fImage)}
            />
          ) : null}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1]"
            style={overlayStyle(feature.overlay)}
          />
          <Link
            href={feature.button?.href || "#"}
            className="group absolute inset-0 z-20 flex flex-col items-end justify-start pt-8 pl-6 pr-6 text-right sm:pt-10 sm:pl-8 sm:pr-8 lg:pt-12 lg:pl-10 lg:pr-10 xl:pt-14 xl:pr-12"
          >
            <div className="relative z-20 w-[min(22rem,40%)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                {feature.eyebrow}
              </span>
              <h2 className="display section-heading title-card-line mt-2.5 uppercase text-white">
                <CmsText as="span" className="block" value={feature.line1} size={feature.line1Size} />
                <CmsText as="span" className="block" value={feature.line2} size={feature.line1Size} />
              </h2>
            </div>
          </Link>
        </motion.div>

        {/* Right — two stacked tiles */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className={`grid min-h-0 w-full grid-rows-2 ${GAP}`}
        >
          {(c.side || []).slice(0, 2).map((item, i) => (
            <SideCard key={`${i}-${item.title}`} item={item} tone={TONES[i] || TONES[0]} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
