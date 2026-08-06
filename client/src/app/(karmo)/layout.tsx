import type { Metadata } from "next";

import Navbar from "@/components/karmo/Navbar";
import Footer from "@/components/karmo/Footer";
import SmoothScroll from "@/components/karmo/SmoothScroll";

/**
 * The dark-bar homepage design runs on its own chrome.
 *
 * It carries the Karmo bar — the utility strip, the wordmark, the division
 * menu — rather than the storefront header, which is built around search, cart
 * and wishlist and belongs on the pages where someone is actually shopping.
 * Everything else stays in (main) with that header.
 *
 * This group served `/` until 5 August 2026 and now serves `/home-2`; the
 * design in (karmo-2) took the front page. The swap was a rename of the route
 * segment in each group, so both designs kept the header and spacing their own
 * layout gives them.
 *
 * The footer is the same one on both, so it is imported in each layout rather
 * than lifted to the root: the root layout also wraps the dashboard and the
 * auth pages, which want neither.
 */
export const metadata: Metadata = {
  title: "Karmo Group — Foam, Mattress, HomeTex & Chemicals since 1965",
  description:
    "Karmo has manufactured in Bangladesh since 1965. From the foam inside a sofa to the mattress on the bed and the adhesive holding it together, it is made in our own plants.",
  alternates: { canonical: "/" },
};

export default function KarmoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Bows out on touch and under prefers-reduced-motion. Mounted here
          rather than in the root layout so the dashboard, which has its own
          scrolling panes, is left alone. */}
      <SmoothScroll />
      <Navbar />
      {/* Offset for the fixed header: 80px bar, plus the 40px utility strip
          once it appears at lg. The hero cancels this to sit full bleed. */}
      <main className="min-h-screen pt-20 lg:pt-30">{children}</main>
      <Footer />
    </>
  );
}
