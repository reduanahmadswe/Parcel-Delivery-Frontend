"use client";

import { BarChart3, Calendar, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/ApiConfiguration";
import { Parcel } from "../../types/GlobalTypeDefinitions";

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
      const response = await api.get("/parcels/me");
      setParcels(response.data.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      toast.error("Failed to fetch parcels");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: parcels.length,
    requested: parcels.filter((p) => p.currentStatus === "requested").length,
    inTransit: parcels.filter((p) => p.currentStatus === "in-transit").length,
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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border border-border rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Statistics
                </h1>
                <p className="text-muted-foreground">
                  Analytics and insights about your parcel deliveries
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total > 0
                      ? Math.round((stats.delivered / stats.total) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Parcels
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.requested + stats.inTransit}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ৳
                    {parcels
                      .reduce(
                        (total, parcel) => total + (parcel.fee?.totalFee || 0),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Status Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Requested</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.requested}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-foreground">In Transit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.inTransit}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Delivered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.delivered}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
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
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Monthly Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Parcels this month
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Average per week
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {Math.round(
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length / 4
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total revenue this month
                  </span>
                  <span className="text-lg font-semibold text-foreground">
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
            <div className="bg-background rounded-lg shadow-sm border border-border p-8 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No statistics available
              </h3>
              <p className="text-muted-foreground mb-4">
                Start creating parcels to see your delivery statistics and
                analytics.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
