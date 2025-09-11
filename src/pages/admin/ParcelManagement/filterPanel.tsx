// Filter Panel Component for Parcel Management
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
    <>
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Parcel Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage all parcels in the system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5 transition-all duration-300"
          >
            Clear Filters
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-md hover:shadow-lg transition-all duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-background rounded-lg shadow border border-border p-4 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Filter Parcels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Sender Email
            </label>
            <input
              type="email"
              placeholder="Filter by sender email..."
              value={filterParams.senderEmail}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  senderEmail: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Receiver Email
            </label>
            <input
              type="email"
              placeholder="Filter by receiver email..."
              value={filterParams.receiverEmail}
              onChange={(e) =>
                setFilterParams({
                  ...filterParams,
                  receiverEmail: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Status
            </label>
            <select
              value={filterParams.status}
              onChange={(e) =>
                setFilterParams({ ...filterParams, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background text-foreground transition-all duration-300"
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
          </div>
        </div>
      </div>
    </>
  );
}
