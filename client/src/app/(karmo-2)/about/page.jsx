import AboutPage from "@/components/karmo/about/AboutPage";

export const metadata = {
  title: "About Karmo — Foam, Mattress, HomeTex & Chemicals since 1965",
  description:
    "Karmo Group of Industries is the first company in Bangladesh to produce polyurethane, manufacturing since 1965. Four industries, three international accreditations and 747 dealer points nationwide.",
  alternates: { canonical: "/about" },
};

/**
 * `/about` — lives in (karmo-2) so it inherits HeaderTwo, the header offset and
 * the Karmo footer from the homepage layout, the same way `/foam` does.
 */
export default function AboutRoute() {
  return <AboutPage />;
}
