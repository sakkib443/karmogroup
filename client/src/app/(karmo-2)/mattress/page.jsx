import PictureSlotsPage from "@/components/karmo/cms/PictureSlotsPage";
import { getPageContent } from "@/cms/server";
import mattress from "@/data/divisions/mattress";

export const metadata = {
  title: "Mattress — Karmo Group",
  description:
    "Karmo Mattresses — orthopedic, imperial, pocket & bonnell spring, natural coir and economy foam. Doctor-recommended, made in Bangladesh since 1965.",
};

/**
 * `/mattress` — the Mattress division catalogue, the client's ideal page.
 * Renders the shared `DivisionPage` template with the mattress data.
 * Lives in (karmo-2) so it shares HeaderTwo + Footer with the homepage.
 */
export default async function MattressRoute() {
  /* Every picture comes from the database (page-content/mattress → slots); the files
     in public/ are only the fallback. Admins change them from the page itself. */
  const content = await getPageContent("mattress");
  return <PictureSlotsPage page="mattress" data={mattress} content={content} />;
}
