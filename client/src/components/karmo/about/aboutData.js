/**
 * Every claim on the About page, in one place.
 *
 * Source: the client's own 31-page company profile
 * (`recource/Karmo Website/Karmo Group Company Profile.pdf`). Nothing here is
 * written to fill a slot — figures, partner names, plant locations and the
 * chairman's words are all lifted from that document, so the page can be
 * checked against it line by line.
 *
 * Two things in the profile were deliberately left out:
 *   · "For the past 30 years…" — it contradicts the 1965 founding date on the
 *     same page, so quoting it would put two ages on one screen.
 *   · The full dealer roster (four pages of shop names) — a directory, not an
 *     about page. Only the 747 total and the seven divisions are used.
 */

/* ── The banner ─────────────────────────────────────────────────────────── */

export const aboutBanner = {
  src: "/karmo/images/collections/popular.jpg",
  alt: "A Karmo-furnished living room — foam, mattress and bedding made in Bangladesh",
  eyebrow: "About us",
  title: "The Journey Since 1965",
  line: "The first company in Bangladesh to produce polyurethane — and still the one the country builds its comfort on.",
};

/* ── Figures strip under the banner ─────────────────────────────────────── */

export const aboutFigures = [
  {
    id: "founded",
    figure: "1965",
    title: "Founded",
    note: "Karmo Foam Industry incorporated — six decades of manufacturing.",
  },
  {
    id: "industries",
    figure: "04",
    title: "Industries",
    note: "Foam, Mattress, HomeTex and Chemicals under one group.",
  },
  {
    id: "dealers",
    figure: "747",
    title: "Dealer points",
    note: "Dealers and sales points serving every corner of the country.",
  },
  {
    id: "accreditations",
    figure: "03",
    title: "Accreditations",
    note: "International quality accreditation and certification.",
  },
];

/* ── The story ──────────────────────────────────────────────────────────── */

export const aboutStory = {
  eyebrow: "Our story",
  titleLead: "First in Bangladesh to",
  titleAccent: "pour polyurethane",
  image: {
    src: "/karmo/images/mattress/suite-interior.jpg",
    alt: "A Karmo mattress dressed in a styled bedroom suite",
  },
  plaque: { figure: "1965", label: "Since" },
  paragraphs: [
    "Karmo Group of Industries is the first company in Bangladesh to have started the production of polyurethane products, and the journey began in 1965. Today Karmo is the leading industry in the formulation and manufacturing of both rigid and flexible polyurethane products.",
    "That position was earned on consistency rather than campaigns. Karmo holds the largest raw-material stock in Bangladesh, which is what keeps production running and deliveries predictable — and it is why consumers have never had reason to doubt the name on the label.",
  ],
  facts: [
    "First polyurethane producer in the country, manufacturing since 1965",
    "Rigid and flexible polyurethane, formulated and manufactured in-house",
    "The largest raw-material stock in Bangladesh, held for uninterrupted supply",
    "Custom-formulated grades developed to each customer's own requirement",
  ],
};

/* ── Chairman's message ─────────────────────────────────────────────────── */

export const chairmanMessage = {
  eyebrow: "Message from the Chairman",
  quote:
    "Since 1965 a history of creation and challenge took its first step with the incorporation of Karmo Foam Industry. Riding the wheels of difficulty over the past several years, Karmo Group has taken a firm root, growing into what it is today.",
  body: [
    "Although we have multiple businesses, three products remain at the centre of the group: foam, mattress and chemicals, all developed in Bangladesh. Over the years Karmo Foam has made remarkable advancement through product innovation and diversification.",
    "The company's positive business policy is to fulfil its prime responsibility to the environment and to customer satisfaction, through the development of its members' creativity and self-innovation. All achievements are the rewards for the sweat shed by a highly motivated and loyal team of professionals.",
  ],
  name: "Mofizur Rahman Babul",
  role: "Chairman & Managing Director",
};

/* ── The four industries ────────────────────────────────────────────────── */

export const aboutDivisions = [
  {
    index: "01",
    name: "Karmo Foam",
    line: "We create the chemistry of comfort",
    href: "/foam",
    image: "/karmo/images/home-02/divisions/foam-karmo-sofa-blocks-studio.png",
    alt: "A Karmo Foam sofa beside stacked foam blocks in a studio",
    points: [
      "Furniture and automotive grades",
      "Footbeds and insole — high, mid and low density",
    ],
  },
  {
    index: "02",
    name: "Karmo Mattress",
    line: "Your perfect partner for complete bedding",
    href: "/mattress",
    image: "/karmo/images/home-02/divisions/mattress-karmo-floral-bedroom.jpg",
    alt: "A Karmo floral mattress on an upholstered bed",
    points: [
      "Pocket springs that move independently, head to toe",
      "Quilted on U.S. machinery, edged under 500-ton roller pressure",
    ],
  },
  {
    index: "03",
    name: "Karmo HomeTex",
    line: "Where comfort meets elegance",
    href: "/hometex",
    image: "/karmo/images/home-02/divisions/hometex-karmo-bedding-room.png",
    alt: "Karmo HomeTex bedding in a styled bedroom",
    points: [
      "Cotton twill, sateen and Egyptian cotton bedsheets",
      "The country's largest maker of comforters and duvets",
    ],
  },
  {
    index: "04",
    name: "Karmo Chemical & Adhesives",
    line: "Excelling in chemicals and polymers",
    href: "/chemicals",
    image: "/karmo/images/home-02/divisions/chemicals-karmo-adhesive-tins.png",
    alt: "Karmo Adhesive tins arranged in a showroom",
    points: [
      "Industrial-grade adhesives for footwear, board and furniture",
      "Sodium silicate, EPS and the Evergain distributorship",
    ],
  },
];

/** The four units that sit inside the chemicals arm. */
export const chemicalUnits = [
  {
    n: "i",
    title: "Industrial grade adhesives",
    note: "PU and graft solutions, neoprene, primers and hardeners, sealants, silicones, wood-grade resins and superglue — supplied to the local footwear industry and to exporters.",
  },
  {
    n: "ii",
    title: "Evergain Chemicals",
    note: "Sole authorised distributor in Bangladesh for Evergain Adhesive Co. Ltd, one of the largest adhesive production bases in Asia.",
  },
  {
    n: "iii",
    title: "Sodium silicate plant",
    note: "A 20,000-tonne-per-annum plant in Feni, producing sodium silicate from locally available silica sand and imported soda ash.",
  },
  {
    n: "iv",
    title: "EPS — Expanded Polystyrene",
    note: "Insulation board, pipe insulation, fish boxes and packaging for the building, insulation and packaging industries.",
  },
];

/* ── Our strength ───────────────────────────────────────────────────────── */

export const aboutStrength = {
  eyebrow: "Our strength",
  titleLead: "A company",
  titleAccent: "since 1965",
  lead: "Karmo runs on two things the profile keeps returning to: material it can rely on, and machinery good enough to hold a standard across every batch.",
  pillars: [
    {
      id: "materials",
      title: "Imported raw material",
      note: "Sourced from the largest multinational chemical companies in the world, so the formulation starts from a known quantity.",
    },
    {
      id: "machinery",
      title: "State-of-the-art plant",
      note: "Computerised machinery through the production line, used extensively rather than in one showpiece corner.",
    },
    {
      id: "stock",
      title: "Deepest stock in the country",
      note: "The largest raw-material holding in Bangladesh, which is what makes a smooth production and delivery system possible.",
    },
    {
      id: "rnd",
      title: "Formulation expertise",
      note: "Both formulation and application developed for each customer's requirement — adhesive, taxidermy and custom-moulding among them.",
    },
  ],
  suppliersLabel: "Raw materials sourced from",
  suppliers: ["BASF", "Momentive", "Shell", "Mitsui", "Dow"],
};

/* ── Where Karmo is made ────────────────────────────────────────────────── */

export const aboutFacilities = {
  eyebrow: "Industrial parks",
  titleLead: "Where Karmo",
  titleAccent: "is made",
  units: [
    {
      n: "Unit 01",
      title: "Industrial Park, Demra",
      place: "Dhaka",
      status: "Operational",
      tone: "live",
      note: "The group's established manufacturing base.",
    },
    {
      n: "Unit 02",
      title: "Industrial Park, BSCIC",
      place: "Feni",
      status: "Under construction",
      tone: "building",
      note: "Second park, adding capacity alongside the sodium silicate project in the same district.",
    },
    {
      n: "Unit 03",
      title: "National Special Economic Zone",
      place: "Mirsarai",
      status: "Upcoming",
      tone: "planned",
      note: "Planned as a joint venture and collaboration project.",
    },
  ],
};

/* ── Reach ──────────────────────────────────────────────────────────────── */

export const aboutReach = {
  eyebrow: "Dealers & sales points",
  titleLead: "747 points,",
  titleAccent: "all over Bangladesh",
  paragraphs: [
    "Karmo reaches homes through a dealer network rather than a handful of company showrooms — 747 dealer and sales points carrying foam, mattress and bedding across all seven divisions of the country.",
  ],
  figure: "747",
  figureLabel: "Dealer & sales points",
  divisions: [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Rangpur",
    "Khulna",
    "Sylhet",
    "Barishal",
  ],
  office: {
    label: "Head office",
    lines: ["Ibrahim Chamber, 4th Floor", "95 Motijheel, Dhaka-1000, Bangladesh"],
  },
};
