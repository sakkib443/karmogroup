import Hero from "@/components/Home/Hero";
import Capabilities from "@/components/Home/Capabilities";
import DivisionStack from "@/components/Home/DivisionStack";
import PopularProducts from "@/components/Home/PopularProducts";
import Spotlights from "@/components/Home/Spotlights";
import WhyKarmo from "@/components/Home/WhyKarmo";
import Gallery from "@/components/Home/Gallery";
import Reels from "@/components/Home/Reels";
import Journal from "@/components/Home/Journal";
import FloatingActions from "@/components/Home/FloatingActions";
import SectionHeading, { Accent } from "@/components/Home/SectionHeading";

/**
 * Home 01 — the organized homepage, promoted here from /home-3 on 25 July 2026
 * at the client's request. The editorial treatment it replaced was kept at
 * /home-3 for a while; that route and its Home3 components were removed on
 * 27 July 2026, so this is now the only version of the organized page.
 *
 * Every section runs through the same numbered SectionHeading — one index, one
 * eyebrow style, one type scale — instead of the nine slightly different
 * headers the page grew over time. The section bodies (cards, carousels, the
 * screening room, the journal rail) are the shared components, driven by their
 * `heading` prop.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Capabilities
        heading={
          <SectionHeading
            index="01"
            eyebrow="Who we are"
            title={["Built On Six Decades", <Accent key="a">Of Making Comfort</Accent>]}
            lead="Karmo has manufactured in Bangladesh since 1965. From the foam inside a sofa to the mattress on the bed and the adhesive holding it together, it is made in our own plants — and held to one standard."
          />
        }
      />

      <PopularProducts
        heading={
          <SectionHeading
            index="02"
            eyebrow="Popular products"
            title={["What people", <Accent key="a">buy most</Accent>]}
          />
        }
      />

      <DivisionStack
        tone="light"
        heading={
          <SectionHeading
            index="03"
            eyebrow="Four divisions"
            title={["One group, one standard,", <Accent key="a">four things to sell</Accent>]}
          />
        }
      />

      {/* No section heading: the row carries its own tag and headline, and a
          numbered header above a single row just repeated it. */}
      <Spotlights />

      <WhyKarmo
        heading={
          <SectionHeading
            index="04"
            eyebrow="Started in 1965"
            tone="dark"
            title={[
              "Where comfort begins,",
              <span key="a">
                And <Accent>quality lives on</Accent>
              </span>,
            ]}
          />
        }
      />

      <Gallery
        heading={
          <SectionHeading
            index="05"
            eyebrow="Gallery"
            title={["The group", <Accent key="a">at work</Accent>]}
          />
        }
      />

      <Reels
        heading={
          <SectionHeading
            index="06"
            eyebrow="Karmo on screen"
            title={["See what", <Accent key="a">comfort is made of</Accent>]}
          />
        }
      />

      <Journal
        heading={
          <SectionHeading
            index="07"
            eyebrow="Our blog"
            title={["Follow the", <Accent key="a">latest news</Accent>]}
          />
        }
      />

      <FloatingActions />
    </>
  );
}
