"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiPlay } from "react-icons/fi";

import VideoModal from "@/components/karmo/VideoModal";
import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two — films band.
 *
 * Same composition as DivisionEditorials: left copy (shell-aligned) + right
 * three-column masonry that meets the viewport edge. Tiles play muted while
 * on screen; click opens the shared VideoModal.
 */

const ORANGE = "#FF9A1F";
/* Same desktop height as DivisionEditorials (section 3). */
const DESKTOP_H = "calc(100svh - 32px)";

const columns = [
  [
    {
      id: "tvc-mattress",
      src: "/karmo/videos/tvc-mattress.mp4",
      title: "Karmo Mattress, the commercial",
      tag: "Commercial",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "product-film",
      src: "/karmo/videos/product-film.mp4",
      title: "A room built on Karmo",
      tag: "Interiors",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
  [
    {
      id: "reel-4",
      src: "/karmo/videos/reel-4.mp4",
      title: "Pocketed spring array",
      tag: "Inside the product",
      ratio: "aspect-[12/11]",
      grow: "md:flex-[11]",
    },
    {
      id: "reel-3",
      src: "/karmo/videos/reel-3.mp4",
      title: "Rebound on the quilted top",
      tag: "Inside the product",
      ratio: "aspect-[3/5]",
      grow: "md:flex-[20]",
    },
  ],
  [
    {
      id: "reel-1",
      src: "/karmo/videos/reel-1.mp4",
      title: "CertiGuard germ protection",
      tag: "Certification",
      ratio: "aspect-[3/4]",
      grow: "md:flex-[16]",
    },
    {
      id: "tvc-foam",
      src: "/karmo/videos/tvc-foam.mp4",
      title: "Karmo Foam, from the archive",
      tag: "Archive",
      ratio: "aspect-[4/5]",
      grow: "md:flex-[15]",
    },
  ],
];

function FilmShot({ film, still, onOpen }) {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  const onScreen = useInView(tileRef, { amount: 0.25, margin: "80px 0px" });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (onScreen) {
      setLoad(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setLoad(false), 600);
    return () => window.clearTimeout(timer);
  }, [onScreen]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;
    if (onScreen && !still) {
      const play = node.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
      return undefined;
    }
    node.pause();
    return undefined;
  }, [onScreen, still, load, film.src]);

  return (
    <button
      ref={tileRef}
      type="button"
      onClick={(event) => onOpen(film, event.currentTarget)}
      aria-label={`Play ${film.title} full size`}
      className={`group relative block w-full min-h-0 overflow-hidden bg-ink text-left ${film.ratio} md:aspect-auto md:flex-1 ${film.grow}`}
    >
      {load ? (
        <video
          ref={videoRef}
          src={film.src}
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 bg-[#1a1d22]" />
      )}

      <span
        aria-hidden
        className="absolute inset-0 bg-[rgba(12,14,18,0.22)] transition-colors duration-500 group-hover:bg-[rgba(12,14,18,0.36)]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-white/10 opacity-80 backdrop-blur-sm transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:opacity-100 sm:h-12 sm:w-12"
      >
        <FiPlay className="ml-0.5 text-base text-white sm:text-lg" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
          {film.tag}
        </span>
        <p className="display mt-1 line-clamp-2 text-[13px] font-semibold uppercase leading-snug tracking-[0.04em] text-white sm:text-[14px]">
          {film.title}
        </p>
      </div>
    </button>
  );
}

export default function Reels() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

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

  return (
    <section
      data-home-two-snap
      className="reels-editorials overflow-x-clip bg-white py-1.5 lg:mt-0 lg:overflow-visible lg:py-1.5"
      style={{ ["--reels-h"]: DESKTOP_H }}
      aria-label="Karmo films"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid items-center gap-10 px-6 md:px-14 lg:grid-cols-3 lg:h-full lg:min-h-0 lg:items-stretch lg:gap-1.5 lg:px-0"
      >
        <motion.div
          variants={fade}
          className="min-w-0 max-w-md self-center text-left lg:max-w-none lg:pl-[max(3rem,calc((100vw-1760px)/2+3rem))] lg:pr-8"
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
            <span className="block whitespace-nowrap">See comfort.</span>
            <span className="block whitespace-nowrap text-brand">
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
              Watch all films
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>

        <div className="grid min-h-0 w-full min-w-0 grid-cols-2 gap-1 md:grid-cols-3 md:gap-1.5 lg:col-span-2 lg:h-full">
          {columns.map((col, i) => (
            <div
              key={`film-col-${i}`}
              className="flex min-h-0 flex-col gap-1 md:gap-1.5 lg:h-full"
            >
              {col.map((film) => (
                <FilmShot
                  key={film.id}
                  film={film}
                  still={!!reduceMotion}
                  onOpen={openFilm}
                />
              ))}
            </div>
          ))}
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
