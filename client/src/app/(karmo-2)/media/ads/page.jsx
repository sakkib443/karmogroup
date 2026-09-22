import MediaPage from "@/components/karmo/media/MediaPage";
import { mediaPages } from "@/data/media";
import { pageMetadata } from "@/config/site";

const page = mediaPages.ads;

export const metadata = pageMetadata({
  title: "Karmo Ads — Media Center",
  description: page.lead,
  path: page.path,
});

export default function MediaAdsRoute() {
  return <MediaPage page={page} />;
}
