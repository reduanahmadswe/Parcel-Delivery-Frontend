"use client";

import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { CheckCircle2, Clock, MapPin, Package, User, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Parcel {
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
  status: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function ReceiverDashboard() {
  const { user, loading } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [filter, setFilter] = useState("all");
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchParcels = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;
      let parcelData;

      try {
        // First try /parcels/me endpoint (for parcels where user is recipient)
        response = await api.get("/parcels/me");
        parcelData = response.data.data || response.data;
      } catch {
        console.log("Trying fallback endpoint...");
        // Fallback: Get all parcels and filter by recipient email
        response = await api.get("/parcels");
        const allParcels = response.data.data || response.data;

        // Filter parcels where the current user is the recipient
        parcelData = allParcels.filter(
          (parcel: Parcel) => parcel.recipientEmail === user?.email
        );
      }

      setParcels(parcelData);

      // Calculate stats
      const stats = {
        total: parcelData.length,
        pending: parcelData.filter((p: Parcel) => p.status === "pending")
          .length,
        inTransit: parcelData.filter((p: Parcel) => p.status === "in_transit")
          .length,
        delivered: parcelData.filter((p: Parcel) => p.status === "delivered")
          .length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch parcels";
      const statusCode = (error as { response?: { status?: number } })?.response
        ?.status;
      toast.error(`Error ${statusCode ? `(${statusCode})` : ""}: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!loading && user) {
      fetchParcels();
    }
  }, [user, loading, fetchParcels]);

  const confirmDelivery = async (parcelId: number) => {
    try {
      setIsConfirming(true);
      await api.put(`/parcels/${parcelId}/confirm-delivery`);
      toast.success("Delivery confirmed successfully");
      fetchParcels();
      setSelectedParcel(null);
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Failed to confirm delivery");
    } finally {
      setIsConfirming(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", text: "Confirmed" },
      picked_up: { color: "bg-purple-100 text-purple-800", text: "Picked Up" },
      in_transit: {
        color: "bg-orange-100 text-orange-800",
        text: "In Transit",
      },
      out_for_delivery: {
        color: "bg-indigo-100 text-indigo-800",
        text: "Out for Delivery",
      },
      delivered: { color: "bg-green-100 text-green-800", text: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const filteredParcels = parcels.filter((parcel) => {
    if (filter === "all") return true;
    return parcel.status === filter;
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Receiver Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Parcels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inTransit}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "pending",
                "in_transit",
                "out_for_delivery",
                "delivered",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "All Parcels"
                    : status
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parcels List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Parcels
            </h2>
          </div>

          {filteredParcels.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No parcels found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredParcels.map((parcel) => (
                <div key={parcel.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {parcel.trackingNumber}
                            </h3>
                            {getStatusBadge(parcel.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {parcel.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              From: {parcel.senderName}
                            </span>
                            <span>{parcel.weight}kg</span>
                            <span>${parcel.cost}</span>
                            <span>
                              {new Date(parcel.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </button>
                      {parcel.status === "out_for_delivery" && (
                        <button
                          onClick={() => confirmDelivery(parcel.id)}
                          disabled={isConfirming}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {isConfirming ? "Confirming..." : "Confirm Delivery"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Parcel Details Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Parcel Details
              </h2>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Status
                </h3>
                {getStatusBadge(selectedParcel.status)}
              </div>

              {/* Tracking Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Tracking Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-mono text-lg">
                    {selectedParcel.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Parcel Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Parcel Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">
                      {selectedParcel.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium">
                      {selectedParcel.weight}kg
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="ml-2 font-medium">
                      {selectedParcel.dimensions.length} ×{" "}
                      {selectedParcel.dimensions.width} ×{" "}
                      {selectedParcel.dimensions.height} cm
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 font-medium">
                      ${selectedParcel.cost}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-sm">{selectedParcel.description}</p>
                </div>
              </div>

              {/* Sender Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Sender Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedParcel.senderName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedParcel.senderEmail}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedParcel.senderPhone}
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Delivery Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedParcel.deliveryType}
                  </p>
                  <p>
                    <span className="font-medium">Insurance:</span>{" "}
                    {selectedParcel.isInsured ? "Yes" : "No"}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">Delivery Address:</p>
                    <p className="text-gray-600">
                      {selectedParcel.recipientAddress.street}
                      <br />
                      {selectedParcel.recipientAddress.city},{" "}
                      {selectedParcel.recipientAddress.state}{" "}
                      {selectedParcel.recipientAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedParcel.status === "out_for_delivery" && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedParcel(null)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => confirmDelivery(selectedParcel.id)}
                    disabled={isConfirming}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isConfirming ? "Confirming..." : "Confirm Delivery"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
