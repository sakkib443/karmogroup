"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUser, FiSettings } from "react-icons/fi";

const menu = [
  { name: "Overview", href: "/dashboard", icon: FiGrid },
  { name: "Profile", href: "/dashboard/profile", icon: FiUser },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white md:block">
      <div className="p-6">
        <Link href="/" className="display text-2xl font-extrabold text-brand">
          Karmo
        </Link>
      </div>

      <nav className="px-3">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand/10 text-brand"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand"
              }`}
            >
              <item.icon className="text-lg" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
