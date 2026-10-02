import ReviewDashboard from "@/components/karmo/review/ReviewDashboard";

export const metadata = {
  title: "Client review",
  description: "Section-by-section approval tracker.",
  robots: { index: false, follow: false },
};

/** /review - summary of every approval and change request. Open to anyone with the link. */
export default function ReviewPage() {
  return <ReviewDashboard />;
}
