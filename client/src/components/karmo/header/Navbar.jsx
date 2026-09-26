"use client";

import Image from "next/image";
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

const LOGO_EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Main navbar — logo, divisions, tools, search sheet, mobile drawer.
 * Resting row is taller so the factory mark reads; compact 80px on scroll.
 * Mega menus and drawer live here.
 */

/* Cartoon menu icons — same language as trust / order strips. */
const MENU = "/karmo/images/header/menu-cartoon";

/*
 * Header menu — client sheet (Website Menu revised, Sep 2026):
 *
 *   · Mattress → one division page (`/mattress`). Sub-rows go to product PDPs.
 *   · Foam → hover-only parent (click does not navigate). Three category
 *     pages are the menu: `/foam/furniture`, `/foam/bed-automotive`,
 *     `/foam/footwear`. `/foam` catalogue stays for other site links.
 *   · HomeTex / Chemicals → division page for now; sub-rows stay on-division
 *     until product PDPs exist.
 *   · Company → About / Media / Contact / Dealership block.
 *
 * Cartoon icons live in `menu-cartoon/`. Every row that can carry one does.
 */
const nav = [
  {
    name: "Foam",
    line: "Furniture, bed, automotive, footwear",
    href: null,
    match: "/foam",
    icon: `${MENU}/nav-foam.png?v=2`,
    texture: "foam",
    textureSrc: "/karmo/images/header/foam-side-texture.jpg",
    panelAlign: "left",
    columns: [
      {
        label: "Furniture & Upholstery",
        href: "/foam/furniture",
        icon: `${MENU}/set-block.png`,
        items: [
          { name: "Karmo Poly", href: "/foam/furniture#foam-offers", icon: `${MENU}/grade-poly.png` },
          { name: "Karmo 280", href: "/foam/combo-280", icon: `${MENU}/grade-280.png` },
          { name: "Karmo 480", href: "/foam/furniture#foam-offers", icon: `${MENU}/grade-480.png` },
          { name: "Karmo 2001", href: "/foam/combo-2001", icon: `${MENU}/grade-2001.png` },
          { name: "Karmo HD", href: "/foam/furniture#foam-offers", icon: `${MENU}/grade-hd.png` },
          { name: "Karmo 4G", href: "/foam/combo-4g", icon: `${MENU}/grade-4g.png` },
          { name: "Karmo 1965", href: "/foam/combo-1965", icon: `${MENU}/grade-1965.png` },
          { name: "Karmo Signature", href: "/foam/combo-signature", icon: `${MENU}/grade-signature.png` },
        ],
      },
      {
        label: "Bed & Automotive",
        href: "/foam/bed-automotive",
        icon: `${MENU}/bed-auto.png`,
        items: [
          { name: "Contour Design Foam – Chattogram Design", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/contour.png` },
          { name: "Contour Design Foam – Sylhet Design", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/contour-egg.png` },
          { name: "Contour Design Foam – Dhaka Design", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/contour.png` },
          { name: "Contour Design Foam – Karmo Design", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/contour-egg.png` },
          { name: "Contour Design Foam – Catalogue Design", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/set-block.png` },
          { name: "Acoustic Foam", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/acoustic.png` },
          { name: "Bed Foam", href: "/foam/bed-automotive#foam-offers", icon: `${MENU}/bed-auto.png` },
        ],
      },
      {
        label: "Footwear",
        href: "/foam/footwear",
        icon: `${MENU}/footwear.png`,
        items: [
          { name: "Peeling Roll Foam", href: "/foam/footwear#foam-offers", icon: `${MENU}/peeling-roll.png` },
          { name: "Load Bearing High Density Foam", href: "/foam/footwear#foam-offers", icon: `${MENU}/footwear.png` },
          { name: "Visco Elastic Foam", href: "/foam/footwear#foam-offers", icon: `${MENU}/memory.png` },
          { name: "Lamination Foam", href: "/foam/footwear#foam-offers", icon: `${MENU}/lamination.png` },
        ],
      },
    ],
  },
  {
    name: "Mattress",
    line: "Euro top, orthopaedic, pocket spring",
    href: "/mattress",
    icon: `${MENU}/nav-mattress.png?v=2`,
    texture: "mattress",
    textureSrc: "/karmo/images/header/mattress-side-texture.jpg",
    /* One division page — sub-rows are products, not category pages. */
    panelWidth: "25rem",
    columns: [
      {
        label: "Mattress",
        heading: "All mattresses",
        icon: `${MENU}/nav-mattress.png?v=2`,
        items: [
          { name: "Karmo Euro Top Mattress", href: "/mattress/imperial-eurotop", icon: `${MENU}/imperial.png` },
          { name: "Karmo King Mattress", href: "/mattress/king", icon: `${MENU}/king.png` },
          { name: "Karmo Prestige Mattress", href: "/mattress/prestige", icon: `${MENU}/prestige.png` },
          { name: "Karmo Orthopaedic Mattress", href: "/mattress/orthopedic", icon: `${MENU}/orthopedic.png` },
          { name: "Karmo Bonnell Spring Mattress", href: "/mattress/bonnell-spring", icon: `${MENU}/bonnell.png` },
          { name: "Karmo Pocket Spring Mattress", href: "/mattress/pillow-top-pocket-spring", icon: `${MENU}/pocket.png` },
          { name: "Karmo Euro Top Pocket Spring Mattress", href: "/mattress/euro-top-pocket-spring", icon: `${MENU}/pocket.png` },
          { name: "Karmo Folding Mattress", href: "/mattress#mattress-offers", icon: `${MENU}/folding.png` },
          { name: "Karmo Mattress Topper", href: "/mattress/topper", icon: `${MENU}/soft.png` },
        ],
      },
    ],
  },
  {
    name: "HomeTex / Bedding",
    line: "Pillows, sheets, quilts, towels",
    href: null,
    match: "/hometex",
    icon: `${MENU}/nav-hometex.png?v=2`,
    panelWidth: "36rem",
    columns: [
      {
        label: "Pillow",
        href: "/hometex/pillow",
        icon: `${MENU}/pillow.png`,
        items: [
          { name: "Relax Time", href: "/hometex/pillow", icon: `${MENU}/pillow.png` },
          { name: "Plush", href: "/hometex/pillow", icon: `${MENU}/plush.png` },
          { name: "Cushion", href: "/hometex/pillow", icon: `${MENU}/cushion.png` },
          { name: "Organic Silk Cotton", href: "/hometex/pillow", icon: `${MENU}/natural.png` },
          { name: "Orthopedic U-Pillow", href: "/hometex/pillow", icon: `${MENU}/orthopedic.png` },
        ],
      },
      {
        label: "HomeTex",
        href: "/hometex",
        icon: `${MENU}/nav-hometex.png?v=2`,
        items: [
          { name: "Bed Sheet", href: "/hometex", icon: `${MENU}/bedsheet.png` },
          { name: "Comforter", href: "/hometex", icon: `${MENU}/comforter.png` },
          { name: "Quilts & Bed Spreads", href: "/hometex", icon: `${MENU}/ac-quilt.png` },
          { name: "Airflow Mosquito Net", href: "/hometex", icon: `${MENU}/natural.png` },
          { name: "Wipes / Towels", href: "/hometex", icon: `${MENU}/soft.png` },
        ],
      },
    ],
  },
  {
    name: "Chemicals & Polymers",
    line: "Solvents, additives, adhesives",
    /* Pages for this menu aren't designed yet: the menu and its hover panel
       stay, but nothing in it navigates. `href`s are kept so the active-route
       highlight and the eventual re-enable are just deleting this one flag. */
    linksDisabled: true,
    href: "/chemicals",
    icon: `${MENU}/nav-chemicals.png?v=2`,
    panelWidth: "min(72rem, 94vw)",
    columns: [
      {
        label: "Polyurethane / Solvent",
        href: "/chemicals/polyurethane",
        icon: `${MENU}/solvent.png`,
        items: [
          { name: "TDI", href: "/chemicals/polyurethane", icon: `${MENU}/solvent.png` },
          { name: "PPG", href: "/chemicals/polyurethane", icon: `${MENU}/grade-poly.png` },
          { name: "CoPolymer", href: "/chemicals/polyurethane", icon: `${MENU}/rebonded.png` },
        ],
      },
      {
        label: "Specialized Chemicals & Additives",
        href: "/chemicals/specialized",
        icon: `${MENU}/pigment.png`,
        items: [
          { name: "Silicone", href: "/chemicals/specialized", icon: `${MENU}/sealant.png` },
          { name: "SO", href: "/chemicals/specialized", icon: `${MENU}/spray-adhesive.png` },
          { name: "PS", href: "/chemicals/specialized", icon: `${MENU}/grade-hd.png` },
          { name: "Pigment", href: "/chemicals/specialized", icon: `${MENU}/pigment.png` },
        ],
      },
      {
        label: "Karmo Adhesive",
        href: "/chemicals/karmo-adhesive",
        icon: `${MENU}/adhesive.png`,
        items: [
          { name: "Karmo Super", href: "/chemicals/karmo-adhesive", icon: `${MENU}/adhesive.png` },
          { name: "Karmo Light", href: "/chemicals/karmo-adhesive", icon: `${MENU}/emulsion.png` },
          { name: "Karmo Rubber Solution", href: "/chemicals/karmo-adhesive", icon: `${MENU}/grade-480.png` },
          { name: "Karmo PU", href: "/chemicals/karmo-adhesive", icon: `${MENU}/grade-4g.png` },
          { name: "Karmo Bond", href: "/chemicals/karmo-adhesive", icon: `${MENU}/grade-signature.png` },
        ],
      },
      {
        label: "Evergain Chemical",
        href: "/chemicals/evergain",
        icon: `${MENU}/spray-adhesive.png`,
        items: [
          { name: "Neoprene Contact Adhesive 407", href: "/chemicals/evergain", icon: `${MENU}/adhesive.png` },
          { name: "Polyurethane (PU) Shoe Adhesive A10", href: "/chemicals/evergain", icon: `${MENU}/footwear.png` },
          { name: "Primer", href: "/chemicals/evergain", icon: `${MENU}/primer.png` },
          { name: "Hardener", href: "/chemicals/evergain", icon: `${MENU}/hardener.png` },
          { name: "Cleaner", href: "/chemicals/evergain", icon: `${MENU}/cleaner.png` },
          { name: "Cr-grafting Shoe Adhesive F318", href: "/chemicals/evergain", icon: `${MENU}/grade-280.png` },
          { name: "SBS Spray Adhesive 007M", href: "/chemicals/evergain", icon: `${MENU}/spray-adhesive.png` },
          { name: "White Emulsion Glue", href: "/chemicals/evergain", icon: `${MENU}/emulsion.png` },
          { name: "Super Class Acidity Silicon Sealant", href: "/chemicals/evergain", icon: `${MENU}/sealant.png` },
          { name: "Evergain Free Nail Adhesive", href: "/chemicals/evergain", icon: `${MENU}/grade-1965.png` },
        ],
      },
      {
        label: "Sodium Silicate",
        href: "/chemicals/sodium-silicate",
        icon: `${MENU}/silicate.png`,
        items: [{ name: "Sodium Silicate", href: "/chemicals/sodium-silicate", icon: `${MENU}/silicate.png` }],
      },
    ],
  },
  {
    name: "Company",
    line: "About, media, contact, dealership",
    panelAlign: "right",
    /* Same as Chemicals & Polymers: hover panel stays, nothing navigates
       until these pages are designed. */
    linksDisabled: true,
    href: "/about",
    panelWidth: "56rem",
    columns: [
      {
        label: "About Us",
        heading: "About Us",
        href: "/about",
        items: [
          { name: "Company History, Mission & Vision", href: "/about#history" },
          { name: "Board of Directors", href: "/about" },
          { name: "Awards & Achievements", href: "/about" },
          { name: "Our Partners", href: "/about#partners" },
        ],
      },
      {
        label: "Media Center",
        heading: "Media Center",
        href: "/media/news",
        items: [
          { name: "News & Blogs", href: "/media/news" },
          { name: "Karmo Memory", href: "/media/memory" },
          { name: "Karmo Ads", href: "/media/ads" },
        ],
      },
      {
        label: "Contact Us",
        heading: "Contact Us",
        href: "/contact",
        items: [
          { name: "Catalogues", href: "/contact" },
          { name: "Bulk Order", href: "/contact" },
          { name: "Address / Map", href: "/contact" },
          { name: "FAQs", href: "/contact" },
        ],
      },
      {
        label: "Dealership",
        heading: "Dealership",
        href: "/contact",
        items: [{ name: "Dealership Apply", href: "/contact" }],
      },
    ],
  },
];

/** Menu row icon — cartoon PNG path or react-icon component. */
function MenuGlyph({ icon, alt = "", size = "md" }) {
  if (!icon) return null;
  if (typeof icon === "string") {
    const box =
      size === "nav"
        ? "h-[26px] w-[26px]"
        : size === "parent"
          ? "h-11 w-11"
          : size === "sm"
            ? "h-7 w-7"
            : "h-9 w-9";
    const px =
      size === "nav" ? 26 : size === "parent" ? 44 : size === "sm" ? 28 : 36;
    return (
      // Menu icons carry `?v=` cache-busting query strings, which next/Image
      // rejects for local images (needs images.localPatterns). Keep a raw <img>.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt={alt}
        width={px}
        height={px}
        className={`${box} shrink-0 object-contain object-top`}
      />
    );
  }
  const Icon = icon;
  return (
    <Icon
      className={
        size === "nav"
          ? "text-[17px]"
          : size === "parent"
            ? "text-[24px]"
            : "text-[20px]"
      }
    />
  );
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
          const matchPath = entry.match || entry.href;
          const isActive =
            !isDisabled &&
            Boolean(matchPath) &&
            (pathname === matchPath || pathname.startsWith(`${matchPath}/`));
          const isOpen = !isDisabled && panel === entry.name;
          const triggerClass = `relative flex h-full items-center gap-2 px-3 transition-colors duration-300 ${
            isActive ? "text-brand" : "text-ink hover:text-brand"
          }`;

          const label = (
            <>
              {entry.icon ? (
                <MenuGlyph icon={entry.icon} alt="" size="nav" />
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                {/* "HomeTex / Bedding" and "Chemicals & Polymers" wrap to two
                    lines below 2xl on purpose. Held to one line they need
                    ~75px more than the row has: at 1440 that pushed Find a
                    Store 11px past the header edge. From 1536 up there is room,
                    so they stay on one line there. */}
                <span
                  className={`display block text-[13px] uppercase leading-[1.15] tracking-[0.1em] 2xl:whitespace-nowrap transition-[color,font-weight] duration-300 ${
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
              ) : entry.href && !entry.linksDisabled ? (
                <Link
                  href={entry.href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => openPanel(entry.name)}
                  onFocus={() => openPanel(entry.name)}
                  className={triggerClass}
                >
                  {label}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => openPanel(entry.name)}
                  onFocus={() => openPanel(entry.name)}
                  onClick={(e) => {
                    e.preventDefault();
                    openPanel(entry.name);
                  }}
                  className={triggerClass}
                >
                  {label}
                </button>
              )}

              {!isDisabled && entry.columns ? (
              <div
                data-mega-menu
                onMouseEnter={() => openPanel(entry.name)}
                onMouseLeave={leaveMenuZone}
                /* Panels centre under their menu item by default. The first and
                   last items are too close to the screen edge for that: at 1280
                   Foam's panel ran 171px off the left and Company's 21px off the
                   right. `panelAlign` pins those to the item's own left or right
                   edge instead, so the panel opens inward. */
                style={{ width: entry.panelWidth || "52rem", maxWidth: "94vw" }}
                className={`absolute top-[calc(100%-4px)] z-[1100] hidden overflow-hidden shadow-[0_24px_50px_-18px_rgba(0,0,0,0.18)] transition-all duration-300 xl:block ${
                  entry.panelAlign === "left"
                    ? "left-0"
                    : entry.panelAlign === "right"
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2"
                } ${
                  entry.textureSrc
                    ? "header-mega-textured bg-[#fffefb]"
                    : "bg-white"
                } ${
                  panel === entry.name
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-1 opacity-0"
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
                    <Image
                      src={entry.textureSrc}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="pointer-events-none z-0 object-cover object-center opacity-[0.16]"
                    />
                  </>
                ) : null}
                <div
                  className={`relative z-[1] grid w-full min-w-0 divide-x divide-ink/6 px-5 py-5 ${
                    entry.columns.length >= 5
                      ? "grid-cols-5"
                      : entry.columns.length === 4
                        ? "grid-cols-4"
                        : entry.columns.length === 3
                          ? "grid-cols-3"
                          : entry.columns.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-1"
                  }`}
                >
                    {entry.columns.map((col) => (
                      <div key={col.label} className="min-w-0 px-4 first:pl-1 last:pr-1">
                        {/* Parent category — larger icon + type so it reads above sub-rows */}
                        <div className="flex min-h-[3.25rem] items-end border-b border-ink/10 pb-3.5">
                          {col.href && !entry.linksDisabled ? (
                            <Link
                              href={col.href}
                              onClick={dismissPanel}
                              className="group flex min-w-0 items-center gap-2.5 transition-colors hover:text-brand"
                            >
                              {col.icon ? (
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] border border-ink/20 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.12)]">
                                  <MenuGlyph icon={col.icon} alt="" size="parent" />
                                </span>
                              ) : null}
                              <span className="display text-[14px] font-extrabold uppercase leading-[1.15] tracking-[0.08em] text-ink group-hover:text-brand lg:text-[15px]">
                                {col.heading ?? col.label}
                              </span>
                              <FiChevronRight className="shrink-0 text-[14px] text-ink/35 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                            </Link>
                          ) : (
                            <span className="flex min-w-0 items-center gap-2.5">
                              {col.icon ? (
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] border border-ink/20 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.12)]">
                                  <MenuGlyph icon={col.icon} alt="" size="parent" />
                                </span>
                              ) : null}
                              <span className="display text-[14px] font-extrabold uppercase leading-[1.15] tracking-[0.08em] text-ink lg:text-[15px]">
                                {col.heading ?? (col.href ? col.label : `Shop By ${col.label}`)}
                              </span>
                            </span>
                          )}
                        </div>

                        <ul className="pt-1">
                          {col.items.map((item, itemIndex) => {
                            const rowClass =
                              "group flex min-h-11 items-center justify-between gap-2.5 py-1.5 transition-colors duration-200";
                            const body = (
                              <span className="flex min-w-0 items-center gap-2.5">
                                {item.icon ? (
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-ink/15 bg-white/55 text-ink/60">
                                    <MenuGlyph icon={item.icon} alt="" size="sm" />
                                  </span>
                                ) : null}
                                <span className="line-clamp-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-ink/85">
                                  {item.name}
                                </span>
                              </span>
                            );

                            return (
                              <li
                                key={item.name}
                                className={
                                  itemIndex < col.items.length - 1
                                    ? "border-b border-ink/6"
                                    : ""
                                }
                              >
                                {item.soon || entry.linksDisabled ? (
                                  <span
                                    aria-disabled="true"
                                    className={`${rowClass} cursor-default ${item.soon ? "opacity-60" : ""}`}
                                  >
                                    {body}
                                    {item.soon ? (
                                      <span className="shrink-0 rounded-full bg-ink/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-ink/55">
                                        Soon
                                      </span>
                                    ) : null}
                                  </span>
                                ) : (
                                  <Link
                                    href={item.href}
                                    onClick={dismissPanel}
                                    className={`${rowClass} hover:text-brand`}
                                  >
                                    {body}
                                    <FiChevronRight className="shrink-0 text-[12px] text-ink/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                                  </Link>
                                )}
                              </li>
                            );
                          })}
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

export default function Navbar({ scrolled = false }) {
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
      <div
        className={`shell-home-two relative z-[2] flex items-center gap-4 translate-y-[3px] transition-[height] ${LOGO_EASE} ${
          scrolled ? "h-[80px]" : "h-[104px] sm:h-[112px]"
        }`}
      >
        <Link
          href="/"
          aria-label="Karmo Group, home"
          className={`relative shrink-0 overflow-hidden transition-[width,height] ${LOGO_EASE} ${
            scrolled
              ? "h-8 w-[min(50vw,13rem)] sm:w-[14.5rem]"
              : "h-[80px] w-[104px] sm:h-[88px] sm:w-[114px]"
          }`}
        >
          <Logo
            src="/karmo/logo-factory.png"
            width={554}
            height={427}
            className={`absolute left-0 top-1/2 origin-left -translate-y-1/2 h-[80px] w-auto sm:h-[88px] transition-[opacity,transform] ${LOGO_EASE} ${
              scrolled
                ? "pointer-events-none scale-75 opacity-0"
                : "scale-100 opacity-100"
            }`}
            priority
          />
          <Logo
            src="/karmo/logo-ink.png"
            className={`absolute left-0 top-1/2 origin-left -translate-y-1/2 h-7 w-auto max-w-[min(50vw,13rem)] sm:h-8 sm:max-w-none transition-[opacity,transform] ${LOGO_EASE} ${
              scrolled
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
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
                          {entry.href && !entry.linksDisabled ? (
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
                          ) : (
                            <span className="flex items-center gap-3.5">
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
                          )}

                          {entry.columns ? (
                            <div className="mt-3 space-y-4">
                              {entry.columns.map((col) => (
                                <div key={col.label}>
                                  {col.href && !entry.linksDisabled ? (
                                    <Link
                                      href={col.href}
                                      onClick={() => setOpen(false)}
                                      className="mb-2 flex items-center gap-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink hover:text-brand"
                                    >
                                      {col.icon ? (
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border border-ink/15 bg-white">
                                          <MenuGlyph icon={col.icon} alt="" size="parent" />
                                        </span>
                                      ) : null}
                                      {col.heading ?? col.label}
                                    </Link>
                                  ) : (
                                    <p className="mb-2 flex items-center gap-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink">
                                      {col.icon ? (
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border border-ink/15 bg-white">
                                          <MenuGlyph icon={col.icon} alt="" size="parent" />
                                        </span>
                                      ) : null}
                                      {col.heading ?? (col.href ? col.label : `Shop by ${col.label}`)}
                                    </p>
                                  )}
                                  <ul className="overflow-hidden rounded-[4px] border border-ink/10 bg-white">
                                    {col.items.map((sub, itemIndex) => {
                                      const body = (
                                        <span className="flex min-w-0 items-center gap-2.5">
                                          {sub.icon ? (
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-ink/15 bg-cream/80 text-ink/60">
                                              <MenuGlyph icon={sub.icon} alt="" />
                                            </span>
                                          ) : null}
                                          <span className="line-clamp-2 text-[12px] font-semibold uppercase leading-snug tracking-[0.06em] text-ink">
                                            {sub.name}
                                          </span>
                                        </span>
                                      );

                                      return (
                                        <li
                                          key={sub.name}
                                          className={
                                            itemIndex < col.items.length - 1
                                              ? "border-b border-ink/8"
                                              : ""
                                          }
                                        >
                                          {sub.soon || entry.linksDisabled ? (
                                            <span
                                              aria-disabled="true"
                                              className={`flex min-h-12 cursor-default items-center justify-between gap-2.5 px-2.5 py-1.5 ${
                                                sub.soon ? "opacity-60" : ""
                                              }`}
                                            >
                                              {body}
                                              {sub.soon ? (
                                                <span className="shrink-0 rounded-full bg-ink/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-ink/55">
                                                  Soon
                                                </span>
                                              ) : null}
                                            </span>
                                          ) : (
                                            <Link
                                              href={sub.href}
                                              onClick={() => setOpen(false)}
                                              className="group flex min-h-12 items-center justify-between gap-2.5 px-2.5 py-1.5 transition-colors duration-200 hover:bg-cream/70"
                                            >
                                              {body}
                                              <FiChevronRight className="shrink-0 text-[14px] text-ink/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                                            </Link>
                                          )}
                                        </li>
                                      );
                                    })}
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
