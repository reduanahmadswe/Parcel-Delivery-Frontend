import { Moon, Sun } from "lucide-react";
("use client");

import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  Bell,
  LogOut,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Draggable notification button state
  const [notifPos, setNotifPos] = useState({
    x: window.innerWidth - 120,
    y: 24,
  });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const notifBtnRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers for drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - notifPos.x,
      y: e.clientY - notifPos.y,
    });
    e.preventDefault();
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setNotifPos({
          x: Math.max(
            0,
            Math.min(window.innerWidth - 120, e.clientX - dragOffset.x)
          ),
          y: Math.max(
            0,
            Math.min(window.innerHeight - 60, e.clientY - dragOffset.y)
          ),
        });
      }
    };
    const handleMouseUp = () => setDragging(false);
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragOffset]);
  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  // Ref for notifications dropdown
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  // Close notifications dropdown when clicking outside
  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (event: MouseEvent) => {
      const btn = notifBtnRef.current;
      const dropdown = notifDropdownRef.current;
      if (
        btn &&
        !btn.contains(event.target as Node) &&
        dropdown &&
        !dropdown.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);
  // Example notifications data
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "New parcel registered",
      description: "TRK001234 has been added to the system by Ahmed Hassan",
      time: "2 minutes ago",
      details: "View Details",
    },
    {
      id: 2,
      type: "success",
      title: "User registration",
      description: "New user Ahmed Hassan registered as sender",
      time: "15 minutes ago",
      details: "View Details",
    },
    {
      id: 3,
      type: "success",
      title: "Parcel delivered",
      description: "TRK005678 successfully delivered to Rashida Begum",
      time: "1 hour ago",
      details: "View Details",
    },
    {
      id: 4,
      type: "warning",
      title: "Flagged parcel requires attention",
      description: "TRK009876 has been flagged for review",
      time: "2 hours ago",
      details: "View Details",
    },
    {
      id: 5,
      type: "info",
      title: "System maintenance completed",
      description: "Database backup and optimization completed successfully",
      time: "3 hours ago",
      details: "View Details",
    },
  ];
  const { user, logout } = useAuth();

  // Notification handler
  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  // Logout handler
  const handleLogoutClick = async () => {
    if (typeof logout === "function") {
      await logout();
      navigate("/login");
    }
  };
  // Theme toggle logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Parcels", href: "/admin/parcels", icon: Package },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for all admin functions */}
      <aside className="w-64 flex flex-col bg-background border-r border-border h-screen fixed left-0 top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link to="/admin" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold text-foreground">Admin</span>
          </Link>
        </div>
        {/* ...existing code... */}
        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
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
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-2 px-3 py-2 mt-2 rounded-md text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 shadow-md"
          >
            {isDarkMode ? (
              <span className="inline-flex items-center">
                <Sun className="h-5 w-5 mr-2 text-amber-500" /> Light Mode
              </span>
            ) : (
              <span className="inline-flex items-center">
                <Moon className="h-5 w-5 mr-2 text-blue-600" /> Dark Mode
              </span>
            )}
          </button>
        </nav>
        {/* Notifications Button removed from sidebar */}
        {/* Draggable Notifications Button */}
        <div
          ref={notifBtnRef}
          style={{
            position: "fixed",
            left: notifPos.x,
            top: notifPos.y,
            zIndex: 50,
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl hover:scale-105 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            onClick={() => setShowNotifications((v) => !v)}
            onMouseDown={handleMouseDown}
          >
            <Bell className="h-5 w-5 text-purple-600 dark:text-blue-400" />
            {notifications.length > 0 && (
              <span className="ml-2 relative flex items-center justify-center">
                <span
                  className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-60"
                  style={{ zIndex: 0 }}
                ></span>
                <span className="relative z-10 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow">
                  {notifications.length}
                </span>
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              ref={notifDropdownRef}
              className="absolute right-0 mt-2 w-[420px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-border z-50 p-4 animate-fade-in flex flex-col gap-2"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold text-xl text-foreground">
                    Notifications
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Stay updated with system activities and alerts
                  </div>
                </div>
                <button
                  className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => setShowNotifications(false)}
                >
                  Mark All as Read
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bell className="mx-auto h-8 w-8 mb-2" />
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-lg p-4 mb-2 shadow flex flex-col gap-1 border ${
                      n.type === "info"
                        ? "bg-blue-50"
                        : n.type === "success"
                        ? "bg-green-50"
                        : n.type === "warning"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {n.type === "info" && (
                        <Bell className="h-5 w-5 text-blue-500" />
                      )}
                      {n.type === "success" && (
                        <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg width="16" height="16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="white" />
                            <path
                              d="M4 8l2.5 2.5L12 5"
                              stroke="#22c55e"
                              strokeWidth="2"
                            />
                          </svg>
                        </span>
                      )}
                      {n.type === "warning" && (
                        <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                          <svg width="16" height="16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="white" />
                            <path
                              d="M8 4v4m0 4h.01"
                              stroke="#f59e42"
                              strokeWidth="2"
                            />
                          </svg>
                        </span>
                      )}
                      <span className="font-semibold text-base text-foreground">
                        {n.title}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {n.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-blue-600 hover:underline">
                        {n.details}
                      </button>
                      <button className="text-xs text-muted-foreground ml-auto">
                        ⋯
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* Profile/Logout Dropdown */}
        <div className="px-4 py-2 mt-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-[hsl(var(--foreground))]">
              Admin User
            </span>
          </div>
          <button
            className="w-full mt-2 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
