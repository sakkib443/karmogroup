import DivisionPage from "@/components/karmo/division/DivisionPage";
import hometex from "@/data/divisions/hometex";

export const metadata = {
  title: "HomeTex — Karmo Group",
  description:
    "Karmo HomeTex — premium cotton bed sheets, comforters, pillows and coordinated bedding. Soft, breathable home comfort, made in Bangladesh since 1965.",
};

/**
 * `/hometex` — the HomeTex division catalogue.
 * Renders the shared `DivisionPage` template with the hometex data.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default function HomeTexRoute() {
  return <DivisionPage data={hometex} />;
}
