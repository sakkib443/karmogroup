"use client";

import { useReducedMotion } from "framer-motion";

const WORDS = ["Foam", "Mattress", "HomeTex", "Chemicals", "Polymers", "Bedding"];

/**
 * A band of outlined display type running edge to edge. It exists to break the
 * rhythm between two dark photographic sections — the page needs one moment
 * that is type and nothing else.
 *
 * The row is rendered twice and travels exactly half its own width, so the
 * second copy lands where the first began and the loop has no seam. Same
 * technique as the Gallery marquee on Home 01, reused rather than reinvented.
 */
export default function Ticker() {
  const reduceMotion = useReducedMotion();
  const doubled = [...WORDS, ...WORDS];

  return (
    <section className="border-y border-white/10 bg-shade-deep py-8 md:py-10">
      <div className="marquee-rows overflow-hidden">
        <div className={reduceMotion ? "flex overflow-x-auto" : "marquee marquee-left"}>
          <div className="flex w-max items-center">
            {doubled.map((word, index) => (
              <span
                key={`${word}-${index}`}
                aria-hidden={index >= WORDS.length || undefined}
                className="flex items-center"
              >
                <span
                  className="display px-8 text-[2.5rem] font-bold uppercase leading-none tracking-tight text-transparent md:px-12 md:text-[4rem]"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
                >
                  {word}
                </span>
                <span className="h-2 w-2 shrink-0 rotate-45 bg-brand" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
