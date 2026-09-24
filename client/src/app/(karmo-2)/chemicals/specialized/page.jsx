import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicalsCategories from "@/data/divisions/chemicalsCategories";

const section = chemicalsCategories.specialized;

export const metadata = {
  title: section.title,
  description: section.description,
};

/** `/chemicals/specialized` — Specialized Chemicals & Additives section page. */
export default function ChemicalsSpecializedRoute() {
  return <DivisionPage data={section.data} />;
}
