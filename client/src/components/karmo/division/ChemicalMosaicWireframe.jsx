import {
  FiDroplet,
  FiPackage,
  FiRefreshCw,
  FiCheckCircle,
  FiClipboard,
} from "react-icons/fi";

import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import ImagePlaceholder from "./ImagePlaceholder";
import WireframeProductCard from "./WireframeProductCard";

/**
 * Wireframe for a Chemicals & Polymers section page, built to the exact
 * shapes and gaps of `/foam/footwear` (Hero → trust strip → recommended band
 * → 6px-gap mosaic grid → lounge band → product grid → contact) — the client
 * picked that page as the reference and asked for "whatever shape, whatever
 * gap is there" to carry over as-is, not the looser bordered-card layout
 * `ChemicalSectionWireframe` used for Polyurethane / Solvent.
 *
 * Two rules from the client's second pass, both kept everywhere in this file:
 *   1. No banner announcing "this is a wireframe" — the empty text and the
 *      placeholder photos already say that on their own.
 *   2. No invented copy anywhere, including this component's own hardcoded
 *      claim/cert text. Every heading and paragraph is a plain instruction —
 *      "Heading text here", "Body text goes here." — standing in for whatever
 *      the real line will be, the same way `ImagePlaceholder` stands in for a
 *      photo. The hero also dropped its eyebrow + subline stack for that
 *      reason: one wireframe line reads as "a heading goes here", three reads
 *      as a first draft of real copy.
 *
 * Badges, icons and colour chips are real UI chrome (same as footwear's),
 * kept as-is — the client's notes were about text and photography, not
 * structural colour.
 *
 * If this is approved, `Polyurethane / Solvent` should probably move to this
 * same component for consistency — it currently still uses the simpler one.
 */

const BADGE = {
  red: "bg-[#E03131]",
  blue: "bg-[#1C7ED6]",
  green: "bg-[#2F9E44]",
};

const PLACEHOLDER_HEADING = "Heading text here";
const PLACEHOLDER_BODY = "Body text goes here.";
const PLACEHOLDER_CAPTION = "Caption text here";
const PLACEHOLDER_LABEL = "Label text here";

const CLAIM_PRIMARY = { icon: FiDroplet, badge: "red" };
const CLAIM_PAIR = [
  { id: "claim-2", icon: FiPackage, badge: "blue" },
  { id: "claim-3", icon: FiRefreshCw, badge: "green" },
];
const CERTS = [
  { id: "cert-1", icon: FiCheckCircle, badge: "red" },
  { id: "cert-2", icon: FiClipboard, badge: "blue" },
];

function ClaimCard({ item, big = false }) {
  const Icon = item.icon;
  return (
    <div
      className={`flex h-full min-h-[160px] flex-col justify-center border border-[#e07a3a]/70 bg-[#0b1a33] px-6 py-6 text-white ${
        big ? "" : "min-h-[130px] px-5 py-4"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${BADGE[item.badge]} ${
          big ? "h-14 w-14" : "h-11 w-11"
        }`}
      >
        <Icon className={big ? "text-[26px]" : "text-[20px]"} aria-hidden />
      </span>
      <h3 className={`display mt-4 font-bold uppercase tracking-[0.04em] ${big ? "text-[16px]" : "text-[13px]"}`}>
        {PLACEHOLDER_HEADING}
      </h3>
      <p className={`body-copy mt-2 leading-[1.55] text-white/80 ${big ? "text-[12.5px]" : "text-[11.5px]"}`}>
        {PLACEHOLDER_BODY}
      </p>
    </div>
  );
}

function CertCardBox({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex h-full min-h-[110px] items-center gap-4 border border-[#e2e2e4] bg-[#f7f7f8] px-5 py-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${BADGE[item.badge]} text-white`}>
        <Icon className="text-[22px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <h3 className="display text-[13px] font-bold uppercase tracking-[0.04em] text-[#0b1a33]">
          {PLACEHOLDER_HEADING}
        </h3>
        <p className="body-copy mt-1 text-[12px] leading-[1.5] text-[#0b1a33]/62">
          {PLACEHOLDER_BODY}
        </p>
      </div>
    </div>
  );
}

/**
 * `featureCount` / `recommendedCount` / `productCount` are the real,
 * menu-driven counts (Specialized has 4 products; Polyurethane has 3) — the
 * one thing about each section that isn't invented copy. Everything each one
 * says is the same placeholder line, repeated.
 */
export default function ChemicalMosaicWireframe({
  featureCount = 6,
  recommendedCount = 3,
  productCount = 3,
}) {
  return (
    <>
      {/* ── Hero — full-bleed, matching Foam / Pillow / Bed & Automotive, one
          heading line only (no eyebrow, no subline stack). */}
      <section className="relative isolate h-[calc(100vh-112px)] overflow-hidden border-b border-ink/10">
        <ImagePlaceholder label="Hero banner" fill />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 lg:px-14 xl:px-20">
          <h1
            className="display whitespace-nowrap uppercase text-white"
            style={{
              fontSize: "clamp(1.12rem, 0.92rem + 1.45vw, 2.4rem)",
              fontWeight: 350,
              fontVariationSettings: '"wght" 350',
              letterSpacing: "0.12em",
              lineHeight: 1.1,
              textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}
          >
            {PLACEHOLDER_HEADING}
          </h1>
        </div>
      </section>

      {/* ── Trust strip — same 6-icon row as every division page. ── */}
      <section className="mb-1 border-b border-ink/10 bg-white md:mb-1.5">
        <div className="grid w-full grid-cols-2 gap-5 px-6 py-8 md:grid-cols-3 md:gap-7 md:px-10 md:py-10 lg:grid-cols-6 lg:gap-0 lg:px-16 lg:py-12">
          {Array.from({ length: featureCount }).map((_, i) => (
            <div
              key={i}
              className={`text-center lg:px-4 xl:px-6 ${i > 0 ? "lg:border-l lg:border-ink/10" : ""}`}
            >
              <span className="mx-auto flex h-20 w-20 sm:h-[5.5rem] sm:w-[5.5rem]">
                <ImagePlaceholder label="Icon" fill />
              </span>
              <h3 className="display mt-2.5 text-[0.72rem] font-bold uppercase leading-snug tracking-[0.08em] text-ink xl:text-[0.78rem]">
                {PLACEHOLDER_LABEL}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recommended — "which grade is right for you", 3 columns, 6px gap. ── */}
      <section className="mb-1.5 w-full overflow-hidden bg-[#f7f7f8]">
        <div className="flex flex-col py-5 sm:py-6 lg:py-7">
          <h2 className="display section-heading title-card-line shrink-0 px-4 text-center uppercase text-[#0b1a33] sm:px-8 lg:px-12">
            {PLACEHOLDER_HEADING}
          </h2>
          <div className="mt-4 grid w-full grid-cols-1 gap-[6px] sm:mt-5 sm:grid-cols-3">
            {Array.from({ length: recommendedCount }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <ImagePlaceholder label="Photo" ratio="4/3" />
                <p className="body-copy mt-2 px-2 text-center text-[12.5px] leading-[1.5] text-[#0b1a33]/70">
                  {PLACEHOLDER_CAPTION}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mosaic shape grid — same 80%-width, 6px-gap grid as Foam's. ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-[1] mx-auto w-[92%] py-1.5 sm:w-[85%] lg:w-[80%]">
          <div className="grid w-full grid-cols-1 gap-[6px] md:h-[min(90svh,980px)] md:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] md:grid-rows-1">
            <div className="grid grid-cols-1 gap-[6px] md:h-full md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <ClaimCard item={CLAIM_PRIMARY} big />
              <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2">
                {CLAIM_PAIR.map((c) => (
                  <ClaimCard key={c.id} item={c} />
                ))}
              </div>
              {/* Spotlight — right-aligned heading over a placeholder photo,
                  spans both columns, same as footwear's "Designed to endure". */}
              <div className="relative col-span-1 min-h-[240px] overflow-hidden md:col-span-2 md:min-h-0">
                <ImagePlaceholder label="Photo" fill />
                <div className="pointer-events-none absolute inset-0 flex h-full items-center justify-end bg-black/15 px-6 py-6 sm:px-8 lg:px-10">
                  <h3 className="display section-heading title-card-line uppercase text-white">
                    {PLACEHOLDER_HEADING}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid min-h-0 gap-[6px] md:h-full md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2.4fr)]">
              {CERTS.map((c) => (
                <CertCardBox key={c.id} item={c} />
              ))}
              <div className="h-[min(56svh,440px)] w-full md:h-full md:min-h-0">
                <ImagePlaceholder label="Photo" fill />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lounge band — full-bleed banner, same aspect as footwear's. ── */}
      <section className="relative mb-1.5 h-[min(68svh,520px)] min-h-[420px] w-full overflow-hidden md:h-auto md:min-h-0 md:aspect-[1916/821]">
        <ImagePlaceholder label="Photo" fill />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-end px-6 text-right sm:px-10 lg:px-16">
          <h2 className="display section-heading title-card-line uppercase text-white">
            {PLACEHOLDER_HEADING}
          </h2>
        </div>
      </section>

      {/* ── Product grid — same shape as the live catalogue cards (eyebrow +
          heading + leaf rule, then the cards), at the client's ask: they
          pointed at a real product card (photo, badge, rating, spec/price
          split, a four-option row, full-width order button) and asked for
          this instead of a plain image+title+note tile. See
          `WireframeProductCard` for what changed and what didn't inside the
          card itself. ── */}
      <section className="border-b border-ink/10 bg-white pb-16 pt-4 lg:pb-24 lg:pt-6">
        <div className="shell relative z-[1] mb-8 text-center lg:mb-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">
            {PLACEHOLDER_LABEL}
          </span>
          <h2 className="display section-heading title-card-line mt-4 uppercase text-ink">
            {PLACEHOLDER_HEADING}
          </h2>
          <p className="body-copy mx-auto mt-4 max-w-2xl text-[14px] leading-[1.65] text-ink/60 sm:text-[15px]">
            {PLACEHOLDER_BODY}
          </p>
        </div>
        <div className="relative z-[1] mx-auto grid w-full max-w-[1520px] grid-cols-1 items-stretch gap-5 px-5 pt-6 sm:grid-cols-2 sm:gap-6 sm:pt-8 md:px-8 lg:grid-cols-3 lg:gap-7 lg:px-10 lg:pt-10">
          {Array.from({ length: productCount }).map((_, i) => (
            <WireframeProductCard key={i} />
          ))}
        </div>
      </section>

      <OrderAndContact />
    </>
  );
}
