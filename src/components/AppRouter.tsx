import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { routes, shouldIncludeRoute, RouteConfig } from "../routes";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";

export const AppRouter: React.FC = () => {
  const location = useLocation();
  
  // 🔍 Debug: Log route changes
  useEffect(() => {
    console.log("🛣️ [AppRouter] Route changed to:", location.pathname);
    console.log("📦 [AppRouter] Location state:", location.state);
    console.log("🔗 [AppRouter] Search params:", location.search);
    console.log("# [AppRouter] Hash:", location.hash);
  }, [location]);

  // Filter routes based on feature flags
  const filteredRoutes = routes.filter((route: RouteConfig) => shouldIncludeRoute(route.path));
  
  console.log("📋 [AppRouter] Total routes:", filteredRoutes.length);
  console.log("🎯 [AppRouter] Current pathname:", location.pathname);

  return (
    <Routes>
      {filteredRoutes.map((route: RouteConfig) => {
        let element = route.element;

        // Wrap with layout if needed
        if (route.layout) {
          element = <Layout>{element}</Layout>;
        }

        // Wrap with protection if needed
        if (route.protected) {
          element = (
            <ProtectedRoute allowedRoles={route.allowedRoles}>
              {element}
            </ProtectedRoute>
          );
        }

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
};
