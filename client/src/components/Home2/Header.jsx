"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  FiArrowRight,
  FiChevronDown,
  FiHeart,
  FiMail,
  FiMenu,
  FiPhone,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

import { SETTLE } from "./motion";

/* The slate-ink wordmark. Every surface in this header is white, and the
   default artwork sets "GROUP", "Since 1965" and the ® in white — on a white
   bar just over half the mark vanishes. The footer stays on the default,
   because that panel is dark and the reversed artwork is drawn for it. */
const LOGO_INK = "/home2/logo-ink.png";

/**
 * Navigation is the same tree Home 01 carries â same labels, same order, same
 * hrefs â so a visitor moving between the two homepages never has to relearn
 * where anything lives. Only the styling differs.
 *
 * Kept as its own copy rather than imported from the shared Navbar: that file
 * belongs to the corporate layout and is being worked on separately, and a
 * shared constant would couple two designs that are meant to stay independent.
 * If the tree changes there, mirror it here.
 */
const NAV = [
  {
    name: "Home",
    href: "/",
    submenu: [
      { name: "Home 01 â Organized", href: "/" },
      { name: "Home 02 â Luxe Retail", href: "/home-2" },
    ],
  },
  {
    name: "Foam",
    href: "/foam",
    submenu: [
      { name: "Furniture & Upholstery", href: "/foam/furniture-upholstery" },
      { name: "Studio / Acoustic Foam", href: "/foam/acoustic" },
      { name: "Footwear", href: "/foam/footwear" },
      { name: "Automotive", href: "/foam/automotive" },
      { name: "Visco Elastic / Memory Foam", href: "/foam/memory-foam" },
    ],
  },
  { name: "Mattress", href: "/mattress" },
  {
    name: "HomeTex / Bedding",
    href: "/hometex",
    submenu: [
      { name: "Pillow", href: "/hometex/pillow" },
      { name: "Cushion", href: "/hometex/cushion" },
      { name: "Bed Sheet", href: "/hometex/bed-sheet" },
      { name: "Comforter", href: "/hometex/comforter" },
    ],
  },
  {
    name: "Chemicals & Polymers",
    href: "/chemicals",
    submenu: [
      { name: "Karmo Adhesive", href: "/chemicals/adhesive" },
      { name: "Evergain Chemical", href: "/chemicals/evergain" },
      { name: "Sodium Silicate", href: "/chemicals/sodium-silicate" },
    ],
  },
  {
    name: "About Us",
    href: "/about",
    submenu: [
      { name: "Company History / Mission & Vision", href: "/about/history" },
      { name: "Board Of Directors", href: "/about/board" },
      { name: "Award & Achievements", href: "/about/awards" },
      { name: "Our Clients & Partners", href: "/about/partners" },
    ],
  },
  {
    name: "Media Center",
    href: "/media",
    submenu: [
      { name: "Blogs", href: "/media/blogs" },
      { name: "Karmo Memory", href: "/media/memory" },
      { name: "Karmo Static Ads", href: "/media/static-ads" },
      { name: "Karmo Video Ads", href: "/media/video-ads" },
    ],
  },
  {
    name: "Contact Us",
    href: "/contact",
    submenu: [
      { name: "Catalogues", href: "/contact/catalogues" },
      { name: "Bulk Order", href: "/contact/bulk-order" },
      { name: "Address / Map", href: "/contact/address" },
      { name: "FAQs", href: "/contact/faqs" },
    ],
  },
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  // The bar detaches only once the hero is well past, so it drops back in
  // already solid instead of fading in over the photograph.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <header className="main-header">
        {/* Placeholder so the page does not jump the frame the bar goes fixed.
            Its height is set in CSS so it tracks the bar across breakpoints. */}
        {stuck && <div className="header-spacer" aria-hidden="true" />}

        <div className={`header-sticky${stuck ? " active" : ""}`}>
          {/* Row 1 â wordmark and tools. Dropped once the bar sticks. */}
          <div className="header-top">
            <div className="container">
              <div className="header-wrapper">
                <Link
                  href="/home-2"
                  className="header-logo"
                  aria-label="Karmo Group home"
                >
                  {/* Same sizing Home 01 uses, so the wordmark reads at the
                      same scale on both homepages. */}
                  <Logo src={LOGO_INK} className="h-7 w-auto sm:h-8" priority />
                </Link>

                <div className="header-actions">
                  {/* Contact details, moved down from the strip that used to
                      sit above the bar. They read as part of the toolset
                      rather than a separate band, which is what let the whole
                      third row go. */}
                  <a href="mailto:info@karmogroup.com" className="header-contact">
                    <i>
                      <FiMail />
                    </i>
                    info@karmogroup.com
                  </a>
                  <a href="tel:+8801713483284" className="header-contact">
                    <i>
                      <FiPhone />
                    </i>
                    +88 01713 483284
                  </a>

                  <span className="header-divider" aria-hidden="true" />

                  <div className="header-tools">
                  {/* Search, wishlist and account drop out below the menu
                      breakpoint â four 44px targets plus the logo do not fit a
                      375px bar, and cart is the only one that has to survive. */}
                  <button className="tool-secondary" aria-label="Search">
                    <FiSearch />
                  </button>
                  <button className="tool-secondary" aria-label="Wishlist">
                    <FiHeart />
                  </button>
                  <button className="tool-secondary" aria-label="Account">
                    <FiUser />
                  </button>

                  <button aria-label="Cart">
                    <FiShoppingBag />
                    <span className="cart-count">3</span>
                  </button>

                  <button
                    className="menu-toggle"
                    onClick={() => setDrawer(true)}
                    aria-label="Open menu"
                  >
                    <FiMenu />
                  </button>
                  </div>

                  <Link href="/find-store" className="header-cta">
                    Find Store
                    <i>
                      <FiArrowRight />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 â navigation, with the full container to itself. */}
          <div className="header-nav">
            <div className="container">
              {/* Only visible once row 1 is gone, so the stuck bar still
                  carries the brand. */}
              <Link
                href="/home-2"
                className="header-logo-compact"
                aria-label="Karmo Group home"
                tabIndex={stuck ? undefined : -1}
                aria-hidden={stuck ? undefined : true}
              >
                <Logo src={LOGO_INK} className="h-6 w-auto" />
              </Link>

              <ul className="main-menu">
                {NAV.map((entry) => (
                  <li key={entry.name}>
                    <Link href={entry.href}>
                      {entry.name}
                      {entry.submenu && <FiChevronDown size={14} />}
                    </Link>

                    {entry.submenu && (
                      <ul className="sub-menu">
                        {entry.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link href={sub.href}>{sub.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>


      {/* ── Mobile drawer ─────────────────────────────────────────────────
          Matched to Home 01: dark slate panel sliding in from the left, the
          wordmark and close beside each other at the top, one row per menu
          entry with a chevron that folds its sub-menu open, then Find Store
          and the contact details on a divider.

          A sibling of <header>, never a child. The header can carry a
          backdrop-filter, and that creates a containing block for fixed
          descendants — nested inside, this panel would resolve `inset-0`
          against the bar instead of the viewport and collapse to its height.
          That is exactly the bug Home 01's drawer had. */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[9500] xl:hidden">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
              className="absolute inset-0 bg-black/60"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: SETTLE }}
              className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-[#161c24] p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                {/* The reversed wordmark, because this panel is dark — the
                    ink variant the header uses would vanish here. */}
                <Logo className="h-7 w-auto" />
                <button
                  onClick={() => setDrawer(false)}
                  aria-label="Close menu"
                  className="text-2xl text-white"
                >
                  <FiX />
                </button>
              </div>

              <ul className="space-y-1">
                {NAV.map((entry) => (
                  <li key={entry.name}>
                    <div className="flex items-center">
                      <Link
                        href={entry.href}
                        onClick={() => setDrawer(false)}
                        className="flex-1 py-2.5 text-sm font-semibold text-white"
                      >
                        {entry.name}
                      </Link>
                      {entry.submenu && (
                        <button
                          onClick={() =>
                            setOpenGroup(
                              openGroup === entry.name ? null : entry.name
                            )
                          }
                          aria-label={`Toggle ${entry.name}`}
                          aria-expanded={openGroup === entry.name}
                          className="p-2 text-white/70"
                        >
                          <FiChevronDown
                            className={`transition ${
                              openGroup === entry.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {entry.submenu && openGroup === entry.name && (
                      <ul className="mb-2 border-l border-white/15 pl-4">
                        {entry.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setDrawer(false)}
                              className="block py-2 text-sm text-white/75"
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
                className="mt-5 block rounded bg-[#e60000] px-5 py-3 text-center text-sm font-bold text-white transition-colors duration-300 hover:bg-[#cc0000]"
              >
                Find Store
              </Link>

              <div className="body-copy mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-white/60">
                <a
                  href="mailto:info@karmogroup.com"
                  className="flex items-center gap-2.5"
                >
                  <FiMail className="text-[13px]" />
                  info@karmogroup.com
                </a>
                <a href="tel:+8801713483284" className="flex items-center gap-2.5">
                  <FiPhone className="text-[13px]" />
                  +88 01713483284
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
