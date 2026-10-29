"use client";

/**
 * Karmo Foam detail — the sections under the buy box, in the homepage's language:
 * full-bleed screen-tall bands, 6px white gutters between bands and between photos,
 * no boxed cards, copy set like DivisionEditorials (eyebrow, two-line heading,
 * leaf rule, body) and photo titles set on the photo like ExploreSplit.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuArmchair,
  LuArrowDownToLine,
  LuBedDouble,
  LuFeather,
  LuMoveHorizontal,
  LuPackage,
  LuRuler,
  LuShieldCheck,
  LuSofa,
  LuWeight,
  LuWind,
} from "react-icons/lu";

import { group, rise as fade, VIEWPORT } from "@/components/karmo/motion";

/* Same band height and gutter as the homepage. */
const BAND_H = "lg:h-[calc(100svh-32px)]";
const GAP = "gap-1.5";
const SHELL_L = "lg:pl-[max(4rem,calc((100vw-1600px)/2+4rem))]";
const SHELL_R = "lg:pr-[max(4rem,calc((100vw-1600px)/2+4rem))]";

const PHOTO_TITLE = {
  fontSize: "clamp(1.5rem, 1.08rem + 1.45vw, 2.25rem)",
  fontWeight: 350,
  fontVariationSettings: '"wght" 350',
  lineHeight: 1.08,
  letterSpacing: "-0.015em",
};

function useReveal() {
  const reduce = useReducedMotion();
  return reduce ? {} : { variants: group, initial: "hidden", whileInView: "show", viewport: VIEWPORT };
}

/* Eyebrow, two-line heading, leaf rule — the homepage's copy block. `light` on photos. */
function Copy({ eyebrow, note, line1, line2, tagline, light = false, children }) {
  return (
    <>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`display text-[1.15rem] font-bold leading-none tracking-[-0.01em] sm:text-[1.3rem] ${light ? "text-white" : "text-brand"}`}>{eyebrow}</span>
        <span className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${light ? "text-white/70" : "text-ink/45"}`}>{note}</span>
      </p>
      <h2 className={`display section-heading title-card-line mt-3 uppercase ${light ? "text-white" : "text-ink"}`}>
        <span className="block">{line1}</span>
        <span className="block text-brand">{line2}</span>
      </h2>
      <span className="mt-4 flex items-center gap-3">
        <span className="h-px w-10 bg-brand" />
        <span className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/70" : "text-ink/45"}`}>{tagline}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z" fill="#FF9A1F" />
          <path d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8" stroke="#B4651A" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      {children}
    </>
  );
}

function Body({ light = false, children }) {
  return <p className={`body-copy mt-5 max-w-xl text-[16px] leading-[1.7] lg:text-[17px] ${light ? "text-white/80" : "text-ink/55"}`}>{children}</p>;
}

/* One icon per measure, matched on the label's first word. */
const MEASURE_ICON = {
  Density: LuWeight,
  "IFD 25%": LuFeather,
  "IFD 65%": LuArrowDownToLine,
  Tensile: LuShieldCheck,
  Elongation: LuMoveHorizontal,
  Air: LuWind,
  Size: LuRuler,
  Sold: LuPackage,
  Sit: LuArmchair,
  Back: LuSofa,
  Bed: LuBedDouble,
};
const iconFor = (label) =>
  MEASURE_ICON[label] || MEASURE_ICON[String(label).split(" ")[0]] || LuRuler;

/* Measures as solid dark tiles (the homepage's navy): icon, label, a big value. */
function Rows({ rows }) {
  return (
    <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-1.5 sm:grid-cols-3">
      {rows.map(([label, value]) => {
        const Icon = iconFor(label);
        return (
          <div key={label} className="flex flex-col bg-[#0b1a33] px-4 py-4 sm:px-5 sm:py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              <Icon size={20} aria-hidden />
            </span>
            <dt className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">{label}</dt>
            <dd className="display mt-1 text-[1.25rem] font-bold leading-tight tabular-nums text-white sm:text-[1.4rem]">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/* 1 — Photo left, the grade's catalogue numbers right on the foam texture. */
function KnowYourFoam({ product }) {
  const reveal = useReveal();
  const c = product.catalogue || {};
  const rows = c.technical?.length
    ? c.technical.map((r) => [r.label, r.value])
    : [c.piece && ["Size", c.piece], ["Sold as", "1 piece"]].filter(Boolean);

  return (
    <section className={`mb-[6px] grid bg-white lg:grid-cols-2 ${BAND_H}`} aria-label="Know your foam">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
        <Image src="/pages/foam/detail/know-your-foam.webp" alt={`Inside ${product.name}`} fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <motion.div {...reveal} className={`relative flex items-center overflow-hidden px-6 py-14 md:px-14 lg:py-10 lg:pl-14 xl:pl-20 ${SHELL_R}`}>
        <span className="pointer-events-none absolute inset-0" aria-hidden>
          <Image src="/products/foam/foam-texture-bg.webp" alt="" fill sizes="50vw" className="object-cover opacity-[0.45]" />
          <span className="absolute inset-0 bg-white/50" />
        </span>
        <motion.div variants={fade} className="relative z-[1] w-full">
          <Copy eyebrow={c.grade || "Karmo Foam"} note={c.color || "Catalogue"} line1="Know your" line2="foam" tagline="Factory tested">
            <Body>
              {c.note ||
                `${product.name} is ${c.grade ? c.grade.toLowerCase() : "Karmo"} foam${c.noFiller ? " with no filler" : ""}. Every number below comes from the Karmo Foam Catalogue.`}
            </Body>
          </Copy>
          <Rows rows={rows} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* Full-bleed photo banner, copy on the left over a soft wash. */
function Banner({ src, alt, label, children }) {
  const reveal = useReveal();
  return (
    <section className={`relative mb-[6px] flex min-h-[78svh] items-center overflow-hidden ${BAND_H}`} aria-label={label}>
      <Image src={src} alt={alt} fill unoptimized sizes="100vw" className="object-cover object-center" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-shade-deep/80 via-shade-deep/45 to-transparent" />
      <motion.div {...reveal} className={`relative z-[1] w-full px-6 py-14 md:px-14 ${SHELL_L}`}>
        <motion.div variants={fade} className="max-w-2xl">{children}</motion.div>
      </motion.div>
    </section>
  );
}

/* Two photos side by side, full width, titles on the photos. */
function PhotoPair({ shots }) {
  return (
    <section className={`mb-[6px] grid md:grid-cols-2 ${GAP}`} aria-label="Karmo Foam up close">
      {shots.map((shot) => (
        <div key={shot.src} className="group relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-[calc(100svh-32px)]">
          <span className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
            <Image src={shot.src} alt={shot.alt} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </span>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-shade-deep/30" />
          <div className="relative z-[1] p-7 pt-14 sm:p-9 sm:pt-20 lg:p-12 lg:pt-28">
            <h3 className="display title-card-line uppercase text-white" style={PHOTO_TITLE}>
              <span className="block">{shot.line1}</span>
              <span className="block">{shot.line2}</span>
            </h3>
            <p className="body-copy mt-3 max-w-sm text-[15px] leading-[1.6] text-white/85">{shot.note}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* 2 — Sizes on one full banner. */
function MadeToFit({ catalogue }) {
  const setSizes = (catalogue?.setSizes || []).filter((s) => s.includes("×"));
  const bedSizes = (catalogue?.bedSizes || []).filter((s) => s !== "Any size on request");
  if (!setSizes.length && !bedSizes.length) return null;

  const rows = [
    ...setSizes.map((line, i) => {
      const [measure, caption] = String(line).split(" — ");
      return [`${i === 0 ? "Sit" : "Back"} · ${caption || ""}`, measure];
    }),
    ...(bedSizes.length ? [["Bed sheet 72″ × 36″", bedSizes.map((s) => String(s).split("×").pop().trim()).join(" / ")]] : []),
  ];

  return (
    <Banner src="/pages/foam/furniture/rooms/room-cream-sectional-hq.webp" alt="A cream sectional sofa on Karmo Foam" label="Sizes">
      <Copy light eyebrow="Sizes" note="Cut to order" line1="Made to" line2="fit" tagline="Every set">
        <Body light>Each sofa set comes with five sit and five back pieces. Bed sheets are cut in five thicknesses, or to any size you need.</Body>
      </Copy>
      <Rows rows={rows} />
    </Banner>
  );
}

/* 3 — Two close-ups side by side, then the features on a banner. */
function BuiltToLast({ catalogue }) {
  const features = catalogue?.features || [];
  if (!features.length) return null;
  return (
    <>
      <PhotoPair
        shots={[
          { src: "/pages/foam/furniture/why/why-density-hq.webp", alt: "Dense Karmo Foam", line1: "Dense", line2: "by design", note: "Fine, even cells that hold their shape for years." },
          { src: "/pages/foam/furniture/why/why-airflow-hq.webp", alt: "Air moving through Karmo Foam", line1: "Open", line2: "airflow", note: "Air moves through the foam, so it sits cooler." },
        ]}
      />
      <Banner src="/pages/foam/furniture/hero/karmo-embossed-charcoal-foam-layers.webp" alt="Charcoal Karmo Foam layers embossed with the Karmo name" label="Features">
        <Copy light eyebrow="No filler" note="Inside the foam" line1="Built to" line2="last" tagline="Why it lasts">
          {catalogue.use ? <Body light>{catalogue.use}</Body> : null}
        </Copy>
        <ol className="mt-8 grid max-w-2xl gap-x-10 sm:grid-cols-2">
          {features.map((f, i) => (
            <li key={f} className="flex items-baseline gap-4 border-b border-white/20 py-3">
              <span className="text-[12px] font-bold tabular-nums text-white/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] font-semibold text-white">{f}</span>
            </li>
          ))}
        </ol>
      </Banner>
    </>
  );
}

export default function FoamDetailSections({ product }) {
  const c = product.catalogue;
  return (
    <>
      <KnowYourFoam product={product} />
      <MadeToFit catalogue={c} />
      <BuiltToLast catalogue={c} />
    </>
  );
}
