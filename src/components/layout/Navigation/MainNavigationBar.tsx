import ThemeToggle from "../../ui/DarkLightThemeSwitcher";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/slices/authSlice";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle,
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
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavigationItem {
  href: string;
  label: string;
  icon: any;
  onClick?: () => void;
}

export default function Navigation() {
  
  const userFromStore = useAppSelector(selectCurrentUser);
  const { logout } = useAuth();

  const [user, setUser] = useState<typeof userFromStore>(() => {
    
    if (userFromStore) return userFromStore;
    try {
      const cachedUser = localStorage.getItem('userData');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (userFromStore) {
      setUser(userFromStore);
    } else if (!userFromStore) {
      
      console.warn("⚠️ [Navigation] Redux user is null, checking localStorage");
      try {
        const cachedUser = localStorage.getItem('userData');
        const hasToken = localStorage.getItem('accessToken');
        
        if (cachedUser && hasToken) {
          const parsed = JSON.parse(cachedUser);
          setUser(parsed);
        } else if (!hasToken) {
          
          setUser(null);
        }
      } catch (error) {
        console.error("❌ [Navigation] Failed to parse cached user");
      }
    }
  }, [userFromStore]);

  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      const userData = event.detail?.user;
      if (userData) {
        setUser(userData);
      }
    };
    
    window.addEventListener('userLoggedIn', handleUserLogin as EventListener);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      const interval = setInterval(() => {
        try {
          const cachedUser = localStorage.getItem('userData');
          if (cachedUser) {
            const parsed = JSON.parse(cachedUser);
            setUser(parsed);
          }
        } catch (error) {
          
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [user]);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState(3); 
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const notificationsList = [
    {
      id: 1,
      title: "New parcel registered",
      description: "TRK001234 has been added to the system by Ahmed Hassan",
      time: "2 minutes ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "User registration",
      description: "New user Ahmed Hassan registered as sender",
      time: "15 minutes ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "Parcel delivered",
      description: "TRK005678 successfully delivered to Rashida Begum",
      time: "1 hour ago",
      type: "success",
      unread: false,
    },
    {
      id: 4,
      title: "Flagged parcel requires attention",
      description: "TRK009876 has been flagged for review",
      time: "2 hours ago",
      type: "warning",
      unread: false,
    },
    {
      id: 5,
      title: "System maintenance completed",
      description: "Database backup and optimization completed successfully",
      time: "3 hours ago",
      type: "info",
      unread: false,
    },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const isActive = (href: string) => {
    
    if (href.startsWith("#")) {
      const isOnHomePage = location.pathname === "/";
      const currentHash = window.location.hash || location.hash;
      return isOnHomePage && currentHash === href;
    }

    if (href === "/") {
      const currentHash = window.location.hash || location.hash;
      return location.pathname === "/" && !currentHash;
    }

    if (href === "/track") {
      return location.pathname === "/track";
    }

    const exactOnly = ["/admin", "/sender", "/receiver"];
    if (exactOnly.includes(href)) return location.pathname === href;

    return location.pathname.startsWith(href + "/") || location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      
      navigate("/");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      
      if (location.pathname !== "/") {
        navigate("/");
        
        setTimeout(() => {
          const element = document.getElementById(href.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          
          window.location.hash = href;
          setCurrentHash(href);
        }, 100);
      } else {
        
        const element = document.getElementById(href.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        
        window.location.hash = href;
        setCurrentHash(href);
      }
    }
    
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLinkClick = () => {
    
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navigationItems: NavigationItem[] =
    user?.role === "admin"
      ? [
          { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/parcels", label: "Parcels", icon: Package },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ]
      : user?.role === "sender"
      ? [
          { href: "/sender/dashboard", label: "Overview", icon: BarChart3 },
          { href: "/sender/parcels", label: "My Parcels", icon: Package },
          {
            href: "/sender/create-parcel",
            label: "Create Parcel",
            icon: Package,
          },
          { href: "/track", label: "Track Parcel", icon: Search },
          { href: "/sender/statistics", label: "Statistics", icon: BarChart3 },
        ]
      : user?.role === "receiver"
      ? [
          { href: "/receiver/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/track", label: "Track Parcel", icon: Search },
          { href: "/profile", label: "Profile", icon: User },
          { href: "/contact", label: "Contact", icon: MessageSquare },
        ]
      : [
          { href: "#hero", label: "Home", icon: Home },
          { href: "#services", label: "Our Services", icon: Package },
          { href: "/track", label: "Track Parcel", icon: Search },
          { href: "#pricing", label: "Pricing", icon: FileText },
          { href: "/contact", label: "Contact", icon: MessageSquare },
        ];

  const userMenuItems: NavigationItem[] =
    user?.role === "admin"
      ? [{ href: "/profile", label: "Profile", icon: User }]
      : user?.role === "sender"
      ? [
          { href: "/profile", label: "Profile", icon: User },
        ]
      : user?.role === "receiver"
      ? [
          { href: "/profile", label: "Profile", icon: User },
          { href: "/receiver/track", label: "Track Parcel", icon: Search },
        ]
      : [
          { href: "/profile", label: "Profile", icon: User },
          { href: "/settings", label: "Settings", icon: Settings },
        ];

  return (
    <nav className="bg-background/95 backdrop-blur-xl shadow-lg border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => handleNavClick("#hero")}
              className="flex items-center space-x-2 sm:space-x-3 group min-w-0 cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl font-bold text-foreground group-hover:text-red-500 transition-colors duration-300 truncate">
                  ParcelTrack
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                  Professional Delivery
                </span>
              </div>
            </button>
          </div>

          {}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return item.href.startsWith("#") ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    active
                      ? "text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-lg shadow-red-500/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span>{item.label}</span>
                  {!active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    active
                      ? "text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-lg shadow-red-500/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span>{item.label}</span>
                  {!active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {}
            <div className="hidden xs:block">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                {}
                {user.role === "admin" && (
                  <div className="relative hidden lg:block" ref={notificationsRef}>
                    <button
                      onClick={() =>
                        setIsNotificationsOpen(!isNotificationsOpen)
                      }
                      className="relative p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg sm:rounded-xl transition-all duration-300 group"
                    >
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                      {notifications > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center animate-pulse font-semibold shadow-lg">
                          {notifications}
                        </span>
                      )}
                    </button>

                    {}
                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-background rounded-lg shadow-xl border border-border z-50 max-h-96 overflow-y-auto">
                        {}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-3 sm:p-4 rounded-t-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              <h3 className="text-white font-semibold text-sm sm:text-base">
                                Notifications
                              </h3>
                            </div>
                            <button className="text-[10px] sm:text-xs text-white/80 hover:text-white bg-white/20 hover:bg-white/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors whitespace-nowrap">
                              Mark All Read
                            </button>
                          </div>
                        </div>

                        {}
                        <div className="max-h-80 overflow-y-auto">
                          {notificationsList.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-2.5 sm:p-3 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                                notification.unread
                                  ? "bg-blue-50/50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                                  {getIconForType(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-medium text-foreground text-xs sm:text-sm line-clamp-1">
                                      {notification.title}
                                    </h4>
                                    {notification.unread && (
                                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                                    {notification.description}
                                  </p>
                                  <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 inline-block">
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {}
                        <div className="p-2.5 sm:p-3 border-t border-border bg-muted/30">
                          <button className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium">
                            View All Notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {}
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 sm:space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-foreground">
                          {user?.name}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-background/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-border py-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                      <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border">
                        <div className="flex items-center space-x-2.5 sm:space-x-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                              {user?.name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">
                              {user?.email}
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
                              className="flex items-center space-x-2.5 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-border pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2.5 sm:space-x-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group"
                        >
                          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-accent/50 hidden xs:block"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 hidden xs:block"
                >
                  Get Started
                </Link>
              </div>
            )}

            {}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 group"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return item.href.startsWith("#") ? (
                  <button
                    key={item.href}
                    onClick={() => {
                      handleNavClick(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2.5 sm:space-x-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group w-full text-left relative ${
                      active
                        ? "text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-lg shadow-red-500/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 flex-shrink-0 ${
                        active ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2.5 sm:space-x-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group relative ${
                      active
                        ? "text-white bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-lg shadow-red-500/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 flex-shrink-0 ${
                        active ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="border-t border-border pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <div className="flex items-center space-x-2.5 sm:space-x-3 px-2.5 sm:px-3 py-2.5 sm:py-3 bg-accent/20 rounded-lg sm:rounded-xl">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                          {user?.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3 sm:mt-4">
                    {}
                    <div className="xs:hidden flex items-center space-x-2.5 px-2.5 py-2.5 text-muted-foreground">
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs font-medium flex-1">Theme</span>
                      <ThemeToggle />
                    </div>

                    {userMenuItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center space-x-2.5 sm:space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2.5 sm:space-x-3 w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group"
                    >
                      <LogOut className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div className="border-t border-border pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block text-muted-foreground hover:text-foreground hover:bg-accent/50 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 text-center shadow-lg"
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

