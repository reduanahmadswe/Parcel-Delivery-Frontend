
import { Column } from "../../../components/common/ReusableDataTable";
import StatusBadge from "../../../components/common/StatusIndicatorBadge";
import {
  Clock,
  Edit,
  Eye,
  Flag,
  Lock,
  MoreVertical,
  Package,
  RefreshCw,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Parcel } from "../../../services/parcelTypes";

interface ParcelActionsProps {
  parcel: Parcel;
  onDetailsClick: (parcel: Parcel) => void;
  onEditClick: (parcel: Parcel) => void;
  onStatusClick: (parcel: Parcel) => void;
  onFlagClick: (parcel: Parcel) => void;
  onHoldClick: (parcel: Parcel) => void;
  onAssignClick: (parcel: Parcel) => void;
  onViewStatusLogClick: (parcel: Parcel) => void;
  onReturnClick: (parcel: Parcel) => void;
  onDeleteClick: (parcel: Parcel) => void;
}

function ParcelActionsColumn({
  parcel,
  onDetailsClick,
  onEditClick,
  onStatusClick,
  onFlagClick,
  onHoldClick,
  onAssignClick,
  onViewStatusLogClick,
  onReturnClick,
  onDeleteClick,
}: ParcelActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  return (
    <div className="flex items-center space-x-2 opacity-100">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetailsClick(parcel);
        }}
        className="group relative p-3 text-purple-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 overflow-hidden z-10"
        title="View Details"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <Eye className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(parcel);
        }}
        className="group relative p-3 text-green-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 overflow-hidden z-10"
        title="Edit Parcel"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <Edit className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStatusClick(parcel);
        }}
        className="group relative p-3 text-orange-600 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 overflow-hidden z-10"
        title="Update Status"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <RefreshCw className="h-4 w-4 relative z-10 group-hover:rotate-180 transition-all duration-500" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFlagClick(parcel);
        }}
        className={`group relative p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 ${
          parcel?.isFlagged
            ? "text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md shadow-red-500/25"
            : "text-red-600 hover:text-white hover:shadow-red-500/25"
        }`}
        title={parcel?.isFlagged ? "Unflag Parcel" : "Flag Parcel"}
      >
        {!parcel?.isFlagged && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        )}
        <Flag
          className={`h-4 w-4 relative z-10 group-hover:scale-110 transition-all duration-300 ${
            parcel?.isFlagged ? "fill-current animate-pulse" : ""
          }`}
        />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHoldClick(parcel);
        }}
        className={`group relative p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 ${
          parcel?.isOnHold
            ? "text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-md shadow-amber-500/25"
            : "text-amber-600 hover:text-white hover:shadow-amber-500/25"
        }`}
        title={parcel?.isOnHold ? "Release Hold" : "Put on Hold"}
      >
        {!parcel?.isOnHold && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        )}
        <Lock className={`h-4 w-4 relative z-10 group-hover:scale-110 transition-all duration-300 ${parcel?.isOnHold ? 'animate-pulse' : ''}`} />
      </button>
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 relative z-20"
          title="More Actions"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((open) => !open);
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 transform origin-top-right">
              <div className="p-2">
              <button
                onClick={() => {
                  onAssignClick(parcel);
                  setDropdownOpen(false);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 w-full text-left rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Assign Personnel</span>
              </button>
              <button
                onClick={() => {
                  onViewStatusLogClick(parcel);
                  setDropdownOpen(false);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 w-full text-left rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">View Status Log</span>
              </button>
              <button
                onClick={() => {
                  onReturnClick(parcel);
                  setDropdownOpen(false);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 w-full text-left rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                  <RefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium">Return Parcel</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={() => {
                  onDeleteClick(parcel);
                  setDropdownOpen(false);
                }}
                className="flex items-center px-4 py-3 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-200 w-full text-left rounded-lg transition-all duration-200"
              >
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="font-medium">Delete Parcel</span>
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export function createParcelColumns(actions: {
  onDetailsClick: (parcel: Parcel) => void;
  onEditClick: (parcel: Parcel) => void;
  onStatusClick: (parcel: Parcel) => void;
  onFlagClick: (parcel: Parcel) => void;
  onHoldClick: (parcel: Parcel) => void;
  onAssignClick: (parcel: Parcel) => void;
  onViewStatusLogClick: (parcel: Parcel) => void;
  onReturnClick: (parcel: Parcel) => void;
  onDeleteClick: (parcel: Parcel) => void;
}): Column<Parcel>[] {
  return [
    {
      key: "trackingNumber",
      header: "Tracking Number",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-foreground font-mono text-sm">
              {parcel?.trackingNumber || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <StatusBadge status={parcel?.status} variant="parcel" />
          <div className="flex space-x-2">
            {parcel?.isFlagged && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-md">
                <Flag className="w-3 h-3 mr-1 fill-current" />
                Flagged
              </span>
            )}
            {parcel?.isOnHold && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-200 border border-orange-300 dark:border-orange-600 shadow-md">
                <Lock className="w-3 h-3 mr-1" />
                Hold
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "isUrgent",
      header: "Priority",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center">
          {parcel?.isUrgent ? (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-lg">
              <Star className="w-4 h-4 mr-2 fill-current animate-pulse" />
              Urgent
            </span>
          ) : (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700/50 dark:to-slate-600/50 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
              <Clock className="w-4 h-4 mr-2" />
              Normal
            </span>
          )}
        </div>
      ),
    },
    
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (_, parcel) => (
        <ParcelActionsColumn
          parcel={parcel}
          onDetailsClick={actions.onDetailsClick}
          onEditClick={actions.onEditClick}
          onStatusClick={actions.onStatusClick}
          onFlagClick={actions.onFlagClick}
          onHoldClick={actions.onHoldClick}
          onAssignClick={actions.onAssignClick}
          onViewStatusLogClick={actions.onViewStatusLogClick}
          onReturnClick={actions.onReturnClick}
          onDeleteClick={actions.onDeleteClick}
        />
      ),
    },
  ];
}

