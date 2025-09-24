import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

// Pages
import ContactPage from "../pages/public/ContactPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/error/NotFoundPage";
import PartnersPage from "../pages/public/PartnersPage";
import ProfilePage from "../features/dashboard/ProfilePage";
import StatusHistoryPage from "../features/tracking/StatusHistoryPage";

import TrackPage from "../pages/public/TrackPage";
import UnauthorizedPage from "../pages/error/UnauthorizedPage";

// Dashboard Pages
import ReceiverDashboard from "../features/dashboard/ReceiverDashboard";
import SenderDashboard from "../features/dashboard/SenderDashboard";
import CreateParcelPage from "../pages/sender/CreateParcelPage";
import SenderParcelsPage from "../pages/sender/SenderParcelsPage";
import SenderStatisticsPage from "../pages/sender/SenderStatisticsPage";

// Admin Pages
import NotificationsPage from "../pages/admin/NotificationsPage";
import ParcelManagementPage from "../pages/admin/ParcelManagement";
import SystemSettingsPage from "../pages/admin/SystemSettings";
import UserManagementPage from "../pages/admin/UserManagement";
import AdminDashboardPage from "../features/dashboard/AdminDashboard";

// Components
import { ThemeProvider } from "../components/ui/theme-provider";
import { ReduxAuthProvider } from "./contexts/ReduxAuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";
import RegisterPage from "../pages/auth/RegisterPage";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <ReduxAuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <HomePage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Layout>
                        <LoginPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Layout>
                        <RegisterPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/track"
                    element={
                      <Layout>
                        <TrackPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/status-history"
                    element={
                      <Layout>
                        <StatusHistoryPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout>
                        <ContactPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/partners"
                    element={
                      <Layout>
                        <PartnersPage />
                      </Layout>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Sender Routes */}
                  <Route
                    path="/sender"
                    element={
                      <ProtectedRoute allowedRoles={["sender"]}>
                        <Layout>
                          <SenderDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sender/parcels"
                    element={
                      <ProtectedRoute allowedRoles={["sender"]}>
                        <Layout>
                          <SenderParcelsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sender/create-parcel"
                    element={
                      <ProtectedRoute allowedRoles={["sender"]}>
                        <Layout>
                          <CreateParcelPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sender/statistics"
                    element={
                      <ProtectedRoute allowedRoles={["sender"]}>
                        <Layout>
                          <SenderStatisticsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Receiver Routes */}
                  <Route
                    path="/receiver"
                    element={
                      <ProtectedRoute allowedRoles={["receiver"]}>
                        <Layout>
                          <ReceiverDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receiver/track"
                    element={
                      <ProtectedRoute allowedRoles={["receiver"]}>
                        <Layout>
                          <TrackPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receiver/history"
                    element={
                      <ProtectedRoute allowedRoles={["receiver"]}>
                        <Layout>
                          <StatusHistoryPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receiver/profile"
                    element={
                      <ProtectedRoute allowedRoles={["receiver"]}>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <UserManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/parcels"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <ParcelManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <SystemSettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notifications"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      duration: 3000,
                      style: {
                        background: "#10b981",
                      },
                    },
                    error: {
                      duration: 5000,
                      style: {
                        background: "#ef4444",
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </ReduxAuthProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
