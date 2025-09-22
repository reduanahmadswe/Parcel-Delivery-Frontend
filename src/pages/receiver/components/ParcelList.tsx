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
  onConfirmDelivery: (parcelId: number) => void;
  isConfirming: boolean;
  // Pagination props
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
  // Pagination handlers
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            Your Parcels
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No parcels found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5" />
          Your Parcels
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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
        {/* Loading indicator */}
        {loading && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            <span>Loading parcels...</span>
          </div>
        )}
      </div>

      <div
        className="divide-y divide-gray-200 dark:divide-gray-700"
        style={{
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {parcels.map((parcel, index) => (
          <div
            key={parcel._id}
            className={`px-6 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
              index % 2 === 0 ? "bg-gray-50/30 dark:bg-gray-800/30" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                        #{parcel.trackingId}
                      </h3>
                      <StatusBadge status={parcel.currentStatus} />
                      {(parcel as any).isInsured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          <Shield className="w-3 h-3" />
                          Insured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3 text-base">
                      {parcel.parcelDetails.description}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">From:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {parcel.senderInfo.name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Package className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Weight:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {parcel.parcelDetails.weight}kg
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="text-lg mr-2">💰</span>
                        <span className="font-medium">Cost:</span>
                        <span className="ml-1 text-gray-900 dark:text-white font-bold">
                          ${parcel.fee.totalFee}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="font-medium">Created:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {(parcel as any).estimatedDelivery &&
                      parcel.currentStatus !== "delivered" && (
                        <div className="mt-3 flex items-center text-sm text-orange-600 dark:text-orange-400">
                          <Truck className="h-4 w-4 mr-2" />
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
                        <div className="mt-3">
                          <RatingStars rating={(parcel as any).rating} />
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        console.log(
                          "Details button clicked for parcel:",
                          parcel
                        );
                        onViewDetails(parcel);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    {parcel.currentStatus === "in-transit" && (
                      <button
                        onClick={() => onConfirmDelivery(parseInt(parcel._id))}
                        disabled={isConfirming}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 ${
                          parcel.currentStatus === "in-transit"
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isConfirming
                          ? "Confirming..."
                          : parcel.currentStatus === "in-transit"
                          ? "Confirm Delivery"
                          : "Prepare for Delivery"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {parcels.length > 0 && pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage || loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  pagination.hasPrevPage && !loading
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                    : "bg-gray-100/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                {pagination.currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={loading}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      1
                    </button>
                    {pagination.currentPage > 4 && (
                      <span className="px-2 py-2 text-gray-400 dark:text-gray-500">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* Current page and surrounding pages */}
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        page === pagination.currentPage
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                      } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {page}
                    </button>
                  ))}

                {/* Last page */}
                {pagination.currentPage < pagination.totalPages - 2 && (
                  <>
                    {pagination.currentPage < pagination.totalPages - 3 && (
                      <span className="px-2 py-2 text-gray-400 dark:text-gray-500">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={loading}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage || loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  pagination.hasNextPage && !loading
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                    : "bg-gray-100/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelList;
