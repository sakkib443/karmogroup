import { notFound } from "next/navigation";

import FoamProductDetailPage from "@/components/karmo/product/FoamProductDetailPage";
import {
  getFoamProductDetail,
  getFoamProductSlugs,
} from "@/components/karmo/product/foamProductDetailData";

/**
 * `/foam/[slug]` — Karmo Foam product detail for one catalogue SKU.
 */

export function generateStaticParams() {
  return getFoamProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getFoamProductDetail(slug);
  if (!product) {
    return { title: "Foam — Karmo Group" };
  }
  return {
    title: `${product.name} — Karmo Foam | Karmo`,
    description: product.description || product.line,
    alternates: { canonical: `/foam/${product.slug}` },
  };
}

export default async function FoamProductPage({ params }) {
  const { slug } = await params;
  const product = getFoamProductDetail(slug);
  if (!product) notFound();

  return <FoamProductDetailPage product={product} />;
}
