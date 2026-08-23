import DivisionPage from "@/components/karmo/division/DivisionPage";
import foam from "@/data/divisions/foam";

export const metadata = {
  title: "Foam — Karmo Group",
  description:
    "Karmo Foam for furniture, footwear, automotive and specialty grades. Pure rubber grade foam, made in Bangladesh since 1965.",
};

/**
 * `/foam` — the Foam division catalogue.
 * Renders the shared `DivisionPage` template with the foam data.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function FoamRoute() {
  return <DivisionPage data={foam} />;
}
