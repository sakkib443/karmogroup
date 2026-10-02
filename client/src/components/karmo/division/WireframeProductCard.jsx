"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

import ImagePlaceholder from "./ImagePlaceholder";

/**
 * Wireframe version of the real catalogue card (`MattressCatalogueCard` in
 * `DivisionProducts.jsx`) — the client pointed at a live product card
 * (Karmo King Mattress: badge, photo, rating, spec line, price + strike-
 * through + discount tag, a row of size options, full-width order button)
 * and asked for this shape specifically, not the plainer image+title+note
 * card this replaces.
 *
 * Every structural piece survives — badge, rating stars, the two-column
 * spec/price block, the four-option row, the button — because those are
 * chrome that will look the same on every real product regardless of what
 * it sells. Only the four things that are actually this product's content
 * (photo, name, numbers, copy) become placeholders. "Order Now" stays as
 * real copy for the same reason: it is fixed UI microcopy, identical on
 * every card on the live site, not content anyone drafts per product.
 *
 * The four-option row doesn't assume mattress sizes — Chemicals has nothing
 * equivalent yet, so the options are unlabelled placeholders standing in for
 * whatever variant a chemical grade turns out to need (pack size, grade,
 * viscosity...). Same shape, no assumed meaning.
 */
const ORANGE = "#FF9A1F";

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

export default function WireframeProductCard() {
  const [selected, setSelected] = useState(0);

  return (
    <article className="flex h-full flex-col overflow-hidden bg-white shadow-[0_1px_8px_rgba(11,26,51,0.08)]">
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden bg-[#F4F6F8]">
        <ImagePlaceholder label="Photo" fill />
        <span className="absolute left-2.5 top-2.5 z-[2] bg-[#0b1a33] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
          Label text here
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3.5 pt-3 sm:px-3.5">
        <h3 className="text-[16px] font-bold leading-snug text-ink sm:text-[17px]">
          Label text here
        </h3>

        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-ink/70">
              <Stars />
              <span className="font-semibold tabular-nums text-ink">X.X</span>
              <span className="text-ink/30">|</span>
              <span>(XX)</span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-ink/45">Caption text here</p>
            <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-ink/55 sm:text-[12px]">
              Body text goes here.
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

        {/* Same shape as the mattress card's size row — unlabelled, since
            what a chemical grade's variant options even are isn't decided. */}
        <div className="mt-3 grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => {
            const on = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={on}
                className={`flex flex-col items-center gap-0.5 border px-0.5 py-1 transition-colors duration-300 ${
                  on ? "border-brand bg-brand/[0.04]" : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <span
                  aria-hidden
                  className="h-6 w-6 border border-dashed border-ink/25 bg-ink/[0.03] sm:h-7 sm:w-7"
                />
                <span
                  className={`text-[7.5px] font-bold uppercase tracking-[0.05em] ${
                    on ? "text-brand" : "text-ink/45"
                  }`}
                >
                  {i + 1}
                </span>
              </button>
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
