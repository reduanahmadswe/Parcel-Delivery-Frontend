import {
  Calendar,
  CheckCircle2,
  Eye,
  Package,
  Shield,
  Truck,
  User,
} from "lucide-react";
import React from "react";
import { Parcel } from "../types";
import RatingStars from "./RatingStars";
import StatusBadge from "./StatusBadge";

interface ParcelListProps {
  parcels: Parcel[];
  onViewDetails: (parcel: Parcel) => void;
  onConfirmDelivery: (parcelId: number) => void;
  isConfirming: boolean;
}

const ParcelList: React.FC<ParcelListProps> = ({
  parcels,
  onViewDetails,
  onConfirmDelivery,
  isConfirming,
}) => {
  if (parcels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            Your Parcels
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No parcels found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5" />
          Your Parcels
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({parcels.length} parcels)
          </span>
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {parcels.map((parcel, index) => (
          <div
            key={parcel.id}
            className={`px-6 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
              index % 2 === 0 ? "bg-gray-50/30 dark:bg-gray-800/30" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                        #{parcel.trackingNumber}
                      </h3>
                      <StatusBadge status={parcel.status} />
                      {parcel.isInsured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          <Shield className="w-3 h-3" />
                          Insured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3 text-base">
                      {parcel.description}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">From:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {parcel.senderName}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Package className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Weight:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {parcel.weight}kg
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="text-lg mr-2">💰</span>
                        <span className="font-medium">Cost:</span>
                        <span className="ml-1 text-gray-900 dark:text-white font-bold">
                          ${parcel.cost}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="font-medium">Created:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {parcel.estimatedDelivery &&
                      parcel.status !== "delivered" && (
                        <div className="mt-3 flex items-center text-sm text-orange-600 dark:text-orange-400">
                          <Truck className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            Estimated Delivery:
                          </span>
                          <span className="ml-1">
                            {new Date(
                              parcel.estimatedDelivery
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                    {parcel.rating && parcel.status === "delivered" && (
                      <div className="mt-3">
                        <RatingStars rating={parcel.rating} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => onViewDetails(parcel)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    {parcel.status === "out_for_delivery" && (
                      <button
                        onClick={() => onConfirmDelivery(parcel.id)}
                        disabled={isConfirming}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isConfirming ? "Confirming..." : "Confirm Delivery"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParcelList;
