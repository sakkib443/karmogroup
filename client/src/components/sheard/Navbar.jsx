"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiSearch,
  FiMail,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";

// Matches the curve the hero and the rest of the page settle on.
const SETTLE = [0.22, 1, 0.36, 1];

// The bar assembles on load: strip first, then the logo, then the menu items
// one after another. Kept short so it is finished well before the hero has
// stopped building underneath it.
const bar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};

const drop = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: SETTLE } },
};

/**
 * Menu structure comes from "Site Reference Final.xlsx" (Menu / Sub Menu
 * columns). Product-level entries live on the section pages, not up here.
 */
const menu = [
  {
    name: "Home",
    href: "/",
    submenu: [
      { name: "Home 01 — Organized", href: "/" },
      { name: "Home 02 — Luxe Retail", href: "/home-2" },
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

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // With motion turned down the bar is simply there on load.
  const entrance = reduceMotion
    ? {}
    : { variants: bar, initial: "hidden", animate: "show" };
  const item = reduceMotion ? {} : { variants: drop };

  // Transparent over the hero image, solid once the page moves — the bar
  // stops competing with the headline but never loses contrast.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      {...entrance}
      className={`fixed inset-x-0 top-0 z-[10000] transition-colors duration-500 ${
        scrolled || drawerOpen
          ? "bg-shade/95 shadow-lg backdrop-blur-md"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      {/* Utility strip. Career, Dealership and Find Store live up here so the
          main bar only has to carry the seven product menus.

          It rolls away as soon as the page moves: contact details are worth a
          row at the top of the hero, but not a permanent one stealing height
          from every screen below it. Collapsed by max-height rather than
          `display`, so it slides rather than snapping, and `invisible` takes it
          out of the tab order once it is shut. */}
      <motion.div
        {...item}
        aria-hidden={scrolled || undefined}
        className={`hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
          scrolled
            ? "invisible max-h-0 border-b-0 bg-black/30 opacity-0"
            : "visible max-h-16 border-b border-white/10 bg-black/25 opacity-100"
        }`}
      >
        <div className="shell flex h-10 items-center justify-between gap-6 text-[11.5px] text-white/75">
          <div className="flex shrink-0 items-center gap-3.5">
            {[FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Karmo Group social profile"
                  className="transition-colors duration-300 hover:text-white"
                >
                  <Icon className="text-[13px]" />
                </a>
              )
            )}
          </div>

          {/* Contact details sit beside the button on the right. They drop
              out first when the bar gets tight. */}
          <div className="flex shrink-0 items-center gap-6">
            <a
              href="mailto:info@karmogroup.com"
              className="body-copy hidden items-center gap-2 whitespace-nowrap transition-colors duration-300 hover:text-white xl:flex"
            >
              <FiMail className="text-[13px]" />
              info@karmogroup.com
            </a>
            <a
              href="tel:+8801713483284"
              className="body-copy hidden items-center gap-2 whitespace-nowrap transition-colors duration-300 hover:text-white xl:flex"
            >
              <FiPhone className="text-[13px]" />
              +88 01713483284
            </a>
            <Link
              href="/find-store"
              className="btn-primary group flex h-10 items-center gap-2 whitespace-nowrap bg-brand px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              Find Store
              <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Flex rather than grid so `shrink-0` actually protects the logo — a
          grid column would squeeze it regardless. The two `ml-auto`s split the
          free space either side of the menu, which lands it right of the page
          centre because the logo is wider than the tools. */}
      <div className="shell flex h-20 items-center">
        <motion.div {...item} className="shrink-0">
          <Link href="/" aria-label="Karmo Group home" className="block">
            <Logo className="h-7 w-auto sm:h-8" priority />
          </Link>
        </motion.div>

        {/* Desktop menu */}
        <ul className="ml-auto hidden shrink-0 items-center xl:flex">
          {menu.map((entry) => {
            // "/" is a prefix of every route, so the home entry has to match
            // exactly or it would sit lit up on every page of the site.
            const active =
              entry.href === "/"
                ? pathname === "/"
                : pathname.startsWith(entry.href);
            return (
            <motion.li key={entry.href} {...item} className="group relative">
              <Link
                href={entry.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-1 whitespace-nowrap px-3.5 py-5 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 group-hover:text-white ${
                  active ? "text-white" : "text-white/90"
                }`}
              >
                {entry.name}
                {entry.submenu && <FiChevronDown className="text-[11px]" />}
                {/* Underline: always shown on the current page, otherwise
                    grows out from the centre on hover. */}
                <span
                  className={`absolute inset-x-3.5 bottom-3 h-px origin-center bg-brand transition-transform duration-300 group-hover:scale-x-100 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>

              {entry.submenu && (
                <ul className="invisible absolute left-0 top-full z-[1100] min-w-60 translate-y-1 bg-shade/95 py-2 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {entry.submenu.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className="block whitespace-nowrap border-l-2 border-transparent px-4 py-2.5 text-[12.5px] font-normal text-white/75 transition-all duration-200 hover:border-brand hover:bg-white/5 hover:text-white"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
            );
          })}

        </ul>

        <motion.div {...item} className="ml-auto flex shrink-0 items-center gap-1">
          <button
            aria-label="Search"
            className="hidden p-2.5 text-lg text-white/80 transition-colors duration-300 hover:text-white xl:block"
          >
            <FiSearch />
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 text-2xl text-white xl:hidden"
          >
            <FiMenu />
          </button>
        </motion.div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[10001] xl:hidden">
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-shade p-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo className="h-7 w-auto" />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-2xl text-white"
              >
                <FiX />
              </button>
            </div>

            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex-1 py-2.5 text-sm font-semibold text-white"
                    >
                      {item.name}
                    </Link>
                    {item.submenu && (
                      <button
                        onClick={() =>
                          setOpenGroup(openGroup === item.href ? null : item.href)
                        }
                        aria-label={`Toggle ${item.name}`}
                        aria-expanded={openGroup === item.href}
                        className="p-2 text-white/70"
                      >
                        <FiChevronDown
                          className={`transition ${
                            openGroup === item.href ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {item.submenu && openGroup === item.href && (
                    <ul className="mb-2 border-l border-white/15 pl-4">
                      {item.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setDrawerOpen(false)}
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
              onClick={() => setDrawerOpen(false)}
              className="btn-primary mt-5 block rounded bg-brand px-5 py-3 text-center text-sm font-bold text-white"
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
              <a
                href="tel:+8801713483284"
                className="flex items-center gap-2.5"
              >
                <FiPhone className="text-[13px]" />
                +88 01713483284
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
