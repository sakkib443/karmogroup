import MattressPage from "@/components/karmo/mattress/MattressPage";

export const metadata = {
  title: "Mattress — Karmo Group",
  description:
    "Karmo Mattresses — orthopedic, imperial, pocket & bonnell spring, natural coir and economy foam. Doctor-recommended, made in Bangladesh since 1965.",
};

/**
 * `/mattress` — the Mattress division catalogue.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function MattressRoute() {
  return <MattressPage />;
}
