import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes, shouldIncludeRoute, RouteConfig } from "../routes";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";

export const AppRouter: React.FC = () => {
  // Filter routes based on feature flags
  const filteredRoutes = routes.filter((route: RouteConfig) => shouldIncludeRoute(route.path));

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
