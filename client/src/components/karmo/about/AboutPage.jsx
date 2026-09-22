import AboutBanner from "@/components/karmo/about/AboutBanner";
import AboutFigures from "@/components/karmo/about/AboutFigures";
import AboutStory from "@/components/karmo/about/AboutStory";
import ChairmanMessage from "@/components/karmo/about/ChairmanMessage";
import AboutDivisions from "@/components/karmo/about/AboutDivisions";
import AboutStrength from "@/components/karmo/about/AboutStrength";
import AboutFacilities from "@/components/karmo/about/AboutFacilities";
import AboutReach from "@/components/karmo/about/AboutReach";
import AboutPartners from "@/components/karmo/about/AboutPartners";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * `/about` — the company page, written from the client's 31-page profile.
 *
 * CertifiedBy is mounted from the karmo-2 layout (always above the footer).
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
      <AboutPartners />
      <OrderAndContact />
    </>
  );
}
