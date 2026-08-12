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
        /* Prefer the quiet upper wall for type; keep the family in the right
           third. Anchoring too low pulled the sofa into the headline. */
        className="object-cover object-[72%_32%] sm:object-[74%_30%] lg:object-[80%_28%]"
      />

      {/* Dark veil — a notch lighter than the last pass, still enough for
          white type on the mustard wall. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(8,8,10,0.58) 0%, rgba(8,8,10,0.50) 35%, rgba(8,8,10,0.42) 60%, rgba(8,8,10,0.38) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/18 to-transparent"
      />

      <div className="shell relative flex h-full min-h-[480px] items-start py-14 sm:min-h-[520px] sm:items-center sm:py-16 lg:min-h-0 lg:items-center lg:pb-20 lg:pt-10">
        {/* Copy sits on the quiet wall above the sofa line — not dead-centre
            where the furniture cuts the headline. */}
        <motion.div
          variants={group}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="relative max-w-[40rem] text-left sm:max-w-[42rem] lg:max-w-[44rem] lg:-translate-y-6"
        >
          {SHOW_FOAM_BRAND_CLAIM ? (
            <motion.div variants={rise}>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 sm:text-[12px]">
                  Bangladesh&rsquo;s
                </span>
                <Image
                  src={badge.src}
                  alt=""
                  width={badge.width}
                  height={badge.height}
                  className="h-9 w-auto shrink-0 -translate-y-[10%] sm:h-10"
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 sm:text-[12px]">
                  Foam Brand
                </span>
              </div>
              <span
                aria-hidden
                className="mt-5 block h-px w-12 bg-white/40 sm:mt-6 sm:w-14"
              />
            </motion.div>
          ) : null}

          <h1
            className={`display text-[clamp(1.6rem,4.3vw,3.4rem)] font-bold! uppercase leading-[1.02]! tracking-[-0.015em] text-white [text-shadow:0_2px_28px_rgba(10,6,2,0.35)] ${
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
            className="mt-5 max-w-[22rem] text-[12.5px] font-medium leading-[1.65] tracking-[0.01em] text-white/78 sm:mt-6 sm:text-[13.5px]"
          >
            Foam, mattress and HomeTex — crafted in Bangladesh since 1965.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : rise.hidden}
            whileInView={rise.show}
            viewport={{ once: true }}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href="/products"
              className="btn-primary group inline-flex h-[50px] w-full items-center justify-center gap-2.5 bg-brand px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-12px_rgba(212,67,72,0.65)] transition-colors duration-300 hover:bg-brand-dark sm:h-[52px] sm:w-auto sm:justify-start sm:px-9 sm:text-[12px] sm:tracking-[0.12em]"
            >
              Shop the range
              <FiArrowRight className="text-[15px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/find-store"
              className="group inline-flex h-[50px] w-full items-center justify-center gap-2.5 border border-white/55 bg-white/5 px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-[2px] transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink sm:h-[52px] sm:w-auto sm:justify-start sm:px-8 sm:text-[12px] sm:tracking-[0.12em]"
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
