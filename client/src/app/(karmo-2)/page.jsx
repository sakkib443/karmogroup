import PromoTrio from "@/components/karmo/home/PromoTrio";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import Partners from "@/components/karmo/home/Partners";
import PartnerPromoBand from "@/components/karmo/home/PartnerPromoBand";
import DivisionsStrip from "@/components/karmo/home/DivisionsStrip";
import Reels from "@/components/karmo/home/Reels";
import ShopByMaterial from "@/components/karmo/home/ShopByMaterial";
import ShopBySize from "@/components/karmo/home/ShopBySize";
import ShoeSole from "@/components/karmo/home/ShoeSole";
import { HomePromise } from "@/components/karmo/home/FoamPromise";
import ExploreSplit from "@/components/karmo/home/ExploreSplit";
import DivisionEditorials from "@/components/karmo/home/DivisionEditorials";
import ChemicalsBand from "@/components/karmo/home/ChemicalsBand";
import StandardStrip from "@/components/karmo/home/StandardStrip";
import Hero from "@/components/karmo/home/Hero";
import { CmsScope } from "@/cms/CmsProvider";
import { getPageContent, CmsAnchor } from "@/cms/server";
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
 *
 * Every section's text, pictures and overlays come from Admin → Site content → Home
 * (src/cms/pages/home.js holds the designed defaults). <CmsAnchor> marks where each
 * section starts, so the editor's preview can scroll to it.
 */
export default async function HomePage() {
  const content = await getPageContent("home");

  return (
    <CmsScope page="home" content={content}>
      <CmsAnchor section="hero" />
      <Hero />
      <StandardStrip />
      <CmsAnchor section="editorials" />
      <DivisionEditorials />
      <CmsAnchor section="chemicals" />
      <ChemicalsBand />
      <CmsAnchor section="explore" />
      <ExploreSplit cmsKey="explore" />
      <CmsAnchor section="divisions" />
      <DivisionsStrip />

      {/* Sits after the divisions strip because that is where the page stops
          introducing the company and starts selling a product. */}
      <CmsAnchor section="materials" />
      <ShopByMaterial />

      <CmsAnchor section="promo" />
      <PromoTrio />
      <CmsAnchor section="sizes" />
      <ShopBySize />
      <CmsAnchor section="promise" />
      <HomePromise />

      <CmsAnchor section="reels" />
      <Reels />
      <CmsAnchor section="footwear" />
      <ShoeSole />
      <CmsAnchor section="partners" />
      <Partners />

      <CmsAnchor section="promoBand" />
      <PartnerPromoBand />
      <OrderAndContact textureSlides />
    </CmsScope>
  );
}
