"use client";

import { formatDate, getStatusColor } from "../../../utils/HelperUtilities";
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
      <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border p-4 sm:p-5 lg:p-6">
        <div className="text-center text-muted-foreground">
          <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
          <p className="text-xs sm:text-sm">Select a parcel to view its complete delivery timeline</p>
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
    const currentStatus = (parcel as any).currentStatus || parcel.status || '';
    return status.toLowerCase() === currentStatus.toLowerCase();
  };

  const sortedHistory: any[] = []; 

  const createMockHistory = () => {
    const currentStatus = ((parcel as any).currentStatus || parcel.status || 'pending').toLowerCase();

    const allStatuses = [
      "requested", 
      "approved", 
      "dispatched", 
      "in-transit", 
      "out-for-delivery",
      "delivered"
    ];

    let currentIndex = allStatuses.findIndex(s => 
      currentStatus.includes(s) || s.includes(currentStatus)
    );

    if (currentIndex === -1) {
      if (currentStatus.includes('transit') || currentStatus.includes('dispatch')) {
        currentIndex = 3; 
      } else if (currentStatus.includes('deliver')) {
        currentIndex = 5; 
      } else if (currentStatus.includes('pending') || currentStatus.includes('request')) {
        currentIndex = 0; 
      } else if (currentStatus.includes('approved')) {
        currentIndex = 1; 
      } else {
        currentIndex = 0; 
      }
    }

    const relevantStatuses = allStatuses.slice(0, currentIndex + 1);
    
    return relevantStatuses.map((status, index) => ({
      status,
      timestamp: new Date(
        Date.now() - (relevantStatuses.length - index) * 24 * 60 * 60 * 1000
      ).toISOString(),
      note: `Parcel ${status.replace("_", " ").replace("-", " ")}`,
      updatedBy: status === "requested" ? "System" : "Delivery Team",
    }));
  };

  const displayHistory = parcel ? createMockHistory() : [];

  return (
    <div className="bg-background rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-border">
      {}
      <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl text-white flex-shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base xs:text-lg sm:text-xl font-bold text-foreground truncate">
              Delivery Timeline
            </h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">
              Track ID: {(parcel as any).trackingId || parcel.trackingNumber || 'N/A'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
          >
            <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>

      {}
      <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-border">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground font-medium">
              From:
            </span>
            <p className="text-foreground font-semibold break-words">
              {(parcel as any).senderInfo?.name || parcel.senderName || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">
              Type:
            </span>
            <p className="text-foreground capitalize">
              {(parcel as any).parcelDetails?.type || parcel.type || 'N/A'}
            </p>
          </div>
          <div className="xs:col-span-2 md:col-span-1">
            <span className="text-muted-foreground font-medium">
              Current Status:
            </span>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(
                  (parcel as any).currentStatus || parcel.status || 'pending'
                ).replace("text-", "bg-")}`}
              ></div>
              <span
                className={`font-semibold capitalize ${getStatusColor(
                  (parcel as any).currentStatus || parcel.status || 'pending'
                )}`}
              >
                {((parcel as any).currentStatus || parcel.status || 'pending').replace("_", " ").replace("-", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
          {displayHistory.length > 0 ? (
            displayHistory.map((historyItem, index) => {
              const StepIcon = getStepIcon(historyItem.status);
              const isStepCompleted = isCompleted(historyItem.status);
              const isStepCurrent = isCurrent(historyItem.status);
              const timestamp = historyItem.timestamp;

              return (
                <div
                  key={index}
                  className={`relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                    isStepCurrent
                      ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {}
                  {index < displayHistory.length - 1 && (
                    <div
                      className={`absolute left-5 sm:left-6 lg:left-7 top-12 sm:top-14 w-0.5 h-6 sm:h-8 ${
                        isStepCompleted
                          ? "bg-green-300 dark:bg-green-700"
                          : "bg-border"
                      }`}
                    />
                  )}

                  {}
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      isStepCurrent
                        ? "bg-blue-500 text-white"
                        : isStepCompleted
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <StepIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>

                  {}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 mb-1">
                      <h4
                        className={`font-semibold capitalize text-sm sm:text-base ${
                          isStepCurrent
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-foreground"
                        }`}
                      >
                        {historyItem.status.replace("_", " ").replace("-", " ")}
                      </h4>
                      <span className="text-[10px] xs:text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(timestamp)}
                      </span>
                    </div>

                    {historyItem.note && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                        {historyItem.note}
                      </p>
                    )}

                    {historyItem.updatedBy && (
                      <div className="flex items-center gap-1">
                        <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-[10px] xs:text-xs text-muted-foreground">
                          Updated by {historyItem.updatedBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-6 sm:py-8">
              <Clock className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="text-xs sm:text-sm">No status history available</p>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-muted/50 rounded-b-lg sm:rounded-b-xl lg:rounded-b-2xl border-t border-border">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Total Updates: {displayHistory.length}
          </span>
          {displayHistory.length > 0 && (
            <span className="text-muted-foreground">
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

