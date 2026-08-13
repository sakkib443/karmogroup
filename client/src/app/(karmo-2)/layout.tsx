import {
  DM_Sans,
  Figtree,
  Inter,
  Josefin_Sans,
  Lexend,
  Lora,
  Manrope,
  Montserrat,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Sora,
  Space_Grotesk,
  Urbanist,
  Work_Sans,
} from "next/font/google";

import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderHomeTwo from "@/components/karmo/home-two/HeaderHomeTwo";
import ThemeControl from "@/components/karmo/home-two/ThemeControl";
import HomeTwoSectionSnap from "@/components/karmo/home-two/HomeTwoSectionSnap";

/**
 * Live homepage chrome — the Home Two header and offset, promoted to `/`.
 *
 * The ten faces below are loaded for the Theme Control panel, which lets the
 * client try a typeface on the real page instead of choosing one from a
 * description. They are scoped to this route group, so the rest of the site is
 * unaffected; when a winner is picked, it goes into `src/config/brand.ts` and
 * the other nine imports (and the panel) come out.
 *
 * Every option is written out in full rather than shared from a constant.
 * `next/font` is resolved at build time by reading the call site, so it needs
 * literal values — passing a spread array fails with "Missing weight" even when
 * the weights are ones the family actually has. Playfair also starts at 400,
 * so it could not have shared a list anyway.
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const dmsans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const worksans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const spacegrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const FACES = [
  manrope,
  josefin,
  inter,
  jakarta,
  dmsans,
  outfit,
  poppins,
  montserrat,
  worksans,
  playfair,
  sora,
  urbanist,
  figtree,
  lexend,
  spacegrotesk,
  lora,
];

export default function KarmoTwoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeControl
      classNames={FACES.map((f) => f.className).join(" ")}
      families={{
        manrope: manrope.style.fontFamily,
        josefin: josefin.style.fontFamily,
        inter: inter.style.fontFamily,
        jakarta: jakarta.style.fontFamily,
        dmsans: dmsans.style.fontFamily,
        outfit: outfit.style.fontFamily,
        poppins: poppins.style.fontFamily,
        montserrat: montserrat.style.fontFamily,
        worksans: worksans.style.fontFamily,
        playfair: playfair.style.fontFamily,
        sora: sora.style.fontFamily,
        urbanist: urbanist.style.fontFamily,
        figtree: figtree.style.fontFamily,
        lexend: lexend.style.fontFamily,
        spacegrotesk: spacegrotesk.style.fontFamily,
        lora: lora.style.fontFamily,
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
    </ThemeControl>
  );
}
