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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tracking number, description, or sender..."
                value={filters.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {filters.sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filterOptions.map((status) => (
            <button
              key={status.key}
              onClick={() => onFilterChange(status.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filters.filter === status.key
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {status.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  filters.filter === status.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
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

