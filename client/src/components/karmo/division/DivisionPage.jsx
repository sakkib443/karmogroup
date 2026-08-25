"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import DivisionBanner from "@/components/karmo/division/DivisionBanner";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionAbout from "@/components/karmo/division/DivisionAbout";
import DivisionCategories from "@/components/karmo/division/DivisionCategories";
import DivisionPromise from "@/components/karmo/division/DivisionPromise";
import DivisionSpotlight from "@/components/karmo/division/DivisionSpotlight";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import ExploreSplit from "@/components/karmo/home/ExploreSplit";
import DivisionRecommended from "@/components/karmo/division/DivisionRecommended";
import DivisionShapeGrid from "@/components/karmo/division/DivisionShapeGrid";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

function ZonesIcon({ id, className = "" }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {id === "springs" && (
        <>
          <rect x="6" y="8" width="5" height="16" rx="2.5" {...stroke} />
          <rect x="13.5" y="8" width="5" height="16" rx="2.5" {...stroke} />
          <rect x="21" y="8" width="5" height="16" rx="2.5" {...stroke} />
        </>
      )}
      {id === "pillow" && (
        <>
          <path
            d="M5 18c0-4 3.2-7 8-7h6c4.8 0 8 3 8 7v2.5c0 1.4-1.1 2.5-2.5 2.5h-17A2.5 2.5 0 0 1 5 20.5V18Z"
            {...stroke}
          />
          <path d="M9 13.5c1.2-1.4 2.8-2 5-2" {...stroke} />
        </>
      )}
      {id === "foam" && (
        <>
          <rect x="5" y="10" width="22" height="4" rx="1" {...stroke} />
          <rect x="5" y="16" width="22" height="3.5" rx="1" {...stroke} />
          <rect x="5" y="21.5" width="22" height="3" rx="1" {...stroke} />
        </>
      )}
    </svg>
  );
}

/**
 * The ONE template behind every category page — Foam, HomeTex, Mattress and
 * Chemicals:
 *
 *   banner → features → about → [categories] → promise → [spotlight] → products → order
 *
 * Mattress hides the product hero (`banner.hidden`) and lifts the overlay
 * about band into that slot (`about.asHero`), so the page opens on the
 * lifestyle carousel instead. An optional `lounge` photo band sits under
 * the icon strip. Other divisions keep the default order.
 *
 * The page passes a single `data` object (see `src/data/divisions/`); this file
 * owns the section order and the shared design. Change a section here and all
 * four pages change together — that is the whole point.
 *
 * The category gallery is hidden by default. Uncomment the
 * `<DivisionCategories>` line to bring it back on every page at once; the
 * filter state is already wired.
 */
export default function DivisionPage({ data }) {
  const [categoryId, setCategoryId] = useState("all");

  return (
    <>
      {!data.banner?.hidden && <DivisionBanner {...data.banner} />}
      {data.about?.asHero && <DivisionAbout {...data.about} />}
      <DivisionFeatures items={data.features} />
      {data.recommended?.columns && (
        <DivisionRecommended {...data.recommended} />
      )}
      {data.shapeGrid && <DivisionShapeGrid {...data.shapeGrid} />}
      {data.explore && <ExploreSplit {...data.explore} />}
      {data.lounge && <DivisionAbout {...data.lounge} />}
      {!data.about?.asHero && <DivisionAbout {...data.about} />}

      {/* Hidden at the client's ask — the product grid below shows every model.
          Re-enable on all four pages by uncommenting this one line. */}
      {/* <DivisionCategories
        items={data.categories?.items ?? []}
        activeId={categoryId}
        onSelect={setCategoryId}
      /> */}

      {data.promise && !data.promise.hidden && (
        <DivisionPromise {...data.promise} />
      )}
      {data.spotlight && data.promise && (
        <DivisionSpotlight
          claims={data.promise.claims}
          film={data.promise.film}
          still={data.promise.still}
        />
      )}
      {data.zones && (
        <section className="relative mb-1.5 w-full overflow-hidden bg-[#d8e8f4]">
          <Image
            src={data.zones.src}
            alt={data.zones.alt}
            width={data.zones.width}
            height={data.zones.height}
            className="h-auto w-full"
            sizes="100vw"
            priority={false}
          />
          {/* Hard-edged solid rail on the left — mirrored from the reference
              right panel: one flat colour, copy + icons + CTA. */}
          <div className="absolute inset-y-0 left-0 z-[1] flex w-[42%] max-w-[420px] flex-col justify-center bg-[#0b1a33] px-5 py-6 sm:w-[36%] sm:px-7 lg:w-[32%] lg:max-w-[460px] lg:px-9">
            <h2 className="display text-[1.35rem] font-bold uppercase leading-[1.12] tracking-[0.02em] text-white sm:text-[1.65rem] lg:text-[1.95rem]">
              {data.zones.heading}
            </h2>
            {data.zones.icons?.length > 0 && (
              <ul className="mt-5 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
                {data.zones.icons.map((icon) => (
                  <li key={icon.id} className="flex flex-col items-center text-center">
                    <ZonesIcon id={icon.id} className="h-9 w-9 text-white sm:h-10 sm:w-10" />
                    <span className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.06em] text-white/85 sm:text-[11px]">
                      {icon.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {data.zones.cta && (
              <Link
                href={data.zones.cta.href}
                className="mt-6 inline-flex h-[44px] w-full items-center justify-center gap-2 bg-brand text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-brand-dark sm:mt-7 sm:h-[48px]"
              >
                {data.zones.cta.label}
                <FiArrowRight className="text-[15px]" />
              </Link>
            )}
          </div>
        </section>
      )}
      <DivisionProducts {...data.products} categoryId={categoryId} />
      <OrderAndContact />
    </>
  );
}
