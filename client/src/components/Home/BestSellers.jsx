"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";

/**
 * Best Sellers — the product carousel the blueprint calls for (page 1 of
 * WebSite BluePrint.pdf; the "Best Sellers" block in the reference build is
 * bbt.png).
 *
 * Every name below is a real product from "Site Reference Final.xlsx", and the
 * spec line under it is the sub-menu that product sits in — nothing here is
 * invented. What is NOT verified is which products actually sell best: Karmo
 * has supplied no sales figures, so this is an even spread across three
 * divisions, not a ranking. Reorder the array once real numbers arrive.
 *
 * Imagery: every card now carries Karmo's own campaign photograph of the exact
 * product named on it — the artwork itself carries the product name, so the
 * label and the picture cannot drift apart. Note those files are campaign
 * posters: several have a discount flash and a price burned into the artwork,
 * which the card's bottom scrim only partly covers. See §6.6 of
 * HOMEPAGE-STATUS.md — clean product cut-outs are the fix.
 */
const products = [
  {
    name: "Karmo EuroTop Pocket Spring",
    division: "Mattress",
    spec: "12 inch, pocket spring",
    href: "/mattress",
    image: "/images/mattress-euro-top-pocket.jpg",
    alt: "Karmo Euro Top Pocket Spring mattress on a cane bed",
  },
  {
    name: "Karmo King Mattress",
    division: "Mattress",
    spec: "4 inch, 81 × 69",
    href: "/mattress",
    image: "/images/mattress-king.jpg",
    alt: "Karmo King mattress in a sunlit bedroom",
  },
  {
    name: "Karmo Prestige Mattress",
    division: "Mattress",
    spec: "4 inch, 81 × 69",
    href: "/mattress",
    image: "/images/mattress-prestige.jpg",
    alt: "Karmo Prestige mattress on a low timber platform bed",
  },
  {
    name: "Karmo Pocket Spring — Pillow Top",
    division: "Mattress",
    spec: "12 inch, pillow top",
    href: "/mattress",
    image: "/images/mattress-pillow-top-pocket.jpg",
    alt: "Karmo Pillow Top Pocket Spring mattress on a cane bed",
  },
  {
    name: "Karmo 280",
    division: "Foam",
    spec: "Furniture & upholstery",
    href: "/foam",
    image: "/images/foam-karmo-280.jpg",
    alt: "Stack of red Karmo 280 foam blocks",
  },
  {
    name: "Karmo Poly",
    division: "Foam",
    spec: "Furniture & upholstery",
    href: "/foam",
    image: "/images/FurnitureFoam4.png",
    alt: "Stack of Karmo Poly foam sheets",
  },
];

const SETTLE = [0.22, 1, 0.36, 1];

// The rail is a native scroll container rather than a transformed track, so
// touch, trackpad and screen-reader navigation all work without being
// reimplemented. The arrows only drive scrollBy. This constant has to match
// the `gap-5` on the track — it is the one number the two share.
const GAP_PX = 20;

// Two notes on the track's classes, both of which look redundant and are not:
//
// `scroll-pl-*` mirrors the `px-*` gutter. Without it the first card's
// snap-start sits one gutter in from the container's origin, the rail can
// never rest at scrollLeft 0, and the "at the start" test below reads false
// on a rail nobody has touched.
//
// There is deliberately no `scroll-smooth` class. CSS scroll-behavior wins
// over the `behavior: "auto"` this component asks for when motion is reduced,
// so the smoothing is left entirely to the scrollBy call.

const group = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: SETTLE } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: SETTLE } },
};

function Arrow({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export default function BestSellers() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // Two pixels of slack. A smooth scroll routinely lands a fraction short of
    // the true end, and without the tolerance the forward arrow would stay
    // enabled on a rail that cannot move any further.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    sync();
    el.addEventListener("scroll", sync, { passive: true });

    // Card width is a viewport unit, so the end position changes on resize.
    const observer = new ResizeObserver(sync);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const step = useCallback(
    (direction) => {
      const el = trackRef.current;
      if (!el) return;

      // Measure a real card rather than assuming the breakpoint, so one step
      // always lands the next card flush against the snap edge.
      const first = el.querySelector("[data-card]");
      const distance = first
        ? first.getBoundingClientRect().width + GAP_PX
        : el.clientWidth * 0.8;

      el.scrollBy({
        left: direction * distance,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion]
  );

  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };
  const once = { once: true, amount: 0.2 };

  return (
    <section className="bg-linen py-20 md:py-24">
      <motion.div
        variants={group}
        {...reveal}
        viewport={once}
        className="shell flex flex-wrap items-end justify-between gap-8"
      >
        <div>
          <span className="block overflow-hidden">
            <motion.span
              variants={line}
              className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand"
            >
              <span className="h-px w-10 bg-brand" />
              Best sellers
            </motion.span>
          </span>

          <h2 className="display mt-5 max-w-xl text-[1.75rem] font-light leading-[1.15] text-ink sm:text-[2.15rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                The pieces
                <span className="font-bold"> worth starting with</span>
              </motion.span>
            </span>
          </h2>
        </div>

        <div className="flex items-end gap-8">
          <span className="hidden max-w-xs overflow-hidden sm:block">
            <motion.span
              variants={line}
              className="block text-[13px] leading-relaxed text-ink/55"
            >
              Foam, mattress and HomeTex side by side — a cross-section of the
              range in one rail.
            </motion.span>
          </span>

          {/* Hidden from assistive tech: the rail below is a scroll container
              and is already reachable and operable on its own. */}
          <div className="flex shrink-0 gap-3" aria-hidden="true">
            <Arrow
              label="Previous products"
              onClick={() => step(-1)}
              disabled={atStart}
            >
              <FiArrowLeft />
            </Arrow>
            <Arrow
              label="Next products"
              onClick={() => step(1)}
              disabled={atEnd}
            >
              <FiArrowRight />
            </Arrow>
          </div>
        </div>
      </motion.div>

      <motion.div variants={group} {...reveal} viewport={once}>
        {/* The gutter is padding on the track, not margin on the section, so
            the first card starts on the same line as the headline while the
            rest of the rail still runs to the edge of the screen. */}
        <ul
          ref={trackRef}
          tabIndex={0}
          role="list"
          aria-label="Best selling Karmo products"
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-6 px-6 pb-4 [scrollbar-width:none] focus-visible:outline-none md:scroll-pl-14 md:px-14 lg:scroll-pl-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <motion.li
              key={product.name}
              variants={card}
              data-card
              className="w-[76vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[21vw]"
            >
              <Link
                href={product.href}
                className="group/card relative block aspect-[3/4] overflow-hidden rounded-2xl bg-shade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-linen"
              >
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(min-width: 1280px) 21vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 76vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.07]"
                />

                {/* Reaches two thirds up the card. The caption sits on the
                    solid end of it, so the type never has to compete with
                    whatever the photograph is doing underneath. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-shade-deep/95 via-shade-deep/45 to-transparent"
                />

                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
                  {product.division}
                </span>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <span className="min-w-0">
                    <span className="display block text-[15px] font-bold leading-snug text-white sm:text-base">
                      {product.name}
                    </span>
                    <span className="mt-1 block text-[12px] text-white/70">
                      {product.spec}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-500 group-hover/card:rotate-90 group-hover/card:bg-brand"
                  >
                    <FiPlus />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
