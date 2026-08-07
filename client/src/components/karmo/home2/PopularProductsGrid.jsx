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
 * That the product should be the loudest thing in its tile, and that a buyer
 * choosing between foam grades wants specification before persuasion. A pale
 * field, the photograph, and underneath it the facts they actually sort on —
 * what it is, what it is made of, what it comes in, what it costs — and then
 * the way to buy it.
 *
 * It is the harder design to fill and the better one to live with. Harder,
 * because a tile with this much air only works if the photograph is cut out or
 * shot on a flat field, and Karmo has none of that yet. Better, because nothing
 * in it expires when a campaign ends.
 *
 * The two have converged since they were first built: the client asked for this
 * one centred, with its copy stacked under the picture and an Order Now button,
 * which is Option B's card treatment. What is still genuinely different, and is
 * therefore what the choice now rests on:
 *
 *   · **The specification.** This gives each product two lines of fact — the
 *     grade and what comes with it. Option B gives it none, on the argument
 *     that the poster already said everything.
 *   · **The saving.** Option B strikes the old price through and prints the
 *     percentage. This shows the price you pay and marks the tile SALE, and
 *     that is all. It is the weaker sell and the one that does not turn the row
 *     into a permanent clearance rack.
 *   · **The density.** Twelve pixels between these tiles against thirty-two
 *     between B's cards, and a heading on the gutter with a "view all" against
 *     B's centred title. One reads as a catalogue page, the other as four
 *     offers.
 *
 * If those stop mattering too, the honest answer is that there is one design
 * left and the other file should go.
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
    /* `group` moved up here from the picture's link when the button arrived.
       The tile used to be one `<Link>` around everything, which is the tidier
       markup right up until something inside it has to be a link too — an `<a>`
       inside an `<a>` is invalid, and React unpicks it at hydration. So the
       card is now three separate links, the way Option B already did it, and
       the hover state has to come from a wrapper they all sit inside rather
       than from the one that used to contain them. */
    <motion.div variants={fade} className="group flex flex-col bg-cream">
      <Link href={item.href} className="block">
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
      </Link>

      {/* Centred and stacked under the picture, at the client's ask — this was
          a name-left/price-right row before, which reads faster down a column
          but cannot hold a centred button under it without looking lopsided.
          Once the button was in, the whole block had to follow it.

          The order is deliberate: what it is, then the two lines of fact, then
          what it costs, then how to get it. The specification sits above the
          price rather than below because it is what a buyer uses to decide
          *which* grade — by the time they reach the number they should already
          know what they are pricing.

          `flex-1` here with `mt-auto` on the button holds all four buttons on
          one line however the copy wraps, and the 24px above the button is
          `mb-6` on the price, not `mt-6` on the button. An auto margin only
          distributes slack, so on a row where every card happens to be the same
          height it resolves to zero and the button lands hard against the price
          — which is exactly the bug this row's twin shipped with once already. */}
      <div className="flex flex-1 flex-col items-center px-5 pb-7 pt-6 text-center lg:px-6">
        <Link href={item.href}>
          <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
            {item.name}
          </h3>
        </Link>

        <p className="body-copy mt-2 text-[13px] leading-[1.55] text-ink/55">
          {item.spec}
        </p>
        <p className="body-copy mt-1 text-[13px] leading-[1.55] text-ink/40">
          {item.variants}
        </p>

        {/* One number, no struck price. That is the line this design still
            holds against Option B: the badge says there is an offer, and the
            price says what you pay. */}
        <p className="mb-6 mt-4 text-[19px] font-bold tabular-nums text-ink">
          {item.now}
        </p>

        <Link
          href={item.href}
          className="btn-primary mt-auto inline-flex h-[46px] items-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
        >
          Order Now
        </Link>
      </div>
    </motion.div>
  );
}

export default function PopularProductsGrid() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pb-16 pt-16 lg:pb-24 lg:pt-24">
      {/* Heading on the `.shell` gutter, tiles on a much narrower one — the
          asymmetry `DivisionsStrip` already established on this page. A heading
          hard against the window edge reads as a mistake; a row of pictures
          reaching well past it does not. */}
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

      {/* 12px between the tiles — the page's one gutter figure, the same value
          between the four division cards and the three collections cards above.
          It is half of what separates this design from Option B, which sets its
          four apart at 32px: tight makes a set to read across, loose makes
          separate propositions to pick between.

          And 12px down each side, at the client's ask, so the row no longer
          runs into the window edges. The figure is not a taste call — it is the
          same 12px as the gaps, which makes the frame around the row identical
          to the gutters inside it. Any other number and the outer margin either
          crowds or outweighs the gaps, and the row stops reading as evenly set.
          It is a slight inset by design: the heading above still sits on the
          `.shell` gutter, three times wider, and that asymmetry is the one
          `DivisionsStrip` established — the cards are meant to reach past the
          copy, just not all the way off the page. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {popularProducts.map((item) => (
          <ProductTile key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
