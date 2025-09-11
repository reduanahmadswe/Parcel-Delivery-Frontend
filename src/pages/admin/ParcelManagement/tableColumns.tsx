// Table columns configuration for Parcel Management
import { Column } from "@/pages/admin/ReusableDataTable";
import StatusBadge from "@/pages/admin/StatusIndicatorBadge";
import {
  Clock,
  DollarSign,
  Edit,
  Eye,
  Flag,
  Lock,
  MapPin,
  MoreVertical,
  Package,
  RefreshCw,
  Star,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { Parcel } from "./types";

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
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onDetailsClick(parcel)}
        className="group p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
        title="View Details"
      >
        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </button>
      <button
        onClick={() => onEditClick(parcel)}
        className="group p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 dark:hover:bg-green-900/20 transition-all duration-200"
        title="Edit Parcel"
      >
        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      </button>
      <button
        onClick={() => onStatusClick(parcel)}
        className="group p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 dark:hover:bg-orange-900/20 transition-all duration-200"
        title="Update Status"
      >
        <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-all duration-300" />
      </button>
      <button
        onClick={() => onFlagClick(parcel)}
        className={`group p-2 rounded-lg transition-all duration-200 ${
          parcel?.isFlagged
            ? "text-red-600 bg-red-50 dark:bg-red-900/20 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            : "text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        }`}
        title={parcel?.isFlagged ? "Unflag Parcel" : "Flag Parcel"}
      >
        <Flag
          className={`h-4 w-4 group-hover:scale-110 transition-all duration-200 ${
            parcel?.isFlagged ? "fill-current" : ""
          }`}
        />
      </button>
      <button
        onClick={() => onHoldClick(parcel)}
        className={`group p-2 rounded-lg transition-all duration-200 ${
          parcel?.isOnHold
            ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30"
            : "text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        }`}
        title={parcel?.isOnHold ? "Release Hold" : "Put on Hold"}
      >
        <Lock className="h-4 w-4 group-hover:scale-110 transition-all duration-200" />
      </button>
      <div className="relative group">
        <button
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          title="More Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <div className="absolute right-0 z-10 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
          <div className="p-2">
            <button
              onClick={() => onAssignClick(parcel)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 w-full text-left rounded-lg transition-all duration-200"
            >
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Assign Personnel</span>
            </button>
            <button
              onClick={() => onViewStatusLogClick(parcel)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 w-full text-left rounded-lg transition-all duration-200"
            >
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">View Status Log</span>
            </button>
            <button
              onClick={() => onReturnClick(parcel)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 w-full text-left rounded-lg transition-all duration-200"
            >
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
                <RefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-medium">Return Parcel</span>
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <button
              onClick={() => onDeleteClick(parcel)}
              className="flex items-center px-4 py-3 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-200 w-full text-left rounded-lg transition-all duration-200"
            >
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Delete Parcel</span>
            </button>
          </div>
        </div>
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
      key: "senderName",
      header: "Sender",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {parcel?.senderName || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {parcel?.senderEmail || ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "recipientName",
      header: "Recipient",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {parcel?.recipientName || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {parcel?.recipientEmail || ""}
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
      key: "cost",
      header: "Cost",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-foreground">
            ${parcel?.cost ?? 0}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-foreground">
              {parcel?.createdAt
                ? new Date(parcel?.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {parcel?.createdAt
                ? new Date(parcel?.createdAt).toLocaleTimeString()
                : ""}
            </div>
          </div>
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
