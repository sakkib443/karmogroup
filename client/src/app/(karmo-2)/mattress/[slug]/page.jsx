import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/karmo/product/ProductDetailPage";
import {
  getMattressProductDetail,
  getMattressProductSlugs,
} from "@/components/karmo/product/productDetailData";

/**
 * `/mattress/[slug]` — Matrexx product detail for one catalogue SKU.
 */

export function generateStaticParams() {
  return getMattressProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getMattressProductDetail(slug);
  if (!product) {
    return { title: "Mattress — Karmo Group" };
  }
  return {
    title: `${product.name} — Matrexx | Karmo`,
    description: product.description || product.line,
    alternates: { canonical: `/mattress/${product.slug}` },
  };
}

export default async function MattressProductPage({ params }) {
  const { slug } = await params;
  const product = getMattressProductDetail(slug);
  if (!product) notFound();

  return <ProductDetailPage product={product} />;
}
