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
 * Three rows, each with one job:
 *
 *   1. Announcement — the delivery promise, order tracking, the social row.
 *      The only dark band; it stops the light header floating off the page.
 *   2. Identity and tools — wordmark, search, the three account icons.
 *   3. Navigation — a division per entry, each with an icon and a line of
 *      trade under it, and one call to action held to the right.
 *
 * The wordmark is the ink cut, not the default. The default artwork sets
 * "GROUP", "Since 1965" and the ® in white so it can sit on a photograph;
 * on a light bar half of it would vanish.
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

export default function HeaderTwo() {
  const [open, setOpen] = useState(false);

  // The bar keeps its place at the top of the window, so the announcement row
  // rolls away on scroll rather than the whole thing shrinking — the search
  // field and the divisions stay reachable the entire way down the page.
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
      <div
        aria-hidden={scrolled || undefined}
        // Brand red, not the slate this used to run on. White on #e60000
        // measures 4.81:1, which clears the 4.5:1 bar for the 11px text in
        // here — but only at full white. Every dimmed white on this row had to
        // come up to solid for that reason: white/75 lands at 3.03:1, and the
        // hours and the social icons were both set that way. Weight and size
        // carry the hierarchy here instead of opacity.
        className={`overflow-hidden bg-brand text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "invisible max-h-0 opacity-0" : "visible max-h-14 opacity-100"
        }`}
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

      {/* ── 2 · Identity and tools ───────────────────────────────────── */}
      {/* This row used to absorb the navigation row below it on scroll — the
          search field stepping aside for the division links, so logo and menu
          shared one bar. The client wants the two rows kept apart, so it no
          longer does: the search field stays where it is at every scroll
          position, and row 3 stays put underneath. Only the announcement band
          above rolls away.

          What still changes on scroll is the logo, which grows — the bar reads
          as more established the further down the page it has followed, rather
          than as one that shrank to make room. */}
      <div className="shell flex h-[74px] items-center justify-between gap-8">
        {/* `/`, not `/home-2`. This header used to be the chrome for the
            /home-2 route and pointed its logo back at it; that route now
            carries the other design, and this one is the front page. */}
        <Link href="/" aria-label="Karmo Group, home" className="shrink-0">
          <Logo
            src="/karmo/logo-ink.png"
            className={`w-auto transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled ? "h-10 lg:h-11" : "h-8 lg:h-9"
            }`}
            priority
          />
        </Link>

        {/* Given the middle of the bar because on a shop the search field is
            the thing most people came for. Hidden below lg, where it moves
            into the drawer. */}
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

          {/* The scroll-only "Find a Store" button stood here. It existed
              because row 3 folded away on scroll and took the bar's only call
              to action with it. Row 3 stays now, so its own button is always
              on screen and this one was a duplicate. */}
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

      {/* ── 3 · Navigation ───────────────────────────────────────────── */}
      {/* Always on, at every scroll position. It used to roll away the same
          way the announcement does, on the argument that the row above had
          taken the menu on for itself — but that turned the header into one
          line, and the client wants the two rows kept. Only the announcement
          band collapses now. */}
      <div className="hidden overflow-hidden border-t border-ink/8 lg:block">
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <nav>
            <ul className="flex items-center">
              {nav.map((entry) => (
                <li key={entry.name} className="relative">
                  <Link
                    href={entry.href}
                    onMouseEnter={() => openPanel(entry.name)}
                    onFocus={() => openPanel(entry.name)}
                    className={`flex items-center gap-3 py-3.5 pr-8 transition-colors duration-300 ${
                      entry.accent ? "text-brand" : "text-ink hover:text-brand"
                    }`}
                  >
                    <entry.icon
                      className={`text-[19px] ${
                        entry.accent ? "text-brand" : "text-ink/55"
                      }`}
                    />
                    <span className="block">
                      <span className="display block text-[12px] font-bold uppercase leading-none tracking-[0.1em]">
                        {entry.name}
                      </span>
                      <span className="mt-1 block text-[10.5px] leading-none text-ink/50">
                        {entry.line}
                      </span>
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

          {/* Black bar, red tile — the map pin sits on a solid brand square,
              the one spot of colour on a dark button. Kept small and modern:
              on hover the bar lifts to the lighter slate, the tile nudges up
              with a soft red glow, and the arrow warms to brand and follows. */}
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
              <span className="block text-[10.5px] leading-tight text-white/60">
                Showrooms nationwide
              </span>
            </span>
            <FiArrowRight className="text-[14px] text-white/55 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
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
