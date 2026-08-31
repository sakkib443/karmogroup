"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  TbStack,
  TbSquareRounded,
  TbDiamond,
  TbBedFlat,
  TbLayoutGrid,
  TbDroplet,
  TbTestPipe,
  TbAtom,
  TbLayersSubtract,
  TbBoxAlignBottom,
} from "react-icons/tb";

/**
 * Main navbar — logo, divisions, tools, search sheet, mobile drawer.
 * Fixed 80px row. Mega menus and drawer live here.
 */

/* Cartoon menu icons — same language as trust / order strips. */
const MENU = "/karmo/images/header/menu-cartoon";

/* Mattress and Foam are live; HomeTex, Chemicals and About stay visible but
   disabled until their pages exist. */
const nav = [
  {
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    icon: `${MENU}/nav-foam.png?v=2`,
    texture: "foam",
    textureSrc: "/karmo/images/header/foam-side-texture.jpg",
    /* Catalogue categories — cartoon icons + textured mega panel like Mattress.
       Category pages come later; clicks land on the foam offers grid for now. */
    columns: [
      {
        label: "Form",
        items: [
          { name: "Set / Block Foam", href: "/foam#foam-offers", icon: `${MENU}/set-block.png` },
          { name: "Peeling Roll Foam", href: "/foam#foam-offers", icon: `${MENU}/peeling-roll.png` },
          { name: "Contour Design Foam", href: "/foam#foam-offers", icon: `${MENU}/contour.png` },
        ],
      },
      {
        label: "Use",
        items: [
          { name: "Footwear / Load Bearing", href: "/foam#foam-offers", icon: `${MENU}/footwear.png` },
          { name: "Bed & Automotive", href: "/foam#foam-offers", icon: `${MENU}/bed-auto.png` },
          { name: "Acoustic Foam", href: "/foam#foam-offers", icon: `${MENU}/acoustic.png` },
        ],
      },
      {
        label: "Grade",
        items: [
          { name: "Rebonded Foam", href: "/foam#foam-offers", icon: `${MENU}/rebonded.png` },
          { name: "Memory Foam", href: "/foam#foam-offers", icon: `${MENU}/memory.png` },
        ],
      },
    ],
  },
  {
    name: "Mattress",
    line: "Orthopedic, pocket spring",
    href: "/mattress",
    icon: `${MENU}/nav-mattress.png?v=2`,
    texture: "mattress",
    textureSrc: "/karmo/images/header/mattress-side-texture.jpg",
    /* All mega-menu rows land on the mattress catalogue product grid.
       Individual filter pages come later — for now every click opens offers. */
    columns: [
      {
        label: "Comfort",
        items: [
          { name: "Firm Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/firm.png` },
          { name: "Medium Firm Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/medium.png` },
          { name: "Soft Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/soft.png` },
        ],
      },
      {
        label: "Series",
        items: [
          { name: "Orthopedic", href: "/mattress#mattress-offers", icon: `${MENU}/orthopedic.png` },
          { name: "Imperial", href: "/mattress#mattress-offers", icon: `${MENU}/imperial.png` },
          { name: "Prestige", href: "/mattress#mattress-offers", icon: `${MENU}/prestige.png` },
          { name: "King Series", href: "/mattress#mattress-offers", icon: `${MENU}/king.png` },
        ],
      },
      {
        label: "Specialty",
        items: [
          { name: "Bonnell Spring", href: "/mattress#mattress-offers", icon: `${MENU}/bonnell.png` },
          { name: "Pocket Spring", href: "/mattress#mattress-offers", icon: `${MENU}/pocket.png` },
          { name: "Natural Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/natural.png` },
          { name: "Folding Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/folding.png` },
        ],
      },
    ],
  },
  {
    name: "HomeTex",
    line: "Bed sheets, comforters",
    href: "/hometex",
    icon: `${MENU}/nav-hometex.png?v=2`,
    disabled: true,
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
    icon: `${MENU}/nav-chemicals.png?v=2`,
    disabled: true,
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
  { name: "About", line: "The group since 1965", href: "/about", disabled: true },
  { name: "Contact", line: "Talk to us", href: "/contact", disabled: true },
];

/** Menu row icon — cartoon PNG path or react-icon component. */
function MenuGlyph({ icon, alt = "", size = "md" }) {
  if (!icon) return null;
  if (typeof icon === "string") {
    const isNav = size === "nav";
    const box = isNav ? "h-[26px] w-[26px]" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt={alt}
        width={isNav ? 26 : 36}
        height={isNav ? 26 : 36}
        className={`${box} shrink-0 object-contain object-top`}
      />
    );
  }
  const Icon = icon;
  return <Icon className={size === "nav" ? "text-[17px]" : "text-[20px]"} />;
}

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
  const pathname = usePathname() || "";

  return (
    <nav className="flex h-full" aria-label="Divisions" data-mega-menu onMouseLeave={leaveMenuZone}>
      <ul className="flex h-full items-stretch gap-x-0.5">
        {nav.map((entry) => {
          const isDisabled = Boolean(entry.disabled);
          const isActive =
            !isDisabled &&
            (pathname === entry.href || pathname.startsWith(`${entry.href}/`));
          const isOpen = !isDisabled && panel === entry.name;

          const label = (
            <>
              {entry.icon ? (
                <MenuGlyph icon={entry.icon} alt="" size="nav" />
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`display block text-[13px] uppercase leading-none tracking-[0.1em] transition-[color,font-weight] duration-300 ${
                    isActive ? "font-extrabold text-brand" : "font-bold"
                  }`}
                >
                  {entry.name}
                </span>
                {entry.columns ? (
                  <FiChevronDown
                    className={`text-[13px] transition-[color,transform] duration-300 ${
                      isActive ? "text-brand" : "text-ink/40"
                    } ${isOpen ? "rotate-180" : ""}`}
                  />
                ) : null}
              </span>
            </>
          );

          return (
            <li key={entry.name} className="relative flex">
              {isDisabled ? (
                <span
                  aria-disabled="true"
                  className="flex h-full cursor-default items-center gap-2 px-3 text-ink"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={entry.href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => openPanel(entry.name)}
                  onFocus={() => openPanel(entry.name)}
                  className={`relative flex h-full items-center gap-2 px-3 transition-colors duration-300 ${
                    isActive ? "text-brand" : "text-ink hover:text-brand"
                  }`}
                >
                  {label}
                </Link>
              )}

              {!isDisabled && entry.columns ? (
              <div
                data-mega-menu
                onMouseEnter={() => openPanel(entry.name)}
                onMouseLeave={leaveMenuZone}
                className={`absolute left-1/2 top-[calc(100%-4px)] z-[1100] hidden overflow-hidden shadow-[0_24px_50px_-18px_rgba(0,0,0,0.18)] transition-all duration-300 xl:block ${
                  entry.textureSrc
                    ? "header-mega-textured bg-[#fffefb]"
                    : "bg-white"
                } ${
                  entry.panelWidth || "w-[52rem]"
                } ${
                  panel === entry.name
                    ? "visible -translate-x-1/2 translate-y-0 opacity-100"
                    : "invisible -translate-x-1/2 translate-y-1 opacity-0"
                }`}
              >
                {entry.textureSrc ? (
                  <>
                    {/* Solid cream under the damask — without this the panel is
                        see-through and the hero navy reads as a dark overlay. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-0 bg-[#fffefb]"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.textureSrc}
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-[0.16]"
                    />
                  </>
                ) : null}
                <div
                  className={`relative z-[1] grid divide-x divide-ink/6 px-5 py-5 ${
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
                              key={item.name}
                              className={
                                itemIndex < col.items.length - 1
                                  ? "border-b border-ink/6"
                                  : ""
                              }
                            >
                              <Link
                                href={item.href}
                                onClick={dismissPanel}
                                className="group flex h-12 items-center justify-between gap-2.5 transition-colors duration-200 hover:text-brand"
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  {item.icon ? (
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-ink/20 bg-white/55 text-ink/60">
                                      <MenuGlyph icon={item.icon} alt="" />
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
              ) : null}
            </li>
          );
        })}
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
        <span className="display block text-[12.5px] font-bold uppercase leading-tight tracking-[0.04em]">
          FIND A STORE
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
      <div className="shell-home-two relative z-[2] flex h-[80px] items-center gap-4 translate-y-[3px]">
        <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
          <Logo
            src="/karmo/logo-ink.png"
            className="h-7 w-auto max-w-[min(50vw,13rem)] sm:h-8 sm:max-w-none"
            priority
          />
        </Link>

        <div className="hidden h-full flex-1 justify-center xl:flex">
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
                {nav.map((entry) => {
                  const isDisabled = Boolean(entry.disabled);
                  return (
                    <li key={entry.name} className="py-3.5">
                      {isDisabled ? (
                        <span
                          aria-disabled="true"
                          className="flex cursor-default items-center gap-3.5"
                        >
                          {entry.icon ? (
                            <MenuGlyph icon={entry.icon} alt="" size="nav" />
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className="display block text-[13px] font-bold uppercase tracking-[0.08em] text-ink">
                              {entry.name}
                            </span>
                            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.08em] text-ink/50">
                              {entry.line}
                            </span>
                          </span>
                        </span>
                      ) : (
                        <>
                          <Link
                            href={entry.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3.5"
                          >
                            {entry.icon ? (
                              <MenuGlyph icon={entry.icon} alt="" size="nav" />
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
                            <div className="mt-3 space-y-4">
                              {entry.columns.map((col) => (
                                <div key={col.label}>
                                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
                                    Shop by {col.label}
                                  </p>
                                  <ul className="overflow-hidden rounded-[4px] border border-ink/10 bg-white">
                                    {col.items.map((sub, itemIndex) => (
                                      <li
                                        key={sub.name}
                                        className={
                                          itemIndex < col.items.length - 1
                                            ? "border-b border-ink/8"
                                            : ""
                                        }
                                      >
                                        <Link
                                          href={sub.href}
                                          onClick={() => setOpen(false)}
                                          className="group flex min-h-12 items-center justify-between gap-2.5 px-2.5 py-1.5 transition-colors duration-200 hover:bg-cream/70"
                                        >
                                          <span className="flex min-w-0 items-center gap-2.5">
                                            {sub.icon ? (
                                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-ink/15 bg-cream/80 text-ink/60">
                                                <MenuGlyph icon={sub.icon} alt="" />
                                              </span>
                                            ) : null}
                                            <span className="truncate text-[12px] font-semibold uppercase tracking-[0.06em] text-ink">
                                              {sub.name}
                                            </span>
                                          </span>
                                          <FiChevronRight className="shrink-0 text-[14px] text-ink/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </>
                      )}
                    </li>
                  );
                })}
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
                  <span className="display block text-[12.5px] font-bold uppercase leading-tight tracking-[0.04em]">
                    FIND A STORE
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
