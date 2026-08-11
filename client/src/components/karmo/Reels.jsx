"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiPlay } from "react-icons/fi";

import VideoModal from "./VideoModal";
import { group, rise as fade, VIEWPORT } from "./motion";

/**
 * Karmo on screen — a running strip rather than a player.
 *
 * The clips run one after another across the page, silent and looping. The
 * strip is the shared marquee: the list is rendered twice and the track
 * travels exactly half its own width. It holds still under the pointer so a
 * clip can be watched, and a click opens the lightbox.
 *
 * Every file was checked on 27 July 2026 and not one is vertical:
 *
 *   tvc-mattress  1280x720   16:9   1:02   8.9 MB
 *   product-film  2560x1440  16:9   0:05   2.5 MB
 *   reel-1..4     1536x1152  4:3    0:04 - 0:06   4.1 - 6.2 MB
 *   tvc-foam       352x288   4:3    0:20   7.4 MB
 *
 * Notes before launch:
 *   - reel-2.mp4 is NOT in this list (carries competing "durfi" branding).
 *   - reel-1.mp4 is a CertiGuard sting — keep only if Karmo holds that cert.
 *   - tvc-foam.mp4 is 352x288 archive; a higher-res master would help.
 *
 * Six clips ≈ 35 MB; nothing fetches until the section is in view.
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

/**
 * One clip in the strip. `copy` marks the duplicated half of the track — same
 * picture already announced, so it is hidden from assistive tech.
 */
function FilmTile({ film, armed, still, copy, onOpen }) {
  return (
    // Gap rides on the tile (`mr-*`) not the track's `gap`, so half the track
    // width is exactly six tiles and the loop lands clean. Square corners —
    // the client does not want them rounded.
    <button
      type="button"
      onClick={(event) => onOpen(film, event.currentTarget)}
      aria-label={`Play ${film.title} full size`}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      className="group/tile relative mr-2.5 aspect-[2/3] h-full shrink-0 cursor-pointer overflow-hidden bg-ink text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:mr-3"
    >
      {armed && (
        <video
          src={film.src}
          autoPlay={!still}
          loop
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:scale-[1.04]"
        />
      )}

      {/* Even soft wash — one tone over the whole tile, not a bottom-only fade. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(12,14,18,0.28)] transition-colors duration-500 group-hover/tile:bg-[rgba(12,14,18,0.4)]"
      />

      {/* Play mark — quiet at rest, solid brand on hover. */}
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

/**
 * Slim editorial label — not another full centred section title. The strip
 * is the subject; this only names it and gets out of the way.
 */
function DefaultHeading() {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0 text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
          On screen
        </span>
        <h2 className="display mt-1.5 text-[1.35rem] font-bold uppercase leading-none tracking-[0.02em] text-ink sm:text-[1.5rem]">
          Karmo films
        </h2>
      </div>
      <p className="max-w-xs text-left text-[12px] leading-snug text-ink/45 sm:text-right sm:text-[13px]">
        From the factory floor to the finished room — hover to pause, click to
        watch.
      </p>
    </div>
  );
}

export default function Reels({ heading }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const armed = useInView(sectionRef, VIEWPORT);

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
  const track = [...films, ...films];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-14 pt-8 lg:pb-20 lg:pt-10"
    >
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative w-full"
      >
        <motion.div variants={fade}>{heading ?? <DefaultHeading />}</motion.div>
      </motion.div>

      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="marquee-rows relative mt-6 h-[22rem] overflow-hidden sm:mt-7 sm:h-[26rem] lg:h-[30rem]"
      >
        <div
          className={
            reduceMotion
              ? "flex h-full overflow-x-auto px-6"
              : "marquee marquee-left h-full"
          }
        >
          {track.map((film, index) => (
            <FilmTile
              key={`${film.src}-${index}`}
              film={film}
              armed={armed}
              still={reduceMotion}
              copy={index >= films.length}
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
