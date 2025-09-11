"use client";

import {
  BarChart3,
  Bell,
  ChevronDown,
  Clock,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  Settings,
  Shield,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/api";

interface SearchResult {
  id: string;
  title: string;
  type: "user" | "parcel" | "setting" | "page";
  url: string;
  description?: string;
  data?: any;
}

// Static searchable pages
const staticPages: SearchResult[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "page",
    url: "/admin",
    description: "Admin dashboard overview",
  },
  {
    id: "users",
    title: "User Management",
    type: "page",
    url: "/admin/users",
    description: "Manage all users",
  },
  {
    id: "parcels",
    title: "Parcel Management",
    type: "page",
    url: "/admin/parcels",
    description: "Track and manage parcels",
  },
  {
    id: "settings",
    title: "System Settings",
    type: "setting",
    url: "/admin/settings",
    description: "Configure system settings",
  },
  {
    id: "notifications",
    title: "Notifications",
    type: "page",
    url: "/admin/notifications",
    description: "View notifications",
  },
];

interface ModernAdminNavbarProps {
  onMenuClick?: () => void;
}

export default function ModernAdminNavbar({
  onMenuClick,
}: ModernAdminNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [notifications] = useState([
    { id: 1, title: "New parcel created", time: "2 min ago", type: "info" },
    {
      id: 2,
      title: "User registration pending",
      time: "5 min ago",
      type: "warning",
    },
    {
      id: 3,
      title: "System maintenance scheduled",
      time: "1 hour ago",
      type: "alert",
    },
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Enhanced search functionality with API integration
  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    try {
      setIsSearching(true);

      // Search in static pages first
      const pageResults = staticPages.filter(
        (page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description?.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...pageResults);

      // Search in users if query is relevant
      if (
        query.toLowerCase().includes("user") ||
        query.toLowerCase().includes("admin") ||
        query.toLowerCase().includes("sender")
      ) {
        try {
          const userResponse = await api.get("/admin/users", {
            params: { search: query, limit: 3 },
          });

          if (userResponse.data?.data) {
            const userResults = userResponse.data.data
              .slice(0, 3)
              .map((user: any) => ({
                id: `user-${user.id}`,
                title: user.name,
                type: "user" as const,
                url: `/admin/users?search=${encodeURIComponent(user.name)}`,
                description: `${user.role} - ${user.email}`,
                data: user,
              }));
            results.push(...userResults);
          }
        } catch (error) {
          console.log("User search failed, using mock data");
          // Mock user data for demo
          if (query.toLowerCase().includes("admin")) {
            results.push({
              id: "user-mock-1",
              title: "Admin User",
              type: "user",
              url: "/admin/users",
              description: "Administrator - admin@example.com",
            });
          }
        }
      }

      // Search in parcels if query is relevant
      if (
        query.toLowerCase().includes("parcel") ||
        query.toLowerCase().includes("delivery") ||
        query.toLowerCase().includes("track")
      ) {
        try {
          const parcelResponse = await api.get("/admin/parcels", {
            params: { search: query, limit: 3 },
          });

          if (parcelResponse.data?.data) {
            const parcelResults = parcelResponse.data.data
              .slice(0, 3)
              .map((parcel: any) => ({
                id: `parcel-${parcel.id}`,
                title: `Parcel ${parcel.trackingNumber}`,
                type: "parcel" as const,
                url: `/admin/parcels?search=${encodeURIComponent(
                  parcel.trackingNumber
                )}`,
                description: `${parcel.status} - ${parcel.senderName} to ${parcel.recipientName}`,
                data: parcel,
              }));
            results.push(...parcelResults);
          }
        } catch (error) {
          console.log("Parcel search failed, using mock data");
          // Mock parcel data for demo
          if (
            query.toLowerCase().includes("parcel") ||
            query.toLowerCase().includes("pk")
          ) {
            results.push({
              id: "parcel-mock-1",
              title: "Parcel PK001",
              type: "parcel",
              url: "/admin/parcels",
              description: "Delivered - Dhaka to Chittagong",
            });
          }
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }

    return results.slice(0, 8); // Limit to 8 results
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const results = await performSearch(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSearchResults(false);
      }
      if (!target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
      if (!target.closest(".notifications-dropdown")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const handleSearchResultClick = (result: SearchResult) => {
    navigate(result.url);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "parcel":
        return <Package className="h-4 w-4" />;
      case "setting":
        return <Settings className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "alert":
        return "🚨";
      default:
        return "ℹ️";
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-green-500 rounded-xl shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-green-400/20 rounded-xl animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {location.pathname.split("/").pop()?.replace("-", " ") ||
                  "Dashboard"}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 search-container relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search users, parcels, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {isSearching && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              )}
              {searchQuery && !isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200/20 dark:border-gray-700/20">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Search Results
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group"
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      {getSearchIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {result.title}
                      </h4>
                      {result.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {showSearchResults &&
            searchResults.length === 0 &&
            searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 p-8 text-center z-50">
                <div className="text-gray-400 mb-2">
                  <Search className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No results found
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try different keywords or check the spelling
                </p>
              </div>
            )}
        </div>

        {/* Enhanced Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 group relative"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="relative">
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
          </button>

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 relative group"
              title="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {notifications.length} new
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200/20 dark:border-gray-700/20">
                  <button
                    onClick={() => navigate("/admin/notifications")}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 group-hover:rotate-180" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        admin@example.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/admin/settings");
                      setShowProfileDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Settings
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/admin");
                      setShowProfileDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                      <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Dashboard
                    </span>
                  </button>
                </div>

                <div className="border-t border-gray-200/20 dark:border-gray-700/20 p-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-left rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50">
                      <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
