import HeroTwo from "@/components/karmo/home2/HeroTwo";
import StandardStrip from "@/components/karmo/home2/StandardStrip";
import CollectionsShowcase from "@/components/karmo/home2/CollectionsShowcase";
import DivisionsStrip from "@/components/karmo/home2/DivisionsStrip";
import ShoppableScene from "@/components/karmo/home2/ShoppableScene";
import FoamStory from "@/components/karmo/home2/FoamStory";
import PopularProductsGrid from "@/components/karmo/home2/PopularProductsGrid";
import FoamPromise from "@/components/karmo/home2/FoamPromise";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import Reels from "@/components/karmo/Reels";

export const metadata = {
  title: "Karmo Group — Foam, HomeTex, Mattress and Chemicals since 1965",
  description:
    "Bangladesh's number one home brand. Foam, bedding, mattresses and industrial chemicals, made in Bangladesh since 1965.",
};

/**
 * The homepage.
 *
 * This is the design that was built at /home-2, promoted to `/` on 5 August
 * 2026 at the client's request; the design that was here went the other way
 * and is now at /home-2. Nothing about either had to change to do it — each
 * lives in its own route group with its own layout, so swapping which segment
 * each sits in carried its header, its padding and its chrome along with it.
 *
 * It has its own hero rather than reusing the other design's. That one is
 * drawn to sit *under* a floating transparent bar and cancels the layout's top
 * padding with a negative margin to do it; this header is opaque and holds its
 * own space, so the two arrangements cannot both be right.
 */
/* Mid-page Best Selling / Popular / New Arrival band — hidden for now.
   Flip to `true` to bring the three collection cards back. */
const SHOW_COLLECTIONS_SHOWCASE = false;

export default function HomePage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionsStrip />
      {SHOW_COLLECTIONS_SHOWCASE ? <CollectionsShowcase /> : null}
      <ShoppableScene />
      <FoamStory />

      {/* Straight after the foam story, which is what it argues from: that
          section says what the foam is, this one says what it does. It is also
          the only dark section on a white page, so it wants a section either
          side of it rather than sitting against the footer.

          The background is the product film, anchored to the viewport so the
          copy scrolls over a held frame. The client chose this over the
          alternatives (`FILM_MODES` in the component) and asked that it not sit
          dead still — a fully pinned frame read as a photograph behind a hole —
          so it drifts gently along the scroll; see `DRIFT` in the component. */}
      <FoamPromise filmMode="fixed" />

      {/* Two Popular Products designs were built here to be chosen between —
          this quiet grid and an offer row of poster cards. The client picked
          this one, so the other component and the scaffolding labels that
          separated them are gone. The product data stays where it was, in
          `popularProducts`, since it was always shared. */}
      <PopularProductsGrid />

      {/* Film strip — uses its own slim editorial label (not the big centred
          section title), so it does not leave a void under Popular Products. */}
      <Reels />

      {/* Matches the client's live "Certified By" band — room photo, dark wash,
          centred type with the orange leaf rule, three framed certificates. */}
      <CertifiedBy />

      {/* Last band before the footer — order path + contact. */}
      <OrderAndContact />
    </>
  );
}
