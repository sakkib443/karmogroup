import ChemicalBanner from "@/components/karmo/division/ChemicalBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";

export const metadata = {
  title: "Karmo Adhesive — Karmo Chemicals",
  description:
    "Karmo Adhesive range — Super, Light, Rubber Solution, PU and Bond. Industrial-strength bonding, fast cure, quality-certified batches.",
};

/** `/chemicals/karmo-adhesive` — the banner and the site-wide trust icons for now; the rest comes later. */
export default function ChemicalsKarmoAdhesiveRoute() {
  return (
    <>
      <ChemicalBanner
        src="/pages/chemicals/dds.png"
        alt="Karmo Light Adhesive and Ocean tins beside sneakers and foam"
        line1="Karmo"
        line2="adhesive"
        body="Industrial-strength bonding with a fast cure, from quality-checked batches."
        items={["Karmo Super", "Karmo Light", "Rubber Solution", "Karmo PU", "Karmo Bond"]}
        position="object-right"
      />
      <StandardStrip />
    </>
  );
}
