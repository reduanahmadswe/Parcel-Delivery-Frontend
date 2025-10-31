import useAuth from "../../hooks/useAuth";
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

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

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

        const allParcels = await receiverApiService.fetchAllParcels(user.email);

        const enhancedAllParcels =
          receiverUtils.enhanceParcelsWithMockData(allParcels);
        setStats(receiverUtils.calculateStats(enhancedAllParcels));

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

      await fetchParcels(currentPage);
      setSelectedParcel(null);
    } catch (error: any) {
      
      const errorMessage = error.message || "Failed to confirm delivery";
      toast.error(errorMessage);

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

  const displayParcels = parcels;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Loading your parcels...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-8 sm:mt-10 lg:mt-11">
      <div className="max-w-7xl mx-auto pt-2 sm:pt-3 px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8 space-y-4 sm:space-y-5 lg:space-y-6 pb-20 sm:pb-24">
        {}
        <div className="bg-gradient-to-r from-red-50/50 via-transparent to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 border border-border rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Receiver Dashboard
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here are your received parcels and delivery tracking information.
              </p>
              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm">
                <span className="inline-flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  {stats.total} Total
                </span>
                <span className="inline-flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                  {stats.successRate}% Success
                </span>
                {stats.pending + stats.inTransit > 0 && (
                  <span className="inline-flex items-center text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    {stats.pending + stats.inTransit} Incoming
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-background dark:bg-muted border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-foreground hover:bg-muted disabled:opacity-50 text-xs sm:text-sm"
              >
                <RefreshCw
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline">Refresh</span>
              </button>
              <button
                onClick={handleExportParcels}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {}
        <StatsCards stats={stats} />

        {}
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

        {}
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

        {}
        {stats.total === 0 && (
          <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border p-6 sm:p-8 text-center hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group mb-6">
            <BarChart3 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
              No parcels received yet
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 group-hover:text-blue-500 transition-colors duration-300">
              When someone sends you a parcel, it will appear here with all the
              tracking details and delivery information.
            </p>
          </div>
        )}

        {}
        <ParcelDetailsModal
          parcel={selectedParcel}
          onClose={() => {
            setSelectedParcel(null);
          }}
          onConfirmDelivery={handleConfirmDelivery}
          isConfirming={isConfirming}
        />
      </div>
      {}
      <FooterSection />
    </div>
  );
}

