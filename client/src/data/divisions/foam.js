/**
 * Foam division — same shared template as the mattress (ideal) page, now filled
 * with the client's real foam artwork from `public/karmo/images/foam/`
 * (hero cutouts, gold-texture banner background and the 5 combo-offer tiles).
 *
 * ⚠ Prices below are PLACEHOLDERS read from the reference screenshot — confirm
 * the real combo prices and adjust `was` / `now`.
 */

const foam = {
  slug: "foam",

  banner: {
    /* Gold foam-texture background + warm wash — the foam page's signature look. */
    bg: "/karmo/images/foam/foam-texture-bg.jpg",
    overlay: "warm",
    badge: {
      src: "/karmo/images/home-02/hero/badge-number-one.webp",
      width: 420,
      height: 330,
    },
    eyebrowEnd: "Foam Brand",
    headline: "We Create the Chemistry of Comfort",
    cta: [
      { label: "Buy online", href: "#foam-offers", primary: true },
      { label: "Find in stores", href: "/contact" },
    ],
    /* The three branded foam-block cutouts rotate on the right. */
    slides: [
      {
        id: "280",
        name: "Karmo 280",
        sub: "High-density rubber-grade foam for firm, lasting support.",
        image: "/karmo/images/foam/hero/karmo-280.png",
        alt: "Stacked red Karmo 280 foam blocks",
      },
      {
        id: "signature",
        name: "Karmo Signature",
        sub: "Where signature comfort lies — our premium grade.",
        image: "/karmo/images/foam/hero/karmo-signature.png",
        alt: "Stacked blue Karmo Signature foam blocks",
      },
      {
        id: "1965",
        name: "Karmo 1965",
        sub: "The house classic — pure rubber comfort since 1965.",
        image: "/karmo/images/foam/hero/karmo-1965.png",
        alt: "Stacked yellow Karmo 1965 foam blocks",
      },
    ],
  },

  features: [
    {
      id: "years",
      icon: "/karmo/images/trust/legacy-60-years.png",
      title: "60 Years Strong",
      note: "Manufacturing since 1965",
    },
    {
      id: "pure",
      icon: "/karmo/images/trust/sustainable-products.png",
      title: "No Filler",
      note: "100% pure rubber grade",
    },
    {
      id: "delivery",
      icon: "/karmo/images/trust/delivery-icon.png",
      title: "Safe Delivery",
      note: "Across Bangladesh",
    },
    {
      id: "quality",
      icon: "/karmo/images/trust/recognised-super-brand.png",
      title: "ISO Certified",
      note: "International quality assured",
    },
  ],

  about: {
    headingLead: "Iconic brands, storied history —",
    headingAccent: "industry-leading innovation",
    kicker: "Crafted to last",
    eyebrow: "About Karmo Foam",
    bodyLead: "Karmo Foam",
    body:
      " is engineered to deliver legendary, long-lasting resilience. Made from 100% pure rubber-grade foam with no fillers, our foam holds its density, airflow and freshness through years of use. Whether for home furniture, commercial seating or specialty padding, Karmo Foam sets an exceptional standard of comfort and quality.",
    cta: [
      { label: "Find your perfect foam", href: "#foam-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    image: {
      src: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
      alt: "A deep blue velvet sofa built on Karmo foam",
    },
  },

  categories: {
    items: [
      {
        id: "furniture",
        name: "Furniture",
        line: "Sofas, cushions, seating",
        image: "/karmo/images/home-02/divisions/foam-karmo-zuti-sofa-olive.webp",
        alt: "Olive Karmo foam sofa in a styled room",
      },
      {
        id: "footwear",
        name: "Footwear",
        line: "Insoles, footbeds, tongues",
        image: "/karmo/images/home-02/divisions/foam-karmo-sofa-lavender-blocks.jpeg",
        alt: "Lavender foam blocks and sofa cushions",
      },
      {
        id: "automotive",
        name: "Automotive",
        line: "Seats, backs, headrests",
        image: "/karmo/images/home-02/foam-story/foam-blue-velvet-sofa.webp",
        alt: "Deep blue velvet sofa on a marigold wall",
      },
      {
        id: "specialty",
        name: "Specialty",
        line: "Memory & acoustic grades",
        image: "/karmo/images/home-02/collections/02-popular-karmo-foam-family.png",
        alt: "Karmo foam family product scene",
      },
    ],
  },

  /* The three-claim band — matched to the reference: No Filler / Long Durability
     / More Resilient. Icons are string keys resolved in DivisionPromise; the
     dark film background and foam clip come from the shared band's defaults. */
  promise: {
    heading: "Blending tradition with innovation",
    subline: "Lasting Comfort to your Doorstep",
    claims: [
      {
        id: "no-filler",
        icon: "droplet",
        badge: "bg-[#E03131]",
        title: "No Filler",
        body: "We use zero fillers in our foam. Karmo foam is built for maximum density, pure quality and real, long-lasting strength — comfort that stands strong through daily use.",
      },
      {
        id: "long-durability",
        icon: "shield",
        badge: "bg-[#1C7ED6]",
        title: "Long Durability",
        body: "Engineered to withstand heavy daily use without sagging or losing structural integrity. Our advanced foam holds its original shape and support for years.",
        solid: true,
      },
      {
        id: "more-resilient",
        icon: "arrow-down",
        badge: "bg-[#2F9E44]",
        title: "More Resilient",
        body: "Delivers superior rebound, flexible elasticity and optimal airflow. Designed to respond dynamically to pressure, for consistent body support and ergonomic comfort.",
      },
    ],
  },

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    offersId: "foam-offers",
    /* The 5 combo-offer tiles — each set ships with 5 free cushions. Prices are
       PLACEHOLDERS from the reference screenshot; confirm before launch. */
    items: [
      {
        id: "combo-280",
        category: "furniture",
        name: "280 Foam Combo Offer",
        image: "/karmo/images/foam/products/combo-280.jpg",
        alt: "Karmo 280 foam combo — 5-piece cushion set free",
        was: "৳ 9,890",
        now: "৳ 8,405",
      },
      {
        id: "combo-2001",
        category: "furniture",
        name: "2001 Foam Combo Offer",
        image: "/karmo/images/foam/products/combo-2001.jpg",
        alt: "Karmo 2001 foam combo — 5-piece cushion set free",
        was: "৳ 9,405",
        now: "৳ 7,995",
      },
      {
        id: "combo-4g",
        category: "specialty",
        name: "4G Foam Combo Offer",
        image: "/karmo/images/foam/products/combo-4g.jpg",
        alt: "Karmo 4G foam combo — 5-piece cushion set free",
        was: "৳ 9,405",
        now: "৳ 7,995",
      },
      {
        id: "combo-1965",
        category: "specialty",
        name: "1965 Foam Combo Offer",
        image: "/karmo/images/foam/products/combo-1965.jpg",
        alt: "Karmo 1965 foam combo — 5-piece cushion set free",
        was: "৳ 15,203",
        now: "৳ 12,922",
      },
      {
        id: "combo-signature",
        category: "specialty",
        name: "Signature Foam Combo Offer",
        image: "/karmo/images/foam/products/combo-signature.jpg",
        alt: "Karmo Signature foam combo — 5-piece cushion set free",
        was: "৳ 18,732",
        now: "৳ 15,922",
      },
    ],
  },
};

export default foam;
