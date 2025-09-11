// Table columns configuration for Parcel Management
import { Column } from "@/pages/admin/ReusableDataTable";
import StatusBadge from "@/pages/admin/StatusIndicatorBadge";
import {
  Edit,
  Eye,
  Flag,
  Lock,
  MoreVertical,
  RefreshCw,
  Trash2,
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
        className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => onEditClick(parcel)}
        className="p-2 text-muted-foreground hover:text-blue-500 transition-colors duration-300"
        title="Edit Parcel"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => onStatusClick(parcel)}
        className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
        title="Update Status"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
      <button
        onClick={() => onFlagClick(parcel)}
        className={`p-2 transition-colors duration-300 ${
          parcel?.isFlagged
            ? "text-red-600 hover:text-red-700 dark:text-red-400"
            : "text-muted-foreground hover:text-green-500"
        }`}
        title={parcel?.isFlagged ? "Unflag Parcel" : "Flag Parcel"}
      >
        <Flag className="h-4 w-4" />
      </button>
      <button
        onClick={() => onHoldClick(parcel)}
        className={`p-2 transition-colors duration-300 ${
          parcel?.isOnHold
            ? "text-red-600 hover:text-red-700 dark:text-red-400"
            : "text-muted-foreground hover:text-green-500"
        }`}
        title={parcel?.isOnHold ? "Release Hold" : "Put on Hold"}
      >
        <Lock className="h-4 w-4" />
      </button>
      <div className="relative group">
        <button
          className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          title="More Actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <div className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1">
            <button
              onClick={() => onAssignClick(parcel)}
              className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Personnel
            </button>
            <button
              onClick={() => onViewStatusLogClick(parcel)}
              className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Status Log
            </button>
            <button
              onClick={() => onReturnClick(parcel)}
              className="flex items-center px-4 py-2 text-sm text-orange-700 dark:text-orange-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
            >
              Return Parcel
            </button>
            <button
              onClick={() => onDeleteClick(parcel)}
              className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Parcel
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
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {parcel?.trackingNumber || "N/A"}
        </div>
      ),
    },
    {
      key: "senderName",
      header: "Sender",
      sortable: true,
      render: (_, parcel) => parcel?.senderName || "N/A",
    },
    {
      key: "recipientName",
      header: "Recipient",
      sortable: true,
      render: (_, parcel) => parcel?.recipientName || "N/A",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_, parcel) => (
        <div className="flex items-center space-x-2">
          <StatusBadge status={parcel?.status} variant="parcel" />
          {parcel?.isFlagged && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              🚩 Flagged
            </span>
          )}
          {parcel?.isOnHold && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              🔒 Hold
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isUrgent",
      header: "Priority",
      sortable: true,
      render: (_, parcel) =>
        parcel?.isUrgent ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Urgent
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Normal
          </span>
        ),
    },
    {
      key: "cost",
      header: "Cost",
      sortable: true,
      render: (_, parcel) => `$${parcel?.cost ?? 0}`,
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (_, parcel) =>
        parcel?.createdAt
          ? new Date(parcel?.createdAt).toLocaleDateString()
          : "N/A",
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
