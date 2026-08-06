"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiChevronRight, FiX } from "react-icons/fi";

import { rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home 02's shoppable scene — one room photograph, edge to edge, with a marker
 * on each Karmo piece in it. Hovering a marker opens a small card: the product,
 * its name, its price, and a way through to it. The arrangement is the
 * reference the client sent.
 *
 * ── Where the markers are ──────────────────────────────────────────────────
 * `x` and `y` are percentages of the *photograph*. The frame is full-bleed
 * with a height of its own, so its shape is whatever the window makes it, and
 * `object-cover` scales the picture to fill that and crops the overflow. Which
 * means a percentage of the *frame* is not a percentage of the *picture* —
 * position a marker at 15% of the frame and it slides off its cushion the
 * moment the window changes shape.
 *
 * So the cover geometry is redone in CSS, in container-query units against the
 * frame: work out the painted rectangle, centre it, and place the marker
 * inside *that*. See `coverLeft` / `coverTop` below.
 *
 * This started out as JavaScript — measure the frame, compute pixels, redo it
 * from a `ResizeObserver`. It was replaced because the failure mode is bad:
 * whenever the observer does not run (a hidden or backgrounded tab throttles
 * it), the markers keep the pixel positions of whatever size the frame *used*
 * to be, and end up scattered across the picture or outside it. Resolved by
 * the engine at layout time, they cannot be stale, they are right in the
 * server-rendered HTML, and there is no observer to keep alive.
 *
 * The simpler alternative is to give the frame the picture's own aspect ratio,
 * which makes percentages line up for free — but then the height is dictated
 * by the width, and this section is asked to be a set height under the header.
 *
 * ── Which side the card opens on ───────────────────────────────────────────
 * Stated per marker rather than measured. A card that decides after it has
 * rendered has to render first, which is a visible jump. The rule is just:
 * open away from the nearer edge.
 *
 * ── The card on a phone ────────────────────────────────────────────────────
 * Anchoring to the marker only works while there is room beside it. Below lg
 * the card ignores the marker and pins to the bottom of the photograph at full
 * width — the marker still says *which* product, the card just stops trying to
 * point at it from three inches away.
 *
 * ── The pictures ───────────────────────────────────────────────────────────
 * Every card thumbnail is a crop of this same photograph, so each one is
 * literally the object its marker sits on. When real catalogue cutouts exist
 * they drop straight in — only `thumb` changes.
 */
const scene = {
  src: "/karmo/images/home-02/shoppable/scene-yellow-room.webp",
  /** The painted size, for the cover maths above. */
  width: 2000,
  height: 857,
  alt: "A bedroom and sitting area against a marigold wall — a rattan bed made up in cream linen with an ochre throw, a bouclé armchair, and a rounded cream sofa with a tufted cushion",
};

/**
 * Every `x`/`y` was checked by cropping the scene at that point and looking at
 * what came out, not by reading them off the picture by eye. Two of the first
 * four were wrong that way: the sofa marker landed on the coffee table in front
 * of it, and the bed marker caught the armchair behind. Worth repeating for any
 * new scene — it takes one pass and it is the difference between a dot on a
 * product and a dot near one.
 */
const hotspots = [
  {
    id: "pillows",
    x: 34.5,
    y: 46.7,
    open: "right",
    name: "Karmo Comfort Pillow",
    division: "HomeTex",
    price: "৳ 950",
    href: "/hometex",
    thumb: "/karmo/images/home-02/shoppable/thumb-pillows.webp",
    thumbAlt: "White cotton pillows stacked against a rattan headboard with an ochre bolster in front",
  },
  {
    id: "bed",
    x: 26,
    y: 58,
    open: "right",
    name: "Karmo Pro Foam Mattress",
    division: "Mattress",
    price: "৳ 28,500",
    href: "/mattress",
    thumb: "/karmo/images/home-02/shoppable/thumb-bed.webp",
    thumbAlt: "A bed made up in cream linen with a folded ochre throw across the foot",
  },
  {
    id: "tufted-cushion",
    x: 57,
    y: 58.3,
    open: "right",
    name: "Tufted Cushion Cover",
    division: "HomeTex",
    price: "৳ 1,200",
    href: "/hometex",
    thumb: "/karmo/images/home-02/shoppable/thumb-tufted-cushion-yellow.webp",
    thumbAlt: "A cream cushion with a tufted sand-coloured wave pattern on a bouclé sofa",
  },
  {
    id: "boucle-sofa",
    x: 82.5,
    y: 68.8,
    open: "left",
    name: "Karmo Zuti Foam Sofa",
    division: "Foam",
    price: "৳ 62,000",
    href: "/foam",
    thumb: "/karmo/images/home-02/shoppable/thumb-boucle-sofa-yellow.webp",
    thumbAlt: "The rolled arm of a rounded cream bouclé sofa",
  },
];

/** Gap between a marker and the card that opens beside it. */
const OFFSET = 20;

/**
 * `object-cover` in arithmetic. The picture is scaled by whichever axis would
 * otherwise leave a gap, so the painted rectangle is at least the frame on
 * both axes and hangs over the edge on one; then it is centred, so half the
 * overhang is off each end.
 *
 * `100cqw` / `100cqh` are the frame's own width and height — the frame carries
 * `container-type: size`, which is what makes those units resolve against it
 * rather than against the page.
 */
const RATIO = scene.width / scene.height;
const PAINTED_W = `max(100cqw, 100cqh * ${RATIO})`;
const PAINTED_H = `max(100cqh, 100cqw / ${RATIO})`;

const coverLeft = (x) =>
  `calc((100cqw - ${PAINTED_W}) / 2 + ${x / 100} * ${PAINTED_W})`;
const coverTop = (y) =>
  `calc((100cqh - ${PAINTED_H}) / 2 + ${y / 100} * ${PAINTED_H})`;

export default function ShoppableScene() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  const [openId, setOpenId] = useState(null);
  const frameRef = useRef(null);
  const leaveTimer = useRef(null);

  const active = hotspots.find((s) => s.id === openId) ?? null;

  /**
   * Hover opens the card and leaving closes it — but not immediately.
   *
   * The card sits *beside* its marker with a 20px gap, so a pointer travelling
   * from one to the other leaves the marker before it arrives. Closing on the
   * bare `mouseleave` makes the card vanish in that gap and the whole thing
   * unusable. A short grace period covers the crossing: leaving arms a timer,
   * arriving anywhere that counts (the marker again, or the card) cancels it.
   * 160ms is the same figure `HeaderTwo` uses for its mega panel, which has
   * exactly this problem.
   */
  const open = useCallback((id) => {
    clearTimeout(leaveTimer.current);
    setOpenId(id);
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setOpenId(null), 160);
  }, []);

  const close = useCallback(() => {
    clearTimeout(leaveTimer.current);
    setOpenId(null);
  }, []);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  // Escape closes, and so does a click anywhere off the photograph. Without
  // the second one the only way out is to find the marker again, which on a
  // phone means aiming at a dot the card is probably covering.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => e.key === "Escape" && close();
    const onPointer = (e) => {
      if (frameRef.current && !frameRef.current.contains(e.target)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openId, close]);

  return (
    <section className="bg-white pb-14 lg:pb-16">
      <motion.div variants={fade} {...reveal} viewport={VIEWPORT}>
        {/* Full-bleed: no `.shell`, no padding, straight into both edges.
            Height from lg is the screen less 9rem — 756px on a 900px window.
            This was `100svh` less the 174px header less a little, which is the
            arithmetic the brief asked for, but it read as too short: by the
            time the reader scrolls the scene under the bar, the header is no
            longer taking a bite out of it, so subtracting its height only left
            a gap. Measuring from the whole window instead fills the view and
            still stops a little short of it. The cap stops it growing absurd
            on a tall monitor; the floor keeps it usable on a short laptop.
            Below lg it goes back to a ratio near the picture's own — a phone
            is 375px wide, and cropping a wide room into a tall narrow frame
            would carry the left-hand cushion clean off the picture. */}
        <div
          ref={frameRef}
          className="relative aspect-[16/10] w-full overflow-hidden [container-type:size] lg:aspect-auto lg:h-[calc(100svh-9rem)] lg:max-h-[1000px] lg:min-h-[420px]"
        >
          <Image
            src={scene.src}
            alt={scene.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Anything the crop carries past an edge is clipped away by the
              frame's `overflow-hidden`, so no marker can end up stranded on a
              border pointing at nothing. */}
          {hotspots.map((spot) => {
              const isOpen = spot.id === openId;
              // Hover is the way in, and `focus` opens it too so the keyboard
              // can reach every card. The click is kept for touch: a tap fires
              // `mouseenter` on a phone but never `mouseleave`, so without it a
              // card could open and never close — with it, a second tap on the
              // same marker shuts it.
              return (
                <button
                  key={spot.id}
                  type="button"
                  onMouseEnter={() => open(spot.id)}
                  onMouseLeave={scheduleClose}
                  onFocus={() => open(spot.id)}
                  onClick={() => (isOpen ? close() : open(spot.id))}
                  aria-expanded={isOpen}
                  aria-label={`${spot.name}, ${spot.price}`}
                  style={{ left: coverLeft(spot.x), top: coverTop(spot.y) }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                >
                  {/* Three layers: the ring that pulses, a wide invisible pad
                      so the target clears the 44px minimum without a 44px dot,
                      and the dot itself. */}
                  <span className="relative flex h-11 w-11 items-center justify-center">
                    <span
                      aria-hidden
                      className={`hotspot-ping absolute h-4 w-4 rounded-full bg-white ${
                        isOpen ? "opacity-0" : ""
                      }`}
                    />
                    <span
                      className={`relative h-4 w-4 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-[background-color,transform] duration-300 ${
                        isOpen ? "scale-125 bg-brand" : "bg-white"
                      }`}
                    />
                  </span>
                </button>
              );
            })}

          {/* Deliberately no `key={active.id}` on the card below. Keyed per
              hotspot, moving between markers unmounts one card and mounts
              another, and for the length of the exit both are on the page —
              which turns into a pile of ghosts if the exit never finishes (a
              background tab, where rAF is paused, does exactly that). One
              stable node cannot do that: switching markers rewrites its
              contents in place, and `left`/`top` are CSS transitions rather
              than mount animations, so it glides to the new marker instead of
              blinking out and back. Mount and unmount still animate — that is
              the only time the card actually appears or goes away. */}
          <AnimatePresence>
            {active && (
              <motion.div
                /* The card counts as part of the marker for hover purposes:
                   arriving on it cancels the pending close, leaving it starts
                   one. Without this the card would close the moment the pointer
                   crossed onto it, and nothing on it could ever be clicked. */
                onMouseEnter={() => open(active.id)}
                onMouseLeave={scheduleClose}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  "--x": coverLeft(active.x),
                  "--y": coverTop(active.y),
                  "--tx":
                    active.open === "left"
                      ? `calc(-100% - ${OFFSET}px)`
                      : `${OFFSET}px`,
                }}
                className="absolute inset-x-3 bottom-3 z-20 lg:inset-x-auto lg:bottom-auto lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-y-1/2 lg:translate-x-[var(--tx)] lg:transition-[left,top] lg:duration-[380ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:lg:transition-none"
              >
                <Link
                  href={active.href}
                  className="group flex items-center gap-4 bg-white p-3 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.45)] lg:w-[19rem] lg:gap-5 lg:p-4"
                >
                  <span className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden bg-cream lg:w-28">
                    <Image
                      src={active.thumb}
                      alt={active.thumbAlt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="display block text-[10px] font-bold uppercase tracking-[0.16em] text-ink/35">
                      {active.division}
                    </span>
                    <span className="display mt-1 block text-[13px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-ink transition-colors duration-300 group-hover:text-brand">
                      {active.name}
                    </span>
                    <span className="mt-1.5 block text-[13px] font-semibold text-ink/70">
                      {active.price}
                    </span>
                  </span>

                  <span className="shrink-0 text-ink/30 transition-colors duration-300 group-hover:text-brand">
                    <FiChevronRight size={20} />
                  </span>
                </Link>

                {/* Phones only. Pinned to the bottom of the photograph, the
                    card sits over the lower markers — including, often, the
                    one that opened it — so the two ways out that work on a
                    desktop are both gone: there is no Escape key, and the
                    marker you would tap again is underneath the card. This is
                    the way out. From lg the card floats beside its marker with
                    nothing hidden, and Escape and a click off the photograph
                    both work, so it is not needed there. */}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] lg:hidden"
                >
                  <FiX size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
