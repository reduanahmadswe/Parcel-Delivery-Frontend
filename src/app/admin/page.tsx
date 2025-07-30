"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import api from "@/lib/api";
import { BarChart3, Package, TrendingUp, Users } from "lucide-react";
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
    },
    {
      title: "Total Parcels",
      value: stats.parcels.total || 0,
      icon: Package,
      color: "green",
      change: `${stats.parcels.delivered || 0} delivered`,
    },
    {
      title: "Active Parcels",
      value: (stats.parcels.pending || 0) + (stats.parcels.inTransit || 0),
      icon: TrendingUp,
      color: "yellow",
      change: `${stats.parcels.urgent || 0} urgent`,
    },
    {
      title: "Flagged Items",
      value: stats.parcels.flagged || 0,
      icon: BarChart3,
      color: "red",
      change: "Needs attention",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`loading-card-${i}`}
                  className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"
                ></div>
              ))}
            </div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={`stat-card-${index}`}
                className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {typeof card.value === "number" && !isNaN(card.value) ? card.value : 0}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {card.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900`}
                  >
                    <Icon
                      className={`h-6 w-6 text-${card.color}-600 dark:text-${card.color}-400`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parcel Status Distribution */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Parcel Status Distribution
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Pending",
                  value: stats.parcels.pending || 0,
                  color: "yellow",
                },
                {
                  label: "In Transit",
                  value: stats.parcels.inTransit || 0,
                  color: "blue",
                },
                {
                  label: "Delivered",
                  value: stats.parcels.delivered || 0,
                  color: "green",
                },
              ].map((item) => (
                <div
                  key={`chart-item-${item.label}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`bg-${item.color}-500 h-2 rounded-full`}
                        style={{
                          width: `${
                            (stats.parcels.total || 0) > 0
                              ? Math.round(
                                  ((item.value || 0) / (stats.parcels.total || 1)) * 100
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {typeof item.value === "number" && !isNaN(item.value) ? item.value : 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              User Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Active Users
                </span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {typeof stats.users.active === "number" && !isNaN(stats.users.active)
                    ? stats.users.active
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Blocked Users
                </span>
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {typeof stats.users.blocked === "number" && !isNaN(stats.users.blocked)
                    ? stats.users.blocked
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  New This Month
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {typeof stats.users.newThisMonth === "number" && !isNaN(stats.users.newThisMonth)
                    ? stats.users.newThisMonth
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Parcels */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recent Parcels
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {recentParcels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                    >
                      No recent parcels
                    </td>
                  </tr>
                ) : (
                  recentParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                        {parcel.trackingNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {parcel.senderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {parcel.recipientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={parcel.status} variant="parcel" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {parcel.isUrgent ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Urgent
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
