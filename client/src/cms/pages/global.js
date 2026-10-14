/**
 * Site-wide content (Admin → Site content → Brand & contact). Read with
 * useGlobal(key, DEFAULTS) by the header, footer and the bands every page shares,
 * so one edit changes every page.
 */
import { f, img } from "../fields";

export const brand = {
  key: "brand",
  label: "Logos",
  description: "The logos in the header and footer.",
  fields: [
    f.image("headerLogo", "Header logo (wide, at the top of the page)", { help: "A transparent PNG or SVG works best." }),
    f.image("headerLogoCompact", "Header logo (short, once the page scrolls)"),
    f.image("footerLogo", "Footer logo", { help: "Shown on a dark background — use a light or coloured version." }),
  ],
  defaults: {
    headerLogo: img("/brand/logo-group.png", "Karmo Group", { fit: "contain", width: 1272, height: 320 }),
    headerLogoCompact: img("/brand/logo-compact.png", "Karmo", { fit: "contain", width: 412, height: 120 }),
    footerLogo: img("/brand/logo.png", "Karmo", { fit: "contain", width: 384, height: 53 }),
  },
};

export const contact = {
  key: "contact",
  label: "Contact information",
  description: "Phone, email, address, hours and social links — used in the top bar, footer and contact bands.",
  fields: [
    f.text("hotline", "Hotline (top bar, “Call us”)"),
    f.text("phone2", "Second phone (footer)"),
    f.text("email", "Email"),
    f.textarea("address", "Address"),
    f.text("hours", "Opening hours"),
    f.group("socials", "Social links (leave empty to hide)", [
      f.text("facebook", "Facebook"),
      f.text("instagram", "Instagram"),
      f.text("youtube", "YouTube"),
      f.text("tiktok", "TikTok"),
      f.text("linkedin", "LinkedIn"),
    ]),
  ],
  defaults: {
    hotline: "01713483284",
    phone2: "01713483285",
    email: "info@karmogroup.com",
    address: "Ibrahim Chamber, 4th Floor\n95 Motijheel, Dhaka-1000, Bangladesh",
    hours: "Everyday 9 AM – 10 PM",
    socials: { facebook: "#", instagram: "#", youtube: "#", tiktok: "#", linkedin: "#" },
  },
};

export const trust = {
  key: "trust",
  label: "Trust strip",
  description: "The six icons under the hero (also on the division pages).",
  fields: [
    f.list("items", "Icons", [
      f.image("icon", "Icon"),
      f.text("title", "Title"),
      f.text("note", "Note"),
      f.text("badge", "Badge on the icon (optional)"),
    ], { itemLabel: (i) => i.title, max: 8 }),
  ],
  defaults: {
    items: [
      { title: "A legacy of 60 years", note: "of healthy sleep", badge: "", icon: img("/shared/trust/cartoon-v3/legacy-60-v5.webp", "", { fit: "contain" }) },
      { title: "Largest Raw Material", note: "Stock", badge: "", icon: img("/shared/trust/cartoon-v3/chem-stock-v3.webp", "", { fit: "contain" }) },
      { title: "International Quality", note: "Certification", badge: "", icon: img("/shared/trust/cartoon-v3/cartoon-globe-v4.webp", "", { fit: "contain", zoom: 92 }) },
      { title: "Natural and", note: "Sustainable Products", badge: "", icon: img("/shared/trust/cartoon-v3/natural-v5.webp", "", { fit: "contain" }) },
      { title: "Free Delivery", note: "Available", badge: "", icon: img("/shared/trust/cartoon-v3/delivery-v2.webp", "", { fit: "contain" }) },
      { title: "5k+ Stores", note: "Pan Bangladesh", badge: "5K+", icon: img("/shared/trust/cartoon-v3/stores-v5.webp", "", { fit: "contain" }) },
    ],
  },
};

export const orderContact = {
  key: "orderContact",
  label: "How to order & questions",
  description: "The four order steps and the message form — near the bottom of most pages.",
  fields: [
    f.text("orderEyebrow", "Left — small title"),
    f.text("orderTitle", "Left — heading", { size: true }),
    f.text("orderAccent", "Left — heading, red part"),
    f.list("steps", "Steps", [f.image("icon", "Icon"), f.text("title", "Title"), f.textarea("body", "Text")], { fixed: true, itemLabel: (s, i) => `Step 0${i + 1} — ${s.title}` }),
    f.text("contactEyebrow", "Right — small title"),
    f.text("contactTitle", "Right — heading", { size: true }),
    f.text("contactAccent", "Right — heading, red part"),
    f.text("sendLabel", "Send button"),
  ],
  defaults: {
    orderEyebrow: "Simple path",
    orderTitle: "How to make",
    orderTitleSize: 100,
    orderAccent: "an order",
    steps: [
      { title: "Select your product", body: "Choose the foam, mattress or HomeTex piece that fits the room.", icon: img("/shared/trust/order-cartoon/select-v2.webp", "", { fit: "contain" }) },
      { title: "Add it to the cart", body: "Drop your picks in — sizes and quantities stay with you.", icon: img("/shared/trust/order-cartoon/cart-v2.webp", "", { fit: "contain" }) },
      { title: "Complete the checkout", body: "Just three details: name, full address, and mobile number.", icon: img("/shared/trust/order-cartoon/checkout-v2.webp", "", { fit: "contain" }) },
      { title: "Receive & enjoy", body: "We deliver. You settle in. Comfort shows up at the door.", icon: img("/shared/trust/order-cartoon/enjoy-v2.webp", "", { fit: "contain" }) },
    ],
    contactEyebrow: "Talk to us",
    contactTitle: "Have any",
    contactTitleSize: 100,
    contactAccent: "questions?",
    sendLabel: "Send message",
  },
};

export const certified = {
  key: "certified",
  label: "Certifications",
  description: "The dark awards band above the footer on every page.",
  fields: [
    f.text("heading", "Heading", { size: true }),
    f.textarea("intro", "Intro"),
    f.list("pillars", "Badges", [f.image("image", "Badge"), f.text("title", "Title"), f.textarea("body", "Text")], { itemLabel: (p) => p.title, max: 8 }),
    f.textarea("footnote", "Small print"),
  ],
  defaults: {
    heading: "Built on trust since 1965",
    headingSize: 100,
    intro: "Number one in Bangladesh — with ISO 9001, UKAS and Moody International certification behind every batch.",
    pillars: [
      { title: "Number one brand", body: "Leading on lasting comfort across foam, mattress, HomeTex and adhesives — the brand Bangladesh trusts for everyday rest.", image: img("/shared/trust/badge-number-one-gold-fullheight.webp", "Bangladesh’s number one comfort brand badge", { fit: "contain" }) },
      { title: "ISO 9001", body: "International Organization for Standardization — the international standard for quality management.", image: img("/shared/certified/logos/logo-iso-9001-gold-v9.webp", "ISO 9001 quality management gold seal", { fit: "contain" }) },
      { title: "UKAS Quality Management", body: "Registration Number 014 — registered name Karmo Foam & Adhesive Industries Ltd.", image: img("/shared/certified/logos/logo-ukas-gold-v14.webp", "UKAS Quality Management gold badge, registration number 014", { fit: "contain" }) },
      { title: "Moody International", body: "ISO 9001 Approved — independent certification of the quality-management system.", image: img("/shared/certified/logos/logo-moody-gold-sharp.webp", "Moody International gold mark — ISO 9001 Approved", { fit: "contain" }) },
    ],
    footnote: "Reflects Karmo Group’s position since 1965, and ISO 9001 quality management accredited by UKAS (Registration Number 014) and approved by Moody International — held by Karmo Foam & Adhesive Industries Ltd.",
  },
};

export const footer = {
  key: "footer",
  label: "Footer",
  description: "Background and the bottom line of every page.",
  fields: [
    f.image("background", "Background photo"),
    f.overlay("overlay", "Extra darkness"),
    f.text("copyright", "Copyright line", { help: "{year} becomes the current year." }),
  ],
  defaults: {
    background: img("/shared/footer/footer-bg.webp"),
    overlay: { color: "#000000", opacity: 0 },
    copyright: "© {year} Karmo Group. All rights reserved.",
  },
};

export const texture = {
  key: "texture",
  label: "Section background texture",
  description: "The soft pattern behind the light sections (divisions, films, partners…).",
  fields: [
    f.image("image", "Pattern"),
    f.range("strength", "Pattern strength", { min: 0, max: 100, step: 1, unit: "%" }),
    f.overlay("wash", "White wash over it"),
  ],
  defaults: {
    image: img("/shared/divisions/karmo-damask-quilted-v3.webp"),
    strength: 50,
    wash: { color: "#ffffff", opacity: 70 },
  },
};

export const GLOBAL_SECTIONS = [brand, contact, trust, orderContact, certified, footer, texture];

/** "01713483284" → "tel:+8801713483284". */
export function telHref(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  if (!d) return "#";
  return `tel:+${d.startsWith("880") ? d : d.startsWith("0") ? `88${d}` : d}`;
}
