"use client";

import api from "@/lib/ApiConfiguration";
import AdminLayout from "@/pages/admin/AdminDashboardLayout";
import ConfirmDialog from "@/pages/admin/ConfirmationDialog";
import Modal from "@/pages/admin/ModalDialogComponent";
import DataTable, { Column } from "@/pages/admin/ReusableDataTable";
import StatusBadge from "@/pages/admin/StatusIndicatorBadge";
import {
  Edit,
  Eye,
  Flag,
  Lock,
  MoreVertical,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ApiParcel {
  id?: number;
  _id?: string | number; // MongoDB ObjectId
  senderId?: string;
  receiverId?: string;
  senderInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  receiverInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  parcelDetails?: {
    type?: string;
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    description?: string;
    value?: number;
  };
  deliveryInfo?: {
    preferredDeliveryDate?: string | { $date: string };
    deliveryInstructions?: string;
    isUrgent?: boolean;
  };
  fee?: {
    baseFee?: number;
    weightFee?: number;
    urgentFee?: number;
    totalFee?: number;
    isPaid?: boolean;
  };
  currentStatus?: string;
  statusHistory?: Array<{
    status?: string;
    timestamp?: string | { $date: string };
    updatedBy?: string;
    updatedByType?: string;
    note?: string;
  }>;
  assignedDeliveryPersonnel?: string | null;
  isFlagged?: boolean;
  isHeld?: boolean;
  isBlocked?: boolean;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
  trackingId?: string;
  // Legacy field support for backward compatibility
  trackingNumber?: string;
  tracking_number?: string;
  status?: string; // fallback to currentStatus
  // Additional legacy fields
  type?: string;
  parcelType?: string;
  description?: string;
  weight?: number;
  weightInKg?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  length?: number;
  width?: number;
  height?: number;
  senderName?: string;
  sender?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  sender_name?: string;
  senderEmail?: string;
  sender_email?: string;
  senderPhone?: string;
  sender_phone?: string;
  recipientName?: string;
  recipient?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
  receiver?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  recipient_name?: string;
  receiver_name?: string;
  recipientEmail?: string;
  recipient_email?: string;
  receiver_email?: string;
  recipientPhone?: string;
  recipient_phone?: string;
  receiver_phone?: string;
  recipientAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  cost?: number;
  price?: number;
  amount?: number;
  deliveryType?: string;
  delivery_type?: string;
  isInsured?: boolean;
  is_insured?: boolean;
  isUrgent?: boolean;
  is_urgent?: boolean;
  priority?: string;
  is_flagged?: boolean;
  isOnHold?: boolean;
  is_on_hold?: boolean;
  assignedPersonnel?: string;
  assigned_personnel?: string;
  assignedTo?: string;
  [key: string]: unknown; // For any additional fields
}

interface Parcel extends Record<string, unknown> {
  id: string | number;
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
    | "requested"
    | "approved"
    | "dispatched"
    | "in-transit"
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
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusLogModal, setShowStatusLogModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [editFormData, setEditFormData] = useState<Partial<Parcel>>({});
  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>([]);
  const [assignedPersonnel, setAssignedPersonnel] = useState<string>("");
  const [filterParams, setFilterParams] = useState({
    senderEmail: "",
    receiverEmail: "",
    status: "",
  });

  // Notification helper function
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  const fetchParcels = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching parcels from API...");
      console.log("API Base URL:", api.defaults.baseURL);

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

      // Try admin-specific endpoint first, fallback to general parcels endpoint
      let response;
      try {
        response = await api.get(`/admin${endpoint}`);
        console.log("Using admin parcels endpoint");
      } catch {
        console.log(
          "Admin endpoint not available, trying general parcels endpoint"
        );
        response = await api.get(endpoint);
      }

      console.log("Full API response:", JSON.stringify(response.data, null, 2));

      // Try different possible data structures
      let parcelsData = null;
      if (response.data.data && Array.isArray(response.data.data)) {
        parcelsData = response.data.data;
        console.log("Using response.data.data");
      } else if (
        response.data.parcels &&
        Array.isArray(response.data.parcels)
      ) {
        parcelsData = response.data.parcels;
        console.log("Using response.data.parcels");
      } else if (Array.isArray(response.data)) {
        parcelsData = response.data;
        console.log("Using response.data directly");
      } else {
        console.log("No valid parcels array found in response");
        parcelsData = [];
      }

      console.log("Extracted parcels data:", parcelsData);
      console.log("Parcels data type:", typeof parcelsData);
      console.log("Is array:", Array.isArray(parcelsData));
      console.log("Length:", parcelsData?.length);

      // Debug: Show first parcel raw structure
      if (parcelsData && parcelsData.length > 0) {
        console.log(
          "🔍 First raw parcel from API:",
          JSON.stringify(parcelsData[0], null, 2)
        );
        console.log("🔍 Key fields check:", {
          hasTrackingId: "trackingId" in parcelsData[0],
          hasSenderInfo: "senderInfo" in parcelsData[0],
          hasReceiverInfo: "receiverInfo" in parcelsData[0],
          trackingValue: parcelsData[0]?.trackingId,
          senderName: parcelsData[0]?.senderInfo?.name,
          receiverName: parcelsData[0]?.receiverInfo?.name,
        });
      }

      // Validate and normalize parcel data
      const validParcels: Parcel[] =
        Array.isArray(parcelsData) && parcelsData.length > 0
          ? parcelsData.map((parcel: ApiParcel, index: number) => {
              console.log(
                `Processing parcel ${index}:`,
                JSON.stringify(parcel, null, 2)
              );

              // Handle MongoDB _id field
              const parcelId = parcel.id || parcel._id || 0;

              const processedParcel: Parcel = {
                id: parcelId,
                trackingNumber:
                  parcel.trackingId ||
                  parcel.trackingNumber ||
                  parcel.tracking_number ||
                  `TRK${parcelId.toString().padStart(6, "0")}`,
                type:
                  parcel.parcelDetails?.type ||
                  parcel.type ||
                  parcel.parcelType ||
                  "Standard",
                description:
                  parcel.parcelDetails?.description ||
                  parcel.description ||
                  "Package",
                weight:
                  parcel.parcelDetails?.weight ||
                  parcel.weight ||
                  parcel.weightInKg ||
                  1.0,
                dimensions: {
                  length:
                    parcel.parcelDetails?.dimensions?.length ||
                    parcel.dimensions?.length ||
                    parcel.length ||
                    10,
                  width:
                    parcel.parcelDetails?.dimensions?.width ||
                    parcel.dimensions?.width ||
                    parcel.width ||
                    10,
                  height:
                    parcel.parcelDetails?.dimensions?.height ||
                    parcel.dimensions?.height ||
                    parcel.height ||
                    10,
                },
                status: (parcel.currentStatus ||
                  parcel.status ||
                  "requested") as
                  | "requested"
                  | "approved"
                  | "dispatched"
                  | "in-transit"
                  | "delivered"
                  | "cancelled"
                  | "returned",
                senderName:
                  parcel.senderInfo?.name ||
                  parcel.senderName ||
                  parcel.sender?.name ||
                  parcel.sender_name ||
                  "Unknown Sender",
                senderEmail:
                  parcel.senderInfo?.email ||
                  parcel.senderEmail ||
                  parcel.sender?.email ||
                  parcel.sender_email ||
                  "sender@example.com",
                senderPhone:
                  parcel.senderInfo?.phone ||
                  parcel.senderPhone ||
                  parcel.sender?.phone ||
                  parcel.sender_phone ||
                  "+8801700000000",
                recipientName:
                  parcel.receiverInfo?.name ||
                  parcel.recipientName ||
                  parcel.recipient?.name ||
                  parcel.receiver?.name ||
                  parcel.recipient_name ||
                  parcel.receiver_name ||
                  "Unknown Recipient",
                recipientEmail:
                  parcel.receiverInfo?.email ||
                  parcel.recipientEmail ||
                  parcel.recipient?.email ||
                  parcel.receiver?.email ||
                  parcel.recipient_email ||
                  parcel.receiver_email ||
                  "recipient@example.com",
                recipientPhone:
                  parcel.receiverInfo?.phone ||
                  parcel.recipientPhone ||
                  parcel.recipient?.phone ||
                  parcel.receiver?.phone ||
                  parcel.recipient_phone ||
                  parcel.receiver_phone ||
                  "+8801800000000",
                recipientAddress: {
                  street:
                    parcel.receiverInfo?.address?.street ||
                    parcel.recipientAddress?.street ||
                    parcel.recipient?.address?.street ||
                    parcel.deliveryAddress?.street ||
                    "Street Address",
                  city:
                    parcel.receiverInfo?.address?.city ||
                    parcel.recipientAddress?.city ||
                    parcel.recipient?.address?.city ||
                    parcel.deliveryAddress?.city ||
                    "Dhaka",
                  state:
                    parcel.receiverInfo?.address?.state ||
                    parcel.recipientAddress?.state ||
                    parcel.recipient?.address?.state ||
                    parcel.deliveryAddress?.state ||
                    "Dhaka Division",
                  zipCode:
                    parcel.receiverInfo?.address?.zipCode ||
                    parcel.recipientAddress?.zipCode ||
                    parcel.recipient?.address?.zipCode ||
                    parcel.deliveryAddress?.zipCode ||
                    "1000",
                },
                cost:
                  parcel.fee?.totalFee ||
                  parcel.cost ||
                  parcel.price ||
                  parcel.amount ||
                  100,
                deliveryType:
                  parcel.deliveryType || parcel.delivery_type || "Standard",
                isInsured: parcel.isInsured || parcel.is_insured || false,
                isUrgent:
                  parcel.deliveryInfo?.isUrgent ||
                  parcel.isUrgent ||
                  parcel.is_urgent ||
                  parcel.priority === "urgent" ||
                  false,
                isFlagged: parcel.isFlagged || parcel.is_flagged || false,
                isOnHold:
                  parcel.isHeld ||
                  parcel.isOnHold ||
                  parcel.is_on_hold ||
                  false,
                assignedPersonnel:
                  parcel.assignedDeliveryPersonnel ||
                  parcel.assignedPersonnel ||
                  parcel.assigned_personnel ||
                  parcel.assignedTo ||
                  "",
                createdAt:
                  typeof parcel.createdAt === "string"
                    ? parcel.createdAt
                    : parcel.createdAt?.$date || new Date().toISOString(),
                updatedAt:
                  typeof parcel.updatedAt === "string"
                    ? parcel.updatedAt
                    : parcel.updatedAt?.$date || new Date().toISOString(),
              };

              console.log(`📦 Processed parcel ${index}:`, {
                originalTrackingId: parcel.trackingId,
                finalTrackingNumber: processedParcel.trackingNumber,
                senderName: processedParcel.senderName,
                recipientName: processedParcel.recipientName,
                status: processedParcel.status,
              });
              return processedParcel;
            })
          : []; // Return empty array if no API data is available

      console.log("Final processed parcels:", validParcels.length);
      console.log(
        "Sample processed parcel:",
        JSON.stringify(validParcels[0], null, 2)
      );

      setParcels(validParcels);
      setFilteredParcels(validParcels); // Initialize filtered parcels
    } catch (error) {
      console.error("Error fetching parcels:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      showNotification(
        "error",
        "Failed to load parcels. Please refresh the page."
      );

      // Set empty array on error
      setParcels([]);
      setFilteredParcels([]);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  // Filter parcels based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredParcels(parcels);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = parcels.filter((parcel) => {
        // Search in tracking number, sender name, recipient name, status, and description
        const searchableFields = [
          parcel.trackingNumber,
          parcel.senderName,
          parcel.senderEmail,
          parcel.recipientName,
          parcel.recipientEmail,
          parcel.status,
          parcel.description,
          parcel.type,
        ];

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredParcels(filtered);
    }
  }, [parcels, searchTerm]);

  const handleUpdateStatus = async () => {
    if (!selectedParcel || !newStatus) return;

    let requestInterceptor: number | null = null;

    try {
      setActionLoading(true);

      // Use the correct endpoint from backend documentation: PATCH /api/parcels/:id/status
      // Only send the required fields to avoid validation issues with other fields
      const requestBody = {
        status: newStatus,
        // Don't include deliveryInfo to avoid preferredDeliveryDate validation issues
      };

      const parcelId = selectedParcel.id || selectedParcel._id;

      console.log("🔄 Sending status update request:", {
        url: `/parcels/${parcelId}/status`,
        method: "PATCH",
        body: requestBody,
        parcelId: parcelId,
        parcelIdType: typeof parcelId,
        parcelIdLength: parcelId?.toString().length,
        newStatus: newStatus,
        selectedParcel: selectedParcel,
        // Add axios config details
        axiosBaseURL: api.defaults.baseURL,
        axiosHeaders: api.defaults.headers,
      });

      console.log(
        "📋 Exact request body being sent:",
        JSON.stringify(requestBody, null, 2)
      );

      // Add a temporary request interceptor to log the exact request
      requestInterceptor = api.interceptors.request.use((config) => {
        if (config.url?.includes("/status")) {
          console.log("🌐 Axios Request Config:", {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            data: config.data,
            headers: config.headers,
            auth: config.headers?.Authorization ? "Present" : "Missing",
          });
        }
        return config;
      });

      const response = await api.patch(
        `/parcels/${parcelId}/status`,
        requestBody
      );

      // Update local state optimistically
      const updatedParcels = parcels.map((parcel) =>
        parcel.id === selectedParcel.id
          ? { ...parcel, status: newStatus as Parcel["status"] }
          : parcel
      );
      setParcels(updatedParcels);
      setFilteredParcels(updatedParcels);

      await fetchParcels();
      setShowStatusModal(false);
      setSelectedParcel(null);
      setNewStatus("");

      console.log("Parcel status updated successfully");
      showNotification("success", "Parcel status updated successfully!");
    } catch (error: any) {
      console.error("Error updating parcel status:", error);

      // Enhanced error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);

        // Log detailed validation errors
        if (error.response.data?.data?.errors) {
          console.error("Validation errors:", error.response.data.data.errors);
        }
      }

      // More specific error messages
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
    } finally {
      // Clean up the request interceptor
      if (requestInterceptor !== null) {
        api.interceptors.request.eject(requestInterceptor);
      }
      setActionLoading(false);
    }
  };

  const handleFlagParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);

      // Use the correct endpoint from backend documentation: PATCH /api/parcels/:id/flag
      const newFlaggedState = !parcel.isFlagged;
      await api.patch(`/parcels/${parcel.id}/flag`, {
        isFlagged: newFlaggedState,
        note: newFlaggedState
          ? "Flagged for review by admin"
          : "Flag removed by admin",
      });

      await fetchParcels();
      console.log("Parcel flagged successfully");
      showNotification(
        "success",
        `Parcel ${newFlaggedState ? "flagged" : "unflagged"} successfully!`
      );
    } catch (error) {
      console.error("Error flagging parcel:", error);
      showNotification("error", "Failed to flag parcel. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleHoldParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);

      // Use the correct endpoint from backend documentation: PATCH /api/parcels/:id/hold
      const newHoldState = !parcel.isOnHold;
      await api.patch(`/parcels/${parcel.id}/hold`, {
        isHeld: newHoldState,
        note: newHoldState
          ? "Put on hold by admin"
          : "Released from hold by admin",
      });

      await fetchParcels();
      console.log(
        `Parcel ${
          newHoldState ? "put on hold" : "released from hold"
        } successfully`
      );
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnParcel = async (parcel: Parcel) => {
    try {
      setActionLoading(true);

      // Use the correct endpoint from backend documentation: PATCH /api/parcels/:id/return
      await api.patch(`/parcels/${parcel.id}/return`, {
        note: "Returned to sender by admin",
      });

      await fetchParcels();
      console.log("Parcel returned successfully");
      showNotification("success", "Parcel returned successfully!");
    } catch (error) {
      console.error("Error returning parcel:", error);
      showNotification("error", "Failed to return parcel. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPersonnel = async () => {
    if (!selectedParcel || !assignedPersonnel) return;

    try {
      setActionLoading(true);

      // Use the correct endpoint from backend documentation: PATCH /api/parcels/:id/assign-personnel
      await api.patch(`/parcels/${selectedParcel.id}/assign-personnel`, {
        deliveryPersonnel: assignedPersonnel,
      });

      await fetchParcels();
      setShowAssignModal(false);
      setSelectedParcel(null);
      setAssignedPersonnel("");
      showNotification("success", "Personnel assigned successfully!");
    } catch (error) {
      console.error("Error assigning personnel:", error);
      showNotification(
        "error",
        "Failed to assign personnel. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const fetchStatusLog = async (parcelId: string | number) => {
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

      // Use the correct endpoint from backend documentation: DELETE /api/parcels/:id
      await api.delete(`/parcels/${selectedParcel.id}`);

      await fetchParcels();
      setShowConfirmDialog(false);
      setSelectedParcel(null);
      showNotification("success", "Parcel deleted successfully!");
    } catch (error) {
      console.error("Error deleting parcel:", error);
      showNotification("error", "Failed to delete parcel. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailsModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowDetailsModal(true);
  };

  const openEditModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setEditFormData({
      trackingNumber: parcel.trackingNumber,
      senderName: parcel.senderName,
      senderEmail: parcel.senderEmail,
      senderPhone: parcel.senderPhone,
      recipientName: parcel.recipientName,
      recipientEmail: parcel.recipientEmail,
      recipientPhone: parcel.recipientPhone,
      status: parcel.status,
      type: parcel.type,
      description: parcel.description,
      weight: parcel.weight,
      cost: parcel.cost,
      isUrgent: parcel.isUrgent,
      recipientAddress: parcel.recipientAddress,
    });
    setShowEditModal(true);
  };

  const handleUpdateParcel = async () => {
    if (!selectedParcel || !editFormData) return;

    try {
      setActionLoading(true);
      console.log("📝 Updating parcel:", selectedParcel.id, editFormData);

      // Since there's no general parcel update endpoint in the API documentation,
      // we'll update the status if it changed, and show a message for other fields
      if (
        editFormData.status &&
        editFormData.status !== selectedParcel.status
      ) {
        await api.patch(`/parcels/${selectedParcel.id}/status`, {
          status: editFormData.status,
          location: selectedParcel.currentLocation || "Processing Center",
          note: "Status updated via edit form",
        });
      }

      // For other fields, we'll show a notification that only status can be updated
      // In a real application, you might want to implement specific endpoints for each field
      if (
        editFormData.senderName !== selectedParcel.senderName ||
        editFormData.recipientName !== selectedParcel.recipientName ||
        editFormData.trackingNumber !== selectedParcel.trackingNumber
      ) {
        showNotification(
          "info",
          "Only status updates are currently supported. Other fields require separate API endpoints."
        );
      }

      await fetchParcels();
      setShowEditModal(false);
      setSelectedParcel(null);
      setEditFormData({});

      if (
        editFormData.status &&
        editFormData.status !== selectedParcel.status
      ) {
        showNotification("success", "Parcel status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating parcel:", error);
      showNotification("error", "Failed to update parcel. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openStatusModal = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setNewStatus(parcel?.status || "requested");
    setShowStatusModal(true);
  };

  const handleViewStatusLog = async (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowStatusLogModal(true);
    await fetchStatusLog(parcel.id);
  };

  const statusOptions = [
    "requested",
    "approved",
    "dispatched",
    "in-transit",
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
            className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => openEditModal(parcel)}
            className="p-2 text-muted-foreground hover:text-blue-500 transition-colors duration-300"
            title="Edit Parcel"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => openStatusModal(parcel)}
            className="p-2 text-muted-foreground hover:text-green-500 transition-colors duration-300"
            title="Update Status"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleFlagParcel(parcel)}
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
            onClick={() => handleHoldParcel(parcel)}
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
              onClick={() => setNotification(null)}
              className="ml-2 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-background">
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
              onClick={() =>
                setFilterParams({
                  senderEmail: "",
                  receiverEmail: "",
                  status: "",
                })
              }
              className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5 transition-all duration-300"
            >
              Clear Filters
            </button>
            <button
              onClick={fetchParcels}
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
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Tracking Number
                  </label>
                  <p className="text-foreground font-mono">
                    {selectedParcel.trackingNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <p className="text-foreground">{selectedParcel.type}</p>
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

      {/* Edit Parcel Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedParcel(null);
          setEditFormData({});
        }}
        title="Edit Parcel"
        size="xl"
      >
        {selectedParcel && editFormData && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Parcel Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.trackingNumber || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        trackingNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value as Parcel["status"],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={editFormData.type || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.weight || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.cost || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        cost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={editFormData.isUrgent || false}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        isUrgent: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="isUrgent"
                    className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Urgent Delivery
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Sender Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Sender Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.senderName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        senderName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.senderEmail || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        senderEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sender Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.senderPhone || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        senderPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Recipient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.recipientName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        recipientName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.recipientEmail || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        recipientEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipient Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.recipientPhone || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        recipientPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({});
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateParcel}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Updating..." : "Update Parcel"}
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
