import DivisionPage from "@/components/karmo/division/DivisionPage";
import mattress from "@/data/divisions/mattress";

export const metadata = {
  title: "Mattress — Karmo Group",
  description:
    "Karmo Mattresses — orthopedic, imperial, pocket & bonnell spring, natural coir and economy foam. Doctor-recommended, made in Bangladesh since 1965.",
};

/**
 * `/mattress` — the Mattress division catalogue, the client's ideal page.
 * Renders the shared `DivisionPage` template with the mattress data.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function MattressRoute() {
  return <DivisionPage data={mattress} />;
}
