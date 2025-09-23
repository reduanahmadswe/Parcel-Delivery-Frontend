"use client";

import { BarChart3, Calendar, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/ApiConfiguration";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "../public/sections/FooterSection";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderStatisticsPage() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
  if ((import.meta as any).env?.DEV) console.debug("🔍 Debugging parcel fetch for statistics...");

      // Try multiple endpoints to get all data (similar to dashboard)
      let response;
      let allParcels = [];

      // Method 1: Try with high limit parameter
      try {
        response = await api.get("/parcels/me?limit=10000");
  if ((import.meta as any).env?.DEV) console.debug("✅ Method 1 (/parcels/me?limit=10000):", {
          count: response.data.data?.length,
          total: response.data.total,
          pagination: response.data.pagination,
        });
        if (response.data.data?.length > 10) {
          allParcels = response.data.data;
          if ((import.meta as any).env?.DEV) console.debug("🎉 Found more than 10 parcels with limit=10000!");
        }
      } catch (err) {
  if ((import.meta as any).env?.DEV) console.debug("❌ Method 1 failed:", err);
      }

      // Method 2: Try no-pagination with limit
      if (allParcels.length <= 10) {
        try {
          response = await api.get("/parcels/me/no-pagination?limit=10000");
          if ((import.meta as any).env?.DEV) console.debug("✅ Method 2 (/parcels/me/no-pagination?limit=10000):", {
            count: response.data.data?.length,
            total: response.data.total,
          });
          if (response.data.data?.length > allParcels.length) {
            allParcels = response.data.data;
          }
        } catch (err) {
          if ((import.meta as any).env?.DEV) console.debug("❌ Method 2 failed:", err);
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
          if ((import.meta as any).env?.DEV) console.debug("✅ Method 3 (pagination):", {
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
          if ((import.meta as any).env?.DEV) console.debug("❌ Method 3 failed:", err);
        }
      }

      // Method 4: Fallback to original endpoint
      if (allParcels.length === 0) {
        try {
          response = await api.get("/parcels/me/no-pagination");
          allParcels = response.data.data || [];
          if ((import.meta as any).env?.DEV) console.debug("⚠️ Fallback to original endpoint:", allParcels.length);
        } catch (err) {
          if ((import.meta as any).env?.DEV) console.debug("❌ Fallback failed:", err);
        }
      }

  if ((import.meta as any).env?.DEV) console.debug("📊 Final result for statistics:", {
        parcelsCount: allParcels.length,
        expectedCount: 23,
        isComplete: allParcels.length >= 23,
      });

  if ((import.meta as any).env?.DEV) console.debug("📦 All parcels for statistics:", allParcels);
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
    // Legacy support for old status names
    requested: parcels.filter((p) => p.currentStatus === "requested").length,
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
      <div className="min-h-screen bg-background mt-11">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border border-border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Statistics & Analytics
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name}! Here's your current parcel
                  analytics and insights.
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                    <Package className="h-4 w-4 mr-1" />
                    {stats.total} Total Parcels
                  </span>
                  <span className="inline-flex items-center text-green-600 dark:text-green-400">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {stats.total > 0
                      ? Math.round((stats.delivered / stats.total) * 100)
                      : 0}
                    % Success Rate
                  </span>
                  {stats.pending + stats.inTransit > 0 && (
                    <span className="inline-flex items-center text-orange-600 dark:text-orange-400">
                      <Truck className="h-4 w-4 mr-1" />
                      {stats.pending + stats.inTransit} Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Overview - Live Data */}
          <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50/20 hover:to-purple-50/20 dark:hover:from-blue-950/10 dark:hover:to-purple-950/10">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Current Overview
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Live Data
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 hover:shadow-lg hover:scale-105 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg transition-colors duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Parcels
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.total}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      {stats.total > 0
                        ? `Updated with ${stats.total} parcels`
                        : "No parcels yet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4 hover:shadow-lg hover:scale-105 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg transition-colors duration-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.pending}
                    </p>
                    <p className="text-xs text-yellow-600 font-medium">
                      {stats.pending > 0
                        ? `${stats.pending} awaiting action`
                        : "All processed"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg p-4 hover:shadow-lg hover:scale-105 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg transition-colors duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      In Transit
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.inTransit}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
                      {stats.inTransit > 0
                        ? `${stats.inTransit} on the way`
                        : "None in transit"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4 hover:shadow-lg hover:scale-105 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg transition-colors duration-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Delivered
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.delivered}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      {stats.delivered > 0
                        ? `${Math.round(
                            (stats.delivered / stats.total) * 100
                          )}% success rate`
                        : "No deliveries yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors duration-300">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">
                    {stats.total > 0
                      ? Math.round((stats.delivered / stats.total) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-600 transition-colors duration-300">
                    Active Parcels
                  </p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors duration-300">
                    {stats.pending + stats.inTransit}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all duration-300">
                  <Truck className="h-6 w-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300">
                  <Calendar className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
                    ৳
                    {parcels
                      .reduce(
                        (total, parcel) => total + (parcel.fee?.totalFee || 0),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all duration-300">
                  <Package className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Status Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-950/20 p-2 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm text-foreground">Requested</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.requested}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 hover:bg-blue-600"
                        style={{
                          width:
                            stats.total > 0
                              ? `${(stats.requested / stats.total) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 p-2 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm text-foreground">In Transit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.inTransit}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500 hover:bg-yellow-600"
                        style={{
                          width:
                            stats.total > 0
                              ? `${(stats.inTransit / stats.total) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between hover:bg-green-50/50 dark:hover:bg-green-950/20 p-2 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm text-foreground">Delivered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.delivered}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500 hover:bg-green-600"
                        style={{
                          width:
                            stats.total > 0
                              ? `${(stats.delivered / stats.total) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Monthly Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-3 rounded-lg transition-all duration-300 group/item">
                  <span className="text-sm text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Parcels this month
                  </span>
                  <span className="text-lg font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-3 rounded-lg transition-all duration-300 group/item">
                  <span className="text-sm text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Average per week
                  </span>
                  <span className="text-lg font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    {Math.round(
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length / 4
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-3 rounded-lg transition-all duration-300 group/item">
                  <span className="text-sm text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Total revenue this month
                  </span>
                  <span className="text-lg font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    ৳
                    {parcels
                      .filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      )
                      .reduce(
                        (total, parcel) => total + (parcel.fee?.totalFee || 0),
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {stats.total === 0 && (
            <div className="bg-background rounded-lg shadow-sm border border-border p-8 text-center hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
                No statistics available
              </h3>
              <p className="text-muted-foreground mb-4 group-hover:text-blue-500 transition-colors duration-300">
                Start creating parcels to see your delivery statistics and
                analytics.
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </ProtectedRoute>
  );
}


