"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { LayoutDashboard, Users, FileCheck, LogOut } from "lucide-react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchAPI("/auth/me").then(setUser).catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
  ];

  if (user?.role === "FACULTY_ADVISOR" || user?.role === "ADMIN") {
    navItems.push({ name: "Leave Approvals", href: "/staff/leave-approvals", icon: FileCheck });
  }

  if (!user) return <div className="p-8">Loading Staff Portal...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">CSE One Staff</h1>
        </div>
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm font-medium text-white">{user.email}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // The pathname might be /dashboard, we need to handle relative links 
            // since we are using route groups, the URL will just be /dashboard
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-medium"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 hover:text-red-400 w-full rounded-md hover:bg-slate-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {pathname.split("/").pop() || "Portal"}
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
