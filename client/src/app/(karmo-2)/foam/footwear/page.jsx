import FoamCategoryPage from "@/components/karmo/division/FoamCategoryPage";
import { foamCategoryMeta } from "@/components/karmo/division/FoamCategoryPage";

const cat = foamCategoryMeta.footwear;

export const metadata = {
  title: `${cat.title} — Karmo Group`,
  description: cat.description,
};

export default function FoamFootwearRoute() {
  return <FoamCategoryPage categoryKey="footwear" />;
}
