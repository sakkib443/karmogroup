/**
 * Mattress (Matrexx) division — the client's IDEAL page, now expressed as data.
 * Design lives in `components/karmo/division/`; this file is only content.
 *
 * Content gathered from the Mattress Brochure (`karmo-library/02-catalogues/mattress-brochure/`, 28 pages)
 * and the client's own product artwork (`matrexx products/`).
 *
 * `promise.claims[].icon` is a STRING key (resolved to a real icon inside the
 * client component) — data must stay serialisable to cross the server boundary.
 */

const mattress = {
  slug: "mattress",

  banner: {
    /* Split-sides product hero kept in data; the overlay about band sits
       in its place as the page hero. Flip this to restore the old banner. */
    hidden: true,
    bg: "/karmo/images/mattress/bands/sleep-well-film-still-hq.webp",
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
    /* Centre copy; one product per slide, alternating in from right / left. */
    style: "split-sides",
    overlay: "none",
    showControls: false,
    slides: [
      {
        id: "eurotop",
        name: "Euro Top Pocket Spring",
        sub: "Pocketed coils under a plush memory-foam pillow top.",
        image: "/karmo/images/mattress/hero/product-eurotop-pocket-spring.webp",
        alt: "Karmo Euro Top Pocket Spring mattress",
      },
      {
        id: "bonnell",
        name: "Bonnell Spring",
        sub: "Breathable open-coil support, crafted to perfection.",
        image: "/karmo/images/mattress/hero/product-bonnell-spring.webp",
        alt: "Karmo Bonnell Spring mattress",
      },
      {
        id: "pillowtop",
        name: "Pillow Top Pocket Spring",
        sub: "Bedding excellence since 1965 — luxury you can feel.",
        image: "/karmo/images/mattress/hero/product-pillowtop-pocket-spring.webp",
        alt: "Karmo Pillow Top Pocket Spring mattress",
      },
    ],
  },

  /* Homepage StandardStrip — same six cartoon icons, same 5K+ badge. */
  useHomeTrustStrip: true,

  /* Same six pillars + cartoon-v3 icons as the homepage trust strip. */
  features: [
    {
      id: "legacy",
      icon: "/karmo/images/trust/cartoon-v3/legacy-60-v2.webp",
      title: "A legacy of 60 years",
      note: "of healthy sleep",
    },
    {
      id: "trusted",
      icon: "/karmo/images/trust/cartoon-v3/trusted-v3.webp",
      title: "Trusted By Million",
      note: "families worldwide.",
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
      title: "Natural and",
      note: "Sustainable Products",
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

  /* Brand marks centred on the left. Bedroom photo is the full-bleed background. */
  brochureBrands: {
    heading: "Our mattress brands",
    kicker: "We test every mattress. Every single one.",
    image: "/karmo/images/mattress/brochure/page-03-brands.webp",
    imageAlt:
      "Our mattress brands — Imperial, King, Prestige, Orthopaedic, Bonnell Spring, Natural and Pocket Spring",
    background: "/karmo/images/mattress/bands/lounge-woman-resting-hq.webp",
    items: [
      {
        id: "imperial",
        href: "/mattress/imperial-eurotop",
        src: "/karmo/images/mattress/brochure/logos/logo-imperial-trim.webp",
        alt: "Karmo Imperial Mattress",
      },
      {
        id: "king",
        href: "/mattress/king",
        src: "/karmo/images/mattress/brochure/logos/logo-king-trim.webp",
        alt: "Karmo King Mattress",
      },
      {
        id: "prestige",
        href: "/mattress/prestige",
        src: "/karmo/images/mattress/brochure/logos/logo-prestige-trim.webp",
        alt: "Karmo Prestige Mattress",
      },
      {
        id: "orthopedic",
        href: "/mattress/orthopedic",
        src: "/karmo/images/mattress/brochure/logos/logo-orthopedic-trim.webp",
        alt: "Karmo Orthopaedic Mattress",
      },
      {
        id: "bonnell",
        href: "/mattress/bonnell-spring",
        src: "/karmo/images/mattress/brochure/logos/logo-bonnell-trim.webp",
        alt: "Karmo Bonnell Spring Mattress",
      },
      {
        id: "natural",
        href: "/mattress",
        src: "/karmo/images/mattress/brochure/logos/logo-natural-trim.webp",
        alt: "Karmo Natural Mattress",
      },
      {
        id: "pocket",
        href: "/mattress/pillow-top-pocket-spring",
        src: "/karmo/images/mattress/brochure/logos/logo-pocket-trim.webp",
        alt: "Karmo Pocket Spring Mattress",
        wide: true,
      },
    ],
  },

  /* Why-buy band — half-screen tall; photos only in assets, copy in HTML. */
  recommended: {
    heading: "Which Karmo is right for you",
    columns: [
      {
        id: "pain",
        image: "/karmo/images/mattress/why/why-back-pain-hq.jpg",
        alt: "Half-body rear view on a Karmo mattress with a soft wellness glow along the spine",
        caption: "If you have chronic neck & back pain",
      },
      {
        id: "posture",
        image: "/karmo/images/mattress/why/why-posture-v5-hq.webp",
        alt: "Side-profile aligned sleep on a Karmo mattress with posture-support light",
        caption: "If you need firm support to correct your posture",
      },
      {
        id: "cool",
        image: "/karmo/images/mattress/why/why-sweaty-v5-hq.webp",
        alt: "Cool comfortable sleep on a Karmo mattress",
        caption: "If you are a sweaty sleeper",
      },
    ],
  },

  /* Feature mosaic — hidden on this mattress page.
     Parked for the mattress details page / single mattress page.
     Set hidden back to false there (or move this block onto that page)
     to show Long Lasting, Anti Allergic, Quality Certified, Designed to
     de-stress, Pocket Springs, Doctor Recommended and the cutaway photo.
     skin: "organized" is the current layout (site type + 2-col layers).
     Set skin back to "mosaic" to restore the previous full-width tile grid. */
  shapeGrid: {
    hidden: true,
    skin: "organized",
    background: "/karmo/images/mattress/mosaic/karmo-pattern-texture.jpg",
    highlights: [
      {
        id: "long-lasting",
        icon: "shield",
        badge: "red",
        title: "Long Lasting",
        overview:
          "Premium materials and non-sag fill — shape and comfort that hold for years of restful sleep.",
        background:
          "/karmo/images/mattress/brochure/inside/exploded-layers.webp",
      },
      {
        id: "anti-allergic",
        icon: "feather",
        badge: "blue",
        title: "Anti Allergic",
        overview:
          "Anti-allergic fill and breathable cotton for a cleaner, healthier night’s sleep.",
      },
      {
        id: "quality-certified",
        icon: "certificate",
        badge: "green",
        title: "Quality Certified",
        overview:
          "ISO 9001 quality management with UKAS accreditation — every mattress tested, one by one.",
      },
    ],
    spotlight: {
      image: "/karmo/images/mattress/mosaic/designed-to-destress.jpg",
      alt: "Peaceful sleep on a Karmo mattress",
      headingLead: "Designed",
      headingAccent: "to",
      headingEnd: "de-stress",
      subline: "Pocket springs and anti-allergic fill for deep, lasting rest.",
      brand: "Karmo Mattress",
    },
    inside: {
      heading: "Inside every",
      accent: "Karmo",
      body: "Built layer by layer, then tested one by one.",
      background:
        "/karmo/images/mattress/brochure/craft/unparalleled-texture.webp",
      layers: [
        { id: "jacquard", name: "Jacquard panel", line: "Quilted on USA machinery so air can pass between body and mattress." },
        { id: "microfibre", name: "8 oz microfibre padding", line: "Hollow conjugated fibre — no direct foam against the skin." },
        { id: "felt", name: "Turkey-imported felt", line: "Heat-pressed at 180–200°C so the mattress keeps its thickness." },
        { id: "rebonded", name: "Rebonded foam", line: "Hi-density chips, steam-bonded for lasting support." },
        { id: "pe", name: "Polyethylene foam", line: "Load-bearing PE foam — made only by Karmo." },
        { id: "springs", name: "Pocket springs", line: "Each coil in its own fabric pocket. No motion transfer." },
      ],
      pair: [
        {
          id: "pocket-springs",
          icon: "coils",
          image: "/karmo/images/mattress/mosaic/icons/icon-pocket-springs.webp",
          badge: "blue",
          title: "Pocket Springs",
          overview:
            "Each coil sits in its own fabric pocket — body-mapped support, no motion transfer.",
        },
        {
          id: "doctor-recommended",
          icon: "pulse",
          image: "/karmo/images/mattress/mosaic/icons/icon-doctor-recommended.webp",
          badge: "green",
          title: "Doctor Recommended",
          overview:
            "Orthopedic build specified with physicians for spine alignment, night after night.",
        },
      ],
      photo: {
        src: "/karmo/images/mattress/brochure/inside/pocket-cutaway.jpg",
        alt: "Karmo pocket-spring mattress with the pillow top peeled back to show foam wadding and coils",
        caption: "Foam wadding · pillow top · pocket springs",
      },
    },
    faqs: [
      {
        id: "pocket-spring",
        question: "What does pocket spring mean in a Karmo mattress?",
        answer:
          "Each coil sits in its own fabric pocket, so movement is isolated and support stays body-mapped — quieter sleep for couples, firmer lift where you need it.",
      },
      {
        id: "thickness",
        question: "Is an 8-inch Karmo mattress thick enough for adults?",
        answer:
          "Yes. Our adult ranges combine layered foam, felt and spring systems sized for everyday body weight — thickness works with the build, not alone.",
      },
      {
        id: "firmness",
        question: "Which Karmo mattress firmness is best for back support?",
        answer:
          "Orthopedic and pocket-spring models favour medium-firm support for spine alignment. Visit a store to feel Prestige, Imperial and Orthopedic side by side.",
      },
      {
        id: "care",
        question: "How should I care for my Karmo mattress after delivery?",
        answer:
          "Keep it protected with a cover, avoid folding or ironing on the surface, and rotate periodically. Deep-clean gently — never soak the core.",
      },
    ],
  },

  /* Sleep Well film — own full-viewport stage, under Inside every Karmo. */
  mattressFilm: {
    src: "/karmo/videos/mattress-sleep-well.mp4",
    still: "/karmo/images/mattress/bands/sleep-well-film-still-hq.webp",
    alt: "Karmo mattress Sleep Well film",
    /* Official mattress tagline #24 — title card on the Sleep Well film. */
    heading: "The Art of Restful Living",
  },

  /* Full-width pocket-spring cutaway: solid left rail + image (brochure facts). */
  zones: {
    src: "/karmo/images/mattress/bands/layers-cutaway-pocket-spring-hq.jpg",
    alt: "Karmo pillow-top pocket-spring mattress cutaway showing real layered construction",
    width: 1536,
    height: 1024,
    heading: "Built layer by layer",
    subheading: "Hi-density rebonded, Turkey-imported conjugate felt and pocket springs — pressed, stacked and tested as one.",
    icons: [
      { id: "foam", label: "Foam wadding", src: "/karmo/images/trust/cartoon-v3/zone-foam-wadding.png" },
      { id: "pillow", label: "Pillow top", src: "/karmo/images/trust/cartoon-v3/zone-pillow-top.png" },
      { id: "springs", label: "Pocket springs", src: "/karmo/images/trust/cartoon-v3/zone-pocket-springs.png" },
    ],
    cta: { label: "Find your mattress", href: "#mattress-offers" },
  },

  about: {
    /* Full-bleed photo band used as the mattress hero. First slide is the
       Long Lasting still (beach mattress) — it sits under the header. */
    asHero: true,
    layout: "overlay",
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
      src: "/karmo/images/mattress/hero/about-lifestyle-woman-cat-navy-room-hq.webp",
      alt: "A Karmo mattress styled in a calm bedroom",
      width: 1916,
      height: 821,
    },
    slides: [
      {
        id: "lifestyle",
        align: "center",
        titleCard: true,
        /* Official mattress tagline #13 — one line, original centre position. */
        headingLead: "Designed for Deeper Sleep",
        image: {
          src: "/karmo/images/mattress/bands/sleep-well-film-still-hq.webp",
          alt: "Karmo mattress on the sand — long-lasting rest by the sea",
          width: 1916,
          height: 821,
          /* Anchor to the bottom: when the frame crops the photo on a short
             or narrow screen, the top is cut, never the bottom. */
          position: "object-bottom",
        },
      },
      {
        id: "float",
        paused: true,
        align: "right",
        titleCard: true,
        headingLead: "Crafted for nights that last",
        image: {
          src: "/karmo/images/mattress/hero/cooling-cat-karmo-handle-hq.webp",
          alt: "Karmo mattress in a calm bedroom with a sleeping cat",
          unoptimized: true,
          width: 1983,
          height: 793,
          /* Anchor to the bottom: crop from the top, never the bottom. */
          position: "object-bottom",
        },
      },
    ],
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
    /* Claims already live in the feature mosaic above — hide this video band. */
    hidden: true,
    heading: "Sleep Well, Live Well",
    subline: "Everyone Assures Quality, But Not Everyone Can Promise Experiences",
    still: "/karmo/images/mattress/bands/sleep-well-film-still-hq.webp",
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
        body: "International quality certification you can check: ISO 9001 quality management, accredited by UKAS and approved by Moody International. Every Karmo mattress is tested one by one before it leaves the plant — not sampled, not assumed.",
      },
    ],
  },

  /* Hidden for now — same three claims already sit in the Promise band above.
     Set back to true to bring the split Sleep Well / Live Well section back. */
  spotlight: false,

  products: {
    eyebrow: "Best price",
    headingLead: "Hot offer",
    headingAccent: "for you",
    body: "Every Karmo mattress is tested one by one — pocket spring, euro top, orthopedic and more, sized and priced for Bangladesh homes.",
    textured: true,
    // Same quilting background as the homepage bands.
    textureSrc: "/karmo/images/home-02/divisions/karmo-pattern-quilt-tuft.webp",
    variant: "catalogue",
    offersId: "mattress-offers",
    items: [
      {
        id: "king",
        category: "king",
        name: "King Mattress",
        shortName: "King",
        href: "/mattress/king",
        image: "/karmo/images/mattress/products/king-cover-luxury-floral-v2.webp",
        imageHover: "/karmo/images/mattress/products/king-hover-real.webp",
        alt: "Karmo King floral mattress in a luxury bedroom",
        was: "৳ 11,320",
        now: "৳ 9,622",
        line: "Spacious comfort for deeper, shared rest",
        badge: "Best Seller",
        thickness: "4\"",
        rating: 4.8,
        reviews: 186,
        specs: ["PE + Rebonded", "Medium Firm", "10 yr durability"],
        highlights: ["Medium firm support", "Anti-dust & hypoallergenic"],
        defaultSize: "Queen",
      },
      {
        id: "prestige",
        category: "prestige",
        name: "Prestige Mattress",
        shortName: "Prestige",
        href: "/mattress/prestige",
        image: "/karmo/images/mattress/products/prestige-cover-luxury-floral.webp",
        imageHover: "/karmo/images/mattress/products/prestige-hover-real.webp",
        alt: "Karmo Prestige floral mattress in a luxury bedroom",
        was: "৳ 12,290",
        now: "৳ 10,447",
        line: "Balanced support with a refined sleep surface",
        badge: "Dual Comfort",
        thickness: "4\"",
        rating: 4.7,
        reviews: 142,
        specs: ["Felt + Rebonded", "Dual feel", "10 yr durability"],
        highlights: ["One side soft, one side firm", "Best back support"],
        defaultSize: "Queen",
      },
      {
        id: "orthopedic",
        category: "orthopedic",
        name: "Orthopedic Mattress",
        shortName: "Orthopedic",
        href: "/mattress/orthopedic",
        image: "/karmo/images/mattress/products/orthopedic-cover-luxury-dark-lit.webp",
        imageHover: "/karmo/images/mattress/products/orthopedic-hover-real.webp",
        alt: "Karmo Orthopedic mattress in a dark luxury bedroom",
        was: "৳ 14,231",
        now: "৳ 12,096",
        line: "Spine-aware firmness for healthier nights",
        badge: "Doctor Rec.",
        thickness: "4\"",
        rating: 4.9,
        reviews: 210,
        specs: ["Rebonded core", "Firm posture", "20 yr durability"],
        highlights: ["Spine-aware firmness", "Recommended by doctors"],
        defaultSize: "Queen",
      },
      {
        id: "imperial-eurotop",
        category: "imperial-eurotop",
        name: "Imperial Euro Top Mattress",
        shortName: "Imperial Euro Top",
        href: "/mattress/imperial-eurotop",
        image: "/karmo/images/mattress/products/imperial-cover-aatoi-bed.webp",
        imageHover: "/karmo/images/mattress/products/imperial-hover-real.webp",
        alt: "Karmo Imperial Euro Top mattress on a curved boucle bed",
        was: "৳ 19,406",
        now: "৳ 16,495",
        line: "Plush euro top over durable core support",
        badge: "Firm Pick",
        thickness: "4\"",
        rating: 4.6,
        reviews: 98,
        specs: ["Hi-density PE", "Extra firm", "Pressure relief"],
        highlights: ["Stiff support for back pain", "Equal weight distribution"],
        defaultSize: "Queen",
      },
      {
        id: "bonnell-spring",
        category: "bonnell-spring",
        name: "Bonnell Spring Mattress",
        shortName: "Bonnell Spring",
        href: "/mattress/bonnell-spring",
        image: "/karmo/images/mattress/products/bonnell-cover-aatoi-green.webp",
        imageHover: "/karmo/images/mattress/products/bonnell-hover-real.webp",
        alt: "Karmo Bonnell Spring mattress on a cream boucle bed",
        was: "৳ 23,675",
        now: "৳ 20,124",
        line: "Breathable open-coil comfort, crafted to last",
        badge: "Hotel Fav.",
        thickness: "8\"",
        rating: 4.7,
        reviews: 164,
        specs: ["Open coil", "Breathable", "Hypoallergenic"],
        highlights: ["Strong air circulation", "Corporate & hotel ready"],
        defaultSize: "Queen",
      },
      {
        id: "pillow-top-pocket-spring",
        category: "pillow-top-pocket-spring",
        name: "Pillow Top Pocket Spring Mattress",
        shortName: "Pillow Top Pocket",
        href: "/mattress/pillow-top-pocket-spring",
        image: "/karmo/images/mattress/products/pillowtop-cover-aatoi-side.webp",
        imageHover: "/karmo/images/mattress/products/pillowtop-hover-real.webp",
        alt: "Karmo Pillow Top Pocket Spring mattress in a luxury bedroom",
        was: "৳ 52,396",
        now: "৳ 44,537",
        line: "Independent coils under a cloud-soft pillow top",
        badge: "New Launch",
        thickness: "13\"",
        rating: 4.9,
        reviews: 240,
        specs: ["Pocket springs", "3\" pillow top", "No motion transfer"],
        highlights: ["Independent coil comfort", "Soft plush cushioning"],
        defaultSize: "Queen",
      },
      {
        id: "euro-top-pocket-spring",
        category: "euro-top-pocket-spring",
        name: "Euro Top Pocket Spring Mattress",
        shortName: "Euro Top Pocket",
        href: "/mattress/euro-top-pocket-spring",
        image: "/karmo/images/mattress/products/eurotop-cover-luxury-kingstyle.webp",
        imageHover: "/karmo/images/mattress/products/eurotop-hover-real.webp",
        alt: "Karmo Euro Top Pocket Spring mattress in a luxury bedroom",
        was: "৳ 48,515",
        now: "৳ 41,238",
        line: "Pocketed coils under a plush euro pillow top",
        badge: "Best Seller",
        thickness: "13\"",
        rating: 4.8,
        reviews: 198,
        specs: ["Euro pillow top", "Pocket springs", "Memory foam"],
        highlights: ["Plush euro top feel", "Spine alignment support"],
        defaultSize: "Queen",
      },
      {
        id: "topper",
        category: "topper",
        name: "Mattress Topper",
        shortName: "Topper",
        href: "/mattress/topper",
        image: "/karmo/images/mattress/products/topper-cover-on-bed-folded.webp",
        imageHover: "/karmo/images/mattress/products/topper-hover-real.webp",
        alt: "Karmo mattress topper on the bed, with a folded topper beside",
        was: "৳ 5,821",
        now: "৳ 4,948",
        line: "Add a softer layer to any mattress you already own",
        badge: "Add Softness",
        thickness: "2\"",
        rating: 4.5,
        reviews: 76,
        specs: ["Soft foam", "Microfibre fill", "Easy fit"],
        highlights: ["Instant comfort upgrade", "Washable cover options"],
        defaultSize: "Queen",
      },
    ],
  },
};

export default mattress;
