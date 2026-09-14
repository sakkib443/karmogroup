import TrackApplication from "@/components/karmo/career/TrackApplication";

export const metadata = {
  title: "Track your application — Karmo Group",
  description: "Check the status of your job application at Karmo Group using your tracking ID.",
};

/** `/career/track` — status lookup by tracking ID. No login. */
export default function TrackRoute() {
  return <TrackApplication />;
}
