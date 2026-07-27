"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import {
  FiArrowRight,
  FiMail,
  FiMapPin,
  FiPhoneCall,
  FiSmartphone,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FadeUp, Stagger, StaggerItem } from "./motion";

/**
 * The footer, matched to Home 01.
 *
 * Same structure, same links, same address — a company has one head office and
 * one set of contact details, so the two homepages must not disagree about
 * them. What differs is only the dress: this page's slate, its brand red and
 * its 12px corners.
 *
 * The address block is Karmo's own, taken from the footer of the group's
 * reference build. If it changes, change it in components/sheard/Footer.jsx
 * too — these are copies, not one shared component, because the two layouts
 * are meant to stay independent.
 */
const COLUMNS = [
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

const SOCIALS = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="main-footer dark-section">
      {/* One interior shot dropped right back so it reads as texture rather
          than a picture. The wash above it keeps every link legible whatever
          part of the photograph falls behind it. */}
      <div className="footer-bg" aria-hidden="true">
        <Image
          src="/images/mattress/suite-interior.jpg"
          alt=""
          fill
          sizes="100vw"
        />
      </div>

      <div className="footer-inner">
        {/* Closing call to action */}
        <div className="footer-cta">
          <div className="container">
            <FadeUp>
              <span className="section-sub-title">Six decades of comfort</span>
              <h2>Bring Karmo comfort into your home</h2>
              <Link href="/find-store" className="btn-default">
                Find a Store
              </Link>
            </FadeUp>
          </div>
        </div>

        <div className="container">
          <Stagger className="footer-row" gap={0.08}>
            <StaggerItem className="footer-about">
              <Logo className="h-8 w-auto" />

              <p>
                Foam, mattress, bedding and polymers, manufactured in Bangladesh
                since 1965.
              </p>

              <a href="tel:+8801713483284" className="footer-hotline">
                <i>
                  <FiPhoneCall />
                </i>
                <span>
                  <strong>+88 01713483284</strong>
                  <small>Round-the-clock</small>
                </span>
              </a>

              <ul className="footer-contact">
                <li>
                  <i>
                    <FiMapPin />
                  </i>
                  <span>
                    Ibrahim Chamber, 4th Floor
                    <br />
                    95 Motijheel, Dhaka-1000, Bangladesh
                  </span>
                </li>
                <li>
                  <i>
                    <FiSmartphone />
                  </i>
                  <a href="tel:+8801713483285">+88 01713483285</a>
                </li>
                <li>
                  <i>
                    <FiMail />
                  </i>
                  <a href="mailto:info@karmogroup.com">info@karmogroup.com</a>
                </li>
              </ul>

              <div className="footer-social">
                {SOCIALS.map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={`Karmo Group on ${label}`}>
                    <Icon />
                  </a>
                ))}
              </div>
            </StaggerItem>

            {COLUMNS.map((column) => (
              <StaggerItem className="footer-links" key={column.heading}>
                <h3>{column.heading}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}

            <StaggerItem className="footer-links footer-newsletter">
              <h3>Subscribe to our newsletter</h3>
              <p>
                Product news, catalogues and dealership updates, straight to
                your inbox.
              </p>

              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="home2-footer-email" className="sr-only">
                  Your email
                </label>
                <input
                  id="home2-footer-email"
                  type="email"
                  placeholder="Your email"
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} Karmo Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
