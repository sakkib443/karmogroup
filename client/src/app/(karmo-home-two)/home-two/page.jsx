import HeroTwo from "@/components/karmo/home2/HeroTwo";
import StandardStrip from "@/components/karmo/home2/StandardStrip";
import CollectionsShowcase from "@/components/karmo/home2/CollectionsShowcase";
import DivisionsStrip from "@/components/karmo/home2/DivisionsStrip";
import ShoppableScene from "@/components/karmo/home2/ShoppableScene";
import FoamStory from "@/components/karmo/home2/FoamStory";
import KarmoGallery from "@/components/karmo/home2/KarmoGallery";
import PopularProductsGrid from "@/components/karmo/home2/PopularProductsGrid";
import FoamPromise from "@/components/karmo/home2/FoamPromise";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import Partners from "@/components/karmo/home2/Partners";
import InstagramShop from "@/components/karmo/home2/InstagramShop";
import Reels from "@/components/karmo/Reels";

export const metadata = {
  title: "Home One (archive) — Karmo Group",
  description: "Previous live homepage, kept for reference.",
};

/**
 * Previous live homepage — archived at `/home-two` after Home Two took `/`.
 */
const SHOW_COLLECTIONS_SHOWCASE = false;
const SHOW_KARMO_GALLERY = false;
const SHOW_INSTAGRAM_SHOP = false;

export default function HomeOneArchivePage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionsStrip />
      {SHOW_COLLECTIONS_SHOWCASE ? <CollectionsShowcase /> : null}
      <ShoppableScene />
      <FoamStory />
      {SHOW_KARMO_GALLERY ? <KarmoGallery /> : null}
      <FoamPromise filmMode="fixed" />
      <PopularProductsGrid />
      <Reels />
      <Partners />
      <CertifiedBy />
      {SHOW_INSTAGRAM_SHOP ? <InstagramShop /> : null}
      <OrderAndContact />
    </>
  );
}
