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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    // Reset to first page when filtering changes
    setCurrentPage(1);
  }, [parcels, searchTerm]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredParcels.length / itemsPerPage));
  const paginatedParcels = filteredParcels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle search term change with pagination reset
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

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
      {/* Modern Enhanced Notification System */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div
            className={`max-w-md w-full p-6 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-500 transform hover:scale-105 ${
              notification.type === "success"
                ? "parcel-notification-success"
                : notification.type === "error"
                ? "parcel-notification-error"
                : "parcel-notification-info"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    notification.type === "success"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : notification.type === "error"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  <span className="text-white font-bold text-xl">
                    {notification.type === "success"
                      ? "✓"
                      : notification.type === "error"
                      ? "✕"
                      : "ⓘ"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">
                    {notification.type === "success"
                      ? "Success"
                      : notification.type === "error"
                      ? "Error"
                      : "Information"}
                  </h4>
                  <p className="font-medium leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
              <button
                onClick={hideNotification}
                className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity duration-200 text-2xl font-bold leading-none hover:scale-110 transform"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Main Container with Enhanced Parcel Tracking Theme */}
      <div className="min-h-screen bg-[hsl(var(--background))] mt-8">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-8 pb-20">
          {/* Enhanced Filter Panel */}
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

          {/* Modern Search Results Summary */}
          {searchTerm && (
            <div className="relative overflow-hidden parcel-search-result p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
              <div className="relative flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
                    🔍 Search Results
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-lg">
                    Found{" "}
                    <span className="font-bold text-xl">
                      {filteredParcels.length}
                    </span>{" "}
                    parcel
                    {filteredParcels.length !== 1 ? "s" : ""} matching &ldquo;
                    <span className="font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">
                      {searchTerm}
                    </span>
                    &rdquo;
                  </p>
                </div>
                <button
                  onClick={() => setSearchTerm("")}
                  className="parcel-btn-secondary shadow-md hover:shadow-lg"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Data Table Container */}
          <div className="relative overflow-hidden parcel-card group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-purple-500/5 opacity-50"></div>
            <div className="relative">
              {/* Table Header Enhancement */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-border/50 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">📋</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Parcel Database
                      </h2>
                      <p className="text-muted-foreground">
                        Real-time parcel tracking and management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {loading && (
                      <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-xl">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Data Table */}
              <DataTable<Parcel>
                data={paginatedParcels}
                columns={columns}
                loading={loading}
                searchPlaceholder="🔍 Search by tracking number, sender, recipient, status, or location..."
                onSearch={handleSearchChange}
                pagination={{
                  page: currentPage,
                  totalPages: totalPages,
                  totalItems: filteredParcels.length,
                  itemsPerPage: itemsPerPage,
                  onPageChange: setCurrentPage,
                }}
              />
            </div>
          </div>
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
