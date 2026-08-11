import FoamPage from "@/components/karmo/foam/FoamPage";

export const metadata = {
  title: "Foam — Karmo Group",
  description:
    "Karmo Foam for furniture, footwear, automotive and specialty grades. Pure rubber grade foam, made in Bangladesh since 1965.",
};

/**
 * `/foam` — the Foam division catalogue.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function FoamRoute() {
  return <FoamPage />;
}
