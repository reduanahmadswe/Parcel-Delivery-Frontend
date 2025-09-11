"use client";

// Main Parcel Management Component
import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import ConfirmDialog from "@/pages/admin/ConfirmationDialog";
import DataTable from "@/pages/admin/ReusableDataTable";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ParcelDataTransformer } from "./dataTransformer";
import { FilterPanel } from "./filterPanel";
import {
  useNotification,
  useParcelActions,
  useParcels,
  useStatusLog,
} from "./hooks";
import { ParcelDetailsModal, StatusUpdateModal } from "./modals";
import { createParcelColumns } from "./tableColumns";
import { FilterParams, Parcel } from "./types";

export default function ParcelManagement() {
  // State management
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [filterParams, setFilterParams] = useState<FilterParams>({
    senderEmail: "",
    receiverEmail: "",
    status: "",
  });

  // Custom hooks
  const { notification, showNotification, hideNotification } =
    useNotification();
  const { parcels, setParcels, loading, fetchParcels } =
    useParcels(filterParams);
  const {
    actionLoading,
    updateStatus,
    flagParcel,
    holdParcel,
    returnParcel,
    deleteParcel,
  } = useParcelActions();
  const { statusLog, fetchStatusLog } = useStatusLog();

  // Filter parcels based on search term
  useEffect(() => {
    const filtered = ParcelDataTransformer.filterParcels(parcels, searchTerm);
    setFilteredParcels(filtered);
  }, [parcels, searchTerm]);

  // Event handlers
  const handleUpdateStatus = async () => {
    if (!selectedParcel || !newStatus) return;

    try {
      await updateStatus(selectedParcel.id, newStatus);

      // Update local state optimistically
      const updatedParcels = parcels.map((parcel) =>
        parcel.id === selectedParcel.id
          ? { ...parcel, status: newStatus as Parcel["status"] }
          : parcel
      );
      setParcels(updatedParcels);

      await fetchParcels();
      setShowStatusModal(false);
      setSelectedParcel(null);
      setNewStatus("");

      showNotification("success", "Parcel status updated successfully!");
    } catch (error: any) {
      console.error("Error updating parcel status:", error);

      let errorMessage = "Failed to update parcel status. Please try again.";
      if (error.response?.status === 400) {
        errorMessage =
          "Invalid request data. Please check the status value and try again.";
      } else if (error.response?.status === 404) {
        errorMessage =
          "Parcel not found. Please refresh the page and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to update this parcel.";
      }

      showNotification("error", errorMessage);
    }
  };

  const handleFlagParcel = async (parcel: Parcel) => {
    try {
      const newFlaggedState = !parcel.isFlagged;
      await flagParcel(parcel.id, newFlaggedState);
      await fetchParcels();
      showNotification(
        "success",
        `Parcel ${newFlaggedState ? "flagged" : "unflagged"} successfully!`
      );
    } catch (error) {
      console.error("Error flagging parcel:", error);
      showNotification("error", "Failed to flag parcel. Please try again.");
    }
  };

  const handleHoldParcel = async (parcel: Parcel) => {
    try {
      const newHoldState = !parcel.isOnHold;
      await holdParcel(parcel.id, newHoldState);
      await fetchParcels();
      showNotification(
        "success",
        `Parcel ${
          newHoldState ? "put on hold" : "released from hold"
        } successfully!`
      );
    } catch (error) {
      console.error("Error holding parcel:", error);
      showNotification(
        "error",
        "Failed to update parcel hold status. Please try again."
      );
    }
  };

  const handleReturnParcel = async (parcel: Parcel) => {
    try {
      await returnParcel(parcel.id);
      await fetchParcels();
      showNotification("success", "Parcel returned successfully!");
    } catch (error) {
      console.error("Error returning parcel:", error);
      showNotification("error", "Failed to return parcel. Please try again.");
    }
  };

  const handleDeleteParcel = async () => {
    if (!selectedParcel) return;

    try {
      await deleteParcel(selectedParcel.id);
      await fetchParcels();
      setShowConfirmDialog(false);
      setSelectedParcel(null);
      showNotification("success", "Parcel deleted successfully!");
    } catch (error) {
      console.error("Error deleting parcel:", error);
      showNotification("error", "Failed to delete parcel. Please try again.");
    }
  };

  const openDetailsModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowDetailsModal(true);
  };

  const openStatusModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setNewStatus(parcel?.status || "requested");
    setShowStatusModal(true);
  };

  const handleParcelsError = useCallback(
    (error: Error) => {
      showNotification(
        "error",
        "Failed to load parcels. Please refresh the page."
      );
    },
    [showNotification]
  );

  // Error handling for parcels hook
  useEffect(() => {
    const handleError = (error: Error) => {
      handleParcelsError(error);
    };

    // This is a simplified error handling - in a real app you might use error boundaries
    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason?.message?.includes("parcels")) {
        handleError(event.reason);
      }
    });

    return () => {
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, [handleParcelsError]);

  // Table columns configuration
  const columns = createParcelColumns({
    onDetailsClick: openDetailsModal,
    onEditClick: openDetailsModal, // For now, edit opens details
    onStatusClick: openStatusModal,
    onFlagClick: handleFlagParcel,
    onHoldClick: handleHoldParcel,
    onAssignClick: openDetailsModal, // For now, assign opens details
    onViewStatusLogClick: openDetailsModal, // For now, status log opens details
    onReturnClick: handleReturnParcel,
    onDeleteClick: (parcel: Parcel) => {
      setSelectedParcel(parcel);
      setShowConfirmDialog(true);
    },
  });

  return (
    <AdminLayout>
      {/* Notification Component */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm w-full transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200"
              : notification.type === "error"
              ? "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200"
              : "bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={hideNotification}
              className="ml-2 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-background">
        <FilterPanel
          filterParams={filterParams}
          setFilterParams={setFilterParams}
          onClearFilters={() =>
            setFilterParams({
              senderEmail: "",
              receiverEmail: "",
              status: "",
            })
          }
          onRefresh={fetchParcels}
        />

        {/* Search Results Summary */}
        {searchTerm && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Found {filteredParcels.length} parcel
              {filteredParcels.length !== 1 ? "s" : ""} matching &ldquo;
              {searchTerm}&rdquo;
            </span>
            <button
              onClick={() => setSearchTerm("")}
              className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="bg-background rounded-lg shadow border border-border hover:shadow-lg transition-all duration-300">
          <DataTable<Parcel>
            data={filteredParcels}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search by tracking number, sender, recipient, status..."
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {/* Parcel Details Modal */}
      <ParcelDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedParcel(null);
        }}
        parcel={selectedParcel}
        onUpdateStatus={openStatusModal}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedParcel(null);
          setNewStatus("");
        }}
        parcel={selectedParcel}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onUpdate={handleUpdateStatus}
        loading={actionLoading}
      />

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
