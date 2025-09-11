"use client";

import ThemeToggle from "@/components/DarkLightThemeSwitcher";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navigationItems =
    user?.role === "admin"
      ? [
          { href: "/track", label: "Track Parcel", icon: Search },
          { href: "/admin", label: "Admin Dashboard", icon: BarChart3 },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/reports", label: "Reports", icon: FileText },
        ]
      : user?.role === "sender"
      ? [
          { href: "/sender", label: "Dashboard", icon: BarChart3 },
          { href: "/contact", label: "Contact", icon: MessageSquare },
          {
            href: "/sender/create-parcel",
            label: "Create Parcel",
            icon: Package,
          },
        ]
      : user?.role === "receiver"
      ? [
          { href: "/receiver", label: "Dashboard", icon: BarChart3 },
          { href: "/contact", label: "Contact", icon: MessageSquare },
        ]
      : [
          { href: "/", label: "Home", icon: Home },
          { href: "/track", label: "Track Parcel", icon: Search },
          { href: "#partners", label: "Partners", icon: Users },
          { href: "#contact", label: "Contact", icon: MessageSquare },
        ];

  // Removed dashboardItems as it's now handled in navigationItems

  const userMenuItems =
    user?.role === "admin"
      ? [{ href: "/profile", label: "Profile", icon: User }]
      : [
          { href: "/profile", label: "Profile", icon: User },
          { href: "/status-history", label: "Status History", icon: FileText },
          { href: "/settings", label: "Settings", icon: Settings },
        ];

  return (
    <nav className="bg-background/95 backdrop-blur-xl shadow-lg border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground group-hover:text-red-500 transition-colors duration-300">
                  ParcelTrack
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Professional Delivery
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return item.href.startsWith("#") ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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
                {/* Notifications - Only for admin */}
                {user.role === "admin" && (
                  <div className="relative">
                    <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-300 group">
                      <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-semibold shadow-lg">
                          {notifications}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-2 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-foreground">
                          {user?.name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                      <div className="px-4 py-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground">
                              {user?.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {user?.email}
                            </div>
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-sm">
                                {user?.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-border pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
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
                  to="/login"
                  className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-accent/50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-xl transition-all duration-300 group"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return item.href.startsWith("#") ? (
                  <button
                    key={item.href}
                    onClick={() => {
                      handleNavClick(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group w-full text-left"
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 py-3 bg-accent/20 rounded-xl">
                      <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">
                          {user?.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 capitalize mt-1 shadow-sm">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-4">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group"
                    >
                      <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div className="border-t border-border pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-center shadow-lg"
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
