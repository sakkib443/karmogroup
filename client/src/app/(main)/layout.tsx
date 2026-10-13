import Header from "@/components/karmo/header/Header";
import CertifiedBy from "@/components/karmo/home/CertifiedBy";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";

/**
 * Public storefront routes (cart, checkout, products, product/[slug], category,
 * wishlist, payment/*, privacy, terms, refund, track).
 *
 * Same chrome as every karmo page: the main karmo Header, CertifiedBy above the
 * Footer. Offset clears the resting header (32px top bar + 104/112px nav row).
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="min-h-screen bg-white pt-[136px] sm:pt-[144px]">
        {children}
      </main>
      <CertifiedBy />
      <Footer />
    </>
  );
}
