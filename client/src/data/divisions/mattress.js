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
    bg: "/products/mattress/bands/sleep-well-film-still-hq.webp",
    badge: {
      src: "/shared/hero/badge-number-one.webp",
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
        image: "/pages/mattress/hero/product-eurotop-pocket-spring.webp",
        alt: "Karmo Euro Top Pocket Spring mattress",
      },
      {
        id: "bonnell",
        name: "Bonnell Spring",
        sub: "Breathable open-coil support, crafted to perfection.",
        image: "/pages/mattress/hero/product-bonnell-spring.webp",
        alt: "Karmo Bonnell Spring mattress",
      },
      {
        id: "pillowtop",
        name: "Pillow Top Pocket Spring",
        sub: "Bedding excellence since 1965 — luxury you can feel.",
        image: "/pages/mattress/hero/product-pillowtop-pocket-spring.webp",
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
      icon: "/shared/trust/cartoon-v3/legacy-60-v2.webp",
      title: "A legacy of 60 years",
      note: "of healthy sleep",
    },
    {
      id: "trusted",
      icon: "/shared/trust/cartoon-v3/trusted-v3.webp",
      title: "Trusted By Million",
      note: "families worldwide.",
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
      title: "Natural and",
      note: "Sustainable Products",
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

  /* Two pictures side by side, full width — under Our mattress brands, above
     the film: sleeper positions on the red floral mattress + the sleep-support
     infographic. (Its place in the page is set in DivisionPage.) */
  imagePair: {
    id: "mattress-sleep-support",
    label: "Karmo mattress support for every sleeping position",
    /* Half and half. Each cell is 1.15 : 1 — the square photo loses only a
       strip of wall / rug top and bottom, the wide infographic only its plain
       sides; every sleeper card, the bed and the icons stay whole. */
    split: [50, 50],
    cellAspect: 1.15,
    images: [
      {
        src: "/pages/mattress/bands/sleep-positions-premium-floral.webp",
        alt: "Karmo red floral mattress in a bedroom — support for side, back and stomach sleepers",
        width: 1254,
        height: 1254,
      },
      {
        src: "/pages/mattress/bands/sleep-support-minimal-ad.webp",
        alt: "Karmo mattress sleep support — side, back and stomach sleepers with breathable comfort, pressure relief, spinal alignment and motion isolation",
        width: 1915,
        height: 821,
      },
    ],
  },

  /* Showroom photo with the brand marks — the image pair follows right under
     it, then the film. The copy, link and per-brand `video` fields are only
     read by the reel layout (MattressBrandReels) — add `layout: "reels"` to
     try that again. */
  brochureBrands: {
    heading: "Our mattress brands",
    eyebrow: "Karmo",
    eyebrowNote: "Mattress brands",
    titleLine1: "Our mattress",
    titleLine2: "brands",
    kicker: "We test every mattress. Every single one.",
    body: "From Imperial euro-top luxury to everyday Bonnell spring — seven Karmo ranges, each built for a different kind of sleep. Pick a brand to see its sizes and prices.",
    link: { label: "Find your mattress", href: "#mattress-offers" },
    image: "/pages/mattress/brochure/page-03-brands.webp",
    imageAlt: "Karmo luxury mattress showroom interior",
    /* One full-width photograph, shown whole at its own proportions. */
    composed: true,
    background: "/pages/mattress/bands/mattress-showroom-interior.webp",
    backgroundAspect: "1774 / 887",
    items: [
      {
        id: "imperial",
        href: "/mattress/imperial-eurotop",
        src: "/pages/mattress/brochure/logos/logo-imperial-trim.webp",
        alt: "Karmo Imperial Mattress",
        video: "/shared/videos/shorts/fb-karmo-mattress-offer.mp4",
      },
      {
        id: "king",
        href: "/mattress/king",
        src: "/pages/mattress/brochure/logos/logo-king-trim.webp",
        alt: "Karmo King Mattress",
        video: "/shared/videos/shorts/fb-reel-921228060438784.mp4",
      },
      {
        id: "prestige",
        href: "/mattress/prestige",
        src: "/pages/mattress/brochure/logos/logo-prestige-trim.webp",
        alt: "Karmo Prestige Mattress",
        video: "/shared/videos/shorts/fb-reel-845505688502810.mp4",
      },
      {
        id: "orthopedic",
        href: "/mattress/orthopedic",
        src: "/pages/mattress/brochure/logos/logo-orthopedic-trim.webp",
        alt: "Karmo Orthopaedic Mattress",
        video: "/shared/videos/shorts/fb-reel-785013297942063.mp4",
      },
      {
        id: "bonnell",
        href: "/mattress/bonnell-spring",
        src: "/pages/mattress/brochure/logos/logo-bonnell-trim.webp",
        alt: "Karmo Bonnell Spring Mattress",
        video: "/shared/videos/shorts/fb-reel-747210751746270.mp4",
      },
      {
        id: "natural",
        href: "/mattress",
        src: "/pages/mattress/brochure/logos/logo-natural-trim.webp",
        alt: "Karmo Natural Mattress",
        video: "/shared/videos/shorts/fb-reel-3242808395880988.mp4",
      },
      {
        id: "pocket",
        href: "/mattress/pillow-top-pocket-spring",
        src: "/pages/mattress/brochure/logos/logo-pocket-trim.webp",
        alt: "Karmo Pocket Spring Mattress",
        video: "/shared/videos/shorts/fb-reel-1822025445099889.mp4",
        wide: true,
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
    background: "/products/mattress/mosaic/karmo-pattern-texture.webp",
    highlights: [
      {
        id: "long-lasting",
        icon: "shield",
        badge: "red",
        title: "Long Lasting",
        overview:
          "Premium materials and non-sag fill — shape and comfort that hold for years of restful sleep.",
        background:
          "/pages/mattress/brochure/inside/exploded-layers.webp",
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
      image: "/pages/mattress/mosaic/designed-to-destress.webp",
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
        "/pages/mattress/brochure/craft/unparalleled-texture.webp",
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
          image: "/pages/mattress/mosaic/icons/icon-pocket-springs.webp",
          badge: "blue",
          title: "Pocket Springs",
          overview:
            "Each coil sits in its own fabric pocket — body-mapped support, no motion transfer.",
        },
        {
          id: "doctor-recommended",
          icon: "pulse",
          image: "/pages/mattress/mosaic/icons/icon-doctor-recommended.webp",
          badge: "green",
          title: "Doctor Recommended",
          overview:
            "Orthopedic build specified with physicians for spine alignment, night after night.",
        },
      ],
      photo: {
        src: "/pages/mattress/brochure/inside/pocket-cutaway.webp",
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
    /* "Mattress 5" film — 1080p, no audio (plays muted), web-compressed. */
    src: "/shared/videos/mattress-film-5.mp4",
    still: "/products/mattress/bands/mattress-film-5-still.webp",
    alt: "Karmo mattress Sleep Well film",
    /* Official mattress tagline #24 — title card on the Sleep Well film. */
    heading: "The Art of Restful Living",
  },

  /* Full-width pocket-spring cutaway: solid left rail + image (brochure facts). */
  zones: {
    src: "/pages/mattress/bands/layers-cutaway-sleep-science.webp",
    alt: "Karmo pillow-top pocket-spring mattress cutaway showing real layered construction",
    width: 2032,
    height: 774,
    /* Editorial treatment — navy copy panel bleeding into the cutaway, with
       callouts on the photo and the homepage mattress-edge strip underneath.
       Only the mattress division uses it; foam keeps the plain rail. */
    layout: "editorial",
    eyebrow: "Karmo Mattress",
    heading: "Built layer by layer",
    headingLead: "Built layer by",
    headingAccent: "layer",
    subheading:
      "Thoughtfully engineered with premium materials for lasting comfort, support and durability.",
    icons: [
      { id: "foam", label: "Foam wadding", note: "Soft, breathable cushioning." },
      { id: "pillow", label: "Pillow top", note: "Adds plush comfort and a relaxed feel." },
      { id: "springs", label: "Pocket springs", note: "Individual support for undisturbed sleep." },
    ],
    cta: { label: "Find your mattress", href: "#mattress-offers", variant: "outline" },
    /* x/y are percentages of the photo box. `anchorY` is where the leader line
       meets the mattress; the line is drawn vertically at `x`. */
    callouts: [
      {
        id: "knit",
        title: "Premium knit fabric",
        note: "Breathable, soft and skin-friendly.",
        x: 68,
        y: 20,
        anchorY: 44,
        place: "above",
      },
      {
        id: "foam-layers",
        title: "Durable foam layers",
        note: "Long-lasting shape and support.",
        x: 62,
        y: 86,
        anchorY: 60,
        place: "below",
      },
      {
        id: "support",
        title: "High-density support foam",
        note: "Keeps your spine aligned all night.",
        x: 74,
        y: 86,
        anchorY: 64,
        place: "below",
      },
      {
        id: "springs",
        title: "Pocket springs",
        note: "Minimises motion transfer for undisturbed sleep.",
        x: 88,
        y: 86,
        anchorY: 68,
        place: "below",
      },
    ],
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
      src: "/pages/mattress/hero/about-lifestyle-woman-cat-navy-room-hq.webp",
      alt: "A Karmo mattress styled in a calm bedroom",
      width: 1916,
      height: 821,
    },
    slides: [
      {
        id: "lifestyle",
        align: "center",
        titleCard: true,
        /* Lighter than the shared centre default (0.72/0.32/0.22) so the beach
           still reads through. */
        titleOverlay:
          "linear-gradient(to top, rgba(11,21,40,0.50) 0%, rgba(11,21,40,0.22) 45%, rgba(11,21,40,0.14) 100%)",
        /* Official mattress tagline #13 — one line, original centre position. */
        headingLead: "Designed for Deeper Sleep",
        image: {
          src: "/pages/mattress/hero/mattress-by-the-serene-shore-v1.webp",
          alt: "Karmo mattress on a serene shore",
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
          src: "/shared/hero/cooling-cat-karmo-handle-hq.webp",
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
        image: "/pages/mattress/divisions/mattress-karmo-magnific-syoggvtub8.webp",
        alt: "Karmo Orthopedic mattress styled in a bedroom",
      },
      {
        id: "imperial",
        name: "Imperial",
        line: "The firmest, for back pain",
        image: "/pages/mattress/divisions/mattress-karmo-magnific-6a2nm3cijo.webp",
        alt: "Karmo Imperial firm mattress",
      },
      {
        id: "bonnell-spring",
        name: "Bonnell Spring",
        line: "Breathable open-coil comfort",
        image: "/pages/mattress/divisions/mattress-karmo-grey-bedroom.webp",
        alt: "Karmo Bonnell Spring mattress",
      },
      {
        id: "pocket-spring",
        name: "Pocket Spring",
        line: "Independent pocket coils",
        image: "/pages/mattress/divisions/mattress-karmo-magnific-p88h92qehw.webp",
        alt: "Karmo Pocket Spring mattress",
      },
      {
        id: "prestige",
        name: "Prestige",
        line: "Two-in-one dual comfort",
        image: "/shared/divisions/mattress-karmo-floral-bedroom.webp",
        alt: "Karmo Prestige dual-comfort mattress",
      },
      {
        id: "natural",
        name: "Natural",
        line: "100% coconut coir, eco-friendly",
        image: "/pages/mattress/divisions/mattress-karmo-magnific-huuqthnvql.webp",
        alt: "Karmo Natural coir mattress",
      },
      {
        id: "king",
        name: "King",
        line: "Everyday value comfort",
        image: "/shared/divisions/mattress-karmo-pro-foam-room.webp",
        alt: "Karmo King economy mattress",
      },
      {
        id: "folding",
        name: "Folding",
        line: "Tri-fold, go anywhere",
        image: "/shared/divisions/hometex-karmo-bedding-studio.webp",
        alt: "Karmo tri-fold folding mattress",
      },
    ],
  },

  promise: {
    /* Claims already live in the feature mosaic above — hide this video band. */
    hidden: true,
    heading: "Sleep Well, Live Well",
    subline: "Everyone Assures Quality, But Not Everyone Can Promise Experiences",
    still: "/products/mattress/bands/sleep-well-film-still-hq.webp",
    film: "/shared/videos/mattress-sleep-well.mp4",
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
    textureSrc: "/shared/divisions/karmo-pattern-quilt-tuft.webp",
    variant: "catalogue",
    offersId: "mattress-offers",
    items: [
      {
        id: "king",
        category: "king",
        name: "King Mattress",
        shortName: "King",
        href: "/mattress/king",
        image: "/products/mattress/king-cover-luxury-floral-v2.webp",
        imageHover: "/products/mattress/king-hover-navy-showcase.webp",
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
        image: "/products/mattress/prestige-cover-luxury-floral.webp",
        imageHover: "/products/mattress/prestige-hover-vintage-damask.webp",
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
        image: "/products/mattress/orthopedic-cover-luxury-dark-lit.webp",
        imageHover: "/products/mattress/orthopedic-hover-burgundy-showcase.webp",
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
        image: "/products/mattress/imperial-cover-aatoi-bed.webp",
        imageHover: "/products/mattress/imperial-hover-navy-studio.webp",
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
        image: "/products/mattress/bonnell-cover-aatoi-green.webp",
        imageHover: "/products/mattress/bonnell-hover-red-showcase.webp",
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
        image: "/products/mattress/pillowtop-cover-aatoi-side.webp",
        imageHover: "/products/mattress/pillowtop-hover-leaf-display.webp",
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
        image: "/products/mattress/eurotop-cover-luxury-kingstyle.webp",
        imageHover: "/products/mattress/eurotop-hover-quilted-studio.webp",
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
        image: "/products/mattress/topper-cover-on-bed-folded.webp",
        imageHover: "/products/mattress/topper-hover-elegant-bedroom.webp",
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

  /* Shown, never submitted. Demo notes only — no form on the page. */
  reviews: {
    eyebrow: "Guest notes",
    headingLead: "Rated by",
    headingAccent: "families",
    note: "A few notes from homes already sleeping on Karmo.",
    items: [
      {
        id: "nusrat",
        name: "Nusrat Jahan",
        city: "Dhaka",
        image: "/pages/mattress/reviews/nusrat.webp",
        rating: 5,
        quote: "The King holds both of us without a dip in the middle. Cool enough for a Dhaka summer, and the quilted top still looks new.",
      },
      {
        id: "imran",
        name: "Imran Hossain",
        city: "Chattogram",
        image: "/pages/mattress/reviews/imran.webp",
        rating: 5,
        quote: "My back used to complain by morning. Two weeks on the Orthopedic and I wake up straight. Firm, not hard.",
      },
      {
        id: "farzana",
        name: "Farzana Akter",
        city: "Sylhet",
        image: "/pages/mattress/reviews/farzana.webp",
        rating: 4,
        quote: "Soft where it should be, supportive underneath. Delivery was on time and the cover feels properly made.",
      },
      {
        id: "rafiq",
        name: "Rafiqul Islam",
        city: "Rajshahi",
        image: "/pages/mattress/reviews/rafiq.webp",
        rating: 5,
        quote: "The euro top is the part we notice every night. Plush at the shoulder, still steady through the hips.",
      },
      {
        id: "mehjabin",
        name: "Mehjabin Chowdhury",
        city: "Khulna",
        image: "/pages/mattress/reviews/mehjabin.webp",
        rating: 4,
        quote: "We turn a lot. The pocket springs keep one side still when the other moves. Quiet, which we did not expect.",
      },
      {
        id: "tanvir",
        name: "Tanvir Ahmed",
        city: "Gazipur",
        image: "/pages/mattress/reviews/tanvir.webp",
        rating: 5,
        quote: "Simple, honest comfort for the price. The edge stays firm when I sit to tie my shoes. No sag after three months.",
      },
    ],
  },
};

export default mattress;
