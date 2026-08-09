/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/karmo/Logo";
import {
  FiSearch,
  FiShoppingBag,
  FiMapPin,
  FiMenu,
  FiX,
  FiArrowRight,
  FiPhone,
  FiClock,
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
import { useGetSiteContentQuery } from "@/redux/api/siteContentApi";

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

interface NavItem {
  name: string;
  href: string;
  icon: any;
  accent?: boolean;
}

const navItems: NavItem[] = [
  { name: "Foam", href: "/foam", icon: TbArmchair },
  { name: "Mattress", href: "/mattress", icon: TbBed },
  { name: "HomeTex", href: "/hometex", icon: TbFeather },
  { name: "Chemicals", href: "/chemicals", icon: TbFlask },
  { name: "Sale", href: "/sale", icon: TbTag },
];

export default function HeaderAnantaOverlaid() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: siteContentRes } = useGetSiteContentQuery(undefined);
  const contact = siteContentRes?.data?.contact || {};
  const contactPhone = contact.phone || '';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 32) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="relative z-50 bg-brand text-white">
        <div className="flex h-8 items-center justify-between gap-6 max-w-[1800px] mx-auto px-6 lg:px-12">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em]">
            <a
              href={`tel:${contactPhone || '01713483284'}`}
              className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-75"
            >
              <FiPhone className="shrink-0 text-[13px]" />
              {contactPhone || "01713 483 284"}
            </a>

            <span aria-hidden="true" className="h-3 w-px bg-white/40" />

            <span className="flex items-center gap-2">
              <FiClock className="shrink-0 text-[13px]" />
              Everyday 9 AM &ndash; 10 PM
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-5">
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

      <header
        className={`z-50 text-white transition-all duration-300 ${isScrolled
            ? "fixed top-0 inset-x-0 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "absolute top-8 inset-x-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent"
          }`}
      >
        <div className="flex h-20 items-center justify-between gap-8 max-w-[1800px] mx-auto px-6 lg:px-12">
          <Link href="/" className="group select-none transition-transform duration-300 group-hover:scale-105" aria-label="S Kawsar Sunnah Mart">
            <Logo className="h-[36px] md:h-[46px]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand hover:scale-105 ${item.accent ? "text-brand" : "text-white/90 hover:text-white"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="p-2 text-white/90 hover:text-brand hidden sm:block transition-colors text-lg"
            >
              {searchOpen ? <FiX /> : <FiSearch />}
            </button>

            <Link
              href="/find-store"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-md text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
            >
              <FiMapPin className="text-sm" />
              Stores
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-white/90 hover:text-brand transition-colors text-lg"
              aria-label="Cart"
            >
              <FiShoppingBag />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              className="p-2 text-white text-xl lg:hidden"
              aria-label="Toggle Menu"
            >
              {drawerOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="bg-black/95 backdrop-blur-lg border-b border-white/15 px-6 py-4">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="shell flex items-center gap-4"
            >
              <FiSearch className="text-xl text-white/60" />
              <input
                type="search"
                placeholder="Search foam, mattress, bedding, adhesives..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/40 py-2"
                autoFocus
              />
              <button
                type="submit"
                className="bg-brand text-white px-6 py-2 text-xs font-bold uppercase tracking-widest rounded"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {drawerOpen && (
          <div className="bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 lg:hidden flex flex-col gap-4">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 mb-2"
            >
              <FiSearch className="text-white/70 text-base shrink-0" />
              <input
                type="search"
                placeholder="Search foam, mattresses, bedding..."
                className="bg-transparent text-white text-xs outline-none placeholder:text-white/50 w-full"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="bg-brand text-white p-1.5 rounded-full shrink-0"
              >
                <FiArrowRight className="text-xs" />
              </button>
            </form>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-white/90 hover:text-brand py-2 border-b border-white/10 flex items-center justify-between"
              >
                <span>{item.name}</span>
                <FiArrowRight className="text-brand" />
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
