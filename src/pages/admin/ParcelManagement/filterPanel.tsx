
import { Filter, RefreshCw, Search, Sparkles, TrendingUp } from "lucide-react";
import { FilterParams, STATUS_OPTIONS } from "../../../services/parcelTypes";

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
      {}
      {}

      {}
      <div className="group relative bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-3xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
            {}
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Search className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Smart Filters</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">Advanced search and filtering system</p>
              </div>
            </div>
            
            {}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={onClearFilters}
                className="group relative flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 hover:border-red-500/30 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <span className="text-foreground relative z-10">Clear Filters</span>
              </button>
              <button
                onClick={onRefresh}
                className="group relative flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                <span className="relative z-10">Refresh</span>
              </button>
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full border border-orange-200 dark:border-orange-700">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-orange-700 dark:text-orange-300 whitespace-nowrap">
                  Advanced Search
                </span>
                {}
                {(filterParams.trackingNumber || filterParams.senderEmail || filterParams.receiverEmail || filterParams.status) && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-foreground">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full shadow-sm ring-1 ring-white/10 dark:ring-white/5 flex-shrink-0"></div>
                <span>Tracking Number</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter tracking number... (e.g., TRK-202)"
                    value={filterParams.trackingNumber || ""}
                  onChange={(e) =>
                    setFilterParams({
                      ...filterParams,
                      trackingNumber: e.target.value,
                    })
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && filterParams.trackingNumber.trim()) {
                      
                      const event = new CustomEvent('quickFindParcel', { 
                        detail: { trackingNumber: filterParams.trackingNumber.trim() } 
                      });
                      window.dispatchEvent(event);
                    }
                  }}
                  className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 text-foreground text-xs sm:text-sm placeholder-muted-foreground dark:placeholder-red-300 transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 group-hover:-translate-y-0.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 dark:text-red-300" />
                </div>
              </div>
              
              {}
              {filterParams.trackingNumber && filterParams.trackingNumber.trim() && (
                <div className="mt-1.5 sm:mt-2">
                  <button
                    onClick={() => {
                      const event = new CustomEvent('quickFindParcel', { 
                        detail: { trackingNumber: filterParams.trackingNumber.trim() } 
                      });
                      window.dispatchEvent(event);
                    }}
                    className="group relative w-full flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl hover:shadow-red-500/25 dark:shadow-red-900/40 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">Quick Find & View</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-foreground">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
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
                  className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 text-foreground text-xs sm:text-sm placeholder-muted-foreground transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group-hover:-translate-y-0.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-foreground">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-green-200/50 dark:border-green-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-foreground text-xs sm:text-sm placeholder-muted-foreground transition-all duration-300 hover:border-green-400 group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-foreground">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                <span>Status Filter</span>
              </label>
              <div className="relative group">
                <select
                  value={filterParams.status}
                  onChange={(e) =>
                    setFilterParams({ ...filterParams, status: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/50 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-foreground text-xs sm:text-sm transition-all duration-300 hover:border-orange-400 group-hover:shadow-md cursor-pointer appearance-none"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500"
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

