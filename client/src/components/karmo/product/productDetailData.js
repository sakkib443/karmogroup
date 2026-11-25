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
    /* Every film is cut to four shots (shots 1, 2, 3 + the quilting close-up; euro top: corner, pattern, hand press, quilting). ?v= makes browsers fetch the new file after a re-cut. */
    { src: `${VID}/film-${id}.mp4?v=cut4`, poster: `${FILMS}/${id}.webp`, heading },
  ])
);

/**
 * The "Inside every Karmo mattress" band and the three-part comfort band under it are FIXED:
 * the same clips on every mattress page (client's rule, 22 Nov 2026). Clips are cut from the
 * king film and the red mattress film (public/products/videos/inside/):
 *   pan   — red floral cloth, camera moving across it      (left, top)
 *   press — a hand pressing the red floral cloth           (three-part band, left)
 *   feet  — feet and water bottle on the same navy cloth    (right, top)
 */
export const INSIDE_CLIPS = {
  pan: { src: `${VID}/inside/pan-blue.mp4`, label: "Cover in motion" }, /* blue recolour of pan-red.mp4 (client, 24 Nov 2026) — red was already on the page */
  press: { src: `${VID}/inside/press-for-king.mp4`, label: "Soft to the touch" },
  feet: { src: `${VID}/inside/feet-for-king.mp4`, label: "Tested by weight" },
};

/** Cover fabrics — the full set of 13 (client, 23 Nov 2026), shown 7 + 6 on every mattress
    page. Made from the originals in /pages/mattress/favrics (480px WebP squares).
    Earlier set: /products/common/fabrics/fabric1…6.webp */
const FAB = "/products/mattress/fabrics";
export const fabricOptions = [
  { id: "9-9r", label: "9-9R", image: `${FAB}/9-9r.webp` },
  { id: "19-2b", label: "19-2B", image: `${FAB}/19-2b.webp` },
  { id: "alpona", label: "Alpona", image: `${FAB}/alpona.webp` },
  { id: "blue-3", label: "Blue-3", image: `${FAB}/blue-3.webp` },
  { id: "green-leaf", label: "Green Leaf", image: `${FAB}/green-leaf.webp` },
  { id: "l-white", label: "L. White", image: `${FAB}/l-white.webp` },
  { id: "nakshi-kalas", label: "Nakshi Kalas", image: `${FAB}/nakshi-kalas.webp` },
  { id: "navy-blue", label: "Navy Blue", image: `${FAB}/navy-blue.webp` },
  { id: "off-white-02", label: "Off White 02", image: `${FAB}/off-white-02.webp` },
  { id: "off-white", label: "Off White", image: `${FAB}/off-white.webp` },
  { id: "pink", label: "Pink", image: `${FAB}/pink.webp` },
  { id: "red-wf", label: "Red-WF", image: `${FAB}/red-wf.webp` },
  { id: "yellow-rose", label: "Yellow Rose", image: `${FAB}/yellow-rose.webp` },
];

/**
 * A swatch on the buy box shows the shared bedroom render in that cloth (d-01…d-09,
 * also in the gallery). Every mattress but the topper. A swatch with no render of its
 * own (Alpona, Green-Leaf) goes back to the product's cover.
 */
const OLD_FABRIC_RENDERS = [
  "/products/mattress/d-03.webp",
  "/products/mattress/d-04.webp",
  "/products/mattress/d-08.webp",
  "/products/mattress/d-07.webp",
];
/** Each of the 13 swatches opens its own bedroom photo in that cloth (client, 24 Nov 2026).
    1100px WebP, about 120 KB each, preloaded on the page so a click swaps at once. */
const FABRIC_RENDERS = Object.fromEntries(
  fabricOptions.map((f) => [f.id, `/products/mattress/fabric-scenes/${f.id}.webp`])
);
/** Each mattress's own bedroom photos per cloth (client, 26 Nov 2026). The first three mattresses
    (King, Prestige, Orthopedic) share one set of ten; Imperial Euro Top has its own ten. A cloth
    with no photo here falls back to the shared set (FABRIC_RENDERS). */
const scenesIn = (folder, ids) => Object.fromEntries(ids.map((id) => [id, `/products/mattress/fabric-scenes/${folder}/${id}.webp`]));
const KING_FABRIC_RENDERS = scenesIn("king", ["red-wf", "yellow-rose", "pink", "navy-blue", "l-white", "nakshi-kalas", "9-9r", "19-2b", "off-white", "off-white-02"]);
/* Yellow Rose (second take) and Nakshi Kalas — used on the 3rd and 4th mattresses (client, 26 Nov 2026). */
const IMPERIAL_EXTRA = {
  "yellow-rose": "/products/mattress/fabric-scenes/imperial-eurotop/yellow-rose-v2.webp",
  "nakshi-kalas": "/products/mattress/fabric-scenes/imperial-eurotop/nakshi-kalas.webp",
};
const FABRIC_RENDERS_BY_ID = {
  king: KING_FABRIC_RENDERS,
  prestige: KING_FABRIC_RENDERS,
  /* 5th mattress: the same set as the first three (client, 26 Nov 2026). */
  "bonnell-spring": KING_FABRIC_RENDERS,
  /* Orthopedic: the King set, with Imperial's Yellow Rose and Nakshi Kalas (client, 26 Nov 2026). */
  orthopedic: { ...KING_FABRIC_RENDERS, "yellow-rose": IMPERIAL_EXTRA["yellow-rose"], "nakshi-kalas": IMPERIAL_EXTRA["nakshi-kalas"] },
  "imperial-eurotop": {
    ...scenesIn("imperial-eurotop", ["19-2b", "9-9r", "off-white", "off-white-02", "pink", "red-wf", "navy-blue", "l-white"]),
    ...IMPERIAL_EXTRA,
  },
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

/** Per-product K-A-R-M-O strips — the letters on a mattress in that product's own fabric. */
const lettersIn = (folder) =>
  ["K", "A", "R", "M", "O"].map(
    (letter) => `/products/mattress/karmo-letters/${folder}/letter-${letter}.webp`
  );
/* New K-A-R-M-O sets from /pages/mattress/mattress left side iamge karmo (client, 25 Nov 2026).
   Earlier: eurotop, bonnell, pillowtop folders; King, Prestige, Orthopedic and Imperial used the shared set.
   King, Prestige and Orthopedic were given the same five pictures ("classic"). The topper keeps the shared set. */
const CLASSIC_LETTERS = lettersIn("classic");
const LETTERS_BY_ID = {
  king: CLASSIC_LETTERS,
  prestige: CLASSIC_LETTERS,
  orthopedic: CLASSIC_LETTERS,
  "imperial-eurotop": lettersIn("imperial"),
  "euro-top-pocket-spring": lettersIn("eurotop-v2"),
  "bonnell-spring": lettersIn("bonnell-v2"),
  "pillow-top-pocket-spring": lettersIn("pillowtop-v2"),
};

/** King — bottom row: catalogue thumb first, then fresh multi-angle shots. */
export const KING_REAL_GALLERY = [
  "/pages/mattress/divisions/karmo-king-mattress-main.webp",
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
).filter((src) => !OLD_FABRIC_RENDERS.includes(src));

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
  const letterGallery = LETTERS_BY_ID[item.id] || KARMO_LETTER_GALLERY;
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
        : fabricOptions.map((fabric) => ({
            ...fabric,
            scene: FABRIC_RENDERS_BY_ID[item.id]?.[fabric.id] || FABRIC_RENDERS[fabric.id] || cover,
          })),
    /** Lay the 13 swatches out as a bigger 7-column grid (7 + 6). */
    fabricGrid: true,
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
    /** Fixed clips for the Inside-every-Karmo-mattress band — identical on every mattress page. */
    insideClips: INSIDE_CLIPS,
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
