"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { LayoutDashboard, Settings, CalendarRange, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchAPI("/auth/me").then((userData) => {
      if (userData.role !== "ADMIN") {
        router.push("/login"); // Only Admins allowed
      } else {
        setUser(userData);
      }
    }).catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Academic Config", href: "/admin/academic", icon: Settings },
    { name: "Timetable Config", href: "/admin/timetable", icon: CalendarRange },
  ];

  if (!user) return <div className="p-8">Verifying Admin Access...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-red-900 text-red-50 flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center px-6 border-b border-red-800">
          <h1 className="text-xl font-bold text-white">CSE One Admin</h1>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-red-800 text-white font-medium shadow-sm"
                    : "hover:bg-red-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-red-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 hover:text-red-300 w-full rounded-md hover:bg-red-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shrink-0 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {pathname.split("/").pop() || "Admin Portal"}
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
