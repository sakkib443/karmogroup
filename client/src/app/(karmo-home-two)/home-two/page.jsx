import PromoTrio from "@/components/karmo/home-two/PromoTrio";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import Partners from "@/components/karmo/home2/Partners";
import InstagramShop from "@/components/karmo/home2/InstagramShop";
import DivisionsStrip from "@/components/karmo/home-two/DivisionsStrip";
import Reels from "@/components/karmo/Reels";
import PopularProductsGrid from "@/components/karmo/home2/PopularProductsGrid";
import FoamPromise from "@/components/karmo/home2/FoamPromise";
import ExploreSplit from "@/components/karmo/home-two/ExploreSplit";
import DivisionEditorials from "@/components/karmo/home-two/DivisionEditorials";
import StandardStrip from "@/components/karmo/home-two/StandardStrip";
import HeroTwo from "@/components/karmo/home2/HeroTwo";

export const metadata = {
  title: "Home Two — Karmo Group",
  description: "A second theme for the Karmo homepage, under review.",
};

/**
 * Home Two — a second theme for the finished homepage.
 *
 * The page it is being drawn against is the one now serving `/`. This starts
 * as that page's running order with the new header above it, and each section
 * is redesigned in turn: when one is done it moves from `karmo/home2/` to
 * `karmo/home-two/` and the import below changes to point at it.
 *
 * Until a section has been redesigned it renders Home One's component
 * unchanged. Those imports are read-only on purpose — `/` is live and finished,
 * so nothing under `karmo/home2/` may be edited to serve this page. A section
 * that needs to differ gets its own copy in `karmo/home-two/` instead.
 *
 * Three sections that Home One hides behind `SHOW_*` flags are rendered here:
 * the collections band, the campaign bento and the Instagram wall. They are in
 * the slots that page's flags would put them in, so the running order is the
 * one it was designed around rather than three sections appended at the end.
 * `/` still hides all three; nothing about it changed to show them here.
 *
 * Redesigned so far: the header (in this group's layout, not here), the
 * trust strip under the hero, the third section (division editorials), and
 * the dual explore split after it.
 */
export default function HomeTwoPage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionEditorials />
      <ExploreSplit />

      {/* Home One's four-division strip — above “Karmo is everywhere”. */}
      <DivisionsStrip />

      {/* <ShoppableScene /> — “Karmo is everywhere”; hidden for now */}

      <FoamPromise filmMode="fixed" />
      <PromoTrio />

      <PopularProductsGrid />
      <Reels />
      <Partners />
      <CertifiedBy />

      {/* Instagram feed wall — left copy + masonry shots, before the order and
          contact close. Links out to @karmogroup. */}
      <InstagramShop />

      <OrderAndContact />
    </>
  );
}
