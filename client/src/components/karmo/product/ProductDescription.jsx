"use client";

import { useId, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * The description under a product's buy box. Closed until clicked, on every
 * product page. `description` comes from productDescriptions.js.
 */
export default function ProductDescription({ description }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!description) return null;

  return (
    <section className="border-b border-ink/8 bg-white" aria-label="Product description">
      <div className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 md:px-10 lg:px-12">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
        >
          <span className="display text-[1.05rem] font-semibold uppercase tracking-[0.04em] text-ink sm:text-[1.2rem]">Description</span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-ink/55">
            {open ? "Close" : "View details"}
            <FiChevronDown size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
          </span>
        </button>

        <div id={panelId} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden" aria-hidden={!open}>
            <div className="max-w-3xl pb-8">
              <h2 className="display text-[1.5rem] font-semibold leading-tight text-ink sm:text-[1.8rem]">{description.title}</h2>
              <p className="body-copy mt-3 text-[15px] leading-[1.7] text-ink/65">{description.intro}</p>
              {description.sections.map((section) => (
                <div key={section.heading} className="mt-6">
                  <h3 className="display text-[1.1rem] font-semibold text-ink">{section.heading}</h3>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-5 marker:text-ink/35">
                    {section.items.map((item) => (
                      <li key={item.label || item.text} className="body-copy text-[15px] leading-[1.6] text-ink/65">
                        {item.label ? <b className="font-semibold text-ink/85">{item.label}: </b> : null}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
