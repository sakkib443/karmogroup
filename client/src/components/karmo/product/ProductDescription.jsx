"use client";

import { useId, useState } from "react";
import {
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiChevronDown,
  FiClipboard,
  FiDroplet,
  FiGrid,
  FiHeart,
  FiLayers,
  FiList,
  FiMaximize,
  FiPenTool,
  FiShield,
  FiSliders,
  FiStar,
  FiTag,
} from "react-icons/fi";

/** An icon for each line, picked from its label / words (falls back to its section's icon). */
const ICON_RULES = [
  [/spring|coil|motion/, FiActivity],
  [/moisture|dry|humid|water|air/, FiDroplet],
  [/hygien|safe|allerg|dust/, FiShield],
  [/cover|fabric|outer|knit|quilt|print/, FiGrid],
  [/foam|fill|padding|wave|layer|transition|base|inner/, FiLayers],
  [/design|aesthetic|pattern|colou?r/, FiPenTool],
  [/durab|care|wash|last|test|warrant/, FiAward],
  [/brand|line|type/, FiTag],
  [/size|dimension|piece|sold/, FiMaximize],
  [/comfort|feel|firm/, FiHeart],
  [/grade|density|technical|detail/, FiSliders],
];
const SECTION_ICONS = [
  [/inside/i, FiLayers],
  [/spec/i, FiClipboard],
  [/feature|benefit/i, FiStar],
  [/size/i, FiMaximize],
];
const sectionIcon = (heading) => (SECTION_ICONS.find(([re]) => re.test(heading)) || [null, FiList])[1];
const itemIcon = (item, heading) => {
  const key = `${item.label || ""}`.toLowerCase();
  const hit = key && ICON_RULES.find(([re]) => re.test(key));
  return hit ? hit[1] : sectionIcon(heading) === FiList ? FiCheckCircle : sectionIcon(heading);
};

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
            <div className="pb-10 pt-1">
              <div className="max-w-3xl">
                <h2 className="display text-[1.5rem] font-semibold leading-tight text-ink sm:text-[1.8rem]">{description.title}</h2>
                <p className="body-copy mt-3 text-[15px] leading-[1.7] text-ink/65">{description.intro}</p>
              </div>
              {description.sections.map((section) => {
                const SectionIcon = sectionIcon(section.heading);
                return (
                  <div key={section.heading} className="mt-8">
                    <div className="flex items-center gap-3">
                      <SectionIcon size={18} className="shrink-0 text-brand" aria-hidden />
                      <h3 className="display text-[1.05rem] font-semibold uppercase tracking-[0.06em] text-ink">{section.heading}</h3>
                      <span className="h-px flex-1 bg-ink/10" aria-hidden />
                    </div>
                    <ul className="mt-4 grid gap-3 md:grid-cols-2">
                      {section.items.map((item) => {
                        const Icon = itemIcon(item, section.heading);
                        return (
                          <li
                            key={item.label || item.text}
                            className="flex items-start gap-4 rounded-xl border border-ink/8 bg-[#faf8f5] p-4"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                              <Icon size={18} aria-hidden />
                            </span>
                            <span className="body-copy min-w-0 text-[14.5px] leading-[1.6] text-ink/65">
                              {item.label ? <b className="block text-[13px] font-bold uppercase tracking-[0.08em] text-ink">{item.label}</b> : null}
                              {item.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
