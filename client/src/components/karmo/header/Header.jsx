"use client";

import { useEffect, useState } from "react";

import TopHeader from "@/components/karmo/header/TopHeader";
import Navbar from "@/components/karmo/header/Navbar";

const DAMASK = "/karmo/images/header/mattress-side-texture.jpg";

/**
 * Site header for the live marketing chrome — TopHeader + Navbar.
 * Page offset stays 112px (32 + 80 compact bar). The bar carries the
 * mattress-page damask (same file as the Mattress mega-menu and the
 * ideal-page ribbon), stretched across the full width and kept faint — the
 * look the bar had at the start of September (d579ffe).
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
            backgroundSize: "100% auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: scrolled ? 0.1 : 0.16,
            transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <Navbar scrolled={scrolled} />
      </div>
    </header>
  );
}
