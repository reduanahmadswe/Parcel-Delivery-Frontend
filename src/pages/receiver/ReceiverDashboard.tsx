"use client";

import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Download, Package, RefreshCw, Truck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Parcel } from "@/types/GlobalTypeDefinitions";
import { receiverApiService } from "./services/receiverApi";
import { SearchFilters } from "./types";
import { receiverUtils } from "./utils/receiverUtils";

import ParcelDetailsModal from "./components/ParcelDetailsModal";
import ParcelList from "./components/ParcelList";
import SearchAndFilters from "./components/SearchAndFilters";
import StatsCards from "./components/StatsCards";
import FooterSection from "../public/sections/FooterSection";

export default function ReceiverDashboard() {
  const { user, loading } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    thisMonth: 0,
    averagePerWeek: 0,
    successRate: 0,
    totalValue: 0,
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [itemsPerPage] = useState(5);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Refetch when filters change
  useEffect(() => {
    if (currentPage === 1) {
      fetchParcels(1);
    } else {
      setCurrentPage(1);
    }
  }, [filters.filter, debouncedSearchTerm]);

  const fetchParcels = useCallback(
    async (page: number = 1) => {
      if (!user?.email) return;

      try {
        setIsLoading(true);

        // First, get ALL parcels for accurate statistics (like sender does)
        const allParcels = await receiverApiService.fetchAllParcels(user.email);

        // Calculate statistics from ALL parcels
        const enhancedAllParcels =
          receiverUtils.enhanceParcelsWithMockData(allParcels);
        setStats(receiverUtils.calculateStats(enhancedAllParcels));

        // Then get paginated data for display
        const filterStatus =
          filters.filter === "all" ? undefined : filters.filter;
        const searchTerm = debouncedSearchTerm || undefined;

        const result = await receiverApiService.fetchParcels(
          user.email,
          page,
          itemsPerPage,
          filterStatus,
          searchTerm
        );

        // Enhance with mock data for demo
        const enhancedParcels = receiverUtils.enhanceParcelsWithMockData(
          result.parcels
        );

        setParcels(enhancedParcels);
        setPagination(result.pagination);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to fetch parcels";
        const statusCode = (error as { response?: { status?: number } })
          ?.response?.status;
        toast.error(
          `Error ${statusCode ? `(${statusCode})` : ""}: ${errorMsg}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user?.email, filters.filter, debouncedSearchTerm, itemsPerPage]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      fetchParcels(newPage);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchParcels(currentPage);
    setIsRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  const handleConfirmDelivery = async (parcelId: string, note?: string) => {
    try {
      setIsConfirming(true);
      await receiverApiService.confirmDelivery(parcelId, note);
      toast.success("Delivery confirmed successfully! 🎉");

      // Only refresh data and close modal on success
      await fetchParcels(currentPage);
      setSelectedParcel(null);
    } catch (error: any) {
      // Show specific error message if available
      const errorMessage = error.message || "Failed to confirm delivery";
      toast.error(errorMessage);

      // Keep the modal open and don't refresh data on error so user can retry
    } finally {
      setIsConfirming(false);
    }
  };

  const handleExportParcels = () => {
    const csvData = receiverUtils.generateExportData(parcels);
    receiverUtils.downloadCSV(
      csvData,
      `parcels_${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Parcels exported successfully!");
  };

  useEffect(() => {
    if (!loading && user) {
      fetchParcels(1);
    }
  }, [user, loading, fetchParcels]);

  // Since we're using server-side pagination, we don't need client-side filtering
  const displayParcels = parcels;

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
          <div className="bg-gradient-to-r from-red-50/50 via-transparent to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                  Receiver Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                  ! Here are your received parcels and delivery tracking
                  information.
                </p>
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400">
                    <Package className="h-4 w-4 mr-1" />
                    {stats.total} Total Received
                  </span>
                  <span className="inline-flex items-center text-green-600 dark:text-green-400">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {stats.successRate}% Delivery Rate
                  </span>
                  {stats.pending + stats.inTransit > 0 && (
                    <span className="inline-flex items-center text-orange-600 dark:text-orange-400">
                      <Truck className="h-4 w-4 mr-1" />
                      {stats.pending + stats.inTransit} Incoming
                    </span>
                  )}
                </div>
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
        </div>

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
          parcels={displayParcels}
          onViewDetails={(parcel) => {
            setSelectedParcel(parcel);
          }}
          onConfirmDelivery={handleConfirmDelivery}
          isConfirming={isConfirming}
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={isLoading}
          searchTerm={filters.searchTerm}
        />

        {/* Empty State */}
        {stats.total === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group mb-6">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
              No parcels received yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 group-hover:text-blue-500 transition-colors duration-300">
              When someone sends you a parcel, it will appear here with all the
              tracking details and delivery information.
            </p>
          </div>
        )}

        {/* Parcel Details Modal */}
        <ParcelDetailsModal
          parcel={selectedParcel}
          onClose={() => {
            setSelectedParcel(null);
          }}
          onConfirmDelivery={handleConfirmDelivery}
          isConfirming={isConfirming}
        />
      </div>
      {/* Footer */}
      <FooterSection />
    </div>
  );
}

