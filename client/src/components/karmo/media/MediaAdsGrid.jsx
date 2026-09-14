"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import VideoModal from "@/components/karmo/VideoModal";
import { karmoFilms } from "@/data/films";

function AdsReelTile({ film, onOpen }) {
  const tileRef = useRef(null);
  const videoRef = useRef(null);
  const onScreen = useInView(tileRef, { amount: 0.2, margin: "40px 0px" });
  const reduceMotion = useReducedMotion();
  const shouldPlay = onScreen && !reduceMotion;

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
      className="group relative aspect-[9/16] w-full overflow-hidden bg-ink text-left"
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
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-12 sm:p-3.5">
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

/** Full Media Ads page — same reel language as homepage films. */
export default function MediaAdsGrid() {
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
    <section className="bg-[#f6f3ee]" aria-label="Karmo ads and films">
      <div className="shell-home-two py-10 sm:py-12 lg:py-14">
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {karmoFilms.map((film) => (
            <li key={film.id}>
              <AdsReelTile film={film} onOpen={openFilm} />
            </li>
          ))}
        </ul>
      </div>

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
