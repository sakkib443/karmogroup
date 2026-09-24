/**
 * Chemicals (Adhesives) division — same template as the mattress (ideal) page.
 *
 * SCAFFOLD: images use the existing chemicals artwork; product names and prices
 * are placeholders. Swap in the real catalogue when ready:
 *   · banner.slides — cutout product PNGs (tins/bottles on transparent bg)
 *   · products[] — real SKUs, prices and images (see Karmo Adhesive Catalog.pdf)
 *   · features[].icon — proper chemicals trust badges
 *
 * `promise.claims[].icon` is a STRING key (resolved to a real icon inside the
 * client component) — data must stay serialisable to cross the server boundary.
 */

const chemicals = {
  slug: "chemicals",

  banner: {
    bg: "/karmo/images/chemicals/camicels.png",
    style: "simple",
    headline: "The world of polyurethane",
    slides: [],
  },

  features: [
    {
      id: "years",
      icon: "/karmo/images/trust/legacy-60-years.png",
      title: "Since 1965",
      note: "Six decades of chemistry",
    },
    {
      id: "strength",
      icon: "/karmo/images/trust/recognised-super-brand.png",
      title: "Industrial Strength",
      note: "Bonds that hold under load",
    },
    {
      id: "cure",
      icon: "/karmo/images/trust/sustainable-products.png",
      title: "Fast Curing",
      note: "Less downtime, clean finish",
    },
    {
      id: "certified",
      icon: "/karmo/images/trust/trusted-families.png",
      title: "Quality Certified",
      note: "Consistent, tested batches",
    },
  ],

  about: {
    beforeShapeGrid: true,
    layout: "collage-full",
    headingLead: "Strength you can",
    headingAccent: "build on",
    kicker: "We test every batch, every single drum",
    eyebrow: "About Karmo Chemicals",
    bodyLead: "Karmo Chemicals",
    body:
      " delivers industrial-strength adhesives, resins and specialty formulations engineered for a fast cure and a bond that lasts. Trusted across furniture, footwear and manufacturing, every batch is mixed to a consistent grade and quality-tested — the same chemistry that has held Karmo products together since 1965.",
    cta: [
      { label: "Explore the range", href: "#chemicals-offers", primary: true },
      { label: "Contact us", href: "/contact" },
    ],
    images: [
      "/karmo/images/chemicals/chemicals-karmo-adhesive-tins.webp",
      "/karmo/images/chemicals/camicels 3.png",
      "/karmo/images/chemicals/atha 3.png",
      "/karmo/images/chemicals/atha 2.png",
    ],
  },

  categories: {
    items: [
      {
        id: "adhesives",
        name: "Adhesives",
        line: "Wood, foam & fabric bonding",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
        alt: "Karmo adhesive tins",
      },
      {
        id: "resins",
        name: "Resins",
        line: "Clear, fast-curing",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-resin-bottles.png",
        alt: "Karmo resin bottles",
      },
      {
        id: "sealants",
        name: "Sealants",
        line: "Seal, fill & protect",
        image: "/karmo/images/home-02/divisions/chemicals-resin-tins.webp",
        alt: "Karmo sealant tins",
      },
      {
        id: "industrial",
        name: "Industrial",
        line: "Bulk & specialty grades",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-product.png",
        alt: "Karmo industrial chemical product",
      },
    ],
  },

  mattressFilm: {
    src: "/karmo/videos/product-film.mp4",
    still: "/karmo/images/divisions/chemicals-bench.jpg",
    alt: "Karmo Chemicals Film",
    /* Shorter than the mattress full-screen band so the whole section sits
       inside a normal large-device viewport. */
    minH: "min(60svh, 560px)",
    heading: "Strong Bonds, Trusted Chemistry",
    headingClassName: "mt-5 text-[clamp(1.2rem,2.5vw,2.2rem)] font-light! uppercase whitespace-nowrap leading-[1.05]! tracking-[0.1em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]",
    headingStyle: {},
    containerClassName: "shell pointer-events-none absolute inset-0 z-[2] flex h-full flex-col justify-center text-center",
  },

  _shapeGrid: {
    className: "px-4 md:px-2 lg:px-4 2xl:px-6",
    background: "/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
    highlights: [
      {
        id: "no-filler",
        background: "/karmo/images/chemicals/atha.png",
        overlay: "bg-[#0b1a33]/20",
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
      image: "/karmo/images/chemicals/dds.png",
      alt: "Karmo Chemicals adhesive products",
      overlay: "bg-[#0b1a33]/20",
    },
    topImage: "/karmo/images/chemicals/hdfdk.png",
    topImageOverlay: "bg-[#0b1a33]/20",
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
    still: "/karmo/images/chemicals/atha 5.png",
    filmAlt: "Karmo Chemicals",
    filmOverlay: "bg-[#0b1a33]/20",
  },

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    offersId: "chemicals-offers",
    /* TODO: placeholder SKUs and prices — replace with the Karmo Adhesive Catalog. */
    items: [
      {
        id: "wood-adhesive",
        category: "adhesives",
        name: "Wood Adhesive",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
        alt: "Karmo wood adhesive tin",
        was: "৳ 850",
        now: "৳ 720",
      },
      {
        id: "foam-adhesive",
        category: "adhesives",
        name: "Foam Bonding Adhesive",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-product.png",
        alt: "Karmo foam bonding adhesive",
        was: "৳ 1,100",
        now: "৳ 935",
      },
      {
        id: "clear-resin",
        category: "resins",
        name: "Clear Casting Resin",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-resin-bottles.png",
        alt: "Karmo clear casting resin",
        was: "৳ 1,900",
        now: "৳ 1,615",
      },
      {
        id: "epoxy-resin",
        category: "resins",
        name: "Epoxy Resin Kit",
        image: "/karmo/images/home-02/divisions/chemicals-resin-tins.webp",
        alt: "Karmo epoxy resin kit",
        was: null,
        now: "৳ 2,400",
      },
      {
        id: "multi-sealant",
        category: "sealants",
        name: "Multi-Surface Sealant",
        image: "/karmo/images/home-02/divisions/chemicals-resin-tins.webp",
        alt: "Karmo multi-surface sealant",
        was: "৳ 700",
        now: "৳ 595",
      },
      {
        id: "contact-cement",
        category: "adhesives",
        name: "Contact Cement",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
        alt: "Karmo contact cement tin",
        was: "৳ 950",
        now: "৳ 808",
      },
      {
        id: "industrial-drum",
        category: "industrial",
        name: "Industrial Adhesive (Bulk)",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-product.png",
        alt: "Karmo industrial bulk adhesive",
        was: null,
        now: "৳ 12,500",
      },
      {
        id: "primer",
        category: "industrial",
        name: "Surface Primer",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-resin-bottles.png",
        alt: "Karmo surface primer",
        was: "৳ 1,300",
        now: "৳ 1,105",
      },
    ],
  },
};

export default chemicals;
