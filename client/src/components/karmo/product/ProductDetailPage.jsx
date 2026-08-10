"use client";

import Link from "next/link";
import ProductHero from "@/components/karmo/product/ProductHero";
import ProductPromiseStrip from "@/components/karmo/product/ProductPromiseStrip";
import ProductLifestyle from "@/components/karmo/product/ProductLifestyle";
import ProductFirmnessGuide from "@/components/karmo/product/ProductFirmnessGuide";
import ProductLayers from "@/components/karmo/product/ProductLayers";
import ProductVideoFeatures from "@/components/karmo/product/ProductVideoFeatures";
import CertifiedBy from "@/components/karmo/home2/CertifiedBy";
import OrderAndContact from "@/components/karmo/home2/OrderAndContact";

/**
 * Karmo product detail — buy box, then organised story sections
 * (no third-party demo image strips).
 */
export default function ProductDetailPage({ product }) {
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
      <ProductPromiseStrip />
      <ProductLifestyle />
      <ProductFirmnessGuide />
      <ProductLayers />
      <ProductVideoFeatures features={product.features} />
      <CertifiedBy />
      <OrderAndContact />
    </>
  );
}
