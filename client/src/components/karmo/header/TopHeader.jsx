"use client";

import Link from "next/link";
import { FiPhone, FiClock, FiMapPin } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { useGlobal } from "@/cms/CmsProvider";
import { contact as contactSection, telHref } from "@/cms/pages/global";

/* Phone, hours and links: Admin → Site content → Brand & contact → Contact information. */
const SOCIALS = [
  { key: "facebook", Icon: FaFacebookF, label: "Facebook" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram" },
  { key: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "youtube", Icon: FaYoutube, label: "YouTube" },
];

/**
 * Brand strip above the navbar — hotline, hours, track order, socials.
 * Fixed 32px. White text on brand red (solid, not dimmed) for contrast.
 */
export default function TopHeader() {
  const info = useGlobal("contact", contactSection.defaults);
  const socials = SOCIALS.filter((s) => info.socials?.[s.key]).map((s) => ({ ...s, href: info.socials[s.key] }));
  return (
    <div className="bg-brand text-white">
      <div className="shell-header flex h-8 items-center justify-between gap-3 sm:gap-6">
        <p className="flex min-w-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] sm:gap-3 sm:text-[11px] sm:tracking-[0.12em]">
          <a
            href={telHref(info.hotline)}
            className="flex shrink-0 items-center gap-2 text-[11px] transition-opacity duration-300 hover:opacity-75 sm:gap-2.5 sm:text-[12px]"
          >
            <FiPhone className="shrink-0 text-[13px]" />
            {info.hotline}
          </a>

          <span aria-hidden="true" className="hidden h-3 w-px bg-white/40 sm:block" />

          <span className="hidden items-center gap-2 sm:flex">
            <FiClock className="shrink-0 text-[13px]" />
            {info.hours}
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
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={`Karmo Group on ${label}`}
                className="inline-flex origin-center transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-110"
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
