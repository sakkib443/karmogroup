/**
 * HomeTex comforter catalogue. Same 18 prints as karmogroup.com/comforter,
 * with the live shop photo and the live sale price.
 * `/hometex/comforter/[slug]` resolves one of these.
 */

const IMG = "/products/hometex/comforter";

const taka = (label) => {
  const n = Number(String(label).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const PRINTS = [
  ["azure-bloom", "Azure Bloom"],
  ["crimson-royale", "Crimson Royale"],
  ["floral-harmony", "Floral Harmony"],
  ["floral-reverie", "Floral Reverie"],
  ["ivory-mosaic", "Ivory Mosaic"],
  ["maple-springveil", "Maple Springveil"],
  ["rosavelle", "Rosavelle"],
  ["rose-royal", "Rose Royal"],
  ["sapphire-mosaic", "Sapphire Mosaic"],
  ["autumn-grace", "Autumn Grace"],
  ["golden-weave", "Golden Weave"],
  ["red-stripe", "Red Stripe"],
  ["black-diamond", "Black Diamond"],
  ["multi-leaves", "Multi Leaves"],
  ["pink-flower", "Pink Flower"],
  ["blue-mandala", "Blue Mandala"],
  ["mist-flower", "Mist Flower"],
  ["ivory-flower", "Ivory Flower"],
];

const row = (id, print) => {
  const name = `Comforter ${print}`;
  const now = "৳ 2,200";
  const was = "৳ 3,150";
  return {
    slug: `comforter-${id}`,
    id: `comforter-${id}`,
    name,
    print,
    line: "Premium Comforter",
    size: "1 piece",
    division: "hometex",
    currency: "BDT",
    was,
    now,
    price: taka(now),
    mrp: taka(was),
    image: `${IMG}/${id}.webp`,
    alt: `Karmo ${name}, rolled, with the print name on the photo`,
    summary:
      "A Karmo premium comforter in 100% polyester microfiber. One piece, made for a warm, quiet night in every season.",
    category: "comforters",
  };
};

export const comforterCatalogue = PRINTS.map(([id, print]) => row(id, print));

/** Shape the HomeTex product grid already renders. */
export const comforterShopItems = comforterCatalogue.map((item) => ({
  id: item.slug,
  category: item.category,
  name: item.print,
  line: "Quilted microfiber, warm in every season",
  image: item.image,
  alt: item.alt,
  was: item.was,
  now: item.now,
  href: `/hometex/comforter/${item.slug}`,
  facts: ["One piece", "All season", "Microfiber"],
}));

const bySlug = new Map(comforterCatalogue.map((p) => [p.slug, p]));

export function getComforterProductSlugs() {
  return comforterCatalogue.map((p) => p.slug);
}

export function getComforterProductDetail(slug) {
  const product = bySlug.get(String(slug || ""));
  if (!product) return null;
  const at = comforterCatalogue.findIndex((p) => p.slug === product.slug);
  const related = [1, 2, 3, 4].map((step) => comforterCatalogue[(at + step) % comforterCatalogue.length]);
  return { ...product, gallery: [product.image], related };
}

/** Shipping weight of one comforter. An estimate until the packed weight is confirmed. */
export const COMFORTER_WEIGHT_KG = 2.5;

/** Fixed catalogue price. The order server asks for this at checkout. */
export function quoteComforterUnit(product) {
  const total = Number(product?.price) || 0;
  return {
    ok: total > 0,
    total,
    base: Number(product?.mrp) || total,
    name: product?.name || "",
    division: "hometex",
  };
}
