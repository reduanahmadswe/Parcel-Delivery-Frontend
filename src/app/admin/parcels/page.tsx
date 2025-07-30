"use client";

import AdminLayout from "@/components/admin/AdminDashboardLayout";
import ConfirmDialog from "@/components/admin/ConfirmationDialog";
import Modal from "@/components/admin/ModalDialogComponent";
import DataTable, { Column } from "@/components/admin/ReusableDataTable";
import StatusBadge from "@/components/admin/StatusIndicatorBadge";
import api from "@/lib/ApiConfiguration";
import {
  Edit,
  Eye,
  Flag,
  Lock,
  MoreVertical,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Parcel extends Record<string, unknown> {
  id: number;
  trackingNumber: string;
  type: string;
  description: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status:
    | "pending"
    | "confirmed"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cost: number;
  deliveryType: string;
  isInsured: boolean;
  isUrgent: boolean;
  isFlagged?: boolean;
  isOnHold?: boolean;
  assignedPersonnel?: string;
  createdAt: string;
  updatedAt: string;
}

interface StatusLogEntry {
  id: number;
  status: string;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export default function AdminParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStatusLogModal, setShowStatusLogModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([]);
  const [assignedPersonnel, setAssignedPersonnel] = useState<string>("");
  const [filterParams, setFilterParams] = useState({
    senderEmail: "",
    receiverEmail: "",
    status: "",
  });

  const fetchParcels = useCallback(async () => {
    try {
      setLoading(true);
      // Build query params for filtering
      const queryParams = new URLSearchParams();
      if (filterParams.senderEmail)
        queryParams.append("senderEmail", filterParams.senderEmail);
      if (filterParams.receiverEmail)
        queryParams.append("receiverEmail", filterParams.receiverEmail);
      if (filterParams.status)
        queryParams.append("status", filterParams.status);

      const query = queryParams.toString();
      const endpoint = query ? `/parcels?${query}` : "/parcels";

      const response = await api.get(endpoint);
      const parcelsData = response.data.data || response.data;
      setParcels(Array.isArray(parcelsData) ? parcelsData : []);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  const handleUpdateStatus = async () => {
    if (!selectedParcel || !newStatus) return;

    try {
      setActionLoading(true);
      await api.put(`/parcels/${selectedParcel.id}/status`, {
        status: newStatus,
      });
      await fetchParcels();
      setShowStatusModal(false);
      setSelectedParcel(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating parcel status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);
      await api.put(`/parcels/${parcel.id}/flag`);
      await fetchParcels();
    } catch (error) {
      console.error("Error flagging parcel:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHoldParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);
      await api.put(`/parcels/${parcel.id}/hold`);
      await fetchParcels();
    } catch (error) {
      console.error("Error holding parcel:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);
      await api.put(`/parcels/${parcel.id}/return`);
      await fetchParcels();
    } catch (error) {
      console.error("Error returning parcel:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPersonnel = async () => {
    if (!selectedParcel || !assignedPersonnel) return;

    try {
      setActionLoading(true);
      await api.put(`/parcels/${selectedParcel.id}/assign-personnel`, {
        personnelId: assignedPersonnel,
      });
      await fetchParcels();
      setShowAssignModal(false);
      setSelectedParcel(null);
      setAssignedPersonnel("");
    } catch (error) {
      console.error("Error assigning personnel:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchStatusLog = async (parcelId: number) => {
    try {
      const response = await api.get(`/parcels/${parcelId}/status-log`);
      setStatusLog(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching status log:", error);
    }
  };

  const handleDeleteParcel = async () => {
    if (!selectedParcel) return;

    try {
      setActionLoading(true);
      await api.delete(`/parcels/${selectedParcel.id}`);
      await fetchParcels();
      setShowConfirmDialog(false);
      setSelectedParcel(null);
    } catch (error) {
      console.error("Error deleting parcel:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailsModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowDetailsModal(true);
  };

  const openStatusModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setNewStatus(parcel?.status || "pending");
    setShowStatusModal(true);
  };

  const handleViewStatusLog = async (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowStatusLogModal(true);
    await fetchStatusLog(parcel.id);
  };

  const statusOptions = [
    "pending",
    "confirmed",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
  ];

  const columns: Column<Parcel>[] = [
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
        <div className="flex items-center space-x-1">
          <button
            onClick={() => openDetailsModal(parcel)}
            className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openStatusModal(parcel)}
            className="p-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
            title="Update Status"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleFlagParcel(parcel)}
            className={`p-2 ${
              parcel?.isFlagged
                ? "text-red-600 hover:text-red-700"
                : "text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400"
            }`}
            title={parcel?.isFlagged ? "Unflag Parcel" : "Flag Parcel"}
          >
            <Flag className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleHoldParcel(parcel)}
            className={`p-2 ${
              parcel?.isOnHold
                ? "text-yellow-600 hover:text-yellow-700"
                : "text-slate-600 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400"
            }`}
            title={parcel?.isOnHold ? "Release Hold" : "Put on Hold"}
          >
            <Lock className="h-4 w-4" />
          </button>
          <div className="relative group">
            <button
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              title="More Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <div className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedParcel(parcel);
                    setAssignedPersonnel(parcel?.assignedPersonnel || "");
                    setShowAssignModal(true);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Personnel
                </button>
                <button
                  onClick={() => handleViewStatusLog(parcel)}
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Status Log
                </button>
                <button
                  onClick={() => handleReturnParcel(parcel)}
                  className="flex items-center px-4 py-2 text-sm text-orange-700 dark:text-orange-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                >
                  Return Parcel
                </button>
                <button
                  onClick={() => {
                    setSelectedParcel(parcel);
                    setShowConfirmDialog(true);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Parcel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Parcel Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track and manage all parcels in the system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                setFilterParams({
                  senderEmail: "",
                  receiverEmail: "",
                  status: "",
                })
              }
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={fetchParcels}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Filter Parcels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filterParams.status}
                onChange={(e) =>
                  setFilterParams({ ...filterParams, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
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

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <DataTable<Parcel>
            data={parcels}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search parcels by tracking number, sender, or recipient..."
          />
        </div>
      </div>

      {/* Parcel Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedParcel(null);
        }}
        title="Parcel Details"
        size="xl"
      >
        {selectedParcel && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tracking Number
                  </label>
                  <p className="text-slate-900 dark:text-slate-100 font-mono">
                    {selectedParcel.trackingNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Type
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedParcel.type}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedParcel.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Weight
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedParcel.weight} kg
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Cost
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    ${selectedParcel.cost}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <StatusBadge
                    status={selectedParcel?.status}
                    variant="parcel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  {selectedParcel.isUrgent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Urgent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      Normal
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sender & Recipient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Sender Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.senderName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.senderEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.senderPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Recipient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.recipientName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.recipientEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.recipientPhone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Address
                    </label>
                    <p className="text-slate-900 dark:text-slate-100">
                      {selectedParcel.recipientAddress.street}
                      <br />
                      {selectedParcel.recipientAddress.city},{" "}
                      {selectedParcel.recipientAddress.state}{" "}
                      {selectedParcel.recipientAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Delivery Type
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedParcel.deliveryType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Insured
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {selectedParcel.isInsured ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Created
                  </label>
                  <p className="text-slate-900 dark:text-slate-100">
                    {new Date(selectedParcel.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedParcel(null);
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  openStatusModal(selectedParcel);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedParcel(null);
          setNewStatus("");
        }}
        title="Update Parcel Status"
        size="md"
      >
        {selectedParcel && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Status
              </label>
              <StatusBadge status={selectedParcel?.status} variant="parcel" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedParcel(null);
                  setNewStatus("");
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={actionLoading || newStatus === selectedParcel?.status}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Personnel Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedParcel(null);
          setAssignedPersonnel("");
        }}
        title="Assign Delivery Personnel"
        size="md"
      >
        {selectedParcel && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Parcel: {selectedParcel.trackingNumber}
              </label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedParcel.senderName} → {selectedParcel.recipientName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Personnel
              </label>
              <p className="text-slate-900 dark:text-slate-100">
                {selectedParcel.assignedPersonnel || "Not assigned"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Personnel ID
              </label>
              <input
                type="text"
                placeholder="Enter personnel ID..."
                value={assignedPersonnel}
                onChange={(e) => setAssignedPersonnel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedParcel(null);
                  setAssignedPersonnel("");
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignPersonnel}
                disabled={actionLoading || !assignedPersonnel.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Assigning..." : "Assign Personnel"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Log Modal */}
      <Modal
        isOpen={showStatusLogModal}
        onClose={() => {
          setShowStatusLogModal(false);
          setSelectedParcel(null);
          setStatusLog([]);
        }}
        title="Parcel Status History"
        size="lg"
      >
        {selectedParcel && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Tracking: {selectedParcel.trackingNumber}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedParcel.senderName} → {selectedParcel.recipientName}
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {statusLog.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No status history available
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusLog.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <StatusBadge
                            status={entry?.status}
                            variant="parcel"
                          />
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {entry?.timestamp
                              ? new Date(entry.timestamp).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                        {entry?.updatedBy && (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Updated by: {entry.updatedBy}
                          </p>
                        )}
                        {entry?.notes && (
                          <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowStatusLogModal(false);
                  setSelectedParcel(null);
                  setStatusLog([]);
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteParcel}
        title="Delete Parcel"
        message={`Are you sure you want to delete parcel "${selectedParcel?.trackingNumber}"? This action cannot be undone.`}
        type="danger"
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
