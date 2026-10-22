/**
 * Contact page content. Phones, email, WhatsApp, office and hours are the
 * fallbacks for Admin → Settings (site content), which wins when it loads.
 * The rest is the page's own copy — kept short — over the homepage's pictures,
 * cartoon icons and section shapes.
 *
 * Sections and the header menu's Contact Us / Dealership rows:
 *   #address  Address / Map
 *   #message  the homepage's how-to-order + contact form
 *   #bulk     Bulk order, Catalogues, Dealership apply
 *   #faqs     FAQs
 */

/** Cover: one still — the homepage hero's living-room photo and veil. The
    slider stops autoplay and hides its arrows/dots when there is a single slide. */
const veil = { color: "#000000", opacity: 32 };
export const contactHeroSlides = [
  {
    id: "contact-living",
    image: { src: "/pages/home/hero/home-hero-slide-living-scandi-v3-hq.webp", alt: "Warm living room with a cream sofa, wood shelves and round coffee table" },
    headingLead: "Talk to Karmo",
    align: "center",
    titleCard: true,
    overlay: veil,
  },
];

export const contactDefaults = {
  phones: ["01713483284", "01713483285"],
  email: "info@karmogroup.com",
  whatsapp: "01713483284",
  office: "Ibrahim Chamber, 4th Floor, 95 Motijheel, Dhaka-1000, Bangladesh",
  hours: [
    { day: "Saturday – Thursday", time: "9:00 AM – 10:00 PM" },
    { day: "Friday", time: "Closed" },
  ],
};

/* ── Visit us (#address) ────────────────────────────────────────────────── */

export const contactVisit = {
  eyebrow: "Visit us",
  titleLead: "Head",
  titleAccent: "office",
};

/* ── Bulk order, catalogues & dealership (#bulk) ────────────────────────── */

export const contactBulk = {
  eyebrow: "For businesses",
  titleLine1: "Bulk orders &",
  titleLine2: "dealership",
  line: "Factory-direct supply for furniture makers, footwear plants, hotels and dealers — with catalogues on request.",
  /* The homepage's cartoon claim icons (the chemicals band's style). */
  claims: [
    { title: "Since 1965", icon: "/shared/trust/cartoon-v3/legacy-60-v5.webp" },
    { title: "747 dealer points", icon: "/shared/trust/cartoon-v3/stores-v5.webp" },
    { title: "All 64 districts", icon: "/shared/trust/cartoon-v3/delivery-fast-v1.webp" },
  ],
  image: {
    src: "/pages/home/hero/home-hero-slide-chemicals-hero-hq.webp",
    alt: "Karmo's chemicals warehouse with blue industrial drums",
  },
};

/* ── FAQs (#faqs) ───────────────────────────────────────────────────────── */

export const contactFaqs = {
  eyebrow: "Good to know",
  titleLead: "Frequently asked",
  titleAccent: "questions",
  lead: "Quick answers on ordering, sizes, delivery and dealership.",
  help: {
    title: "Still have a question?",
    line: "Talk to the team — every day except Friday.",
    image: {
      src: "/pages/home/promo-band/promo-couple-bedroom-hq.webp",
      alt: "A couple relaxing in a bedroom on a Karmo mattress",
    },
  },
  items: [
    {
      q: "How do I place an order?",
      a: "Order on the product page, or call or WhatsApp us. Our team confirms every order by phone before it is made and sent.",
    },
    {
      q: "Can I get a mattress or foam in my own size?",
      a: "Yes. Pick Custom on the product page and enter your size in inches — the price updates at once.",
    },
    {
      q: "How can I pay?",
      a: "Cash on delivery, or mobile banking such as bKash, Nagad and Rocket. The options open to you are shown at checkout.",
    },
    {
      q: "Do you deliver all over Bangladesh?",
      a: "Yes, to every district, through courier and our dealer network. The delivery charge is shown at checkout.",
    },
    {
      q: "Can I track my order?",
      a: "Yes. Open Track order and enter your order number to see where it is.",
    },
    {
      q: "How can I become a Karmo dealer?",
      a: "Call us or send a message saying you want a dealership. Dealership enquiries get a reply within one working day.",
    },
    {
      q: "Do you supply factories and businesses in bulk?",
      a: "Yes — foam, adhesives and chemicals for furniture, footwear, hotels and industry. Call us or send a message and our sales team will come back to you.",
    },
  ],
};
