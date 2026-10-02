import ChemicalMosaicWireframe from "@/components/karmo/division/ChemicalMosaicWireframe";

export const metadata = {
  title: "Specialized Chemicals & Additives — Karmo Chemicals",
  description:
    "Karmo specialized chemicals and additives — silicone, SO, PS and pigments engineered for consistent, tested performance.",
};

/** `/chemicals/specialized` — built to the same shapes/gaps as `/foam/footwear` (wireframe).
 *  Section counts only: 4 products (Silicone, SO, PS, Pigment), matching the
 *  Navbar's sub-rows — everything each section says is placeholder text. */
export default function ChemicalsSpecializedRoute() {
  return <ChemicalMosaicWireframe featureCount={6} recommendedCount={3} productCount={4} />;
}
