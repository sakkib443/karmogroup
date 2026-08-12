import { Josefin_Sans, Manrope } from "next/font/google";

import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderHomeTwo from "@/components/karmo/home-two/HeaderHomeTwo";
import HomeTwoFontSwitcher from "@/components/karmo/home-two/HomeTwoFontSwitcher";

/**
 * Home Two faces — Manrope (default) and Josefin Sans.
 * Scoped to this layout; the live `/` site keeps brand.ts fonts.
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

/**
 * Home Two runs on its own chrome, for the same reason every other homepage
 * design here does.
 *
 * The designs share a footer and nothing above it. Layouts nest rather than
 * replace, so a folder inside another group would still have rendered that
 * design's bar above this one — hence a group of its own. Route groups do not
 * appear in the URL, so this serves `/home-two`.
 *
 * Home One keeps `/` and is not touched by anything in here. When the client
 * picks between them, promoting this one is a rename of a route segment and
 * nothing else: the header, the offset below it and the footer all travel with
 * this layout.
 */
export default function KarmoHomeTwoLayout({
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
      <HeaderHomeTwo />
      {/* Clears the fixed header exactly: 32px top bar + 80px menu bar. */}
      <main className="min-h-screen overflow-x-hidden bg-white pt-[112px]">
        {children}
      </main>
      <Footer />
    </HomeTwoFontSwitcher>
  );
}
