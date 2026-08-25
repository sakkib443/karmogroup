import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import {
  FiPhone,
  FiSmartphone,
  FiMapPin,
  FiMail,
} from "react-icons/fi";
import Logo from "@/components/karmo/Logo";

/**
 * Footer — three clear bands:
 * 1) Full border with Karmo logo on the rule + division subheads
 * 2) Contact heading + four-column matrix
 * 3) Social + copyright
 */

const divisions = [
  { name: "Foam", href: "/foam" },
  { name: "Mattress", href: "/mattress" },
  { name: "HomeTex", href: "/hometex" },
  { name: "Chemicals", href: "/chemicals" },
];

const company = [
  { name: "About Karmo", href: "/about" },
  { name: "License & certificates", href: "/about/awards" },
  { name: "Career", href: "/career" },
  { name: "Privacy policy", href: "/privacy" },
  { name: "Return policy", href: "/returns" },
  { name: "Karmo policies", href: "/policies" },
];

const needHelp = [
  { name: "Contact us", href: "/contact" },
  { name: "FAQ", href: "/contact/faqs" },
  { name: "Showroom locator", href: "/find-store" },
  { name: "Delivery tracker", href: "/track" },
  { name: "Bulk order", href: "/contact/bulk-order" },
];

const moreInfo = [
  { name: "Company profile", href: "/about" },
  { name: "Be our franchisee", href: "/dealership" },
  { name: "Catalogues", href: "/contact/catalogues" },
  { name: "Foam", href: "/foam" },
  { name: "Mattress", href: "/mattress" },
  { name: "HomeTex", href: "/hometex" },
  { name: "Chemicals", href: "/chemicals" },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaYoutube, label: "YouTube", href: "#" },
  { Icon: FaTiktok, label: "TikTok", href: "#" },
  { Icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
];

function Col({ title, links }) {
  return (
    <div>
      <h3 className="display text-[12px] font-bold uppercase tracking-[0.16em] text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.name}>
            <Link
              href={link.href}
              className="text-[13px] text-white/75 transition-colors duration-300 hover:text-white"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      <Image
        src="/karmo/images/footer/footer-bg.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-black/85"
      />

      <div className="relative z-[1]">
        {/* Part 1 — left logo + divisions, full-width rule below */}
        <div className="shell-home-two pt-12 md:pt-14 lg:pt-16">
          <Link
            href="/"
            aria-label="Karmo Group home"
            className="inline-block"
          >
            <Logo className="h-8 w-auto sm:h-9 lg:h-10" />
          </Link>

          <nav
            aria-label="Divisions"
            className="mt-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 sm:mt-5 sm:gap-x-8"
          >
            {divisions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white sm:text-[12px]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div
            aria-hidden
            className="mt-5 h-px w-full bg-white/40 sm:mt-6"
          />
        </div>

        {/* Part 2 — contact heading + column matrix */}
        <div className="shell-home-two grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-12 xl:py-14">
          <div>
            <h3 className="display text-[12px] font-bold uppercase tracking-[0.16em] text-white">
              Visit us
            </h3>
            <ul className="mt-5 space-y-3.5 text-[13px] leading-relaxed text-white/80">
              <li className="flex gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-[15px] text-white" />
                <span>
                  Ibrahim Chamber, 4th Floor
                  <br />
                  95 Motijheel, Dhaka-1000, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-[15px] text-white" />
                <a
                  href="tel:+8801713483284"
                  className="transition-colors hover:text-white"
                >
                  +88 01713483284
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiSmartphone className="shrink-0 text-[15px] text-white" />
                <a
                  href="tel:+8801713483285"
                  className="transition-colors hover:text-white"
                >
                  +88 01713483285
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-[15px] text-white" />
                <a
                  href="mailto:info@karmogroup.com"
                  className="transition-colors hover:text-white"
                >
                  info@karmogroup.com
                </a>
              </li>
            </ul>
          </div>

          <Col title="The company" links={company} />
          <Col title="Need help?" links={needHelp} />
          <Col title="More information" links={moreInfo} />
        </div>

        {/* Part 3 — social + copyright */}
        <div className="border-t border-white/20 bg-black/40">
          <div className="shell-home-two flex flex-col items-center justify-between gap-5 py-5 sm:flex-row sm:py-6">
            <div className="flex items-center gap-4">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Karmo Group on ${label}`}
                  className="flex h-9 w-9 items-center justify-center border border-white/25 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  <Icon className="text-[14px]" />
                </a>
              ))}
            </div>
            <p className="text-center text-[11px] uppercase tracking-[0.12em] text-white/55 sm:text-right">
              © {new Date().getFullYear()} Karmo Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
