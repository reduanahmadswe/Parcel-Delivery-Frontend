"use client";

import { BarChart3, Calendar, Eye, Package, Plus, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/ApiConfiguration";
import { getStatusColor } from "../../lib/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "../sections/FooterSection";
import ParcelDetailsModal from "../sender/ParcelDetailsModal";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderDashboard() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParcels();
  }, []);

  const handleViewParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
  };

  const fetchParcels = async () => {
    try {
      console.log("🔍 Debugging parcel fetch...");

      // Try multiple endpoints to see which one gives all data
      let response;
      let allParcels = [];

      // Method 1: Try with high limit parameter
      try {
        response = await api.get("/parcels/me?limit=10000");
        console.log("✅ Method 1 (/parcels/me?limit=10000):", {
          count: response.data.data?.length,
          total: response.data.total,
          pagination: response.data.pagination,
        });
        if (response.data.data?.length > 10) {
          allParcels = response.data.data;
          console.log("🎉 Found more than 10 parcels with limit=10000!");
        }
      } catch (err) {
        console.log("❌ Method 1 failed:", err);
      }

      // Method 2: Try no-pagination with limit
      if (allParcels.length <= 10) {
        try {
          response = await api.get("/parcels/me/no-pagination?limit=10000");
          console.log("✅ Method 2 (/parcels/me/no-pagination?limit=10000):", {
            count: response.data.data?.length,
            total: response.data.total,
          });
          if (response.data.data?.length > allParcels.length) {
            allParcels = response.data.data;
          }
        } catch (err) {
          console.log("❌ Method 2 failed:", err);
        }
      }

      // Method 3: Try pagination with multiple pages
      if (allParcels.length <= 10) {
        try {
          const page1 = await api.get("/parcels/me?page=1&limit=10000");
          const page2 = await api.get("/parcels/me?page=2&limit=10000");
          const combinedData = [
            ...(page1.data.data || []),
            ...(page2.data.data || []),
          ];
          console.log("✅ Method 3 (pagination):", {
            page1Count: page1.data.data?.length || 0,
            page2Count: page2.data.data?.length || 0,
            totalCombined: combinedData.length,
            page1Total: page1.data.total,
            page2Total: page2.data.total,
          });
          if (combinedData.length > allParcels.length) {
            allParcels = combinedData;
          }
        } catch (err) {
          console.log("❌ Method 3 failed:", err);
        }
      }

      // Method 4: Fallback to original endpoint
      if (allParcels.length === 0) {
        try {
          response = await api.get("/parcels/me/no-pagination");
          allParcels = response.data.data || [];
          console.log("⚠️ Fallback to original endpoint:", allParcels.length);
        } catch (err) {
          console.log("❌ Fallback failed:", err);
        }
      }

      console.log("📊 Final result:", {
        parcelsCount: allParcels.length,
        expectedCount: 23,
        isComplete: allParcels.length >= 23,
      });

      console.log("📦 All parcels:", allParcels);
      setParcels(allParcels);
    } catch (error) {
      console.error("❌ Error fetching parcels:", error);
      toast.error("Failed to fetch parcels");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: parcels.length,
    pending: parcels.filter((p) =>
      ["requested", "approved"].includes(p.currentStatus)
    ).length,
    inTransit: parcels.filter((p) =>
      ["dispatched", "in-transit"].includes(p.currentStatus)
    ).length,
    delivered: parcels.filter((p) => p.currentStatus === "delivered").length,
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["sender"]}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["sender"]}>
      <div className="min-h-screen bg-background mt-10">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 border border-border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name}! Here's your delivery overview.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Parcels
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    In Transit
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.inTransit}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivered
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.delivered}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-background rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/sender/create-parcel"
                className="p-4 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/20 border border-border rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Create New Parcel
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Start a new delivery request
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/sender/parcels"
                className="p-4 bg-gradient-to-r from-green-50/50 via-transparent to-green-50/50 dark:from-green-950/20 dark:to-green-950/20 border border-border rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      View My Parcels
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your deliveries
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/sender/statistics"
                className="p-4 bg-gradient-to-r from-purple-50/50 via-transparent to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/20 border border-border rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      View Statistics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Delivery analytics
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Parcels Preview */}
          <div className="bg-background rounded-lg shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Parcels
                </h2>
                <Link
                  to="/sender/parcels"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {parcels.slice(0, 3).length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No parcels yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first parcel delivery request.
                  </p>
                  <Link
                    to="/sender/create-parcel"
                    className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:shadow-lg text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Parcel
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {parcels.slice(0, 3).map((parcel) => (
                    <div
                      key={parcel._id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {parcel.trackingId}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            To: {parcel.receiverInfo.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            parcel.currentStatus
                          )}`}
                        >
                          {parcel.currentStatus.replace("-", " ").toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleViewParcel(parcel)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="View Parcel Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />

      {/* Parcel Details Modal */}
      <ParcelDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parcel={selectedParcel}
      />
    </ProtectedRoute>
  );
}
