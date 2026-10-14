"use client";

/**
 * Shared pieces for the bag (cart) and checkout pages, in the homepage's language:
 * a small red eyebrow, an uppercase light heading with a red accent, the orange
 * leaf rule, the soft damask texture, square corners — plus the step bar with
 * Karmo's own icons (Bag → Details → Done).
 */
import Image from "next/image";
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
  { id: 1, label: "Your bag", note: "Review & save", Icon: BagIcon },
  { id: 2, label: "Details", note: "Delivery & payment", Icon: ParcelIcon },
  { id: 3, label: "Done", note: "Order placed", Icon: SealIcon },
];

export function ShopSteps({ step = 1 }) {
  return (
    <ol className="flex w-full max-w-xl items-start" aria-label="Checkout steps">
      {STEPS.map(({ id, label, note, Icon }, i) => {
        const done = id < step;
        const on = id === step;
        return (
          <li key={id} className="flex flex-1 items-start last:flex-none" aria-current={on ? "step" : undefined}>
            <div className="flex flex-col items-center text-center">
              <span
                className={`relative flex h-12 w-12 items-center justify-center transition-colors sm:h-14 sm:w-14 ${
                  on
                    ? "bg-brand text-white shadow-[0_10px_24px_-10px_rgba(212,67,72,0.75)]"
                    : done
                      ? "bg-ink text-white"
                      : "border border-ink/15 bg-white text-ink/45"
                }`}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" accent={on || done ? "#ffffff" : undefined} />
                {done ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-[#16a34a] text-white ring-2 ring-white">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : null}
              </span>
              <span className={`mt-2 text-[11px] font-bold uppercase tracking-[0.14em] ${on ? "text-ink" : "text-ink/45"}`}>{label}</span>
              <span className="mt-0.5 hidden text-[11px] text-ink/40 sm:block">{note}</span>
            </div>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="relative mx-2 mt-6 h-[2px] flex-1 bg-ink/10 sm:mx-3 sm:mt-7">
                <span className="absolute inset-y-0 left-0 bg-brand transition-all duration-500" style={{ width: done ? "100%" : on ? "50%" : "0%" }} />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ─── The band at the top of both pages ─────────────────────────────────── */

/** @param {{ eyebrow: string, title: string, accent?: string, sub?: string, step?: number, aside?: import("react").ReactNode }} props */
export function ShopHeader({ eyebrow, title, accent, sub, step = 1, aside }) {
  return (
    <section className="relative overflow-hidden border-b border-ink/8">
      <TextureSlides lighter />
      <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12 flex flex-col gap-7 py-7 lg:flex-row lg:items-end lg:justify-between lg:py-9">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">{eyebrow}</span>
          <h1
            className="display title-card-line mt-2.5 uppercase text-ink"
            style={{ fontSize: "clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem)", fontWeight: 350, lineHeight: 1.06, letterSpacing: "-0.015em" }}
          >
            {title} {accent ? <span className="text-brand">{accent}</span> : null}
          </h1>
          <LeafRule />
          {sub ? <p className="mt-3 text-sm text-ink/55">{sub}</p> : null}
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
