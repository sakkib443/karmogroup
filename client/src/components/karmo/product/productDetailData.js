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
    video: `${VID}/durability-test.mp4`,
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

const INSIDE = "/pages/mattress/brochure/inside";

const COVER = {
  title: "Quilted damask cover",
  body: "Breathable, anti-allergic fabric quilted over soft wadding — cool to the touch and easy to live with.",
};
const FELT = {
  title: "Felt insulator",
  body: "A felt pad keeps the comfort layers off the core, so the mattress holds its shape and stays even.",
};
const BASE_COVER = {
  title: "Quilted base",
  body: "A tough quilted underside with taped edges that keep the mattress square and stable on the bed.",
};

/** Foam builds — the exploded image already carries the numbers 1–6. */
const FOAM_LAYERS = {
  king: [
    COVER,
    { title: "PE comfort foam", body: "Hi-density PE foam cushions shoulders and hips without letting you sink." },
    FELT,
    { title: "Rebonded foam core", body: "A dense rebonded core for firm, even support from edge to edge — the heart of the mattress." },
    { title: "PE support foam", body: "A second PE layer balances the core, so it feels the same night after night." },
    BASE_COVER,
  ],
  prestige: [
    COVER,
    { title: "Soft comfort foam", body: "The softer side — settle in gently for a relaxed, cushioned feel." },
    FELT,
    { title: "Rebonded foam core", body: "A dense rebonded core keeps both sides supportive and long-lasting." },
    { title: "Firm comfort foam", body: "Flip it over for the firmer side — two feels in one mattress." },
    BASE_COVER,
  ],
  orthopedic: [
    COVER,
    { title: "Firm comfort foam", body: "A thin, firm top keeps the spine level instead of letting it dip." },
    FELT,
    { title: "Orthopedic rebonded core", body: "Extra-dense rebonded foam for firm, posture-friendly support through the back." },
    { title: "Support foam", body: "Spreads your weight across the core so support stays even all over." },
    BASE_COVER,
  ],
  "imperial-eurotop": [
    { title: "Euro top cover", body: "A plush, quilted euro top for a soft first touch and pressure relief." },
    { title: "Comfort foam", body: "Eases pressure at shoulders and hips while the core does the holding up." },
    FELT,
    { title: "Hi-density PE core", body: "An extra-firm hi-density PE core for strong support that lasts." },
    { title: "Support foam", body: "Keeps the core stable and the surface level over the years." },
    BASE_COVER,
  ],
};

/** Spring builds — numbered markers sit on the cut-away photo (x %, y %). */
const SPRING_SPOTS = [
  [60, 22],
  [45, 41],
  [84, 45],
  [52, 62],
  [45, 86],
];
const EDGE = {
  title: "Foam edge support",
  body: "A firm foam frame around the springs, so the edge stays strong when you sit on it.",
};
const BASE_PAD = {
  title: "Base pad",
  body: "A felt pad and quilted base protect the springs and keep the mattress steady.",
};
const POCKET = {
  title: "Pocket spring unit",
  body: "Individually wrapped coils that move on their own — support follows your body and a partner's movement stays on their side.",
};
const SPRING_LAYERS = {
  "bonnell-spring": [
    COVER,
    { title: "Comfort foam", body: "Soft foam over the coils for a cushioned, even feel." },
    EDGE,
    { title: "Bonnell spring unit", body: "Linked open coils give a firm, springy and breathable support base." },
    BASE_PAD,
  ],
  "pillow-top-pocket-spring": [
    { title: "3\" pillow top", body: "A plush pillow top stitched on top for deep, cloud-soft comfort." },
    { title: "Comfort foam", body: "Cushions the springs and eases pressure at shoulders and hips." },
    EDGE,
    POCKET,
    BASE_PAD,
  ],
  "euro-top-pocket-spring": [
    { title: "Euro pillow top", body: "A flush euro top for a soft, smooth first touch from edge to edge." },
    { title: "Memory foam layer", body: "Moulds to your shape and relieves pressure points, then springs back." },
    EDGE,
    POCKET,
    BASE_PAD,
  ],
};

function buildFor(id) {
  if (FOAM_LAYERS[id]) {
    return {
      image: `${INSIDE}/exploded-layers.webp`,
      width: 1152,
      height: 864,
      alt: "Exploded view of a Karmo foam mattress, its six layers numbered from the cover down",
      layers: FOAM_LAYERS[id],
      spots: null,
    };
  }
  if (SPRING_LAYERS[id]) {
    return {
      image: `${INSIDE}/pocket-cutaway.webp`,
      width: 1280,
      height: 720,
      alt: "Cut-away of a Karmo spring mattress showing the cover, comfort foam, foam edge, springs and base",
      layers: SPRING_LAYERS[id],
      spots: SPRING_SPOTS,
    };
  }
  return null;
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

export function getMattressProductSlugs() {
  return catalog.map((p) => p.id);
}

function buildRealGallery(item) {
  if (REAL_BY_ID[item.id]) return REAL_BY_ID[item.id];
  /* Cover (room) first, then studio/web packshot, then a shared Matrexx still. */
  const shots = [
    item.image,
    item.imageHover,
    "/products/mattress/matrex-p1.webp",
  ].filter(Boolean);
  return [...new Set(shots)];
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
    fabrics: fabricOptions,
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
    /** Cross-section band (null for the topper). */
    build: buildFor(item.id),
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
