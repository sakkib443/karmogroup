import CareerList from "@/components/karmo/career/CareerList";

export const metadata = {
  title: "Career — Karmo Group",
  description:
    "Join Karmo Group. Open positions across Foam, Mattress, HomeTex and Chemicals — apply online with your CV. Manufacturing in Bangladesh since 1965.",
};

/**
 * `/career` — the public vacancy list, reached from the footer.
 *
 * Candidates never sign in: they browse, open a posting and apply as guests,
 * keeping a tracking ID to check the status later. The list draws its own short
 * header, because the filters in it drive the query.
 */
export default function CareerRoute() {
  return <CareerList />;
}
