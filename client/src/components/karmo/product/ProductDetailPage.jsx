"use client";

import Link from "next/link";
import ProductHero from "@/components/karmo/product/ProductHero";
import ProductDescription from "@/components/karmo/product/ProductDescription";
import { mattressDescription } from "@/components/karmo/product/productDescriptions";
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
      <ProductDescription description={mattressDescription(product)} />
      <ProductPromiseStrip />
      {/* The animated 'moving layers' build band (ProductInsideFilm) was taken off the page (client, 22 Nov 2026) — the picture band below shows the same layers. */}
      <ProductInside product={product} />
      <ProductFeatureSlides product={product} />
      {product.film ? (
        <MattressFilmStage
          src={product.film.src}
          still={product.film.poster}
          alt={`${product.name} film`}
          heading={product.film.heading}
          headingScale={1.2}
          /* One screen under the 112px header plus a little more (52px) — client's ask, 22 Nov 2026. */
          minH="calc(100svh - 60px)"
        />
      ) : null}
      <ProductVideoFeatures features={product.featureBands || []} />
      <ProductFirmnessScale highlight={product.firmness || "Medium Firm"} />
      <ProductBuildAside product={product} />
      <OrderAndContact />
    </>
  );
}
