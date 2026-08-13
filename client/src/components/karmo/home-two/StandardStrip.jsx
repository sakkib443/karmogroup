"use client";

import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Home Two trust strip — six pillars in one full row.
 *
 * ── The artwork ─────────────────────────────────────────────────────────────
 * Illustrations now, not Feather glyphs. Four are the client's own files; two
 * are drawn to match them, and which is which matters if these are ever
 * revisited:
 *
 *   supplied   60 years, Recognised By, Sustainable, Free Delivery
 *   drawn      Trusted By (the supplied folder had five files for six
 *              pillars), and Stores — whose supplied file was a map of INDIA
 *              under a line reading "Pan Bangladesh". A Bangladesh outline
 *              was the obvious swap and was rejected: a national brand's own
 *              coastline drawn from memory is worse wrong than absent, so it
 *              is a shopfront instead. `CLIENT-FEEDBACK.md` records the same
 *              India/Bangladesh trap in the copy.
 *
 * The two drawn files follow the supplied set's grammar exactly — #484848
 * line art, one gradient element running blue through magenta — so the row
 * reads as one set rather than four plus two.
 *
 * ── All six are optically normalised, and that is not automatic ─────────────
 * Sizing these by their canvas is what `object-contain` does, and it is not
 * enough: the artwork inside each file sat at a different size, so at one box
 * size they read from 0.73 to 0.99 of it — a 36% spread the eye reads
 * immediately as "some too big, some too small". Every file has since been
 * retrimmed so the *drawn* content lands at 0.86 of its canvas: the rasters
 * repadded from the originals in `public/New folder/`, the two SVGs retuned
 * through their `viewBox` so they stay vector.
 *
 * `legacy-60-years` is the one exception at 0.75, and it cannot be fixed:
 * that drawing is 1.75:1, so matching the others on area would need it wider
 * than the square box allows. Anything dropped in here later needs the same
 * treatment, or it will stand out the way these did.
 *
 * ── Why the hover changed ───────────────────────────────────────────────────
 * The tile used to fill solid brand red and flip its glyph to white, which
 * only works while the glyph is a single colour it can flip. These are
 * full-colour and cannot, so the tile keeps its soft tint and grows instead.
 * `CartoonIcons.jsx` settled this rule already and names this component in
 * its own notes; the two files are meant to stay in step.
 */
const pillars = [
  {
    src: "/karmo/images/trust/legacy-60-years.png",
    title: "A legacy of 60 years",
    note: "of healthy sleep",
  },
  {
    src: "/karmo/images/trust/trusted-families.svg",
    title: "Trusted By Million",
    note: "families worldwide.",
  },
  {
    src: "/karmo/images/trust/recognised-super-brand.png",
    title: "Recognised By",
    note: "Super Brand",
  },
  {
    src: "/karmo/images/trust/stores-nationwide.svg",
    title: "5k+ Stores",
    note: "Pan Bangladesh",
  },
  {
    src: "/karmo/images/trust/sustainable-products.png",
    title: "Natural and",
    note: "Sustainable Products",
  },
  {
    src: "/karmo/images/trust/free-delivery.png",
    title: "Free Delivery",
    note: "Available",
  },
];

export default function StandardStrip() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  // The 6px seam below. Every other band on this page is separated from the
  // next by it — `DivisionEditorials` opens with the same `mt-1 md:mt-1.5`,
  // and the picture rows below carry it between tiles. This strip was the one
  // section still butted straight against its neighbour at 0.
  //
  // A margin, not padding: padding would extend the cream, and the gap has to
  // be the page showing through for it to match the others.
  return (
    <section className="mb-1 bg-cream/60 md:mb-1.5">
      <motion.ul
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12"
      >
        {pillars.map(({ src, title, note }, i) => (
          <motion.li
            key={title}
            variants={fade}
            className={`group text-center lg:px-3 xl:px-4 ${
              i === 0 ? "lg:pl-0" : ""
            } ${i === pillars.length - 1 ? "lg:pr-0" : ""} ${
              i > 0 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            {/* No tile behind the artwork — the icons carry their own colour
                and stand on the section's own background. A tinted disc came
                first and a square one after it; both were tried and both came
                back out, so this box is now only a sizing frame and the hover
                lift. Nothing here paints.

                It is still a fixed box rather than letting the image size the
                row: the six drawings have different aspect ratios, and
                without one frame around each the titles beneath them would
                sit at six different heights.

                The box is now the artwork's own size rather than larger than
                it. While a disc was painted here the extra 20px each side was
                the tint showing around the icon; with nothing painted it was
                just dead air holding the title away. */}
            <span className="mx-auto flex h-20 w-20 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem]">
              <img
                src={src}
                alt=""
                aria-hidden="true"
                width={88}
                height={88}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
              />
            </span>
            <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
              {title}
            </h3>
            <p className="body-copy mx-auto mt-1.5 max-w-[11rem] text-[12px] leading-[1.55] text-ink/55 xl:text-[12.5px]">
              {note}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
