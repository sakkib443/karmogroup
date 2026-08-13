"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/karmo/Logo";
import {
  FiPhone,
  FiClock,
  FiMapPin,
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiChevronDown,
  FiChevronRight,
  FiArrowUpRight,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
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
 * The Home Two header — two layers, not three.
 *
 * Home One's bar carries the same contents in three rows: a red announcement,
 * an identity row with the search field, and a navigation row beneath it. It
 * already knows how to fold the bottom two together — that is its scrolled
 * state — so this design takes that folded shape and makes it the only shape
 * there is:
 *
 *   1. Top bar — hotline, hours, order tracking, socials. Unchanged.
 *   2. Menu bar — wordmark left, divisions centred, tools and the store button
 *      right.
 *
 * What the third row was spending its height on is the search field, and that
 * is the one thing a single row cannot also hold. It becomes an icon here; the
 * field it opens drops below the bar rather than living in it, so searching
 * costs a click but costs the header no height.
 *
 * Home One's 3px brand rule above the announcement is gone rather than ported.
 * It exists there to cap the white bar in the state where the red band has
 * rolled away — a state this header does not have, since the band is permanent
 * at the client's ask. Three brand-red pixels directly above a brand-red band
 * are three pixels nobody can see.
 *
 * The bar is a fixed 112px at every width: 32 for the top bar, 80 for the menu.
 * Both are fixed heights on purpose — the layout offsets the page by that
 * number, and a row that grew with its contents would start every page that far
 * underneath the header. Unlike Home One there is no second figure and no
 * breakpoint at which the offset changes.
 */

/**
 * The menu is words only — no glyph beside any entry.
 *
 * Home One sets an icon against each division because its navigation has a row
 * to itself and two lines per entry to fill. Here the menu shares one 80px row
 * with the logo and the tools, so a glyph on every entry would read as a second
 * cluster of symbols competing with the two on the right — and the icons are
 * also what makes a six-entry menu too wide for that row to hold.
 *
 * The company pages are top-level entries rather than a submenu. Home One
 * collects About, Contact, Portfolio and Find a Store behind a single "All
 * Menu" doorway, which is what a bar full of icons has room for; a text menu
 * can simply name the two people actually look for. Portfolio keeps its place
 * in the drawer and the footer.
 *
 * What opens under Foam / HomeTex / Chemicals is a compact card, not a photo
 * panel — the shape of the "Shop By" reference the client sent instead of the
 * full-width mega menu they said they did not like. Mattress, About and
 * Contact are plain links with no submenu: one page each, nothing to list.
 */
const nav = [
  {
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    submenu: [
      { name: "Set / Block Foam", href: "/foam/set-foam", icon: TbBox },
      { name: "Rebonded Foam", href: "/foam/rebonded", icon: TbRecycle },
      { name: "Contour Design Foam", href: "/foam/contour-design", icon: TbShape },
      { name: "Acoustic Foam", href: "/foam/acoustic", icon: TbWaveSine },
      { name: "Peeling Roll Foam", href: "/foam/peeling-roll", icon: TbStack },
      { name: "Footwear / Load Bearing", href: "/foam/footwear", icon: TbShoe },
      { name: "Bed & Automotive", href: "/foam/bed-automotive", icon: TbCar },
      { name: "Memory Foam", href: "/foam/memory-foam", icon: TbCloud },
    ],
  },
  {
    name: "Mattress",
    line: "Pocket spring, euro top",
    href: "/mattress",
    /* Three ways into the same range at once, the shape of the "Shop By"
       reference the client sent for this exact division — not a single list
       like Foam/HomeTex/Chemicals, so it renders through `columns`, not
       `submenu`. Coir and Latex are the client's own reference items; Karmo's
       confirmed line is foam and spring (see CLIENT-FEEDBACK.md's open
       questions) — swap or drop what does not actually exist once confirmed. */
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
        /* The bed with the sleepers in it, not one or the other — a bed glyph
           alone is the same rectangle at every size, and a row of figures
           alone loses the bed. Drawn locally; see `BedSizeIcons`. */
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
    ],
  },
  {
    name: "HomeTex",
    line: "Bed sheets, comforters",
    href: "/hometex",
    submenu: [
      { name: "Pillow", href: "/hometex/pillow", icon: TbSquareRounded },
      { name: "Cushion", href: "/hometex/cushion", icon: TbDiamond },
      { name: "Bed Sheet", href: "/hometex/bed-sheet", icon: TbBedFlat },
      { name: "Comforter", href: "/hometex/comforter", icon: TbLayoutGrid },
    ],
  },
  {
    name: "Chemicals",
    line: "Adhesives, polymers",
    href: "/chemicals",
    submenu: [
      { name: "Karmo Adhesive", href: "/chemicals/adhesive", icon: TbDroplet },
      { name: "Evergain Chemical", href: "/chemicals/evergain", icon: TbTestPipe },
      { name: "Sodium Silicate", href: "/chemicals/sodium-silicate", icon: TbAtom },
    ],
  },
  { name: "About", line: "The group since 1965", href: "/about" },
  { name: "Contact", line: "Talk to us", href: "/contact" },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

/**
 * A right-hand tool — glyph only, with its label carried by `aria-label`.
 *
 * Home One stacks a written label under each of these because its identity row
 * is 74px of mostly empty space. Here the same icons share one row with the
 * whole division menu, and two lines under each would push the menu out of the
 * middle of the bar.
 */
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

/** The division menu that sits in the middle of the bar. */
function DivisionNav({ panel, openPanel, leaveMenuZone, dismissPanel }) {
  return (
    <nav aria-label="Divisions" data-mega-menu onMouseLeave={leaveMenuZone}>
      <ul className="flex items-center">
        {nav.map((entry, index) => (
          <li key={entry.name} className="relative">
            <Link
              href={entry.href}
              onMouseEnter={() => openPanel(entry.name)}
              onFocus={() => openPanel(entry.name)}
              className="flex items-center gap-1.5 px-2.5 py-2.5 text-ink transition-colors duration-300 hover:text-brand"
            >
              <span className="display block text-[13px] font-bold uppercase leading-none tracking-[0.1em]">
                {entry.name}
              </span>
              {(entry.submenu || entry.columns) && (
                <FiChevronDown
                  className={`text-[13px] text-ink/40 transition-transform duration-300 ${
                    panel === entry.name ? "rotate-180" : ""
                  }`}
                />
              )}
            </Link>

            {/* Shop-By-style card: heading, then the sub-ranges as a plain
                list — icon, name, chevron, a hairline between rows. Anchored
                to this `<li>`, not the header, so it is only ever as wide as
                the list needs. The last entry anchors right instead of left
                so its card cannot run off the edge of the window. */}
            {entry.submenu && (
              <div
                data-mega-menu
                onMouseEnter={() => openPanel(entry.name)}
                onMouseLeave={leaveMenuZone}
                className={`absolute top-full z-[1100] hidden w-[21rem] bg-[#f7f7f7] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.25)] transition-all duration-300 xl:block ${
                  index === nav.length - 1 ? "right-0" : "left-0"
                } ${
                  panel === entry.name
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className="border-b border-ink/10 px-6 pb-4 pt-6">
                  <span className="text-[13px] text-ink/55">Shop By </span>
                  <span className="display text-[20px] font-bold text-ink">
                    {entry.name}
                  </span>
                </div>

                <ul>
                  {entry.submenu.map((sub, subIndex) => (
                    <li
                      key={sub.href}
                      className={
                        subIndex < entry.submenu.length - 1
                          ? "border-b border-ink/10"
                          : ""
                      }
                    >
                      <Link
                        href={sub.href}
                        onClick={dismissPanel}
                        className="group flex items-center justify-between gap-3 px-6 py-3.5 transition-colors duration-200 hover:bg-white"
                      >
                        <span className="flex items-center gap-3">
                          <sub.icon className="shrink-0 text-[19px] text-ink/60" />
                          <span className="text-[13.5px] font-medium text-ink">
                            {sub.name}
                          </span>
                        </span>
                        <FiChevronRight className="shrink-0 text-[14px] text-ink/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* The wide card: Mattress alone, three ways to shop it side by
                side rather than one list — the shape of the client's own
                "Shop By Comfort / Size / Type" reference. Icons on Comfort
                and Size, none on Type, matching that reference exactly. */}
            {entry.columns && (
              <div
                data-mega-menu
                onMouseEnter={() => openPanel(entry.name)}
                onMouseLeave={leaveMenuZone}
                className={`absolute left-0 top-full z-[1100] hidden w-[54rem] bg-[#f7f7f7] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.25)] transition-all duration-300 xl:block ${
                  panel === entry.name
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className="grid grid-cols-3 divide-x divide-ink/10 px-8 py-7">
                  {entry.columns.map((col) => (
                    <div key={col.label} className="px-6 first:pl-0 last:pr-0">
                      <div className="border-b border-ink/10 pb-3">
                        <span className="text-[13px] text-ink/55">Shop By </span>
                        <span className="display text-[18px] font-bold text-ink">
                          {col.label}
                        </span>
                      </div>

                      <ul>
                        {col.items.map((item, itemIndex) => (
                          <li
                            key={item.href}
                            className={
                              itemIndex < col.items.length - 1
                                ? "border-b border-ink/10"
                                : ""
                            }
                          >
                            <Link
                              href={item.href}
                              onClick={dismissPanel}
                              className="group flex items-center justify-between gap-3 py-3.5 transition-colors duration-200 hover:text-brand"
                            >
                              <span className="flex items-center gap-3.5">
                                {/* Bigger than the single-column cards' 19px:
                                    these are drawings with a headboard, pillows
                                    and a valance in them, and at 19px that
                                    detail closes up into a smudge. */}
                                {item.icon && (
                                  <item.icon className="shrink-0 text-[30px] text-ink/60" />
                                )}
                                <span className="text-[13.5px] font-medium text-ink">
                                  {item.name}
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Black bar, red tile — the map pin sits on a solid brand square, the one spot
 * of colour on a dark button. Ported from Home One in its compact shape: one
 * line, no arrow. The two-line version is 46px of a 80px row and would leave
 * the button taller than everything beside it.
 */
function FindStoreButton() {
  return (
    <Link
      href="/find-store"
      className="group flex h-[44px] shrink-0 items-center gap-2.5 rounded-[4px] bg-shade-soft pl-1.5 pr-4 text-white transition-colors duration-300 hover:bg-shade"
    >
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[3px] bg-brand text-white shadow-[0_4px_12px_-4px_rgba(212,67,72,0.6)] transition-all duration-300 group-hover:-translate-y-px group-hover:shadow-[0_6px_16px_-4px_rgba(212,67,72,0.75)]">
        <FiMapPin className="text-[15px]" />
      </span>
      <span className="display block text-[12.5px] font-bold leading-none">
        Find a Store
      </span>
    </Link>
  );
}

export default function HeaderHomeTwo() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  // Only earns the bar its shadow and blur once there is page content passing
  // underneath it. Neither row changes shape on scroll — that is the whole
  // point of building the folded shape as the resting one.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll + Escape while the drawer is open.
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

  // Close the drawer once the desktop nav can take over, so it cannot stick
  // open with no hamburger left to dismiss it.
  useEffect(() => {
    const sync = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Escape closes the search sheet.
  useEffect(() => {
    if (!search) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSearch(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [search]);

  // Mega panel. Hover keeps it open while the pointer is on the division row or
  // the panel itself (both carry `data-mega-menu`); leaving that zone starts a
  // short grace close so the pointer can cross the seam between them.
  const [panel, setPanel] = useState(null);
  const closeTimer = useRef(null);

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

  // Click or Escape outside the division row / panel closes it at once. Hover
  // alone leaves the panel hanging when the pointer settles on the white chrome
  // of the bar or the page beneath it.
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
    <header
      className={`fixed inset-x-0 top-0 z-[10000] transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "bg-white/95 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md"
          : "bg-white shadow-[0_1px_0_rgba(34,34,34,0.08)]"
      }`}
    >
      {/* ── 1 · Top bar ──────────────────────────────────────────────── */}
      {/* Full height at every scroll position, at the client's ask. White here
          is solid rather than dimmed throughout: white on #e60000 measures
          4.81:1, which clears the 4.5:1 bar for 11px text, but white/75 drops
          to 3.03:1. Weight and size carry the hierarchy instead of opacity. */}
      <div className="bg-brand text-white">
        <div className="shell-home-two flex h-8 items-center justify-between gap-3 sm:gap-6">
          <p className="flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] sm:gap-3 sm:text-[11px] sm:tracking-[0.12em]">
            <a
              href="tel:+8801713483284"
              className="flex shrink-0 items-center gap-2 text-[11px] transition-opacity duration-300 hover:opacity-75 sm:gap-2.5 sm:text-[12px]"
            >
              <FiPhone className="shrink-0 text-[13px]" />
              01713483284
            </a>

            <span aria-hidden="true" className="hidden h-3 w-px bg-white/40 sm:block" />

            <span className="hidden items-center gap-2 sm:flex">
              <FiClock className="shrink-0 text-[13px]" />
              Everyday 9 AM &ndash; 10 PM
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              href="/track"
              className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-75 sm:flex"
            >
              <FiMapPin className="text-[13px]" />
              Track Order
            </Link>

            <span aria-hidden="true" className="hidden h-3 w-px bg-white/40 sm:block" />

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Karmo Group on ${label}`}
                  className="transition-opacity duration-300 hover:opacity-70"
                >
                  <Icon className="text-[12px] sm:text-[13px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2 · Menu bar ─────────────────────────────────────────────── */}
      <div className="shell-home-two flex h-[80px] items-center gap-4">
        <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
          <Logo
            src="/karmo/logo-ink.png"
            className="h-7 w-auto max-w-[min(50vw,13rem)] sm:h-8 sm:max-w-none"
            priority
          />
        </Link>

        {/* Centred in the room the logo and the tools actually leave, not on the
            bar as a whole — the two sides are unequal widths, and centring
            against the full row crowds whichever one is wider. `flex-1` lets
            the menu balance between them however wide either grows.

            `xl` rather than `lg`, and measured rather than guessed: the menu
            is 586px intrinsic, the wordmark 232 and the right-hand cluster
            238, which with the two 16px gaps needs 1088px of content and
            1248px of window once `.shell` has taken its 80px each side. That
            leaves 32px of slack at 1280 and grows from there; `lg` at 1024 is
            240px short of fitting it at all.

            Entry padding is `px-2.5` for that slack, not for looks. At `px-3`
            the menu measures 610 and the row lands within 8px of its own
            width at 1280 — it does not overflow, but the flex gaps become the
            only thing separating the menu from the logo and the button. If an
            entry is ever added here, measure this row again rather than
            trusting the numbers above. */}
        <div className="hidden flex-1 justify-center xl:flex">
          <DivisionNav
            panel={panel}
            openPanel={openPanel}
            leaveMenuZone={leaveMenuZone}
            dismissPanel={dismissPanel}
          />
        </div>

        {/* Two icons and one button, which is all a single row has space for
            beside a centred menu. Search is an icon rather than the field Home
            One gives the middle of its identity row to — the field it opens
            hangs below the bar instead, so it costs a click and no height.
            Favourites and Account move into the drawer for the same reason. */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Tool icon={FiSearch} label="Search the Karmo range" onClick={() => setSearch((v) => !v)} />
          <Tool icon={FiShoppingBag} label="Cart" href="/cart" count={2} />

          <span className="ml-1.5 hidden md:block">
            <FindStoreButton />
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

      {/* ── Search sheet ─────────────────────────────────────────────── */}
      {/* Hangs below the bar rather than growing it, so the layout's 112px
          offset holds whether this is open or shut. */}
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

      {/* ── Drawer — everything below the centred menu's breakpoint ───── */}
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
                      <span className="min-w-0 flex-1">
                        <span className="display block text-[13px] font-bold uppercase tracking-[0.08em] text-ink">
                          {entry.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-ink/50">
                          {entry.line}
                        </span>
                      </span>
                      <FiArrowUpRight className="shrink-0 text-brand" />
                    </Link>

                    {entry.submenu ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {entry.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className="block bg-cream px-3 py-1.5 text-[12px] text-ink/70"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* The two tools the single-row bar could not keep. */}
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

              {/* Portfolio has no top-level entry now that the menu names
                  About and Contact directly instead of collecting all four
                  company pages behind one doorway. It keeps its place here and
                  in the footer. */}
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
                className="mt-2 flex items-center justify-center gap-3 bg-shade-soft py-3.5 text-[13px] font-bold text-white md:hidden"
              >
                <FiMapPin className="text-[16px]" />
                Find a Store
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
