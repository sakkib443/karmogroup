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

const VID = "/karmo/video";

export const productFeatures = [
  {
    title: "Spine-aware support",
    body: "Ergonomic construction that keeps your back aligned whether you sleep on your side, back or sit up to read. Built for healthy sleep, not just a soft surface.",
    video: `${VID}/m.mp4`,
  },
  {
    title: "Anti-dust, lasting cover",
    body: "Breathable damask and quilted tops chosen for everyday Bangladesh homes — anti-allergic, easy to live with, and made to hold their look for years.",
    video: `${VID}/p.mp4`,
  },
];

/** Cover / damask swatches — same fabric set as the buy box. */
export const fabricOptions = [
  { id: "fabric-1", label: "Damask 1", image: "/karmo/images/product/fabrics/fabric1.jpg" },
  { id: "fabric-2", label: "Damask 2", image: "/karmo/images/product/fabrics/fabric2.jpg" },
  { id: "fabric-3", label: "Damask 3", image: "/karmo/images/product/fabrics/fabric3.jpg" },
  { id: "fabric-4", label: "Damask 4", image: "/karmo/images/product/fabrics/fabric4.jpg" },
  { id: "fabric-5", label: "Damask 5", image: "/karmo/images/product/fabrics/fabric5.jpg" },
  { id: "fabric-6", label: "Damask 6", image: "/karmo/images/product/fabrics/fabric6.jpg" },
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

/** Shared K-A-R-M-O campaign thumbs — fallback when a SKU has no own set. */
export const KARMO_LETTER_GALLERY = [
  "/products/product-01/gallery-3.jpg", // K
  "/products/product-01/gallery-5.jpg", // A
  "/products/product-01/gallery-4.jpg", // R
  "/products/product-01/gallery-1.jpg", // M
  "/products/product-01/gallery-2.jpg", // O
];

/** King Mattress — locked plate: same backdrop + letter position; only bed/props change. */
export const KING_LETTER_GALLERY = [
  "/karmo/images/mattress/products/king-gallery/letter-K-v3.png",
  "/karmo/images/mattress/products/king-gallery/letter-A-v3.png",
  "/karmo/images/mattress/products/king-gallery/letter-R-v3.png",
  "/karmo/images/mattress/products/king-gallery/letter-M-v3.png",
  "/karmo/images/mattress/products/king-gallery/letter-O-v3.png",
];

/** King — bottom row: catalogue thumb first, then fresh multi-angle shots. */
export const KING_REAL_GALLERY = [
  "/karmo/images/mattress/products/king-room.jpg",
  "/karmo/images/mattress/products/king-gallery/angle-front.png",
  "/karmo/images/mattress/products/king-gallery/angle-side.png",
  "/karmo/images/mattress/products/king-gallery/angle-detail.png",
];

const LETTER_BY_ID = {
  king: KING_LETTER_GALLERY,
};

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
    "/karmo/images/mattress/products/matrex-p1.jpg",
  ].filter(Boolean);
  return [...new Set(shots)];
}

function toDetail(item) {
  const price = parseTaka(item.now);
  const mrp = parseTaka(item.was) || price;
  const realGallery = buildRealGallery(item);
  const letterGallery = LETTER_BY_ID[item.id] || KARMO_LETTER_GALLERY;
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
