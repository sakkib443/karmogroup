export const metadata = {
  title: "About | Karmo",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="display text-4xl font-extrabold text-ink">About us</h1>
      <p className="mt-5 leading-relaxed text-gray-600">
        Replace this content with your own. This page lives in the{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">
          (mainLayout)
        </code>{" "}
        route group, so it automatically renders inside the navbar and footer.
      </p>
    </section>
  );
}
