"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Popular Products — OPTION B of two, built to the second reference: Karmo's
 * own live site, where the row is an offer row.
 *
 * Option A is `PopularProductsGrid`. Both are on the page at once so they can be
 * compared; whichever loses gets deleted along with the marker bar above it.
 *
 * ── What this design is arguing ────────────────────────────────────────────
 * That the row's job is to sell today, not to catalogue. So every part of it
 * points at one action: the poster does the persuading, the struck-through
 * price does the arithmetic, and the button says the words. It converts better
 * than Option A and it says less about the brand — that is the whole trade, and
 * it is the client's to make rather than mine.
 *
 * Its real advantage is that it costs nothing to run. Karmo already produces a
 * campaign poster for every offer; this design consumes them as they are. Option
 * A needs a product shoot that does not exist. If the row has to be live next
 * week, this is the one that can be.
 *
 * ── Where it departs from the reference ────────────────────────────────────
 * · The leaf-and-gold ornament under the heading is gone, replaced by a plain
 *   brand rule. Nothing else on this page carries a leaf, and an ornament that
 *   appears exactly once reads as a leftover — the same call the foam story
 *   made about the same device.
 * · Square corners and square badges. The reference rounds both; this page does
 *   not round anything, and one rounded row in a square page reads as imported.
 * · The discount is computed from the two prices rather than typed. On the
 *   reference it is not shown at all, but a struck-through number invites the
 *   reader to do the subtraction, and a badge that does it for them is worth the
 *   space. Deriving it means the badge can never contradict the prices under it,
 *   which is the failure mode of every hand-typed offer percentage.
 * · The prices are the client's real ones, read off their live site — all three
 *   combos happen to be exactly 15% off, which is why the badge is not fighting
 *   for attention with three different numbers.
 *
 * ── The picture is square ──────────────────────────────────────────────────
 * At the client's ask: width and height equal, which also keeps the section
 * clear of the full height of the screen — a 4:5 box put a card at 686px and
 * this brings it to about 585px.
 *
 * It matters more here than it does in Option A, because these are posters.
 * A poster is composed for its own edges, and a square box crops a fifth of its
 * height away — so every one of them is anchored `object-top`. The fifth then
 * comes off the foot, which on all three stand-ins is the hotline and
 * free-delivery strip, and the logos and the headline that do the selling stay.
 * Centring instead would take 10% off the top, and 10% off the top of a poster
 * is the logo.
 *
 * That is a real cost of this design and worth stating: the combo artwork Karmo
 * supplies is portrait, so either it gets cropped here or it gets shot square.
 * Cropped is fine while the important half is the top half — check it is, for
 * every new poster, rather than assuming.
 *
 * ── The pictures ───────────────────────────────────────────────────────────
 * The three combo posters are not in the repo. Each entry names the file it
 * wants under `image`, and points at an existing Karmo poster until that file
 * arrives — so the layout is real but the artwork is not the artwork. The
 * stand-ins carry their own printed offers ("15% OFF on all mattress", "20%
 * OFF"), which will disagree with the badge beside them until they are swapped.
 * Nothing else changes when they are: `image` and `alt`, and that is all.
 */

/**
 * Prices exactly as the client's live site quotes them, in taka, as strings —
 * the display needs the thousands separator and the trailing paisa, and the
 * only arithmetic done on them is the discount below, which parses them back.
 */
const offers = [
  {
    id: "280-foam-combo",
    name: "280 Foam Combo Offer",
    was: "6,427.00৳",
    now: "5,463.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/280-foam-combo.jpg */
    image: "/karmo/images/mattress/plant-bedroom.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off, in place of the 280 foam combo poster",
    standIn: true,
  },
  {
    id: "2001-foam-combo",
    name: "2001 Foam Combo Offer",
    was: "7,982.00৳",
    now: "6,785.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/2001-foam-combo.jpg — the closest of
       the three, because this really is the Karmo 2001 campaign, just last
       season's cut of it rather than the combo. */
    image: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    alt: "Karmo campaign poster — a modular sofa on Karmo 2001 lavender foam cushions above a stack of foam blocks, offered at 20% off with free delivery",
    standIn: true,
  },
  {
    id: "4g-foam-combo",
    name: "4G Foam Combo Offer",
    was: "9,040.00৳",
    now: "7,684.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/4g-foam-combo.jpg */
    image: "/karmo/images/mattress/cloud-poster.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off, in place of the 4G foam combo poster",
    standIn: true,
  },
];

/**
 * "6,427.00৳" -> 6427. Strips everything that is not a digit or a decimal
 * point, which handles the separator, the currency mark and any spacing without
 * caring which side the mark sits on.
 */
const toNumber = (price) => Number(String(price).replace(/[^\d.]/g, ""));

/** Rounded, because 14.9995% is not a thing a poster says. */
const discountPercent = (was, now) => {
  const a = toNumber(was);
  const b = toNumber(now);
  if (!a || !b || b >= a) return null;
  return Math.round(((a - b) / a) * 100);
};

function OfferCard({ item }) {
  const off = discountPercent(item.was, item.now);

  return (
    <motion.div variants={fade} className="group flex flex-col bg-cream">
      <Link href={item.href} className="block">
        {/* Square, and every poster anchored to its top — see the note above.
            One position for all three rather than a field per offer, because
            the rule is a property of posters, not of these particular three:
            anything dropped in here is artwork with its mark at the top. */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />

          {/* The page veil. Lighter here than it looks: these are posters, and a
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

      {/* `flex-1` and `mt-auto` on the button: the three names are one line each
          today, but the moment one wraps to two the buttons would sit at three
          different heights across the row. This pins them to a common floor
          whatever the copy does. */}
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
        <p className="mt-3 flex items-baseline justify-center gap-3">
          <s className="text-[14px] tabular-nums text-ink/40">{item.was}</s>
          <span className="text-[19px] font-bold tabular-nums text-ink">
            {item.now}
          </span>
        </p>

        <Link
          href={item.href}
          className="btn-primary mt-6 inline-flex h-[46px] items-center bg-brand px-8 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
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

        {/* Wider gaps than the tile row in Option A, and deliberately so. These
            are three separate propositions a reader picks between, not one set
            read across — 12px would run them into a single block and lose the
            "or" between them. */}
        <motion.div
          variants={group}
          {...reveal}
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8"
        >
          {offers.map((item) => (
            <OfferCard key={item.id} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
