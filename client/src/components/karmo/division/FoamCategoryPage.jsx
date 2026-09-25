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
      "Karmo set and block foam grades for furniture and upholstery — Poly, 280, 480, 2001, HD, 4G, 1965 and Signature.",
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
  background: "/karmo/images/foam-2/mosaic/foam-texture-hq.jpg",
  highlights: [
    {
      id: "no-filler",
      icon: "shield",
      badge: "red",
      title: "No Filler",
      overview:
        "100% pure rubber-grade foam — maximum density, clean finish and strength that stands through daily use.",
      background: "/karmo/images/bed_&_automotive/train.png",
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
    image: "/karmo/images/foam/banner-01.png",
    alt: "A calm living room with deep foam sofa seating",
    headingLead: "Designed",
    headingAccent: "to",
    headingEnd: "endure",
    subline: "High-density cores and open airflow for everyday living rooms.",
    brand: "Karmo Foam",
  },
  certifications: [
    {
      id: "iso",
      image: "/karmo/images/home-02/certified/01-iso-9001.jpg",
      alt: "ISO 9001 quality management certificate",
      title: "ISO 9001 Accreditation",
      body: "International quality management — every foam grade held to certified standards.",
    },
    {
      id: "ukas",
      image: "/karmo/images/home-02/certified/02-ukas.jpg",
      alt: "UKAS accredited quality management certificate",
      title: "UKAS Accreditation",
      body: "Quality systems accredited by UKAS — trusted craft since 1965.",
    },
  ],
  film: "/karmo/videos/shorts/v1-tisa-trim.mp4",
  still: "/karmo/images/foam-2/mosaic/tisha-film-still-hq.jpg",
  filmAlt: "Tanzin Tisha for Karmo Foam",
};

export function buildFoamCategoryData(key) {
  const cat = CATEGORIES[key];
  if (!cat) return foam;

  return {
    ...foam,
    bedAutomotiveHero:
      key === "bed-automotive" ? foam.bedAutomotiveHero : null,
    // Bed & Automotive drops the generic "Built density by density" zones band.
    zones: key === "bed-automotive" ? null : foam.zones,
    recommended: key === "bed-automotive" ? {
      heading: "Why choose Karmo Bed & Automotive Foam",
      uncropped: true,
      imageOverlay: true,
      columns: [
        {
          id: "sleep",
          image: "/karmo/images/foam-2/bed-automotive/why-sleep-landscape-v2.png",
          alt: "A woman resting comfortably on a bed in a naturally lit bedroom",
          caption: "Comfort that supports restful sleep",
        },
        {
          id: "journey",
          image: "/karmo/images/foam-2/bed-automotive/why-journey-landscape-v2.png",
          alt: "A passenger relaxing in a cushioned bus seat beside a coastal view",
          caption: "Comfort that travels with you",
        },
        {
          id: "support",
          image: "/karmo/images/foam-2/bed-automotive/why-support-landscape-v2.png",
          alt: "Bed and bus seat cushioning shown together with their foam layers",
          caption: "Support for beds and beyond",
        },
      ],
    } : foam.recommended,
    shapeGrid: key === "bed-automotive" ? BED_AUTOMOTIVE_SHAPEGRID : foam.shapeGrid,
    shapeGridVariant:
      key === "bed-automotive" ? "bed-automotive-legacy" : foam.shapeGridVariant,
    lounge: key === "bed-automotive" ? {
      ...foam.lounge,
      image: {
        ...foam.lounge.image,
        src: "/karmo/images/bed_&_automotive/banner-01.png",
        position: "object-top"
      },
      slides: [{
        id: "bed-auto-lounge",
        align: "left",
        headingLead: "Premium Automotive Foam",
        headingAccent: "",
        kicker: "",
        cta: null,
        image: { 
          src: "/karmo/images/bed_&_automotive/banner-01.png", 
          alt: "Bed & Automotive Banner",
          position: "object-top"
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
  };
}

export const foamCategoryMeta = CATEGORIES;

export default function FoamCategoryPage({ categoryKey }) {
  const data = buildFoamCategoryData(categoryKey);
  return <DivisionPage data={data} />;
}
