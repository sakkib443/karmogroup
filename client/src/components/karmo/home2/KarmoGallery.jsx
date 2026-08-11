"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The campaign wall — four tiles in a bento, labelled and nothing more.
 *
 * This is the client's own `album-wrapper` section rebuilt. On their site it is
 * five square campaign posters pinned to a board at slight rotations
 * (`images/dom1..dom5`, the Boishakh and Karmo Foam social posts). The content
 * carries over — their artwork, their offers — but the scrapbook does not: five
 * rotated squares of the same size give the eye nowhere to land, and the posts
 * are seasonal, so a fixed five-up goes stale the moment one is replaced.
 *
 * A bento fixes both. One tile is plainly the largest, so there is a first
 * thing to look at; the rest are lifestyle photography rather than more
 * posters, which is what keeps the block from reading as an advert board.
 *
 * Copy is two lines a tile — an eyebrow and a title. Only the lead tile gets a
 * sentence, and it is the one whose picture already carries the offer.
 */

/**
 * The lead tile is a poster, so it is `contain` on its own paper colour rather
 * than `cover`. Cropping it would take the logo off the top-left corner and the
 * hotline off the bottom — the two things on it that are not decoration. Every
 * other tile is a photograph and crops safely; each crop below was rendered and
 * checked before the ratios here were fixed.
 */
const tiles = [
  {
    id: "art-of-rest",
    /* No label on this one. The artwork already carries "The Art of Rest /
       Ultimate Comfort" set into the picture, so the tile's own caption would
       print the same two lines a second time, a few centimetres below. The
       words are still in the `alt` for anyone who cannot see the image. */
    src: "/karmo/images/home-02/gallery/01-art-of-rest-ultimate-comfort.webp",
    alt: "The Art of Rest — Ultimate Comfort. A woman asleep on a white pillow under a black Karmo comforter printed with gold palm fronds",
    span: "lg:col-start-1 lg:row-span-2 lg:row-start-1",
    ratio: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 35vw, 100vw",
  },
  {
    id: "breathable",
    eyebrow: "Premium materials",
    title: "Breathable",
    src: "/karmo/images/home-02/gallery/02-breathable-bedroom.webp",
    alt: "A made bed in warm neutral linen beside a ribbed oak nightstand and a lit ceramic lamp",
    span: "lg:col-start-2 lg:row-start-1",
    ratio: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 33vw, 100vw",
  },
  {
    id: "engineered",
    eyebrow: "Precision craft",
    title: "Engineered",
    src: "/karmo/images/home-02/gallery/03-engineered-green-bedroom.webp",
    alt: "A couple reading together on the rug of a green-walled bedroom, beside a tan buttoned bed and a walnut wardrobe, under an arched window onto the garden",
    span: "lg:col-start-3 lg:row-start-1",
    ratio: "aspect-[16/10]",
    sizes: "(min-width: 1024px) 33vw, 100vw",
  },
  {
    id: "better-tomorrow",
    eyebrow: "Deep sleep",
    title: "A Better Tomorrow",
    src: "/karmo/images/home-02/gallery/04-better-tomorrow-sleeping-comforter.webp",
    alt: "A woman asleep on a white pillow under a black comforter printed with gold palm fronds",
    span: "lg:col-span-2 lg:col-start-2 lg:row-start-2",
    ratio: "aspect-[2/1]",
    /* Two columns plus the gap — nearly twice the others. Sharing one `sizes`
       across all four tiles is what made this one soft: the browser was told
       45vw, picked a candidate for that, and then stretched it across 67. */
    sizes: "(min-width: 1024px) 67vw, 100vw",
  },
];

function Tile({ tile }) {
  const contain = tile.fit === "contain";

  return (
    <motion.article
      variants={fade}
      className={`group relative overflow-hidden ${tile.ratio} ${tile.span} lg:aspect-auto lg:h-full`}
      style={{ backgroundColor: tile.pad || "#EFE9E3" }}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        sizes={tile.sizes}
        className={`${
          contain ? "object-contain" : "object-cover"
        } transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]`}
      />

      {/* No scrim — the client asked for the pictures to be shown undimmed.
          The labels sit straight on the photograph, so nothing is holding the
          type off it any more; see the note in the component header.

          A tile whose artwork already has its wording set into the picture
          carries no caption at all, rather than an empty one — an unguarded
          block still lays out its padding and would push a stray gap into the
          corner of the tile. */}
      {tile.title ? (
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/70 sm:text-[11px]">
            {tile.eyebrow}
          </p>
          <h3 className="mt-1.5 text-[1.15rem] font-semibold! leading-[1.2]! text-white sm:text-[1.3rem] lg:text-[1.55rem]">
            {tile.title}
          </h3>
          {tile.body ? (
            <p className="body-copy mt-2 max-w-[24rem] text-[12.5px] leading-[1.6] text-white/75 sm:text-[13px]">
              {tile.body}
            </p>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}

export default function KarmoGallery() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  // One screenful for the pictures, and the separating band outside it.
  //
  // 178px is the header, measured — not the 146px this first used. That figure
  // came from the division strip, which was written when the announcement band
  // still rolled away on scroll and the bar shrank to 146. The client later
  // asked for both rows to stay put, so the bar is now 178 at rest and 178
  // scrolled; the old subtraction would have left a 32px strip of the next
  // section showing.
  //
  // The `+7rem` matches `py-14` on both edges, so the padding is added to the
  // section rather than taken out of the grid: the tiles get the full
  // screenful and the section still reads as separate from its neighbours,
  // which is the arrangement the division strip settled on.
  return (
    <section
      className="bg-white py-14 lg:flex lg:h-[calc(100svh-178px+7rem)] lg:flex-col lg:justify-center"
      aria-label="Karmo campaigns"
    >
      {/* Full-bleed, so no `.shell` — the tiles run edge to edge like the
          shoppable scene and the division strip rather than sitting on the
          reading column. */}
      {/* Back on the page's normal column. `.shell` is the same measure the
          hero, the foam story and the partner strip sit on — 1600px capped,
          with the site's own gutters — so this block now lines up with them
          instead of running to the window edges. */}
      {/* `w-full` is load-bearing, not padding for the class list. The section
          is a column flex container from lg up (that is what centres this
          block in the screenful), and `.shell` carries `margin-inline: auto`.
          An auto margin on a flex item overrides the default stretch, so
          without an explicit width the shell shrink-wraps its contents — it
          measured 184px against the foam story's 1272px, which is the collapse
          that showed up on the page. Width first, then `max-width: 1600px` and
          the auto margins do their usual job of capping and centring it. */}
      <div className="shell w-full lg:h-full">
        {/* No section heading, by design and by instruction — the tiles carry
            their own labels, and a heading over them would be a third level of
            type competing with two that are already there.

            The grid is given a height at lg (`aspect`) and the tiles fill it,
            rather than each tile setting its own. Their ratios differ, so
            letting them size themselves leaves the two columns ending at
            different points — the same drift that had to be fixed in the foam
            section. Below lg they stack and their own ratios take over. */}
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="grid gap-3 lg:h-full lg:grid-cols-[1.06fr_1fr_1fr] lg:grid-rows-[1fr_1.12fr]"
        >
          {tiles.map((tile) => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
