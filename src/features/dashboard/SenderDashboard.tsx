"use client";

import { BarChart3, Calendar, Eye, Package, Plus, RefreshCw, Truck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import { getStatusColor } from "../../utils/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "../../pages/public/sections/FooterSection";
import ParcelDetailsModal from "../../components/modals/ParcelDetailsModal";
import { useGetSenderParcelsQuery } from "../../store/api/senderApi";
import SenderParcelPieChart from "../../pages/sender/components/SenderParcelPieChart";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderDashboard() {
  const { user } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: parcels = [], 
    isLoading, 
    isFetching,
    refetch 
  } = useGetSenderParcelsQuery(undefined, {
    
    refetchOnFocus: false,
    
    refetchOnMountOrArgChange: false,
    
    refetchOnReconnect: true,
  });

  const handleViewParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
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
    cancelled: parcels.filter((p) => p.currentStatus === "cancelled").length,
  };

  if (isLoading && parcels.length === 0) {
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
      <div className="min-h-screen bg-background mt-8 sm:mt-10">
        <div className="max-w-7xl mx-auto pt-2 sm:pt-3 px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8 space-y-4 sm:space-y-5 lg:space-y-6 pb-20 sm:pb-24">
          {}
          <div className="bg-gradient-to-r from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-950/20 dark:to-green-950/20 border border-border rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-8 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-green-50/70 dark:hover:from-blue-950/30 dark:hover:to-green-950/30">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Dashboard Overview
                </h1>
                <p className="text-muted-foreground text-xs xs:text-sm sm:text-base lg:text-lg">
                  Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here's your delivery overview.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300 flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-blue-600 transition-colors duration-300 mb-0.5 sm:mb-1">
                    Total Parcels
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                    {stats.total}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                    Updated with {stats.total} parcels
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-yellow-300 dark:hover:border-yellow-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg sm:rounded-xl group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 transition-colors duration-300 flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-0.5 sm:mb-1">
                    Pending
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-yellow-600 transition-colors duration-300">
                    {stats.pending}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium mt-1">
                    {stats.pending} awaiting action
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg sm:rounded-xl group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-300 flex-shrink-0">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-purple-600 transition-colors duration-300 mb-0.5 sm:mb-1">
                    In Transit
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
                    {stats.inTransit}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium mt-1">
                    {stats.inTransit} on the way
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg sm:rounded-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-300 flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-green-600 transition-colors duration-300 mb-0.5 sm:mb-1">
                    Delivered
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">
                    {stats.delivered}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
                  </p>
                </div>
              </div>
            </div>

            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-red-300 dark:hover:border-red-700 hover:scale-[1.03] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-red-50 dark:bg-red-950/20 rounded-lg sm:rounded-xl group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-300 flex-shrink-0">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-red-600 transition-colors duration-300 mb-0.5 sm:mb-1">
                    Cancelled
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-red-600 transition-colors duration-300">
                    {stats.cancelled}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                    {stats.cancelled} parcel{stats.cancelled !== 1 ? 's' : ''} cancelled
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pie Chart Section */}
          <SenderParcelPieChart parcels={parcels} />

          {}
          <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 xl:p-8 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
            <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-4 sm:mb-5 lg:mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              <Link
                to="/sender/create-parcel"
                className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/20 border border-border rounded-lg sm:rounded-xl hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:scale-[1.03] transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300 flex-shrink-0">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-300 text-sm xs:text-base sm:text-lg mb-0.5 sm:mb-1">
                      Create New Parcel
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover:text-blue-500 transition-colors duration-300">
                      Start a new delivery request
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/sender/parcels"
                className="p-4 sm:p-5 bg-gradient-to-r from-green-50/50 via-transparent to-green-50/50 dark:from-green-950/20 dark:to-green-950/20 border border-border rounded-lg sm:rounded-xl hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 hover:scale-[1.03] transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-green-50 dark:bg-green-950/20 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-all duration-300 flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-green-600 transition-colors duration-300 text-sm xs:text-base sm:text-lg mb-0.5 sm:mb-1">
                      View My Parcels
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover:text-green-500 transition-colors duration-300">
                      Manage your deliveries
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/sender/statistics"
                className="p-4 sm:p-5 bg-gradient-to-r from-purple-50/50 via-transparent to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/20 border border-border rounded-lg sm:rounded-xl hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 hover:scale-[1.03] transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all duration-300 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-purple-600 transition-colors duration-300 text-sm xs:text-base sm:text-lg mb-0.5 sm:mb-1">
                      View Statistics
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover:text-purple-500 transition-colors duration-300">
                      Delivery analytics
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {}
          <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-border hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
            <div className="p-4 sm:p-5 lg:p-6 xl:p-8 border-b border-border">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                  Recent Parcels
                </h2>
                <Link
                  to="/sender/parcels"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:scale-105 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs xs:text-sm sm:text-base whitespace-nowrap"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
              {parcels.slice(0, 3).length === 0 ? (
                <div className="text-center py-8 sm:py-10 lg:py-12 hover:bg-muted/20 rounded-lg sm:rounded-xl transition-colors duration-300">
                  <Package className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-muted-foreground mb-4 sm:mb-5 hover:scale-110 hover:text-blue-600 transition-all duration-300" />
                  <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                    No parcels yet
                  </h3>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-xs xs:text-sm sm:text-base px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
                    Start by creating your first parcel delivery request.
                  </p>
                  <Link
                    to="/sender/create-parcel"
                    className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:shadow-xl hover:scale-105 text-white px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 inline-flex items-center group text-xs xs:text-sm sm:text-base"
                  >
                    <Plus className="mr-2 sm:mr-2.5 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                    Create Parcel
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {parcels.slice(0, 3).map((parcel) => (
                    <div
                      key={parcel._id}
                      className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 p-3 xs:p-4 sm:p-5 bg-muted/30 rounded-lg sm:rounded-xl hover:bg-muted/50 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 w-full xs:w-auto">
                        <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300 flex-shrink-0">
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-300 text-xs xs:text-sm sm:text-base lg:text-lg truncate">
                            {parcel.trackingId}
                          </h4>
                          <p className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover:text-blue-500 transition-colors duration-300 truncate">
                            To: {parcel.receiverInfo.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 w-full xs:w-auto justify-between xs:justify-end">
                        <span
                          className={`inline-flex items-center px-2.5 xs:px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs xs:text-sm font-medium ${getStatusColor(
                            parcel.currentStatus
                          )} group-hover:scale-105 transition-transform duration-300 whitespace-nowrap`}
                        >
                          {parcel.currentStatus.replace("-", " ").toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleViewParcel(parcel)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-200 p-2 sm:p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-110 group/btn flex-shrink-0"
                          title="View Parcel Details"
                        >
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:scale-110 transition-transform duration-300" />
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

      {}
      <ParcelDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parcel={selectedParcel}
      />
    </ProtectedRoute>
  );
}

