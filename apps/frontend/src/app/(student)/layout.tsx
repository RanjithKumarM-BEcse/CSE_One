"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FileText, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Timetable", href: "/timetable", icon: Calendar },
    { name: "Leave", href: "/leave", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">CSE One</h1>
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
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 w-full rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b flex items-center px-8">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {pathname.split("/").pop()}
          </h2>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
