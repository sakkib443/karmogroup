"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { popularProducts, discountPercent } from "@/components/karmo/home2/popularProducts";

/**
 * Popular Products — OPTION A of two, built to the first reference the client
 * sent: the quiet catalogue row.
 *
 * Option B is `PopularProductsOffers`. Both are on the page at once, both read
 * the same three products out of `popularProducts`, and both carry the same
 * heading — the client asked for identical pictures across the two so that what
 * is being judged is the treatment and nothing else. Whichever loses gets
 * deleted along with the marker bar above it; the data file stays.
 *
 * ── What this design is arguing ────────────────────────────────────────────
 * That the product should be the loudest thing in its tile and nothing else
 * should compete. So: no buttons, no ribbons, no discount maths. A pale field,
 * the photograph, and underneath it the four facts a buyer actually sorts on —
 * what it is, what it costs, what it is made of, and what it comes in.
 *
 * It is the harder design to fill and the better one to live with. Harder,
 * because a tile with this much air only works if the photograph is cut out or
 * shot on a flat field, and Karmo has none of that yet. Better, because nothing
 * in it expires when a campaign ends.
 *
 * Read it against Option B on the two places they genuinely disagree, because
 * everything else is decoration:
 *
 *   · **The saving.** Option B strikes the old price through and prints the
 *     percentage. This shows the price you pay and marks the tile SALE, and
 *     that is all. It is the weaker sell and the one that does not turn the row
 *     into a permanent clearance rack.
 *   · **The way out.** Option B ends in a button. Here the whole tile is the
 *     link, and the reader is expected to want the product before they want to
 *     order it.
 *
 * ── Where it departs from the reference ────────────────────────────────────
 * The reference repeats one line of poetry under every product — the same
 * "solid in construction, simple in form" on all four. That works for a
 * furniture brand whose products differ mainly in shape. Karmo sells foam by
 * grade, and a buyer choosing between 280 and 4G needs the grade, not a mood.
 * So the second line is per-product and factual, off the client's own posters.
 *
 * Four across, at the client's ask and as the reference has it. The fourth
 * product is a mattress rather than a combo, and it is not on offer — see
 * `popularProducts` for why that is the honest way to reach four and not a
 * compromise. It does mean this row has to look right with three SALE tiles and
 * one plain one, which it does: the badge is the only thing that varies, and a
 * tile without one is simply a tile.
 *
 * ── The picture is square ──────────────────────────────────────────────────
 * At the client's ask: width and height equal, which also keeps the section
 * clear of the full height of the screen. Every source is 4:5, so a square box
 * crops a fifth of the height away and `position` says which fifth — top for
 * the three posters, so the crop takes the hotline strip at the foot and leaves
 * the logos; centre for the photograph, where both ends are floor and ceiling.
 */

function ProductTile({ item }) {
  const onOffer = discountPercent(item.was, item.now) !== null;

  return (
    <motion.div variants={fade} className="bg-cream">
      <Link href={item.href} className="group block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover ${item.position} transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
          />

          {/* The page veil, same as everywhere else on this page. A sibling of
              the picture so the hover zoom moves under a wash that stays put —
              see the longer note in CollectionsShowcase. */}
          <span
            aria-hidden
            className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-55"
          />

          {/* Over the picture, top-left, exactly where the reference puts it —
              and above the veil in DOM order so the wash never dulls it.

              It says SALE rather than the percentage Option B prints. Same
              source of truth, two readings of it: this design's whole argument
              is that it does not do the arithmetic at the reader, so the badge
              marks the tile and the price under it does the rest. White on
              #e60000 measures 4.81:1, which clears the bar for bold 10px caps. */}
          {onOffer && (
            <span className="absolute left-4 top-4 bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
              Sale
            </span>
          )}
        </div>

        {/* Name and price share a line and the price never wraps under the
            name — `shrink-0` on the price, `min-w-0` on the name. A price that
            drops to its own line breaks the scan down the right-hand edge,
            which is the only reason to put it there at all. */}
        <div className="px-5 pb-6 pt-5 lg:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="min-w-0 text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
              {item.name}
            </h3>
            <span className="shrink-0 text-[15px] font-semibold tabular-nums text-ink">
              {item.now}
            </span>
          </div>

          <p className="body-copy mt-2 text-[13px] leading-[1.55] text-ink/55">
            {item.spec}
          </p>
          <p className="body-copy mt-1 text-[13px] leading-[1.55] text-ink/40">
            {item.variants}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PopularProductsGrid() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pb-16 pt-16 lg:pb-24 lg:pt-24">
      {/* Heading on the gutter, tiles full-bleed — the asymmetry
          `DivisionsStrip` already established on this page. A heading hard
          against the window edge reads as a mistake; a row of pictures running
          off both edges does not. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell mb-8 flex flex-wrap items-end justify-between gap-6 lg:mb-10"
      >
        <motion.div variants={fade}>
          <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" />
            Popular Products
          </span>
          <h2 className="display mt-5 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            What Bangladesh
            <br />
            <span className="font-bold text-brand">buys most</span> from us
          </h2>
        </motion.div>

        <motion.div variants={fade}>
          <Link href="/products" className="group inline-flex items-center gap-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink underline decoration-ink/20 underline-offset-4 transition-colors group-hover:decoration-brand">
              View all products
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <FiArrowUpRight />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* 12px, the page's one gutter figure — the same value between the four
          division cards and the three collections cards above. It is the other
          half of what separates this design from Option B, which sets its three
          apart at 32px: tight makes a set to read across, loose makes three
          propositions to pick between. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {popularProducts.map((item) => (
          <ProductTile key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
