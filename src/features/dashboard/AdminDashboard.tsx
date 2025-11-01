"use client";

import api from "../../services/ApiConfiguration";

import { CheckCircle, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllUsersQuery, useGetAllParcelsQuery } from "../../store/api/adminApi";

import AdminHeader from "../../pages/admin/components/AdminHeader";
import StatCards from "../../pages/admin/components/StatCards";
import RecentParcelsTable from "../../pages/admin/components/RecentParcelsTable";
import ParcelStatusPieChart from "../../pages/admin/components/ParcelStatusPieChart";

interface DashboardStats {
  users: { total: number; active: number; blocked: number; newThisMonth: number };
  parcels: { 
    total: number; 
    requested: number;
    approved: number;
    dispatched: number;
    pending: number; 
    inTransit: number; 
    delivered: number; 
    cancelled: number;
    returned: number;
    flagged: number; 
    urgent: number;
  };
}

interface RecentParcel {
  id: string | number;
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  status: string;
  isUrgent: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ 
    users: { total: 0, active: 0, blocked: 0, newThisMonth: 0 }, 
    parcels: { 
      total: 0, 
      requested: 0,
      approved: 0,
      dispatched: 0,
      pending: 0, 
      inTransit: 0, 
      delivered: 0, 
      cancelled: 0,
      returned: 0,
      flagged: 0, 
      urgent: 0 
    } 
  });
  const [recentParcels, setRecentParcels] = useState<RecentParcel[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: usersData, refetch: refetchUsers, isLoading: usersLoading } = useGetAllUsersQuery(undefined, {
    
    refetchOnFocus: false,
    
    refetchOnMountOrArgChange: false,
    
    refetchOnReconnect: true,
  });
  
  const { data: parcelsData, refetch: refetchParcels, isLoading: parcelsLoading } = useGetAllParcelsQuery(undefined, {
    
    refetchOnFocus: false,
    
    refetchOnMountOrArgChange: false,
    
    refetchOnReconnect: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(recentParcels.length / itemsPerPage));
  const paginatedRecentParcels = recentParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const handleCacheInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; timestamp: number }>;
      const { key } = customEvent.detail;

      if (key === 'PARCELS' || key.includes('PARCEL')) {
        
        refetchParcels();
      }

      if (key === 'USERS' || key.includes('USER')) {
        refetchUsers();
      }
    };

    window.addEventListener('cache-invalidated', handleCacheInvalidation);

    return () => {
      window.removeEventListener('cache-invalidated', handleCacheInvalidation);
    };
  }, [refetchParcels, refetchUsers]);

  useEffect(() => {
    
    if ((usersLoading || parcelsLoading) && !usersData && !parcelsData) {
      setLoading(true);
      return;
    }

    setLoading(true);

    try {
      const users = Array.isArray(usersData) ? usersData : usersData || [];
      const parcels = Array.isArray(parcelsData) ? parcelsData : parcelsData || [];

      const processedUserStats = {
        total: users.length,
        active: users.filter((u: any) => u.status === "active" || u.isActive).length,
        blocked: users.filter((u: any) => u.status === "blocked" || u.isBlocked).length,
        newThisMonth: users.filter((u: any) => {
          const createdAt = new Date(u.createdAt || u.created_at || u.joinedAt || "");
          const now = new Date();
          return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        }).length,
      };

      const processedParcelStats = {
        total: parcels.length,
        requested: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "requested";
        }).length,
        approved: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "approved";
        }).length,
        dispatched: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "dispatched";
        }).length,
        pending: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "pending";
        }).length,
        inTransit: parcels.filter((p: any) => { 
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase(); 
          return s === "in_transit" || s === "intransit" || s === "in-transit" || s === "transit"; 
        }).length,
        delivered: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "delivered";
        }).length,
        cancelled: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "cancelled" || s === "canceled";
        }).length,
        returned: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "returned";
        }).length,
        flagged: parcels.filter((p: any) => p.isFlagged || p.isHeld || p.isBlocked).length,
        urgent: parcels.filter((p: any) => !!(p.deliveryInfo?.isUrgent || p.isFlagged)).length,
      };

      const processedRecentParcels: RecentParcel[] = parcels.map((p: any) => ({ id: p._id ?? Math.random(), trackingNumber: p.trackingNumber || p.tracking_number || p.trackingId || p._id || "N/A", senderName: p.senderInfo?.name || "-", recipientName: p.receiverInfo?.name || "-", status: p.currentStatus || p.status || "unknown", isUrgent: !!(p.deliveryInfo?.isUrgent || p.isFlagged), createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt?.$date || new Date().toISOString() }));

      setStats((prev) => ({ ...prev, users: processedUserStats, parcels: processedParcelStats }));
      setRecentParcels(processedRecentParcels);
    } finally {
      setLoading(false);
    }
  }, [usersData, parcelsData, usersLoading, parcelsLoading]);

  const statCards = [
    { title: "Total Users", value: stats.users.total || 0, change: "+5%", trend: 'up' as const, icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-500", color: "blue", gradient: "from-blue-50 to-blue-100" },
    { title: "Total Parcels", value: stats.parcels.total || 0, change: "+2%", trend: 'up' as const, icon: Package, iconBg: "bg-green-50", iconColor: "text-green-500", color: "green", gradient: "from-green-50 to-green-100" },
    { title: "In Transit", value: stats.parcels.inTransit || 0, change: "-1%", trend: 'down' as const, icon: Package, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", color: "yellow", gradient: "from-yellow-50 to-yellow-100" },
    { title: "Delivered", value: stats.parcels.delivered || 0, change: "+10%", trend: 'up' as const, icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-600", color: "green", gradient: "from-green-50 to-green-100" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-muted rounded w-2/3 sm:w-1/3 mb-4 sm:mb-6"></div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={`loading-card-${i}`} className="h-28 sm:h-32 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 sm:h-96 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <AdminHeader onRefresh={() => { refetchUsers(); refetchParcels(); }} />

          <StatCards statCards={statCards} />

          {/* Pie Chart Section */}
          <ParcelStatusPieChart stats={stats.parcels} />

          <RecentParcelsTable parcels={paginatedRecentParcels} />

          {recentParcels.length > 0 && (
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-border bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5 rounded-b-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, recentParcels.length)} of {recentParcels.length} parcels
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
                  <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${currentPage > 1 ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>

                  {}
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const maxVisiblePages = window.innerWidth < 640 ? 3 : 4;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                          >
                            1
                          </button>
                        );
                        
                        if (startPage > 2) {
                          pages.push(
                            <span key="dots-start" className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">
                              ...
                            </span>
                          );
                        }
                      }

                      for (let page = startPage; page <= endPage; page++) {
                        pages.push(
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                              page === currentPage 
                                ? 'bg-red-600 text-white shadow-lg' 
                                : 'bg-muted hover:bg-muted/80 text-foreground'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="dots-end" className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">
                              ...
                            </span>
                          );
                        }
                        
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${currentPage < totalPages ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

