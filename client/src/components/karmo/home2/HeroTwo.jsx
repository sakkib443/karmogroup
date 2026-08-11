"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";

import { group, line as lineReveal, rise } from "@/components/karmo/motion";

/**
 * The Home 02 hero — one room behind one piece of copy.
 *
 * ── One picture, not two ───────────────────────────────────────────────────
 * This ran as a two-slide crossfade: two rooms dissolving into each other
 * under a claim that was true of both. The client replaced both with a single
 * made-for-Karmo scene — the sofa's tufting spells the name — and a picture
 * built to be the brand's own is not one of a set to rotate past. So the
 * autoplay, the dwell timer, the dissolve and the dot controls are all gone
 * rather than left running over a list of one.
 *
 * ── What the picture has to give the copy ──────────────────────────────────
 * The copy sits left, so the left of the frame has to stay quiet. This one
 * gives its left third to a flat golden wall — the brand's secondary colour —
 * with no shadow across it at all.
 *
 * Quiet is not the same as legible, and four pictures in a row have now made
 * that point differently. A warm plaster wall that looked bright measured
 * mid-taupe, and the brand red on it fell to 1.81:1 against a 3:1 bar. A
 * regrade of the same room lit the wall brighter and pushed the *white* type
 * under its bar instead. So no picture goes in on how it looks: the veil's
 * opacity is set by measuring the lightest pixel under each line, and every
 * replacement is measured again.
 *
 * ── The box ────────────────────────────────────────────────────────────────
 * It fills what the window has left under the header (174px from lg up, 106px
 * below), capped at `43vw` tall. The picture is 2.33:1 and 43vw is that same
 * ratio, which is why the cap is the number it is: it stops a short, wide
 * window forcing a box narrower than the photograph, where `object-cover`
 * would have to zoom in and eat the sides. Everything that matters here (the
 * bare wall, the sofa, the red sweep) is arranged left to right, so a
 * horizontal crop is the one this composition cannot afford.
 */
/**
 * The "1" badge is the client's own artwork, not a drawing of it.
 *
 * This was inline SVG for a while — paths for the numeral, a ribbon built out
 * of five more, `<text>` on the banner. It was close but it was a copy, and
 * the shading on the real one (the gradient down the gold, the fold where each
 * tail leaves the panel, the shadow the ribbon casts on the numeral) is not
 * something worth re-deriving in paths when the file exists.
 *
 * Trimmed of its transparent padding on the way in, from 360x360 down to
 * 275x216, because it has to sit in a line of type — padding baked into the
 * picture would push it off the line and no amount of CSS could pull it back.
 * WebP with alpha at 14 KB against 90 KB for the same thing as PNG.
 *
 * `alt=""`: the line around it already reads "Bangladesh's Number One Foam
 * Brand", so a screen reader naming the badge would say it twice.
 */
const badge = {
  src: "/karmo/images/home-02/hero/badge-number-one.webp",
  width: 420,
  height: 330,
};

/* "Bangladesh's [1] Foam Brand" claim — set false to park it for reuse elsewhere. */
const SHOW_FOAM_BRAND_CLAIM = true;

/**
 * The approved picture, and the reference every other image on this site is
 * matched against — the client signed it off as the brand's own look, so the
 * palette in it *is* the identity. `IMAGE-PROMPTS.md` §9 carries the measured
 * colours and the prompt that reproduces them.
 */
const hero = {
  src: "/karmo/images/home-02/hero/karmo-family-white-outfits.webp",
  alt: "A family of three in white and yellow sitting together on a cream sofa whose tufted back spells KARMO, against a golden-yellow wall beside a red panel, with an olive tree and a round travertine coffee table",
};

export default function HeroTwo() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[480px] w-full overflow-hidden bg-[#f4efe8] sm:min-h-[520px] lg:h-[calc(100svh-174px)] lg:min-h-[460px] lg:max-h-[43vw]">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] lg:object-right"
      />

      {/* A flat dark veil, and the type reversed out of it.

          Dark type on the unveiled picture did not work. On the room this
          replaced it measured 6.04:1 for the ink headline but 1.81:1 for the
          brand-red accent line, 2.14:1 for the eyebrow and 2.21:1 for the
          lead — three of four under the bar. Red is the worst thing to put on
          a warm wall: the two are close in luminance, so the letters sit on
          the background instead of over it.

          Flat, not a gradient. A left-to-right fade was tried earlier and its
          stops collapsed into a hard edge down the middle of the frame, which
          read as a divider rather than a veil. A flat veil cannot do that.

          48%, and the number is measured rather than chosen. It is set from
          the *lightest* pixel under each line — here a slant of window light
          on the golden wall at #f9dda8 — so the worst case is the one that
          clears the bar. It was 45% for the previous grade of this same room;
          this one relit the wall brighter and 45% left the eyebrow at 4.22:1
          and the lead at 3.77:1, both just under. **Any new picture needs this
          re-measured, not assumed** — two grades of one room have now wanted
          different numbers. */}
      <div aria-hidden className="absolute inset-0 bg-black/48" />

      <div className="shell relative flex h-full min-h-[480px] items-center py-12 sm:min-h-[520px] sm:py-16 lg:min-h-0">
        {/* Same copy, tighter professional setting: quiet claim → rule →
            even display block → support → CTAs. */}
        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative max-w-[44rem] translate-y-2 text-left lg:translate-y-4"
        >
          {SHOW_FOAM_BRAND_CLAIM ? (
            <motion.div variants={rise}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/80 sm:text-[12px]">
                  Bangladesh&rsquo;s
                </span>
                <Image
                  src={badge.src}
                  alt=""
                  width={badge.width}
                  height={badge.height}
                  className="h-9 w-auto shrink-0 -translate-y-[10%] sm:h-10"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/80 sm:text-[12px]">
                  Foam Brand
                </span>
              </div>
              <span
                aria-hidden
                className="mt-5 block h-px w-12 bg-white/35 sm:mt-6 sm:w-14"
              />
            </motion.div>
          ) : null}

          {/* Two lines and bigger, which needed the column widened to get both.
              "CHEMISTRY OF COMFORT" measures 12.28em in this face at this
              tracking — measured, not guessed — so at the old 34rem column the
              largest it could be on one line was 44px, *smaller* than the 46px
              the three-line version already ran at. Widening to 44rem raises
              that ceiling to 57px, and 4.3vw sits at 55 with room to spare.

              Written out rather than left to wrap — a wrap breaks wherever the
              column happens to end, and that moves with the window. */}
          <h1
            className={`display text-[clamp(1.6rem,4.3vw,3.4rem)] font-bold! uppercase leading-[1.02]! tracking-[-0.015em] text-white ${
              SHOW_FOAM_BRAND_CLAIM ? "mt-5 sm:mt-6" : "mt-0"
            }`}
          >
            {["We create the", "Chemistry of Comfort"].map((ln) => (
              <span key={ln} className="block overflow-hidden pb-[0.04em]">
                <motion.span variants={lineReveal} className="block">
                  {ln}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-[20.5rem] text-[12.5px] font-medium leading-[1.65] tracking-[0.01em] text-white/68 sm:mt-7 sm:text-[13.5px]"
          >
            Foam, mattress and HomeTex — crafted in Bangladesh since 1965.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : rise.hidden}
            whileInView={rise.show}
            viewport={{ once: true }}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href="/products"
              className="btn-primary group inline-flex h-[50px] w-full items-center justify-center gap-2.5 bg-brand px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-brand-dark sm:h-[52px] sm:w-auto sm:justify-start sm:px-9 sm:text-[12px] sm:tracking-[0.12em]"
            >
              Shop the range
              <FiArrowRight className="text-[15px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/find-store"
              className="group inline-flex h-[50px] w-full items-center justify-center gap-2.5 border border-white/40 bg-transparent px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink sm:h-[52px] sm:w-auto sm:justify-start sm:px-8 sm:text-[12px] sm:tracking-[0.12em]"
            >
              <FiMapPin className="text-[15px]" />
              Find a store
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
