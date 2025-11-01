"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthStateManager } from "../../services/AuthStateManager";
import { TokenManager } from "../../services/TokenManager";
import { User } from "../../types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User["role"][];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait a bit for auth state to stabilize
    const checkAuth = async () => {
      // If still loading, wait
      if (loading) {
        return;
      }

      // Check if we have a token
      const hasToken = !!TokenManager.getAccessToken();

      // If auth is initialized and we have no token and no user, redirect to login
      if (AuthStateManager.isInitialized() && !hasToken && !user) {
        setIsChecking(false);
        navigate(redirectTo, { replace: true });
        return;
      }

      // If we have a user, check roles
      if (user) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard
          let roleDashboard = "/";
          switch (user.role) {
            case "admin":
              roleDashboard = "/admin/dashboard";
              break;
            case "sender":
              roleDashboard = "/sender/dashboard";
              break;
            case "receiver":
              roleDashboard = "/receiver/dashboard";
              break;
            default:
              roleDashboard = "/";
          }
          navigate(roleDashboard, { replace: true });
          return;
        }
        setIsChecking(false);
      } else if (hasToken) {
        // If we have token but no user yet, wait a bit
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, loading, allowedRoles, redirectTo, navigate]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 animate-pulse"></div>
          </div>

          {/* Loading Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6">
              {/* Animated Logo/Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-pink-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 via-orange-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg animate-bounce">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
              </div>

              {/* Loading Spinner */}
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-red-500 border-r-orange-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-red-500/20"></div>
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Loading Your Dashboard
                </h3>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Please wait a moment...
                </p>
              </div>

              {/* Loading Dots Animation */}
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

