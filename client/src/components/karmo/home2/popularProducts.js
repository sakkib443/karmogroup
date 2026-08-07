/**
 * The three products both Popular Products designs show.
 *
 * `PopularProductsGrid` reads from here. This was split out when there were
 * two candidate designs on the page and the client wanted identical pictures
 * in both, so the comparison was about the treatment and nothing else — two
 * copies of a list drift the first time one is edited, and a drifted A/B is
 * worse than no A/B, since whichever looks better might just be the one with
 * the better photograph.
 *
 * That paid off exactly as intended: the losing component was deleted and this
 * file did not have to change. It stays separate now because product data with
 * stand-in artwork and placeholder prices has a different lifetime from the
 * layout that renders it — see the notes below on what still needs replacing.
 *
 * ── The products ───────────────────────────────────────────────────────────
 * Karmo's three real foam combos, with the prices their live site quotes. All
 * three are exactly 15% off, which is why `discountPercent` reads the same on
 * every card. The specifications come off the client's own combo posters —
 * five free cushions per set, in two sizes — rather than being written for the
 * layout.
 *
 * The fourth is a mattress, and it is deliberately not an offer. The row was
 * asked for as a four-up and there is no fourth combo, so rather than invent a
 * price and a discount for one, this carries the figure `ShoppableScene`
 * already quotes for the same product and leaves `was` null. Two things fall
 * out of that, and both are useful:
 *
 *   · Nothing is fabricated. Every number in this file is either the client's
 *     live price or one already on this page.
 *   · The row is mixed, so both designs have to show a product that is not on
 *     offer — no badge, no struck price — which is the case they will meet
 *     constantly in real use and the one an all-discounted row never tests.
 *
 * Note the currency mark sits *after* the amount on the three combos, because
 * that is how the client's site writes it, and `ShoppableScene` writes the same
 * product's price the other way round ("৳ 28,500"). This file follows the
 * client. The two want reconciling, one way or the other, before either design
 * ships — it is one page showing one product's price two ways.
 *
 * ── The pictures ───────────────────────────────────────────────────────────
 * The combo posters themselves are not in the repo. Each entry names the file
 * it wants, and points at an existing Karmo poster until that file arrives, so
 * the layouts are real but the artwork is not the artwork. Two consequences
 * worth remembering while judging:
 *
 *   · The stand-ins carry their own printed offers — "15% OFF on all mattress",
 *     "20% OFF" — which will disagree with the badge beside them.
 *   · Two of the three are mattress posters standing in for foam combos, so the
 *     picture does not show the product named under it.
 *
 * Both go away when the real files land. Nothing else changes: `image` and
 * `alt`, and that is all.
 *
 * Every source is 4:5 and both designs crop it square, so a fifth of the height
 * goes and `position` says which fifth. It used to be hard-coded `object-top`
 * in both components, on the argument that the rule belonged to posters rather
 * than to particular products — the mattress is the photograph that made it a
 * field again, exactly as that note predicted. Top for anything with printed
 * type at its head, so the crop takes the foot; centre for a photograph, where
 * both ends are equally disposable.
 */
export const popularProducts = [
  {
    id: "280-foam-combo",
    name: "280 Foam Combo Offer",
    spec: "Karmo 280 grade foam, five cushions free",
    variants: "Cushions 22×22×4 in and 22×18×3 in",
    was: "6,427.00৳",
    now: "5,463.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/280-foam-combo.jpg */
    image: "/karmo/images/mattress/plant-bedroom.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off, in place of the 280 foam combo poster",
    position: "object-top",
  },
  {
    id: "2001-foam-combo",
    name: "2001 Foam Combo Offer",
    spec: "Karmo 2001 grade foam, five cushions free",
    variants: "Cushions 22×22×4 in and 22×18×3 in",
    was: "7,982.00৳",
    now: "6,785.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/2001-foam-combo.jpg — the closest of
       the three stand-ins, because this really is the Karmo 2001 campaign, just
       last season's cut of it rather than the combo. */
    image: "/karmo/images/home-02/collections/01-best-selling-karmo-2001-campaign.jpg",
    alt: "Karmo campaign poster — a modular sofa on Karmo 2001 lavender foam cushions above a stack of foam blocks, offered at 20% off with free delivery",
    position: "object-top",
  },
  {
    id: "4g-foam-combo",
    name: "4G Foam Combo Offer",
    spec: "Karmo 4G grade foam, five cushions free",
    variants: "Cushions 22×22×4 in and 22×18×3 in",
    was: "9,040.00৳",
    now: "7,684.00৳",
    href: "/foam",
    /* Wants: /karmo/images/home-02/offers/4g-foam-combo.jpg */
    image: "/karmo/images/mattress/cloud-poster.jpg",
    alt: "Stand-in artwork — a Karmo Mattress campaign poster offering 15% off, in place of the 4G foam combo poster",
    position: "object-top",
  },
  {
    id: "pro-foam-mattress",
    name: "Karmo Pro Foam Mattress",
    spec: "High-density foam core, quilted floral ticking",
    variants: "Available in 3 sizes",
    /* No offer on this one, and no `was` invented to manufacture one. Both
       designs read the missing field the same way: `discountPercent` returns
       null, so there is no badge and no struck price. */
    was: null,
    now: "28,500.00৳",
    href: "/mattress",
    /* Not a stand-in. The one genuine Karmo product photograph in the repo that
       is not a campaign poster, which is also why it is worth having in the row:
       it is the closest thing here to the catalogue photography this design
       actually wants. */
    image: "/karmo/images/mattress/suite-interior.jpg",
    alt: "A Karmo mattress in red floral ticking with white piping on an upholstered bed, lit by two bedside lamps beneath a chandelier",
    /* Centred, not topped. There is no printed headline to protect, and the
       fifth that goes is chandelier above and floor below — the mattress itself
       sits mid-frame and survives untouched. Anchored to the top it would keep
       ceiling it does not need and cut the foot of the bed. */
    position: "object-center",
  },
];

/**
 * "6,427.00৳" -> 6427. Strips everything that is not a digit or a decimal
 * point, which handles the separator, the currency mark and any spacing without
 * caring which side the mark sits on.
 *
 * Prices are strings rather than numbers because the display needs the
 * thousands separator and the trailing paisa exactly as the client's site
 * quotes them; this is the one place that reads them back.
 */
const toNumber = (price) => Number(String(price).replace(/[^\d.]/g, ""));

/**
 * Derived, never typed. A badge that says 15% beside prices that work out to 14
 * is the failure mode of every hand-written offer percentage, and it only ever
 * shows up after the copy has been edited once. Returns null rather than 0 when
 * there is no saving, so a card with no offer shows no badge at all instead of
 * a "0% Off".
 *
 * Rounded, because 14.9995% is not a thing a poster says.
 */
export const discountPercent = (was, now) => {
  const a = toNumber(was);
  const b = toNumber(now);
  if (!a || !b || b >= a) return null;
  return Math.round(((a - b) / a) * 100);
};
