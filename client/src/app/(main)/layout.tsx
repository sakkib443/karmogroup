import HeaderTwo from "@/components/karmo/home2/HeaderTwo";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";

/**
 * Public storefront routes (cart, checkout, shop, contact, …).
 *
 * Uses the same HeaderTwo + Footer chrome as the homepage / foam page.
 * Home 02 (`(karmo)/home-2`) and Home 03 (`(karmo-3)/home-3`) keep their
 * own layouts and are not wrapped here.
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
