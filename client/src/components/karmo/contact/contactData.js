/**
 * Contact page defaults — used when site-content has not loaded yet, and as
 * the Karmo-facing copy for the banner. Live phone / email / hours still come
 * from the CMS when present so Settings edits keep winning.
 */

export const contactBanner = {
  eyebrow: "Contact us",
  title: "Talk to Karmo",
  line: "Orders, dealership, bulk supply or a simple product question — the same team answers the phone that builds the foam.",
  src: "/karmo/images/home-02/certified/bg-living-room.jpg",
  alt: "A bright living room with Karmo comfort pieces",
};

export const contactDefaults = {
  phones: ["01713483284", "01713483285"],
  email: "info@karmogroup.com",
  whatsapp: "01713483284",
  office: "Ibrahim Chamber, 4th Floor, 95 Motijheel, Dhaka-1000, Bangladesh",
  hours: [
    { day: "Saturday – Thursday", time: "9:00 AM – 10:00 PM" },
    { day: "Friday", time: "Closed" },
  ],
  subjects: [
    "Product enquiry",
    "Order & delivery",
    "Dealership",
    "Bulk / industrial supply",
    "Complaint or feedback",
    "Other",
  ],
  tips: [
    "For the fastest reply on an order, include your order number and phone.",
    "Dealership and bulk enquiries get a dedicated response within one working day.",
    "Showrooms and dealer points are listed on Find a Store.",
  ],
};
