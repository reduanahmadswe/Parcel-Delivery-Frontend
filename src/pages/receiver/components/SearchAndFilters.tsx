import { Search } from "lucide-react";
import React from "react";
import { ParcelStats, SearchFilters } from "../types";

interface SearchAndFiltersProps {
  filters: SearchFilters;
  stats: ParcelStats;
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  stats,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onSortOrderChange,
}) => {
  const filterOptions = [
    { key: "all", label: "All Parcels", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "in_transit", label: "In Transit", count: stats.inTransit },
    { key: "out_for_delivery", label: "Out for Delivery", count: 0 },
    { key: "delivered", label: "Delivered", count: stats.delivered },
  ];

  return (
    <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {}
          <div className="flex-1 max-w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by tracking number..."
                value={filters.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-muted text-foreground placeholder-muted-foreground text-sm sm:text-base"
              />
            </div>
          </div>

          {}
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="cost">Sort by Cost</option>
              <option value="weight">Sort by Weight</option>
            </select>
            <button
              onClick={() =>
                onSortOrderChange(filters.sortOrder === "asc" ? "desc" : "asc")
              }
              className="px-2 sm:px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-muted transition-colors text-sm sm:text-base"
            >
              {filters.sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
          {filterOptions.map((status) => (
            <button
              key={status.key}
              onClick={() => onFilterChange(status.key)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                filters.filter === status.key
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {status.label}
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] xs:text-xs ${
                  filters.filter === status.key
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {status.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;

