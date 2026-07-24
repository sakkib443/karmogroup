import Hero from "@/components/Home/Hero";
import Capabilities from "@/components/Home/Capabilities";
import DivisionStack from "@/components/Home/DivisionStack";
import Spotlights from "@/components/Home/Spotlights";
import BestSellers from "@/components/Home/BestSellers";
import WhyKarmo from "@/components/Home/WhyKarmo";
import Gallery from "@/components/Home/Gallery";
import Clients from "@/components/Home/Clients";
import Reels from "@/components/Home/Reels";
import Journal from "@/components/Home/Journal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <DivisionStack tone="light" />
      <Spotlights />
      <BestSellers />
      <WhyKarmo />
      <Gallery />
      <Clients />
      <Reels />
      <Journal />
    </>
  );
}
