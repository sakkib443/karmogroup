import Hero from "@/components/Home/Hero";
import Capabilities from "@/components/Home/Capabilities";
import About from "@/components/Home/About";
import Divisions from "@/components/Home/Divisions";
import Spotlights from "@/components/Home/Spotlights";
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
      <About />
      <Divisions />
      <Spotlights />
      <WhyKarmo />
      <Gallery />
      <Clients />
      <Reels />
      <Journal />
    </>
  );
}
