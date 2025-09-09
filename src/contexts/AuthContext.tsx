"use client";

import { useAuthPersistence } from "@/hooks/useAuthPersistence";
import api from "@/lib/ApiConfiguration";
import { TokenManager } from "@/lib/TokenManager";
import { User } from "@/types/GlobalTypeDefinitions";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "sender" | "receiver";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the authentication persistence hook
  useAuthPersistence();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Additional effect to handle localStorage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        if (!event.newValue) {
          // Token was removed in another tab
          setUser(null);
        } else if (!user) {
          // Token was added in another tab, re-check auth
          checkAuth();
        }
      }
    };

    // Handle page visibility change (user switching tabs/windows)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Page became visible and we have a user, verify token is still valid
        const token = TokenManager.getAccessToken();
        if (!token) {
          // Token was cleared while page was hidden
          setUser(null);
          clearCachedUser();
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const initializeAuth = async () => {
    try {
      // Clear any existing authentication data on app startup
      // This ensures users start in a logged-out state
      console.log("Clearing authentication data on startup");

      TokenManager.clearTokens();
      clearCachedUser();
      setUser(null);
      setLoading(false);

      // If you want to restore authentication, uncomment the code below:
      /*
      // Check if we have tokens
      const token = TokenManager.getAccessToken();
      const cachedUser = getCachedUser();

      if (token && cachedUser) {
        // We have both token and cached user, restore state immediately
        setUser(cachedUser);
        setLoading(false);

        // Verify in background
        checkAuthInBackground();
      } else if (token) {
        // We have token but no cached user, need to fetch
        await checkAuth();
      } else {
        // No token, user is not authenticated
        setLoading(false);
      }
      */
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setLoading(false);
    }
  };
  const checkAuth = async () => {
    try {
      const token = TokenManager.getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Set loading to true while checking auth
      setLoading(true);

      // Try to get cached user data first
      const cachedUser = getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        // Set loading to false after setting cached user for better UX
        setLoading(false);
      }

      // Then verify with server in background
      try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUser(userData);
          setCachedUser(userData);
        }
      } catch (apiError: unknown) {
        // Only clear tokens if it's a 401 (unauthorized) or 403 (forbidden)
        if (
          apiError &&
          typeof apiError === "object" &&
          "response" in apiError &&
          apiError.response &&
          typeof apiError.response === "object" &&
          "status" in apiError.response &&
          (apiError.response.status === 401 || apiError.response.status === 403)
        ) {
          console.error("Authentication failed - clearing tokens:", apiError);
          TokenManager.clearTokens();
          clearCachedUser();
          setUser(null);
        } else {
          // For network errors or server issues, keep the cached user
          console.warn(
            "Auth verification failed but keeping cached user:",
            apiError
          );
          if (cachedUser) {
            setUser(cachedUser);
          }
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Only clear if there's a serious error and no cached user
      const cachedUser = getCachedUser();
      if (!cachedUser) {
        TokenManager.clearTokens();
        clearCachedUser();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for user caching
  const getCachedUser = (): User | null => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("userData");
        return cached ? JSON.parse(cached) : null;
      }
    } catch (error) {
      console.error("Failed to get cached user:", error);
    }
    return null;
  };

  const setCachedUser = (user: User) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Failed to cache user:", error);
    }
  };

  const clearCachedUser = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userData");
      }
    } catch (error) {
      console.error("Failed to clear cached user:", error);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User }> => {
    try {
      const response = await api.post("/auth/login", { email, password });

      // Store tokens using TokenManager
      if (response.data.data.accessToken) {
        TokenManager.setTokens(
          response.data.data.accessToken,
          response.data.data.refreshToken
        );
      }

      const userData = response.data.data.user;
      setUser(userData);
      setCachedUser(userData);
      toast.success("Login successful");
      return { success: true, user: userData };
    } catch (error) {
      const message =
        (error as ApiError).response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false };
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await api.post("/auth/register", userData);
      toast.success("Registration successful! Please log in.");
      return true;
    } catch (error) {
      const message =
        (error as ApiError).response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      TokenManager.clearTokens();
      clearCachedUser();
      toast.success("Logged out successfully");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        setCachedUser(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, clear everything
      TokenManager.clearTokens();
      clearCachedUser();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  // Add debug support in development
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      const globalWindow = window as typeof window & {
        AuthDebug?: {
          getUser: () => User | null;
          getAccessToken: () => string | null;
          getRefreshToken: () => string | null;
          getCachedUser: () => User | null;
          hasTokens: () => boolean;
          clearAuth: () => void;
          checkAuth: () => Promise<void>;
        };
      };

      globalWindow.AuthDebug = {
        getUser: () => user,
        getAccessToken: () => TokenManager.getAccessToken(),
        getRefreshToken: () => TokenManager.getRefreshToken(),
        getCachedUser: () => getCachedUser(),
        hasTokens: () => TokenManager.hasValidTokens(),
        clearAuth: () => {
          setUser(null);
          TokenManager.clearTokens();
          clearCachedUser();
        },
        checkAuth: () => checkAuth(),
      };
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
