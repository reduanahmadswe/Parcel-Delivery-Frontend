"use client";

import api from "@/lib/api";
import { formatDate, getStatusColor, getStatusIcon } from "@/lib/utils";
import { Parcel } from "@/types";
import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setParcel(null);

    try {
      const response = await api.get(`/parcels/track/${trackingId.trim()}`);
      setParcel(response.data.data);
    } catch (err) {
      setError(
        (err as ApiError).response?.data?.message ||
          "Parcel not found. Please check your tracking ID."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = [
      "requested",
      "approved",
      "dispatched",
      "in-transit",
      "delivered",
    ];
    return steps.indexOf(status);
  };

  const isStatusCompleted = (currentStatus: string, stepStatus: string) => {
    return getStatusStep(currentStatus) >= getStatusStep(stepStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Track Your Parcel
          </h1>
          <p className="text-lg text-gray-600">
            Enter your tracking ID to get real-time updates on your parcel
            delivery
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form
            onSubmit={handleTrack}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <label htmlFor="trackingId" className="sr-only">
                Tracking ID
              </label>
              <input
                id="trackingId"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g., TRK-20240115-ABC123)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-lg transition-all duration-200"
                onFocus={(e) => {
                  e.target.style.borderColor = "#720455";
                  e.target.style.boxShadow = "0 0 0 2px rgba(114, 4, 85, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "";
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #720455 0%, #910A67 100%)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #3C0753 0%, #720455 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(114, 4, 85, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #720455 0%, #910A67 100%)";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }
              }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Track Parcel
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Parcel Information */}
        {parcel && (
          <div className="space-y-6">
            {/* Parcel Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Parcel Details
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    parcel.currentStatus
                  )}`}
                >
                  {getStatusIcon(parcel.currentStatus)}{" "}
                  {parcel.currentStatus.replace("-", " ").toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Tracking Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Tracking ID:</span>
                      <span className="ml-2 font-mono font-medium">
                        {parcel.trackingId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 capitalize">
                        {parcel.parcelDetails.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-2">
                        {parcel.parcelDetails.weight} kg
                      </span>
                    </div>
                    {parcel.deliveryInfo.isUrgent && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-orange-600 font-medium">
                          Urgent Delivery
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Delivery Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span>
                      <div className="ml-2">
                        <div>{parcel.senderInfo.name}</div>
                        <div className="text-gray-600">
                          {parcel.senderInfo.address.city},{" "}
                          {parcel.senderInfo.address.state}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">To:</span>
                      <div className="ml-2">
                        <div>{parcel.receiverInfo.name}</div>
                        <div className="text-gray-600">
                          {parcel.receiverInfo.address.city},{" "}
                          {parcel.receiverInfo.address.state}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status History Link */}
              <div className="mt-6 text-center">
                <Link
                  href={`/status-history?id=${parcel._id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #720455 0%, #910A67 100%)",
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  View Detailed Status History
                </Link>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Delivery Timeline
              </h2>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[
                    "requested",
                    "approved",
                    "dispatched",
                    "in-transit",
                    "delivered",
                  ].map((status, index) => (
                    <div
                      key={status}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isStatusCompleted(parcel.currentStatus, status)
                            ? "text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                        style={
                          isStatusCompleted(parcel.currentStatus, status)
                            ? {
                                background:
                                  "linear-gradient(135deg, #720455 0%, #910A67 100%)",
                              }
                            : {}
                        }
                      >
                        {isStatusCompleted(parcel.currentStatus, status) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 capitalize text-center">
                        {status.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
                  <div
                    className="absolute top-0 left-0 h-1 transition-all duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, #720455 0%, #910A67 100%)",
                      width: `${
                        (getStatusStep(parcel.currentStatus) / 4) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Detailed Status History */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Status History</h3>
                <div className="space-y-3">
                  {parcel.statusHistory
                    .slice()
                    .reverse()
                    .map((status, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 ${
                            getStatusColor(status.status).split(" ")[0]
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 capitalize">
                              {status.status.replace("-", " ")}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(status.timestamp)}
                            </span>
                          </div>
                          {status.location && (
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {status.location}
                            </div>
                          )}
                          {status.note && (
                            <p className="text-sm text-gray-600 mt-1">
                              {status.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Parcel Description */}
            {parcel.parcelDetails.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Parcel Description
                </h2>
                <p className="text-gray-700">
                  {parcel.parcelDetails.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sample Tracking IDs for Testing */}
        {!parcel && !loading && (
          <div
            className="rounded-lg p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(114, 4, 85, 0.1) 0%, rgba(145, 10, 103, 0.1) 100%)",
              border: "1px solid rgba(114, 4, 85, 0.2)",
            }}
          >
            <Package
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: "#720455" }}
            />
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "#720455" }}
            >
              Need a sample tracking ID?
            </h3>
            <p className="mb-4" style={{ color: "#3C0753" }}>
              Try one of these sample tracking IDs to see how the tracking
              system works:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "TRK-20240115-ABC123",
                "TRK-20240116-DEF456",
                "TRK-20240117-GHI789",
              ].map((sampleId) => (
                <button
                  key={sampleId}
                  onClick={() => setTrackingId(sampleId)}
                  className="px-3 py-1 bg-white rounded-md text-sm transition-all duration-200 font-mono hover:transform hover:-translate-y-1 hover:shadow-md"
                  style={{
                    color: "#720455",
                    border: "1px solid #720455",
                  }}
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
