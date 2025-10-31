"use client";

import { Activity, Plus, RefreshCw } from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export default function AdminHeader({ onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-2">
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          <span className="line-clamp-1">Welcome back! Here&apos;s what&apos;s happening with your delivery system.</span>
        </p>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={onRefresh}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Refresh Data</span>
          <span className="xs:hidden">Refresh</span>
        </button>
        <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Quick Actions</span>
          <span className="xs:hidden">Actions</span>
        </button>
      </div>
    </div>
  );
}

