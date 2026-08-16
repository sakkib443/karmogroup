/**
 * Mattress division catalogue — features, materials, categories and products
 * for `/mattress`. Content gathered from the client's Mattress Brochure
 * (`Mattress Brochure/mattress-text.md`, 28 pages).
 *
 * For now every Order Now opens the shared `/product-detail` page, exactly
 * like the Foam catalogue.
 */

export const mattressFeatures = [
  {
    id: "years",
    title: "Since 1965",
    note: "60 years of trusted sleep",
  },
  {
    id: "doctor",
    title: "Doctor Recommended",
    note: "Ergonomic spinal support",
  },
  {
    id: "antidust",
    title: "Anti-Dust & Hypoallergenic",
    note: "Healthier, cleaner sleep",
  },
  {
    id: "durability",
    title: "Up to 20-Year Life",
    note: "Turkey felt holds its shape",
  },
];

/**
 * The eight mattress models from the brochure (pages 4–19), each its own
 * category. Ids match the products below one-to-one, so clicking a card filters
 * the grid to that model. Labels sit *on* the image — homepage ShopByMaterial
 * treatment — in a three-column grid.
 */
export const mattressCategories = [
  {
    id: "orthopedic",
    name: "Orthopedic",
    line: "Spine, joint & posture support",
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-SyOgGVtUb8.jpg",
    alt: "Karmo Orthopedic mattress styled in a bedroom",
  },
  {
    id: "imperial",
    name: "Imperial",
    line: "The firmest, for back pain",
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-6A2NM3ciJO.png",
    alt: "Karmo Imperial firm mattress",
  },
  {
    id: "bonnell-spring",
    name: "Bonnell Spring",
    line: "Breathable open-coil comfort",
    image: "/karmo/images/home-02/divisions/mattress-karmo-grey-bedroom.webp",
    alt: "Karmo Bonnell Spring mattress",
  },
  {
    id: "pocket-spring",
    name: "Pocket Spring",
    line: "Independent pocket coils",
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-p88h92qehw.png",
    alt: "Karmo Pocket Spring mattress",
  },
  {
    id: "prestige",
    name: "Prestige",
    line: "Two-in-one dual comfort",
    image: "/karmo/images/home-02/divisions/mattress-karmo-floral-bedroom.png",
    alt: "Karmo Prestige dual-comfort mattress",
  },
  {
    id: "natural",
    name: "Natural",
    line: "100% coconut coir, eco-friendly",
    image: "/karmo/images/home-02/divisions/mattress-karmo-magnific-huuqthnvqL.jpg",
    alt: "Karmo Natural coir mattress",
  },
  {
    id: "king",
    name: "King",
    line: "Everyday value comfort",
    image: "/karmo/images/home-02/divisions/mattress-karmo-pro-foam-room.webp",
    alt: "Karmo King economy mattress",
  },
  {
    id: "folding",
    name: "Folding",
    line: "Tri-fold, go anywhere",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
    alt: "Karmo tri-fold folding mattress",
  },
];

/**
 * The eight live products from the client's own product artwork
 * (`matrexx products/`). Names, taglines and prices are taken from the client's
 * catalogue screenshot; each image is the client's finished promo tile, so the
 * model name and badges are already baked into the picture. Order matches the
 * catalogue: King → Prestige → Orthopedic → Imperial → Bonnell → Pillow Top →
 * Euro Top → Topper.
 */
export const mattressProducts = [
  {
    id: "king",
    category: "king",
    name: "King Mattress",
    line: "Best price for the best sleep — everyday value comfort.",
    image: "/karmo/images/mattress/products/king-web.jpg",
    alt: "Karmo King Mattress",
    was: "৳ 11,339",
    now: "৳ 9,622",
  },
  {
    id: "prestige",
    category: "prestige",
    name: "Prestige Mattress",
    line: "Flip for the perfect feel — dual-sided firm comfort.",
    image: "/karmo/images/mattress/products/prestige-web.jpg",
    alt: "Karmo Prestige Mattress",
    was: "৳ 12,290",
    now: "৳ 10,447",
  },
  {
    id: "orthopedic",
    category: "orthopedic",
    name: "Orthopedic Mattress",
    line: "Crafted for perfect posture — spine & joint support.",
    image: "/karmo/images/mattress/products/orthopedic-web.jpg",
    alt: "Karmo Orthopedic Mattress",
    was: "৳ 14,231",
    now: "৳ 12,096",
  },
  {
    id: "imperial-eurotop",
    category: "imperial-eurotop",
    name: "Imperial Euro Top Mattress",
    line: "Comfort you can trust — a plush euro-top feel.",
    image: "/karmo/images/mattress/products/imperial-eurotop-web.jpg",
    alt: "Karmo Imperial Euro Top Mattress",
    was: "৳ 19,406",
    now: "৳ 16,495",
  },
  {
    id: "bonnell-spring",
    category: "bonnell-spring",
    name: "Bonnell Spring Mattress",
    line: "Bounce into better sleep — breathable open coils.",
    image: "/karmo/images/mattress/products/bonnell-spring-web.jpg",
    alt: "Karmo Bonnell Spring Mattress",
    was: "৳ 23,675",
    now: "৳ 20,124",
  },
  {
    id: "pillow-top-pocket-spring",
    category: "pillow-top-pocket-spring",
    name: "Pillow Top Pocket Spring Mattress",
    line: "Experience of a lifetime — pocket coils under a pillow top.",
    image: "/karmo/images/mattress/products/pillow-top-pocket-spring-web.jpg",
    alt: "Karmo Pillow Top Pocket Spring Mattress",
    was: "৳ 52,396",
    now: "৳ 44,537",
  },
  {
    id: "euro-top-pocket-spring",
    category: "euro-top-pocket-spring",
    name: "Euro Top Pocket Spring Mattress",
    line: "Luxury you can afford — euro-top pocket spring comfort.",
    image: "/karmo/images/mattress/products/euro-top-pocket-spring-web.png",
    alt: "Karmo Euro Top Pocket Spring Mattress",
    was: "৳ 48,515",
    now: "৳ 41,238",
  },
  {
    id: "topper",
    category: "topper",
    name: "Mattress Topper",
    line: "More comfort, more protection — a plush extra layer.",
    image: "/karmo/images/mattress/products/topper-web.png",
    alt: "Karmo Mattress Topper",
    was: "৳ 5,821",
    now: "৳ 4,948",
  },
];
