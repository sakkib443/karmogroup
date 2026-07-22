const stats = [
  { label: "Total users", value: "1,248" },
  { label: "Active sessions", value: "312" },
  { label: "Revenue", value: "৳ 84,500" },
];

export default function DashboardPage() {
  return (
    <>
      <h1 className="display text-3xl font-extrabold text-ink">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Placeholder data — wire these up to your API.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="display mt-2 text-3xl font-extrabold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
