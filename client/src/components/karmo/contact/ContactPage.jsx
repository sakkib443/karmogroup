"use client";

import { useGetSiteContentQuery } from "@/redux/api/siteContentApi";
import {
  contactDefaults,
} from "@/components/karmo/contact/contactData";
import ContactBanner from "@/components/karmo/contact/ContactBanner";
import ContactChannels from "@/components/karmo/contact/ContactChannels";
import ContactFormSection from "@/components/karmo/contact/ContactFormSection";

function toWaNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return `880${digits}`;
}

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
  const subjects =
    Array.isArray(c.subjects) && c.subjects.length > 0
      ? c.subjects
      : contactDefaults.subjects;
  const tips =
    Array.isArray(c.tips) && c.tips.length > 0
      ? c.tips
      : contactDefaults.tips;

  const waNumber = toWaNumber(whatsapp);
  const primaryPhone = phones[0];

  const channels = [
    primaryPhone
      ? {
          kind: "phone",
          label: "Call us",
          primary: phones.join(" / "),
          secondary: "Everyday 9 AM – 10 PM",
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
      <ContactFormSection
        subjects={subjects}
        hours={hours}
        tips={tips}
        office={office}
        email={email}
      />
    </>
  );
}
