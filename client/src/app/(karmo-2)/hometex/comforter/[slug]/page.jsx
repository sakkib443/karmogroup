import { notFound } from "next/navigation";

import ComforterProductDetailPage from "@/components/karmo/product/comforter/ComforterProductDetailPage";
import {
  getComforterProductDetail,
  getComforterProductSlugs,
} from "@/components/karmo/product/comforter/comforterDetailData";

export function generateStaticParams() {
  return getComforterProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getComforterProductDetail(slug);
  if (!product) return { title: "Comforter — Karmo Group" };
  return {
    title: `${product.name} — Comforter | Karmo`,
    description: product.summary,
    alternates: { canonical: `/hometex/comforter/${product.slug}` },
  };
}

export default async function ComforterProductPage({ params }) {
  const { slug } = await params;
  const product = getComforterProductDetail(slug);
  if (!product) notFound();
  return <ComforterProductDetailPage product={product} />;
}
