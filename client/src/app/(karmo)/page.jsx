import Hero from "@/components/karmo/Hero";
import DivisionPanels from "@/components/karmo/DivisionPanels";
import Capabilities from "@/components/karmo/Capabilities";
import Collections from "@/components/karmo/Collections";
import FilmBand from "@/components/karmo/FilmBand";
import Spotlights from "@/components/karmo/Spotlights";
import WhyKarmo from "@/components/karmo/WhyKarmo";
import Reels from "@/components/karmo/Reels";
import Journal from "@/components/karmo/Journal";
import FloatingActions from "@/components/karmo/FloatingActions";
import SectionHeading, { Accent } from "@/components/karmo/SectionHeading";

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

      {/* The trust strip sits straight under the hero, where a retail page
          usually puts it — six reasons to stay, read in a glance on the way
          down. It carries no section heading on purpose: a numbered header
          this high would be a second headline competing with the hero, and
          the strip is meant to be scanned, not read. Outside the numbered run
          for the same reason as DivisionPanels and Spotlights. */}
      <Capabilities />

      {/* Full-bleed, one screen tall — what the group makes before the page
          starts explaining it. Also outside the numbered run, so 01–04 below
          stay in sequence. It replaced the old numbered divisions deck, which
          said the same thing a second time further down the page. */}
      <DivisionPanels />

      {/* Three ways into the catalogue rather than six products with prices on
          them. "Popular products" is one of the three now, so the heading has
          to sit above all of them instead of naming one. */}
      <Collections
        heading={
          <SectionHeading
            index="01"
            eyebrow="Shop"
            title={["Three ways", <Accent key="a">to start</Accent>]}
          />
        }
      />

      {/* Brought over from Home 02, straight off the product grid. Outside the
          numbered run like the other full-bleed bands — it carries its own
          centred label and headline, so a numbered header above it would be a
          second heading for one picture. */}
      <FilmBand />

      {/* No section heading: the row carries its own tag and headline, and a
          numbered header above a single row just repeated it. */}
      <Spotlights />

      <WhyKarmo
        heading={
          <SectionHeading
            index="02"
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

      <Reels
        heading={
          <SectionHeading
            index="03"
            eyebrow="Karmo on screen"
            title={["See what", <Accent key="a">comfort is made of</Accent>]}
          />
        }
      />

      <Journal
        heading={
          <SectionHeading
            index="04"
            eyebrow="Our blog"
            title={["Follow the", <Accent key="a">latest news</Accent>]}
          />
        }
      />

      <FloatingActions />
    </>
  );
}
