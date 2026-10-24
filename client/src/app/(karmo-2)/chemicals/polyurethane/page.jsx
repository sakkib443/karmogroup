import ChemicalBanner from "@/components/karmo/division/ChemicalBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";

export const metadata = {
  title: "Polyurethane / Solvent — Karmo Chemicals",
  description:
    "Karmo polyurethane and solvent range — TDI, PPG and copolymer grades for foam and industrial use. Made in Bangladesh since 1965.",
};

/** `/chemicals/polyurethane` — the banner and the site-wide trust icons for now; the rest comes later. */
export default function ChemicalsPolyurethaneRoute() {
  return (
    <>
      <ChemicalBanner
        src="/pages/chemicals/camicels.png"
        alt="Blue chemical drums racked in a Karmo warehouse"
        line1="Polyurethane"
        line2="& solvent"
        body="TDI, PPG and copolymer grades for foam and industrial use — made in Bangladesh since 1965."
        items={["TDI", "PPG", "CoPolymer"]}
        position="object-right"
      />
      <StandardStrip />
    </>
  );
}
