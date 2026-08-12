import { Josefin_Sans, Manrope } from "next/font/google";

import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderHomeTwo from "@/components/karmo/home-two/HeaderHomeTwo";
import HomeTwoFontSwitcher from "@/components/karmo/home-two/HomeTwoFontSwitcher";
import HomeTwoSectionSnap from "@/components/karmo/home-two/HomeTwoSectionSnap";

/**
 * Live homepage chrome — the Home Two header and offset, promoted to `/`.
 *
 * Manrope / Josefin stay scoped here via the font switcher. Foam, About and
 * Portfolio in this group inherit the same bar so the storefront reads as one
 * site.
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function KarmoTwoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HomeTwoFontSwitcher
      classNames={`${manrope.className} ${josefin.className}`}
      families={{
        manrope: manrope.style.fontFamily,
        josefin: josefin.style.fontFamily,
      }}
    >
      <SmoothScroll />
      <HomeTwoSectionSnap />
      <HeaderHomeTwo />
      {/* Clears the fixed header exactly: 32px top bar + 80px menu bar. */}
      <main className="min-h-screen overflow-x-hidden bg-white pt-[112px]">
        {children}
      </main>
      <Footer />
    </HomeTwoFontSwitcher>
  );
}
