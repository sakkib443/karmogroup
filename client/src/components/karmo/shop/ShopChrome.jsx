"use client";

/**
 * Shared pieces for the bag (cart) and checkout pages, in the homepage's language:
 * a small red eyebrow, an uppercase light heading with a red accent, the orange
 * leaf rule, the soft damask texture, square corners — plus the step bar with
 * Karmo's own icons (Bag → Details → Done).
 */
import Image from "next/image";
import { LuShoppingBag, LuTruck, LuPackageCheck, LuCheck } from "react-icons/lu";
import TextureSlides from "@/components/karmo/home/TextureSlides";

export const ORANGE = "#FF9A1F";

/* ─── Icons — two-tone line marks drawn for the shop ─────────────────────── */

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** A tinted shape tucked behind each mark — what makes the set read as one family. */
function Blob({ d, tone = "var(--color-brand)", opacity = 0.18 }) {
  return <path d={d} fill={tone} opacity={opacity} />;
}

/** @param {{ className?: string, accent?: string }} props */
export function BagIcon({ className = "h-6 w-6", accent }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <Blob d="M9 13h17l-1.4 13.2a2 2 0 0 1-2 1.8H11.6a2 2 0 0 1-2-1.8L9 13Z" tone={accent} />
      <path d="M7 11h18l-1.5 14.2a2.2 2.2 0 0 1-2.2 1.98H10.7a2.2 2.2 0 0 1-2.2-1.98L7 11Z" {...line} />
      <path d="M11.5 11V9.5a4.5 4.5 0 0 1 9 0V11" {...line} />
      <path d="M12.5 16.5c.6 1.9 2 3 3.5 3s2.9-1.1 3.5-3" {...line} />
    </svg>
  );
}

/** @param {{ className?: string, accent?: string }} props */
export function ParcelIcon({ className = "h-6 w-6", accent }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <Blob d="M6 12.5 16.5 7.5l10 5v11l-10 5-10.5-5v-11Z" tone={accent} />
      <path d="M4.5 10.5 15 5.5l10.5 5v11L15 26.5l-10.5-5v-11Z" {...line} />
      <path d="M4.5 10.5 15 15.5l10.5-5M15 15.5v11" {...line} />
      <path d="m9.8 8 10.5 5.1v4" {...line} />
      <path d="M26 24.5h3M27.5 21v7" {...line} />
    </svg>
  );
}

/** @param {{ className?: string, accent?: string }} props */
export function SealIcon({ className = "h-6 w-6", accent }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <Blob d="M17 4.5l2.6 2.2 3.4-.4 1.1 3.2 3 1.7-.9 3.3 1.4 3.1-2.7 2.1-.4 3.4-3.4.5-2.1 2.7-3.1-1.4-3.3.9-1.7-3-3.2-1.1.4-3.4-2.2-2.6 2.2-2.6-.4-3.4 3.2-1.1 1.7-3 3.3.9L17 4.5Z" tone={accent} />
      <path d="M16 3l2.6 2.2 3.4-.4 1.1 3.2 3 1.7-.9 3.3 1.4 3.1-2.7 2.1-.4 3.4-3.4.5-2.1 2.7-3.1-1.4-3.3.9-1.7-3-3.2-1.1.4-3.4L4.4 15l2.2-2.6-.4-3.4 3.2-1.1 1.7-3 3.3.9L16 3Z" {...line} />
      <path d="m11.5 15.5 3.2 3.2 6-6.4" {...line} />
    </svg>
  );
}

export function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="1.6" {...line} />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" {...line} />
      <path d="M12 14.5v2.5" {...line} />
    </svg>
  );
}

export function TruckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M2.5 6.5h11v9h-11z" {...line} />
      <path d="M13.5 9.5h4l3 3v3h-7" {...line} />
      <circle cx="6.5" cy="17" r="1.8" {...line} />
      <circle cx="17" cy="17" r="1.8" {...line} />
    </svg>
  );
}

export function TagIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-6.1 6.1a1.4 1.4 0 0 1-2 0l-9-7Z" {...line} />
      <circle cx="8.3" cy="8.3" r="1.5" {...line} />
    </svg>
  );
}

/* ─── Leaf rule — the homepage's orange divider ─────────────────────────── */

export function LeafRule({ align = "start" }) {
  return (
    <span aria-hidden className={`mt-4 flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}>
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: ORANGE }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M20.5 3.5C20.5 3.5 8.8 2.2 5.4 8.2c-2.6 4.6.6 9.4 4.6 10.3 4.6 1 8.6-2.4 9.6-7.3.6-3.1.9-7.7.9-7.7Z" fill={ORANGE} />
        <path d="M18.6 5.6C14.4 8.4 9.9 12.6 6.7 19.8" stroke="#B4651A" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: ORANGE }} />
    </span>
  );
}

/* ─── Steps: Bag → Details → Done ───────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Bag", Icon: LuShoppingBag },
  { id: 2, label: "Details", Icon: LuTruck },
  { id: 3, label: "Done", Icon: LuPackageCheck },
];

/** Compact step bar — square tiles, a check on the steps behind you. */
export function ShopSteps({ step = 1 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Checkout steps">
      {STEPS.map(({ id, label, Icon }, i) => {
        const done = id < step;
        const on = id === step;
        return (
          <li key={id} className="flex items-center gap-2 sm:gap-3" aria-current={on ? "step" : undefined}>
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  on
                    ? "border-brand bg-brand text-white"
                    : done
                      ? "border-brand/30 bg-brand/[0.08] text-brand"
                      : "border-ink/15 bg-white text-ink/35"
                }`}
              >
                {done ? <LuCheck size={16} strokeWidth={2.6} /> : <Icon size={17} strokeWidth={1.9} />}
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">Step {id}</span>
                <span className={`block text-[13px] font-semibold ${on ? "text-ink" : "text-ink/55"}`}>{label}</span>
              </span>
            </span>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className={`h-px w-5 sm:w-10 ${done ? "bg-brand" : "bg-ink/15"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ─── The band at the top of both pages — kept short ────────────────────── */

/** @param {{ eyebrow: string, title: string, accent?: string, sub?: string, step?: number, aside?: import("react").ReactNode }} props */
export function ShopHeader({ eyebrow, title, accent, sub, step = 1, aside }) {
  return (
    <section className="relative overflow-hidden border-b border-ink/8">
      <TextureSlides lighter />
      <div className="relative z-[1] mx-auto flex w-full max-w-[1760px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12 lg:py-6">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">{eyebrow}</span>
          <h1
            className="display title-card-line mt-1 uppercase text-ink"
            style={{ fontSize: "clamp(1.25rem, 1.05rem + 0.6vw, 1.6rem)", fontWeight: 350, lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            {title} {accent ? <span className="text-brand">{accent}</span> : null}
          </h1>
          {sub ? <p className="mt-1 text-[13px] text-ink/50">{sub}</p> : null}
          {aside}
        </div>
        <ShopSteps step={step} />
      </div>
    </section>
  );
}

/* ─── Trust row — the homepage's cartoon icons ──────────────────────────── */

const TRUST = [
  { icon: "/shared/trust/cartoon-v3/delivery-v2.webp", title: "Nationwide delivery", note: "To your door, anywhere in Bangladesh" },
  { icon: "/shared/trust/cartoon-v3/legacy-60-v5.webp", title: "Since 1965", note: "Six decades of trusted comfort" },
  { icon: "/shared/trust/cartoon-v3/cartoon-globe-v4.webp", title: "Certified quality", note: "ISO 9001 · UKAS · Moody" },
];

export function TrustRow({ dark = false }) {
  return (
    <ul className={`grid grid-cols-3 gap-2 ${dark ? "text-white" : "text-ink"}`}>
      {TRUST.map((t) => (
        <li key={t.title} className="flex flex-col items-center text-center">
          <span className="relative h-12 w-12">
            <Image src={t.icon} alt="" fill sizes="48px" className="object-contain" />
          </span>
          <span className={`mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.08em] ${dark ? "text-white/85" : "text-ink/80"}`}>{t.title}</span>
          <span className={`mt-0.5 hidden text-[10px] leading-snug sm:block ${dark ? "text-white/45" : "text-ink/45"}`}>{t.note}</span>
        </li>
      ))}
    </ul>
  );
}

/** "৳12,345" */
export const tk = (n) => `৳${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
