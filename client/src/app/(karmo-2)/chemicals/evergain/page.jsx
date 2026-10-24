import ChemicalBanner from "@/components/karmo/division/ChemicalBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";

export const metadata = {
  title: "Evergain Chemical — Karmo Chemicals",
  description:
    "Evergain chemical range — neoprene and PU shoe adhesives, primers, hardeners, cleaners and specialty glues for footwear and manufacturing.",
};

/** `/chemicals/evergain` — the banner and the site-wide trust icons for now; the rest comes later. */
export default function ChemicalsEvergainRoute() {
  return (
    <>
      <ChemicalBanner
        src="/pages/chemicals/hdfdk.png"
        alt="Evergain PVC adhesive tin with pipes and panels"
        line1="Evergain"
        line2="chemical"
        body="Shoe adhesives, primers, hardeners, cleaners and specialty glues for footwear and manufacturing."
        items={["Neoprene 407", "PU A10", "Primer", "Hardener", "Cleaner", "Sealant"]}
        position="object-center"
      />
      <StandardStrip />
    </>
  );
}
