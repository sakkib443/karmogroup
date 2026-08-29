import {
  Barlow,
  DM_Sans,
  Figtree,
  IBM_Plex_Sans,
  Inter,
  Josefin_Sans,
  Karla,
  Lexend,
  Libre_Franklin,
  Lora,
  Manrope,
  Montserrat,
  Mulish,
  Open_Sans,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Public_Sans,
  Raleway,
  Roboto,
  Sora,
  Source_Sans_3,
  Space_Grotesk,
  Urbanist,
  Work_Sans,
} from "next/font/google";

import Footer from "@/components/karmo/Footer";
import CertifiedBy from "@/components/karmo/home/CertifiedBy";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import Header from "@/components/karmo/header/Header";
import ThemeControl from "@/components/karmo/chrome/ThemeControl";
import HomeTwoSectionSnap from "@/components/karmo/chrome/HomeTwoSectionSnap";

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
const opensans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const sourcesans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const ibmplex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const publicsans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const librefranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const karla = Karla({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  opensans,
  roboto,
  sourcesans,
  ibmplex,
  publicsans,
  librefranklin,
  mulish,
  raleway,
  karla,
  barlow,
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
        opensans: opensans.style.fontFamily,
        roboto: roboto.style.fontFamily,
        sourcesans: sourcesans.style.fontFamily,
        ibmplex: ibmplex.style.fontFamily,
        publicsans: publicsans.style.fontFamily,
        librefranklin: librefranklin.style.fontFamily,
        mulish: mulish.style.fontFamily,
        raleway: raleway.style.fontFamily,
        karla: karla.style.fontFamily,
        barlow: barlow.style.fontFamily,
      }}
    >
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
    </ThemeControl>
  );
}
