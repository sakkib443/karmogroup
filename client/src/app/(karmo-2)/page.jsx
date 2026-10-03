import PromoTrio from "@/components/karmo/home/PromoTrio";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import Partners from "@/components/karmo/home/Partners";
import PartnerPromoBand from "@/components/karmo/home/PartnerPromoBand";
import DivisionsStrip from "@/components/karmo/home/DivisionsStrip";
import Reels from "@/components/karmo/home/Reels";
import ShopByMaterial from "@/components/karmo/home/ShopByMaterial";
import ShopBySize from "@/components/karmo/home/ShopBySize";
import ShoeSole from "@/components/karmo/home/ShoeSole";
import FoamPromise from "@/components/karmo/home/FoamPromise";
import ExploreSplit from "@/components/karmo/home/ExploreSplit";
import DivisionEditorials from "@/components/karmo/home/DivisionEditorials";
import ChemicalsBand from "@/components/karmo/home/ChemicalsBand";
import StandardStrip from "@/components/karmo/home/StandardStrip";
import Hero from "@/components/karmo/home/Hero";
import ReviewSection from "@/components/karmo/review/ReviewSection";
import { pageMetadata, SITE_TITLE, SITE_DESCRIPTION } from "@/config/site";

export const metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/**
 * The homepage — sections live under `components/karmo/home/`.
 * Site chrome (header) is mounted from the layout.
 * CertifiedBy sits in the layout, always above the footer.
 */
export default function HomePage() {
  return (
    <>
      <ReviewSection id="hero">
        <Hero />
      </ReviewSection>
      <ReviewSection id="trust-strip">
        <StandardStrip />
      </ReviewSection>
      <ReviewSection id="division-editorials">
        <DivisionEditorials />
      </ReviewSection>
      <ReviewSection id="chemicals-band">
        <ChemicalsBand />
      </ReviewSection>
      <ReviewSection id="explore-split">
        <ExploreSplit />
      </ReviewSection>

      <ReviewSection id="divisions-strip">
        <DivisionsStrip />
      </ReviewSection>

      {/* Sits after the divisions strip because that is where the page stops
          introducing the company and starts selling a product. */}
      <ReviewSection id="shop-by-material">
        <ShopByMaterial />
      </ReviewSection>

      <ReviewSection id="promo-trio">
        <PromoTrio />
      </ReviewSection>
      <ReviewSection id="shop-by-size">
        <ShopBySize />
      </ReviewSection>
      <ReviewSection id="foam-promise">
        <FoamPromise
          filmMode="parallax"
          film="/karmo/videos/product-film.mp4"
          still="/karmo/images/home-02/promise/foam-promise-bg.webp"
          scrim="bg-black/55"
        />
      </ReviewSection>

      <ReviewSection id="reels">
        <Reels />
      </ReviewSection>
      <ReviewSection id="shoe-sole">
        <ShoeSole />
      </ReviewSection>
      <ReviewSection id="partners">
        <Partners />
      </ReviewSection>

      <ReviewSection id="partner-promo">
        <PartnerPromoBand />
      </ReviewSection>
      <ReviewSection id="order-contact">
        <OrderAndContact textureSlides />
      </ReviewSection>
    </>
  );
}
