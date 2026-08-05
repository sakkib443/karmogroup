"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiMapPin,
  FiMenu,
  FiX,
  FiArrowRight,
  FiArrowUpRight,
} from "react-icons/fi";

import Logo from "@/components/karmo/Logo";

/**
 * The Home 03 header — one row, and the argument is what it costs.
 *
 * The other two designs both buy their structure with height. Home 01 runs a
 * dark bar plus a utility strip: 120px. Home 02 runs an announcement band, an
 * identity row and a navigation row: 182px, and the layout has to reserve all
 * of it permanently because the announcement rolls away without the offset
 * following. On a 900px laptop that is a fifth of the window gone before the
 * page has said anything.
 *
 * This is 72px and never changes. Everything the other two spread over two and
 * three rows is still here — four divisions with their sub-ranges, search, the
 * store finder, the basket — held in one row by moving two things off it:
 *
 *   · **Search** is a sheet, not a field. Home 02 gives the middle of the bar
 *     to a permanent input; this opens a full-width one under the row when it
 *     is asked for and gives the space back when it is not.
 *   · **Sub-ranges** are a panel, not a dropdown. Foam alone has five, and a
 *     column of five links hanging off a bar is the weakest thing on both other
 *     headers — a list of words with nothing to look at. The panel is the full
 *     width of the page: the sub-ranges in two columns, and the division's own
 *     photograph beside them, so the menu shows the range instead of listing it.
 *
 * The bar is the deep slate the rest of the site uses for dark surfaces, and it
 * is solid from the first pixel. Home 01's fades in from transparent over its
 * hero; here the hero opens on a photograph that runs to the top of its own
 * band, and a bar that dissolves into a picture is a bar you cannot read. Solid
 * also means the default wordmark artwork works — "GROUP" and "Since 1965" are
 * set in white for exactly this.
 *
 * Fixed height is load-bearing. The layout below reserves 72px, so no row here
 * may grow with its contents; the search sheet and the division panel both hang
 * *below* the bar rather than pushing it taller.
 */

const divisions = [
  {
    name: "Foam",
    href: "/foam",
    line: "Furniture, footwear, automotive, acoustic",
    image: "/karmo/images/divisions/foam-armchair.jpg",
    alt: "A linen armchair with a deep-red cushion in a daylit living-room corner",
    submenu: [
      { name: "Furniture & Upholstery", href: "/foam/furniture-upholstery" },
      { name: "Studio / Acoustic Foam", href: "/foam/acoustic" },
      { name: "Footwear", href: "/foam/footwear" },
      { name: "Automotive", href: "/foam/automotive" },
      { name: "Visco Elastic / Memory Foam", href: "/foam/memory-foam" },
    ],
  },
  {
    name: "Mattress",
    href: "/mattress",
    line: "Pocket spring, euro top, orthopaedic",
    image: "/karmo/images/divisions/mattress-platform-bed.jpg",
    alt: "A quilted pocket-spring mattress on a low walnut platform bed",
  },
  {
    name: "HomeTex",
    href: "/hometex",
    line: "Bed sheets, comforters, pillows, cushions",
    image: "/karmo/images/divisions/hometex-bed-linen.jpg",
    alt: "A bed made up in cream sateen bedding with stacked linen pillows",
    submenu: [
      { name: "Bed Sheet", href: "/hometex/bed-sheet" },
      { name: "Comforter", href: "/hometex/comforter" },
      { name: "Pillow", href: "/hometex/pillow" },
      { name: "Cushion", href: "/hometex/cushion" },
    ],
  },
  {
    name: "Chemicals",
    href: "/chemicals",
    line: "Adhesives, polymers, sodium silicate",
    image: "/karmo/images/divisions/chemicals-bench.jpg",
    alt: "Polyurethane foam sheets, a beaker of resin and sample tins on an oak bench",
    submenu: [
      { name: "Karmo Adhesive", href: "/chemicals/adhesive" },
      { name: "Evergain Chemical", href: "/chemicals/evergain" },
      { name: "Sodium Silicate", href: "/chemicals/sodium-silicate" },
    ],
  },
];

/* The three designs are being compared side by side, so each header has to be
   able to reach the other two. They go in the drawer and in a small rail on the
   right of the bar rather than into the division menu — they are scaffolding,
   and they come out with the two losing routes. */
const trials = [
  { name: "01", href: "/" },
  { name: "02", href: "/home-2" },
  { name: "03", href: "/home-3" },
];

export default function HeaderThree() {
  const pathname = usePathname();

  // Which division panel is open, by name. One at a time; `null` is closed.
  const [panel, setPanel] = useState(null);
  const [search, setSearch] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const searchInput = useRef(null);
  // Opening a panel on hover and closing it the instant the pointer leaves
  // makes the gap between two menu entries a trapdoor. A short grace period on
  // the way out is the whole difference between a menu and a flicker.
  const closeTimer = useRef(null);

  const openPanel = (name) => {
    clearTimeout(closeTimer.current);
    setPanel(name);
  };
  const closePanel = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 160);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Everything shuts on Escape, wherever focus happens to be.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setPanel(null);
      setSearch(false);
      setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // And on arrival anywhere else — a menu left hanging over the new page is the
  // classic single-page-app leftover.
  useEffect(() => {
    setPanel(null);
    setSearch(false);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    if (search) searchInput.current?.focus();
  }, [search]);

  const open = divisions.find((d) => d.name === panel && d.submenu);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[10000] bg-shade-deep"
      onMouseLeave={closePanel}
    >
      {/* ── The row. 72px, always. ──────────────────────────────────── */}
      <div className="shell flex h-[72px] items-center gap-8">
        <Link href="/home-3" aria-label="Karmo Group, home" className="shrink-0">
          <Logo className="h-7 w-auto sm:h-8" priority />
        </Link>

        <nav className="hidden lg:block" aria-label="Divisions">
          <ul className="flex items-center">
            {divisions.map((entry) => {
              const active = pathname.startsWith(entry.href);
              return (
                <li key={entry.name}>
                  <Link
                    href={entry.href}
                    onMouseEnter={() => openPanel(entry.name)}
                    onFocus={() => openPanel(entry.name)}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={entry.submenu ? panel === entry.name : undefined}
                    className={`relative flex h-[72px] items-center px-4 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 hover:text-white ${
                      active || panel === entry.name ? "text-white" : "text-white/70"
                    }`}
                  >
                    {entry.name}
                    {/* Marks the open panel as well as the current page, so the
                        bar always says which sheet is hanging off it. */}
                    <span
                      className={`absolute inset-x-4 bottom-0 h-[2px] origin-left bg-brand transition-transform duration-300 ${
                        active || panel === entry.name ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Trial switcher. Temporary, like the three routes it points at. */}
          <div className="mr-3 hidden items-center gap-1 xl:flex">
            <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Design
            </span>
            {trials.map((t) => {
              const here = t.href === "/" ? pathname === "/" : pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={here ? "page" : undefined}
                  className={`display flex h-7 w-7 items-center justify-center text-[11px] font-bold tabular-nums transition-colors duration-300 ${
                    here
                      ? "bg-brand text-white"
                      : "text-white/45 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.name}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSearch((v) => !v)}
            aria-label={search ? "Close search" : "Search the range"}
            aria-expanded={search}
            className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white"
          >
            {search ? <FiX className="text-[19px]" /> : <FiSearch className="text-[19px]" />}
          </button>

          <Link
            href="/find-store"
            className="hidden items-center gap-2 px-3 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80 transition-colors duration-300 hover:text-white md:flex"
          >
            <FiMapPin className="text-[15px]" />
            Find a store
          </Link>

          <Link
            href="/cart"
            aria-label="Basket, 2 items"
            className="relative flex h-10 w-10 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white"
          >
            <FiShoppingBag className="text-[19px]" />
            <span className="absolute right-1 top-1 flex h-[16px] min-w-[16px] items-center justify-center bg-brand px-1 text-[10px] font-bold leading-none text-white">
              2
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDrawer((v) => !v)}
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          >
            {drawer ? <FiX className="text-[21px]" /> : <FiMenu className="text-[21px]" />}
          </button>
        </div>
      </div>

      {/* ── Search sheet ────────────────────────────────────────────── */}
      {/* Hangs below the bar rather than inside it, so the 72px the layout
          reserves is still the whole header when this is open. */}
      {search && (
        <div className="absolute inset-x-0 top-full bg-white shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)]">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="shell flex items-center gap-4 py-6"
          >
            <FiSearch className="shrink-0 text-[20px] text-ink/35" />
            <input
              ref={searchInput}
              type="search"
              placeholder="Foam grades, mattresses, bedding, adhesives…"
              aria-label="Search the Karmo range"
              className="body-copy min-w-0 flex-1 bg-transparent py-2 text-[17px] text-ink outline-none placeholder:text-ink/35"
            />
            <button
              type="submit"
              className="btn-primary flex h-11 shrink-0 items-center gap-2.5 bg-brand px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
            >
              Search
              <FiArrowRight className="text-sm" />
            </button>
          </form>
        </div>
      )}

      {/* ── Division panel ──────────────────────────────────────────── */}
      {open && !search && (
        <div
          className="absolute inset-x-0 top-full hidden bg-white shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)] lg:block"
          onMouseEnter={() => openPanel(open.name)}
          onMouseLeave={closePanel}
        >
          <div className="shell grid grid-cols-12 gap-10 py-9">
            <div className="col-span-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">
                {open.name}
              </span>
              <p className="body-copy mt-3 text-[13.5px] leading-[1.75] text-ink/55">
                {open.line}
              </p>
              <Link
                href={open.href}
                className="group mt-6 inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink"
              >
                The whole division
                <FiArrowUpRight className="text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* The sub-ranges, in two columns rather than one long list — five
                entries stacked reach further down the page than the picture
                beside them and leave the panel lopsided. */}
            <ul className="col-span-5 grid grid-cols-2 gap-x-8 gap-y-1 self-start">
              {open.submenu.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className="group flex items-center justify-between gap-4 border-b border-ink/8 py-3 text-[13.5px] text-ink/75 transition-colors duration-200 hover:text-ink"
                  >
                    {sub.name}
                    <FiArrowRight className="shrink-0 text-[13px] text-ink/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={open.href}
              className="group relative col-span-4 aspect-[16/10] overflow-hidden"
            >
              <Image
                src={open.image}
                alt={open.alt}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-shade-deep/80 to-transparent" />
              <span className="display absolute bottom-5 left-5 text-[1.15rem] font-bold tracking-[-0.02em] text-white">
                {open.name}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Drawer, below lg ────────────────────────────────────────── */}
      {drawer && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100svh-72px)] overflow-y-auto bg-white lg:hidden">
          <div className="shell py-6">
            <ul className="divide-y divide-ink/8">
              {divisions.map((entry) => (
                <li key={entry.name} className="py-4">
                  <Link
                    href={entry.href}
                    onClick={() => setDrawer(false)}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="display text-[15px] font-bold tracking-[-0.01em] text-ink">
                      {entry.name}
                    </span>
                    <FiArrowUpRight className="shrink-0 text-brand" />
                  </Link>
                  <p className="body-copy mt-1 text-[12px] text-ink/50">
                    {entry.line}
                  </p>

                  {entry.submenu && (
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {entry.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setDrawer(false)}
                            className="block bg-cream px-3 py-1.5 text-[12px] text-ink/70"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <Link
              href="/find-store"
              onClick={() => setDrawer(false)}
              className="btn-primary mt-6 flex items-center justify-center gap-2.5 bg-brand py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
            >
              <FiMapPin className="text-[15px]" />
              Find a store
            </Link>

            <div className="mt-6 flex items-center gap-2 border-t border-ink/8 pt-5">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                Design
              </span>
              {trials.map((t) => {
                const here = t.href === "/" ? pathname === "/" : pathname === t.href;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setDrawer(false)}
                    className={`display flex h-8 w-8 items-center justify-center text-[11px] font-bold tabular-nums ${
                      here ? "bg-brand text-white" : "bg-cream text-ink/60"
                    }`}
                  >
                    {t.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
