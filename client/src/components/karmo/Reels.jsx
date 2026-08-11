"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiPlay } from "react-icons/fi";

import VideoModal from "./VideoModal";
import { rise as fade, VIEWPORT } from "./motion";

/**
 * Karmo films — vertical reel strip (portrait tiles).
 *
 * Performance: the old build armed every tile (×2 for the marquee) the moment
 * the section entered view, so ~12 videos fetched and decoded at once and the
 * tab stuttered. Each tile now loads and plays only while it is on screen,
 * and unloads shortly after it leaves.
 */
const films = [
  {
    src: "/karmo/videos/tvc-mattress.mp4",
    title: "Karmo Mattress, the commercial",
    tag: "Commercial",
  },
  {
    src: "/karmo/videos/product-film.mp4",
    title: "A room built on Karmo",
    tag: "Interiors",
  },
  {
    src: "/karmo/videos/reel-4.mp4",
    title: "Pocketed spring array",
    tag: "Inside the product",
  },
  {
    src: "/karmo/videos/reel-3.mp4",
    title: "Rebound on the quilted top",
    tag: "Inside the product",
  },
  {
    src: "/karmo/videos/reel-1.mp4",
    title: "CertiGuard germ protection",
    tag: "Certification",
  },
  {
    src: "/karmo/videos/tvc-foam.mp4",
    title: "Karmo Foam, from the archive",
    tag: "Archive",
  },
];

function FilmTile({ film, still, copy, onOpen }) {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  // Wide side margin so the next reel can warm up just before it slides in.
  const onScreen = useInView(tileRef, { amount: 0.35, margin: "0px 120px" });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (onScreen) {
      setLoad(true);
      return undefined;
    }
    // Drop the element after it leaves so decode/memory don't pile up across
    // the duplicated marquee track.
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
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      className="group/tile relative mr-2.5 aspect-[2/3] h-full shrink-0 cursor-pointer overflow-hidden bg-ink text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:mr-3"
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.04]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 bg-[#1a1d22]" />
      )}

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(12,14,18,0.28)] transition-colors duration-500 group-hover/tile:bg-[rgba(12,14,18,0.4)]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/50 bg-white/10 opacity-70 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:border-brand group-hover/tile:bg-brand group-hover/tile:opacity-100 lg:h-16 lg:w-16"
      >
        <FiPlay className="ml-0.5 text-lg text-white lg:text-xl" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
          {film.tag}
        </span>
        <p className="display mt-1.5 line-clamp-2 text-[14px] font-semibold uppercase leading-snug tracking-[0.04em] text-white lg:text-[15px]">
          {film.title}
        </p>
      </div>
    </button>
  );
}

export default function Reels({ heading }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

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

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  // One set only when reduced motion (no infinite track to feed).
  const track = reduceMotion ? films : [...films, ...films];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      aria-label="Karmo films"
    >
      {heading ? (
        <div className="relative w-full px-0 pb-4 lg:pb-5">{heading}</div>
      ) : null}

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="marquee-rows relative h-[20rem] overflow-hidden sm:h-[26rem] lg:h-[30rem]"
      >
        <div
          className={
            reduceMotion
              ? "flex h-full gap-3 overflow-x-auto px-6"
              : "marquee marquee-left h-full"
          }
        >
          {track.map((film, index) => (
            <FilmTile
              key={`${film.src}-${index}`}
              film={film}
              still={!!reduceMotion}
              copy={!reduceMotion && index >= films.length}
              onOpen={openFilm}
            />
          ))}
        </div>
      </motion.div>

      {open && (
        <VideoModal
          src={open.src}
          label={open.title}
          caption={`${open.tag} · ${open.title}`}
          onClose={closeFilm}
        />
      )}
    </section>
  );
}
