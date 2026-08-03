"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiPlay } from "react-icons/fi";

import VideoModal from "./VideoModal";

/**
 * Karmo on screen — a running strip rather than a player.
 *
 * This was a screening room: one big stage, a playlist beside it, sound, a
 * lightbox, transport controls. It is now the plain version — the clips run
 * one after another across the page, every one of them playing, all of them
 * silent, and the row never stops moving. Nothing to press, nothing to choose.
 *
 * The strip is the shared marquee: the list is rendered twice and the track
 * travels exactly half its own width, so the second copy lands where the first
 * began and the loop repeats with no visible jump. It holds still while the
 * pointer is over it, so a clip can actually be watched.
 *
 * Every file was checked on 27 July 2026 and not one is vertical:
 *
 *   tvc-mattress  1280x720   16:9   1:02   8.9 MB
 *   product-film  2560x1440  16:9   0:05   2.5 MB
 *   reel-1..4     1536x1152  4:3    0:04 - 0:06   4.1 - 6.2 MB
 *   tvc-foam       352x288   4:3    0:20   7.4 MB
 *
 * The tiles are 2:3 — reel-shaped, a little wider than a phone reel, which is
 * what the client asked for. It is worth being clear about what that costs:
 * every clip is landscape, so a portrait tile keeps only the middle strip of
 * each one. At 2:3 a 16:9 clip shows 37% of its width and a 4:3 clip shows
 * 50%. The subject is centred in all six, so nothing essential is lost, but
 * more than half of every frame is. Landscape tiles, or footage actually shot
 * vertically, are the two ways to stop paying that.
 *
 * Three things need the client's word before launch:
 *
 *   - reel-2.mp4 is deliberately NOT in this list. Its compression rig carries
 *     "durfi" branding on screen — a competing mattress brand — so it is not
 *     Karmo footage and cannot go on Karmo's homepage. Do not add it back
 *     without a replacement clip.
 *   - reel-1.mp4 is a CertiGuard certification sting. It is kept, but only if
 *     Karmo actually holds that certification.
 *   - tvc-foam.mp4 is 352x288. It is genuine archive footage and is labelled as
 *     such, but a higher-resolution master would help.
 *
 * On weight: six clips is 35 MB, and the doubled track means twelve elements
 * decoding at once. Nothing is fetched until the section is actually reached,
 * so a visitor who never scrolls this far pays nothing — but the masters are
 * far heavier than a small silent loop needs (reel-4 is 6.2 MB for six
 * seconds, roughly 8 Mbps). Re-encoding them for this strip is the single
 * biggest win available on this page.
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

import { group, line, rise as fade, VIEWPORT } from "./motion";

/**
 * One clip in the strip. `copy` marks the duplicated half of the track, which
 * is scenery — it carries the same picture as a tile already announced, so it
 * is hidden from assistive tech rather than read out a second time.
 */
function FilmTile({ film, armed, still, copy, onOpen }) {
  return (
    // A button, because clicking it does something. The strip holds still
    // while the pointer is over it, so by the time a tile can be aimed at it
    // has already stopped moving.
    //
    // The gap rides on the tile rather than on the track. `gap` would leave
    // the track 12 tiles and 11 gaps wide, so travelling 50% of it lands half
    // a gap short of where the second copy begins and the loop jumps every
    // lap. As a margin every tile is the same width including its gap, and
    // half the track is exactly six of them.
    //
    // Height comes from the strip, width from the ratio — so the tiles grow
    // with the screen instead of sitting at a fixed size on it. Square
    // corners: the client does not want them rounded.
    <button
      type="button"
      onClick={(event) => onOpen(film, event.currentTarget)}
      aria-label={`Play ${film.title} full size`}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      className="group/tile relative mr-4 aspect-[2/3] h-full shrink-0 cursor-pointer overflow-hidden bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {armed && (
        <video
          src={film.src}
          // Silent, endless and unattended: the three attributes together are
          // what every browser requires before it will start a video without
          // being asked. Drop `muted` and none of them play at all.
          autoPlay={!still}
          loop
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />

      {/* Rests over the middle and lifts on hover, so it is clear the tile is
          a way in rather than decoration. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/35 opacity-0 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:border-brand group-hover/tile:bg-brand group-hover/tile:opacity-100"
      >
        <FiPlay className="ml-0.5 text-xl text-white" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
          {film.tag}
        </span>
        <p className="display mt-1.5 truncate text-[15px] font-semibold text-white lg:text-[17px]">
          {film.title}
        </p>
      </div>
    </button>
  );
}

export default function Reels({ heading }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  // Nothing is fetched until the section is reached. Six clips is 35 MB, so
  // this gate is the difference between a homepage that costs nothing to
  // scroll past and one that does not.
  const armed = useInView(sectionRef, VIEWPORT);

  // The clip the modal is showing, and the tile it was opened from — focus has
  // to go back there on close or the reader is dropped at the top of the
  // document with no idea what just happened. Both copies of a clip are their
  // own tile, so the element is captured rather than looked up by source.
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
    // One screen tall from md up, so the strip takes as much of the window as
    // it can. A definite height, not a floor: the strip below is told to fill
    // whatever is left after the heading, and `min-height` alone would leave
    // it nothing to fill. The floor is a separate guard for short windows.
    <section
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden bg-linen py-16 md:h-[100svh] md:min-h-[38rem] md:py-0"
    >
      {/* Deliberately a light section. The page runs light the whole way down
          apart from one band, and a second dark one this close to it broke
          that. The only dark things here are the tiles, which have to be black
          for the picture to sit against. */}
      <div className="shell relative w-full shrink-0 md:py-9">
        <motion.div variants={group} {...reveal} viewport={VIEWPORT}>
          {heading ?? (
            <div>
              <span className="block overflow-hidden">
                <motion.span
                  variants={line}
                  className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
                >
                  <span className="h-px w-10 bg-brand" />
                  Karmo on screen
                </motion.span>
              </span>

              <h2 className="display mt-6 max-w-xl text-[1.6rem] font-light uppercase leading-[1.02] tracking-[0.01em] text-ink sm:text-[2.1rem]">
                <span className="block overflow-hidden pb-[0.04em]">
                  <motion.span variants={line} className="block">
                    See what
                    <span className="font-bold text-brand">
                      {" "}
                      comfort is made of
                    </span>
                  </motion.span>
                </span>
              </h2>
            </div>
          )}
        </motion.div>
      </div>

      {/* Full bleed and edge-masked, so the row reads as passing through the
          page rather than starting and stopping inside it.

          `min-h-0` is load-bearing on the md-and-up branch: a flex child
          defaults to min-height:auto, so without it this refuses to shrink
          below the natural height of the tiles inside and pushes the section
          past one screen instead of fitting into it. */}
      <motion.div
        variants={fade}
        {...reveal}
        viewport={VIEWPORT}
        className="marquee-rows mt-10 h-[62svh] overflow-hidden md:mt-0 md:h-auto md:min-h-0 md:flex-1 md:pb-9"
      >
        {/* Under reduced motion the track stops and becomes an ordinary
            scrolling strip, and the clips hold on their first frame — a row of
            things moving on their own is the whole of what that setting is
            asking not to see. */}
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
