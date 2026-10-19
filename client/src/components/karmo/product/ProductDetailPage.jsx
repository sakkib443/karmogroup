"use client";

import Link from "next/link";
import ProductHero from "@/components/karmo/product/ProductHero";
import ProductPromiseStrip from "@/components/karmo/product/ProductPromiseStrip";
import ProductFeatureSlides from "@/components/karmo/product/ProductFeatureSlides";
import ProductFirmnessScale from "@/components/karmo/product/ProductFirmnessScale";
import ProductBuildAside from "@/components/karmo/product/ProductBuildAside";
import ProductVideoFeatures from "@/components/karmo/product/ProductVideoFeatures";
import ProductInside from "@/components/karmo/product/ProductInside";
import MattressFilmStage from "@/components/karmo/division/MattressFilmStage";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

/**
 * Matrexx mattress product detail — buy box through build band, then the same
 * order/contact strip as home and /mattress (above Built on trust / CertifiedBy).
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
      <ProductInside product={product} />
      <ProductFeatureSlides />
      {product.film ? (
        <MattressFilmStage
          src={product.film.src}
          still={product.film.poster}
          alt={`${product.name} film`}
          heading={product.film.heading}
          headingScale={1.2}
        />
      ) : null}
      <ProductVideoFeatures features={product.featureBands || []} />
      <ProductFirmnessScale highlight={product.firmness || "Medium Firm"} />
      <ProductBuildAside />
      <OrderAndContact />
    </>
  );
}
