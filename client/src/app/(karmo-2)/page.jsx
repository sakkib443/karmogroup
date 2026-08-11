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
import { pageMetadata, SITE_TITLE, SITE_DESCRIPTION } from "@/config/site";

export const metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

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

/* Campaign bento (KarmoGallery) — hidden for now at the client's request, to be
   settled later. The component and its four pictures are untouched; flip to
   `true` to bring it back. */
const SHOW_KARMO_GALLERY = false;

/* Instagram Shop — hidden for now; flip to `true` to bring it back. */
const SHOW_INSTAGRAM_SHOP = false;

export default function HomePage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionsStrip />
      {SHOW_COLLECTIONS_SHOWCASE ? <CollectionsShowcase /> : null}
      <ShoppableScene />
      <FoamStory />

      {/* The client's `album-wrapper` section rebuilt as a bento. It sits here
          because it is pictures with almost no words, between the foam story
          and the dark film section — both of which are dense with copy. */}
      {SHOW_KARMO_GALLERY ? <KarmoGallery /> : null}

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

      {/* Who actually buys the foam. It sat below the certification band until
          the client moved it up, and the new order argues the better way round:
          the market vouches first, then the certificates back that up with
          paperwork. It also puts the white logo strip between two dark bands
          rather than leaving two of them adjacent.

          The logos are cut from the client's own "PARTNERS & CLIENTS" sheet —
          see the component for the two caption/logo mismatches on that artwork
          that they still need to settle. */}
      <Partners />

      {/* Matches the client's live "Certified By" band — room photo, dark wash,
          centred type with the orange leaf rule, three framed certificates. */}
      <CertifiedBy />

      {/* Instagram feed wall — left copy + masonry shots, before the order /
          contact close. Links out to @karmogroup. Hidden for now. */}
      {SHOW_INSTAGRAM_SHOP ? <InstagramShop /> : null}

      {/* Last band before the footer — order path + contact. */}
      <OrderAndContact />
    </>
  );
}
