/**
 * HomeTex division — same template as the mattress (ideal) page.
 *
 * SCAFFOLD: images use the existing HomeTex artwork; product names and prices
 * are placeholders. Swap in the real catalogue when ready:
 *   · banner.slides — cutout HomeTex PNGs (bedding sets on transparent bg)
 *   · products[] — real SKUs, prices and images
 *   · features[].icon — proper HomeTex trust badges
 * `promise` is left empty on purpose: the shared band's default copy already
 * covers bedding, so it reads correctly here.
 */

const hometex = {
  slug: "hometex",

  banner: {
    bg: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
    badge: {
      src: "/karmo/images/home-02/hero/badge-number-one.webp",
      width: 420,
      height: 330,
    },
    eyebrowEnd: "HomeTex Brand",
    headline: "Dressed for Rest",
    cta: [
      { label: "Buy online", href: "#hometex-offers", primary: true },
      { label: "Find in stores", href: "/contact" },
    ],
    slides: [
      {
        id: "bedding-set",
        name: "Bedding Sets",
        sub: "Premium cotton bed sheets that dress the whole room.",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
        alt: "Karmo HomeTex bedding set",
      },
      {
        id: "comforter",
        name: "Comforters",
        sub: "Soft, breathable warmth for every season.",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
        alt: "Karmo HomeTex comforter styled in a studio",
      },
      {
        id: "bedding-room",
        name: "Complete Bedding",
        sub: "Coordinated linen, from sheets to pillow covers.",
        image: "/karmo/images/home-02/divisions/hometex-bedding-set.webp",
        alt: "Karmo HomeTex complete bedding",
      },
    ],
  },

  features: [
    {
      id: "years",
      icon: "/karmo/images/trust/legacy-60-years.png",
      title: "Since 1965",
      note: "Six decades of home comfort",
    },
    {
      id: "cotton",
      icon: "/karmo/images/trust/sustainable-products.png",
      title: "Premium Cotton",
      note: "Soft, breathable, long-lasting",
    },
    {
      id: "antidust",
      icon: "/karmo/images/trust/trusted-families.png",
      title: "Anti-Dust Weave",
      note: "Cleaner, healthier bedding",
    },
    {
      id: "care",
      icon: "/karmo/images/trust/recognised-super-brand.png",
      title: "Easy Care",
      note: "Machine washable, colour-fast",
    },
  ],

  about: {
    headingLead: "Moments that make a house",
    headingAccent: "feel like home",
    kicker: "We finish every set, every single stitch",
    eyebrow: "About Karmo HomeTex",
    bodyLead: "Karmo HomeTex",
    body:
      " dresses your bedroom in premium cotton comfort — bed sheets, comforters, pillow covers and coordinated linen woven for softness that lasts. Breathable, anti-dust and colour-fast, every set is finished to bring the calm of a made bed to your home, wash after wash.",
    cta: [
      { label: "Shop the bedding", href: "#hometex-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    image: {
      src: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
      alt: "A Karmo HomeTex bedding set styled in a bright bedroom",
    },
  },

  categories: {
    items: [
      {
        id: "bed-sheets",
        name: "Bed Sheets",
        line: "Fitted & flat, premium cotton",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
        alt: "Karmo HomeTex bed sheet set",
      },
      {
        id: "comforters",
        name: "Comforters",
        line: "Season-ready warmth",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
        alt: "Karmo HomeTex comforter",
      },
      {
        id: "pillows",
        name: "Pillows & Covers",
        line: "Supportive, breathable",
        image: "/karmo/images/home-02/divisions/hometex-bedding-set.webp",
        alt: "Karmo HomeTex pillows and covers",
      },
      {
        id: "linen",
        name: "Complete Linen",
        line: "Coordinated room sets",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
        alt: "Karmo HomeTex complete linen set",
      },
    ],
  },

  promise: {},

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    offersId: "hometex-offers",
    /* TODO: placeholder SKUs and prices — replace with the real HomeTex catalogue. */
    items: [
      {
        id: "cotton-bedsheet-set",
        category: "bed-sheets",
        name: "Cotton Bed Sheet Set",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
        alt: "Karmo cotton bed sheet set",
        was: "৳ 3,200",
        now: "৳ 2,720",
      },
      {
        id: "premium-comforter",
        category: "comforters",
        name: "Premium Comforter",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
        alt: "Karmo premium comforter",
        was: "৳ 4,500",
        now: "৳ 3,825",
      },
      {
        id: "complete-bedding",
        category: "linen",
        name: "Complete Bedding Set",
        image: "/karmo/images/home-02/divisions/hometex-bedding-set.webp",
        alt: "Karmo complete bedding set",
        was: "৳ 6,900",
        now: "৳ 5,865",
      },
      {
        id: "bedroom-linen",
        category: "linen",
        name: "Bedroom Linen Set",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
        alt: "Karmo bedroom linen set",
        was: null,
        now: "৳ 4,200",
      },
      {
        id: "pillow-pair",
        category: "pillows",
        name: "Cotton Pillow Pair",
        image: "/karmo/images/home-02/divisions/hometex-bed-linen.jpg",
        alt: "Karmo cotton pillow pair",
        was: "৳ 1,600",
        now: "৳ 1,360",
      },
      {
        id: "studio-duvet",
        category: "comforters",
        name: "Studio Duvet",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-studio.png",
        alt: "Karmo studio duvet",
        was: "৳ 5,200",
        now: "৳ 4,420",
      },
      {
        id: "everyday-sheet",
        category: "bed-sheets",
        name: "Everyday Sheet Set",
        image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-set.png",
        alt: "Karmo everyday sheet set",
        was: null,
        now: "৳ 2,100",
      },
      {
        id: "luxury-linen",
        category: "linen",
        name: "Luxury Linen Collection",
        image: "/karmo/images/home-02/divisions/hometex-bedding-set.webp",
        alt: "Karmo luxury linen collection",
        was: "৳ 8,900",
        now: "৳ 7,565",
      },
    ],
  },
};

export default hometex;
