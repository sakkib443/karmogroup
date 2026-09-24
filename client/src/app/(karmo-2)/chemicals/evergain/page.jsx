import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicalsCategories from "@/data/divisions/chemicalsCategories";

const section = chemicalsCategories.evergain;

export const metadata = {
  title: section.title,
  description: section.description,
};

/** `/chemicals/evergain` — Evergain Chemical section page. */
export default function ChemicalsEvergainRoute() {
  return <DivisionPage data={section.data} />;
}
