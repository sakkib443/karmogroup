"use client";

import { useState } from "react";

import DivisionBanner from "@/components/karmo/division/DivisionBanner";
import DivisionFeatures from "@/components/karmo/division/DivisionFeatures";
import DivisionAbout from "@/components/karmo/division/DivisionAbout";
import DivisionCategories from "@/components/karmo/division/DivisionCategories";
import DivisionPromise from "@/components/karmo/division/DivisionPromise";
import DivisionProducts from "@/components/karmo/division/DivisionProducts";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * The ONE template behind every category page — Foam, HomeTex, Mattress and
 * Chemicals. Modelled on the client's ideal mattress page:
 *
 *   banner → features → about → [categories] → promise → products → order
 *
 * The page passes a single `data` object (see `src/data/divisions/`); this file
 * owns the section order and the shared design. Change a section here and all
 * four pages change together — that is the whole point.
 *
 * The category gallery is hidden by default (the ideal mattress page hides it).
 * Uncomment the `<DivisionCategories>` line to bring it back on every page at
 * once; the filter state is already wired.
 */
export default function DivisionPage({ data }) {
  const [categoryId, setCategoryId] = useState("all");

  return (
    <>
      <DivisionBanner {...data.banner} />
      <DivisionFeatures items={data.features} />
      <DivisionAbout {...data.about} />

      {/* Hidden at the client's ask — the product grid below shows every model.
          Re-enable on all four pages by uncommenting this one line. */}
      {/* <DivisionCategories
        items={data.categories?.items ?? []}
        activeId={categoryId}
        onSelect={setCategoryId}
      /> */}

      <DivisionPromise {...data.promise} />
      <DivisionProducts {...data.products} categoryId={categoryId} />
      <OrderAndContact />
    </>
  );
}
