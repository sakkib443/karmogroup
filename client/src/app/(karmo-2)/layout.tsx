import { Josefin_Sans, Manrope } from "next/font/google";

import Footer from "@/components/karmo/Footer";
import CertifiedBy from "@/components/karmo/home/CertifiedBy";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import Header from "@/components/karmo/header/Header";
import ThemeControl from "@/components/karmo/chrome/ThemeControl";
import HomeTwoSectionSnap from "@/components/karmo/chrome/HomeTwoSectionSnap";
import { CmsScope } from "@/cms/CmsProvider";
import { getPageContent } from "@/cms/server";

/**
 * Live homepage chrome — the Home Two header and offset, promoted to `/`.
 *
 * Faces below are loaded for the Theme Control panel. They are scoped to this
 * route group; when a winner is picked, it goes into `src/config/brand.ts`.
 *
 * Every option is written out in full — `next/font` needs literal call-site
 * values (Playfair also starts at 400, so it cannot share a weight list).
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
/* Only the faces the site uses. The Theme Control panel is off (ThemeControl.jsx,
   SHOW_PANEL), so its other choices are not loaded — every Google font fetched at
   build time is one more thing that can fail the deploy. */
const FACES = [manrope, josefin];

export default async function KarmoTwoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Site-wide content (logos, contact, shared bands) — Admin → Site content → Brand & contact.
  const site = await getPageContent("global");
  return (
    <ThemeControl
      classNames={FACES.map((f) => f.className).join(" ")}
      families={{
        manrope: manrope.style.fontFamily,
        josefin: josefin.style.fontFamily,
      }}
    >
      <CmsScope page="global" content={site}>
      <SmoothScroll />
      <HomeTwoSectionSnap />
      <Header />
      {/* Clears the fixed header exactly: 32px top bar + 80px menu bar. */}
      <main className="min-h-screen overflow-x-clip bg-white pt-[112px]">
        {children}
      </main>
      {/* Always glued above the footer on every karmo-2 page */}
      <CertifiedBy />
      <Footer />
      </CmsScope>
    </ThemeControl>
  );
}
