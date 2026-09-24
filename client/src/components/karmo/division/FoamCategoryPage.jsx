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

export function buildFoamCategoryData(key) {
  const cat = CATEGORIES[key];
  if (!cat) return foam;

  return {
    ...foam,
    bedAutomotiveHero:
      key === "bed-automotive" ? foam.bedAutomotiveHero : null,
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
    shapeGrid: key === "bed-automotive" ? {
      ...foam.shapeGrid,
      highlights: foam.shapeGrid.highlights.map((h, i) =>
        i === 0 ? { ...h, background: "/karmo/images/bed_&_automotive/train.png" } : h
      )
    } : foam.shapeGrid,
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
