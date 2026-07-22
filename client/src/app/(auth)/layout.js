import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="display mb-6 block text-center text-3xl font-extrabold text-brand"
        >
          Karmo
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
