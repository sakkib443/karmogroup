import {
  FiImage,
  FiDroplet,
  FiPackage,
  FiRefreshCw,
  FiCheckCircle,
  FiClipboard,
  FiArrowRight,
} from "react-icons/fi";

import OrderAndContact from "@/components/karmo/home/OrderAndContact";

export const metadata = {
  title: "Karmo Adhesive — Karmo Chemicals",
  description:
    "Karmo Adhesive range — Super, Light, Rubber Solution, PU and Bond. Industrial-strength bonding, fast cure, quality-certified batches.",
};

/**
 * `/chemicals/karmo-adhesive` — same wireframe as `/chemicals/specialized`
 * (itself built to `/foam/footwear`'s shapes and gaps), but written whole
 * inside this one file rather than through the shared
 * `ChemicalMosaicWireframe` / `WireframeProductCard` components those pages
 * use. The client's ask: no shared component this time, so this page can be
 * finished later by editing only this file — swap each `ImagePlaceholder`
 * for a real `<Image>` and each placeholder line for real copy, nothing
 * else to open.
 *
 * That does mean this markup is duplicated with Specialized's, on purpose.
 * `OrderAndContact` stays imported: it's the site's real contact section on
 * every division page already, not part of the wireframe being copied.
 */

const ORANGE = "#FF9A1F";
const BADGE = {
  red: "bg-[#E03131]",
  blue: "bg-[#1C7ED6]",
  green: "bg-[#2F9E44]",
};

const PLACEHOLDER_HEADING = "Heading text here";
const PLACEHOLDER_BODY = "Body text goes here.";
const PLACEHOLDER_CAPTION = "Caption text here";
const PLACEHOLDER_LABEL = "Label text here";

/* Real count for this menu — Karmo Super, Light, Rubber Solution, PU, Bond
   (see the Navbar's "Karmo Adhesive" sub-rows). Everything each card says is
   still the same placeholder line. */
const FEATURE_COUNT = 6;
const RECOMMENDED_COUNT = 3;
const PRODUCT_COUNT = 5;

/** A bordered stand-in for a photo that doesn't exist yet. Swap for a real
 *  `<Image>` at the same spot when photography is ready. */
function ImagePlaceholder({ label = "Image", ratio = "16/9", fill = false, className = "" }) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-ink/[0.03] text-ink/35 ${
        fill ? "h-full" : ""
      } ${className}`}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      <FiImage className="text-[28px]" aria-hidden />
      <span className="display text-[11px] font-bold uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}

function ClaimCard({ icon: Icon, badge, big = false }) {
  return (
    <div
      className={`flex h-full min-h-[160px] flex-col justify-center border border-[#e07a3a]/70 bg-[#0b1a33] px-6 py-6 text-white ${
        big ? "" : "min-h-[130px] px-5 py-4"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${BADGE[badge]} ${
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

function CertCardBox({ icon: Icon, badge }) {
  return (
    <div className="flex h-full min-h-[110px] items-center gap-4 border border-[#e2e2e4] bg-[#f7f7f8] px-5 py-4">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${BADGE[badge]} text-white`}>
        <Icon className="text-[22px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <h3 className="display text-[13px] font-bold uppercase tracking-[0.04em] text-[#0b1a33]">
          {PLACEHOLDER_HEADING}
        </h3>
        <p className="body-copy mt-1 text-[12px] leading-[1.5] text-[#0b1a33]/62">{PLACEHOLDER_BODY}</p>
      </div>
    </div>
  );
}

/** Five stars, decorative — matches the live catalogue card's rating row. */
function Stars() {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
          <path
            d="M12 2.6 14.9 9l6.9.6-5.2 4.5 1.6 6.7L12 17.8 5.8 20.8l1.6-6.7L2.2 9.6 9.1 9 12 2.6Z"
            fill={i < 4 ? ORANGE : "#D6D3CE"}
          />
        </svg>
      ))}
    </span>
  );
}

/** Wireframe of the live catalogue card (photo, badge, rating, spec/price
 *  split, a four-option row, full-width order button). "Order Now" stays as
 *  real copy — fixed UI microcopy, identical on every card regardless of
 *  product. The four-option row is unlabelled: Chemicals has no size
 *  equivalent decided yet, so it's the same shape with no assumed meaning.
 *
 *  Static, not interactive (option 0 fixed "on") — this stays a plain server
 *  component on purpose, so the page keeps its `export const metadata`
 *  (title/description). The real page can bring the click state back once a
 *  real component replaces this wireframe. */
function ProductCard() {
  const selected = 0;

  return (
    <article className="flex h-full flex-col overflow-hidden bg-white shadow-[0_1px_8px_rgba(11,26,51,0.08)]">
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden bg-[#F4F6F8]">
        <ImagePlaceholder label="Photo" fill />
        <span className="absolute left-2.5 top-2.5 z-[2] bg-[#0b1a33] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
          {PLACEHOLDER_LABEL}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3.5 pt-3 sm:px-3.5">
        <h3 className="text-[16px] font-bold leading-snug text-ink sm:text-[17px]">{PLACEHOLDER_LABEL}</h3>

        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-ink/70">
              <Stars />
              <span className="font-semibold tabular-nums text-ink">X.X</span>
              <span className="text-ink/30">|</span>
              <span>(XX)</span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-ink/45">{PLACEHOLDER_CAPTION}</p>
            <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-ink/55 sm:text-[12px]">
              {PLACEHOLDER_BODY}
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-end justify-start text-right">
            <span className="text-[18px] font-bold tabular-nums leading-none text-brand sm:text-[20px]">
              ৳X,XXX
            </span>
            <s className="mt-1 text-[12px] tabular-nums text-ink/40">৳X,XXX</s>
            <span
              className="mt-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-white"
              style={{ backgroundColor: ORANGE }}
            >
              XX% off
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => {
            const on = selected === i;
            return (
              <div
                key={i}
                aria-current={on ? "true" : undefined}
                className={`flex flex-col items-center gap-0.5 border px-0.5 py-1 ${
                  on ? "border-brand bg-brand/[0.04]" : "border-ink/10"
                }`}
              >
                <span aria-hidden className="h-6 w-6 border border-dashed border-ink/25 bg-ink/[0.03] sm:h-7 sm:w-7" />
                <span className={`text-[7.5px] font-bold uppercase tracking-[0.05em] ${on ? "text-brand" : "text-ink/45"}`}>
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-3.5">
          <span className="inline-flex h-11 w-full items-center justify-center gap-2.5 bg-brand text-[12px] font-bold uppercase tracking-[0.12em] text-white">
            Order Now
            <FiArrowRight className="text-[14px]" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ChemicalsKarmoAdhesiveRoute() {
  return (
    <>
      {/* ── Hero — full-bleed, one heading line, no eyebrow/subline stack. ── */}
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
          {Array.from({ length: FEATURE_COUNT }).map((_, i) => (
            <div key={i} className={`text-center lg:px-4 xl:px-6 ${i > 0 ? "lg:border-l lg:border-ink/10" : ""}`}>
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
            {Array.from({ length: RECOMMENDED_COUNT }).map((_, i) => (
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
              <ClaimCard icon={FiDroplet} badge="red" big />
              <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2">
                <ClaimCard icon={FiPackage} badge="blue" />
                <ClaimCard icon={FiRefreshCw} badge="green" />
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
              <CertCardBox icon={FiCheckCircle} badge="red" />
              <CertCardBox icon={FiClipboard} badge="blue" />
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
          <h2 className="display section-heading title-card-line uppercase text-white">{PLACEHOLDER_HEADING}</h2>
        </div>
      </section>

      {/* ── Product grid — same shape as the live catalogue cards. ── */}
      <section className="border-b border-ink/10 bg-white pb-16 pt-4 lg:pb-24 lg:pt-6">
        <div className="shell relative z-[1] mb-8 text-center lg:mb-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-brand">{PLACEHOLDER_LABEL}</span>
          <h2 className="display section-heading title-card-line mt-4 uppercase text-ink">{PLACEHOLDER_HEADING}</h2>
          <p className="body-copy mx-auto mt-4 max-w-2xl text-[14px] leading-[1.65] text-ink/60 sm:text-[15px]">
            {PLACEHOLDER_BODY}
          </p>
        </div>
        <div className="relative z-[1] mx-auto grid w-full max-w-[1520px] grid-cols-1 items-stretch gap-5 px-5 pt-6 sm:grid-cols-2 sm:gap-6 sm:pt-8 md:px-8 lg:grid-cols-3 lg:gap-7 lg:px-10 lg:pt-10">
          {Array.from({ length: PRODUCT_COUNT }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </section>

      <OrderAndContact />
    </>
  );
}
