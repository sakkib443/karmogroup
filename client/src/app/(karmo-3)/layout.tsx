import Footer from "@/components/karmo/Footer";
import HeaderAnantaOverlaid from "@/components/karmo/home3/HeaderAnantaOverlaid/HeaderAnantaOverlaid";
import SmoothScroll from "@/components/karmo/SmoothScroll";

/**
 * Home 03 layout with transparent overlaid header.
 */
export default function KarmoThreeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <HeaderAnantaOverlaid />
      <main className="min-h-screen bg-black pt-0">{children}</main>
      <Footer />
    </>
  );
}

