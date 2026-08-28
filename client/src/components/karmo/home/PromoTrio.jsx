"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — promo trio.
 *
 * Left feature + right stacked tiles (mattress top, HomeTex bottom).
 */

const VIEW_H =
  "h-auto min-h-0 lg:h-[calc(100svh-80px)] lg:min-h-[calc(100svh-80px)]";
const GAP = "gap-1 md:gap-1.5";

const feature = {
  eyebrow: "Our popular products",
  titleLines: ["Foam seating", "collection"],
  href: "/foam",
  src: "/karmo/images/home-02/promo-trio/feature-left-v2.jpg",
  alt: "Stacked Karmo foam seating blocks with a palm plant in a bright studio",
  cta: "Shop the collection",
};

const side = [
  {
    id: "hometex",
    title: "HomeTex bedding",
    href: "/hometex",
    src: "/karmo/images/home-02/promo-trio/side-top-nVV867gYQD.png",
    alt: "Karmo HomeTex bedding",
    tone: "bg-[#ececec]",
  },
  {
    id: "mattress",
    title: "Mattress range",
    href: "/mattress",
    src: "/karmo/images/home-02/promo-trio/side-bottom-bxxJ1Zj5Y2.png",
    alt: "Karmo mattress range",
    tone: "bg-[#e2e2e2]",
    overlay: true,
  },
];

function SideCard({ item }) {
  const hasImage = Boolean(item.src);

  return (
    <Link
      href={item.href}
      className={`group relative flex h-full min-h-[min(42svh,360px)] flex-col justify-center overflow-hidden px-5 py-6 sm:px-6 lg:min-h-0 lg:px-7 ${item.tone}`}
    >
      {hasImage ? (
        <>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover object-center"
          />
          {item.overlay ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-[#1a1a1a]/12"
            />
          ) : null}
        </>
      ) : null}
      <div className="relative z-10 -translate-y-3 sm:-translate-y-4 lg:-translate-y-5">
        <h3 className="display text-[1.15rem] font-bold uppercase leading-[1.15] tracking-[0.01em] text-ink sm:text-[1.25rem] lg:text-[1.35rem]">
          {item.title}
        </h3>
        <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/35 underline-offset-[5px] transition-colors group-hover:decoration-brand">
          Shop now
        </span>
      </div>
    </Link>
  );
}

export default function PromoTrio() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

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
          <Image
            src={feature.src}
            alt={feature.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-center"
            priority
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-l from-black/20 via-black/10 to-black/[0.04]"
          />
          <Link
            href={feature.href}
            className="group absolute inset-0 z-20 flex flex-col items-end justify-center py-8 pl-6 pr-10 text-right sm:pl-8 sm:pr-14 lg:pl-10 lg:pr-20 xl:pr-24"
          >
            <div className="relative z-20 -translate-y-6 sm:-translate-y-8 lg:-translate-y-10 xl:-translate-y-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                {feature.eyebrow}
              </span>
              <h2 className="display section-heading mt-3 uppercase text-white">
                {feature.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <span className="mt-6 inline-flex h-11 w-fit items-center gap-2 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 group-hover:bg-brand group-hover:text-white sm:h-12 sm:px-7 sm:text-[12px]">
                {feature.cta}
                <FiArrowRight className="text-[14px] transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Right — original layout: mattress top, HomeTex bottom */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className={`grid min-h-0 w-full grid-rows-2 ${GAP}`}
        >
          {side.map((item) => (
            <SideCard key={item.id} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
