"use client";

/**
 * Karmo Foam detail — the sections under the buy box, in the homepage's language:
 * full-bleed screen-tall bands, 6px white gutters between bands and between photos,
 * no boxed cards, copy set like DivisionEditorials (eyebrow, two-line heading,
 * leaf rule, body) and photo titles set on the photo like ExploreSplit.
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
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
import FoamFeatureTriplet from "@/components/karmo/product/foam/FoamFeatureTriplet";
import FoamTestingBand from "@/components/karmo/product/foam/FoamTestingBand";

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

/* Counts the first number in a value up from 0 (like the homepage counters), keeping
   the rest — "25 (±) kg/m³", "58.5 lbs", "111%". Values with no number show as they are. */
function CountValue({ value, inView, delay = 0 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const text = String(value ?? "");
  const m = text.match(/\d+(?:\.\d+)?/);
  const target = m ? Number(m[0]) : 0;
  const decimals = m && m[0].includes(".") ? m[0].split(".")[1].length : 0;
  const before = m ? text.slice(0, m.index) : text;
  const after = m ? text.slice(m.index + m[0].length) : "";

  useEffect(() => {
    if (!m || !ref.current) return;
    if (reduce) {
      ref.current.textContent = target.toFixed(decimals);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      delay,
      ease: [0.25, 0.6, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, target, decimals, delay, reduce, m]);

  if (!m) return <>{text}</>;
  return (
    <>
      {before}
      <span className="relative inline-grid">
        <span aria-hidden className="invisible col-start-1 row-start-1">{target.toFixed(decimals)}</span>
        <span ref={ref} className="col-start-1 row-start-1 text-left">{(0).toFixed(decimals)}</span>
      </span>
      {after}
    </>
  );
}

/* Measures as see-through glass tiles over the photo (the homepage counters' look):
   icon, label, a big value that counts up when the tiles come into view. */
/* `clear`: see-through tiles, only a faint dark tint and a thin border (client, 28 Nov 2026). */
/* `glass`: frosted see-through tiles with white type, for a bright photo (client, 28 Nov 2026). */
function Rows({ rows, light = false, clear = false, glass = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  if (glass) {
    /* Small frosted cards sized in screen-width units (vw) from tablet up, so they keep the size
       and spot the client marked over the rug at any screen width (client, 28 Nov 2026). */
    return (
      <dl ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-[4.2%]">
        {rows.map(([label, value], i) => {
          const Icon = iconFor(label);
          return (
            <div
              key={label}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-[#1a2230]/[0.28] px-4 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-md backdrop-saturate-150 last:col-span-2 md:rounded-[0.9vw] md:px-[1vw] md:py-[1vw] md:last:col-span-1"
            >
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white md:h-[1.9vw] md:w-[1.9vw]">
                <Icon className="h-[18px] w-[18px] md:h-[0.95vw] md:w-[0.95vw]" aria-hidden />
              </span>
              <dt className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)] md:mt-[0.6vw] md:text-[max(9px,0.6vw)]">{label}</dt>
              <dd className="display mt-1 whitespace-nowrap text-[1.05rem] font-bold leading-tight tabular-nums text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] md:mt-[0.2vw] md:text-[1.05vw]">
                <CountValue value={value} inView={inView} delay={0.25 + i * 0.08} />
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }
  return (
    <dl ref={ref} className="mt-8 grid max-w-2xl grid-cols-2 gap-1.5 sm:grid-cols-3">
      {rows.map(([label, value], i) => {
        const Icon = iconFor(label);
        return (
          <div
            key={label}
            className={`relative flex flex-col overflow-hidden rounded-xl border px-4 ${clear ? (light ? "border-white/25 bg-black/20" : "border-ink/15 bg-ink/[0.09] backdrop-blur-[2px]") : `${light ? "border-white/20 bg-[#0b1a33]/35" : "border-ink/10 bg-white/25"} shadow-[0_6px_20px_rgba(11,26,51,0.08)] backdrop-blur-[6px]`} py-4 sm:px-5 sm:py-5`}
          >
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              <Icon size={20} aria-hidden />
            </span>
            <dt className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${light ? "text-white/75" : clear ? "text-ink/75" : "text-ink/55"}`}>{label}</dt>
            <dd className={`display mt-1 whitespace-nowrap text-[1.25rem] font-bold leading-tight tabular-nums sm:text-[1.4rem] ${light ? "text-white" : "text-ink"}`}>
              <CountValue value={value} inView={inView} delay={0.25 + i * 0.08} />
            </dd>
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
        {/* The KARMO POLY stack from the foam-furniture hero (its second slide). */}
        <Image src="/pages/foam/furniture/hero/embossed-karmo-poly-stack-hero.webp" alt={`Inside ${product.name}`} fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
        {/* Darker, moodier left photo (client, 24 Nov 2026). */}
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/65" />
      </div>
      <motion.div {...reveal} className={`relative flex items-center overflow-hidden px-6 py-14 md:px-14 lg:py-10 lg:pl-14 xl:pl-20 ${SHELL_R}`}>
        <span className="pointer-events-none absolute inset-0" aria-hidden>
          {/* The client's foam-sheet photo behind the numbers (client, 28 Nov 2026).
              Before: a soft pore texture at 45% under a white wash. */}
          <Image src="/products/foam/foam-sheet-closeup.webp" alt="" fill sizes="50vw" className="object-cover object-center" />
          <span className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/60 to-white/50" />
        </span>
        <motion.div variants={fade} className="relative z-[1] w-full">
          <Copy eyebrow={c.grade || "Karmo Foam"} note={c.color || "Catalogue"} line1="Know your" line2="foam" tagline="Factory tested">
            <Body>
              {c.note ||
                `${product.name} is ${c.grade ? c.grade.toLowerCase() : "Karmo"} foam${c.noFiller ? " with no filler" : ""}. Every number below comes from the Karmo Foam Catalogue.`}
            </Body>
          </Copy>
          <Rows clear rows={rows} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* Full-bleed photo banner, copy over a soft wash (left by default; copyRight puts it on the right).
   aside: an optional foam picture standing on the floor, on the side away from the copy (desktop and tablet). */
/* soft: only a light shade, and the glass cards pinned low over the rug, where the client marked them (client, 28 Nov 2026). */
function Banner({ src, alt, label, aside, copyRight = false, soft = false, children }) {
  const reveal = useReveal();
  const reduceMotion = useReducedMotion();
  const wash = soft
    ? "bg-gradient-to-l from-black/30 via-black/10 to-transparent"
    : copyRight
      ? "bg-gradient-to-l from-shade-deep/80 via-shade-deep/45 to-transparent"
      : "bg-gradient-to-r from-shade-deep/80 via-shade-deep/45 to-transparent";
  return (
    <section className={`relative mb-[6px] flex min-h-[78svh] items-center overflow-hidden ${BAND_H}`} aria-label={label}>
      <Image src={src} alt={alt} fill unoptimized sizes="100vw" className={`object-cover ${soft ? "object-[22%_center]" : "object-center"}`} />
      <span aria-hidden className={`pointer-events-none absolute inset-0 ${wash}`} />
      {aside ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-none absolute bottom-[5%] z-[1] hidden w-[33vw] max-w-[640px] md:block ${copyRight ? "left-[15%]" : "right-[4%] lg:right-[5%]"}`}
        >
          {/* soft floor shadow under the foam */}
          <span aria-hidden className="absolute -bottom-[3%] left-[8%] right-[4%] h-[14%] rounded-[50%] bg-black/45 blur-2xl" />
          <Image src={aside.src} alt={aside.alt} width={1200} height={855} sizes="40vw" className="relative h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]" />
        </motion.div>
      ) : null}
      <motion.div
        {...reveal}
        className={
          soft
            ? "absolute inset-x-6 top-8 z-[1] md:inset-x-auto md:top-auto md:bottom-[8.5%] md:left-[45.7%] md:w-[40.8%]"
            : `relative z-[1] flex w-full px-6 py-14 md:px-14 ${copyRight ? `md:justify-end ${SHELL_R}` : SHELL_L}`
        }
      >
        <motion.div variants={fade} className={soft ? "w-full" : "max-w-2xl"}>{children}</motion.div>
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
    /* The client's own room picture with Karmo 2001 foam on the floor (client, 28 Nov 2026), and only
       the three size cards, as frosted glass, on the right. Removed the same day: the "Sizes / Made to
       fit" heading and text, and the earlier table-less room with a separate foam picture on it. */
    <Banner src="/pages/foam/furniture/rooms/room-sunlit-sectional-2001.webp" alt="A cream sectional sofa with a stack of purple Karmo 2001 foam on the floor" label="Sizes"
      copyRight
      soft>
      <Rows glass rows={rows} />
    </Banner>
  );
}

/* 3 — Two close-ups side by side, then the features on a banner. */
function BuiltToLast({ catalogue }) {
  const features = catalogue?.features || [];
  if (!features.length) return null;
  return (
    <>
      {/* "Dense by design" / "Open airflow" photo pair removed (client, 24 Nov 2026). */}
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
      <FoamFeatureTriplet product={product} />
      <MadeToFit catalogue={c} />
      {/* The "Built to last" banner was taken off the foam pages (client, 28 Nov 2026): <BuiltToLast catalogue={c} /> */}
      {/* In its place, the mattress page's "Inside every Karmo" band in foam: heading + five test clips (client, 28 Nov 2026). */}
      <FoamTestingBand product={product} />
    </>
  );
}
