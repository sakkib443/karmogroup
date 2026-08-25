"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import VideoModal from "@/components/karmo/VideoModal";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home films / shorts band — same shell split as DivisionEditorials
 * (Iconic brands): left copy ~0.72fr, right media ~1.65fr with 3 tiles
 * visible. The film strip scrolls continuously (seamless marquee).
 */

const ORANGE = "#FF9A1F";
const DESKTOP_H = "calc(100svh - 32px)";
const GAP_PX = 6;
/* Exactly 3 tiles fit the viewport; width = (100cqw - 2 gaps) / 3 */
const TILE_W = `calc((100cqw - ${GAP_PX * 2}px) / 3)`;

const films = [
  {
    id: "v1-tisa",
    src: "/karmo/videos/shorts/v1-tisa.mp4",
    title: "Tisa — a quiet moment",
    tag: "Short",
  },
  {
    id: "v2",
    src: "/karmo/videos/shorts/v2.mp4",
    title: "Comfort on camera",
    tag: "Short",
  },
  {
    id: "v3",
    src: "/karmo/videos/shorts/v3.mp4",
    title: "Lived-in rooms",
    tag: "Short",
  },
  {
    id: "v4",
    src: "/karmo/videos/shorts/v4.mp4",
    title: "Soft light, soft rest",
    tag: "Short",
  },
  {
    id: "v5",
    src: "/karmo/videos/shorts/v5.mp4",
    title: "Everyday Karmo",
    tag: "Short",
  },
  {
    id: "tvc-mattress",
    src: "/karmo/videos/tvc-mattress.mp4",
    title: "Karmo Mattress, the commercial",
    tag: "Commercial",
  },
  {
    id: "product-film",
    src: "/karmo/videos/product-film.mp4",
    title: "A room built on Karmo",
    tag: "Interiors",
  },
  {
    id: "reel-4",
    src: "/karmo/videos/reel-4.mp4",
    title: "Pocketed spring array",
    tag: "Inside the product",
  },
  {
    id: "reel-3",
    src: "/karmo/videos/reel-3.mp4",
    title: "Rebound on the quilted top",
    tag: "Inside the product",
  },
  {
    id: "reel-1",
    src: "/karmo/videos/reel-1.mp4",
    title: "CertiGuard germ protection",
    tag: "Certification",
  },
  {
    id: "tvc-foam",
    src: "/karmo/videos/tvc-foam.mp4",
    title: "Karmo Foam, from the archive",
    tag: "Archive",
  },
  {
    id: "sleep-well",
    src: "/karmo/videos/mattress-sleep-well.mp4",
    title: "Sleep well, live well",
    tag: "Lifestyle",
  },
];

function ReelTile({ film, still, onOpen, active }) {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  const onScreen = useInView(tileRef, { amount: 0.15, margin: "60px 0px" });
  const shouldPlay = active && onScreen && !still;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;
    if (shouldPlay) {
      const play = node.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
      return undefined;
    }
    node.pause();
    return undefined;
  }, [shouldPlay, film.src]);

  return (
    <button
      ref={tileRef}
      type="button"
      onClick={(event) => onOpen(film, event.currentTarget)}
      aria-label={`Play ${film.title}`}
      className="group relative h-full min-h-0 w-full overflow-hidden bg-ink text-left"
    >
      <video
        ref={videoRef}
        src={film.src}
        loop
        muted
        playsInline
        autoPlay={shouldPlay}
        preload="metadata"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[rgba(12,14,18,0.12)] transition-colors duration-500 group-hover:bg-[rgba(12,14,18,0.28)]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10 sm:p-3.5 sm:pt-12">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[10px]">
          {film.tag}
        </span>
        <p className="display mt-0.5 line-clamp-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.04em] text-white sm:text-[12px]">
          {film.title}
        </p>
      </div>
    </button>
  );
}

export default function Reels() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { amount: 0.2 });

  const [open, setOpen] = useState(null);
  const openerRef = useRef(null);

  const openFilm = useCallback((film, element) => {
    openerRef.current = element;
    setOpen(film);
  }, []);

  const closeFilm = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus();
  }, []);

  /* Two copies for a seamless -50% loop. */
  const loopFilms = useMemo(
    () => [
      ...films.map((f) => ({ ...f, key: `${f.id}-a` })),
      ...films.map((f) => ({ ...f, key: `${f.id}-b` })),
    ],
    [],
  );

  /* Static fallback when reduced motion: first 3 only. */
  const staticFilms = films.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      data-home-two-snap
      className="reels-editorials relative my-[6px] overflow-x-clip bg-white py-10 lg:overflow-visible lg:py-0"
      style={{ ["--reels-h"]: DESKTOP_H }}
      aria-label="Karmo films"
    >
      {/* Generated foam cell texture — sharp pores, no blur */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <Image
          src="/karmo/images/foam/foam-cell-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.22]"
          priority={false}
        />
        <span className="absolute inset-0 bg-white/62" />
      </div>

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="relative z-[1] grid items-center gap-8 px-6 md:px-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.65fr)] lg:h-full lg:min-h-0 lg:items-stretch lg:gap-8 lg:px-0 lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))] lg:pr-0 xl:gap-10"
      >
        <motion.div
          variants={fade}
          className="min-w-0 max-w-md self-center text-left lg:max-w-[28rem]"
        >
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="display text-[1.15rem] font-bold leading-none tracking-[-0.01em] text-brand sm:text-[1.3rem]">
              On film
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/45">
              Karmo films
            </span>
          </p>

          <h2 className="display mt-3 text-[1.75rem] font-extrabold! uppercase leading-[1.02]! tracking-[-0.015em] text-ink sm:text-[2rem] lg:text-[2.35rem]">
            <span className="block sm:whitespace-nowrap">See comfort.</span>
            <span className="block text-brand sm:whitespace-nowrap">
              On screen.
            </span>
          </h2>

          <span className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
              Watch the craft
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0"
              aria-hidden
            >
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
          </span>

          <p className="body-copy mt-5 text-[16px] leading-[1.7] text-ink/55 lg:text-[17px]">
            From commercials to product close-ups — the films that show how
            Karmo foam, mattresses and HomeTex are made, tested and lived with.
          </p>

          <Link
            href="/media/video-ads"
            className="group mt-8 inline-flex items-center gap-3"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              Explore to view more films
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        {/* Right — continuous marquee; always ~3 tiles in view */}
        <div
          className="reels-marquee-viewport relative h-[min(64svh,520px)] min-h-0 w-full overflow-hidden lg:h-full"
          style={{ containerType: "inline-size" }}
        >
          {reduceMotion ? (
            <div
              className="grid h-full w-full grid-cols-2 md:grid-cols-3"
              style={{ gap: GAP_PX }}
            >
              {staticFilms.map((film) => (
                <div key={film.id} className="min-h-0 min-w-0">
                  <ReelTile
                    film={film}
                    still
                    active={sectionInView}
                    onOpen={openFilm}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`reels-marquee-track flex h-full w-max ${open ? "is-paused" : ""}`}
              style={{ gap: GAP_PX }}
            >
              {loopFilms.map((film) => (
                <div
                  key={film.key}
                  className="h-full shrink-0"
                  style={{ width: TILE_W }}
                >
                  <ReelTile
                    film={film}
                    still={false}
                    active={sectionInView}
                    onOpen={openFilm}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {open ? (
        <VideoModal
          src={open.src}
          label={open.title}
          caption={`${open.tag} · ${open.title}`}
          onClose={closeFilm}
        />
      ) : null}
    </section>
  );
}
