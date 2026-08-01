import Navbar from "@/components/sheard/Navbar";
import Footer from "@/components/sheard/Footer";
import SmoothScroll from "@/components/Home/SmoothScroll";

export default function MainLayout({ children }) {
  return (
    <>
      {/* Bows out on touch and under prefers-reduced-motion, and mounts here
          rather than in the root layout so /home-2 is left alone. */}
      <SmoothScroll />
      <Navbar />
      {/* Offset for the fixed header: 80px bar, plus the 40px utility strip
          once it appears at lg. The hero cancels this to sit full bleed. */}
      <main className="min-h-screen pt-20 lg:pt-30">{children}</main>
      <Footer />
    </>
  );
}
