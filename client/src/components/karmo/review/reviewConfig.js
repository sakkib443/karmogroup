/**
 * Client-review system: which pages are reviewable and which sections they hold.
 *
 * `id` is the stable key stored with every approval / note. It must match the
 * `id` passed to <ReviewSection id="..."> where that section is mounted. Order
 * here is the order shown on the /review summary.
 *
 * To make another page reviewable: add it here, wrap its sections in
 * <ReviewSection id="...">, done. The markers appear automatically on that path.
 */
export const REVIEW_PAGES = {
  "/": {
    title: "Homepage",
    sections: [
      { id: "header", label: "Header & menu" },
      { id: "hero", label: "Hero - The journey since 1965" },
      { id: "trust-strip", label: "Trust icons strip" },
      { id: "division-editorials", label: "We create the chemistry of comfort" },
      { id: "chemicals-band", label: "The world of polyurethane" },
      { id: "explore-split", label: "Mattress, HomeTex & Foam cards" },
      { id: "divisions-strip", label: "One group, four crafts" },
      { id: "shop-by-material", label: "Support that lasts (materials)" },
      { id: "promo-trio", label: "Foam seating, HomeTex & Mattress promo" },
      { id: "shop-by-size", label: "Shop by mattress size" },
      { id: "foam-promise", label: "Blending tradition with innovation" },
      { id: "reels", label: "See comfort. On screen." },
      { id: "shoe-sole", label: "Shoe sole banner" },
      { id: "partners", label: "Trusted by 100+ makers" },
      { id: "partner-promo", label: "Partner promo band" },
      { id: "order-contact", label: "How to make an order" },
      { id: "certified-by", label: "Built on trust since 1965" },
      { id: "footer", label: "Footer" },
    ],
  },
};

export const STATUS_LABEL = {
  pending: "Awaiting review",
  approved: "Approved",
  changes: "Changes requested",
};
