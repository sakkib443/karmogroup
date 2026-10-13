/**
 * Furniture & Upholstery foam — `/foam/furniture`.
 * Same section architecture as the mattress division page.
 * Copy and grade colours from the Karmo Foam Catalogue (pages 1, 5–12).
 */

const IMG = "/pages/foam/furniture";
const BADGE = "/shared/hero/badge-number-one.webp";
const COVER = `${IMG}/products`;

/* Live karmogroup.com Foam homepage SKUs — covers + prices from the shop.
   480 and Rebonded are not sold there, so they stay off this list. */
export const liveFurnitureFoamOffers = [
  {
    id: "poly",
    category: "furniture",
    name: "Poly Foam Combo Offer",
    href: "/foam/furniture#foam-offers",
    image: `${COVER}/poly-cover.jpg`,
    alt: "Karmo Poly foam combo offer with five free cushions",
    was: "৳ 5,569",
    now: "৳ 4,734",
    line: "Standard grade · 25 kg/m³ · ash",
    badge: "Standard",
    thickness: "1 set",
    rating: 4.6,
    reviews: 98,
    specs: ["25 kg/m³", "Ash", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "combo-280",
    category: "furniture",
    name: "280 Foam Combo Offer",
    href: "/foam/combo-280",
    image: `${COVER}/280-cover.jpg`,
    alt: "Karmo 280 foam combo offer with five free cushions",
    was: "৳ 6,427",
    now: "৳ 5,463",
    line: "Semi rubber grade · 30 kg/m³ · pink",
    badge: "Best Seller",
    thickness: "1 set",
    rating: 4.8,
    reviews: 164,
    specs: ["30 kg/m³", "Pink", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "combo-2001",
    category: "furniture",
    name: "2001 Foam Combo Offer",
    href: "/foam/combo-2001",
    image: `${COVER}/2001-cover.jpg`,
    alt: "Karmo 2001 foam combo offer with five free cushions",
    was: "৳ 7,982",
    now: "৳ 6,785",
    line: "Full rubber grade · 37 kg/m³ · purple",
    badge: "Value Pick",
    thickness: "1 set",
    rating: 4.7,
    reviews: 128,
    specs: ["37 kg/m³", "Purple", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "hd",
    category: "furniture",
    name: "HD Foam Combo Offer",
    href: "/foam/furniture#foam-offers",
    image: `${COVER}/hd-cover.jpg`,
    alt: "Karmo HD foam combo offer with five free cushions",
    was: "৳ 8,552",
    now: "৳ 7,270",
    line: "Full rubber grade · 40 kg/m³ · lime green",
    badge: "High Density",
    thickness: "1 set",
    rating: 4.8,
    reviews: 110,
    specs: ["40 kg/m³", "Lime green", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "combo-4g",
    category: "furniture",
    name: "4G Foam Combo Offer",
    href: "/foam/combo-4g",
    image: `${COVER}/4g-cover.jpg`,
    alt: "Karmo 4G foam combo offer with five free cushions",
    was: "৳ 9,040",
    now: "৳ 7,684",
    line: "Pure rubber grade · 45 kg/m³ · olive",
    badge: "Pure Rubber",
    thickness: "1 set",
    rating: 4.6,
    reviews: 96,
    specs: ["45 kg/m³", "Olive", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "combo-1965",
    category: "furniture",
    name: "1965 Foam Combo Offer",
    href: "/foam/combo-1965",
    image: `${COVER}/1965-cover.jpg`,
    alt: "Karmo 1965 foam combo offer with five free cushions",
    was: "৳ 10,749",
    now: "৳ 9,137",
    line: "Most premium · 50 kg/m³ · bright yellow",
    badge: "Heritage",
    thickness: "1 set",
    rating: 4.9,
    reviews: 210,
    specs: ["50 kg/m³", "Yellow", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "combo-signature",
    category: "furniture",
    name: "Signature Foam Combo Offer",
    href: "/foam/combo-signature",
    image: `${COVER}/signature-cover.jpg`,
    alt: "Karmo Signature foam combo offer with five free cushions",
    was: "৳ 15,910",
    now: "৳ 13,524",
    line: "House signature · exclusive charcoal grade",
    badge: "Premium",
    thickness: "1 set",
    rating: 4.9,
    reviews: 142,
    specs: ["Premium density", "Charcoal", "5 sit + 5 back"],
    defaultSize: "Queen",
  },
  {
    id: "foam-sit",
    category: "furniture",
    name: "Foam (Sit)",
    href: "/foam/furniture#foam-offers",
    image: `${COVER}/sit-cover.jpg`,
    alt: "Karmo foam sit piece — 22 by 22 by 4 inches",
    was: "৳ 1,200",
    now: "৳ 1,000",
    line: "Seat cushion · 22″ × 22″ × 4″",
    badge: "1 Piece",
    thickness: "4\"",
    rating: 4.7,
    reviews: 86,
    specs: ["22×22×4", "1 pc", "Sofa sit"],
    defaultSize: "Queen",
  },
  {
    id: "foam-back",
    category: "furniture",
    name: "Foam (Back)",
    href: "/foam/furniture#foam-offers",
    image: `${COVER}/back-cover.jpg`,
    alt: "Karmo foam back piece — 22 by 18 by 3 inches",
    was: "৳ 1,200",
    now: "৳ 1,000",
    line: "Back cushion · 22″ × 18″ × 3″",
    badge: "1 Piece",
    thickness: "3\"",
    rating: 4.7,
    reviews: 74,
    specs: ["22×18×3", "1 pc", "Sofa back"],
    defaultSize: "Queen",
  },
];

const foamFurniture = {
  slug: "foam-furniture",

  /* Client's new clip, swapped in for the `about` hero below — that block is
     untouched on purpose. `DivisionPage` skips it while `videoHero` is set, so
     going back to the static banner later is deleting this one field, not
     redoing the page. */
  videoHero: {
    video: "/pages/foam/videos/acoustic-foam-wall-pan.mp4",
    heading: "All your upholstery needs",
    /* 0.25 was slow-motion; 0.85 came back reading as barely slowed at all.
       Settled a bit under normal speed. */
    playbackRate: 0.65,
  },

  banner: {
    hidden: true,
    bg: `${IMG}/hero/hero-foam-user-hq.png`,
    badge: { src: BADGE, width: 420, height: 330 },
    eyebrowEnd: "Foam Brand",
    headline: "All your upholstery needs",
    cta: [
      { label: "Buy online", href: "#foam-offers", primary: true },
      { label: "Find in stores", href: "/contact" },
    ],
    style: "split-sides",
    overlay: "none",
    showControls: false,
    slides: [],
  },

  features: [
    {
      id: "legacy",
      icon: "/shared/trust/cartoon-v3/legacy-60-v2.webp",
      title: "A legacy of 60 years",
      note: "of lasting foam",
    },
    {
      id: "trusted",
      icon: "/shared/trust/cartoon-v3/trusted-v3.webp",
      title: "Trusted By Million",
      note: "homes & makers",
    },
    {
      id: "recognised",
      icon: "/shared/trust/cartoon-v3/superbrand-v3.webp",
      title: "Recognised By",
      note: "Super Brand",
    },
    {
      id: "natural",
      icon: "/shared/trust/cartoon-v3/natural-v2.webp",
      title: "No filler used",
      note: "pure rubber grade",
    },
    {
      id: "delivery",
      icon: "/shared/trust/cartoon-v3/delivery-v2.webp",
      title: "Free Delivery",
      note: "Available",
    },
    {
      id: "stores",
      icon: "/shared/trust/cartoon-v3/stores-v2.webp",
      title: "5k+ Stores",
      note: "Pan Bangladesh",
    },
  ],

  furnitureBrands: {
    sofas: [
      {
        id: "cream",
        src: `${IMG}/rooms/room-cream-sectional-hq.png`,
        alt: "Cream sectional sofa with Karmo set foam in a sunlit living room",
        label: "Sofa foam",
      },
      {
        id: "mustard",
        src: `${IMG}/rooms/room-mustard-set-hq.png`,
        alt: "Mustard wood-frame sofa set with Karmo set foam",
        label: "Set foam",
      },
      {
        id: "emerald",
        src: `${IMG}/rooms/room-emerald-chair-hq.png`,
        alt: "Emerald armchair with Karmo set foam beside a palm",
        label: "Chair foam",
      },
      {
        id: "bed",
        src: `${IMG}/rooms/room-upholstered-bed-hq.png`,
        alt: "Upholstered bed with Karmo set foam headboard in a sunlit bedroom",
        label: "Bed foam",
      },
    ],
  },

  furnitureGrades: {
    lineup: `${IMG}/hero/hero-crafted-hq.png`,
    alt: "Cream armchair with a KARMO foam label under a magnifying glass",
    heading: "All your upholstery needs",
  },

  recommended: {
    heading: "Which Karmo foam is right for you",
    columns: [
      {
        id: "firm",
        image: `${IMG}/why/why-firm-hq.jpg`,
        alt: "Upright seating on a firm sofa — cushions hold their shape",
        caption: "If you need firm support that holds its shape",
      },
      {
        id: "density",
        image: `${IMG}/why/why-density-hq.jpg`,
        alt: "Cream armchair with a KARMO foam label under a magnifying glass",
        caption: "If you want density that lasts for years",
      },
      {
        id: "airflow",
        image: `${IMG}/why/why-airflow-hq.jpg`,
        alt: "Relaxed seating by an open window — cool airflow comfort",
        caption: "If you prefer cool, open airflow comfort",
      },
    ],
  },

  shapeGrid: {
    skin: "organized",
    background: "/pages/foam/mosaic/foam-texture-hq.webp",
    highlights: [
      {
        id: "no-filler",
        icon: "shield",
        badge: "red",
        title: "No Filler",
        overview:
          "100% pure rubber-grade foam — maximum density, clean finish and strength that stands through daily use.",
        background: `${IMG}/products/hd-hover-hq.jpg`,
      },
      {
        id: "long-durability",
        icon: "feather",
        badge: "blue",
        title: "Long Durability",
        overview:
          "Engineered to resist sagging and hold structure — support that stays true for years of seating.",
        background: `${IMG}/why/why-density-hq.jpg`,
      },
      {
        id: "more-resilient",
        icon: "certificate",
        badge: "green",
        title: "More Resilient",
        overview:
          "Superior rebound and firm airflow so cushions recover quickly and stay comfortable.",
        background: `${IMG}/why/why-firm-hq.jpg`,
      },
    ],
    spotlight: {
      image: `${IMG}/mosaic/spotlight-emerald-left-hq.png`,
      alt: "Emerald armchair and oak dresser on the left of a sunlit living room",
      headingLead: "Designed",
      headingAccent: "to",
      headingEnd: "endure",
    },
    inside: {
      heading: "Inside every",
      accent: "set",
      body: "Open-cell polyurethane, no fillers, rubber-grade density and fine cell structure — cut to size for furniture makers, then tested one by one.",
      background: "/pages/foam/mosaic/foam-texture-hq.webp",
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
        src: `${IMG}/inside/cushion-cutaway-hq.jpg`,
        video: "/shared/videos/shorts/v1-tisa.mp4",
        videoStart: 1,
        alt: "Tanzin Tisha for Karmo Foam",
        caption: "Upholstery foam · no filler · rubber grade",
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
          "Standard sets are 22×22×4 (5 pcs) and 22×18×3 (5 pcs). Any required size can be cut to the maker's spec.",
      },
      {
        id: "care",
        question: "How should I care for foam after delivery?",
        answer:
          "Keep foam dry, avoid direct heat and sharp folds, and cover finished pieces. Store cut sheets flat and away from prolonged sun.",
      },
    ],
  },

  zones: false,

  lounge: {
    layout: "overlay",
    headingLead: "The comfort you feel every day",
    image: {
      src: `${IMG}/bands/lounge-mustard-user-hq.png`,
      alt: "Mustard velvet sofa set with teak frames in a sunlit living room",
      width: 1920,
      height: 1080,
      unoptimized: true,
      position: "object-left",
    },
    slides: [
      {
        id: "lounge",
        align: "right",
        titleCard: true,
        headingLead: "The comfort you feel every day",
        image: {
          src: `${IMG}/bands/lounge-mustard-user-hq.png`,
          alt: "Mustard velvet sofa set with teak frames in a sunlit living room",
          width: 1920,
          height: 1080,
          unoptimized: true,
          position: "object-left",
        },
      },
    ],
  },

  about: {
    asHero: true,
    layout: "overlay",
    headingLead: "All your",
    headingAccent: "upholstery needs",
    kicker: "Set foam. No fillers. Built to last.",
    eyebrow: "Karmo Foam",
    bodyLead: "Karmo Foam",
    body:
      " is the major component for upholstery and furniture — light, durable and comfortable, cut as sets for sofas, cushions and maker lines across Bangladesh. Pure rubber grade. No filler used.",
    cta: [
      { label: "Find your perfect foam", href: "#foam-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    image: {
      src: `${IMG}/hero/hero-foam-user-hq.png`,
      alt: "Close-up of black egg-crate Karmo furniture foam",
      width: 2120,
      height: 742,
      unoptimized: true,
    },
    slides: [
      {
        id: "upholstery",
        align: "middle",
        titleCard: true,
        titleOverlay:
          "linear-gradient(to top, rgba(11,21,40,0.70) 0%, rgba(11,21,40,0.52) 45%, rgba(11,21,40,0.46) 100%)",
        headingLead: "All your upholstery needs",
        image: {
          src: `${IMG}/hero/hero-foam-user-hq.png`,
          alt: "Close-up of black egg-crate Karmo furniture foam",
          width: 2120,
          height: 742,
          unoptimized: true,
        },
      },
    ],
  },

  promise: { hidden: true },
  spotlight: false,

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    body: "",
    textured: true,
    textureSrc: "/pages/foam/mosaic/foam-texture-hq.webp",
    variant: "foam",
    offersId: "foam-offers",
    items: liveFurnitureFoamOffers,
  },
};

export default foamFurniture;
