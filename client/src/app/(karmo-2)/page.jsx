import PromoTrio from "@/components/karmo/home-two/PromoTrio";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import Partners from "@/components/karmo/home2/Partners";
import DivisionsStrip from "@/components/karmo/home-two/DivisionsStrip";
import Reels from "@/components/karmo/home-two/Reels";
import FoamPromise from "@/components/karmo/home2/FoamPromise";
import ExploreSplit from "@/components/karmo/home-two/ExploreSplit";
import DivisionEditorials from "@/components/karmo/home-two/DivisionEditorials";
import StandardStrip from "@/components/karmo/home-two/StandardStrip";
import HeroTwo from "@/components/karmo/home-two/HeroTwo";
import { pageMetadata, SITE_TITLE, SITE_DESCRIPTION } from "@/config/site";

export const metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

/**
 * The homepage — Home Two promoted to `/`.
 *
 * The previous live design is kept at `/home-two` for reference.
 */
export default function HomePage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionEditorials />
      <ExploreSplit />

      <DivisionsStrip />

      <PromoTrio />
      <FoamPromise filmMode="fixed" />

      <Reels />
      <Partners />
      <CertifiedBy />

      <OrderAndContact />
    </>
  );
}
