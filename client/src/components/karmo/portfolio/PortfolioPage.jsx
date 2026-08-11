import PortfolioBanner from "@/components/karmo/portfolio/PortfolioBanner";
import PortfolioGallery from "@/components/karmo/portfolio/PortfolioGallery";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * `/portfolio` — the work itself: a filterable gallery of the four divisions'
 * own photography, closing on the same certification and order/contact bands
 * every other Home 02 page ends on.
 */
export default function PortfolioPage() {
  return (
    <>
      <PortfolioBanner />
      <PortfolioGallery />
      <CertifiedBy />
      <OrderAndContact />
    </>
  );
}
