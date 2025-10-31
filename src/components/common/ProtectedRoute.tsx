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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

