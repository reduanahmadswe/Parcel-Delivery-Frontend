"use client";

import { Activity, Plus, RefreshCw } from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export default function AdminHeader({ onRefresh }: Props) {
  return (
    <div className="bg-gradient-to-r from-red-50/50 via-transparent to-green-50/50 dark:from-red-950/20 dark:to-green-950/20 border border-border rounded-xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            Welcome back! Here&apos;s what&apos;s happening with your delivery system.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRefresh}
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

      {/* Quick Stats Bar (kept minimal; the stat cards are in a separate component) */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">%</div>
          <div className="text-xs text-muted-foreground">Delivery Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
          <div className="text-xs text-muted-foreground">In Transit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
          <div className="text-xs text-muted-foreground">Issues</div>
        </div>
      </div>
    </div>
  );
}
