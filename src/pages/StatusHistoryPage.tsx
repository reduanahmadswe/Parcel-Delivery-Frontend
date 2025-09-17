"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import api from "../lib/ApiConfiguration";

interface StatusHistoryItem {
  status: string;
  timestamp: string | { $date: string };
  location?: string;
  note?: string;
  updatedBy?: string;
  updatedByType?: string;
}

interface ParcelDetails {
  trackingId: string;
  trackingNumber?: string; // For backward compatibility
  description?: string;
  currentStatus: string;
  senderInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  receiverInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  senderName?: string; // For backward compatibility
  recipientName?: string; // For backward compatibility
  statusHistory: StatusHistoryItem[];
  parcelDetails?: {
    type: string;
    weight: number;
    description: string;
    value: number;
  };
  fee?: {
    totalFee: number;
    baseFee: number;
    weightFee: number;
    urgentFee: number;
    isPaid: boolean;
  };
  deliveryInfo?: {
    preferredDeliveryDate: string | { $date: string };
    deliveryInstructions: string;
    isUrgent: boolean;
  };
  createdAt: string | { $date: string };
  updatedAt: string | { $date: string };
}

function ParcelStatusHistoryContent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const parcelId = searchParams.get("id");
  const [parcel, setParcel] = useState<ParcelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug log for URL parameter
  console.log("🔍 StatusHistoryPage loaded with:", {
    url: location.pathname + location.search,
    parcelId: parcelId,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  // Helper function to extract date from MongoDB date format or regular string
  const extractDate = (dateInput: string | { $date: string }): Date => {
    if (typeof dateInput === "string") {
      return new Date(dateInput);
    }
    return new Date(dateInput.$date);
  };

  // Helper function to format date with detailed information
  const formatDetailedDate = (dateInput: string | { $date: string }) => {
    const date = extractDate(dateInput);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const formattedDate = date.toLocaleDateString("en-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const formattedTime = date.toLocaleTimeString("en-BD", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    let relativeTime = "";
    if (diffInDays === 0) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        relativeTime = `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      } else {
        relativeTime = `${Math.floor(diffInHours)} hour${
          Math.floor(diffInHours) !== 1 ? "s" : ""
        } ago`;
      }
    } else if (diffInDays === 1) {
      relativeTime = "Yesterday";
    } else if (diffInDays < 7) {
      relativeTime = `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    return { formattedDate, formattedTime, relativeTime };
  };

  useEffect(() => {
    const fetchParcelStatusHistory = async () => {
      if (!parcelId) {
        console.log("❌ No parcel ID provided");
        toast.error("No parcel ID provided");
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Fetching status history for parcel ID:", parcelId);

        // Try multiple API endpoints to get parcel data
        let response;
        let parcelData = null;

        // Method 1: Try original status-log endpoint
        try {
          console.log("📡 Trying endpoint: /parcels/${parcelId}/status-log");
          response = await api.get(`/parcels/${parcelId}/status-log`);
          console.log("✅ Status-log response:", response.data);
          parcelData = response.data.data;
        } catch (err) {
          console.log("❌ Status-log endpoint failed:", err);
        }

        // Method 2: Try getting parcel by trackingId directly
        if (!parcelData) {
          try {
            console.log("📡 Trying endpoint: /parcels/track/${parcelId}");
            response = await api.get(`/parcels/track/${parcelId}`);
            console.log("✅ Track response:", response.data);
            parcelData = response.data.data || response.data;
          } catch (err) {
            console.log("❌ Track endpoint failed:", err);
          }
        }

        // Method 3: Try getting from sender's parcels list
        if (!parcelData) {
          try {
            console.log("📡 Trying to find parcel in sender list");
            response = await api.get("/parcels/me?limit=1000");
            console.log("✅ Sender parcels response:", response.data);
            const allParcels = response.data.data || [];
            parcelData = allParcels.find(
              (p: any) =>
                p.trackingId === parcelId || p.trackingNumber === parcelId
            );
            console.log("🔍 Found parcel in list:", parcelData);
          } catch (err) {
            console.log("❌ Sender parcels endpoint failed:", err);
          }
        }

        if (parcelData) {
          console.log("🎉 Successfully found parcel data:", parcelData);

          // Ensure statusHistory exists and is an array
          if (
            !parcelData.statusHistory ||
            !Array.isArray(parcelData.statusHistory)
          ) {
            console.log("⚠️ No status history found, creating default entry");
            parcelData.statusHistory = [
              {
                status: parcelData.currentStatus || "unknown",
                timestamp: parcelData.createdAt || new Date().toISOString(),
                note: "Status history not available for this parcel",
                updatedByType: "system",
              },
            ];
          }

          setParcel(parcelData);
        } else {
          console.log("❌ No parcel data found");
          toast.error("Parcel not found or access denied");
        }
      } catch (error) {
        console.error("❌ Error fetching parcel status history:", error);
        toast.error("Failed to load parcel status history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcelStatusHistory();
  }, [parcelId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "dispatched":
        return <MapPin className="h-5 w-5 text-purple-600" />;
      case "in_transit":
      case "in-transit":
        return <MapPin className="h-5 w-5 text-orange-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "dispatched":
        return "bg-purple-100 text-purple-800";
      case "in_transit":
      case "in-transit":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Parcel Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to find the specified parcel or status history.
          </p>
          <Link
            to="/track"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tracking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Panel (only show in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug Info</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>
                <strong>Parcel ID from URL:</strong> {parcelId}
              </div>
              <div>
                <strong>Parcel Data Found:</strong>{" "}
                {parcel ? "✅ Yes" : "❌ No"}
              </div>
              {parcel && (
                <>
                  <div>
                    <strong>Tracking ID:</strong>{" "}
                    {parcel.trackingId || parcel.trackingNumber}
                  </div>
                  <div>
                    <strong>Status History Count:</strong>{" "}
                    {parcel.statusHistory?.length || 0}
                  </div>
                  <div>
                    <strong>Current Status:</strong> {parcel.currentStatus}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link
            to="/track"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracking
          </Link>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📦 Parcel Status History
            </h1>
            <p className="text-gray-600 mb-3">
              Complete tracking timeline and detailed information for parcel{" "}
              <span className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded">
                {parcel.trackingId || parcel.trackingNumber}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center bg-white px-3 py-1 rounded-full border">
                <Package className="h-4 w-4 mr-1 text-blue-600" />
                {parcel.statusHistory?.length || 0} Status Updates
              </span>
              <span className="inline-flex items-center bg-white px-3 py-1 rounded-full border">
                <Clock className="h-4 w-4 mr-1 text-green-600" />
                Last Updated:{" "}
                {(() => {
                  if (
                    !parcel.statusHistory ||
                    parcel.statusHistory.length === 0
                  ) {
                    return "N/A";
                  }
                  const latest = parcel.statusHistory.sort(
                    (a, b) =>
                      extractDate(b.timestamp).getTime() -
                      extractDate(a.timestamp).getTime()
                  )[0];
                  if (latest) {
                    const dateInfo = formatDetailedDate(latest.timestamp);
                    return dateInfo.relativeTime || dateInfo.formattedTime;
                  }
                  return "N/A";
                })()}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  parcel.currentStatus
                )}`}
              >
                {getStatusIcon(parcel.currentStatus)}
                <span className="ml-1">
                  {parcel.currentStatus?.replace(/[-_]/g, " ").toUpperCase() ||
                    "UNKNOWN"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Parcel Summary */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Parcel Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">
                    Tracking ID:
                  </span>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-mono font-medium text-blue-600">
                    {parcel.trackingId || parcel.trackingNumber}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Current Status:
                  </span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        parcel.currentStatus
                      )}`}
                    >
                      {getStatusIcon(parcel.currentStatus)}
                      <span className="ml-2">
                        {parcel.currentStatus
                          .replace(/[-_]/g, " ")
                          .toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>
                {parcel.parcelDetails && (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 capitalize">
                        {parcel.parcelDetails.type}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="ml-2">
                        {parcel.parcelDetails.weight} kg
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Value:</span>
                      <span className="ml-2">
                        ৳{parcel.parcelDetails.value.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sender & Receiver Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Delivery Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">From:</span>
                  <div className="mt-1">
                    <div className="font-medium">
                      {parcel.senderInfo?.name || parcel.senderName}
                    </div>
                    {parcel.senderInfo?.phone && (
                      <div className="text-sm text-gray-600">
                        📞 {parcel.senderInfo.phone}
                      </div>
                    )}
                    {parcel.senderInfo?.email && (
                      <div className="text-sm text-gray-600">
                        ✉️ {parcel.senderInfo.email}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">To:</span>
                  <div className="mt-1">
                    <div className="font-medium">
                      {parcel.receiverInfo?.name || parcel.recipientName}
                    </div>
                    {parcel.receiverInfo?.phone && (
                      <div className="text-sm text-gray-600">
                        📞 {parcel.receiverInfo.phone}
                      </div>
                    )}
                    {parcel.receiverInfo?.email && (
                      <div className="text-sm text-gray-600">
                        ✉️ {parcel.receiverInfo.email}
                      </div>
                    )}
                  </div>
                </div>
                {parcel.deliveryInfo && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Delivery Instructions:
                    </span>
                    <div className="mt-1 text-sm text-gray-600">
                      {parcel.deliveryInfo.deliveryInstructions}
                    </div>
                    {parcel.deliveryInfo.isUrgent && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🚨 Urgent Delivery
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Summary & Payment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">
                    Total Updates:
                  </span>
                  <span className="ml-2 font-bold text-blue-600">
                    {parcel.statusHistory.length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <div className="mt-1 text-sm">
                    {(() => {
                      const createdInfo = formatDetailedDate(parcel.createdAt);
                      return (
                        <div>
                          <div className="font-medium">
                            {createdInfo.formattedDate}
                          </div>
                          <div className="text-blue-600">
                            {createdInfo.formattedTime}
                          </div>
                          {createdInfo.relativeTime && (
                            <div className="text-gray-500 text-xs">
                              {createdInfo.relativeTime}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                {parcel.fee && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Total Fee:
                    </span>
                    <div className="mt-1">
                      <div className="font-bold text-green-600">
                        ৳{parcel.fee.totalFee.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: ৳{parcel.fee.baseFee} + Weight: ৳
                        {parcel.fee.weightFee}
                        {parcel.fee.urgentFee > 0 &&
                          ` + Urgent: ৳${parcel.fee.urgentFee}`}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            parcel.fee.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {parcel.fee.isPaid ? "✅ Paid" : "❌ Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Status Timeline */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Detailed Status Timeline
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {parcel.statusHistory.length} Updates
              </span>
            </h2>
          </div>

          <div className="p-6">
            {parcel.statusHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No status history available</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {parcel.statusHistory
                    .sort((a, b) => {
                      const dateA = extractDate(a.timestamp);
                      const dateB = extractDate(b.timestamp);
                      return dateB.getTime() - dateA.getTime(); // Latest first
                    })
                    .map((item, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== parcel.statusHistory.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-blue-200 to-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-blue-300 shadow-sm">
                              {getStatusIcon(item.status)}
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {item.status
                                      .replace(/[-_]/g, " ")
                                      .toUpperCase()}
                                  </span>
                                  {item.updatedByType && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        item.updatedByType === "system"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {item.updatedByType === "system"
                                        ? "🤖 System"
                                        : "👤 User"}
                                    </span>
                                  )}
                                </div>

                                {item.note && (
                                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                      <strong>Note:</strong> {item.note}
                                    </p>
                                  </div>
                                )}

                                {item.location && (
                                  <p className="mt-2 text-sm text-gray-600 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                                    <strong>Location:</strong>{" "}
                                    <span className="ml-1">
                                      {item.location}
                                    </span>
                                  </p>
                                )}

                                {item.updatedBy && (
                                  <p className="mt-2 text-sm text-gray-500 flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <strong>Updated by:</strong>{" "}
                                    <span className="ml-1">
                                      {item.updatedBy}
                                    </span>
                                  </p>
                                )}
                              </div>

                              <div className="whitespace-nowrap text-right text-sm">
                                {(() => {
                                  const dateInfo = formatDetailedDate(
                                    item.timestamp
                                  );
                                  return (
                                    <div className="space-y-1 min-w-[140px]">
                                      <div className="font-medium text-gray-800 text-sm">
                                        {dateInfo.formattedDate}
                                      </div>
                                      <div className="text-blue-600 font-bold text-base">
                                        {dateInfo.formattedTime}
                                      </div>
                                      {dateInfo.relativeTime && (
                                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                          {dateInfo.relativeTime}
                                        </div>
                                      )}
                                      {index === 0 && (
                                        <div className="text-xs font-medium text-green-600">
                                          Latest Update
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/track"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Track Another Parcel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StatusHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
        </div>
      }
    >
      <ParcelStatusHistoryContent />
    </Suspense>
  );
}
