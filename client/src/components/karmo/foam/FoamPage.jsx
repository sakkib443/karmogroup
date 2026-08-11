"use client";

import { useState } from "react";

import FoamBanner from "@/components/karmo/foam/FoamBanner";
import FoamFeatures from "@/components/karmo/foam/FoamFeatures";
import FoamCategories from "@/components/karmo/foam/FoamCategories";
import FoamProducts from "@/components/karmo/foam/FoamProducts";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * Foam division page — banner → features → categories → products →
 * order/contact (shared band under every division catalogue).
 */
export default function FoamPage() {
  const [categoryId, setCategoryId] = useState("all");

  return (
    <>
      <FoamBanner />
      <FoamFeatures />
      <FoamCategories activeId={categoryId} onSelect={setCategoryId} />
      <FoamProducts categoryId={categoryId} />
      <OrderAndContact />
    </>
  );
}
