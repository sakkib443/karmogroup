/**
 * Mattress (Matrexx) division — the client's IDEAL page, now expressed as data.
 * Design lives in `components/karmo/division/`; this file is only content.
 *
 * Content gathered from the Mattress Brochure (`Mattress Brochure/`, 28 pages)
 * and the client's own product artwork (`matrexx products/`).
 *
 * `promise.claims[].icon` is a STRING key (resolved to a real icon inside the
 * client component) — data must stay serialisable to cross the server boundary.
 */

const mattress = {
  slug: "mattress",

  banner: {
    bg: "/karmo/images/mattress/mattress-sleep-well-bg.jpg",
    badge: {
      src: "/karmo/images/home-02/hero/badge-number-one.webp",
      width: 420,
      height: 330,
    },
    eyebrowEnd: "Mattress Brand",
    headline: "Always Sound Sleep",
    cta: [
      { label: "Buy online", href: "#mattress-offers", primary: true },
      { label: "Find in stores", href: "/contact" },
    ],
    /* Only `name` + `sub` + `image` change per slide. */
    slides: [
      {
        id: "eurotop",
        name: "Euro Top Pocket Spring",
        sub: "Pocketed coils under a plush memory-foam pillow top.",
        image: "/karmo/images/mattress/hero-eurotop-pocket.png",
        alt: "Karmo Euro Top Pocket Spring mattress",
      },
      {
        id: "bonnell",
        name: "Bonnell Spring",
        sub: "Breathable open-coil support, crafted to perfection.",
        image: "/karmo/images/mattress/hero-bonnell.png",
        alt: "Karmo Bonnell Spring mattress",
      },
      {
        id: "pillowtop",
        name: "Pillow Top Pocket Spring",
        sub: "Bedding excellence since 1965 — luxury you can feel.",
        image: "/karmo/images/mattress/hero-pillowtop-pocket.png",
        alt: "Karmo Pillow Top Pocket Spring mattress",
      },
    ],
  },

  /* ⚠ Only "Since 1965" has a true badge. The other three reuse existing trust
     badges as stand-ins — swap in proper Doctor / Anti-Dust / 20-Year badges
     when they exist. */
  features: [
    {
      id: "years",
      icon: "/karmo/images/trust/legacy-60-years.png",
      title: "Since 1965",
      note: "60 years of trusted sleep",
    },
    {
      id: "doctor",
      icon: "/karmo/images/trust/trusted-families.png",
      title: "Doctor Recommended",
      note: "Ergonomic spinal support",
    },
    {
      id: "antidust",
      icon: "/karmo/images/trust/sustainable-products.png",
      title: "Anti-Dust & Hypoallergenic",
      note: "Healthier, cleaner sleep",
    },
    {
      id: "durability",
      icon: "/karmo/images/trust/recognised-super-brand.png",
      title: "Up to 20-Year Life",
      note: "Turkey felt holds its shape",
    },
  ],

  about: {
    headingLead: "Moments that make a house",
    headingAccent: "feel like home",
    kicker: "We test every mattress, every single one",
    eyebrow: "About Karmo Mattress",
    bodyLead: "Karmo Mattress",
    body:
      " gives you luxury in sensational comfort, engineered for peaceful, healthy sleep across every season. Built in layers of hi-density rebonded and polyethylene foam, Turkey-imported felt, and — depending on the model — pocket springs or natural coconut coir. Anti-allergic, anti-dust and ergonomically shaped for your spine, every mattress is tested one by one for comfort that lasts.",
    cta: [
      { label: "Find your perfect mattress", href: "#mattress-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    image: {
      src: "/karmo/images/home-02/divisions/mattress-karmo-floral-bedroom.png",
      alt: "A Karmo mattress styled in a bright, restful bedroom",
    },
  },

  /* Kept for when the category gallery is re-enabled (hidden by default). */
  categories: {
    items: [
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
    ],
  },

  promise: {
    heading: "Sleep Well, Live Well",
    subline: "Everyone Assures Quality, But Not Everyone Can Promise Experience",
    still: "/karmo/images/mattress/mattress-sleep-well-bg.jpg",
    film: "/karmo/videos/mattress-sleep-well.mp4",
    showFilm: true,
    claims: [
      {
        id: "long-lasting",
        icon: "shield",
        badge: "bg-[#E03131]",
        title: "Long Lasting",
        body: "Built with premium-quality materials and durable non-sag filling, Karmo mattresses are designed to hold their shape and comfort over the years — real support and lasting performance for years of restful sleep.",
      },
      {
        id: "anti-allergic",
        icon: "feather",
        badge: "bg-[#1C7ED6]",
        title: "Anti Allergic",
        body: "Our mattresses feature anti-allergic filling and breathable cotton fabric to reduce dust and allergens, giving you a cleaner, healthier sleeping environment for you and your family.",
        /* The odd card out — solid white in the middle, like the homepage band. */
        solid: true,
      },
      {
        id: "quality-certified",
        icon: "certificate",
        badge: "bg-[#2F9E44]",
        title: "Quality Certified",
        body: "Experience exceptional rest built with premium cotton fabric and high-density microfibre filling. Gentle on the skin and breathable — a naturally cosy rest for a peaceful night's sleep.",
      },
    ],
  },

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    offersId: "mattress-offers",
    items: [
      {
        id: "king",
        category: "king",
        name: "King Mattress",
        image: "/karmo/images/mattress/products/king-web.jpg",
        alt: "Karmo King Mattress",
        was: "৳ 11,339",
        now: "৳ 9,622",
      },
      {
        id: "prestige",
        category: "prestige",
        name: "Prestige Mattress",
        image: "/karmo/images/mattress/products/prestige-web.jpg",
        alt: "Karmo Prestige Mattress",
        was: "৳ 12,290",
        now: "৳ 10,447",
      },
      {
        id: "orthopedic",
        category: "orthopedic",
        name: "Orthopedic Mattress",
        image: "/karmo/images/mattress/products/orthopedic-web.jpg",
        alt: "Karmo Orthopedic Mattress",
        was: "৳ 14,231",
        now: "৳ 12,096",
      },
      {
        id: "imperial-eurotop",
        category: "imperial-eurotop",
        name: "Imperial Euro Top Mattress",
        image: "/karmo/images/mattress/products/imperial-eurotop-web.jpg",
        alt: "Karmo Imperial Euro Top Mattress",
        was: "৳ 19,406",
        now: "৳ 16,495",
      },
      {
        id: "bonnell-spring",
        category: "bonnell-spring",
        name: "Bonnell Spring Mattress",
        image: "/karmo/images/mattress/products/bonnell-spring-web.jpg",
        alt: "Karmo Bonnell Spring Mattress",
        was: "৳ 23,675",
        now: "৳ 20,124",
      },
      {
        id: "pillow-top-pocket-spring",
        category: "pillow-top-pocket-spring",
        name: "Pillow Top Pocket Spring Mattress",
        image: "/karmo/images/mattress/products/pillow-top-pocket-spring-web.jpg",
        alt: "Karmo Pillow Top Pocket Spring Mattress",
        was: "৳ 52,396",
        now: "৳ 44,537",
      },
      {
        id: "euro-top-pocket-spring",
        category: "euro-top-pocket-spring",
        name: "Euro Top Pocket Spring Mattress",
        image: "/karmo/images/mattress/products/euro-top-pocket-spring-web.png",
        alt: "Karmo Euro Top Pocket Spring Mattress",
        was: "৳ 48,515",
        now: "৳ 41,238",
      },
      {
        id: "topper",
        category: "topper",
        name: "Mattress Topper",
        image: "/karmo/images/mattress/products/topper-web.png",
        alt: "Karmo Mattress Topper",
        was: "৳ 5,821",
        now: "৳ 4,948",
      },
    ],
  },
};

export default mattress;
