import { notFound } from "next/navigation";

import PillowProductDetailPage from "@/components/karmo/product/pillow/PillowProductDetailPage";
import {
  getPillowProductDetail,
  getPillowProductSlugs,
} from "@/components/karmo/product/pillow/pillowDetailData";

export function generateStaticParams() {
  return getPillowProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getPillowProductDetail(slug);
  if (!product) return { title: "Pillow — Karmo Group" };
  return {
    title: `${product.name} — Pillow | Karmo`,
    description: product.summary,
    alternates: { canonical: `/hometex/pillow/${product.slug}` },
  };
}

export default async function PillowProductPage({ params }) {
  const { slug } = await params;
  const product = getPillowProductDetail(slug);
  if (!product) notFound();
  return <PillowProductDetailPage product={product} />;
}
