import Header from "@/components/karmo/header/Header";
import CertifiedBy from "@/components/karmo/home/CertifiedBy";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import { CmsScope } from "@/cms/CmsProvider";
import { getPageContent } from "@/cms/server";

/**
 * Public storefront routes (cart, checkout, products, product/[slug], category,
 * wishlist, payment/*, privacy, terms, refund, track).
 *
 * Same chrome as every karmo page: the main karmo Header, CertifiedBy above the
 * Footer. Offset clears the resting header (32px top bar + 104/112px nav row).
 */
export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Logos, contact and shared bands — Admin → Site content → Brand & contact.
  const site = await getPageContent("global");
  return (
    <CmsScope page="global" content={site}>
      <SmoothScroll />
      <Header />
      <main className="min-h-screen bg-white pt-[136px] sm:pt-[144px]">
        {children}
      </main>
      <CertifiedBy />
      <Footer />
    </CmsScope>
  );
}
