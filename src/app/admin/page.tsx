"use client";

import AdminLayout from "@/components/admin/AdminDashboardLayout";
import StatusBadge from "@/components/admin/StatusIndicatorBadge";
import api from "@/lib/ApiConfiguration";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    blocked: number;
    newThisMonth: number;
  };
  parcels: {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    flagged: number;
    urgent: number;
  };
}

interface RecentParcel {
  id: number;
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
      pending: 0,
      inTransit: 0,
      delivered: 0,
      flagged: 0,
      urgent: 0,
    },
  });
  const [recentParcels, setRecentParcels] = useState<RecentParcel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats using the correct endpoints
      const [userStatsRes, parcelStatsRes] = await Promise.all([
        api.get("/users/stats"),
        api.get("/parcels/admin/stats"),
      ]);

      setStats({
        users: userStatsRes.data.data || userStatsRes.data,
        parcels: parcelStatsRes.data.data || parcelStatsRes.data,
      });

      // Fetch recent parcels with proper filtering
      const parcelsRes = await api.get(
        "/parcels?limit=5&sort=createdAt&order=desc"
      );
      const parcelsData = parcelsRes.data.data || parcelsRes.data;
      setRecentParcels(Array.isArray(parcelsData) ? parcelsData : []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.users.total || 0,
      icon: Users,
      color: "blue",
      change: `+${stats.users.newThisMonth || 0} this month`,
      trend: "up",
      gradient: "from-blue-500/10 to-blue-600/10",
      iconBg: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Parcels",
      value: stats.parcels.total || 0,
      icon: Package,
      color: "green",
      change: `${stats.parcels.delivered || 0} delivered`,
      trend: "up",
      gradient: "from-green-500/10 to-green-600/10",
      iconBg: "bg-gradient-to-br from-green-500/20 to-green-600/20",
      iconColor: "text-green-600",
    },
    {
      title: "Active Parcels",
      value: (stats.parcels.pending || 0) + (stats.parcels.inTransit || 0),
      icon: TrendingUp,
      color: "yellow",
      change: `${stats.parcels.urgent || 0} urgent`,
      trend: "neutral",
      gradient: "from-yellow-500/10 to-yellow-600/10",
      iconBg: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-600",
    },
    {
      title: "Issues & Alerts",
      value: stats.parcels.flagged || 0,
      icon: AlertTriangle,
      color: "red",
      change: "Needs attention",
      trend: "down",
      gradient: "from-red-500/10 to-red-600/10",
      iconBg: "bg-gradient-to-br from-red-500/20 to-red-600/20",
      iconColor: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 bg-background">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`loading-card-${i}`}
                  className="h-32 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-lg"
                ></div>
              ))}
            </div>
            <div className="h-64 bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 border border-border rounded-lg"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 bg-background min-h-screen">
        {/* Enhanced Dashboard Header */}
        <div className="bg-gradient-to-r from-red-50/50 via-transparent to-green-50/50 dark:from-red-950/20 dark:to-green-950/20 border border-border rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Welcome back! Here&apos;s what&apos;s happening with your
                delivery system.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </button>
              <button className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Quick Actions
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(
                  ((stats.parcels.delivered || 0) /
                    (stats.parcels.total || 1)) *
                    100
                )}
                %
              </div>
              <div className="text-xs text-muted-foreground">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.users.active || 0}
              </div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.parcels.inTransit || 0}
              </div>
              <div className="text-xs text-muted-foreground">In Transit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.parcels.flagged || 0}
              </div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const TrendIcon =
              card.trend === "up"
                ? ArrowUpRight
                : card.trend === "down"
                ? ArrowDownRight
                : Activity;
            return (
              <div
                key={`stat-card-${card.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className={`bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer ${card.gradient} hover:border-${card.color}-200`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div
                    className={`p-1 rounded-full bg-${card.color}-50 dark:bg-${card.color}-950/20`}
                  >
                    <TrendIcon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-3xl font-bold text-foreground group-hover:text-${card.color}-600 transition-colors duration-300">
                      {typeof card.value === "number" && !isNaN(card.value)
                        ? card.value.toLocaleString()
                        : 0}
                    </p>
                    {card.trend === "up" && (
                      <span className="text-xs text-green-500 font-medium">
                        ↑
                      </span>
                    )}
                    {card.trend === "down" && (
                      <span className="text-xs text-red-500 font-medium">
                        ↓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{card.change}</p>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 h-1.5 rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          10,
                          (card.value /
                            Math.max(...statCards.map((c) => c.value))) *
                            100
                        )
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Charts and Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Parcel Status Distribution */}
          <div className="xl:col-span-2 bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Parcel Status Overview
              </h3>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Pending",
                  value: stats.parcels.pending || 0,
                  color: "yellow",
                  icon: Clock,
                  bgGradient: "from-yellow-500/10 to-yellow-600/10",
                },
                {
                  label: "In Transit",
                  value: stats.parcels.inTransit || 0,
                  color: "blue",
                  icon: TrendingUp,
                  bgGradient: "from-blue-500/10 to-blue-600/10",
                },
                {
                  label: "Delivered",
                  value: stats.parcels.delivered || 0,
                  color: "green",
                  icon: CheckCircle,
                  bgGradient: "from-green-500/10 to-green-600/10",
                },
              ].map((item) => {
                const percentage =
                  (stats.parcels.total || 0) > 0
                    ? Math.round(
                        ((item.value || 0) / (stats.parcels.total || 1)) * 100
                      )
                    : 0;
                const ItemIcon = item.icon;

                return (
                  <div
                    key={`chart-item-${item.label}`}
                    className={`p-4 rounded-lg bg-gradient-to-r ${item.bgGradient} border border-${item.color}-200 dark:border-${item.color}-800 hover:scale-102 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-${item.color}-500/20`}
                        >
                          <ItemIcon
                            className={`h-4 w-4 text-${item.color}-600`}
                          />
                        </div>
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {typeof item.value === "number" && !isNaN(item.value)
                            ? item.value.toLocaleString()
                            : 0}
                        </div>
                        <div
                          className={`text-sm text-${item.color}-600 font-medium`}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h3>
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/10">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  action: "New parcel created",
                  details: "PKG-2025-001",
                  time: "2 minutes ago",
                  type: "create",
                  icon: Plus,
                },
                {
                  action: "Parcel delivered",
                  details: "PKG-2025-002",
                  time: "5 minutes ago",
                  type: "success",
                  icon: CheckCircle,
                },
                {
                  action: "User registered",
                  details: "New customer account",
                  time: "10 minutes ago",
                  type: "info",
                  icon: Users,
                },
                {
                  action: "Issue flagged",
                  details: "Delivery delay reported",
                  time: "15 minutes ago",
                  type: "warning",
                  icon: AlertTriangle,
                },
              ].map((activity, index) => {
                const ActivityIcon = activity.icon;
                const colorMap = {
                  create: "blue",
                  success: "green",
                  info: "gray",
                  warning: "red",
                };
                const color = colorMap[activity.type as keyof typeof colorMap];

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div
                      className={`p-2 rounded-lg bg-${color}-500/10 flex-shrink-0`}
                    >
                      <ActivityIcon className={`h-4 w-4 text-${color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {activity.action}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {activity.details}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 py-2 px-4 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-all duration-200">
              View All Activity
            </button>
          </div>
        </div>

        {/* Enhanced Recent Parcels Table */}
        <div className="bg-background rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300">
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-red-50/20 via-transparent to-green-50/20 dark:from-red-950/10 dark:to-green-950/10 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Parcels
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Latest parcel activities and updates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors duration-200">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors duration-200">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Tracking Number
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Sender
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {recentParcels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-gray-500/10 to-gray-600/10">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-foreground font-medium">
                            No recent parcels
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Parcel data will appear here once available
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentParcels.map((parcel, index) => (
                    <tr
                      key={
                        parcel.id
                          ? `parcel-${parcel.id}`
                          : `parcel-row-${index}`
                      }
                      className="hover:bg-gradient-to-r hover:from-red-50/20 hover:to-green-50/20 dark:hover:from-red-950/10 dark:hover:to-green-950/10 transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:scale-105 transition-transform duration-200">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-foreground font-mono">
                            {parcel.trackingNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground font-medium">
                          {parcel.senderName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {parcel.recipientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={parcel.status} variant="parcel" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {parcel.isUrgent ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-sm">
                              Urgent
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {parcel.createdAt
                          ? new Date(parcel.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {recentParcels.length > 0 && (
            <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5 rounded-b-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {recentParcels.length} of {stats.parcels.total || 0}{" "}
                  parcels
                </p>
                <button className="px-4 py-2 text-sm text-foreground hover:text-green-600 border border-border rounded-lg hover:bg-muted hover:border-green-200 transition-all duration-200">
                  View All Parcels
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
