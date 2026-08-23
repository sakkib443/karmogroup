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
    bg: "/karmo/images/divisions/chemicals-bench.jpg",
    badge: {
      src: "/karmo/images/home-02/hero/badge-number-one.webp",
      width: 420,
      height: 330,
    },
    eyebrowEnd: "Adhesive Brand",
    headline: "Bonded to Last",
    cta: [
      { label: "Buy online", href: "#chemicals-offers", primary: true },
      { label: "Find in stores", href: "/contact" },
    ],
    slides: [
      {
        id: "adhesive-tins",
        name: "Adhesives",
        sub: "Industrial-strength bonding for wood, foam and fabric.",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
        alt: "Karmo adhesive tins",
      },
      {
        id: "resin-bottles",
        name: "Resins",
        sub: "Clear, fast-curing resins for a lasting finish.",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-resin-bottles.png",
        alt: "Karmo resin bottles",
      },
      {
        id: "product",
        name: "Specialty Chemicals",
        sub: "Formulated for strength, safety and consistency.",
        image: "/karmo/images/home-02/divisions/chemicals-karmo-product.png",
        alt: "Karmo specialty chemical product",
      },
    ],
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
    image: {
      src: "/karmo/images/home-02/divisions/chemicals-resin-tins.webp",
      alt: "Karmo resin and adhesive tins on a workbench",
    },
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

  promise: {
    heading: "Strong Bonds, Trusted Chemistry",
    subline: "Everyone Claims Strength, But Not Everyone Can Prove Consistency",
    claims: [
      {
        id: "strong-bond",
        icon: "shield",
        badge: "bg-[#E03131]",
        title: "Strong Bond",
        body: "Industrial-strength adhesives engineered to hold under load and stress — bonds that stay put across wood, foam, fabric and more, job after job.",
      },
      {
        id: "fast-cure",
        icon: "droplet",
        badge: "bg-[#1C7ED6]",
        title: "Fast Curing",
        body: "Formulated to set quickly and finish clean, cutting downtime on the line without sacrificing the final strength of the bond.",
        solid: true,
      },
      {
        id: "certified",
        icon: "certificate",
        badge: "bg-[#2F9E44]",
        title: "Quality Certified",
        body: "Every batch is mixed to a consistent grade and quality-tested, so the chemistry you trust today performs exactly the same tomorrow.",
      },
    ],
    still: "/karmo/images/divisions/chemicals-bench.jpg",
    showFilm: false,
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
