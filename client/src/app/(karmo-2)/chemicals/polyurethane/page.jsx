import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicalsCategories from "@/data/divisions/chemicalsCategories";

const section = chemicalsCategories.polyurethane;

export const metadata = {
  title: section.title,
  description: section.description,
};

/** `/chemicals/polyurethane` — Polyurethane / Solvent section page. */
export default function ChemicalsPolyurethaneRoute() {
  return <DivisionPage data={section.data} />;
}
