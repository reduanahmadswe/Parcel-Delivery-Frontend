"use client";

import {
  useDeleteParcelMutation,
  useUpdateParcelStatusMutation,
} from "@/features/parcels/parcelsApi";
import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import modular components

import { DashboardCharts } from "./components/DashboardCharts";
import { DashboardStatsCards } from "./components/DashboardStatsCards";
import { ParcelsTable } from "./components/ParcelsTable";

// Import types and utilities
import { useDebounce, usePagination } from "./hooks";
import { DashboardDataService } from "./services/DashboardDataService";
import { Activity, DashboardStats, RecentParcel } from "./types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, blocked: 0, newThisMonth: 0 },
    parcels: {
      total: 0,
      pending: 0,
      inTransit: 0,
      delivered: 0,
      flagged: 0,
      urgent: 0,
    },
  });
  const [parcels, setParcels] = useState<RecentParcel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalParcels, setTotalParcels] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample monthly data for charts
  const monthlyData = [
    {
      month: "Jan",
      parcels: 45,
      delivered: 42,
      shipments: 45,
      deliveryRate: 93,
    },
    {
      month: "Feb",
      parcels: 52,
      delivered: 48,
      shipments: 52,
      deliveryRate: 92,
    },
    {
      month: "Mar",
      parcels: 38,
      delivered: 35,
      shipments: 38,
      deliveryRate: 92,
    },
    {
      month: "Apr",
      parcels: 61,
      delivered: 58,
      shipments: 61,
      deliveryRate: 95,
    },
    {
      month: "May",
      parcels: 55,
      delivered: 51,
      shipments: 55,
      deliveryRate: 93,
    },
    {
      month: "Jun",
      parcels: 67,
      delivered: 63,
      shipments: 67,
      deliveryRate: 94,
    },
  ];

  // Use custom hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { currentPage, goToPage, goToNext, goToPrevious } = usePagination(
    Math.ceil(totalParcels / itemsPerPage),
    1
  );

  // RTK Query mutations
  const [deleteParcel] = useDeleteParcelMutation();
  const [updateParcelStatus] = useUpdateParcelStatusMutation();

  const fetchDashboardData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await DashboardDataService.fetchDashboardData(
        currentPage,
        itemsPerPage,
        debouncedSearchTerm,
        statusFilter
      );

      setStats(result.stats);
      setParcels(result.parcels);
      setActivities(result.activities);
      setTotalParcels(result.totalParcels);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleDeleteParcel = async (parcel: RecentParcel) => {
    try {
      await deleteParcel(parcel.trackingNumber).unwrap();
      toast.success("Parcel deleted successfully");
      await fetchDashboardData(true);
    } catch (error) {
      toast.error("Failed to delete parcel");
    }
  };

  const handleUpdateStatus = async (
    parcel: RecentParcel,
    newStatus: string
  ) => {
    try {
      const validStatuses = [
        "pending",
        "picked-up",
        "in-transit",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(newStatus)) {
        toast.error("Invalid status");
        return;
      }

      await updateParcelStatus({
        id: parcel.id.toString(),
        status: newStatus as
          | "pending"
          | "picked-up"
          | "in-transit"
          | "out-for-delivery"
          | "delivered"
          | "cancelled",
      }).unwrap();

      toast.success(`Parcel status updated to ${newStatus}`);
      await fetchDashboardData(true);
    } catch (error) {
      toast.error("Failed to update parcel status");
    }
  };

  const totalPages = Math.ceil(totalParcels / itemsPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Overview of your parcel delivery system
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <DashboardStatsCards stats={stats} />

          {/* Charts Section - Full Width */}
          <div className="w-full">
            <DashboardCharts stats={stats} monthlyData={monthlyData} />
          </div>

          {/* Parcel Management Table - Full Width Bottom */}
          <div className="w-full">
            <ParcelsTable
              parcels={parcels}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              currentPage={currentPage}
              parcelsPerPage={itemsPerPage}
              totalParcels={totalParcels}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onPageChange={goToPage}
              onParcelsPerPageChange={setItemsPerPage}
              onViewDetails={(parcel) => console.log("View details:", parcel)}
              onCancelParcel={(parcel) =>
                handleUpdateStatus(parcel, "cancelled")
              }
              onDeleteParcel={handleDeleteParcel}
              onConfirmParcel={(parcel) =>
                handleUpdateStatus(parcel, "picked-up")
              }
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
