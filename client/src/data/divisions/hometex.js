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
    style: "simple-slider",
    slides: [
      {
        id: "comforter-1",
        bg: "/karmo/images/chemicals/comforter.png",
        headline: "Moments that make a house",
        align: "left",
      },
      {
        id: "comforter-2",
        bg: "/karmo/images/chemicals/comforter 2.png",
        headline: "BREATHABLE WARMTH",
        align: "right",
        contentClassName: "pb-24",
      }
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

  recommended: {
    heading: "Which Karmo foam is right for you",
    columns: [
      {
        id: "firm",
        image: "/karmo/images/foam-2/why/why-firm-hq.jpg",
        alt: "Upright seating on a firm sofa — cushions hold their shape",
        caption: "If you need firm support that holds its shape",
      },
      {
        id: "density",
        image: "/karmo/images/foam-2/why/why-density-hq.jpg",
        alt: "Cutaway of dense furniture foam that holds its loft for years",
        caption: "If you want density that lasts for years",
      },
      {
        id: "airflow",
        image: "/karmo/images/foam-2/why/why-airflow-hq.jpg",
        alt: "Relaxed seating by an open window — cool airflow comfort",
        caption: "If you prefer cool, open airflow comfort",
      },
    ],
  },

  shapeGrid: {
    skin: "organized",
    background: "/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
    highlights: [
      {
        id: "no-filler",
        icon: "shield",
        badge: "red",
        title: "No Filler",
        overview:
          "100% pure rubber-grade foam — maximum density, clean finish and strength that stands through daily use.",
        background: "/karmo/images/foam-2/mosaic/exploded-layers-hq.jpg",
      },
      {
        id: "long-durability",
        icon: "feather",
        badge: "blue",
        title: "Long Durability",
        overview:
          "Engineered to resist sagging and hold structure — support that stays true for years of seating.",
        background: "/karmo/images/foam-2/why/why-density-hq.jpg",
      },
      {
        id: "more-resilient",
        icon: "certificate",
        badge: "green",
        title: "More Resilient",
        overview:
          "Superior rebound and firm airflow so cushions recover quickly and stay comfortable.",
        background: "/karmo/images/foam-2/why/why-firm-hq.jpg",
      },
    ],
    spotlight: {
      align: "left",
      image: "/karmo/images/chemicals/comfort 6.png",
      alt: "Teal foam sofa in a bright contemporary living room",
      headingLead: "Designed",
      headingAccent: "to",
      headingEnd: "endure",
      subline: "Set foam grades for sofas, cushions and everyday living rooms.",
      brand: "Karmo Foam",
    },
    inside: {
      heading: "Inside every",
      accent: "set",
      body: "Open-cell polyurethane, no fillers, rubber-grade density and fine cell structure — cut to size for furniture makers, then tested one by one.",
      background: "/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
      layers: [
        {
          id: "open-cell",
          name: "Open-cell PU",
          line: "Flexible foam so air can pass — cool seating that does not trap heat.",
        },
        {
          id: "no-filler",
          name: "No filler used",
          line: "Catalogue grade is 100% foam. Density holds because nothing cheap is mixed in.",
        },
        {
          id: "rubber",
          name: "Rubber-grade density",
          line: "From Poly at 25 kg/m³ to 1965 at 50 kg/m³ — pick the load the sofa needs.",
        },
        {
          id: "cell",
          name: "Fine cell structure",
          line: "Even cells for clean cuts, fine finish and rebound that comes back.",
        },
        {
          id: "set",
          name: "Maker set sizes",
          line: "22×22×4 and 22×18×3 packs, or any cut the upholstery line asks for.",
        },
        {
          id: "airflow",
          name: "Measured airflow",
          line: "TDS-rated scfm so cushions stay supportive without going dead.",
        },
      ],
      photo: {
        src: "/karmo/images/chemicals/comfort 5.png",
        alt: "Sofa cushion peeled back to show Karmo set foam inside",
      },
    },
    faqs: [
      {
        id: "grade",
        question: "What does rubber-grade foam mean at Karmo?",
        answer:
          "It means high-density polyurethane built without cheap fillers — firmer airflow, cleaner recovery and density that holds for sofas, cushions and specialty padding.",
      },
      {
        id: "density",
        question: "How do I choose density for sofas and cushions?",
        answer:
          "Seat bases favour higher density (HD, 4G, 1965). Backs and throws can run softer (Poly, 280). Visit a store to compare grades side by side.",
      },
      {
        id: "set-size",
        question: "What set sizes do you cut for furniture makers?",
        answer:
          "Standard sets are 22×22×4 (5 pcs) and 22×18×3 (5 pcs). Any required size can be cut to the maker’s spec.",
      },
      {
        id: "care",
        question: "How should I care for foam after delivery?",
        answer:
          "Keep foam dry, avoid direct heat and sharp folds, and cover finished pieces. Store cut sheets flat and away from prolonged sun.",
      },
    ],
  },

  lounge: {
    layout: "overlay",
    headingLead: "The comfort you feel",
    headingAccent: "every day",
    kicker: "Sink into Karmo Foam seating",
    cta: [{ label: "Find your perfect foam", href: "#foam-offers", primary: true }],
    image: {
      src: "/karmo/images/chemicals/comforter 3.png",
      alt: "A woman resting on a plush foam sofa in a calm living room",
      width: 1920,
      height: 1080,
    },
    slides: [
      {
        id: "lounge",
        align: "left",
        headingLead: "The comfort you feel",
        headingAccent: "every day",
        kicker: "Sink into Karmo Foam seating",
        cta: [{ label: "Find your perfect foam", href: "#foam-offers", primary: true }],
        image: {
          src: "/karmo/images/chemicals/comforter 3.png",
          alt: "A woman resting on a plush foam sofa in a calm living room",
          width: 1920,
          height: 1080,
        },
      },
    ],
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
