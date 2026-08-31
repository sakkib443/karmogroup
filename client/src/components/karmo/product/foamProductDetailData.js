/**
 * Karmo Foam product-detail data.
 * `/foam/[slug]` resolves a catalogue SKU from the foam division list.
 */

import foam from "@/data/divisions/foam";
import {
  defaultFoamHeightFor,
  foamSizePresetsFor,
  quoteFoamListPrice,
  quoteFoamPrice,
} from "@/components/karmo/product/foamPricing";

export {
  quoteFoamPrice,
  quoteFoamListPrice,
  foamSizePresetsFor,
  getFoamPricingRule,
  defaultFoamHeightFor,
} from "@/components/karmo/product/foamPricing";

const IMG = "/karmo/images/foam-2";
const PDP = `${IMG}/pdp`;
const PROD = `${IMG}/products`;

export const foamColorOptions = [
  { id: "coral", label: "Coral 280", image: `${PDP}/swatches/coral.jpg` },
  { id: "olive", label: "Olive 2001", image: `${PDP}/swatches/olive.jpg` },
  { id: "lavender", label: "Lavender 4G", image: `${PDP}/swatches/lavender.jpg` },
  { id: "gold", label: "Gold 1965", image: `${PDP}/swatches/gold.jpg` },
  { id: "blue", label: "Signature Blue", image: `${PDP}/swatches/blue.jpg` },
  { id: "rebonded", label: "Rebonded", image: `${PDP}/swatches/rebonded.jpg` },
];

export const foamProductFeatures = [
  {
    title: "Pure rubber grade",
    body: "No filler fluff — dense open-cell foam that holds shape for furniture, footwear and specialty builds across Bangladesh.",
    video: "/karmo/video/m.mp4",
  },
  {
    title: "Cut clean. Ready to build.",
    body: "Sheets and blocks cut to the inch for makers and workshops — airflow that lasts, edges that stay true.",
    video: "/karmo/video/p.mp4",
  },
];

export const FOAM_BUYBOX_ICONS = [
  {
    src: "/karmo/images/product/buybox-icons/warranty-10.png",
    label: "Long durability",
  },
  {
    src: "/karmo/images/product/buybox-icons/dual-side.png",
    label: "Custom cut sizes",
  },
  {
    src: "/karmo/images/product/buybox-icons/antimicrobial.png",
    label: "No fillers",
  },
  {
    src: "/karmo/images/product/buybox-icons/nights-100.png",
    label: "Maker ready",
  },
];

/** Shared letter strip — reuse Matrexx KARMO plates until foam letters ship. */
export const FOAM_LETTER_GALLERY = [
  "/products/product-01/gallery-3.jpg",
  "/products/product-01/gallery-5.jpg",
  "/products/product-01/gallery-4.jpg",
  "/products/product-01/gallery-1.jpg",
  "/products/product-01/gallery-2.jpg",
];

const REAL_BY_ID = {
  "combo-280": [
    `${PROD}/combo-280-room-hq.jpg`,
    `${PROD}/combo-280-hover-hq.jpg`,
    `${PROD}/combo-280-angle-hq.jpg`,
    `${PROD}/combo-280-detail-hq.jpg`,
  ],
  "combo-2001": [
    `${PROD}/combo-2001-room-hq.jpg`,
    `${PROD}/foam-grades-hover-hq.jpg`,
    `${PROD}/combo-280-angle-hq.jpg`,
  ],
  "combo-4g": [
    `${PROD}/combo-4g-room-hq.jpg`,
    `${PROD}/foam-grades-hover-hq.jpg`,
    `${PROD}/combo-280-detail-hq.jpg`,
  ],
  "combo-1965": [
    `${PROD}/combo-1965-room-hq.jpg`,
    `${PROD}/foam-grades-hover-hq.jpg`,
    `${PROD}/combo-280-hover-hq.jpg`,
  ],
  "combo-signature": [
    `${PROD}/combo-signature-room-hq.jpg`,
    `${PROD}/foam-grades-hover-hq.jpg`,
    `${PROD}/combo-280-angle-hq.jpg`,
  ],
  "rebonded-set": [
    `${PROD}/rebonded-set-room-hq.jpg`,
    `${PROD}/foam-grades-hover-hq.jpg`,
    `${PROD}/combo-280-detail-hq.jpg`,
  ],
};

function parseTaka(label) {
  if (!label) return 0;
  const n = Number(String(label).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const catalog = foam.products?.items || [];

export function getFoamProductSlugs() {
  return catalog.map((p) => p.id);
}

function buildRealGallery(item) {
  if (REAL_BY_ID[item.id]) return REAL_BY_ID[item.id];
  const shots = [item.image, item.imageHover, `${PROD}/combo-280-hover-hq.jpg`].filter(
    Boolean
  );
  return [...new Set(shots)];
}

function densityFromSpecs(item) {
  const hit = (item.specs || []).find((s) =>
    /firm|soft|dense|rebound|heritage|premium|balanced/i.test(String(s))
  );
  return hit || "Firm support";
}

function toDetail(item) {
  const price = parseTaka(item.now);
  const mrp = parseTaka(item.was) || price;
  const realGallery = buildRealGallery(item);
  const cover = item.image || realGallery[0];

  return {
    slug: item.id,
    sku: `KF-${String(item.shortName || item.id)
      .toUpperCase()
      .replace(/\s+/g, "")
      .slice(0, 12)}`,
    division: "Foam",
    divisionHref: "/foam",
    brand: "Karmo Foam",
    name: item.name,
    line: item.line || "Pure rubber grade foam — cut, tested and ready for makers",
    description:
      item.line ||
      "High-density resilience for furniture, footwear and specialty padding — pure rubber grade with firm airflow that holds for years.",
    category: item.category || "foam",
    firmness: densityFromSpecs(item),
    density: densityFromSpecs(item),
    cover,
    letterGallery: FOAM_LETTER_GALLERY,
    realGallery,
    gallery: realGallery,
    fabrics: foamColorOptions,
    fabricTitle: "Foam colour",
    densities: null,
    colors: foamColorOptions,
    sizes: foamSizePresetsFor(item.id),
    showCustomSize: true,
    price,
    mrp,
    priceLabel: item.now,
    wasLabel: item.was,
    unitNote: "Sales calculator · final quote by size (inch / CFT)",
    defaultHeight: defaultFoamHeightFor(item.id),
    features: foamProductFeatures,
    imageAlt: item.alt,
    buyboxIcons: FOAM_BUYBOX_ICONS,
    textureSrc: "/karmo/images/foam/foam-texture-bg.jpg",
    pricingFamily: "foam",
  };
}

export function getFoamProductDetail(productId) {
  if (!productId) return null;
  const item = catalog.find((p) => p.id === productId);
  if (!item) return null;
  return toDetail(item);
}

export const foamMorphSlides = [
  {
    id: "pose-01",
    src: `${PDP}/morph-pose-01.jpg`,
    alt: "Relaxed seating on a sofa built with Karmo Foam",
  },
  {
    id: "pose-02",
    src: `${PDP}/morph-pose-02.jpg`,
    alt: "Reading lounge on the same Karmo Foam sofa",
  },
  {
    id: "pose-03",
    src: `${PDP}/morph-pose-03.jpg`,
    alt: "Deep rest on a sofa supported by Karmo Foam",
  },
];

export const foamBuildSlides = [
  {
    id: "build-01",
    src: `${PDP}/build-01.jpg`,
    alt: "Sofa corner with coral Karmo Foam beside it",
    label: "Seating ready",
  },
  {
    id: "build-02",
    src: `${PDP}/build-02.jpg`,
    alt: "Open-cell Karmo Foam texture close-up",
    label: "Open-cell craft",
  },
  {
    id: "build-03",
    src: `${PDP}/build-03.jpg`,
    alt: "Stacked Karmo Foam grades on showroom floor",
    label: "Every grade",
  },
];

export const foamBanner = {
  bg: `${PDP}/banner-hq.jpg`,
  eyebrow: "Karmo Foam",
  heading: "Density crafted to endure",
  bodyLead: "pure rubber grade",
  body:
    " — cut, tested and ready for furniture makers, footwear lines and specialty padding across Bangladesh.",
  layers: [
    { src: `${PDP}/swatches/coral.jpg`, label: "Rubber grade" },
    { src: `${PDP}/swatches/blue.jpg`, label: "Signature density" },
    { src: `${PDP}/swatches/rebonded.jpg`, label: "Rebonded base" },
  ],
};
