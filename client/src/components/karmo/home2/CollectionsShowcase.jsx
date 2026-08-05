"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/**
 * The Home 02 collections band — three doors into three cuts of the range,
 * the centre one wider than its two wings.
 *
 *   01  Best Selling
 *   02  Popular        (the wide one)
 *   03  New Arrival
 *
 * ── Why this was rebuilt ───────────────────────────────────────────────────
 * The first pass gave all three columns the same treatment: a label and a
 * sub-line stacked above a photograph. That fails here, because the three
 * pictures are not the same kind of thing at all —
 *
 *   · the left one is a *finished campaign poster*, with Karmo's own logos,
 *     its own headline ("ART OF RESTFUL LIVING / 20% OFF") and a hotline
 *     printed into it. A card label above it made two headlines argue.
 *   · the centre one is a product cutout on a flat studio field.
 *   · the right one is a room scene.
 *
 * So the label came off the *picture* and became a header band above it,
 * identical on all three. Nothing is laid over any photograph now — the poster
 * gets to be a poster, the scene gets to be a scene — and the three still read
 * as one set because the label block, the height and the baseline are shared.
 *
 * ── Equal heights out of unequal widths ────────────────────────────────────
 * One 4:5 box for all three made the section a screen and a half tall: the
 * centre column is wider than its wings, and with a shared ratio a wider card
 * is a taller card, so the centre picture alone ran to 563px.
 *
 * The fix is a ratio *per column*, picked so the heights come out equal. The
 * centre is 1.3× the width of a wing, so its box is 1.3× the ratio — the wings
 * are 21:20, the centre is 273:200 (which is exactly 1.3 × 21/20), and both
 * land at 0.952× a wing’s width at every viewport. Nothing is pinned to a
 * pixel height, so this holds on a phone and on a 27" monitor alike, and the
 * pair stays levelled if the 1.3 ever changes: whatever the centre's share
 * becomes, its ratio is that share times the wings'.
 *
 * The fractions are odd-looking because they are tuned, not chosen: 21:20 is
 * what puts the pictures at 399px on a 1440px window, well under where
 * they sat before. Re-tuning means picking a new wing ratio and multiplying it
 * by 1.3 for the centre — the relationship is the part that matters.
 *
 * (A fixed pixel height would also have levelled them, but the crop would then
 * deepen as the window widened — past about 1600px the centre box grew wide
 * enough to cut the top off the foam stack. Ratios keep every crop constant.)
 *
 * Each picture meets its box at a different crop, so each carries the
 * `position` that protects what matters in it:
 *
 *   · the poster is 4:5 in a 21:20 box and loses about a quarter of its height.
 *     `object-top` puts all of that at the foot, so the logos, the headline,
 *     the "20% OFF" and the sofa all stay and the hotline strip goes.
 *     Centring it instead would have cost the top of the logo band as well,
 *     for the sake of a hotline the footer already carries.
 *   · the product is 4:5 in the 273:200 centre box and loses about 41% of
 *     its height. `object-bottom` takes that off the *top*, which is empty
 *     studio field above his head — the man, the foam stack and the ground
 *     shadow all stay.
 *   · the bedroom is square and loses its sides. It is a scene rather than a
 *     product, the lamp and the bed both sit inboard, and scenes want filling.
 *
 * Because every picture fills its box edge to edge, the card's own colour
 * never shows behind one — which is what lets all three share a single tint
 * instead of each needing a field colour matched to its image.
 *
 * ── Full bleed ─────────────────────────────────────────────────────────────
 * No `.shell` and no side padding: the outer cards run into both edges of the
 * window, and the only white on the row is the 12px between the three — the
 * same gutter `DivisionsStrip` puts between its four picture cards above. That
 * same figure is the section's bottom padding, so `ShoppableScene` below sits
 * exactly one gutter away and the two sections read as one block rather than
 * two things that happen to follow each other.
 *
 * Square corners throughout — no radius on the cards or on anything below.
 */
const collections = [
  {
    index: "01",
    name: "Best Selling",
    /* Supports the poster instead of repeating it: the poster already says
       "20% OFF", so the line names the product it is offering. */
    line: "Karmo 2001 foam, now 20% off",
    href: "/collections/best-selling",
    /* Kept as the JPEG it arrived as. Re-encoding it to WebP came out
       *larger* (146 KB against 138 KB) — flat colour and lettering are what
       JPEG is already good at, and a second pass would only leave artefacts
       around the type. */
    image: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    alt: "Karmo campaign poster — a modular sofa on Karmo 2001 lavender foam cushions above a stack of foam blocks, offered at 20% off with free delivery",
    sizes: "(min-width: 1024px) 25vw, 100vw",
    ratio: "aspect-[21/20]",
    position: "object-top",
  },
  {
    index: "02",
    name: "Popular",
    line: "Karmo HD — the backbone of the range",
    href: "/collections/popular",
    /* The generator's star was patched out rather than cropped: the foam
       stack reaches almost into that corner and there was nothing to spare.
       The field around it is perfectly flat, so a solid patch in its own
       colour leaves no trace. */
    image: "/karmo/images/home-02/collections/02-popular-karmo-hd.webp",
    alt: "A man seated in an armchair beside a tall stack of Karmo HD foam blocks on a plain studio field",
    sizes: "(min-width: 1024px) 36vw, 100vw",
    /* The widest box takes the deepest crop, and all of it comes off the top,
       where there is nothing but empty field above his head. Below lg the
       cards stack at one width, so it drops back to the wings’ 21:20 and the
       three read as one column. */
    ratio: "aspect-[21/20] lg:aspect-[273/200]",
    position: "object-bottom",
    wide: true,
  },
  {
    index: "03",
    name: "New Arrival",
    line: "Just added to HomeTex",
    href: "/collections/new-arrivals",
    image: "/karmo/images/home-02/collections/03-new-arrival-bedroom.webp",
    alt: "A bed dressed in warm linen bedding and a grey waffle throw, beside a floating oak nightstand and a lit ceramic lamp",
    sizes: "(min-width: 1024px) 25vw, 100vw",
    ratio: "aspect-[21/20]",
    position: "object-center",
  },
];

/**
 * One card: a header carrying the index, the name and the line, with the arrow
 * the rest of Home 02 uses for "go here", then the picture in its own ratio box
 * running to the card's bottom edge.
 *
 * `wide` only changes type size. Width comes from the grid and the ratio is
 * matched to it, so the centre card needs no layout of its own.
 */
function CollectionCard({ item }) {
  return (
    <motion.div variants={fade} className="bg-cream">
      <Link href={item.href} className="group block">
        {/* A floor, not a fixed height: the centre's name is set larger than
            its wings', so left free its block runs 4px deeper and the three
            pictures start on three different lines. 8rem clears the tallest of
            the three (125px, the centre) with a little room, and every `line`
            above stays on one line at every width the cards sit side by side —
            so all three land on it exactly. Worth re-checking here if that
            copy grows long enough to wrap. */}
        <div className="flex min-h-[8rem] items-start justify-between gap-4 px-5 pb-5 pt-6 lg:px-7 lg:pb-6 lg:pt-8">
          <div className="min-w-0">
            <span className="display block text-[11px] font-bold tabular-nums tracking-[0.1em] text-ink/35">
              {item.index}
            </span>
            <h3
              className={`display mt-1.5 font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 group-hover:text-brand ${
                item.wide ? "text-[15px] lg:text-[17px]" : "text-[13px]"
              }`}
            >
              {item.name}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-ink/55">
              {item.line}
            </p>
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
            <FiArrowUpRight />
          </span>
        </div>

        <div className={`relative overflow-hidden ${item.ratio}`}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes={item.sizes}
            className={`object-cover ${item.position} transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionsShowcase() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : { initial: "hidden", whileInView: "show" };

  return (
    // White, the same ground as the section above and as the page behind it.
    // Nothing on this page is tinted except the cards themselves.
    // No top padding at all. `DivisionsStrip` above is pinned to the screen
    // height and centres its grid inside it, so it already leaves ~60px of its
    // own below its last card, and the reveal animation adds the rest. Any
    // padding here stacks on top of that: 56/64px put 146px between the two
    // rows of cards, against the 82px between the hero's cards and the
    // divisions. At zero the two gaps match.
    //
    // The bottom padding is the *grid gap*, not a section gap. `ShoppableScene`
    // follows immediately and the two are meant to read as one block, so the
    // distance from the cards down to the scene is the same 10px that sits
    // between the three cards themselves — and the scene, being full-bleed
    // too, lines up with them on both edges.
    //
    // 12px is not arbitrary: it is also the gap `DivisionsStrip` puts between
    // its four picture cards just above. One gutter figure runs down the page,
    // so all three groups of pictures read as one grid.
    <section className="bg-white pb-3 pt-0">
      {/* No band heading. This carried an eyebrow, "Redefining / everyday
          comfort" and a "View all products" link across the top; the client
          asked for all of it out, so the three cards now speak for the section
          on their own. `DivisionsStrip` directly above still opens with a
          heading, which is what introduces this part of the page.

          `items-start`, not `items-end`: the pictures are the same height, so
          aligning the tops lines up all three top *and* bottom edges. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start"
      >
        {collections.map((item) => (
          <CollectionCard key={item.index} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
