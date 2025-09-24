"use client";

import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import api from "../../shared/services/ApiConfiguration";
import {
  formatDate,
  getStatusColor,
  getStatusIcon,
} from "../../shared/utils/HelperUtilities";
import { Parcel } from "../../shared/types/GlobalTypeDefinitions";
import FooterSection from "./sections/FooterSection";

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
    <>
      <div className="min-h-screen bg-background mt-10">
        <div className="max-w-7xl mx-auto pt-2 px-6 space-y-6 pb-24">
          {/* Enhanced Modern Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-green-900/20 rounded-3xl p-8 border border-border/50 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-600 dark:from-red-700 dark:to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground flex items-center">
                    Track Your Parcel
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full ml-3 animate-pulse shadow-lg"></div>
                  </h1>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enter your tracking ID to get real-time updates on your parcel
                delivery
              </p>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <div className="bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20 border border-border/50 p-8 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30 transition-all duration-500">
            <form
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-1">
                <label
                  htmlFor="trackingId"
                  className="block text-sm font-semibold text-foreground mb-3"
                >
                  Tracking ID
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input
                    id="trackingId"
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID (e.g., TRK-20240115-ABC123)"
                    className="w-full pl-12 pr-4 py-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-lg"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-br from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transform group min-w-[140px] justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      Track Parcel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Enhanced Error State */}
          {error && (
            <div className="bg-gradient-to-br from-red-50/90 via-red-50/70 to-pink-50/80 dark:from-red-950/30 dark:via-red-900/20 dark:to-pink-950/25 backdrop-blur-sm border border-red-200/50 dark:border-red-800/30 rounded-2xl p-8 shadow-xl shadow-red-500/10 dark:shadow-red-400/20">
              <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <XCircle className="h-8 w-8 animate-pulse" />
              </div>
              <p className="text-red-700 dark:text-red-300 text-center font-medium text-lg">
                {error}
              </p>
            </div>
          )}

          {/* Enhanced Parcel Information */}
          {parcel && (
            <div className="space-y-8">
              {/* Enhanced Parcel Details Card */}
              <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20 border border-border/50 p-8 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Package className="h-7 w-7 text-red-500" />
                    Parcel Details
                  </h2>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 backdrop-blur-sm ${getStatusColor(
                      parcel.currentStatus
                    )}`}
                  >
                    {getStatusIcon(parcel.currentStatus)}
                    {parcel.currentStatus.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-xl p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                      <Search className="h-5 w-5 text-red-500" />
                      Tracking Information
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Tracking ID:
                        </span>
                        <span className="font-mono font-bold text-foreground bg-muted/50 px-3 py-1 rounded-md">
                          {parcel.trackingId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Type:
                        </span>
                        <span className="font-semibold text-foreground capitalize">
                          {parcel.parcelDetails.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Weight:
                        </span>
                        <span className="font-semibold text-foreground">
                          {parcel.parcelDetails.weight} kg
                        </span>
                      </div>
                      {parcel.deliveryInfo.isUrgent && (
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                          <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                          <span className="text-orange-600 dark:text-orange-400 font-bold">
                            Urgent Delivery
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-xl p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-green-500" />
                      Delivery Details
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="space-y-4">
                        <div className="p-3 bg-background/60 rounded-lg border border-border/20">
                          <span className="text-muted-foreground font-medium block mb-2">
                            From:
                          </span>
                          <div className="text-foreground font-semibold">
                            {parcel.senderInfo.name}
                          </div>
                          <div className="text-muted-foreground text-sm mt-1">
                            {parcel.senderInfo.address.city},{" "}
                            {parcel.senderInfo.address.state}
                          </div>
                        </div>
                        <div className="p-3 bg-background/60 rounded-lg border border-border/20">
                          <span className="text-muted-foreground font-medium block mb-2">
                            To:
                          </span>
                          <div className="text-foreground font-semibold">
                            {parcel.receiverInfo.name}
                          </div>
                          <div className="text-muted-foreground text-sm mt-1">
                            {parcel.receiverInfo.address.city},{" "}
                            {parcel.receiverInfo.address.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status History Link */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      const statusHistoryElement =
                        document.getElementById("status-history");
                      if (statusHistoryElement) {
                        statusHistoryElement.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 transform group"
                  >
                    <Clock className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    View Detailed Status History
                  </button>
                </div>
              </div>

              {/* Enhanced Status Timeline */}
              <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-green-500/10 dark:shadow-green-400/20 border border-border/50 p-8 hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-green-400/30 transition-all duration-500">
                <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <Clock className="h-7 w-7 text-green-500" />
                  Delivery Timeline
                </h2>

                {/* Enhanced Progress Bar */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
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
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-500 ${
                            isStatusCompleted(parcel.currentStatus, status)
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 shadow-lg shadow-green-500/30 scale-110"
                              : "bg-muted border-border text-muted-foreground hover:scale-105"
                          }`}
                        >
                          {isStatusCompleted(parcel.currentStatus, status) ? (
                            <CheckCircle className="h-6 w-6 animate-pulse" />
                          ) : (
                            <span className="font-mono">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground mt-2 font-medium capitalize text-center leading-tight">
                          {status.replace("-", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-6">
                    <div className="absolute top-0 left-0 h-2 bg-muted rounded-full w-full" />
                    <div
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-1000 shadow-md shadow-green-500/30"
                      style={{
                        width: `${
                          (getStatusStep(parcel.currentStatus) / 4) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Compact Status History Cards */}
                <div id="status-history" className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-xl p-4 border border-border/20">
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      Status History
                    </h3>
                  </div>

                  {/* Status Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {parcel.statusHistory
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(a.timestamp).getTime() -
                          new Date(b.timestamp).getTime()
                      )
                      .map((status, index) => (
                        <div
                          key={index}
                          className={`bg-background rounded-lg shadow-sm border border-border p-4 hover:shadow-lg transition-all duration-300 ${
                            index === parcel.statusHistory.length - 1
                              ? "ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  getStatusColor(status.status).includes(
                                    "green"
                                  )
                                    ? "bg-emerald-500"
                                    : getStatusColor(status.status).includes(
                                        "blue"
                                      )
                                    ? "bg-blue-500"
                                    : getStatusColor(status.status).includes(
                                        "yellow"
                                      )
                                    ? "bg-yellow-500"
                                    : getStatusColor(status.status).includes(
                                        "red"
                                      )
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              <span className="text-xs font-bold text-muted-foreground">
                                STEP {index + 1}
                              </span>
                            </div>
                            {index === parcel.statusHistory.length - 1 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold rounded-full">
                                CURRENT
                              </span>
                            )}
                          </div>

                          <div className="mb-3">
                            <h4 className="font-semibold text-foreground capitalize text-sm mb-1">
                              {status.status.replace("-", " ")}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(status.timestamp)}
                            </p>
                          </div>

                          {status.location && (
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                                {status.location}
                              </span>
                            </div>
                          )}

                          {status.note && (
                            <div className="bg-muted/30 rounded-md p-2 border-l-2 border-blue-400">
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {status.note}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Timeline Summary */}
                  <div className="bg-gradient-to-r from-card/50 via-card/30 to-card/50 backdrop-blur-sm rounded-lg border border-border/30 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Steps:
                      </span>
                      <span className="font-bold text-foreground">
                        {parcel.statusHistory.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Started:</span>
                      <span className="font-medium text-foreground">
                        {formatDate(parcel.statusHistory[0]?.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">
                        Last Update:
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(
                          parcel.statusHistory[parcel.statusHistory.length - 1]
                            ?.timestamp
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Parcel Description */}
              {parcel.parcelDetails.description && (
                <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-red-500/10 dark:shadow-red-400/20 border border-border/50 p-8 hover:shadow-2xl hover:shadow-red-500/20 dark:hover:shadow-red-400/30 transition-all duration-500">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Package className="h-7 w-7 text-red-600" />
                    Parcel Description
                  </h2>
                  <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-xl p-6 border border-border/30">
                    <p className="text-foreground leading-relaxed text-lg font-medium">
                      {parcel.parcelDetails.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Empty State for No Tracking ID */}
          {!error && !loading && !parcel && !trackingId && (
            <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/40 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl shadow-gray-500/5 dark:shadow-gray-400/10 border border-border/30">
              <div className="flex items-center justify-center text-muted-foreground mb-6">
                <Package className="h-16 w-16 opacity-60" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Enter a tracking ID to get started
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Track your parcel's journey from pickup to delivery with
                real-time updates
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </>
  );
}

