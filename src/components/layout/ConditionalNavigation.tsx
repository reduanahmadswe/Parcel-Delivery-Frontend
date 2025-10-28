"use client";

import MainNavigationBar from "./MainNavigationBar";
import { useLocation } from "react-router-dom";

export default function ConditionalNavigation() {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide navigation on authentication pages or when using a specialized
  // admin layout that renders its own navigation. This prevents the
  // global MainNavigationBar from being rendered twice on admin pages.
  const hideNavigation =
    pathname === "/login" ||
    pathname === "/register" ||
    // Hide global nav for admin routes (AdminLayout renders its own nav)
    pathname.startsWith("/admin");

  if (hideNavigation) {
    return null;
  }

  return <MainNavigationBar />;
}

