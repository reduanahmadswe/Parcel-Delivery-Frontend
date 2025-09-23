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
    // Here you would typically update the parcel rating via API
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
    // Check if there might be validation issues
    if (parcel.deliveryInfo?.preferredDeliveryDate) {
      const preferredDate = new Date(parcel.deliveryInfo.preferredDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison

      if (preferredDate < today) {
        // Show warning but still allow confirmation
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-red-600 dark:from-red-900 dark:to-red-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Parcel Details - #{parcel.trackingId}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Complete information about your package
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status and Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Status Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status={parcel.currentStatus} />
                  {parcel.parcelDetails?.value && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      <Shield className="w-3 h-3" />
                      Insured Package
                    </span>
                  )}
                </div>
                {parcel.deliveryInfo?.preferredDeliveryDate &&
                  parcel.currentStatus !== "delivered" && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isPreferredDateInPast()
                          ? "text-red-600 dark:text-red-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {isPreferredDateInPast() ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">⚠️</span>
                          <span>
                            Past delivery date:{" "}
                            {formatDate(
                              parcel.deliveryInfo.preferredDeliveryDate
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tracking Number
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border">
                <p className="font-mono text-xl text-gray-900 dark:text-white font-bold">
                  #{parcel.trackingId}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use this number to track your package
                </p>
              </div>
            </div>
          </div>

          {/* Sender and Receiver Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sender Information */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Sender Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {parcel.senderInfo?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {parcel.senderInfo?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {parcel.senderInfo?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="text-gray-600 dark:text-gray-400">
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

            {/* Receiver Information */}
            <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Receiver Information (You)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {parcel.receiverInfo?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {parcel.receiverInfo?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {parcel.receiverInfo?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div className="text-gray-600 dark:text-gray-400">
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

          {/* Package Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Package Information
            </h3>
            <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Type
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.parcelDetails?.type || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Weight
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.parcelDetails?.weight || "N/A"} kg
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Dimensions
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.parcelDetails?.dimensions
                      ? `${parcel.parcelDetails.dimensions.length} × ${parcel.parcelDetails.dimensions.width} × ${parcel.parcelDetails.dimensions.height} cm`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Delivery Cost
                  </span>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${parcel.fee?.totalFee || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Delivery Type
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.deliveryInfo?.isUrgent ? "Urgent" : "Standard"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Insurance
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.parcelDetails?.value
                      ? "✅ Protected"
                      : "❌ Not Insured"}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Description
                </span>
                <p className="text-gray-900 dark:text-white mt-1">
                  {parcel.parcelDetails?.description ||
                    "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Delivery Information
            </h3>
            <div className="space-y-3">
              {parcel.deliveryInfo?.preferredDeliveryDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Preferred Delivery:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatDate(parcel.deliveryInfo.preferredDeliveryDate)}
                  </span>
                </div>
              )}
              {parcel.deliveryInfo?.isUrgent && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">
                    Urgent Delivery
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Created:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatDate(parcel.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatDate(parcel.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Sender and Delivery Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Sender Information
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Name:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {parcel.senderInfo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {parcel.senderInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {parcel.senderInfo.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Delivery Address
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {parcel.receiverInfo.address.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {parcel.receiverInfo.address.city},{" "}
                      {parcel.receiverInfo.address.state}{" "}
                      {parcel.receiverInfo.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section for Delivered Packages */}
          {parcel.currentStatus === "delivered" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Service Rating
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                {(parcel as any).rating ? (
                  <div className="flex items-center gap-3">
                    <RatingStars rating={(parcel as any).rating} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Thank you for your feedback!
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
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

          {/* Status History Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={() => setShowStatusHistory(!showStatusHistory)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  View Delivery Timeline
                </span>
              </div>
              {showStatusHistory ? (
                <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>

            {showStatusHistory && (
              <div className="mt-4">
                <StatusHistoryView parcel={parcel as any} />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            {parcel.currentStatus === "in-transit" && (
              <button
                onClick={handleConfirmDeliveryClick}
                disabled={isConfirming}
                className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              >
                {isConfirming ? "Confirming..." : "🎉 Confirm Delivery"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-green-600" />
                Confirm Delivery Receipt
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to confirm receipt of parcel{" "}
                <strong>#{parcel.trackingId}</strong>?
              </p>

              {isPreferredDateInPast() && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <span>⚠️</span>
                    <span className="text-sm font-medium">
                      Note: This parcel has a past preferred delivery date. You
                      may still confirm delivery.
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add a note (optional):
                </label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g., Package received in excellent condition"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {deliveryNote.length}/200 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeliverySubmit}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
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

