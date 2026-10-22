"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import OverlayHeroSlider from "@/components/karmo/OverlayHeroSlider";
import MediaAdsGrid from "@/components/karmo/media/MediaAdsGrid";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { mediaNav } from "@/data/media";

/** Story tiles: big on the left, a wide one top right, two small under it. */
const TILE = [
  "col-span-2 aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  "col-span-2 aspect-[16/9] lg:aspect-auto",
  "aspect-square lg:aspect-auto",
  "aspect-square lg:aspect-auto",
];

/** The three Media Center pages as tabs, the homepage's quiet uppercase with a brand rule. */
function MediaTabs({ current }) {
  return (
    <nav aria-label="Media Center sections" className="shrink-0 border-b border-ink/8 bg-white">
      <div className="shell flex items-center justify-center gap-6 sm:gap-10">
        {mediaNav.map((item) => {
          const active = item.href === current;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:py-5 sm:text-[12px] ${
                active ? "text-brand" : "text-ink/55 hover:text-ink"
              }`}
            >
              {item.name}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-[2px] origin-left bg-brand transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** One story: the picture fills the tile, tag on top, title (and a line on the big one) at the foot. */
function StoryTile({ item, index }) {
  const big = index === 0;
  return (
    <motion.li variants={fade} className={`group relative overflow-hidden bg-ink ${TILE[index] || TILE[3]}`}>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <span className="absolute top-4 left-4 bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white lg:top-5 lg:left-5">
        {item.tag}
      </span>
      <div className={`absolute inset-x-4 bottom-4 text-white ${big ? "lg:inset-x-8 lg:bottom-8" : "lg:inset-x-5 lg:bottom-5"}`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{item.date}</span>
        <h3
          className={`display mt-1.5 font-semibold uppercase leading-[1.15] tracking-[0.02em] ${
            big ? "text-[clamp(1.25rem,0.9rem+1.4vw,2.2rem)]" : "text-[clamp(0.95rem,0.8rem+0.5vw,1.25rem)]"
          }`}
        >
          {item.title}
        </h3>
        {big ? <p className="body-copy mt-2 max-w-lg text-[14px] leading-[1.6] text-white/75">{item.excerpt}</p> : null}
      </div>
    </motion.li>
  );
}

/**
 * Shared Media Center page, built from the homepage's pieces: its hero slider
 * as the cover, then the tabs and the stories as one screen of pictures with
 * 6px gutters (or the reels on Karmo Ads), and its how-to-order + contact band.
 */
export default function MediaPage({ page }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const reels = page.layout === "reels";

  return (
    <>
      <OverlayHeroSlider
        slides={page.slides}
        asHero
        size="viewport"
        firstSlideMs={5200}
        autoplayMs={4500}
        fadeDuration={1.25}
        className="mb-0"
      />

      {reels ? (
        <>
          <MediaTabs current={page.path} />
          <MediaAdsGrid />
        </>
      ) : (
        <section className="flex flex-col bg-white lg:h-[calc(100svh-112px)]" aria-label={page.title}>
          <MediaTabs current={page.path} />
          <motion.ul
            variants={group}
            {...reveal}
            viewport={VIEWPORT}
            className="grid min-h-0 flex-1 grid-cols-2 gap-[6px] p-[6px] lg:grid-cols-4 lg:grid-rows-2"
          >
            {page.items.map((item, i) => (
              <StoryTile key={item.id} item={item} index={i} />
            ))}
          </motion.ul>
        </section>
      )}

      <div className="mt-1.5">
        <OrderAndContact textureSlides />
      </div>
    </>
  );
}
