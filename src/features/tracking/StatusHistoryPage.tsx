import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  Info,
  Mail,
  MapPin,
  Navigation,
  Package,
  PhoneCall,
  Shield,
  Star,
  Truck,
  User,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/ApiConfiguration";

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
  trackingNumber?: string; 
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
  senderName?: string; 
  recipientName?: string; 
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
  const [missingId, setMissingId] = useState(false);

  const extractDate = (dateInput: string | { $date: string }): Date => {
    if (typeof dateInput === "string") {
      return new Date(dateInput);
    }
    return new Date(dateInput.$date);
  };

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
          if ((import.meta as any).env?.DEV) console.debug("No parcel ID provided");
        
        setMissingId(true);
        setIsLoading(false);
        toast.error("No parcel ID provided. Please provide a tracking id in the URL (e.g. ?id=TRACKING_ID)");
        return;
      }

      try {
        setIsLoading(true);
          if ((import.meta as any).env?.DEV) console.debug("Fetching status history for parcel ID:", parcelId);

        let response;
        let parcelData = null;

        try {
          if ((import.meta as any).env?.DEV) console.debug(`Trying endpoint: /parcels/track/${parcelId}`);
          response = await api.get(`/parcels/track/${parcelId}`);
          if ((import.meta as any).env?.DEV) console.debug("Track response:", response.data);
          parcelData = response.data.data || response.data;
        } catch (err) {
          if ((import.meta as any).env?.DEV) console.debug("Track endpoint failed:", err);
        }

        if (!parcelData) {
          const looksLikeObjectId = typeof parcelId === 'string' && /^[0-9a-fA-F]{24}$/.test(parcelId);
          if (looksLikeObjectId) {
            try {
              if ((import.meta as any).env?.DEV) console.debug(`Trying endpoint: /parcels/${parcelId}/status-log`);
              response = await api.get(`/parcels/${parcelId}/status-log`);
              if ((import.meta as any).env?.DEV) console.debug("Status-log response:", response.data);
              parcelData = response.data.data;
            } catch (err) {
              if ((import.meta as any).env?.DEV) console.debug("Status-log endpoint failed:", err);
            }
          }
        }

        if (!parcelData) {
          try {
              if ((import.meta as any).env?.DEV) console.debug("Trying to find parcel in sender list");
            response = await api.get("/parcels/me?limit=1000");
              if ((import.meta as any).env?.DEV) console.debug("Sender parcels response:", response.data);
            const allParcels = response.data.data || [];
            parcelData = allParcels.find(
              (p: any) =>
                p.trackingId === parcelId || p.trackingNumber === parcelId
            );
              if ((import.meta as any).env?.DEV) console.debug("Found parcel in list:", parcelData);
          } catch (err) {
              if ((import.meta as any).env?.DEV) console.debug("Sender parcels endpoint failed:", err);
          }
        }

        if (parcelData) {
            if ((import.meta as any).env?.DEV) console.debug("Successfully found parcel data:", parcelData);

          if (
            !parcelData.statusHistory ||
            !Array.isArray(parcelData.statusHistory)
          ) {
              if ((import.meta as any).env?.DEV) console.debug("No status history found, creating default entry");
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
            if ((import.meta as any).env?.DEV) console.debug("No parcel data found");
          toast.error("Parcel not found or access denied");
        }
      } catch (error) {
          if ((import.meta as any).env?.DEV) console.debug("Error fetching parcel status history:", error);
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
        return <Shield className="h-5 w-5 text-emerald-600" />;
      case "dispatched":
        return <Navigation className="h-5 w-5 text-purple-600" />;
      case "in_transit":
      case "in-transit":
        return <Truck className="h-5 w-5 text-amber-600" />;
      case "delivered":
        return <Star className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600";
      case "approved":
        return "bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600";
      case "dispatched":
        return "bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600";
      case "in_transit":
      case "in-transit":
        return "bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600";
      case "delivered":
        return "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-600";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-600";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading Status History
          </h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your parcel details...
          </p>
        </div>
      </div>
    );
  }

  if (missingId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="bg-background rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border border-border">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No Tracking ID</h2>
          <p className="text-muted-foreground mb-4">
            This page expects a tracking id query parameter (eg. <code>?id=TRACKING_ID</code>). You can track a parcel from the <strong>Track</strong> page.
          </p>
          <Link to="/track" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg">
            Back to Track
          </Link>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-background rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border border-border">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Parcel Not Found
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We couldn't find the specified parcel or you don't have access to
            view its status history.
          </p>
          <Link
            to="/track"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="mb-8">
          <Link
            to="/track"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Tracking
          </Link>
          <div className="relative overflow-hidden bg-background rounded-2xl shadow-xl border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
            <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          Parcel Status History
                        </h1>
                        <p className="text-muted-foreground mt-1">
                          Real-time tracking for{" "}
                          {parcel.trackingId || parcel.trackingNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                          <div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              Status Updates
                            </p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                              {parcel.statusHistory?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          <div>
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Last Updated
                            </p>
                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
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
                                  const dateInfo = formatDetailedDate(
                                    latest.timestamp
                                  );
                                  return (
                                    dateInfo.relativeTime ||
                                    dateInfo.formattedTime
                                  );
                                }
                                return "N/A";
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              parcel.currentStatus
                            )}`}
                          >
                            {getStatusIcon(parcel.currentStatus)}
                            <span className="ml-2">
                              {parcel.currentStatus
                                ?.replace(/[-_]/g, " ")
                                .toUpperCase() || "UNKNOWN"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-background rounded-2xl shadow-lg border border-border mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-muted/50 to-blue-50/50 dark:from-muted/20 dark:to-blue-950/20 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Parcel Details & Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Package Information
                  </h3>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="font-medium text-foreground text-sm">
                        Tracking ID:
                      </span>
                      <div className="mt-1 p-2 bg-background rounded border border-border font-mono text-blue-600 dark:text-blue-400 font-medium">
                        {parcel.trackingId || parcel.trackingNumber}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-foreground text-sm">
                        Current Status:
                      </span>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(
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
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="font-medium text-foreground text-sm">
                              Type:
                            </span>
                            <p className="mt-1 capitalize bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                              {parcel.parcelDetails.type}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-sm">
                              Weight:
                            </span>
                            <p className="mt-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm font-medium">
                              {parcel.parcelDetails.weight} kg
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-foreground text-sm">
                            Estimated Value:
                          </span>
                          <p className="mt-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 px-3 py-2 rounded font-bold">
                            ৳{parcel.parcelDetails.value.toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Contact Details
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium text-green-800 dark:text-green-300">
                          Sender
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          {parcel.senderInfo?.name || parcel.senderName}
                        </p>
                        {parcel.senderInfo?.phone && (
                          <p className="text-muted-foreground flex items-center">
                            <PhoneCall className="h-3 w-3 mr-1" />
                            {parcel.senderInfo.phone}
                          </p>
                        )}
                        {parcel.senderInfo?.email && (
                          <p className="text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {parcel.senderInfo.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-blue-800 dark:text-blue-300">
                          Receiver
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          {parcel.receiverInfo?.name || parcel.recipientName}
                        </p>
                        {parcel.receiverInfo?.phone && (
                          <p className="text-muted-foreground flex items-center">
                            <PhoneCall className="h-3 w-3 mr-1" />
                            {parcel.receiverInfo.phone}
                          </p>
                        )}
                        {parcel.receiverInfo?.email && (
                          <p className="text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {parcel.receiverInfo.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    Summary & Payment
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            Total Updates:
                          </span>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                            {parcel.statusHistory?.length || 0}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            Created:
                          </span>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            {(() => {
                              const createdInfo = formatDetailedDate(
                                parcel.createdAt
                              );
                              return (
                                createdInfo.relativeTime ||
                                createdInfo.formattedDate
                              );
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {parcel.fee && (
                      <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-700 dark:text-green-300 flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Payment Details
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              parcel.fee.isPaid
                                ? "bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                                : "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {parcel.fee.isPaid ? "✅ Paid" : "❌ Unpaid"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Fee:</span>
                            <span className="font-bold text-green-700 dark:text-green-300">
                              ৳{parcel.fee.totalFee.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Base Fee:</span>
                              <span>৳{parcel.fee.baseFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weight Fee:</span>
                              <span>৳{parcel.fee.weightFee}</span>
                            </div>
                            {parcel.fee.urgentFee > 0 && (
                              <div className="flex justify-between">
                                <span>Urgent Fee:</span>
                                <span>৳{parcel.fee.urgentFee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {parcel.deliveryInfo && (
                      <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <div className="flex items-center mb-2">
                          <Truck className="h-4 w-4 mr-1 text-orange-600 dark:text-orange-400" />
                          <span className="font-medium text-orange-700 dark:text-orange-300">
                            Delivery Info
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-foreground">
                            {parcel.deliveryInfo.deliveryInstructions}
                          </p>
                          {parcel.deliveryInfo.isUrgent && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300">
                                🚨 Urgent Delivery
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Detailed Status Timeline
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  <Star className="h-3 w-3 mr-1" />
                  {parcel.statusHistory.length} Updates
                </span>
              </h2>
            </div>

            <div className="p-6 bg-gradient-to-br from-muted/30 to-blue-50/30 dark:from-muted/10 dark:to-blue-950/10">
              {parcel.statusHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-muted/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">
                    No status history available
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Updates will appear here as your parcel moves
                  </p>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {parcel.statusHistory
                      .sort((a, b) => {
                        const dateA = extractDate(a.timestamp);
                        const dateB = extractDate(b.timestamp);
                        return dateB.getTime() - dateA.getTime(); 
                      })
                      .map((item, index) => (
                        <li key={index}>
                          <div className="relative pb-8">
                            {index !== parcel.statusHistory.length - 1 && (
                              <span
                                className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gradient-to-b from-blue-400 via-purple-300 to-muted-foreground/30 dark:from-blue-500 dark:via-purple-400 dark:to-muted/50"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-6">
                              {}
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-3 border-blue-300 dark:border-blue-600 shadow-lg ring-4 ring-blue-50 dark:ring-blue-950/30">
                                <div className="text-blue-600 dark:text-blue-400">
                                  {getStatusIcon(item.status)}
                                </div>
                              </div>

                              {}
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                                <div className="flex-1">
                                  <div className="bg-background rounded-xl p-4 shadow-md border border-border hover:shadow-lg transition-shadow duration-200">
                                    <div className="flex items-center space-x-3 mb-3">
                                      <span
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${getStatusColor(
                                          item.status
                                        )}`}
                                      >
                                        {item.status
                                          .replace(/[-_]/g, " ")
                                          .toUpperCase()}
                                      </span>
                                      {item.updatedByType && (
                                        <span
                                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            item.updatedByType === "system"
                                              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                                              : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                                          }`}
                                        >
                                          {item.updatedByType === "system"
                                            ? "🤖 Automated"
                                            : "👤 Manual"}
                                        </span>
                                      )}
                                      {index === 0 && (
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full border border-green-200 dark:border-green-700">
                                          ✨ Latest
                                        </span>
                                      )}
                                    </div>

                                    {item.note && (
                                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <p className="text-sm text-foreground">
                                          <Info className="h-4 w-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                                          <strong className="text-blue-800 dark:text-blue-300">
                                            Note:
                                          </strong>{" "}
                                          {item.note}
                                        </p>
                                      </div>
                                    )}

                                    {item.location && (
                                      <div className="mt-3 p-3 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-200 dark:border-red-700">
                                        <p className="text-sm text-foreground flex items-center">
                                          <MapPin className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                                          <strong className="text-red-700 dark:text-red-300">
                                            Location:
                                          </strong>
                                          <span className="ml-2 font-medium">
                                            {item.location}
                                          </span>
                                        </p>
                                      </div>
                                    )}

                                    {item.updatedBy && (
                                      <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground flex items-center">
                                          <User className="h-3 w-3 mr-1" />
                                          <strong>Updated by:</strong>
                                          <span className="ml-1 font-medium">
                                            {item.updatedBy}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {}
                                <div className="whitespace-nowrap text-right">
                                  {(() => {
                                    const dateInfo = formatDetailedDate(
                                      item.timestamp
                                    );
                                    return (
                                      <div className="bg-background rounded-xl p-4 shadow-md border border-border min-w-[160px]">
                                        <div className="space-y-2">
                                          <div className="font-semibold text-foreground text-sm flex items-center">
                                            <Calendar className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                                            {dateInfo.formattedDate}
                                          </div>
                                          <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                            {dateInfo.formattedTime}
                                          </div>
                                          {dateInfo.relativeTime && (
                                            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                              {dateInfo.relativeTime}
                                            </div>
                                          )}
                                        </div>
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

          {}
          <div className="mt-8 flex justify-center">
            <Link
              to="/track"
              className="group bg-gradient-to-r from-red-600 to-red-600 dark:from-red-700 dark:to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-700 dark:hover:from-red-800 dark:hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-semibold"
            >
              <ExternalLink className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent mx-auto mb-4 shadow-lg" />
            <p className="text-muted-foreground font-medium">
              Loading parcel details...
            </p>
          </div>
        </div>
      }
    >
      {ParcelStatusHistoryContent()}
    </Suspense>
  );
}

