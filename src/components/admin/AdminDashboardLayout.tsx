"use client";

import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Package, Settings, Users, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Parcels", href: "/admin/parcels", icon: Package },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-background shadow-lg border-r border-border">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-foreground">Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-background border-r border-border">
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-foreground">
                Admin Panel
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
