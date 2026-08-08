"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";
import { popularProducts, discountPercent } from "@/components/karmo/home2/popularProducts";

/**
 * Popular Products — the four-up tile row at the foot of the homepage.
 *
 * Built as one of two candidates from the references the client sent, against
 * an offer row of poster cards with struck prices and Order Now buttons. This
 * is the one they picked; the other component is deleted. Both read from
 * `popularProducts`, which stays where it is — it was always the shared source
 * and is still what this reads.
 *
 * Worth knowing, if this ever gets revisited: the two converged almost
 * entirely before the choice was made. This started as a quiet catalogue row
 * and was walked step by step towards the other one — centred, stacked,
 * struck-through-priced, ended in a button, each change asked for. By the end
 * the only differences left were the 12px gutters against 32px, the badge
 * saying SALE rather than the computed percentage, and the near-white tile.
 * So "the client chose the catalogue design over the offer design" would be
 * the wrong lesson to draw from this file; what they chose was this density
 * and this restraint applied to what had become the same card.
 *
 * ── What this design was arguing ───────────────────────────────────────────
 * That a buyer choosing between foam grades wants specification before
 * persuasion, so each tile carried two lines of fact — the grade, and what came
 * in the set. The client asked for them out, which is their call to make; the
 * data is still in `popularProducts` under `spec` and `variants` if it ever
 * comes back, and nothing else has to change to restore it.
 *
 * What survives of that argument is the picture: a tile with this much air
 * only works if the photograph is cut out or shot on a flat field, and Karmo
 * has none of that yet. That is still the cost of this design, and it is now
 * the only one on the page.
 *
 * ── Where it departs from the reference ────────────────────────────────────
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
       card is now three separate links, and the hover state has to come from a
       wrapper they all sit inside rather than from the one that used to
       contain them. */
    /* `bg-cream/40`, not `bg-cream`, at the client's ask for a field that is
       barely there. Cream is #F5F5F5 and the section behind it is white, so the
       tile was ten units of grey off its own background; at 40% it composites
       to #FBFBFB, four units off. Close to invisible, which is the brief.

       An alpha on the token rather than a new colour, deliberately. Editing
       `--color-cream` would have lightened the collections cards, the header's
       search field and every other surface using it; a fifth token for one
       shade of near-white is worse. This way the tile is still cream, just
       almost none of it, and it stays tied to whatever cream becomes. */
    <motion.div variants={fade} className="group flex flex-col bg-cream/40">
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

              It says SALE rather than the percentage, though it is derived
              from the same two prices: this design's argument is that it does
              not do the arithmetic at the reader, so the badge marks the tile
              and the price under it does the rest. White on #e60000 measures
              4.81:1, which clears the bar for bold 10px caps. */}
          {onOffer && (
            <span className="absolute left-4 top-4 bg-brand px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-white">
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Name, prices, button — nothing else, at the client's ask. The two
          lines of specification that were here are gone, and with them the
          argument that a buyer choosing between foam grades wants the grade
          before the price. The client's call, and the row is shorter for it —
          582px to about 510.

          The rest of the height came off the padding rather than the type,
          because the type is already at the smallest size that stays readable
          at 343px wide. 20px above and 24px below where it was 24 and 28.

          `flex-1` here with `mt-auto` on the button holds all four buttons on
          one line however the names wrap, and the 20px above the button is
          `mb-5` on the price, not `mt-5` on the button. An auto margin only
          distributes slack, so on a row where every card happens to be the same
          height it resolves to zero and the button lands hard against the price
          — which is exactly the bug this row's twin shipped with once already. */}
      <div className="flex flex-1 flex-col items-center px-5 pb-4 pt-3.5 text-center lg:px-6">
        <Link href={item.href}>
          <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
            {item.name}
          </h3>
        </Link>

        {/* `leading-none` is doing as much work here as the margins. The two
            prices are 14px and 19px on default leading, which gave the line a
            30px box for 19px of type — 11px of it invisible padding that read
            as gap and could not be found by looking at the margins. Collapsed,
            the line is the type.

            The struck price stays conditional, not empty-when-absent: the
            mattress carries no `was`, and an `<s>` around nothing still renders
            its flex gap, which pushes the lone price off centre. */}
        <p className="mb-3.5 mt-1.5 flex items-baseline justify-center gap-3 leading-none">
          {item.was && (
            <s className="text-[14px] tabular-nums text-ink/40">{item.was}</s>
          )}
          <span className="text-[19px] font-bold tabular-nums text-ink">
            {item.now}
          </span>
        </p>

        {/* 46px stays. It is the one measurement in this block that is not
            free to shrink — a button under 44px is below the floor for a thumb,
            and the height saved here would come out of whether the row works on
            a phone. Everything above it gave up space instead. */}
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
      {/* Centred, and carrying these two lines, at the client's ask. It was
          left on the `.shell` gutter with a "view all" held to the
          right — the arrangement `DivisionsStrip` uses — and centring it left
          that link nowhere to stand: a lone element pushed right beside a
          centred block reads as a layout that failed to finish. It moved below
          the row instead, which is where a "there is more" link belongs on a
          catalogue anyway, and it is still centred so the section reads down one
          axis from the eyebrow to the last word.

          Both sections now carry the same heading. That is fine while they are
          two candidates on a page and would not be if both ever shipped — only
          one is meant to survive. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell mb-8 text-center lg:mb-10"
      >
        <motion.div variants={fade}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            Popular Products
          </span>
          <h2 className="display mt-4 text-[1.9rem] font-light uppercase leading-[1.12] tracking-[0.01em] text-ink lg:text-[2.4rem]">
            Hot offers <span className="font-bold text-brand">for you</span>
          </h2>

          {/* The ornament the client asked for, and it introduces no new shape
              to do the job. It is the page's two existing rules set on one line:
              the 3px brand bar from beneath the foam story's eyebrow, extended
              either side by the 1px ink hairline the division and collection
              eyebrows use. Two weights, one axis.

              This is where the reference's leaf-and-gold device went, and why
              it did not come back: a leaf appears nowhere else on this page, so
              it reads as a leftover from another brand's artwork rather than as
              Karmo's. An ornament built from parts the page already repeats
              reads as the page. Decorative, so `aria-hidden`. */}
          <span
            aria-hidden
            className="mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z"
                fill="#FF9A1F"
              />
              <path
                d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8"
                stroke="#B4651A"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="h-px w-16 sm:w-20" style={{ backgroundColor: "#FF9A1F" }} />
          </span>
        </motion.div>
      </motion.div>

      {/* 12px between the tiles — the page's one gutter figure, the same value
          between the four division cards and the three collections cards above.
          Tight, so the four read as one set rather than as four separate
          propositions to pick between — the rejected offer row set its cards
          32px apart for exactly the opposite reason. The gaps have not moved
          through any of this; only the margin around them has.

          On `.shell` now, at the client's third ask for a narrower row — 24px
          on a phone, 56 from md, 80 from lg. That is the end of the line for
          this, and deliberately so: it is the page's own gutter, so the row
          finally sits on the same margin as the heading above it and the "view
          all" below, and the section reads as one block rather than a heading
          with a wider row bolted under it.

          The three earlier figures each had a reason that has since expired.
          12px matched the gaps, on the argument that the frame around a row
          should equal the gutters inside it — true while the row sat nearly
          flush to the window. 40px broke that tie once a visible margin was
          wanted, which is ordinary: an outer margin exceeding the internal
          gutter is the normal case in any grid. Both also kept the row wider
          than the copy, which was `DivisionsStrip`'s asymmetry and worth
          protecting while this heading was left-aligned on the gutter. It is
          centred now, so there is no ragged edge for the cards to reach past
          and nothing left for the asymmetry to do.

          `.shell` also caps at 1600px, which the bare padding never did. That
          fixes something not asked about: the row used to run uncapped while
          the heading capped, so past ~1760px they came apart and the heading
          sat marooned in the middle of a much wider row. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="shell grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {popularProducts.map((item) => (
          <ProductTile key={item.id} item={item} />
        ))}
      </motion.div>

      {/* Below the row rather than beside the heading, since the heading became
          centred. Kept, not dropped: it is what says the row is the front of a
          catalogue with more behind it, rather than four offers and nothing
          else. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="mt-10 text-center lg:mt-12"
      >
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
    </section>
  );
}
