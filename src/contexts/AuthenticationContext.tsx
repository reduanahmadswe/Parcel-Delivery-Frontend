"use client";

import api from "@/lib/ApiConfiguration";
import { User } from "@/types/GlobalTypeDefinitions";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.data.user);
      toast.success("Login successful");
      return true;
    } catch (error) {
      const message =
        (error as ApiError).response?.data?.message || "Login failed";
      toast.error(message);
      return false;
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
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.success("Logged out successfully");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
