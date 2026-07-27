import Hero from "@/components/Home2/Hero";
import Categories from "@/components/Home2/Categories";
import Offers from "@/components/Home2/Offers";
import Products from "@/components/Home2/Products";
import VideoFeature from "@/components/Home2/VideoFeature";
import Spotlight from "@/components/Home2/Spotlight";
import Gallery from "@/components/Home2/Gallery";
import Heritage from "@/components/Home2/Heritage";
import Stories from "@/components/Home2/Stories";
import Journal from "@/components/Home2/Journal";

export const metadata = {
  title: "Karmo Group — Comfort, engineered since 1965",
  description:
    "The Karmo retail homepage: foam, mattresses, HomeTex bedding and polymers, with seasonal offers, best sellers and the full product catalogue.",
};

/**
 * Home 02 — the retail treatment.
 *
 * Section order, spacing and component anatomy follow the reference design
 * exactly; the words, prices and products are Karmo's. Two dark bands — the
 * film and the countdown — punctuate an otherwise paper-and-cream page, which
 * is what keeps thirteen sections from reading as one long scroll.
 */
export default function Home2Page() {
  return (
    <>
      <Hero />
      <Categories />
      <Offers />
      <Products />
      <VideoFeature />
      {/* Straight after the film: the film shows the mattress being made, this
          shows what it is made of. */}
      <Spotlight />
      <Gallery />
      <Heritage />
      <Stories />
      <Journal />
    </>
  );
}
