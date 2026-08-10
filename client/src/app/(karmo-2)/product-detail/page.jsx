import ProductDetailPage from "@/components/karmo/product/ProductDetailPage";
import { getSharedProductDetail } from "@/components/karmo/product/productDetailData";

export const metadata = {
  title: "Product details — Karmo",
  description:
    "Karmo foam product details — gallery, size options, and order.",
  alternates: { canonical: "/product-detail" },
};

export default function Page() {
  return <ProductDetailPage product={getSharedProductDetail()} />;
}
