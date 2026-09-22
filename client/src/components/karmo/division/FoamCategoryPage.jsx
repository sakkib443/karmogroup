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
