"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import TextureSlides from "@/components/karmo/home/TextureSlides";

/**
 * "Our mattress brands" as a reel band — the same shell as the home page's
 * Films band (Reels.jsx): copy on the left, a continuously scrolling strip on
 * the right. Each tile is one Karmo brand: its logo on a white cap, its film
 * playing underneath, the whole tile linking to that range.
 *
 * Driven by `brochureBrands` with `layout: "reels"` (mattress division).
 */

const DESKTOP_H = "calc(100svh - 32px)";
const GAP_PX = 6;

function BrandTile({ item, active }) {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  const onScreen = useInView(tileRef, { amount: 0.15, margin: "60px 0px" });
  const shouldPlay = active && onScreen && !!item.video;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;
    if (shouldPlay) {
      const play = node.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    } else {
      node.pause();
    }
    return undefined;
  }, [shouldPlay, item.video]);

  return (
    <Link
      ref={tileRef}
      href={item.href}
      aria-label={item.alt}
      /* The marquee's second copy is only there for the seamless loop. */
      tabIndex={item.ghost ? -1 : undefined}
      aria-hidden={item.ghost || undefined}
      className="group relative block h-full min-h-0 w-full overflow-hidden bg-white"
    >
      {/* Film — a soft, faded backdrop: heavily blurred and low opacity on
          white, so only the logo reads. Hover brings it a little closer. The
          slight scale hides the blur's soft edge. */}
      <span className="absolute inset-0" aria-hidden>
        {item.video ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster || undefined}
            loop
            muted
            playsInline
            autoPlay={shouldPlay}
            preload="metadata"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full scale-[1.12] object-cover opacity-35 blur-[6px] transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-55 group-hover:blur-[3px]"
          />
        ) : null}
        {/* White wash, brightest behind the logo */}
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.42)_55%,rgba(255,255,255,0.18)_100%)]" />
      </span>

      {/* Logo — dead centre */}
      <span className="absolute inset-0 z-[1] flex items-center justify-center px-[12%]">
        <span className="relative block h-[30%] w-full">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 22vw, 60vw"
            className="object-contain object-center drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)] transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 z-[1] flex items-center justify-between p-4 sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 group-hover:text-ink sm:text-[11px]">
          {item.label || "View range"}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <FiArrowUpRight className="text-[14px]" />
        </span>
      </span>
    </Link>
  );
}

export default function MattressBrandReels({
  heading = "Our mattress brands",
  eyebrow = "Karmo",
  eyebrowNote = "Mattress brands",
  titleLine1 = "Our mattress",
  titleLine2 = "brands",
  kicker,
  body,
  link,
  items = [],
}) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { amount: 0.2 });

  /* Two copies for a seamless -50% loop. */
  const loopItems = useMemo(
    () => [
      ...items.map((it) => ({ ...it, key: `${it.id}-a` })),
      ...items.map((it) => ({ ...it, key: `${it.id}-b`, ghost: true })),
    ],
    [items],
  );

  if (!items.length) return null;

  return (
    <section
      id="our-mattress-brands"
      ref={sectionRef}
      className="reels-editorials relative mb-1.5 overflow-x-clip bg-white py-10 lg:overflow-visible lg:py-0"
      style={{ ["--reels-h"]: DESKTOP_H }}
      aria-label={heading}
    >
      <TextureSlides lighter />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] grid items-center gap-8 px-6 md:px-14 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.85fr)] lg:h-full lg:min-h-0 lg:items-stretch lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))] lg:pr-0 xl:gap-10"
      >
        {/* Left — copy */}
        <motion.div
          variants={fade}
          {...reveal}
          viewport={VIEWPORT}
          className="min-w-0 max-w-md self-center text-left lg:max-w-[28rem]"
        >
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              {eyebrow}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              {eyebrowNote}
            </span>
          </p>

          <h2 className="display section-heading title-card-line mt-3 uppercase text-ink">
            <span className="block sm:whitespace-nowrap">{titleLine1}</span>
            <span className="block text-brand sm:whitespace-nowrap">{titleLine2}</span>
          </h2>

          {kicker ? (
            <span className="mt-4 flex items-center gap-3">
              <span className="h-px w-10 shrink-0 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
                {kicker}
              </span>
            </span>
          ) : null}

          {body ? (
            <p className="body-copy mt-5 text-[16px] leading-[1.7] text-ink/55 lg:text-[17px]">
              {body}
            </p>
          ) : null}

          {link?.label ? (
            <Link href={link.href || "#"} className="group mt-8 inline-flex items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
                {link.label}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <FiArrowUpRight />
              </span>
            </Link>
          ) : null}
        </motion.div>

        {/* Right — brand reels, continuous marquee (pauses on hover) */}
        <div
          className="relative h-[min(70svh,560px)] min-h-0 w-full overflow-hidden lg:h-full"
          style={{ containerType: "inline-size" }}
        >
          {reduceMotion ? (
            <div className="flex h-full w-full overflow-x-auto" style={{ gap: GAP_PX }}>
              {items.map((item) => (
                <div key={item.id} className="h-full w-[calc((100cqw-6px)/1.6)] shrink-0 lg:w-[calc((100cqw-12px)/3)]">
                  <BrandTile item={item} active={false} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="reels-marquee-track flex h-full w-max hover:[animation-play-state:paused]"
              style={{ gap: GAP_PX }}
            >
              {loopItems.map((item) => (
                <div
                  key={item.key}
                  className="h-full w-[calc((100cqw-6px)/1.6)] shrink-0 lg:w-[calc((100cqw-12px)/3)]"
                >
                  <BrandTile item={item} active={sectionInView} />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
