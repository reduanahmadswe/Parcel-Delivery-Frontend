"use client";

import { formatDate, getStatusColor } from "@/utils/HelperUtilities";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import React from "react";
import { Parcel } from "../types";

interface StatusHistoryViewProps {
  parcel: Parcel | null;
  onClose?: () => void;
}

const StatusHistoryView: React.FC<StatusHistoryViewProps> = ({
  parcel,
  onClose,
}) => {
  if (!parcel) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select a parcel to view its complete delivery timeline</p>
        </div>
      </div>
    );
  }

  const getStepIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "requested":
        return Clock;
      case "approved":
      case "picked-up":
        return CheckCircle;
      case "dispatched":
      case "in-transit":
        return Truck;
      case "out_for_delivery":
      case "out-for-delivery":
        return MapPin;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Package;
    }
  };

  const isCompleted = (status: string) => {
    return [
      "approved",
      "picked-up",
      "dispatched",
      "in-transit",
      "out-for-delivery",
      "delivered",
    ].includes(status.toLowerCase());
  };

  const isCurrent = (status: string) => {
    return status.toLowerCase() === parcel.status?.toLowerCase();
  };

  const sortedHistory: any[] = []; // For now, we'll create mock data since statusHistory is not in receiver type

  // Create a mock status history based on current status for demonstration
  const createMockHistory = () => {
    const statuses = ["pending", "approved", "dispatched", "in-transit"];
    const currentIndex = statuses.indexOf(parcel.status);

    return statuses.slice(0, currentIndex + 1).map((status, index) => ({
      status,
      timestamp: new Date(
        Date.now() - (statuses.length - index) * 24 * 60 * 60 * 1000
      ).toISOString(),
      note: `Parcel ${status.replace("_", " ").replace("-", " ")}`,
      updatedBy: status === "pending" ? "System" : "Delivery Team",
    }));
  };

  const displayHistory = parcel ? createMockHistory() : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Delivery Timeline
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track ID: {parcel.trackingNumber}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Parcel Summary */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              From:
            </span>
            <p className="text-gray-900 dark:text-white font-semibold">
              {parcel.senderName}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Type:
            </span>
            <p className="text-gray-900 dark:text-white capitalize">
              {parcel.type}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Current Status:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  parcel.status
                ).replace("text-", "bg-")}`}
              ></div>
              <span
                className={`font-semibold capitalize ${getStatusColor(
                  parcel.status
                )}`}
              >
                {parcel.status.replace("_", " ").replace("-", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {displayHistory.length > 0 ? (
            displayHistory.map((historyItem, index) => {
              const StepIcon = getStepIcon(historyItem.status);
              const isStepCompleted = isCompleted(historyItem.status);
              const isStepCurrent = isCurrent(historyItem.status);
              const timestamp = historyItem.timestamp;

              return (
                <div
                  key={index}
                  className={`relative flex items-start gap-4 p-4 rounded-lg transition-all duration-200 ${
                    isStepCurrent
                      ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {/* Timeline line */}
                  {index < displayHistory.length - 1 && (
                    <div
                      className={`absolute left-7 top-14 w-0.5 h-8 ${
                        isStepCompleted
                          ? "bg-green-300"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}

                  {/* Status icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isStepCurrent
                        ? "bg-blue-500 text-white"
                        : isStepCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold capitalize ${
                          isStepCurrent
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {historyItem.status.replace("_", " ").replace("-", " ")}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(timestamp)}
                      </span>
                    </div>

                    {historyItem.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {historyItem.note}
                      </p>
                    )}

                    {historyItem.updatedBy && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updated by {historyItem.updatedBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No status history available</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with summary */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total Updates: {displayHistory.length}
          </span>
          {displayHistory.length > 0 && (
            <span className="text-gray-600 dark:text-gray-400">
              Last Updated:{" "}
              {formatDate(displayHistory[displayHistory.length - 1]?.timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryView;

