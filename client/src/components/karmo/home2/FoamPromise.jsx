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
 *   · **The orange.** #E8892B, not the brand red. It is what the reference
 *     uses for the rules, the leaf and the two card borders, and swapping it
 *     for brand red would have been the one change that stopped this reading
 *     as the same section.
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

const ORANGE = "#E8892B";

const claims = [
  {
    id: "no-filler",
    icon: TbDropletOff,
    /* The badge colours are the reference's, and they are the only three
       colours on the page that answer to nothing in the Karmo palette. Kept
       because they are what makes the row recognisable as this section. */
    badge: "bg-[#E03131]",
    title: "No Filler",
    body: "We use zero fillers in our foam. Manufactured with 100% pure rubber grade materials, Karmo foam ensures maximum density, pure quality, and long-lasting strength without crumbling or losing density over time.",
  },
  {
    id: "long-durability",
    icon: TbShieldCheck,
    badge: "bg-[#1C7ED6]",
    title: "Long Durability",
    body: "Engineered to withstand heavy daily use without sagging or losing structural integrity. Our advanced polyurethane foam offers high resilience and retains its original shape and support for years.",
    /* The one solid card. See the note above on why it is the middle one. */
    solid: true,
  },
  {
    id: "more-resilient",
    icon: TbArrowBigDownLines,
    badge: "bg-[#2F9E44]",
    title: "More Resilient",
    body: "Delivers superior bounce, flexible elasticity, and optimal air flow. Designed to respond dynamically to pressure, providing consistent body support, ergonomic comfort, and instant pressure relief.",
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

export default function FoamPromise() {
  const reduce = useReducedMotion();
  const reveal = reduce ? {} : { initial: "hidden", whileInView: "show" };

  const layerA = useRef(null);
  const layerB = useRef(null);
  const sectionRef = useRef(null);
  const filmRef = useRef(null);
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);

  /**
   * The film is genuinely `position: fixed`, and clipped each frame to
   * whatever slice of the section is currently on screen. That is what makes
   * it read as anchored while the cards travel over it.
   *
   * The two obvious answers both fail here, which is why this is done by hand:
   *
   *   · `background-attachment: fixed` is a background-image property. There
   *     is no equivalent for a `<video>` element.
   *   · `position: sticky` sticks to the nearest scrollport, and an ancestor
   *     with `overflow: hidden` becomes that scrollport — this section had one
   *     to clip the film. Even without it, a sticky layer only has room to
   *     travel when its container is taller than the layer, and this section
   *     is shorter than the viewport, so it would have sat still and done
   *     nothing.
   *
   * So `overflow-hidden` is gone from the section and `clip-path` does the
   * clipping instead. Written straight to the node inside a rAF rather than
   * held in state: this runs on every scroll frame, and a `setState` per frame
   * would re-render the whole section — three cards and two videos — sixty
   * times a second to move one CSS value.
   *
   * The still underneath stays a plain absolute layer, so it needs none of
   * this. Before hydration, and for a reader who asked for less motion, that
   * one is the whole background and it behaves normally.
   */
  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const film = filmRef.current;
    if (!section || !film) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Off screen entirely — clip it away rather than leave a fixed,
      // viewport-sized video painting over whatever section is actually in
      // view. `inset(100% ...)` collapses it to nothing.
      if (rect.bottom <= 0 || rect.top >= vh) {
        film.style.clipPath = "inset(100% 0 0 0)";
        return;
      }

      const top = Math.max(0, rect.top);
      const bottom = Math.max(0, vh - rect.bottom);
      film.style.clipPath = `inset(${top}px 0px ${bottom}px 0px)`;
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
  }, [reduce]);

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
    <section
      ref={sectionRef}
      className="relative bg-shade-deep py-20 lg:py-28"
    >
      {/* A still under the film, never removed, so the band is never a black
          rectangle — not while the film buffers, not if it fails, and not for a
          reader who asked for less motion, who gets no video element at all.
          This one is a plain absolute layer and scrolls with the section, which
          is also what makes it the right fallback before hydration. */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
        <Image src={STILL} alt="" fill sizes="100vw" className="object-cover" priority={false} />
      </div>

      {/* The fixed film. `clip-path` starts fully closed so that the moment
          before the first measurement — and for anyone whose JS never runs —
          this viewport-sized fixed element is not painting over the rest of
          the page. The still above is showing until it opens. */}
      {!reduce && (
        <div
          ref={filmRef}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <video {...layerProps(0)} autoPlay src={FILM} />
          <video {...layerProps(1)} src={FILM} />
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
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">
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
