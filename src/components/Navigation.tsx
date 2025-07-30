"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications] = useState(3); // Example notification count
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/track", label: "Track Parcel", icon: Search },
  ];

  const dashboardItems = user
    ? [
        ...(user.role === "admin"
          ? [
              { href: "/admin", label: "Admin Dashboard", icon: BarChart3 },
              { href: "/admin/users", label: "Users", icon: Users },
              { href: "/admin/reports", label: "Reports", icon: FileText },
            ]
          : []),
        ...(user.role === "sender"
          ? [
              { href: "/sender", label: "Dashboard", icon: BarChart3 },
              {
                href: "/sender/create-parcel",
                label: "Create Parcel",
                icon: Package,
              },
            ]
          : []),
        ...(user.role === "receiver"
          ? [{ href: "/receiver", label: "Dashboard", icon: BarChart3 }]
          : []),
      ]
    : [];

  const userMenuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/status-history", label: "Status History", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-surface/95 backdrop-blur-sm shadow-brand border-b border-theme sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Package
                  className="h-8 w-8 text-brand-light"
                  style={{
                    background: "var(--gradient-brand)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                />
                <div
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #720455, #910A67)",
                  }}
                ></div>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold text-theme-primary group-hover:opacity-80 transition-all duration-300"
                  style={{
                    background: "var(--gradient-brand)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ParcelTrack
                </span>
                <span className="text-xs text-theme-muted hidden sm:block">
                  Professional Delivery
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-theme-secondary hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-brand-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #030637 0%, #720455 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {dashboardItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #030637 0%, #720455 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-theme-secondary hover:text-white hover:shadow-brand-md rounded-lg transition-all duration-200 hover:gradient-brand">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 text-white text-xs rounded-full flex items-center justify-center animate-pulse gradient-brand">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #030637 0%, #3C0753 25%, #720455 75%, #910A67 100%)",
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-theme-primary">
                          {user.name}
                        </div>
                        <div className="text-xs text-theme-muted capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-brand-lg border border-theme py-2 z-50">
                      <div className="px-4 py-3 border-b border-theme">
                        <div className="text-sm font-medium text-theme-primary">
                          {user.name}
                        </div>
                        <div className="text-sm text-theme-secondary">
                          {user.email}
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white gradient-brand">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-theme-secondary hover:bg-brand-light/10 hover:text-brand-light transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}

                      <div className="border-t border-theme mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-theme-secondary hover:text-brand-light px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-brand-md hover:shadow-brand-lg transform hover:scale-105 gradient-brand"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-theme-secondary hover:text-brand-light hover:bg-brand-light/10 p-2 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-theme bg-surface">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-theme-secondary hover:text-brand-light hover:bg-brand-light/10 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {dashboardItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-theme-secondary hover:text-brand-light hover:bg-brand-light/10 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="border-t border-theme pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold gradient-brand">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-theme-primary">
                          {user.name}
                        </div>
                        <div className="text-xs text-theme-secondary">
                          {user.email}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white capitalize mt-1 gradient-brand">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full text-left text-red-600 hover:bg-red-50 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </>
              )}

              {!user && (
                <div className="border-t border-theme pt-4 mt-4 space-y-2">
                  <Link
                    href="/login"
                    className="block text-theme-secondary hover:text-brand-light hover:bg-brand-light/10 px-3 py-3 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block gradient-brand text-white hover:opacity-90 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
