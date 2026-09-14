import MediaPage from "@/components/karmo/media/MediaPage";
import { mediaPages } from "@/data/media";
import { pageMetadata } from "@/config/site";

const page = mediaPages.memory;

export const metadata = pageMetadata({
  title: "Karmo Memory — Media Center",
  description: page.lead,
  path: page.path,
});

export default function MediaMemoryRoute() {
  return <MediaPage page={page} />;
}
