"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

import SectionHeading, { Accent } from "@/components/karmo/SectionHeading";
import { rise } from "@/components/karmo/motion";

/**
 * The Home 02 hero — two rooms behind one piece of copy.
 *
 * ── The slides ─────────────────────────────────────────────────────────────
 * They dissolve into each other rather than sliding. A slide would drag the
 * furniture across the words; a dissolve leaves the copy where it is and
 * changes only what is behind it, which is the whole idea here — one claim,
 * more than one room it is true of.
 *
 * Both pictures were chosen on the same rule, and it is the rule that makes
 * this work: the left 45% of each is bare wall. **Any third slide has to obey
 * it too** — left 45% empty — or the copy lands on furniture and the whole
 * arrangement has to be rethought. The veil below helps the type read; it
 * cannot rescue a picture with a sofa where the headline goes.
 *
 * ── The box ────────────────────────────────────────────────────────────────
 * It fills what the window has left under the header (182px from lg up, 114px
 * below), but is capped at `43vw` tall — both pictures are 2.33:1, and 43vw is
 * that same ratio. Uncapped, a short-but-wide window forces a box narrower
 * than 2.33:1 and `object-cover` has to zoom in to cover it, cropping deep
 * into the room. Capped, the box never gets narrower than the photo, so the
 * crop stays vertical (ceiling/floor) instead of eating the sides. What little
 * horizontal crop is left over comes off the left (the bare wall), not the
 * right (the furniture).
 */
const slides = [
  {
    src: "/karmo/images/home-02/hero/slide-01-family-lounge.webp",
    alt: "A family sitting together on a cream bouclé sofa in a sunlit living room, a walnut armchair and an olive tree on the right, and an empty plaster wall beside them",
  },
  {
    src: "/karmo/images/home-02/hero/slide-02-armchair.webp",
    alt: "A bouclé and walnut armchair beside a fluted side table and a black dome lamp, against a bare plaster wall",
  },
];

/* Long enough to look at a room, short enough that the second one is seen
   before most visitors have scrolled past. */
const DWELL_MS = 6500;
const FADE_MS = 1100;

export default function HeroTwo() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (next) => setIndex(((next % slides.length) + slides.length) % slides.length),
    []
  );

  // No autoplay when motion is turned down — the first room simply stays.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), DWELL_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="relative min-h-[520px] w-full overflow-hidden bg-[#f4efe8] lg:h-[calc(100svh-182px)] lg:min-h-[460px] lg:max-h-[43vw]">
      {/* Every slide is mounted and only opacity moves, so the change costs no
          layout and the browser has already decoded the incoming picture by
          the time it is needed. Two images is cheap; a long list would not be
          and would want mounting on demand instead. */}
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover object-right transition-opacity ease-in-out"
          style={{
            opacity: i === index ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
        />
      ))}

      {/* No veil. Two were tried — a left-to-right white fade, which drew a
          hard seam down the middle of the frame, and a flat dark one with the
          type reversed out in white. Neither beat leaving the photograph
          alone: both rooms were shot with their left 45% bare, and ink on that
          wall measures about 13:1 where 4.5:1 is the bar. A scrim here is
          solving a problem these pictures do not have. */}

      <div className="shell relative flex h-full min-h-[520px] items-center py-16 lg:min-h-0">
        <div className="max-w-[30rem]">
          {/* Both lines come straight from the client's approved list in
              `docs/copy/taglines.md` — nothing here is invented.

              The headline is Generic 16, "Decades of Craft, Designed for
              Today", split at its own comma: three words over three, the first
              light and the second bold in the brand red. It earns the hero
              because it says both halves of what these pictures show — sixty
              years of making, in rooms built for now. The copy does not change
              with the slide; one claim, two rooms it is true of. */}
          <SectionHeading
            eyebrow={
              <>
                Bangladesh&rsquo;s No.
                {/* The numeral carries the line, so it is set larger and
                    heavier than the words around it, and its tracking is reset
                    to zero — the eyebrow's 0.3em would otherwise push the
                    figure away from the "No." it belongs to. */}
                <span className="display mx-[3px] align-[-0.06em] text-[19px] font-extrabold leading-none tracking-[0]">
                  1
                </span>{" "}
                Home Brand
              </>
            }
            title={["Decades of Craft,", <Accent key="a">Designed for Today</Accent>]}
            lead="Foam, mattresses, bedding and the chemistry that holds them together — made in Karmo's own plants in Bangladesh since 1965."
          />

          <motion.div
            initial={reduceMotion ? false : rise.hidden}
            whileInView={rise.show}
            viewport={{ once: true }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/products"
              className="btn-primary group inline-flex h-12 items-center gap-3 rounded-[4px] bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
            >
              Shop the range
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/find-store"
              className="group inline-flex h-12 items-center gap-3 rounded-[4px] border border-ink/25 px-7 text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              <FiMapPin className="text-base" />
              Find a store
            </Link>
          </motion.div>

          {/* Real buttons, not decoration: the row advances on its own, but a
              visitor who wants the other room back should not have to wait for
              it to come round. */}
          <div className="mt-11 flex items-center gap-3">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show room ${i + 1} of ${slides.length}`}
                aria-current={i === index}
                className="group py-2"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    i === index
                      ? "w-10 bg-brand"
                      : "w-5 bg-ink/25 group-hover:bg-ink/45"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
