import ChemicalBanner from "@/components/karmo/division/ChemicalBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";

export const metadata = {
  title: "Sodium Silicate — Karmo Chemicals",
  description:
    "Karmo sodium silicate — industrial-grade water glass for adhesives, binders and specialty applications.",
};

/** `/chemicals/sodium-silicate` — the banner and the site-wide trust icons for now; the rest comes later. */
export default function ChemicalsSodiumSilicateRoute() {
  return (
    <>
      <ChemicalBanner
        src="/pages/home/hero/home-hero-slide-chemicals-hero-hq.webp"
        alt="A long aisle of blue chemical drums"
        line1="Sodium"
        line2="silicate"
        body="Industrial-grade water glass for adhesives, binders and specialty applications."
        items={["Water glass", "Bulk supply"]}
        position="object-center"
      />
      <StandardStrip />
    </>
  );
}
