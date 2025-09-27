"use client";

import { Activity, Plus, RefreshCw } from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export default function AdminHeader({ onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          Welcome back! Here&apos;s what&apos;s happening with your delivery system.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Quick Actions
        </button>
      </div>
    </div>
  );
}

