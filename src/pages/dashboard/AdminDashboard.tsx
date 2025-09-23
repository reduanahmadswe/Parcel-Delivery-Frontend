"use client";

import api from "@/services/ApiConfiguration";
import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import { CheckCircle, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllUsersQuery, useGetAllParcelsQuery } from "@/store/api/adminApi";

import AdminHeader from "../admin/components/AdminHeader";
import StatCards from "../admin/components/StatCards";
import RecentParcelsTable from "../admin/components/RecentParcelsTable";

interface DashboardStats {
  users: { total: number; active: number; blocked: number; newThisMonth: number };
  parcels: { total: number; pending: number; inTransit: number; delivered: number; flagged: number; urgent: number };
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
  const [stats, setStats] = useState<DashboardStats>({ users: { total: 0, active: 0, blocked: 0, newThisMonth: 0 }, parcels: { total: 0, pending: 0, inTransit: 0, delivered: 0, flagged: 0, urgent: 0 } });
  const [recentParcels, setRecentParcels] = useState<RecentParcel[]>([]);
  const [loading, setLoading] = useState(true);

  // RTK Query hooks
  const { data: usersData, refetch: refetchUsers } = useGetAllUsersQuery();
  const { data: parcelsData, refetch: refetchParcels } = useGetAllParcelsQuery();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(recentParcels.length / itemsPerPage));
  const paginatedRecentParcels = recentParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    // When parcelsData or usersData change, compute stats and recent parcels
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
        pending: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "pending" || s === "requested";
        }).length,
        inTransit: parcels.filter((p: any) => { 
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase(); 
          return s === "in_transit" || s === "intransit" || s === "in-transit" || s === "transit" || s === "dispatched"; 
        }).length,
        delivered: parcels.filter((p: any) => {
          const s = (p.currentStatus || p.status)?.toString()?.toLowerCase();
          return s === "delivered";
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
  }, [usersData, parcelsData]);

  const statCards = [
    { title: "Total Users", value: stats.users.total || 0, change: "+5%", trend: 'up' as const, icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-500", color: "blue", gradient: "from-blue-50 to-blue-100" },
    { title: "Total Parcels", value: stats.parcels.total || 0, change: "+2%", trend: 'up' as const, icon: Package, iconBg: "bg-green-50", iconColor: "text-green-500", color: "green", gradient: "from-green-50 to-green-100" },
    { title: "In Transit", value: stats.parcels.inTransit || 0, change: "-1%", trend: 'down' as const, icon: Package, iconBg: "bg-yellow-50", iconColor: "text-yellow-600", color: "yellow", gradient: "from-yellow-50 to-yellow-100" },
    { title: "Delivered", value: stats.parcels.delivered || 0, change: "+10%", trend: 'up' as const, icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-600", color: "green", gradient: "from-green-50 to-green-100" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{[...Array(4)].map((_, i) => (<div key={`loading-card-${i}`} className="h-32 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-lg"></div>))}</div>
              <div className="h-64 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-lg"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background mt-8">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          <AdminHeader onRefresh={() => { refetchUsers(); refetchParcels(); }} />

          <StatCards statCards={statCards} />

          <RecentParcelsTable parcels={paginatedRecentParcels} />

          {recentParcels.length > 0 && (
            <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, recentParcels.length)} of {recentParcels.length} parcels</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage > 1 ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}>Previous</button>

                  <div className="flex items-center space-x-1">{Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2)).map((page) => (<button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium ${page === currentPage ? 'bg-red-600 text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}>{page}</button>))}</div>

                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage < totalPages ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}>Next</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

