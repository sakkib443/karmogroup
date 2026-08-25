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
    /* Split-sides product hero kept in data; the overlay about band sits
       in its place as the page hero. Flip this to restore the old banner. */
    hidden: true,
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
    /* Centre copy; one product per slide, alternating in from right / left. */
    style: "split-sides",
    overlay: "none",
    showControls: false,
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

  /* Same six pillars + cartoon-v3 icons as the homepage trust strip. */
  features: [
    {
      id: "legacy",
      icon: "/karmo/images/trust/cartoon-v3/legacy-60.png?v=d44348",
      title: "A legacy of 60 years",
      note: "of healthy sleep",
    },
    {
      id: "trusted",
      icon: "/karmo/images/trust/cartoon-v3/trusted.png?v=d44348",
      title: "Trusted By Million",
      note: "families worldwide.",
    },
    {
      id: "recognised",
      icon: "/karmo/images/trust/cartoon-v3/superbrand.png?v=d44348",
      title: "Recognised By",
      note: "Super Brand",
    },
    {
      id: "natural",
      icon: "/karmo/images/trust/cartoon-v3/natural.png?v=d44348",
      title: "Natural and",
      note: "Sustainable Products",
    },
    {
      id: "delivery",
      icon: "/karmo/images/trust/cartoon-v3/delivery.png?v=d44348",
      title: "Free Delivery",
      note: "Available",
    },
    {
      id: "stores",
      icon: "/karmo/images/trust/cartoon-v3/stores.png?v=d44348",
      title: "5k+ Stores",
      note: "Pan Bangladesh",
    },
  ],

  /* Why-buy band — half-screen tall; photos only in assets, copy in HTML. */
  recommended: {
    heading: "Recommended Best",
    columns: [
      {
        id: "pain",
        image: "/karmo/images/mattress/why/why-back-pain.jpg",
        alt: "Half-body rear view on a Karmo mattress with a soft wellness glow along the spine",
        caption: "If you have chronic neck & back pain",
      },
      {
        id: "posture",
        image: "/karmo/images/mattress/why/why-posture-v5.jpg",
        alt: "Side-profile aligned sleep on a Karmo mattress with posture-support light",
        caption: "If you need firm support to correct your posture",
      },
      {
        id: "cool",
        image: "/karmo/images/mattress/why/why-sweaty-v5.jpg",
        alt: "Cool comfortable sleep on a Karmo mattress",
        caption: "If you are a sweaty sleeper",
      },
    ],
  },

  /* Feature mosaic — Sleep Well claims (short) + lifestyle + certs + FAQs. */
  shapeGrid: {
    background: "/karmo/images/mattress/mosaic-karmo-pattern.jpg",
    highlights: [
      {
        id: "long-lasting",
        icon: "shield",
        badge: "red",
        title: "Long Lasting",
        overview:
          "Premium materials and non-sag fill — shape and comfort that hold for years of restful sleep.",
        background: "/karmo/images/mattress/mattress-sleep-well-bg.jpg",
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
          "Premium cotton and high-density microfibre — gentle, breathable rest you can trust.",
      },
    ],
    spotlight: {
      image: "/karmo/images/mattress/mosaic-destress.jpg",
      alt: "Peaceful sleep on a Karmo mattress",
      headingLead: "Designed",
      headingAccent: "to",
      headingEnd: "de-stress",
      subline: "Pocket springs and anti-allergic fill for deep, lasting rest.",
      brand: "Karmo Mattress",
    },
    certifications: [
      {
        id: "iso",
        image: "/karmo/images/home-02/certified/01-iso-9001.jpg",
        alt: "ISO 9001 quality management certificate",
        title: "ISO 9001 Accreditation",
        body: "International quality management — every mattress built to certified standards.",
      },
      {
        id: "ukas",
        image: "/karmo/images/home-02/certified/02-ukas.jpg",
        alt: "UKAS accredited quality management certificate",
        title: "UKAS Accreditation",
        body: "Quality systems accredited by UKAS — trusted craft since 1965.",
      },
    ],
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

  /* Full-width pocket-spring cutaway: solid left rail + image (brochure facts). */
  zones: {
    src: "/karmo/images/mattress/karmo-mattress-layers-band.jpg",
    alt: "Karmo pocket-spring mattress cutaway showing layered construction",
    width: 3712,
    height: 1152,
    heading: "Built layer by layer",
    icons: [
      { id: "foam", label: "Foam wadding" },
      { id: "pillow", label: "Pillow top" },
      { id: "springs", label: "Pocket springs" },
    ],
    cta: { label: "Find your mattress", href: "#mattress-offers" },
  },

  /* Two-panel row above the lounge band. Left keeps the sea still + copy;
     right plays the Sleep Well film (same clip as the promise band below). */
  explore: {
    flagship: false,
    half: true,
    className: "mb-1.5",
    panels: [
      {
        id: "sea",
        href: "/mattress",
        src: "/karmo/images/mattress/mattress-sleep-well-bg.jpg",
        alt: "A Karmo mattress on the shore",
        line1: "HomeTex for",
        line2: "every room",
        align: "right",
        position: "object-center",
      },
      {
        id: "film",
        film: "/karmo/videos/mattress-sleep-well.mp4",
        still: "/karmo/images/mattress/mattress-sleep-well-bg.jpg",
        alt: "Karmo mattress Sleep Well film",
      },
    ],
  },

  /* Photo band under the icon strip: empty navy wall on the left for copy,
     woman resting on a Karmo mattress on the right. Same overlay template
     as the hero, one left-aligned slide. */
  lounge: {
    layout: "overlay",
    headingLead: "The rest you take",
    headingAccent: "before night",
    kicker: "Sink into a Karmo mattress",
    cta: [{ label: "Find your perfect mattress", href: "#mattress-offers", primary: true }],
    image: {
      src: "/karmo/images/mattress/karmo-mattress-lounge-band.jpg",
      alt: "A woman resting on a Karmo mattress in a calm bedroom",
      width: 1916,
      height: 821,
    },
    slides: [
      {
        id: "lounge",
        align: "left",
        headingLead: "The rest you take",
        headingAccent: "before night",
        kicker: "Sink into a Karmo mattress",
        cta: [{ label: "Find your perfect mattress", href: "#mattress-offers", primary: true }],
        image: {
          src: "/karmo/images/mattress/karmo-mattress-lounge-band.jpg",
          alt: "A woman resting on a Karmo mattress in a calm bedroom",
          width: 1916,
          height: 821,
        },
      },
    ],
  },

  about: {
    /* Full-bleed photo band used as the mattress hero. Two slides: lifestyle
       (copy left) then the studio float (copy right). 1916×821. */
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
      src: "/karmo/images/mattress/chatgpt-about-hero.png",
      alt: "A Karmo mattress styled in a calm bedroom",
      width: 1916,
      height: 821,
    },
    slides: [
      {
        id: "lifestyle",
        align: "left",
        headingLead: "Moments that make a house",
        headingAccent: "feel like home",
        kicker: "We test every mattress, every single one",
        cta: [{ label: "Find your perfect mattress", href: "#mattress-offers", primary: true }],
        image: {
          src: "/karmo/images/mattress/chatgpt-about-hero.png",
          alt: "A Karmo mattress styled in a calm bedroom",
          width: 1916,
          height: 821,
        },
      },
      {
        id: "float",
        align: "right",
        headingLead: "Crafted for nights",
        headingAccent: "that last",
        kicker: "Every Karmo mattress is tested, one by one",
        cta: [{ label: "Find your perfect mattress", href: "#mattress-offers", primary: true }],
        image: {
          src: "/karmo/images/mattress/Gemini_Generated_Image_iyl84kiyl84kiyl8.jpg",
          alt: "Karmo mattress in a calm bedroom with a sleeping cat",
          width: 3140,
          height: 1344,
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

  /* Hidden for now — same three claims already sit in the Promise band above.
     Set back to true to bring the split Sleep Well / Live Well section back. */
  spotlight: false,

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
        image: "/karmo/images/mattress/products/king-room.jpg",
        imageHover: "/karmo/images/mattress/products/king-web.jpg",
        alt: "Karmo King Mattress in a calm blue bedroom",
        was: "৳ 11,339",
        now: "৳ 9,622",
      },
      {
        id: "prestige",
        category: "prestige",
        name: "Prestige Mattress",
        image: "/karmo/images/mattress/products/prestige-room.jpg",
        imageHover: "/karmo/images/mattress/products/prestige-web.jpg",
        alt: "Karmo Prestige Mattress in a warm arched bedroom",
        was: "৳ 12,290",
        now: "৳ 10,447",
      },
      {
        id: "orthopedic",
        category: "orthopedic",
        name: "Orthopedic Mattress",
        image: "/karmo/images/mattress/products/orthopedic-room.jpg",
        imageHover: "/karmo/images/mattress/products/orthopedic-web.jpg",
        alt: "Karmo Orthopedic Mattress in a rustic brick bedroom",
        was: "৳ 14,231",
        now: "৳ 12,096",
      },
      {
        id: "imperial-eurotop",
        category: "imperial-eurotop",
        name: "Imperial Euro Top Mattress",
        image: "/karmo/images/mattress/products/imperial-room.jpg",
        imageHover: "/karmo/images/mattress/products/imperial-eurotop-web.jpg",
        alt: "Karmo Imperial Euro Top Mattress in a soft blue bedroom",
        was: "৳ 19,406",
        now: "৳ 16,495",
      },
      {
        id: "bonnell-spring",
        category: "bonnell-spring",
        name: "Bonnell Spring Mattress",
        image: "/karmo/images/mattress/products/bonnell-room.jpg",
        imageHover: "/karmo/images/mattress/products/bonnell-spring-web.jpg",
        alt: "Karmo Bonnell Spring Mattress in a Mediterranean bedroom",
        was: "৳ 23,675",
        now: "৳ 20,124",
      },
      {
        id: "pillow-top-pocket-spring",
        category: "pillow-top-pocket-spring",
        name: "Pillow Top Pocket Spring Mattress",
        image: "/karmo/images/mattress/products/pillowtop-room.jpg",
        imageHover: "/karmo/images/mattress/products/pillow-top-pocket-spring-web.jpg",
        alt: "Karmo Pillow Top Pocket Spring Mattress in a green nature bedroom",
        was: "৳ 52,396",
        now: "৳ 44,537",
      },
      {
        id: "euro-top-pocket-spring",
        category: "euro-top-pocket-spring",
        name: "Euro Top Pocket Spring Mattress",
        image: "/karmo/images/mattress/products/eurotop-room.jpg",
        imageHover: "/karmo/images/mattress/products/euro-top-pocket-spring-web.png",
        alt: "Karmo Euro Top Pocket Spring Mattress in a brick and tropical bedroom",
        was: "৳ 48,515",
        now: "৳ 41,238",
      },
      {
        id: "topper",
        category: "topper",
        name: "Mattress Topper",
        image: "/karmo/images/mattress/products/topper-room.jpg",
        imageHover: "/karmo/images/mattress/products/topper-web.png",
        alt: "Karmo Mattress Topper styled on a bed",
        was: "৳ 5,821",
        now: "৳ 4,948",
      },
    ],
  },
};

export default mattress;
