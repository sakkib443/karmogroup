import MediaPage from "@/components/karmo/media/MediaPage";
import { mediaPages } from "@/data/media";
import { pageMetadata } from "@/config/site";

const page = mediaPages.news;

export const metadata = pageMetadata({
  title: "News & Blogs — Karmo Media Center",
  description: page.lead,
  path: page.path,
});

export default function MediaNewsRoute() {
  return <MediaPage page={page} />;
}
