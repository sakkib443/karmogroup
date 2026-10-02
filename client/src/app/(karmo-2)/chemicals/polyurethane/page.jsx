import ChemicalSectionWireframe from "@/components/karmo/division/ChemicalSectionWireframe";

export const metadata = {
  title: "Polyurethane / Solvent — Karmo Chemicals",
  description:
    "Karmo polyurethane and solvent range — TDI, PPG and copolymer grades for foam and industrial use. Made in Bangladesh since 1965.",
};

/* Mirrors the Navbar's "Polyurethane / Solvent" sub-rows (TDI, PPG,
   CoPolymer) — placeholder copy, real grade names/specs come from the
   catalogue once this section leaves wireframe. */
const PRODUCTS = [
  { id: "tdi", name: "TDI", note: "Toluene diisocyanate — foam-grade isocyanate." },
  { id: "ppg", name: "PPG", note: "Polypropylene glycol — polyol base for PU systems." },
  { id: "copolymer", name: "CoPolymer", note: "Copolymer polyol for tuned foam performance." },
];

const FEATURES = [
  { id: "quality", title: "Tested Quality" },
  { id: "bulk", title: "Bulk Supply" },
  { id: "consistent", title: "Consistent Grades" },
  { id: "delivery", title: "Nationwide Delivery" },
];

/** `/chemicals/polyurethane` — Polyurethane / Solvent section page (wireframe). */
export default function ChemicalsPolyurethaneRoute() {
  return (
    <ChemicalSectionWireframe
      eyebrow="Karmo Chemicals"
      heading="Polyurethane / Solvent"
      subline="TDI, PPG and copolymer grades for foam and industrial use — made in Bangladesh since 1965."
      intro={{
        heading: "About Karmo Polyurethane",
        body: "Karmo supplies the raw polyurethane chemistry behind its own foam lines and for industrial buyers — isocyanates, polyols and copolymer grades held to consistent, tested specifications batch after batch.",
      }}
      products={PRODUCTS}
      features={FEATURES}
    />
  );
}
