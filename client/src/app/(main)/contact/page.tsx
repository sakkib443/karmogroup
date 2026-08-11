import type { Metadata } from "next";
import ContactPage from "@/components/karmo/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact Karmo — Call, WhatsApp or Visit Motijheel",
  description:
    "Talk to Karmo Group for foam, mattress, HomeTex and chemical enquiries. Call 01713483284, email info@karmogroup.com, or visit our Motijheel head office.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
