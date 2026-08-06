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
    <section className="relative min-h-[520px] w-full overflow-hidden bg-[#f4efe8] lg:h-[calc(100svh-174px)] lg:min-h-[460px] lg:max-h-[43vw]">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
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

      <div className="shell relative flex h-full min-h-[520px] items-center py-16 lg:min-h-0">
        {/* The hero sets its own type rather than borrowing `SectionHeading`.
            That component is the shared treatment for the *sections* — one
            scale, capped at 2.45rem, deliberately even from section to section
            — and a hero wearing it reads as one more section rather than as
            the top of the page. The words are unchanged; only the setting is.

            Three things carry the change: size (39px to a fluid 34-50px),
            leading (1.02 down to 0.92, so two lines lock into one block), and
            tracking (+0.01em out to -0.02em — wide letterspacing on a large
            caps headline is what dates it). */}
        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          /* Nudged down off dead centre. The flex parent centres this block,
             which put equal air above and below it; sitting a little low reads
             as deliberate placement in the room rather than as a block dropped
             in the middle of the frame. `translate` rather than a margin so
             the centring maths underneath is left alone. */
          className="max-w-[40rem] translate-y-5 text-left lg:translate-y-7"
        >
          {/* The badge interrupts the sentence rather than sitting beside it —
              "BANGLADESH'S" to its left, "FOAM BRAND" to its right — which is
              how the client's artwork uses it. `flex-wrap` so the phrase breaks
              either side of the badge on a narrow phone rather than shrinking
              it. */}
          <motion.div
            variants={rise}
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            <span className="text-[14px] font-bold uppercase tracking-[0.1em] text-white sm:text-[16px] lg:text-[18px]">
              Bangladesh&rsquo;s
            </span>
            {/* Lifted off the row's centre line, and the amount is measured
                rather than eyeballed: scanning the file for rows that read as
                the ribbon's red puts the ribbon between 41% and 75% of the
                badge's height, so its centre is at 58% — 8% *below* the middle
                of the picture. `items-center` lines up the picture's middle
                with the text's, which therefore hangs the ribbon low and
                leaves the gold "1" looking sunk. Raising it 10% of its own
                height puts the ribbon just above the text's centre line and
                lets the numeral rise, which is how the artwork is drawn.

                A percentage, not pixels, so it holds at both badge sizes.

                `width`/`height` are the file's own, so the space is reserved
                before it loads and the line does not jump. The rendered size
                comes from the height class; `w-auto` keeps the ratio. */}
            <Image
              src={badge.src}
              alt=""
              width={badge.width}
              height={badge.height}
              className="h-12 w-auto shrink-0 -translate-y-[10%] lg:h-14"
            />
            {/* "Foam Brand", the client's own wording on their site, not the
                "Home Brand" this said before. Worth knowing they are not the
                same claim: the group is four divisions and Home Brand covers
                all of them, while Foam Brand is the foam division's. One word
                to switch back. */}
            <span className="text-[14px] font-bold uppercase tracking-[0.1em] text-white sm:text-[16px] lg:text-[18px]">
              Foam Brand
            </span>
          </motion.div>

          {/* An `h1`, not the `h2` the shared heading renders. This is the
              homepage now, and it had no first-level heading at all.
              `font-normal!` and `leading-[0.92]!` because globals.css sets
              `h1 { font-weight: 600; line-height: 1.2 }` outside any cascade
              layer, and an unlayered rule beats a layered Tailwind utility
              whatever its specificity. Without the bangs this renders at 600
              weight on 1.2 leading — which is most of what made it read as a
              section heading in the first place.

              The words are the client's, off their own site: Generic 9 in
              `docs/copy/taglines.md`, "We Create The Chemistry Of Comfort".
              (That file pencils Generic 9 in for the Chemicals division page
              rather than a homepage hero — the client has since used it as
              their hero line, so the note there is out of date.)

              Broken into three lines the way their artwork breaks it, rather
              than left to wrap: "COMFORT" alone on the last line is what gives
              the block its shape, and a wrap would put it wherever the column
              width happened to land.

              One weight throughout, which is most of why the reference reads
              as a hero: at this size the eye takes the block as a single
              shape, and a weight change inside it splits the shape in two.

              The lines are shorter than the ones they replaced, so the ceiling
              goes up — "CHEMISTRY OF" at 5rem is 595px inside an 832px column.
              The floor is what keeps the longest of the three on one line in a
              375px phone's 327px column. */}
          <h1 className="display mt-2 text-[clamp(2.05rem,4.9vw,4.25rem)] font-bold! uppercase leading-[0.95]! tracking-[-0.015em] text-white lg:mt-3">
            {["We Create the", "Chemistry of", "Comfort"].map((ln) => (
              <span key={ln} className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={lineReveal} className="block">
                  {ln}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* A supporting paragraph stood here — "Foam, mattresses, bedding
              and the chemistry that holds them together…". The client's
              artwork carries the eyebrow and the headline and nothing else, so
              it is gone rather than kept as a fourth voice under a line that
              already says the whole thing. The buttons stay: they are the way
              out of the hero, not more copy. */}

          {/* Square, like everything else on this page — the 4px these carried
              was the last radius left in the hero. Tracking comes in from
              0.14em: at 12px caps that was doing the same spreading the eyebrow
              was, and a button label wants to read as one word. */}
          <motion.div
            initial={reduceMotion ? false : rise.hidden}
            whileInView={rise.show}
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/products"
              className="btn-primary group inline-flex h-[52px] items-center gap-3 bg-brand px-9 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
            >
              Shop the range
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/find-store"
              /* Reversed with the rest: an ink outline is invisible on a
                 veiled photograph, and the hover fills white and inks the
                 label rather than the other way round. */
              className="group inline-flex h-[52px] items-center gap-3 border border-white/50 px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
            >
              <FiMapPin className="text-base" />
              Find a store
            </Link>
          </motion.div>

          {/* The slide dots stood here. With one picture there is nothing for
              them to switch between, and a single dot is a control that does
              nothing — so they are gone rather than disabled. */}
        </motion.div>
      </div>
    </section>
  );
}
