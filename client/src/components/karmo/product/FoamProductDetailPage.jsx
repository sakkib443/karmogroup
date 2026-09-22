"use client";

import Link from "next/link";
import ProductHero from "@/components/karmo/product/ProductHero";
import ProductPromiseStrip, {
  FOAM_PROMISES,
} from "@/components/karmo/product/ProductPromiseStrip";
import ProductFoamFeatureSlides from "@/components/karmo/product/ProductFoamFeatureSlides";
import ProductFoamBanner from "@/components/karmo/product/ProductFoamBanner";
import ProductDensityScale from "@/components/karmo/product/ProductDensityScale";
import ProductFoamBuildAside from "@/components/karmo/product/ProductFoamBuildAside";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

/**
 * Karmo Foam product detail — mirrors Matrexx PDP stack with foam-specific
 * middle bands (density, morph lifestyle, foam banner / build).
 */
export default function FoamProductDetailPage({ product }) {
  if (!product) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink/50">Product not found.</p>
        <Link
          href="/foam"
          className="mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.14em] text-brand"
        >
          Back to foam
        </Link>
      </div>
    );
  }

  return (
    <>
      <ProductHero product={product} />
      <ProductPromiseStrip items={FOAM_PROMISES} />
      <ProductFoamFeatureSlides />
      <ProductFoamBanner />
      <ProductDensityScale highlight={product.density || product.firmness || "Firm support"} />
      <ProductFoamBuildAside />
      <OrderAndContact />
    </>
  );
}
