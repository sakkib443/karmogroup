import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";
import HeaderThree from "@/components/karmo/home3/HeaderThree";

/**
 * Home 03 runs on its own chrome, for the same reason Home 02 does.
 *
 * The three designs share a footer and nothing above it. Layouts nest rather
 * than replace, so a folder inside (karmo) would still have rendered Home 01's
 * dark bar above this one — hence a third route group. Route groups do not
 * appear in the URL, so `/home-3` is unchanged and the Navbar entry pointing at
 * it still works.
 *
 * `page.jsx` used to sit in (karmo) and inherit Home 01's Navbar. That made the
 * comparison useless above the fold: two of the three designs were being judged
 * on the same header.
 *
 * When one of the three wins, the two losing groups go and the winner's layout
 * moves up to serve `/`.
 */
export default function KarmoThreeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Bows out on touch and under prefers-reduced-motion. */}
      <SmoothScroll />
      <HeaderThree />
      {/* Clears the fixed header exactly, and this is the only number to keep
          in step with it. HeaderThree is one row of a fixed 72px at every
          breakpoint — it has no announcement strip to roll away and no
          navigation row that appears at lg, so unlike the other two layouts
          there is no second figure here and no state in which the offset is
          wrong. Its search sheet and division panel hang below the bar rather
          than growing it, for the same reason. */}
      <main className="min-h-screen pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
