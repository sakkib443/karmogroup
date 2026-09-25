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
        bg: "/karmo/images/hometex/hometex-first-sub/bed.png",
        headline: "BREATHABLE WARMTH",
        align: "right",
        contentClassName: "pt-[18vh]",
      }
    ],
  },

  features: [
    {
      id: "legacy",
      title: "A legacy of 60 years",
      note: "of healthy sleep",
      icon: "/karmo/images/trust/cartoon-v3/legacy-60-v2.webp",
    },
    {
      id: "trusted",
      title: "Trusted By Million",
      note: "families worldwide.",
      icon: "/karmo/images/trust/cartoon-v3/trusted-v3.webp",
    },
    {
      id: "recognised",
      title: "Recognised By",
      note: "Super Brand",
      icon: "/karmo/images/trust/cartoon-v3/superbrand-v3.webp",
    },
    {
      id: "natural",
      title: "Natural and",
      note: "Sustainable Products",
      icon: "/karmo/images/trust/cartoon-v3/natural-v2.webp",
    },
    {
      id: "delivery",
      title: "Free Delivery",
      note: "Available",
      icon: "/karmo/images/trust/cartoon-v3/delivery-v2.webp",
    },
    {
      id: "stores",
      title: "5k+ Stores",
      note: "Pan Bangladesh",
      icon: "/karmo/images/trust/cartoon-v3/stores-v2.webp",
    },
  ],

  /* "Why Choose Karmo HomeTex" — using the recommended component format to match mattress page design */
  recommended: {
    heading: "Why Choose Karmo HomeTex ?",
    columns: [
      {
        id: "comfort",
        image: "/karmo/images/hometex/hometex-first-sub/made.png",
        caption: "Unmatched Everyday Comfort",
        alt: "Karmo HomeTex bedding set",
      },
      {
        id: "cotton",
        image: "/karmo/images/hometex/hometex-first-sub/sleep.png",
        caption: "Premium Cotton Weave",
        alt: "Karmo HomeTex studio bedding",
      },
      {
        id: "everyone",
        image: "/karmo/images/hometex/hometex-first-sub/rounded.png",
        caption: "Pure Comfort For Everyone",
        alt: "Karmo HomeTex bedroom linen",
      },
    ],
  },

  /* Use the forked HometexShapeGrid (abu-taleb design). Foam/mattress keep the
     shared DivisionShapeGrid (main's design) — see DivisionPage. */
  shapeGridVariant: "hometex",

  shapeGrid: {
    skin: "organized",
    background: "/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
    highlights: [
      {
        id: "luxury-woven",
        title: "Luxury Woven Into",
        titleLine2: "Every Thread",
        indentLine2: true,
        marginLeft: "12%",
        hideIcon: true,
        hideLine: true,
        lightText: true,
        background: "/karmo/images/hometex/hometex-first-sub/comforter 6.png",
      },
      {
        id: "why-choose-us",
        background: "/karmo/images/hometex/hometex-first-sub/hometex why chose us.png",
        imageOnly: true,
        hideOverlay: true,
      },
    ],
    spotlight: {
      align: "left",
      valign: "center",
      offsetY: "8rem",
      image: "/karmo/images/chemicals/comfort 6.png",
      alt: "Teal foam sofa in a bright contemporary living room",
      headingLead: "Designed",
      headingAccent: "to",
      headingEnd: "endure",
    },
    inside: {
      hideText: true,
      lightOverlay: true,
      heading: "Inside every",
      accent: "set",
      body: "Open-cell polyurethane, no fillers, rubber-grade density and fine cell structure — cut to size for furniture makers, then tested one by one.",
      background: "/karmo/images/hometex/hometex-first-sub/dog.png",
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
        lightOverlay: true,
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
    headingLead: "The comfort you feel every day",
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
        titleCard: true,
        /* Sit the copy in the upper third, smaller and lighter than the
           default title card (client ask, Sep 2026). */
        valign: "center",
        headingClassName: "text-white/85",
        headingStyle: {
          fontSize: "clamp(0.92rem, 0.78rem + 1.05vw, 1.7rem)",
          fontWeight: 300,
          fontVariationSettings: '"wght" 300',
          letterSpacing: "0.14em",
        },
        headingLead: "The comfort you feel every day",
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
