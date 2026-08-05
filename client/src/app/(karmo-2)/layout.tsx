import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderTwo from "@/components/karmo/home2/HeaderTwo";

/**
 * Home 02 runs on its own chrome.
 *
 * The three homepage designs share a footer and nothing above it. Home 01 sits
 * in (karmo) under the dark bar that floats over its hero; this group exists so
 * Home 02 can carry the light three-row retail header instead. A nested layout
 * would not have done it — layouts nest rather than replace, so Home 01's bar
 * would still have rendered above this one.
 *
 * When one of the three designs wins, the losing groups go and the winner's
 * layout moves up to serve `/`.
 */
export default function KarmoTwoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SmoothScroll />
      <HeaderTwo />
      {/* Clears the fixed header exactly: 40px announcement + 74px identity
          row, plus 68px of navigation from lg up. All three are fixed heights
          in HeaderTwo for this reason — if a row grew with its contents, every
          page would start that far underneath the bar.
          The announcement rolls away on scroll but the offset does not follow
          it; the page would jump under the reader if it did. A hero that wants
          to sit beneath the bar cancels this itself. */}
      {/* White ground for the whole page. The storefront's `body` runs on the
          pale blue --color-background (#F8FAFC), which showed through wherever
          a section is transparent — most visibly in the gutters beside the
          trust strip, as a pale band between the hero and the sections under
          it. Set here rather than on `body` so the other 68 storefront pages
          keep the background they were built on. */}
      <main className="min-h-screen bg-white pt-[114px] lg:pt-[182px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
