"use client";

import Link from "next/link";
import FoamHero from "@/components/karmo/product/foam/FoamHero";
import FoamCatalogueSheet from "@/components/karmo/product/foam/FoamCatalogueSheet";
import FoamRelated from "@/components/karmo/product/foam/FoamRelated";
import ProductPromiseStrip, { FOAM_PROMISES } from "@/components/karmo/product/ProductPromiseStrip";
import ProductFoamFeatureSlides from "@/components/karmo/product/ProductFoamFeatureSlides";
import ProductFoamBuildAside from "@/components/karmo/product/ProductFoamBuildAside";
import FoamStaticDetail from "@/components/karmo/product/foam/FoamStaticDetail";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";
import { isFoamSet } from "@/components/karmo/product/catalogueQuote";

/**
 * Karmo Foam product detail. Poly is a static poster page.
 * The other grades keep the buy box, catalogue sheet and rubber-grade copy.
 */
export default function FoamProductDetailPage({ product }) {
  if (!product) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink/50">Product not found.</p>
        <Link href="/foam" className="mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.14em] text-brand">
          Back to foam
        </Link>
      </div>
    );
  }

  if (isFoamSet(product)) {
    return (
      <>
        <FoamStaticDetail product={product} />
        <FoamCatalogueSheet catalogue={product.catalogue} />
        <ProductPromiseStrip items={FOAM_PROMISES} />
        <FoamRelated current={product.slug} />
        <OrderAndContact />
      </>
    );
  }

  return (
    <>
      <FoamHero product={product} />
      <FoamCatalogueSheet catalogue={product.catalogue} />
      <ProductPromiseStrip items={FOAM_PROMISES} />
      <ProductFoamFeatureSlides />
      <ProductFoamBuildAside />
      <FoamRelated current={product.slug} />
      <OrderAndContact />
    </>
  );
}
