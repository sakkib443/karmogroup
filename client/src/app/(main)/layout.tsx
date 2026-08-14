import HeaderTwo from "@/components/karmo/home2/HeaderTwo";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";

/**
 * Public storefront routes (cart, checkout, shop, contact, …).
 *
 * Uses the same HeaderTwo + Footer chrome as the foam page. The homepage
 * itself sits in `(karmo-2)` and carries its own `Header` chrome, so
 * it is not wrapped here.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <HeaderTwo />
      <main className="min-h-screen bg-white pt-[109px] lg:pt-[178px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
