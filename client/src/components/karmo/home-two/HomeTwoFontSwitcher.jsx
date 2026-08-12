"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "karmo-home-two-font";

const OPTIONS = [
  { id: "josefin", label: "Josefin Sans" },
  { id: "manrope", label: "Manrope" },
];

/**
 * Home Two only — tiny font dropdown (fixed, right). Swaps the page face
 * between Josefin Sans (default) and Manrope via --font-family / --font-heading.
 */
export default function HomeTwoFontSwitcher({ children, families, classNames }) {
  const [font, setFont] = useState("josefin");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "manrope" || saved === "josefin") setFont(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const heading = `${families[font]}, "Hind Siliguri", sans-serif`;
  /* Body stays Manrope so descriptions never pick up the display face. */
  const body = `${families.manrope}, "Hind Siliguri", sans-serif`;
  const style = {
    "--font-family": body,
    "--font-heading": heading,
  };

  function onChange(next) {
    setFont(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`home-two-type ${classNames}`} style={style}>
      {children}

      <label className="fixed top-[128px] right-3 z-[1000] flex items-center rounded border border-ink/15 bg-white/95 px-1.5 py-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:right-4">
        <span className="sr-only">Page font</span>
        <select
          value={font}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-[8.75rem] cursor-pointer appearance-none bg-transparent py-0.5 pr-4 text-[10px] font-medium tracking-wide text-ink outline-none sm:text-[11px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%222222' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0 center",
          }}
          aria-label="Choose page font"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
