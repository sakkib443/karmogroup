import HeroTwo from "@/components/karmo/home2/HeroTwo";
import StandardStrip from "@/components/karmo/home2/StandardStrip";
import CollectionsShowcase from "@/components/karmo/home2/CollectionsShowcase";
import DivisionsStrip from "@/components/karmo/home2/DivisionsStrip";
import ShoppableScene from "@/components/karmo/home2/ShoppableScene";
import FoamStory from "@/components/karmo/home2/FoamStory";
import PopularProductsGrid from "@/components/karmo/home2/PopularProductsGrid";
import PopularProductsOffers from "@/components/karmo/home2/PopularProductsOffers";

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
export default function HomePage() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionsStrip />
      <CollectionsShowcase />
      <ShoppableScene />
      <FoamStory />

      {/* ── Popular Products: two designs, up at once to be chosen between ──
          The client sent two references and asked for both built rather than
          one recommended. They sit at the foot of the page so the sections
          above keep the order they were signed off in, and one after the other
          rather than side by side — a four-up product row squeezed into half a
          window is not the design being judged.

          Deleting the loser is three things: its `<Marker>` and section here,
          its import above, and its file. Then drop the marker component too. */}
      <Marker>Option A — the quiet grid</Marker>
      <PopularProductsGrid />

      <Marker>Option B — the offer row</Marker>
      <PopularProductsOffers />
    </>
  );
}

/**
 * A scaffolding label, and it is meant to look like one. Brand red on ink so it
 * cannot be mistaken for part of either design, and it goes when the choice
 * does.
 */
function Marker({ children }) {
  return (
    <div className="bg-shade-deep py-2.5 text-center">
      <span className="display text-[11px] font-bold uppercase tracking-[0.24em] text-white">
        {children}
      </span>
    </div>
  );
}
