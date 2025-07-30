"use client";

import { useAuth } from "@/contexts/AuthenticationContext";
import { User } from "@/types/GlobalTypeDefinitions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        switch (user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "sender":
            router.push("/sender");
            break;
          case "receiver":
            router.push("/receiver");
            break;
          default:
            router.push("/");
        }
        return;
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

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
