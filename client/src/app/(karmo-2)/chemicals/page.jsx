import DivisionPage from "@/components/karmo/division/DivisionPage";
import chemicals from "@/data/divisions/chemicals";

export const metadata = {
  title: "Chemicals — Karmo Group",
  description:
    "Karmo Chemicals — industrial-strength adhesives, resins, sealants and specialty formulations. Fast-curing, quality-certified, made in Bangladesh since 1965.",
};

/**
 * `/chemicals` — the Chemicals (Adhesives) division catalogue.
 * Renders the shared `DivisionPage` template with the chemicals data.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function ChemicalsRoute() {
  return <DivisionPage data={chemicals} />;
}
