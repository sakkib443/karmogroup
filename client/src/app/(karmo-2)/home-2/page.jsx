import HeroTwo from "@/components/karmo/home2/HeroTwo";
import StandardStrip from "@/components/karmo/home2/StandardStrip";
import CollectionsShowcase from "@/components/karmo/home2/CollectionsShowcase";
import DivisionsStrip from "@/components/karmo/home2/DivisionsStrip";
import ShoppableScene from "@/components/karmo/home2/ShoppableScene";

export const metadata = {
  title: "Home 02 — Karmo Group",
  description: "Second homepage design, in progress.",
};

/**
 * Home 02 — the second of three homepage designs.
 *
 * Header and hero are built, with the trust strip and the divisions strip
 * under them. More sections follow — the chrome above is settled, so the
 * argument keeps moving down the page.
 *
 * It has its own hero rather than reusing Home 01's. That one is drawn to sit
 * *under* a floating transparent bar and cancels the layout's top padding with
 * a negative margin to do it; this header is opaque and holds its own space,
 * so the two arrangements cannot both be right.
 */
export default function HomeTwo() {
  return (
    <>
      <HeroTwo />
      <StandardStrip />
      <DivisionsStrip />
      <CollectionsShowcase />
      <ShoppableScene />
    </>
  );
}
