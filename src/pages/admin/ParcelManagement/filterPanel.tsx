// Filter Panel Component for Parcel Management
import { Filter, RefreshCw, Search, Sparkles, TrendingUp } from "lucide-react";
import { FilterParams, STATUS_OPTIONS } from "./types";

interface FilterPanelProps {
  filterParams: FilterParams;
  setFilterParams: (params: FilterParams) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export function FilterPanel({
  filterParams,
  setFilterParams,
  onClearFilters,
  onRefresh,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Modern Header with project's red/orange gradient theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-600 dark:from-red-600 dark:via-red-600 dark:to-red-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Parcel Management
                </h1>
                <p className="text-red-100 text-lg font-medium">
                  Track and manage all parcels with advanced analytics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClearFilters}
              className="group flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <Filter className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-white font-medium">Clear Filters</span>
            </button>
            <button
              onClick={onRefresh}
              className="group flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-900 font-medium shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Filter Panel with glassmorphism effect using project theme */}
      <div className="relative bg-background/70 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Smart Filters</h3>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full border border-orange-200 dark:border-orange-700">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Advanced Search
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                <span>Sender Email</span>
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Search by sender email..."
                  value={filterParams.senderEmail}
                  onChange={(e) =>
                    setFilterParams({
                      ...filterParams,
                      senderEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-foreground placeholder-muted-foreground transition-all duration-300 hover:border-blue-400 group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                <span>Receiver Email</span>
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Search by receiver email..."
                  value={filterParams.receiverEmail}
                  onChange={(e) =>
                    setFilterParams({
                      ...filterParams,
                      receiverEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-green-200/50 dark:border-green-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-foreground placeholder-muted-foreground transition-all duration-300 hover:border-green-400 group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                <span>Status Filter</span>
              </label>
              <div className="relative group">
                <select
                  value={filterParams.status}
                  onChange={(e) =>
                    setFilterParams({ ...filterParams, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground transition-all duration-300 hover:border-orange-400 group-hover:shadow-md cursor-pointer appearance-none"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
