import Progress from "@/components/Home2/Progress";
import Opening from "@/components/Home2/Opening";
import Ticker from "@/components/Home2/Ticker";
import Showcase from "@/components/Home2/Showcase";
import DivisionStack from "@/components/Home/DivisionStack";
import Range from "@/components/Home2/Range";
import Closing from "@/components/Home2/Closing";

export const metadata = {
  title: "Karmo Group — Comfort, engineered since 1965",
  description:
    "A second homepage treatment for Karmo Group: dark, scroll-driven and photographic, across foam, mattress, HomeTex and chemicals.",
};

/**
 * Home 02 — the cinematic treatment.
 *
 * Home 01 is editorial: light panels, masked line reveals, sections that sit
 * still and let the copy lead. This one is the opposite argument — one dark
 * surface the whole way down, and motion driven by the scroll position rather
 * than by entering the viewport. Both are reachable from the Home dropdown so
 * the client can put them side by side.
 */
export default function Home2Page() {
  return (
    <>
      <Progress />
      <Opening />
      <Ticker />
      <Showcase />
      <DivisionStack />
      <Range />
      <Closing />
    </>
  );
}
