/**
 * Karmo Foam product-detail data.
 * `/foam/[slug]` resolves a catalogue SKU from the foam division list.
 */

import foam from "@/data/divisions/foam";
import {
  defaultFoamHeightFor,
  foamSizePresetsFor,
  getFoamPricingRule,
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

const PDP = "/products/foam/detail";

export const foamColorOptions = [
  { id: "coral", label: "Coral 280", image: `${PDP}/swatches/coral.webp` },
  { id: "olive", label: "Olive 2001", image: `${PDP}/swatches/olive.webp` },
  { id: "lavender", label: "Lavender 4G", image: `${PDP}/swatches/lavender.webp` },
  { id: "gold", label: "Gold 1965", image: `${PDP}/swatches/gold.webp` },
  { id: "blue", label: "Signature Blue", image: `${PDP}/swatches/blue.webp` },
  { id: "rebonded", label: "Rebonded", image: `${PDP}/swatches/rebonded.webp` },
];

export const foamProductFeatures = [
  {
    title: "Pure rubber grade",
    body: "No filler fluff — dense open-cell foam that holds shape for furniture, footwear and specialty builds across Bangladesh.",
    video: "/products/videos/ball-drop.mp4",
  },
  {
    title: "Cut clean. Ready to build.",
    body: "Sheets and blocks cut to the inch for makers and workshops — airflow that lasts, edges that stay true.",
    video: "/products/videos/durability-test.mp4",
  },
];

export const FOAM_BUYBOX_ICONS = [
  {
    src: "/products/common/buybox-icons/warranty-10.webp",
    label: "Long durability",
  },
  {
    src: "/products/common/buybox-icons/dual-side.webp",
    label: "Custom cut sizes",
  },
  {
    src: "/products/common/buybox-icons/antimicrobial.webp",
    label: "No fillers",
  },
  {
    src: "/products/common/buybox-icons/nights-100.webp",
    label: "Maker ready",
  },
];

/** Shared letter strip — reuse Matrexx KARMO plates until foam letters ship. */
export const FOAM_LETTER_GALLERY = [
  "/products/foam/gallery/gallery-3.webp",
  "/products/foam/gallery/gallery-5.webp",
  "/products/foam/gallery/gallery-4.webp",
  "/products/foam/gallery/gallery-1.webp",
  "/products/foam/gallery/gallery-2.webp",
];

function parseTaka(label) {
  if (!label) return 0;
  const n = Number(String(label).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const catalog = foam.products?.items || [];

export function getFoamProductSlugs() {
  return catalog.map((p) => p.id);
}

/* The detail page shows the cover alone — the other shots didn't belong to the product. */
function buildRealGallery(item) {
  return [item.image].filter(Boolean);
}

function densityFromSpecs(item) {
  const hit = (item.specs || []).find((s) =>
    /firm|soft|dense|rebound|heritage|premium|balanced/i.test(String(s))
  );
  return hit || "Firm support";
}

const SET_SIZES = [
  "22″ × 22″ × 4″ — 5 sit pieces",
  "22″ × 18″ × 3″ — 5 back pieces",
];

const BED_SIZES = [
  "72″ × 36″ × 4″",
  "72″ × 36″ × 3″",
  "72″ × 36″ × 2″",
  "72″ × 36″ × 1″",
  "72″ × 36″ × ½″",
  "Any size on request",
];

const CUSHION_USE =
  "Cushioning for bedding, furniture, automotive interiors, carpet underlay and packaging. Light, durable and comfortable. Also used in vehicle seats, roof liners, dashboards and instrument panels, and in footwear and garment accessories.";

const UPHOLSTERY_USE =
  "A major component for upholstery and furniture, and known for bedding and automotive work. Also used in vehicle seats, roof liners, dashboards and instrument panels, and in footwear and garment accessories.";

function tds(density, ifd25, ifd65, tensile, elongation, airflow) {
  return [
    { label: "Density", value: density },
    { label: "IFD 25%", value: ifd25 },
    { label: "IFD 65%", value: ifd65 },
    { label: "Tensile strength", value: tensile },
    { label: "Elongation", value: elongation },
    { label: "Air flow", value: airflow },
  ];
}

/**
 * Facts taken from the Karmo Foam Catalogue grade pages.
 * Only furniture SKUs with their own page are listed.
 */
const FOAM_CATALOGUE = {
  poly: {
    grade: "Standard grade",
    color: "Ash",
    noFiller: true,
    technical: tds("25 (±) kg/m³", "58.5 lbs", "120.8 lbs", "14.7 PSI", "111%", "3.3 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["Durable", "Resilient", "Flexible", "Higher durability"],
    use: CUSHION_USE,
  },
  "combo-280": {
    grade: "Semi rubber grade",
    color: "Pink",
    noFiller: true,
    technical: tds("30 (±) kg/m³", "61.6 lbs", "127.7 lbs", "15.1 PSI", "122%", "2.4 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["Durable", "Resilient", "Flexible", "Higher durability", "Semi rubber foam grade"],
    use: CUSHION_USE,
  },
  "combo-2001": {
    grade: "Full rubber grade",
    color: "Purple",
    noFiller: true,
    technical: tds("37 (±) kg/m³", "62.8 lbs", "130.3 lbs", "15.9 PSI", "135%", "2.2 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["More loaded foam", "Naturally elastic", "More resilient", "Fine cell structure", "Rubber grade foam"],
    use: UPHOLSTERY_USE,
  },
  hd: {
    grade: "Full rubber grade",
    color: "Lime green",
    noFiller: true,
    technical: tds("40 (±) kg/m³", "66.1 lbs", "137.5 lbs", "18 PSI", "171%", "1.7 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["Elastic nature", "More resilient", "Fine cell structure", "Rubber grade foam", "Higher durability"],
    use: CUSHION_USE,
  },
  "combo-4g": {
    grade: "Pure rubber grade",
    color: "Olive",
    noFiller: true,
    technical: tds("45 (±) kg/m³", "66 lbs", "137.5 lbs", "18.4 PSI", "185%", "1.5 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["More hardness", "More bounce", "Higher durability", "More resilience", "More flexible", "Pure rubber grade foam", "Higher density"],
    use: UPHOLSTERY_USE,
  },
  "combo-1965": {
    grade: "Full rubber grade",
    color: "Bright yellow",
    noFiller: true,
    technical: tds("50 (±) kg/m³", "65.7 lbs", "137 lbs", "18.9 PSI", "207%", "1.3 scfm"),
    setSizes: SET_SIZES,
    bedSizes: BED_SIZES,
    features: ["Most durable", "Most resilient", "Flexible", "Weighted foam", "Pure rubber grade foam", "Finest cell structure", "High density"],
    use: CUSHION_USE,
  },
  "foam-sit": {
    grade: "Sit piece",
    piece: "22″ × 22″ × 4″",
    specLabels: ["Size", "Pack", "Place"],
    setSizes: ["Sold here as 1 piece", "A catalogue set includes 5 of these sit pieces"],
    note: "This is the sit cushion listed on every furniture grade page. The brochure does not give it a density of its own.",
  },
  "foam-back": {
    grade: "Back piece",
    piece: "22″ × 18″ × 3″",
    specLabels: ["Size", "Pack", "Place"],
    setSizes: ["Sold here as 1 piece", "A catalogue set includes 5 of these back pieces"],
    note: "This is the back cushion listed on every furniture grade page. The brochure does not give it a density of its own.",
  },
};

function toDetail(item) {
  const price = parseTaka(item.now);
  const mrp = parseTaka(item.was) || price;
  const realGallery = buildRealGallery(item);
  const cover = item.image || realGallery[0];
  const catalogue = FOAM_CATALOGUE[item.id] || null;
  const densityValue = catalogue?.technical?.find((row) => row.label === "Density")?.value;

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
    firmness: densityValue || densityFromSpecs(item),
    density: densityValue || densityFromSpecs(item),
    cover,
    letterGallery: [],
    realGallery,
    gallery: realGallery,
    fabrics: foamColorOptions,
    fabricTitle: "Foam colour",
    densities: null,
    colors: foamColorOptions,
    /* Only SKUs with a pricing rule are sized; the rest (Sit, Back) are sold by the piece. */
    sizes: getFoamPricingRule(item.id) ? foamSizePresetsFor(item.id) : [],
    showCustomSize: Boolean(getFoamPricingRule(item.id)),
    pack: item.thickness || "",
    specs: item.specs || [],
    specLabels: catalogue?.specLabels || ["Density", "Colour", "In the set"],
    catalogue,
    badge: item.badge || "",
    rating: item.rating || 0,
    reviews: item.reviews || 0,
    price,
    mrp,
    priceLabel: item.now,
    wasLabel: item.was,
    unitNote: "Sales calculator · final quote by size (inch / CFT)",
    defaultHeight: defaultFoamHeightFor(item.id),
    features: foamProductFeatures,
    imageAlt: item.alt,
    buyboxIcons: FOAM_BUYBOX_ICONS,
    textureSrc: "/products/foam/foam-texture-bg.webp",
    pricingFamily: "foam",
  };
}

/** Every furniture grade with a density, lightest first — the scale on the detail page. */
export const FOAM_GRADE_SCALE = catalog
  .map((item) => {
    const c = FOAM_CATALOGUE[item.id];
    const density = parseFloat(c?.technical?.[0]?.value);
    if (!Number.isFinite(density)) return null;
    return {
      slug: item.id,
      name: String(item.name).replace(/\s*Foam Combo Offer$/i, ""),
      grade: c.grade,
      color: c.color,
      density,
      image: item.image,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.density - b.density);

export function getFoamProductDetail(productId) {
  if (!productId) return null;
  const item = catalog.find((p) => p.id === productId);
  if (!item) return null;
  return toDetail(item);
}

export const foamMorphSlides = [
  {
    id: "pose-01",
    src: `${PDP}/morph-pose-01.webp`,
    alt: "Relaxed seating on a sofa built with Karmo Foam",
  },
  {
    id: "pose-02",
    src: `${PDP}/morph-pose-02.webp`,
    alt: "Reading lounge on the same Karmo Foam sofa",
  },
  {
    id: "pose-03",
    src: `${PDP}/morph-pose-03.webp`,
    alt: "Deep rest on a sofa supported by Karmo Foam",
  },
];

export const foamBuildSlides = [
  {
    id: "build-01",
    src: `${PDP}/build-01.webp`,
    alt: "Sofa corner with coral Karmo Foam beside it",
    label: "Seating ready",
  },
  {
    id: "build-02",
    src: `${PDP}/build-02.webp`,
    alt: "Open-cell Karmo Foam texture close-up",
    label: "Open-cell craft",
  },
  {
    id: "build-03",
    src: `${PDP}/build-03.webp`,
    alt: "Stacked Karmo Foam grades on showroom floor",
    label: "Every grade",
  },
];

export const foamBanner = {
  bg: `${PDP}/banner-hq.webp`,
  eyebrow: "Karmo Foam",
  heading: "Density crafted to endure",
  bodyLead: "pure rubber grade",
  body:
    " — cut, tested and ready for furniture makers, footwear lines and specialty padding across Bangladesh.",
  layers: [
    { src: `${PDP}/swatches/coral.webp`, label: "Rubber grade" },
    { src: `${PDP}/swatches/blue.webp`, label: "Signature density" },
    { src: `${PDP}/swatches/rebonded.webp`, label: "Rebonded base" },
  ],
};
