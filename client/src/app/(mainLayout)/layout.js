import Navbar from "@/components/sheard/Navbar";
import Footer from "@/components/sheard/Footer";
import Cursor from "@/components/Home/Cursor";
import SmoothScroll from "@/components/Home/SmoothScroll";

export default function MainLayout({ children }) {
  return (
    <>
      {/* Both bow out on touch and under prefers-reduced-motion, and both mount
          here rather than in the root layout so /home-2, which has a cursor of
          its own, is left alone. */}
      <Cursor />
      <SmoothScroll />
      <Navbar />
      {/* Offset for the fixed header: 80px bar, plus the 40px utility strip
          once it appears at lg. The hero cancels this to sit full bleed. */}
      <main className="min-h-screen pt-20 lg:pt-30">{children}</main>
      <Footer />
    </>
  );
}
