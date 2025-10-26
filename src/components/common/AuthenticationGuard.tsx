"use client";

import { useAuth } from "../../hooks/useAuth";
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
    if (!loading) {
      if (!user) {
        navigate(redirectTo, { replace: true });
        return;
      }

      // Redirect if user doesn't have access to this specific protected route
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Don't navigate if already on correct dashboard
        const currentPath = window.location.pathname;
        const targetPath = user.role === "admin" ? "/admin/dashboard"
                         : user.role === "sender" ? "/sender/dashboard"
                         : user.role === "receiver" ? "/receiver/dashboard"
                         : "/";
        
        if (currentPath !== targetPath) {
          navigate(targetPath, { replace: true });
        }
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

