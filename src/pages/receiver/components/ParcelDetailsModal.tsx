import {
  Bell,
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
import React from "react";
import { toast } from "react-hot-toast";
import { Parcel } from "../types";
import RatingStars from "./RatingStars";
import StatusBadge from "./StatusBadge";

interface ParcelDetailsModalProps {
  parcel: Parcel | null;
  onClose: () => void;
  onConfirmDelivery: (parcelId: number) => void;
  isConfirming: boolean;
}

const ParcelDetailsModal: React.FC<ParcelDetailsModalProps> = ({
  parcel,
  onClose,
  onConfirmDelivery,
  isConfirming,
}) => {
  if (!parcel) return null;

  const handleRateParcel = (rating: number) => {
    toast.success(`Thank you for rating ${rating} stars!`);
    // Here you would typically update the parcel rating via API
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Parcel Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Complete information about your package
            </p>
          </div>
          <button
            onClick={onClose}
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
                  <StatusBadge status={parcel.status} />
                  {parcel.isInsured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      <Shield className="w-3 h-3" />
                      Insured Package
                    </span>
                  )}
                </div>
                {parcel.estimatedDelivery && parcel.status !== "delivered" && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <Truck className="h-4 w-4" />
                    <span>
                      Expected:{" "}
                      {new Date(parcel.estimatedDelivery).toLocaleDateString()}
                    </span>
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
                  #{parcel.trackingNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use this number to track your package
                </p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Package Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Type
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.type}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Weight
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.weight} kg
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Dimensions
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.dimensions.length} × {parcel.dimensions.width} ×{" "}
                    {parcel.dimensions.height} cm
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Delivery Cost
                  </span>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${parcel.cost}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Delivery Type
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.deliveryType}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Insurance
                  </span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {parcel.isInsured ? "✅ Protected" : "❌ Not Insured"}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Description
                </span>
                <p className="text-gray-900 dark:text-white mt-1">
                  {parcel.description}
                </p>
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
                      {parcel.senderName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {parcel.senderEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {parcel.senderPhone}
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
                      {parcel.recipientAddress.street}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {parcel.recipientAddress.city},{" "}
                      {parcel.recipientAddress.state}{" "}
                      {parcel.recipientAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section for Delivered Packages */}
          {parcel.status === "delivered" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Service Rating
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                {parcel.rating ? (
                  <div className="flex items-center gap-3">
                    <RatingStars rating={parcel.rating} />
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            {parcel.status === "out_for_delivery" && (
              <button
                onClick={() => onConfirmDelivery(parcel.id)}
                disabled={isConfirming}
                className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              >
                {isConfirming ? "Confirming..." : "🎉 Confirm Delivery"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetailsModal;
