import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderTwo from "@/components/karmo/home2/HeaderTwo";

/**
 * Archive of the previous live homepage chrome.
 *
 * Serves `/home-two` so the design that used to sit on `/` stays reachable
 * after Home Two was promoted to the front page.
 */
export default function KarmoHomeTwoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <HeaderTwo />
      <main className="min-h-screen overflow-x-hidden bg-white pt-[109px] lg:pt-[178px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
