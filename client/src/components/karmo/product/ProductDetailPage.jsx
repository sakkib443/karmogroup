"use client";

import Link from "next/link";
import ProductHero from "@/components/karmo/product/ProductHero";
import ProductPromiseStrip from "@/components/karmo/product/ProductPromiseStrip";
import ProductFeatureSlides from "@/components/karmo/product/ProductFeatureSlides";
import ProductMattressBanner from "@/components/karmo/product/ProductMattressBanner";
import ProductLayers from "@/components/karmo/product/ProductLayers";
import ProductFirmnessScale from "@/components/karmo/product/ProductFirmnessScale";
import ProductVideoFeatures from "@/components/karmo/product/ProductVideoFeatures";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

/**
 * Matrexx mattress product detail — buy box, promise icons, comfort morph,
 * then firmness scale and build layers as separate full-width sections.
 */
export default function ProductDetailPage({ product }) {
  if (!product) {
    return (
      <div className="shell py-24 text-center">
        <p className="text-sm text-ink/50">Product not found.</p>
        <Link
          href="/mattress"
          className="mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.14em] text-brand"
        >
          Back to mattress
        </Link>
      </div>
    );
  }

  return (
    <>
      <ProductHero product={product} />
      <ProductPromiseStrip />
      <ProductFeatureSlides />
      <ProductMattressBanner />
      <ProductFirmnessScale />
      <ProductLayers />
      <ProductVideoFeatures features={product.features} />
      <OrderAndContact />
    </>
  );
}
