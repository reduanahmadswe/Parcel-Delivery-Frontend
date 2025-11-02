import { BarChart3, Calendar, Package, Truck, XCircle } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import { useGetSenderParcelsQuery } from "../../store/api/senderApi";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "../public/sections/FooterSection";
import { invalidateRelatedCaches } from "../../utils/adminCache";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SenderStatisticsPage() {
  const { user } = useAuth();
  const { data: parcelsData, refetch: refetchParcels, isLoading: parcelsLoading } = useGetSenderParcelsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: true,
  });

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isBackgroundRefresh, setIsBackgroundRefresh] = useState(false);
  const isMountedRef = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleCacheInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; timestamp: number }>;
      const { key } = customEvent.detail;

      if (key === 'SENDER_STATISTICS' || key === 'SENDER_DASHBOARD' || key === 'MY_LIST' || key.includes('sender:parcels:')) {
        refetchParcels();
      }
    };

    window.addEventListener('cache-invalidated', handleCacheInvalidation);

    return () => {
      window.removeEventListener('cache-invalidated', handleCacheInvalidation);
    };
  }, [refetchParcels]);

  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      refetchParcels();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refetchParcels]);

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
  }, [refetchParcels]);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      refetchParcels();
    }
  }, [refetchParcels]);

  useEffect(() => {
    if (parcelsLoading && !parcelsData) {
      setLoading(true);
      return;
    }

    try {
      const list = Array.isArray(parcelsData) ? parcelsData : [];
      setParcels(list);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setIsBackgroundRefresh(false);
    }
  }, [parcelsData, parcelsLoading]);

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
    
    requested: parcels.filter((p) => p.currentStatus === "requested").length,
  };

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
      <div className="min-h-screen bg-background mt-8 sm:mt-10 lg:mt-11">
        <div className="max-w-7xl mx-auto pt-2 sm:pt-3 px-3 xs:px-4 sm:px-5 lg:px-6 xl:px-8 space-y-4 sm:space-y-5 lg:space-y-6 pb-20 sm:pb-24">
          {}
          <div className="bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border border-border rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Statistics & Analytics
                </h1>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
                  Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>! Here's your current parcel
                  analytics and insights.
                </p>
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm">
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    {stats.total} Total
                  </span>
                  <span className="inline-flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    {stats.total > 0
                      ? Math.round((stats.delivered / stats.total) * 100)
                      : 0}
                    % Success
                  </span>
                  {stats.pending + stats.inTransit > 0 && (
                    <span className="inline-flex items-center text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                      {stats.pending + stats.inTransit} Active
                    </span>
                  )}
                  {stats.cancelled > 0 && (
                    <span className="inline-flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                      {stats.cancelled} Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-background rounded-lg shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50/20 hover:to-purple-50/20 dark:hover:from-blue-950/10 dark:hover:to-purple-950/10">
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5 lg:mb-6 flex items-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              Current Overview
              <span className="ml-2 inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] xs:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Live Data
              </span>
            </h2>
            
            {}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
              {}
              <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg sm:rounded-xl transition-colors duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground mb-0.5 sm:mb-1">
                      Total Parcels
                    </p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {stats.total}
                    </p>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-blue-600 font-medium mt-0.5 sm:mt-1">
                      {stats.total > 0
                        ? `Updated with ${stats.total} parcels`
                        : "No parcels yet"}
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-yellow-50/50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg sm:rounded-xl transition-colors duration-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground mb-0.5 sm:mb-1">
                      Pending
                    </p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {stats.pending}
                    </p>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-yellow-600 font-medium mt-0.5 sm:mt-1">
                      {stats.pending > 0
                        ? `${stats.pending} awaiting action`
                        : "All processed"}
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-lg sm:rounded-xl transition-colors duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex-shrink-0">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground mb-0.5 sm:mb-1">
                      In Transit
                    </p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {stats.inTransit}
                    </p>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-purple-600 font-medium mt-0.5 sm:mt-1">
                      {stats.inTransit > 0
                        ? `${stats.inTransit} on the way`
                        : "None in transit"}
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 bg-green-50 dark:bg-green-950/20 rounded-lg sm:rounded-xl transition-colors duration-300 hover:bg-green-100 dark:hover:bg-green-900/30 flex-shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground mb-0.5 sm:mb-1">
                      Delivered
                    </p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {stats.delivered}
                    </p>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-green-600 font-medium mt-0.5 sm:mt-1">
                      {stats.delivered > 0
                        ? `${Math.round(
                            (stats.delivered / stats.total) * 100
                          )}% success rate`
                        : "No deliveries yet"}
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-[1.03] hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 bg-red-50 dark:bg-red-950/20 rounded-lg sm:rounded-xl transition-colors duration-300 hover:bg-red-100 dark:hover:bg-red-900/30 flex-shrink-0">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground mb-0.5 sm:mb-1">
                      Cancelled
                    </p>
                    <p className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {stats.cancelled}
                    </p>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-red-600 font-medium mt-0.5 sm:mt-1">
                      {stats.cancelled > 0
                        ? `${stats.cancelled} parcel${stats.cancelled !== 1 ? 's' : ''} cancelled`
                        : "No cancellations"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-green-600 transition-colors duration-300 mb-1">
                    Success Rate
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">
                    {stats.total > 0
                      ? Math.round((stats.delivered / stats.total) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-green-50 dark:bg-green-950/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-all duration-300 flex-shrink-0">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-orange-600 transition-colors duration-300 mb-1">
                    Active Parcels
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground group-hover:text-orange-600 transition-colors duration-300">
                    {stats.pending + stats.inTransit}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-orange-50 dark:bg-orange-950/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all duration-300 flex-shrink-0">
                  <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-blue-600 transition-colors duration-300 mb-1">
                    This Month
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300 flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-xs xs:text-sm sm:text-base font-medium text-muted-foreground group-hover:text-purple-600 transition-colors duration-300 mb-1">
                    Total Spent
                  </p>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300 truncate">
                    ৳
                    {parcels
                      .reduce(
                        (total, parcel) => total + (parcel.fee?.totalFee || 0),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all duration-300 flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Status Distribution
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm sm:text-base text-foreground truncate">Requested</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <span className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium">
                      {stats.requested}
                    </span>
                    <div className="w-16 xs:w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
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

                <div className="flex items-center justify-between hover:bg-yellow-50/50 dark:hover:bg-yellow-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm sm:text-base text-foreground truncate">In Transit</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <span className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium">
                      {stats.inTransit}
                    </span>
                    <div className="w-16 xs:w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
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

                <div className="flex items-center justify-between hover:bg-green-50/50 dark:hover:bg-green-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></div>
                    <span className="text-xs xs:text-sm sm:text-base text-foreground truncate">Delivered</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <span className="text-xs xs:text-sm sm:text-base text-muted-foreground font-medium">
                      {stats.delivered}
                    </span>
                    <div className="w-16 xs:w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
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

            {}
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Monthly Overview
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300 group/item">
                  <span className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Parcels this month
                  </span>
                  <span className="text-base xs:text-lg sm:text-xl font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    {
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300 group/item">
                  <span className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Average per week
                  </span>
                  <span className="text-base xs:text-lg sm:text-xl font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    {Math.round(
                      parcels.filter(
                        (p) =>
                          new Date(p.createdAt).getMonth() ===
                          new Date().getMonth()
                      ).length / 4
                    )}
                  </span>
                </div>
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center hover:bg-purple-50/50 dark:hover:bg-purple-950/20 p-2 sm:p-3 rounded-lg transition-all duration-300 group/item gap-1 xs:gap-0">
                  <span className="text-xs xs:text-sm sm:text-base text-muted-foreground group-hover/item:text-purple-600 transition-colors duration-300">
                    Total revenue this month
                  </span>
                  <span className="text-base xs:text-lg sm:text-xl font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-300 truncate">
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

          {}
          {stats.total === 0 && (
            <div className="bg-background rounded-lg sm:rounded-xl shadow-sm border border-border p-6 sm:p-8 lg:p-10 text-center hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
              <BarChart3 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-muted-foreground mb-3 sm:mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors duration-300">
                No statistics available
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-4 group-hover:text-blue-500 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
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

