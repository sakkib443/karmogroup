"use client";

import Link from "next/link";
import Image from "next/image";
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
  FiArrowRight,
  FiArrowUpRight,
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
  TbArmchair,
  TbBed,
  TbFeather,
  TbFlask,
  TbTag,
} from "react-icons/tb";

/**
 * The Home 02 header — a light, three-row retail bar, built to the reference
 * the client sent.
 *
 * It is a different argument from Home 01's. That one is a dark bar floating
 * over a photograph, built for a brochure: seven product menus and nothing to
 * click but them. This one is a shop front. It gives away the top of the
 * screen to a search field and puts favourites, account and basket where a
 * buyer reaches for them, which is only worth doing if there is something to
 * search and something to put in a basket.
 *
 * Three rows at rest, each with one job:
 *
 *   1. Announcement — the delivery promise, order tracking, the social row.
 *      The only dark band; it stops the light header floating off the page.
 *   2. Identity and tools — wordmark, search, the three account icons.
 *   3. Navigation — a division per entry, each with an icon and a line of
 *      trade under it, and one call to action held to the right.
 *
 * Scrolled, two things change and the third deliberately does not:
 *
 *   · The announcement band stays exactly as it is — red, full height, every
 *     line of it. Earlier this rolled away past 40px of scroll; the client
 *     wants it kept, so it is no longer scroll-aware at all.
 *   · Rows 2 and 3 merge into one: the logo on the left — cropped down to
 *     just the mark, see `ScrolledLogo` — the division menu centred on the
 *     bar, and the icons on the right, Find a Store now among them again once
 *     the narrower logo freed the room for it. The search field is what
 *     actually drops: even with that room back there is not space for six
 *     things in one 74px bar, and it is the one the mobile drawer already
 *     duplicates.
 *   · At rest, the two rows stay exactly as they were — separate, with the
 *     search field and the full navigation row. This merge is a scrolled-only
 *     state, not a redesign of the resting header.
 *
 * The two shapes cross-fade into each other rather than one replacing the
 * other outright — see the comment above the two `grid-template-rows`
 * wrappers in the render for how, and why a plain conditional render could
 * not have animated it.
 *
 * `DivisionNav` and `FindStoreButton` below serve both the resting row 3 and
 * the merged row, so the menu behaves identically wherever it is standing.
 *
 * Two logos, two files, not one shrunk. At rest this uses `logo-ink.png`, the
 * ink cut of the full wordmark — the default artwork sets "GROUP", "Since
 * 1965" and the ® in white so it can sit on a photograph, and on a light bar
 * half of it would vanish. Scrolled it uses `logo-mark.png`, the client's
 * short mark: the black 1965 device and "KARMO", no "GROUP".
 *
 * Colour follows Karmo rather than the reference, whose deep green belongs to
 * another brand. The dark here is the same cool slate the rest of the site
 * uses, and the red is the brand red — kept to the search button, the sale
 * entry and the basket count, so it marks the three things worth marking.
 */

const nav = [
  {
    name: "Foam",
    line: "Furniture, footwear, automotive",
    href: "/foam",
    icon: TbArmchair,
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
    line: "Pocket spring, euro top",
    href: "/mattress",
    icon: TbBed,
  },
  {
    name: "HomeTex",
    line: "Bed sheets, comforters",
    href: "/hometex",
    icon: TbFeather,
    image: "/karmo/images/divisions/hometex-bed-linen.jpg",
    alt: "A bed made up in cream sateen bedding with stacked linen pillows",
    submenu: [
      { name: "Pillow", href: "/hometex/pillow" },
      { name: "Cushion", href: "/hometex/cushion" },
      { name: "Bed Sheet", href: "/hometex/bed-sheet" },
      { name: "Comforter", href: "/hometex/comforter" },
    ],
  },
  {
    name: "Chemicals",
    line: "Adhesives, polymers",
    href: "/chemicals",
    icon: TbFlask,
    image: "/karmo/images/divisions/chemicals-bench.jpg",
    alt: "Polyurethane foam sheets, a beaker of resin and sample tins on an oak bench",
    submenu: [
      { name: "Karmo Adhesive", href: "/chemicals/adhesive" },
      { name: "Evergain Chemical", href: "/chemicals/evergain" },
      { name: "Sodium Silicate", href: "/chemicals/sodium-silicate" },
    ],
  },
  {
    name: "Sale",
    line: "Special offers",
    href: "/sale",
    icon: TbTag,
    accent: true,
  },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

/** Heart, person and bag share everything but their glyph and their count. */
function Tool({ icon: Icon, label, href, count }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1.5 text-ink transition-colors duration-300 hover:text-brand"
    >
      <span className="relative">
        <Icon className="text-[21px]" />
        {count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
            {count}
          </span>
        )}
      </span>
      <span className="text-[11px] font-semibold tracking-[0.02em]">
        {label}
      </span>
    </Link>
  );
}

/**
 * The division menu, in both the shapes it has to take.
 *
 * It lives in two rows now — its own at rest, and the identity row once the
 * bar is scrolled and the two merge. Extracted rather than written twice
 * because the hover handlers, the chevron state and the accent rule all have
 * to behave identically in both, and two copies of that drift.
 *
 * Only one is ever *displayed*: the other row is `display: none` or collapsed
 * to nothing, so screen readers are never offered two navigations even though
 * both are in the markup.
 *
 * `compact` drops the line of trade under each name and tightens the padding.
 * That is not a style preference — the full entry is two lines and 68px tall,
 * and the row it merges into is 74px with a logo in it. Something had to give,
 * and the sub-line is the part a reader who has already scrolled past the top
 * of the page no longer needs.
 */
function DivisionNav({ compact, panel, openPanel }) {
  return (
    <nav aria-label="Divisions">
      <ul className="flex items-center">
        {nav.map((entry) => (
          <li key={entry.name} className="relative">
            <Link
              href={entry.href}
              onMouseEnter={() => openPanel(entry.name)}
              onFocus={() => openPanel(entry.name)}
              className={`flex items-center transition-colors duration-300 ${
                compact ? "gap-2 px-3 py-2.5" : "gap-3 py-3.5 pr-8"
              } ${entry.accent ? "text-brand" : "text-ink hover:text-brand"}`}
            >
              <entry.icon
                className={`${compact ? "text-[17px]" : "text-[19px]"} ${
                  entry.accent ? "text-brand" : "text-ink/55"
                }`}
              />
              <span className="block">
                <span
                  className={`display block font-bold uppercase leading-none tracking-[0.1em] ${
                    compact ? "text-[11.5px]" : "text-[12px]"
                  }`}
                >
                  {entry.name}
                </span>
                {!compact && (
                  <span className="mt-1 block text-[10.5px] leading-none text-ink/50">
                    {entry.line}
                  </span>
                )}
              </span>
              {entry.submenu && (
                <FiChevronDown
                  className={`text-[13px] text-ink/40 transition-transform duration-300 ${
                    panel === entry.name ? "rotate-180" : ""
                  }`}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Black bar, red tile — the map pin sits on a solid brand square, the one spot
 * of colour on a dark button. On hover the bar lifts to the lighter slate, the
 * tile nudges up with a soft red glow, and the arrow warms to brand and follows.
 *
 * `compact` drops "Showrooms nationwide" and the arrow. In the merged row this
 * button is competing with the whole menu for width, and a second line of
 * 10.5px text is the cheapest thing in it to lose.
 */
/**
 * The short mark, for the merged bar — the client's own artwork, added as
 * `/karmo/logo-mark.png`.
 *
 * This is a genuinely separate file rather than a crop of the full wordmark,
 * and that matters: the black factory device carrying "Since 1965" is drawn
 * in *black* here, where the wordmark's version of it is part of a lockup
 * that reads differently. Trying to make the long logo behave as the short
 * one by cropping and letting its white halves disappear against this bar
 * lost that black device entirely and left the mark looking broken. There was
 * no version of that trick worth keeping once the real file existed.
 *
 * 400x120, ink from x9 to x390 and y16 to y103 — padded evenly on all four
 * sides, so it needs no `object-position` nudge and no crop box. Straight
 * `Logo` with the file's own intrinsic size, height set by the caller.
 */
function ScrolledLogo({ className }) {
  return (
    <Logo
      src="/karmo/logo-mark.png"
      width={400}
      height={120}
      className={`w-auto ${className}`}
      priority
    />
  );
}

function FindStoreButton({ compact }) {
  return (
    <Link
      href="/find-store"
      className="group flex h-[46px] shrink-0 items-center gap-3 rounded-[4px] bg-shade-soft pl-1.5 pr-4 text-white transition-colors duration-300 hover:bg-shade"
    >
      <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[3px] bg-brand text-white shadow-[0_4px_12px_-4px_rgba(230,0,0,0.6)] transition-all duration-300 group-hover:-translate-y-px group-hover:shadow-[0_6px_16px_-4px_rgba(230,0,0,0.75)]">
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

export default function HeaderTwo() {
  const [open, setOpen] = useState(false);

  // Still needed even though the announcement band no longer answers to it:
  // `scrolled` is what switches rows 2 and 3 between their resting shape and
  // the merged one, and what puts the shadow and blur on the bar once the
  // page beneath it is no longer the hero.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // What opens on hover is now Home 03's panel, not Home 02's old list: a
  // photograph on the right, the sub-ranges as a two-column list beside it,
  // rather than a column of words hanging off the link. The bar above it —
  // logo, search, the three account icons, the division row itself — is
  // untouched; only what drops below a division with a submenu changed.
  //
  // The open/close mechanics are Home 03's too: a name in state rather than
  // `group-hover`, so the close can carry a short grace period (160ms) and
  // survive the pointer crossing the gap between the link and the panel
  // instead of snapping shut the instant it leaves the link.
  const [panel, setPanel] = useState(null);
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

  const openEntry = nav.find((entry) => entry.name === panel && entry.submenu);

  return (
    <header
      onMouseLeave={closePanel}
      // A hairline shadow is enough while the page sits at the top, where the
      // hero underneath supplies its own separation. Scrolled, the bar has
      // nothing behind it but page content, so it earns a real shadow and a
      // wash of blur — the same lift a glass panel gets over whatever passes
      // beneath it, rather than a flat white slab dropped on the page.
      //
      // The 3px brand rule on top is always there, not switched on at the
      // scroll threshold, and that is the point: at rest it sits directly above
      // the red announcement band and disappears into it, so nothing changes
      // where nothing needed changing. Once the band rolls away it is the only
      // red left at the top of the screen, and it caps the white bar instead of
      // letting it float edge-to-edge against the page. Conditional would have
      // meant a line appearing out of nothing at 40px of scroll; unconditional
      // means one rule that is simply revealed. It is a real `border-t` rather
      // than an overlay, so the bar honestly measures 3px taller and the
      // layout's offset below accounts for it.
      className={`fixed inset-x-0 top-0 z-[10000] border-t-[3px] border-brand transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "bg-white/95 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md"
          : "bg-white shadow-[0_1px_0_rgba(34,34,34,0.08)]"
      }`}
    >
      {/* ── 1 · Announcement ─────────────────────────────────────────── */}
      {/* No longer scroll-aware. This used to collapse to nothing past 40px of
          scroll, on the argument that a reader who has moved on does not need
          the hotline repeated. The client wants it kept — red, full height, at
          every scroll position — so the visibility toggle that lived here is
          gone rather than disabled; there is nothing left for `scrolled` to
          decide about this row. */}
      <div
        // Brand red, not the slate this used to run on. White on #e60000
        // measures 4.81:1, which clears the 4.5:1 bar for the 11px text in
        // here — but only at full white. Every dimmed white on this row had to
        // come up to solid for that reason: white/75 lands at 3.03:1, and the
        // hours and the social icons were both set that way. Weight and size
        // carry the hierarchy here instead of opacity.
        className="bg-brand text-white"
      >
        <div className="shell flex h-8 items-center justify-between gap-6">
          {/* The hotline, not a delivery promise. This band is the first line
              on the page and the client wants it spent on how to reach them.
              The number is a real `tel:` link — on a phone the top line of the
              site is then one tap from a call, which is the whole point of
              putting it here.

              One face, one weight, one size across the whole band. The number
              was set apart at first — the heading face at 13px, tracking near
              zero, on the argument that letterspaced digits are harder to
              reassemble than letterspaced words. Two typefaces and three
              weights inside a 32px strip read as a mistake before they read as
              emphasis, so the whole row is now the same 11px bold caps and the
              `<p>` alone declares it. If the number needs to stand out again,
              size can do it without breaking the face or the weight. */}
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em]">
            {/* The icon was brand red and the hover went to brand red — both
                invisible now the band is that colour. The hover is a wash of
                the bar's own white instead, which is the only move available
                on a solid field. */}
            <a
              href="tel:+8801713483284"
              className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-75"
            >
              <FiPhone className="shrink-0 text-[13px]" />
              01713 483 284
            </a>

            <span aria-hidden="true" className="h-3 w-px bg-white/40" />

            <span className="flex items-center gap-2">
              <FiClock className="shrink-0 text-[13px]" />
              Everyday 9 AM &ndash; 10 PM
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-5">
            {/* Same 11px bold caps as the left of the band — it was 11.5px
                semibold in sentence case, which is a fourth setting inside one
                strip. */}
            <Link
              href="/track"
              className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-75 sm:flex"
            >
              <FiMapPin className="text-[13px]" />
              Track Order
            </Link>

            <span aria-hidden="true" className="hidden h-3 w-px bg-white/40 sm:block" />

            <div className="flex items-center gap-3.5">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Karmo Group on ${label}`}
                  className="transition-opacity duration-300 hover:opacity-70"
                >
                  <Icon className="text-[13px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2 + 3 · Identity, tools and navigation ───────────────────── */}
      {/* Two shapes, both always in the DOM now, cross-fading on `scrolled`
          rather than one hard-swapped for the other. The client asked for the
          merge to animate rather than snap, and a straight `{cond && <...>}`
          toggle cannot do that — React unmounts one tree and mounts the other
          on the same render, with nothing on screen for either to transition
          from or to.

          Each wrapper animates `max-height` and `opacity` together, the same
          technique the announcement band already used before it was made
          unconditional — chosen over a `grid-template-rows` 0fr/1fr collapse
          (the more general modern answer, no pixel value required) because
          that one measured unreliably here: identical fresh loads and a
          single clean toggle sometimes settled at the right computed height
          and sometimes visibly stuck at the pre-transition value, with no
          difference in the applied class each time — a real animation bug in
          this rendering path, not a fixed cost worth accepting for the more
          elegant technique. `max-height` needs a real number, which is why it
          is fine here and would not be for content of unknown height: both
          rows are fixed by their own `h-[..px]` children: 74px for the merged
          bar, and 143px for the resting pair from lg up, where the nav row is
          not `hidden`. That 143 is 74 + 68 + the nav row's own 1px `border-t`
          — it was written as 142 first, which clipped a pixel and left the
          resting header measuring 177 against the layout's 178px offset. The
          same border has now caught this file twice; if either row grows,
          measure the rendered height rather than adding up the classes.

          Both trees carry real `DivisionNav`s, `Tool`s and forms, so the one
          currently collapsed is not merely hidden — `inert` disowns it: no
          tab stops, no hover, no announcement to a screen reader, for as long
          as it is collapsed, without needing a delayed unmount once the
          animation finishes. */}
      <div
        aria-hidden={scrolled || undefined}
        inert={scrolled || undefined}
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "max-h-0 opacity-0"
            : "max-h-[74px] opacity-100 lg:max-h-[143px]"
        }`}
      >
        <div>
          <div className="shell flex h-[74px] items-center justify-between gap-8">
            {/* `/`, not `/home-2`. This header used to be the chrome for the
                /home-2 route and pointed its logo back at it; that route now
                carries the other design, and this one is the front page. */}
            <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
              <Logo src="/karmo/logo-ink.png" className="h-8 w-auto lg:h-9" priority />
            </Link>

            {/* Given the middle of the bar because on a shop the search field
                is the thing most people came for. Hidden below lg, where it
                moves into the drawer. */}
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="hidden h-[46px] max-w-[620px] flex-1 items-stretch overflow-hidden rounded-[4px] border border-ink/15 bg-cream/60 transition-colors duration-300 focus-within:border-brand/50 focus-within:bg-white lg:flex"
            >
              <input
                type="search"
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
                <span className="relative text-[12px] font-bold uppercase tracking-[0.12em]">
                  Search
                </span>
              </button>
            </form>

            <div className="flex shrink-0 items-center gap-6 lg:gap-7">
              <span className="hidden sm:contents">
                <Tool icon={FiHeart} label="Favourites" href="/wishlist" count={3} />
                <Tool icon={FiUser} label="Account" href="/login" />
              </span>
              <Tool icon={FiShoppingBag} label="Cart" href="/cart" count={2} />

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="text-[22px] text-ink lg:hidden"
              >
                {open ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          <div className="hidden overflow-hidden border-t border-ink/8 lg:block">
            <div className="shell flex h-[68px] items-center justify-between gap-6">
              <DivisionNav panel={panel} openPanel={openPanel} />
              <FindStoreButton />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!scrolled || undefined}
        inert={!scrolled || undefined}
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "max-h-[74px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div>
          <div className="shell flex h-[74px] items-center gap-4">
            {/* The short mark, not the full wordmark — see `ScrolledLogo`.
                147px rendered against the resting logo's 319, so it hands 172px
                back to the row.

                Worth being honest about where that went, because it did not go
                to the menu: Find a Store, added to the right in the same pass,
                costs 218px. The bar is a net ~46px tighter than before, not
                looser, and the menu's breakpoint stayed where it was rather
                than coming down. Dropping Find a Store again is what would
                actually buy the menu room at 1280. */}
            <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
              <ScrolledLogo className="h-10 lg:h-11" />
            </Link>

            {/* Centred in the space *left over* between the logo and the
                icons, not on the bar as a whole — the two are unequal widths
                even now, and centring against the full row measurably crowded
                whichever side was wider. `flex-1` sidesteps the asymmetry
                instead of compensating for it — the menu centres in whatever
                room the logo and the icons actually leave, so it stays
                balanced between them regardless of how wide either one is.

                The breakpoint is its own, not `lg`, and it is tight rather
                than cautious. Measured at this size: the menu is 593px
                intrinsic, the logo 147 and the icons 409, which with the 32px
                gap needs 1181px of content — 1341px of window once `.shell`
                takes its 80px each side. `min-[1360px]` is the nearest round
                number above that, and it lands at 47px of clearance either
                side, not the ~100 an earlier note here claimed. At 1280 the
                row has 524px free against the menu's 593 and genuinely does
                not fit. Below the breakpoint this row is logo and icons only,
                with the hamburger reaching the same drawer. */}
            <div className="hidden min-[1360px]:flex min-[1360px]:flex-1 min-[1360px]:justify-center">
              <DivisionNav compact panel={panel} openPanel={openPanel} />
            </div>

            {/* Find a Store returns here, at the client's ask, spending the
                room the narrower logo freed on the left. `sm:flex` rather
                than always-on for the same reason Favourites/Account already
                hide below that width: a phone-width merged bar has logo,
                cart and the hamburger to fit and nothing to spare. */}
            <div className="ml-auto flex shrink-0 items-center gap-6 lg:gap-7">
              <span className="hidden sm:contents">
                <Tool icon={FiHeart} label="Favourites" href="/wishlist" count={3} />
                <Tool icon={FiUser} label="Account" href="/login" />
              </span>
              <Tool icon={FiShoppingBag} label="Cart" href="/cart" count={2} />

              <span className="hidden sm:block">
                <FindStoreButton compact />
              </span>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="text-[22px] text-ink min-[1360px]:hidden"
              >
                {open ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Division panel ───────────────────────────────────────────── */}
      {/* Home 03's shape exactly: description and "the whole division" on the
          left, the sub-ranges in two columns, the division's own photograph
          on the right so the panel shows the range instead of just naming it.
          Hangs below the bar full width rather than off one link, which is
          why it lives here instead of inside the `<li>`. */}
      {openEntry && (
        <div
          onMouseEnter={() => openPanel(openEntry.name)}
          onMouseLeave={closePanel}
          className="absolute inset-x-0 top-full hidden bg-white shadow-[0_24px_50px_-18px_rgba(0,0,0,0.35)] lg:block"
        >
          <div className="shell grid grid-cols-12 gap-10 py-9">
            <div className="col-span-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brand">
                {openEntry.name}
              </span>
              <p className="body-copy mt-3 text-[13.5px] leading-[1.75] text-ink/55">
                {openEntry.line}
              </p>
              <Link
                href={openEntry.href}
                className="group mt-6 inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink"
              >
                The whole division
                <FiArrowUpRight className="text-brand transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <ul className="col-span-5 grid grid-cols-2 gap-x-8 gap-y-1 self-start">
              {openEntry.submenu.map((sub) => (
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
              href={openEntry.href}
              className="group relative col-span-4 aspect-[16/10] overflow-hidden"
            >
              <Image
                src={openEntry.image}
                alt={openEntry.alt}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-shade-deep/80 to-transparent" />
              <span className="display absolute bottom-5 left-5 text-[1.15rem] font-bold tracking-[-0.02em] text-white">
                {openEntry.name}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Drawer, below lg ─────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-ink/8 bg-white lg:hidden">
          <div className="shell py-5">
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="mb-5 flex items-center gap-2 rounded-full border border-ink/12 bg-cream/60 py-1.5 pl-5 pr-1.5"
            >
              <input
                type="search"
                placeholder="Search the range…"
                aria-label="Search the Karmo range"
                className="body-copy min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink/45"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white"
              >
                <FiSearch className="text-[16px]" />
              </button>
            </form>

            <ul className="divide-y divide-ink/8">
              {nav.map((entry) => (
                <li key={entry.name}>
                  <Link
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3.5 py-3"
                  >
                    <entry.icon
                      className={`text-[20px] ${
                        entry.accent ? "text-brand" : "text-ink/55"
                      }`}
                    />
                    <span>
                      <span
                        className={`display block text-[13px] font-bold uppercase tracking-[0.08em] ${
                          entry.accent ? "text-brand" : "text-ink"
                        }`}
                      >
                        {entry.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink/50">
                        {entry.line}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/find-store"
              onClick={() => setOpen(false)}
              className="mt-5 flex items-center justify-center gap-3 rounded-full bg-shade-soft py-3.5 text-[13px] font-bold text-white"
            >
              <FiMapPin className="text-[16px]" />
              Find a Store
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
