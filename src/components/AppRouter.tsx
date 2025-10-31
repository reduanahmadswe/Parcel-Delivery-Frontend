import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { routes, shouldIncludeRoute, RouteConfig } from "../routes";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";

export const AppRouter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
  }, [location]);

  const filteredRoutes = routes.filter((route: RouteConfig) => shouldIncludeRoute(route.path));

  return (
    <Routes>
      {filteredRoutes.map((route: RouteConfig) => {
        let element = route.element;

        if (route.layout) {
          element = <Layout>{element}</Layout>;
        }

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
