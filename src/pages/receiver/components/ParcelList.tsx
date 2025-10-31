import { Parcel } from "@/types/GlobalTypeDefinitions";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Shield,
  Truck,
  User,
} from "lucide-react";
import React from "react";
import RatingStars from "./RatingStars";
import StatusBadge from "./StatusBadge";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ParcelListProps {
  parcels: Parcel[];
  onViewDetails: (parcel: Parcel) => void;
  onConfirmDelivery: (parcelId: string, note?: string) => void;
  isConfirming: boolean;
  
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  searchTerm?: string;
}

const ParcelList: React.FC<ParcelListProps> = ({
  parcels,
  onViewDetails,
  onConfirmDelivery,
  isConfirming,
  pagination,
  onPageChange,
  loading = false,
  searchTerm = "",
}) => {
  
  const handlePageChange = (newPage: number) => {
    if (
      onPageChange &&
      pagination &&
      newPage >= 1 &&
      newPage <= pagination.totalPages
    ) {
      onPageChange(newPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrevPage) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      handlePageChange(pagination.currentPage + 1);
    }
  };
  if (parcels.length === 0) {
    return (
      <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            Your Parcels
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">
            No parcels found
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          Your Parcels
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            ({parcels.length}
            {searchTerm &&
              pagination &&
              parcels.length !== pagination.totalItems &&
              ` of ${pagination.totalItems}`}{" "}
            parcels)
            {searchTerm && (
              <span className="ml-2">- filtered by "{searchTerm}"</span>
            )}
          </span>
        </h2>
        {}
        {loading && (
          <div className="mt-2 flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-600"></div>
            <span>Loading parcels...</span>
          </div>
        )}
      </div>

      <div
        className="divide-y divide-border"
        style={{
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {parcels.map((parcel, index) => (
          <div
            key={parcel._id}
            className={`px-3 xs:px-4 sm:px-6 py-4 sm:py-6 hover:bg-muted/50 transition-all duration-200 ${
              index % 2 === 0 ? "bg-muted/30" : ""
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-wrap items-center gap-2 xs:gap-3">
                    <h3 className="text-sm xs:text-base sm:text-lg font-bold text-foreground font-mono">
                      #{parcel.trackingId}
                    </h3>
                    <StatusBadge status={parcel.currentStatus} />
                    {(parcel as any).isInsured && (
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Insured
                      </span>
                    )}
                  </div>

                  <p className="text-foreground text-xs xs:text-sm sm:text-base mb-2">
                    {parcel.parcelDetails.description}
                  </p>

                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-500" />
                      <span className="font-medium">From:</span>
                      <span className="ml-1 text-foreground truncate">
                        {parcel.senderInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-500" />
                      <span className="font-medium">Weight:</span>
                      <span className="ml-1 text-foreground font-bold">
                        {parcel.parcelDetails.weight}kg
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span className="text-base sm:text-lg mr-1.5 sm:mr-2">💰</span>
                      <span className="font-medium">Cost:</span>
                      <span className="ml-1 text-foreground font-bold">
                        ৳{parcel.fee.totalFee}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-500" />
                      <span className="font-medium">Created:</span>
                      <span className="ml-1 text-foreground">
                        {new Date(parcel.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {(parcel as any).estimatedDelivery &&
                    parcel.currentStatus !== "delivered" && (
                      <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                        <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="font-medium">
                          Estimated Delivery:
                        </span>
                        <span className="ml-1">
                          {new Date(
                            (parcel as any).estimatedDelivery
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                  {(parcel as any).rating &&
                    parcel.currentStatus === "delivered" && (
                      <div className="mt-2 sm:mt-3">
                        <RatingStars rating={(parcel as any).rating} />
                      </div>
                    )}
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 lg:ml-4">
                <button
                  onClick={() => {
                    onViewDetails(parcel);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors flex-1 lg:flex-none"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  Details
                </button>
                {parcel.currentStatus === "in-transit" && (
                  <button
                    onClick={() => {
                      onConfirmDelivery(parcel._id);
                    }}
                    disabled={isConfirming}
                    className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex-1 lg:flex-none whitespace-nowrap ${
                      parcel.currentStatus === "in-transit"
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                      {isConfirming
                        ? "Confirming..."
                        : parcel.currentStatus === "in-transit"
                        ? "Confirm Delivery"
                        : "Prepare"}
                    </span>
                    <span className="xs:hidden">
                      {isConfirming ? "..." : "Confirm"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      {parcels.length > 0 && pagination && pagination.totalPages > 1 && (
        <div className="px-3 xs:px-4 sm:px-6 py-3 sm:py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-muted-foreground">
              <span>
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} results
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {}
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage || loading}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  pagination.hasPrevPage && !loading
                    ? "bg-muted hover:bg-muted/80 text-foreground"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </button>

              {}
              <div className="flex items-center gap-1">
                {}
                {pagination.currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                    >
                      1
                    </button>
                    {pagination.currentPage > 4 && (
                      <span className="px-1 sm:px-2 py-1.5 sm:py-2 text-muted-foreground text-xs sm:text-sm">
                        ...
                      </span>
                    )}
                  </>
                )}

                {}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page >= Math.max(1, pagination.currentPage - 2) &&
                      page <=
                        Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 2
                        )
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                        page === pagination.currentPage
                          ? "bg-red-600 text-white"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {page}
                    </button>
                  ))}

                {}
                {pagination.currentPage < pagination.totalPages - 2 && (
                  <>
                    {pagination.currentPage < pagination.totalPages - 3 && (
                      <span className="px-1 sm:px-2 py-1.5 sm:py-2 text-muted-foreground text-xs sm:text-sm">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={loading}
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
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  pagination.hasNextPage && !loading
                    ? "bg-muted hover:bg-muted/80 text-foreground"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                }`}
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Nxt</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelList;

