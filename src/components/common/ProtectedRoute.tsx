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
    console.log("🛡️ ProtectedRoute - Auth state:", { user: user?.email, role: user?.role, loading, allowedRoles });
    
    if (!loading) {
      if (!user) {
        console.log("🚫 No user, redirecting to:", redirectTo);
        navigate(redirectTo, { replace: true });
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log("🔄 Role mismatch. User role:", user.role, "Allowed:", allowedRoles);
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
        console.log("🎯 Redirecting to role dashboard:", roleDashboard);
        navigate(roleDashboard, { replace: true });
        return;
      }
      
      console.log("✅ Access granted for user:", user.email, "Role:", user.role);
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

