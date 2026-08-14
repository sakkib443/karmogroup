"use client";

import Link from "next/link";
import { FiPhone, FiClock, FiMapPin } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

/**
 * Brand strip above the navbar — hotline, hours, track order, socials.
 * Fixed 32px. White text on brand red (solid, not dimmed) for contrast.
 */
export default function TopHeader() {
  return (
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
  );
}
