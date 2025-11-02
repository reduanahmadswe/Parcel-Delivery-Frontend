import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
// use RTK Query for server state
import { useGetSenderParcelsQuery, useCancelParcelMutation } from "../../store/api/senderApi";
import { formatDate, getStatusColor } from "../../utils/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "../public/sections/FooterSection";
import ParcelDetailsModal from "../../components/modals/ParcelDetailsModal";
import { invalidateRelatedCaches } from "../../utils/adminCache";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function SenderParcelsPage() {
  const { user } = useAuth();

  // RTK Query hooks for sender parcels
  const { data: parcelsData, refetch: refetchParcels, isLoading: parcelsLoading } = useGetSenderParcelsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: true,
  });
  const [cancelParcel] = useCancelParcelMutation();

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isBackgroundRefresh, setIsBackgroundRefresh] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [parcelToCancel, setParcelToCancel] = useState<Parcel | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const handleCacheInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; timestamp: number }>;
      const { key } = customEvent.detail;

      if (key.includes('sender:parcels:') || key === 'SENDER_DASHBOARD') {
        refetchParcels();
      }
    };

    window.addEventListener('cache-invalidated', handleCacheInvalidation);

    return () => {
      window.removeEventListener('cache-invalidated', handleCacheInvalidation);
    };
  }, [currentPage]);

  useEffect(() => {
    
    pollingIntervalRef.current = setInterval(() => {
      refetchParcels();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentPage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchParcels();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPage]);

  useEffect(() => {
    // initial fetch on mount or when page changes (we always refetch to keep data fresh)
    refetchParcels();
  }, [currentPage, refetchParcels]);

  useEffect(() => {
    const saved = localStorage.getItem("recentParcelSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage === 1) {
      refetchParcels();
    } else {
      setCurrentPage(1); 
    }
  }, [filterStatus, debouncedSearchTerm]);

  // Map RTK Query data to local state and compute pagination client-side.
  useEffect(() => {
    if (parcelsLoading && !parcelsData) {
      setLoading(true);
      return;
    }

    try {
      const list = Array.isArray(parcelsData) ? parcelsData : [];
      setParcels(list);

      const totalItems = list.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
      const paginationInfo: PaginationInfo = {
        currentPage: Math.min(currentPage, totalPages),
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      };

      setPagination(paginationInfo);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setIsBackgroundRefresh(false);
    }
  }, [parcelsData, parcelsLoading, itemsPerPage, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleViewParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
  };

  const handleCancelClick = (parcel: Parcel) => {
    setParcelToCancel(parcel);
    setCancelReason("");
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!parcelToCancel) return;

    try {
  setIsCancelling(true);
  await cancelParcel({ id: parcelToCancel._id, reason: cancelReason }).unwrap();
      toast.success("Parcel cancelled successfully");
      setIsCancelDialogOpen(false);
      setParcelToCancel(null);
      setCancelReason("");

      invalidateRelatedCaches('sender-parcel');

      await refetchParcels();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to cancel parcel. It may have already been dispatched.";
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelDialogClose = () => {
    if (!isCancelling) {
      setIsCancelDialogOpen(false);
      setParcelToCancel(null);
      setCancelReason("");
    }
  };

  const canCancelParcel = (parcel: Parcel) => {
    const cancellableStatuses = ["requested", "approved"];
    return cancellableStatuses.includes(parcel.currentStatus.toLowerCase());
  };

  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;

    const newRecentSearches = [
      term,
      ...recentSearches.filter((search) => search !== term),
    ].slice(0, 5); 

    setRecentSearches(newRecentSearches);
    localStorage.setItem(
      "recentParcelSearches",
      JSON.stringify(newRecentSearches)
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.length > 0 || recentSearches.length > 0) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSearchSuggestions(false);
    addToRecentSearches(suggestion);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchSuggestions(false);
    }, 200);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addToRecentSearches(searchTerm.trim());
      setShowSearchSuggestions(false);
    }
  };

  const getSearchSuggestions = () => {
    if (!searchTerm) return recentSearches;

    const filteredRecent = recentSearches.filter((search) =>
      search.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const parcelSuggestions = parcels.reduce((acc: string[], parcel) => {
      const suggestions = [
        parcel.trackingId,
        parcel.receiverInfo?.name,
        parcel.receiverInfo?.address?.city,
        parcel.currentStatus,
        parcel.parcelDetails?.type,
      ].filter(Boolean); 

      suggestions.forEach((suggestion) => {
        if (
          suggestion?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !acc.includes(suggestion) &&
          !filteredRecent.includes(suggestion)
        ) {
          acc.push(suggestion);
        }
      });

      return acc;
    }, []);

    return [...filteredRecent, ...parcelSuggestions].slice(0, 5);
  };

  const filteredParcels = useMemo(() => {
    const list = parcels ?? [];
    const searchLower = (debouncedSearchTerm || "").toLowerCase().trim();

    return list.filter((parcel) => {
      if (filterStatus && parcel.currentStatus?.toLowerCase() !== filterStatus.toLowerCase()) return false;

      if (!searchLower) return true;

      const searchFields = [
        parcel.trackingId,
        parcel.receiverInfo?.name,
        parcel.receiverInfo?.phone,
        parcel.receiverInfo?.email,
        parcel.receiverInfo?.address?.city,
        parcel.receiverInfo?.address?.state,
        parcel.receiverInfo?.address?.street,
        parcel.receiverInfo?.address?.zipCode,
        parcel.senderInfo?.name,
        parcel.senderInfo?.phone,
        parcel.senderInfo?.email,
        parcel.currentStatus,
        parcel.parcelDetails?.type,
        parcel.parcelDetails?.description,
        parcel.fee?.totalFee?.toString(),
      ].filter(Boolean);

      return searchFields.some((field) => field?.toString().toLowerCase().includes(searchLower));
    });
  }, [parcels, debouncedSearchTerm, filterStatus]);

  const displayParcels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredParcels.slice(start, start + itemsPerPage);
  }, [filteredParcels, currentPage, itemsPerPage]);

  if (loading && initialLoading) {
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
        <div className="max-w-7xl mx-auto pt-2 px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6 pb-24">
          {}
          <div className="bg-gradient-to-r from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 border border-border rounded-xl p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  My Parcels
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                  Manage and track all your parcel deliveries
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-background rounded-lg shadow-sm border border-border p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                  <input
                    type="text"
                    placeholder="Search by tracking ID, receiver name, phone, email, city, status..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() =>
                      setShowSearchSuggestions(
                        searchTerm.length > 0 || recentSearches.length > 0
                      )
                    }
                    onBlur={handleSearchBlur}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground text-xs sm:text-sm"
                  />
                  {}
                  {searchTerm !== debouncedSearchTerm && (
                    <div className="absolute right-7 sm:right-8 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {}
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setShowSearchSuggestions(false);
                      }}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      title="Clear search"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  )}

                  {}
                  {showSearchSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {getSearchSuggestions().length > 0 ? (
                        <>
                          {!searchTerm && recentSearches.length > 0 && (
                            <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-muted-foreground border-b border-border">
                              Recent Searches
                            </div>
                          )}
                          {getSearchSuggestions().map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left hover:bg-muted/50 transition-colors duration-200 flex items-center space-x-1.5 sm:space-x-2"
                            >
                              <Search className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-foreground truncate">
                                {suggestion}
                              </span>
                              {recentSearches.includes(suggestion) && (
                                <span className="text-[10px] sm:text-xs text-muted-foreground ml-auto whitespace-nowrap">
                                  recent
                                </span>
                              )}
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground text-center">
                          No suggestions found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground text-xs sm:text-sm"
                >
                  <option value="">All Status</option>
                  <option value="requested">Requested</option>
                  <option value="approved">Approved</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                    setCurrentPage(1);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 to-br from-red-600 to-red-600 dark:from-red-800 dark:to-red-700 hover:shadow-lg text-white dark:text-white rounded-lg transition-all duration-300 flex items-center justify-center text-xs sm:text-sm whitespace-nowrap"
                >
                  <Filter className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="bg-background rounded-lg shadow-sm border border-border">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-border">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
                  Parcels ({displayParcels.length}
                  {searchTerm &&
                    displayParcels.length !== pagination.totalItems &&
                    ` of ${pagination.totalItems}`}
                  )
                  {searchTerm && (
                    <span className="text-[10px] xs:text-xs sm:text-sm font-normal text-muted-foreground ml-2 block xs:inline">
                      - filtered by "{searchTerm}"
                    </span>
                  )}
                </h2>
                <Link
                  to="/sender/create-parcel"
                  className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:shadow-lg text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center text-xs sm:text-sm whitespace-nowrap"
                >
                  <Plus className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Create Parcel
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {displayParcels.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-3 sm:px-6">
                  <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
                    {searchTerm || filterStatus
                      ? "No matching parcels found"
                      : "No parcels yet"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {searchTerm || filterStatus
                      ? "Try adjusting your search or filter criteria."
                      : "Start by creating your first parcel delivery request."}
                  </p>
                  {!searchTerm && !filterStatus && (
                    <Link
                      to="/sender/create-parcel"
                      className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:shadow-lg text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center text-xs sm:text-sm"
                    >
                      <Plus className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Create Your First Parcel
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {}
                  {loading && (
                    <div className="px-3 sm:px-6 py-2 border-b border-border">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
                        <span>Loading parcels...</span>
                      </div>
                    </div>
                  )}

                  {}
                  <table
                    className="w-full hidden md:table"
                    style={{
                      opacity: loading ? 0.6 : 1,
                      transition: "opacity 0.2s ease-in-out",
                    }}
                  >
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Tracking ID
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Receiver
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Fee
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {displayParcels.map((parcel) => (
                        <tr
                          key={parcel._id}
                          className="hover:bg-muted/30 transition-colors duration-200"
                        >
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                                  <Package className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
                                </div>
                              </div>
                              <div className="ml-3 lg:ml-4">
                                <div className="text-xs lg:text-sm font-medium text-foreground">
                                  {parcel.trackingId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs lg:text-sm text-foreground">
                              {parcel.receiverInfo.name}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground">
                              {parcel.receiverInfo.phone}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs lg:text-sm text-foreground">
                              {parcel.receiverInfo.address.city}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 lg:px-2.5 py-0.5 rounded-full text-[10px] lg:text-xs font-medium ${getStatusColor(
                                parcel.currentStatus
                              )}`}
                            >
                              {parcel.currentStatus
                                .replace("-", " ")
                                .toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-foreground">
                            ৳{parcel.fee?.totalFee || 0}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-muted-foreground">
                            {formatDate(parcel.createdAt)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                            <div className="flex items-center space-x-2 lg:space-x-3">
                              <button
                                onClick={() => handleViewParcel(parcel)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                title="View parcel details"
                              >
                                <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                              </button>
                              <Link
                                to={`/status-history?id=${parcel.trackingId}`}
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                                title="View status history"
                                onClick={() => {}}
                              >
                                <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
                              </Link>
                              {canCancelParcel(parcel) && (
                                <button
                                  onClick={() => handleCancelClick(parcel)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Cancel parcel"
                                >
                                  <XCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {}
                  <div className="md:hidden divide-y divide-border"
                    style={{
                      opacity: loading ? 0.6 : 1,
                      transition: "opacity 0.2s ease-in-out",
                    }}
                  >
                    {displayParcels.map((parcel) => (
                      <div
                        key={parcel._id}
                        className="p-3 sm:p-4 hover:bg-muted/30 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                                <Package className="h-5 w-5 text-red-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium text-foreground truncate">
                                {parcel.trackingId}
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${getStatusColor(
                                  parcel.currentStatus
                                )}`}
                              >
                                {parcel.currentStatus
                                  .replace("-", " ")
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleViewParcel(parcel)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="View parcel details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link
                              to={`/status-history?id=${parcel.trackingId}`}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200 p-1.5 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                              title="View status history"
                              onClick={() => {}}
                            >
                              <Calendar className="h-4 w-4" />
                            </Link>
                            {canCancelParcel(parcel) && (
                              <button
                                onClick={() => handleCancelClick(parcel)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Cancel parcel"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Receiver:</span>
                            <span className="text-foreground font-medium truncate ml-2">
                              {parcel.receiverInfo.name}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="text-foreground">
                              {parcel.receiverInfo.phone}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Destination:</span>
                            <span className="text-foreground">
                              {parcel.receiverInfo.address.city}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Fee:</span>
                            <span className="text-foreground font-medium">
                              ৳{parcel.fee?.totalFee || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-foreground">
                              {formatDate(parcel.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {}
            {displayParcels.length > 0 && pagination.totalPages > 1 && (
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-border">
                <div className="flex flex-col xs:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground order-2 xs:order-1">
                    <span>
                      Showing {(currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                      to{" "}
                      {Math.min(
                        currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      of {pagination.totalItems} results
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 sm:space-x-2 order-1 xs:order-2">
                    {}
                    <button
                      onClick={handlePrevPage}
                      disabled={!pagination.hasPrevPage || loading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                        pagination.hasPrevPage && !loading
                          ? "bg-muted hover:bg-muted/80 text-foreground"
                          : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Previous</span>
                    </button>

                    {}
                    <div className="flex items-center space-x-1">
                      {}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-1 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {}
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      )
                        .filter(
                          (page) =>
                            page >= Math.max(1, currentPage - 2) &&
                            page <=
                              Math.min(pagination.totalPages, currentPage + 2)
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                              page === currentPage
                                ? "bg-red-600 text-white"
                                : "bg-muted hover:bg-muted/80 text-foreground"
                            } ${
                              loading ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                      {}
                      {currentPage < pagination.totalPages - 2 && (
                        <>
                          {currentPage < pagination.totalPages - 3 && (
                            <span className="px-1 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() =>
                              handlePageChange(pagination.totalPages)
                            }
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {}
                    <button
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage || loading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                        pagination.hasNextPage && !loading
                          ? "bg-muted hover:bg-muted/80 text-foreground"
                          : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />

      {}
      <ParcelDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parcel={selectedParcel}
      />

      {}
      {isCancelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Cancel Parcel
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to cancel this parcel? This action cannot be undone.
            </p>
            
            {parcelToCancel && (
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Tracking ID</p>
                <p className="text-sm font-medium text-foreground">{parcelToCancel.trackingId}</p>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Receiver</p>
                <p className="text-sm text-foreground">{parcelToCancel.receiverInfo.name}</p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="cancelReason" className="block text-sm font-medium text-foreground mb-2">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this parcel..."
                disabled={isCancelling}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDialogClose}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Parcel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

