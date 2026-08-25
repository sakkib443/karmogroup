"use client";

import { useEffect, useState } from "react";

import TopHeader from "@/components/karmo/header/TopHeader";
import Navbar from "@/components/karmo/header/Navbar";

/**
 * Site header for the live marketing chrome — TopHeader + Navbar.
 * Fixed 112px (32 + 80). Layout offsets the page by that height.
 * The 80px bar sits on a mattress side-panel texture (damask + welt piping).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      <div className={`header-mattress-band ${scrolled ? "is-scrolled" : ""}`}>
        <Navbar />
      </div>
    </header>
  );
}
