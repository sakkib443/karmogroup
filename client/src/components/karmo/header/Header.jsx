"use client";

import { useEffect, useState } from "react";

import TopHeader from "@/components/karmo/header/TopHeader";
import Navbar from "@/components/karmo/header/Navbar";

/**
 * Site header for the live marketing chrome — TopHeader + Navbar.
 * Fixed 112px (32 + 80). Layout offsets the page by that height.
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
      className={`fixed inset-x-0 top-0 z-[10000] transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "bg-white/95 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md"
          : "bg-white shadow-[0_1px_0_rgba(34,34,34,0.08)]"
      }`}
    >
      <TopHeader />
      <Navbar />
    </header>
  );
}
