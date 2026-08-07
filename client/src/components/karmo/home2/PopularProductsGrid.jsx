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
 * the same four products out of `popularProducts`, and both carry the same
 * heading — the client asked for identical pictures across the two so that what
 * is being judged is the treatment and nothing else. Whichever loses gets
 * deleted along with the marker bar above it; the data file stays.
 *
 * ── Read this before adding anything back ──────────────────────────────────
 * These two started far apart and the client has walked this one most of the
 * way to the other. It is now centred, stacked, struck-through-priced and
 * ended with an Order Now button — every one of those a step towards Option B,
 * each asked for. The card content is identical to B's.
 *
 * What is left between them is real but small, and it is worth knowing exactly
 * what it is so nobody spends another round rediscovering it:
 *
 *   · **Density.** 12px between these tiles against 32px between B's, so this
 *     row reads as one set and B's as four offers.
 *   · **The heading.** On the page gutter with a "view all products" link,
 *     against B's centred title and rule.
 *   · **The badge.** SALE here, the computed percentage there.
 *
 * That is the whole list. Nothing about the picture, the copy, the price or the
 * button differs any more. If those three stop mattering too, the honest answer
 * is that there is one design left and the other file should be deleted rather
 * than kept as a near-duplicate that has to be edited twice.
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
 * has none of that yet. That is still the cost of choosing this one.
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
       card is now three separate links, the way Option B already did it, and
       the hover state has to come from a wrapper they all sit inside rather
       than from the one that used to contain them. */
    /* `bg-cream/40`, not `bg-cream`, at the client's ask for a field that is
       barely there. Cream is #F5F5F5 and the section behind it is white, so the
       tile was ten units of grey off its own background; at 40% it composites
       to #FBFBFB, four units off. Close to invisible, which is the brief.

       An alpha on the token rather than a new colour, deliberately. Editing
       `--color-cream` would have lightened the collections cards, the header's
       search field and every other surface using it; a fifth token for one
       shade of near-white is worse. This way the tile is still cream, just
       almost none of it, and it stays tied to whatever cream becomes.

       Option B keeps the full-strength cream. That was not asked for, and the
       difference is now one of the few things left between the two designs. */
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

      {/* Name, prices, button — nothing else, at the client's ask. The two
          lines of specification that were here are gone, and with them the last
          argument this design was making that Option B was not: that a buyer
          choosing between foam grades wants the grade before the price. The
          client's call, and the row is shorter for it — 582px to about 510.

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
      {/* Centred, and carrying the same two lines as Option B, at the client's
          ask. It was left on the `.shell` gutter with a "view all" held to the
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
              the 3px brand bar that sits under Option B's title and beneath the
              foam story's eyebrow, extended either side by the 1px ink hairline
              the division and collection eyebrows use. Two weights, one axis.

              This is where the reference's leaf-and-gold device went, and why
              it did not come back: a leaf appears nowhere else on this page, so
              it reads as a leftover from another brand's artwork rather than as
              Karmo's. An ornament built from parts the page already repeats
              reads as the page. Decorative, so `aria-hidden`. */}
          <span
            aria-hidden
            className="mt-6 flex items-center justify-center gap-2.5"
          >
            <span className="h-px w-8 bg-ink/20 sm:w-12" />
            <span className="h-[3px] w-12 bg-brand sm:w-14" />
            <span className="h-px w-8 bg-ink/20 sm:w-12" />
          </span>
        </motion.div>
      </motion.div>

      {/* 12px between the tiles — the page's one gutter figure, the same value
          between the four division cards and the three collections cards above.
          It is half of what separates this design from Option B, which sets its
          four apart at 32px: tight makes a set to read across, loose makes
          separate propositions to pick between.

          Down the sides it is 12px on a phone, 24 from md and 40 from lg — the
          client asked twice for more, and the second ask is why the margin is
          no longer tied to the gap.

          It was 12px on the argument that the frame should equal the gutters
          inside it. That is a real principle for a row sitting almost flush to
          the window, and the wrong one once a visible margin is wanted: an
          outer margin larger than the internal gutter is the ordinary case in
          any grid — `.shell` itself runs 80px margins against these 12px gaps.
          So the gaps stay at 12 and only the margin grows. Keeping them locked
          together would have loosened the row to 40px gutters and walked this
          design's density straight into Option B's.

          It still stops well short of `.shell`'s 80px, and that is the point:
          the heading above sits on the shell gutter, so the cards go on
          reaching past the copy — which is the asymmetry `DivisionsStrip`
          established — just by less than they did. */}
      <motion.div
        variants={group}
        {...reveal}
        viewport={VIEWPORT}
        className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-10"
      >
        {popularProducts.map((item) => (
          <ProductTile key={item.id} item={item} />
        ))}
      </motion.div>

      {/* Below the row rather than beside the heading, since the heading became
          centred. Kept, not dropped: it is the last thing this design says that
          Option B does not — that the row is the front of a catalogue and there
          is more behind it, rather than four offers and nothing else. */}
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
