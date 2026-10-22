import AboutBanner from "@/components/karmo/about/AboutBanner";
import StandardStrip from "@/components/karmo/home/StandardStrip";
import AboutStory from "@/components/karmo/about/AboutStory";
import ChairmanMessage from "@/components/karmo/about/ChairmanMessage";
import AboutStrength from "@/components/karmo/about/AboutStrength";
import AboutFacilities from "@/components/karmo/about/AboutFacilities";
import AboutReach from "@/components/karmo/about/AboutReach";
import Partners from "@/components/karmo/home/Partners";
import OrderAndContact from "@/components/karmo/about/OrderAndContactClassic";
import { CmsScope } from "@/cms/CmsProvider";

/**
 * `/about` — the company page, from the client's 31-page company profile.
 * Pictures first: on a computer every band from the journey down to the dealer
 * map is one screen tall under the 112px header, like the homepage sections.
 * The header's About Us rows jump to #history, #board, #achievements and
 * #partners.
 *
 * CertifiedBy is mounted from the karmo-2 layout (always above the footer).
 */
export default function AboutPage({ homeContent }) {
  return (
    <>
      <AboutBanner />
      {/* The same trust icons as the homepage and division pages (Admin → Trust strip). */}
      <StandardStrip />
      <AboutStory />
      <ChairmanMessage />
      <AboutStrength />
      <AboutFacilities />
      <AboutReach />
      {/* The homepage's partners & clients logos (Admin → Home), here on plain
          white — the texture moves to the contact band below. The section
          carries id="partners" itself. */}
      <CmsScope page="home" content={homeContent}>
        <Partners texture={false} />
      </CmsScope>
      <OrderAndContact texture />
    </>
  );
}
