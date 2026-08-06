"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCalendar } from "react-icons/fi";
// SWEEP is pulled out on its own because the rail is moved by a plain CSS
// transition, not a framer variant, so it needs the raw curve.
import {
  group,
  line,
  rise as fade,
  zoomOut,
  curtainUp,
  SWEEP,
  VIEWPORT,
} from "./motion";

const posts = [
  {
    title: "How foam density actually decides how long a mattress lasts",
    href: "/blog/foam-density",
    image: "/karmo/images/products/karmo-280-scene.png",
    alt: "Karmo foam blocks on a workbench beside a part-finished cushion",
    date: "12 June 2026",
    author: "Karmo Desk",
    excerpt:
      "Density is not firmness. The number on the label tells you how much material is packed into every cubic foot — and that is what decides whether a mattress holds its shape after five years.",
  },
  {
    title: "Choosing bedding that survives a Dhaka summer",
    href: "/blog/summer-bedding",
    image: "/karmo/images/mattress/plant-bedroom.jpg",
    alt: "Karmo mattress in a plant-filled bedroom",
    date: "28 May 2026",
    author: "Karmo Desk",
    excerpt:
      "Thread count gets all the attention, but weave and fibre matter more once humidity climbs. Here is what we look for when we build a HomeTex range for this climate.",
  },
  {
    title: "Inside the plant: what a batch test looks like",
    href: "/blog/batch-testing",
    image: "/karmo/images/mattress/cloud-poster.jpg",
    alt: "Karmo mattress photographed above a bank of cloud",
    date: "09 May 2026",
    author: "Karmo Desk",
    excerpt:
      "Every pour is sampled before it becomes a product. We walk through the density, resilience and compression checks that a batch has to clear before it leaves the floor.",
  },
  {
    title: "Adhesives, quietly holding your furniture together",
    href: "/blog/adhesives",
    image: "/karmo/images/interiors/bedroom-neutral.jpg",
    alt: "Interior finished with materials bonded by Karmo adhesives",
    date: "21 April 2026",
    author: "Karmo Desk",
    excerpt:
      "The least visible division of the group is in almost every room it touches. A short look at where polymers and bonding agents do their work in a finished piece.",
  },
];

// Slide geometry lives here because both the basis and the transform have to
// agree on it — change the gap in one place only.
const GAP_REM = 1.25;
// One step a second. The slide transition below is kept well under this so a
// card comes to rest before the next step begins — at 900ms against a 1000ms
// gap the rail never actually stops, which reads as a judder rather than a
// carousel.
const AUTOPLAY_MS = 2000;
const SLIDE_MS = 550;

// How far a thumb has to travel before it counts as a swipe rather than a tap
// that wandered. Below this the card underneath simply opens.
const SWIPE_MIN = 45;

export default function Journal({ heading }) {
  const reduceMotion = useReducedMotion();
  const [perView, setPerView] = useState(1);
  const [rawIndex, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  // Two cards from md up, one below it. Starts at one so the server render and
  // the first client render agree; the effect corrects it before paint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setPerView(query.matches ? 2 : 1);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // The rail never rewinds. It carries two copies of the list, so once it has
  // travelled a full lap the view is pixel-identical to the start — at that
  // point the transition is switched off, the index is reset to zero, and the
  // transition is re-armed on the next frame. Nothing visible happens, so the
  // first card simply follows the last, round and round.
  const index = rawIndex;

  // The rail's position is mirrored into a ref so `go` can look at where it
  // currently is without a functional updater — it needs to decide whether this
  // step runs off the front before it touches any state.
  const indexRef = useRef(0);
  const owedBack = useRef(false);

  // Assigning to a ref is not a state update, so this is safe in an effect and
  // costs no extra render.
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const go = useCallback((step) => {
    const next = indexRef.current + step;

    // Going back from the first card would run the rail off its own left edge
    // and leave a blank column where the card should be — the left arrow has
    // always done this, and a swipe makes it easy to hit. So it becomes the
    // forward wrap in reverse: hop silently onto the identical card in the
    // second copy, then take the step back from there on the next frame, which
    // reads as one ordinary slide.
    if (next < 0) {
      owedBack.current = true;
      setAnimate(false);
      setIndex(posts.length);
      return;
    }

    setIndex(next);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, paused, reduceMotion]);

  // Let the last slide land, then jump back with the transition suppressed.
  useEffect(() => {
    if (index !== posts.length) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index]);

  // Re-arm on the frame after a silent snap, and pay back the step owed by a
  // backward wrap.
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => {
      setAnimate(true);
      if (owedBack.current) {
        owedBack.current = false;
        setIndex((current) => current - 1);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  // Swipe. On a phone the arrows are the only way through the posts, and a
  // carousel that will not take a thumb reads as broken — so touch and pen
  // drag the rail. Mouse is deliberately left out: dragging would fight text
  // selection, and a mouse already has the arrows and the hover pause.
  const swipe = useRef({ from: 0, tracking: false, dragged: false });

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { from: event.clientX, tracking: true, dragged: false };
    setPaused(true); // stop the rail sliding out from under the thumb
  };

  const onPointerMove = (event) => {
    if (!swipe.current.tracking) return;
    if (Math.abs(event.clientX - swipe.current.from) > 8) {
      swipe.current.dragged = true;
    }
  };

  const onPointerUp = (event) => {
    if (!swipe.current.tracking) return;
    const travelled = event.clientX - swipe.current.from;
    swipe.current.tracking = false;

    if (Math.abs(travelled) > SWIPE_MIN) go(travelled < 0 ? 1 : -1);
    setPaused(false);
  };

  // A swipe ends over a card, so without this every swipe would also open the
  // post underneath it.
  const onClickCapture = (event) => {
    if (!swipe.current.dragged) return;
    swipe.current.dragged = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = VIEWPORT;

  // A slide is an even share of the viewport once the gaps are taken out, and
  // one step moves the track by exactly one slide plus one gap.
  const slide = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})`;
  const shift = `calc(-${index} * (${slide} + ${GAP_REM}rem))`;
  const doubled = [...posts, ...posts];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* This used to sit on a narrower measure of its own — 1180px, centred,
          with another 40px of padding inside that — to read as a quieter
          footnote. It also put this heading on a left edge no other section
          shared, and one that moved as the window widened. The page gutter
          wins: every heading now starts at the same place. */}
      <div className="shell">
        <div className="grid w-full gap-9 lg:grid-cols-3 lg:gap-10">
        {/* Carousel — two cards in view, advancing one at a time. */}
        {/* min-w-0 is load-bearing. A grid item defaults to min-width:auto, so
            without it this column refuses to shrink below the full width of all
            eight cards laid end to end, and the section runs off the side of a
            phone. */}
        <div
          className="min-w-0 lg:col-span-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div
            variants={group}
            {...reveal}
            viewport={once}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            {heading ?? (
              <div>
                <span className="block overflow-hidden">
                  <motion.span
                    variants={line}
                    className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
                  >
                    <span className="h-px w-10 bg-brand" />
                    Our blog
                  </motion.span>
                </span>

                <h2 className="display mt-5 text-[1.6rem] font-light leading-[1.15] text-ink sm:text-[2rem]">
                  <span className="block overflow-hidden pb-[0.06em]">
                    <motion.span variants={line} className="block">
                      Follow the
                      <span className="font-bold"> latest news</span>
                    </motion.span>
                  </span>
                </h2>
              </div>
            )}

            {/* ml-auto keeps these on the right once the heading takes the
                whole line to itself and they wrap onto their own row, which is
                what happens on any phone. */}
            <motion.div
              variants={fade}
              className="ml-auto flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous posts"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white sm:h-9 sm:w-9"
              >
                <FiArrowLeft className="text-[15px]" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next posts"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white sm:h-9 sm:w-9"
              >
                <FiArrowRight className="text-[15px]" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fade}
            {...reveal}
            viewport={once}
            className="mt-9 overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}
            // pan-y lets the page still scroll vertically through the carousel;
            // without it the browser claims the horizontal gesture too and the
            // swipe never reaches these handlers.
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="flex"
              style={{
                gap: `${GAP_REM}rem`,
                transform: `translateX(${shift})`,
                transition:
                  reduceMotion || !animate
                    ? "none"
                    : `transform ${SLIDE_MS}ms cubic-bezier(${SWEEP.join(",")})`,
              }}
            >
              {doubled.map((post, position) => {
                // Cards scrolled out of view stay in the DOM, so they are taken
                // off the tab order rather than being focusable off-screen.
                // The second copy of the list is decoration only — it exists to
                // cover the seam — so it is hidden from assistive tech outright.
                const isCopy = position >= posts.length;
                const visible =
                  !isCopy && position >= index && position < index + perView;

                return (
                  <article
                    key={`${post.href}-${position}`}
                    aria-hidden={!visible}
                    className="shrink-0"
                    style={{ flexBasis: slide }}
                  >
                    <Link
                      href={post.href}
                      tabIndex={visible ? undefined : -1}
                      className="group block"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.alt}
                          fill
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 42vw, 100vw"
                          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                        />
                      </div>

                      <h3 className="display mt-5 text-[1rem] font-semibold leading-snug text-ink transition-colors duration-500 group-hover:text-brand">
                        {post.title}
                      </h3>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/55">
                        <span className="flex items-center gap-2">
                          <FiCalendar className="text-brand" />
                          {post.date}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-ink/25" />
                        <span>
                          By{" "}
                          <span className="font-semibold text-ink/75">
                            {post.author}
                          </span>
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-[13.5px] leading-[1.75] text-ink/60">
                        {post.excerpt}
                      </p>

                      <span className="mt-5 inline-block text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                        Read more
                        <span className="mt-1 block h-px w-full bg-ink/30">
                          <span className="block h-px w-0 bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                        </span>
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Static panel — the carousel moves beside it, this stays put. */}
        <motion.aside
          {...reveal}
          viewport={once}
          className="relative min-h-[320px] overflow-hidden lg:min-h-full"
        >
          <motion.div variants={zoomOut} className="absolute inset-0">
            <Image
              src="/karmo/images/products/journal-panel.jpg"
              alt="Living-room corner with a linen sofa, cushions and a carved side table"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Weighted to the bottom, where the copy sits. */}
          <div className="absolute inset-0 bg-gradient-to-t from-shade-deep via-shade-deep/45 to-shade-deep/10" />

          <div className="relative flex h-full flex-col justify-end p-6">
            <h3 className="display text-[1.3rem] font-bold leading-[1.2] text-white sm:text-[1.45rem]">
              Design your comfort
              <br />
              with Karmo experts
            </h3>

            <Link
              href="/contact"
              className="group mt-5 inline-flex w-fit flex-col text-[10px] font-bold uppercase tracking-[0.16em] text-white"
            >
              Let&rsquo;s get started
              <span className="mt-1 block h-px w-full bg-white/45">
                <span className="block h-px w-0 bg-brand transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </span>
            </Link>
          </div>

          <motion.span
            aria-hidden="true"
            variants={curtainUp}
            className="absolute inset-0 z-10 bg-white"
          />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
