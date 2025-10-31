"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthStateManager } from "../../services/AuthStateManager";
import { User } from "../../types";
import { useEffect } from "react";
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

  useEffect(() => {
    
    // Only perform access checks after auth persistence initialization to avoid
    // redirecting while other auth persistence logic is still restoring state.
    if (!loading && AuthStateManager.isInitialized()) {
      if (!user) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
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
      
    }
  }, [user, loading, allowedRoles, redirectTo, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

