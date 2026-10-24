import ChemicalBanner from "@/components/karmo/division/ChemicalBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";

export const metadata = {
  title: "Specialized Chemicals & Additives — Karmo Chemicals",
  description:
    "Karmo specialized chemicals and additives — silicone, SO, PS and pigments engineered for consistent, tested performance.",
};

/** `/chemicals/specialized` — the banner and the site-wide trust icons for now; the rest comes later. */
export default function ChemicalsSpecializedRoute() {
  return (
    <>
      <ChemicalBanner
        src="/pages/chemicals/divisions/chemicals-resin-tins.webp"
        alt="Resin tins, foam and a dish of amber additive"
        line1="Specialized"
        line2="additives"
        body="Silicone, SO, PS and pigments engineered for consistent, tested performance."
        items={["Silicone", "SO", "PS", "Pigment"]}
        position="object-right"
      />
      <StandardStrip />
    </>
  );
}
