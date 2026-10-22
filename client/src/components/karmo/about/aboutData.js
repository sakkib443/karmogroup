/**
 * Every claim on the About page, in one place.
 *
 * Source: the client's own 31-page company profile
 * (`karmo-library/02-catalogues/Company Profile`). Figures, plant locations,
 * strengths and the chairman's words are lifted from it, kept short: the page
 * leads with pictures, and each band carries one heading and a line or two.
 * The chairman's portrait, the three industrial parks
 * and the dealer map are cut from the profile pages themselves.
 *
 * Left out on purpose: "For the past 30 years…" (it contradicts the 1965
 * founding date on the same page) and the four pages of dealer shop names.
 */

/* ── The cover ──────────────────────────────────────────────────────────── */

export const aboutBanner = {
  /* The cover carries the Karmo mark and "Timeless comfort since 1965" itself,
     so it is shown whole, with no veil or type on top. */
  src: "/pages/about/karmo-timeless-comfort-cover.webp",
  width: 2056,
  height: 765,
  alt: "Karmo, timeless comfort since 1965 — foam, cotton, thread and a Karmo mattress over sketches of the factory floor",
  eyebrow: "About us",
  title: "The Journey Since 1965",
  line: "The first company in Bangladesh to produce polyurethane — and still the one the country builds its comfort on.",
};

/* ── Figures strip (not on the page now; the trust icons sit under the cover) ── */

export const aboutFigures = [
  { id: "founded", figure: "1965", title: "Founded", note: "Karmo Foam Industry incorporated — six decades of manufacturing." },
  { id: "industries", figure: "04", title: "Industries", note: "Foam, Mattress, HomeTex and Chemicals under one group." },
  { id: "dealers", figure: "747", title: "Dealer points", note: "Dealers and sales points serving every corner of the country." },
  { id: "accreditations", figure: "03", title: "Accreditations", note: "International quality accreditation and certification." },
];

/* ── The journey and the four industries (#history) ─────────────────────── */

export const aboutStory = {
  eyebrow: "About Karmo",
  titleLead: "The journey",
  titleAccent: "since 1965",
  lead: "The first in Bangladesh to make polyurethane — today four industries under one name.",
  industries: [
    {
      index: "01",
      name: "Karmo Foam",
      line: "The chemistry of comfort",
      href: "/foam",
      image: "/pages/home/divisions/editorial-v2/foam-luxury-arch-sofa-hq.webp",
      alt: "A sofa built on Karmo Foam in a sunlit arched room",
    },
    {
      index: "02",
      name: "Karmo Mattress",
      line: "Complete bedding solution",
      href: "/mattress",
      image: "/pages/home/divisions/editorial-v2/mattress-press-pro-fill-hq.webp",
      alt: "A Karmo mattress pressed to show its fill",
    },
    {
      index: "03",
      name: "Karmo HomeTex",
      line: "Where comfort meets elegance",
      href: "/hometex",
      image: "/pages/home/divisions/editorial-v2/hometex-quilt-stack-hq.webp",
      alt: "A stack of Karmo HomeTex quilts and comforters",
    },
    {
      index: "04",
      name: "Chemicals & Adhesives",
      line: "Quality that sticks",
      href: "/chemicals/polyurethane",
      image: "/pages/home/divisions/editorial-v2/chemicals-tins-hq.webp",
      alt: "Karmo adhesive tins",
    },
  ],
};

/* ── Chairman's message (#board) ────────────────────────────────────────── */

export const chairmanMessage = {
  eyebrow: "Message from the Chairman",
  quote:
    "Since 1965 a history of creation and challenge took its first step with Karmo Foam Industry. Riding the wheels of difficulty, Karmo Group has taken a firm root — and is still growing day by day.",
  line: "Every achievement is the reward for the sweat of a highly motivated and loyal team.",
  name: "Mofizur Rahman Babul",
  role: "Chairman & Managing Director",
  portrait: {
    src: "/pages/about/chairman-mofizur-rahman-babul.webp",
    alt: "Mofizur Rahman Babul, Chairman and Managing Director of Karmo Group",
  },
};

/* ── Our strength and accreditations (#achievements) ────────────────────── */

export const aboutStrength = {
  eyebrow: "Why Karmo",
  titleLead: "Our",
  titleAccent: "strength",
  pillars: [
    { id: "brand", icon: "award", title: "Unique brand position", note: "Forerunner in foam for 60 years." },
    { id: "finance", icon: "growth", title: "Financial strength", note: "Own resources, least debt burden." },
    { id: "supply", icon: "truck", title: "Proven supply chain", note: "Dealers in all 64 districts." },
    { id: "talent", icon: "people", title: "Diverse talent pool", note: "Young talent running the business." },
    { id: "assets", icon: "factory", title: "Fixed asset pool", note: "Prime industrial and commercial land." },
    { id: "trading", icon: "flask", title: "Trading concerns", note: "9 units trading chemicals and more." },
  ],
  suppliersLabel: "Raw materials from",
  suppliers: ["BASF", "Momentive", "Shell", "Mitsui", "Dow"],
};

/* ── Where Karmo is made ────────────────────────────────────────────────── */

export const aboutFacilities = {
  eyebrow: "Industrial parks",
  titleLead: "Where Karmo",
  titleAccent: "is made",
  lead: "One park running, one rising, one on the drawing board.",
  units: [
    {
      n: "Unit 01",
      title: "Demra",
      place: "Dhaka",
      status: "Operational",
      tone: "live",
      image: "/pages/about/park-unit1-demra-gate.webp",
      alt: "Render of the gate of Karmo Industrial Park Unit 1 in Demra",
    },
    {
      n: "Unit 02",
      title: "BSCIC",
      place: "Feni",
      status: "Under construction",
      tone: "building",
      image: "/pages/about/park-unit2-feni-site.webp",
      alt: "Trucks levelling the site of Karmo Industrial Park Unit 2 in Feni",
    },
    {
      n: "Unit 03",
      title: "Economic Zone",
      place: "Mirsarai",
      status: "Upcoming",
      tone: "planned",
      image: "/pages/about/park-unit3-mirsarai-plan.webp",
      /* Portrait plan: keep Karmo's yellow plot (upper middle) in the frame. */
      position: "center 32%",
      alt: "Site plan of Karmo's plot in the National Special Economic Zone, Mirsarai",
    },
  ],
};

/* ── Reach ──────────────────────────────────────────────────────────────── */

export const aboutReach = {
  eyebrow: "Dealers & sales points",
  figure: "747",
  figureLabel: "dealer points across the country",
  map: {
    src: "/pages/about/dealer-map-bangladesh.webp",
    alt: "Map of Bangladesh with Karmo dealer points in every division",
  },
  divisions: ["Dhaka", "Chittagong", "Rajshahi", "Rangpur", "Khulna", "Sylhet", "Barishal"],
  office: {
    label: "Head office",
    lines: ["Ibrahim Chamber, 4th Floor", "95 Motijheel, Dhaka-1000"],
  },
};
