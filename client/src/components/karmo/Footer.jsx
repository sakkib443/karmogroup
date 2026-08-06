import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
  FiArrowRight,
  FiPhoneCall,
  FiMapPin,
  FiMail,
  FiSmartphone,
} from "react-icons/fi";
import Logo from "@/components/karmo/Logo";

const columns = [
  {
    heading: "About us",
    links: [
      { name: "About Karmo", href: "/about" },
      { name: "Company history", href: "/about/history" },
      { name: "Board of directors", href: "/about/board" },
      { name: "Awards & achievements", href: "/about/awards" },
      { name: "Clients & partners", href: "/about/partners" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { name: "Foam", href: "/foam" },
      { name: "Mattress", href: "/mattress" },
      { name: "HomeTex / Bedding", href: "/hometex" },
      { name: "Chemicals & Polymers", href: "/chemicals" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { name: "Find store", href: "/find-store" },
      { name: "Catalogues", href: "/contact/catalogues" },
      { name: "Bulk order", href: "/contact/bulk-order" },
      { name: "FAQs", href: "/contact/faqs" },
      { name: "Career", href: "/career" },
      { name: "Dealership apply", href: "/dealership" },
    ],
  },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-shade text-white/65">
      {/* A single interior shot, dropped right back so it reads as texture
          rather than a picture. The wash on top keeps every link legible no
          matter which part of the photo falls behind it. */}
      <Image
        src="/karmo/images/mattress/suite-interior.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-shade/70 via-shade/80 to-shade/90" />

      <div className="relative">
        {/* Closing call to action */}
        <div className="shell border-b border-white/10 py-20 text-center md:py-24">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Six decades of comfort
          </span>

          {/* Same treatment as every section heading on the page — all caps,
              the same size, the same open tracking and tight leading. It was
              mixed case at 2.75rem, which made the last heading a visitor read
              the one that matched nothing above it. Still centred: this is the
              footer's closing line, not a section opening on the gutter. */}
          <h2 className="display mx-auto mt-6 max-w-2xl text-[1.6rem] font-light uppercase leading-[1.02] tracking-[0.01em] text-white sm:text-[2.1rem] lg:text-[2.45rem]">
            Bring Karmo comfort into your home
          </h2>

          <Link
            href="/find-store"
            className="btn-primary group mt-10 inline-flex items-center gap-3 rounded-full bg-brand px-9 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white"
          >
            Find a store
            <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Columns */}
        <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Reversed artwork — red mark with white type on transparency —
                so it sits straight on the dark panel. A light chip behind it
                would swallow the white half of the wordmark. */}
            <Logo className="h-8 w-auto shrink-0" />

            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Foam, mattress, bedding and polymers, manufactured in Bangladesh
              since 1965.
            </p>

            <a
              href="tel:+8801713483284"
              className="mt-6 flex items-center gap-3 transition-colors duration-300 hover:text-white"
            >
              <FiPhoneCall className="text-2xl text-brand" />
              <span>
                <span className="block text-lg font-semibold text-white">
                  +88 01713483284
                </span>
                <span className="text-xs text-brand">Round-the-clock</span>
              </span>
            </a>

            {/* Head office details, exactly as they appear in the footer of
                Karmo's own reference build. The hotline above stays on its
                own so it keeps the weight a phone number needs. */}
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-base text-brand" />
                <span className="leading-relaxed">
                  Ibrahim Chamber, 4th Floor
                  <br />
                  95 Motijheel, Dhaka-1000, Bangladesh
                </span>
              </li>

              <li className="flex gap-3">
                <FiSmartphone className="mt-0.5 shrink-0 text-base text-brand" />
                <a
                  href="tel:+8801713483285"
                  className="transition-colors duration-300 hover:text-white"
                >
                  +88 01713483285
                </a>
              </li>

              <li className="flex gap-3">
                <FiMail className="mt-0.5 shrink-0 text-base text-brand" />
                <a
                  href="mailto:info@karmogroup.com"
                  className="transition-colors duration-300 hover:text-white"
                >
                  info@karmogroup.com
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-4">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Karmo Group on ${label}`}
                  className="text-white/55 transition-colors duration-300 hover:text-brand"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
                {column.heading}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-300 hover:text-brand"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
              Subscribe to our newsletter
            </h3>
            <p className="mt-5 text-sm leading-relaxed">
              Product news, catalogues and dealership updates, straight to your
              inbox.
            </p>

            <form className="mt-6 flex items-center bg-white/10 backdrop-blur-sm">
              <label htmlFor="footer-email" className="sr-only">
                Your email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand transition-colors duration-300 hover:text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs">
          © {new Date().getFullYear()} Karmo Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
