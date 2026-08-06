import HeroThree from "@/components/karmo/home3/HeroThree";
import ChainRail from "@/components/karmo/home3/ChainRail";
import ProofPanel from "@/components/karmo/home3/ProofPanel";
import Curation from "@/components/karmo/home3/Curation";
import HeadingThree, { Mark } from "@/components/karmo/home3/HeadingThree";

import FilmBand from "@/components/karmo/FilmBand";
import Reels from "@/components/karmo/Reels";
import Journal from "@/components/karmo/Journal";
import FloatingActions from "@/components/karmo/FloatingActions";

export const metadata = {
  title: "Home 03 — Karmo Group",
  description:
    "Third homepage design: the making and the buying on one page — four divisions as one supply chain, then the range that comes out of it.",
};

/**
 * Home 03 — craft and curation.
 *
 * The third design is not a third arrangement of the same argument. Home 01 is
 * a group brochure: four divisions, four photographs, watch the film. Home 02
 * is a shop front: search, basket, favourites, buy something. Each is a good
 * answer to a different question, and each leaves the other one's question
 * unanswered.
 *
 * This page answers both, in that order — **craft, then curation**:
 *
 *   Hero      The four divisions, one at a time, steered rather than timed.
 *   01 Chain  What makes the group different: the chemistry, the foam, the
 *             mattress and the bedding are four steps of one process, all of
 *             them ours. Neither other homepage says this anywhere.
 *   02 Proof  Sixty years behind it. The only section with no photograph, and
 *             the only one that asks for nothing.
 *   03 Shop   Three curated ways into the catalogue — the buying, once the
 *             making has been established.
 *   ── then the media run, shared with Home 01 ──
 *   Film      One full-bleed film.
 *   04 Screen The reel strip.
 *   05 Read   The journal.
 *
 * ── What is shared and what is not ──────────────────────────────────────────
 * The top of the page is entirely its own — header, hero, and the three
 * sections that carry the argument. The bottom three are the shared components,
 * because FilmBand, Reels and Journal are not arguments; they are vehicles for
 * content that is the same whichever design wins, and each already takes its
 * heading as a prop for exactly this. Rewriting them would have produced three
 * more files that differed only in their headline.
 *
 * The headings they are given here are `HeadingThree`, not the shared
 * `SectionHeading` — mixed case rather than caps. That is the single change
 * that makes the shared sections read as part of this page rather than as
 * borrowed ones, and it is the whole reason `HeadingThree` exists.
 *
 * ── Section order ───────────────────────────────────────────────────────────
 * Proof sits between Chain and Shop rather than further down, and that is
 * load-bearing in two ways. It separates the argument from the offer, so the
 * page is not asking for a sale in the same breath as it introduces itself; and
 * it keeps the two dark bands apart — Proof and FilmBand are the only ones, and
 * Curation between them means the page never runs dark twice in a row. Reels
 * makes the same point in its own file.
 */
export default function HomeThree() {
  return (
    <>
      <HeroThree />

      {/* The claim the other two homepages never make. */}
      <ChainRail />

      {/* The rest between the claim and the offer. Dark, and no photograph. */}
      <ProofPanel />

      <Curation />

      {/* Full bleed and carrying its own centred label, so no heading is
          passed — one picture does not need two headlines above it. */}
      <FilmBand />

      <Reels
        heading={
          <HeadingThree
            index="04"
            eyebrow="On screen"
            title={["An Experience Of", <Mark key="a">A Life Time</Mark>]}
          />
        }
      />

      <Journal
        heading={
          <HeadingThree
            index="05"
            eyebrow="Journal"
            title={["Home", <Mark key="a">Begins Here</Mark>]}
          />
        }
      />

      <FloatingActions />
    </>
  );
}
