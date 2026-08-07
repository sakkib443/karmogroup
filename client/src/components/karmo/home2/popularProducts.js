/**
 * The three products both Popular Products designs show.
 *
 * `PopularProductsGrid` (Option A, the quiet grid) and `PopularProductsOffers`
 * (Option B, the offer row) read from here rather than each carrying its own
 * list. The client asked for the same pictures in both so the comparison is
 * about the treatment and nothing else — and a shared module is the only way
 * that stays true. Two copies of a list drift the first time one is edited, and
 * a drifted A/B is worse than no A/B: whichever looks better might just be the
 * one with the better photograph.
 *
 * It also means the loser is cheap to delete. When one design is picked, this
 * file stays where it is and the other component goes.
 *
 * ── The products ───────────────────────────────────────────────────────────
 * Karmo's three real foam combos, with the prices their live site quotes. All
 * three are exactly 15% off, which is why `discountPercent` reads the same on
 * every card. The specifications come off the client's own combo posters —
 * five free cushions per set, in two sizes — rather than being written for the
 * layout.
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
 * All three sources are 4:5 and both designs crop them square, from the top —
 * see the note in either component for why the crop is anchored there.
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
