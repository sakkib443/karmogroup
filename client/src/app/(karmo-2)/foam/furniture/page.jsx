import CmsDivisionPage from "@/components/karmo/division/CmsDivisionPage";
import { CmsScope } from "@/cms/CmsProvider";
import { getPageContent } from "@/cms/server";

export const metadata = {
  title: "Furniture & Upholstery Foam — Karmo Group",
  description:
    "Karmo set foam for furniture and upholstery — Poly, 280, 2001, HD, 4G, 1965, Signature, Sit and Back. No filler used. Made in Bangladesh since 1965.",
};

/** Pictures and films: Admin → Site content → Foam — Furniture (see src/cms/pages/foamFurniture.js). */
export default async function FoamFurnitureRoute() {
  const content = await getPageContent("foam-furniture");
  return (
    <CmsScope page="foam-furniture" content={content}>
      <CmsDivisionPage page="foam-furniture" />
    </CmsScope>
  );
}
