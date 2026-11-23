import DivisionPage from "@/components/karmo/division/DivisionPage";
import foam from "@/data/divisions/foam";

/**
 * Foam category landings — the three mega-menu columns.
 * Sub-items may deep-link to products; these pages are the category homes.
 */

const CATEGORIES = {
  furniture: {
    slug: "furniture",
    title: "Furniture & Upholstery Foam",
    description:
      "Karmo set and block foam grades for furniture and upholstery — Poly, 280, 2001, HD, 4G, 1965 and Signature.",
    headingLead: "Furniture &",
    headingAccent: "upholstery",
    kicker: "Set and block foam grades for makers",
  },
  "bed-automotive": {
    slug: "bed-automotive",
    title: "Bed & Automotive Foam",
    description:
      "Contour design, acoustic and bed foam for sleep and automotive interiors.",
    headingLead: "Bed &",
    headingAccent: "automotive",
    kicker: "Contour, acoustic and bed foam",
  },
  footwear: {
    slug: "footwear",
    title: "Footwear Foam",
    description:
      "Peeling roll, load-bearing and visco-elastic foam for collar, tongue and insole.",
    headingLead: "Footwear",
    headingAccent: "foam",
    kicker: "Load-bearing grades for footwear plants",
  },
};

// Bed & Automotive keeps the pre-merge foam shape-grid (rendered by the legacy
// BedAutomotiveShapeGrid): the shared foam.shapeGrid was later reworked toward
// footwear content, which does not belong on this page. Only the highlight-0
// background (train) and the spotlight image (banner-01) are this page's own.
const BED_AUTOMOTIVE_SHAPEGRID = {
  background: "/pages/foam/mosaic/foam-texture-hq.webp",
  highlights: [
    {
      id: "no-filler",
      icon: "shield",
      badge: "red",
      title: "No Filler",
      overview:
        "100% pure rubber-grade foam — maximum density, clean finish and strength that stands through daily use.",
      background: "/pages/foam/bed-automotive/train.webp",
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
  /* Old left banner, replaced 24 Nov 2026 — kept, unused, for a quick restore. */
  oldSpotlight: {
    image: "/pages/foam/banner-01.webp",
    alt: "A calm living room with deep foam sofa seating",
    /* Light scrim so the dark heading stays readable against the bright sky —
       the client's ask; the image had none before. */
    overlay: true,
    headingLead: "Designed",
    headingAccent: "to",
    headingEnd: "endure",
    subline: "High-density cores and open airflow for everyday living rooms.",
    brand: "Karmo Foam",
  },
  /* Two foam-benefit claims, not certification photos — the client's ask.
     Icon and colour are picked in `CertCard` itself (bed icon, orange first;
     car icon, purple second), matched to this page's own two audiences. */
  certifications: [
    {
      id: "sleep-support",
      title: "Restful Sleep Support",
      body: "Consistent density under mattresses and cushions holds its shape night after night — no sagging, no lost support.",
    },
    {
      id: "smooth-journey",
      title: "Smooth Every Journey",
      body: "Firm, resilient foam in seats and interiors absorbs road vibration — comfortable for the whole ride.",
    },
  ],
  /* Right banner is now a still showcase image (the brand film was dropped at
     the client's ask) — the two banners share the width 50/50. */
  /* Left: the auto-rickshaw under the lens (client, 24 Nov 2026) — replaces the
     "Designed to endure" spotlight. Row is about 1.5 : 1 per cell so the square
     rickshaw and the wide bed both show whole enough. */
  spotlight: {
    image: "/pages/foam/bed-automotive/karmo-tuktuk-under-the-lens.webp",
    alt: "A green Karmo auto-rickshaw under a magnifying glass, revealing the foam in its seats",
    position: "object-[center_60%]",
    overlay: false,
  },
  rowClass: "md:h-[33vw]",
  className: "mt-[6px] mb-1.5",
  rightPosition: "object-[60%_center]",
  rightImage: "/pages/foam/bed-automotive/hospital-bed-foam-branding-showcase.webp",
  rightAlt:
    "A Karmo navy mattress on a hospital bed, a magnifying glass revealing the KARMO foam inside",
};

export function buildFoamCategoryData(key) {
  const cat = CATEGORIES[key];
  if (!cat) return foam;

  return {
    ...foam,
    /* Bed & Automotive: the old hero picture is skipped for now (client, 24 Nov 2026) —
       the chair band ("Premium Automotive Foam") moves up and is the hero instead. */
    bedAutomotiveHero: null,
    /* After the icon strip: four pictures 2 × 2 whose quarters form one "রয়েছে কারমো" badge. */
    quadMosaic: key === "bed-automotive" ? {
      items: [
        { src: "/pages/foam/bed-automotive/mosaic/tl-tuktuk.webp", alt: "Karmo foam in an auto-rickshaw seat, under a magnifying glass" },
        { src: "/pages/foam/bed-automotive/mosaic/tr-sofa.webp", alt: "Karmo HD foam slabs beside a teal sofa" },
        { src: "/pages/foam/bed-automotive/mosaic/bl-bag.webp", alt: "Karmo foam inside a backpack, under a magnifying glass" },
        { src: "/pages/foam/bed-automotive/mosaic/br-shoe.webp", alt: "A sports shoe with a roll of Karmo foam" },
      ],
    } : null,
    // Footwear-only: drop the shared shape-grid feature cards and show just the
    // two "Designed to endure" shoe photos, full-bleed 50/50.
    footwearEndureBand: key === "footwear" ? true : null,
    // Footwear and Bed & Automotive both drop the generic
    // "Built density by density" zones band.
    zones:
      key === "footwear" || key === "bed-automotive" ? null : foam.zones,
    /* Bed & Automotive: "Why choose" band removed (client, 24 Nov 2026); its auto-rickshaw
       auto-rickshaw picture now fills the left of the two banners below, beside the hospital bed. */
    recommended: key === "bed-automotive" ? null : foam.recommended,

    shapeGrid:
      key === "footwear"
        ? { hidden: true }
        : key === "bed-automotive"
          ? BED_AUTOMOTIVE_SHAPEGRID
          : foam.shapeGrid,
    shapeGridVariant:
      key === "bed-automotive" ? "bed-automotive-legacy" : foam.shapeGridVariant,
    lounge: key === "bed-automotive" ? {
      ...foam.lounge,
      asHero: true,
      image: {
        ...foam.lounge.image,
        src: "/pages/foam/bed-automotive/executive-office-karmo-leather-chair.webp",
        position: "object-center"
      },
      slides: [{
        id: "bed-auto-lounge",
        align: "right",
        headingLead: "Premium Automotive Foam",
        headingAccent: "",
        kicker: "",
        cta: null,
        image: { 
          src: "/pages/foam/bed-automotive/executive-office-karmo-leather-chair.webp", 
          alt: "A brown Karmo leather executive office chair beside a wooden desk in a sunlit modern office",
          position: "object-center"
        },
        veil: true
      }]
    } : foam.lounge,
    about: {
      ...foam.about,
      eyebrow: "Karmo Foam",
      headingLead: cat.headingLead,
      headingAccent: cat.headingAccent,
      kicker: cat.kicker,
      bodyLead: "Karmo Foam",
      body: ` — ${cat.description}`,
    },
    /* Live shop foam SKUs are furniture combos + Sit/Back. Bed & Automotive
       and Footwear have no matching shop products on karmogroup.com. */
    products:
      key === "bed-automotive" || key === "footwear"
        ? { hidden: true }
        : foam.products,
  };
}

export const foamCategoryMeta = CATEGORIES;

export default function FoamCategoryPage({ categoryKey }) {
  const data = buildFoamCategoryData(categoryKey);
  return <DivisionPage data={data} />;
}
