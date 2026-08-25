import PromoTrio from "@/components/karmo/home/PromoTrio";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import Partners from "@/components/karmo/home/Partners";
import PartnerPromoBand from "@/components/karmo/home/PartnerPromoBand";
import DivisionsStrip from "@/components/karmo/home/DivisionsStrip";
import Reels from "@/components/karmo/home/Reels";
import ShopByMaterial from "@/components/karmo/home/ShopByMaterial";
import LivingLookbook from "@/components/karmo/home/LivingLookbook";
import FoamPromise from "@/components/karmo/home/FoamPromise";
import ExploreSplit from "@/components/karmo/home/ExploreSplit";
import DivisionEditorials from "@/components/karmo/home/DivisionEditorials";
import ChemicalsBand from "@/components/karmo/home/ChemicalsBand";
import StandardStrip from "@/components/karmo/home/StandardStrip";
import Hero from "@/components/karmo/home/Hero";
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
      <Hero />
      <StandardStrip />
      <DivisionEditorials />
      <ChemicalsBand />
      <ExploreSplit />

      <DivisionsStrip />

      {/* Sits after the divisions strip because that is where the page stops
          introducing the company and starts selling a product. */}
      <ShopByMaterial />

      <PromoTrio />
      <FoamPromise filmMode="fixed" />

      <Reels />
      <LivingLookbook />
      <Partners />

      <PartnerPromoBand />
      <OrderAndContact />
    </>
  );
}
