/**
 * Foam division — mattress-parity catalogue (`/foam`).
 * Same section architecture as the client-approved Mattress page:
 * about-as-hero → features → recommended → shapeGrid → lounge → zones → catalogue → order.
 * Artwork lives under `public/karmo/images/foam-2/`.
 */

const IMG = "/karmo/images/foam-2";
const BADGE = "/karmo/images/home-02/hero/badge-number-one.webp";
const CERT_ISO = "/karmo/images/home-02/certified/01-iso-9001.jpg";
const CERT_UKAS = "/karmo/images/home-02/certified/02-ukas.jpg";

const foam = {
  slug: "foam",

  bedAutomotiveHero: true,

  banner: {
    hidden: true,
    bg: `${IMG}/bands/lounge-sofa-hq.jpg`,
    badge: { src: BADGE, width: 420, height: 330 },
    eyebrowEnd: "Foam Brand",
    headline: "The Chemistry of Comfort",
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
      icon: "/karmo/images/trust/cartoon-v3/legacy-60-v2.webp",
      title: "A legacy of 60 years",
      note: "of lasting foam",
    },
    {
      id: "trusted",
      icon: "/karmo/images/trust/cartoon-v3/trusted-v3.webp",
      title: "Trusted By Million",
      note: "homes & makers",
    },
    {
      id: "recognised",
      icon: "/karmo/images/trust/cartoon-v3/superbrand-v3.webp",
      title: "Recognised By",
      note: "Super Brand",
    },
    {
      id: "natural",
      icon: "/karmo/images/trust/cartoon-v3/natural-v2.webp",
      title: "Pure Rubber Grade",
      note: "no fillers",
    },
    {
      id: "delivery",
      icon: "/karmo/images/trust/cartoon-v3/delivery-v2.webp",
      title: "Free Delivery",
      note: "Available",
    },
    {
      id: "stores",
      icon: "/karmo/images/trust/cartoon-v3/stores-v2.webp",
      title: "5k+ Stores",
      note: "Pan Bangladesh",
    },
  ],

  recommended: {
    heading: "Which Karmo foam is right for you",
    columns: [
      {
        id: "firm",
        image: "/karmo/images/foam/furniture/why/why-1.png",
        alt: "Upright seating on a firm high-density foam sofa",
        caption: "IF YOU NEED HIGH-IMPACT SUPPORT & ENERGY RETURN",
      },
      {
        id: "density",
        image: "/karmo/images/foam/furniture/why/why-4.png",
        alt: "Hand pressing into dense Karmo foam showing rebound",
        caption: "IF YOU WANT DENSITY THAT LASTS FOR YEARS",
      },
      {
        id: "airflow",
        image: "/karmo/images/foam/furniture/why/why-6.png",
        alt: "Bright living room with breathable foam seating",
        caption: "IF YOU PREFER COOL, OPEN AIRFLOW COMFORT",
      },
    ],
  },

  shapeGrid: {
    background: "/karmo/images/foam/furniture/mosaic/foam-texture-hq.webp",
    highlights: [
      {
        id: "no-filler",
        icon: "shield",
        badge: "red",
        title: "No Filler",
        overview:
          "100% pure rubber-grade foam — maximum density, clean finish and strength that stands through daily use.",
        background: "/karmo/images/foam/furniture/bands/no-filler-footwear.png",
      },
      {
        id: "long-durability",
        icon: "feather",
        badge: "blue",
        title: "Long Durability",
        overview:
          "Engineered to resist sagging and hold structure — support that stays true for years of seating.",
      },
      {
        id: "more-resilient",
        icon: "certificate",
        badge: "green",
        title: "More Resilient",
        overview:
          "Superior rebound and firm airflow so cushions recover quickly and stay comfortable.",
      },
    ],
    spotlight: {
      image: "/karmo/images/foam/furniture/mosaic/footwear-spotlight2.png",
      alt: "A calm living room with deep foam sofa seating",
      headingLead: "DESIGNED TO ENDURE",
      headingAccent: "",
      headingEnd: "",
      subline: "",
      brand: "",
    },
certifications: [
  {
    id: "flex-test",
    image: "/karmo/images/foam/furniture/badges/flex-test-badge.png", // ফ্রেম ছাড়া ক্লিন ট্রান্সপারেন্ট ব্যাজ
    title: "100,000+ FLEX CYCLES",
    body: "Zero sole breakdown after 100k automated lab flex tests — built for extreme athletic endurance.",
  },
  {
    id: "shock-absorb",
    image: "/karmo/images/foam/furniture/badges/shock-absorb-badge.png",
    title: "DYNAMIC SHOCK ABSORPTION",
    body: "Dissipates up to 45% of heel-strike ground impact, reducing knee fatigue and joint pressure.",
  },
],
    faqs: [
      {
        id: "grade",
        question: "What does rubber-grade foam mean at Karmo?",
        answer:
          "It means high-density polyurethane built without cheap fillers — firmer air flow, cleaner recovery and density that holds for furniture, footwear and specialty padding.",
      },
      {
        id: "density",
        question: "How do I choose density for sofas and cushions?",
        answer:
          "Seat bases favour higher density for support; backs and throws can run softer. Visit a store to compare 280, Signature and 1965 side by side.",
      },
      {
        id: "rebonded",
        question: "When should I use rebonded foam?",
        answer:
          "Rebonded is steam-bonded foam chips — excellent for firm bases, mattress cores and heavy-use seating where lasting support matters most.",
      },
      {
        id: "care",
        question: "How should I care for foam after delivery?",
        answer:
          "Keep foam dry, avoid direct heat and sharp folds, and cover finished pieces. For cut sheets, store flat and away from prolonged sun.",
      },
    ],
    film: null,
    still:  "/karmo/images/foam/furniture/mosaic/footwear-sole-v4.png",
    filmAlt: "Karmo Footwear Foam Quality",
  },

  zones: {
    src: "/karmo/images/foam/furniture/bands/footwear-layers-cutaway.png",
    alt: "Layered foam cutaway showing soft top, dense core and base foam",
    width: 1536,
    height: 864,
    heading: "Built density by density",
    subheading:
      "Soft wadding, hi-density rebonded cores and polyethylene bases — pressed and tested for furniture that lasts.",
    icons: [
    { id: "foam", label: "Soft Insole" }, 
    { id: "pillow", label: "Rebound Core" },  
    { id: "springs", label: "Tough Base" },
    ],
    cta: { label: "Find your foam", href: "#foam-offers" },
  },

  lounge: {
    layout: "overlay",
    headingLead: "THE COMFORT YOU FEEL EVERY DAY",
    headingAccent: "",
    kicker: "Sink into Karmo Foam seating",
    titleCard: true,
    cta: null,
    image: {
      src: "/karmo/images/foam/furniture/bands/footwear-comfort-lounge2.png",
      alt: "Comfortable footwear foam for everyday walking",
      position: "object-[center_40%]",
      width: 1920,
      height: 1080,
    },
    slides: [
      {
        id: "lounge",
        align: "left",
        headingLead: "THE COMFORT YOU FEEL EVERY DAY",
        headingAccent: "",
        kicker: "",
        // cta: ,
        image: {
      src: "/karmo/images/foam/furniture/bands/footwear-comfort-lounge2.png",
      alt: "Comfortable footwear foam for everyday walking",
      position: "object-[center_40%]",
          width: 1920,
          height: 1080,
        },
      },
    ],
  },

  about: {
    asHero: true,
    layout: "overlay",
    headingLead: "We create the chemistry",
    headingAccent: "of comfort",
    kicker: "Pure rubber grade. No fillers. Built to last.",
    eyebrow: "About Karmo Foam",
    bodyLead: "Karmo Foam",
    body:
      " delivers high-density resilience for furniture, footwear and specialty padding — pure rubber grade with firm airflow that holds for years. Made in Bangladesh since 1965.",
    cta: [
      { label: "Find your perfect foam", href: "#foam-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    image: {
      src: `${IMG}/hero/hero-slide-01-no-foam-v10-hq.jpg`,
      alt: "Mustard sofa in a modern living room",
      width: 1536,
      height: 1024,
    },
    slides: [
{
  id: "journey",
  titleCard: true, // <--- এই একটি লাইন আপনার সব সমস্যা সমাধান করে দেবে!
  align: "right",
  headingLead: "ALL YOUR FOOTWEAR NEEDS",
  veil: true,
  image: {
    src: "/karmo/images/foam/hero/footwear-hero1.jpeg",
    alt: "Footwear foam",
    width: 1536,
    height: 1024,
    position: "object-left",
    className: "scale-[1.12] -translate-x-[10%] origin-left", // জুতোটি সুন্দরভাবে বামে সরে যাবে
  },
},
      // {
      //   id: "craft",
      //   align: "right",
      //   eyebrowStart: "Bangladesh’s",
      //   eyebrowEnd: "Foam Brand",
      //   badge: { src: BADGE, width: 420, height: 330 },
      //   headingLead: "Density crafted",
      //   headingAccent: "to endure",
      //   kicker: "Every grade cut, tested and ready for makers",
      //   cta: [{ label: "Find your perfect foam", href: "#foam-offers", primary: true }],
      //   image: {
      //     src: `${IMG}/hero/craft-karmo-grades-v9-hq.jpg`,
      //     alt: "Karmo 280, Signature and 1965 foam on the left of a living room; clear navy wall on the right for headline copy",
      //     width: 2560,
      //     height: 1096,
      //     /* Tall/full viewport + panoramic art makes the stacks read small on
      //        deploy; zoom into the left floor so they match the intended hero. */
      //     position: "object-[30%_78%]",
      //     className: "origin-[30%_78%] scale-[1.36]",
      //   },
      // },
      // {
      //   id: "grades",
      //   align: "left",
      //   eyebrowStart: "Bangladesh’s",
      //   eyebrowEnd: "Foam Brand",
      //   badge: { src: BADGE, width: 420, height: 330 },
      //   headingLead: "Four grades.",
      //   headingAccent: "one craft",
      //   kicker: "Rubber grade. Higher durability. Fine cell structure",
      //   cta: [{ label: "Find your perfect foam", href: "#foam-offers", primary: true }],
      //   image: {
      //     src: "/karmo/images/home-02/hero/home-hero-slide-foam-grades-v2-hq.jpg",
      //     alt: "Four Karmo foam grades in front of a white sofa living room",
      //     width: 2560,
      //     height: 1096,
      //     position: "object-center",
      //   },
      // },
    ],
  },

  categories: {
    items: [
      {
        id: "furniture",
        name: "Furniture",
        line: "Sofas, cushions, seating",
        image: `${IMG}/products/sofa-olive-hq.jpg`,
        alt: "Olive sofa built on Karmo foam",
      },
      {
        id: "specialty",
        name: "Specialty",
        line: "Grades for makers",
        image: `${IMG}/products/blocks-coral-hq.jpg`,
        alt: "Colored foam blocks for specialty use",
      },
    ],
  },

  promise: {
    hidden: true,
    heading: "Blending tradition with innovation",
    subline: "Lasting Comfort to your Doorstep",
    still: `${IMG}/bands/lounge-sofa-hq.jpg`,
    film: null,
    showFilm: false,
    claims: [
      {
        id: "no-filler",
        icon: "droplet",
        badge: "bg-[#E03131]",
        title: "No Filler",
        body: "Zero fillers — maximum density and lasting strength.",
      },
      {
        id: "long-durability",
        icon: "shield",
        badge: "bg-[#1C7ED6]",
        title: "Long Durability",
        body: "Holds shape under daily use without sagging.",
        solid: true,
      },
      {
        id: "more-resilient",
        icon: "arrow-down",
        badge: "bg-[#2F9E44]",
        title: "More Resilient",
        body: "Rebound and airflow for consistent body support.",
      },
    ],
  },

  spotlight: false,

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    body: "Combo sets and seating grades — pure rubber foam sized for Bangladesh homes and makers. Prices are placeholders; confirm before launch.",
    textured: true,
    variant: "catalogue",
    offersId: "foam-offers",
    items: [
      {
        id: "combo-280",
        category: "furniture",
        name: "280 Foam Combo",
        shortName: "280",
        href: "/foam/combo-280",
        image: `${IMG}/products/combo-280-room-hq.jpg`,
        imageHover: `${IMG}/products/combo-280-hover-hq.jpg`,
        alt: "Karmo 280 foam combo beside a sand sofa",
        was: "৳ 9,890",
        now: "৳ 8,405",
        line: "High-density rubber-grade foam for firm, lasting support",
        badge: "Best Seller",
        thickness: "Custom cut",
        rating: 4.8,
        reviews: 164,
        specs: ["Rubber grade", "Firm support", "No fillers"],
        defaultSize: "Queen",
      },
      {
        id: "combo-2001",
        category: "furniture",
        name: "2001 Foam Combo",
        shortName: "2001",
        href: "/foam/combo-2001",
        image: `${IMG}/products/combo-2001-room-hq.jpg`,
        imageHover: `${IMG}/products/foam-grades-hover-hq.jpg`,
        alt: "Living room seating on Karmo 2001 foam",
        was: "৳ 9,405",
        now: "৳ 7,995",
        line: "Balanced density for everyday sofas and cushions",
        badge: "Value Pick",
        thickness: "Custom cut",
        rating: 4.7,
        reviews: 128,
        specs: ["Balanced feel", "Furniture ready", "Open airflow"],
        defaultSize: "Queen",
      },
      {
        id: "combo-4g",
        category: "specialty",
        name: "4G Foam Combo",
        shortName: "4G",
        href: "/foam/combo-4g",
        image: `${IMG}/products/combo-4g-room-hq.jpg`,
        imageHover: `${IMG}/products/foam-grades-hover-hq.jpg`,
        alt: "Karmo 4G foam cushions and blocks",
        was: "৳ 9,405",
        now: "৳ 7,995",
        line: "Responsive rebound for modern seating builds",
        badge: "New Launch",
        thickness: "Custom cut",
        rating: 4.6,
        reviews: 96,
        specs: ["Fast rebound", "Maker grade", "Clean cut"],
        defaultSize: "Queen",
      },
      {
        id: "combo-1965",
        category: "specialty",
        name: "1965 Foam Combo",
        shortName: "1965",
        href: "/foam/combo-1965",
        image: `${IMG}/products/combo-1965-room-hq.jpg`,
        imageHover: `${IMG}/products/foam-grades-hover-hq.jpg`,
        alt: "Cream armchair on Karmo 1965 foam",
        was: "৳ 15,203",
        now: "৳ 12,922",
        line: "The house classic — pure rubber comfort since 1965",
        badge: "Heritage",
        thickness: "Custom cut",
        rating: 4.9,
        reviews: 210,
        specs: ["Heritage grade", "Pure rubber", "Long life"],
        defaultSize: "Queen",
      },
      {
        id: "combo-signature",
        category: "specialty",
        name: "Signature Foam Combo",
        shortName: "Signature",
        href: "/foam/combo-signature",
        image: `${IMG}/products/combo-signature-room-hq.jpg`,
        imageHover: `${IMG}/products/foam-grades-hover-hq.jpg`,
        alt: "Deep blue velvet sofa on Karmo Signature foam",
        was: "৳ 18,732",
        now: "৳ 15,922",
        line: "Premium grade where signature comfort lives",
        badge: "Premium",
        thickness: "Custom cut",
        rating: 4.9,
        reviews: 142,
        specs: ["Premium density", "Showroom feel", "No fillers"],
        defaultSize: "Queen",
      },
      {
        id: "rebonded-set",
        category: "furniture",
        name: "Rebonded Foam Pack",
        shortName: "Rebonded",
        href: "/foam/rebonded-set",
        image: `${IMG}/products/rebonded-set-room-hq.jpg`,
        imageHover: `${IMG}/products/foam-grades-hover-hq.jpg`,
        alt: "Stacked rebonded and specialty foam blocks",
        was: "৳ 11,500",
        now: "৳ 9,775",
        line: "Steam-bonded chips for firm bases that last",
        badge: "Maker Fav.",
        thickness: "Custom cut",
        rating: 4.7,
        reviews: 118,
        specs: ["Rebonded core", "Heavy use", "Firm base"],
        defaultSize: "Queen",
      },
    ],
  },
};

export default foam;
