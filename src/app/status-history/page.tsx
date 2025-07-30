"use client";

import api from "@/lib/api";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  location?: string;
  note?: string;
  updatedBy?: string;
}

interface ParcelDetails {
  trackingNumber: string;
  description: string;
  currentStatus: string;
  senderName: string;
  recipientName: string;
  statusHistory: StatusHistoryItem[];
}

function ParcelStatusHistoryContent() {
  const searchParams = useSearchParams();
  const parcelId = searchParams.get("id");
  const [parcel, setParcel] = useState<ParcelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParcelStatusHistory = async () => {
      if (!parcelId) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/parcels/${parcelId}/status-log`);
        setParcel(response.data.data);
      } catch (error) {
        console.error("Error fetching parcel status history:", error);
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            href="/track"
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
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/track"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracking
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Parcel Status History
          </h1>
          <p className="mt-2 text-gray-600">
            Detailed tracking information for {parcel.trackingNumber}
          </p>
        </div>

        {/* Parcel Summary */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Parcel Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Tracking Number:</span>{" "}
                  {parcel.trackingNumber}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {parcel.description}
                </p>
                <p>
                  <span className="font-medium">Current Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      parcel.currentStatus
                    )}`}
                  >
                    {parcel.currentStatus.replace("_", " ").toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">From:</span> {parcel.senderName}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {parcel.recipientName}
                </p>
                <p>
                  <span className="font-medium">Total Status Updates:</span>{" "}
                  {parcel.statusHistory.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Status Timeline
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
                  {parcel.statusHistory.map((item, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== parcel.statusHistory.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-300">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    item.status
                                  )}`}
                                >
                                  {item.status.replace("_", " ").toUpperCase()}
                                </span>
                                {item.updatedBy && (
                                  <span className="text-sm text-gray-500 flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    Updated by {item.updatedBy}
                                  </span>
                                )}
                              </div>
                              {item.note && (
                                <p className="mt-1 text-sm text-gray-700">
                                  {item.note}
                                </p>
                              )}
                              {item.location && (
                                <p className="mt-1 text-sm text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {item.location}
                                </p>
                              )}
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <div>
                                {new Date(item.timestamp).toLocaleDateString()}
                              </div>
                              <div>
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </div>
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
            href="/track"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Track Another Parcel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ParcelStatusHistory() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ParcelStatusHistoryContent />
    </Suspense>
  );
}
