/**
 * Matrexx / Mattress product-detail data.
 *
 * `/mattress/[slug]` resolves a catalogue SKU from the mattress division list.
 * Without a match, returns null (route calls notFound).
 */

import mattress from "@/data/divisions/mattress";
import {
  defaultHeightFor,
  quoteMattressPrice,
  sizePresetsFor,
} from "@/components/karmo/product/mattressPricing";

export {
  quoteMattressPrice,
  sizePresetsFor,
  DISCOUNT_OPTIONS,
  getPricingRule,
} from "@/components/karmo/product/mattressPricing";

const VID = "/products/videos";
const FILMS = "/products/mattress/films";

/** Short test clips. The first two play in the build band on every mattress page. */
export const productFeatures = [
  {
    id: "stillness",
    title: "Undisturbed sleep",
    body: "A steel ball dropped on the surface settles where it lands — a calm, stable top that keeps movement from travelling across the bed.",
    video: `${VID}/ball-drop.mp4`,
    poster: `${VID}/ball-drop-poster.webp`,
  },
  {
    id: "durability",
    title: "Tested to last",
    body: "Pressed again and again on a test rig, so the comfort layers keep their shape and support for years of everyday use.",
    video: `${VID}/pressure-press.mp4`,
    poster: `${VID}/durability-test-poster.webp`,
  },
];

/**
 * Feature bands — shown on a mattress page only when they apply
 * (`only` lists the products that carry that feature).
 */
export const productFeatureBands = [
  {
    id: "pocket",
    title: "Individually pocketed springs",
    body: "Each coil sits in its own fabric pocket and moves on its own, so support follows the shape of your body and a partner's movement stays on their side.",
    video: `${VID}/pocket-springs.mp4`,
    poster: `${VID}/pocket-springs-poster.webp`,
    only: ["pillow-top-pocket-spring", "euro-top-pocket-spring"],
  },
];

/* ─── Inside the mattress — the cross-section band under the icon strip ─── */

/**
 * One picture and one short copy deck for every mattress page. The picture carries
 * no text; ProductInside draws one line per layer to a numbered label, top layer first.
 */
const INSIDE_BUILD = {
  image: "/products/mattress/inside/exploded-display.webp",
  width: 1774,
  height: 887,
  /* Same picture with 16% of soft haze added above and below, so a tall screen can be
     filled without stretching or zooming it. */
  imageTall: "/products/mattress/inside/exploded-display-tall.webp",
  extend: 16,
  alt: "Exploded view of a Karmo mattress in a sunlit bedroom: quilted cover, wave comfort foam, moisture-proof layer, transition layer, pocket springs and base",
  title: "Inside every",
  accent: "Karmo mattress",
  layers: [
    { title: "Quilted knitted cover", body: "Soft, breathable, skin-friendly" },
    { title: "3D wave foam", body: "Eases pressure points" },
    { title: "Moisture-proof layer", body: "Stays fresh and dry" },
    { title: "Transition layer", body: "Balances support and comfort" },
    { title: "Pocket springs", body: "Strong, motion-free support" },
    { title: "Support base", body: "Stable and long-lasting" },
  ],
};

function buildFor() {
  return INSIDE_BUILD;
}

/**
 * Each product's own film, matched to its cover fabric. Plays from the gallery
 * thumbnail and as the full-width film band further down the page.
 * king / prestige / topper / euro top / pillow top / bonnell are the shoot as filmed;
 * imperial (brighter blue) and orthopedic (warm rust) are colour-graded from the
 * closest fabric, since no clip was shot in those prints.
 */
/* Heading over each film — from the client-approved tagline list (docs/copy/taglines.md), word for word. */
const FILM_HEADINGS = {
  king: "Crafted to perfection",
  prestige: "Where Signature comfort lies",
  orthopedic: "Crafted to Last",
  "imperial-eurotop": "Where Comfort meets Elegance",
  "bonnell-spring": "Experience you can feel",
  "pillow-top-pocket-spring": "Elevate your sleep",
  "euro-top-pocket-spring": "Comfort that lasts beyond the night",
  topper: "Sleep Well, Live Well",
};
const FILM_BY_ID = Object.fromEntries(
  Object.entries(FILM_HEADINGS).map(([id, heading]) => [
    id,
    { src: `${VID}/film-${id}.mp4`, poster: `${FILMS}/${id}.webp`, heading },
  ])
);

/** Cover / damask swatches — same fabric set as the buy box. */
export const fabricOptions = [
  { id: "fabric-1", label: "Damask 1", image: "/products/common/fabrics/fabric1.webp" },
  { id: "fabric-2", label: "Damask 2", image: "/products/common/fabrics/fabric2.webp" },
  { id: "fabric-3", label: "Damask 3", image: "/products/common/fabrics/fabric3.webp" },
  { id: "fabric-4", label: "Damask 4", image: "/products/common/fabrics/fabric4.webp" },
  { id: "fabric-5", label: "Damask 5", image: "/products/common/fabrics/fabric5.webp" },
  { id: "fabric-6", label: "Damask 6", image: "/products/common/fabrics/fabric6.webp" },
];

/**
 * A swatch on the buy box shows the shared bedroom render in that cloth (d-01…d-09,
 * also in the gallery). Every mattress but the topper. A swatch with no render of its
 * own (Alpona, Green-Leaf) goes back to the product's cover.
 */
const FABRIC_RENDERS = {
  "fabric-2": "/products/mattress/d-03.webp", // Red-WF
  "fabric-3": "/products/mattress/d-04.webp", // L. White leaves
  "fabric-4": "/products/mattress/d-08.webp", // Blue-3
  "fabric-5": "/products/mattress/d-07.webp", // Yellow rose
};

/** @deprecated Prefer sizePresetsFor(slug) — kept for older imports. */
export const sizePresets = sizePresetsFor("euro-top-pocket-spring");

/** @deprecated Prefer quoteMattressPrice(slug, dims). */
export function estimateMattressPrice(basePrice, w, l, h) {
  const quote = quoteMattressPrice("euro-top-pocket-spring", {
    width: w,
    length: l,
    height: h,
    discountPct: 0,
  });
  if (quote.ok) return quote.total;
  if (!basePrice) return 0;
  return Math.round(Number(basePrice) || 0);
}

export const REF_AREA = 60 * 80;
export const REF_HEIGHT = 9;

export function formatTaka(n) {
  if (!n || !Number.isFinite(n)) return "৳ —";
  return `৳ ${Math.round(n).toLocaleString("en-BD")}`;
}

function parseTaka(label) {
  if (!label) return 0;
  const n = Number(String(label).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const catalog = mattress.products?.items || [];

/**
 * The K-A-R-M-O strip down the left of the main picture — one shared set, the
 * same five pictures on every mattress page (big red letters, one per picture).
 */
export const KARMO_LETTER_GALLERY = ["K", "A", "R", "M", "O"].map(
  (letter) => `/products/mattress/karmo-letters/letter-${letter}.webp`
);

/** King — bottom row: catalogue thumb first, then fresh multi-angle shots. */
export const KING_REAL_GALLERY = [
  "/products/mattress/king-cover-luxury-floral-v2.webp",
  "/products/mattress/king-gallery/angle-front-v4.webp",
  "/products/mattress/king-gallery/angle-side-v4.webp",
  "/products/mattress/king-gallery/angle-detail-v4.webp",
];

const REAL_BY_ID = {
  king: KING_REAL_GALLERY,
};

/** Shared detail renders (d-01…d-09) for the gallery row. The four a swatch shows
    (FABRIC_RENDERS) are left out — they appear only when that fabric is clicked. */
export const SHARED_DETAIL_SHOTS = Array.from(
  { length: 9 },
  (_, i) => `/products/mattress/d-${String(i + 1).padStart(2, "0")}.webp`
).filter((src) => !Object.values(FABRIC_RENDERS).includes(src));

export function getMattressProductSlugs() {
  return catalog.map((p) => p.id);
}

function buildRealGallery(item) {
  /* The product's own shots only. The d-01…d-09 detail renders are not in this row —
     the fabric swatches show them (FABRIC_RENDERS). */
  const base = REAL_BY_ID[item.id]
    ? REAL_BY_ID[item.id]
    : [item.image, item.imageHover, "/products/mattress/matrex-p1.webp"].filter(Boolean);
  return [...new Set(base)];
}

function toDetail(item) {
  const price = parseTaka(item.now);
  const mrp = parseTaka(item.was) || price;
  const realGallery = buildRealGallery(item);
  const letterGallery = KARMO_LETTER_GALLERY;
  /* PDP opens on the catalogue thumbnail (first real gallery shot). */
  const cover = item.image || realGallery[0] || letterGallery[0];

  return {
    slug: item.id,
    sku: `KM-${String(item.id).toUpperCase().slice(0, 12)}`,
    division: "Mattress",
    divisionHref: "/mattress",
    brand: "Matrexx",
    name: item.name,
    line: item.line || "Karmo Matrexx — crafted for nights that last",
    description:
      item.line ||
      "Luxury in sensational comfort — engineered for peaceful, healthy sleep. Anti-allergic, ergonomically shaped, and tested one by one.",
    category: item.category || "mattress",
    firmness:
      (item.specs || []).find((s) =>
        /soft|firm|medium/i.test(String(s))
      ) || "Medium Firm",
    /** Default large image — catalogue thumbnail / first bottom thumb. */
    cover,
    /** Vertical K-A-R-M-O strip. */
    letterGallery,
    /** Horizontal real-product row under the main frame. */
    realGallery,
    /** Legacy combined list (buy-box still works if anything reads `gallery`). */
    gallery: realGallery,
    fabrics:
      item.id === "topper"
        ? fabricOptions
        : fabricOptions.map((fabric) => ({ ...fabric, scene: FABRIC_RENDERS[fabric.id] || cover })),
    densities: null,
    colors: null,
    sizes: sizePresetsFor(item.id),
    showCustomSize: true,
    price,
    mrp,
    priceLabel: item.now,
    wasLabel: item.was,
    unitNote: "Sales calculator · final quote by size (inch)",
    defaultHeight: defaultHeightFor(item.id),
    features: productFeatures,
    /** Own product film (or null) — first thumb in the gallery row. */
    film: FILM_BY_ID[item.id] || null,
    /** Cross-section band — the same picture and layers on every page. */
    build: buildFor(),
    shortName: item.shortName || item.name,
    specs: item.specs || [],
    /** Feature bands that apply to this mattress. */
    featureBands: productFeatureBands.filter((f) => !f.only || f.only.includes(item.id)),
    imageAlt: item.alt,
  };
}

const DEFAULT_ID = "euro-top-pocket-spring";

export function getMattressProductDetail(productId) {
  if (!productId) return null;
  const item = catalog.find((p) => p.id === productId);
  if (!item) return null;
  return toDetail(item);
}

/** Default Matrexx PDP (legacy `/product-detail` redirect target). */
export function getSharedProductDetail() {
  return getMattressProductDetail(DEFAULT_ID);
}

export const sharedProductDetail = getMattressProductDetail(DEFAULT_ID);
