import FoamCategoryPage from "@/components/karmo/division/FoamCategoryPage";
import { foamCategoryMeta } from "@/components/karmo/division/FoamCategoryPage";

const cat = foamCategoryMeta["bed-automotive"];

export const metadata = {
  title: `${cat.title} — Karmo Group`,
  description: cat.description,
};

export default function FoamBedAutomotiveRoute() {
  return <FoamCategoryPage categoryKey="bed-automotive" />;
}
