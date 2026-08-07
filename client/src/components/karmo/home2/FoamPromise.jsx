"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { TbDropletOff, TbShieldCheck, TbArrowBigDownLines } from "react-icons/tb";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * "Blending tradition with innovation" — the three-claim band, rebuilt to the
 * client's screenshot of their own site.
 *
 * Asked for as an exact copy, so this follows the reference where it differs
 * from the rest of Home 02 rather than arguing with it. Three of those
 * departures are worth naming, because each one contradicts a rule this page
 * otherwise keeps:
 *
 *   · **The leaf.** A gold leaf between two orange rules. The foam story and
 *     the Popular Products heading both had this device *removed*, on the
 *     argument that a leaf appears nowhere else and reads as another brand's
 *     leftover. Here it is the thing being copied, so it comes back — drawn
 *     inline rather than sourced, because the section is not in the local
 *     reference copy and no leaf asset exists in the repo.
 *   · **The orange.** A warm orange, not the brand red. It is what the
 *     reference uses for the rules, the leaf and the two card borders, and
 *     swapping it for brand red would have been the one change that stopped
 *     this reading as the same section. The exact shade was later brightened
 *     from the reference's #E8892B — see `ORANGE` below.
 *   · **The odd card out.** The middle card is solid white while its
 *     neighbours are transparent with an orange border. That is the
 *     reference's arrangement and it is doing real work — it lands on
 *     "Long Durability", so the eye is pulled to the middle of three rather
 *     than raked left to right.
 *
 * ── The background film ────────────────────────────────────────────────────
 * `product-film.mp4`, the clip `/home-2`'s `FilmBand` plays, at the client's
 * ask for "the video from Home 2". The seamless-loop rig is lifted from that
 * component wholesale rather than reimplemented — see the note on it below.
 */

/* Brightened from the reference's muted #E8892B at the client's ask for a more
   vivid border on the two side cards. The same token drives the leaf and the
   two rules, so those lift with it and the section stays one colour. */
const ORANGE = "#FF9A1F";

const claims = [
  {
    id: "no-filler",
    icon: TbDropletOff,
    /* The badge colours are the reference's, and they are the only three
       colours on the page that answer to nothing in the Karmo palette. Kept
       because they are what makes the row recognisable as this section. */
    badge: "bg-[#E03131]",
    title: "No Filler",
    body: "Zero fillers, ever. Made from 100% pure rubber grade materials for maximum density and lasting strength that won't crumble.",
  },
  {
    id: "long-durability",
    icon: TbShieldCheck,
    badge: "bg-[#1C7ED6]",
    title: "Long Durability",
    body: "Built to take heavy daily use without sagging. Our advanced polyurethane foam holds its shape and support for years.",
    /* The one solid card. See the note above on why it is the middle one. */
    solid: true,
  },
  {
    id: "more-resilient",
    icon: TbArrowBigDownLines,
    badge: "bg-[#2F9E44]",
    title: "More Resilient",
    body: "Superior bounce, elasticity and air flow. Responds dynamically to pressure for steady support and instant relief.",
  },
];

/**
 * The gold leaf and its two rules.
 *
 * Drawn rather than sourced: this section is not in the local copy of the
 * client's site, so there is no asset to lift. Inline SVG rather than a file
 * for one 18px mark that is a single filled path — a request and a cache entry
 * would cost more than the path does.
 */
function LeafRule() {
  return (
    <span aria-hidden className="mt-4 flex items-center justify-center gap-3">
      <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
        {/* A leaf: one edge swept, the other straight back to the stem, with a
            midrib. Two paths so the rib can be thinner than the body. */}
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
      <span className="h-px w-16 sm:w-20" style={{ backgroundColor: ORANGE }} />
    </span>
  );
}

/* Seconds of overlap between the outgoing and incoming copy of the loop. Kept
   in step with the 700ms opacity transition on the layers. */
const CROSSFADE = 0.7;
const FILM = "/karmo/videos/product-film.mp4";
const STILL = "/karmo/livora/page-header-bg-image.jpg";

/**
 * How the background behaves as the section passes. Four treatments were built
 * to be compared in one scroll; the client chose `fixed` — a viewport-anchored
 * frame — and asked for its stillness eased off, so its drift now runs larger
 * than a background pinned rigid, which had read as a photograph behind a hole.
 * The other three are kept in code, unused by the homepage.
 *
 *   fixed    · Anchored to the viewport, clipped to the section, with a gentle
 *             drift over it so it eases along the scroll rather than sitting
 *             dead still. The chosen treatment.
 *   parallax · Travels with the section but lags behind it, so it appears to
 *             move at roughly two thirds of the page's speed. The ordinary
 *             answer, and the one most people mean by "scroll animation".
 *   zoom     · Holds its position and scales slowly across the pass. Nothing
 *             slides, so it never fights the direction of the scroll — the
 *             frame just opens up.
 *   drift    · Ignores scroll entirely and pans on its own clock, whether or
 *             not the reader is moving. The only one that is still alive when
 *             the page is standing still.
 */
export const FILM_MODES = ["fixed", "parallax", "zoom", "drift"];

/* Pixels the anchored film drifts each way across the section's whole pass.
   Only used by `fixed`. Raised from 40 to soften how pinned the frame reads —
   a larger drift eases it along the scroll instead of holding it dead still.
   The layer is overscanned past this (see `-inset-y-[120px]`), so the drift
   never pulls an edge into the clip window — raising one without the other is
   what would expose one. */
const DRIFT = 80;

/* Pixels the parallax layer lags each way. Larger than DRIFT on purpose: this
   one is supposed to be seen moving. Its own overscan is `-inset-y-[150px]`,
   which has to stay clear of this figure for the same reason. */
const PARALLAX = 120;

/* Scale at the start and end of the pass for `zoom`. Both above 1 so the layer
   always covers its box — a scale below 1 would show the section's own
   background at the corners. */
const ZOOM_FROM = 1.04;
const ZOOM_TO = 1.18;

/**
 * `filmMode` picks how the background answers to scroll — see `FILM_MODES`
 * above for what each one does and why. Defaults to `fixed`, the treatment the
 * client chose, so a caller that says nothing gets the one the homepage uses.
 */
export default function FoamPromise({ filmMode = "fixed" }) {
  const reduce = useReducedMotion();
  const reveal = reduce ? {} : { initial: "hidden", whileInView: "show" };

  const layerA = useRef(null);
  const layerB = useRef(null);
  const sectionRef = useRef(null);
  const filmRef = useRef(null);
  const driftRef = useRef(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);

  /**
   * One scroll loop serving three of the four modes. `drift` is not here at
   * all — it runs on a CSS keyframe and never reads the scroll position, which
   * is the whole point of it.
   *
   * Everything is written straight to the node inside a rAF rather than held
   * in state: this runs on every scroll frame, and a `setState` per frame would
   * re-render the whole section — three cards and two videos — sixty times a
   * second to move one CSS value.
   *
   * ── What `fixed` needs that the others do not ──────────────────────────────
   * Only `fixed` clips. The film is genuinely `position: fixed`, so without a
   * clip it would paint across the entire viewport; the clip is what cuts it
   * back to the slice of the section currently on screen. The other modes sit
   * inside an ordinary `overflow-hidden` box and are clipped by it for free.
   *
   * The two obvious ways to get a fixed background both fail here:
   *
   *   · `background-attachment: fixed` is a background-image property. There
   *     is no equivalent for a `<video>` element.
   *   · `position: sticky` sticks to the nearest scrollport, and an ancestor
   *     with `overflow: hidden` becomes that scrollport — which is exactly what
   *     clips the film in the other modes. Even without it, a sticky layer only
   *     has room to travel when its container is taller than the layer, and
   *     this section is shorter than the viewport, so it would have sat still.
   *
   * And the clip and the movement have to be two separate elements. `clip-path`
   * is resolved in the element's own coordinate space and the transform applies
   * to the already-clipped result, so moving the clipped node would carry the
   * window with it and leak the section's edges. The outer node only ever
   * clips and never moves; the inner one only ever moves and never clips. That
   * split costs the other modes nothing, so they use the same two nodes.
   *
   * The still underneath is a plain absolute layer in every mode, so it needs
   * none of this. Before hydration, and for a reader who asked for less motion,
   * it is the whole background and it behaves normally.
   */
  useEffect(() => {
    if (reduce || filmMode === "drift") return;
    const section = sectionRef.current;
    const inner = driftRef.current;
    if (!section || !inner) return;

    const isFixed = filmMode === "fixed";
    const film = filmRef.current;
    if (isFixed && !film) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Off screen entirely. For `fixed` that means clipping the layer away —
      // a viewport-sized fixed video would otherwise paint over whatever
      // section is actually in view. The other modes are inside the section
      // and simply go with it, so there is nothing to do and no reason to keep
      // recomputing a transform nobody can see.
      if (rect.bottom <= 0 || rect.top >= vh) {
        if (isFixed) film.style.clipPath = "inset(100% 0 0 0)";
        return;
      }

      if (isFixed) {
        const top = Math.max(0, rect.top);
        const bottom = Math.max(0, vh - rect.bottom);
        film.style.clipPath = `inset(${top}px 0px ${bottom}px 0px)`;
      }

      // 0 as the section's top edge reaches the bottom of the window, 1 as its
      // bottom edge leaves the top — so the full pass is the section's height
      // plus a viewport, and the movement is spread across all of it rather
      // than spent in the first screenful.
      const travel = rect.height + vh;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / travel));

      if (isFixed) {
        // Rises as the page scrolls down. On a layer that is otherwise pinned,
        // that is the direction that reads as the background easing along
        // rather than fighting the scroll.
        const offset = (0.5 - progress) * 2 * DRIFT;
        inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      } else if (filmMode === "parallax") {
        // The opposite sign, and for the opposite reason. This layer is inside
        // the section, so it is already travelling up with it; pushing it back
        // *down* as the page scrolls is what makes it lag, and a lagging
        // background is what reads as depth.
        const offset = (progress - 0.5) * 2 * PARALLAX;
        inner.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      } else if (filmMode === "zoom") {
        // No translation at all — this one is meant to hold still and open up,
        // so it never competes with the direction of the scroll.
        const scale = ZOOM_FROM + (ZOOM_TO - ZOOM_FROM) * progress;
        inner.style.transform = `scale(${scale.toFixed(4)})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduce, filmMode]);

  /**
   * Two stacked copies of one clip, cross-faded at the seam.
   *
   * `<video loop>` restarts on a hard cut, and on a clip this short the jump
   * comes round often enough to be the only thing anyone notices. So the loop
   * is run by hand: when the playing copy is within CROSSFADE of its end, the
   * other starts from zero and the two swap opacity. This is `FilmBand`'s rig,
   * copied deliberately rather than imported — that component is a whole
   * section with its own heading, badge and modal, and there is nothing to
   * import without taking all of it.
   */
  const relay = useCallback(
    (which) => (event) => {
      if (which !== front) return;
      const video = event.currentTarget;
      const remaining = video.duration - video.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE) return;

      const other = which === 0 ? layerB.current : layerA.current;
      if (!other) return;
      other.currentTime = 0;
      // Autoplay can still be refused — a power-saving tab, an OS setting.
      // Swallowing it leaves the still showing rather than throwing.
      other.play().catch(() => {});
      setFront(which === 0 ? 1 : 0);
    },
    [front]
  );

  const park = (event) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  // `loadeddata` fires the moment the first frame decodes, which on a cached
  // file can be before hydration attaches the handler — the event is simply
  // missed and the band would sit on the still forever. So the state is also
  // read straight off the element once, on mount.
  useEffect(() => {
    if (layerA.current?.readyState >= 2) setReady(true);
  }, []);

  const layerProps = (which) => ({
    ref: which === 0 ? layerA : layerB,
    className:
      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-linear",
    style: { opacity: ready && front === which ? 1 : 0 },
    muted: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    tabIndex: -1,
    onLoadedData: () => setReady(true),
    onTimeUpdate: relay(which),
    onEnded: park,
  });

  return (
    /* No `overflow-hidden` — it would have made this the scrollport for
       anything sticky inside, and the film's clipping is done with `clip-path`
       instead. The section still clips visually because every layer below is
       either inset to it or clipped to it. */
    /* Deeper than it started, and the anchored film is the reason it is worth
       having: the drift only reads while there is enough section to travel
       past it. Settled at 24/36 after 20/28 was called too short and 28/40 too
       tall — 830px on a 1440x900 window. Padding rather than a `min-h`, so the
       band grows around its content instead of leaving a gap under it when the
       cards are short. */
    <section
      ref={sectionRef}
      className="relative bg-shade-deep py-24 lg:py-36"
    >
      {/* A still under the film, never removed, so the band is never a black
          rectangle — not while the film buffers, not if it fails, and not for a
          reader who asked for less motion, who gets no video element at all.
          This one is a plain absolute layer and scrolls with the section, which
          is also what makes it the right fallback before hydration. */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
        <Image src={STILL} alt="" fill sizes="100vw" className="object-cover" priority={false} />
      </div>

      {/* The film. One set of `<video>` elements in every mode — the mode only
          decides the two boxes they sit in, so the loop rig, the refs and the
          crossfade never change with it.

          The outer box is either a viewport-sized `fixed` layer that has to be
          clipped by hand, or an ordinary absolute one the section clips for
          free. Its `clip-path` starts fully closed in the fixed case, so the
          moment before the first measurement — and for anyone whose JS never
          runs — it is not painting over the rest of the page. The still
          underneath covers both.

          The inner box is what moves, and how much room it needs to move in
          depends on the mode:
            · parallax travels PARALLAX px each way, so it overscans furthest.
            · fixed travels DRIFT px each way, so it needs less.
            · zoom only scales, and a scale above 1 covers its own box.
            · drift is a CSS keyframe and its own overscan is in that rule.
          Each overscan has to stay clear of its figure above — raising one
          without the other is exactly what pulls an edge into view. */}
      {!reduce && (
        <div
          ref={filmRef}
          aria-hidden
          className={
            filmMode === "fixed"
              ? "pointer-events-none fixed inset-0 z-0"
              : "pointer-events-none absolute inset-0 z-0 overflow-hidden"
          }
          style={filmMode === "fixed" ? { clipPath: "inset(100% 0 0 0)" } : undefined}
        >
          <div
            ref={driftRef}
            className={
              filmMode === "parallax"
                ? "absolute -inset-y-[150px] inset-x-0"
                : filmMode === "fixed"
                  ? "absolute -inset-y-[120px] inset-x-0"
                  : filmMode === "drift"
                    ? "foam-drift absolute inset-0"
                    : "absolute inset-0"
            }
          >
            <video {...layerProps(0)} autoPlay src={FILM} />
            <video {...layerProps(1)} src={FILM} />
          </div>
        </div>
      )}

      {/* The film is a light grey foam texture and the copy over it is white.
          Unveiled it measured 1.4:1 against the brightest frames — nowhere near
          readable — so this is a real scrim rather than a mood layer. Flat
          rather than a gradient: the cards sit across the full height, so there
          is no band of the picture that can be left bright. Absolute, above
          both the still and the film. */}
      <span aria-hidden className="absolute inset-0 z-[1] bg-shade-deep/72" />

      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell relative z-[2]"
      >
        <motion.div variants={fade} className="text-center">
          <h2 className="display text-[1.75rem] font-bold uppercase leading-[1.15] tracking-[0.01em] text-white lg:text-[2.3rem]">
            Blending tradition with innovation
          </h2>
          <p className="body-copy mt-3 text-[15px] text-white/90">
            Lasting Comfort to your Doorstep
          </p>
          <LeafRule />
        </motion.div>

        {/* Three across from lg, two from sm, one below. `items-stretch` is the
            whole reason the odd card out works: the middle one is solid white
            and the other two are transparent, so any height difference between
            them would read as the white card being misaligned rather than as
            three cards of unequal copy. */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">
          {claims.map((claim) => (
            <motion.div
              key={claim.id}
              variants={fade}
              /* All three carry a border, including the solid one — its own is
                 white, so it is invisible against its background and exists
                 only to make the box geometry identical. Without it the solid
                 card's content box was 2px taller than its bordered
                 neighbours', which put its icon, title and rule a pixel out of
                 line across the row. Measured: rule tops at 966.45 / 967.45 /
                 966.45 before this. */
              className={`flex flex-col items-center border px-7 py-10 text-center lg:px-8 ${
                claim.solid ? "bg-white" : "bg-shade-deep/25"
              }`}
              style={{ borderColor: claim.solid ? "#ffffff" : ORANGE }}
            >
              <span
                className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full text-white ${claim.badge}`}
              >
                <claim.icon className="text-[32px]" />
              </span>

              <h3
                className={`display mt-6 text-[18px] font-bold ${
                  claim.solid ? "text-ink" : "text-white"
                }`}
              >
                {claim.title}
              </h3>

              <p
                className={`body-copy mb-8 mt-4 text-[14px] leading-[1.75] ${
                  claim.solid ? "text-ink/60" : "text-white/85"
                }`}
              >
                {claim.body}
              </p>

              {/* The short rule under each card, pushed to a common floor by
                  `mt-auto` so it lands at the same height across the row
                  however long the copy runs. The 32px above it is `mb-8` on
                  the paragraph, not `mt-8` here: an auto margin only
                  distributes slack, so on a row where the cards happen to
                  match it resolves to zero and the rule lands hard against the
                  copy. Same trap the Popular Products button fell into. */}
              <span
                aria-hidden
                className={`mt-auto block h-[2px] w-16 ${
                  claim.solid ? "bg-brand/70" : "bg-brand"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
