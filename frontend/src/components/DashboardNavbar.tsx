"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Code, Settings } from "lucide-react";

interface Props {
  avatarUrl?: string;
}

export default function DashboardNavbar({ avatarUrl }: Props) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-gray-900 font-medium transition";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">PR Reviewer</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/dashboard/analytics" className={linkClass("/dashboard/analytics")}>
            Analytics
          </Link>
          {avatarUrl ? (
            <Link href="/dashboard/settings" title="Settings">
              <Image
                src={avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
              />
            </Link>
          ) : (
            <Link
              href="/dashboard/settings"
              title="Settings"
              className={linkClass("/dashboard/settings")}
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
