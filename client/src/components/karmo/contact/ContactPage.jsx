"use client";

import { useGetSiteContentQuery } from "@/redux/api/siteContentApi";
import {
  contactDefaults,
} from "@/components/karmo/contact/contactData";
import ContactBanner from "@/components/karmo/contact/ContactBanner";
import ContactChannels from "@/components/karmo/contact/ContactChannels";
import ContactVisit from "@/components/karmo/contact/ContactVisit";
import ContactBulk from "@/components/karmo/contact/ContactBulk";
import ContactFaqs from "@/components/karmo/contact/ContactFaqs";
import OrderAndContact from "@/components/karmo/home/OrderAndContact";

function toWaNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return `880${digits}`;
}

/**
 * `/contact` — built from the homepage's own pieces: its hero slider as the
 * cover, its contact cards, a full-width map of the head office (#address), a
 * chemicals-band-style bulk and dealership band (#bulk), FAQs (#faqs) and, last
 * before the footer, its how-to-order + contact form band (#message). Phones,
 * email, WhatsApp, office and hours come from Admin → Settings, with defaults.
 */
export default function ContactPage() {
  const { data: res } = useGetSiteContentQuery({});
  const c = res?.data?.contact || {};

  const phones =
    Array.isArray(c.phones) && c.phones.length > 0
      ? c.phones
      : c.phone
        ? [c.phone]
        : contactDefaults.phones;

  const email = c.email || c.emails?.[0] || contactDefaults.email;
  const whatsapp = c.whatsapp || contactDefaults.whatsapp;
  const office =
    c.corporateOffice || c.address || contactDefaults.office;
  const hours =
    Array.isArray(c.hours) && c.hours.length > 0
      ? c.hours
      : contactDefaults.hours;

  const waNumber = toWaNumber(whatsapp);
  const primaryPhone = phones[0];

  const channels = [
    primaryPhone
      ? {
          kind: "phone",
          label: "Call us",
          primary: phones.join(" / "),
          secondary: "Saturday – Thursday, 9 AM – 10 PM",
          href: `tel:${primaryPhone}`,
        }
      : null,
    waNumber
      ? {
          kind: "whatsapp",
          label: "WhatsApp",
          primary: whatsapp,
          secondary: "Quick reply within minutes",
          href: `https://wa.me/${waNumber}`,
          external: true,
        }
      : null,
    email
      ? {
          kind: "email",
          label: "Mail us",
          primary: email,
          secondary: "We reply within one working day",
          href: `mailto:${email}`,
        }
      : null,
    office
      ? {
          kind: "office",
          label: "Head office",
          primary: office,
          secondary: "Motijheel, Dhaka",
          href: `https://maps.google.com/?q=${encodeURIComponent(office)}`,
          external: true,
        }
      : null,
  ].filter(Boolean);

  return (
    <>
      <ContactBanner />
      <ContactChannels channels={channels} />
      <ContactVisit office={office} hours={hours} />
      <ContactBulk phone={primaryPhone} />
      <ContactFaqs phone={primaryPhone} waNumber={waNumber} />
      {/* Last, right above the awards band and footer: the homepage's
          how-to-order steps and contact form, on its texture. */}
      <div id="message" className="mt-1.5 scroll-mt-[112px]">
        <OrderAndContact textureSlides />
      </div>
    </>
  );
}
