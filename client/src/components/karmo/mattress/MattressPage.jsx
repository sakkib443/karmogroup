"use client";

import { useState } from "react";

import MattressBanner from "@/components/karmo/mattress/MattressBanner";
import MattressFeatures from "@/components/karmo/mattress/MattressFeatures";
import MattressAbout from "@/components/karmo/mattress/MattressAbout";
import MattressCategories from "@/components/karmo/mattress/MattressCategories";
import MattressPromise from "@/components/karmo/mattress/MattressPromise";
import MattressProducts from "@/components/karmo/mattress/MattressProducts";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * Mattress division page — banner → features → about → categories → promise →
 * products → order/contact. Mirrors the homepage design language so the
 * spacing, width and image treatment match the rest of the site.
 */
export default function MattressPage() {
  const [categoryId, setCategoryId] = useState("all");

  return (
    <>
      <MattressBanner />
      <MattressFeatures />
      <MattressAbout />
      {/* Category gallery hidden at the client's ask — the product grid below
          just shows every model. Re-enable by uncommenting this line. */}
      {/* <MattressCategories activeId={categoryId} onSelect={setCategoryId} /> */}
      <MattressPromise />
      <MattressProducts categoryId={categoryId} />
      <OrderAndContact />
    </>
  );
}
