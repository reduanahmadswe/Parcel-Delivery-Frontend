import React from "react";

// Types
export type UserRole = "admin" | "sender" | "receiver";

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  protected?: boolean;
  allowedRoles?: UserRole[];
  layout?: boolean;
}

// Public Pages
import ContactPage from "./pages/public/ContactPage";
import HomePage from "./pages/public/HomePage";
import PartnersPage from "./pages/public/PartnersPage";
import TrackPage from "./pages/public/TrackPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DebugAuthPage from "./pages/auth/DebugAuthPage";

// Dashboard Pages
import AdminDashboard from "./features/dashboard/AdminDashboard";
import SenderDashboard from "./features/dashboard/SenderDashboard";
import ReceiverDashboard from "./features/dashboard/ReceiverDashboard";
import ProfilePage from "./features/dashboard/ProfilePage";

// Admin Pages
import NotificationsPage from "./pages/admin/NotificationsPage";
import ParcelManagementPage from "./pages/admin/ParcelManagement";
import SystemSettingsPage from "./pages/admin/SystemSettings";
import UserManagementPage from "./pages/admin/UserManagement";

// Sender Pages
import CreateParcelPage from "./pages/sender/CreateParcelPage";
import SenderParcelsPage from "./pages/sender/SenderParcelsPage";
import SenderStatisticsPage from "./pages/sender/SenderStatisticsPage";

// Error Pages
import NotFoundPage from "./pages/error/NotFoundPage";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";

// Test Pages
import APITestPage from "./pages/APITestPage";

// All Routes Configuration
export const routes: RouteConfig[] = [
  // Public Routes
  {
    path: "/",
    element: <HomePage />,
    layout: true,
  },
  {
    path: "/track",
    element: <TrackPage />,
    layout: true,
  },
  {
    path: "/contact",
    element: <ContactPage />,
    layout: true,
  },
  {
    path: "/partners",
    element: <PartnersPage />,
    layout: true,
  },
  {
    path: "/partners",
    element: <PartnersPage />,
    layout: true,
  },

  // Auth Routes
  {
    path: "/login",
    element: <LoginPage />,
    layout: true,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    layout: true,
  },
  {
    path: "/debug-auth",
    element: <DebugAuthPage />,
    layout: true,
  },

  // Role-based redirect routes
  {
    path: "/admin",
    element: <AdminDashboard />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/sender",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/receiver",
    element: <ReceiverDashboard />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },

  // Protected Dashboard Routes
  {
    path: "/dashboard",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/sender/dashboard",
    element: <SenderDashboard />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/receiver/dashboard",
    element: <ReceiverDashboard />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    protected: true,
    layout: true,
  },

  // Admin Routes
  {
    path: "/admin/parcels",
    element: <ParcelManagementPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/users",
    element: <UserManagementPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/notifications",
    element: <NotificationsPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },
  {
    path: "/admin/settings",
    element: <SystemSettingsPage />,
    protected: true,
    allowedRoles: ["admin"],
    layout: true,
  },

  // Sender Routes
  {
    path: "/sender/create-parcel",
    element: <CreateParcelPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/parcels",
    element: <SenderParcelsPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },
  {
    path: "/sender/statistics",
    element: <SenderStatisticsPage />,
    protected: true,
    allowedRoles: ["sender"],
    layout: true,
  },

  // Receiver Routes
  {
    path: "/receiver/track",
    element: <TrackPage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  // Receiver convenience / deep links
  {
    path: "/receiver/profile",
    element: <ProfilePage />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },
  {
    path: "/receiver/history",
    element: <ReceiverDashboard />,
    protected: true,
    allowedRoles: ["receiver"],
    layout: true,
  },

  // Test Routes (development only)
  {
    path: "/api-test",
    element: <APITestPage />,
    layout: true,
  },

  // Error Routes
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
    layout: true,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    layout: true,
  },
];

// Route configuration utility
export const shouldIncludeRoute = (path: string): boolean => {
  // Remove development routes in production
  if (process.env.NODE_ENV === 'production' && path === '/api-test') {
    return false;
  }
  if (process.env.NODE_ENV === 'production' && path === '/debug-auth') {
    return false;
  }
  return true;
};
