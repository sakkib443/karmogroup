"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * Popular Products — OPTION A of two, built to the first reference the client
 * sent: the quiet four-up catalogue row.
 *
 * Option B is `PopularProductsOffers`. Both are on the page at once so they can
 * be compared, and both carry the same heading for that reason — the choice is
 * between two treatments of one section, not between two different sections.
 * Whichever loses gets deleted along with the marker bar above it.
 *
 * ── What this design is arguing ────────────────────────────────────────────
 * That the product should be the loudest thing in its tile and nothing else
 * should compete. So: no buttons, no ribbons, no discount maths. A pale field,
 * the photograph, and underneath it the four facts a buyer actually sorts on —
 * what it is, what it costs, what it is made of, and what it comes in.
 *
 * It is the harder design to fill and the better one to live with. Harder,
 * because a tile with this much air only works if the photograph is cut out or
 * shot on a flat field — see the note on the pictures below. Better, because it
 * does not date: nothing in it expires when a campaign ends.
 *
 * ── Where it departs from the reference ────────────────────────────────────
 * The reference repeats one line of poetry under every product — the same
 * "solid in construction, simple in form" on all four. That works for a
 * furniture brand whose products differ mainly in shape. Karmo sells foam by
 * density and mattresses by spring count, and a buyer choosing between HD and
 * 2001 needs the grade, not a mood. So the second line is per-product and
 * factual. The structure is the reference's; the words do a different job.
 *
 * ── The picture is square ──────────────────────────────────────────────────
 * At the client's ask: width and height equal, which also keeps the section
 * off the full height of the screen — a 4:5 box put the row at 577px a tile
 * and this brings it to about 490px.
 *
 * Every source is 4:5, so a square box crops a fifth of the height off each
 * one, and where that fifth comes from is stated per product in `position`.
 * Centred by default; `object-top` on anything carrying printed type at the
 * top, so the crop takes the empty foot rather than a logo; `object-bottom`
 * where the picture has dead field above the product. Getting this wrong is
 * not subtle — it is a beheaded logo — so it is a field rather than a default.
 *
 * ── The pictures, and what choosing this design commits to ─────────────────
 * This design wants catalogue photography: one product, cut out or on a flat
 * pale field, shot square-on. Karmo has none of that yet. Every square-croppable
 * image in the repo is either a room scene or a campaign poster, so these four
 * tiles are standing in — and two of them are pictures already used elsewhere
 * on this page, which is the giveaway.
 *
 * That is worth saying plainly rather than hiding, because it is half the
 * decision: picking this design commits to a product shoot. Picking Option B
 * does not, because the posters it wants are the ones Karmo already makes every
 * campaign. Nothing else here needs to change when the real shots arrive — only
 * `image`, `alt` and `position` below, and anything framed square to begin with
 * will not need `position` at all.
 */

/**
 * Prices are not final. `Karmo Pro Foam Mattress` and `Karmo Zuti Foam Sofa`
 * carry the figures `ShoppableScene` already uses, so the same product is not
 * quoted two different ways on one page; the other two are placeholders waiting
 * on the client's price list. Written as one field rather than a number so a
 * range ("From ...") reads the same as a fixed price — the reference does this
 * too, and it is what lets a foam grade sold by the sheet sit beside a sofa.
 */
const products = [
  {
    id: "pro-foam-mattress",
    name: "Karmo Pro Foam Mattress",
    price: "৳ 28,500",
    spec: "High-density foam core, quilted floral ticking",
    variants: "3 sizes available",
    href: "/mattress",
    badge: "SALE",
    /* The one genuine catalogue-ish shot in the repo: a Karmo mattress
       photographed in a room, with the Karmo Mattress mark in the corner. */
    image: "/karmo/images/mattress/suite-interior.jpg",
    alt: "A Karmo mattress in red floral ticking with white piping on an upholstered bed, lit by two bedside lamps under a chandelier",
    /* Centred: the mattress sits mid-frame and the fifth that goes is
       chandelier at the top and floor at the bottom, neither of which is the
       product. The Karmo Mattress mark is top-right and survives a 10% trim. */
    position: "object-center",
  },
  {
    id: "hd-foam",
    name: "Karmo HD Foam",
    price: "From ৳ 4,200",
    spec: "Pure rubber-grade foam, no fillers",
    variants: "5 densities available",
    href: "/foam",
    /* Already on this page, in the collections row above. A stand-in. */
    image: "/karmo/images/home-02/collections/02-popular-karmo-hd.webp",
    alt: "A man seated in an armchair beside a tall stack of Karmo HD foam blocks on a plain studio field",
    /* All of the crop off the top, where there is nothing but empty studio
       field above his head — the same call the collections row makes about the
       same picture, and for the same reason. */
    position: "object-bottom",
  },
  {
    id: "zuti-foam-sofa",
    name: "Karmo Zuti Foam Sofa",
    price: "৳ 62,000",
    spec: "Three-seat frame on high-resilience foam cushions",
    variants: "2 colours available",
    href: "/foam",
    badge: "NEW",
    /* Already on this page, in the foam story below. A stand-in — but the only
       one of the four that is square in the file (1400x1400), so it is the only
       tile losing nothing at all to the crop. */
    image: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
    alt: "A three-seat sofa in deep blue velvet with a leather KARMO ZUTI tab on its front rail, against a marigold wall",
    position: "object-center",
  },
  {
    id: "cloud-mattress",
    name: "Karmo Cloud Mattress",
    price: "৳ 34,000",
    spec: "Pocket spring under a memory-foam top",
    variants: "4 sizes available",
    href: "/mattress",
    /* A campaign poster, not a product shot — it carries its own "15% OFF" and
       a hotline, which is precisely the fight this design is built to avoid.
       The clearest argument in the repo for shooting the real thing. */
    image: "/karmo/images/mattress/cloud-poster.jpg",
    alt: "Karmo Mattress poster — a bed dressed in white linen floating above clouds at sunset, offering 15% off all mattresses",
    /* Anchored to the top so the whole fifth comes off the foot, which on this
       poster is the hotline strip — the footer carries that number anyway. The
       two Karmo logos and the headline sit in the top 40% and all survive. */
    position: "object-top",
  },
];

function ProductTile({ item }) {
  return (
    <motion.div variants={fade} className="bg-cream">
      <Link href={item.href} className="group block">
        {/* Square, at the client's ask. It is also the ratio this design wants:
            a product tile is a thumbnail of the thing, and a square gives the
            product the same room on both axes whether it is a sofa lying wide
            or a foam stack standing tall. */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover ${item.position} transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
          />

          {/* The page veil, same as the collections row and the scene below it.
              A sibling of the picture so the hover zoom moves under a wash that
              stays put — see the longer note in CollectionsShowcase. */}
          <span
            aria-hidden
            className="photo-veil pointer-events-none absolute inset-0 transition-opacity duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-55"
          />

          {/* Over the picture, top-left, exactly where the reference puts them.
              Above the veil in DOM order so the wash never dulls them.

              SALE takes the brand red and NEW does not, because only one of the
              two is an offer — a page where every marker is red has no markers.
              White on #e60000 measures 4.81:1, which clears the bar for bold
              11px caps; the ink-on-white pair is far past it. */}
          {item.badge && (
            <span
              className={`absolute left-4 top-4 px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] ${
                item.badge === "SALE" ? "bg-brand text-white" : "bg-white text-ink"
              }`}
            >
              {item.badge}
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
              {item.price}
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
      {/* Heading on the gutter, cards full-bleed — the asymmetry `DivisionsStrip`
          already established on this page. A heading hard against the window
          edge reads as a mistake; a row of pictures running off both edges does
          not. */}
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
          division cards, the three collections cards, and here. Four across from
          lg, two from sm, one below that: at 375px a quarter-width tile would
          put this type at about 80px of measure. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((item) => (
          <ProductTile key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
