import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicalsCategories from "@/data/divisions/chemicalsCategories";

const section = chemicalsCategories["karmo-adhesive"];

export const metadata = {
  title: section.title,
  description: section.description,
};

/** `/chemicals/karmo-adhesive` — Karmo Adhesive section page. */
export default function ChemicalsKarmoAdhesiveRoute() {
  return <DivisionPage data={section.data} />;
}
