import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Search,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/ApiConfiguration";
import {
  formatDate,
  getStatusColor,
  getStatusIcon,
} from "../../utils/HelperUtilities";
import { Parcel } from "../../types/GlobalTypeDefinitions";
import FooterSection from "./sections/FooterSection";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function TrackPage() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trackingIdFromUrl = searchParams.get("id");
    if (trackingIdFromUrl) {
      setTrackingId(trackingIdFromUrl);
      
      handleTrackFromUrl(trackingIdFromUrl);
    }
  }, [searchParams]);

  const handleTrackFromUrl = async (id: string) => {
    if (!id.trim()) return;

    setLoading(true);
    setError("");
    setParcel(null);

    try {
      const response = await api.get(`/parcels/track/${id.trim()}`);
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
        <div className="max-w-7xl mx-auto pt-2 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 pb-16 sm:pb-24">
          {}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50/20 via-transparent to-green-50/20 dark:from-gray-900/80 dark:via-gray-950/90 dark:to-black/95 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/50 dark:border-gray-800/50 shadow-lg dark:shadow-2xl dark:shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-green-500/5 dark:from-red-900/10 dark:to-green-900/10"></div>
            <div className="relative text-center">
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-red-600 dark:from-red-700 dark:to-red-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground flex items-center justify-center">
                    Track Your Parcel
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400 rounded-full ml-2 sm:ml-3 animate-pulse shadow-lg"></div>
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Enter your tracking ID to get real-time updates on your parcel
                delivery
              </p>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20 border border-border/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30 transition-all duration-500">
            <form
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6"
            >
              <div className="flex-1">
                <label
                  htmlFor="trackingId"
                  className="block text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3"
                >
                  Tracking ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    id="trackingId"
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID (e.g., TRK-20240115-ABC123)"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 lg:py-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-sm sm:text-base lg:text-lg"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-br from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transform group min-w-[140px] justify-center text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                      Track Parcel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {}
          {error && (
            <div className="bg-gradient-to-br from-red-50/90 via-red-50/70 to-pink-50/80 dark:from-red-950/30 dark:via-red-900/20 dark:to-pink-950/25 backdrop-blur-sm border border-red-200/50 dark:border-red-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-red-500/10 dark:shadow-red-400/20">
              <div className="flex items-center justify-center text-red-600 dark:text-red-400 mb-3 sm:mb-4">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse" />
              </div>
              <p className="text-red-700 dark:text-red-300 text-center font-medium text-sm sm:text-base lg:text-lg">
                {error}
              </p>
            </div>
          )}

          {}
          {parcel && (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {}
              <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20 border border-border/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30 transition-all duration-500">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-500" />
                    Parcel Details
                  </h2>
                  <span
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm ${getStatusColor(
                      parcel.currentStatus
                    )}`}
                  >
                    {getStatusIcon(parcel.currentStatus)}
                    {parcel.currentStatus.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      Tracking Information
                    </h3>
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm">
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 p-2 sm:p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Tracking ID:
                        </span>
                        <span className="font-mono font-bold text-foreground bg-muted/50 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm truncate">
                          {parcel.trackingId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 sm:p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Type:
                        </span>
                        <span className="font-semibold text-foreground capitalize">
                          {parcel.parcelDetails.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 sm:p-3 bg-background/60 rounded-lg border border-border/20">
                        <span className="text-muted-foreground font-medium">
                          Weight:
                        </span>
                        <span className="font-semibold text-foreground">
                          {parcel.parcelDetails.weight} kg
                        </span>
                      </div>
                      {parcel.deliveryInfo.isUrgent && (
                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 animate-pulse" />
                          <span className="text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm">
                            Urgent Delivery
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-border/30">
                    <h3 className="font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      Delivery Details
                    </h3>
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm">
                      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                        <div className="p-2 sm:p-3 bg-background/60 rounded-lg border border-border/20">
                          <span className="text-muted-foreground font-medium block mb-1 sm:mb-2">
                            From:
                          </span>
                          <div className="text-foreground font-semibold">
                            {parcel.senderInfo.name}
                          </div>
                          <div className="text-muted-foreground text-xs sm:text-sm mt-1">
                            {parcel.senderInfo.address.city},{" "}
                            {parcel.senderInfo.address.state}
                          </div>
                        </div>
                        <div className="p-2 sm:p-3 bg-background/60 rounded-lg border border-border/20">
                          <span className="text-muted-foreground font-medium block mb-1 sm:mb-2">
                            To:
                          </span>
                          <div className="text-foreground font-semibold">
                            {parcel.receiverInfo.name}
                          </div>
                          <div className="text-muted-foreground text-xs sm:text-sm mt-1">
                            {parcel.receiverInfo.address.city},{" "}
                            {parcel.receiverInfo.address.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mt-4 sm:mt-6 lg:mt-8 text-center">
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
                    className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 transform group text-xs sm:text-sm lg:text-base"
                  >
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                    View Detailed Status History
                  </button>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl shadow-green-500/10 dark:shadow-green-400/20 border border-border/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-green-400/30 transition-all duration-500">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-500" />
                  Delivery Timeline
                </h2>

                {}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto pb-2">
                    {[
                      "requested",
                      "approved",
                      "dispatched",
                      "in-transit",
                      "delivered",
                    ].map((status, index) => (
                      <div
                        key={status}
                        className="flex flex-col items-center flex-1 min-w-[60px] xs:min-w-[70px] sm:min-w-0"
                      >
                        <div
                          className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 sm:border-4 transition-all duration-500 ${
                            isStatusCompleted(parcel.currentStatus, status)
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400 shadow-lg shadow-green-500/30 scale-110"
                              : "bg-muted border-border text-muted-foreground hover:scale-105"
                          }`}
                        >
                          {isStatusCompleted(parcel.currentStatus, status) ? (
                            <CheckCircle className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 animate-pulse" />
                          ) : (
                            <span className="font-mono text-xs sm:text-sm">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 font-medium capitalize text-center leading-tight px-1">
                          {status.replace("-", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-4 sm:mt-6">
                    <div className="absolute top-0 left-0 h-1.5 sm:h-2 bg-muted rounded-full w-full" />
                    <div
                      className="absolute top-0 left-0 h-1.5 sm:h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-1000 shadow-md shadow-green-500/30"
                      style={{
                        width: `${
                          (getStatusStep(parcel.currentStatus) / 4) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {}
                <div id="status-history" className="space-y-4 sm:space-y-6">
                  <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border/20">
                    <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      Status History
                    </h3>
                  </div>

                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                          className={`bg-background rounded-lg shadow-sm border border-border p-3 sm:p-4 hover:shadow-lg transition-all duration-300 ${
                            index === parcel.statusHistory.length - 1
                              ? "ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
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
                              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                                STEP {index + 1}
                              </span>
                            </div>
                            {index === parcel.statusHistory.length - 1 && (
                              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] sm:text-xs font-bold rounded-full">
                                CURRENT
                              </span>
                            )}
                          </div>

                          <div className="mb-2 sm:mb-3">
                            <h4 className="font-semibold text-foreground capitalize text-xs sm:text-sm mb-0.5 sm:mb-1">
                              {status.status.replace("-", " ")}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {formatDate(status.timestamp)}
                            </p>
                          </div>

                          {status.location && (
                            <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                              <MapPin className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                              <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 truncate">
                                {status.location}
                              </span>
                            </div>
                          )}

                          {status.note && (
                            <div className="bg-muted/30 rounded-md p-2 border-l-2 border-blue-400">
                              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                                {status.note}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {}
                  <div className="bg-gradient-to-r from-card/50 via-card/30 to-card/50 backdrop-blur-sm rounded-lg border border-border/30 p-3 sm:p-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        Total Steps:
                      </span>
                      <span className="font-bold text-foreground">
                        {parcel.statusHistory.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm mt-1.5 sm:mt-2">
                      <span className="text-muted-foreground">Started:</span>
                      <span className="font-medium text-foreground">
                        {formatDate(parcel.statusHistory[0]?.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm mt-1.5 sm:mt-2">
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

              {}
              {parcel.parcelDetails.description && (
                <div className="bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl shadow-red-500/10 dark:shadow-red-400/20 border border-border/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-red-500/20 dark:hover:shadow-red-400/30 transition-all duration-500">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-600" />
                    Parcel Description
                  </h2>
                  <div className="bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-border/30">
                    <p className="text-foreground leading-relaxed text-sm sm:text-base lg:text-lg font-medium">
                      {parcel.parcelDetails.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {!error && !loading && !parcel && !trackingId && (
            <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center shadow-xl shadow-gray-500/5 dark:shadow-gray-400/10 border border-border/30">
              <div className="flex items-center justify-center text-muted-foreground mb-4 sm:mb-6">
                <Package className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 opacity-60" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-3">
                Enter a tracking ID to get started
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
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

