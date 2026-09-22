import FoamCategoryPage from "@/components/karmo/division/FoamCategoryPage";
import { foamCategoryMeta } from "@/components/karmo/division/FoamCategoryPage";

const cat = foamCategoryMeta.furniture;

export const metadata = {
  title: `${cat.title} — Karmo Group`,
  description: cat.description,
};

export default function FoamFurnitureRoute() {
  return <FoamCategoryPage categoryKey="furniture" />;
}
