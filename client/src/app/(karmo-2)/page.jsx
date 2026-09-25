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
      <ShopBySize />
      {/* No `film`: the borrowed clip this band used to loop was pulled from
          the repo. `stillFixed` gives the background the same "stays put"
          feel — a plain photo pinned to the viewport instead of a video. */}
      <FoamPromise
        stillFixed
        still="/karmo/images/home-02/promise/foam-promise-bg.jpg"
      />

      <Reels />
      <ShoeSole />
      <Partners />

      <PartnerPromoBand />
      <OrderAndContact />
    </>
  );
}
