import AboutBanner from "@/components/karmo/about/AboutBanner";
import AboutFigures from "@/components/karmo/about/AboutFigures";
import AboutStory from "@/components/karmo/about/AboutStory";
import ChairmanMessage from "@/components/karmo/about/ChairmanMessage";
import AboutDivisions from "@/components/karmo/about/AboutDivisions";
import AboutStrength from "@/components/karmo/about/AboutStrength";
import AboutFacilities from "@/components/karmo/about/AboutFacilities";
import AboutReach from "@/components/karmo/about/AboutReach";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * `/about` — the company page, written from the client's 31-page profile.
 *
 * The running order follows the profile's own: who Karmo is, the chairman's
 * word, the four industries, the strength behind them, where it is all made,
 * how far it reaches, and what it is certified against. `CertifiedBy` and
 * `OrderAndContact` are the homepage's own bands, reused rather than restyled,
 * so the page closes exactly like the homepage and the foam page do.
 *
 * One dark band only — the chairman's message — sitting between two white
 * sections, with `CertifiedBy`'s photograph as the second. Any more and the
 * page starts striping.
 */
export default function AboutPage() {
  return (
    <>
      <AboutBanner />
      <AboutFigures />
      <AboutStory />
      <ChairmanMessage />
      <AboutDivisions />
      <AboutStrength />
      <AboutFacilities />
      <AboutReach />
      <CertifiedBy />
      <OrderAndContact />
    </>
  );
}
