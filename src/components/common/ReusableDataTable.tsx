"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  pagination,
  className = "",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSort = (key: string) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = sortConfig
    ? [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const modifier = sortConfig.direction === "asc" ? 1 : -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * modifier;
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * modifier;
        }
        return String(aVal).localeCompare(String(bVal)) * modifier;
      })
    : data;

  if (loading) {
    return (
      <div className="bg-white dark:bg-black rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-black rounded-lg shadow ${className}`}
    >
      {}
      {searchable && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-600">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-100 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-blue-500">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-slate-200 dark:divide-slate-600">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-200"
                >
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={('id' in row && row.id) ? String(row.id) : `row-${index}`}
                  className="group/row hover:bg-gradient-to-r hover:from-red-50/30 hover:to-orange-50/30 dark:hover:from-red-950/20 dark:hover:to-orange-950/20 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 border border-transparent hover:border-red-100/50 dark:hover:border-red-900/30 isolate"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {}
      {pagination && data.length > 0 && (
        <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-red-50/10 via-transparent to-green-50/10 dark:from-red-950/5 dark:to-green-950/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * (pagination.itemsPerPage || 10) + 1} to {Math.min(pagination.page * (pagination.itemsPerPage || 10), pagination.totalItems || (pagination.totalPages * (pagination.itemsPerPage || 10)))} of {pagination.totalItems || (pagination.totalPages * (pagination.itemsPerPage || 10))} parcels
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => pagination.onPageChange(pagination.page - 1)} 
                disabled={pagination.page <= 1} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pagination.page > 1 ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => page >= Math.max(1, pagination.page - 2) && page <= Math.min(pagination.totalPages, pagination.page + 2))
                  .map((page) => (
                    <button 
                      key={page} 
                      onClick={() => pagination.onPageChange(page)} 
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${page === pagination.page ? 'bg-red-600 text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                    >
                      {page}
                    </button>
                  ))
                }
              </div>

              <button 
                onClick={() => pagination.onPageChange(pagination.page + 1)} 
                disabled={pagination.page >= pagination.totalPages} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${pagination.page < pagination.totalPages ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'}`}                                                                                                                                                        >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

