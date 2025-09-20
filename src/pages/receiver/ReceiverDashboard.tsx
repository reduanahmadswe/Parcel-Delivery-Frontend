"use client";

import { useAuth } from "@/hooks/useAuth";
import { Download, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { receiverApiService } from "./services/receiverApi";
import { Parcel, SearchFilters } from "./types";
import { receiverUtils } from "./utils/receiverUtils";

import ParcelDetailsModal from "./components/ParcelDetailsModal";
import ParcelList from "./components/ParcelList";
import SearchAndFilters from "./components/SearchAndFilters";
import StatsCards from "./components/StatsCards";

export default function ReceiverDashboard() {
  const { user, loading } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [filters, setFilters] = useState<SearchFilters>({
    filter: "all",
    searchTerm: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchParcels = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      let parcelData = await receiverApiService.fetchParcels(user.email);

      // Enhance with mock data for demo
      parcelData = receiverUtils.enhanceParcelsWithMockData(parcelData);

      setParcels(parcelData);
      setStats(receiverUtils.calculateStats(parcelData));
    } catch (error) {
      console.error("Error fetching parcels:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch parcels";
      const statusCode = (error as { response?: { status?: number } })?.response
        ?.status;
      toast.error(`Error ${statusCode ? `(${statusCode})` : ""}: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchParcels();
    setIsRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  const handleConfirmDelivery = async (parcelId: number) => {
    try {
      setIsConfirming(true);
      await receiverApiService.confirmDelivery(parcelId);
      toast.success("Delivery confirmed successfully! 🎉");
      fetchParcels();
      setSelectedParcel(null);
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Failed to confirm delivery");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleExportParcels = () => {
    const filteredParcels = receiverUtils.filterAndSortParcels(
      parcels,
      filters
    );
    const csvData = receiverUtils.generateExportData(filteredParcels);
    receiverUtils.downloadCSV(
      csvData,
      `parcels_${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Parcels exported successfully!");
  };

  useEffect(() => {
    if (!loading && user) {
      fetchParcels();
    }
  }, [user, loading, fetchParcels]);

  // Get filtered and sorted parcels
  const filteredParcels = receiverUtils.filterAndSortParcels(parcels, filters);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your parcels...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                Receiver Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                Welcome back,{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={handleExportParcels}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <StatsCards stats={stats} />

        {/* Search and Filters */}
        <SearchAndFilters
          filters={filters}
          stats={stats}
          onSearchChange={(searchTerm) =>
            setFilters((prev) => ({ ...prev, searchTerm }))
          }
          onFilterChange={(filter) =>
            setFilters((prev) => ({ ...prev, filter }))
          }
          onSortChange={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))}
          onSortOrderChange={(sortOrder) =>
            setFilters((prev) => ({ ...prev, sortOrder }))
          }
        />

        {/* Parcels List */}
        <ParcelList
          parcels={filteredParcels}
          onViewDetails={setSelectedParcel}
          onConfirmDelivery={handleConfirmDelivery}
          isConfirming={isConfirming}
        />

        {/* Parcel Details Modal */}
        <ParcelDetailsModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
          onConfirmDelivery={handleConfirmDelivery}
          isConfirming={isConfirming}
        />
      </div>
    </div>
  );
}
