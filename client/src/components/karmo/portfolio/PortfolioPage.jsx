import PortfolioBanner from "@/components/karmo/portfolio/PortfolioBanner";
import PortfolioGallery from "@/components/karmo/portfolio/PortfolioGallery";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * `/portfolio` — filterable gallery. CertifiedBy is in the karmo-2 layout
 * (always above the footer).
 */
export default function PortfolioPage() {
  return (
    <>
      <PortfolioBanner />
      <PortfolioGallery />
      <OrderAndContact />
    </>
  );
}
