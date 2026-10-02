"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import TopHeader from "@/components/karmo/header/TopHeader";
import Navbar from "@/components/karmo/header/Navbar";

const PHOTO = "/karmo/images/header/mattress-quilt-user-hq.png";
const DAMASK = "/karmo/images/header/mattress-side-texture.jpg";
const SKIN_KEY = "karmo-header-texture";

/**
 * Site header for the live marketing chrome — TopHeader + Navbar.
 * Page offset stays 112px (32 + 80 compact bar). Client can switch the
 * bar texture: current photo quilt vs the mattress-page damask
 * (same file as the Mattress mega-menu and the ideal-page ribbon).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [skin, setSkin] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SKIN_KEY);
      if (saved === "1") setSkin(1);
    } catch {
      /* ignore */
    }
  }, []);

  const go = (next) => {
    const value = (next + 2) % 2;
    setSkin(value);
    try {
      window.localStorage.setItem(SKIN_KEY, String(value));
    } catch {
      /* ignore */
    }
  };

  const isPhoto = skin === 0;

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
        {isPhoto ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{
              backgroundImage: `url(${PHOTO})`,
              backgroundSize: "auto 100%",
              backgroundPosition: "left center",
              backgroundRepeat: "repeat-x",
              opacity: 0.55,
              filter: "contrast(0.92) brightness(1.05) saturate(0.7)",
            }}
          />
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{
              backgroundImage: `url(${DAMASK})`,
              backgroundSize: "auto 100%",
              backgroundPosition: "left center",
              backgroundRepeat: "repeat-x",
              opacity: scrolled ? 0.22 : 0.32,
              transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}
        {isPhoto ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-white/30"
          />
        ) : null}
        <Navbar scrolled={scrolled} />
        <div className="absolute right-1.5 top-1/2 z-[8] flex -translate-y-1/2 items-center gap-0.5">
          <button
            type="button"
            onClick={() => go(skin - 1)}
            aria-label="Previous header texture"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink shadow-[0_4px_12px_-6px_rgba(15,23,42,0.45)] transition-colors hover:bg-white"
          >
            <FiChevronLeft className="text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => go(skin + 1)}
            aria-label="Next header texture"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink shadow-[0_4px_12px_-6px_rgba(15,23,42,0.45)] transition-colors hover:bg-white"
          >
            <FiChevronRight className="text-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
