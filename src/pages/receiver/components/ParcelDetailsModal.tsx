import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../utils/HelperUtilities";
import { Parcel } from "../../../types/GlobalTypeDefinitions";
import RatingStars from "./RatingStars";
import StatusBadge from "./StatusBadge";
import StatusHistoryView from "./StatusHistoryView";

interface ParcelDetailsModalProps {
  parcel: Parcel | null;
  onClose: () => void;
  onConfirmDelivery: (parcelId: string, note?: string) => void;
  isConfirming: boolean;
}

const ParcelDetailsModal: React.FC<ParcelDetailsModalProps> = ({
  parcel,
  onClose,
  onConfirmDelivery,
  isConfirming,
}) => {
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");

  if (!parcel) {
    return null;
  }

  const handleRateParcel = (rating: number) => {
    toast.success(`Thank you for rating ${rating} stars!`);
    
  };

  const isPreferredDateInPast = () => {
    if (!parcel.deliveryInfo?.preferredDeliveryDate) return false;
    const preferredDate = new Date(parcel.deliveryInfo.preferredDeliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return preferredDate < today;
  };

  const handleConfirmDeliveryClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDeliverySubmit = () => {
    
    if (parcel.deliveryInfo?.preferredDeliveryDate) {
      const preferredDate = new Date(parcel.deliveryInfo.preferredDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (preferredDate < today) {
        
        toast(
          "⚠️ Note: This parcel has a past preferred delivery date. Proceeding with confirmation...",
          {
            icon: "⚠️",
            duration: 4000,
          }
        );
      }
    }

    onConfirmDelivery(parcel._id, deliveryNote.trim() || undefined);
    setShowConfirmDialog(false);
    setDeliveryNote("");
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setDeliveryNote("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={(e) => {
        
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-border bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20">
          <div className="flex-1 min-w-0 mr-3">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-foreground truncate">
              Parcel Details - #{parcel.trackingId}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              Complete information about your package
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                Status Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <StatusBadge status={parcel.currentStatus} />
                  {parcel.parcelDetails?.value && (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      Insured Package
                    </span>
                  )}
                </div>
                {parcel.deliveryInfo?.preferredDeliveryDate &&
                  parcel.currentStatus !== "delivered" && (
                    <div
                      className={`flex items-center gap-2 text-xs sm:text-sm ${
                        isPreferredDateInPast()
                          ? "text-red-600 dark:text-red-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {isPreferredDateInPast() ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">⚠️</span>
                          <span className="break-words">
                            Past delivery date:{" "}
                            {formatDate(
                              parcel.deliveryInfo.preferredDeliveryDate
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="break-words">
                            Expected:{" "}
                            {formatDate(
                              parcel.deliveryInfo.preferredDeliveryDate
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                Tracking Number
              </h3>
              <div className="bg-gradient-to-r from-muted/50 to-muted rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
                <p className="font-mono text-base xs:text-lg sm:text-xl text-foreground font-bold break-all">
                  #{parcel.trackingId}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Use this number to track your package
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 sm:p-5 lg:p-6 border border-blue-200 dark:border-blue-800/30">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                Sender Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium text-xs sm:text-sm break-words">
                    {parcel.senderInfo?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm break-all">
                    {parcel.senderInfo?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    {parcel.senderInfo?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {parcel.senderInfo?.address ? (
                      <>
                        <div>{parcel.senderInfo.address.street}</div>
                        <div>
                          {parcel.senderInfo.address.city},{" "}
                          {parcel.senderInfo.address.state}{" "}
                          {parcel.senderInfo.address.zipCode}
                        </div>
                        <div>{parcel.senderInfo.address.country}</div>
                      </>
                    ) : (
                      <div>Address not available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 sm:p-5 lg:p-6 border border-green-200 dark:border-green-800/30">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                Receiver Information (You)
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground font-medium text-xs sm:text-sm break-words">
                    {parcel.receiverInfo?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm break-all">
                    {parcel.receiverInfo?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    {parcel.receiverInfo?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {parcel.receiverInfo?.address ? (
                      <>
                        <div>{parcel.receiverInfo.address.street}</div>
                        <div>
                          {parcel.receiverInfo.address.city},{" "}
                          {parcel.receiverInfo.address.state}{" "}
                          {parcel.receiverInfo.address.zipCode}
                        </div>
                        <div>{parcel.receiverInfo.address.country}</div>
                      </>
                    ) : (
                      <div>Address not available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              Package Information
            </h3>
            <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-purple-200 dark:border-purple-800/30">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                <div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Type
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-0.5">
                    {parcel.parcelDetails?.type || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Weight
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-0.5">
                    {parcel.parcelDetails?.weight || "N/A"} kg
                  </p>
                </div>
                <div className="xs:col-span-2 lg:col-span-1">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Dimensions
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-0.5 break-words">
                    {parcel.parcelDetails?.dimensions
                      ? `${parcel.parcelDetails.dimensions.length} × ${parcel.parcelDetails.dimensions.width} × ${parcel.parcelDetails.dimensions.height} cm`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Delivery Cost
                  </span>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">
                    ৳{parcel.fee?.totalFee || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Delivery Type
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-0.5">
                    {parcel.deliveryInfo?.isUrgent ? "Urgent" : "Standard"}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Insurance
                  </span>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-0.5">
                    {parcel.parcelDetails?.value
                      ? "✅ Protected"
                      : "❌ Not Insured"}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-purple-200 dark:border-purple-700">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Description
                </span>
                <p className="text-foreground mt-1 text-xs sm:text-sm break-words">
                  {parcel.parcelDetails?.description ||
                    "No description available"}
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4 sm:p-5 lg:p-6 border border-orange-200 dark:border-orange-800/30">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-600" />
              Delivery Information
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {parcel.deliveryInfo?.preferredDeliveryDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    Preferred Delivery:
                  </span>
                  <span className="text-foreground font-medium text-xs sm:text-sm">
                    {formatDate(parcel.deliveryInfo.preferredDeliveryDate)}
                  </span>
                </div>
              )}
              {parcel.deliveryInfo?.isUrgent && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-500 font-medium text-xs sm:text-sm">
                    Urgent Delivery
                  </span>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="bg-muted/50 rounded-lg p-4 sm:p-5 lg:p-6 border border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Created:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {formatDate(parcel.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">
                  Last Updated:
                </span>
                <span className="text-foreground font-medium text-xs sm:text-sm">
                  {formatDate(parcel.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                Sender Information
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-muted-foreground">
                      Name:
                    </span>
                    <span className="text-foreground break-words">
                      {parcel.senderInfo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-muted-foreground">
                      Email:
                    </span>
                    <span className="text-foreground break-all">
                      {parcel.senderInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-muted-foreground">
                      Phone:
                    </span>
                    <span className="text-foreground">
                      {parcel.senderInfo.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Delivery Address
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-medium text-foreground">
                      {parcel.receiverInfo.address.street}
                    </p>
                    <p className="text-muted-foreground">
                      {parcel.receiverInfo.address.city},{" "}
                      {parcel.receiverInfo.address.state}{" "}
                      {parcel.receiverInfo.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          {parcel.currentStatus === "delivered" && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                Service Rating
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 dark:border-yellow-800">
                {(parcel as any).rating ? (
                  <div className="flex items-center gap-3">
                    <RatingStars rating={(parcel as any).rating} />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Thank you for your feedback!
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-2 sm:py-4">
                    <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
                      How was your delivery experience?
                    </p>
                    <div className="flex justify-center">
                      <RatingStars
                        interactive={true}
                        onRate={handleRateParcel}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          <div className="border-t border-border pt-4 sm:pt-6">
            <button
              onClick={() => setShowStatusHistory(!showStatusHistory)}
              className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-foreground text-sm sm:text-base">
                  View Delivery Timeline
                </span>
              </div>
              {showStatusHistory ? (
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>

            {showStatusHistory && (
              <div className="mt-3 sm:mt-4">
                <StatusHistoryView parcel={parcel as any} />
              </div>
            )}
          </div>

          {}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Close
            </button>
            {parcel.currentStatus === "in-transit" && (
              <button
                onClick={handleConfirmDeliveryClick}
                disabled={isConfirming}
                className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              >
                {isConfirming ? "Confirming..." : "🎉 Confirm Delivery"}
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[60]">
          <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl max-w-md w-full shadow-2xl border border-border">
            <div className="p-4 sm:p-5 lg:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                <span>Confirm Delivery Receipt</span>
              </h3>

              <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
                Are you sure you want to confirm receipt of parcel{" "}
                <strong className="text-foreground break-all">#{parcel.trackingId}</strong>?
              </p>

              {isPreferredDateInPast() && (
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
                    <span className="flex-shrink-0">⚠️</span>
                    <span className="text-xs sm:text-sm font-medium">
                      Note: This parcel has a past preferred delivery date. You
                      may still confirm delivery.
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Add a note (optional):
                </label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g., Package received in excellent condition"
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground resize-none text-xs sm:text-sm"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-[10px] xs:text-xs text-muted-foreground mt-1">
                  {deliveryNote.length}/200 characters
                </p>
              </div>

              <div className="flex flex-col-reverse xs:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeliverySubmit}
                  disabled={isConfirming}
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                >
                  {isConfirming ? "Confirming..." : "✅ Confirm Receipt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelDetailsModal;

