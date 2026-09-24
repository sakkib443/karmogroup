import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicalsCategories from "@/data/divisions/chemicalsCategories";

const section = chemicalsCategories["sodium-silicate"];

export const metadata = {
  title: section.title,
  description: section.description,
};

/** `/chemicals/sodium-silicate` — Sodium Silicate section page. */
export default function ChemicalsSodiumSilicateRoute() {
  return <DivisionPage data={section.data} />;
}
