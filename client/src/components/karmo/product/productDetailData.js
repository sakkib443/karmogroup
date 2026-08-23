/**
 * Shared Karmo product-detail page (not per-SKU yet).
 *
 * Gallery: the five images in `/public/products/product-01/`.
 */

const IMG = "/karmo/images/product";
const VID = "/karmo/video";
const GALLERY = "/products/product-01";

export const productGallery = [
  `${GALLERY}/gallery-1.jpg`,
  `${GALLERY}/gallery-2.jpg`,
  `${GALLERY}/gallery-3.jpg`,
  `${GALLERY}/gallery-4.jpg`,
  `${GALLERY}/gallery-5.jpg`,
];

export const productFeatures = [
  {
    title: "Pure rubber grade",
    body: "Made from 100% pure rubber-grade materials with zero fillers. Every block is poured for real density, clean cut edges and lasting strength that will not crumble under daily furniture use.",
    video: `${VID}/s.mp4`,
  },
  {
    title: "High resilience",
    body: "Engineered bounce and recovery so cushions and seats spring back after every sit. High-resilience foam keeps its shape across years of heavy household and commercial use.",
    video: `${VID}/m.mp4`,
    reverse: true,
  },
  {
    title: "Custom cut to size",
    body: "Order the exact width, length and height your frame needs. Karmo cuts furniture, footwear and automotive grades to measure so the fit is part of the product, not an afterthought.",
    video: `${VID}/l.mp4`,
  },
  {
    title: "Karmo lab tested",
    body: "Every grade is checked for density, compression and long-term wear. From pressure mapping to batch testing, the foam that leaves Motijheel has already been put through the paces.",
    video: `${VID}/p.mp4`,
    reverse: true,
  },
];

export const densityOptions = [
  { id: "soft", label: "Soft", note: "Cushions & backrests" },
  { id: "medium", label: "Medium", note: "Everyday seating" },
  { id: "firm", label: "Firm", note: "Heavy-duty seats" },
];

export const colorOptions = [
  { id: "natural", label: "Natural", hex: "#E8DCC8" },
  { id: "ivory", label: "Ivory", hex: "#F4F0E6" },
  { id: "grey", label: "Cool Grey", hex: "#9AA0A6" },
  { id: "charcoal", label: "Charcoal", hex: "#3D3D3D" },
  { id: "navy", label: "Navy", hex: "#1E3A5F" },
];

/** Fabric pattern swatches — from resource Product-Page.html. */
export const fabricOptions = [
  { id: "fabric-1", label: "Fabric 1", image: "/karmo/images/product/fabrics/fabric1.jpg" },
  { id: "fabric-2", label: "Fabric 2", image: "/karmo/images/product/fabrics/fabric2.jpg" },
  { id: "fabric-3", label: "Fabric 3", image: "/karmo/images/product/fabrics/fabric3.jpg" },
  { id: "fabric-4", label: "Fabric 4", image: "/karmo/images/product/fabrics/fabric4.jpg" },
  { id: "fabric-5", label: "Fabric 5", image: "/karmo/images/product/fabrics/fabric5.jpg" },
  { id: "fabric-6", label: "Fabric 6", image: "/karmo/images/product/fabrics/fabric6.jpg" },
  { id: "fabric-7", label: "Fabric 7", image: "/karmo/images/product/fabrics/fabric7.jpg" },
  { id: "fabric-8", label: "Fabric 8", image: "/karmo/images/product/fabrics/fabric8.jpg" },
  { id: "fabric-9", label: "Fabric 9", image: "/karmo/images/product/fabrics/fabric9.jpg" },
  { id: "fabric-10", label: "Fabric 10", image: "/karmo/images/product/fabrics/fabric10.jpg" },
  { id: "fabric-11", label: "Fabric 11", image: "/karmo/images/product/fabrics/fabric11.jpg" },
  { id: "fabric-12", label: "Fabric 12", image: "/karmo/images/product/fabrics/fabric12.jpg" },
];

/** Common sheet sizes in cm — Custom unlocks free W × L × H. */
export const sizePresets = [
  { id: "72x36x4", label: "72×36×4", note: "Sofa seat" },
  { id: "75x48x5", label: "75×48×5", note: "Deep seat" },
  { id: "90x60x6", label: "90×60×6", note: "Topper" },
  { id: "custom", label: "Custom", note: "Enter cm" },
];

export const sharedProductDetail = {
  slug: "karmo-180",
  sku: "KF-180-FRN",
  division: "Foam",
  divisionHref: "/foam",
  name: "Karmo 180 Furniture Foam",
  line: "Soft-to-medium rubber-grade sheet for sofas and everyday seating",
  description:
    "Pure rubber-grade foam with zero fillers — dense, springy and cut to your frame. Trusted for sofa seats and cushions since 1965.",
  category: "furniture",
  gallery: productGallery,
  fabrics: fabricOptions,
  densities: densityOptions,
  colors: colorOptions,
  sizes: sizePresets,
  showCustomSize: true,
  price: 6700,
  mrp: 7500,
  priceLabel: "৳ 6,700",
  wasLabel: "৳ 7,500",
  unitNote: "Starting price · final quote by size",
  features: productFeatures,
};

export function getSharedProductDetail() {
  return sharedProductDetail;
}
