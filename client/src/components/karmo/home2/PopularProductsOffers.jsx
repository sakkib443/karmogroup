"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { popularProducts, discountPercent } from "@/components/karmo/home2/popularProducts";

/**
 * Popular Products — OPTION B of two, built to the second reference: Karmo's
 * own live site, where the row is an offer row.
 *
 * Option A is `PopularProductsGrid`. Both read the same three products out of
 * `popularProducts` and carry the same heading, so the only thing between them
 * is the treatment. Whichever loses gets deleted; the data file stays.
 *
 * ── What this design is arguing ────────────────────────────────────────────
 * That the row's job is to sell today, not to catalogue. Every part of it
 * points at one action: the poster does the persuading, the struck price does
 * the arithmetic, and the button says the words. It converts better than Option
 * A and it says less about the brand — that is the whole trade, and it is the
 * client's to make rather than mine.
 *
 * Its other advantage is that it costs nothing to run. Karmo already produces a
 * campaign poster for every offer, and this design consumes them as they are.
 * Option A wants catalogue photography that does not exist. If the row has to
 * be live next week, this is the one that can be.
 *
 * ── Where it departs from the reference ────────────────────────────────────
 * · The leaf-and-gold ornament under the heading is gone, replaced by a plain
 *   brand rule. Nothing else on this page carries a leaf, and an ornament that
 *   appears exactly once reads as a leftover — the same call the foam story
 *   made about the same device.
 * · Square corners and square badges. The reference rounds both; this page does
 *   not round anything, and one rounded row in a square page reads as imported.
 * · The percentage is derived from the two prices rather than typed. The
 *   reference does not show it at all, but a struck-through number invites the
 *   reader to do the subtraction and a badge that does it for them is worth the
 *   space. See `discountPercent` for why it is never written by hand.
 *
 * ── Four cards, not three ──────────────────────────────────────────────────
 * Option A was asked for as a four-up, and this follows it because the whole
 * point of the pair is that only the treatment differs — a row of three beside
 * a row of four adds "shows more" as a variable nobody meant to test.
 *
 * It is the bigger departure from the reference of the two changes, so it is
 * the one to say out loud: the client's live row is three wide cards and this
 * is four narrower ones. If the three-up is part of what is being judged here,
 * this is a one-word change back to `lg:grid-cols-3`.
 *
 * The fourth product is not on offer, which this design has to survive: no
 * badge, no struck price, just the price and the button. That is the common
 * case in real use and worth seeing before choosing.
 *
 * ── The picture is square ──────────────────────────────────────────────────
 * At the client's ask: width and height equal, which also keeps the section
 * clear of the full height of the screen.
 *
 * It matters more here than in Option A, because the poster is doing more of
 * the work. Every source is 4:5, so a square box crops a fifth of the height
 * away, and `position` says which fifth: the three posters are anchored
 * `object-top` so the crop comes off the foot — the hotline and free-delivery
 * strip — and the logos and headline stay. Centring one of those would take 10%
 * off the top, and 10% off the top of a poster is the logo.
 *
 * That is a real cost of this design, worth weighing before choosing it: the
 * combo artwork Karmo supplies is portrait, so it is either cropped here or
 * shot square. Cropped is fine while the important half is the top half — check
 * that for each new poster rather than assuming it.
 */

function OfferCard({ item }) {
  const off = discountPercent(item.was, item.now);

  return (
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

          {/* The page veil. Lighter than it looks: these are posters, and a
              poster's own type has to stay readable through it — which is the
              argument for the wash being 12% everywhere rather than tuned per
              picture. */}
          <span
            aria-hidden
            className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-55"
          />

          {off !== null && (
            <span className="absolute left-4 top-4 bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
              {off}% Off
            </span>
          )}
        </div>
      </Link>

      {/* `flex-1` here and `mt-auto` on the button: the three names are one line
          each today, but the moment one wraps to two the buttons would sit at
          three different heights across the row. This pins them to a common
          floor whatever the copy does.

          The 24px above the button is `mb-6` on the price rather than `mt-6` on
          the button, and that is not interchangeable. An auto margin only
          distributes *slack*, so with all three cards the same height — which is
          exactly the case today — it resolves to zero and the button lands hard
          against the price. Measured at 0px before this was moved. The gap has
          to come from a real margin; the auto one then adds whatever slack a
          taller neighbour creates on top of it. */}
      <div className="flex flex-1 flex-col items-center px-5 pb-7 pt-6 text-center">
        <Link href={item.href}>
          <h3 className="display text-[15px] font-bold uppercase leading-snug tracking-[0.06em] text-ink transition-colors duration-300 group-hover:text-brand">
            {item.name}
          </h3>
        </Link>

        {/* The old price is `<s>` rather than a line-through class, because the
            fact that it no longer applies is the meaning, not the styling — a
            screen reader should say so too. Both are tabular so the digits line
            up down the row. */}
        {/* The struck price is conditional, not empty-when-absent: the fourth
            product carries no `was`, and an `<s>` around nothing still renders
            a gap in the flex row that pushes the price off centre. */}
        <p className="mb-6 mt-3 flex items-baseline justify-center gap-3">
          {item.was && (
            <s className="text-[14px] tabular-nums text-ink/40">{item.was}</s>
          )}
          <span className="text-[19px] font-bold tabular-nums text-ink">
            {item.now}
          </span>
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

export default function PopularProductsOffers() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    <section className="bg-white pb-16 pt-16 lg:pb-24 lg:pt-24">
      <motion.div variants={group} {...reveal} viewport={VIEWPORT} className="shell">
        {/* Centred, which is the reference's own arrangement and the one thing
            about it that is not up for argument: a row of three identical cards
            under a left-aligned heading looks like the heading fell off. */}
        <motion.div variants={fade} className="text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            Popular Products
          </span>
          <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Hot offers <span className="font-bold text-brand">for you</span>
          </h2>
          <span className="mx-auto mt-5 block h-[3px] w-14 bg-brand" />
        </motion.div>

        {/* 32px between the cards, against Option A's 12px, and that gap is one
            of the few real differences between the two designs. These are
            separate propositions a reader picks between, not one set read
            across — at 12px they run into a single block and lose the "or". */}
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-8"
        >
          {popularProducts.map((item) => (
            <OfferCard key={item.id} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
