import HeroAnantaThree from "@/components/karmo/home3/HeroAnantaThree/HeroAnantaThree";
import KarmoStandardThree from "@/components/karmo/home3/KarmoStandardThree/KarmoStandardThree";
import DivisionsShowcaseThree from "@/components/karmo/home3/DivisionsShowcaseThree/DivisionsShowcaseThree";
import CollectionsCarouselThree from "@/components/karmo/home3/CollectionsCarouselThree/CollectionsCarouselThree";
import GalleryShowcaseThree from "@/components/karmo/home3/GalleryShowcaseThree/GalleryShowcaseThree";
import ShoppableSceneThree from "@/components/karmo/home3/ShoppableSceneThree/ShoppableSceneThree";
import FoamStoryThree from "@/components/karmo/home3/FoamStoryThree/FoamStoryThree";
import PopularProductsThree from "@/components/karmo/home3/PopularProductsThree/PopularProductsThree";
import HeadingThree, { Mark } from "@/components/karmo/home3/HeadingThree/HeadingThree";
import FilmBand from "@/components/karmo/FilmBand";
import Reels from "@/components/karmo/Reels";
import ComparisonThree from "@/components/karmo/home3/ComparisonThree/ComparisonThree";
import TestimonialsThree from "@/components/karmo/home3/TestimonialsThree/TestimonialsThree";
import BentoLookbookThree from "@/components/karmo/home3/BentoLookbookThree/BentoLookbookThree";
import FaqThree from "@/components/karmo/home3/FaqThree/FaqThree";
import ParallaxImageBreakThree from "@/components/karmo/home3/ParallaxImageBreakThree/ParallaxImageBreakThree";
import StoreLocatorThree from "@/components/karmo/home3/StoreLocatorThree/StoreLocatorThree";
import SustainabilityThree from "@/components/karmo/home3/SustainabilityThree/SustainabilityThree";
import Journal from "@/components/karmo/Journal";
import NewsletterThree from "@/components/karmo/home3/NewsletterThree/NewsletterThree";
import FloatingActions from "@/components/karmo/FloatingActions";

export const metadata = {
  title: "Home 03 — Karmo Group",
  description:
    "Third homepage design: multi-panel hero inspired by ANANTA, four divisions, shoppable living rooms, and popular product showcase.",
};

export default function HomeThree() {
  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif]">
      <HeroAnantaThree />

      <KarmoStandardThree />

      <DivisionsShowcaseThree />

      <PopularProductsThree />

      <CollectionsCarouselThree />

      <ShoppableSceneThree />

      <ComparisonThree />

      <FoamStoryThree />

      <BentoLookbookThree />

      <GalleryShowcaseThree />

      <TestimonialsThree />

      <FilmBand />

      <Reels
        heading={
          <HeadingThree
            index="03"
            eyebrow="On screen"
            title={["An Experience Of", <Mark key="a">A Lifetime</Mark>]}
          />
        }
      />

      <SustainabilityThree />

      <ParallaxImageBreakThree />

      <StoreLocatorThree />


      <Journal
        heading={
          <HeadingThree
            index="06"
            eyebrow="Journal"
            title={["Home", <Mark key="a">Begins Here</Mark>]}
          />
        }
      />

      <FaqThree />

      <NewsletterThree />

      <FloatingActions />
    </div>
  );
}
