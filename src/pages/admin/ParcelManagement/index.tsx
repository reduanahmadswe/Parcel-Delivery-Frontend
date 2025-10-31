"use client";

import AdminLayout from "../AdminDashboardLayout";
import ConfirmDialog from "../../../components/modals/ConfirmationDialog";

import { Search, Package, MapPin, Calendar, User, Mail, Phone, Clock, Eye, Edit, Flag, Lock, RefreshCw, Trash2, UserPlus, MoreVertical } from "lucide-react";
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

import { FilterParams, Parcel } from "../../../services/parcelTypes";

export default function ParcelManagement() {
  
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
    trackingNumber: "TRK-202",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    let filtered = parcels;

    filtered = ParcelDataTransformer.filterParcelsByParams(filtered, filterParams);

    if (searchTerm.trim()) {
      filtered = ParcelDataTransformer.filterParcels(filtered, searchTerm);
    }
    
    setFilteredParcels(filtered);
    
    setCurrentPage(1);
  }, [parcels, searchTerm, filterParams]);

  const totalPages = Math.max(1, Math.ceil(filteredParcels.length / itemsPerPage));
  const paginatedParcels = filteredParcels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async () => {
    if (!selectedParcel || !newStatus) return;

    const updatedParcels = parcels.map((parcel) =>
      parcel.id === selectedParcel.id
        ? { ...parcel, status: newStatus as Parcel["status"] }
        : parcel
    );
    setParcels(updatedParcels);

    setShowStatusModal(false);
    const previousParcel = selectedParcel;
    setSelectedParcel(null);
    setNewStatus("");

    try {
      
      await updateStatus(previousParcel.id, newStatus);

      setTimeout(() => {
        fetchParcels(true);
      }, 100);

      showNotification("success", "Parcel status updated successfully!");
    } catch (error: any) {
      
      setParcels(parcels);
      
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
    const newFlaggedState = !parcel.isFlagged;

    const updatedParcels = parcels.map((p) =>
      p.id === parcel.id ? { ...p, isFlagged: newFlaggedState } : p
    );
    setParcels(updatedParcels);
    
    try {
      
      await flagParcel(parcel.id, newFlaggedState);

      setTimeout(() => {
        fetchParcels(true);
      }, 100);
      
      showNotification(
        "success",
        `Parcel ${newFlaggedState ? "flagged" : "unflagged"} successfully!`
      );
    } catch (error) {
      
      setParcels(parcels);
      showNotification("error", "Failed to flag parcel. Please try again.");
    }
  };

  const handleHoldParcel = async (parcel: Parcel) => {
    const newHoldState = !parcel.isOnHold;

    const updatedParcels = parcels.map((p) =>
      p.id === parcel.id ? { ...p, isOnHold: newHoldState } : p
    );
    setParcels(updatedParcels);
    
    try {
      
      await holdParcel(parcel.id, newHoldState);

      setTimeout(() => {
        fetchParcels(true);
      }, 100);
      
      showNotification(
        "success",
        `Parcel ${
          newHoldState ? "put on hold" : "released from hold"
        } successfully!`
      );
    } catch (error) {
      
      setParcels(parcels);
      showNotification(
        "error",
        "Failed to update parcel hold status. Please try again."
      );
    }
  };

  const handleReturnParcel = async (parcel: Parcel) => {
    
    const updatedParcels = parcels.map((p) =>
      p.id === parcel.id ? { ...p, status: 'returned' as Parcel["status"] } : p
    );
    setParcels(updatedParcels);
    
    try {
      
      await returnParcel(parcel.id);

      setTimeout(() => {
        fetchParcels(true);
      }, 100);
      
      showNotification("success", "Parcel returned successfully!");
    } catch (error) {
      
      setParcels(parcels);
      showNotification("error", "Failed to return parcel. Please try again.");
    }
  };

  const handleDeleteParcel = async () => {
    if (!selectedParcel) return;

    const updatedParcels = parcels.filter((p) => p.id !== selectedParcel.id);
    setParcels(updatedParcels);
    setShowConfirmDialog(false);
    const deletedParcelId = selectedParcel.id;
    setSelectedParcel(null);
    
    try {
      
      await deleteParcel(deletedParcelId);

      setTimeout(() => {
        fetchParcels(true);
      }, 100);
      
      showNotification("success", "Parcel deleted successfully!");
    } catch (error) {
      
      setTimeout(() => {
        fetchParcels(true);
      }, 100);
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

  useEffect(() => {
    const handleError = (error: Error) => {
      handleParcelsError(error);
    };

    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason?.message?.includes("parcels")) {
        handleError(event.reason);
      }
    });

    return () => {
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, [handleParcelsError]);

  useEffect(() => {
    const handleQuickFind = (event: CustomEvent) => {
      const { trackingNumber } = event.detail;
      const foundParcel = parcels.find(
        (parcel) => parcel.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
      
      if (foundParcel) {
        
        setSelectedParcel(foundParcel);
        setShowDetailsModal(true);

        showNotification("success", `Parcel found: ${trackingNumber}`);
      } else {
        
        showNotification("error", `No parcel found with tracking number: ${trackingNumber}`);
      }
    };

    window.addEventListener('quickFindParcel', handleQuickFind as EventListener);

    return () => {
      window.removeEventListener('quickFindParcel', handleQuickFind as EventListener);
    };
  }, [parcels, showNotification]);

  return (
    <AdminLayout>
      {}
      {notification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 animate-fade-in max-w-[calc(100vw-2rem)] sm:max-w-md">
          <div
            className={`w-full p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-500 transform hover:scale-105 ${
              notification.type === "success"
                ? "parcel-notification-success"
                : notification.type === "error"
                ? "parcel-notification-error"
                : "parcel-notification-info"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5 sm:space-x-3 lg:space-x-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                    notification.type === "success"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : notification.type === "error"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                >
                  <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
                    {notification.type === "success"
                      ? "✓"
                      : notification.type === "error"
                      ? "✕"
                      : "ⓘ"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1">
                    {notification.type === "success"
                      ? "Success"
                      : notification.type === "error"
                      ? "Error"
                      : "Information"}
                  </h4>
                  <p className="font-medium leading-relaxed text-xs sm:text-sm lg:text-base">
                    {notification.message}
                  </p>
                </div>
              </div>
              <button
                onClick={hideNotification}
                className="ml-2 sm:ml-3 lg:ml-4 text-current opacity-70 hover:opacity-100 transition-opacity duration-200 text-xl sm:text-2xl font-bold leading-none hover:scale-110 transform flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="min-h-screen bg-[hsl(var(--background))] mt-4 sm:mt-6 lg:mt-8">
        <div className="max-w-7xl mx-auto pt-1 sm:pt-2 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 lg:space-y-8 pb-12 sm:pb-16 lg:pb-20">
          {}
          <FilterPanel
            filterParams={filterParams}
            setFilterParams={setFilterParams}
            onClearFilters={() =>
              setFilterParams({
                senderEmail: "",
                receiverEmail: "",
                status: "",
                trackingNumber: "TRK-202",
              })
            }
            onRefresh={fetchParcels}
          />

          {}
          {searchTerm && (
            <div className="relative overflow-hidden parcel-search-result p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Search className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 dark:text-red-200 mb-1 sm:mb-1.5 lg:mb-2">
                    🔍 Search Results
                  </h3>
                  <p className="text-red-700 dark:text-red-300 text-sm sm:text-base lg:text-lg">
                    Found{" "}
                    <span className="font-bold text-base sm:text-lg lg:text-xl">
                      {filteredParcels.length}
                    </span>{" "}
                    parcel
                    {filteredParcels.length !== 1 ? "s" : ""} matching &ldquo;
                    <span className="font-bold bg-red-100 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                      {searchTerm}
                    </span>
                    &rdquo;
                  </p>
                </div>
                <button
                  onClick={() => setSearchTerm("")}
                  className="parcel-btn-secondary shadow-md hover:shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {}
          <div className="relative overflow-hidden bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-red-500/10 transition-all duration-500 group hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              {}
              <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-purple-500/10 border-b border-border/30 p-4 sm:p-6 lg:p-8 rounded-t-2xl sm:rounded-t-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2.5 sm:space-x-3 lg:space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg sm:text-xl">📋</span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                        Parcel Database
                      </h2>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Real-time parcel tracking and management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {loading && (
                      <div className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm">
                          Loading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {}
              {loading ? (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 animate-pulse"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gray-300 dark:bg-gray-700 rounded-xl sm:rounded-2xl"></div>
                        <div className="flex-1 space-y-1.5 sm:space-y-2">
                          <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                          <div className="h-2.5 sm:h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
                  {paginatedParcels.map((parcel, index) => (
                    <div
                      key={parcel.id || index}
                      className="group/card bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 isolate"
                    >
                      <div className="p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                          {}
                          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 flex-1 w-full xs:w-auto">
                            {}
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover/card:shadow-xl group-hover/card:scale-105 transition-all duration-300">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                              </div>
                              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-green-500 border-2 border-background rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 mb-1 sm:mb-1.5 lg:mb-2 flex-wrap">
                                <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-foreground group-hover/card:text-red-600 transition-colors duration-300 truncate">
                                  {parcel.trackingNumber}
                                </h3>
                                {}
                                <span className={`inline-flex items-center px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow-sm ${
                                  parcel.isUrgent 
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400'
                                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400'
                                }`}>
                                  {parcel.isUrgent ? 'URGENT' : 'NORMAL'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 lg:gap-4 text-[11px] sm:text-xs lg:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 min-w-0">
                                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                                  <span className="truncate">From: {parcel.senderName}</span>
                                </div>
                                <div className="flex items-center gap-1 min-w-0">
                                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                                  <span className="truncate">To: {parcel.recipientName}</span>
                                </div>
                                <div className="flex items-center gap-1 min-w-0">
                                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                                  <span className="truncate">{parcel.recipientAddress?.street || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                                  <span className="whitespace-nowrap">{new Date(parcel.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {}
                          <div className="flex items-center justify-between xs:justify-end gap-2 sm:gap-3 lg:gap-4 w-full xs:w-auto">
                            {}
                            <div className="flex flex-col xs:items-end gap-1 sm:gap-1.5 lg:gap-2">
                              <span className={`inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold border shadow-sm hover:shadow-md transition-all duration-300 group-hover/card:scale-105 ${
                                parcel.status === 'approved' 
                                  ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-300 border-green-300/50 dark:border-green-600/50'
                                  : parcel.status === 'requested'
                                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 text-yellow-800 dark:text-yellow-300 border-yellow-300/50 dark:border-yellow-600/50'
                                  : parcel.status === 'delivered'
                                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-300 border-blue-300/50 dark:border-blue-600/50'
                                  : parcel.status === 'in-transit'
                                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-800 dark:text-purple-300 border-purple-300/50 dark:border-purple-600/50'
                                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 text-gray-800 dark:text-gray-300 border-gray-300/50 dark:border-gray-600/50'
                              }`}>
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                                  parcel.status === 'approved' ? 'bg-green-500' :
                                  parcel.status === 'requested' ? 'bg-yellow-500' :
                                  parcel.status === 'delivered' ? 'bg-blue-500' :
                                  parcel.status === 'in-transit' ? 'bg-purple-500' : 'bg-gray-500'
                                }`}></div>
                                <span>{parcel.status.toUpperCase()}</span>
                              </span>
                              <span className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(parcel.updatedAt || parcel.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            {}
                            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 transition-all duration-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParcel(parcel);
                                  setShowDetailsModal(true);
                                }}
                                className="group/btn-view relative p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 text-purple-600 hover:text-white hover:shadow-purple-500/25"
                                title="View Details"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover/btn-view:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover/btn-view:scale-110 transition-all duration-300" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openStatusModal(parcel);
                                }}
                                className="group/btn-edit relative p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 text-green-600 hover:text-white hover:shadow-green-500/25"
                                title="Edit Status"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn-edit:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                                <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover/btn-edit:scale-110 transition-all duration-300" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFlagParcel(parcel);
                                }}
                                className={`group/btn-flag relative p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 ${
                                  parcel?.isFlagged
                                    ? "text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md shadow-red-500/25"
                                    : "text-red-600 hover:text-white hover:shadow-red-500/25"
                                }`}
                                title={parcel?.isFlagged ? "Unflag Parcel" : "Flag Parcel"}
                              >
                                {!parcel?.isFlagged && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover/btn-flag:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                                )}
                                <Flag className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover/btn-flag:scale-110 transition-all duration-300 ${
                                  parcel?.isFlagged ? "fill-current animate-pulse" : ""
                                }`} />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHoldParcel(parcel);
                                }}
                                className={`group/btn-hold relative p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden z-10 ${
                                  parcel?.isOnHold
                                    ? "text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-md shadow-amber-500/25"
                                    : "text-amber-600 hover:text-white hover:shadow-amber-500/25"
                                }`}
                                title={parcel?.isOnHold ? "Release Hold" : "Put on Hold"}
                              >
                                {!parcel?.isOnHold && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover/btn-hold:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                                )}
                                <Lock className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 relative z-10 group-hover/btn-hold:scale-110 transition-all duration-300 ${parcel?.isOnHold ? 'animate-pulse' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="h-0.5 sm:h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  ))}
                </div>
              )}

              {}
              {filteredParcels.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-background/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border/50">
                  <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                    Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredParcels.length)}</span> of <span className="font-bold">{filteredParcels.length}</span> parcels
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-background border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                    >
                      <span className="hidden xs:inline">Previous</span>
                      <span className="xs:hidden">Prev</span>
                    </button>

                    {}
                    {(() => {
                      const maxVisiblePages = window.innerWidth < 640 ? 3 : 4;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 bg-background border border-border hover:bg-muted text-xs sm:text-sm"
                          >
                            1
                          </button>
                        );
                        
                        if (startPage > 2) {
                          pages.push(
                            <span key="dots-start" className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">
                              ...
                            </span>
                          );
                        }
                      }

                      for (let page = startPage; page <= endPage; page++) {
                        pages.push(
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                              page === currentPage
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-background border border-border hover:bg-muted'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="dots-end" className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">
                              ...
                            </span>
                          );
                        }
                        
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg transition-all duration-200 bg-background border border-border hover:bg-muted text-xs sm:text-sm"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-background border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {}
              {filteredParcels.length === 0 && !loading && (
                <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-2xl">
                      <Package className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mt-4 sm:mt-5 lg:mt-6 mb-1.5 sm:mb-2">No Parcels Found</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm lg:text-base max-w-md mx-auto">
                    {searchTerm ? `No parcels match your search for "${searchTerm}"` : "No parcels available at the moment"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <ParcelDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedParcel(null);
        }}
        parcel={selectedParcel}
        onUpdateStatus={openStatusModal}
      />

      {}
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

      {}
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

