"use client";

import { useEffect, useState } from "react";

import TopHeader from "@/components/karmo/header/TopHeader";
import Navbar from "@/components/karmo/header/Navbar";

const DAMASK = "/karmo/images/header/mattress-side-texture.jpg";

/* The damask is a mattress side panel: a raised piped cord along the top, the
   pattern, then a second cord along the bottom. The bar shows the pattern very
   faintly and the two cords clearly — nothing else.
   Cord rows on the 1536×1024 file: top 18–72, bottom 938–992 (54 rows each).
   Each strip is sized so those 54 rows exactly fill it (1024/54 = 1896% of
   the strip's own height) and slid so only those rows show; the strip height
   is a share of the bar, so the cord follows the bar when it shrinks. */
const CORD_SIZE = "auto 1896.3%";
const CORD_TOP = "left 1.856%"; // 18/1024 of the scaled image
const CORD_BOTTOM = "left 96.7%"; // 938/1024 of the scaled image
const CORD_HEIGHT = "9%";
const CORD_TOP_OPACITY = 0.45; // sits under the red bar, reads heavier
const CORD_BOTTOM_OPACITY = 0.9;

const cordStyle = (position, opacity) => ({
  height: CORD_HEIGHT,
  backgroundImage: `url(${DAMASK})`,
  backgroundSize: CORD_SIZE,
  backgroundPosition: position,
  backgroundRepeat: "repeat-x",
  opacity,
});

/**
 * Site header for the live marketing chrome — TopHeader + Navbar.
 * Page offset stays 112px (32 + 80 compact bar). The bar carries the
 * mattress-page damask (same file as the Mattress mega-menu and the
 * ideal-page ribbon): faint pattern, clear piped edge top and bottom.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[10000] transition-[box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "shadow-[0_18px_36px_-20px_rgba(70,50,30,0.45)]"
          : ""
      }`}
    >
      <TopHeader />
      <div style={{ backgroundColor: "#fff" }} className={`header-mattress-band ${scrolled ? "is-scrolled" : ""}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{
            backgroundImage: `url(${DAMASK})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "left center",
            backgroundRepeat: "repeat-x",
            opacity: scrolled ? 0.12 : 0.18,
            transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
          style={cordStyle(CORD_TOP, CORD_TOP_OPACITY)}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
          style={cordStyle(CORD_BOTTOM, CORD_BOTTOM_OPACITY)}
        />
        <Navbar scrolled={scrolled} />
      </div>
    </header>
  );
}
