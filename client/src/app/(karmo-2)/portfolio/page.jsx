import PortfolioPage from "@/components/karmo/portfolio/PortfolioPage";

export const metadata = {
  title: "Portfolio — Karmo Group",
  description:
    "Foam, mattress, HomeTex and chemicals — a look at what Karmo makes, manufactured in Bangladesh since 1965.",
  alternates: { canonical: "/portfolio" },
};

/**
 * `/portfolio` — lives in (karmo-2) so it inherits HeaderTwo and the Karmo
 * footer, the same way `/about` and `/foam` do.
 */
export default function PortfolioRoute() {
  return <PortfolioPage />;
}
