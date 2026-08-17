"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/karmo/Logo";
import {
  FiMapPin,
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiArrowUpRight,
  FiArrowRight,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  TbArmchair,
  TbBed,
  TbFeather,
  TbFlask,
  TbBox,
  TbRecycle,
  TbShape,
  TbWaveSine,
  TbStack,
  TbShoe,
  TbCar,
  TbCloud,
  TbSquareRounded,
  TbDiamond,
  TbBedFlat,
  TbLayoutGrid,
  TbDroplet,
  TbTestPipe,
  TbAtom,
  TbBone,
  TbShield,
  TbAward,
  TbCircles,
  TbCircleDot,
  TbLeaf,
  TbCrown,
  TbFold,
  TbLayersSubtract,
  TbBoxAlignBottom,
} from "react-icons/tb";
import {
  MattressFirmIcon,
  MattressMediumIcon,
  MattressSoftIcon,
  BedSingleIcon,
  BedDoubleIcon,
  BedTripleIcon,
} from "@/components/karmo/icons/MattressMenuIcons";

/**
 * Main navbar — logo, divisions, tools, search sheet, mobile drawer.
 * Fixed 80px row. Mega menus and drawer live here.
 */

const nav = [
  {
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    icon: TbArmchair,
    /* Eight categories from the client's Foam Catalogue (pages 5–23). */
    columns: [
      {
        label: "Form",
        items: [
          { name: "Set / Block Foam", href: "/foam/set-foam", icon: TbBox },
          { name: "Peeling Roll Foam", href: "/foam/peeling-roll", icon: TbStack },
          { name: "Contour Design Foam", href: "/foam/contour-design", icon: TbShape },
        ],
      },
      {
        label: "Use",
        items: [
          { name: "Footwear / Load Bearing", href: "/foam/footwear", icon: TbShoe },
          { name: "Bed & Automotive", href: "/foam/bed-automotive", icon: TbCar },
          { name: "Acoustic Foam", href: "/foam/acoustic", icon: TbWaveSine },
        ],
      },
      {
        label: "Grade",
        items: [
          { name: "Rebonded Foam", href: "/foam/rebonded", icon: TbRecycle },
          { name: "Memory Foam", href: "/foam/memory-foam", icon: TbCloud },
        ],
      },
    ],
  },
  {
    name: "Mattress",
    line: "Orthopedic, pocket spring",
    href: "/mattress",
    icon: TbBed,
    panelWidth: "w-[78rem]",
    /* Old Shop By Comfort / Size / Type + catalogue product lines. */
    columns: [
      {
        label: "Comfort",
        items: [
          { name: "Firm Mattress", href: "/mattress/firm", icon: MattressFirmIcon },
          { name: "Medium Firm Mattress", href: "/mattress/medium-firm", icon: MattressMediumIcon },
          { name: "Soft Mattress", href: "/mattress/soft", icon: MattressSoftIcon },
        ],
      },
      {
        label: "Size",
        items: [
          { name: "Single", href: "/mattress/size/single", icon: BedSingleIcon },
          { name: "Queen", href: "/mattress/size/queen", icon: BedDoubleIcon },
          { name: "King", href: "/mattress/size/king", icon: BedTripleIcon },
        ],
      },
      {
        label: "Type",
        items: [
          { name: "Foam Mattress", href: "/mattress/foam" },
          { name: "Rubberised Coir Mattress", href: "/mattress/rubberised-coir" },
          { name: "Spring Mattress", href: "/mattress/spring" },
          { name: "Latex Mattress", href: "/mattress/latex" },
        ],
      },
      {
        label: "Series",
        items: [
          { name: "Orthopedic", href: "/mattress/orthopedic", icon: TbBone },
          { name: "Imperial", href: "/mattress/imperial", icon: TbShield },
          { name: "Prestige", href: "/mattress/prestige", icon: TbAward },
          { name: "King Series", href: "/mattress/king", icon: TbCrown },
        ],
      },
      {
        label: "Specialty",
        items: [
          { name: "Bonnell Spring", href: "/mattress/bonnell-spring", icon: TbCircles },
          { name: "Pocket Spring", href: "/mattress/pocket-spring", icon: TbCircleDot },
          { name: "Natural Mattress", href: "/mattress/natural", icon: TbLeaf },
          { name: "Folding Mattress", href: "/mattress/folding", icon: TbFold },
        ],
      },
    ],
  },
  {
    name: "HomeTex",
    line: "Bed sheets, comforters",
    href: "/hometex",
    icon: TbFeather,
    /* Bedding range from Mattress Catalogue pages 19–27 (HomeTex section). */
    columns: [
      {
        label: "Pillow",
        items: [
          { name: "Head Pillow", href: "/hometex/pillow", icon: TbSquareRounded },
          { name: "Side Pillow", href: "/hometex/side-pillow", icon: TbStack },
          { name: "Floor Pillow", href: "/hometex/floor-pillow", icon: TbBoxAlignBottom },
        ],
      },
      {
        label: "Bedding",
        items: [
          { name: "Bed Sheet", href: "/hometex/bed-sheet", icon: TbBedFlat },
          { name: "Comforter", href: "/hometex/comforter", icon: TbLayoutGrid },
          { name: "Mattress Topper", href: "/hometex/topper", icon: TbLayersSubtract },
        ],
      },
      {
        label: "Living",
        items: [
          { name: "Cushion", href: "/hometex/cushion", icon: TbDiamond },
        ],
      },
    ],
  },
  {
    name: "Chemicals",
    line: "Adhesives, polymers",
    href: "/chemicals",
    icon: TbFlask,
    columns: [
      {
        label: "Adhesive",
        items: [
          { name: "Karmo Adhesive", href: "/chemicals/adhesive", icon: TbDroplet },
        ],
      },
      {
        label: "Chemical",
        items: [
          { name: "Evergain Chemical", href: "/chemicals/evergain", icon: TbTestPipe },
        ],
      },
      {
        label: "Silicate",
        items: [
          { name: "Sodium Silicate", href: "/chemicals/sodium-silicate", icon: TbAtom },
        ],
      },
    ],
  },
  { name: "About", line: "The group since 1965", href: "/about" },
  { name: "Contact", line: "Talk to us", href: "/contact" },
];

function Tool({ icon: Icon, label, href, count, onClick }) {
  const body = (
    <>
      <Icon className="text-[20px]" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
          {count}
        </span>
      )}
    </>
  );

  const className =
    "relative flex h-10 w-10 items-center justify-center text-ink transition-colors duration-300 hover:text-brand";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={label} className={className}>
        {body}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className}>
      {body}
    </Link>
  );
}

function DivisionNav({ panel, openPanel, leaveMenuZone, dismissPanel }) {
  return (
    <nav aria-label="Divisions" data-mega-menu onMouseLeave={leaveMenuZone}>
      <ul className="flex items-center">
        {nav.map((entry) => (
          <li key={entry.name} className="relative">
            <Link
              href={entry.href}
              onMouseEnter={() => openPanel(entry.name)}
              onFocus={() => openPanel(entry.name)}
              className="flex items-center gap-1.5 px-2.5 py-2.5 text-ink transition-colors duration-300 hover:text-brand"
            >
              {entry.icon ? (
                <entry.icon className="shrink-0 text-[17px] text-ink/55" />
              ) : null}
              <span className="display block text-[13px] font-bold uppercase leading-none tracking-[0.1em]">
                {entry.name}
              </span>
              {entry.columns && (
                <FiChevronDown
                  className={`text-[13px] text-ink/40 transition-transform duration-300 ${
                    panel === entry.name ? "rotate-180" : ""
                  }`}
                />
              )}
            </Link>

            {entry.columns && (
              <div
                data-mega-menu
                onMouseEnter={() => openPanel(entry.name)}
                onMouseLeave={leaveMenuZone}
                className={`absolute top-full left-1/2 z-[1100] hidden bg-white shadow-[0_24px_50px_-18px_rgba(0,0,0,0.18)] transition-all duration-300 xl:block ${
                  entry.panelWidth || "w-[52rem]"
                } ${
                  panel === entry.name
                    ? "visible -translate-x-1/2 translate-y-0 opacity-100"
                    : "invisible -translate-x-1/2 translate-y-1 opacity-0"
                }`}
              >
                <div
                  className={`grid divide-x divide-ink/6 px-5 py-5 ${
                    entry.columns.length >= 5
                      ? "grid-cols-5"
                      : entry.columns.length === 4
                        ? "grid-cols-4"
                        : "grid-cols-3"
                  }`}
                >
                  {entry.columns.map((col) => (
                    <div key={col.label} className="px-4 first:pl-1 last:pr-1">
                      <div className="flex h-10 items-end border-b border-ink/6 pb-3">
                        <span className="display text-[12px] font-bold uppercase leading-none tracking-[0.1em] text-ink">
                          Shop By {col.label}
                        </span>
                      </div>

                      <ul className="pt-0.5">
                        {col.items.map((item, itemIndex) => (
                          <li
                            key={item.href}
                            className={
                              itemIndex < col.items.length - 1
                                ? "border-b border-ink/6"
                                : ""
                            }
                          >
                            <Link
                              href={item.href}
                              onClick={dismissPanel}
                              className="group flex h-11 items-center justify-between gap-2.5 transition-colors duration-200 hover:text-brand"
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                {item.icon ? (
                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center text-ink/60">
                                    <item.icon className="text-[20px]" />
                                  </span>
                                ) : null}
                                <span className="truncate text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink">
                                  {item.name}
                                </span>
                              </span>
                              <FiChevronRight className="shrink-0 text-[13px] text-ink/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Primary header CTA — Find a Store (dark bar + brand map-pin tile).
 */
function HeaderCtaButton({ compact = false }) {
  return (
    <Link
      href="/find-store"
      className="group flex h-[46px] shrink-0 items-center gap-3 rounded-[4px] bg-shade-soft pl-1.5 pr-4 text-white transition-colors duration-300 hover:bg-shade"
    >
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[3px] bg-brand text-white shadow-[0_4px_12px_-4px_rgba(212,67,72,0.6)] transition-all duration-300 group-hover:-translate-y-px group-hover:shadow-[0_6px_16px_-4px_rgba(212,67,72,0.75)]">
        <FiMapPin className="text-[16px]" />
      </span>
      <span className="block text-left">
        <span className="display block text-[12.5px] font-bold leading-tight">
          Find a Store
        </span>
        {!compact && (
          <span className="block text-[10.5px] leading-tight text-white/60">
            Showrooms nationwide
          </span>
        )}
      </span>
      {!compact && (
        <FiArrowRight className="text-[14px] text-white/55 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [panel, setPanel] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const sync = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!search) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSearch(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [search]);

  const openPanel = (name) => {
    clearTimeout(closeTimer.current);
    setPanel(name);
  };
  const dismissPanel = () => {
    clearTimeout(closeTimer.current);
    setPanel(null);
  };
  const closePanel = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 160);
  };
  const leaveMenuZone = (e) => {
    const next = e.relatedTarget;
    if (next && typeof next.closest === "function" && next.closest("[data-mega-menu]")) {
      return;
    }
    closePanel();
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!panel) return;
    const onPointerDown = (e) => {
      const target = e.target;
      if (target && typeof target.closest === "function" && target.closest("[data-mega-menu]")) {
        return;
      }
      dismissPanel();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") dismissPanel();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panel]);

  return (
    <>
      <div className="shell-home-two flex h-[80px] items-center gap-4">
        <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
          <Logo
            src="/karmo/logo-ink.png"
            className="h-7 w-auto max-w-[min(50vw,13rem)] sm:h-8 sm:max-w-none"
            priority
          />
        </Link>

        <div className="hidden flex-1 justify-center xl:flex">
          <DivisionNav
            panel={panel}
            openPanel={openPanel}
            leaveMenuZone={leaveMenuZone}
            dismissPanel={dismissPanel}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Tool icon={FiSearch} label="Search the Karmo range" onClick={() => setSearch((v) => !v)} />
          <Tool icon={FiShoppingBag} label="Cart" href="/cart" count={2} />

          <span className="ml-1.5 hidden md:block">
            <HeaderCtaButton />
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ml-0.5 flex h-10 w-10 items-center justify-center text-[22px] text-ink xl:hidden"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {search ? (
        <div className="absolute inset-x-0 top-full border-t border-ink/8 bg-white shadow-[0_24px_40px_-24px_rgba(15,23,42,0.4)]">
          <div className="shell-home-two py-5">
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto flex h-[52px] max-w-[720px] items-stretch overflow-hidden rounded-[4px] border border-ink/15 bg-cream/60 transition-colors duration-300 focus-within:border-brand/50 focus-within:bg-white"
            >
              <input
                type="search"
                autoFocus
                placeholder="Search foam grades, mattresses, bedding…"
                aria-label="Search the Karmo range"
                className="body-copy min-w-0 flex-1 bg-transparent pl-5 pr-3 text-[14px] text-ink outline-none placeholder:text-ink/45"
              />
              <button
                type="submit"
                aria-label="Search"
                className="group relative flex shrink-0 items-center gap-2.5 overflow-hidden bg-brand px-6 text-white transition-colors duration-300 hover:bg-shade-deep"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 ease-out group-hover:translate-x-0"
                />
                <FiSearch className="relative text-[17px] transition-transform duration-300 group-hover:scale-110" />
                <span className="relative hidden text-[12px] font-bold uppercase tracking-[0.12em] sm:block">
                  Search
                </span>
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-ink/35 xl:hidden"
          />
          <div className="absolute inset-x-0 top-full z-[9999] max-h-[calc(100svh-112px)] overflow-y-auto overscroll-contain border-t border-ink/8 bg-white xl:hidden">
            <div className="shell-home-two py-5">
              <ul className="divide-y divide-ink/8">
                {nav.map((entry) => (
                  <li key={entry.name} className="py-3.5">
                    <Link
                      href={entry.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5"
                    >
                      {entry.icon ? (
                        <entry.icon className="shrink-0 text-[18px] text-ink/55" />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="display block text-[13px] font-bold uppercase tracking-[0.08em] text-ink">
                          {entry.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] uppercase tracking-[0.08em] text-ink/50">
                          {entry.line}
                        </span>
                      </span>
                      <FiArrowUpRight className="shrink-0 text-brand" />
                    </Link>

                    {entry.columns ? (
                      <div className="mt-3 space-y-3">
                        {entry.columns.map((col) => (
                          <div key={col.label}>
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                              Shop by {col.label}
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {col.items.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    onClick={() => setOpen(false)}
                                    className="block bg-cream px-3 py-1.5 text-[12px] uppercase tracking-[0.06em] text-ink/70"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-ink/12 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
                >
                  <FiHeart className="text-[15px]" />
                  Favourites
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-ink/12 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
                >
                  <FiUser className="text-[15px]" />
                  Account
                </Link>
              </div>

              <Link
                href="/portfolio"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 border border-ink/12 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
              >
                <FiGrid className="text-[15px]" />
                Portfolio
              </Link>

              <Link
                href="/track"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 border border-ink/12 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-ink sm:hidden"
              >
                <FiMapPin className="text-[15px]" />
                Track Order
              </Link>

              <Link
                href="/find-store"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-3 rounded-[4px] bg-shade-soft py-2.5 pl-2 pr-4 text-white md:hidden"
              >
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[3px] bg-brand">
                  <FiMapPin className="text-[16px]" />
                </span>
                <span className="block text-left">
                  <span className="display block text-[12.5px] font-bold leading-tight">
                    Find a Store
                  </span>
                  <span className="block text-[10.5px] leading-tight text-white/60">
                    Showrooms nationwide
                  </span>
                </span>
                <FiArrowRight className="ml-auto text-[14px] text-white/55" />
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
