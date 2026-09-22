import DivisionPage from "@/components/karmo/division/DivisionPage";
import foamFurniture from "@/data/divisions/foamFurniture";

export const metadata = {
  title: "Furniture & Upholstery Foam — Karmo Group",
  description:
    "Karmo set foam for furniture and upholstery — Poly, 280, 480, 2001, HD, 4G, 1965 and Signature. No filler used. Made in Bangladesh since 1965.",
};

export default function FoamFurnitureRoute() {
  return <DivisionPage data={foamFurniture} />;
}
